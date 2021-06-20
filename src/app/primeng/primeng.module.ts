import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNg
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: 
  [
    CommonModule,
    AccordionModule,
    ButtonModule,
    MenubarModule,
    MenuModule,
    OverlayPanelModule,
    TableModule
  ],
  exports:
  [
    AccordionModule,
    ButtonModule,
    MenubarModule,
    MenuModule,
    OverlayPanelModule,
    TableModule
  ]
})
export class PrimengModule { }
