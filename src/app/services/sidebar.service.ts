import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService 
{

  menu: any[] = 
  [
    {
      titulo: 'Dashboard',
      icono: 'mdi mdi-gauge',
      submenu: 
      [
        { titulo: 'Main', url: 'main' },
      ]
    },
    {
      titulo: 'Administración',
      icono: 'mdi mdi-folder-lock-open',
      submenu: 
      [
        { titulo: 'Usuarios', url: 'usuarios' },
        { titulo: 'Productos', url: 'productos' },
      ]
    }
  ]

  constructor() { }
}
