// Terceros
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from "rxjs/operators";

// Propios
import { LoginForm } from '../interfaces/login-form';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario.model';

const base_url = environment.base_url;

@Injectable
({
  providedIn: 'root'
})
export class AuthService
{
  // @ts-ignore
  public usuario: Usuario = new Usuario();

  constructor( private http: HttpClient, private router: Router ) 
  { 

  }

  get token()
  {
    return localStorage.getItem('token') || '';
  }

  login( formData: LoginForm )
  {
    return this.http.post(`${ base_url }/auth`, formData)
      .pipe
      (
        tap( (resp: any) => 
        {
          localStorage.setItem('token', resp.token);
        })
      )
  }

  validarToken( ): Observable<boolean>
  { 
    return this.http.get(`${ base_url }/auth/renew`, 
    { 
      headers: 
      {
        'x-token': this.token
      }
    }).pipe 
    (
      map( ( resp: any ) => 
      {
        const { email, nombre, estado, imagen } = resp.data;
        this.usuario = new Usuario(email, nombre, estado, imagen);
        localStorage.setItem('token', resp.token);
        return true;
      }),
      catchError( error => of(false) )
    );
  }

  logout()
  {
    localStorage.removeItem('token');
    this.router.navigateByUrl('/login');
  }

}
