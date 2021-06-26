// Terceros
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

// Propios
import { CategoriaData } from '../../../interfaces/categoria.interface';
import { CategoriasService } from '../../../services/categorias.service';
import { FileUploadService } from '../../../services/file-upload.service';
import { SearchService } from '../../../services/search.service';
import { ProductoData } from '../../../interfaces/producto.interface';
import { ProductosService } from '../../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit 
{

  //#region Declaración de variables

  // Control de información
  public totalProductos: number = 0;
  public desde: number = 0;
  public loading: boolean = true;

  // Data local de productos
  public productos: ProductoData[] = [];
  public productosTemp: ProductoData[] = [];
  public productoSeleccionado: ProductoData | null = null;

  // Data local de categorías
  public categorias: CategoriaData[] = []

  // Formulario de edición de productos
  public productoForm: FormGroup = this.fb.group
  ({
    imagen:       ['' ],
    id_producto:  ['', [ Validators.required ] ],
    id_categoria: ['', [ Validators.required ] ],
    color:        ['', [ Validators.required ] ],
    talla:        ['', [ Validators.required ] ],
    nombre:       ['', [ Validators.required ] ],
    genero:       ['', [ Validators.required ] ],
    precio:       ['', [ Validators.required ] ],
    descripcion:  ['', [ Validators.required ] ],
    iva:          ['', [ Validators.required ] ],
    destacar:     ['', [ Validators.required ] ],
    descuento:    ['', [ Validators.required ] ],
    stock:        ['', [ Validators.required ] ],
    estado:       ['', [ Validators.required ] ],
  });

  // Formulario de creación de productos
  public productoCreateForm: FormGroup = this.fb.group
  ({
    id_categoria: ['', [ Validators.required ] ],
    color:        ['', [ Validators.required, Validators.minLength(4) ] ],
    talla:        ['', [ Validators.required ] ],
    nombre:       ['', [ Validators.required ] ],
    genero:       ['', [ Validators.required ] ],
    precio:       ['', [ Validators.required ] ],
    descripcion:  ['', [ Validators.required ] ],
    iva:          ['0', [ Validators.min(0), Validators.max(100) ] ],
    destacar:     ['false', [ ] ],
    descuento:    ['0', [ Validators.min(0), Validators.max(100) ] ],
    stock:        ['1', [ Validators.min(0) ] ],
  });

  // Control de imágenes
  public archivo: any = null;
  public imgTemp: any = 'https://res.cloudinary.com/dm1464giy/image/upload/v1622577586/noimage.jpg';
  public imgDefault: string = 'https://res.cloudinary.com/dm1464giy/image/upload/v1622577586/noimage.jpg';

  //#endregion

  // Inyección de servicios
  constructor
  ( 
    private fb: FormBuilder, 
    private productoService: ProductosService, 
    private categoriaService: CategoriasService,
    private searchService: SearchService, 
    private fileUploadService: FileUploadService 
  ) { }

  ngOnInit(): void 
  {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  // Métodos

  // Obtener todos los productos
  obtenerProductos()
  {
    this.loading = true;
    this.productoService.obtenerProductos(0, 'false', this.desde, 10)
    .subscribe( (resp: any) => 
    {
      this.totalProductos = resp.total;
      this.productos = resp.data;
      this.productosTemp = resp.data;
      this.loading = false;
    });
  }

  // Obtener todas las categorías
  obtenerCategorias()
  {
    this.categoriaService.obtenerCategorias().subscribe( data => 
    {
      this.categorias = data;
    });
    
  }

  // Paginación
  cambiarPagina( valor: number )
  {
    this.desde += valor;

    if ( this.desde < 0)
    {
      this.desde = 0;
    }
    else if ( this.desde > this.totalProductos )
    {
      this.desde -= valor;
    }

    this.obtenerProductos();
  }

  // Búsqueda 
  buscar( termino: string )
  {
    if ( termino.length === 0)
    {
      this.productos = this.productosTemp;
    }

    this.searchService.buscar( 'productos', 'nombre', termino )
      .subscribe( resultados => 
      {
        this.productos = resultados;
      });
  }

  // Eliminación lógica
  eliminar( id_producto: number )
  {
    Swal.fire({
      title: 'Eliminar producto',
      text: `¿Estás seguro que quieres eliminar el producto con id ${ id_producto }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero eliminarlo'
    }).then((result) => 
    {
      if ( result.isConfirmed ) 
      {
        
        this.productoService.eliminarProducto( Number(id_producto) )
          .subscribe
          (
            () => 
            {
              const i = this.productosTemp.map( data => { return data.id_producto === Number(id_producto); }).indexOf(true);
              this.productosTemp[i].estado = false;
              this.productos = this.productosTemp;

              Swal.fire
              (
                'Sistema',
                `El producto con id: ${ id_producto } ha sido eliminado exitosamente.`,
                'success'
              );

            }, error => 
            {
              console.log(error);
              Swal.fire ( 'Sistema', `El producto con id: ${ id_producto } no se logró eliminar`, 'error' );
            }
          );
      }
    })
  }

  // Activar el producto (Inverso a eliminar)
  activar( id_producto: number, id_categoria: number )
  {
    Swal.fire({
      title: 'Habilitar producto',
      text: `¿Estás seguro que quieres habilitar el producto con id: ${ id_producto }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, quiero habilitarlo'
    }).then((result) => 
    {
      if (result.isConfirmed) 
      {
        Swal.fire ( 'Sistema', `El producto con id: ${ id_producto } ha sido activado exitosamente.`, 'success' )

        this.productoService.activarProducto( id_producto, id_categoria )
          .subscribe
          (
            () => 
            {
              const i = this.productosTemp.map( data => { return data.id_producto === id_producto; }).indexOf(true);
              this.productosTemp[i].estado = true;
              this.productos = this.productosTemp;
            }, error => 
            {
              console.log(error);
              Swal.fire ( 'Sistema', `El producto con id: ${ id_producto } no se logró habilitar`, 'error' );
            }
          )
      }
    });
  }

  // Colocar los valores actuales del producto en el modal de edición
  cargarProductoSeleccionado( producto: ProductoData )
  {
    this.productoSeleccionado = producto;
    // Coloca la imagen existente en imgTemp para que se previsualice en el modal
    this.imgTemp = this.productoSeleccionado.imagen;

    // Inicializa los inputs del modal con la información actual
    this.productoForm.controls.id_producto.setValue(this.productoSeleccionado.id_producto);
    this.productoForm.controls.id_categoria.setValue(this.productoSeleccionado.id_categoria);
    this.productoForm.controls.color.setValue(this.productoSeleccionado.color);
    this.productoForm.controls.talla.setValue(this.productoSeleccionado.talla);
    this.productoForm.controls.nombre.setValue(this.productoSeleccionado.nombre);
    this.productoForm.controls.genero.setValue(this.productoSeleccionado.genero);
    this.productoForm.controls.precio.setValue(this.productoSeleccionado.precio);
    this.productoForm.controls.descripcion.setValue(this.productoSeleccionado.descripcion);
    this.productoForm.controls.iva.setValue(this.productoSeleccionado.iva);
    this.productoForm.controls.destacar.setValue(this.productoSeleccionado.destacar);
    this.productoForm.controls.descuento.setValue(this.productoSeleccionado.descuento);
    this.productoForm.controls.stock.setValue(this.productoSeleccionado.stock);
    this.productoForm.controls.estado.setValue(this.productoSeleccionado.estado);
  }

  // Crear un producto
  crear()
  {

    let imagen: string;

    // Validar que el formulario sea válido
    if ( this.productoCreateForm.invalid )
    {
      this.productoCreateForm.markAllAsTouched();
      return;
    }

    const producto = this.productoCreateForm.value;
    this.productoSeleccionado = producto;

    // Modal de Swal Fire
    Swal.fire({
      title: 'Creación de productos',
      text: `¿Estás seguro que quieres crear el producto: ${ this.productoSeleccionado?.nombre }?`,
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
          delete producto.imagen;
        }

        this.productoService.crearProducto(producto)
          .pipe
          (
            map((resp: any) => 
            {
              // En caso de haber modificado la imagen, se actualiza la información, de lo contrario se utiliza la que ya estaba
              if ( this.archivo )
              {
                this.fileUploadService.actualizarImagen( this.archivo, 'productos', resp.data.id_producto ).then( img => 
                {
                  imagen = img.data.imagen

                  // Actualizar la información en el array donde está la data local
                  this.productosTemp.push(resp.data);

                  // Actualizar la imagen en la data local
                  this.productosTemp[this.productosTemp.length-1].imagen = imagen;
                  this.archivo = null;

                }).catch( error => 
                {
                  console.log(error);
                  Swal.fire('Error al subir la imagen', 'Ha ocurrido un error' + error.error.msg, 'error');
                });
              }
              else 
              {
                // Actualizar data local
                this.productosTemp.push(resp.data);
                this.productosTemp[this.productosTemp.length-1].imagen = this.imgDefault;
                this.archivo = null;
              }
              this.totalProductos++;

              return resp;
            })
          )
          .subscribe( (apiResp: any) => 
          {
            console.log('Producto creado');
          }, error => 
          {
            console.log(error);
            Swal.fire ( 'Sistema', `${ error.error.msg }` );
            return;
          }
          );
          
        Swal.fire ( 'Sistema', `El producto: ${ this.productoSeleccionado?.nombre } ha sido creado exitosamente.`, 'success' );

        // Actualizar el otro array
        this.productos = this.productosTemp;
      }

    })

  }

  // Modificación en base de datos de la información y actualización de data local
  modificar(  )
  {
    let i = 0;
    let imagen = '';

    const producto = this.productoForm.value;

    // Validar que el formulario sea válido
    if ( this.productoForm.invalid )
    {
      this.productoForm.markAllAsTouched();
      return;
    }

    // Modal de Swal Fire
    Swal.fire({
      title: 'Modificación de producto',
      text: `¿Estás seguro que quieres editar el producto con id ${ this.productoSeleccionado?.id_producto }?`,
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
        Swal.fire ( 'Sistema', `El producto con id: ${ this.productoSeleccionado?.id_producto }, ha sido modificado exitosamente.`, 'success' );
        
        // Si no se cambió la foto, no la actualizaremos
        if (!this.archivo)
        {
          delete producto.imagen;
        }

        // En caso de haber modificado la imagen, se actualiza la información, de lo contrario se utiliza la que ya estaba
        if ( this.archivo )
        {

          this.fileUploadService.actualizarImagen( this.archivo, 'productos', this.productoSeleccionado?.id_producto || 0 ).then( img => 
          {
            imagen = img.data.imagen

            // Actualizar la data local de los productos
            this.productosTemp[i].imagen = imagen;

          }).catch( error => 
          {
            console.log(error);
            Swal.fire('Error al subir la imagen', 'Ha ocurrido un error' + error.msg, 'error');
          });
        }

        this.productoService.actualizarProducto( producto, this.productoSeleccionado?.id_producto || 0 )
          .subscribe( (apiResp: any) => 
          {
            // Obtener el índice donde se aloja la data local del producto seleccionado
            i = this.productosTemp.map( data => { return data.id_producto === producto.id_producto; }).indexOf(true);

            // Actualizar la información en el array donde está la data local
            this.productosTemp[i].id_producto  = producto.id_producto;
            this.productosTemp[i].id_categoria = producto.id_categoria;
            this.productosTemp[i].color        = producto.color;
            this.productosTemp[i].talla        = producto.talla;
            this.productosTemp[i].nombre       = producto.nombre;
            this.productosTemp[i].genero       = producto.genero;
            this.productosTemp[i].precio       = producto.precio;
            this.productosTemp[i].descripcion  = producto.descripcion;
            this.productosTemp[i].iva          = producto.iva;
            this.productosTemp[i].destacar     = producto.destacar;
            this.productosTemp[i].descuento    = producto.descuento;
            this.productosTemp[i].stock        = producto.stock;
            const estado = (producto.estado  === 'true' )? true : false;
            this.productosTemp[i].estado       = estado;

          }, error => 
          {
            console.log(error);
            Swal.fire ( 'Sistema', `El producto con id: ${ this.productoSeleccionado?.id_producto } no se logró editar`, 'error' );
            return;
          }
          );
        
      }

      // Elimina el archivo cargado dado que no se utilizará
      this.archivo = null;

    })

    // Actualizar el otro array
    this.productos = this.productosTemp;
    console.log(this.productos[i]);
  }

  // Validar forms
  validar( campo: string, form: string = 'productoForm' )
  {
    //@ts-ignore
    return this[form].controls[campo].errors && this[form].controls[campo].touched;
  }

  // Cambiar imagen en el preview
  cambiarImagen( event: any ): any
  {
    // En caso de que no haya imagen
    if ( !event?.target.files[0] )
    {
      return this.imgTemp = null;
    }

    if ( event?.target.files[0] )
    {
      // Tomar el archivo
      this.archivo = event?.target.files[0];

      // Convertir la imagen a string para mostrarla en la preview
      const reader = new FileReader();
      reader.readAsDataURL( this.archivo );

      // Imagen ya procesada
      reader.onloadend = () => 
      {
        this.imgTemp = reader.result;
      }
    }
  }

  // Obtiene el Id de una categoría y devuelve su nombre
  nombreCategoria(id_categoria: number)
  {
    try 
    {
      const cat = this.categorias.filter( resp => 
      {
        return resp.id_categoria === id_categoria
      });
    
      return cat[0].nombre;
    } 
    catch (error) 
    {
      return 'Variedad';
    }

    
  }
  
}
