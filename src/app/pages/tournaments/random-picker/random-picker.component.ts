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
      name: '10 seconden sneller',
      description: 'Haal 10 seconden van je eindtijd af',
      type: 'Perk',
    },
    {
      name: 'Rap alles',
      description: 'Moet alles wat je zegt rappen gedurende een ronde',
      type: 'Weakness',
    },
    {
      name: 'Extra beurt',
      description: 'Krijg een extra kans om een actie uit te voeren',
      type: 'Perk',
    },
    {
      name: 'Draai en zeg',
      description:
        'Moet een draai maken en iets anders zeggen wanneer de tegenstander het zegt',
      type: 'Weakness',
    },
    {
      name: 'Onverwachte hulp',
      description: 'Krijg hulp van een andere deelnemer tijdens het spel',
      type: 'Perk',
    },
    {
      name: 'Blindelings spelen',
      description: 'Speel een ronde zonder het spel te kunnen zien',
      type: 'Weakness',
    },
    {
      name: 'Extra klap',
      description: 'Mag een andere deelnemer een klap geven tijdens het spelen',
      type: 'Perk',
    },
    {
      name: 'Handen op je rug',
      description: 'Speel een ronde met je handen op je rug',
      type: 'Weakness',
    },
    {
      name: 'Sneller denken',
      description: 'Krijg 30 seconden extra bedenktijd voor elke beslissing',
      type: 'Perk',
    },
    {
      name: 'Stilte bestraffing',
      description: 'Krijg een minuut straftijd voor elke keer dat je praat',
      type: 'Weakness',
    },
  ];
  games2Players: any = [
    { title: 'Game 1', platform: 'PC' },
    { title: 'Game 2', platform: 'Xbox' },
    { title: 'Game 3', platform: 'Playstation' },
    { title: 'Game 4', platform: 'PC' },
    { title: 'Game 5', platform: 'Xbox' },
    { title: 'Game 6', platform: 'Playstation' },
    // Add more games as needed
  ];
  games4Players: any = [
    { title: 'Ling 1', platform: 'PC' },
    { title: 'Ling 2', platform: 'Xbox' },
    { title: 'Ling 3', platform: 'Playstation' },
    { title: 'Ling 4', platform: 'PC' },
    { title: 'Ling 5', platform: 'Xbox' },
    { title: 'Ling 6', platform: 'Playstation' },
    { title: 'Ling 7', platform: 'PC' },
    { title: 'Ling 8', platform: 'Xbox' },
    { title: 'Ling 9', platform: 'Playstation' },
    // Add more games as needed
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
    const totalWidth = totalItems * 110; // 100px card width + 10px margin
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
      position % (this.displayedItems.length * 110)
    );
    const centerOffset = 250; // Half of the carousel-container width
    const sourceArrayLength =
      this.displayMode === 'items'
        ? this.items.length
        : this.playerAmount === 2
        ? this.games2Players.length
        : this.games4Players.length;
    this.finalSelectedIndex =
      Math.floor((actualPosition + centerOffset) / 110) % sourceArrayLength;
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
