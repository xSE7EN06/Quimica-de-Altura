import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError, delay } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
// import { User } from '../../domain/models/user.entity'; <-- REMOVED IMPORT
// import { USERS_MOCK } from '../repositories/mock-user.repository'; <-- REMOVED IMPORT
import { LoadingService } from '../../application/services/loading.service';

// --- DEFINED INTERFACE AND MOCK DATA DIRECTLY IN THIS FILE AS REQUESTED ---

export interface User {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
    password?: string;
    email: string;
    role: string;
    birthdate: string;
    nationality: string;
    address: string;
}

export const USERS_MOCK: User[] = [
    {
        id: '1',
        userName: 'admin',
        firstName: 'Administrador',
        lastName: 'Principal',
        email: 'admin@quimicaalturas.com',
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
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
        password: 'password123',
        role: 'Investigador',
        birthdate: '1990-02-18',
        nationality: 'Mexicana',
        address: 'Calle Hidalgo 45, Huatusco, México'
    }
];

@Injectable({
    providedIn: 'root'
})
export class AuthService extends AuthRepository {
    private loadingService = inject(LoadingService);
    private currentUserSubject: BehaviorSubject<User | null>;
    public currentUser: Observable<User | null>;
    private readonly STORAGE_KEY = 'current_user';
    private localUsers: User[] = [...USERS_MOCK]; // Clone to allow local additions

    constructor() {
        super();
        const storedUser = localStorage.getItem(this.STORAGE_KEY);
        this.currentUserSubject = new BehaviorSubject<User | null>(storedUser ? JSON.parse(storedUser) : null);
        this.currentUser = this.currentUserSubject.asObservable();
    }

    // --- API IMPLEMENTATION NOTE ---
    // In the future, replace the logic inside these methods with HTTP calls to your API.
    // The method signatures can remain the same (returning Observables), making the transition seamless.

    login(email: string, password?: string): Observable<User | undefined> {
        this.loadingService.show();
        // MOCK LOGIC: Find user by email (and password if checking)
        const user = this.localUsers.find(u => u.email === email && (password ? u.password === password : true));

        if (user) {
            // Simulate API delay
            return of(user).pipe(
                delay(2000),
                tap(u => {
                    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(u));
                    this.currentUserSubject.next(u);
                }),
                finalize(() => this.loadingService.hide())
            );
        } else {
            this.loadingService.hide(); // Hide manually since we are throwing error directly
            return throwError(() => new Error('Invalid credentials'));
        }
    }

    register(user: User): Observable<User> {
        this.loadingService.show();
        // MOCK LOGIC: Add user to local array
        // Check if email already exists
        if (this.localUsers.find(u => u.email === user.email)) {
            this.loadingService.hide();
            return throwError(() => new Error('Email already registered'));
        }

        const newUser = { ...user, id: `usr_${Date.now()}` }; // Generate mock ID
        this.localUsers.push(newUser);

        // Auto-login after register
        return of(newUser).pipe(
            tap(u => {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(u));
                this.currentUserSubject.next(u);
            }),
            finalize(() => this.loadingService.hide())
        );
    }

    logout(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
    }

    getCurrentUser(): Observable<User | null> {
        return this.currentUser;
    }

    isAuthenticated(): Observable<boolean> {
        return this.currentUser.pipe(map(user => !!user));
    }

    /**
     * Helper to get the current value without subscription
     */
    public get currentUserValue(): User | null {
        return this.currentUserSubject.value;
    }
}
