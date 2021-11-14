import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, donationOpenParticipation, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'participate-dialog',
  templateUrl: './participate-dialog.component.html',
  styleUrls: ['./participate-dialog.component.css']
})
export class ParticipateDialogComponent implements OnInit {

  wish: Wish;
  dialogResult: Donation;

  constructor(public dialogRef: MatDialogRef<ParticipateDialogComponent>,
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

