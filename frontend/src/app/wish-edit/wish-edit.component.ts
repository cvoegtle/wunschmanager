import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { isAvailable, isReservedByUser, reduceToOneEmptyLink, Wish } from "../services/wish";
import { Change, WishPropertiesComponent } from "../wish-properties/wish-properties.component";
import { MatDialog } from '@angular/material/dialog';
import { isBlue, isGreen, isRed, isYellow } from "../util/color";

@Component({
  selector: 'wish-edit',
  templateUrl: './wish-edit.component.html',
  styleUrls: ['./wish.component.css', '../util/color.css']
})
export class WishEditComponent implements OnInit {
  @Input() wish: Wish;
  @Input() user: string;
  @Input() orderMode: boolean;
  @Output() reserved = new EventEmitter<Wish>();
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishSelection = new EventEmitter<Wish>();

  @ViewChild("settings", {static: true}) settings: HTMLElement;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    reduceToOneEmptyLink(this.wish);
  }

  isAvailable() {
    return isAvailable(this.wish);
  }

  isMyPresent(): boolean {
    return isReservedByUser(this.wish, this.user)
  }

  isManagedList(): boolean {
    return this.user != null;
  }

  isRed() {
    return this.isAvailable() && isRed(this.wish.background);
  }

  isYellow() {
    return this.isAvailable() && isYellow(this.wish.background);
  }

  isGreen() {
    return this.isAvailable() && isGreen(this.wish.background);
  }

  isBlue() {
    return this.isAvailable() && isBlue(this.wish.background);
  }

  isHighlighted() {
    return this.wish.highlighted;
  }

  onWishChange() {
    this.wishChange.emit(this.wish)
  }

  settingsClicked() {
    let settingsDialog = this.dialog.open(WishPropertiesComponent, {
      data: {
        wish: this.wish
      }
    });

    settingsDialog.afterClosed().subscribe(result => {
      if (result == Change.CHANGED) {
        this.wishChange.emit(this.wish);
      }
    });
  }

  reserveClicked() {
    this.reserved.emit(this.wish);
  }

  toggleSelection() {
    this.wish.selected = !this.wish.selected;
    this.wishSelection.emit(this.wish);
  }

  onLinkChanged(index: number, link: string) {
    if (index == null) {
      this.wish.link = link;
    } else {
      this.wish.alternateLinks[index] = link;
    }
    this.wishChange.emit(this.wish);

    // deferred ausführen, da sonst der letzte Link von Angular dupliziert wird
    setTimeout(reduceToOneEmptyLink, 10, this.wish);
  }
}
