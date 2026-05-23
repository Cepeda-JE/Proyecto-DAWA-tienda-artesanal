import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Oferta } from '../models/Oferta';

@Injectable({
  providedIn: 'root'
})
export class OfertaService {

  private http = inject(HttpClient);
  private apiUrl = 'json/ofertas.json';
  private ofertas: Oferta[] = [];
  private nextId = 6;

  getOfertas(): Observable<Oferta[]> {
    if (this.ofertas.length > 0) {
      return new Observable(obs => {
        obs.next(this.ofertas);
        obs.complete();
      });
    }
    return this.http.get<{ ofertas: Oferta[] }>(this.apiUrl).pipe(
      map(data => {
        this.ofertas = data.ofertas;
        this.nextId = Math.max(...data.ofertas.map(o => o.id ?? 0)) + 1;
        return this.ofertas;
      })
    );
  }

  addOferta(oferta: Oferta): Oferta {
    const nueva = { ...oferta, id: this.nextId++ };
    this.ofertas.push(nueva);
    return nueva;
  }

  updateOferta(oferta: Oferta): void {
    const index = this.ofertas.findIndex(o => o.id === oferta.id);
    if (index !== -1) this.ofertas[index] = oferta;
  }

  deleteOferta(id: number): void {
    this.ofertas = this.ofertas.filter(o => o.id !== id);
  }

  getAll(): Oferta[] {
    return this.ofertas;
  }
}