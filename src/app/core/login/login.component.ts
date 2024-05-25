import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  username!: string;
  password!: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  onSubmit() {
    if (this.username && this.password) {
      this.http
        .post<{ token: string }>('http://localhost:3000/api/users/login', {
          username: this.username,
          password: this.password,
        })
        .pipe(
          catchError((error) => {
            alert('Login failed');
            return throwError(error);
          })
        )
        .subscribe((response) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('username', this.username);
          this.userService.setUsername(this.username);

          this.router.navigate(['/']);
        });
    } else {
      alert('Please enter both username and password');
    }
  }
}
