import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/interfaces/producto.interface';
import { CategoriasService } from '../../services/categorias.service';
import { ProductosService } from '../../services/productos.service';
import { ProductoData } from '../../interfaces/producto.interface';
import { CategoriaData } from '../../interfaces/categoria.interface';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit 
{

  public productos: ProductoData[] = [];
  public categorias: CategoriaData[] = [];

  constructor( private categoriasService:CategoriasService, private productosService:ProductosService ) { }

  ngOnInit(): void 
  {
    this.obtenerProductos();
    this.obtenerCategorias();
  }

  obtenerProductos(categoria: number = 0, estado: string = 'true')
  {
    this.productosService.obtenerProductos(categoria, estado)
      .subscribe( resp => 
      {
        this.productos = resp;
      }); 
  }

  obtenerCategorias()
  {
    this.categoriasService.obtenerCategorias()
      .subscribe( resp => 
      {
        this.categorias = resp;
      }); 
  }

}
