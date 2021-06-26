// Terceros
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Propios
// Módulos
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';

// Componentes
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';
import { UsuariosComponent } from './administracion/usuarios/usuarios.component';
import { PagesRoutingModule } from './pages.routing';
import { ProductosComponent } from './administracion/productos/productos.component';



@NgModule({
  declarations: 
  [
    AccountSettingsComponent,
    DashboardComponent,
    PagesComponent,
    PerfilComponent,
    UsuariosComponent,
    ProductosComponent,
  ],
  imports: 
  [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    PagesRoutingModule
  ],
  exports:
  [
    AccountSettingsComponent,
    DashboardComponent,
    PagesComponent,
  ]
})
export class PagesModule { }
