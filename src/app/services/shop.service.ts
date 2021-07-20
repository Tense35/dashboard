import { Injectable, EventEmitter } from '@angular/core';
import { shopInterface } from '../interfaces/shop.interface';

@Injectable({
  providedIn: 'root'
})
export class ShopService 
{

  public productosShop: any = [];
  public productos$ = new EventEmitter<[]>();
  

  constructor() 
  { 
    
  }

  agregarProducto( producto: shopInterface)
  {

    if ( this.productosShop.find( ( item: shopInterface ) => (item.id_producto == producto.id_producto && item.color == producto.color && item.talla == item.talla) ) )
    {
      const index = this.productosShop.indexOf(this.productosShop.find( ( item: shopInterface ) => (item.id_producto == producto.id_producto && item.color == producto.color && item.talla == item.talla) ));

      this.productosShop[index].cantidad+= producto.cantidad;

      if ( this.productosShop[index].cantidad > this.productosShop[index].stock )
      {
        this.productosShop[index].cantidad = this.productosShop[index].stock;
      }

      this.productosShop[index].total = this.productosShop[index].cantidad * this.productosShop[index].precio;
    }
    else 
    {
      producto.total = producto.cantidad * producto.precio;
      this.productosShop.push(producto);
    }

    this.productos$.emit(this.productosShop);
  }

  vaciarCarrito()
  {
    this.productosShop = [];
    this.productos$.emit(this.productosShop);
  }

  borrarProducto( id: number | string )
  {
    const index = this.productosShop.indexOf(this.productosShop.find( ( item: shopInterface ) => item.id_producto == id ));

    if ( index != -1 )
    {
      this.productosShop.splice( index, 1 );
      this.productos$.emit(this.productosShop);
    }
  }

}
