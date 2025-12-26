import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'error-session-dialog',
    templateUrl: './error-session-dialog.component.html',
    styleUrls: ['./error-session-dialog.component.css'],
    standalone: false
})
export class ErrorSessionDialogComponent {

  constructor(public dialogRef: MatDialogRef<ErrorSessionDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }
}
