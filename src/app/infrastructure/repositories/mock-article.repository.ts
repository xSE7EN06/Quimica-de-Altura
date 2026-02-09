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
