import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { WishList, WishListImpl } from "../services/wish-list";
import { DuplicateRequest } from "../services/duplicate-request";

@Component({
  selector: 'app-wish-list-duplicate-dialog',
  templateUrl: './wish-list-duplicate-dialog.component.html',
  styleUrls: ['./wish-list-duplicate-dialog.component.css', '../util/color.css']
})
export class WishListDuplicateDialogComponent {
  referenceList: WishList;
  newList: WishList = new WishListImpl();

  constructor(public dialogRef: MatDialogRef<WishListDuplicateDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.referenceList = data.wishList;
    this.newList.event = "Kopie von " + this.referenceList.event;
    this.newList.background = this.referenceList.background;
    this.newList.managed = this.referenceList.managed;

    this.dialogRef.backdropClick().subscribe(_ => this.doClose());
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.doClose();
    });

  }

  isCreatePossible(): boolean {
    return this.newList.event.length > 0;
  }

  copyClicked() {
    let duplicateRequest = new DuplicateRequest();
    duplicateRequest.templateId = this.referenceList.id;
    duplicateRequest.wishList = this.newList;
    this.dialogRef.close(duplicateRequest);
  }

  private doClose() {
    this.dialogRef.close();
  }

}
