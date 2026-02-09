import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ArticleModalComponent } from '../../components/article-modal/article-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { Article } from '../../../../domain/models/article.entity';
import { ArticleRepository } from '../../../../domain/repositories/article.repository';
import { ToastController } from '@ionic/angular/standalone';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        DataTableComponent,
        ArticleModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './articles.page.html',
    styleUrls: ['./articles.page.scss']
})
export class ArticlesPage implements OnInit {
    articles: Article[] = [];
    columns: ColumnConfig[] = [];

    // Modal state
    isModalOpen = false;
    modalMode: 'add' | 'edit' | 'view' = 'view';
    selectedArticle?: Article;

    // Confirmation modal state
    isConfirmModalOpen = false;
    articleToDelete?: Article;

    @ViewChild('titleTpl', { static: true }) titleTpl!: TemplateRef<any>;
    @ViewChild('authorsTpl', { static: true }) authorsTpl!: TemplateRef<any>;
    @ViewChild('doiTpl', { static: true }) doiTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    constructor(
        private articleRepository: ArticleRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadArticles();
        this.columns = [
            { key: 'title', header: 'Investigación', cellTemplate: this.titleTpl },
            { key: 'year', header: 'Año' },
            { key: 'authors', header: 'Autores', cellTemplate: this.authorsTpl },
            { key: 'country', header: 'País' },
            { key: 'doi', header: 'Referencia', cellTemplate: this.doiTpl },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    private loadArticles() {
        this.articleRepository.getArticles().subscribe(data => {
            this.articles = data;
            this.cdr.detectChanges();
        });
    }

    onAddArticle() {
        this.modalMode = 'add';
        this.selectedArticle = {
            id: '',
            title: '',
            year: new Date().getFullYear(),
            authors: [],
            keywords: [],
            doi: '',
            country: '',
            abstract: ''
        };
        this.isModalOpen = true;
    }

    onViewArticle(article: Article) {
        this.modalMode = 'view';
        this.selectedArticle = { ...article };
        this.isModalOpen = true;
    }

    onEditArticle(article: Article) {
        this.modalMode = 'edit';
        this.selectedArticle = { ...article };
        this.isModalOpen = true;
    }

    onDeleteArticle(article: Article) {
        this.articleToDelete = article;
        this.isConfirmModalOpen = true;
    }

    onConfirmDelete() {
        if (this.articleToDelete) {
            this.articleRepository.deleteArticle(this.articleToDelete.id).subscribe(() => {
                this.loadArticles();
                this.showToast('Artículo eliminado del repositorio.');
                this.isConfirmModalOpen = false;
            });
        }
    }

    onSaveArticle(article: Article) {
        if (this.modalMode === 'add') {
            this.articleRepository.addArticle(article).subscribe(() => {
                this.loadArticles();
                this.showToast('Nuevo artículo agregado exitosamente.');
            });
        } else {
            this.articleRepository.updateArticle(article).subscribe(() => {
                this.loadArticles();
                this.showToast('Información del artículo actualizada.');
            });
        }
    }

    private async showToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom',
            color: 'dark'
        });
        await toast.present();
    }

    onSearch(query: string) {
        if (!query) {
            this.loadArticles();
            return;
        }
        this.articleRepository.searchArticles(query).subscribe(data => {
            this.articles = data;
            this.cdr.detectChanges();
        });
    }
}
