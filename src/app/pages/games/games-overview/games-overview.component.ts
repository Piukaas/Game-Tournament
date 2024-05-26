import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-games-overview',
  templateUrl: './games-overview.component.html',
})
export class GamesOverviewComponent implements OnInit {
  games: any[] = [];
  selectedGame!: any;
  loading: boolean = false;

  constructor(private http: HttpClient, public userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.http.get('http://localhost:3000/api/games').subscribe(
      (games: any) => {
        this.games = games;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  setGame(selectedGame: any) {
    this.selectedGame = selectedGame;
  }
}
