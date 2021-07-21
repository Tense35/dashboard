import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WompiService } from '../../services/wompi.service';
import { TokenAceptacionWompi } from '../../interfaces/wompi.interface';
import { ShopService } from '../../services/shop.service';
import Swal from 'sweetalert2';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit 
{

  public tarjetaFrente = true;
  

  public steps = ["Información personal", "Datos de envío", "Realizar pago"];
  public pag = 0;

  public interval: any;

  // Data
  public tokenTerminos: TokenAceptacionWompi = {acceptance_token: '', permalink: '', type: ''};

  // Formularios
  public personalesForm: FormGroup;
  public envioForm: FormGroup;
  public pagoForm: FormGroup;
  

  // Años
  public cardYears: string[];

  // Pattern
  emailPattern: string = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  // Campos
  public personalesCampos = ['tipo_id', 'id_cliente', 'nombre', 'celular', 'email'];
  public envioCampos = ['municipio', 'barrio', 'tempDireccion'];
  public pagoCampos = ['number', 'card_holder', 'exp_month', 'exp_year', 'cvc', 'terms'];

  // Pruebas


  constructor( private fb:FormBuilder, private wompiService: WompiService, private shopService: ShopService, private emailService: EmailService ) 
  { 
    this.cardYears = this.getYears();

    this.personalesForm = this.fb.group
    ({
      tipo_id: ['CC', Validators.required ],
      id_cliente: ['1.001.250.399', [Validators.required, Validators.pattern('[0-9.]{9,14}')] ],
      nombre: ['Daniel Salazar', [Validators.required, Validators.pattern('[a-zA-Z ]{10,50}')] ],
      celular: ['3106485722', [Validators.required, Validators.pattern('[0-9]{10}')] ],
      email: ['linuxmtasa@hotmail.com', [Validators.required, Validators.pattern(this.emailPattern)] ],
    });

    this.envioForm = this.fb.group
    ({
      municipio: ['Bello', [Validators.required] ],
      barrio: ['Central', [Validators.required, Validators.minLength(3)] ],
      tempDireccion: ['Calle 48 #53-69', [Validators.required, Validators.minLength(3)] ],
    });

    this.pagoForm = this.fb.group
    ({
      payment_method_type: ['NEQUI', [Validators.required] ],
      number: ['4242424242424242', [Validators.required, Validators.minLength(16)] ],
      card_holder: ['Daniel Salazar', [Validators.required, Validators.pattern('[a-zA-Z ]{10,40}')] ],
      exp_month: ['02', Validators.required ],
      exp_year: ['25', Validators.required ],
      cvc: ['142', [Validators.required, Validators.pattern('[0-9.]{3}')] ],
      terms: ['true', [Validators.required] ],
    });

    
  }
  
  
  ngOnInit() 
  {
    // Obtener token de Aceptación - Wompi
    this.wompiService.tokenAceptacion().subscribe( resp => this.tokenTerminos = resp );
    // this.wompiService.tokenTarjeta().subscribe( resp => this.tokenizacion = resp );
  }


  // Obtener los años siguientes al actual para el campo de "Año"
  getYears() 
  {
    const yearActual = new Date().getFullYear();
    let j = 0;
    let years = [];
    for ( let i = yearActual; i <= yearActual + 8; i++)
    {
      years[j] = i.toString().slice(-2);
      j++;
    }
    return years;
  }

  // Expresiones regulares para algunas validaciones
  regex( expresion: number, campo: string, form: string = "personalesForm" )
  {
    // @ts-ignore
    let valor = ( this[form].get(campo).value ).toString();

    switch(expresion)
    {
      // Formato de miles
      case 1: 
        valor = valor.replace(/\s/g, '').replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.').trim();
      break;

      // No letras, no espacios
      case 2: 
        valor = valor.replace(/\s/g, '').replace(/\D/g, '').trim();
      break;
    }

    // @ts-ignore
    this[form].controls[campo].setValue( valor );
  }

  // Validar formularios
  validar( campo: string, form: string = "personalesForm" )
  {
    // @ts-ignore
    return this[form].controls[campo].errors && this[form].controls[campo].touched;
  }

  // Comprobar las validaciones 
  revisarValidaciones(form: string)
  {
    let array;

    switch(form)
    {
      case 'personalesForm':
        array = 'personalesCampos';
      break;

      case 'envioForm':
        array = 'envioCampos';
      break;

      case 'pagoForm':
        array = 'pagoCampos';
      break;

      default:
        return;
      break;
    }

    // @ts-ignore
    this[array].forEach( campo => 
    {
      this[form].controls[campo].markAsTouched();
    });
  }
  
  // Cambiar de formulario
  nextStape( form: string )
  {
    this.revisarValidaciones(form);
    console.log(this.pag);

    if ( this.pag == 2 && this.pagoForm.valid )
    {

      console.log(this.personalesForm.value);
      console.log(this.envioForm.value);
      console.log(this.pagoForm.value);

      const cardData = 
      {
        "number": this.pagoForm.get('number')?.value,
        "cvc": this.pagoForm.get('cvc')?.value,
        "exp_month": this.pagoForm.get('exp_month')?.value,
        "exp_year": this.pagoForm.get('exp_year')?.value,
        "card_holder": this.pagoForm.get('card_holder')?.value
      }

      this.wompiService.tokenTarjeta(cardData)
        .subscribe
        ( 
          (resp: any) => 
          {
            const others =
            {
              acceptance_token: this.tokenTerminos.acceptance_token,
              total: this.shopService.getTotalInCents(),
              token_card: resp.data.id
            }

            const transactionData = this.transactionOrder(this.personalesForm.value, this.envioForm.value, this.pagoForm.value, others );
            this.wompiService.transaccionTarjeta(transactionData).subscribe( (resp: any) => 
            {
              console.log(resp);
              Swal.fire('Información', `Su compra está siendo procesada y su estado es: ${ resp.data.status }. La referencia de su pedido es: ${ resp.data.id }, guarde esta referencia y puede consultar el estado de la transacción en el área de "Mi pedido"`, 'info');
              this.emailService.enviarEmail( resp.data.customer_email, `Apreciado ${ resp.data.customer_data.full_name }, le informamos que se que se está procesando la transacción de su compra y podrá verificar el estado de la transferencia en nuestro sitio web en la pestaña "Mi pedido". Su código de referencia es: ${ resp.data.id }` ).subscribe( resp => console.log(resp));
            })
          }, 
          error => 
          { 
            console.log(error.error.error.messages.number[0])
            Swal.fire('Compra', `${ error.error.error.messages.number[0] }`, 'error');
            return;
          });
      
    }

    // @ts-ignore
    if ( this.pag < this.steps.length-1 && this[form].valid )
    {
      this.pag+=1;
    }
  }

  transactionOrder( personal: any, adress: any, pay: any, varios: any )
  {
    const data = 
    {
      acceptance_token: varios.acceptance_token,
      amount_in_cents: varios.total,
      currency: "COP",
      customer_email: personal.email,
      payment_method:
      {
        type: "CARD",
        token: (varios.token_card.toString()),
        installments: 1
      },
      redirect_url: "https://mitienda.com.co/pago/resultado",
      reference: (Math.round(Math.random()*1000000)).toString(),
      customer_data: 
      {
        phone_number: personal.celular,
        full_name: personal.nombre
      },
      shipping_address:
      {
        address_line_1: adress.tempDireccion,
        address_line_2: "No especificada",
        country: "CO",
        region: "Antioquia",
        city: adress.municipio,
        name: personal.nombre,
        phone_number: personal.celular
      }
    }

    return data;
  }

}
