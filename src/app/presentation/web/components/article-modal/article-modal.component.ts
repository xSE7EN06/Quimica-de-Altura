import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { Article } from '../../../../domain/models/article.entity';

@Component({
    selector: 'app-article-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatIconModule,
        IonModal
    ],
    templateUrl: './article-modal.component.html',
    styleUrls: ['./article-modal.component.scss']
})
export class ArticleModalComponent {
    @Input() isOpen = false;
    @Input() mode: 'add' | 'edit' | 'view' = 'view';
    @Input() article: Article = this.createEmptyArticle();

    @Output() saved = new EventEmitter<Article>();
    @Output() closed = new EventEmitter<void>();

    // Temporary storage for authors and keywords strings
    authorsList = '';
    keywordsList = '';

    ngOnChanges() {
        if (this.article) {
            this.authorsList = this.article.authors?.join(', ') || '';
            this.keywordsList = this.article.keywords?.join(', ') || '';
        }
    }

    private createEmptyArticle(): Article {
        return {
            id: '',
            title: '',
            year: new Date().getFullYear(),
            authors: [],
            keywords: [],
            doi: '',
            country: '',
            abstract: ''
        };
    }

    close() {
        this.isOpen = false;
        this.closed.emit();
    }

    onSave() {
        if (this.article.title && this.article.doi) {
            // Process authors and keywords
            this.article.authors = this.authorsList.split(',').map(a => a.trim()).filter(a => a !== '');
            this.article.keywords = this.keywordsList.split(',').map(k => k.trim()).filter(k => k !== '');

            this.saved.emit(this.article);
            this.close();
        }
    }

    setMode(newMode: 'add' | 'edit' | 'view') {
        this.mode = newMode;
    }

    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    onFileDropped(event: DragEvent) {
        event.preventDefault();
        const file = event.dataTransfer?.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    }

    private handleFile(file: File) {
        // Simulating file data extraction
        console.log('Archivo recibido:', file.name);
        // You could use a library to parse PDF/Text here
        // For now, we just notify the user
        alert(`Archivo "${file.name}" cargado. En una integración real, aquí extraeríamos la metadata.`);
    }
}
