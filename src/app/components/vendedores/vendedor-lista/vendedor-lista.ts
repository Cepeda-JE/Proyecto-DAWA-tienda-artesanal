import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Vendedor } from '../../../models/Vendedor';

@Component({
  selector: 'app-vendedor-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendedor-lista.html',
  styleUrl: './vendedor-lista.css'
})
export class VendedorListaComponent implements OnInit {
  vendedores: Vendedor[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Vendedor[]>('/json/vendedores.json').subscribe(datos => {
      console.log('datos:', datos);
      this.vendedores = datos;
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