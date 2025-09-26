import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold"><a routerLink="/">TodoList App</a></h1>
        <nav>
          <ul class="flex space-x-4">
            @if (user()) {
              <li><a routerLink="/todos" class="hover:text-blue-200">Todos</a></li>
              <li><a routerLink="/projects" class="hover:text-blue-200">Projets</a></li>
              @if (user()?.role === 'admin') {
                <li><a routerLink="/admin" class="hover:text-blue-200">Admin</a></li>
              }
              <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
            } @else {
              <li><a routerLink="/auth/login" class="hover:text-blue-200">Login</a></li>
              <li><a routerLink="/auth/register" class="hover:text-blue-200">Register</a></li>
            }
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUserSig;

  async logout() {
    this.auth.logout();
    this.router.navigateByUrl('/auth/login');
  }
}



