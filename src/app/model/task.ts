export interface Task {
  taskId?: string,
  taskName: string,
  description: string,
  frequency: string,
  dueDate: string,
  isCompleted: boolean,
  userId?: string
}