import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'wish-image-gallery',
  templateUrl: './wish-image-viewer.component.html',
  styleUrls: ['./wish-image-viewer.component.css'],
  standalone: false
})
export class WishImageViewerComponent {
  @Input() image: any;
  @Input() deleteVisible: boolean;
  @Output() delete = new EventEmitter<void>();

  onDelete() {
    this.delete.emit();
  }
}
