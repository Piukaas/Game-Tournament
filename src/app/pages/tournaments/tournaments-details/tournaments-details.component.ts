import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tournaments-details',
  templateUrl: './tournaments-details.component.html',
})
export class TournamentsDetailsComponent implements OnInit {
  tournamentId!: string;
  tournament!: any;
  loading: boolean = false;
  confirmDelete: boolean = false;
  selectedWinnerIds: { [gameId: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tournamentId = params['tournamentId'];
      this.fetchTournament();
    });
  }

  fetchTournament() {
    this.loading = true;
    this.http
      .get(`${environment.apiUrl}/tournaments/${this.tournamentId}`)
      .subscribe(
        (tournament: any) => {
          this.tournament = tournament;
          this.loading = false;

          this.tournament.games.forEach((game: any) => {
            this.selectedWinnerIds[game._id] = game.winner?._id || '';
          });
        },
        (error) => {
          this.loading = false;
          throw of(error);
        }
      );
  }

  deleteTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(`${environment.apiUrl}/tournaments/${this.tournamentId}`, {
        headers,
      })
      .subscribe(
        () => {
          this.confirmDelete = false;
          this.router.navigate(['/tournaments']);
        },
        (error) => {
          throw of(error);
        }
      );
  }

  startTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}/start`,
        {},
        {
          headers,
        }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          throw of(error);
        }
      );
  }

  endTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}/end`,
        {},
        {
          headers,
        }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          throw of(error);
        }
      );
  }

  updateWinner(game: any) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const selectedWinnerId = this.selectedWinnerIds[game._id];
    if (selectedWinnerId) {
      const winner = this.tournament.users.find(
        (user: any) => user._id === selectedWinnerId
      );
      game.winner = winner;
    } else {
      game.winner = null;
    }

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}`,
        this.tournament,
        { headers }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          this.fetchTournament();
          throw of(error);
        }
      );
  }

  isAnyGameWinnerSelected(): boolean {
    return this.tournament.games.some(
      (game: any) => this.selectedWinnerIds[game._id]
    );
  }

  getPointsForUser(username: string): number {
    let points = 0;
    this.tournament.games.forEach((game: any) => {
      if (game.winner && game.winner.username === username) {
        points += game.score;
      }
    });
    return points;
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
