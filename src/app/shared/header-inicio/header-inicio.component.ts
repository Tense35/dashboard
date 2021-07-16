import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ShopService } from '../../services/shop.service';


@Component({
  selector: 'app-header-inicio',
  templateUrl: './header-inicio.component.html',
  styleUrls: ['./header-inicio.component.css']
})
export class HeaderInicioComponent implements OnInit, OnDestroy 
{

  public productosCarrito: any = [];
  productoSubscription: any;

  constructor( private shopService: ShopService ) { }

  ngOnInit(): void 
  {
    this.productoSubscription = this.shopService.productos$.subscribe( ( resp: any ) => 
    {
      this.productosCarrito = resp;
    });
  }

  ngOnDestroy(): void 
  {
    this.productoSubscription.unsubscribe();
  }

  vaciarCarrito()
  {
    this.shopService.vaciarCarrito();
  }

}
