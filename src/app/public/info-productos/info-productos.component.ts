import { Component, OnDestroy, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-info-productos',
  templateUrl: './info-productos.component.html',
  styleUrls: ['./info-productos.component.css']
})
export class InfoProductosComponent implements OnInit, OnDestroy {

  public infoProductos:any = [];
  public productoSubscripcion:any;

  constructor(private shopService: ShopService) {
  }

  

  ngOnInit(): void {
   this.productoSubscripcion=this.shopService.productos$.subscribe( (resp:any) =>
   {
     console.log('-----');
     console.log(resp);
     console.log(this.infoProductos);
     this.infoProductos=resp;
   })
  }

  ngOnDestroy(): void {
    this.productoSubscripcion.unsubscribe();
  }

  eliminarProducto(indice:number){
   
    this.shopService.borrarProducto(indice);

  }

}
