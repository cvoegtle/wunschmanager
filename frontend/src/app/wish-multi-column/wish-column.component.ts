import { Component, EventEmitter, Input, Output } from '@angular/core';
import { adjustPriority2Order, clearHighlight, highlightByIndex, Wish } from "../services/wish";
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
  @Output() orderChange = new EventEmitter<void>();

  constructor() {
  }

  wishChanged(wish: Wish) {
    this.wishChange.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }

  drop(event: CdkDragDrop<Wish[]>) {
    moveItemInArray(this.wishes, event.previousIndex, event.currentIndex);

    adjustPriority2Order(this.wishes);
    highlightByIndex(this.wishes, event.currentIndex);
    window.setTimeout(clearHighlight, 1000, this.wishes);
    this.orderChange.emit();
  }

}
