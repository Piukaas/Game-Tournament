import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'users-overview',
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
    if (!this.userService.isAuthenticated() || !this.userService.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.getUsers();
  }

  getUsers() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/users`).subscribe(
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
      .patch(`${environment.apiUrl}/users/${userId}/activate`, {}, { headers })
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
