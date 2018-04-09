import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Wish } from '../services/wish';
import { WishList } from '../services/wish-list';
import { WishService } from '../services/wish.service';
import { UserService } from '../services/user.service';
import { UserStatus } from '../services/user.status';
import { ErrorHandler } from '../error-handler/error-handler.component';
import { isBlue, isGreen, isRed, isYellow } from "../util/color";

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

  wishes: Wish[];
  private userStatus: UserStatus;

  panelOpenState: boolean;

  constructor(private wishService: WishService, private userService: UserService, private errorHandler: ErrorHandler) {
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
  }

  deleteClicked() {
    this.deleted.emit(this.wishList.id);
  }

  reserveClicked(wish: Wish) {
    this.wishService.reserve(this.wishList.id, wish.id).subscribe(updatedWish => wish.donor = updatedWish.donor,
        _ => this.errorHandler.handle('reserveWish'));
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
