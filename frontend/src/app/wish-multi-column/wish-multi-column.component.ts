import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { sliceColumn, Wish } from "../services/wish";

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

    let columnCount = this.calculateNumberOfColumns();
    this.wishLists = [];
    for (let column = 0; column < columnCount; column++) {
      this.wishLists.push(sliceColumn(this.wishes, columnCount, column));
    }
  }

  private calculateNumberOfColumns(): number {
    let columns = Math.trunc(window.innerWidth / 500);
    return Math.max(columns, 1);

  }

  wishChanged(wish: Wish) {
    this.wishChange.emit(wish);
  }

  onWishSelection(wish: Wish) {
    this.wishSelection.emit(wish);
  }
}
