import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { ArticleModalComponent } from '../../components/article-modal/article-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { Article } from '../../../../domain/models/article.entity';
import { ArticleRepository } from '../../../../domain/repositories/article.repository';
import { ToastController } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-articles',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        ArticleModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './articles.page.html',
    styleUrls: ['./articles.page.scss']
})
export class ArticlesPage implements OnInit {
    articles: Article[] = [];
    private originalArticles: Article[] = [];
    columns: ColumnConfig[] = [];
    activeFilters = {
        year: '',
        country: ''
    };
    tableLoading = true;

    // Modal state
    isModalOpen = false;
    modalMode: 'add' | 'edit' | 'view' = 'view';
    selectedArticle?: Article;
    currentIndex = -1;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.articles.length - 1; }

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
            { key: 'doi', header: 'Referencia', cellTemplate: this.doiTpl }
        ];
    }

    private loadArticles() {
        this.tableLoading = true;
        this.articleRepository.getArticles().subscribe(data => {
            this.originalArticles = data;
            this.applyFilters();
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 2000);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalArticles];

        if (this.activeFilters.year) {
            if (this.activeFilters.year === 'old') {
                filtered = filtered.filter(a => a.year < 2021);
            } else {
                filtered = filtered.filter(a => a.year.toString() === this.activeFilters.year);
            }
        }

        if (this.activeFilters.country) {
            filtered = filtered.filter(a => a.country === this.activeFilters.country);
        }

        this.articles = filtered;
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
        this.currentIndex = this.articles.findIndex(a => a.id === article.id);
        this.isModalOpen = true;
    }

    onEditArticle(article: Article) {
        this.modalMode = 'edit';
        this.selectedArticle = { ...article };
        this.currentIndex = this.articles.findIndex(a => a.id === article.id);
        this.isModalOpen = true;
    }

    onPrevArticle() {
        if (this.hasPrevious) {
            this.currentIndex--;
            this.selectedArticle = { ...this.articles[this.currentIndex] };
        }
    }

    onNextArticle() {
        if (this.hasNext) {
            this.currentIndex++;
            this.selectedArticle = { ...this.articles[this.currentIndex] };
        }
    }

    onDeleteArticle(article: Article) {
        this.articleToDelete = article;
        this.isConfirmModalOpen = true;
    }

    onBulkDelete(items: Article[]) {
        // Simple mock for bulk delete confirmation
        this.articleToDelete = items[0]; // Logic would need updating for true bulk delete
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

    onFilterChange(type: 'year' | 'country', value: any) {
        this.activeFilters[type] = value;
        this.applyFilters();
    }

    onResetFilters() {
        this.activeFilters = { year: '', country: '' };
        this.applyFilters();
    }
}
