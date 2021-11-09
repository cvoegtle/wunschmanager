import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'proxy-reserve-dialog',
  templateUrl: './proxy-reserve-dialog.component.html',
  styleUrls: ['./proxy-reserve-dialog.component.css']
})
export class ProxyReserveDialogComponent implements OnInit {

  wish: Wish;
  donation: Donation;
  wishChanged: boolean;

  constructor(public dialogRef: MatDialogRef<ProxyReserveDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(result => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
    this.donation = new DonationImpl();
    this.donation.amount = this.wish.suggestedParticipation
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  reserveForMe(): void {
    this.donation.donor = null;
    this.reserve();
  }

  reserveForSomeoneElse(): void {
    this.reserve();
  }

  private reserve() {
    this.dialogRef.close({donation: this.donation, wishChanged: this.wishChanged});
  }

  isDonorEmpty(): boolean {
    return this.donation.donor == null || this.donation.donor.length == 0;
  }

  onWishChange() {
    this.wishChanged = true;
  }
}
