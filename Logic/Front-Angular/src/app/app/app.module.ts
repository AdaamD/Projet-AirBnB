import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AffichageBienComponent } from '../affichage-bien/affichage-bien.component';



@NgModule({
  declarations: [AffichageBienComponent],
  imports: [
    CommonModule,
    FormsModule,
  ]
})
export class AppModule { }
