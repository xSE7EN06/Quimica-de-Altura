import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, finalize } from 'rxjs';
import { User } from '../../domain/models/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoadingService } from '../../application/services/loading.service';
import { USERS_MOCK } from '../../presentation/shared/mock-data/user.mock';

@Injectable({
    providedIn: 'root'
})
export class MockUserRepository extends UserRepository {
    private loadingService = inject(LoadingService);
    private users: User[] = [...USERS_MOCK];

    getUsers(): Observable<User[]> {
        this.loadingService.show();
        return of([...this.users]).pipe(delay(5000), finalize(() =>
            this.loadingService.hide()));
    }

    getUserById(id: string): Observable<User | undefined> {
        this.loadingService.show();
        const user = this.users.find(u => u.id === id);
        return of(user).pipe(
            delay(9500),
            finalize(() => this.loadingService.hide())
        );
    }

    addUser(user: User): Observable<void> {
        const newUser = {
            ...user,
            id: Date.now().toString()
        };
        this.users.unshift(newUser);
        return of(undefined).pipe(delay(500));
    }

    updateUser(user: User): Observable<void> {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = { ...user };
        }
        return of(undefined).pipe(delay(500));
    }

    deleteUser(id: string): Observable<void> {
        this.users = this.users.filter(u => u.id !== id);
        return of(undefined).pipe(delay(500));
    }

    searchUsers(query: string): Observable<User[]> {
        const lowerQuery = query.toLowerCase();
        const results = this.users.filter(u =>
            u.firstName.toLowerCase().includes(lowerQuery) ||
            u.lastName.toLowerCase().includes(lowerQuery) ||
            u.userName.toLowerCase().includes(lowerQuery) ||
            u.email.toLowerCase().includes(lowerQuery)
        );
        return of(results);
    }
}
