import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { RegionalAvailability } from '../../../../domain/models/regional-availability.entity';

export type RegionalAvailabilityModalMode = 'view' | 'edit' | 'add';

@Component({
  selector: 'app-regional-availability-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
  templateUrl: './regional-availability-modal.component.html',
  styleUrls: ['./regional-availability-modal.component.scss']
})
export class RegionalAvailabilityModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: RegionalAvailabilityModalMode = 'view';
  @Input() hasPrevious = false;
  @Input() hasNext = false;
  @Input() item?: RegionalAvailability;

  @Output() saved = new EventEmitter<RegionalAvailability>();
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
      species: ['', Validators.required],
      state: ['', Validators.required],
      region: ['', Validators.required],
      source: ['', Validators.required],
      abundance: ['common', Validators.required],
      lastUpdated: ['', Validators.required],
      notes: ['']
    });
    if (this.item) { this.form.patchValue(this.item); }
  }

  open(mode: RegionalAvailabilityModalMode, item?: RegionalAvailability) {
    this.mode = mode; this.item = item; this.isOpen = true;
    if (this.form) { item ? this.form.patchValue(item) : this.form.reset({ abundance: 'common' }); }
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
    const item: RegionalAvailability = { ...this.item, ...this.form.value };
    this.saved.emit(item);
    this.showConfirmModal = false;
    this.close();
  }

  toggleEdit() { this.mode = 'edit'; }
  get isReadOnly(): boolean { return this.mode === 'view'; }
}
