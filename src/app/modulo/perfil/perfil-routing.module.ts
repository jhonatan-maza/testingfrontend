import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PerfilComponent } from '../../component/acceso/configuracion/seguridad/perfil/perfil.component';

const routes: Routes = [
  { path: '', component: PerfilComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class PerfilRoutingModule { }

export const routingPerfilComponent = [ PerfilComponent ]
