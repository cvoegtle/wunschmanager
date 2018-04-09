import { Component, OnInit } from '@angular/core';
import { WishList } from '../services/wish-list';
import { WishListService } from '../services/wish-list.service';
import { ConfigurationService } from '../services/configuration.service';
import { ErrorHandler } from '../error-handler/error-handler.component';

@Component({
  selector: 'all-shared',
  templateUrl: './all-shared.component.html',
  styleUrls: ['./all-shared.component.css']
})
export class AllSharedComponent implements OnInit {
  wishLists: WishList[];

  constructor(private configurationService: ConfigurationService,
              private wishListService: WishListService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
    if (this.configurationService.isInitialised()) {
      this.fetchSharedWishLists();
    } else {
      this.configurationService.load().subscribe(_ => this.fetchSharedWishLists());
    }
  }

  private fetchSharedWishLists() {
    this.wishListService.fetchShared().subscribe(wishLists => this.wishLists = wishLists,
        _ => this.errorHandler.handle('fetchSharedLists'));
  }

  onDeleteList(wishListId: number) {

    this.wishListService.unshare(wishListId).subscribe(deleted => this.handleResponse(deleted, wishListId),
        _ => this.errorHandler.handle('unshareList'));
  }

  public handleResponse(deleted: boolean, wishListId) {
    let index = this.wishLists.findIndex(it => it.id == wishListId);
    if (index >= 0) {
      this.wishLists.splice(index, 1);
    }
  }
}
