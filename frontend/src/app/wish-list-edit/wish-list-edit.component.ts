import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WishList } from '../services/wish-list';
import {
  countSelection,
  Donation,
  DonationImpl,
  extractIds,
  highlightNewIds,
  isAvailable,
  isReservedByUser,
  removeWishSelection,
  Wish
} from "../services/wish";
import { WishService } from "../services/wish.service";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareDialogComponent } from "../share-dialog/share-dialog.component";
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';
import { EditEventDialogComponent } from '../edit-event-dialog/edit-event-dialog.component';
import { ErrorHandler } from "../error-handler/error-handler.component";
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { WishListDuplicateDialogComponent } from "../wish-list-duplicate-dialog/wish-list-duplicate-dialog.component";
import { extractWishIds, singularOrPluralWish, WishIds } from "../services/wish-copy-task";
import { WishMultiColumnComponent } from "../wish-multi-column/wish-multi-column.component";
import { convertToWishOrder } from "../services/wish.order";
import { ProxyReserveDialogComponent } from "../proxy-reserve-dialog/proxy-reserve-dialog.component";


@Component({
  selector: 'wish-list-edit',
  templateUrl: './wish-list-edit.component.html',
  styleUrls: ['./wish-list.component.css', '../util/color.css']
})
export class WishListEditComponent {
  @Input() wishList: WishList;
  @Input() wishIds: WishIds;
  @Input() user: string;
  @Output() deleted = new EventEmitter<number>();
  @Output() updated = new EventEmitter<WishList>();
  @Output() duplicate = new EventEmitter<WishList>();
  @Output() selection = new EventEmitter<WishIds>();

  @ViewChild("wishColumns", {static: true})
  wishColumns: WishMultiColumnComponent;

  wishes: Wish[];
  panelOpenState: boolean;
  orderMode: boolean;
  selectionCount: number = 0;

  constructor(private wishService: WishService, private dialog: MatDialog, private snackBar: MatSnackBar, private errorHandler: ErrorHandler) {
  }

  panelOpened() {
    this.wishService.fetchWishes(this.wishList.id).subscribe(wishes => {
          this.orderMode = false;
          this.wishes = wishes;
          this.panelOpenState = this.wishList.background == null;
          this.wishColumns.render(wishes, this.orderMode);
        },
        _ => this.errorHandler.handle('fetchWishes'))
  }

  panelClosed() {
    this.panelOpenState = false;
    this.selectionCount = 0;
  }

  addWish() {
    this.wishService.add(this.wishList.id).subscribe(wish => {
          this.wishes.push(wish);
          this.wishColumns.render();
        }, _ => this.errorHandler.handle('addWish')
    )
  }

  wishChanged(wish: Wish) {
    this.wishService.update(this.wishList.id, wish).subscribe(result => {
          if (!result) {
            alert('Update fehlgeschlagen')
          }
        }, _ => this.errorHandler.handle('updateWish')
    )
  }

  onOrderChange() {
    let wishOrders = convertToWishOrder(this.wishes);
    this.wishService.updateOrder(this.wishList.id, wishOrders).subscribe(result => {
      if (!result) {
        alert('Update der Reihenfolge fehlgeschlagen')
      }
    }, _ => this.errorHandler.handle('update Order'));
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

  orderClicked() {
    this.orderMode = !this.orderMode;
    if (this.orderMode) {
      this.snackBar.open('Sortieren: Wünsche einfach an die richtige Stelle ziehen.\n mit 🖋 weiter bearbeiten.',
          null, {duration: 3000});
    }
    this.wishColumns.render(null, this.orderMode);
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
      let oldWishIds = extractIds(this.wishes);
      this.wishes = wishes;
      highlightNewIds(this.wishes, oldWishIds);
      this.wishColumns.render(wishes);
      this.snackBar.open(`${singularOrPluralWish(this.wishIds.wishIds.length)} eingefügt`, null, {duration: 2000});
    }, _ => this.errorHandler.handle('fetchWishes'));
  }

  reserveClicked(wish: Wish) {
    if (isReservedByUser(wish, this.user)) {
      this.runReservationInMyName(wish, new DonationImpl());
    } else {
      this.doProxyReservation(wish);
    }
  }

  private runReservationInMyName(wish: Wish, donation: Donation) {
    donation.donor = this.user;
    this.wishService.reserve(this.wishList.id, wish.id, donation, wish).subscribe(updatedWish => {
          wish.donations = updatedWish.donations;
        },
        _ => this.errorHandler.handle('reserveWish'));
  }

  private doProxyReservation(wish: Wish) {
    let reserveDialog = this.dialog.open(ProxyReserveDialogComponent, {
      data: {
        wish: wish
      }
    });

    reserveDialog.afterClosed().subscribe(dialogResponse => {
      if (dialogResponse) {
        if (dialogResponse.wishChanged) {
          this.callUpdateService(wish);
        }
        this.callReservationService(dialogResponse.donation, wish);
      }
    })
  }

  private callUpdateService(wish: Wish) {
    this.wishService.update(this.wishList.id, wish);
  }

  private callReservationService(donation: Donation, wish: Wish) {
    if (donation.donor) {
      this.wishService.proxyReserve(this.wishList.id, wish.id, donation, wish).subscribe(updatedWish => {
            wish.donations = updatedWish.donations;
          },
          _ => this.errorHandler.handle('proxyReserveWish'));
    } else {
      this.runReservationInMyName(wish, donation)
    }
  }

  private deleteSelectedWishes() {
    let wishIds = extractWishIds(this.wishList.id, this.wishes);

    this.wishService.delete(wishIds).subscribe(result => {
      if (result) {
        this.removeFromList(wishIds.wishIds);
        this.wishColumns.render();
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

  private createSharingUrl(): string {
    let baseUrl = window.location.href;
    let endIndex = baseUrl.lastIndexOf('/');
    baseUrl = baseUrl.substr(0, endIndex);
    return baseUrl + '/?share=' + this.wishList.id;

  }

}
