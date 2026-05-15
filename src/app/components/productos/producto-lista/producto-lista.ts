import { Component, inject, signal } from '@angular/core';
import { Producto } from '../../../models/Producto';
import { ProductoService } from '../../../services/producto.service';
import { TitleCasePipe } from '@angular/common';

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

  ngOnInit(): void {
    this.servicio.getProductos().subscribe((data: Producto[]) => {
      // Solo muestra productos disponibles
      const disponibles = data.filter(p => p.disponible);
      this.productos.set(disponibles);
      this.productosFiltrados.set(disponibles);
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