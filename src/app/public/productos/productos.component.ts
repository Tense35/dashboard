import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Propios
import { ProductoData } from '../../interfaces/producto.interface';
import { ProductosService } from '../../services/productos.service';

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

  constructor( private ruta: ActivatedRoute, private productosService: ProductosService ) { }

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

    this.cantidad = ( sumar )? this.cantidad+1 : this.cantidad-1;
  }

  seleccionarColor(color: string = '#000')
  {
    this.colorSeleccionado = color;
    console.log(this.colorSeleccionado);
  }


}
