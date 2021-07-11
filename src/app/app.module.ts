import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Propios
import { AuthModule } from './auth/auth.module';
import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { PagesModule } from './pages/pages.module';
import { PublicModule } from './public/public.module';
import { CardPipe } from './pipes/card.pipe';
import { CardEmptyPipe } from './pipes/card-empty.pipe';

@NgModule({
  declarations: 
  [
    AppComponent,
    NopagefoundComponent
  ],
  imports: 
  [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    PublicModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
