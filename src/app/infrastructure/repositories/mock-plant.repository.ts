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
            description: 'Planta suculenta conocida por sus propiedades curativas para la piel y el sistema digestivo.',
            properties: ['Antiinflamatorio', 'Cicatrizante', 'Hidratante'],
            imageUrl: 'assets/mock-images/aloe.jpg',
            compounds: [
                {
                    id: 'c1',
                    name: 'Aloína',
                    description: 'Compuesto amargo y amarillento extraído de la planta.',
                    properties: ['Laxante', 'Desintoxicante']
                }
            ],
            identifyingFeatures: ['Hojas carnosas y espinosas', 'Gel transparente en su interior', 'Flores tubulares amarillas'],
            region: 'Regiones tropicales y subtropicales'
        },
        {
            id: '2',
            commonName: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            description: 'Hierba aromática utilizada tradicionalmente para problemas digestivos y como calmante suave.',
            properties: ['Antiespasmódico', 'Sedante suave', 'Digestivo'],
            imageUrl: 'assets/mock-images/chamomile.jpg',
            compounds: [
                {
                    id: 'c2',
                    name: 'Chamazuleno',
                    description: 'Compuesto químico aromático presente en muchos aceites esenciales.',
                    properties: ['Antiinflamatorio', 'Antioxidante']
                }
            ],
            identifyingFeatures: ['Flores blancas con centro amarillo', 'Aroma similar a la manzana', 'Hojas Plumosas'],
            region: 'Europa y Asia templada'
        },
        {
            id: '3',
            commonName: 'Árnica',
            scientificName: 'Arnica montana',
            description: 'Planta medicinal valorada por sus potentes efectos analgésicos y antiinflamatorios externos.',
            properties: ['Analgésico', 'Antiinflamatorio', 'Antiequimótico'],
            imageUrl: 'assets/mock-images/arnica.jpg',
            compounds: [
                {
                    id: 'c3',
                    name: 'Helenalina',
                    description: 'Lactona sesquiterpénica con efectos antiinflamatorios.',
                    properties: ['Antiinflamatorio', 'Inhibidor NF-kB']
                }
            ],
            identifyingFeatures: ['Flores amarillas brillantes', 'Hojas basales en roseta', 'Crecimiento en praderas de montaña'],
            region: 'Zonas montañosas de Europa'
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
