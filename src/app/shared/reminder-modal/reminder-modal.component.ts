import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Reminder } from '../../model/reminder';
import { ReminderService } from '../../services/reminder.service';
import { ButtonComponent } from "../button/button.component";


declare var bootstrap: any;

@Component({
  selector: 'app-reminder-modal',
  imports: [FormsModule, ButtonComponent],
  templateUrl: './reminder-modal.component.html',
  styleUrl: './reminder-modal.component.css'
})
export class ReminderModalComponent {

  @ViewChild('reminderModalRef') modalRef!: ElementRef;

   reminderService = inject(ReminderService);

  newReminder: Reminder = {
    title: "",
    description: "",
    reminderDateTime: new Date(),
    isAcknowledged: false,
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
}
