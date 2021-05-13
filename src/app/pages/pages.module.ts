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
import { DashboardComponent } from './dashboard/dashboard.component';
import { Grafica1Component } from './grafica1/grafica1.component';
import { PagesComponent } from './pages.component';
import { ProgressComponent } from './progress/progress.component';



@NgModule({
  declarations: 
  [
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    ProgressComponent
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
    DashboardComponent,
    Grafica1Component,
    PagesComponent,
    ProgressComponent
  ]
})
export class PagesModule { }
