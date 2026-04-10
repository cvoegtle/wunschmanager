import { Component, Inject, OnInit } from '@angular/core';
import { Donation, DonationImpl, DonationInEdit, donationOpenParticipation, copyDonation, Wish } from "../services/wish";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { disabled } from "@angular/forms/signals";

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
    this.copyMyDonations();
    this.subscribeCloseHandler();
  }

  private copyMyDonations() {
    this.donationsInEdit = [];
    for (let donation of this.wish.donations) {
      if (this.isMyDonation(donation)) {
        let donationInEdit = this.copyToDonationInEdit(donation);
        this.donationsInEdit.push(donationInEdit);
      }
    }
  }

  private copyToDonationInEdit(donation: Donation) {
    let donationInEdit = new DonationInEdit();
    donationInEdit.donation = copyDonation(donation);
    if (donationInEdit.donation.donor == this.user) {
      donationInEdit.donation.donor = null;
    }
    return donationInEdit;
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

  saveDonations(): void {
    this.dialogRef.close(this.donationsInEdit);
  }

  protected isMyDonation(donation: Donation): boolean {
    return donation.donor == this.user || donation.proxyDonor == this.user;
  }

  protected newDonation() {
    this.donationInEdit = new DonationInEdit();
    this.donationInEdit.donation = new DonationImpl();
    this.donationInEdit.donation.amount = this.calculationSuggestedParticipation()
    this.donationInEdit.isNew = true

    this.donationsInEdit.push(this.donationInEdit);
  }

  protected removeDonation(donationInEdit: DonationInEdit) {
    if (this.donationInEdit == donationInEdit) {
      this.donationInEdit = null;
    }
    donationInEdit.isDeleted = true;
  }

  protected editDonation(donationInEdit: DonationInEdit  ) {

    this.donationInEdit = donationInEdit;
  }

  protected onFieldChange() {
    this.donationInEdit.isUpdated = true;
  }

  public donationChanged(): boolean {
    return this.donationsInEdit.some(d => d.isNew || d.isUpdated || d.isDeleted);
  }

  public hasDuplicateDonors(): boolean {
    if (!this.donationsInEdit) {
      return false;
    }

    const donors = this.donationsInEdit
      .filter(d => !d.isDeleted)
      .map(d => {
        const donor = d.donation.donor;
        return donor ? donor : "";
      });

    const uniqueDonors = new Set(donors);

    return uniqueDonors.size < donors.length;
  }

  protected readonly disabled = disabled;
}
