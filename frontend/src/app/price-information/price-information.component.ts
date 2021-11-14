import { Component, Input, OnInit } from '@angular/core';
import { donationOpenParticipation, donationTotalParticipation, Wish } from "../services/wish";

@Component({
  selector: 'price-information',
  templateUrl: './price-information.component.html',
  styleUrls: ['./price-information.component.css']
})
export class PriceInformationComponent implements OnInit {
  @Input() wish: Wish;

  constructor() { }

  ngOnInit(): void {
  }

  participation() {
    return donationTotalParticipation(this.wish);
  }

  openParticipation() {
    return donationOpenParticipation(this.wish);
  }
}
