import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class FileUploadService 
{

  constructor() { }

  async actualizarImagen( archivo: File, tipo: 'usuarios'|'productos', id: string | number)
  {
    try 
    {
      const url = `${ base_url }/${ tipo }/${ id }`;
      const formData = new FormData();
      formData.append('archivo', archivo);

      const resp = await fetch( url, 
      { 
        method: 'PUT',
        body: formData,  
      });

      const data = await resp.json();

      if ( data.ok )
      {
        return data;
      }
      console.log(data.msg);
      return false;
    }
    catch (error)
    {
      console.log(error);
      return false;
    }
  }
  

}
