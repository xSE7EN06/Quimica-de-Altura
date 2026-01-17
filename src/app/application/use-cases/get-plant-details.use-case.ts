import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plant } from '../../domain/models/plant.entity';
import { PlantRepository } from '../../domain/repositories/plant.repository';

@Injectable({
    providedIn: 'root'
})
export class GetPlantDetailsUseCase {
    constructor(private plantRepository: PlantRepository) { }

    execute(id: string): Observable<Plant | undefined> {
        return this.plantRepository.getPlantById(id);
    }
}
