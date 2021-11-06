import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-reserve-dialog',
  templateUrl: './reserve-dialog.component.html',
  styleUrls: ['./reserve-dialog.component.css']
})
export class ReserveDialogComponent implements OnInit {

  wish: Wish;
  dialogResult: Donation;

  constructor(public dialogRef: MatDialogRef<ReserveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(result => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
    this.dialogResult = new DonationImpl();
    this.dialogResult.amount = this.wish.suggestedParticipation
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  reserveForMe(): void {
    this.dialogResult.donor = null;
    this.dialogRef.close(this.dialogResult);
  }

  reserveForSomeoneElse(): void {
    this.dialogRef.close(this.dialogResult);
  }

  isDonorEmpty(): boolean {
    return this.dialogResult.donor == null || this.dialogResult.donor.length == 0;
  }
}
