import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodoService } from './todo.service';
import { Todo } from '../models/todo.model';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ✅ corrige l'erreur HttpClient
    });
    service = TestBed.inject(TodoService);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  it('devrait ajouter un todo correctement', async () => {
    const todo: Todo = {
      id: 123,
      title: 'Test Todo',
      description: 'Description',
      status: 'todo',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // reset avant le test
    service['todos'].set([]);
    service['todos'].update(arr => [...arr, todo]);

    const todos = await service.getAllTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].title).toBe('Test Todo');
  });

  it('devrait calculer correctement les stats', async () => {
    service['todos'].set([
      { id: 1, title: 'A', description: '', status: 'done', priority: 'high', createdBy: 1, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, title: 'B', description: '', status: 'todo', priority: 'medium', createdBy: 1, createdAt: new Date(), updatedAt: new Date() },
    ]);

    const stats = service.todoStats();
    expect(stats.total).toBe(2);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(1);
    expect(stats.completionRate).toBe(50);
  });
});


