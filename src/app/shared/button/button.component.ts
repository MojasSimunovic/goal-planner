import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',

})
export class ButtonComponent {
  @Output() clickEmit = new EventEmitter();
  @Input() btnType?: string;

  onClick() {
    this.clickEmit.emit();
  }
  getButtonClasses() {
    return this.btnType === 'cancel' ? 'cancel' : '';
  }
}
