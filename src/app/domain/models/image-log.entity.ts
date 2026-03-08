export interface ImageLog {
    id: string;
    imageUrl: string;
    predictedSpecies: string;
    confidence: number;
    modelVersion: string;
    userFeedback: 'correct' | 'incorrect' | 'unsure';
    flagged: boolean;
    userId: string;
    createdAt: string;
}
