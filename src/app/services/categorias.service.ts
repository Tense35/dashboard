// Terceros
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

// Propios
import { CategoriaData } from '../interfaces/categoria.interface';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CategoriasService 
{

  public categorias = [];

  constructor( private http:HttpClient ) { }

  // Crear una categoría
  crearCategoria( data: CategoriaData)
  {
    return this.http.post(`${ base_url }/categorias`, data);
  }

  // Editar categoría
  actualizarCategoria( data: CategoriaData, id_categoria: number )
  {
    return this.http.put(`${ base_url }/categorias/${ id_categoria }`, data);
  }

  // Obtener todas las categorías
  obtenerCategorias( desde:number = 0, limite: number = 10, estado = false )
  {

    return this.http.get(`${ base_url }/categorias?estado=${ estado }`)
      .pipe
      (
        map( (resp: any) => 
        {
          this.categorias = resp.data;
          return resp;
        })
      );

  }

  // Eliminar una categoría
  eliminarCategoria( id_categoria: number )
  {
    return this.http.delete(`${ base_url }/categorias/${ id_categoria }`)
      .pipe
      (
        map( ( data:any ) => { return data.ok } )
      );
  }

  // Activar una categoría
  activarCategoria( id_categoria: number )
  {
    return this.http.put(`${ base_url }/categorias/${ id_categoria }`, { estado: true })
      .pipe
      (
        map( ( data:any ) => { return data.ok } )
      );
  }

}
