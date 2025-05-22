export interface Task {
  id?: string,
  taskName: string,
  description: string,
  frequency: string,
  dueDate: string,
  isCompleted: boolean,
  userId?: string,
  order?: number
}