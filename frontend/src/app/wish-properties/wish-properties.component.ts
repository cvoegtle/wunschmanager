import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Wish } from "../services/wish";

export enum Change {
  UNCHANGED, CHANGED
}

@Component({
  selector: 'app-wish-properties',
  templateUrl: './wish-properties.component.html',
  styleUrls: ['../wish-edit/wish.component.css']
})

export class WishPropertiesComponent {
  wish: Wish;
  changed: Change = Change.UNCHANGED;

  constructor(public dialogRef: MatDialogRef<WishPropertiesComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(result => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
  }

  closeDialog() {
    this.dialogRef.close(this.changed);
  }

  toggleVisibility() {
    this.wish.invisible = !this.wish.invisible;
    this.changed  = Change.CHANGED;
  }

  onBackgroundChanged() {
    this.changed  = Change.CHANGED;
  }

}
