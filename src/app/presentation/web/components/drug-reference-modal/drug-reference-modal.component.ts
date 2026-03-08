import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { DrugReference } from '../../../../domain/models/drug-reference.entity';

export type DrugReferenceModalMode = 'view' | 'edit' | 'add';

@Component({
  selector: 'app-drug-reference-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, IonModal, ConfirmationModalComponent],
  templateUrl: './drug-reference-modal.component.html',
  styleUrls: ['./drug-reference-modal.component.scss']
})
export class DrugReferenceModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: DrugReferenceModalMode = 'view';
  @Input() hasPrevious = false;
  @Input() hasNext = false;
  @Input() item?: DrugReference;

  @Output() saved = new EventEmitter<DrugReference>();
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
      drugName: ['', Validators.required],
      activeIngredient: ['', Validators.required],
      linkedCompound: ['', Validators.required],
      linkedPlant: ['', Validators.required],
      pathwayOverlap: ['', Validators.required],
      similarityScore: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      mechanism: ['', Validators.required],
      notes: ['']
    });
    if (this.item) { this.form.patchValue(this.item); }
  }

  open(mode: DrugReferenceModalMode, item?: DrugReference) {
    this.mode = mode; this.item = item; this.isOpen = true;
    if (this.form) { item ? this.form.patchValue(item) : this.form.reset({ similarityScore: 0 }); }
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
    const item: DrugReference = { ...this.item, ...this.form.value };
    this.saved.emit(item);
    this.showConfirmModal = false;
    this.close();
  }

  toggleEdit() { this.mode = 'edit'; }
  get isReadOnly(): boolean { return this.mode === 'view'; }
}
