// src/app/features/admin/components/admin/admin.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { TodoService } from '../../../todos/services/todo.service';
import { User } from '../../../auth/models/user.model';
import { Todo } from '../../../todos/models/todo.model';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../../../../core/services/error.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Interface Admin</h1>

      <!-- Section Utilisateurs -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-2">Utilisateurs</h2>
        <ul>
          <li *ngFor="let u of users()" 
              class="flex justify-between items-center border-b py-2">
            <span>{{ u.name }} ({{ u.role }})</span>
            <button 
              *ngIf="u.role !== 'admin'" 
              (click)="deleteUser(u.id)" 
              class="text-red-600 hover:underline">
              Supprimer
            </button>
            <span *ngIf="u.role === 'admin'" class="text-gray-400">Admin protégé</span>
          </li>
        </ul>
      </section>

      <!-- Section Tickets -->
      <section class="mb-8">
        <h2 class="text-lg font-semibold mb-2">Tickets (Todos)</h2>
        <ul>
          <li *ngFor="let t of todos()" class="border rounded p-3 mb-2 bg-gray-50">
            <div class="flex justify-between items-center">
              <div>
                <strong>{{ t.title }}</strong> - {{ t.status }}
                <p class="text-sm text-gray-500">{{ t.description }}</p>
              </div>
              <button (click)="deleteTodo(t.id)" class="text-red-600 hover:underline">
                Supprimer
              </button>
            </div>

            <!-- Assignation -->
            <div class="mt-2">
              <label class="text-sm">Assigné à : </label>
              <select 
                [value]="t.assignedTo ?? ''" 
                (change)="assignTodo(t.id, $event)" 
                class="border rounded px-2 py-1">
                <option value="">Non assigné</option>
                <option *ngFor="let u of users()" [value]="u.id">
                  {{ u.name }}
                </option>
              </select>
            </div>
          </li>
        </ul>
      </section>

      <!-- Test Intercepteur HTTP -->
      <button (click)="testHttp()" class="bg-blue-600 text-white px-4 py-2 rounded">
        Tester Intercepteur HTTP
      </button>
    </div>
  `
})
export class AdminComponent {
  private http = inject(HttpClient);
  private auth = inject(AuthService);
  private todosService = inject(TodoService);
  private errorService = inject(ErrorService);

  users = signal<User[]>([]);
  todos = signal<Todo[]>([]);

  constructor() {
    this.loadUsers();
    this.loadTodos();
  }

  // Gestion utilisateurs
  loadUsers() {
    this.auth.getAllUsers().subscribe({
      next: data => this.users.set(data),
      error: () => this.errorService.addError('Erreur lors du chargement des utilisateurs')
    });
  }

  deleteUser(id: number) {
    this.auth.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: () => this.errorService.addError('Erreur lors de la suppression d\'un utilisateur')
    });
  }

  // Gestion todos
  async loadTodos() {
    try {
      this.todos.set(await this.todosService.getAllTodos());
    } catch {
      this.errorService.addError('Erreur lors du chargement des tickets');
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todosService.deleteTodo(id);
      await this.loadTodos();
    } catch {
      this.errorService.addError('Erreur lors de la suppression du ticket');
    }
  }

  async assignTodo(todoId: number, event: Event) {
    const select = event.target as HTMLSelectElement;
    const value = select.value;
    const id = value ? parseInt(value, 10) : undefined;

    try {
      await this.todosService.updateTodo(todoId, { assignedTo: id });
      await this.loadTodos();
    } catch {
      this.errorService.addError('Erreur lors de l\'assignation du ticket');
    }
  }

  // Test intercepteur
  testHttp() {
    this.http.get('https://jsonplaceholder.typicode.com/todos/1')
      .subscribe({
        next: res => console.log('✅ Réponse API test :', res),
        error: () => this.errorService.addError('Erreur lors de l\'appel API test')
      });
  }
}

