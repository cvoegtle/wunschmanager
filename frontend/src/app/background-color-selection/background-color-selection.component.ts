import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'background-color-selection',
  templateUrl: './background-color-selection.component.html',
  styleUrls: ['../util/color.css']
})
export class BackgroundColorSelectionComponent {
  @Input() backgroundColor: string;
  @Output() valueChange = new EventEmitter<String>();


  onSelectionChange() {
    this.valueChange.emit(this.backgroundColor)
  }
}
