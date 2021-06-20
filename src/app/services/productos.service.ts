import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ProductosService 
{

  public productos = [];

  constructor( private http:HttpClient) { }

  // Obtener todos los productos
  obtenerProductos( categoria: number = 0, estado: string = 'true' )
  {


    const restriccionCategoria = ( categoria === 0)? 'false' : categoria ;

    return this.http.get(`${ base_url }/productos?categoria=${ restriccionCategoria }&estado=${ estado }`)
      .pipe
      (
        map( (resp: any) => 
        {
          this.productos = resp.data;
          return resp.data;
        })
      );

  }

  // Obtener un solo producto
  obtenerProducto( id: number, estado: string = 'true' )
  {

    return this.http.get(`${ base_url }/productos/${ id }?estado=${ estado }`)
      .pipe
      (
        map( (resp: any) => 
        {
          return resp.data;
        })
      );

  }
}
