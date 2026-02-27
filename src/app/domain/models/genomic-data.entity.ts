export interface GenomicData {
    id: string;
    species: string;
    fastaFile: string;
    genbankId: string;
    keggPathway: string;
    enzymeHomology: string;
    geneCluster: string;
    blastResults: string;
    uploadedAt: string;
    status: 'pending' | 'processed' | 'error';
}
