import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../core/services/error.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 space-y-2 z-50">
      @for (n of errorService.notifications$(); track n.id) {
        <div 
          class="px-4 py-2 rounded shadow-md animate-fade-in text-white"
          [class.bg-green-600]="n.type === 'success'"
          [class.bg-red-600]="n.type === 'error'"
          [class.bg-yellow-500]="n.type === 'warning'"
          [class.bg-blue-500]="n.type === 'info'"
        >
          {{ n.message }}
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NotificationsComponent {
  errorService = inject(ErrorService);
}

