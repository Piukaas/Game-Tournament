import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'artworks-modal',
  templateUrl: './artworks-modal.component.html',
})
export class ArtworksModalComponent {
  @Input() artworks!: string[];
  @Input() gameName!: string;
  @Output() imageUrl = new EventEmitter<string>();

  constructor() {}

  selectImage(imageUrl: string): void {
    this.imageUrl.emit(imageUrl);
  }
}
