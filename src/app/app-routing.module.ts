// Terceros
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Propios
// Módulos
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

// Componentes
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PublicModule } from './public/public.module';

const routes: Routes = 
[
  // path: '/dashboard' PagesRouting
  // path: '/auth' AuthRouting

  {
    path: '', loadChildren: () => import('./public/public.module').then(m => m.PublicModule)
  },
  {
    path: 'dashboard', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  { path: '**', component: NopagefoundComponent  },
];

@NgModule({
  imports: 
  [
    RouterModule.forRoot( routes ),
    AuthRoutingModule,
    PagesRoutingModule,
    PublicModule
  ],
  exports: 
  [
    RouterModule
  ]
})
export class AppRoutingModule { }
