import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ElementRef, TemplateRef, Renderer2} from '@angular/core';
import { PerfilService } from '../../../../../service/Perfil.service';
import { NivelService } from '../../../../../service/Nivel.service';
import { FuncionesService } from '../../../../../service/funciones.service';
import { Perfil } from '../../../../../model/Perfil';
import { Nivel } from '../../../../../model/Nivel';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html'
})
export class PerfilComponent implements OnInit, AfterViewInit {

  @ViewChild('modalRegistros') modalRegistros:ElementRef;
  @ViewChild('rowLoading') rowLoading:ElementRef;
  @ViewChild('rowData') rowData:ElementRef;

  // Controles de Mantenimiento
  FormBusqueda: FormGroup;
  FormModal: FormGroup;
  titleModal = "Nuevo Registro";
  tipoTransaccionModal : number = 0;
  codigoModal: boolean = false;

  perfil: Perfil;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('PAGINATOR_PERFIL') paginatorPerfil: MatPaginator;
  dataSource = new MatTableDataSource<Perfil>();
  displayedColumns: string[] = ['acciones', 'idperfil', 'descperfil', 'descnivel', 'usuariosact', 'usuariosinact'];
  viewDataSourcePerfil = Perfil;

  busqNivel$: Observable<Nivel>;
  mantNivel$: Observable<Nivel>;

  constructor(
    private perfilService: PerfilService,
    private nivelService: NivelService,
    private funcionesService: FuncionesService,
    private pag: MatPaginatorIntl,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {
    this.pag.itemsPerPageLabel = "Registros por página";
    this.pag.firstPageLabel = "Primero";
    this.pag.previousPageLabel = "Anterior";
    this.pag.nextPageLabel = "Siguiente";
    this.pag.lastPageLabel = "Último";
    this.perfil = new Perfil();
    this.funcionesService.changeNombreMenu("CONFIGURACIÓN - SEGURIDAD");
  }

  ngOnInit() {
    this.FormBusqueda = this.formBuilder.group({
      textName: new FormControl(''),
      cboBusqNivel: new FormControl(),
      cboBusqEstado: new FormControl('A')
    });
    this.FormModal = this.formBuilder.group({
      cntrlMantIdPerfil: new FormControl(''),
      cntrlMantDescPerfil: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      cntrlMantEstadoPerfil: new FormControl(''),
      cntrlMantNivel: new FormControl(null,[ Validators.required ])
    });
    this.busqNivel$ = this.nivelService.ListarNivel('A', 'all', 'all', '1');
    this.mantNivel$ = this.nivelService.ListarNivel('A', 'all', 'all', '1');
  }

  ngAfterViewInit(): void {
    this.ListarPerfil(0,"A");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginatorPerfil;
    this.funcionesService.changeCerrarModal.subscribe(isOpen => {
      if( isOpen === false ) {
        this.renderer.removeClass(this.modalRegistros.nativeElement,"show-sidebar-modal");
        this.resetModal();
      }
    });
  }

  public ListarPerfil(idNivel: number = this.FormBusqueda.get('cboBusqNivel').value===null?0:this.FormBusqueda.get('cboBusqNivel').value,
    estado: string = this.FormBusqueda.get('cboBusqEstado').value) {
    this.dataHidden();
    this.perfilService.ListarPerfil(idNivel,estado, 'all','all', '1')
      .subscribe(
        data => {
          this.dataSource.data = data as Perfil[];
          this.dataVisible();
        },
        error => this.dataVisible());
  }

  public dataVisible() {
    this.renderer.addClass(this.rowLoading.nativeElement,"displayData");
    this.renderer.removeClass(this.rowData.nativeElement,"displayData");
  }

  public dataHidden() {
    this.renderer.removeClass(this.rowLoading.nativeElement,"displayData");
    this.renderer.addClass(this.rowData.nativeElement,"displayData");
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public closeCssModal() {
    this.renderer.removeClass(this.modalRegistros.nativeElement,"show-sidebar-modal");
    this.funcionesService.changeClaseModal();
  }
  public openCssModal() {
    this.renderer.addClass(this.modalRegistros.nativeElement,"show-sidebar-modal");
    this.funcionesService.changeClaseModal();
  }
  public resetModal() {
    this.FormModal.reset();
  }
  public closeModal() {
    this.closeCssModal();
    this.resetModal();
  }
  public openModal() {
    this.tipoTransaccionModal = 1;
    this.codigoModal = false;
    this.titleModal = "Nuevo Registro"
    this.openCssModal();
  }

  public editarModulo(id: number) {
    this.tipoTransaccionModal = 2;
    this.perfilService.viewPerfil(id)
      .subscribe(
        data => {
          this.codigoModal = true;
          this.titleModal = "Editar Registro";
          this.FormModal.get('cntrlMantIdPerfil').setValue(data.idperfil);
          this.FormModal.get('cntrlMantDescPerfil').setValue(data.descperfil);
          this.FormModal.get('cntrlMantEstadoPerfil').setValue(data.estado);
          this.FormModal.get('cntrlMantNivel').setValue(data.nivel.idnivel);
        },
        error => console.log(error));
    this.openCssModal();
  }

  public cambiarEstado(idPerfil: number, estado: string) {
    let nameTextModal = "";
    if(estado === "A"){
      nameTextModal = "activar";
    }else if(estado === "I"){
      nameTextModal = "inactivar";
    }
    Swal.fire({
      title: '¿Desea '+nameTextModal+' el registro?',
      text: 'Por favor confirme!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, deseo actualizar!',
      cancelButtonText: 'Cancelar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.value) {
        this.perfil.idperfil = idPerfil;
        this.perfil.nivel = new Nivel;
        this.perfil.nivel.idnivel = 0;
        this.perfil.descperfil = "null";
        this.perfil.estado = estado;
        this.perfilService.TransaccionPerfil(this.perfil,3)
          .subscribe(
            data => {
              if(data !== null){
                Swal.fire(
                  'Transacción!',
                  data.estado===1?data.mensaje:data.estado===5?data.mensaje:data.mensajebd,
                  data.estado===1?"success":data.estado===5?"warning":"error"
                )
                if(data.estado === 1){
                  this.ListarPerfil(
                    this.FormBusqueda.get('cboBusqNivel').value===null?0:this.FormBusqueda.get('cboBusqNivel').value,
                    this.FormBusqueda.get('cboBusqEstado').value
                  );
                }
              }else{
                Swal.fire(
                  'Transacción!',
                  'Error en el envío de información.',
                  'error'
                )
              }
            },
            error => console.log(error));
      // For more information about handling dismisals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado!',
          'Tu información está segura :)',
          'error'
        )
      }
    })
  }

  public grabarData(){
    this.closeCssModal();
    let nameTextModal = "";
    if(this.tipoTransaccionModal === 1){
      nameTextModal = "grabar";
    }else if(this.tipoTransaccionModal === 2){
      nameTextModal = "actualizar";
    }
    Swal.fire({
      title: '¿Desea '+nameTextModal+' el registro?',
      text: 'Por favor confirme!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, deseo grabar!',
      cancelButtonText: 'Cancelar!',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.value) {
        this.perfil.idperfil = this.tipoTransaccionModal===1?0:this.FormModal.get('cntrlMantIdPerfil').value;
        this.perfil.descperfil = this.FormModal.get('cntrlMantDescPerfil').value;
        this.perfil.estado = this.tipoTransaccionModal===1?"A":this.FormModal.get('cntrlMantEstadoPerfil').value;
        this.perfil.nivel = new Nivel
        this.perfil.nivel.idnivel = this.FormModal.get('cntrlMantNivel').value;
        this.perfilService.TransaccionPerfil(this.perfil,this.tipoTransaccionModal)
          .subscribe(
            data => {
              if(data !== null){
                Swal.fire({
                  title: 'Transacción!',
                  text: data.estado===1?data.mensaje:data.estado===5?data.mensaje:data.mensajebd,
                  icon: data.estado===1?"success":data.estado===5?"warning":"error",
                  showCancelButton: data.estado===1?false:true,
                  confirmButtonText: 'Ententido!',
                  cancelButtonText: data.estado===1?'':'Regresar!',
                }).then((result) => {
                  if (result.value) {
                    if(data.estado === 1){
                      this.ListarPerfil(
                        this.FormBusqueda.get('cboBusqNivel').value===null?0:this.FormBusqueda.get('cboBusqNivel').value,
                        this.FormBusqueda.get('cboBusqEstado').value
                      );
                    }
                    this.resetModal();
                  }else{
                    this.openCssModal();
                  }
                })
              }else{
                Swal.fire(
                  'Transacción!',
                  'Error en el envío de información.',
                  'error'
                )
              }
            },
            error => console.log(error));
      // For more information about handling dismisals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.openCssModal();
      }
    })
  }

}
