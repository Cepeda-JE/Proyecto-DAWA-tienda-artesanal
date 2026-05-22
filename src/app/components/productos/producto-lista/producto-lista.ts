import { Component, inject, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Producto } from '../../../models/Producto';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-producto-lista',
  imports: [TitleCasePipe],
  templateUrl: './producto-lista.html',
  styleUrl: './producto-lista.css'
})
export class ProductoLista {

  productos = signal<Producto[]>([]);
  productosFiltrados = signal<Producto[]>([]);
  categorias = ['todas', 'ropa', 'accesorios', 'alimentos'];
  categoriaSeleccionada = signal<string>('todas');

  servicio = inject(ProductoService);
  route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.servicio.getProductos().subscribe((data: Producto[]) => {
      const disponibles = data.filter(p => p.disponible);
      this.productos.set(disponibles);
      this.productosFiltrados.set(disponibles);

      // Lee el queryParam del carrusel si viene
      this.route.queryParams.subscribe(params => {
        if (params['categoria']) {
          this.filtrarPorCategoria(params['categoria']);
        }
      });
    });
  }

  filtrarPorCategoria(categoria: string): void {
    this.categoriaSeleccionada.set(categoria);
    if (categoria === 'todas') {
      this.productosFiltrados.set(this.productos());
    } else {
      this.productosFiltrados.set(
        this.productos().filter(p => p.categoria === categoria)
      );
    }
  }
}