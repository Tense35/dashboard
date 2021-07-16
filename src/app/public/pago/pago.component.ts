import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WompiService } from '../../services/wompi.service';
import { TokenAceptacionWompi } from '../../interfaces/wompi.interface';

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


  constructor( private fb:FormBuilder, private wompiService: WompiService ) 
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
      payment_method_type: ['', [Validators.required] ],
      number: ['', [Validators.required, Validators.minLength(16)] ],
      card_holder: ['', [Validators.required, Validators.pattern('[a-zA-Z ]{10,40}')] ],
      exp_month: ['', Validators.required ],
      exp_year: ['', Validators.required ],
      cvc: ['', [Validators.required, Validators.pattern('[0-9.]{3}')] ],
      terms: ['', [Validators.required, Validators.requiredTrue] ],
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

    // @ts-ignore
    if ( this.pag < this.steps.length && this[form].valid )
    {
      this.pag+=1;
    }
  }

}
