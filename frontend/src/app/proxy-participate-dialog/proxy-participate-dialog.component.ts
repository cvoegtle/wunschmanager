import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, donationOpenParticipation, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'proxy-participate-dialog',
    templateUrl: './proxy-participate-dialog.component.html',
    styleUrls: ['./proxy-participate-dialog.component.css'],
    standalone: false
})
export class ProxyParticipateDialogComponent implements OnInit {

  wish: Wish;
  dialogResult: Donation;

  constructor(public dialogRef: MatDialogRef<ProxyParticipateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.dialogRef.backdropClick().subscribe(result => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
    this.dialogResult = new DonationImpl();
    this.dialogResult.amount = this.calculationSuggestedParticipation()
  }

  private calculationSuggestedParticipation() {
    if (donationOpenParticipation(this.wish) > 0 && this.wish.suggestedParticipation) {
      return Math.min(donationOpenParticipation(this.wish), this.wish.suggestedParticipation);
    } else {
      return this.wish.suggestedParticipation
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

  participate(): void {
    this.dialogRef.close(this.dialogResult);
  }


}

