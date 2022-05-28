import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRoute, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from '../auth/token-storage.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private tokenStorage: TokenStorageService, private router: Router) { }
  public canActivate()
  {

    // es !=  a true
   if (!this.tokenStorage.getToken()) //Obtenemos en nuestro servicio el rol y nos fijamos si es igual o no al de 'Admin
   {
            // console.log('Usted no posee permisos para acceder a esta ruta');
            this.router.navigate(['/']); //Lo enviamos a la página que queramos
            return false;
   }
    return true; //Este camino deja continuar con la vista con normalidad

  }
}
