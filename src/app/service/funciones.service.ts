import { Injectable, Output, EventEmitter } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { environment } from '../../environments/environment';

@Injectable(
  {providedIn: 'root'}
)
export class FuncionesService {

  nameUbiMenu:string = "";
  @Output() changeNameMenu: EventEmitter<string> = new EventEmitter();

  submenuScrollHeight: number = 51;
  tsubmenuScrollHeight: number = 0;

  isOpen = false;
  @Output() changeModal: EventEmitter<boolean> = new EventEmitter();
  @Output() changeCerrarModal: EventEmitter<boolean> = new EventEmitter();

  isOpenSider = false;
  @Output() changeSider: EventEmitter<boolean> = new EventEmitter();

  isNameModalJerarqXArticulo = "";
  @Output() changeModalJerarqXArt: EventEmitter<string> = new EventEmitter();

  isOpenModalFijo = false;
  @Output() changeModalFijo: EventEmitter<boolean> = new EventEmitter();

  constructor() {
  }

  public changeNombreMenu(name: string) {
    this.nameUbiMenu = name;
    this.changeNameMenu.emit(this.nameUbiMenu);
  }
  /****************************************************************************/
  /****************************************************************************/
  public changeClaseModal() {
    this.isOpen = !this.isOpen;
    this.changeModal.emit(this.isOpen);
  }

  public changeCerrarClaseModal() {
    this.isOpen = false;
    this.changeCerrarModal.emit(this.isOpen);
  }

  public changeMdlFijo() {
    this.isOpenModalFijo = !this.isOpenModalFijo;
    this.changeModalFijo.emit(this.isOpenModalFijo);
  }

  /****************************************************************************/
  /*menu***********************************************************************/
  /****************************************************************************/

  public changeSiderMenu() {
    this.isOpenSider = true;
    // this.isOpenSider = !this.isOpenSider;
    this.changeSider.emit(this.isOpenSider);
  }

  public changeResetMenu() {
    this.isOpenSider = false;
  }

  changeValorHeighMenu(submenu: number, tsubmenu: number) {
    this.submenuScrollHeight = submenu;
    this.tsubmenuScrollHeight = tsubmenu;
  }

  return_submenuScrollHeight() {
    return this.submenuScrollHeight;
  }
  return_tsubmenuScrollHeight() {
    return this.tsubmenuScrollHeight;
  }

  /****************************************************************************/
  /*abrir modal jerarq x articulo***********************************************************************/
  /****************************************************************************/
  public changeJerarqXArticulo(nameModal: string) {
    this.isNameModalJerarqXArticulo = nameModal;
    this.changeModalJerarqXArt.emit(this.isNameModalJerarqXArticulo);
  }

  /*************************************************************************/

  public retornaGetPaginatorData(e:any) {
    let miObjeto: any;
    let calcularPagina;
    // if(e.previousPageIndex === 0 && e.pageIndex > 0 || e.previousPageIndex < e.pageIndex){
    //   calcularPagina = e.pageSize * e.pageIndex;
    //   console.log("a")
    // }
    // else if(e.previousPageIndex > 0 && e.pageIndex === 0){
    //   calcularPagina = 0;
    //   console.log("b")
    // }
    // else if(e.previousPageIndex > e.pageIndex){
    //   // (e.pageSize * e.previousPageIndex) - (e.pageSize * e.pageIndex);
    //   calcularPagina = e.pageSize * e.pageIndex;
    //   console.log("c")
    // }
    // // else if(e.previousPageIndex < e.pageIndex){
    // //   calcularPagina = e.pageSize * e.pageIndex;
    // //   console.log("d")
    // // }
    // else{
    //   calcularPagina = "0";
    // }
    if(e.previousPageIndex > 0 && e.pageIndex === 0){
      calcularPagina = 0;
    }else{
      calcularPagina = e.pageSize * e.pageIndex;
    }
    miObjeto = { 'pagcal': calcularPagina, 'pagesize': e.pageSize };
    return miObjeto;
  }

  // acepta solo numeros
  public onlyNumberKey(event) {
    return (event.charCode == 8 || event.charCode == 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  // acepta solo decimales
  onlyDecimalNumberKey(event) {
    let charCode = (event.which) ? event.which : event.keyCode;
    if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57))
       return false;
    return true;
  }

}
