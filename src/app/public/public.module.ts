// Terceros
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Pipes
import { CardPipe } from '../pipes/card.pipe';
import { CardEmptyPipe } from '../pipes/card-empty.pipe';
import { GeneroPipe } from '../pipes/genero.pipe';

// Propios
import { ContactanosComponent } from './contactanos/contactanos.component';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PagoComponent } from './pago/pago.component';
import { ProductosComponent } from './productos/productos.component';
import { PublicComponent } from './public.component';
import { PublicRoutingModule } from './public-routing.module';
import { ServiciosComponent } from './servicios/servicios.component';
import { SharedModule } from '../shared/shared.module';
import { InfoProductosComponent } from './info-productos/info-productos.component';
import { PedidoComponent } from './pedido/pedido.component';




@NgModule({
  declarations: 
  [
    CardEmptyPipe,
    CardPipe,
    ContactanosComponent,
    GeneroPipe,
    InicioComponent,
    NosotrosComponent,
    PagoComponent,
    ProductosComponent,
    PublicComponent,
    ServiciosComponent,
    InfoProductosComponent,
    PedidoComponent,
  ],
  imports: 
  [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    PublicRoutingModule,
  ]
})
export class PublicModule { }
