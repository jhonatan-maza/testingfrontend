import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperacionComponent } from '../../component/acceso/configuracion/seguridad/operacion/operacion.component';

const routes: Routes = [
  { path: '', component: OperacionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class OperacionRoutingModule { }

export const routingOperacionComponent = [ OperacionComponent ]
