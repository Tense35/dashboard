import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class EmailService 
{

  constructor( private http: HttpClient) { }

  enviarEmail( to: string, text: string )
  {
    return this.http.post(`${ base_url }/emails`, { to, text });
  }

}
