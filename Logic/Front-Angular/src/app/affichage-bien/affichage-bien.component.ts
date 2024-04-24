import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BiensService } from '../biens.service';
import { BiensDataService } from '../biens-data-service.service';
import { ReservationService } from '../reservation-service.service';

@Component({
  selector: 'app-affichage-bien',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './affichage-bien.component.html',
  styleUrls: ['./affichage-bien.component.css']
})
export class AffichageBienComponent implements OnInit {
  biens: any[] = [];
  afficherDetailsSupplementaires: boolean = false;
  showReservationModal: boolean = false;
  mailLoueur: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  selectedBien: any;

  constructor(
    private biensDataService: BiensDataService,
    private reservationService: ReservationService
  ) {}

  ngOnInit(): void {
    // Utilisez des valeurs par défaut pour les critères de recherche
    const startDate = '';
    const endDate = '';
    const commune = ''; // Vous pouvez remplacer par une commune spécifique
    const maxPrice = 1000; // Vous pouvez remplacer par un prix maximum
    const minRooms = 1; // Vous pouvez remplacer par un nombre de chambres minimum
    const minBeds = 1; // Vous pouvez remplacer par un nombre de couchages minimum
    const maxDistance = 1000; // Vous pouvez remplacer par une distance maximum

    this.biensDataService.biens$.subscribe(
      (biens) => {
        this.biens = biens;
      }
    );
  }

  reserverBien(bien: any): void {
    this.selectedBien = bien;
    this.mailLoueur = bien.mailProprio;
    this.showReservationModal = true;
  }

  enregistrerReservation(): void {
    const reservation = {
      idBien: this.selectedBien.idBien,
      dateDebut: this.dateDebut,
      dateFin: this.dateFin,
      mailLoueur: this.mailLoueur,
      prixNuit: this.selectedBien.prixNuit
    };

    this.reservationService.createReservation(reservation).subscribe(
      (response) => {
        console.log('Réservation enregistrée avec succès:', response);
        // Affichez un message de succès ou effectuez d'autres actions
      },
      (error) => {
        console.error('Erreur lors de l\'enregistrement de la réservation:', error);
        // Affichez un message d'erreur
      }
    );
  }
}
