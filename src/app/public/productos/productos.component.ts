import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Propios
import { ProductoData } from '../../interfaces/producto.interface';
import { ProductosService } from '../../services/productos.service';
import { ShopService } from '../../services/shop.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit 
{
  //@ts-ignore
  public producto: ProductoData;
  public tallas: string[] = [];
  public colores: string[] = [];
  public colorSeleccionado: string = '';
  public cantidad = 1;
  public id_producto = this.ruta.snapshot.params.id;

  // Form
  public carritoForm: FormGroup;

  constructor( private ruta: ActivatedRoute, private productosService: ProductosService, private shopService: ShopService, private fb: FormBuilder ) 
  { 
    this.carritoForm = this.fb.group
    ({
      talla: ['', Validators.required ]
    });
  }

  ngOnInit(): void 
  {
    this.obtenerProducto();
  }

  obtenerProducto()
  {
    this.productosService.obtenerProducto(this.id_producto).subscribe
    (
      resp => 
      {
        this.producto = resp;
        this.tallas = resp.talla.split(',');
        this.colores = resp.color.split(',');
      }
    )
  }

  cambiarCantidad( sumar: boolean = true )
  {
    if (this.cantidad === 1 && !sumar )
    {
      return;
    }

    // En caso de que se intente superar el stock
    if ( sumar )
    {
      if ( this.cantidad == this.producto.stock )
      {
        return
      }
    }

    this.cantidad = ( sumar )? this.cantidad+1 : this.cantidad-1;
  }

  seleccionarColor(color: string = '#000')
  {
    this.colorSeleccionado = color;
  }

  agregarAlCarrito()
  {
    if ( this.colorSeleccionado == '' || this.carritoForm.get('talla')?.value == '' || this.cantidad < 0 || this.cantidad > this.producto.stock )
    {
      Swal.fire('Error', 'Debes llenar todos los datos', 'warning');
      return;
    }

    const producto = 
    {
      id_producto: this.producto.id_producto,
      nombre: this.producto.nombre,
      imagen: this.producto.imagen,
      cantidad: this.cantidad,
      stock: this.producto.stock,
      color: this.colorSeleccionado,
      talla: this.carritoForm.get('talla')?.value,
      precio: this.producto.precio
    }

    this.shopService.agregarProducto( producto );
    Swal.fire('¡Muy bien!', 'El producto se ha agregado al carrito', 'success');
  }

}
