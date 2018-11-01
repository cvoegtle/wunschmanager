import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'select-toggle',
  templateUrl: './select-toggle.component.html',
  styleUrls: ['./select-toggle.component.css']
})
export class SelectToggleComponent implements OnInit {
  @Input() selected;
  @Output() selectionChange = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  toggleSelection() {
    this.selected = !this.selected;
    this.selectionChange.emit(this.selected);
  }
}
