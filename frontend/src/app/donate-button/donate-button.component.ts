import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'donate-button',
  templateUrl: './donate-button.component.html',
  styleUrls: ['./donate-button.component.css']
})
export class DonateButtonComponent implements OnInit {
  @Input() reserved: boolean;
  @Input() groupGift: boolean;
  @Input() tooltip: string;

  constructor() { }

  ngOnInit(): void {
  }

  getToolTip() {
    if (this.groupGift) {
      return this.getGroupToolTip();
    } else {
      return this.getStandardToolTip();
    }
  }

  private getStandardToolTip() {
    if (this.reserved) {
      return 'Geschenk wieder freigeben';
    } else {
      return 'Ich möchte das schenken';
    }
  }

  private getGroupToolTip() {
    if (this.reserved) {
      return 'Beteiligung zurückziehen';
    } else {
      return 'Am Geschenk beteiligen';
    }
  }
}
