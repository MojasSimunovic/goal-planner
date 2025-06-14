import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  OnInit,
  AfterViewInit,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../model/reminder';
import { ReminderService } from '../../services/reminder.service';
import { TitleComponent } from '../../shared/title/title.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { ReminderModalComponent } from '../../shared/reminder-modal/reminder-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-reminders',
  imports: [
    NgClass,
    DatePipe,
    FormsModule,
    TitleComponent,
    ButtonComponent,
    ReminderModalComponent,
  ],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css',
})
export class RemindersComponent implements OnInit, AfterViewInit {
  @ViewChild(ReminderModalComponent) reminderModal!: ReminderModalComponent;
  reminderService = inject(ReminderService);
  reminders = signal<Reminder[]>([]);
  initialReminderTitle = '';
  private taskTitle: string | null = null;

  ngOnInit(): void {
    this.reminderService.getAllRemindersByUser().subscribe((data) => {
      this.reminders.set(data);
    });
    this.taskTitle = sessionStorage.getItem('reminderTaskTitle');
    if (this.taskTitle) {
      sessionStorage.removeItem('reminderTaskTitle');
      this.initialReminderTitle = this.taskTitle;
    }
  }

  ngAfterViewInit(): void {
    if (this.taskTitle && this.reminderModal) {
      this.reminderModal.openModal();
    }
  }

  onModalClosed() {
    this.initialReminderTitle = '';
    this.taskTitle = null;
  }

  onReminderCreated(reminder: Reminder) {
    this.reminderService.getAllRemindersByUser().subscribe((data) => {
      this.reminders.set(data);
    });
  }

  onDeleteReminder(reminder: Reminder) {
    if (reminder.id) {
      this.reminderService.deleteReminder(reminder.id);
    }
  }

  toggleAcknowledge(reminder: Reminder) {
    if (reminder.id) {
      this.reminderService.toggleAcknowledge(reminder.id).subscribe(() => {
        this.reminderService.getAllRemindersByUser().subscribe((data) => {
          this.reminders.set(data);
        });
      });
    }
  }
}
