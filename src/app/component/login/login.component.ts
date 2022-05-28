import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from '../../auth/auth.service';
import { TokenStorageService } from '../../auth/token-storage.service';
import { FuncionesService } from '../../service/funciones.service';
import { AuthLoginInfo } from '../../auth/login-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
  // styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  form: any = {};
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private loginInfo: AuthLoginInfo;

  constructor(
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private funcionesService: FuncionesService,
    private router: Router
    // private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
    }
  }

  onSubmit() {
    this.loginInfo = new AuthLoginInfo(
      this.form.username,
      this.form.password);

    this.authService.attemptAuth(this.loginInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.tokenStorage.saveNameuser(data.nameuser);

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.navigatePage();
      },
      error => {
        // console.log(error);
        this.errorMessage = error.error !== undefined ? error.error.message : error;
        this.isLoginFailed = true;
      }
    );
  }

  navigatePage() {
    this.router.navigateByUrl('/nivel');
    setTimeout(() => {
      window.location.reload();
    }, 100);

  }

}
