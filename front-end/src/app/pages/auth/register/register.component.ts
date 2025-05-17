import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="theme-neutre flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div class="w-full max-w-md space-y-8">
        <div>
          <h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Créez votre compte
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Ou
            <a routerLink="/auth/login" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              connectez-vous à votre compte existant
            </a>
          </p>
        </div>

        <form class="mt-8 space-y-6" [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="space-y-4">
            <div>
              <label for="name" class="sr-only">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                formControlName="name"
                autocomplete="name"
                required
                class="input relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Full name"
                [ngClass]="{
                  'border-red-500 dark:border-red-400': 
                    registerForm.get('name')?.invalid && 
                    (registerForm.get('name')?.dirty || registerForm.get('name')?.touched)
                }"
              />
              <div 
                *ngIf="registerForm.get('name')?.invalid && 
                      (registerForm.get('name')?.dirty || registerForm.get('name')?.touched)"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                <div *ngIf="registerForm.get('name')?.errors?.['required']">Full name is required</div>
              </div>
            </div>
            
            <div>
              <label for="email-address" class="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                formControlName="email"
                autocomplete="email"
                required
                class="input relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Email address"
                [ngClass]="{
                  'border-red-500 dark:border-red-400': 
                    registerForm.get('email')?.invalid && 
                    (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)
                }"
              />
              <div 
                *ngIf="registerForm.get('email')?.invalid && 
                      (registerForm.get('email')?.dirty || registerForm.get('email')?.touched)"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                <div *ngIf="registerForm.get('email')?.errors?.['required']">Email is required</div>
                <div *ngIf="registerForm.get('email')?.errors?.['email']">Must be a valid email address</div>
              </div>
            </div>
            
            <div>
              <label for="password" class="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                formControlName="password"
                autocomplete="new-password"
                required
                class="input relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Password"
                [ngClass]="{
                  'border-red-500 dark:border-red-400': 
                    registerForm.get('password')?.invalid && 
                    (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)
                }"
              />
              <div 
                *ngIf="registerForm.get('password')?.invalid && 
                      (registerForm.get('password')?.dirty || registerForm.get('password')?.touched)"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                <div *ngIf="registerForm.get('password')?.errors?.['required']">Password is required</div>
                <div *ngIf="registerForm.get('password')?.errors?.['minlength']">
                  Password must be at least 6 characters
                </div>
              </div>
            </div>
            
            <div>
              <label for="confirmPassword" class="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                formControlName="confirmPassword"
                autocomplete="new-password"
                required
                class="input relative block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-primary-500 focus:outline-none focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 sm:text-sm"
                placeholder="Confirm Password"
                [ngClass]="{
                  'border-red-500 dark:border-red-400': 
                    registerForm.get('confirmPassword')?.invalid && 
                    (registerForm.get('confirmPassword')?.dirty || registerForm.get('confirmPassword')?.touched) ||
                    registerForm.errors?.['passwordsNotMatching']
                }"
              />
              <div 
                *ngIf="(registerForm.get('confirmPassword')?.invalid && 
                      (registerForm.get('confirmPassword')?.dirty || registerForm.get('confirmPassword')?.touched)) ||
                      registerForm.errors?.['passwordsNotMatching']"
                class="mt-1 text-sm text-red-600 dark:text-red-400"
              >
                <div *ngIf="registerForm.get('confirmPassword')?.errors?.['required']">
                  Confirm password is required
                </div>
                <div *ngIf="registerForm.errors?.['passwordsNotMatching']">
                  Passwords must match
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              formControlName="terms"
              class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              [ngClass]="{
                'border-red-500 dark:border-red-400': 
                  registerForm.get('terms')?.invalid && 
                  (registerForm.get('terms')?.dirty || registerForm.get('terms')?.touched)
              }"
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              I agree to the 
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                terms of service
              </a> 
              and 
              <a href="#" class="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                privacy policy
              </a>
            </label>
          </div>
          <div 
            *ngIf="registerForm.get('terms')?.invalid && 
                  (registerForm.get('terms')?.dirty || registerForm.get('terms')?.touched)"
            class="mt-1 text-sm text-red-600 dark:text-red-400"
          >
            <div *ngIf="registerForm.get('terms')?.errors?.['required']">
              You must agree to the terms
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="registerForm.invalid || isLoading"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 dark:bg-primary-700 dark:hover:bg-primary-600"
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
              Create account
            </button>
          </div>

          <div *ngIf="errorMessage" class="rounded-md bg-red-50 p-4 dark:bg-red-900/20">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
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
                <h3 class="text-sm font-medium text-red-800 dark:text-red-200">{{ errorMessage }}</h3>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { 'passwordsNotMatching': true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: err => {
        this.errorMessage = err.message || 'An error occurred during registration. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}