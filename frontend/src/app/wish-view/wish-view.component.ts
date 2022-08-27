import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { isAvailable, isWithAlternatives, Wish } from "../services/wish";
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

  isLoggedIn(): boolean {
    return this.user != null;
  }

  isAvailable(): boolean {
    return isAvailable(this.wish);
  }

  isRed(): boolean {
    return isAvailable(this.wish) && isRed(this.wish.background);
  }

  isYellow(): boolean {
    return isAvailable(this.wish) && isYellow(this.wish.background);
  }

  isGreen(): boolean {
    return isAvailable(this.wish) && isGreen(this.wish.background);
  }

  isBlue(): boolean {
    return isAvailable(this.wish) && isBlue(this.wish.background);
  }

  isGroupGift() {
    return isAvailable(this.wish) && this.wish.groupGift;
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

  targetUrl(): string {
    return makeValidUrl(this.wish.link);
  }

  withAlternatives() {
    return isWithAlternatives(this.wish);
  }
}
