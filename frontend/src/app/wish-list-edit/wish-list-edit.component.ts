import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishList } from '../services/wish-list';
import { containsSelectedWish, countSelection, removeWishSelection, Wish } from "../services/wish";
import { WishService } from "../services/wish.service";
import { MatDialog, MatSnackBar } from '@angular/material';
import { ShareDialogComponent } from "../share-dialog/share-dialog.component";
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';
import { EditEventDialogComponent } from '../edit-event-dialog/edit-event-dialog.component';
import { ErrorHandler } from "../error-handler/error-handler.component";
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { WishListDuplicateDialogComponent } from "../wish-list-duplicate-dialog/wish-list-duplicate-dialog.component";
import { extractWishIds, singularOrPluralWish, WishIds } from "../services/wish-copy-task";


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
  selectionCount: number = 0;

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
    this.selectionCount = 0;
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

  deleteWishesClicked() {
    let deleteDialog = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        item: singularOrPluralWish(countSelection(this.wishes)),
        id: countSelection(this.wishes)
      }
    });

    deleteDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet) {
        this.deleteSelectedWishes();
      }
    });
  }

  private deleteSelectedWishes() {
    let wishIds = extractWishIds(this.wishList.id, this.wishes);

    this.wishService.delete(wishIds).subscribe(result => {
      if (result) {
        this.removeFromList(wishIds.wishIds);
        this.selectionCount = countSelection(this.wishes);
      }
    }, _ => this.errorHandler.handle('deleteWish'))
  }

  private removeFromList(ids: number[]) {
    for (let id of ids) {
      this.removeIdFromList(id);
    }
  }

  private removeIdFromList(id) {
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
      if (result) {
        this.deleted.emit(result);
      }
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

  onWishSelection() {
    this.selectionCount = countSelection(this.wishes);
  }

  publishSelection() {
    let wishIds = extractWishIds(this.wishList.id, this.wishes);
    removeWishSelection(this.wishes);
    this.selectionCount = 0;

    this.snackBar.open(`${singularOrPluralWish(wishIds.wishIds.length)} in der Zwischenablage`, null, {duration: 2000});
    this.selection.emit(wishIds);
  }

  pasteClicked() {
    let copyTask = {
      destinationListId: this.wishList.id,
      wishes: [this.wishIds]
    };
    this.wishService.copy(copyTask).subscribe(wishes => {
      this.wishes = wishes;
      this.snackBar.open(`${singularOrPluralWish(this.wishIds.wishIds.length)} eingefügt`, null, {duration: 2000});
    }, _ => this.errorHandler.handle('fetchWishes'));
  }

}
