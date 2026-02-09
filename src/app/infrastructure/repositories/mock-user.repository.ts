import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { User } from '../../domain/models/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

@Injectable({
    providedIn: 'root'
})
export class MockUserRepository extends UserRepository {
    private users: User[] = [
        {
            id: '1',
            userName: 'admin',
            firstName: 'Administrador',
            lastName: 'Principal',
            email: 'admin@quimicaalturas.com',
            role: 'Administrador',
            birthdate: '1990-01-01',
            nationality: 'Mexicana',
            address: 'Calle Principal 123, Veracruz, México'
        },
        {
            id: '2',
            userName: 'lruiz',
            firstName: 'Laura',
            lastName: 'Ruiz',
            email: 'l.ruiz@quimicaalturas.com',
            role: 'Investigador',
            birthdate: '1985-05-15',
            nationality: 'Mexicana',
            address: 'Av. Las Palmas 456, Córdoba, México'
        },
        {
            id: '3',
            userName: 'mgarcia',
            firstName: 'Miguel',
            lastName: 'García',
            email: 'm.garcia@quimicaalturas.com',
            role: 'Editor',
            birthdate: '1992-11-20',
            nationality: 'Mexicana',
            address: 'Calle Benito Juárez 789, Orizaba, México'
        }
    ];

    getUsers(): Observable<User[]> {
        return of([...this.users]).pipe(delay(0));
    }

    getUserById(id: string): Observable<User | undefined> {
        const user = this.users.find(u => u.id === id);
        return of(user).pipe(delay(300));
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
}
