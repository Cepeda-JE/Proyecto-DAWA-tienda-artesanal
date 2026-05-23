import { Component, OnInit, TemplateRef, ViewChild, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OpinionService } from '../../../services/opinion.service';
import { Opinion } from '../../../models/Opinion';
import { UiTable, tableColumn } from '../../shared/ui-table/ui-table';
import { DialogoConfirmacion } from '../../shared/dialogo-confirmacion/dialogo-confirmacion';

@Component({
  selector: 'app-crud-opinion',
  standalone: true,
  imports: [UiTable, ReactiveFormsModule, DialogoConfirmacion],
  templateUrl: './crud-opinion.html',
  styleUrl: './crud-opinion.css'
})
export class CrudOpinion implements OnInit {

  opiniones: Opinion[] = [];
  filteredOpiniones: Opinion[] = [];
  tableColumns: tableColumn<Opinion>[] = [];
  isEditMode = false;
  currentOpinion: Opinion | null = null;
  opinionAEliminar: Opinion | null = null;
  @ViewChild('dialogoEliminar') dialogo!: DialogoConfirmacion;

  calificaciones = [1, 2, 3, 4, 5];

  formOpinion = new FormGroup({
    autor: new FormControl('', [Validators.required, Validators.minLength(3)]),
    correo: new FormControl('', [Validators.required, Validators.email]),
    calificacion: new FormControl<number | null>(null, [
      Validators.required, Validators.min(1), Validators.max(5)
    ]),
    comentario: new FormControl('', [Validators.required, Validators.minLength(10)]),
    fecha: new FormControl('', [Validators.required]),
    idProducto: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    nombreProducto: new FormControl('', [Validators.required]),
    aprobada: new FormControl(false)
  });

  colAcciones = viewChild.required('colAcciones', { read: TemplateRef });

  constructor(private opinionService: OpinionService) {}

  ngOnInit(): void {
    this.cargarOpiniones();
    this.setTableColumns();
  }

  cargarOpiniones() {
    this.opiniones = this.opinionService.getAll();
    this.filteredOpiniones = [...this.opiniones];
  }

  searchOpinion(event: Event) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOpiniones = this.opiniones.filter(o =>
      o.autor.toLowerCase().includes(value) ||
      o.nombreProducto.toLowerCase().includes(value) ||
      o.comentario.toLowerCase().includes(value)
    );
  }

  setTableColumns() {
    this.tableColumns = [
      { label: 'Autor',        def: 'autor',          content: (row) => row.autor },
      { label: 'Producto',     def: 'nombreProducto', content: (row) => row.nombreProducto },
      { label: 'Calificación', def: 'calificacion',   content: (row) => `${row.calificacion} / 5` },
      { label: 'Comentario',   def: 'comentario',     content: (row) => row.comentario },
      { label: 'Fecha',        def: 'fecha',          content: (row) => row.fecha },
      { label: 'Estado',       def: 'aprobada',       content: (row) => row.aprobada ? 'Aprobada' : 'Pendiente' },
      { label: 'Acciones',     def: 'acciones',       template: this.colAcciones() }
    ];
  }

  onEdit(opinion: Opinion) {
    this.currentOpinion = opinion;
    this.isEditMode = true;
    this.formOpinion.patchValue({ ...opinion });
  }

  onCancelEdit() {
    this.isEditMode = false;
    this.currentOpinion = null;
    this.formOpinion.reset({ aprobada: false });
  }

  onDelete(opinion: Opinion) {
  this.opinionAEliminar = opinion;
  this.dialogo.abrir();
}

confirmarEliminar(): void {
  if (!this.opinionAEliminar) return;
  this.opinionService.delete(this.opinionAEliminar.id!);
  this.cargarOpiniones();
  this.opinionAEliminar = null;
}

  onSave() {
    if (this.formOpinion.invalid) {
      this.formOpinion.markAllAsTouched();
      return;
    }
    const v = this.formOpinion.value;

    if (this.isEditMode && this.currentOpinion) {
      this.opinionService.update({ ...this.currentOpinion, ...v } as Opinion);
      this.isEditMode = false;
      this.currentOpinion = null;
    } else {
      const nueva: Opinion = {
        id: 0,
        autor: v.autor ?? '',
        correo: v.correo ?? '',
        calificacion: v.calificacion ?? 1,
        comentario: v.comentario ?? '',
        fecha: v.fecha ?? '',
        idProducto: v.idProducto ?? 0,
        nombreProducto: v.nombreProducto ?? '',
        aprobada: v.aprobada ?? false
      };
      this.opinionService.add(nueva);
    }

    this.cargarOpiniones();
    this.formOpinion.reset({ aprobada: false });
  }
}
