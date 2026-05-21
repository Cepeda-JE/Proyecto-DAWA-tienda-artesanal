import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendedorService } from '../../../services/vendedor';
import { Vendedor } from '../../../models/Vendedor';

@Component({
  selector: 'app-vendedor-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-lista.html',
  styleUrl: './vendedor-lista.css'
})
export class VendedorLista implements OnInit {
  vendedores: Vendedor[] = [];

  constructor(private vendedorService: VendedorService) {}

  ngOnInit(): void {
    this.vendedorService.getAll().subscribe(datos => {
      this.vendedorService.inicializar(datos);
      this.vendedores = this.vendedorService['vendedores'];
    });
  }

  getBadgeColor(categoria: string): string {
    const colores: Record<string, string> = {
      ropa: 'bg-primary',
      accesorios: 'bg-warning text-dark',
      alimentos: 'bg-success',
      otro: 'bg-secondary'
    };
    return colores[categoria] || 'bg-secondary';
  }
}