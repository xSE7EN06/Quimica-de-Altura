export interface DrugReference {
    id: string;
    drugName: string;
    activeIngredient: string;
    linkedCompound: string;
    linkedPlant: string;
    pathwayOverlap: string;
    similarityScore: number;
    mechanism: string;
    notes?: string;
}
