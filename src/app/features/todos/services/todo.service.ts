import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo, CreateTodoRequest } from '../../todos/models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private http: HttpClient) {
    // 🔹 Charger depuis localStorage au démarrage
    const saved = localStorage.getItem('todos');
    if (saved) {
      this.todos.set(
        JSON.parse(saved).map((t: any) => ({
          ...t,
          createdAt: new Date(t.createdAt),
          updatedAt: new Date(t.updatedAt),
        }))
      );
    }

    // 🔹 Sauvegarde automatique à chaque changement
    effect(() => {
      const todos = this.todos();
      localStorage.setItem('todos', JSON.stringify(todos));
      console.log(`📦 Sauvegarde : ${todos.length} todos`);
    });
  }

  // ✅ Signal writable
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Apprendre Angular',
      description: "Étudier les fondamentaux d'Angular 20+",
      status: 'todo',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Créer un projet',
      description: 'Développer une application TodoList',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 3,
      title: "Configurer l'environnement",
      description: 'Installer Node.js, Angular CLI et configurer VS Code',
      status: 'done',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14'),
    },
  ]);

  // ✅ Computed signals
  completedTodos = computed(() => this.todos().filter(t => t.status === 'done'));
  inProgressTodos = computed(() => this.todos().filter(t => t.status === 'in-progress'));
  pendingTodos = computed(() => this.todos().filter(t => t.status === 'todo'));
  highPriorityTodos = computed(() => this.todos().filter(t => t.priority === 'high'));

  todoStats = computed(() => {
    const todos = this.todos();
    const completed = this.completedTodos().length;
    const inProgress = this.inProgressTodos().length;
    const pending = this.pendingTodos().length;
    const highPriority = this.highPriorityTodos().length;

    return {
      total: todos.length,
      completed,
      inProgress,
      pending,
      highPriority,
      completionRate: todos.length > 0 ? (completed / todos.length) * 100 : 0,
    };
  });

  // Simule un délai réseau
  private delay(ms: number) {
    return new Promise<void>((r) => setTimeout(r, ms));
  }

  async getAllTodos(): Promise<Todo[]> {
    await this.delay(300);
    return this.todos();
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    await this.delay(200);
    return this.todos().find((t) => t.id === id);
  }

  async createTodo(data: CreateTodoRequest): Promise<Todo> {
    await this.delay(400);
    const newTodo: Todo = {
      id: Date.now(),
      title: data.title,
      description: data.description ?? '',
      status: 'todo',
      priority: data.priority,
      estimatedTime: data.estimatedTime ?? 60, // ⏱️ 60 min par défaut
      assignedTo: data.assignedTo,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.todos.update((arr) => [...arr, newTodo]);
    return newTodo;
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    await this.delay(300);
    let updated: Todo | undefined;
    this.todos.update((arr) =>
      arr.map((t) => {
        if (t.id === id) {
          updated = { ...t, ...updates, updatedAt: new Date() };
          return updated!;
        }
        return t;
      })
    );
    return updated;
  }

  async deleteTodo(id: number): Promise<boolean> {
    await this.delay(250);
    let deleted = false;
    this.todos.update((arr) => {
      const before = arr.length;
      const after = arr.filter((t) => t.id !== id);
      deleted = after.length < before;
      return after;
    });
    return deleted;
  }

  // 🔹 Test HTTP pour voir si l’intercepteur marche
  async testHttp(): Promise<any> {
    return this.http
      .get('https://jsonplaceholder.typicode.com/todos/1')
      .toPromise();
  }
}



