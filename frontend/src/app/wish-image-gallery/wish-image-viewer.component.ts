import { Component, EventEmitter, Input, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { WishImageZoomComponent } from './wish-image-zoom.component';

@Component({
  selector: 'wish-image-gallery',
  templateUrl: './wish-image-viewer.component.html',
  styleUrls: ['./wish-image-viewer.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WishImageViewerComponent {
  @Input() image: any;
  @Input() deleteVisible: boolean;
  @Output() delete = new EventEmitter<void>();

  @ViewChild(WishImageZoomComponent) zoomComponent!: WishImageZoomComponent;

  onDelete() {
    this.delete.emit();
  }

  openZoom() {
    this.zoomComponent.open();
  }
}
