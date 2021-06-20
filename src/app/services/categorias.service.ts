import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService 
{

  public categorias = [];

  constructor( private http:HttpClient ) { }

  obtenerCategorias( estado: string = 'true' )
  {

    return this.http.get(`${ base_url }/categorias?estado=${ estado }`)
      .pipe
      (
        map( (resp: any) => 
        {
          this.categorias = resp.data;
          return resp.data;
        })
      );

  }

}
