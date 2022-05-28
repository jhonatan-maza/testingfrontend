import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NivelComponent } from '../../component/acceso/configuracion/seguridad/nivel/nivel.component';

const routes: Routes = [
  { path: '', component: NivelComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class NivelRoutingModule { }

export const routingNivelComponent = [ NivelComponent ]
