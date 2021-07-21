import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-info-productos',
  templateUrl: './info-productos.component.html',
  styleUrls: ['./info-productos.component.css']
})
export class InfoProductosComponent implements OnInit {

  public infoProductos:any = [];

  constructor(private shopService: ShopService) 
  {

  }

  ngOnInit(): void 
  {
    if ( localStorage.getItem('shop') )
    {
      this.infoProductos = JSON.parse(localStorage.getItem('shop') || '');
    }
    
    this.infoProductos = this.shopService.productosShop;
  }

  eliminarProducto(indice:number)
  { 
    this.shopService.borrarProducto(indice);
    this.infoProductos = this.shopService.productosShop;
  }

}
