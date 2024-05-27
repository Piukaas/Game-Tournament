import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username!: string;
  password!: string;
  form!: FormGroup;
  error!: string;
  submitted: boolean = false;
  submittedUser!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.http
        .post('http://localhost:3000/api/users/register', {
          username,
          password,
        })
        .pipe(
          catchError((error) => {
            if (error.status === 400) {
              this.error = 'Gebruikersnaam bestaat al';
            } else {
              this.error =
                'Er is een fout opgetreden. Probeer het later opnieuw.';
            }
            throw of(error);
          })
        )
        .subscribe((response) => {
          if (response !== null) {
            this.submitted = true;
            this.submittedUser = username;
          }
        });
    } else {
      this.error = 'Voer zowel een gebruikersnaam als een wachtwoord in';
    }
  }
}
