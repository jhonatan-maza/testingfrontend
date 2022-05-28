import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ElementRef, TemplateRef, Renderer2} from '@angular/core';
import { NivelService } from '../../../../../service/Nivel.service';
import { FuncionesService } from '../../../../../service/funciones.service';
import { Nivel } from '../../../../../model/Nivel';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-nivel',
  templateUrl: './nivel.component.html'
})
export class NivelComponent implements OnInit, AfterViewInit {

  @ViewChild('modalRegistros') modalRegistros:ElementRef;
  @ViewChild('rowLoading') rowLoading:ElementRef;
  @ViewChild('rowData') rowData:ElementRef;

  // Controles de Mantenimiento
  FormBusqueda: FormGroup;
  FormModal: FormGroup;
  titleModal = "Nuevo Registro";
  tipoTransaccionModal : number = 0;
  codigoModal: boolean = false;

  nivel: Nivel;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('PAGINATOR_NIVEL') paginatorNivel: MatPaginator;
  dataSource = new MatTableDataSource<Nivel>();
  displayedColumns: string[] = ['acciones', 'idnivel', 'descnivel'];
  viewDataSourceNivel = Nivel;

  constructor(
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
    this.nivel = new Nivel();
    this.funcionesService.changeNombreMenu("CONFIGURACIÓN - SEGURIDAD");
  }

  ngOnInit() {
    this.FormBusqueda = this.formBuilder.group({
      textName: new FormControl(''),
      cboBusqEstado: new FormControl('A')
    });
    this.FormModal = this.formBuilder.group({
      // cntrlMantIdNivel: new FormControl({value: '', disabled: true}),
      cntrlMantIdNivel: new FormControl(''),
      cntrlMantDescNivel: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]*$/)]),
      cntrlMantEstadoNivel: new FormControl('')
    });
  }

  ngAfterViewInit(): void {
    this.ListarNivel("A");
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginatorNivel;
    this.funcionesService.changeCerrarModal.subscribe(isOpen => {
      if( isOpen === false ) {
        this.renderer.removeClass(this.modalRegistros.nativeElement,"show-sidebar-modal");
        this.resetModal();
      }
    });
  }

  public ListarNivel(estado: string = this.FormBusqueda.get('cboBusqEstado').value) {
    this.dataHidden();
    this.nivelService.ListarNivel(estado, 'all','all', '1')
      .subscribe(
        data => {
          console.log(data)
          this.dataSource.data = data as Nivel[];
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
    this.nivelService.viewNivel(id)
      .subscribe(
        data => {
          this.codigoModal = true;
          this.titleModal = "Editar Registro";
          this.FormModal.get('cntrlMantIdNivel').setValue(data.idnivel);
          this.FormModal.get('cntrlMantDescNivel').setValue(data.descnivel);
          this.FormModal.get('cntrlMantEstadoNivel').setValue(data.estado);
        },
        error => console.log(error));
    this.openCssModal();
  }

  public cambiarEstado(idNivel: number, estado: string) {
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
        this.nivel.idnivel = idNivel;
        this.nivel.descnivel = "null";
        this.nivel.estado = estado;
        this.nivelService.TransaccionNivel(this.nivel,3)
          .subscribe(
            data => {
              if(data !== null){
                Swal.fire(
                  'Transacción!',
                  data.estado===1?data.mensaje:data.estado===5?data.mensaje:data.mensajebd,
                  data.estado===1?"success":data.estado===5?"warning":"error"
                )
                if(data.estado === 1){
                  this.ListarNivel(this.FormBusqueda.get('cboBusqEstado').value);
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
        this.nivel.idnivel = this.tipoTransaccionModal===1?0:this.FormModal.get('cntrlMantIdNivel').value;
        this.nivel.descnivel = this.FormModal.get('cntrlMantDescNivel').value;
        this.nivel.estado = this.tipoTransaccionModal===1?"A":this.FormModal.get('cntrlMantEstadoNivel').value;
        this.nivelService.TransaccionNivel(this.nivel,this.tipoTransaccionModal)
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
                      this.ListarNivel(this.FormBusqueda.get('cboBusqEstado').value);
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
