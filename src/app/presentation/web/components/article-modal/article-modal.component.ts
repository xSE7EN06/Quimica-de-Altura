import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { Article } from '../../../../domain/models/article.entity';

@Component({
    selector: 'app-article-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './article-modal.component.html',
    styleUrls: ['./article-modal.component.scss']
})
export class ArticleModalComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() mode: 'add' | 'edit' | 'view' = 'view';
    @Input() article: Article = this.createEmptyArticle();
    @Input() hasPrevious = false;
    @Input() hasNext = false;

    @Output() saved = new EventEmitter<Article>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    articleForm: FormGroup;
    showConfirmModal = false;
    readonly currentYear = new Date().getFullYear();

    constructor(private fb: FormBuilder) {
        this.articleForm = this.initForm();
    }

    ngOnChanges() {
        if (this.article) {
            this.initFormWithArticle(this.article);
        }
    }

    private initForm(): FormGroup {
        return this.fb.group({
            title: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(300)]],
            year: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(this.currentYear)]],
            country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
            doi: ['', [Validators.required, Validators.pattern(/^(https?:\/\/.+|10\.\d{4,}.+)$/)]],
            authors: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]],
            keywords: ['', [Validators.maxLength(500)]],
            abstract: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(3000)]]
        });
    }

    private initFormWithArticle(article: Article) {
        if (!this.articleForm) {
            this.articleForm = this.initForm();
        }
        this.articleForm.patchValue({
            title: article.title || '',
            year: article.year || new Date().getFullYear(),
            country: article.country || '',
            doi: article.doi || '',
            authors: Array.isArray(article.authors) ? article.authors.join(', ') : '',
            keywords: Array.isArray(article.keywords) ? article.keywords.join(', ') : '',
            abstract: article.abstract || ''
        });
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
        this.articleForm.markAllAsTouched();
        if (this.articleForm.valid) {
            if (this.mode === 'edit') {
                this.showConfirmModal = true;
            } else {
                this.executeSave();
            }
        }
    }

    executeSave() {
        const v = this.articleForm.value;
        const saved: Article = {
            ...this.article,
            title: v.title,
            year: v.year,
            country: v.country,
            doi: v.doi,
            authors: (v.authors as string).split(',').map((a: string) => a.trim()).filter((a: string) => a !== ''),
            keywords: (v.keywords as string).split(',').map((k: string) => k.trim()).filter((k: string) => k !== ''),
            abstract: v.abstract
        };
        this.saved.emit(saved);
        this.showConfirmModal = false;
        this.close();
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
        console.log('Archivo recibido:', file.name);
        alert(`Archivo "${file.name}" cargado. En una integración real, aquí extraeríamos la metadata.`);
    }
}
