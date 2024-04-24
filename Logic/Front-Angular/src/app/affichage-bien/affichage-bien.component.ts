import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BiensService } from '../biens.service';
import { BiensDataService } from '../biens-data-service.service';
import { ReservationService } from '../reservation-service.service';

@Component({
  selector: 'app-affichage-bien',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './affichage-bien.component.html',
  styleUrls: ['./affichage-bien.component.css']
})
export class AffichageBienComponent implements OnInit {
  biens: any[] = [];
  afficherDetailsSupplementaires: boolean = false;

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
    const reservation = {
      idBien: bien.idBien,
      dateDebut: '2023-06-01', // Remplacez par les dates de réservation
      dateFin: '2023-06-07',
      mailLoueur: bien.mailProprio,
      prixNuit: bien.prixNuit
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
