import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[christian]'
})
export class FocusDirective implements AfterViewInit {
  @Input() christianfocus: boolean;

  constructor(private element: ElementRef) {}

  ngAfterViewInit() {
    if (this.christianfocus) {
      window.setTimeout(this.element.nativeElement.focus(), 500);
    }
  }
}