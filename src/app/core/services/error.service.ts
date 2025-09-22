// src/app/core/services/error.service.ts
import { Injectable, signal } from '@angular/core';

export interface Notification {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private notifications = signal<Notification[]>([]);
  public notifications$ = this.notifications.asReadonly();

  add(message: string, type: 'error' | 'warning' | 'info' = 'error') {
    const notif: Notification = {
      id: Date.now().toString(),
      message,
      type
    };
    this.notifications.update(list => [...list, notif]);

    // auto-suppression après 5s
    setTimeout(() => this.remove(notif.id), 5000);
  }

  remove(id: string) {
    this.notifications.update(list => list.filter(n => n.id !== id));
  }

  clearAll() {
    this.notifications.set([]);
  }
  addError(message: string) {
  this.add(message, 'error');
}

addWarning(message: string) {
  this.add(message, 'warning');
}

addInfo(message: string) {
  this.add(message, 'info');
}

}
