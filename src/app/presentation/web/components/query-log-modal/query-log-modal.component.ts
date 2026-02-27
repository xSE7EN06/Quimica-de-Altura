import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { QueryLog } from '../../../../domain/models/query-log.entity';

@Component({
  selector: 'app-query-log-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
  templateUrl: './query-log-modal.component.html',
  styleUrls: ['./query-log-modal.component.scss']
})
export class QueryLogModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode = 'view';
  @Input() hasPrevious = false;
  @Input() hasNext = false;
  @Input() item?: QueryLog;

  @Output() saved = new EventEmitter<QueryLog>();
  @Output() closed = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form!: FormGroup;
  showConfirmModal = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() { this.initForm(); }
  ngOnChanges() { if (this.item && this.form) { this.patchForm(this.item); } }

  private initForm() {
    this.form = this.fb.group({
      id: [''],
      query: [''],
      confidence: [0],
      flagged: [false, Validators.required],
      userId: [''],
      createdAt: ['']
    });
    if (this.item) { this.patchForm(this.item); }
  }

  private patchForm(item: QueryLog) {
    this.form.patchValue({ id: item.id, query: item.query, confidence: item.confidence, flagged: item.flagged, userId: item.userId, createdAt: item.createdAt });
  }

  open(mode: string, item?: QueryLog) {
    this.mode = mode; this.item = item; this.isOpen = true;
    if (this.form && item) { this.patchForm(item); }
  }

  close() { this.isOpen = false; this.closed.emit(); }
  onDidDismiss() { this.isOpen = false; this.closed.emit(); }

  onSave() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      if (this.mode === 'edit') { this.showConfirmModal = true; } else { this.executeSave(); }
    }
  }

  executeSave() {
    const item: QueryLog = { ...this.item!, ...this.form.value };
    this.saved.emit(item);
    this.showConfirmModal = false;
    this.close();
  }

  toggleEdit() { this.mode = 'edit'; }
  get isReadOnly(): boolean { return this.mode === 'view'; }
  getConfidencePct(): string { return ((this.item?.confidence || 0) * 100).toFixed(1) + '%'; }
  getArray(arr?: string[]): string[] { return arr || []; }
}
