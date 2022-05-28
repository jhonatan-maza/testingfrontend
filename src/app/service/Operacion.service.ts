import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Operacion} from '../model/Operacion';
import { environment } from '../../environments/environment';

@Injectable(
   {providedIn: 'root'}
  )
export class OperacionService {

  constructor(private http: HttpClient) {
  }

  ListarOperacion(estado: string, pagStart: string, pagLength: string, orderBy: string): Observable<any> {
    return this.http.get<Operacion>(`${environment.baseURL}/operacion/listar/${estado}/${pagStart}/${pagLength}/${orderBy}`)
  }

  viewOperacion(idOperacion: number): Observable<any> {
    return this.http.get<Operacion>(`${environment.baseURL}/operacion/view/${idOperacion}`);
  }

  TransaccionOperacion(operacion: Operacion, nroOperacion: number): Observable<any> {
    if(nroOperacion === 1){
      return this.http.post<Operacion>(`${environment.baseURL}/operacion/save/`,operacion);
    }
    else if(nroOperacion === 2 || nroOperacion === 3){
      return this.http.put<Operacion>(`${environment.baseURL}/operacion/update/${nroOperacion}`,operacion);
    }
    else{
      return null;
    }
  }

}
