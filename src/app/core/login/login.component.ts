import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username!: string;
  password!: string;
  form!: FormGroup;
  error!: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private userService: UserService
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

  onLogin() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.http
        .post<{ token: string }>(`${environment.apiUrl}/users/login`, {
          username,
          password,
        })
        .pipe(
          catchError((error) => {
            if (error.status === 403) {
              this.error = 'Het account is nog niet geactiveerd';
            } else {
              this.error = 'Login informatie klopt niet';
            }
            throw of(error);
          })
        )
        .subscribe((response) => {
          if (response !== null) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', username);
            this.userService.setUsername(username);
            this.router.navigate(['/']);
          }
        });
    } else {
      this.error = 'Voer zowel een gebruikersnaam als een wachtwoord in';
    }
  }
}
