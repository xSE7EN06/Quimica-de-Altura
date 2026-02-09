import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonButton, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, chevronBackOutline, alertCircleOutline, closeOutline, warning } from 'ionicons/icons';
import { PlantInfoModalComponent } from '../../components/plant-info-modal/plant-info-modal.component';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';
import { Plant } from '../../../../domain/models/plant.entity';

@Component({
    selector: 'app-detail-plant',
    templateUrl: './detail-plant.page.html',
    styleUrls: ['./detail-plant.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonButton, IonProgressBar, PlantInfoModalComponent]
})
export class DetailPlantPage implements OnInit {

    showInfoModal: boolean = false;
    plant: Plant | undefined;

    // Use default data structure compatible with the template
    plantData: any = {
        name: '',
        scientificName: '',
        image: '',
        properties: []
    };

    modalPlantData: any = {
        image: '',
        scientificName: '',
        commonName: '',
        description: '',
        traditionalUses: [],
        warning: ''
    };

    constructor(
        private route: ActivatedRoute,
        private plantRepository: PlantRepository
    ) {
        addIcons({
            'arrow-back': arrowBack,
            'chevron-back-outline': chevronBackOutline,
            'alert-circle-outline': alertCircleOutline,
            'close-outline': closeOutline,
            'warning': warning
        });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.plantRepository.getPlantById(id).subscribe(plant => {
                    if (plant) {
                        this.plant = plant;
                        this.updateViewData(plant);
                    }
                });
            }
        });
    }

    updateViewData(plant: Plant) {
        this.plantData = {
            name: plant.commonName,
            scientificName: plant.scientificName,
            image: plant.imageUrl,
            properties: plant.compounds?.map(c => ({
                name: c.properties[0] || 'Propiedad desconocida', // Taking first property as example
                percentage: Math.random() // Placeholder percentage as it's not in the data model
            })) || []
        };

        this.modalPlantData = {
            image: plant.imageUrl,
            scientificName: plant.scientificName,
            commonName: plant.commonName,
            description: plant.description,
            traditionalUses: [`Región: ${plant.region}`].concat(plant.identifyingFeatures || []),
            warning: 'La información presentada es únicamente informativa y educativa; no constituye una recomendación ni incentivo para su consumo o uso terapéutico. Consulta las normas de la app para más información.'
        };
    }

    openInfoModal() {
        this.showInfoModal = true;
    }
}
