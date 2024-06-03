import { Component } from '@angular/core';

@Component({
  selector: 'random-picker',
  templateUrl: './random-picker.component.html',
})
export class RandomPickerComponent {
  items: any[] = [
    { name: 'Perk 1', type: 'Perk', description: 'This is Perk 1' },
    { name: 'Weakness 1', type: 'Weakness', description: 'This is Weakness 1' },
    { name: 'Perk 2', type: 'Perk', description: 'This is Perk 2' },
    { name: 'Weakness 2', type: 'Weakness', description: 'This is Weakness 2' },
    { name: 'Perk 3', type: 'Perk', description: 'This is Perk 3' },
    { name: 'Weakness 3', type: 'Weakness', description: 'This is Weakness 3' },
    { name: 'Perk 4', type: 'Perk', description: 'This is Perk 4' },
    { name: 'Weakness 4', type: 'Weakness', description: 'This is Weakness 4' },
    { name: 'Perk 5', type: 'Perk', description: 'This is Perk 5' },
    { name: 'Weakness 5', type: 'Weakness', description: 'This is Weakness 5' },
  ];
  displayedItems: any[] = [];
  transform: string = '';
  activeIndex: number = 0;
  finalSelectedIndex: number = -1;
  spinning: boolean = false;

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

    this.spinning = true;
    this.finalSelectedIndex = -1;
    const totalItems = this.displayedItems.length;
    const totalWidth = totalItems * 110; // 100px card width + 10px margin
    const randomPosition = -Math.floor(Math.random() * totalWidth);

    this.transform = `translateX(${randomPosition}px)`;

    setTimeout(() => {
      this.spinning = false;
      this.selectItem(randomPosition);
      alert(`Selected: ${this.items[this.finalSelectedIndex].name}`);
    }, 4000); // 4 seconds for spin duration
  }

  selectItem(position: number) {
    const actualPosition = Math.abs(
      position % (this.displayedItems.length * 110)
    );
    const centerOffset = 150; // Half of the carousel-container width
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
