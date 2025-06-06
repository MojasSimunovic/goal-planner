import { AsyncPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, ElementRef, inject, OnInit, AfterViewInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../model/reminder';
import { ReminderService } from '../../services/reminder.service';
import { TitleComponent } from "../../shared/title/title.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { ReminderModalComponent } from '../../shared/reminder-modal/reminder-modal.component';

declare var bootstrap: any;

@Component({
  selector: 'app-reminders',
  imports: [NgClass, DatePipe, FormsModule, TitleComponent, ButtonComponent, ReminderModalComponent],
  templateUrl: './reminders.component.html',
  styleUrl: './reminders.component.css'
})
export class RemindersComponent implements OnInit, AfterViewInit {
  @ViewChild(ReminderModalComponent) reminderModal!: ReminderModalComponent;
  reminderService = inject(ReminderService);
  reminders = signal<Reminder[]>([]);
  initialReminderTitle = '';
  private taskTitle: string | null = null;
  
  ngOnInit(): void {
    this.reminderService.getAllRemindersByUser().subscribe((data)=> {
      this.reminders.set(data);
    });

    // Store the task title if it exists
    this.taskTitle = sessionStorage.getItem('reminderTaskTitle');
    if (this.taskTitle) {
      // Clear the stored title
      sessionStorage.removeItem('reminderTaskTitle');
      // Set the initial title
      this.initialReminderTitle = this.taskTitle;
    }
  }

  ngAfterViewInit(): void {
    // Open the modal if we have a task title
    if (this.taskTitle && this.reminderModal) {
      this.reminderModal.openModal();
    }
  }

  onModalClosed() {
    this.initialReminderTitle = '';
    this.taskTitle = null;
  }

  onReminderCreated(reminder: Reminder) {
    // Refresh the reminders list
    this.reminderService.getAllRemindersByUser().subscribe((data)=> {
      this.reminders.set(data);
    });
  }

  toggleAcknowledge(reminder: Reminder) {
    if (reminder.id) {
      this.reminderService.toggleAcknowledge(reminder.id).subscribe(() => {
        this.reminderService.getAllRemindersByUser().subscribe((data)=> {
          this.reminders.set(data);
        });
      });
    }
  }
}

