export interface ModelVersion {
    id: string;
    name: string;
    type: 'image-classifier' | 'nlp' | 'inference-pipeline';
    version: string;
    accuracy: number;
    status: 'active' | 'deprecated' | 'testing';
    deployedAt: string;
    notes?: string;
    canRollback: boolean;
}
