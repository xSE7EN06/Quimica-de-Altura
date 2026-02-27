import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ChemicalCompound } from '../../domain/models/chemical-compound.entity';
import { CompoundRepository } from '../../domain/repositories/compound.repository';

@Injectable({
    providedIn: 'root'
})
export class MockCompoundRepository extends CompoundRepository {
    private compounds: ChemicalCompound[] = [
        {
            id: '1',
            name: 'Menthol',
            iupacName: '(1R,2S,5R)-2-isopropyl-5-methylcyclohexanol',
            molecularFormula: 'C10H20O',
            molecularWeight: '156.27 g/mol',
            pubchemCid: '1254',
            smiles: 'CC(C)C1CCC(CC1O)C',
            inchi: 'InChI=1S/C10H20O/c1-7(2)9-5-4-8(3)6-10(9)11/h7-11H,4-6H2,1-3H3',
            inchiKey: 'CQEVNEHBBNORPU-UHFFFAOYSA-N',
            properties: ['Antiséptico', 'Analgésico']
        },
        {
            id: '2',
            name: 'Quercetin',
            iupacName: '2-(3,4-dihydroxyphenyl)-3,5,7-trihydroxychromen-4-one',
            molecularFormula: 'C15H10O7',
            molecularWeight: '302.24 g/mol',
            pubchemCid: '5280343',
            smiles: 'C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O',
            inchi: 'InChI=1S/C15H10O7/c16-7-4-10(19)12-11(5-7)22-15(14(21)13(12)20)6-1-2-8(17)9(18)3-6/h1-5,16-19,21H',
            inchiKey: 'REFJWTPEDBCVDE-UHFFFAOYSA-N',
            properties: ['Antioxidante', 'Antiinflamatorio']
        },
        {
            id: '3',
            name: 'Rosmarinic acid',
            iupacName: '(2R)-3-(3,4-dihydroxyphenyl)-2-[(E)-3-(3,4-dihydroxyphenyl)prop-2-enoyl]oxypropanoic acid',
            molecularFormula: 'C18H16O8',
            molecularWeight: '360.31 g/mol',
            pubchemCid: '5281792',
            smiles: 'C1=CC(=C(C=C1C=CC(=O)OC(CC2=CC(=C(C=C2)O)O)C(=O)O)O)O',
            inchi: 'InChI=1S/C18H16O8/c19-12-4-1-10(7-14(12)21)3-6-17(24)26-16(18(25)26)9-11-2-5-13(20)15(22)8-11/h1-8,16,19-22H,9H2,(H,25,26)',
            inchiKey: 'DOUMSIUAVSJWRE-UHFFFAOYSA-N',
            properties: ['Antioxidante', 'Antiinflamatorio', 'Antiséptico']
        },
        {
            id: '4',
            name: 'Thymol',
            iupacName: '2-isopropyl-5-methylphenol',
            molecularFormula: 'C10H14O',
            molecularWeight: '150.22 g/mol',
            pubchemCid: '6989',
            smiles: 'CC1=CC(=C(C=C1)C(C)C)O',
            inchi: 'InChI=1S/C10H14O/c1-7(2)10-5-4-8(3)6-9(10)11/h4-7,11H,1-3H3',
            inchiKey: 'MGNIMBSQLORROK-UHFFFAOYSA-N',
            properties: ['Antiséptico', 'Antioxidante']
        },
        {
            id: '5',
            name: 'Eugenol',
            iupacName: '4-allyl-2-methoxyphenol',
            molecularFormula: 'C10H12O2',
            molecularWeight: '164.20 g/mol',
            pubchemCid: '3314',
            smiles: 'COC1=C(C=CC(=C1)CC=C)O',
            inchi: 'InChI=1S/C10H12O2/c1-3-4-8-5-6-9(11)10(7-8)12-2/h3,5-7,11H,1,4H2,2H3',
            inchiKey: 'RRAFCDWBNXTKKO-UHFFFAOYSA-N',
            properties: ['Antiséptico', 'Analgésico', 'Sedante']
        },
        {
            id: '6',
            name: 'Caffeine',
            iupacName: '1,3,7-trimethylpurine-2,6-dione',
            molecularFormula: 'C8H10N4O2',
            molecularWeight: '194.19 g/mol',
            pubchemCid: '2519',
            smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C',
            inchi: 'InChI=1S/C8H10N4O2/c1-10-4-9-6-5(10)7(13)12(3)8(14)11(6)2/h4H,1-3H3',
            inchiKey: 'RYYVLZVUVIJVGH-UHFFFAOYSA-N',
            properties: ['Estimulante']
        },
        {
            id: '7',
            name: 'Capsaicin',
            iupacName: '(E)-N-(4-hydroxy-3-methoxybenzyl)-8-methylnon-6-enamide',
            molecularFormula: 'C18H27NO3',
            molecularWeight: '305.41 g/mol',
            pubchemCid: '1548943',
            smiles: 'CC(C)C=CCCCC(=O)NCC1=CC(=C(C=C1)O)OC',
            inchi: 'InChI=1S/C18H27NO3/c1-14(2)8-6-4-5-7-9-18(21)19-13-15-10-11-16(20)17(12-15)22-3/h6,8,10-12,14,20H,4-5,7,9,13H2,1-3H3,(H,19,21)/b8-6+',
            inchiKey: 'YKJMSFGAABHHOQ-FSRGNKNGSA-N',
            properties: ['Analgésico', 'Antiinflamatorio']
        },
        {
            id: '8',
            name: 'Atropine',
            iupacName: '(1R,3r,5S)-8-methyl-8-azabicyclo[3.2.1]octan-3-yl 3-hydroxy-2-phenylpropanoate',
            molecularFormula: 'C17H23NO3',
            molecularWeight: '289.37 g/mol',
            pubchemCid: '174174',
            smiles: 'CN1C2CCC1CC(C2)OC(=O)C(CO)C3=CC=CC=C3',
            inchi: 'InChI=1S/C17H23NO3/c1-18-12-7-8-13(18)10-14(9-12)21-17(20)16(11-19)15-5-3-2-4-6-15/h2-6,12-14,16,19H,7-11H2,1H3/t12?,13?,14-,16?',
            inchiKey: 'RKUNLFJZGGFXQJ-UHFFFAOYSA-N',
            properties: ['Antiespasmódico', 'Sedante']
        },
        {
            id: '9',
            name: 'Vanillin',
            iupacName: '4-hydroxy-3-methoxybenzaldehyde',
            molecularFormula: 'C8H8O3',
            molecularWeight: '152.15 g/mol',
            pubchemCid: '1183',
            smiles: 'COC1=C(C=CC(=C1)C=O)O',
            inchi: 'InChI=1S/C8H8O3/c1-11-8-4-6(5-9)2-3-7(8)10/h2-5,10H,1H3',
            inchiKey: 'MWOOGOJHIENMIC-UHFFFAOYSA-N',
            properties: ['Antioxidante']
        },
        {
            id: '10',
            name: 'Lutein',
            iupacName: 'beta,epsilon-carotene-3,3\'-diol',
            molecularFormula: 'C40H56O2',
            molecularWeight: '568.87 g/mol',
            pubchemCid: '5281243',
            smiles: 'CC1=C(C(CC(C1)O)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2C(=CC(CC2)O)C)C)C',
            inchi: 'InChI=1S/C40H56O2/c1-31(19-13-21-33(3)25-27-37-35(5)23-15-29-39(37,7)8)17-11-12-18-32(2)20-14-22-34(4)26-28-38-36(6)24-16-30-40(38,9)10/h11-14,17-22,25-28,37-38,41-42H,15-16,23-24,29-30H2,1-10H3/b12-11+,17-12+,18-11+,21-13+,22-14+,27-25+,28-26+,31-19+,32-20+,33-21+,34-22+/t37-,38+,41+,42-/m0/s1',
            inchiKey: 'KBPHJBAIARWVSC-GGERISQZSA-N'
        },
        {
            id: '11',
            name: 'Resveratrol',
            iupacName: '5-[(E)-2-(4-hydroxyphenyl)ethenyl]benzene-1,3-diol',
            molecularFormula: 'C14H12O3',
            molecularWeight: '228.24 g/mol',
            pubchemCid: '445154',
            smiles: 'C1=CC(=CC=C1C=CC2=CC(=CC(=C2)O)O)O',
            inchi: 'InChI=1S/C14H12O3/c15-12-5-3-10(4-6-12)1-2-11-7-13(16)9-14(17)8-11/h1-9,15-17H/b2-1+',
            inchiKey: 'LUKBXSAWLPMMSZ-OWOJBTEDSA-N'
        },
        {
            id: '12',
            name: 'Beta-Carotene',
            iupacName: '1,1\'-(3,7,12,16-tetramethyl-1,3,5,7,9,11,13,15,17-octadecanonaene-1,18-diyl)bis(2,6,6-trimethylcyclohexene)',
            molecularFormula: 'C40H56',
            molecularWeight: '536.87 g/mol',
            pubchemCid: '5280489',
            smiles: 'CC1=C(C(CCC1)(C)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2=C(CCCC2(C)C)C)C)C',
            inchi: 'InChI=1S/C40H56/c1-33(19-13-21-35(3)25-27-37-31(17)23-15-29-39(37,7)8)11-12-38-40(9,10)30-16-24-32(38)18-34(2)20-14-22-36(4)26-28-38/h11-14,17-22,25-28H,15-16,23-24,29-30H2,1-10H3/b12-11+,19-13+,20-14+,21-13+,22-14+,25-11+,26-12+,27-25+,28-26+,33-19+,34-20+,35-21+,36-22+',
            inchiKey: 'OENHQHLEOONYIE-JLTXGRSLSA-N'
        },
        {
            id: '13',
            name: 'Morphine',
            iupacName: '(4R,4aR,7S,7aR,12bS)-3-methyl-2,3,4,4a,7,7a-hexahydro-1H-4,12-methanobenzofuro[3,2-e]isoquinoline-7,9-diol',
            molecularFormula: 'C17H19NO3',
            molecularWeight: '285.34 g/mol',
            pubchemCid: '5288826',
            smiles: 'CN1CCC23C4C1CC5=C2C(=C(C=C5)O)OC3C(C=C4)O',
            inchi: 'InChI=1S/C17H19NO3/c1-18-7-6-17-10-3-5-13(20)16(17)21-15-12(19)4-2-9(14(15)17)8-11(10)18/h2-5,10-11,13,16,19-20H,6-8H2,1H3/t10-,11+,13-,16-,17-/m0/s1',
            inchiKey: 'BQJCRHHNABKAKU-KBQPJGBKSA-N'
        },
        {
            id: '14',
            name: 'Strychnine',
            iupacName: 'Strychnidin-10-one',
            molecularFormula: 'C21H22N2O2',
            molecularWeight: '334.41 g/mol',
            pubchemCid: '441071',
            smiles: 'C1CN2C3C4(CC2C5=CC=CC=C5N4C(=O)C3)CC6C7=C1COC7=CC6',
            inchi: 'InChI=1S/C21H22N2O2/c24-18-10-16-19-13-9-17-21(6-7-22(17)11-12(19)5-8-25-16)14-3-1-2-4-15(14)23(18)20(13)21/h1-5,13,16-17,19-20H,6-11H2/t13-,16-,17-,19-,20-,21+/m0/s1',
            inchiKey: 'QMGVPVSNSZLJIA-BSRZMSEKSA-N'
        }
    ];

    private searchOptions: ChemicalCompound[] = [
        {
            id: 'opt1',
            name: 'Linalool',
            iupacName: '3,7-dimethylocta-1,6-dien-3-ol',
            molecularFormula: 'C10H18O',
            molecularWeight: '154.25 g/mol',
            pubchemCid: '6549',
            smiles: 'CC(=CCCC(C)(C=C)O)C',
            inchi: 'InChI=1S/C10H18O/c1-5-10(4,11)8-6-7-9(2)3/h5,7,11H,1,6,8H2,2-4H3',
            inchiKey: 'CDOSHBVCOALMLC-UHFFFAOYSA-N'
        },
        {
            id: 'opt2',
            name: 'Eucalyptol',
            iupacName: '1,3,3-trimethyl-2-oxabicyclo[2.2.2]octane',
            molecularFormula: 'C10H18O',
            molecularWeight: '154.25 g/mol',
            pubchemCid: '2758',
            smiles: 'CC12CCC(CC1)C(C)(C)O2',
            inchi: 'InChI=1S/C10H18O/c1-9(2)8-4-6-10(3,7-5-8)11-9/h8H,4-7H2,1-3H3',
            inchiKey: 'SREVYVZTEYVRIA-UHFFFAOYSA-N'
        },
        {
            id: 'opt3',
            name: 'Cyanidin-3-glucoside',
            iupacName: '2-(3,4-dihydroxyphenyl)-3-(beta-D-glucopyranosyloxy)-5,7-dihydroxychromenylium',
            molecularFormula: 'C21H21O11',
            molecularWeight: '449.38 g/mol',
            pubchemCid: '115201',
            smiles: 'C1=CC(=C(C=C1C2=C(C=C3C(=CC(=CC3=[O+]2)O)O)O[C@H]4[C@@H]([C@H]([C@@H]([C@H](O4)CO)O)O)O)O)O',
            inchi: 'InChI=1S/C21H20O11/c22-7-16-18(27)19(28)20(29)21(32-16)31-15-6-11-12(25)8-10(23)9-13(11)30-14(15)5-1-2-17(26)7(3)18/h1-6,16,18-20,22,25-29H,7-9H2/t16-,18-,19+,20-,21+/m1/s1',
            inchiKey: 'SQUYVHKIQLSRE-UHFFFAOYSA-N'
        },
        {
            id: 'opt4',
            name: 'Kaempferitrin',
            iupacName: '3,7-bis(6-deoxy-alpha-L-mannopyranosyloxy)-5-hydroxy-2-(4-hydroxyphenyl)chromen-4-one',
            molecularFormula: 'C27H30O14',
            molecularWeight: '578.5 g/mol',
            pubchemCid: '5282161',
            smiles: 'CC1C(C(C(C(O1)OC2=CC3=C(C(=O)C(=C(O3)C4=CC=C(C=C4)O)OC5C(C(C(C(O5)C)O)O)O)C(=C2)O)O)O)O',
            inchi: 'InChI=1S/C27H30O14/c1-10-18(30)20(32)22(34)25(37-10)39-13-6-15-17(16(29)7-13)41-24(12-4-8-14(28)9-5-12)23(27(15)36)40-26-21(33)19(31)11(2)38-26/h4-9,10-11,18-22,25-26,28-34H,1-2H3',
            inchiKey: 'IJOOHUBCXALUOV-UHFFFAOYSA-N'
        },
        {
            id: 'opt5',
            name: 'Ascaridole',
            iupacName: '1-isopropyl-4-methyl-2,3-dioxabicyclo[2.2.2]oct-5-ene',
            molecularFormula: 'C10H16O2',
            molecularWeight: '168.23 g/mol',
            pubchemCid: '10452',
            smiles: 'CC(C)C12CCC(C=C1)(OO2)C',
            inchi: 'InChI=1S/C10H16O2/c1-8(2)10-6-4-9(3,11-12-10)5-7-10/h4-5,8H,6-7H2,1-3H3',
            inchiKey: 'XMGQYMWWDOXLRX-UHFFFAOYSA-N'
        },
        {
            id: 'opt6',
            name: 'Helenalin',
            iupacName: '(3aS,4S,4aR,7aS,8R,9aS)-4-hydroxy-4a,8-dimethyl-3-methylidene-3a,4,5,7a,8,9,9a,9b-octahydroazuleno[4,5-b]furan-2,6-dione',
            molecularFormula: 'C15H18O4',
            molecularWeight: '262.3 g/mol',
            pubchemCid: '441063',
            smiles: 'CC1C2CC(C3(C2CC=C4C3CC(=C)C(=O)O4)C)C(=O)C1O',
            inchi: 'InChI=1S/C15H18O4/c1-8-12-11(13(17)9(2)14(12)18)10-5-4-7-15(10,3)6-12/h5,8,10-11,14,18H,1,4,6-7H2,2-3H3/t8-,10-,11+,12-,14+,15+/m1/s1',
            inchiKey: 'KZVAKBWBGRBTMN-UHFFFAOYSA-N'
        }
    ];

    getCompounds(): Observable<ChemicalCompound[]> {
        return of([...this.compounds]).pipe(delay(0));
    }

    getCompoundById(id: string): Observable<ChemicalCompound | undefined> {
        const compound = this.compounds.find(c => c.id === id);
        return of(compound).pipe(delay(0));
    }

    searchCompounds(query: string): Observable<ChemicalCompound[]> {
        const lowerQuery = query.toLowerCase();
        const results = this.searchOptions.filter(o =>
            o.name.toLowerCase().includes(lowerQuery)
        );
        return of(results.length > 0 ? results : [...this.searchOptions]).pipe(delay(2000));
    }

    addCompound(compound: ChemicalCompound): Observable<void> {
        const newCompound = { ...compound, id: Date.now().toString() };
        this.compounds.unshift(newCompound);
        return of(undefined).pipe(delay(500));
    }

    updateCompound(compound: ChemicalCompound): Observable<void> {
        const index = this.compounds.findIndex(c => c.id === compound.id);
        if (index !== -1) {
            this.compounds[index] = { ...compound };
        }
        return of(undefined).pipe(delay(500));
    }

    deleteCompound(id: string): Observable<void> {
        this.compounds = this.compounds.filter(c => c.id !== id);
        return of(undefined).pipe(delay(500));
    }
}
