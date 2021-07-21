// Terceros
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Propios
import { ContactoInicioComponent } from './contacto-inicio/contacto-inicio.component';
import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { FooterInicioComponent } from './footer-inicio/footer-inicio.component';
import { HeaderComponent } from './header/header.component';
import { HeaderInicioComponent } from './header-inicio/header-inicio.component';
import { PrimengModule } from '../primeng/primeng.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: 
  [
    BreadcrumbsComponent,
    ContactoInicioComponent,
    FooterInicioComponent,
    HeaderComponent,
    HeaderInicioComponent,
    SidebarComponent,
  ],
  imports: 
  [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    PrimengModule
  ],
  exports:
  [
    BreadcrumbsComponent,
    ContactoInicioComponent,
    FooterInicioComponent,
    HeaderComponent,
    HeaderInicioComponent,
    SidebarComponent
  ]
})
export class SharedModule { }
