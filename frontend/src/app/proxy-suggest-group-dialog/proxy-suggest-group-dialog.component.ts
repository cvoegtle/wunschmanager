import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, resetGroupGift, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'proxy-suggest-group-dialog',
    templateUrl: './proxy-suggest-group-dialog.component.html',
    styleUrls: ['./proxy-suggest-group-dialog.component.css'],
    standalone: false
})
export class ProxySuggestGroupDialogComponent implements OnInit {

  wish: Wish;
  donation: Donation;
  wishChanged: boolean;

  constructor(public dialogRef: MatDialogRef<ProxySuggestGroupDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(result => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
    this.donation = new DonationImpl();
    this.donation.donor = data.donor;
    this.donation.amount = this.wish.suggestedParticipation
  }

  closeDialog() {
    resetGroupGift(this.wish);
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  reserve() {
    this.wish.groupGift=true;
    this.dialogRef.close({donation: this.donation, wishChanged: this.wishChanged});
  }

  isDonorEmpty(): boolean {
    return this.donation.donor == null || this.donation.donor.length == 0;
  }

  onWishChange() {
    this.wishChanged = true;
  }
}
