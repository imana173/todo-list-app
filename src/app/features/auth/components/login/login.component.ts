import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-black">
      <h2 class="text-2xl font-semibold mb-4">Connexion</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input class="border rounded w-full p-2" type="email" formControlName="email" />
          @if (invalid('email')) {
            <p class="text-sm text-red-600 mt-1">{{ errorOf('email') }}</p>
          }
        </div>

        <div>
          <label class="block text-sm mb-1">Mot de passe</label>
          <input class="border rounded w-full p-2" type="password" formControlName="password" />
          @if (invalid('password')) {
            <p class="text-sm text-red-600 mt-1">{{ errorOf('password') }}</p>
          }
        </div>

        <button class="bg-blue-600 text-white px-4 py-2 rounded"
                [disabled]="form.invalid || loading()">
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </button>
        <a routerLink="/auth/register" class="ml-3 underline">Créer un compte</a>

        @if (error()) {
          <div class="bg-red-50 border border-red-200 rounded p-3 mt-3">
            <p class="text-red-600 text-sm">{{ error() }}</p>
          </div>
        }
      </form>

      <p class="text-gray-500 text-sm mt-4">
        Comptes de test : admin&#64;example.com / admin123 — user&#64;example.com / user123
      </p>
    </section>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // ✅ pour récupérer returnUrl

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalid(name: string) {
    const c = this.form.get(name);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }
  errorOf(name: string) {
    const c = this.form.get(name);
    if (!c?.errors) return '';
    if (c.errors['required']) return 'Champ requis';
    if (c.errors['email']) return 'Email invalide';
    if (c.errors['minlength']) return `Minimum ${c.errors['minlength'].requiredLength} caractères`;
    return 'Valeur invalide';
  }

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.loading.set(false);

        // ✅ utilise returnUrl si dispo, sinon /todos
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/todos';
        this.router.navigate([returnUrl], { replaceUrl: true }); // 🔥 clean URL
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erreur de connexion');
      },
    });
  }
}




