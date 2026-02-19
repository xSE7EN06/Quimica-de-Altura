export interface Article {
    id: string;
    title: string;
    year: number;
    authors: string[];
    keywords: string[];
    doi: string; // URL/DOI
    country: string;
    abstract: string;
}
