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
    if (this.iOS()) {
      this.copySafariIOS(url_field);
    } else {
      this.copyAllBrowser(url_field);
    }
    this.snackBar.open("In die Zwischenablage kopiert", null, {duration: 2000});
    this.dialogRef.close();
  }

  copyAllBrowser(url_field: HTMLInputElement) {
    url_field.select();
    document.execCommand('copy');
  }

  copySafariIOS(url_field: HTMLInputElement) {
      let range = document.createRange();

      url_field.contentEditable = "true";
      url_field.readOnly = false;
      range.selectNodeContents(url_field);

      let s = window.getSelection();
      s.removeAllRanges();
      s.addRange(range);

      url_field.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

      document.execCommand('copy');
  }

  iOS(): boolean {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }
}
