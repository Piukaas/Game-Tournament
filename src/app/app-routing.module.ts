import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { GamesDetailsComponent } from './pages/games/games-details/games-details.component';
import { GamesEditComponent } from './pages/games/games-edit/games-edit.component';
import { GamesOverviewComponent } from './pages/games/games-overview/games-overview.component';
import { TournamentsDetailsComponent } from './pages/tournaments/tournaments-details/tournaments-details.component';
import { TournamentsOverviewComponent } from './pages/tournaments/tournaments-overview/tournaments-overview.component';
import { UsersOverviewComponent } from './pages/users/users-overview/users-overview.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // Users
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UsersOverviewComponent },

  // Games
  { path: 'games', component: GamesOverviewComponent },
  { path: 'games/create', component: GamesEditComponent },
  { path: 'games/edit/:gameId', component: GamesEditComponent },
  { path: 'games/:gameId', component: GamesDetailsComponent },

  // Tournaments
  { path: 'tournaments', component: TournamentsOverviewComponent },
  { path: 'tournaments/:tournamentId', component: TournamentsDetailsComponent },

  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
