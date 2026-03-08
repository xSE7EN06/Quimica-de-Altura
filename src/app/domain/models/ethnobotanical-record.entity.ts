export interface EthnobotanicalRecord {
    id: string;
    species: string;
    community: string;
    region: string;
    conditionTreated: string;
    preparationMethod: string;
    rawMaterialPart: string;
    documenter: string;
    year: number;
    evidenceLevel: string; // 'L1' | 'L2' | 'L3' | 'L4'
    notes?: string;
}
