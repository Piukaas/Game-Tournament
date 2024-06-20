import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  username!: string | null;
  private authSub: Subscription | undefined;
  private tokenCheckInterval: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authSub = this.userService.username$.subscribe((username) => {
      this.username = username;
    });
    this.checkTokenExpiration();

    // Ping the API
    this.http.get(`${environment.apiUrl}/users/ping`).subscribe();
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.tokenCheckInterval) {
      clearInterval(this.tokenCheckInterval);
    }
  }

  isAuthenticated() {
    return this.userService.isAuthenticated();
  }

  isAdmin() {
    return this.userService.isAdmin();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('expires_at');
    localStorage.removeItem('role');
    this.userService.setUsername(null);
    this.router.navigate(['/']);
  }

  checkTokenExpiration() {
    const checkExpiration = () => {
      const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '0');
      if (Date.now() > expiresAt) {
        this.logout();
      }
    };

    checkExpiration();
    this.tokenCheckInterval = setInterval(checkExpiration, 60 * 1000);
  }
}
