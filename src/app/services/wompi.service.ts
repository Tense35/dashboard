import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WompiService 
{

  public wompi_url = environment.wompi_url;
  public wompi_token = environment.wompi_token;

  // Data para pruebas
  private tokenCardData = 
  { 
    number: "4242424242424242", 
    cvc: "123", 
    exp_month: "08", 
    exp_year: "28", 
    card_holder: "José Pérez" 
  }

  private tokenNequiData = 
  {
    phone_number: "3106485722"
  }

  constructor( private http: HttpClient ) { }

  tokenAceptacion()
  {
    return this.http.get(`${ this.wompi_url }/merchants/${ this.wompi_token }`)
      .pipe
      (
        map( (resp: any) => 
        {
          return resp.data.presigned_acceptance;
        })
      );
  }

  tokenTarjeta( data = this.tokenCardData )
  {
    return this.http.post(`${ this.wompi_url }/tokens/cards`, data, 
    { 
      headers:  
      {
        'Authorization': `Bearer ${ this.wompi_token }`
      }
    });
  }


}
