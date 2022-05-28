import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Nivel} from '../model/Nivel';
import { environment } from '../../environments/environment';

@Injectable(
   {providedIn: 'root'}
  )
export class NivelService {

  constructor(private http: HttpClient) {
  }

  ListarNivel(estado: string, pagStart: string, pagLength: string, orderBy: string): Observable<any> {
    return this.http.get<Nivel>(`${environment.baseURL}/nivel/listar/${estado}/${pagStart}/${pagLength}/${orderBy}`)
  }

  CantidadNivel(estado: string): Observable<any> {
    return this.http.get<Nivel>(`${environment.baseURL}/nivel/cantidad/${estado}`);
  }

  viewNivel(idNivel: number): Observable<any> {
    return this.http.get<Nivel>(`${environment.baseURL}/nivel/view/${idNivel}`);
  }

  TransaccionNivel(nivel: Nivel, operacion: number): Observable<any> {
    if(operacion === 1){
      return this.http.post<Nivel>(`${environment.baseURL}/nivel/save/`,nivel);
    }
    else if(operacion === 2 || operacion === 3){
      return this.http.put<Nivel>(`${environment.baseURL}/nivel/update/${operacion}`,nivel);
    }
    else{
      return null;
    }
  }

}
