import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, DonationInEdit, donationOpenParticipation, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'proxy-participate-dialog',
    templateUrl: './proxy-participate-dialog.component.html',
    styleUrls: ['./proxy-participate-dialog.component.css'],
    standalone: false
})
export class ProxyParticipateDialogComponent implements OnInit {

  wish: Wish;
  user: string;
  donationInEdit: DonationInEdit;
  donationsInEdit: DonationInEdit[];

  constructor(public dialogRef: MatDialogRef<ProxyParticipateDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.wish = data.wish;
    this.user = data.user;
    this.donationsInEdit = [];
    for (let donation of this.wish.donations) {
      if (this.isMyDonation(donation)) {
        let donationInEdit = new DonationInEdit();
        donationInEdit.donation = donation;
        this.donationsInEdit.push(donationInEdit);
      }
    }
    this.subscribeCloseHandler();
  }

  private subscribeCloseHandler() {
    this.dialogRef.backdropClick().subscribe(result => this.closeDialog())
    this.dialogRef.keydownEvents().subscribe(key => {
      if (key.code == "Escape") this.closeDialog();
    });
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
    this.dialogRef.close(this.donationsInEdit);
  }

  protected isMyDonation(donation: Donation): boolean {
    return donation.donor == this.user || donation.proxyDonor == this.user;
  }

  protected newParticipation() {
    this.donationInEdit = new DonationInEdit();
    this.donationInEdit.donation = new DonationImpl();
    this.donationInEdit.donation.amount = this.calculationSuggestedParticipation()
    this.donationInEdit.isNew = true

    this.donationsInEdit.push(this.donationInEdit);
  }

  protected removeDonation(donationInEdit: DonationInEdit) {
    donationInEdit.isDeleted = true;
  }

  protected editDonation(donationInEdit: DonationInEdit  ) {

    this.donationInEdit = donationInEdit;
  }

  protected onFieldChange() {
    this.donationInEdit.isUpdated = true;
  }
}

