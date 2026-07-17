import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
import { Donation, Wish } from "../services/wish";

@Component({
    selector: 'donor-viewer',
    templateUrl: './donor-viewer.component.html',
    styleUrls: ['./donor-viewer.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class DonorViewerComponent implements OnInit {
  @Input() donation: Donation;
  @Input() userName: string;
  @Input() myPresent: boolean = false;
  @Input() loggedIn: boolean = false;
  @Input() first: boolean = false;
  @Output() donorClicked = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  handleDonorClick() {
    this.donorClicked.emit();
  }

  isMyDonation() {
    return this.userName == this.donation.donor || this.userName == this.donation.proxyDonor;
  }
}
