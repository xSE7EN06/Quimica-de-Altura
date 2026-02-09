import { Observable } from 'rxjs';
import { Plant } from '../models/plant.entity';

export abstract class PlantRepository {
    abstract getPlants(): Observable<Plant[]>;
    abstract getPlantsByCategory(category: string): Observable<Plant[]>;
    abstract getPlantById(id: string): Observable<Plant | undefined>;
    abstract searchPlants(query: string): Observable<Plant[]>;
    abstract identifyPlant(imageData: string): Observable<Plant | undefined>;

    abstract addPlant(plant: Plant): Observable<void>;
    abstract updatePlant(plant: Plant): Observable<void>;
    abstract deletePlant(id: string): Observable<void>;
}
