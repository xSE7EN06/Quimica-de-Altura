import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, finalize } from 'rxjs';
import { User } from '../../domain/models/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';
import { LoadingService } from '../../application/services/loading.service';

@Injectable({
    providedIn: 'root'
})
export class MockUserRepository extends UserRepository {
    private loadingService = inject(LoadingService);
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
            role: 'Administrador',
            birthdate: '1992-11-20',
            nationality: 'Mexicana',
            address: 'Calle Benito Juárez 789, Orizaba, México'
        },
        {
            id: '4',
            userName: 'jlopez',
            firstName: 'Juan',
            lastName: 'López',
            email: 'j.lopez@quimicaalturas.com',
            role: 'Usuario',
            birthdate: '1995-02-14',
            nationality: 'Mexicana',
            address: 'Av. Revolución 101, Xalapa, México'
        },
        {
            id: '5',
            userName: 'ana.martinez',
            firstName: 'Ana',
            lastName: 'Martínez',
            email: 'ana.mtz@quimicaalturas.com',
            role: 'Investigador',
            birthdate: '1988-08-30',
            nationality: 'Mexicana',
            address: 'Calle 5 de Mayo 22, Coatepec, México'
        },
        {
            id: '6',
            userName: 'carlos.s',
            firstName: 'Carlos',
            lastName: 'Sánchez',
            email: 'c.sanchez@quimicaalturas.com',
            role: 'Administrador',
            birthdate: '1982-12-12',
            nationality: 'Mexicana',
            address: 'Blvd. Córdoba-Fortín 55, Fortín, México'
        },
        {
            id: '7',
            userName: 'sofia.v',
            firstName: 'Sofía',
            lastName: 'Vázquez',
            email: 'sofia.v@quimicaalturas.com',
            role: 'Usuario',
            birthdate: '1996-04-25',
            nationality: 'Mexicana',
            address: 'Calle Real 88, Orizaba, México'
        },
        {
            id: '8',
            userName: 'rhernandez',
            firstName: 'Roberto',
            lastName: 'Hernández',
            email: 'r.hernandez@quimicaalturas.com',
            role: 'Investigador',
            birthdate: '1980-07-19',
            nationality: 'Mexicana',
            address: 'Av. Independencia 404, Veracruz, México'
        },
        {
            id: '9',
            userName: 'paty.g',
            firstName: 'Patricia',
            lastName: 'Gómez',
            email: 'p.gomez@quimicaalturas.com',
            role: 'Usuario',
            birthdate: '1999-01-10',
            nationality: 'Mexicana',
            address: 'Calle Reforma 33, Boca del Río, México'
        },
        {
            id: '10',
            userName: 'd.torres',
            firstName: 'Daniel',
            lastName: 'Torres',
            email: 'd.torres@quimicaalturas.com',
            role: 'Usuario',
            birthdate: '2000-05-05',
            nationality: 'Mexicana',
            address: 'Av. Xalapa 77, Xalapa, México'
        },
        {
            id: '11',
            userName: 'e.ramirez',
            firstName: 'Elena',
            lastName: 'Ramírez',
            email: 'e.ramirez@quimicaalturas.com',
            role: 'Investigador',
            birthdate: '1987-03-22',
            nationality: 'Mexicana',
            address: 'Calle Madero 12, Zongolica, México'
        },
        {
            id: '12',
            userName: 'fer.c',
            firstName: 'Fernando',
            lastName: 'Castillo',
            email: 'f.castillo@quimicaalturas.com',
            role: 'Administrador',
            birthdate: '1993-09-15',
            nationality: 'Mexicana',
            address: 'Av. 1 505, Córdoba, México'
        },
        {
            id: '13',
            userName: 'g.jimenez',
            firstName: 'Gabriela',
            lastName: 'Jiménez',
            email: 'g.jimenez@quimicaalturas.com',
            role: 'Administrador',
            birthdate: '1984-11-08',
            nationality: 'Mexicana',
            address: 'Calle Sur 10 202, Orizaba, México'
        },
        {
            id: '14',
            userName: 'h.diaz',
            firstName: 'Héctor',
            lastName: 'Díaz',
            email: 'h.diaz@quimicaalturas.com',
            role: 'Usuario',
            birthdate: '1997-06-30',
            nationality: 'Mexicana',
            address: 'Av. Ruiz Cortines 900, Xalapa, México'
        },
        {
            id: '15',
            userName: 'i.morales',
            firstName: 'Isabel',
            lastName: 'Morales',
            email: 'i.morales@quimicaalturas.com',
            role: 'Investigador',
            birthdate: '1990-02-18',
            nationality: 'Mexicana',
            address: 'Calle Hidalgo 45, Huatusco, México'
        }
    ];

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
