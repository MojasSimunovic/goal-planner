export interface Reminder {
  id?: string;
  title: string,
  description: string,
  reminderDateTime: Date,
  isAcknowledged: Boolean,
  userId?: string
}