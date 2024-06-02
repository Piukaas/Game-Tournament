import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'games-details',
  templateUrl: './games-details.component.html',
})
export class GamesDetailsComponent implements OnInit {
  gameId!: string;
  game!: any;
  loading: boolean = false;
  confirmDelete: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.fetchGame();
    });
  }

  fetchGame() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/games/${this.gameId}`).subscribe(
      (game) => {
        this.game = game;
        this.loading = false;
      },
      (error) => {
        console.error(error);
        this.loading = false;
      }
    );
  }

  deleteGame() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(`${environment.apiUrl}/games/${this.gameId}`, { headers })
      .subscribe(
        () => {
          this.confirmDelete = false;
          this.router.navigate(['/games']);
        },
        (error) => {
          throw of(error);
        }
      );
  }
}
