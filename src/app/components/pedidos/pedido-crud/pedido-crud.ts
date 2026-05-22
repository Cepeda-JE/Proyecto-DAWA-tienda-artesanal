import { Component, ElementRef, inject, signal, computed, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Pedido } from '../../../models/Pedido';
import { PedidoService, ItemSimple } from '../../../services/pedido.service';
import { DialogoConfirmacion } from '../../shared/dialogo-confirmacion/dialogo-confirmacion';
import { TitleCasePipe } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-pedido-crud',
  standalone: true,
  imports: [ReactiveFormsModule, DialogoConfirmacion, TitleCasePipe],
  templateUrl: './pedido-crud.html',
  styleUrl: './pedido-crud.css'
})
export class PedidoCrud {

  pedidos = signal<Pedido[]>([]);
  clientes = signal<ItemSimple[]>([]);
  productos = signal<ItemSimple[]>([]);
  editingId: number | null = null;
  formPedido!: FormGroup;
  modalRef: any;
  pedidoAEliminar: any = null;

  estados = ['pendiente', 'enviado', 'entregado', 'cancelado'];

  // Computed — pedidos con nombre de cliente y producto
  pedidosDetalle = computed(() => {
    return this.pedidos().map(p => {
      const cliente = this.clientes().find(c => Number(c.id) === Number(p.clienteId));
      const producto = this.productos().find(pr => Number(pr.id) === Number(p.productoId));
      return {
        ...p,
        clienteNombre: cliente ? cliente.nombre : 'Sin cliente',
        productoNombre: producto ? producto.nombre : 'Sin producto'
      };
    });
  });

  @ViewChild('pedidoModalRef') modalElement!: ElementRef;
  @ViewChild('dialogoEliminar') dialogo!: DialogoConfirmacion;

  servicio = inject(PedidoService);
  fb = inject(FormBuilder);

  ngOnInit(): void {
    this.loadPedidos();
    this.loadClientes();
    this.loadProductos();
    this.initForm();
  }

  ngAfterViewInit(): void {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  loadPedidos(): void {
    this.servicio.getPedidos().subscribe((data: Pedido[]) => {
      this.pedidos.set(data);
    });
  }

  loadClientes(): void {
    this.servicio.getClientes().subscribe((data: ItemSimple[]) => {
      this.clientes.set(data);
    });
  }

  loadProductos(): void {
    this.servicio.getProductos().subscribe((data: ItemSimple[]) => {
      this.productos.set(data);
    });
  }

  private initForm(): void {
    this.formPedido = this.fb.group({
      numeroPedido: ['', [Validators.required]],
      clienteId:    [null, Validators.required],
      productoId:   [null, Validators.required],
      cantidad:     [null, [Validators.required, Validators.min(1)]],
      fecha:        ['', Validators.required],
      estado:       ['', Validators.required],
      total:        [null, [Validators.required, Validators.min(0)]],
      notas:        ['']
    });
  }

  search(input: HTMLInputElement): void {
    const termino = input.value;
    if (termino === '') {
      this.loadPedidos();
      return;
    }
    this.servicio.searchPedidos(termino).subscribe((data: Pedido[]) => {
      this.pedidos.set(data);
    });
  }

  openNew(): void {
    this.editingId = null;
    const hoy = new Date().toISOString().split('T')[0];
    const num = 'PED-' + String(Date.now()).slice(-4);
    this.formPedido.reset();
    this.formPedido.patchValue({ fecha: hoy, numeroPedido: num });
    this.modalRef.show();
  }

  openEdit(pedido: Pedido): void {
    this.editingId = pedido.id!;
    this.formPedido.patchValue(pedido);
    this.modalRef.show();
  }

  save(): void {
    if (this.formPedido.invalid) {
      this.formPedido.markAllAsTouched();
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
    const data = this.formPedido.value;
    if (this.editingId) {
      const actualizado = { ...data, id: this.editingId };
      this.servicio.updatePedido(actualizado).subscribe(() => {
        this.pedidos.update(list =>
          list.map(p => p.id === actualizado.id ? actualizado : p)
        );
      });
    } else {
      this.servicio.addPedido(data).subscribe((nuevo: Pedido) => {
        this.pedidos.update(list => [...list, nuevo]);
      });
    }
    this.modalRef.hide();
  }

  delete(pedido: any): void {
    this.pedidoAEliminar = pedido;
    this.dialogo.abrir();
  }

  confirmarEliminar(): void {
    if (!this.pedidoAEliminar) return;
    this.servicio.deletePedido(this.pedidoAEliminar.id!).subscribe(() => {
      this.pedidos.update(list =>
        list.filter(p => p.id !== this.pedidoAEliminar.id)
      );
      this.pedidoAEliminar = null;
    });
  }

  getBadgeEstado(estado: string): string {
    const clases: Record<string, string> = {
      pendiente: 'bg-warning text-dark',
      enviado: 'bg-info text-dark',
      entregado: 'bg-success',
      cancelado: 'bg-danger'
    };
    return clases[estado] || 'bg-secondary';
  }
}