import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable
({
  providedIn: 'root'
})
export class SearchService 
{

  constructor( private http: HttpClient ) { }

  get token(): string 
  {
    return localStorage.getItem('token') || '';
  }

  buscar( tabla: 'usuarios'|'productos'|'categorias', campo: string = 'email', termino: string )
  {
    return this.http.get<any[]>( `${ base_url }/search/${ tabla }/${ campo }/${ termino }` )
      .pipe 
      (
        map
        (
          ( resp: any ) => resp.data
        )
      );
  }


}
