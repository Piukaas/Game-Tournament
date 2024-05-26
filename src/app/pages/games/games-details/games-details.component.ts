import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-games-details',
  templateUrl: './games-details.component.html',
})
export class GamesDetailsComponent implements OnInit {
  gameId!: string;
  game!: any;
  loading = false;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.gameId = params['gameId'];
      this.fetchGame();
    });
  }

  fetchGame() {
    this.loading = true;
    this.http.get(`http://localhost:3000/api/games/${this.gameId}`).subscribe(
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
}
