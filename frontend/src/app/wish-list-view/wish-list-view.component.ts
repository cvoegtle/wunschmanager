import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { containsSelectedWish, Wish } from '../services/wish';
import { WishList } from '../services/wish-list';
import { WishService } from '../services/wish.service';
import { UserService } from '../services/user.service';
import { UserStatus } from '../services/user.status';
import { ErrorHandler } from '../error-handler/error-handler.component';
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { extractWishIds, singularOrPluralWish, WishIds } from "../services/wish-copy-task";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: 'wish-list-view',
  templateUrl: './wish-list-view.component.html',
  styleUrls: ['../wish-list-edit/wish-list.component.css', '../util/color.css']
})
export class WishListViewComponent implements OnInit {
  @Input() wishList: WishList;
  @Input() deleteEnabled: boolean = true;
  @Input() restricted: boolean = false;
  @Input() expanded: boolean = false;
  @Output() deleted = new EventEmitter<number>();
  @Output() selection = new EventEmitter<WishIds>();

  wishes: Wish[];
  userStatus: UserStatus;
  wishesSelected: boolean = false;

  panelOpenState: boolean;

  constructor(private wishService: WishService, private userService: UserService, private snackBar: MatSnackBar, private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    this.userService.fetchStatus().subscribe(status => this.userStatus = status);
  }

  panelOpened() {
    this.wishService.fetchWishes(this.wishList.id).subscribe(wishes => {
          this.wishes = wishes;
          this.panelOpenState = this.wishList.background == null;
        },
        _ => this.errorHandler.handle('fetchWishes'))
  }

  panelClosed() {
    this.panelOpenState = false;
    this.wishesSelected = false;
  }

  deleteClicked() {
    this.deleted.emit(this.wishList.id);
  }

  reserveClicked(wish: Wish) {
    this.wishService.reserve(this.wishList.id, wish.id).subscribe(updatedWish => wish.donor = updatedWish.donor,
        _ => this.errorHandler.handle('reserveWish'));
  }

  onWishSelection() {
    this.wishesSelected = containsSelectedWish(this.wishes);
  }

  publishSelection() {
    let wishIds = extractWishIds(this.wishList.id, this.wishes);

    this.snackBar.open(`${singularOrPluralWish(wishIds.wishIds.length)} in der Zwischenablage`, null, {duration: 2000});
    this.selection.emit(wishIds);
  }

  isRed():boolean {
    return isRed(this.wishList.background);
  }

  isGreen(): boolean {
    return isGreen(this.wishList.background);
  }

  isBlue(): boolean {
    return isBlue(this.wishList.background);
  }

  isYellow(): boolean {
    return isYellow(this.wishList.background);
  }

}
