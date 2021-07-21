import { Component, OnInit } from '@angular/core';
import { WompiService } from '../../services/wompi.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})
export class PedidoComponent implements OnInit 
{

  public consultaForm: FormGroup;

  constructor( private wompiService: WompiService, private fb: FormBuilder ) 
  {
    this.consultaForm = this.fb.group
    ({
      reference: ['', [Validators.required] ]
    })
  }

  ngOnInit(): void 
  {
    
  }

  consultarInformacion()
  {
    
    this.wompiService.verifyTransactionStatus(this.consultaForm.get('reference')?.value)
    .subscribe
    ( 
      (resp: any) => 
      {

        if ( resp.data.status == 'DECLINED')
        {
          Swal.fire( 'Estado de transacción', `El estado de su transacción es: ${ resp.data.status }. Su pedido está a la espera de ser despachado, si tiene algún problema, contacte al email ElizaAdmin@gmail.com o con su banco.`, 'warning' );
        }
        else 
        {
          Swal.fire( 'Estado de transacción', `El estado de su transacción es: ${ resp.data.status }. Si tiene algún problema, contacte al email ElizaAdmin@gmail.com`, 'success' );
        }

      }, 
      error => 
      {
        Swal.fire( 'Estado de transacción', `El identificador de la transacción no es correcto. Si tiene algún problema, contacte al email ElizaAdmin@gmail.com`, 'error' );
      }
    );
    
  }

}
