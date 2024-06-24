import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnDestroy {
  isLoggedIn: boolean = false;
  private authSub: Subscription | undefined;
  loading: boolean = false;
  tournament: any;
  games: any;

  constructor(private userService: UserService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authSub = this.userService.authStatus$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });

    this.getMostRecentTournament();
    this.getMostRecentGames();
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  getMostRecentTournament() {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/tournaments/recent`).subscribe(
      (response: any) => {
        this.tournament = response;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }

  getMostRecentGames() {
    this.loading = true;
    const numberOfGames = window.innerWidth <= 1000 ? 3 : 6;

    this.http
      .get(`${environment.apiUrl}/games/random/${numberOfGames}`)
      .subscribe(
        (response: any) => {
          this.games = response;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          throw of(error);
        }
      );
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Aankomend':
        return 'badge bg-primary';
      case 'Afgerond':
        return 'badge bg-danger';
      case 'Actief':
        return 'badge bg-success';
      default:
        return 'badge';
    }
  }
}
