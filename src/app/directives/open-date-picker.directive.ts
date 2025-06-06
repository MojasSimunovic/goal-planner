import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appOpenDatePicker]',
})
export class AutoOpenDatePickerDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('focus')
  onFocus() {
    this.el.nativeElement.showPicker?.(); // Optional, works in Chrome
  }
}
