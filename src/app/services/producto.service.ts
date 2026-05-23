import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Producto } from '../models/Producto';

// Interface simple para el combo de vendedores
export interface VendedorSimple {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productosUrl = 'json/productos.json';
  private vendedoresUrl = 'json/vendedores.json';

  private productos: Producto[] = [];
  private nextId = 6; 

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    if (this.productos.length > 0) {
      return new Observable(obs => {
        obs.next(this.productos);
        obs.complete();
      });
    }
    return this.http.get<Producto[]>(this.productosUrl).pipe(
      map(data => {
        this.productos = data;
        this.nextId = Math.max(...data.map(p => p.id ?? 0)) + 1;
        return this.productos;
      })
    );
  }

  getVendedores(): Observable<VendedorSimple[]> {
    return this.http.get<VendedorSimple[]>(this.vendedoresUrl);
  }

  searchProductos(termino: string): Observable<Producto[]> {
    return new Observable(obs => {
      const resultado = this.productos.filter(p =>
        p.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      obs.next(resultado);
      obs.complete();
    });
  }

  getProductoById(id: number): Observable<Producto | undefined> {
    return new Observable(obs => {
      obs.next(this.productos.find(p => p.id === id));
      obs.complete();
    });
  }

  addProducto(producto: Producto): Observable<Producto> {
    return new Observable(obs => {
      const nuevo = { ...producto, id: this.nextId++ };
      this.productos.push(nuevo);
      obs.next(nuevo);
      obs.complete();
    });
  }

  updateProducto(producto: Producto): Observable<Producto> {
    return new Observable(obs => {
      const index = this.productos.findIndex(p => p.id === producto.id);
      if (index !== -1) {
        this.productos[index] = producto;
      }
      obs.next(producto);
      obs.complete();
    });
  }

  deleteProducto(id: number): Observable<void> {
    return new Observable(obs => {
      this.productos = this.productos.filter(p => p.id !== id);
      obs.next();
      obs.complete();
    });
  }
}