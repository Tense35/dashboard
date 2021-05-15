import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService
{
  private linkTheme = document.querySelector('#theme');
  
  constructor() 
  { 

    const url = localStorage.getItem('theme') || './assets/css/colors/blue-dark.css';
    this.linkTheme?.setAttribute('href', url);

  }

  changeTheme( theme: string, links: NodeListOf<Element> = document.querySelectorAll('.selector') )
  {
    const url = `./assets/css/colors/${ theme }.css`;

    this.linkTheme?.setAttribute('href', url);
    localStorage.setItem('theme', url);
    this.checkCurrentTheme( links );
  }

  checkCurrentTheme( links: NodeListOf<Element> = document.querySelectorAll('.selector') ): void 
  {

    links.forEach( element => 
    {
      element.classList.remove('working');
      const btnTheme = element.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${ btnTheme }.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if ( btnThemeUrl === currentTheme )
      {
        element.classList.add('working');
      }

    });

  }


}
