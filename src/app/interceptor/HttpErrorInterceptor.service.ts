import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor} from '@angular/common/http';
import { throwError } from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import { ErrorDialogService } from '../interceptor/errordialog.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private errorDialogService: ErrorDialogService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Error del cliente: ${error.error.message}`;
        } else {
          // backend error
          errorMessage = `Error del Servidor: ${error.status} | ${error.message}`;
        }

        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        this.errorDialogService.openDialog(errorMessage);
        return throwError(errorMessage);
      })
    );
  }
}

export const httpErrorInterceptorProviders = [
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
];
