import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../models/todo.model';
import { TodoService } from '../../services/todo.service';

// ✅ Pipes et directives
import { PriorityPipe } from '../../../../shared/pipes/priority.pipe';
import { DurationPipe } from '../../../../shared/pipes/duration.pipe';
import { HighlightDirective } from '../../../../shared/directives/highlight.directive';

// ✅ Notifications
import { ErrorService } from '../../../../core/services/error.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PriorityPipe, DurationPipe, HighlightDirective],
  changeDetection: ChangeDetectionStrategy.OnPush, // ⚡ optimisation
  template: `
  <div class="max-w-5xl mx-auto">
    <h2 class="text-3xl font-bold mb-6">Mes Todos</h2>

    <!-- ✅ Dashboard stats -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <div class="bg-white p-4 rounded shadow text-center">
        <h3 class="text-sm text-gray-500">Total</h3>
        <p class="text-xl font-bold">{{ todoService.todoStats().total }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <h3 class="text-sm text-gray-500">À faire</h3>
        <p class="text-xl font-bold text-gray-700">{{ todoService.todoStats().pending }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <h3 class="text-sm text-gray-500">En cours</h3>
        <p class="text-xl font-bold text-blue-600">{{ todoService.todoStats().inProgress }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <h3 class="text-sm text-gray-500">Terminés</h3>
        <p class="text-xl font-bold text-green-600">{{ todoService.todoStats().completed }}</p>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <h3 class="text-sm text-gray-500">Complétion</h3>
        <p class="text-xl font-bold text-purple-600">
          {{ todoService.todoStats().completionRate | number:'1.0-0' }}%
        </p>
      </div>
    </div>

    <!-- ✅ Formulaire ajout -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-semibold mb-4">Ajouter une tâche</h3>
      <form (ngSubmit)="addTodo()" #todoForm="ngForm">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input class="border p-2 rounded" type="text"
                 [(ngModel)]="newTodo.title" name="title"
                 placeholder="Titre" required>
          <input class="border p-2 rounded" type="text"
                 [(ngModel)]="newTodo.description" name="description"
                 placeholder="Description (optionnel)">
          <select class="border p-2 rounded"
                  [(ngModel)]="newTodo.priority" name="priority">
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input class="border p-2 rounded" type="number"
                 [(ngModel)]="newTodo.estimatedTime" name="estimatedTime"
                 placeholder="Durée (min)" min="1">
        </div>
        <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                type="submit" [disabled]="!todoForm.form.valid || addingTodo()">
          @if (addingTodo()) {
            <span class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span> Ajout...
          } @else { Ajouter }
        </button>
      </form>
    </div>

    <!-- ✅ Kanban -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- À faire -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4 text-gray-700">
          À faire ({{ todoService.pendingTodos().length }})
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.pendingTodos(); track trackByTodoId) {
            <div class="bg-white p-4 rounded shadow-sm border-l-4 border-gray-400"
                 [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'">
              <h4 class="font-medium">{{ todo.title }}</h4>
              <p class="text-sm text-gray-600">{{ todo.description }}</p>
              <span class="text-xs px-2 py-1 rounded {{ todo.priority }}">
                {{ todo.priority | priority }}
              </span>
              <p class="text-xs text-gray-500 mt-2">
                Durée : {{ todo.estimatedTime || 60 | duration }}
              </p>
              <button (click)="updateStatus(todo.id, 'in-progress')"
                      class="text-blue-600 hover:text-blue-800 text-sm">Commencer</button>
            </div>
          }
        </div>
      </div>

      <!-- En cours -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4 text-blue-700">
          En cours ({{ todoService.inProgressTodos().length }})
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.inProgressTodos(); track trackByTodoId) {
            <div class="bg-white p-4 rounded shadow-sm border-l-4 border-blue-400"
                 [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'">
              <h4 class="font-medium">{{ todo.title }}</h4>
              <p class="text-sm text-gray-600">{{ todo.description }}</p>
              <span class="text-xs px-2 py-1 rounded">{{ todo.priority | priority }}</span>
              <p class="text-xs text-gray-500 mt-2">
                Durée : {{ todo.estimatedTime || 60 | duration }}
              </p>
              <button (click)="updateStatus(todo.id, 'done')"
                      class="text-green-600 hover:text-green-800 text-sm">Terminer</button>
            </div>
          }
        </div>
      </div>

      <!-- Terminé -->
      <div class="bg-gray-50 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-4 text-green-700">
          Terminé ({{ todoService.completedTodos().length }})
        </h3>
        <div class="space-y-3">
          @for (todo of todoService.completedTodos(); track trackByTodoId) {
            <div class="bg-white p-4 rounded shadow-sm border-l-4 border-green-400 opacity-80"
                 [appHighlight]="todo.priority === 'high' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'">
              <h4 class="font-medium line-through">{{ todo.title }}</h4>
              <p class="text-sm text-gray-600 line-through">{{ todo.description }}</p>
              <span class="text-xs px-2 py-1 rounded">{{ todo.priority | priority }}</span>
              <p class="text-xs text-gray-500 mt-2">
                Durée : {{ todo.estimatedTime || 60 | duration }}
              </p>
              <button (click)="deleteTodo(todo.id)"
                      class="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
            </div>
          }
        </div>
      </div>
    </div>
  </div>
  `
})
export class TodoListComponent implements OnInit {
  todoService = inject(TodoService);
  errorService = inject(ErrorService);
  addingTodo = signal(false);

  newTodo = { title: '', description: '', priority: 'medium' as const, estimatedTime: 60 };

  async ngOnInit() {
    await this.todoService.getAllTodos();
  }

  async addTodo() {
    if (!this.newTodo.title.trim()) {
      this.errorService.addError('❌ Le titre est requis');
      return;
    }
    try {
      this.addingTodo.set(true);
      await this.todoService.createTodo({ ...this.newTodo });
      this.errorService.addSuccess('✅ Tâche ajoutée avec succès');

      // reset
      this.newTodo.title = '';
      this.newTodo.description = '';
      this.newTodo.priority = 'medium';
      this.newTodo.estimatedTime = 60;
    } catch {
      this.errorService.addError('❌ Erreur lors de l’ajout de la tâche');
    } finally {
      this.addingTodo.set(false);
    }
  }

  async updateStatus(id: number, status: Todo['status']) {
    try {
      await this.todoService.updateTodo(id, { status });
      this.errorService.addInfo(`ℹ️ Statut mis à jour : ${status}`);
    } catch {
      this.errorService.addError('❌ Erreur lors de la mise à jour du statut');
    }
  }

  async deleteTodo(id: number) {
    try {
      await this.todoService.deleteTodo(id);
      this.errorService.addWarning('⚠️ Tâche supprimée');
    } catch {
      this.errorService.addError('❌ Erreur lors de la suppression');
    }
  }

  trackByTodoId(index: number, todo: Todo): number {
    return todo.id;
  }
}

