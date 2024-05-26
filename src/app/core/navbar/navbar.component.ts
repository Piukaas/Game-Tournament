import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  username!: string | null;
  private authSub: Subscription | undefined;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.authSub = this.userService.username$.subscribe((username) => {
      this.username = username;
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userService.setUsername(null);
    this.router.navigate(['/']);
  }
}
