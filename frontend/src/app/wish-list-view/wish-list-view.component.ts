import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { containsSelectedWish, copyDonationInformation, Donation, DonationImpl, isReservedByUser, removeWishSelection, Wish } from '../services/wish';
import { WishList } from '../services/wish-list';
import { WishService } from '../services/wish.service';
import { ErrorHandler } from '../error-handler/error-handler.component';
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { extractWishIds, singularOrPluralWish, WishIds } from "../services/wish-copy-task";
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeleteItemDialogComponent } from "../delete-item-dialog/delete-item-dialog.component";
import { WishViewMultiColumnComponent } from "../wish-view-multi-column/wish-view-multi-column.component";
import { Router } from "@angular/router";
import { ParticipateDialogComponent } from "../participate-dialog/participate-dialog.component";
import { SuggestGroupDialogComponent } from "../suggest-group-dialog/suggest-group-dialog.component";
import { ReserveAction, ReserveActionDialogComponent } from "../reserve-action-dialog/reserve-action-dialog.component";

@Component({
    selector: 'wish-list-view',
    templateUrl: './wish-list-view.component.html',
    styleUrls: ['../wish-list-edit/wish-list.component.css', '../util/color.css'],
    standalone: false
})
export class WishListViewComponent implements OnInit {
  @Input() user: string;
  @Input() wishList: WishList;
  @Input() deleteEnabled: boolean = true;
  @Input() restricted: boolean = false;
  @Input() expanded: boolean = false;
  @Output() deleted = new EventEmitter<number>();
  @Output() selection = new EventEmitter<WishIds>();

  wishes: Wish[];
  wishesSelected: boolean = false;

  panelOpenState: boolean;

  @ViewChild("wishColumns", {static: true})
  wishColumns: WishViewMultiColumnComponent;

  constructor(private wishService: WishService,
              private router: Router,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private errorHandler: ErrorHandler) {
  }

  ngOnInit() {
  }

  panelOpened() {
    this.wishService.fetchWishes(this.wishList.id).subscribe(wishes => {
          this.wishes = wishes;
          this.panelOpenState = this.wishList.background == null;
          this.wishColumns.render(wishes);
        },
        error => this.errorHandler.handle(error, 'fetchWishes'))
  }

  panelClosed() {
    this.panelOpenState = false;
    this.wishesSelected = false;
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

  reserveClicked(wish: Wish) {
    if (this.user) {
      if (isReservedByUser(wish, this.user)) {
        this.callReservationService(wish);
      } else if (wish.groupGift) {
        this.participateInGroupGift(wish);
      } else {
        this.openReserveDialog(wish);
      }
    } else {
      this.askForLogin('für eine Reservierung musst Du Dich anmelden.');
    }
  }

  private openReserveDialog(wish: Wish) {
    let reserveActionDialog = this.dialog.open(ReserveActionDialogComponent, {
      data: {
        wish: wish
      }
    });

    reserveActionDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet === ReserveAction.RESERVE_FOR_ME) {
        this.callReservationService(wish);
      } else if (dialogRet === ReserveAction.SUGGEST_GROUP) {
        this.openGroupSuggestionDialog(wish);
      }
    });
  }

  private openGroupSuggestionDialog(wish: Wish) {
    let suggestGroupDialog = this.dialog.open(SuggestGroupDialogComponent, {
      data: {
        wish: wish
      }
    });

    suggestGroupDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet) {
        this.callReservationService(wish, dialogRet);
      }
    })
  }

  showDonorClicked(wish: Wish) {
    this.askForLogin('um den Schenker zu sehen, musst Du Dich anmelden.');
  }

  onWishSelection() {
    this.wishesSelected = containsSelectedWish(this.wishes);
  }

  publishSelection() {
    let wishIds = extractWishIds(this.wishList.id, this.wishes);
    removeWishSelection(this.wishes);
    this.wishesSelected = false;


    this.snackBar.open(`${singularOrPluralWish(wishIds.wishIds.length)} in der Zwischenablage`, null, {duration: 2000});
    this.selection.emit(wishIds);
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

  private participateInGroupGift(wish: Wish) {
    let participateDialog = this.dialog.open(ParticipateDialogComponent, {
      data: {
        wish: wish
      }
    });

    participateDialog.afterClosed().subscribe(dialogRet => {
      if (dialogRet) {
        this.callReservationService(wish, dialogRet)
      }
    })

  }

  private callReservationService(wish: Wish, donation: Donation = new DonationImpl()) {
    this.wishService.reserve(this.wishList.id, wish.id, donation, wish).subscribe(updatedWish => {
          copyDonationInformation(wish, updatedWish);
        },
        error => this.errorHandler.handle(error, 'reserveWish'));
  }

  private askForLogin(message: string) {
    let snackBarRef = this.snackBar.open(message, 'anmelden', {duration: 3000});
    snackBarRef.onAction().subscribe(() => {
      this.router.navigate(['/'], {queryParams: {share: this.wishList.id, force: true}});
    });
  }

}
