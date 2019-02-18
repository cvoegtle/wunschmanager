import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Wish } from "../services/wish";
import { sort, splitIntoColumns } from "../util/wishlist-helper";

@Component({
  selector: 'wish-multi-column',
  templateUrl: './wish-multi-column.component.html',
  styleUrls: ['./wish-multi-column.component.css']
})
export class WishMultiColumnComponent {
  @Input() wishes: Wish[];
  @Input() orderMode: boolean;
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishSelection = new EventEmitter<Wish>();
  @Output() orderChange = new EventEmitter<void>();

  wishLists: Wish[][] = [];

  lastWidth: number = window.innerWidth;

  @HostListener('window:resize', ['$event'])
  onResize() {
    let currentWidth = window.innerWidth;
    if (currentWidth != this.lastWidth) {
      this.render();
    }
    this.lastWidth = currentWidth;
  }

  constructor() {
  }

  public render(wishes?: Wish[], orderMode?: boolean) {
    if (wishes) this.wishes = wishes;
    if (orderMode != null) this.orderMode = orderMode;

    if (this.orderMode) {
      this.wishLists = [];
      this.wishLists.push(this.wishes);
    } else {
      this.wishLists = splitIntoColumns(this.wishes);
    }
  }

  wishChanged(wish: Wish) {
    this.wishChange.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }

  onOrderChange() {
    this.orderChange.emit();
  }
}
