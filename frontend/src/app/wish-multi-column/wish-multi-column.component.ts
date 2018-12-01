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
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishSelection = new EventEmitter<Wish>();

  wishLists: Wish[][];

  @ViewChild("content")
  contentPanel: HTMLDivElement;

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

  wishChanged(wish: Wish) {
    this.wishChange.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }

  onOrderChanged() {
    sort(this.wishes);
    this.render();
  }
}