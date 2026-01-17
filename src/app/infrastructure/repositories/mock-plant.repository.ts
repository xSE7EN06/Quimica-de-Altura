import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Plant } from '../../domain/models/plant.entity';
import { PlantRepository } from '../../domain/repositories/plant.repository';

@Injectable({
    providedIn: 'root'
})
export class MockPlantRepository extends PlantRepository {
    private plants: Plant[] = [
        {
            id: '1',
            commonName: 'Aloe Vera',
            scientificName: 'Aloe barbadensis miller',
            description: 'Succulent plant species of the genus Aloe. It is widely distributed, and is considered an invasive species in many world regions.',
            imageUrl: 'assets/mock-images/aloe.jpg',
            compounds: [
                {
                    id: 'c1',
                    name: 'Aloin',
                    description: 'Bitter, yellow-brown colored compound.',
                    properties: ['Laxative', 'Anti-inflammatory']
                }
            ],
            identifyingFeatures: ['Thick, fleshy leaves', 'Serrated margins', 'Green to grey-green colour']
        },
        {
            id: '2',
            commonName: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            description: 'Medicinal herb used for stomach ailments and as a mild sedative.',
            imageUrl: 'assets/mock-images/chamomile.jpg',
            compounds: [
                {
                    id: 'c2',
                    name: 'Chamazulene',
                    description: 'Aromatic chemical compound.',
                    properties: ['Anti-inflammatory', 'Antispasmodic']
                }
            ],
            identifyingFeatures: ['Daisy-like flowers', 'Apple-like scent', 'Feathery leaves']
        }
    ];

    getPlants(): Observable<Plant[]> {
        return of(this.plants);
    }

    getPlantById(id: string): Observable<Plant | undefined> {
        const plant = this.plants.find(p => p.id === id);
        return of(plant);
    }

    searchPlants(query: string): Observable<Plant[]> {
        const lowerQuery = query.toLowerCase();
        const results = this.plants.filter(p =>
            p.commonName.toLowerCase().includes(lowerQuery) ||
            p.scientificName.toLowerCase().includes(lowerQuery)
        );
        return of(results);
    }

    identifyPlant(imageData: string): Observable<Plant | undefined> {
        // Mock identification logic: returns a random plant or a specific one
        // For demo purposes, we'll return Aloe Vera
        return of(this.plants[0]);
    }
}
