export interface Reminder {
  reminderId: number,
  title: string,
  description: string,
  reminderDateTime: Date,
  isAcknowledged: Boolean,
  userId: number
}