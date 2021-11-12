import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isAvailable, Wish } from "../services/wish";
import { makeValidUrl } from "../util/url-helper";
import { isBlue, isGreen, isRed, isYellow } from "../util/color";

@Component({
  selector: 'wish-view',
  templateUrl: './wish-view.component.html',
  styleUrls: ['../wish-edit/wish.component.css', '../util/color.css']
})
export class WishViewComponent implements OnInit {
  @Input() wish: Wish;
  @Input() user: string;
  @Input() restricted: boolean;
  @Output() showDonor = new EventEmitter<Wish>();
  @Output() reserved = new EventEmitter<Wish>();
  @Output() wishSelected = new EventEmitter<Wish>();
  @Output() suggestGroup = new EventEmitter<Wish>();

  constructor() {
  }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.user;
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


  isMyPresent(): boolean {
    let donations = this.wish.donations;
    for (let index in donations) {
      if (donations[index].donor && donations[index].donor == this.user) {
        return true;
      }
    }
    return false;
  }

  reserveClicked() {
    this.reserved.emit(this.wish);
  }

  suggestGroupClicked() {
    this.suggestGroup.emit(this.wish);
  }

  handleDonorClick() {
    this.showDonor.emit(this.wish);
  }

  toggleSelection() {
    this.wish.selected = !this.wish.selected;
    this.wishSelected.emit(this.wish);
  }

  targetUrl() {
    return makeValidUrl(this.wish.link);
  }

}
