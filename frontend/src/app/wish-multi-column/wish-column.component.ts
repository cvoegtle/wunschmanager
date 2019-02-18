import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Wish } from "../services/wish";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: 'wish-column',
  templateUrl: './wish-column.component.html'
})
export class WishColumnComponent {
  @Input() wishes: Wish[];
  @Input() orderMode: boolean;
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishSelection = new EventEmitter<Wish>();

  constructor() {
  }

  wishChanged(wish: Wish) {
    this.wishChange.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.wishes, event.previousIndex, event.currentIndex);
  }
}
