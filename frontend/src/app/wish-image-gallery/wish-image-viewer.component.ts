import { Component, EventEmitter, Input, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'wish-image-gallery',
  templateUrl: './wish-image-viewer.component.html',
  styleUrls: ['./wish-image-viewer.component.css'],
  standalone: false
})
export class WishImageViewerComponent {
  private _image: any;

  @Input()
  set image(value: any) {
    this._image = value;
    this.resetZoom();
  }

  get image(): any {
    return this._image;
  }

  @Input()
  deleteVisible: boolean;
  @Output() delete = new EventEmitter<void>();

  @ViewChild('zoomDialog') zoomDialog!: ElementRef<HTMLDialogElement>;

  scale = 1;
  panX = 0;
  panY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;
  private lastTouchDistance = 0;

  onDelete() {
    this.delete.emit();
  }

  openZoom() {
    this.resetZoom();
    this.zoomDialog.nativeElement.showModal();
  }

  closeZoom() {
    this.zoomDialog.nativeElement.close();
  }

  onDialogClose() {
    this.resetZoom();
  }

  onDialogClick(event: MouseEvent) {
    const dialog = this.zoomDialog.nativeElement;
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isDialogContent = (
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width
    );
    if (!isDialogContent) {
      this.closeZoom();
    }
  }

  zoomIn() {
    this.scale = Math.min(this.scale + 0.5, 5);
  }

  zoomOut() {
    this.scale = Math.max(this.scale - 0.5, 1);
    if (this.scale === 1) {
      this.panX = 0;
      this.panY = 0;
    }
  }

  resetZoom() {
    this.scale = 1;
    this.panX = 0;
    this.panY = 0;
    this.lastTouchDistance = 0;
  }

  toggleZoom(event: MouseEvent) {
    if (this.scale > 1) {
      this.resetZoom();
    } else {
      this.scale = 2.5;
    }
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomFactor = 0.15;
    if (event.deltaY < 0) {
      this.scale = Math.min(this.scale + zoomFactor, 5);
    } else {
      this.scale = Math.max(this.scale - zoomFactor, 1);
    }
    if (this.scale === 1) {
      this.panX = 0;
      this.panY = 0;
    }
  }

  startDrag(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent && event.touches.length === 2) {
      this.isDragging = false;
      this.lastTouchDistance = this.getTouchDistance(event);
      return;
    }

    if (this.scale <= 1) return;
    this.isDragging = true;
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    this.startX = clientX - this.panX;
    this.startY = clientY - this.panY;
    
    if (event instanceof MouseEvent) {
      event.preventDefault();
    }
  }

  drag(event: MouseEvent | TouchEvent) {
    if (event instanceof TouchEvent && event.touches.length === 2) {
      event.preventDefault();
      const distance = this.getTouchDistance(event);
      if (this.lastTouchDistance > 0) {
        const factor = distance / this.lastTouchDistance;
        this.scale = Math.max(1, Math.min(this.scale * factor, 5));
      }
      this.lastTouchDistance = distance;
      return;
    }

    if (!this.isDragging) return;
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const clientY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    this.panX = clientX - this.startX;
    this.panY = clientY - this.startY;
  }

  endDrag() {
    this.isDragging = false;
    this.lastTouchDistance = 0;
  }

  private getTouchDistance(event: TouchEvent): number {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

