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
    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/users`).subscribe(
      (users: any) => {
        users.sort((a: any, b: any) => b.wins - a.wins);
        this.users = users;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }
}
