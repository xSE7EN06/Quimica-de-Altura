export interface OntologyTerm {
    id: string;
    canonicalTerm: string;
    icd10Code: string;
    meshId: string;
    synonyms: string[];
    category: string;
    description?: string;
}
