import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { User } from '../../../../domain/models/user.entity';

export type UserModalMode = 'view' | 'edit' | 'add';

@Component({
    selector: 'app-user-modal',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        IonModal,
        ConfirmationModalComponent
    ],
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit, OnChanges {
    @Input() isOpen = false;
    @Input() mode: UserModalMode = 'view';
    @Input() user?: User;
    @Input() hasPrevious = false;
    @Input() hasNext = false;

    @Output() saved = new EventEmitter<User>();
    @Output() closed = new EventEmitter<void>();
    @Output() prev = new EventEmitter<void>();
    @Output() next = new EventEmitter<void>();

    userForm!: FormGroup;
    showConfirmModal = false;

    constructor(private fb: FormBuilder) { }

    ngOnInit() {
        this.initForm();
    }

    ngOnChanges() {
        if (this.user && this.userForm) {
            this.userForm.patchValue(this.user);
        }
    }

    private initForm() {
        this.userForm = this.fb.group({
            id: [''],
            userName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            role: ['Editor', Validators.required],
            birthdate: ['', Validators.required],
            nationality: ['', Validators.required],
            address: this.fb.group({
                street: ['', Validators.required],
                externalNumber: ['', Validators.required],
                internalNumber: [''],
                colony: ['', Validators.required],
                city: ['', Validators.required],
                state: ['', Validators.required],
                zipCode: ['', Validators.required],
                country: ['', Validators.required]
            }),
            password: ['']
        });
    }

    open(mode: UserModalMode, user?: User) {
        this.mode = mode;
        this.user = user;
        this.isOpen = true;

        if (this.userForm) {
            if (user) {
                this.userForm.patchValue(user);
                if (mode === 'edit') {
                    this.userForm.get('password')?.setValidators(null);
                }
            } else {
                this.userForm.reset({ role: 'Editor' });
                this.userForm.get('password')?.setValidators([Validators.required]);
            }
            this.userForm.get('password')?.updateValueAndValidity();
        }
    }

    close() {
        this.isOpen = false;
        this.closed.emit();
    }

    onDidDismiss() {
        this.isOpen = false;
        this.closed.emit();
    }

    onSave() {
        if (this.userForm.valid) {
            if (this.mode === 'edit') {
                this.showConfirmModal = true;
            } else {
                this.executeSave();
            }
        }
    }

    executeSave() {
        this.saved.emit(this.userForm.value);
        this.showConfirmModal = false;
        this.close();
    }

    toggleEdit() {
        this.mode = 'edit';
        this.userForm.get('password')?.setValidators(null);
        this.userForm.get('password')?.updateValueAndValidity();
    }

    get isReadOnly(): boolean {
        return this.mode === 'view';
    }

    get title(): string {
        if (this.mode === 'add') return 'Nuevo Usuario';
        if (this.mode === 'edit') return 'Editar Usuario';
        return 'Detalles del Usuario';
    }
}
