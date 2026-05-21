import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendedorService } from '../../../services/vendedor';
import { Vendedor } from '../../../models/Vendedor';
import { DialogoConfirmacion } from '../../shared/dialogo-confirmacion/dialogo-confirmacion';

declare const bootstrap: any;

@Component({
  selector: 'app-vendedor-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DialogoConfirmacion],
  templateUrl: './vendedor-crud.html',
  styleUrl: './vendedor-crud.css'
})
export class VendedorCrudComponent implements OnInit {
  vendedores: Vendedor[] = [];
  vendedoresFiltrados: Vendedor[] = [];
  form: FormGroup;
  editingId: number | null = null;
  modalRef: any;
  vendedorAEliminar: any = null;

  categorias = ['ropa', 'accesorios', 'alimentos', 'otro'];

  @ViewChild('vendedorModalRef') modalElement!: ElementRef;
  @ViewChild('dialogoEliminar') dialogo!: DialogoConfirmacion;

  constructor(private fb: FormBuilder, private vendedorService: VendedorService) {
    this.form = this.fb.group({
      nombre:        ['', [Validators.required, Validators.minLength(3)]],
      email:         ['', [Validators.required, Validators.email]],
      telefono:      ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      categoria:     ['', Validators.required],
      activo:        [true],
      descripcion:   ['', [Validators.required, Validators.minLength(10)]],
      fechaRegistro: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.vendedorService.getAll().subscribe(datos => {
      this.vendedorService.inicializar(datos);
      this.vendedores = this.vendedorService['vendedores'];
      this.vendedoresFiltrados = [...this.vendedores];
    });
  }

  ngAfterViewInit(): void {
    this.modalRef = new bootstrap.Modal(this.modalElement.nativeElement);
  }

  buscar(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.toLowerCase();
    this.vendedoresFiltrados = this.vendedores.filter(v =>
      v.nombre.toLowerCase().includes(texto) ||
      v.email.toLowerCase().includes(texto) ||
      v.categoria.toLowerCase().includes(texto)
    );
  }

  openNew(): void {
    this.editingId = null;
    this.form.reset({ activo: true });
    this.modalRef.show();
  }

  openEdit(vendedor: Vendedor): void {
    this.editingId = vendedor.id;
    this.form.patchValue(vendedor);
    this.modalRef.show();
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = this.form.value as Vendedor;
    if (this.editingId !== null) {
      this.vendedorService.update({ ...datos, id: this.editingId });
    } else {
      this.vendedorService.create(datos);
    }
    this.vendedores = [...this.vendedorService['vendedores']];
    this.vendedoresFiltrados = [...this.vendedores];
    this.modalRef.hide();
  }

  delete(vendedor: Vendedor): void {
    this.vendedorAEliminar = vendedor;
    this.dialogo.abrir();
  }

  confirmarEliminar(): void {
    if (!this.vendedorAEliminar) return;
    this.vendedorService.delete(this.vendedorAEliminar.id);
    this.vendedores = [...this.vendedorService['vendedores']];
    this.vendedoresFiltrados = [...this.vendedores];
    this.vendedorAEliminar = null;
  }

  get f() { return this.form.controls; }
}