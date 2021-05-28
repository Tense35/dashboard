// Terceros
import { Component, OnInit } from '@angular/core';

// Propios
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent 
{

  public menuItems: any[] = [null];
  public userData;

  constructor( private sidebarService: SidebarService, private authService: AuthService ) 
  { 
    this.menuItems = sidebarService.menu;
    this.userData = authService.usuario;
  }

  logout()
  {
    this.authService.logout();
  }
  

}
