import { Component, inject, signal } from '@angular/core';
import { Oferta } from '../../../models/Oferta';
import { OfertaService } from '../../../services/oferta.service';

@Component({
  selector: 'app-ofertas-lista',
  imports: [],
  templateUrl: './ofertas-lista.html',
  styleUrl: './ofertas-lista.css'
})
export class OfertasLista {

  ofertas = signal<Oferta[]>([]);
  servicio = inject(OfertaService);

  ngOnInit(): void {
    this.servicio.getOfertas().subscribe(data => {
      // Solo muestra ofertas activas
      this.ofertas.set(data.filter(o => o.activa));
    });
  }

  getBadgeTipo(tipo: string): string {
    const clases: Record<string, string> = {
      descuento: 'bg-primary',
      promocion: 'bg-warning text-dark',
      liquidacion: 'bg-danger',
      temporada: 'bg-success'
    };
    return clases[tipo] || 'bg-secondary';
  }
}