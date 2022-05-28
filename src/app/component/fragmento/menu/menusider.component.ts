import { Component, OnInit, AfterViewInit, AfterContentInit  } from '@angular/core';
import { Input, ViewChild, ElementRef, TemplateRef, HostBinding, Renderer2} from '@angular/core';
import { TokenStorageService } from '../../../auth/token-storage.service';
import { FuncionesService } from '../../../service/funciones.service';

import { Config, Menu } from './types';

@Component({
  selector: 'app-menusider',
  templateUrl: './menusider.component.html',
  // styleUrls: ['../body/body.component.css']
})
export class MenuSiderComponent implements OnInit, AfterViewInit  {
  info: any;
  isLoggedIn = false;

  @Input() options;
  config: Config;

  submenuScrollHeight: number = 51;
  tsubmenuScrollHeight: number = 0;

  constructor(
    private tokenStorage: TokenStorageService,
    private funcionesService: FuncionesService,
    private renderer: Renderer2
    ) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }
    this.info = {
      username: this.tokenStorage.getUsername(),
      authorities: this.tokenStorage.getAuthorities()
    };
  }

  ngAfterViewInit(): void {
  }

}
