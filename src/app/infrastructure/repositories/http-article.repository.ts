import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArticleRepository } from '../../domain/repositories/article.repository';
import { Article } from '../../domain/models/article.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpArticleRepository extends ArticleRepository {
  private readonly base = `${environment.gatewayUrl}/api/plants/articles`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): Article {
    return {
      id: r.id,
      title: r.title ?? '',
      year: r.year ?? 0,
      authors: r.authors ?? [],
      keywords: r.keywords ?? [],
      doi: r.doi ?? '',
      country: r.country ?? '',
      abstract: r.abstract ?? '',
    };
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getArticleById(id: string): Observable<Article | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  addArticle(article: Article): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      title: article.title,
      year: article.year,
      authors: article.authors,
      keywords: article.keywords,
      doi: article.doi,
      country: article.country,
      abstract: article.abstract,
    });
  }

  updateArticle(article: Article): Observable<void> {
    return this.http.put<void>(`${this.base}/${article.id}`, {
      title: article.title,
      year: article.year,
      authors: article.authors,
      keywords: article.keywords,
      doi: article.doi,
      country: article.country,
      abstract: article.abstract,
    });
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchArticles(query: string): Observable<Article[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?search=${encodeURIComponent(query)}&size=100`).pipe(
      map(res => res.items.map(r => this.map(r)))
    );
  }
}
