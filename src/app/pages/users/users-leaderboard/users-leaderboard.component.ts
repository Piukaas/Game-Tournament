import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'users-leaderboard',
  templateUrl: './users-leaderboard.component.html',
})
export class UsersLeaderboardComponent {
  users: any[] = [];
  loading: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http.get(`${environment.apiUrl}/users`, {headers}).subscribe(
      (users: any) => {
        users.sort((a: any, b: any) => b.wins - a.wins);
        this.users = users.slice(0, 3);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }
}
