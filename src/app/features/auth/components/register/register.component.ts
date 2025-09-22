import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

// Validateur personnalisé pour vérifier que password == confirmPassword
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password && confirmPassword && password !== confirmPassword ? { passwordMismatch: true } : null;
}

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow text-black">
      <h2 class="text-2xl font-semibold mb-4">Créer un compte</h2>

      <form [formGroup]="form" (ngSubmit)="submit()" class="space-y-4">
        
        <!-- Nom -->
        <div>
          <label class="block text-sm mb-1">Nom complet</label>
          <input class="border rounded w-full p-2" type="text" formControlName="name" />
          @if (invalid('name')) {
            <p class="text-sm text-red-600 mt-1">{{ errorOf('name') }}</p>
          }
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm mb-1">Email</label>
          <input class="border rounded w-full p-2" type="email" formControlName="email" />
          @if (invalid('email')) {
            <p class="text-sm text-red-600 mt-1">{{ errorOf('email') }}</p>
          }
        </div>

        <!-- Mot de passe -->
        <div>
          <label class="block text-sm mb-1">Mot de passe</label>
          <input class="border rounded w-full p-2" type="password" formControlName="password" />
          @if (invalid('password')) {
            <p class="text-sm text-red-600 mt-1">{{ errorOf('password') }}</p>
          }
        </div>

        <!-- Confirmation mot de passe -->
        <div>
          <label class="block text-sm mb-1">Confirmer le mot de passe</label>
          <input class="border rounded w-full p-2" type="password" formControlName="confirmPassword" />
          @if (form.errors?.['passwordMismatch'] && (form.get('confirmPassword')?.touched || form.get('password')?.touched)) {
            <p class="text-sm text-red-600 mt-1">Les mots de passe ne correspondent pas</p>
          }
        </div>

        <!-- Bouton -->
        <button class="bg-green-600 text-white px-4 py-2 rounded"
                [disabled]="form.invalid || loading()">
          {{ loading() ? 'Création...' : 'Créer le compte' }}
        </button>
        <a routerLink="/auth/login" class="ml-3 underline">Déjà un compte ?</a>

        <!-- Erreur globale -->
        @if (error()) {
          <div class="bg-red-50 border border-red-200 rounded p-3 mt-3">
            <p class="text-red-600 text-sm">{{ error() }}</p>
          </div>
        }
      </form>
    </section>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: passwordMatchValidator });

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

    const { confirmPassword, ...data } = this.form.value;

    this.auth.register(data as any).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/todos');
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err?.message ?? 'Erreur lors de la création du compte');
      },
    });
  }
}


