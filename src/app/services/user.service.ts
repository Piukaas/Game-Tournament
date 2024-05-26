import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usernameSubject = new BehaviorSubject<string | null>(
    localStorage.getItem('username')
  );
  username$ = this.usernameSubject.asObservable();

  private authStatusSubject = new BehaviorSubject<boolean>(
    this.isAuthenticated()
  );
  authStatus$ = this.authStatusSubject.asObservable();

  setUsername(username: string | null) {
    this.usernameSubject.next(username);
    this.authStatusSubject.next(this.isAuthenticated());
  }

  isAuthenticated() {
    const token = localStorage.getItem('token');
    return token !== null;
  }

  getToken() {
    return localStorage.getItem('token');
  }
}
