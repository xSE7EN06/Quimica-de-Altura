import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { IonModal } from '@ionic/angular/standalone';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { User } from '../../../../domain/models/user.entity';

function minAgeValidator(minAge: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.value) return null;
        const birthdate = new Date(control.value);
        const today = new Date();
        const age = today.getFullYear() - birthdate.getFullYear() -
            (today < new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate()) ? 1 : 0);
        return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
}

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
            userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.pattern(/^[a-zA-Z0-9._]+$/)]],
            firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
            email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
            role: ['Editor', Validators.required],
            birthdate: ['', [Validators.required, minAgeValidator(18)]],
            nationality: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
            address: this.fb.group({
                street: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
                externalNumber: ['', [Validators.required, Validators.maxLength(10)]],
                internalNumber: [''],
                colony: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
                city: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
                state: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
                zipCode: ['', [Validators.required, Validators.pattern(/^\d{4,10}$/)]],
                country: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
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
                this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(50), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]);
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
        this.userForm.markAllAsTouched();
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
