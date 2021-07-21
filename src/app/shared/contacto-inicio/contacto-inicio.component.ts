import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contacto-inicio',
  templateUrl: './contacto-inicio.component.html',
  styleUrls: ['./contacto-inicio.component.css']
})
export class ContactoInicioComponent implements OnInit 
{

  public contactForm: FormGroup;

  constructor( private emailService: EmailService, private fb: FormBuilder ) 
  { 
    this.contactForm = this.fb.group
    ({
      email: ['', [Validators.required, Validators.email]],
      nombre: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    })
  }

  ngOnInit(): void 
  {

  }

  enviarEmail()
  {
    const email = this.contactForm.get('email')?.value;
    const nombre = this.contactForm.get('nombre')?.value;
    const mensaje = this.contactForm.get('mensaje')?.value;


    if ( this.contactForm.valid )
    {
      this.emailService.enviarEmail('linuxmtasa@hotmail.com', `Mensaje de: ${ email } | Nombre: ${ nombre } | Mensaje: ${ mensaje }`)
      .subscribe
      ( 
        resp => 
        {
          Swal.fire( 'Formulario', `¡Gracias por contactarse con nosotros, en cuanto podamos le responderemos!`, 'success' );
        }, 
        error => 
        {
          Swal.fire( 'Formulario', `Error en el servidor, será notificado a un administrador`, 'error' );
        }
      )
    }
    else 
    {
      Swal.fire( 'Formulario', `Todos los campos son obligatorios y debe proporcionar un email válido`, 'error' )
    }

  }

}
