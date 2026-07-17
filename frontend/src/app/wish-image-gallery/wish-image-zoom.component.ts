import { Component, ElementRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'wish-image-zoom',
  templateUrl: './wish-image-zoom.component.html',
  styleUrls: ['./wish-image-zoom.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class WishImageZoomComponent {
  private _image: any;

  @Input()
  set image(value: any) {
    this._image = value;
    this.resetZoom();
  }

  get image(): any {
    return this._image;
  }

  @ViewChild('zoomDialog') zoomDialog!: ElementRef<HTMLDialogElement>;

  scale = 1;
  panX = 0;
  panY = 0;
  isDragging = false;
  startX = 0;
  startY = 0;
  private lastTouchDistance = 0;

  open() {
    this.resetZoom();
    this.zoomDialog.nativeElement.showModal();
  }

  close() {
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
      this.close();
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
    const isTouch = 'touches' in event;

    if (isTouch && (event as TouchEvent).touches.length === 2) {
      this.isDragging = false;
      this.lastTouchDistance = this.getTouchDistance(event as TouchEvent);
      return;
    }

    if (this.scale > 1) {
      this.isDragging = true;
      const clientX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
      const clientY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
      this.startX = clientX - this.panX;
      this.startY = clientY - this.panY;

      event.preventDefault();
    }
  }

  drag(event: MouseEvent | TouchEvent) {
    const isTouch = 'touches' in event;

    if (isTouch && (event as TouchEvent).touches.length === 2) {
      event.preventDefault();
      const distance = this.getTouchDistance(event as TouchEvent);
      if (this.lastTouchDistance > 0) {
        const factor = distance / this.lastTouchDistance;
        this.scale = Math.max(1, Math.min(this.scale * factor, 5));
      }
      this.lastTouchDistance = distance;
      return;
    }

    if (this.isDragging) {
      const clientX = isTouch ? (event as TouchEvent).touches[0].clientX : (event as MouseEvent).clientX;
      const clientY = isTouch ? (event as TouchEvent).touches[0].clientY : (event as MouseEvent).clientY;
      this.panX = clientX - this.startX;
      this.panY = clientY - this.startY;
    }
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
