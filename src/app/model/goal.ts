export interface Goal {
  goalName: string,
  description: string,
  startDate: string,
  endDate: string,
  isAchieved: boolean,
  userId?: string, 
  id?: string,
  milestones: [
    {
      milestoneName: string,
      description: string,
      targetDate: string,
      isCompleted: boolean
    }
  ]
}