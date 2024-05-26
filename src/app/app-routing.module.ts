import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { RegisterComponent } from './core/register/register.component';
import { GamesCreateComponent } from './pages/games/games-create/games-create.component';
import { GamesDetailsComponent } from './pages/games/games-details/games-details.component';
import { GamesOverviewComponent } from './pages/games/games-overview/games-overview.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'games', component: GamesOverviewComponent },
  { path: 'games/create', component: GamesCreateComponent },
  { path: 'games/:gameId', component: GamesDetailsComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
