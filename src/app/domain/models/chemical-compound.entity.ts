export interface ChemicalCompound {
    id: string;
    name: string;
    iupacName: string;
    molecularFormula: string;
    molecularWeight: string;
    pubchemCid: string;
    smiles: string;
    inchi: string;
    inchiKey: string;
    description?: string; // Optional for compatibility
}
