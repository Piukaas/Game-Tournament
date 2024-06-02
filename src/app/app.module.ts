import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './core/home/home.component';
import { LoginComponent } from './core/login/login.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RegisterComponent } from './core/register/register.component';
import { SpinnerComponent } from './core/spinner/spinner.component';
import { GamesDetailsComponent } from './pages/games/games-details/games-details.component';
import { GamesEditComponent } from './pages/games/games-edit/games-edit.component';
import { GamesOverviewComponent } from './pages/games/games-overview/games-overview.component';
import { TournamentsOverviewComponent } from './pages/tournaments/tournaments-overview/tournaments-overview.component';
import { TournamentsDetailsComponent } from './pages/tournaments/tournaments-details/tournaments-details.component';
import { UsersOverviewComponent } from './pages/users/users-overview/users-overview.component';
import { TournamentsEditComponent } from './pages/tournaments/tournaments-edit/tournaments-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    GamesOverviewComponent,
    GamesDetailsComponent,
    SpinnerComponent,
    GamesEditComponent,
    TournamentsOverviewComponent,
    TournamentsDetailsComponent,
    UsersOverviewComponent,
    TournamentsEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
