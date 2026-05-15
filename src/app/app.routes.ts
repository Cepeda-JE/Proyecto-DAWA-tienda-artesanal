import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { ProductoCrud } from './components/productos/producto-crud/producto-crud';
import { ProductoLista } from './components/productos/producto-lista/producto-lista';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'productos', component: ProductoCrud },
  { path: 'catalogo', component: ProductoLista },
  // van agregando sus rutas aquí:
 

  { path: '**', redirectTo: '' } // ruta no encontrada → inicio
];