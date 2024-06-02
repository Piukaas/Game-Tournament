import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tournaments-overview',
  templateUrl: './tournaments-overview.component.html',
})
export class TournamentsOverviewComponent implements OnInit {
  tournaments: any[] = [];
  loading: boolean = false;
  searchTerm: string = '';
  status: string = '';

  constructor(private http: HttpClient, public userService: UserService) {}

  ngOnInit() {
    this.searchTournaments();
  }

  searchTournaments() {
    this.loading = true;
    this.http
      .get(
        `${environment.apiUrl}/tournaments?title=${this.searchTerm}&status=${this.status}`
      )
      .subscribe(
        (tournaments: any) => {
          this.tournaments = tournaments;
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
