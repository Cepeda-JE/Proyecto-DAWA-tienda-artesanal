import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Pedido } from '../models/Pedido';
import { ProductoService } from './producto.service';
import { CustomerService } from './Customer.service';

export interface ItemSimple {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private pedidosUrl = 'json/pedidos.json';
  private pedidos: Pedido[] = [];
  private nextId = 4;

  constructor(
    private http: HttpClient,
    private productoService: ProductoService,
    private customerService: CustomerService
  ) {}

  getPedidos(): Observable<Pedido[]> {
    if (this.pedidos.length > 0) {
      return new Observable(obs => {
        obs.next(this.pedidos);
        obs.complete();
      });
    }
    return this.http.get<Pedido[]>(this.pedidosUrl).pipe(
      map(data => {
        this.pedidos = data;
        this.nextId = Math.max(...data.map(p => p.id ?? 0)) + 1;
        return this.pedidos;
      })
    );
  }

  // Ahora usa ProductoService directamente
  getProductos(): Observable<ItemSimple[]> {
    return this.productoService.getProductos().pipe(
      map(productos => productos.map(p => ({
        id: p.id!,
        nombre: p.nombre
      })))
    );
  }

  // Ahora usa CustomerService directamente
  getClientes(): Observable<ItemSimple[]> {
    return this.customerService.getCustomers().pipe(
      map(clientes => clientes.map(c => ({
        id: c.id!,
        nombre: c.nombre + ' ' + c.apellido
      })))
    );
  }

  searchPedidos(termino: string): Observable<Pedido[]> {
    return new Observable(obs => {
      const resultado = this.pedidos.filter(p =>
        p.numeroPedido.toLowerCase().includes(termino.toLowerCase()) ||
        p.estado.toLowerCase().includes(termino.toLowerCase())
      );
      obs.next(resultado);
      obs.complete();
    });
  }

  addPedido(pedido: Pedido): Observable<Pedido> {
    return new Observable(obs => {
      const nuevo = { ...pedido, id: this.nextId++ };
      this.pedidos.push(nuevo);
      obs.next(nuevo);
      obs.complete();
    });
  }

  updatePedido(pedido: Pedido): Observable<Pedido> {
    return new Observable(obs => {
      const index = this.pedidos.findIndex(p => p.id === pedido.id);
      if (index !== -1) this.pedidos[index] = pedido;
      obs.next(pedido);
      obs.complete();
    });
  }

  deletePedido(id: number): Observable<void> {
    return new Observable(obs => {
      this.pedidos = this.pedidos.filter(p => p.id !== id);
      obs.next();
      obs.complete();
    });
  }
}