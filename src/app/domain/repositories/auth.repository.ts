import { Observable } from 'rxjs';
import { User } from '../models/user.entity';

export abstract class AuthRepository {
    abstract login(email: string, password?: string): Observable<User | undefined>;
    abstract register(user: User): Observable<User>;
    abstract logout(): void;
    abstract getCurrentUser(): Observable<User | null>;
    abstract isAuthenticated(): Observable<boolean>;
}
