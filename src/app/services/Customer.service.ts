import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http = inject(HttpClient);
  private apiUrl = 'json/clientes.json';
  private clientes: Customer[] = [];
  private nextId = 4;

  getCustomers(): Observable<Customer[]> {
    if (this.clientes.length > 0) {
      return new Observable(obs => {
        obs.next(this.clientes);
        obs.complete();
      });
    }
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      map(data => {
        this.clientes = data;
        this.nextId = Math.max(...data.map(c => c.id ?? 0)) + 1;
        return this.clientes;
      })
    );
  }

  addCustomer(customer: Customer): Customer {
    const nuevo = { ...customer, id: this.nextId++ };
    this.clientes.push(nuevo);
    return nuevo;
  }

  updateCustomer(customer: Customer): void {
    const index = this.clientes.findIndex(c => c.id === customer.id);
    if (index !== -1) this.clientes[index] = customer;
  }

  deleteCustomer(id: number): void {
    this.clientes = this.clientes.filter(c => c.id !== id);
  }

  getAll(): Customer[] {
    return this.clientes;
  }
}