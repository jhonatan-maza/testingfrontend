import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ElementRef, TemplateRef, Renderer2} from '@angular/core';
import { OperacionService } from '../../../../../service/Operacion.service';
import { FuncionesService } from '../../../../../service/funciones.service';
import { Operacion } from '../../../../../model/Operacion';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-operacion',
  templateUrl: './operacion.component.html'
})
export class OperacionComponent implements OnInit, AfterViewInit {

  @ViewChild('modalRegistros') modalRegistros:ElementRef;
  @ViewChild('rowLoading') rowLoading:ElementRef;
  @ViewChild('rowData') rowData:ElementRef;

  // Controles de Mantenimiento
  FormBusqueda: FormGroup;
  FormModal: FormGroup;
  titleModal = "Nuevo Registro";
  tipoTransaccionModal : number = 0;
  codigoModal: boolean = false;

  operacion: Operacion;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('PAGINATOR_OPERACION') paginatorOperacion: MatPaginator;
  dataSource = new MatTableDataSource<Operacion>();
  displayedColumns: string[] = ['acciones', 'idoperacion', 'descoperacion'];
  viewDataSourceOperacion = Operacion;

  constructor(
    private operacionService: OperacionService,
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
    this.operacion = new Operacion();
    this.funcionesService.changeNombreMenu("CONFIGURACIÓN - SEGURIDAD");
  }

  ngOnInit() {
    this.FormBusqueda = this.formBuilder.group({
      textName: new FormControl(''),
      cboBusqEstado: new FormControl('A')
    });
    this.FormModal = this.formBuilder.group({
      cntrlMantIdOperacion: new FormControl(''),
      cntrlMantDescOperacion: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      cntrlMantEstadoOperacion: new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    this.ListarOperacion("A");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginatorOperacion;
    this.funcionesService.changeCerrarModal.subscribe(isOpen => {
      if( isOpen === false ) {
        this.renderer.removeClass(this.modalRegistros.nativeElement,"show-sidebar-modal");
        this.resetModal();
      }
    });
  }

  public ListarOperacion(estado: string = this.FormBusqueda.get('cboBusqEstado').value) {
    this.dataHidden();
    this.operacionService.ListarOperacion(estado, 'all','all', '1')
      .subscribe(
        data => {
          this.dataSource.data = data as Operacion[];
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
    this.operacionService.viewOperacion(id)
      .subscribe(
        data => {
          this.codigoModal = true;
          this.titleModal = "Editar Registro";
          this.FormModal.get('cntrlMantIdOperacion').setValue(data.idoperacion);
          this.FormModal.get('cntrlMantDescOperacion').setValue(data.descoperacion);
          this.FormModal.get('cntrlMantEstadoOperacion').setValue(data.estado);
        },
        error => console.log(error));
    this.openCssModal();
  }

  public cambiarEstado(idOperacion: number, estado: string) {
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
        this.operacion.idoperacion = idOperacion;
        this.operacion.descoperacion = "null";
        this.operacion.estado = estado;
        this.operacionService.TransaccionOperacion(this.operacion,3)
          .subscribe(
            data => {
              if(data !== null){
                Swal.fire(
                  'Transacción!',
                  data.estado===1?data.mensaje:data.estado===5?data.mensaje:data.mensajebd,
                  data.estado===1?"success":data.estado===5?"warning":"error"
                )
                if(data.estado === 1){
                  this.ListarOperacion(this.FormBusqueda.get('cboBusqEstado').value);
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
        this.operacion.idoperacion = this.tipoTransaccionModal===1?0:this.FormModal.get('cntrlMantIdOperacion').value;
        this.operacion.descoperacion = this.FormModal.get('cntrlMantDescOperacion').value;
        this.operacion.estado = this.tipoTransaccionModal===1?"A":this.FormModal.get('cntrlMantEstadoOperacion').value;
        this.operacionService.TransaccionOperacion(this.operacion,this.tipoTransaccionModal)
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
                      this.ListarOperacion(this.FormBusqueda.get('cboBusqEstado').value);
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
