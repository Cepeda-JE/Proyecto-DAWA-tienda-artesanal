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

  // Rutas a los JSON locales (sin json-server)
  private productosUrl = 'json/productos.json';
  private vendedoresUrl = 'json/vendedores.json';

  // Lista en memoria (aquí guardamos cambios)
  private productos: Producto[] = [];
  private nextId = 6; // siguiente ID disponible

  constructor(private http: HttpClient) {}

  // ─── LEER ───────────────────────────────────────────
  getProductos(): Observable<Producto[]> {
    // Si ya cargamos los datos, los devolvemos de memoria
    if (this.productos.length > 0) {
      return new Observable(obs => {
        obs.next(this.productos);
        obs.complete();
      });
    }
    // Primera vez: leemos el JSON
    return this.http.get<Producto[]>(this.productosUrl).pipe(
      map(data => {
        this.productos = data;
        this.nextId = Math.max(...data.map(p => p.id ?? 0)) + 1;
        return this.productos;
      })
    );
  }

  // Obtener vendedores para el combo
  getVendedores(): Observable<VendedorSimple[]> {
    return this.http.get<VendedorSimple[]>(this.vendedoresUrl);
  }

  // Buscar productos por nombre
  searchProductos(termino: string): Observable<Producto[]> {
    return new Observable(obs => {
      const resultado = this.productos.filter(p =>
        p.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      obs.next(resultado);
      obs.complete();
    });
  }

  // Obtener un producto por ID
  getProductoById(id: number): Observable<Producto | undefined> {
    return new Observable(obs => {
      obs.next(this.productos.find(p => p.id === id));
      obs.complete();
    });
  }

  // ─── CREAR ──────────────────────────────────────────
  addProducto(producto: Producto): Observable<Producto> {
    return new Observable(obs => {
      const nuevo = { ...producto, id: this.nextId++ };
      this.productos.push(nuevo);
      obs.next(nuevo);
      obs.complete();
    });
  }

  // ─── ACTUALIZAR ─────────────────────────────────────
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

  // ─── ELIMINAR ───────────────────────────────────────
  deleteProducto(id: number): Observable<void> {
    return new Observable(obs => {
      this.productos = this.productos.filter(p => p.id !== id);
      obs.next();
      obs.complete();
    });
  }
}