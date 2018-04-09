import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WishList } from '../services/wish-list';
import { Wish } from "../services/wish";
import { WishService } from "../services/wish.service";
import { MatDialog } from '@angular/material';
import { ShareDialogComponent } from "../share-dialog/share-dialog.component";
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';
import { EditEventDialogComponent } from '../edit-event-dialog/edit-event-dialog.component';
import { ErrorDialogComponent } from "../error-dialog/error-dialog.component";
import { ErrorHandler } from "../error-handler/error-handler.component";
import { isBlue, isGreen, isRed, isYellow } from "../util/color";


@Component({
  selector: 'wish-list-edit',
  templateUrl: './wish-list-edit.component.html',
  styleUrls: ['./wish-list.component.css', '../util/color.css']
})
export class WishListEditComponent implements OnInit {
  @Input() wishList: WishList;
  @Output() deleted = new EventEmitter<number>();
  @Output() updated = new EventEmitter<WishList>();

  wishes: Wish[];
  panelOpenState: boolean;

  constructor(private wishService: WishService, private dialog: MatDialog, private errorHandler: ErrorHandler) {
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
