import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../model/reminder';
import { ReminderService } from '../../services/reminder.service';


declare var bootstrap: any;

@Component({
  selector: 'app-reminders',
  imports: [NgClass, DatePipe, FormsModule],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css'
})
export class RemindersComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  @ViewChild('reminderModalRef') modalRef!: ElementRef;
  reminderService = inject(ReminderService);

  reminders = signal<Reminder[]>([]);

  newReminder: Reminder = {
    title: "",
    description: "",
    reminderDateTime: new Date(),
    isAcknowledged: false,
  }

  ngOnInit(): void {
    this.reminderService.getAllRemindersByUser().subscribe((data)=> {
      this.reminders.set(data);
    });
  }
  closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }
  onSaveReminder() {
    this.reminderService.createNewReminder(this.newReminder);
    this.newReminder = {
      title: "",
      description: "",
      reminderDateTime: new Date(),
      isAcknowledged: false,
    }
    this.closeModal();
  }

  toggleAcknowledge(reminder: Reminder) {
    if (reminder.id) {
      this.reminderService.deleteReminder(reminder.id);
    } else {
      return;
    }
  }
}
