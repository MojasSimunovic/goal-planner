export interface Goal {
  goalId: number,
  goalName: string,
  description: string,
  startDate: string,
  endDate: string,
  isAchieved: boolean,
  userId: number, 
  milestones: [
    {
      milestoneId: number,
      milestoneName: string,
      description: string,
      targetDate: string,
      isCompleted: boolean
    }
  ]
}

export interface GoalWithoutMilestone {

  goalId: number,
  goalName: string,
  description: string,
  startDate: string,
  endDate: string,
  isAchieved: boolean,
  userId: number, 
}