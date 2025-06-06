import { DatePipe, NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
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
  @Input() initialTitle: string = '';
  @Output() modalClosed = new EventEmitter<void>();
  @Output() reminderCreated = new EventEmitter<Reminder>();

  @ViewChild('reminderModalRef') modalRef!: ElementRef;

  reminderService = inject(ReminderService);
  private modal: any;

  newReminder: Reminder = {
    title: "",
    description: "",
    reminderDateTime: new Date(),
    isAcknowledged: false,
  }

  ngOnChanges() {
    if (this.initialTitle) {
      this.newReminder.title = this.initialTitle;
    }
  }

  ngAfterViewInit() {
    // Initialize the modal
    this.modal = new bootstrap.Modal(this.modalRef.nativeElement);
  }

  openModal() {
    if (this.modal) {
      this.modal.show();
    }
  }

  closeModal() {
    if (this.modal) {
      this.modal.hide();
    }
    this.modalClosed.emit();
    this.resetForm();
  }

  onSaveReminder() {
    this.reminderService.createNewReminder(this.newReminder).then(() => {
      this.reminderCreated.emit(this.newReminder);
      this.closeModal();
    });
  }

  private resetForm() {
    this.newReminder = {
      title: "",
      description: "",
      reminderDateTime: new Date(),
      isAcknowledged: false,
    };
  }
}
