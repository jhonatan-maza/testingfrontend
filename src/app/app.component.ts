import { Component } from '@angular/core';
import { TokenStorageService } from './auth/token-storage.service';

// import { ActivatedRoute, Router } from "@angular/router";
// import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isLoggedIn: boolean;

  constructor(
    private tokenStorage: TokenStorageService
    // private router: Router,
    // private route: ActivatedRoute,
    // private location: Location
  )
  {
    this.isLoggedIn = false;
  }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
    }else{
      this.isLoggedIn = false;
      // if ( this.location.path() === '/login' ) {
      //   this.isInicio = false;
      // }else {
      //   this.isInicio = true;
      // }
    }
  }

}
