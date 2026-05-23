import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductoCrud } from './components/productos/producto-crud/producto-crud';
import { ProductoLista } from './components/productos/producto-lista/producto-lista';
import { VendedorCrudComponent } from './components/vendedores/vendedor-crud/vendedor-crud';
import { VendedorLista } from './components/vendedores/vendedor-lista/vendedor-lista';
import { ClienteCrud } from './components/clientes/cliente-crud/cliente-crud';
import { PedidoCrud } from './components/pedidos/pedido-crud/pedido-crud';
import { CrudOferta } from './components/ofertas/crud-oferta/crud-oferta';
import { CrudOpinion } from './components/opiniones/crud-opinion/crud-opinion';
import { OfertasLista } from './components/ofertas/ofertas-lista/ofertas-lista';
import { OpinionesLista } from './components/opiniones/opiniones-lista/opiniones-lista';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'productos', component: ProductoCrud },
  { path: 'catalogo', component: ProductoLista },
  { path: 'vendedores', component: VendedorCrudComponent },
  { path: 'vendedores-lista', component: VendedorLista },
  { path: 'clientes', component: ClienteCrud },
  { path: 'pedidos', component: PedidoCrud },
  { path: 'ofertas', component: CrudOferta },
  { path: 'opiniones', component: CrudOpinion },
  { path: 'ofertas-lista', component: OfertasLista },
{ path: 'opiniones-lista', component: OpinionesLista },
  { path: '**', redirectTo: '' }
];