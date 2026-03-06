import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ImageLog } from '../../../../domain/models/image-log.entity';

export type ImageLogModalMode = 'view' | 'edit' | 'add';

@Component({
  selector: 'app-image-log-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
  templateUrl: './image-log-modal.component.html',
  styleUrls: ['./image-log-modal.component.scss']
})
export class ImageLogModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: ImageLogModalMode = 'view';
  @Input() hasPrevious = false;
  @Input() hasNext = false;
  @Input() item?: ImageLog;

  @Output() saved = new EventEmitter<ImageLog>();
  @Output() closed = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  form!: FormGroup;
  showConfirmModal = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() { this.initForm(); }
  ngOnChanges() { if (this.item && this.form) { this.form.patchValue(this.item); } }

  private initForm() {
    this.form = this.fb.group({
      id: [''],
      imageUrl: [''],
      predictedSpecies: [''],
      confidence: [0],
      modelVersion: [''],
      userFeedback: ['unsure', Validators.required],
      flagged: [false],
      userId: [''],
      createdAt: ['']
    });
    if (this.item) { this.form.patchValue(this.item); }
  }

  open(mode: ImageLogModalMode, item?: ImageLog) {
    this.mode = mode; this.item = item; this.isOpen = true;
    if (this.form) { item ? this.form.patchValue(item) : this.form.reset({ userFeedback: 'unsure', flagged: false }); }
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
    const item: ImageLog = { ...this.item, ...this.form.value };
    this.saved.emit(item);
    this.showConfirmModal = false;
    this.close();
  }

  toggleEdit() { this.mode = 'edit'; }
  get isReadOnly(): boolean { return this.mode === 'view'; }
  getConfidencePct(): string { return ((this.item?.confidence || 0) * 100).toFixed(1) + '%'; }
}
