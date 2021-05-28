// Terceros
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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
    HttpClientModule,
    ReactiveFormsModule,
  ],
  exports:
  [
    LoginComponent
  ]
})
export class AuthModule { }
