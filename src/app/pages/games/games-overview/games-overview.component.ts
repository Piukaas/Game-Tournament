import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-games-overview',
  templateUrl: './games-overview.component.html',
})
export class GamesOverviewComponent implements OnInit {
  games: any[] = [];
  selectedGame!: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('http://localhost:3000/api/games').subscribe((games: any) => {
      this.games = games;
    });
  }

  setGame(selectedGame: any) {
    this.selectedGame = selectedGame;
  }
}
