// Terceros
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Propios
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: 
  [
    LoginComponent,
  ],
  imports: 
  [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports:
  [
    LoginComponent
  ]
})
export class AuthModule { }
