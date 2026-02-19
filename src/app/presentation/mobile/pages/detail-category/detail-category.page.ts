import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/angular/standalone';
import { HeaderComponent } from '../../components/header/header.component';
import { SearchInputComponent } from '../../components/search-input/search-input.component';
import { MostSearchedCardComponent } from '../../components/most-searched-card/most-searched-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { alertCircleOutline, flashOutline, moonOutline, medkitOutline, restaurantOutline, snowOutline, leafOutline } from 'ionicons/icons';
import { PlantRepository } from '../../../../domain/repositories/plant.repository';

@Component({
    selector: 'app-detail-category',
    templateUrl: './detail-category.page.html',
    styleUrls: ['./detail-category.page.scss'],
    standalone: true,
    imports: [IonContent, CommonModule, FormsModule, HeaderComponent, SearchInputComponent, MostSearchedCardComponent, IonIcon]
})
export class DetailCategoryPage implements OnInit {
    categoryName: string = '';
    plants: any[] = [];
    private allCategoryPlants: any[] = []; // Store all plants for client-side filtering
    description: string = '';

    categoryTitle: string = '';
    categoryImage: string = '';
    categoryIcon: string = '';
    categoryBenefits: string[] = [];

    private categoryConfig: any = {
        'Energizante': {
            title: 'Energizantes',
            description: 'Plantas que ayudan a aumentar la energía y reducir la fatiga de forma natural.',
            image: 'https://img.freepik.com/premium-vector/man-running-park-morning_165429-792.jpg',
            icon: 'flash-outline',
            benefits: ['⚡ Aumentan la energía', '🧠 Mejoran la concentración', '💪 Reducen la fatiga']
        },
        'Relajante': {
            title: 'Relajantes',
            description: 'Plantas que ayudan a reducir el estrés y conciliar el sueño.',
            image: 'https://img.freepik.com/free-vector/meditating-concept-illustration_114360-2972.jpg',
            icon: 'moon-outline',
            benefits: ['😌 Reducen el estrés', '😴 Ayudan a dormir', 'cw Calman la ansiedad']
        },
        'Dolor': {
            title: 'Para el Dolor',
            description: 'Plantas con propiedades analgésicas y antiinflamatorias.',
            image: 'https://img.freepik.com/free-vector/flat-person-having-headache_23-2148924043.jpg',
            icon: 'medkit-outline',
            benefits: ['💊 Alivian el dolor', '🔥 Reducen inflamación', '🌿 Alternativa natural']
        },
        'Digestivo': {
            title: 'Digestivas',
            description: 'Plantas que ayudan a mejorar la digestión y aliviar malestares estomacales.',
            image: 'https://img.freepik.com/free-vector/stomach-ache-concept-illustration_114360-1558.jpg',
            icon: 'restaurant-outline',
            benefits: ['🤢 Alivia náuseas', '🔥 Combate acidez', '🔄 Mejora digestión']
        },
        'Respiratorio': {
            title: 'Respiratorias',
            description: 'Plantas que ayudan a limpiar las vías respiratorias y combatir infecciones.',
            image: 'https://img.freepik.com/free-vector/itchy-skin-concept-illustration_114360-14330.jpg',
            icon: 'snow-outline',
            benefits: ['🫁 Limpia pulmones', '🦠 Antibacteriano', '🤧 Alivia tos']
        },
        'default': {
            title: 'Plantas Medicinales',
            description: 'Plantas medicinales de la región de las Altas Montañas.',
            image: '/assets/icon/favicon.png',
            icon: 'leaf-outline',
            benefits: ['🌿 Tradición ancestral', '💪 Remedios naturales', '🌎 Flora local']
        }
    };

    constructor(
        private route: ActivatedRoute,
        private plantRepository: PlantRepository,
        private router: Router
    ) {
        addIcons({ alertCircleOutline, flashOutline, moonOutline, medkitOutline, restaurantOutline, snowOutline, leafOutline });
    }

    ngOnInit() {
        this.route.paramMap.subscribe(params => {
            this.categoryName = params.get('categoryName') || '';
            this.loadCategoryData();
        });
    }

    loadCategoryData() {
        const key = this.normalizeCategory(this.categoryName);
        const config = this.categoryConfig[key] || this.categoryConfig['default'];

        this.categoryTitle = config.title;
        this.description = config.description;
        this.categoryImage = config.image;
        this.categoryIcon = config.icon;
        this.categoryBenefits = config.benefits;

        this.plantRepository.getPlantsByCategory(key).subscribe(plants => {
            this.allCategoryPlants = plants.map(plant => ({
                id: plant.id,
                name: plant.commonName,
                scientificName: plant.scientificName,
                imageUrl: plant.imageUrl,
                properties: plant.properties.map(prop => ({
                    name: prop,
                    percentage: Math.floor(Math.random() * 40) + 60
                }))
            }));
            this.plants = [...this.allCategoryPlants];
        });
    }

    normalizeCategory(category: string): string {
        if (!category) return 'default';
        const lower = category.toLowerCase();
        if (lower.includes('energiza')) return 'Energizante';
        if (lower.includes('relaja')) return 'Relajante';
        if (lower.includes('dolor')) return 'Dolor';
        if (lower.includes('dolencia')) return 'Dolor';
        if (lower.includes('digest')) return 'Digestivo';
        if (lower.includes('respir') || lower.includes('bacter')) return 'Respiratorio';
        return 'default';
    }


    onSearch(term: string) {
        if (!term || term.trim() === '') {
            this.plants = [...this.allCategoryPlants];
            return;
        }

        const lowerTerm = term.toLowerCase();
        this.plants = this.allCategoryPlants.filter(plant =>
            plant.name.toLowerCase().includes(lowerTerm) ||
            plant.scientificName.toLowerCase().includes(lowerTerm) ||
            plant.properties.some((p: any) => p.name.toLowerCase().includes(lowerTerm))
        );
    }

    onFilter() {
        console.log('Filter');
    }

    scanPlant() {
        console.log('Scan Plant');
    }

    viewDetail(id: string) {
        this.router.navigate(['/detail-plant', id]);
    }

}
