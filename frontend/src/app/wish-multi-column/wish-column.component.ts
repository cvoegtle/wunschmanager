import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Wish } from "../services/wish";

@Component({
  selector: 'wish-column',
  templateUrl: './wish-column.component.html'
})
export class WishColumnComponent {
  @Input() wishes: Wish[];
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishSelection = new EventEmitter<Wish>();
  @Output() orderChanged = new EventEmitter<void>();

  constructor() {
  }

  wishChanged(wish: Wish) {
    this.wishChange.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }

  onOrderChange() {
    this.orderChanged.emit();
  }
}
