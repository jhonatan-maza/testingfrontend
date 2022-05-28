import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TokenStorageService } from '../../../auth/token-storage.service';
import { UsuarioService } from '../../../service/Usuario.service';
import { FuncionesService } from '../../../service/funciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
  // styleUrls: ['../body/body.component.css']
})
export class HeaderComponent implements OnInit {
  info: any;

  constructor(
    private tokenStorage: TokenStorageService,
    private router: Router,
    private usuarioService: UsuarioService,
    private funcionesService: FuncionesService
  ) { }

  ngOnInit() {
    this.info = {
      nameuser: this.tokenStorage.getNameuser()
    };
  }

  mensLayout(){
    Swal.fire({
      title: '¿Desea salir del sistema?',
      text: 'Por favor confirme!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, deseo salir!',
      cancelButtonText: 'Cancelar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          'Éxito!',
          'Se ha cerrado tu sesión',
          'success'
        )
        this.logout();
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'Se canceló la operación !!',
          'error'
        )
      }
    })

    // Swal.fire({
    //   width: 400,
    //   title: '¿Desea Salir del Sistema?',
    //   text: "Por favor confirme!",
    //   type: 'warning',
    //   showCancelButton: true,
    //   cancelButtonText: 'Cancelar!',
    //   confirmButtonColor: '#3085d6',
    //   cancelButtonColor: '#d33',
    //   confirmButtonText: 'Sí, deseo salir!',
    // }).then((result) => {
    //   if (result.value) {
    //     this.logout();
    //   }
    // });
  }

  logout() {
    this.tokenStorage.signOut();
    this.router.navigateByUrl('/');
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  changeSiderBarMenu() {
    this.funcionesService.changeSiderMenu();
  }

}
