import { ChemicalCompound } from './chemical-compound.entity';

export interface Plant {
    id: string;
    commonName: string;
    scientificName: string;
    description: string;
    properties: string[];
    imageUrl: string;
    compounds: ChemicalCompound[];
    identifyingFeatures: string[];
    region: string;
    category?: string;
}
