import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { ModerationItem } from '../../../../domain/models/moderation-item.entity';

export type ModerationModalMode = 'view' | 'edit' | 'add';

@Component({
  selector: 'app-moderation-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
  templateUrl: './moderation-modal.component.html',
  styleUrls: ['./moderation-modal.component.scss']
})
export class ModerationModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: ModerationModalMode = 'view';
  @Input() hasPrevious = false;
  @Input() hasNext = false;
  @Input() item?: ModerationItem;

  @Output() saved = new EventEmitter<ModerationItem>();
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
      type: ['record', Validators.required],
      content: ['', Validators.required],
      submittedBy: ['', Validators.required],
      submittedAt: [''],
      status: ['pending', Validators.required],
      reviewedBy: [''],
      reviewedAt: [''],
      notes: ['']
    });
    if (this.item) { this.form.patchValue(this.item); }
  }

  open(mode: ModerationModalMode, item?: ModerationItem) {
    this.mode = mode; this.item = item; this.isOpen = true;
    if (this.form) { item ? this.form.patchValue(item) : this.form.reset({ type: 'record', status: 'pending' }); }
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
    const item: ModerationItem = { ...this.item, ...this.form.value };
    this.saved.emit(item);
    this.showConfirmModal = false;
    this.close();
  }

  toggleEdit() { this.mode = 'edit'; }
  get isReadOnly(): boolean { return this.mode === 'view'; }
}
