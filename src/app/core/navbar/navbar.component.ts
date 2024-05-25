import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  username!: string | null;
  private authSub: Subscription | undefined;

  constructor(private userService: UserService) {}

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
  }
}
