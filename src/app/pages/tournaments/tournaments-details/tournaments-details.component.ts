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
  confirmDeleteGame: { [key: string]: boolean } = {};
  selectedWinnerIds: { [gameId: string]: string } = {};
  selectedScores: { [gameId: string]: number } = {};
  tableView: boolean = true;
  currentGameIndex: number = 0;
  editMode: boolean = false;

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

          // Initialize selectedScores for each game
          this.tournament.games.forEach((game: any) => {
            this.selectedWinnerIds[game._id] = game.winner?._id || '';
            this.selectedScores[game._id] = game.score || 1;
          });

          this.editMode = false;
          this.setInitialGame();
        },
        (error) => {
          this.loading = false;
          throw of(error);
        }
      );
  }

  setInitialGame() {
    const lastGameWithWinnerIndex = this.tournament.games
      .map((game: any) => !!game.winner)
      .lastIndexOf(true);

    if (
      lastGameWithWinnerIndex !== -1 &&
      lastGameWithWinnerIndex < this.tournament.games.length - 1
    ) {
      // If there is a game with a winner and it's not the last game, set the next game as the initial game
      this.currentGameIndex = lastGameWithWinnerIndex + 1;
    } else if (lastGameWithWinnerIndex === this.tournament.games.length - 1) {
      // If the last game has a winner, find the first game without a winner
      const firstGameWithoutWinnerIndex = this.tournament.games.findIndex(
        (game: any) => !game.winner
      );
      this.currentGameIndex =
        firstGameWithoutWinnerIndex !== -1 ? firstGameWithoutWinnerIndex : 0;
    } else {
      // If no game has a winner or all games have winners, default to the first game
      this.currentGameIndex = 0;
    }
  }

  nextGame() {
    if (this.currentGameIndex < this.tournament.games.length - 1) {
      this.currentGameIndex++;
    }
  }

  previousGame() {
    if (this.currentGameIndex > 0) {
      this.currentGameIndex--;
    }
  }

  deleteGame(gameId: string) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(
        `${environment.apiUrl}/tournaments/${this.tournament._id}/game/${gameId}`,
        {
          headers,
        }
      )
      .subscribe(
        () => {
          // Remove the game from the local tournament object to update the UI
          const gameIndex = this.tournament.games.findIndex(
            (game: any) => game._id === gameId
          );
          if (gameIndex !== -1) {
            this.tournament.games.splice(gameIndex, 1);
          }
          this.fetchTournament();
        },
        (error) => {
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

  validateScore(gameId: string): void {
    const score = this.selectedScores[gameId];
    if (score < 1 || score > 10) {
      this.selectedScores[gameId] = 1;
    }
  }

  updateScore(game: any) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    game.score = this.selectedScores[game._id];

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
