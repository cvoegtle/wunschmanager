import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { donationOpenParticipation, donationTotalParticipation, Wish } from "../services/wish";

@Component({
    selector: 'price-information',
    templateUrl: './price-information.component.html',
    styleUrls: ['./price-information.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
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
