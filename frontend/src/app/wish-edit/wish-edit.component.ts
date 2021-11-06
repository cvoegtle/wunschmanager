import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { isAvailable, Wish } from "../services/wish";
import { makeValidUrl } from "../util/url-helper";
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
  }

  isAvailable() {
    return isAvailable(this.wish);
  }

  isMyPresent(): boolean {
    return this.wish.donor && (this.wish.donor == this.user || this.wish.proxyDonor == this.user);
  }

  isGroupGift(): boolean {
    return this.wish.groupGift;
  }

  isManagedList(): boolean {
    return this.user != null;
  }

  isRed() {
    return this.isAvailable() && isRed(this.wish.background);
  }

  isYellow() {
    return this.isAvailable() &&  isYellow(this.wish.background);
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

  groupGiftClicked() {
    this.wish.groupGift = !this.wish.groupGift;
    this.wishChange.emit(this.wish);
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

  getPresentTooltip() {
    if (this.isMyPresent()) {
      return 'Geschenk wieder freigeben';
    } else {
      return 'Ich möchte das schenken';
    }
  }

  getGroupGiftTooltip() {
    if (this.isGroupGift()) {
      return 'doch kein Gruppengeschenk';
    } else {
      return 'zum Gruppengeschenk machen';
    }
  }

  targetUrl() {
    return makeValidUrl(this.wish.link);
  }

  toggleSelection() {
    this.wish.selected = !this.wish.selected;
    this.wishSelection.emit(this.wish);
  }
}
