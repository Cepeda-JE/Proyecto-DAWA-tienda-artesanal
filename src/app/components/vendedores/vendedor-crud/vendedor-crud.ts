import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { VendedorService } from '../../../services/vendedor';
import { Vendedor } from '../../../models/Vendedor';
import { DialogoConfirmacion } from '../../shared/dialogo-confirmacion/dialogo-confirmacion';

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
  modoEdicion = false;
  idEditando: number | null = null;
  @ViewChild('dialogo') dialogo!: DialogoConfirmacion;
  idAEliminar: number | null = null;
  mensajeExito = '';
  mensajeError = '';

  categorias = ['ropa', 'accesorios', 'alimentos', 'otro'];

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

  buscar(event: Event): void {
    const texto = (event.target as HTMLInputElement).value.toLowerCase();
    this.vendedoresFiltrados = this.vendedores.filter(v =>
      v.nombre.toLowerCase().includes(texto) ||
      v.email.toLowerCase().includes(texto) ||
      v.categoria.toLowerCase().includes(texto)
    );
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.mensajeError = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const datos = this.form.value as Vendedor;

    if (this.modoEdicion && this.idEditando !== null) {
      this.vendedorService.update({ ...datos, id: this.idEditando });
      this.mensajeExito = 'Vendedor actualizado correctamente.';
    } else {
      this.vendedorService.create(datos);
      this.mensajeExito = 'Vendedor registrado correctamente.';
    }

    this.vendedoresFiltrados = [...this.vendedorService['vendedores']];
    this.vendedores = [...this.vendedorService['vendedores']];
    this.resetForm();
    this.mensajeError = '';
    setTimeout(() => this.mensajeExito = '', 3000);
  }

  editar(vendedor: Vendedor): void {
    this.modoEdicion = true;
    this.idEditando = vendedor.id;
    this.form.patchValue(vendedor);
    this.mensajeError = '';
  }

  confirmarEliminar(id: number): void {
  this.idAEliminar = id;
  this.dialogo.abrir();
  }

  eliminar(): void {
    if (this.idAEliminar !== null) {
      this.vendedorService.delete(this.idAEliminar);
      this.vendedores = [...this.vendedorService['vendedores']];
      this.vendedoresFiltrados = [...this.vendedores];
      this.mensajeExito = 'Vendedor eliminado correctamente.';
      this.idAEliminar = null;
    setTimeout(() => this.mensajeExito = '', 3000);
    }
  }

  resetForm(): void {
    this.form.reset({ activo: true });
    this.modoEdicion = false;
    this.idEditando = null;
    this.mensajeError = '';
  }

  get f() { return this.form.controls; }
}