import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { UserLogin } from '../model/user';
import { Task } from '../model/task';
import { GoalService } from './goal.service';
import { getAuth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, getDoc, getDocs, orderBy, query, setDoc, where, writeBatch } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private userId: string;
  goalService = inject(GoalService);
  firestore = inject(Firestore);
  constructor() {
    const auth = getAuth();
    this.userId = auth.currentUser?.uid || '';
  }
  createTask(task: Task): Observable<void> {
    if (!this.userId) throw new Error('No user logged in');
    
    const taskData = {
      ...task,
      userId: this.userId,
      createdAt: new Date(),
      order: task.order || 0
    };
    
    return from(addDoc(collection(this.firestore, 'tasks'), taskData)).pipe(
      map(() => void 0)
    );
  }
  // Get all tasks for the current user
  getAllTasksByUser(): Observable<Task[]> {
    if (!this.userId) throw new Error('No user logged in');
    
    const tasksQuery = query(
      collection(this.firestore, 'tasks'),
      where('userId', '==', this.userId)
    );
    
    return from(getDocs(tasksQuery)).pipe(
      map(snapshot => {
        const tasks = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Task));
        
        // Sort by order on the client side
        return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
      })
    );
  }
  async getTaskById(taskId: string): Promise<Task | null> {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    const snapshot = await getDoc(taskDocRef);
    
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as Task;
    } else {
      return null;
    }
  }

  async getTasksByFrequency(frequency: string): Promise<Task[]> {
    if (!this.userId) throw new Error('No user logged in');
    
    const tasksQuery = query(
      collection(this.firestore, 'tasks'),
      where('userId', '==', this.userId),
      where('frequency', '==', frequency)
    );
    
    const snapshot = await getDocs(tasksQuery);
    const tasks = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Task));
    
    // Sort by order on the client side
    return tasks.sort((a, b) => (a.order || 0) - (b.order || 0));
  }
  async editTask(taskId: string, newFrequency: string, newIndex?: number): Promise<void> {
    if (!this.userId) throw new Error('No user logged in');

    try {
      const task = await this.getTaskById(taskId);
      if (!task) throw new Error('Task not found');

      const oldFrequency = task.frequency;
      
      // If moving to a different column
      if (oldFrequency !== newFrequency) {
        // Get tasks in the new column to determine the order
        const tasksInNewColumn = await this.getTasksByFrequency(newFrequency);
        const newOrder = newIndex !== undefined ? newIndex : tasksInNewColumn.length;
        
        // Update the task with new frequency and order
        const updatedTask: Task = {
          ...task,
          frequency: newFrequency,
          order: newOrder
        };
        
        const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
        await setDoc(taskDocRef, updatedTask);
        
        // Reorder remaining tasks in the new column if needed
        if (newIndex !== undefined && newIndex < tasksInNewColumn.length) {
          await this.reorderTasksAfterInsertion(newFrequency, newIndex, taskId);
        }
      } 
      // If reordering within the same column
      else if (newIndex !== undefined) {
        await this.reorderTasksInColumn(taskId, newFrequency, newIndex);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }
  async reorderTasksInColumn(taskId: string, frequency: string, newIndex: number): Promise<void> {
    if (!this.userId) throw new Error('No user logged in');

    try {
      // Get all tasks in the same frequency column
      const tasksInColumn = await this.getTasksByFrequency(frequency);
      
      // Find the task being moved
      const taskToMove = tasksInColumn.find(task => task.id === taskId);
      if (!taskToMove) throw new Error('Task not found');

      // Remove the task from its current position
      const filteredTasks = tasksInColumn.filter(task => task.id !== taskId);
      
      // Insert the task at the new position
      filteredTasks.splice(newIndex, 0, taskToMove);
      
      // Update order for all tasks in the column
      const batch = writeBatch(this.firestore);
      
      filteredTasks.forEach((task, index) => {
        const taskRef = doc(this.firestore, `tasks/${task.id}`);
        batch.update(taskRef, { order: index });
      });
      
      await batch.commit();
    } catch (error) {
      console.error('Error reordering tasks:', error);
      throw error;
    }
  }
  private async reorderTasksAfterInsertion(
    frequency: string, 
    insertIndex: number, 
    excludeTaskId: string
  ): Promise<void> {
    const tasksInColumn = await this.getTasksByFrequency(frequency);
    const batch = writeBatch(this.firestore);
    
    tasksInColumn
      .filter(task => task.id !== excludeTaskId)
      .forEach((task, index) => {
        const adjustedIndex = index >= insertIndex ? index + 1 : index;
        const taskRef = doc(this.firestore, `tasks/${task.id}`);
        batch.update(taskRef, { order: adjustedIndex });
      });
    
    await batch.commit();
  }
  onEditEntireTask(task: Task) {
    const taskDocRef = doc(this.firestore, `tasks/${task.id}`);
    return from(setDoc(taskDocRef, task));
  }
  // Simple version that only changes frequency (for backward compatibility)
  async editTaskFrequency(taskId: string, category: string): Promise<void> {
    return this.editTask(taskId, category);
  }
  deleteTask(taskId: string) {
    const taskDocRef = doc(this.firestore, `tasks/${taskId}`);
    return deleteDoc(taskDocRef);
  }
}