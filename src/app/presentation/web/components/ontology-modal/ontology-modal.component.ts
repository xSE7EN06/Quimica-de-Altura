import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { OntologyTerm } from '../../../../domain/models/ontology-term.entity';

export type OntologyModalMode = 'view' | 'edit' | 'add';

@Component({
  selector: 'app-ontology-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
  templateUrl: './ontology-modal.component.html',
  styleUrls: ['./ontology-modal.component.scss']
})
export class OntologyModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: OntologyModalMode = 'view';
  @Input() hasPrevious = false;
  @Input() hasNext = false;
  @Input() item?: OntologyTerm;

  @Output() saved = new EventEmitter<OntologyTerm>();
  @Output() closed = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form!: FormGroup;
  showConfirmModal = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() { this.initForm(); }

  ngOnChanges() {
    if (this.item && this.form) {
      this.form.patchValue({
        ...this.item,
        synonyms: Array.isArray(this.item.synonyms) ? this.item.synonyms.join(', ') : this.item.synonyms
      });
    }
  }

  private initForm() {
    this.form = this.fb.group({
      id: [''],
      canonicalTerm: ['', [Validators.required, Validators.minLength(2)]],
      icd10Code: ['', Validators.required],
      meshId: ['', Validators.required],
      synonyms: [''],
      category: ['', Validators.required],
      description: ['']
    });
    if (this.item) {
      this.form.patchValue({
        ...this.item,
        synonyms: Array.isArray(this.item.synonyms) ? this.item.synonyms.join(', ') : this.item.synonyms
      });
    }
  }

  open(mode: OntologyModalMode, item?: OntologyTerm) {
    this.mode = mode;
    this.item = item;
    this.isOpen = true;
    if (this.form) {
      if (item) {
        this.form.patchValue({
          ...item,
          synonyms: Array.isArray(item.synonyms) ? item.synonyms.join(', ') : item.synonyms
        });
      } else {
        this.form.reset();
      }
    }
  }

  close() { this.isOpen = false; this.closed.emit(); }
  onDidDismiss() { this.isOpen = false; this.closed.emit(); }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.mode === 'edit') { this.showConfirmModal = true; }
      else { this.executeSave(); }
    }
  }

  executeSave() {
    const val = this.form.value;
    const item: OntologyTerm = {
      ...this.item,
      ...val,
      synonyms: typeof val.synonyms === 'string'
        ? val.synonyms.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : val.synonyms
    };
    this.saved.emit(item);
    this.showConfirmModal = false;
    this.close();
  }

  toggleEdit() { this.mode = 'edit'; }
  get isReadOnly(): boolean { return this.mode === 'view'; }
}
