import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { isAvailable, Wish } from "../services/wish";
import { makeValidUrl } from "../util/url-helper";
import { Change, WishPropertiesComponent } from "../wish-properties/wish-properties.component";
import { MatDialog } from '@angular/material';
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { WishEditPopupComponent } from "./wish-edit-popup.component";

@Component({
  selector: 'wish-edit',
  templateUrl: './wish-edit.component.html',
  styleUrls: ['./wish.component.css', '../util/color.css']
})
export class WishEditComponent implements OnInit {
  @Input() wish: Wish;
  @Input() usePopup: boolean;
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishSelection = new EventEmitter<Wish>();
  @Output() orderChanged = new EventEmitter<void>();

  @ViewChild("settings") settings: HTMLElement;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  isAvailable() {
    return isAvailable(this.wish);
  }

  isRed() {
    return isAvailable(this.wish) && isRed(this.wish.background);
  }

  isYellow() {
    return isAvailable(this.wish) && isYellow(this.wish.background);
  }

  isGreen() {
    return isAvailable(this.wish) && isGreen(this.wish.background);
  }

  isBlue() {
    return isAvailable(this.wish) && isBlue(this.wish.background);
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
      if (result != Change.UNCHANGED) {
        this.wishChange.emit(this.wish);
      }
      if (result == Change.ORDERCHANGE) {
        this.orderChanged.emit();
      }
    });
  }

  onFocus(item: string) {
    window.console.log(`focus ${item}`)
//    if (this.usePopup) {
//      this.openEditPopup(item);
//    }
  }


  private openEditPopup(item: string) {
    this.settings.focus();
    let editPopup = this.dialog.open(WishEditPopupComponent, {
      width: "95%",
      maxWidth: "100%",
      data: {
        wish: this.wish,
        item: item
      }
    });

    editPopup.afterClosed().subscribe(result => {
          if (result) {
            this.wishChange.emit(this.wish)
          }
        }
    )
  }

  targetUrl() {
    return makeValidUrl(this.wish.link);
  }

  toggleSelection() {
    this.wish.selected = !this.wish.selected;
    this.wishSelection.emit(this.wish);
  }

  onBlur(item: string) {
    window.console.log(`blur ${item}`)
  }
}
