import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { Wish } from "../services/wish";
import { splitIntoColumns } from "../util/wishlist-helper";

@Component({
  selector: 'wish-view-multi-column',
  templateUrl: './wish-view-multi-column.component.html',
  styleUrls: ['./wish-view-multi-column.component.css']
})
export class WishViewMultiColumnComponent {
  @Input() wishes: Wish[];
  @Input() user: string;
  @Output() wishSelection = new EventEmitter<Wish>();
  @Output() reserved = new EventEmitter<Wish>();

  wishLists: Wish[][];

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.render();
  }

  constructor() {
  }

  public render(wishes?: Wish[]) {
    if (wishes) this.wishes = wishes;
    this.wishLists = splitIntoColumns(this.wishes);
  }

  reserveClicked(wish: Wish) {
    this.reserved.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }
}
