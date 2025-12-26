import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishList } from '../services/wish-list';
import { WishListService } from '../services/wish-list.service';
import { ErrorHandler } from '../error-handler/error-handler.component';
import { WishIds } from "../services/wish-copy-task";

@Component({
    selector: 'all-shared',
    templateUrl: './all-shared.component.html',
    styleUrls: ['./all-shared.component.css'],
    standalone: false
})
export class AllSharedComponent implements OnInit {
  @Input() user: string;
  @Input() sharedWishLists: WishList[];
  @Output() selection = new EventEmitter<WishIds>()

  constructor(private wishListService: WishListService,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
  }

  publishSelection(wishIds: WishIds) {
    this.selection.emit(wishIds);
  }

  onDeleteList(wishListId: number) {

    this.wishListService.unshare(wishListId).subscribe(deleted => this.handleResponse(deleted, wishListId),
        error => this.errorHandler.handle(error, 'unshareList'));
  }

  public handleResponse(deleted: boolean, wishListId) {
    let index = this.sharedWishLists.findIndex(it => it.id == wishListId);
    if (index >= 0) {
      this.sharedWishLists.splice(index, 1);
    }
  }
}
