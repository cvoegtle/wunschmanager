import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'background-color-selection',
    templateUrl: './background-color-selection.component.html',
    styleUrls: ['../util/color.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class BackgroundColorSelectionComponent {
  @Input() backgroundColor: string;
  @Output() valueChange = new EventEmitter<string>();


  onSelectionChange() {
    this.valueChange.emit(this.backgroundColor)
  }
}
