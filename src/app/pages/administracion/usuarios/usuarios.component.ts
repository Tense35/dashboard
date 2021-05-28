// Terceros
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2'

// Propios
import { SearchService } from '../../../services/search.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/Usuario.model';

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

  constructor( private usuarioService: UsuarioService, private searchService: SearchService ) 
  { 

  }

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

}
