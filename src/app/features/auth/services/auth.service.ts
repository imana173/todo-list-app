import { Injectable, signal } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest } from '../models/user.model';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Etat utilisateur courant
  private _currentUser = signal<User | null>(null);
  // Signal en lecture seule pour les templates
  currentUserSig = this._currentUser.asReadonly();
  // Observable si besoin (guards Rx, etc.)
  currentUser$ = toObservable(this.currentUserSig);

  // Mock users
  private users: User[] = [
    { id: 1, name: 'Admin User',  email: 'admin@example.com', role: 'admin' },
    { id: 2, name: 'Normal User', email: 'user@example.com',  role: 'user'  },
  ];

  // Mock mots de passe (en prod : hash côté serveur)
  private passwords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com':  'user123',
  };

  constructor() {
    const saved = localStorage.getItem('currentUser');
    if (saved) this._currentUser.set(JSON.parse(saved));
  }

  private setCurrentUser(user: User | null) {
    this._currentUser.set(user);
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');
  }

  login(credentials: LoginRequest): Observable<User> {
    const user = this.users.find(u => u.email === credentials.email);
    const pwd  = this.passwords[credentials.email];

    if (user && pwd === credentials.password) {
      return of(user).pipe(
        delay(500),
        tap(u => this.setCurrentUser(u))
      );
    }
    return throwError(() => new Error('Email ou mot de passe incorrect'));
  }

  register(req: RegisterRequest): Observable<User> {
    const exists = this.users.some(u => u.email === req.email);
    if (exists) return throwError(() => new Error('Cet email est déjà utilisé'));
    if (req.password !== req.confirmPassword) {
      return throwError(() => new Error('Les mots de passe ne correspondent pas'));
    }

    const newUser: User = {
      id: this.users.length + 1,
      name: req.name,
      email: req.email,
      role: 'user'
    };
    this.users.push(newUser);
    this.passwords[req.email] = req.password;

    return of(newUser).pipe(
      delay(500),
      tap(u => this.setCurrentUser(u))
    );
  }

  logout(): void {
    this.setCurrentUser(null);
  }

  // Utilitaire token mock (pour la 2.5 plus tard)
  getToken(): string | null {
    const u = this._currentUser();
    return u ? `mock-token-${u.id}` : null;
  }

  // Admin-only (on s’en servira en 2.4)
  getAllUsers(): Observable<User[]> {
    return of(this.users).pipe(delay(300));
  }

  deleteUser(id: number): Observable<void> {
    const i = this.users.findIndex(u => u.id === id);
    if (i === -1) return throwError(() => new Error('Utilisateur non trouvé'));
    this.users.splice(i, 1);
    return of(void 0).pipe(delay(300));
  }

  // src/app/features/auth/services/auth.service.ts
updateUserRole(id: number, role: 'user' | 'admin') {
  const user = this.users.find(u => u.id === id);
  if (!user) return throwError(() => new Error('Utilisateur non trouvé'));
  user.role = role;
  return of(user).pipe(delay(300));
}

}



