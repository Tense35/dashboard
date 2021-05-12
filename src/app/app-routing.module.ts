// Terceros
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Propios
// Módulos
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

// Componentes
import { NopagefoundComponent } from './nopagefound/nopagefound.component';

const routes: Routes = 
[
  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting

  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', component: NopagefoundComponent  },
];

@NgModule({
  imports: 
  [
    RouterModule.forRoot( routes ),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: 
  [
    RouterModule
  ]
})
export class AppRoutingModule { }
