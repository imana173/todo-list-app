// src/app/app.component.ts
import { Component } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, NotificationsComponent],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <router-outlet></router-outlet>
    </main>
    <app-notifications></app-notifications>
  `,
})
export class AppComponent {}



