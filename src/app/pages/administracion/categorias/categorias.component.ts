// Terceros
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

// Propios
import { CategoriaData } from '../../../interfaces/categoria.interface';
import { CategoriasService } from '../../../services/categorias.service';
import { SearchService } from '../../../services/search.service';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css']
})
export class CategoriasComponent implements OnInit 
{

  //#region Variables
  public totalCategorias: number = 0;
  public categorias: CategoriaData[] = [];
  public categoriasTemp: CategoriaData[] = [];
  public desde: number = 0;
  public loading: boolean = true;
  //@ts-ignore
  public categoriaSeleccionada;
  //#endregion

  // Formulario
  public categoriaForm: FormGroup = this.fb.group
  ({
    id_categoria: ['', [ Validators.required ] ],
    nombre: ['', [ Validators.required ] ],
    descripcion: ['', [ Validators.required ] ],
    estado: ['', [ Validators.required ] ],
  })

  public categoriaCreateForm: FormGroup = this.fb.group
  ({
    nombre: ['', [ Validators.required ] ],
    descripcion: ['', [ Validators.required ] ],
  })

  constructor
  ( 
    private fb: FormBuilder,
    private categoriaService: CategoriasService, 
    private searchService: SearchService,
  ){}

  ngOnInit(): void 
  {
    this.obtenerCategorias();
  }

  // Obtiene todas las categorías
  obtenerCategorias()
  {
    this.loading = true;
    this.categoriaService.obtenerCategorias(this.desde, 10)
    .subscribe( ({ total, data }) => 
    {
      this.totalCategorias = total;
      this.categorias = data;
      this.categoriasTemp = data;
      this.loading = false;
    });
  }

  // Controla la paginación
  cambiarPagina( valor: number )
  {
    this.desde += valor;

    if ( this.desde < 0)
    {
      this.desde = 0;
    }
    else if ( this.desde > this.totalCategorias )
    {
      this.desde -= valor;
    }

    this.obtenerCategorias();
  }

  // Buscar una categoría específica
  buscar( termino: string )
  {
    if ( termino.length === 0)
    {
      this.categorias = this.categoriasTemp;
    }

    this.searchService.buscar( 'categorias', 'nombre', termino )
      .subscribe( resultados => 
      {
        this.categorias = resultados;
      });
  }

  // Eliminar una categoría
  eliminar( id_categoria: number )
  {
    Swal.fire({
      title: 'Eliminar categoría',
      text: `¿Estás seguro que quieres eliminar la categoría con id: ${ id_categoria }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero eliminarla'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire
        (
          'Sistema',
          `La categoría con id: ${ id_categoria } ha sido eliminada exitosamente.`,
          'success'
        )

        this.categoriaService.eliminarCategoria( id_categoria )
          .subscribe
          (
            () => 
            {
              const i = this.categoriasTemp.map( data => { return data.id_categoria === id_categoria; }).indexOf(true);
              this.categoriasTemp[i].estado = false;
              this.categorias = this.categoriasTemp;
            }, error => 
            {
              console.log(error);
              Swal.fire ( 'Sistema', `La categoría con id: ${ id_categoria } no se logró eliminar`, 'error' );
            }
          );
      }
    });
  }

  // Reactiva una categoría eliminada
  activar( id_categoria: number )
  {
    Swal.fire({
      title: 'Habilitar categoría',
      text: `¿Estás seguro que quieres habilitar la categoría con id: ${ id_categoria }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero habilitarla'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire ( 'Sistema', `La categoría con id: ${ id_categoria } ha sido activado exitosamente.`, 'success' )

        this.categoriaService.activarCategoria( id_categoria )
          .subscribe
          (
            () => 
            {
              const i = this.categoriasTemp.map( data => { return data.id_categoria ===id_categoria; }).indexOf(true);
              this.categoriasTemp[i].estado = true;
              this.categorias = this.categoriasTemp;
            }, error => 
            {
              console.log(error);
              Swal.fire ( 'Sistema', `La categoría con id: ${ id_categoria } no se logró habilitar`, 'error' );
            }
          );
      }
    })
  }

  // Carga los datos en el form al darle al botón de editar
  cargarCategoriaSeleccionada( categoria: CategoriaData )
  {
    this.categoriaSeleccionada = categoria;

    // Inicializa los inputs del modal con la información de la categoría seleccionada
    this.categoriaForm.controls.id_categoria.setValue(this.categoriaSeleccionada.id_categoria);
    this.categoriaForm.controls.nombre.setValue(this.categoriaSeleccionada.nombre);
    this.categoriaForm.controls.descripcion.setValue(this.categoriaSeleccionada.descripcion);
    this.categoriaForm.controls.estado.setValue(this.categoriaSeleccionada.estado);
  }

  // Crear un usuario
  crear()
  {

    // Validar que el formulario sea válido
    if ( this.categoriaCreateForm.invalid )
    {
      this.categoriaCreateForm.markAllAsTouched();
      return;
    }

    const categoria = this.categoriaCreateForm.value;
    this.categoriaSeleccionada = categoria;

    // Modal de Swal Fire
    Swal.fire({
      title: 'Creación de categoría',
      text: `¿Estás seguro que quieres crear una categoría con id: ${ this.categoriaSeleccionada.id_categoria }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero crearla',
      cancelButtonText: 'Descartar creación'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {

        this.categoriaService.crearCategoria(categoria)
          .subscribe( (apiResp: any) => 
          {
            // Actualizar data local
            this.categoriasTemp.push(apiResp.data);

          }, error => 
          {
            console.log(error);
            Swal.fire ( 'Sistema', `${ error.error.msg }` );
            return;
          }
          );
          
        Swal.fire ( 'Sistema', `La categoría con id: ${ this.categoriaSeleccionada.id_categoria } ha sido creada exitosamente.`, 'success' );

        // Actualizar el otro array
        this.categorias = this.categoriasTemp;
      }
    })
    this.categoriaSeleccionada = null;
  }

  // Modificar un usaurio
  modificar(  )
  {
    let i = 0;

    const categoria = this.categoriaForm.value;

    // Validar que el formulario sea válido
    if ( this.categoriaForm.invalid )
    {
      this.categoriaForm.markAllAsTouched();
      return;
    }

    // Modal de Swal Fire
    Swal.fire({
      title: 'Modificación de categoría',
      text: `¿Estás seguro que quieres editar la categoría con id: ${ this.categoriaSeleccionada.id_categoria }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero modificarla',
      cancelButtonText: 'Descartar modificación'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire ( 'Sistema', `La categoría con id ${ this.categoriaSeleccionada.id_categoria } ha sido modificada exitosamente.`, 'success' );

        // Modificar la categoría
        this.categoriaService.actualizarCategoria(categoria, this.categoriaSeleccionada.id_categoria)
          .subscribe( (apiResp: any) => 
          {
            // Obtener el índice donde se aloja la data local del usuario seleccionado
            i = this.categoriasTemp.map( data => { return data.id_categoria === categoria.id_categoria; }).indexOf(true);

            // Paseo a Boolean
            const estado = (categoria.estado  === 'true' || categoria.estado === true )? true : false;

            // Actualizar la información en el array donde está la data local
            this.categoriasTemp[i].nombre = categoria.nombre;
            this.categoriasTemp[i].descripcion = categoria.descripcion;
            this.categoriasTemp[i].estado = estado;

          }, error => 
          {
            console.log(error);
            Swal.fire ( 'Sistema', `La categoría con id: ${ this.categoriaSeleccionada.id_categoria } no se logró editar`, 'error' );
            return;
          }
          );

        // Actualizar el otro array
        this.categorias = this.categoriasTemp;
      }

      // Elimina el archivo cargado dado que no se utilizará
      this.categoriaSeleccionada = null;

    });
  }

  // Validar forms
  validar( campo: string, form: string = 'categoriaForm' )
  {
    //@ts-ignore
    return this[form].controls[campo].errors && this[form].controls[campo].touched;
  }

}
