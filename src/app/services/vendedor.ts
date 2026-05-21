import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Vendedor } from '../models/Vendedor';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {
  private jsonUrl = 'json/vendedores.json';
  private vendedores: Vendedor[] = [];
  private loaded = false;

  constructor(private http: HttpClient) {}

  private cargarDatos(): Observable<Vendedor[]> {
    if (this.loaded) return of(this.vendedores);
    return this.http.get<Vendedor[]>(this.jsonUrl);
  }

  getAll(): Observable<Vendedor[]> {
    return this.cargarDatos();
  }

  getById(id: number): Vendedor | undefined {
    return this.vendedores.find(v => v.id === id);
  }

  create(vendedor: Vendedor): void {
    const nuevoId = this.vendedores.length > 0
      ? Math.max(...this.vendedores.map(v => v.id)) + 1
      : 1;
    this.vendedores.push({ ...vendedor, id: nuevoId });
  }

  update(vendedorActualizado: Vendedor): void {
    const index = this.vendedores.findIndex(v => v.id === vendedorActualizado.id);
    if (index !== -1) this.vendedores[index] = vendedorActualizado;
  }

  delete(id: number): void {
    this.vendedores = this.vendedores.filter(v => v.id !== id);
  }

  inicializar(datos: Vendedor[]): void {
    if (!this.loaded) {
      this.vendedores = datos;
      this.loaded = true;
    }
  }
}