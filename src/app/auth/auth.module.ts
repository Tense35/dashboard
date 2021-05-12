// Terceros
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Propios
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: 
  [
    LoginComponent,
  ],
  imports: 
  [
    CommonModule
  ],
  exports:
  [
    LoginComponent
  ]
})
export class AuthModule { }
