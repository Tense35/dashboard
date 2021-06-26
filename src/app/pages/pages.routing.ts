import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Propios
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from '../guards/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { UsuariosComponent } from './administracion/usuarios/usuarios.component';

// Administración
import { PerfilComponent } from './perfil/perfil.component';
import { ProductosComponent } from './administracion/productos/productos.component';


const routes: Routes = 
[
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: 
        [
          { path: 'main', component: DashboardComponent, data: { titulo: 'Dashboard' } },
          { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes' } },
          { path: 'perfil', component: PerfilComponent, data: { titulo: 'Mi perfil' } },
          { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
          { path: 'productos', component: ProductosComponent, data: { titulo: 'Productos' } },
        ]
    },
];

@NgModule({
    imports: 
    [
        RouterModule.forChild(routes)
    ],
    exports: 
    [
        RouterModule
    ]
})
export class PagesRoutingModule {}
