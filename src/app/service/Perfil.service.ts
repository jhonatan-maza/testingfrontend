import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Perfil} from '../model/Perfil';
import { environment } from '../../environments/environment';

@Injectable(
   {providedIn: 'root'}
  )
export class PerfilService {

  constructor(private http: HttpClient) {
  }

  ListarPerfil(idNivel: number, estado: string, pagStart: string, pagLength: string, orderBy: string): Observable<any> {
    return this.http.get<Perfil>(`${environment.baseURL}/perfil/listar/${idNivel}/${estado}/${pagStart}/${pagLength}/${orderBy}`)
  }

  viewPerfil(idPerfil: number): Observable<any> {
    return this.http.get<Perfil>(`${environment.baseURL}/perfil/view/${idPerfil}`);
  }

  TransaccionPerfil(perfil: Perfil, operacion: number): Observable<any> {
    if(operacion === 1){
      return this.http.post<Perfil>(`${environment.baseURL}/perfil/save/`,perfil);
    }
    else if(operacion === 2 || operacion === 3){
      return this.http.put<Perfil>(`${environment.baseURL}/perfil/update/${operacion}`,perfil);
    }
    else{
      return null;
    }
  }

}
