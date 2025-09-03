import { Component } from '@angular/core';
import { TodoListComponent } from './features/todos/components/todo-list/todo-list.component';
import { HeaderComponent } from './shared/components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, TodoListComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <app-todo-list></app-todo-list>
    </main>
  `,
})
export class AppComponent {}

