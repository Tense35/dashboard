// Terceros
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from "@angular/forms";

// Propios
// Módulos
import { ComponentsModule } from '../components/components.module';
import { SharedModule } from '../shared/shared.module';

// Componentes
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';
import { PromesasComponent } from './promesas/promesas.component';
import { RxjsComponent } from './rxjs/rxjs.component';



@NgModule({
  declarations: 
  [
    AccountSettingsComponent,
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    ProgressComponent,
    PromesasComponent,
    RxjsComponent,
  ],
  imports: 
  [
    CommonModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    SharedModule
  ],
  exports:
  [
    AccountSettingsComponent,
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    ProgressComponent,
    PromesasComponent,
    RxjsComponent
  ]
})
export class PagesModule { }
