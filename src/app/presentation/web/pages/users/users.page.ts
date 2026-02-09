import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { DataTableComponent, ColumnConfig } from '../../components/data-table/data-table.component';
import { UserModalComponent } from '../../components/user-modal/user-modal.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { User } from '../../../../domain/models/user.entity';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { ToastController } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personAdd, checkmarkCircle, trash, create, eye } from 'ionicons/icons';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        DataTableComponent,
        UserModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
    users: User[] = [];
    columns: ColumnConfig[] = [];

    @ViewChild('userTpl', { static: true }) userTpl!: TemplateRef<any>;
    @ViewChild('roleTpl', { static: true }) roleTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    @ViewChild(UserModalComponent) userModal!: UserModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedUserId?: string;

    constructor(
        private userRepository: UserRepository,
        private toastController: ToastController,
        private cdr: ChangeDetectorRef
    ) {
        addIcons({ personAdd, checkmarkCircle, trash, create, eye });
    }

    ngOnInit() {
        this.loadUsers();
        this.columns = [
            { key: 'userName', header: 'Usuario', cellTemplate: this.userTpl },
            { key: 'email', header: 'Email' },
            { key: 'role', header: 'Rol', cellTemplate: this.roleTpl },
            { key: 'nationality', header: 'Nacionalidad' },
            { key: 'actions', header: 'Acciones', cellTemplate: this.actionsTpl }
        ];
    }

    private loadUsers() {
        this.userRepository.getUsers().subscribe(data => {
            this.users = data;
            this.cdr.detectChanges();
        });
    }

    onSearch(query: string) {
        if (query) {
            this.userRepository.searchUsers(query).subscribe(data => {
                this.users = data;
                this.cdr.detectChanges();
            });
        } else {
            this.loadUsers();
        }
    }

    onAddUser() {
        this.userModal.open('add');
    }

    onViewUser(user: User) {
        this.userModal.open('view', user);
    }

    onEditUser(user: User) {
        this.userModal.open('edit', user);
    }

    onDeleteUser(user: User) {
        this.selectedUserId = user.id;
        this.confirmModal.open();
    }

    onConfirmDelete() {
        if (this.selectedUserId) {
            this.userRepository.deleteUser(this.selectedUserId).subscribe(() => {
                this.loadUsers();
                this.showToast('Usuario eliminado correctamente', 'trash', 'danger');
                this.selectedUserId = undefined;
            });
        }
    }

    onSaveUser(user: User) {
        if (user.id) {
            this.userRepository.updateUser(user).subscribe(() => {
                this.loadUsers();
                this.showToast('Usuario actualizado correctamente', 'checkmark-circle');
            });
        } else {
            this.userRepository.addUser(user).subscribe(() => {
                this.loadUsers();
                this.showToast('Usuario creado correctamente', 'checkmark-circle');
            });
        }
    }

    private async showToast(message: string, icon: string, color: string = 'dark') {
        const toast = await this.toastController.create({
            header: 'Módulo de Usuarios',
            message: message,
            duration: 3000,
            position: 'bottom',
            color: color,
            icon: icon,
            buttons: [{ side: 'end', icon: 'close', role: 'cancel' }]
        });
        await toast.present();
    }
}
