import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'group-gift-button',
    templateUrl: './group-gift-button.component.html',
    styleUrls: ['./group-gift-button.component.css'],
    standalone: false
})
export class GroupGiftButtonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  getGroupGiftTooltip() {
    return 'Gruppengeschenk vorschlagen';
  }

}
