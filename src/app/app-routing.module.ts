import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PreloadingStrategyService } from './service/PreloadingStrategy.service';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';

import {LoginComponent} from './component/login/login.component';
import {BodyComponent} from './component/fragmento/body/body.component';
import {HeaderComponent} from './component/fragmento/hearder/header.component';
import {MenuComponent} from './component/fragmento/menu/menu.component';
import {MenuSiderComponent} from './component/fragmento/menu/menusider.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [LoginGuard]
  },

  {
    path: 'nivel',
    loadChildren: () => import('./modulo/nivel/nivel.module').then(m => m.NivelModule),
    data: {preload : false},
    canActivate: [AuthGuard]
  },

  {
    path: 'operacion',
    loadChildren: () => import('./modulo/operacion/operacion.module').then(m => m.OperacionModule),
    data: {preload : false},
    canActivate: [AuthGuard]
  },

  {
    path: 'perfil',
    loadChildren: () => import('./modulo/perfil/perfil.module').then(m => m.PerfilModule),
    data: {preload : false},
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
    canActivate: [LoginGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    enableTracing: true, // <-- debugging purposes only
    preloadingStrategy: PreloadAllModules // == carga todos los modulos
    // preloadingStrategy: PreloadingStrategyService  // == carga solo algunos modulos
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

export const routingComponent = [
  LoginComponent,
  BodyComponent,
  HeaderComponent,
  MenuComponent,
  MenuSiderComponent
]
