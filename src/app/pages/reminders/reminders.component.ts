import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../model/reminder';
import { GoalService } from '../../services/goal.service';
import { ReminderService } from '../../services/reminder.service';
import { Observable } from 'rxjs';


declare var bootstrap: any;

@Component({
  selector: 'app-reminders',
  imports: [NgClass, NgIf, DatePipe, FormsModule, AsyncPipe],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css'
})
export class RemindersComponent implements OnInit {

  private destroyRef = inject(DestroyRef);
  @ViewChild('reminderModalRef') modalRef!: ElementRef;

  goalService = inject(GoalService);
  reminderService = inject(ReminderService);

  remindersList$ : Observable<Reminder[]> = new Observable<Reminder[]>();

  newReminder: Reminder = {
    reminderId: 0,
    title: "",
    description: "",
    reminderDateTime: new Date(),
    isAcknowledged: false,
    userId: 0
  }

  ngOnInit(): void {
    this.newReminder.userId = this.goalService.user.userId;
     if (this.modalRef) {
      const modal = new bootstrap.Modal(this.modalRef);
    }
    this.getAllRemindersByUser();
  }
    closeModal() {
    const modal = bootstrap.Modal.getInstance(this.modalRef.nativeElement);
    modal?.hide();
  }

  getAllRemindersByUser() {
    this.remindersList$ = this.reminderService.getAllRemindersByUser(this.newReminder.userId);
  }

  toggleAcknowledge(reminder: Reminder) {
    reminder.isAcknowledged = !reminder.isAcknowledged;
    this.reminderService.updateReminder(reminder, reminder.reminderId).subscribe({
      error: (error: Error) => {
        console.log(error);
      }
    })
  }

  onSaveReminder() {
    this.reminderService.creteNewReminder(this.newReminder).subscribe({
      error: (error: Error) => {
        console.log(error);
      }
    })
    this.newReminder = {
      reminderId: 0,
      title: "",
      description: "",
      reminderDateTime: new Date(),
      isAcknowledged: false,
      userId: 0
    }
    this.newReminder.userId = this.newReminder.userId;
    this.closeModal();
  }
}
