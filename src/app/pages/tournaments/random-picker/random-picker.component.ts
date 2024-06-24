import { Component } from '@angular/core';

@Component({
  selector: 'random-picker',
  templateUrl: './random-picker.component.html',
})
export class RandomPickerComponent {
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

  displayedItems: any[] = [];
  transform: string = '';
  activeIndex: number = 0;
  finalSelectedIndex: number = -1;
  spinning: boolean = false;
  finalSelected: any = null;

  constructor() {
    this.populateDisplayedItems();
  }

  populateDisplayedItems() {
    // Loop over items to create a larger list for spinning
    for (let i = 0; i < 10; i++) {
      this.displayedItems = this.displayedItems.concat(this.items);
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
      this.finalSelected = this.items[this.finalSelectedIndex];
    }, 4000); // 4 seconds for spin duration
  }

  selectItem(position: number) {
    const actualPosition = Math.abs(
      position % (this.displayedItems.length * 110)
    );
    const centerOffset = 250; // Half of the carousel-container width
    this.finalSelectedIndex =
      Math.floor((actualPosition + centerOffset) / 110) % this.items.length;
  }

  isFinalSelected(index: number): boolean {
    return index % this.items.length === this.finalSelectedIndex;
  }

  getItemColor(item: string): string {
    return item.startsWith('Perk') ? 'green' : 'red';
  }
}
