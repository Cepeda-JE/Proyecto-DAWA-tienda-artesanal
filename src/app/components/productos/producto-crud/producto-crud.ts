import { Component, ElementRef, inject, signal, computed, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../../models/Producto';
import { ProductoService, VendedorSimple } from '../../../services/producto.service';
import { DialogoConfirmacion } from '../../shared/dialogo-confirmacion/dialogo-confirmacion';

declare const bootstrap: any;

@Component({
  selector: 'app-producto-crud',
  imports: [ReactiveFormsModule, DialogoConfirmacion],
  templateUrl: './producto-crud.html',
  styleUrl: './producto-crud.css'
})
export class ProductoCrud {

  // Estado
  productos = signal<Producto[]>([]);
  vendedores = signal<VendedorSimple[]>([]);
  editingId: number | null = null;
  formProducto!: FormGroup;
  modalRef: any;
  productoAEliminar: any = null;
  productosConVendedor = computed(() => {
    return this.productos().map(p => {
      const vendedor = this.vendedores().find(v => Number(v.id) === Number(p.vendedorId));
      return {
        ...p,
        vendedorNombre: vendedor ? vendedor.nombre : 'Sin vendedor'
      };
    });
  });

  categorias = ['Ropa', 'Accesorios', 'Alimentos'];

  @ViewChild('productoModalRef') modalElement!: ElementRef;
 @ViewChild('dialogoEliminar') dialogo!: DialogoConfirmacion;
  // Inyecciones
  servicio = inject(ProductoService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.loadProductos();
    this.loadVendedores();
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  loadProductos(): void {
    this.servicio.getProductos().subscribe((data: Producto[]) => {
      this.productos.set(data);
    });
  }

  loadVendedores(): void {
    this.servicio.getVendedores().subscribe((data: VendedorSimple[]) => {
      this.vendedores.set(data);
    });
  }

  private initForm(): void {
    this.formProducto = this.fb.group({
      nombre:      ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
      descripcion: ['', [Validators.required, Validators.minLength(5)]],
      precio:      [null, [Validators.required, Validators.min(0.01)]],
      categoria:   ['', Validators.required],
      stock:       [null, [Validators.required, Validators.min(0)]],
      imagen:      [''],
      vendedorId:  [null, Validators.required],
      disponible:  [true]
    });
  }

  search(input: HTMLInputElement): void {
    const termino = input.value.toLowerCase();
    if (termino === '') {
      this.loadProductos();
      return;
    }
    this.servicio.searchProductos(termino).subscribe((data: Producto[]) => {
      this.productos.set(data);
    });
  }

  openNew(): void {
    this.editingId = null;
    this.formProducto.reset({ disponible: true });
    this.modalRef.show();
  }

  openEdit(producto: Producto): void {
    this.editingId = producto.id!;
    this.formProducto.patchValue(producto);
    this.modalRef.show();
  }


  save(): void {
    if (this.formProducto.invalid) {
      this.formProducto.markAllAsTouched();
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
    const data = this.formProducto.value;

    if (this.editingId) {
      const actualizado = { ...data, id: this.editingId };
      this.servicio.updateProducto(actualizado).subscribe(() => {
        this.productos.update(list =>
          list.map(p => p.id === actualizado.id ? actualizado : p)
        );
      });
    } else {
      this.servicio.addProducto(data).subscribe((nuevo: Producto) => {
        this.productos.update(list => [...list, nuevo]);
      });
    }
    this.modalRef.hide();
  }

delete(producto: any): void {
  this.productoAEliminar = producto;
  this.dialogo.abrir();
}

confirmarEliminar(): void {
  if (!this.productoAEliminar) return;
  this.servicio.deleteProducto(this.productoAEliminar.id!).subscribe(() => {
    this.productos.update(list =>
      list.filter(p => p.id !== this.productoAEliminar.id)
    );
    this.productoAEliminar = null;
  });
}
}