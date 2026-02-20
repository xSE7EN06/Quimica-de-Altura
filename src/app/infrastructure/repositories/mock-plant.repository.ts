import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Plant } from '../../domain/models/plant.entity';
import { PlantRepository } from '../../domain/repositories/plant.repository';

@Injectable({
    providedIn: 'root'
})
export class MockPlantRepository extends PlantRepository {
    private plants: Plant[] = [
        {
            id: '1',
            commonName: 'Acuyo',
            scientificName: 'Piper auritum',
            description: 'Planta aromática de hojas grandes y aterciopeladas, fundamental en la gastronomía y medicina de las Altas Montañas. Crece en zonas húmedas y sombrías.',
            properties: ['Antiinflamatorio', 'Digestivo', 'Analgésico'],
            imageUrl: 'data:image/jpeg;base64,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',
            region: 'Bosque Mesófilo (Córdoba/Orizaba)',
            category: 'Dolor',
            identifyingFeatures: [
                'Hojas en forma de corazón de hasta 30cm',
                'Olor característico a anís',
                'Espiga blanca delgada (inflorescencia)'
            ],
            compounds: [
                {
                    id: 'c1',
                    name: 'Safrole',
                    iupacName: '5-prop-2-enyl-1,3-benzodioxole',
                    molecularFormula: 'C10H10O2',
                    molecularWeight: '162.19 g/mol',
                    pubchemCid: '10503',
                    smiles: 'C1=CC2=C(C=C1CC=C)OCO2',
                    inchi: 'InChI=1S/C10H10O2/c1-2-3-8-4-5-9-10(6-8)12-7-11-9/h1-2,4-6H,3,7H2',
                    inchiKey: 'SQUYVHKIQLSRE-UHFFFAOYSA-N',
                    description: 'Aceite esencial que otorga el aroma anisado.'
                },
                {
                    id: 'c2',
                    name: 'Linalool',
                    iupacName: '3,7-dimethylocta-1,6-dien-3-ol',
                    molecularFormula: 'C10H18O',
                    molecularWeight: '154.25 g/mol',
                    pubchemCid: '6549',
                    smiles: 'CC(=CCCC(C)(C=C)O)C',
                    inchi: 'InChI=1S/C10H18O/c1-5-10(4,11)8-6-7-9(2)3/h5,7,11H,1,6,8H2,2-4H3',
                    inchiKey: 'CDOSHBVCOALMLC-UHFFFAOYSA-N',
                    description: 'Terpeno con propiedades ansiolíticas.'
                }
            ]
        },
        {
            id: '2',
            commonName: 'Toronjil Morado',
            scientificName: 'Agastache mexicana',
            description: 'Hierba nativa utilizada ancestralmente en la sierra de Zongolica para tratar el "espanto" y los nervios.',
            properties: ['Relajante', 'Digestivo', 'Sedante suave'],
            imageUrl: 'data:image/jpeg;base64,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',
            region: 'Sierras frías (Zongolica/Huatusco)',
            category: 'Relajante',
            identifyingFeatures: [
                'Tallo cuadrado rojizo',
                'Aroma cítrico intenso al estrujar',
                'Flores moradas o rojas en espigas'
            ],
            compounds: [
                {
                    id: 'c3',
                    name: 'Limonene',
                    iupacName: '1-methyl-4-prop-1-en-2-ylcyclohexene',
                    molecularFormula: 'C10H16',
                    molecularWeight: '136.23 g/mol',
                    pubchemCid: '22311',
                    smiles: 'CC1=CCC(CC1)C(=C)C',
                    inchi: 'InChI=1S/C10H16/c1-9(2)10-5-3-8(11)4-6-10/h3,10H,1,4-6H2,2H3',
                    inchiKey: 'XMGQYMWWDOXLRX-UHFFFAOYSA-N',
                    description: 'Responsable del aroma cítrico y efecto relajante.'
                },
                {
                    id: 'c4',
                    name: 'Quercetin',
                    iupacName: '2-(3,4-dihydroxyphenyl)-3,5,7-trihydroxychromen-4-one',
                    molecularFormula: 'C15H10O7',
                    molecularWeight: '302.24 g/mol',
                    pubchemCid: '5280343',
                    smiles: 'C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O',
                    inchi: 'InChI=1S/C15H10O7/c16-7-4-10(19)12-11(5-7)22-15(14(21)13(12)20)6-1-2-8(17)9(18)3-6/h1-5,16-19,21H',
                    inchiKey: 'REFJWTPEDBCVDE-UHFFFAOYSA-N',
                    description: 'Antioxidante natural potente.'
                }
            ]
        },
        {
            id: '3',
            commonName: 'Gordolobo',
            scientificName: 'Pseudognaphalium obtusifolium',
            description: 'Planta vellosa que crece en las laderas volcánicas. Remedio principal para afecciones respiratorias.',
            properties: ['Expectorante', 'Demulcente', 'Antitusivo'],
            imageUrl: 'https://tecolotito.elsiglodetorreon.com.mx/i/2023/10/1736154.jpeg',
            region: 'Faldas del Pico de Orizaba',
            category: 'Respiratorio',
            identifyingFeatures: [
                'Toda la planta está cubierta de pelusa blanca',
                'Hojas alargadas y suaves',
                'Flores pequeñas amarillas'
            ],
            compounds: [
                {
                    id: 'c5',
                    name: 'Luteolin',
                    iupacName: '2-(3,4-dihydroxyphenyl)-5,7-dihydroxychromen-4-one',
                    molecularFormula: 'C15H10O6',
                    molecularWeight: '286.24 g/mol',
                    pubchemCid: '5280445',
                    smiles: 'C1=CC(=C(C=C1C2=CC(=O)C3=C(C=C(C=C3O2)O)O)O)O',
                    inchi: 'InChI=1S/C15H10O6/c16-7-4-10(19)12-11(5-7)21-15(6-13(12)20)8-1-2-9(17)14(18)3-8/h1-5,16-17,19-20H',
                    inchiKey: 'IJOOHUBCXALUOV-UHFFFAOYSA-N',
                    description: 'Flavonoide con propiedades antiinflamatorias y expectorantes.'
                },
                {
                    id: 'c6',
                    name: 'Beta-Sitosterol',
                    iupacName: '17-(5-ethyl-6-methylheptan-2-yl)-10,13-dimethyl-2,3,4,7,8,9,11,12,14,15,16,17-dodecahydro-1H-cyclopenta[a]phenanthren-3-ol',
                    molecularFormula: 'C29H50O',
                    molecularWeight: '414.7 g/mol',
                    pubchemCid: '222284',
                    smiles: 'CCC(CC(C)C)C(C)C1CCC2C1(CCC3C2CC=C4C3(CCC(C4)O)C)C',
                    inchi: 'InChI=1S/C29H50O/c1-7-21(24(2)3)13-12-20(4)25-16-17-26-27-14-15-22-19-23(30)10-11-28(22,5)29(27,6)18-12-25/h12,20-27,30H,7-11,13-19H2,1-6H3',
                    inchiKey: 'KZVAKBWBGRBTMN-UHFFFAOYSA-N',
                    description: 'Fitosterol que ayuda a reducir la inflamación de las vías respiratorias.'
                }
            ]
        },
        {
            id: '4',
            commonName: 'Muicle',
            scientificName: 'Justicia spicigera',
            description: 'Arbusto de flores anaranjadas. Usado tradicionalmente para "aumentar la sangre".',
            properties: ['Antianémico', 'Antipirético', 'Depurativo'],
            imageUrl: 'data:image/jpeg;base64,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',
            region: 'Zona Cafetalera (Córdoba)',
            category: 'Energizante',
            identifyingFeatures: [
                'Flores tubulares color naranja',
                'Extracto se torna azul/morado',
                'Hojas verde oscuro'
            ],
            compounds: [
                {
                    id: 'c7',
                    name: 'Cyanidin-3-glucoside',
                    iupacName: '2-(3,4-dihydroxyphenyl)-3-(beta-D-glucopyranosyloxy)-5,7-dihydroxychromenylium',
                    molecularFormula: 'C21H21O11',
                    molecularWeight: '449.38 g/mol',
                    pubchemCid: '115201',
                    smiles: 'C1=CC(=C(C=C1C2=C(C=C3C(=CC(=CC3=[O+]2)O)O)O[C@H]4[C@@H]([C@H]([C@@H]([C@H](O4)CO)O)O)O)O)O',
                    inchi: 'InChI=1S/C21H20O11/c22-7-16-18(27)19(28)20(29)21(32-16)31-15-6-11-12(25)8-10(23)9-13(11)30-14(15)5-1-2-17(26)7(3)18/h1-6,16,18-20,22,25-29H,7-9H2/t16-,18-,19+,20-,21+/m1/s1',
                    inchiKey: 'SQUYVHKIQLSRE-UHFFFAOYSA-N',
                    description: 'Antocianina responsable del color azul/morado del extracto.'
                },
                {
                    id: 'c8',
                    name: 'Kaempferitrin',
                    iupacName: '3,7-bis(6-deoxy-alpha-L-mannopyranosyloxy)-5-hydroxy-2-(4-hydroxyphenyl)chromen-4-one',
                    molecularFormula: 'C27H30O14',
                    molecularWeight: '578.5 g/mol',
                    pubchemCid: '5282161',
                    smiles: 'CC1C(C(C(C(O1)OC2=CC3=C(C(=O)C(=C(O3)C4=CC=C(C=C4)O)OC5C(C(C(C(O5)C)O)O)O)C(=C2)O)O)O)O',
                    inchi: 'InChI=1S/C27H30O14/c1-10-18(30)20(32)22(34)25(37-10)39-13-6-15-17(16(29)7-13)41-24(12-4-8-14(28)9-5-12)23(27(15)36)40-26-21(33)19(31)11(2)38-26/h4-9,10-11,18-22,25-26,28-34H,1-2H3',
                    inchiKey: 'IJOOHUBCXALUOV-UHFFFAOYSA-N',
                    description: 'Glucósido de flavonol con propiedades medicinales.'
                }
            ]
        },
        {
            id: '5',
            commonName: 'Epazote',
            scientificName: 'Dysphania ambrosioides',
            description: 'Hierba aromática indispensable. Aroma particularmente fuerte debido al suelo volcánico.',
            properties: ['Antihelmíntico', 'Carminativo', 'Antifúngico'],
            imageUrl: 'data:image/jpeg;base64,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',
            region: 'Valles Centrales de Veracruz',
            category: 'Digestivo',
            identifyingFeatures: [
                'Olor penetrante',
                'Hojas dentadas',
                'Semillas pequeñas negras'
            ],
            compounds: [
                {
                    id: 'c9',
                    name: 'Ascaridole',
                    iupacName: '1-isopropyl-4-methyl-2,3-dioxabicyclo[2.2.2]oct-5-ene',
                    molecularFormula: 'C10H16O2',
                    molecularWeight: '168.23 g/mol',
                    pubchemCid: '10452',
                    smiles: 'CC(C)C12CCC(C=C1)(OO2)C',
                    inchi: 'InChI=1S/C10H16O2/c1-8(2)10-6-4-9(3,11-12-10)5-7-10/h4-5,8H,6-7H2,1-3H3',
                    inchiKey: 'XMGQYMWWDOXLRX-UHFFFAOYSA-N',
                    description: 'Compuesto principal contra parásitos intestinales.'
                }
            ]
        },
        {
            id: '6',
            commonName: 'Árnica Mexicana',
            scientificName: 'Heterotheca inuloides',
            description: 'Especie que abunda en bordes de carreteras de montaña. Se usa para golpes.',
            properties: ['Antiinflamatorio', 'Analgésico', 'Cicatrizante'],
            imageUrl: 'https://cloudfront-us-east-1.images.arcpublishing.com/infobae/Q7JLGCLXPRCOTBNJW7I35ZAZLA.jpg',
            region: 'Caminos de Montaña',
            category: 'Dolor',
            identifyingFeatures: [
                'Flores amarillas tipo margarita',
                'Tallo pegajoso',
                'Aroma resinoso'
            ],
            compounds: [
                {
                    id: 'c10',
                    name: 'Helenalin',
                    iupacName: '(3aS,4S,4aR,7aS,8R,9aS)-4-hydroxy-4a,8-dimethyl-3-methylidene-3a,4,5,7a,8,9,9a,9b-octahydroazuleno[4,5-b]furan-2,6-dione',
                    molecularFormula: 'C15H18O4',
                    molecularWeight: '262.3 g/mol',
                    pubchemCid: '441063',
                    smiles: 'CC1C2CC(C3(C2CC=C4C3CC(=C)C(=O)O4)C)C(=O)C1O',
                    inchi: 'InChI=1S/C15H18O4/c1-8-12-11(13(17)9(2)14(12)18)10-5-4-7-15(10,3)6-12/h5,8,10-11,14,18H,1,4,6-7H2,2-3H3/t8-,10-,11+,12-,14+,15+/m1/s1',
                    inchiKey: 'KZVAKBWBGRBTMN-UHFFFAOYSA-N',
                    description: 'Lactona terpénica con potente acción antiinflamatoria.'
                }
            ]
        },
        {
            id: '7',
            commonName: 'Hierba de San Juan',
            scientificName: 'Hypericum perforatum',
            description: 'Planta herbácea con flores amarillas, conocida por sus propiedades antidepresivas.',
            properties: ['Antidepresivo', 'Cicatrizante', 'Ansiolítico'],
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Hypericum_perforatum.jpg/800px-Hypericum_perforatum.jpg',
            region: 'Zonas Templadas',
            category: 'Neurológico',
            identifyingFeatures: [
                'Flores amarillas con puntos negros',
                'Hojas con glándulas translúcidas',
                'Tallo con dos líneas salientes'
            ],
            compounds: [
                {
                    id: 'c11',
                    name: 'Hypericin',
                    iupacName: '1,3,4,6,8,13-hexahydroxy-10,11-dimethylphenanthro[1,10,9,8-opqra]perylene-7,14-dione',
                    molecularFormula: 'C30H16O8',
                    molecularWeight: '504.45 g/mol',
                    pubchemCid: '3663',
                    smiles: 'CC1=C2C(=C3C(=C1O)C(=O)C4=C(C=C(C5=C4C3=C(C=C5)O)O)O)C6=C(C=C(C7=C6C2=C(C=C7)O)O)C(=O)C8=C(C=C(C3=C8O)O)O',
                    inchi: 'InChI=1S/C30H16O8/c1-15-17(31)9-11-13-21(34)25-24-22(35)14-12-10-18(32)16(2)20(12)28(38)26(24)30(40)29-23(36)19(33)8-7-27(37)29/h7-10,31-36H,1-2H3',
                    inchiKey: 'XMGQYMWWDOXLRX-UHFFFAOYSA-N',
                    description: 'Compuesto activo principal con actividad antiviral y antidepresiva.'
                }
            ]
        },
        {
            id: '8',
            commonName: 'Ruda',
            scientificName: 'Ruta graveolens',
            description: 'Arbusto perenne de olor fuerte, utilizado en medicina tradicional y rituales.',
            properties: ['Emenagogo', 'Antiespasmódico', 'Vermífugo'],
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Ruta_graveolens_1.jpg/800px-Ruta_graveolens_1.jpg',
            region: 'Jardines y Huertos Familiares',
            category: 'Ginecológico',
            identifyingFeatures: [
                'Hojas verde azulado',
                'Flores amarillas con 4 pétalos',
                'Olor muy penetrante y desagradable para algunos'
            ],
            compounds: [
                {
                    id: 'c12',
                    name: 'Rutin',
                    iupacName: '2-(3,4-dihydroxyphenyl)-5,7-dihydroxy-3-[(2S,3R,4S,5S,6R)-3,4,5-trihydroxy-6-( hydroxymethyl)oxan-2-yl]oxychromen-4-one',
                    molecularFormula: 'C27H30O16',
                    molecularWeight: '610.52 g/mol',
                    pubchemCid: '5280805',
                    smiles: 'C1=CC(=C(C=C1C2=C(C(=O)C3=C(C=C(C=C3O2)O)O)O)O)O[C@H]4[C@@H]([C@H]([C@@H]([C@H](O4)CO)O)O)O[C@H]5[C@@H]([C@H]([C@@H]([C@H](O5)C)O)O)O',
                    inchi: 'InChI=1S/C27H30O16/c1-8-17(32)20(35)22(37)26(40-8)39-15-18(33)21(36)23(38)27(42-15)43-25-19(34)13-10(29)6-11(30)12(13)24(31)28-25-9-2-5-14(31)16(28)7-9/h2-7,15,17-18,20-23,26-27,29-30,32-38H,1H3',
                    inchiKey: 'XMGQYMWWDOXLRX-UHFFFAOYSA-N',
                    description: 'Flavonoide glucósido con potentes propiedades antioxidantes.'
                }
            ]
        },
        {
            id: '9',
            commonName: 'Bugambilia',
            scientificName: 'Bougainvillea glabra',
            description: 'Planta trepadora con brácteas coloridas, muy usada para la tos.',
            properties: ['Antitusivo', 'Expectorante', 'Febrífugo'],
            imageUrl: 'https://th.bing.com/th/id/OIP.IXxYpQ0mzVJtv6IukaYOXAHaE8?w=279&h=186&c=7&r=0&o=7&pid=1.7&rm=3',
            region: 'Zonas Tropicales y Subtropicales',
            category: 'Respiratorio',
            identifyingFeatures: [
                'Brácteas (hojas modificadas) de colores intensos (rosa, morado, rojo)',
                'Flores verdaderas pequeñas y blancas',
                'Tallos con espinas'
            ],
            compounds: [
                {
                    id: 'c13',
                    name: 'Pinitol',
                    iupacName: '(1S,2S,4S,5R)-6-methoxycyclohexane-1,2,3,4,5-pentol',
                    molecularFormula: 'C7H14O6',
                    molecularWeight: '194.18 g/mol',
                    pubchemCid: '13019092',
                    smiles: 'CO[C@@H]1[C@H]([C@H]([C@@H]([C@H]([C@H]1O)O)O)O)O',
                    inchi: 'InChI=1S/C7H14O6/c1-13-7-4(10)2(8)3(9)5(11)6(7)12/h2-12H,1H3/t2-,3-,4+,5-,6+,7-',
                    inchiKey: 'XMGQYMWWDOXLRX-UHFFFAOYSA-N',
                    description: 'Compuesto tipo inositol con efectos similares a la insulina.'
                }
            ]
        },
        {
            id: '10',
            commonName: 'Cempasúchil',
            scientificName: 'Tagetes erecta',
            description: 'La flor de muertos, utilizada también para problemas digestivos y cólicos.',
            properties: ['Carminativo', 'Digestivo', 'Antibacteriano'],
            imageUrl: 'https://th.bing.com/th/id/OIP.QSxfLUvqp63w0Tid09mypgHaEK?w=277&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
            region: 'Valles Centrales y Altiplano',
            category: 'Digestivo',
            identifyingFeatures: [
                'Flores naranjas o amarillas muy pomposas',
                'Olor muy característico',
                'Hojas plumosas'
            ],
            compounds: [
                {
                    id: 'c10',
                    name: 'Lutein',
                    iupacName: 'beta,epsilon-carotene-3,3\'-diol',
                    molecularFormula: 'C40H56O2',
                    molecularWeight: '568.87 g/mol',
                    pubchemCid: '5281243',
                    smiles: 'CC1=C(C(CC(C1)O)C)C=CC(=CC=CC(=CC=CC=C(C)C=CC=C(C)C=CC2C(=CC(CC2)O)C)C)C',
                    inchi: 'InChI=1S/C40H56O2/c1-31(19-13-21-33(3)25-27-37-35(5)23-15-29-39(37,7)8)17-11-12-18-32(2)20-14-22-34(4)26-28-38-36(6)24-16-30-40(38,9)10/h11-14,17-22,25-28,37-38,41-42H,15-16,23-24,29-30H2,1-10H3/b12-11+,17-12+,18-11+,21-13+,22-14+,27-25+,28-26+,31-19+,32-20+,33-21+,34-22+/t37-,38+,41+,42-/m0/s1',
                    inchiKey: 'KBPHJBAIARWVSC-GGERISQZSA-N',
                    description: 'Carotenoide responsable del color naranja.'
                }
            ]
        },
        {
            id: '11',
            commonName: 'Valeriana',
            scientificName: 'Valeriana officinalis',
            description: 'Raíz utilizada como sedante suave y para combatir el insomnio.',
            properties: ['Sedante', 'Ansiolítico', 'Relajante Muscular'],
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Valeriana_officinalis_-_Köhler–s_Medizinal-Pflanzen-143.jpg/800px-Valeriana_officinalis_-_Köhler–s_Medizinal-Pflanzen-143.jpg',
            region: 'Bosques Húmedos',
            category: 'Nervioso',
            identifyingFeatures: [
                'Flores pequeñas de color rosa pálido o blanco',
                'Raíces con olor fuerte y desagradable al secarse',
                'Hojas compuestas pinnadas'
            ],
            compounds: [
                {
                    id: 'c14',
                    name: 'Valerenic Acid',
                    iupacName: '(2E)-3-[(4R,7R)-3,7-dimethyl-2,4,5,6,7,7a-hexahydro-1H-inden-4-yl]-2-methylprop-2-enoic acid',
                    molecularFormula: 'C15H22O2',
                    molecularWeight: '234.33 g/mol',
                    pubchemCid: '6441221',
                    smiles: 'CC1CCC2C(C1)CC=C2C=C(C)C(=O)O',
                    inchi: 'InChI=1S/C15H22O2/c1-9(15(16)17)8-12-13-6-4-10(2)5-7-14(13)11(3)12/h8,10,12-14H,4-7H2,1-3H3,(H,16,17)/b9-8+/t10-,12+,13+,14+/m1/s1',
                    inchiKey: 'AELCINSCMGFUCI-UHFFFAOYSA-N',
                    description: 'Sesquiterpeno responsable de la actividad sedante.'
                }
            ]
        },
        {
            id: '12',
            commonName: 'Manzanilla',
            scientificName: 'Matricaria chamomilla',
            description: 'Una de las plantas medicinales más antiguas y utilizadas para calmar el estómago.',
            properties: ['Digestivo', 'Antiinflamatorio', 'Calmante'],
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Kamille_Matricaria_chamomilla.jpg/800px-Kamille_Matricaria_chamomilla.jpg',
            region: 'Climas Templados',
            category: 'Digestivo',
            identifyingFeatures: [
                'Flores blancas con centro amarillo cónico',
                'Aroma dulce a manzana',
                'Hojas muy finamente divididas'
            ],
            compounds: [
                {
                    id: 'c15',
                    name: 'Apigenin',
                    iupacName: '5,7-dihydroxy-2-(4-hydroxyphenyl)chromen-4-one',
                    molecularFormula: 'C15H10O5',
                    molecularWeight: '270.24 g/mol',
                    pubchemCid: '5280443',
                    smiles: 'C1=CC(=CC=C1C2=CC(=O)C3=C(C=C(C=C3O2)O)O)O',
                    inchi: 'InChI=1S/C15H10O5/c16-9-3-1-8(2-4-9)15-7-12(18)14-11(17)5-10(17)6-13(14)20-15/h1-7,16-18H',
                    inchiKey: 'KKEYFWRCBNTPAC-UHFFFAOYSA-N',
                    description: 'Flavona con propiedades ansiolíticas y antiinflamatorias.'
                }
            ]
        },
        {
            id: '13',
            commonName: 'Estafiate',
            scientificName: 'Artemisia ludoviciana',
            description: 'Hierba amarga usada para dolores de estómago y parásitos.',
            properties: ['Antiparasitario', 'Digestivo', 'Colerético'],
            imageUrl: 'https://th.bing.com/th/id/OIP.z5yVlE9gWGHZ7-Ur30Yh-QHaEK?w=299&h=180&c=7&r=0&o=7&pid=1.7&rm=3',
            region: 'Zonas Semiáridas',
            category: 'Digestivo',
            identifyingFeatures: [
                'Hojas color verde grisáceo/blanquecino',
                'Sabor muy amargo',
                'Olor fuerte y aromático'
            ],
            compounds: [
                {
                    id: 'c16',
                    name: 'Thujone',
                    iupacName: '1-isopropyl-4-methylbicyclo[3.1.0]hexan-3-one',
                    molecularFormula: 'C10H16O',
                    molecularWeight: '152.23 g/mol',
                    pubchemCid: '261491',
                    smiles: 'CC(C)C1C2CC(C2)C(=O)C1C',
                    inchi: 'InChI=1S/C10H16O/c1-6(2)10-4-8-5-9(8)7(3)11-10/h6,8-9H,4-5H2,1-3H3',
                    inchiKey: 'JGSARLDLIJGVTE-UHFFFAOYSA-N',
                    description: 'Cetona monoterpénica con olor mentolado.'
                }
            ]
        },
        {
            id: '14',
            commonName: 'Salvia',
            scientificName: 'Salvia officinalis',
            description: 'Planta sagrada usada para limpiar energías y tratar infecciones.',
            properties: ['Antiséptico', 'Astringente', 'Antisudorífico'],
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Salvia_officinalis_002.JPG/800px-Salvia_officinalis_002.JPG',
            region: 'Regiones Mediterráneas / Adaptada en México',
            category: 'Infeccioso',
            identifyingFeatures: [
                'Hojas rugosas de color verde grisáceo',
                'Flores violetas o azules',
                'Textura aterciopelada'
            ],
            compounds: [
                {
                    id: 'c3',
                    name: 'Rosmarinic acid',
                    iupacName: '(2R)-3-(3,4-dihydroxyphenyl)-2-[(E)-3-(3,4-dihydroxyphenyl)prop-2-enoyl]oxypropanoic acid',
                    molecularFormula: 'C18H16O8',
                    molecularWeight: '360.31 g/mol',
                    pubchemCid: '5281792',
                    smiles: 'C1=CC(=C(C=C1C=CC(=O)OC(CC2=CC(=C(C=C2)O)O)C(=O)O)O)O',
                    inchi: 'InChI=1S/C18H16O8/c19-12-4-1-10(7-14(12)21)3-6-17(24)26-16(18(25)26)9-11-2-5-13(20)15(22)8-11/h1-8,16,19-22H,9H2,(H,25,26)',
                    inchiKey: 'DOUMSIUAVSJWRE-UHFFFAOYSA-N',
                    description: 'Polifenol antioxidante.'
                }
            ]
        },
        {
            id: '15',
            commonName: 'Menta',
            scientificName: 'Mentha piperita',
            description: 'Hierba muy refrescante usada para problemas respiratorios y digestivos.',
            properties: ['Carminativo', 'Descongestionante', 'Refrescante'],
            imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Mentha_piperita_-_Köhler–s_Medizinal-Pflanzen-095.jpg/800px-Mentha_piperita_-_Köhler–s_Medizinal-Pflanzen-095.jpg',
            region: 'Zonas Húmedas',
            category: 'Digestivo',
            identifyingFeatures: [
                'Tallo cuadrado rojizo',
                'Olor a mentol muy intenso',
                'Hojas dentadas verde oscuro'
            ],
            compounds: [
                {
                    id: 'c1',
                    name: 'Menthol',
                    iupacName: '(1R,2S,5R)-2-isopropyl-5-methylcyclohexanol',
                    molecularFormula: 'C10H20O',
                    molecularWeight: '156.27 g/mol',
                    pubchemCid: '1254',
                    smiles: 'CC(C)C1CCC(CC1O)C',
                    inchi: 'InChI=1S/C10H20O/c1-7(2)9-5-4-8(3)6-10(9)11/h7-11H,4-6H2,1-3H3',
                    inchiKey: 'CQEVNEHBBNORPU-UHFFFAOYSA-N',
                    description: 'Alcohol terpénico responsable del frescor.'
                }
            ]
        }
    ];

    getPlants(): Observable<Plant[]> {
        return of(this.plants);
    }

    getPlantById(id: string): Observable<Plant | undefined> {
        const plant = this.plants.find(p => p.id === id);
        return of(plant);
    }

    getPlantsByCategory(category: string): Observable<Plant[]> {
        const filteredPlants = this.plants.filter(p => p.category === category);
        return of(filteredPlants);
    }

    searchPlants(query: string): Observable<Plant[]> {
        const lowerQuery = query.toLowerCase();
        const results = this.plants.filter(p =>
            p.commonName.toLowerCase().includes(lowerQuery) ||
            p.scientificName.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.properties.some(prop => prop.toLowerCase().includes(lowerQuery)) ||
            p.category?.toLowerCase().includes(lowerQuery)
        );
        return of(results);
    }

    identifyPlant(imageData: string): Observable<Plant | undefined> {
        return of(this.plants[0]);
    }

    addPlant(plant: Plant): Observable<void> {
        const newPlant = {
            ...plant,
            id: Date.now().toString()
        };
        this.plants.unshift(newPlant);
        return of(undefined).pipe(delay(500));
    }

    updatePlant(plant: Plant): Observable<void> {
        const index = this.plants.findIndex(p => p.id === plant.id);
        if (index !== -1) {
            this.plants[index] = plant;
        }
        return of(undefined).pipe(delay(500));
    }

    deletePlant(id: string): Observable<void> {
        this.plants = this.plants.filter(p => p.id !== id);
        return of(undefined).pipe(delay(500));
    }
}
