export interface RegionalAvailability {
    id: string;
    species: string;
    state: string;
    region: string;
    source: string;
    abundance: 'common' | 'scarce' | 'rare';
    lastUpdated: string;
    notes?: string;
}
