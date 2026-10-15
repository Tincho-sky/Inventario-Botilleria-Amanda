import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Caja } from './pages/caja/caja';
import { Inventario } from './pages/inventario/inventario';
import { Historial } from './pages/historial/historial'; // <-- Nuevo

export const routes: Routes = [
  { path: 'dashboard', component: Dashboard },
  { path: 'caja', component: Caja },
  { path: 'inventario', component: Inventario },
  { path: 'historial', component: Historial }, // <-- Nuevo
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];