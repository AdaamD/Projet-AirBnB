import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AffichageBienComponent } from '../affichage-bien/affichage-bien.component';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';



@NgModule({
  declarations: [AffichageBienComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule
  ]
})
export class AppModule { }
