// Terceros
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Propios
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Grafica1Component } from './pages/grafica1/grafica1.component';
import { LoginComponent } from './auth/login/login.component';
import { NopagefoundComponent } from './pages/nopagefound/nopagefound.component';
import { ProgressComponent } from './pages/progress/progress.component';
import { PagesComponent } from './pages/pages.component';

const routes: Routes = 
[
  { 
    path: '', 
    component: PagesComponent,
    children: 
    [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'grafica1', component: Grafica1Component },
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    ]
  },

  { path: 'login', component: LoginComponent },
  { path: '**', component: NopagefoundComponent  },
];

@NgModule({
  imports: 
  [
    RouterModule.forRoot( routes )
  ],
  exports: 
  [
    RouterModule
  ]
})
export class AppRoutingModule { }
