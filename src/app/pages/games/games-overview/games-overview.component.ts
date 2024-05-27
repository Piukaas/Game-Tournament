import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';

@Component({
  selector: 'games-overview',
  templateUrl: './games-overview.component.html',
})
export class GamesOverviewComponent implements OnInit {
  games: any[] = [];
  loading: boolean = false;
  searchTerm: string = '';

  constructor(private http: HttpClient, public userService: UserService) {}

  ngOnInit() {
    this.searchGames();
  }

  searchGames() {
    this.loading = true;
    this.http
      .get(`http://localhost:3000/api/games?search=${this.searchTerm}`)
      .subscribe(
        (games: any) => {
          this.games = games;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          throw of(error);
        }
      );
  }
}
