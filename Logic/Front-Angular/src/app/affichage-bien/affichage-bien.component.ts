import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiensService } from '../biens.service';

@Component({
  selector: 'app-affichage-bien',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './affichage-bien.component.html',
  styleUrls: ['./affichage-bien.component.css']
})
export class AffichageBienComponent implements OnInit {
public  biens: any[] = new Array();

  constructor(private biensService: BiensService) { }

  ngOnInit(): void {
    this.biensService.getBiens().subscribe(
      (data) => {
        console.log(data);
        this.biens = data.documents;
      }
    );
  }
}
