import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip, IonLabel, IonIcon, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { flask, leaf, informationCircle } from 'ionicons/icons';
import { GetPlantDetailsUseCase } from '../../../../application/use-cases/get-plant-details.use-case';
import { Plant } from '../../../../domain/models/plant.entity';

@Component({
    selector: 'app-result',
    templateUrl: 'result.page.html',
    styleUrls: ['result.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, HeaderComponent, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonChip, IonLabel, IonIcon, IonGrid, IonRow, IonCol, IonImg]
})
export class ResultPage implements OnInit {
    plant?: Plant;

    constructor(
        private route: ActivatedRoute,
        private getPlantDetails: GetPlantDetailsUseCase
    ) {
        addIcons({ flask, leaf, informationCircle });
    }

    ngOnInit() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.getPlantDetails.execute(id).subscribe(plant => {
                this.plant = plant;
            });
        }
    }
}
