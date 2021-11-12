import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Wish } from "../services/wish";

@Component({
  selector: 'wish-view-column',
  templateUrl: './wish-view-column.component.html'
})
export class WishViewColumnComponent {
  @Input() wishes: Wish[];
  @Input() user: string;
  @Input() restricted: boolean;

  @Output() wishSelection = new EventEmitter<Wish>();
  @Output() showDonor = new EventEmitter<Wish>();
  @Output() reserved = new EventEmitter<Wish>();
  @Output() suggestGroup = new EventEmitter<Wish>();

  constructor() {
  }

  reserveClicked(wish: Wish) {
    this.reserved.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }

  showDonorClicked(wish: Wish) {
    this.showDonor.emit(wish);
  }

  suggestGroupClicked(wish: Wish) {
    this.suggestGroup.emit(wish);
  }
}
