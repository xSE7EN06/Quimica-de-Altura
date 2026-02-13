import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { finalize, map, tap } from 'rxjs/operators';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { User } from '../../domain/models/user.entity';
import { USERS_MOCK } from '../../presentation/shared/mock-data/user.mock';
import { LoadingService } from '../../application/services/loading.service';

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
