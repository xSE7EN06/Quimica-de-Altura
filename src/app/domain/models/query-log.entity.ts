export interface QueryLog {
    id: string;
    query: string;
    extractedEntities: string[];
    ontologyMappings: string[];
    plantsReturned: string[];
    confidence: number;
    flagged: boolean;
    userId: string;
    createdAt: string;
}
