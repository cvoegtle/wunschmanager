import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishList } from '../services/wish-list';
import { Wish } from "../services/wish";
import { WishService } from "../services/wish.service";
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShareDialogComponent } from "../share-dialog/share-dialog.component";
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';
import { EditEventDialogComponent } from '../edit-event-dialog/edit-event-dialog.component';
import { ErrorHandler } from "../error-handler/error-handler.component";
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { WishListDuplicateDialogComponent } from "../wish-list-duplicate-dialog/wish-list-duplicate-dialog.component";
import { WishIds } from "../services/wish-copy-task";


@Component({
  selector: 'wish-list-edit',
  templateUrl: './wish-list-edit.component.html',
  styleUrls: ['./wish-list.component.css', '../util/color.css']
})
export class WishListEditComponent implements OnInit {
  @Input() wishList: WishList;
  @Input() wishIds: WishIds;
  @Output() deleted = new EventEmitter<number>();
  @Output() updated = new EventEmitter<WishList>();
  @Output() duplicate = new EventEmitter<WishList>();
  @Output() selection = new EventEmitter<WishIds>();

  wishes: Wish[];
  panelOpenState: boolean;
  wishesSelected: boolean = false;

  constructor(private wishService: WishService, private dialog: MatDialog, private snackBar: MatSnackBar, private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
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

  addWish() {
    this.wishService.add(this.wishList.id).subscribe(wish => this.wishes.push(wish),
        _ => this.errorHandler.handle('addWish'))
  }

  wishChanged(wish: Wish) {
    this.wishService.update(this.wishList.id, wish).subscribe(result => {
          if (!result) {
            alert('Update fehlgeschlagen')
          }
        }, _ => this.errorHandler.handle('updateWish')
    )
  }

  editEvent() {
    let editDialog = this.dialog.open(EditEventDialogComponent, {
      data: {
        wishList: this.wishList
      }
    });

    editDialog.afterClosed().subscribe(result => {
      if (result) {
        this.updated.emit(this.wishList)
      }
    })
  }

  deleteWish(wish: Wish) {
    let deleteDialog = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        item: this.getWishText(wish),
        id: wish.id
      }
    });

    deleteDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet) {
        this.doDeleteWish(dialogRet);
      }
    });
  }

  private doDeleteWish(wishId) {
    this.wishService.delete(this.wishList.id, wishId).subscribe(result => {
      if (result) this.removeFromList(wishId)
    }, _ => this.errorHandler.handle('deleteWish'))
  }

  removeFromList(id: number) {
    for (let index = 0; index < this.wishes.length; index++) {
      if (this.wishes[index].id == id) {
        this.wishes.splice(index, 1);
      }
    }
  }

  deleteClicked() {
    let deleteDialog = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        item: this.wishList.event,
        id: this.wishList.id
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result) this.deleted.emit(result);
    });
  }

  shareClicked() {
    this.dialog.open(ShareDialogComponent, {
      data: {
        url: this.createSharingUrl()
      }
    });
  }

  duplicateClicked() {
    let duplicateDialog = this.dialog.open(WishListDuplicateDialogComponent, {
      data: {
        wishList: this.wishList
      }
    });

    duplicateDialog.afterClosed().subscribe(result => {
      if (result) this.duplicate.emit(result);
    });
  }

  private createSharingUrl(): string {
    let baseUrl = window.location.href
    let endIndex = baseUrl.lastIndexOf('/');
    baseUrl = baseUrl.substr(0, endIndex);
    return baseUrl + '/?share=' + this.wishList.id;

  }

  private getWishText(wish: Wish) {
    if (wish.caption) {
      return wish.caption;
    } else {
      return wish.description;
    }
  }

  isRed(): boolean {
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

  onWishSelection(wish: Wish) {
    this.wishesSelected = false;
    if (this.wishes) {
      for (let index = 0; index < this.wishes.length; index++) {
        if (this.wishes[index].selected) {
          this.wishesSelected = true;
        }
      }
    }
  }

  publishSelection() {
    let wishIds = new WishIds();
    wishIds.sourceListId = this.wishList.id;
    wishIds.wishIds = [];

    for (let index = 0; index < this.wishes.length; index++) {
      let wish = this.wishes[index];
      if (wish.selected) {
        wishIds.wishIds.push(wish.id);
      }
    }
    this.snackBar.open(`${this.singularOrPluralWish(wishIds.wishIds.length)} in der Zwischenablage`, null, {duration: 2000});
    this.selection.emit(wishIds);
  }

  pasteClicked() {
    let copyTask = {
      destinationListId: this.wishList.id,
      wishes: [this.wishIds]
    };
    this.wishService.copy(copyTask).subscribe(wishes => {
      this.wishes = wishes;
      this.snackBar.open(`${this.singularOrPluralWish(this.wishIds.wishIds.length)} eingefügt`, null, {duration: 2000});
    }, _ => this.errorHandler.handle('fetchWishes'));
  }

  private singularOrPluralWish(count: number): String {
    return count == 1 ? "Ein Wunsch" : `${count} Wünsche`;
  }
}
