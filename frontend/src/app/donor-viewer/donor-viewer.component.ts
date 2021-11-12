import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Donation, Wish } from "../services/wish";

@Component({
  selector: 'donor-viewer',
  templateUrl: './donor-viewer.component.html',
  styleUrls: ['./donor-viewer.component.css']
})
export class DonorViewerComponent implements OnInit {
  @Input() donation: Donation;
  @Input() userName: String;
  @Input() loggedIn: boolean = false;
  @Input() first: boolean = false;
  @Output() donorClicked = new EventEmitter<void>();


  constructor() { }

  ngOnInit(): void {
  }

  handleDonorClick() {
    this.donorClicked.emit();
  }

  isMyPresent() {
    return this.userName == this.donation.donor;
  }
}
