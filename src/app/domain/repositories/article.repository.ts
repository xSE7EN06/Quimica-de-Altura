import { Observable } from 'rxjs';
import { Article } from '../models/article.entity';

export abstract class ArticleRepository {
    abstract getArticles(): Observable<Article[]>;
    abstract getArticleById(id: string): Observable<Article | undefined>;
    abstract addArticle(article: Article): Observable<void>;
    abstract updateArticle(article: Article): Observable<void>;
    abstract deleteArticle(id: string): Observable<void>;
    abstract searchArticles(query: string): Observable<Article[]>;
}
