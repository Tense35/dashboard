// Terceros
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Propios
import { PublicRoutingModule } from './public-routing.module';
import { PublicComponent } from './public.component';
import { SharedModule } from '../shared/shared.module';
import { InicioComponent } from './inicio/inicio.component';
import { GeneroPipe } from '../pipes/genero.pipe';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { ContactanosComponent } from './contactanos/contactanos.component';
import { ServiciosComponent } from './servicios/servicios.component';
import { ProductosComponent } from './productos/productos.component';


@NgModule({
  declarations: 
  [
    PublicComponent,
    InicioComponent,
    GeneroPipe,
    NosotrosComponent,
    ContactanosComponent,
    ServiciosComponent,
    ProductosComponent
  ],
  imports: 
  [
    CommonModule,
    SharedModule,
    PublicRoutingModule,
  ]
})
export class PublicModule { }
