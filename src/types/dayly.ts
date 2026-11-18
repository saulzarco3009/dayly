export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  timeSlot?: TimeSlot;
  priority: Priority;
  category: string;
  status: TaskStatus;
  completedAt?: string;
  projectId?: string;
  examId?: string;
  notes?: string;
  isPriority?: boolean; // Highlighted in top 3 daily priorities
  createdAt: string;
}

export interface ExamTopic {
  id: string;
  name: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  subject: string;
  examDate: string; // YYYY-MM-DD
  examTime?: string; // HH:mm
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'Upcoming' | 'In Progress' | 'Completed';
  notes?: string;
  topics: ExamTopic[];
  studyTaskIds?: string[];
  createdAt: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  deadline: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  color?: string;
  notes?: string;
  milestones: ProjectMilestone[];
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: 'daily' | 'weekdays' | 'weekends';
  history: Record<string, boolean>; // YYYY-MM-DD -> completed
  createdAt: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
}

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'Personal' | 'Professional' | 'Academic' | 'Health' | 'Financial';
  targetDate: string; // YYYY-MM-DD
  milestones: GoalMilestone[];
  associatedTaskIds?: string[];
  notes?: string;
  createdAt: string;
}

export interface RoutineStep {
  id: string;
  title: string;
  durationMinutes?: number;
}

export interface Routine {
  id: string;
  name: string;
  timeSlot: 'morning' | 'afternoon' | 'evening' | 'anytime';
  steps: RoutineStep[];
  completions: Record<string, string[]>; // YYYY-MM-DD -> array of completed step IDs
  createdAt: string;
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  wentWell: string;
  improveTomorrow: string;
  mood?: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  isPinned?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSettings {
  userName: string;
  weekStartsOnMonday: boolean;
  soundEnabled: boolean;
  defaultTaskPriority: Priority;
}

export type NavTab =
  | 'overview'
  | 'month'
  | 'week'
  | 'today'
  | 'tasks'
  | 'exams'
  | 'projects'
  | 'habits'
  | 'goals'
  | 'routines'
  | 'notes'
  | 'settings';
