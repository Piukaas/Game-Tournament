import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'app-users-overview',
  templateUrl: './users-overview.component.html',
})
export class UsersOverviewComponent {
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
    this.http.get('http://localhost:3000/api/users').subscribe(
      (users: any) => {
        this.users = users;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }

  activateUser(userId: string) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .patch(
        `http://localhost:3000/api/users/${userId}/activate`,
        {},
        { headers }
      )
      .subscribe(
        () => {
          this.getUsers();
        },
        (error) => {
          throw of(error);
        }
      );
  }
}
