import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard-icon-picker',
  imports: [FormsModule],
  templateUrl: './dashboard-icon-picker.component.html',
  styleUrl: './dashboard-icon-picker.component.css'
})
export class DashboardIconPickerComponent {

  @Input() icons: string[] = [];
  @Output() iconSelected = new EventEmitter<string>();
  searchText = '';

  get filteredIcons(): string[] {
  return this.icons.filter(icon =>
      icon.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  selectIcon(icon: string) {
    this.iconSelected.emit(icon);
  }

}
