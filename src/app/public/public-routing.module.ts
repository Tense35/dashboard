// Terceros
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Propios
import { ContactanosComponent } from './contactanos/contactanos.component';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { PagoComponent } from './pago/pago.component';
import { ProductosComponent } from './productos/productos.component';
import { PublicComponent } from './public.component';
import { ServiciosComponent } from './servicios/servicios.component';

const routes: Routes = 
[
  { 
    path: '', 
    component: PublicComponent,
    children: 
    [
      { path: 'contacto', component: ContactanosComponent, data: { titulo: 'Contáctanos - GoldKids' } },
      { path: 'inicio', component: InicioComponent, data: { titulo: 'Inicio - GoldKids' } },
      { path: 'nosotros', component: NosotrosComponent, data: { titulo: 'Nosotros - GoldKids' } },
      { path: 'pago', component: PagoComponent, data: { titulo: 'Pago - GoldKids' } },
      { path: 'producto/:id', component: ProductosComponent, data: { titulo: 'Producto - GoldKids' } },
      { path: 'servicios', component: ServiciosComponent, data: { titulo: 'Servicios - GoldKids' } },
      { path: '**', redirectTo: 'inicio' }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
