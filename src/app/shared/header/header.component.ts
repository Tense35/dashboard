import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent 
{

  public userData;

  constructor( private authService: AuthService ) 
  { 
    this.userData = authService.usuario;
  }
  
  logout()
  {
    this.authService.logout();
  }


}
