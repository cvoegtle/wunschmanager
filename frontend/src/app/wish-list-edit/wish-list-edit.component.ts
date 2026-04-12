import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { WishList } from '../services/wish-list';
import {
  copyDonation,
  copyDonationInformation,
  countSelection,
  Donation,
  DonationImpl,
  extractIds, hasDonations,
  highlightNewIds, ImageUpload,
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
import { ProxySuggestGroupDialogComponent } from "../proxy-suggest-group-dialog/proxy-suggest-group-dialog.component";
import { ReserveAction, ReserveActionDialogComponent } from "../reserve-action-dialog/reserve-action-dialog.component";
import { SuggestGroupDialogComponent } from "../suggest-group-dialog/suggest-group-dialog.component";
import { ProxyReserveAction, ProxyReserveActionDialogComponent } from "../proxy-reserve-action-dialog/proxy-reserve-action-dialog.component";
import { ParticipateDialogComponent } from "../participate-dialog/participate-dialog.component";
import { ProxyParticipateDialogComponent } from "../proxy-participate-dialog/proxy-participate-dialog.component";


@Component({
    selector: 'wish-list-edit',
    templateUrl: './wish-list-edit.component.html',
    styleUrls: ['./wish-list.component.css', '../util/color.css'],
    standalone: false
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
    this.wishService.fetchWishes(this.wishList.id, this.user).subscribe(wishes => {
          this.orderMode = false;
          this.wishes = wishes;
          this.panelOpenState = this.wishList.background == null;
          this.wishColumns.render(wishes, this.orderMode);
        },
        error => this.errorHandler.handle(error, 'fetchWishes'))
  }

  panelClosed() {
    this.panelOpenState = false;
    this.selectionCount = 0;
  }

  addWish() {
    this.wishService.add(this.wishList.id).subscribe(wish => {
          this.wishes.push(wish);
          this.wishColumns.render();
        }, error => this.errorHandler.handle(error, 'addWish')
    )
  }

  wishChanged(wish: Wish) {
    this.wishService.update(this.wishList.id, wish).subscribe(result => {
          if (!result) {
            alert('Update fehlgeschlagen')
          }
        }, error => this.errorHandler.handle(error, 'updateWish')
    )
  }

  onOrderChange() {
    let wishOrders = convertToWishOrder(this.wishes);
    this.wishService.updateOrder(this.wishList.id, wishOrders).subscribe(result => {
      if (!result) {
        alert('Update der Reihenfolge fehlgeschlagen')
      }
    }, error => this.errorHandler.handle(error, 'update Order'));
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

  protected onWishImageAppended(imageUpload: ImageUpload) {
    this.wishService.uploadImage(this.wishList.id, imageUpload.wish.id, imageUpload.file).subscribe({
      next: (wish: Wish) => {
        const index = this.wishes.findIndex(w => w.id === wish.id);
        if (index !== -1) {
          this.wishes[index] = wish;
          this.wishColumns.render();
        }
      },
      error: error => this.errorHandler.handle(error, 'uploadImage')
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
    }, error => this.errorHandler.handle(error, 'fetchWishes'));
  }

  reserveClicked(wish: Wish) {
    if (!hasDonations(wish)) {
      this.openReserveDialog(wish);
    } else if (wish.groupGift) {
      this.manageParticipations(wish);
    } else if (isReservedByUser(wish, this.user)) {
      this.callProxyReservationService(wish, []);
    }
  }

  private openReserveDialog(wish: Wish) {
    let reserveActionDialog = this.dialog.open(ProxyReserveActionDialogComponent, {
      data: {
        wish: wish
      }
    });

    reserveActionDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet && dialogRet.action === ProxyReserveAction.RESERVE) {
        this.callProxyReservationService(wish, [{donor: dialogRet.donor}] as Donation[]);
      } else if (dialogRet && dialogRet.action === ProxyReserveAction.SUGGEST_GROUP) {
        this.suggestGroupGift(wish, dialogRet.donor);
      }
    });
  }

  private callProxyReservationServiceSingle(donation: Donation, wish: Wish) {
    this.wishService.proxyReserveSingle(this.wishList.id, wish.id, donation, wish).subscribe(updatedWish => {
          copyDonationInformation(wish, updatedWish);
        },
        error => this.errorHandler.handle(error, 'proxyReserveWish'));
  }

  private callProxyReservationService(wish: Wish, donations: Donation[]) {
    this.wishService.proxyReserve(this.wishList.id, wish.id, donations, wish).subscribe(updatedWish => {
          copyDonationInformation(wish, updatedWish);
        },
        error => this.errorHandler.handle(error, 'proxyReserveWish'));
  }

  private suggestGroupGift(wish: Wish, donor: string) {
    let reserveDialog = this.dialog.open(ProxySuggestGroupDialogComponent, {
      data: {
        wish: wish,
        donor: donor
      }
    });

    reserveDialog.afterClosed().subscribe(dialogResponse => {
      if (dialogResponse) {
        this.callProxyReservationServiceSingle(dialogResponse.donation, wish);
      }
    })
  }

  private manageParticipations(wish: Wish) {
    let participateDialog = this.dialog.open(ProxyParticipateDialogComponent, {
      data: {
        wish: wish,
        user: this.user
      }
    });

    participateDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet) {
        let donations = new Array<Donation>;
        for (let donationInEdit of dialogRet) {
          if (!donationInEdit.isDeleted) {
            donations.push(donationInEdit.donation);
          }
        }
        this.callProxyReservationService(wish, donations);
      }
    })
  }

  private deleteSelectedWishes() {
    let wishIds = extractWishIds(this.wishList.id, this.wishes);

    this.wishService.delete(wishIds).subscribe(result => {
      if (result) {
        this.removeFromList(wishIds.wishIds);
        this.wishColumns.render();
        this.selectionCount = countSelection(this.wishes);
      }
    }, error => this.errorHandler.handle(error, 'deleteWish'))
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
