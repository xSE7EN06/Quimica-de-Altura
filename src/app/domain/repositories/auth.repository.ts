import { Observable } from 'rxjs';
import {
  LoginRequest, LoginResult,
  RegisterRequest, RegisterResponse,
  AuthUser
} from '../models/auth.models';

export abstract class AuthRepository {
    abstract login(credentials: LoginRequest): Observable<LoginResult>;
    abstract register(data: RegisterRequest): Observable<RegisterResponse>;
    abstract logout(): Observable<void>;
    abstract getCurrentUser(): Observable<AuthUser | null>;
    abstract isAuthenticated(): Observable<boolean>;
}
