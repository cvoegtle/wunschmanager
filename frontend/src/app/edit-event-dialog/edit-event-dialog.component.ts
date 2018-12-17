import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";
import { WishList } from "../services/wish-list";

@Component({
  selector: 'edit-event-dialog',
  templateUrl: './edit-event-dialog.component.html',
  styleUrls: ['./edit-event-dialog.component.css', '../util/color.css']
})
export class EditEventDialogComponent {

  oldEvent: string;
  wishList: WishList;
  changed: boolean = false;

  constructor(public dialogRef: MatDialogRef<EditEventDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wishList = data.wishList;
    this.oldEvent = this.wishList.event;
    this.dialogRef.backdropClick().subscribe(_ => this.doClose());
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.doClose();
    });

  }

  private doClose() {
    if (!this.wishList.event) this.wishList.event = this.oldEvent;
    this.dialogRef.close(this.changed);
  }

  valueChanged() {
    this.changed = true;
  }
}
