import { Component, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnDestroy {
  isLoggedIn: boolean = false;
  private authSub: Subscription | undefined;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.authSub = this.userService.authStatus$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
