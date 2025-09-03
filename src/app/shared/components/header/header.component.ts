import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-blue-600 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">TodoList App</h1>
        <nav>
          <ul class="flex space-x-4">
            <li><a routerLink="/todos" class="hover:text-blue-200">Todos</a></li>
            <li><a routerLink="/admin" class="hover:text-blue-200">Admin</a></li>
            <li><button (click)="logout()" class="hover:text-blue-200">Logout</button></li>
          </ul>
        </nav>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  logout() { console.warn('Logout clicked (mock)'); }
}
