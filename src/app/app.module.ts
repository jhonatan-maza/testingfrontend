import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponent } from './app-routing.module';
import { AuthGuard } from './guard/auth.guard';
import { LoginGuard } from './guard/login.guard';
import { AppComponent } from './app.component';

import { httpInterceptorProviders } from './interceptor/auth-interceptor.service';
import { ErrorDialogService } from './interceptor/errordialog.service';
import { httpErrorInterceptorProviders } from './interceptor/HttpErrorInterceptor.service';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
// import { AutocompleteLibModule } from 'angular-ng-autocomplete';
// import { ToastrModule, ToastrService } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    routingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule
    // AutocompleteLibModule,
    // ToastrModule.forRoot({
    //   timeOut: 5000,
    //   positionClass: 'toast-bottom-right',
    //   preventDuplicates: true,
    //   progressBar: true,
    //   progressAnimation: 'increasing'
    // })
    // SidebarModule.forRoot()
  ],
  providers: [
    AuthGuard,
    LoginGuard,
    ErrorDialogService,
    httpInterceptorProviders,
    httpErrorInterceptorProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
