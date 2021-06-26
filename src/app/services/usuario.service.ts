// Terceros
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

// Propios
import { AuthService } from './auth.service';
import { ObtenerUsuario, UsuarioData } from '../interfaces/usuarios.interface';
import { Usuario } from '../models/Usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService 
{
  public token = '';
  public ultimaImagen = '';

  constructor( private http: HttpClient, private authService: AuthService ) { 
    this.token = authService.token;
  }

  crearUsuario( data: UsuarioData)
  {
    delete data.imagen;
    return this.http.post(`${ base_url }/usuarios`, data);
  }

  actualizarPerfil( data: UsuarioData, email: string )
  {
    delete data.imagen;
    return this.http.put(`${ base_url }/usuarios/${ email }`, data);
  }

  obtenerUsuarios( desde:number = 0, limite: number = 10, estado = false )
  {
    return this.http.get<ObtenerUsuario>(`${ base_url }/usuarios?desde=${ desde }&limite=${ limite }&estado=${ estado }`, 
    { 
      headers: 
      {  
        'x-token': this.token
      }
    })
      .pipe
      (
        map ( resp => 
        {
          const data = resp.data.map( user => new Usuario( user.email, user.nombre, user.estado, user.imagen ));

          return {
            total: resp.total,
            data
          }
        })
      );
  }

  eliminarUsuario( email: string )
  {
    return this.http.delete(`${ base_url }/usuarios/${ email }`)
      .pipe
      (
        map( (data:any) => {return data.ok} )
      );
  }

  activarUsuario( email: string )
  {
    return this.http.put(`${ base_url }/usuarios/${ email }`, { estado: true })
      .pipe
      (
        map( (data:any) => {return data.ok} )
      );
  }

}
