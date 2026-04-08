import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Alternative, ensureEmptyAlternative, ImageUpload, isAvailable, isReservedByUser, removeEmptyAlternatives, Wish, Image } from "../services/wish";
import { Change, WishPropertiesComponent } from "../wish-properties/wish-properties.component";
import { MatDialog } from '@angular/material/dialog';
import { isBlue, isGreen, isRed, isYellow } from "../util/color";
import { resizeImage } from "../util/image-processing";
import { DeleteItemDialogComponent } from '../delete-item-dialog/delete-item-dialog.component';

@Component({
    selector: 'wish-edit',
    templateUrl: './wish-edit.component.html',
    styleUrls: ['./wish.component.css', '../util/color.css'],
    standalone: false
})
export class WishEditComponent implements OnInit {
  @Input() wish: Wish;
  @Input() user: string;
  @Input() orderMode: boolean;
  @Output() reserved = new EventEmitter<Wish>();
  @Output() wishChange = new EventEmitter<Wish>();
  @Output() wishImageAppended = new EventEmitter<ImageUpload>();
  @Output() wishSelection = new EventEmitter<Wish>();

  @ViewChild("settings", {static: true}) settings: HTMLElement;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit() {
    removeEmptyAlternatives(this.wish);
  }

  isAvailable() {
    return isAvailable(this.wish);
  }

  isMyPresent(): boolean {
    return isReservedByUser(this.wish, this.user)
  }

  isGroupGift(): boolean {
    return this.wish.groupGift;
  }

  isManagedList(): boolean {
    return this.user != null;
  }

  isRed() {
    return this.isAvailable() && isRed(this.wish.background);
  }

  isYellow() {
    return this.isAvailable() && isYellow(this.wish.background);
  }

  isGreen() {
    return this.isAvailable() && isGreen(this.wish.background);
  }

  isBlue() {
    return this.isAvailable() && isBlue(this.wish.background);
  }

  isHighlighted() {
    return this.wish.highlighted;
  }

  onWishChange() {
    this.wishChange.emit(this.wish)
  }

  settingsClicked() {
    let settingsDialog = this.dialog.open(WishPropertiesComponent, {
      data: {
        wish: this.wish
      }
    });

    settingsDialog.afterClosed().subscribe(result => {
      if (result == Change.CHANGED) {
        this.wishChange.emit(this.wish);
      }
    });
  }

  reserveClicked() {
    this.reserved.emit(this.wish);
  }

  toggleSelection() {
    this.wish.selected = !this.wish.selected;
    this.wishSelection.emit(this.wish);
  }

  onContentChanged(index: number, content: Alternative | Wish) {
    if (index != null) {
      this.wish.alternatives[index] = content;
    }
    this.wishChange.emit(this.wish);

    // deferred ausführen, da sonst der letzte Link von Angular dupliziert wird
    setTimeout(removeEmptyAlternatives, 10, this.wish);
  }

  protected addAlternative() {
    ensureEmptyAlternative(this.wish)
  }

  protected onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      resizeImage(file, 1600).then(resizedFile => {
        this.wishImageAppended.emit({wish: this.wish, file: resizedFile});
      });
    }
  }

  deleteImage(image: Image | any) {
    let deleteDialog = this.dialog.open(DeleteItemDialogComponent, {
      data: {
        item: "Bild",
        id: image
      }
    });

    deleteDialog.afterClosed().subscribe(result => {
      if (result) {
        const index = this.wish.images.indexOf(image);
        if (index > -1) {
          this.wish.images.splice(index, 1);
          this.wishChange.emit(this.wish);
        }
      }
    });
  }
}
