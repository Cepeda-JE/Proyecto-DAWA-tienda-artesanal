import { Injectable } from '@angular/core';
import { Opinion } from '../models/Opinion';

@Injectable({
  providedIn: 'root'
})
export class OpinionService {

  private opiniones: Opinion[] = [
    {
      id: 1, autor: 'María García', correo: 'maria@example.com',
      calificacion: 5, comentario: 'Excelente calidad, muy bonito el tejido.',
      fecha: '2025-04-10', idProducto: 1, nombreProducto: 'Bolso tejido a mano', aprobada: true
    },
    {
      id: 2, autor: 'Carlos Pérez', correo: 'carlos@example.com',
      calificacion: 4, comentario: 'Bonita camiseta, el bordado es muy detallado.',
      fecha: '2025-04-15', idProducto: 2, nombreProducto: 'Camiseta bordada', aprobada: true
    },
    {
      id: 3, autor: 'Lucía Torres', correo: 'lucia@example.com',
      calificacion: 5, comentario: 'Deliciosa mermelada, totalmente natural.',
      fecha: '2025-05-01', idProducto: 3, nombreProducto: 'Mermelada de mora artesanal', aprobada: false
    }
  ];

  private nextId = 4;

  getAll(): Opinion[] { return this.opiniones; }

  add(opinion: Opinion): Opinion {
    const nueva = { ...opinion, id: this.nextId++ };
    this.opiniones.push(nueva);
    return nueva;
  }

  update(opinion: Opinion): void {
    const index = this.opiniones.findIndex(o => o.id === opinion.id);
    if (index !== -1) this.opiniones[index] = opinion;
  }

  delete(id: number): void {
    this.opiniones = this.opiniones.filter(o => o.id !== id);
  }
}