import { Component, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { inject } from '@angular/core';
import { OfertaService } from '../../../services/oferta.service';
import { Oferta } from '../../../models/Oferta';
import { UiTable, tableColumn } from '../../shared/ui-table/ui-table';
import { ViewChild } from '@angular/core';
import { DialogoConfirmacion } from '../../shared/dialogo-confirmacion/dialogo-confirmacion';

@Component({
  selector: 'app-crud-oferta',
  standalone: true,
  imports: [UiTable, ReactiveFormsModule, DialogoConfirmacion],
  templateUrl: './crud-oferta.html',
  styleUrl: './crud-oferta.css'
})
export class CrudOferta implements OnInit {

  ofertas: Oferta[] = [];
  filteredOfertas: Oferta[] = [];
  tableColumns: tableColumn<Oferta>[] = [];
  isLoadingOfertas = false;
  ofertaService = inject(OfertaService);
  isEditMode = false;
  currentOferta: Oferta | null = null;
  ofertaAEliminar: Oferta | null = null;
@ViewChild('dialogoEliminar') dialogo!: DialogoConfirmacion;


  tiposOferta = ['descuento', 'promocion', 'liquidacion', 'temporada'];

  formOferta = new FormGroup({
    titulo: new FormControl('', [Validators.required, Validators.minLength(3)]),
    descripcion: new FormControl('', [Validators.required, Validators.minLength(10)]),
    tipo: new FormControl('', [Validators.required]),
    descuentoPorcentaje: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(99)
    ]),
    fechaInicio: new FormControl('', [Validators.required]),
    fechaFin: new FormControl('', [Validators.required]),
    idProducto: new FormControl<number | null>(null, [Validators.required, Validators.min(1)]),
    nombreProducto: new FormControl('', [Validators.required]),
    activa: new FormControl(false)
  });

  colAcciones = viewChild.required(
    'colAcciones',
    { read: TemplateRef }
  );

  ngOnInit(): void {
    this.getOfertas();
    this.setTableColumns();
  }

  getOfertas() {
    this.isLoadingOfertas = true;
    this.ofertaService
      .getOfertas()
      .subscribe((data: Oferta[]) => {
        this.ofertas = data;
        this.filteredOfertas = data;
        this.isLoadingOfertas = false;
      });
  }

  searchOferta(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.toLowerCase();
    this.filteredOfertas = this.ofertas.filter(oferta =>
      oferta.titulo
        .toLowerCase()
        .includes(value)
      ||
      oferta.nombreProducto
        .toLowerCase()
        .includes(value)
      ||
      oferta.tipo
        .toLowerCase()
        .includes(value)
    );
  }

  setTableColumns() {
    this.tableColumns = [
      {
        label: 'Título',
        def: 'titulo',
        content: (row) => row.titulo
      },
      {
        label: 'Tipo',
        def: 'tipo',
        content: (row) => row.tipo
      },
      {
        label: 'Producto',
        def: 'nombreProducto',
        content: (row) => row.nombreProducto
      },
      {
        label: 'Descuento',
        def: 'descuentoPorcentaje',
        content: (row) => `${row.descuentoPorcentaje}%`
      },
      {
        label: 'Fecha Inicio',
        def: 'fechaInicio',
        content: (row) => row.fechaInicio
      },
      {
        label: 'Fecha Fin',
        def: 'fechaFin',
        content: (row) => row.fechaFin
      },
      {
        label: 'Estado',
        def: 'activa',
        content: (row) => row.activa ? 'Activa' : 'Inactiva'
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colAcciones()
      }
    ];
  }

  onEditOferta(oferta: Oferta) {
    this.currentOferta = oferta;
    this.isEditMode = true;
    this.formOferta.patchValue({
      titulo: oferta.titulo,
      descripcion: oferta.descripcion,
      tipo: oferta.tipo,
      descuentoPorcentaje: oferta.descuentoPorcentaje,
      fechaInicio: oferta.fechaInicio,
      fechaFin: oferta.fechaFin,
      idProducto: oferta.idProducto,
      nombreProducto: oferta.nombreProducto,
      activa: oferta.activa
    });
  }

  onCancelEdit() {
    this.isEditMode = false;
    this.currentOferta = null;
    this.formOferta.reset({ activa: false });
  }

  onDeleteOferta(oferta: Oferta) {
  this.ofertaAEliminar = oferta;
  this.dialogo.abrir();
}

confirmarEliminar(): void {
  if (!this.ofertaAEliminar) return;
  this.ofertaService.deleteOferta(this.ofertaAEliminar.id!);
  this.ofertas = this.ofertaService.getAll();
  this.filteredOfertas = [...this.ofertas];
  this.ofertaAEliminar = null;
}

  onSaveOferta() {
    if (this.formOferta.invalid) {
      this.formOferta.markAllAsTouched();
      return;
    }

    const formValue = this.formOferta.value;

    if (this.isEditMode && this.currentOferta) {
      const updated: Oferta = {
        ...this.currentOferta,
        ...formValue
      } as Oferta;
      this.ofertaService.updateOferta(updated);
      this.isEditMode = false;
      this.currentOferta = null;
    } else {
      const newOferta: Oferta = {
        id: 0,
        titulo: formValue.titulo ?? '',
        descripcion: formValue.descripcion ?? '',
        tipo: (formValue.tipo ?? 'descuento') as Oferta['tipo'],
        descuentoPorcentaje: formValue.descuentoPorcentaje ?? 0,
        fechaInicio: formValue.fechaInicio ?? '',
        fechaFin: formValue.fechaFin ?? '',
        idProducto: formValue.idProducto ?? 0,
        nombreProducto: formValue.nombreProducto ?? '',
        activa: formValue.activa ?? false
      };
      this.ofertaService.addOferta(newOferta);
    }

    this.ofertas = this.ofertaService.getAll();
    this.filteredOfertas = [...this.ofertas];
    this.formOferta.reset({ activa: false });
  }
}
