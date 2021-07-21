import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';

@Component({
  selector: 'app-info-productos',
  templateUrl: './info-productos.component.html',
  styleUrls: ['./info-productos.component.css']
})
export class InfoProductosComponent implements OnInit {

  public infoProductos:any = [];

  constructor(private shopService: ShopService) {
  }

  ngOnInit(): void {
    this.infoProductos= this.shopService.productosShop;
  }

}
