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
  selectedGame!: any;
  loading: boolean = false;
  searchTerm: string = '';

  constructor(private http: HttpClient, public userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.searchGames();
  }

  searchGames() {
    this.http
      .get(`http://localhost:3000/api/games?search=${this.searchTerm}`)
      .subscribe(
        (games: any) => {
          this.games = games;
          this.loading = false;
        },
        (error) => {
          throw of(error);
          this.loading = false;
        }
      );
  }

  setGame(selectedGame: any) {
    this.selectedGame = selectedGame;
  }
}
