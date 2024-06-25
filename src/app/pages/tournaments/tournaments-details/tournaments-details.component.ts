import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'tournaments-details',
  templateUrl: './tournaments-details.component.html',
})
export class TournamentsDetailsComponent implements OnInit {
  tournamentId!: string;
  tournament!: any;
  loading: boolean = false;
  confirmDelete: boolean = false;
  confirmDeleteGame: { [key: string]: boolean } = {};
  selectedWinnerIds: { [gameId: string]: string } = {};
  selectedScores: { [gameId: string]: number } = {};
  tableView: boolean = true;
  currentGameIndex: number = 0;
  editMode: boolean = false;
  finishedGames: number = 0;
  initialGameIndex: number = 0;
  gameOrder: string[] = [];
  matchOrder: any[] = [];
  dividedOrder: any[] = [];
  displayMode!: 'items' | 'games';
  playerAmount!: number;
  allGames: any[] = [];
  groupedGames: { [platform: string]: any[] } = {};
  platforms: string[] = [];
  selectedGames: { [gameId: string]: string } = {};
  selectedRules: { [gameId: string]: string } = {};
  ruleDropdownActive: boolean = false;
  rules: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.tournamentId = params['tournamentId'];
      this.fetchTournament();
      this.getAllGames();
    });
  }

  changeEditMode() {
    this.editMode = !this.editMode;
    this.selectedGames = {};
    this.selectedRules = {};
    this.ruleDropdownActive = false;
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

  fetchTournament() {
    this.loading = true;
    this.ruleDropdownActive = false;
    this.http
      .get(`${environment.apiUrl}/tournaments/${this.tournamentId}`)
      .subscribe(
        (tournament: any) => {
          this.tournament = tournament;
          this.loading = false;

          // Initialize selectedScores for each game
          this.tournament.games.forEach((game: any) => {
            this.selectedWinnerIds[game._id] = game.winner?._id || '';
            this.selectedScores[game._id] = game.score || 1;
          });

          this.finishedGames = this.tournament.games.filter(
            (game: any) => game.winner
          ).length;

          if (tournament.status === 'Actief') {
            this.tableView = false;
          }

          this.editMode = false;
          this.setInitialGame();
        },
        (error) => {
          this.loading = false;
          throw of(error);
        }
      );
  }

  prepareAndOpenModal(displayMode: 'items' | 'games', playerAmount: number) {
    this.displayMode = displayMode;
    this.playerAmount = playerAmount;
    document
      .getElementById('randomPickerModal')
      ?.dispatchEvent(new Event('show.bs.modal'));
  }

  determineGameOrder(game: any) {
    this.gameOrder = [];
    this.matchOrder = [];
    this.dividedOrder = [];

    if (this.tournament.status === 'Actief') {
      const gameRule = game.rule;
      const ruleParts = gameRule.split('-');
      const maxPlayersPerGame = parseInt(ruleParts[1].trim().split(' ')[0]);

      if (maxPlayersPerGame === 1) {
        // Sort by points, then randomly for equal points
        this.sortPlayersByPointsAndRandom();
      } else if (
        this.tournament.users.length > 2 &&
        maxPlayersPerGame === 2 &&
        this.getTypeFromGameRule(gameRule) === 'Versus'
      ) {
        // Create a mini-tournament setup
        this.createMiniTournamentSetup();
      } else if (
        this.tournament.users.length > 2 &&
        maxPlayersPerGame === 2 &&
        this.getTypeFromGameRule(gameRule) !== 'Versus'
      ) {
        // Divide players to save time
        this.dividePlayers();
      }
    }
  }

  sortPlayersByPointsAndRandom() {
    const playersWithPoints = this.tournament.users.map((player: any) => ({
      ...player,
      points: this.getPointsForUser(player.username),
    }));

    playersWithPoints.sort((a: any, b: any) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else {
        return Math.random() - 0.5;
      }
    });

    this.gameOrder = playersWithPoints.map((player: any) => player._id);
  }

  createMiniTournamentSetup() {
    const playersWithPoints = this.tournament.users.map((player: any) => ({
      ...player,
      points: this.getPointsForUser(player.username),
    }));

    playersWithPoints.sort((a: any, b: any) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else {
        return Math.random() - 0.5;
      }
    });

    const matchOrder: any[] = [];

    // Iterate through all players
    for (let i = 0; i < playersWithPoints.length; i++) {
      for (let j = i + 1; j < playersWithPoints.length; j++) {
        // For each pair, create a match
        let match: { [key: string]: any } = {};
        match[`player1`] = playersWithPoints[i]._id;
        match[`player2`] = playersWithPoints[j]._id;
        matchOrder.push(match);
      }
    }

    this.matchOrder = matchOrder;
  }

  dividePlayers() {
    const playersWithPoints = this.tournament.users.map((player: any) => ({
      ...player,
      points: this.getPointsForUser(player.username),
    }));

    playersWithPoints.sort((a: any, b: any) => {
      if (a.points > b.points) {
        return -1;
      } else if (a.points < b.points) {
        return 1;
      } else {
        return Math.random() - 0.5;
      }
    });

    const dividedOrder: any[] = [];

    // Divide all players in groups of 2, if odd number of players, last player is alone
    for (let i = 0; i < playersWithPoints.length; i += 2) {
      let match: { [key: string]: any } = { player1: playersWithPoints[i]._id };
      if (playersWithPoints[i + 1]) {
        match[`player2`] = playersWithPoints[i + 1]._id;
      }
      dividedOrder.push(match);
    }

    this.dividedOrder = dividedOrder;
  }

  getPlayerById(id: string) {
    return this.tournament.users.find((player: any) => player._id === id);
  }

  setInitialGame() {
    const lastGameWithWinnerIndex = this.tournament.games
      .map((game: any) => !!game.winner)
      .lastIndexOf(true);

    if (
      lastGameWithWinnerIndex !== -1 &&
      lastGameWithWinnerIndex < this.tournament.games.length - 1
    ) {
      // If there is a game with a winner and it's not the last game, set the next game as the initial game
      this.currentGameIndex = lastGameWithWinnerIndex + 1;
    } else if (lastGameWithWinnerIndex === this.tournament.games.length - 1) {
      // If the last game has a winner, find the first game without a winner
      const firstGameWithoutWinnerIndex = this.tournament.games.findIndex(
        (game: any) => !game.winner
      );
      this.currentGameIndex =
        firstGameWithoutWinnerIndex !== -1 ? firstGameWithoutWinnerIndex : 0;
    } else {
      // If no game has a winner or all games have winners, default to the first game
      this.currentGameIndex = 0;
    }

    this.initialGameIndex = this.currentGameIndex;
    this.determineGameOrder(this.tournament.games[this.currentGameIndex]);
  }

  nextGame() {
    if (this.currentGameIndex < this.tournament.games.length - 1) {
      this.currentGameIndex++;
    }
  }

  previousGame() {
    if (this.currentGameIndex > 0) {
      this.currentGameIndex--;
    }
  }

  deleteGame(gameId: string) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(
        `${environment.apiUrl}/tournaments/${this.tournament._id}/game/${gameId}`,
        {
          headers,
        }
      )
      .subscribe(
        () => {
          // Remove the game from the local tournament object to update the UI
          const gameIndex = this.tournament.games.findIndex(
            (game: any) => game._id === gameId
          );
          if (gameIndex !== -1) {
            this.tournament.games.splice(gameIndex, 1);
          }
          this.fetchTournament();
        },
        (error) => {
          throw of(error);
        }
      );
  }

  deleteTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .delete(`${environment.apiUrl}/tournaments/${this.tournamentId}`, {
        headers,
      })
      .subscribe(
        () => {
          this.confirmDelete = false;
          this.router.navigate(['/tournaments']);
        },
        (error) => {
          throw of(error);
        }
      );
  }

  startTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}/start`,
        {},
        {
          headers,
        }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          throw of(error);
        }
      );
  }

  endTournament() {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}/end`,
        {},
        {
          headers,
        }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          throw of(error);
        }
      );
  }

  updateWinner(game: any) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    const selectedWinnerId = this.selectedWinnerIds[game._id];
    if (selectedWinnerId) {
      const winner = this.tournament.users.find(
        (user: any) => user._id === selectedWinnerId
      );
      game.winner = winner;
    } else {
      game.winner = null;
    }

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}`,
        this.tournament,
        { headers }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          this.fetchTournament();
          throw of(error);
        }
      );
  }

  validateScore(gameId: string): void {
    const score = this.selectedScores[gameId];
    if (score < 1 || score > 10) {
      this.selectedScores[gameId] = 1;
    }
  }

  updateScore(game: any) {
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    game.score = this.selectedScores[game._id];

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}`,
        this.tournament,
        { headers }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          this.fetchTournament();
          throw of(error);
        }
      );
  }

  activateRulesDropdown(gameId: string): void {
    this.ruleDropdownActive = true;
    this.setGameRules(gameId);
  }

  setGameRules(gameId: string) {
    this.rules = this.allGames.find((game) => game._id === gameId).rules;
  }

  updateTournamentGame(game: any): void {
    this.loading = true;
    const token = this.userService.getToken();
    const headers = { Authorization: `Bearer ${token}` };

    game.rule = this.selectedRules[game._id];
    game.game = this.selectedGames[game.game._id];

    this.http
      .patch(
        `${environment.apiUrl}/tournaments/${this.tournament._id}`,
        this.tournament,
        { headers }
      )
      .subscribe(
        () => {
          this.fetchTournament();
        },
        (error) => {
          this.fetchTournament();
          throw of(error);
        }
      );
  }

  isAnyGameWinnerSelected(): boolean {
    return this.tournament.games.some(
      (game: any) => this.selectedWinnerIds[game._id]
    );
  }

  getPointsForUser(username: string): number {
    let points = 0;
    this.tournament.games.forEach((game: any) => {
      if (game.winner && game.winner.username === username) {
        points += game.score;
      }
    });
    return points;
  }

  getBadgeClass(status: string): string {
    switch (status) {
      case 'Aankomend':
        return 'badge bg-primary';
      case 'Afgerond':
        return 'badge bg-danger';
      case 'Actief':
        return 'badge bg-success';
      default:
        return 'badge';
    }
  }

  getTypeFromGameRule(gameRule: string): string {
    if (!gameRule) return '';
    const parts = gameRule.split('/');
    if (parts.length === 0) return '';
    const typePart = parts[0].trim();
    return typePart;
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

  getTotalPlayTime(): string {
    let totalMinutes = 0;
    this.tournament.games.forEach((game: any) => {
      const gameRule = game.rule;
      if (gameRule) {
        const minutesPerGame = this.getMinutesFromGameRule(gameRule);
        const playerAmount = this.getPlayerAmountFromGameRule(gameRule);
        const amountOfMatches = Math.max(
          1,
          Math.ceil(this.tournament.users.length / playerAmount)
        );

        totalMinutes += minutesPerGame * amountOfMatches;
      }
    });

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} uur en ${minutes} ${minutes === 1 ? 'minuut' : 'minuten'}`;
  }
}
