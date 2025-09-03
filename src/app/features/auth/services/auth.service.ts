import { Injectable, signal } from '@angular/core';
import { User, LoginRequest, RegisterRequest } from '../../auth/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = signal<User[]>([
    { id: 1, email: 'admin@example.com', password: 'admin123', role: 'admin', createdAt: new Date('2024-01-01') },
    { id: 2, email: 'user@example.com',  password: 'user123',  role: 'user',  createdAt: new Date('2024-01-02')  },
  ]);

  private currentUser = signal<User | null>(null);
  private delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

  async login(credentials: LoginRequest) {
    await this.delay(500);
    const user = this.users().find(u => u.email === credentials.email && u.password === credentials.password);
    if (user) { this.currentUser.set(user); return { success: true, user }; }
    return { success: false, error: 'Email ou mot de passe incorrect' };
    }

  async register(data: RegisterRequest) {
    await this.delay(600);
    if (this.users().some(u => u.email === data.email)) return { success: false, error: 'Cet email est déjà utilisé' };
    if (data.password !== data.confirmPassword) return { success: false, error: 'Les mots de passe ne correspondent pas' };
    const user: User = { id: Date.now(), email: data.email, password: data.password, role: 'user', createdAt: new Date() };
    this.users.update(arr => [...arr, user]);
    this.currentUser.set(user);
    return { success: true, user };
  }

  async logout() { await this.delay(200); this.currentUser.set(null); }
  isAuthenticated() { return this.currentUser() !== null; }
  isAdmin() { return this.currentUser()?.role === 'admin'; }
  getCurrentUser() { return this.currentUser(); }

  async getAllUsers(): Promise<User[]> {
    await this.delay(400);
    if (!this.isAdmin()) throw new Error('Accès non autorisé');
    return this.users().map(u => ({ ...u, password: '***' }));
  }
}

