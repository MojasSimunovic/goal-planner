import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../model/reminder';
import { ReminderService } from '../../services/reminder.service';
import { ReminderModalComponent } from "../../shared/reminder-modal/reminder-modal.component";
import { TitleComponent } from "../../shared/title/title.component";
import { ButtonComponent } from "../../shared/button/button.component";


declare var bootstrap: any;

@Component({
  selector: 'app-reminders',
  imports: [NgClass, DatePipe, FormsModule, ReminderModalComponent, TitleComponent, ButtonComponent],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css'
})
export class RemindersComponent implements OnInit {
  @ViewChild('reminderModalRef') modalRef!: ElementRef;
  reminderService = inject(ReminderService);
  reminders = signal<Reminder[]>([]);
  
  ngOnInit(): void {
    this.reminderService.getAllRemindersByUser().subscribe((data)=> {
      this.reminders.set(data);
    });
  }
  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }
  toggleAcknowledge(reminder: Reminder) {
    if (reminder.id) {
      this.reminderService.deleteReminder(reminder.id);
    } else {
      return;
    }
  }
}
