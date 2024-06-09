import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'games-overview',
  templateUrl: './games-overview.component.html',
})
export class GamesOverviewComponent implements OnInit {
  games: any[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  platform: string = '';

  constructor(private http: HttpClient, public userService: UserService) {}

  ngOnInit() {
    this.searchGames();
  }

  searchGames() {
    this.loading = true;
    this.http
      .get(
        `${environment.apiUrl}/games?search=${this.searchTerm}&platform=${this.platform}`
      )
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
