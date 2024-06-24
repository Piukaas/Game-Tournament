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
import { Router } from '@angular/router';
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
  groupedGames: { [platform: string]: any[] } = {};
  platforms: string[] = [];
  loading: boolean = false;
  dragStartIndex!: number;
  totalPlayTime: string = '0 uur en 0 minuten';

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
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
      image: [''],
    });

    this.getActiveUsers();
    this.getAllGames();

    this.games.controls.forEach((gameControl, index) => {
      gameControl.get('game')?.valueChanges.subscribe((gameId) => {
        this.onGameChange(index, gameId);
      });
    });

    this.loadFormDataFromLocalStorage();

    // Subscribe to changes in the games FormArray
    this.games.valueChanges.subscribe(() => {
      setTimeout(() => this.saveFormDataToLocalStorage(), 0);
      setTimeout(() => this.calculateTotalPlayTime(), 0);
    });
  }

  getAllGames(): void {
    this.loading = true;
    this.http.get(`${environment.apiUrl}/games`).subscribe(
      (games: any) => {
        this.allGames = games;
        this.groupedGames = {};
        this.platforms = [];
        this.groupGamesByPlatform();
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        throw of(error);
      }
    );
  }

  groupGamesByPlatform(): void {
    this.allGames.forEach((game) => {
      if (!this.groupedGames[game.platform]) {
        this.groupedGames[game.platform] = [];
        this.platforms.push(game.platform);
      }
      this.groupedGames[game.platform].push(game);
    });
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

  dragStart(event: DragEvent, index: number) {
    this.dragStartIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  dragOver(event: DragEvent, index: number) {
    event.preventDefault();
    this.moveItemInArray(this.games.controls, this.dragStartIndex, index);
    this.dragStartIndex = index;
  }

  dragEnd(event: DragEvent, index: number) {
    const gameElement = this.games.at(this.dragStartIndex);
    this.games.removeAt(this.dragStartIndex);
    this.games.insert(index, gameElement);
  }

  moveItemInArray(array: any[], fromIndex: number, toIndex: number) {
    const element = array[fromIndex];
    array.splice(fromIndex, 1);
    array.splice(toIndex, 0, element);
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

    this.calculateTotalPlayTime();
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
            localStorage.removeItem('tournamentFormData');
            this.router.navigate(['/tournaments', response._id]);
          }
        });
    } else {
      this.error = 'Voer alle velden in';
    }
  }

  saveFormDataToLocalStorage(): void {
    const formData = this.form.value;
    localStorage.setItem('tournamentFormData', JSON.stringify(formData));
  }

  loadFormDataFromLocalStorage(): void {
    const savedFormData = localStorage.getItem('tournamentFormData');
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      // Patch the form without the games and userCheckboxes arrays
      const { games, userCheckboxes, ...rest } = formData;
      this.form.patchValue(rest);

      // Clear and repopulate the games FormArray
      const gamesFormArray = this.games;
      gamesFormArray.clear();
      games.forEach((game: any) => {
        const gameFormGroup = this.createGame();
        gameFormGroup.patchValue(game);
        gamesFormArray.push(gameFormGroup);
      });
    }
  }

  getPlayerAmountFromGameRule(gameRule: string): number {
    if (!gameRule) return 0;
    const match = gameRule.match(/(\d+)\s*speler(s)?/);
    if (match && match[1]) {
      const playerAmount = parseInt(match[1]);
      return isNaN(playerAmount) ? 0 : playerAmount;
    }
    return 0;
  }

  getMinutesFromGameRule(gameRule: string): number {
    if (!gameRule) return 0;
    const match = gameRule.match(/per\s*(\d+)\s*m/);
    if (match && match[1]) {
      const minutes = parseInt(match[1]);
      return isNaN(minutes) ? 0 : minutes;
    }
    return 0;
  }

  calculateTotalPlayTime() {
    let totalMinutes = 0;
    const activeUserCount = this.form
      .get('userCheckboxes')
      ?.value.filter((v: any) => v).length;

    this.games.controls.forEach((gameControl) => {
      const gameRule = gameControl.get('rule')?.value;
      if (gameRule) {
        const playerAmount = this.getPlayerAmountFromGameRule(gameRule);
        const minutesPerGame = this.getMinutesFromGameRule(gameRule);
        const amountOfMatches = Math.max(
          1,
          Math.ceil(activeUserCount / playerAmount)
        );

        totalMinutes += minutesPerGame * amountOfMatches;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.totalPlayTime = `${hours} uur en ${minutes} ${
      minutes === 1 ? 'minuut' : 'minuten'
    }`;
  }
}
