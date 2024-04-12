import { Component } from '@angular/core';
import { BiensService } from '../biens.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})

export class NavBarComponent {
  startDate: string = '';
  endDate: string = '';
  commune: string = '';
  maxPrice: number = 1000;
  minRooms: number = 1;
  minBeds: number = 1;
  maxDistance: number = 1000;
  form: NgForm;
  biens: any[]= [] ;

  constructor(private biensService: BiensService) {
    this.form = new NgForm([], []); // Initialisez form avec une nouvelle instance de NgForm
  }

  onSearch(form: NgForm) {
    const { startDate, endDate, commune, maxPrice, minRooms, minBeds, maxDistance } = form.value;
    this.biensService.searchBiens(startDate, endDate, commune, maxPrice, minRooms, minBeds, maxDistance).subscribe(
      (data) => {
        console.log('Search Results:', data);
        this.biens = data;
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }
}