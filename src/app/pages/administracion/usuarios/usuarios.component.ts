// Terceros
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';

// Propios
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { FileUploadService } from '../../../services/file-upload.service';
import { SearchService } from '../../../services/search.service';
import { Usuario } from '../../../models/Usuario.model';
import { UsuarioData } from '../../../interfaces/usuarios.interface';
import { UsuarioService } from '../../../services/usuario.service';

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
  public usuarioForm: FormGroup = this.fb.group
  ({
    email: ['', [ Validators.required ] ],
    nombre: ['', [ Validators.required ] ],
    estado: ['', [ Validators.required ] ],
  })

  public usuarioCreateForm: FormGroup = this.fb.group
  ({
    email: ['', [ Validators.required ] ],
    nombre: ['', [ Validators.required ] ],
    password: ['', [ Validators.required ] ],
    password2: ['', [ Validators.required ] ],
  })

  // Imagen
  //@ts-ignore
  public archivo: any;
  public imgTemp: any = 'https://res.cloudinary.com/dm1464giy/image/upload/v1622577586/noimage.jpg';
  public usuarioSeleccionado: any;
  public imgDefault: string = 'https://res.cloudinary.com/dm1464giy/image/upload/v1622577586/noimage.jpg';

  constructor
  ( 
    private fb: FormBuilder, 
    private authService: AuthService, 
    private fileUploadService: FileUploadService,  
    private usuarioService: UsuarioService, 
    private searchService: SearchService,
  ){}

  ngOnInit(): void 
  {
    this.obtenerUsuarios();
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

  cargarUsuarioSeleccionado( usuario: UsuarioData )
  {
    this.usuarioSeleccionado = usuario;

    // Coloca la imagen existente en imgTemp para que se previsualice en el modal
    this.imgTemp = this.usuarioSeleccionado.imagen;

    // Inicializa los inputs del modal con la información actual
    this.usuarioForm.controls.email.setValue(this.usuarioSeleccionado.email);
    this.usuarioForm.controls.nombre.setValue(this.usuarioSeleccionado.nombre);
    this.usuarioForm.controls.estado.setValue(this.usuarioSeleccionado.estado);
  }

  // Crear un usuario
  crear()
  {

    let imagen: string;

    // Validar que el formulario sea válido
    if ( this.usuarioCreateForm.invalid )
    {
      this.usuarioCreateForm.markAllAsTouched();
      return;
    }

    const usuario = this.usuarioCreateForm.value;
    this.usuarioSeleccionado = usuario;

    // Modal de Swal Fire
    Swal.fire({
      title: 'Creación de usuario',
      text: `¿Estás seguro que quieres crear un usuario con email: ${ this.usuarioSeleccionado.email }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero crearlo',
      cancelButtonText: 'Descartar creación'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {

        // Si no se cambió la foto, no la actualizaremos
        if (!this.archivo)
        {
          delete usuario.imagen;
        }

        this.usuarioService.crearUsuario(usuario)
          .pipe
          (
            map((resp: any) => 
            {
              // En caso de haber modificado la imagen, se actualiza la información, de lo contrario se utiliza la que ya estaba
              if ( this.archivo )
              {
                this.fileUploadService.actualizarImagen( this.archivo, 'usuarios', this.usuarioSeleccionado.email ).then( img => 
                {
                  imagen = img.data.imagen

                  // Actualizar la información en el array donde está la data local
                  this.usuariosTemp.push(resp.data);

                  // Actualizar la imagen en la data local
                  this.usuariosTemp[this.usuariosTemp.length-1].imagen = imagen;
                  this.archivo = null;

                }).catch( error => 
                {
                  console.log(error);
                  Swal.fire('Error al subir la imagen', 'Ha ocurrido un error' + error.msg, 'error');
                });
              }
              else 
              {
                // Actualizar data local
                this.usuariosTemp.push(resp.data);
                this.usuariosTemp[this.usuariosTemp.length-1].imagen = this.imgDefault;
                this.archivo = null;
              }

              return resp;
            })
          )
          .subscribe( (apiResp: any) => 
          {
            console.log('Usuario creado');

          }, error => 
          {
            console.log(error);
            Swal.fire ( 'Sistema', `${ error.error.msg }` );
            return;
          }
          );
          
        Swal.fire ( 'Sistema', `El usuario ${ this.usuarioSeleccionado.email } ha sido creado exitosamente.`, 'success' );

        // Actualizar el otro array
        this.usuarios = this.usuariosTemp;
      }

      // Elimina el archivo cargado dado que no se utilizará
      // this.archivo = null;

    })

  }

  // Modificar un usaurio
  modificar(  )
  {
    let i = 0;
    let imagen = '';

    const usuario = this.usuarioForm.value;

    // Validar que el formulario sea válido
    if ( this.usuarioForm.invalid )
    {
      this.usuarioForm.markAllAsTouched();
      return;
    }

    // Modal de Swal Fire
    Swal.fire({
      title: 'Modificación de usuario usuario',
      text: `¿Estás seguro que quieres editar la cuenta del usuario ${ this.usuarioSeleccionado.email }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero modificarlo',
      cancelButtonText: 'Descartar modificación'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire ( 'Sistema', `El usuario ${ this.usuarioSeleccionado.email } ha sido modificado exitosamente.`, 'success' );
        
        // Si no se cambió la foto, no la actualizaremos
        if (!this.archivo)
        {
          delete usuario.imagen;
        }

        // En caso de haber modificado la imagen, se actualiza la información, de lo contrario se utiliza la que ya estaba
        if ( !usuario.imagen )
        {
          this.fileUploadService.actualizarImagen( this.archivo, 'usuarios', this.usuarioSeleccionado.email ).then( img => 
          {
            imagen = img.data.imagen

            // Actualizar la data local de los usuarios
            this.usuariosTemp[i].imagen = imagen;

            // En caso de que me esté modificando a mi mismo usuario (Se actualiza la información que se ve en el resto del dashboard)
            if ( this.usuarioSeleccionado.email === this.authService.usuario.email )
            {
              this.authService.usuario.nombre = usuario.nombre;

              // En caso de estar actualizando también la foto
              if ( !usuario.imagen )
              {
                this.authService.usuario.imagen = imagen;
              }
            }

          }).catch( error => 
          {
            console.log(error);
            Swal.fire('Error al subir la imagen', 'Ha ocurrido un error' + error.msg, 'error');
          });
        }

        this.usuarioService.actualizarPerfil(usuario, this.usuarioSeleccionado.email)
          .subscribe( (apiResp: any) => 
          {
            // Obtener el índice donde se aloja la data local del usuario seleccionado
            i = this.usuariosTemp.map( data => { return data.email === usuario.email; }).indexOf(true);
            // Actualizar la información en el array donde está la data local
            this.usuariosTemp[i].estado = usuario.estado;
            this.usuariosTemp[i].nombre = usuario.nombre;

          }, error => 
          {
            console.log(error);
            Swal.fire ( 'Sistema', `El usuario ${ this.usuarioSeleccionado.email } no se logró editar`, 'error' );
            return;
          }
          );

        // Actualizar el otro array
        this.usuarios = this.usuariosTemp;
      }

      // Elimina el archivo cargado dado que no se utilizará
      this.archivo = null;
      this.usuarioSeleccionado = null;

    })
  }

  // Validar forms
  validar( campo: string, form: string = 'usuarioForm' )
  {
    //@ts-ignore
    return this[form].controls[campo].errors && this[form].controls[campo].touched;
  }

  // Valida la contraseña
  validarPass(  )
  {
    const ps1 = this.usuarioCreateForm.get('password');
    const ps2 = this.usuarioCreateForm.get('password2');

    if ( ((ps1?.value.length < 5 || ps2?.value.length < 5) && ps2?.touched) && ( ps1?.value.length !== 0 && ps2?.value.length !== 0 ) )
    {
      return 1;
    }

    if ( ps1?.value !== ps2?.value && ps2?.touched )
    {
      return 2;
    }

    return 0;
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

}
