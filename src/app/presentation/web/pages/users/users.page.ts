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

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-users',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        FormsModule,
        DataTableComponent,
        UserModalComponent,
        ConfirmationModalComponent
    ],
    templateUrl: './users.page.html',
    styleUrls: ['./users.page.scss']
})
export class UsersPage implements OnInit {
    users: User[] = [];
    private originalUsers: User[] = [];
    columns: ColumnConfig[] = [];
    activeFilters = {
        role: ''
    };
    tableLoading = true;

    @ViewChild('userTpl', { static: true }) userTpl!: TemplateRef<any>;
    @ViewChild('roleTpl', { static: true }) roleTpl!: TemplateRef<any>;
    @ViewChild('actionsTpl', { static: true }) actionsTpl!: TemplateRef<any>;

    @ViewChild(UserModalComponent) userModal!: UserModalComponent;
    @ViewChild(ConfirmationModalComponent) confirmModal!: ConfirmationModalComponent;

    private selectedUserId?: string;
    currentIndex = -1;
    selectedUser?: User;

    get hasPrevious(): boolean { return this.currentIndex > 0; }
    get hasNext(): boolean { return this.currentIndex < this.users.length - 1; }

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
            { key: 'nationality', header: 'Nacionalidad' }
        ];
    }

    private loadUsers() {
        this.tableLoading = true;
        this.userRepository.getUsers().subscribe(data => {
            this.originalUsers = data;
            this.applyFilters();
            // Simulate loading delay
            setTimeout(() => {
                this.tableLoading = false;
                this.cdr.detectChanges();
            }, 2000);
        });
    }

    private applyFilters() {
        let filtered = [...this.originalUsers];

        if (this.activeFilters.role) {
            filtered = filtered.filter(u => u.role === this.activeFilters.role);
        }

        this.users = filtered;
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
        this.selectedUser = user;
        this.currentIndex = this.users.indexOf(user);
        this.userModal.open('view', user);
    }

    onEditUser(user: User) {
        this.selectedUser = user;
        this.currentIndex = this.users.indexOf(user);
        this.userModal.open('edit', user);
    }

    onPrevUser() {
        if (this.hasPrevious) {
            this.currentIndex--;
            this.selectedUser = this.users[this.currentIndex];
        }
    }

    onNextUser() {
        if (this.hasNext) {
            this.currentIndex++;
            this.selectedUser = this.users[this.currentIndex];
        }
    }

    onDeleteUser(user: User) {
        this.selectedUserId = user.id;
        this.confirmModal.open();
    }

    onBulkDelete(items: User[]) {
        if (items.length > 0) {
            this.selectedUserId = items.map(i => i.id).join(',');
            this.confirmModal.title = `Eliminar ${items.length} Usuarios`;
            this.confirmModal.message = `¿Estás seguro de que deseas eliminar permanentemente los ${items.length} usuarios seleccionados?`;
            this.confirmModal.open();
        }
    }

    onConfirmDelete() {
        if (this.selectedUserId) {
            const ids = this.selectedUserId.split(',');
            ids.forEach(id => {
                this.userRepository.deleteUser(id).subscribe(() => {
                    this.loadUsers();
                });
            });
            this.showToast(`${ids.length} usuario(s) eliminado(s) correctamente`, 'trash', 'danger');
            this.selectedUserId = undefined;
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

    onFilterChange(type: string, value: any) {
        this.activeFilters.role = value;
        this.applyFilters();
    }

    onResetFilters() {
        this.activeFilters.role = '';
        this.applyFilters();
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
