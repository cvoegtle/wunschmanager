import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent {
  constructor(public dialogRef: MatDialogRef<ShareDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar) {
  }

  selectAll(url_field: HTMLInputElement) {
    if (this.iOS()) {
      url_field.select();
    }
  }


  copyClicked(url_field: HTMLInputElement) {
    url_field.select();
    document.execCommand('copy');
    this.snackBar.open("In die Zwischenablage kopiert", null, {duration: 2000});
    this.dialogRef.close();
  }

  iOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }
}
