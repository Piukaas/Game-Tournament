import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'tournaments-edit',
  templateUrl: './tournaments-edit.component.html',
})
export class TournamentsEditComponent {
  form!: FormGroup;
  error!: string;
  userCheckboxes: any[] = [];
  allGames: any[] = [];
  loading: boolean = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (!this.userService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      userCheckboxes: this.fb.array([], this.minSelectedCheckboxes(1)),
      users: this.fb.array([]),
      games: this.fb.array([this.createGame()]),
    });

    this.getActiveUsers();
    this.getAllGames();

    this.games.controls.forEach((gameControl, index) => {
      gameControl.get('game')?.valueChanges.subscribe((gameId) => {
        this.onGameChange(index, gameId);
      });
    });
  }

  getAllGames(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/games`).subscribe(
      (games: any) => {
        this.allGames = games;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }

  getActiveUsers(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/users`).subscribe(
      (users: any) => {
        const activeUsers = users.filter((user: any) => user.isActive);
        const userCheckboxesFormArray = this.form.get(
          'userCheckboxes'
        ) as FormArray;
        activeUsers.forEach(() =>
          userCheckboxesFormArray.push(this.fb.control(false))
        );
        this.userCheckboxes = activeUsers;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }

  createGame(): FormGroup {
    return this.fb.group({
      game: ['', [Validators.required]],
      rule: ['', [Validators.required]],
      score: [1, [Validators.required]],
      winner: [null],
    });
  }

  get games(): FormArray {
    return this.form.get('games') as FormArray;
  }

  addGame() {
    this.games.push(this.createGame());
  }

  onGameChange(index: number, gameId: string): void {
    const selectedGame = this.allGames.find((game) => game._id === gameId);
    if (selectedGame) {
      const gameFormGroup = this.games.at(index) as FormGroup;
      gameFormGroup.get('rule')?.setValue('');
    }
  }

  onUserChange(index: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const usersFormArray = this.form.get('users') as FormArray;

    if (checkbox.checked) {
      usersFormArray.push(this.fb.control(this.userCheckboxes[index]._id));
    } else {
      let idx = usersFormArray.controls.findIndex(
        (control) => control.value === this.userCheckboxes[index]._id
      );
      if (idx !== -1) {
        usersFormArray.removeAt(idx);
      }
    }
  }

  validateScore(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value + event.key, 10);

    if (value < 1 || value > 10) {
      event.preventDefault();
    }
  }

  selectedGame(index: number): any {
    const gameId = this.games.at(index).get('game')?.value;
    return this.allGames.find((game) => game._id === gameId);
  }

  removeGame(index: number) {
    const games = this.form.get('games') as FormArray;
    if (games.length > 1) {
      games.removeAt(index);
    }
  }

  minSelectedCheckboxes(min = 1): ValidatorFn {
    const validator: ValidatorFn = (control: AbstractControl<any, any>) => {
      const formArray = control as FormArray;
      const totalSelected = formArray.controls
        .map((control) => control.value)
        .reduce((prev, next) => (next ? prev + next : prev), 0);

      return totalSelected >= min ? null : { required: true };
    };

    return validator;
  }

  onSubmit() {
    if (this.form.valid) {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.userService.getToken()}`
      );

      const request = this.http.post(
        `${environment.apiUrl}/tournaments/`,
        this.form.value,
        {
          headers,
        }
      );

      request
        .pipe(
          catchError((error) => {
            this.error =
              'Er is een fout opgetreden. Probeer het later opnieuw.';
            throw of(error);
          })
        )
        .subscribe((response: any) => {
          if (response._id) {
            this.router.navigate(['/tournaments', response._id]);
          }
        });
    } else {
      this.error = 'Voer alle velden in';
    }
  }
}
