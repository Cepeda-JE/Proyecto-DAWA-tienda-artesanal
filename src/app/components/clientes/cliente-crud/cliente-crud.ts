import { Component, OnInit, TemplateRef, viewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { UiTable, tableColumn } from '../../shared/ui-table/ui-table';
import { inject } from '@angular/core';
import { CustomerService } from '../../../services/Customer.service';
import { Customer } from '../../../models/customer';

@Component({
  selector: 'app-cliente-crud',
  standalone: true,
  imports: [UiTable, ReactiveFormsModule],
  templateUrl: './cliente-crud.html',
  styleUrl: './cliente-crud.css'
})
export class ClienteCrud implements OnInit {

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  tableColumns: tableColumn<Customer>[] = [];
  isLoadingCustomers = false;
  customerService = inject(CustomerService);
  isEditMode = false;
  currentCustomer: Customer | null = null;

ciudades: string[] = [
  'Guayaquil',
  'Quito',
  'Cuenca',
  'Loja',
  'Manta'
];

formCustomer = new FormGroup({
  nombre: new FormControl('', [ Validators.required ]),
  apellido: new FormControl('', [ Validators.required ]),
  correo: new FormControl('', [ Validators.required, Validators.email ]),
  telefono: new FormControl('', [ 
  Validators.required, 
  Validators.pattern(/^[0-9]{10}$/)
]),
  direccion: new FormControl('', [ Validators.required ]),
  ciudad: new FormControl('', [ Validators.required ]),
  password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
  activo: new FormControl(false)
});

  colAcciones = viewChild.required(
    'colAcciones',
    { read: TemplateRef }
  );

  ngOnInit(): void {
    this.getCustomers();
    this.setTableColumns();
  }

  getCustomers() {

    this.isLoadingCustomers = true;
    this.customerService
      .getCustomers()
      .subscribe((data: Customer[]) => {
        this.customers = data;
        this.filteredCustomers = data;
        this.isLoadingCustomers = false;
      });

  }

 searchCustomer(event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer =>
      customer.nombre
        .toLowerCase()
        .includes(value)
      ||
      customer.apellido
        .toLowerCase()
        .includes(value)
      ||
      customer.correo
        .toLowerCase()
        .includes(value)
      ||
      customer.ciudad
        .toLowerCase()
        .includes(value)
    );
  }

  setTableColumns() {
    this.tableColumns = [
      {
        label: 'Nombre',
        def: 'nombre',
        content: (row) => row.nombre
      },
      {
        label: 'Apellido',
        def: 'apellido',
        content: (row) => row.apellido
      },
      {
        label: 'Correo',
        def: 'correo',
        content: (row) => row.correo
      },
      {
        label: 'Teléfono',
        def: 'telefono',
        content: (row) => row.telefono
      },
      {
        label: 'Ciudad',
        def: 'ciudad',
        content: (row) => row.ciudad
      },
      {
        label: 'Activo',
        def: 'activo',
        content: (row) =>
          row.activo ? 'Activo' : 'Inactivo'
      },
      {
        label: 'Acciones',
        def: 'acciones',
        template: this.colAcciones()
      }
    ];
  }

  onEditCustomer(customer: Customer) {

  this.currentCustomer = customer;

  this.isEditMode = true;

  this.formCustomer.patchValue({
    nombre: customer.nombre,
    apellido: customer.apellido,
    correo: customer.correo,
    telefono: customer.telefono,
    direccion: customer.direccion,
    ciudad: customer.ciudad,
    password: customer.password,
    activo: customer.activo
  });

  }

  onCancelEdit() {

    this.isEditMode = false;
    this.currentCustomer = null;
    this.formCustomer.reset({
      activo: false
    });
  }

onDeleteCustomer(customer: Customer) {
  const confirmDelete = confirm(`¿Eliminar a ${customer.nombre}?`);
  if (!confirmDelete) return;
  this.customerService.deleteCustomer(customer.id!);
  this.customers = this.customerService.getAll();
  this.filteredCustomers = [...this.customers];
}

onSaveCustomer() {
  if (this.formCustomer.invalid) {
    this.formCustomer.markAllAsTouched();
    return;
  }
  const formValue = this.formCustomer.value;

  if (this.isEditMode && this.currentCustomer) {
    const updated: Customer = {
      ...this.currentCustomer,
      ...formValue
    } as Customer;
    this.customerService.updateCustomer(updated);
    this.isEditMode = false;
    this.currentCustomer = null;
  } else {
    const newCustomer: Customer = {
      id: 0,
      nombre: formValue.nombre ?? '',
      apellido: formValue.apellido ?? '',
      correo: formValue.correo ?? '',
      telefono: formValue.telefono ?? '',
      direccion: formValue.direccion ?? '',
      ciudad: formValue.ciudad ?? '',
      password: formValue.password ?? '',
      activo: formValue.activo ?? false,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    this.customerService.addCustomer(newCustomer);
  }

  this.customers = this.customerService.getAll();
  this.filteredCustomers = [...this.customers];
  this.formCustomer.reset({ activo: false });
}
}
