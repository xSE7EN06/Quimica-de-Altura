import { Observable } from 'rxjs';
import { User } from '../models/user.entity';

export abstract class UserRepository {
    abstract getUsers(): Observable<User[]>;
    abstract getUserById(id: string): Observable<User | undefined>;
    abstract addUser(user: User): Observable<void>;
    abstract updateUser(user: User): Observable<void>;
    abstract deleteUser(id: string): Observable<void>;
}
