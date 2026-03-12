import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/models/user.entity';

interface ApiPage<T> { items: T[]; }

@Injectable({ providedIn: 'root' })
export class HttpUserRepository extends UserRepository {
  private readonly base = `${environment.gatewayUrl}/api/auth/api/v1/users`;

  constructor(private http: HttpClient) { super(); }

  private map(r: any): User {
    return {
      id: r.id,
      userName: r.username ?? `${r.first_name ?? ''}.${r.last_name ?? ''}`.toLowerCase(),
      firstName: r.first_name ?? '',
      lastName: r.last_name ?? '',
      email: r.email ?? '',
      role: r.roles?.[0]?.name ?? 'user',
      birthdate: r.birthdate ?? '',
      nationality: r.nationality ?? '',
      address: r.address ?? '',
    };
  }

  getUsers(): Observable<User[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?size=100`).pipe(map(res => res.items.map(r => this.map(r))));
  }

  getUserById(id: string): Observable<User | undefined> {
    return this.http.get<any>(`${this.base}/${id}`).pipe(map(r => this.map(r)));
  }

  addUser(user: User): Observable<void> {
    return this.http.post<void>(`${this.base}/`, {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      password: (user as any).password,
    });
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(`${this.base}/${user.id}`, {
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
    });
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<ApiPage<any>>(`${this.base}/?search=${encodeURIComponent(query)}&size=100`).pipe(
      map(res => res.items.map(r => this.map(r)))
    );
  }
}
