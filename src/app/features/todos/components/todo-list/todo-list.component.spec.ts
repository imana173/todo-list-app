import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoServiceSpy: jasmine.SpyObj<TodoService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TodoService', [
      'getAllTodos',
      'todoStats',
      'pendingTodos',
      'inProgressTodos',
      'completedTodos',
      'highPriorityTodos',
    ]);

    spy.getAllTodos.and.returnValue(Promise.resolve([]));
    spy.todoStats.and.returnValue({
      total: 0,
      completed: 0,
      inProgress: 0,
      pending: 0,
      highPriority: 0,
      completionRate: 0,
    });
    spy.pendingTodos.and.returnValue([]);
    spy.inProgressTodos.and.returnValue([]);
    spy.completedTodos.and.returnValue([]);
    spy.highPriorityTodos.and.returnValue([]);

    await TestBed.configureTestingModule({
      imports: [TodoListComponent],
      providers: [{ provide: TodoService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoServiceSpy = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler getAllTodos au démarrage', async () => {
    fixture.detectChanges();        // lance ngOnInit + rendu template
    await fixture.whenStable();     // attend les promesses
    expect(todoServiceSpy.getAllTodos).toHaveBeenCalled();
  });
});







