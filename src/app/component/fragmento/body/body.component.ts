import { HostListener } from "@angular/core";
import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ElementRef, TemplateRef, Renderer2} from '@angular/core';


import { FuncionesService } from '../../../service/funciones.service';


import { Config } from '../menu/types';

import { FormControl } from '@angular/forms';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html'
  // styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit, AfterViewInit {
  allSpinner: boolean = false;
  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  position = new FormControl(this.positionOptions[0]);

  @ViewChild('content') content:ElementRef;
  // @ViewChild('contentFooter') contentFooter:ElementRef;
  @ViewChild('menuData') menuData:ElementRef;
  @ViewChild('overlay') overlay:ElementRef;
  overNormal :boolean = true;
  @ViewChild('overlayfijo') overlayfijo:ElementRef;
  overFijo:boolean = false;

  options: Config = { multi: false };
  siderM : boolean = false;
  valor_contMenu: boolean = false;
  contMenu: boolean = true;
  claseVerMenu: string = "fa fa-expand"
  nameToltip: string = "Expandir Menu"

  nameOpenModal:string = "";
  nameUbicacionMenu:string = "";

  scrHeight:any;
  scrWidth:any;
  @HostListener('window:resize', ['$event'])
    getScreenSize(event?) {
          // this.scrHeight = window.innerHeight;
          this.scrWidth = window.innerWidth;
          this.valor_contMenu === false && this.scrWidth > 992 ? this.contMenu = true : this.contMenu = false;
          this.siderM === true && this.scrWidth > 992 ? this.ocultarSiderBar() : "";
    }
  constructor(
    private funcionesService: FuncionesService,
    private renderer: Renderer2
  ) {
    this.getScreenSize();
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    this.funcionesService.changeNameMenu.subscribe(nameUbiMenu => {
      this.nameUbicacionMenu = nameUbiMenu;
    });
    this.funcionesService.changeSider.subscribe(isOpenSider => {
      if( isOpenSider === true ) {
        this.siderM = isOpenSider;
        this.nameOpenModal = "MENU"
        this.openSiderBarMenu()
      }
    });
    this.funcionesService.changeModal.subscribe(isOpen => {
      if( isOpen === true ) {
        this.siderM = false;
        this.nameOpenModal = "";
        this.renderer.addClass(this.overlay.nativeElement,"show-overlay-sidebar");
      }else {
        this.renderer.removeClass(this.overlay.nativeElement,"show-overlay-sidebar");
      }
    });
    this.funcionesService.changeModalFijo.subscribe(isOpenModalFijo => {
      if( isOpenModalFijo === true ) {
        this.overNormal = false;
        this.overFijo = true;
        setTimeout(() => {
          this.renderer.addClass(this.overlayfijo.nativeElement,"show-overlay-sidebar");
        }, 500);
      }else {
        this.renderer.removeClass(this.overlayfijo.nativeElement,"show-overlay-sidebar");
        setTimeout(() => {
          this.overNormal = true;
          this.overFijo = false;
        }, 500);
      }
    });
  }

  openSiderBarMenu() {
    this.renderer.addClass(this.menuData.nativeElement,"show-sidebar-menu");
    this.renderer.addClass(this.overlay.nativeElement,"show-overlay-sidebar");
  }

  ocultarSiderBar() {
    this.renderer.removeClass(this.menuData.nativeElement,"show-sidebar-menu");
    this.renderer.removeClass(this.overlay.nativeElement,"show-overlay-sidebar");
    this.funcionesService.changeResetMenu();
    this.siderM = false;
    if( this.nameOpenModal !== "MENU") {
      this.funcionesService.changeCerrarClaseModal();
    }
  }

  verMenu() {
    this.valor_contMenu = !this.valor_contMenu;
    if ( this.valor_contMenu === true ) {
      this.renderer.removeClass(this.content.nativeElement,"content-wrapper");
      this.renderer.addClass(this.content.nativeElement,"content-wrapper-full");
      // this.renderer.removeClass(this.contentFooter.nativeElement,"page-footer");
      // this.renderer.addClass(this.contentFooter.nativeElement,"page-footer-full");
      this.contMenu = false;
      this.claseVerMenu = "fa fa-compress";
      this.nameToltip = "Contraer Menu"
    } else {
      this.renderer.addClass(this.content.nativeElement,"content-wrapper");
      this.renderer.removeClass(this.content.nativeElement,"content-wrapper-full");
      // this.renderer.addClass(this.contentFooter.nativeElement,"page-footer");
      // this.renderer.removeClass(this.contentFooter.nativeElement,"page-footer-full");
      this.contMenu = true;
      this.claseVerMenu = "fa fa-expand";
      this.nameToltip = "Expandir Menu"
      this.funcionesService.changeResetMenu();
    }
  }

}
