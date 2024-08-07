import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'games-edit',
  templateUrl: './games-edit.component.html',
})
export class GamesEditComponent {
  form!: FormGroup;
  error!: string;
  gameId!: string | null;
  artworks: string[] = [];

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

    this.gameId = this.route.snapshot.paramMap.get('gameId');

    this.form = this.fb.group({
      name: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      platform: ['', [Validators.required]],
      rules: this.fb.array([this.createRule()]),
    });

    if (this.gameId) {
      this.http
        .get(`${environment.apiUrl}/games/${this.gameId}`)
        .subscribe((game: any) => {
          // Remove the initial rule
          this.rules.removeAt(0);

          // Create a new form group for each rule in the game data
          game.rules.forEach((rule: any) => {
            this.rules.push(this.fb.group(rule));
          });

          // Patch the form values
          this.form.patchValue(game);
        });
    }
  }

  createRule(): FormGroup {
    return this.fb.group({
      rule: ['', [Validators.required]],
      playerAmount: ['', [Validators.required]],
      type: ['', [Validators.required]],
      time: ['', [Validators.required]],
    });
  }

  get rules(): FormArray {
    return this.form.get('rules') as FormArray;
  }

  addRule() {
    this.rules.push(this.createRule());
  }

  removeRule(index: number) {
    const rules = this.form.get('rules') as FormArray;
    if (rules.length > 1) {
      rules.removeAt(index);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const headers = new HttpHeaders().set(
        'Authorization',
        `Bearer ${this.userService.getToken()}`
      );

      const request = this.gameId
        ? this.http.patch(
            `${environment.apiUrl}/games/${this.gameId}`,
            this.form.value,
            { headers }
          )
        : this.http.post(`${environment.apiUrl}/games/`, this.form.value, {
            headers,
          });

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
            this.router.navigate(['/games', response._id]);
          }
        });
    } else {
      this.error = 'Voer alle velden in';
    }
  }

  searchArtworks(gameName: string): void {
    this.artworks = [];

    this.http
      .post(`${environment.apiUrl}/games/artworks`, { gameName: gameName })
      .subscribe(
        (response: any) => {
          this.artworks = response
            .map((game: any) => [
              ...(game.cover
                ? [game.cover.url.replace('t_thumb', 't_1080p')]
                : []),
              ...(game.artworks
                ? game.artworks.map((artwork: any) =>
                    artwork.url.replace('t_thumb', 't_1080p')
                  )
                : []),
            ])
            .flat();
        },
        (error) => {
          throw of(error);
        }
      );
  }

  handleImageUrl(imageUrl: string): void {
    this.form.controls['imageUrl'].setValue(imageUrl);
  }
}
