import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { ProductoData } from '../interfaces/producto.interface';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ProductosService 
{

  public productos = [];

  constructor( private http:HttpClient) { }

  // Crear un producto
  crearProducto( data: ProductoData )
  {
    //@ts-ignore
    delete data.imagen;
    return this.http.post(`${ base_url }/productos`, data);
  }

  // Obtener todos los productos
  obtenerProductos( categoria: number = 0, estado: string = 'true', desde: number = 0, limite: number = 40 )
  {
    const restriccionCategoria = ( categoria === 0)? 'false' : categoria ;

    return this.http.get(`${ base_url }/productos?categoria=${ restriccionCategoria }&desde=${ desde }&limite=${ limite }&estado=${ estado }`)
      .pipe
      (
        map( (resp: any) => 
        {
          this.productos = resp.data;
          return  resp;
        })
      );

  }

  // Obtener un solo producto
  obtenerProducto( id_producto: number, estado: string = 'true' )
  {

    return this.http.get(`${ base_url }/productos/${ id_producto }?estado=${ estado }`)
      .pipe
      (
        map( (resp: any) => 
        {
          return resp.data;
        })
      );

  }

  // Actualizar un producto
  actualizarProducto( data: ProductoData, id_producto: number )
  {
    //@ts-ignore
    delete data.imagen;
    return this.http.put(`${ base_url }/productos/${ id_producto }`, data);
  }

  // Eliminar producto
  eliminarProducto( id_producto: number )
  {
    return this.http.delete(`${ base_url }/productos/${ id_producto }`)
      .pipe
      (
        map( (data:any) => {return data.ok} )
      );
  }

  // Activar producto
  activarProducto( id_producto: number, id_categoria: number )
  {
    return this.http.put(`${ base_url }/productos/${ id_producto }`, { estado: true, id_categoria })
      .pipe
      (
        map( (data:any) => {return data.ok} )
      );
  }

}
