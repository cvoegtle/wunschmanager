import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'suggest-group-dialog',
  templateUrl: './suggest-group-dialog.component.html',
  styleUrls: ['./suggest-group-dialog.component.css']
})
export class SuggestGroupDialogComponent implements OnInit {
  wish: Wish;
  donation: Donation;

  constructor(public dialogRef: MatDialogRef<SuggestGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(_ => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
    this.donation = new DonationImpl();
    this.donation.amount = this.wish.suggestedParticipation
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  reserve(): void {
    this.wish.groupGift=true
    this.dialogRef.close(this.donation);
  }

}
