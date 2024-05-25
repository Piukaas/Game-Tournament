import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './core/navbar/navbar.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './core/home/home.component';

@NgModule({
  declarations: [AppComponent, NavbarComponent, HomeComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, RouterModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
