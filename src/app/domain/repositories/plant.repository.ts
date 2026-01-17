import { Observable } from 'rxjs';
import { Plant } from '../models/plant.entity';

export abstract class PlantRepository {
    abstract getPlants(): Observable<Plant[]>;
    abstract getPlantById(id: string): Observable<Plant | undefined>;
    abstract searchPlants(query: string): Observable<Plant[]>;
    abstract identifyPlant(imageData: string): Observable<Plant | undefined>;
}
