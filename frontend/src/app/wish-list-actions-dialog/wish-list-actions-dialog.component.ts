import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material";

@Component({
  selector: 'app-wish-list-actions-dialog',
  templateUrl: './wish-list-actions-dialog.component.html',
  styleUrls: ['./wish-list-actions-dialog.component.css']
})
export class WishListActionsDialogComponent {
  public action = {
    doShare: "share",
    doCopy: "copy",
    doDelete: "delete"
  }

  constructor(public dialogRef: MatDialogRef<WishListActionsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
