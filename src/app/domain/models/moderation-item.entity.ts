export interface ModerationItem {
    id: string;
    type: 'record' | 'correction' | 'submission';
    content: string;
    submittedBy: string;
    submittedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewedBy?: string;
    reviewedAt?: string;
    notes?: string;
}
