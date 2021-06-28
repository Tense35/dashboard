import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// Propios
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { AuthGuard } from '../guards/auth.guard';
import { PagesComponent } from './pages.component';
import { PerfilComponent } from './perfil/perfil.component';

// Administración
import { DashboardComponent } from './dashboard/dashboard.component';
import { CategoriasComponent } from './administracion/categorias/categorias.component';
import { ProductosComponent } from './administracion/productos/productos.component';
import { UsuariosComponent } from './administracion/usuarios/usuarios.component';


const routes: Routes = 
[
    { 
        path: 'dashboard', 
        component: PagesComponent,
        canActivate: [ AuthGuard ],
        children: 
        [
          { path: '', component: DashboardComponent, data: { titulo: 'Dashboard' } },
          { path: 'account-settings', component: AccountSettingsComponent, data: { titulo: 'Ajustes' } },
          { path: 'categorias', component: CategoriasComponent, data: { titulo: 'Categorías' } },
          { path: 'perfil', component: PerfilComponent, data: { titulo: 'Mi perfil' } },
          { path: 'productos', component: ProductosComponent, data: { titulo: 'Productos' } },
          { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios' } },
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
