import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductoCrud } from './components/productos/producto-crud/producto-crud';
import { ProductoLista } from './components/productos/producto-lista/producto-lista';
import { VendedorCrudComponent } from './components/vendedores/vendedor-crud/vendedor-crud';
import { VendedorListaComponent } from './components/vendedores/vendedor-lista/vendedor-lista';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'productos', component: ProductoCrud },
  { path: 'catalogo', component: ProductoLista },
  { path: 'vendedores', component: VendedorCrudComponent },
  { path: 'vendedores-lista', component: VendedorListaComponent },
  // van agregando sus rutas aquí:
 

  { path: '**', redirectTo: '' } // ruta no encontrada → inicio
];