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

  private transactionData =
  {
    acceptance_token: "eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MSwicGVybWFsaW5rIjoiaHR0cHM6Ly93b21waS5jby93cC1jb250ZW50L3VwbG9hZHMvMjAxOS8wOS9URVJNSU5PUy1ZLUNPTkRJQ0lPTkVTLURFLVVTTy1VU1VBUklPUy1XT01QSS5wZGYiLCJmaWxlX2hhc2giOiIzZGNkMGM5OGU3NGFhYjk3OTdjZmY3ODExNzMxZjc3YiIsImppdCI6IjE2MjY4MDYyOTMtMTIxMjEiLCJleHAiOjE2MjY4MDk4OTN9.t5c-LGWhuIT_dh7fT4JMOGYhJmIRUUkNr5HhwHzpS6Q",
    amount_in_cents: 5000000,
    currency: "COP",
    customer_email: "linuxmtasa@hotmail.com",
    payment_method: 
    {
      type: "CARD",
      token: "tok_test_10968_958a46300b9dFa4f378303edED12B761",
      installments: 1
    },
    redirect_url: "https://mitienda.com.co/pago/resultado",
    reference: "3",
    customer_data: 
    {
      phone_number: "573106485722",
      full_name: "Daniel Salazar"
    },
    shipping_address: 
    {
      address_line_1: "Calle 48 #53 69",
      address_line_2: "Apartamento 502, Torre I",
      country: "CO",
      region: "Antioquia",
      city: "Bello",
      name: "Daniel Salazar",
      phone_number: "573106485722"
    }
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

  transaccionTarjeta( data = this.transactionData )
  {
    return this.http.post(`${ this.wompi_url }/transactions`, data, 
    { 
      headers:  
      {
        'Authorization': `Bearer ${ this.wompi_token }`
      }
    });
  }

  verifyTransactionStatus( transactionId = 1 )
  {
    return this.http.get(`${ this.wompi_url }/transactions/${ transactionId }` );
  }


}
