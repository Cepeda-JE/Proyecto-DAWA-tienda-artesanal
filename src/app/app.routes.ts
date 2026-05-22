import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductoCrud } from './components/productos/producto-crud/producto-crud';
import { ProductoLista } from './components/productos/producto-lista/producto-lista';
import { VendedorCrudComponent } from './components/vendedores/vendedor-crud/vendedor-crud';
import { VendedorLista } from './components/vendedores/vendedor-lista/vendedor-lista';
import { ClienteCrud } from './components/clientes/cliente-crud/cliente-crud';
import { PedidoCrud } from './components/pedidos/pedido-crud/pedido-crud';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'productos', component: ProductoCrud },
  { path: 'catalogo', component: ProductoLista },
  { path: 'vendedores', component: VendedorCrudComponent },
  { path: 'vendedores-lista', component: VendedorLista },
  { path: 'clientes', component: ClienteCrud },
  { path: 'pedidos', component: PedidoCrud },
  // van agregando sus rutas aquí:
 

  { path: '**', redirectTo: '' } // ruta no encontrada → inicio
];