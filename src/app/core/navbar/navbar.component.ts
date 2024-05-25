import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  username!: string | null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.username$.subscribe((username) => {
      this.username = username;
    });
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.userService.setUsername(null);
  }
}
