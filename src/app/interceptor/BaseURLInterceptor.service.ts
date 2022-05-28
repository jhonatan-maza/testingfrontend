// import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
// import { environment } from '../../environments/environment';
//
// @Injectable({ providedIn: 'root' })
// export class BaseURLInterceptorService implements HttpInterceptor {
//
//   intercept(req: HttpRequest<any>, next: HttpHandler) {
//     if (!req.url.match(/^http(s)?:\/\/(.*)$/)) {
//       const url = `${environment.baseURL}${req.url}`.replace(/([^:]\/)\/+/g, '$1');
//       req = req.clone({ url });
//     }
//     return next.handle( req );
//   }
//
// }
//
// export const httpBaseUrlInterceptorProviders = [
//     { provide: HTTP_INTERCEPTORS, useClass: BaseURLInterceptorService, multi: true }
// ];
