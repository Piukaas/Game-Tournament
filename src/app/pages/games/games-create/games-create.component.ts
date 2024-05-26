import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-games-create',
  templateUrl: './games-create.component.html',
})
export class GamesCreateComponent {
  form!: FormGroup;
  error!: string;

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
      name: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      genre: ['', [Validators.required]],
      platform: ['', [Validators.required]],
      rules: this.fb.array([this.createRule()]),
    });
  }

  createRule(): FormGroup {
    return this.fb.group({
      rule: ['', [Validators.required]],
      playerAmount: ['', [Validators.required]],
      score: ['', [Validators.required]],
      type: ['', [Validators.required]],
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

      this.http
        .post('http://localhost:3000/api/games/', this.form.value, { headers })
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
}
