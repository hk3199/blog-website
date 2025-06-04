import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-auth-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    RouterModule
  ],
  templateUrl: './auth-signup.component.html',
})
export class AuthSignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      username: [''],   
      email: [''],
      password: [''],
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.http.post('http://localhost:5000/api/users/signup', this.signupForm.value)
        .subscribe({
          next: (res) => {
            console.log('Signup successful', res);
            this.router.navigate(['/login']);
          },
          error: (err) => {
            console.error('Signup error', err);
          }
        });
    }
  }
}
