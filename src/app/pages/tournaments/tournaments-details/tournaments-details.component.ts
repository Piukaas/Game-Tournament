import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'tournaments-details',
  templateUrl: './tournaments-details.component.html',
})
export class TournamentsDetailsComponent implements OnInit {
  tournamentId!: string;
  tournament!: any;
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
      this.tournamentId = params['tournamentId'];
      this.fetchTournament();
    });
  }

  fetchTournament() {
    this.loading = true;
    this.http
      .get(`http://localhost:3000/api/tournaments/${this.tournamentId}`)
      .subscribe(
        (tournament) => {
          this.tournament = tournament;
          this.loading = false;
        },
        (error) => {
          console.error(error);
          this.loading = false;
        }
      );
  }

  deleteTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(`http://localhost:3000/api/tournaments/${this.tournamentId}`, {
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
        `http://localhost:3000/api/tournaments/${this.tournament._id}/start`,
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
        `http://localhost:3000/api/tournaments/${this.tournament._id}/end`,
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

    const winner = this.tournament.users.find(
      (user: any) => user.username === game.winner.username
    );
    game.winner = winner;

    this.http
      .patch(
        `http://localhost:3000/api/tournaments/${this.tournament._id}`,
        this.tournament,
        { headers }
      )
      .subscribe(
        () => {},
        (error) => {
          this.fetchTournament();
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
