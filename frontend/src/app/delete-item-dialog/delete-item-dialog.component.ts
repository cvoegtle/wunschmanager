import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'delete-item-dialog',
  templateUrl: './delete-item-dialog.component.html',
  styleUrls: ['./delete-item-dialog.component.css']
})
export class DeleteItemDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteItemDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
