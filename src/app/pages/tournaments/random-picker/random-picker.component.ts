import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'random-picker',
  templateUrl: './random-picker.component.html',
})
export class RandomPickerComponent {
  @Input() displayMode!: 'items' | 'games';
  @Input() playerAmount!: number;

  items: any = [
    {
      name: '5 seconden sneller',
      description: 'Haal 5 seconden van je eindtijd af',
      type: 'Perk',
    },
    {
      name: 'Rap alles',
      description: 'Moet alles wat je zegt rappen gedurende een ronde',
      type: 'Weakness',
    },
    {
      name: 'Extra poging',
      description: 'Krijg een extra poging',
      type: 'Perk',
    },
    {
      name: 'Rondje draaien',
      description:
        'Moet een rondje draaien wanneer de tegenstanders het zeggen',
      type: 'Weakness',
    },
    {
      name: 'Extra klap',
      description: 'Mag een andere deelnemer een klap geven tijdens het spelen',
      type: 'Perk',
    },
    {
      name: 'Stilte bestraffing',
      description:
        'Krijg 10 seconden straftijd voor elke keer dat je praat gedurende een ronde',
      type: 'Weakness',
    },
  ];
  games2Players: any = [
    { title: 'Mortal Kombat X', platform: 'Xbox Series X' },
    { title: 'Human Fall Flat', platform: 'Xbox Series X' },
    { title: 'Star Wars Battlefront', platform: 'Xbox Series X' },
    { title: 'Mortal Kombat 11', platform: 'Xbox Series X' },
    { title: 'Star Wars Battlefront 2', platform: 'Xbox Series X' },
    { title: 'Rocket League', platform: 'Xbox Series X' },
    { title: 'Rayman Legends', platform: 'Xbox Series X' },
  ];
  games4Players: any = [
    { title: 'Gang Beasts', platform: 'Xbox Series X' },
    { title: 'Goat Simulator', platform: 'Xbox Series X' },
    { title: 'Guns, Gore & Cannoli', platform: 'Xbox Series X' },
    { title: 'Party Animals', platform: 'Xbox Series X' },
    { title: 'Runbow', platform: 'Xbox Series X' },
    { title: 'Goat Simulator 3', platform: 'Xbox Series X' },
    { title: 'Speedrunners', platform: 'Xbox Series X' },
    { title: 'Tricky Towers', platform: 'Xbox Series X' },
    { title: 'Ultimate Chicken Horse', platform: 'Xbox Series X' },
  ];
  displayedItems: any[] = [];
  transform: string = '';
  activeIndex: number = 0;
  finalSelectedIndex: number = -1;
  spinning: boolean = false;
  finalSelected: any = null;

  constructor() {
    this.populateDisplayedItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if displayMode or playerAmount has changed
    if (changes['displayMode'] || changes['playerAmount']) {
      this.displayedItems = [];
      this.populateDisplayedItems();
      this.finalSelected = null;
    }
  }

  populateDisplayedItems() {
    this.displayedItems = [];
    let sourceArray = [];
    if (this.displayMode === 'items') {
      sourceArray = this.items;
    } else {
      sourceArray =
        this.playerAmount === 2 ? this.games2Players : this.games4Players;
    }
    for (let i = 0; i < 10; i++) {
      this.displayedItems = this.displayedItems.concat(sourceArray);
    }
  }

  spin() {
    if (this.spinning) return;

    this.finalSelected = null;
    this.spinning = true;
    this.finalSelectedIndex = -1;
    const totalItems = this.displayedItems.length;
    const totalWidth = totalItems * 160; // 100px card width + 10px margin
    const randomPosition = -Math.floor(Math.random() * totalWidth);

    this.transform = `translateX(${randomPosition}px)`;

    setTimeout(() => {
      this.spinning = false;
      this.selectItem(randomPosition);
      if (this.displayMode === 'items') {
        this.finalSelected = this.items[this.finalSelectedIndex];
      } else {
        const gamesArray =
          this.playerAmount === 2 ? this.games2Players : this.games4Players;
        this.finalSelected = gamesArray[this.finalSelectedIndex];
      }
    }, 4000); // 4 seconds for spin duration
  }

  selectItem(position: number) {
    const actualPosition = Math.abs(
      position % (this.displayedItems.length * 160)
    );
    const centerOffset = 250; // Half of the carousel-container width
    const sourceArrayLength =
      this.displayMode === 'items'
        ? this.items.length
        : this.playerAmount === 2
        ? this.games2Players.length
        : this.games4Players.length;
    this.finalSelectedIndex =
      Math.floor((actualPosition + centerOffset) / 160) % sourceArrayLength;
  }

  isFinalSelected(index: number): boolean {
    const arrayLength =
      this.displayMode === 'items'
        ? this.items.length
        : this.playerAmount === 2
        ? this.games2Players.length
        : this.games4Players.length;
    return index % arrayLength === this.finalSelectedIndex;
  }

  getItemColor(item: string): string {
    if (this.displayMode === 'games') return 'blue';
    return item.startsWith('Perk') ? 'green' : 'red';
  }
}
