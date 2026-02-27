export interface InferenceJob {
    id: string;
    species: string;
    jobType: string;
    status: 'pending' | 'running' | 'completed' | 'failed' | 'flagged';
    confidenceScore: number;
    output: string;
    flaggedForReview: boolean;
    approvedBy?: string;
    createdAt: string;
    completedAt?: string;
}
