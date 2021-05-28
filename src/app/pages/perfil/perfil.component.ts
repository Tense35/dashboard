// Terceros
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Propios
import { UsuarioService } from 'src/app/services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../models/Usuario.model';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit 
{

  // @ts-ignore
  public perfilForm: FormGroup;
  // @ts-ignore
  public usuario: Usuario;
  // @ts-ignore
  public archivo: File;
  public imgTemp: any;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private authService: AuthService, private fileUploadService: FileUploadService ) { }

  ngOnInit(): void 
  {
    this.usuario = this.authService.usuario;

    this.perfilForm = this.fb.group
    ({
      nombre: [ this.usuario.nombre, Validators.required ],
      password: ['', [ Validators.required ] ],
      password2: ['', [ Validators.required ] ],
    })

  }

  actualizarPerfil()
  {
    this.perfilForm.markAllAsTouched();

    if ( !this.validarMinimo() && !this.validarIgualdad() && !this.validar('nombre'))
    {
      const data = this.perfilForm.value;

      if ( this.perfilForm.get('password')?.value.length === 0)
      {
        delete data.password;
        delete data.password2;
      }

      this.usuarioService.actualizarPerfil( this.perfilForm.value, this.usuario.email )
      .subscribe
      ( 
        resp => 
        {
          this.usuario.nombre = data.nombre;
          this.perfilForm.get('password')?.setValue('');
          this.perfilForm.get('password2')?.setValue('');
          Swal.fire('Actualización de datos', 'Se han actualizado los datos correctamente', 'success');
        },
        error => 
        {
          console.log(error);
          Swal.fire('Error en la actualización de datos', 'Ha ocurrido un error' + error.msg, 'error');
        }
      );
    }

  }

  validar( campo: string )
  {
    return this.perfilForm.controls[campo].errors && this.perfilForm.controls[campo].touched;
  }

  validarIgualdad(  )
  {
    if ( (this.perfilForm.get('password')?.value !== this.perfilForm.get('password2')?.value) && this.perfilForm.get('password2')?.touched )
    {
      return true;
    }

    return false;
  }

  validarMinimo()
  {
    const ps1 = this.perfilForm.get('password');
    const ps2 = this.perfilForm.get('password2');

    if ( ((ps1?.value.length < 5 || ps2?.value.length < 5) && ps2?.touched) && ( ps1?.value.length !== 0 && ps2?.value.length !== 0 ) )
    {
      return true;
    }

    return false;
  }

  cambiarImagen( event: any ): any
  {
    if ( !event?.target.files[0] )
    {
      return this.imgTemp = null;
    }

    if ( event?.target.files[0] )
    {
      this.archivo = event?.target.files[0];

      // Convertir la imagen a string para mostrarla en la preview

      const reader = new FileReader();
      reader.readAsDataURL( this.archivo );

      reader.onloadend = () => 
      {
        this.imgTemp = reader.result;
      }
    }
  }

  actualizarImagen()
  {
    this.fileUploadService.actualizarImagen( this.archivo, 'usuarios', this.usuario.email ).then( img => 
    {
      this.usuario.imagen = img.data.imagen;
      Swal.fire('Actualización de datos', 'Se ha actualizado la imagen de perfil', 'success');
    }).catch( error => 
    {
      console.log(error);
      Swal.fire('Error en la actualización de datos', 'Ha ocurrido un error' + error.msg, 'error');
    });
  }
  

}
