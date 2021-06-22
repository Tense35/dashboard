// Terceros
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

// Propios
import { SearchService } from '../../../services/search.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/Usuario.model';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploadService } from '../../../services/file-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit 
{
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public loading: boolean = true;

  // Formulario
  //@ts-ignore
  public usuarioForm: FormBuilder.FormGroup;

  // Imagen
  //@ts-ignore
  public archivo: File;
  public imgTemp: any = null;
  public usuarioSeleccionado: any;

  constructor( private fb: FormBuilder, private usuarioService: UsuarioService, private searchService: SearchService, private fileUploadService: FileUploadService  ) 
  { 

  }

  ngOnInit(): void 
  {
    this.obtenerUsuarios();

    this.usuarioForm = this.fb.group
    ({
      nombre: ['', [ Validators.required ] ],
      estado: ['', [ Validators.required ] ],
      img: ['', [ Validators.required ] ],
    });
  }

  obtenerUsuarios()
  {
    this.loading = true;
    this.usuarioService.obtenerUsuarios(this.desde, 10)
    .subscribe( ({ total, data }) => 
    {
      this.totalUsuarios = total;
      this.usuarios = data;
      this.usuariosTemp = data;
      this.loading = false;
    });
  }

  cambiarPagina( valor: number )
  {
    this.desde += valor;

    if ( this.desde < 0)
    {
      this.desde = 0;
    }
    else if ( this.desde > this.totalUsuarios )
    {
      this.desde -= valor;
    }

    this.obtenerUsuarios();
  }

  buscar( termino: string )
  {
    if ( termino.length === 0)
    {
      this.usuarios = this.usuariosTemp;
    }

    this.searchService.buscar( 'usuarios', 'email', termino )
      .subscribe( resultados => 
      {
        this.usuarios = resultados;
      })
  }

  eliminar( email: string )
  {
    Swal.fire({
      title: 'Eliminar usuario',
      text: `¿Estás seguro que quieres eliminar el usuario ${ email }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero eliminarlo'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire
        (
          'Sistema',
          `El usuario ${ email } ha sido eliminado exitosamente.`,
          'success'
        )

        this.usuarioService.eliminarUsuario( email )
          .subscribe
          (
            () => 
            {
              const i = this.usuariosTemp.map( data => { return data.email === email; }).indexOf(true);
              this.usuariosTemp[i].estado = false;
              this.usuarios = this.usuariosTemp;
            }, error => 
            {
              console.log(error);
              Swal.fire ( 'Sistema', `El usuario ${ email } no se logró eliminar`, 'error' );
            }
          )
      }
    })
  }

  activar( email: string )
  {
    Swal.fire({
      title: 'Habilitar usuario',
      text: `¿Estás seguro que quieres habilitar la cuenta del usuario ${ email }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero habilitarlo'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire ( 'Sistema', `El usuario ${ email } ha sido activado exitosamente.`, 'success' )

        this.usuarioService.activarUsuario( email )
          .subscribe
          (
            () => 
            {
              const i = this.usuariosTemp.map( data => { return data.email === email; }).indexOf(true);
              this.usuariosTemp[i].estado = true;
              this.usuarios = this.usuariosTemp;
            }, error => 
            {
              console.log(error);
              Swal.fire ( 'Sistema', `El usuario ${ email } no se logró habilitar`, 'error' );
            }
          )
      }
    })
  }

  modificar( usuario: any )
  {
    this.usuarioSeleccionado = usuario;
    console.log(this.usuarioSeleccionado);
    this.imgTemp = this.usuarioSeleccionado.imagen;
    console.log(this.imgTemp);
    Swal.fire
    ({
      title: 'Modificar usuario',
      html:
        // Nombre
        `<div class="card-body card-imagen"><h4 class="card-title">Avatar</h4><div class="text-center"><img src="${this.imgTemp}" class="img-avatar"></div><input type="file" (change)="cambiarImagen($event)" class="mt-4"><br><br></div>`
        +
        // Nombre
        '<div class="form-group"><h5>Nombre</h5><div class="controls"><input type="text" name="text" class="form-control" required="" data-validation-required-message="This field is required" aria-invalid="false"> <div class="help-block"></div></div></div>'
        +
        // Estado
        '<div class="form-group"><h5>Estado</h5><div class="controls"><select name="select" id="select" required="" class="form-control"><option value="">Selecciona un estado</option><option value="true">Activo</option><option value="false">Inactivo</option></select><div class="help-block"></div></div></div>' 
        + 
        '<input controlName="img" class="swal2-input">',
      focusConfirm: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar edición',
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Editar usuario',
      
      preConfirm: () => 
      {
        return[
          this.usuarioForm.get('nombre').value,
          this.usuarioForm.get('estado').value,
        ]
      }
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        this.actualizarImagen();
      }
    })
    .catch( error => 
    {
      console.log(error);
      Swal.fire('Error en la actualización de datos', 'Ha ocurrido un error' + error.msg, 'error');
    });
  }

  // Imagen

  cambiarImagen( event: any ): any
  {
    if ( !event?.target.files[0] )
    {
      console.log('null imagen');
      return this.imgTemp = null;
    }

    if ( event?.target.files[0] )
    {
      this.archivo = event?.target.files[0];

      // Convertir la imagen a string para mostrarla en la preview

      const reader = new FileReader();
      reader.readAsDataURL( this.archivo );
      console.log('Procesando imagen');

      reader.onloadend = () => 
      {
        this.imgTemp = reader.result;
        console.log('Imagen procesada');
      }
    }
  }

  actualizarImagen()
  {
    this.fileUploadService.actualizarImagen( this.archivo, 'usuarios', this.usuarioSeleccionado.email ).then( img => 
    {
      const i = this.usuariosTemp.map( data => { return data.email === this.usuarioSeleccionado.email; }).indexOf(true);
      this.usuariosTemp[i].estado = true;
      this.usuarios[i].imagen = this.usuarioSeleccionado.imagen;
      
    }).catch( error => 
    {
      console.log(error);
      Swal.fire('Error en la actualización de datos', 'Ha ocurrido un error' + error.msg, 'error');
    });
  }



}
