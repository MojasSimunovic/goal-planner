export interface Task {
  taskId: number,
  taskName: string,
  description: string,
  frequency: string,
  createdDate: Date, // ISO date string
  startDate: string,   // ISO date string
  dueDate: string,     // ISO date string
  isCompleted: boolean,
  userId: number
}