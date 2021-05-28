// Terceros
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

// Propios
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent 
{
  loginForm: FormGroup = this.fb.group
  ({
    // campo: [Valor defecto, validaciones, validaciones asíncronas]
    email: [ '', [ Validators.required, Validators.email ]],
    password: [ '', Validators.required ]
  });

  constructor
  ( 
    private router: Router, 
    private fb: FormBuilder,
    private authService: AuthService
  ) { }

  // Evalúa si un campo del formulario es válido o no.
  validar( campo: string )
  {
    return this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched
  }

  login()
  {
    if ( this.loginForm.invalid )
    {
      this.loginForm.markAllAsTouched();
    }
    else 
    {
      this.authService.login( this.loginForm.value )
      .subscribe 
      ( 
        resp => 
        { 
          this.router.navigateByUrl('/dashboard'); 
        },
        (err) => 
        { 
          Swal.fire('No se logró iniciar sesión', err.error.msg, 'error'); 
        }
      )
    }
  }
}
