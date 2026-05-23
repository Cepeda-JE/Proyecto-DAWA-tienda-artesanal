import { Component, inject, signal } from '@angular/core';
import { Opinion } from '../../../models/Opinion';
import { OpinionService } from '../../../services/opinion.service';

@Component({
  selector: 'app-opiniones-lista',
  imports: [],
  templateUrl: './opiniones-lista.html',
  styleUrl: './opiniones-lista.css'
})
export class OpinionesLista {

  opiniones = signal<Opinion[]>([]);
  servicio = inject(OpinionService);

  ngOnInit(): void {
    // Solo muestra opiniones aprobadas
    this.opiniones.set(
      this.servicio.getAll().filter(o => o.aprobada)
    );
  }

  getEstrellas(cal: number): number[] {
    return Array(cal).fill(0);
  }

  getEstrellasVacias(cal: number): number[] {
    return Array(5 - cal).fill(0);
  }
}