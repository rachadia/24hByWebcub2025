import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="theme-cosmic flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8 neo-blur rounded-xl p-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-white font-cosmic">
            <span class="text-gradient glow">Connectez-vous</span> à votre compte
          </h2>
          <p class="mt-2 text-center text-sm text-gray-300">
            Ou
            <a routerLink="/auth/register" class="font-medium text-endpage-pink hover:text-endpage-purple">
              créez un nouveau compte
            </a>
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="-space-y-px rounded-md shadow-sm">
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                required
                class="relative block w-full rounded-t-md border border-gray-700 bg-endpage-dark bg-opacity-50 px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-endpage-pink focus:outline-none focus:ring-1 focus:ring-endpage-pink sm:text-sm"
                placeholder="Adresse email"
                [ngClass]="{
                  'border-endpage-pink': 
                    loginForm.get('email')?.invalid && 
                    (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)
                }"
              />
              <div 
                *ngIf="loginForm.get('email')?.invalid && 
                      (loginForm.get('email')?.dirty || loginForm.get('email')?.touched)"
                class="mt-1 text-sm text-endpage-pink"
              >
                <div *ngIf="loginForm.get('email')?.errors?.['required']">Email est requis</div>
                <div *ngIf="loginForm.get('email')?.errors?.['email']">Format d'email invalide</div>
              </div>
            </div>
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                autocomplete="current-password"
                required
                class="relative block w-full rounded-b-md border border-gray-700 bg-endpage-dark bg-opacity-50 px-3 py-2 text-white placeholder-gray-400 focus:z-10 focus:border-endpage-pink focus:outline-none focus:ring-1 focus:ring-endpage-pink sm:text-sm"
                placeholder="Mot de passe"
                [ngClass]="{
                  'border-endpage-pink': 
                    loginForm.get('password')?.invalid && 
                    (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)
                }"
              />
              <div 
                *ngIf="loginForm.get('password')?.invalid && 
                      (loginForm.get('password')?.dirty || loginForm.get('password')?.touched)"
                class="mt-1 text-sm text-endpage-pink"
              >
                <div *ngIf="loginForm.get('password')?.errors?.['required']">Mot de passe est requis</div>
                <div *ngIf="loginForm.get('password')?.errors?.['minlength']">
                  Le mot de passe doit contenir au moins 6 caractères
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-700 bg-endpage-dark text-endpage-pink focus:ring-endpage-pink"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-300">
                Se souvenir de moi
              </label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-endpage-pink hover:text-endpage-purple">
                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="loginForm.invalid || isLoading"
              class="btn-cosmic group relative flex w-full justify-center rounded-md py-2 px-4 text-sm font-medium text-white disabled:opacity-70"
            >
              <span *ngIf="isLoading" class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 animate-spin text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </span>
              Connexion
            </button>
          </div>

          <div *ngIf="errorMessage" class="rounded-md bg-endpage-pink bg-opacity-10 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-endpage-pink"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-endpage-pink">{{ errorMessage }}</h3>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.router.navigateByUrl(this.returnUrl);
    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigateByUrl(this.returnUrl);
      },
      error: err => {
        this.errorMessage = err.message || 'Une erreur est survenue lors de la connexion. Veuillez réessayer.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}