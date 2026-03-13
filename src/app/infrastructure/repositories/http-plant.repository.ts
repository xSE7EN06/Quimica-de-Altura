import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PlantRepository } from '../../domain/repositories/plant.repository';
import { Plant } from '../../domain/models/plant.entity';

interface ApiPage<T> { items: T[]; total: number; page: number; size: number; pages: number; }

@Injectable({ providedIn: 'root' })
export class HttpPlantRepository extends PlantRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/plants`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): Plant {
    return {
      id: r.id,
      commonName: r.common_name ?? '',
      scientificName: r.scientific_name ?? '',
      description: r.description ?? '',
      properties: r.properties ?? [],
      imageUrl: r.image_url ?? '',
      compounds: r.compounds ?? [],
      identifyingFeatures: r.identifying_features ?? [],
      region: r.region ?? '',
      category: r.category,
    };
  }

  getPlants(): Observable<Plant[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getPlantsByCategory(category: string): Observable<Plant[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?category=${encodeURIComponent(category)}&size=100`).pipe(
      map(res => res.items.map(r => this.map(r)))
    );
  }

  getPlantById(id: string): Observable<Plant | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  searchPlants(query: string): Observable<Plant[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?search=${encodeURIComponent(query)}&size=100`).pipe(
      map(res => res.items.map(r => this.map(r)))
    );
  }

  identifyPlant(_imageData: string): Observable<Plant | undefined> {
    return this.http.post<any>(`${environment.gatewayUrl}/api/plants/identify`, { image: _imageData }).pipe(
      map(r => this.map(r))
    );
  }

  addPlant(plant: Plant): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      common_name: plant.commonName,
      scientific_name: plant.scientificName,
      description: plant.description,
      properties: plant.properties,
      image_url: plant.imageUrl,
      region: plant.region,
      category: plant.category,
    });
  }

  updatePlant(plant: Plant): Observable<void> {
    return this.http.put<void>(`${this.base}/${plant.id}`, {
      common_name: plant.commonName,
      scientific_name: plant.scientificName,
      description: plant.description,
      properties: plant.properties,
      image_url: plant.imageUrl,
      region: plant.region,
      category: plant.category,
    });
  }

  deletePlant(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
