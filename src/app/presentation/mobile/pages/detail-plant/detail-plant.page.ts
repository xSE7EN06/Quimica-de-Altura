import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonButton, IonImg, IonText, IonProgressBar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { arrowBack, chevronBackOutline, alertCircleOutline, closeOutline, warning } from 'ionicons/icons';
import { PlantInfoModalComponent } from '../../components/plant-info-modal/plant-info-modal.component';

@Component({
    selector: 'app-detail-plant',
    templateUrl: './detail-plant.page.html',
    styleUrls: ['./detail-plant.page.scss'],
    standalone: true,
    imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonButtons, IonBackButton, IonIcon, IonButton, IonImg, IonText, IonProgressBar, PlantInfoModalComponent]
})
export class DetailPlantPage implements OnInit {

    showInfoModal: boolean = false;

    // Hardcoded data for the "Árnica mexicana" view as requested
    plantData = {
        name: 'Árnica mexicana',
        scientificName: 'Heteritheca inuloides Cass',
        image: 'https://cdn.britannica.com/28/140628-050-169547E0/Arnica.jpg',
        properties: [
            { name: 'Antiinflamatoria', percentage: 0.9 },
            { name: 'Antioxidantes', percentage: 0.3 },
            { name: 'Analgésicos', percentage: 0.25 },
            { name: 'Cicatrizante', percentage: 0.75 },
            { name: 'Antimicrobiana', percentage: 0.7 }
        ]
    };

    // Data for the modal - normally would come from plantData but separated for now to match specific design request
    modalPlantData: any = {
        image: 'https://cdn.britannica.com/28/140628-050-169547E0/Arnica.jpg',
        scientificName: 'Heteritheca inuloides Cass',
        commonName: 'Árnica mexicana',
        description: 'La árnica mexicana es una planta perenne que crece en regiones montañosas y templadas de México, especialmente en estados como Puebla, Veracruz, Oaxaca y Michoacán. Alcanza entre 30 y 60 cm de altura, tiene tallos erectos y flores amarillas que se asemejan a pequeñas margaritas. Su aroma es fuerte y característico.',
        traditionalUses: [
            'Pomadas para golpes o torceduras.',
            'Compresas de hojas para reducir inflamación.',
            'Té de árnica (uso controlado) para aliviar el dolor muscular.'
        ],
        warning: 'La información presentada es únicamente informativa y educativa; no constituye una recomendación ni incentivo para su consumo o uso terapéutico. Consulta las normas de la app para más información.'
    };

    constructor() {
        addIcons({
            'arrow-back': arrowBack,
            'chevron-back-outline': chevronBackOutline,
            'alert-circle-outline': alertCircleOutline,
            'close-outline': closeOutline,
            'warning': warning
        });
    }

    ngOnInit() { }

    openInfoModal() {
        this.showInfoModal = true;
    }
}
