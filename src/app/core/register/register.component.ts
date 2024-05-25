import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  username!: string;
  password!: string;

  constructor(private http: HttpClient) {}

  onRegister() {
    if (this.username && this.password) {
      this.http
        .post('http://localhost:3000/api/users/register', {
          username: this.username,
          password: this.password,
        })
        .pipe(
          catchError((error) => {
            alert('Registration failed');
            return throwError(error);
          })
        )
        .subscribe((response) => {
          // Handle successful registration here
          console.log(response);
        });
    } else {
      alert('Please enter both username and password');
    }
  }
}
