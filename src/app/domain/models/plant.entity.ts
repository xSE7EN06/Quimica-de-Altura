import { ChemicalCompound } from './chemical-compound.entity';

export interface Plant {
    id: string;
    commonName: string;
    scientificName: string;
    description: string;
    imageUrl: string;
    compounds: ChemicalCompound[];
    habitat?: string;
    identifyingFeatures: string[];
}
