import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from '../../domain/models/plant.entity';
import { PlantRepository } from '../../domain/repositories/plant.repository';

@Injectable({
    providedIn: 'root'
})
export class GetPlantsUseCase {
    constructor(private plantRepository: PlantRepository) { }

    execute(): Observable<Plant[]> {
        return this.plantRepository.getPlants();
    }
}
