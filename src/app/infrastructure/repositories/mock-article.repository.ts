import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Article } from '../../domain/models/article.entity';
import { ArticleRepository } from '../../domain/repositories/article.repository';

@Injectable({
    providedIn: 'root'
})
export class MockArticleRepository extends ArticleRepository {
    private articles: Article[] = [
        {
            id: '1',
            title: 'Análisis fitoquímico de la Aloe Vera en zonas áridas de México',
            year: 2023,
            authors: ['García, M.', 'Rodríguez, J.'],
            keywords: ['Aloe Vera', 'Fitoquímica', 'Zonas Áridas', 'México'],
            doi: 'https://doi.org/10.1016/j.bot.2023.01.005',
            country: 'México',
            abstract: 'Este estudio presenta una caracterización detallada de los compuestos secundarios presentes en el parénquima de Aloe Vera cultivada bajo condiciones de estrés hídrico...'
        },
        {
            id: '2',
            title: 'Propiedades antioxidantes de la Mentha piperita: Un enfoque molecular',
            year: 2022,
            authors: ['Smith, A.', 'Lee, K.', 'Wang, H.'],
            keywords: ['Antioxidantes', 'Mentha piperita', 'Flavonoides', 'Estrés Oxidativo'],
            doi: 'https://doi.org/10.1111/j.phyt.2022.08.012',
            country: 'Estados Unidos',
            abstract: 'La Mentha piperita es ampliamente reconocida por sus beneficios terapéuticos. En este artículo exploramos el mecanismo de acción de sus flavonoides en la neutralización de radicales libres...'
        },
        {
            id: '3',
            title: 'Estudio etnobotánico de plantas medicinales en la Sierra Andina',
            year: 2021,
            authors: ['Quispe, L.', 'Mamani, P.'],
            keywords: ['Etnobotánica', 'Sierra Andina', 'Saberes Ancestrales', 'Medicina Tradicional'],
            doi: 'https://doi.org/10.22201/ib.20078706e.2021.92.3421',
            country: 'Perú',
            abstract: 'Se documentaron más de 50 especies de plantas utilizadas por comunidades locales para el tratamiento de afecciones respiratorias y digestivas, validando su uso tradicional mediante pruebas preliminares...'
        },
        {
            id: '4',
            title: 'Identificación de alcaloides en extractos de muicle (Justicia spicigera)',
            year: 2024,
            authors: ['Hernández, R.', 'Torres, E.'],
            keywords: ['Alcaloides', 'Justicia spicigera', 'Muicle', 'Cromatografía'],
            doi: 'https://doi.org/10.1002/pca.3456',
            country: 'México',
            abstract: 'A través de técnicas de cromatografía de gases acoplada a masas, se identificaron nuevos alcaloides en las hojas de muicle con potencial actividad antimicrobiana.'
        },
        {
            id: '5',
            title: 'Efecto del cambio climático en la producción de terpenos en bosques de coníferas',
            year: 2023,
            authors: ['Müller, K.', 'Schmidt, F.'],
            keywords: ['Cambio Climático', 'Terpenos', 'Coníferas', 'Estrés Ambiental'],
            doi: 'https://doi.org/10.1038/s41558-023-01654-z',
            country: 'Alemania',
            abstract: 'Investigación sobre cómo el aumento de temperaturas afecta la biosíntesis de terpenos en pinos, impactando en la defensa natural contra plagas.'
        },
        {
            id: '6',
            title: 'Valorización de residuos agroindustriales de piña para la extracción de bromelina',
            year: 2022,
            authors: ['López, S.', 'Martínez, A.', 'Ruiz, C.'],
            keywords: ['Piña', 'Bromelina', 'Residuos Agroindustriales', 'Economía Circular'],
            doi: 'https://doi.org/10.1016/j.biortech.2022.126789',
            country: 'Costa Rica',
            abstract: 'Propuesta de un método sustentable para obtener bromelina de alta pureza a partir de cáscaras y tallos de piña.'
        },
        {
            id: '7',
            title: 'Actividad antimicrobiana de extractos de orégano mexicano contra bacterias resistentes',
            year: 2023,
            authors: ['Pérez, L.', 'Gómez, D.'],
            keywords: ['Orégano', 'Lippia graveolens', 'Resistencia Antibiótica', 'Aceites Esenciales'],
            doi: 'https://doi.org/10.3390/antibiotics12040678',
            country: 'México',
            abstract: 'Evaluación in vitro de la eficacia del aceite esencial de orégano contra cepas de Staphylococcus aureus meticilino-resistente.'
        },
        {
            id: '8',
            title: 'Conservación ex situ de orquídeas endémicas de Veracruz',
            year: 2021,
            authors: ['Vázquez, M.', 'Ortiz, R.'],
            keywords: ['Orquídeas', 'Conservación', 'Veracruz', 'Banco de Germoplasma'],
            doi: 'https://doi.org/10.17129/botsci.2890',
            country: 'México',
            abstract: 'Estrategias para la preservación de especies de orquídeas en peligro de extinción mediante cultivo de tejidos.'
        },
        {
            id: '9',
            title: 'Potencial nutracéutico del maíz morado andino',
            year: 2020,
            authors: ['Chávez, J.', 'Flores, I.'],
            keywords: ['Maíz Morado', 'Antocianinas', 'Nutracéuticos', 'Salud Cardiovascular'],
            doi: 'https://doi.org/10.1021/acs.jafc.0c01234',
            country: 'Perú',
            abstract: 'Revisión sistemática de los beneficios de las antocianinas del maíz morado en la reducción de la presión arterial y el colesterol.'
        },
        {
            id: '10',
            title: 'Bioensayos de toxicidad de plantas medicinales usadas en la selva amazónica',
            year: 2022,
            authors: ['Silva, B.', 'Santos, P.', 'Oliveira, M.'],
            keywords: ['Toxicidad', 'Plantas Medicinales', 'Amazonas', 'Artemia salina'],
            doi: 'https://doi.org/10.1590/s0102-695x2022005000023',
            country: 'Brasil',
            abstract: 'Evaluación de la seguridad de uso de 20 especies vegetales amazónicas mediante el ensayo de letalidad con Artemia salina.'
        },
        {
            id: '11',
            title: 'Síntesis verde de nanopartículas de plata usando extracto de nopal',
            year: 2024,
            authors: ['Ramírez, O.', 'Sánchez, K.'],
            keywords: ['Nanotecnología', 'Síntesis Verde', 'Nopal', 'Opuntia ficus-indica'],
            doi: 'https://doi.org/10.1016/j.jclepro.2023.139876',
            country: 'México',
            abstract: 'Desarrollo de un método ecológico para sintetizar nanopartículas metálicas utilizando mucílago de nopal como agente reductor.'
        },
        {
            id: '12',
            title: 'Impacto de la luz UV en la producción de alcaloides en Catharanthus roseus',
            year: 2021,
            authors: ['Chen, Y.', 'Li, W.'],
            keywords: ['Catharanthus roseus', 'Vincristina', 'Luz UV', 'Metabolismo Secundario'],
            doi: 'https://doi.org/10.1093/pcp/pcab045',
            country: 'China',
            abstract: 'Estudio sobre cómo la radiación ultravioleta estimula la producción de alcaloides anticancerígenos en la vinca de Madagascar.'
        },
        {
            id: '13',
            title: 'Uso tradicional del toloache en rituales del norte de México',
            year: 2019,
            authors: ['Moreno, F.', 'Salazar, T.'],
            keywords: ['Datura', 'Toloache', 'Etnobotánica', 'Rituales'],
            doi: 'https://doi.org/10.29043/ucr.v0i0.789',
            country: 'México',
            abstract: 'Documentación antropológica y botánica sobre el uso ceremonial y medicinal de datura en comunidades indígenas del norte.'
        },
        {
            id: '14',
            title: 'Quimiotaxonomía del género Agave en Mesoamérica',
            year: 2023,
            authors: ['Jiménez, A.', 'Castillo, D.'],
            keywords: ['Agave', 'Quimiotaxonomía', 'Saponinas', 'Mesoamérica'],
            doi: 'https://doi.org/10.1007/s12229-023-09287-x',
            country: 'México',
            abstract: 'Clasificación de especies de Agave basada en sus perfiles de saponinas esteroidales, proponiendo nuevas relaciones filogenéticas.'
        }
    ];

    getArticles(): Observable<Article[]> {
        return of([...this.articles]).pipe(delay(100));
    }

    getArticleById(id: string): Observable<Article | undefined> {
        const article = this.articles.find(a => a.id === id);
        return of(article).pipe(delay(300));
    }

    addArticle(article: Article): Observable<void> {
        const newArticle = {
            ...article,
            id: Date.now().toString()
        };
        this.articles.unshift(newArticle);
        return of(undefined).pipe(delay(500));
    }

    updateArticle(article: Article): Observable<void> {
        const index = this.articles.findIndex(a => a.id === article.id);
        if (index !== -1) {
            this.articles[index] = { ...article };
        }
        return of(undefined).pipe(delay(500));
    }

    deleteArticle(id: string): Observable<void> {
        this.articles = this.articles.filter(a => a.id !== id);
        return of(undefined).pipe(delay(500));
    }

    searchArticles(query: string): Observable<Article[]> {
        const lowerQuery = query.toLowerCase();
        const results = this.articles.filter(a =>
            a.title.toLowerCase().includes(lowerQuery) ||
            a.country.toLowerCase().includes(lowerQuery) ||
            a.keywords.some(k => k.toLowerCase().includes(lowerQuery)) ||
            a.authors.some(auth => auth.toLowerCase().includes(lowerQuery))
        );
        return of(results).pipe(delay(400));
    }
}
