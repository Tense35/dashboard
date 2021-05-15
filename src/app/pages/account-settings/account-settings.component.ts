import { Component, OnInit } from '@angular/core';

// Propios
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent implements OnInit 
{
  public links: NodeListOf<Element> = document.querySelectorAll('.selector') || null;
  constructor( private settingsService: SettingsService ) { }

  ngOnInit(): void 
  {
    this.settingsService.checkCurrentTheme( this.links );
  }

  changeTheme( theme: string )
  {
    this.settingsService.changeTheme( theme, this.links );
  }

}
