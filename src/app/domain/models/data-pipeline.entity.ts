export interface DataPipeline {
    id: string;
    name: string;
    source: string;
    status: 'active' | 'idle' | 'error' | 'syncing';
    lastSync: string;
    nextSync: string;
    recordsSynced: number;
    errorLog?: string;
}
