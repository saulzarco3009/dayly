'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Task,
  Exam,
  Project,
  Habit,
  Goal,
  Routine,
  Note,
  UserSettings,
  DailyReflection,
  NavTab,
} from '@/types/dayly';
import { getTodayStr, addDays, getDaysDifference } from '@/utils/dateUtils';
import { getInitialSeedData } from '@/utils/seedData';

const STORAGE_KEY = 'dayly_productivity_v1';

export type QuickAddType = 'task' | 'exam' | 'project' | 'habit' | 'goal' | 'note';

interface DaylyContextType {
  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Data
  tasks: Task[];
  exams: Exam[];
  projects: Project[];
  habits: Habit[];
  goals: Goal[];
  routines: Routine[];
  reflections: Record<string, DailyReflection>;
  notes: Note[];
  settings: UserSettings;
  isLoaded: boolean;

  // Quick Add Modal
  quickAddOpen: boolean;
  quickAddType: QuickAddType;
  openQuickAdd: (type?: QuickAddType) => void;
  closeQuickAdd: () => void;

  // Task Operations
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  moveTaskDay: (id: string, newDate: string) => void;

  // Exam Operations
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => Exam;
  updateExam: (id: string, updates: Partial<Exam>) => void;
  deleteExam: (id: string) => void;
  toggleExamTopic: (examId: string, topicId: string) => void;
  breakExamIntoStudySessions: (examId: string, sessionsCount: number) => void;

  // Project Operations
  addProject: (project: Omit<Project, 'id' | 'createdAt'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  toggleProjectMilestone: (projectId: string, milestoneId: string) => void;

  // Habit Operations
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'history'>) => Habit;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  toggleHabitForDate: (habitId: string, dateStr: string) => void;

  // Goal Operations
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => Goal;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  toggleGoalMilestone: (goalId: string, milestoneId: string) => void;

  // Routine Operations
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'completions'>) => Routine;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  toggleRoutineStep: (routineId: string, stepId: string, dateStr: string) => void;

  // Reflection Operations
  saveDailyReflection: (reflection: DailyReflection) => void;

  // Note Operations
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;

  // Settings & Storage
  updateSettings: (updates: Partial<UserSettings>) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  resetData: () => void;
}

const DaylyContext = createContext<DaylyContextType | undefined>(undefined);

export function DaylyProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayStr());
  const [isLoaded, setIsLoaded] = useState(false);

  // Quick Add Modal state
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<QuickAddType>('task');

  // Core entities state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [reflections, setReflections] = useState<Record<string, DailyReflection>>({});
  const [notes, setNotes] = useState<Note[]>([]);
  const [settings, setSettings] = useState<UserSettings>({
    userName: 'Alex',
    weekStartsOnMonday: true,
    soundEnabled: true,
    defaultTaskPriority: 'medium',
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.tasks && parsed.exams && parsed.projects) {
          setTasks(parsed.tasks);
          setExams(parsed.exams);
          setProjects(parsed.projects);
          setHabits(parsed.habits || []);
          setGoals(parsed.goals || []);
          setRoutines(parsed.routines || []);
          setReflections(parsed.reflections || {});
          setNotes(parsed.notes || []);
          setSettings(parsed.settings || {
            userName: 'Alex',
            weekStartsOnMonday: true,
            soundEnabled: true,
            defaultTaskPriority: 'medium',
          });
          setIsLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored DAYLY data, using seed data:', e);
    }

    // Default seed data
    const seed = getInitialSeedData();
    setTasks(seed.tasks);
    setExams(seed.exams);
    setProjects(seed.projects);
    setHabits(seed.habits);
    setGoals(seed.goals);
    setRoutines(seed.routines);
    setReflections(seed.reflections);
    setNotes(seed.notes);
    setSettings(seed.settings);
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage immediately on any state change after initial load
  useEffect(() => {
    if (!isLoaded) return;
    try {
      const payload = {
        version: 1,
        updatedAt: new Date().toISOString(),
        tasks,
        exams,
        projects,
        habits,
        goals,
        routines,
        reflections,
        notes,
        settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.error('Error saving DAYLY data to LocalStorage:', e);
    }
  }, [tasks, exams, projects, habits, goals, routines, reflections, notes, settings, isLoaded]);

  // Subtle celebratory confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#E5A6C0', '#D68EAD', '#78AC8E', '#F7EAF0'],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore if unavailable
    }
  }, []);

  // Quick Add helpers
  const openQuickAdd = useCallback((type: QuickAddType = 'task') => {
    setQuickAddType(type);
    setQuickAddOpen(true);
  }, []);

  const closeQuickAdd = useCallback(() => {
    setQuickAddOpen(false);
  }, []);

  // --- Task Methods ---
  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>): Task => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isCompleting = t.status !== 'completed';
          if (isCompleting) triggerCelebration();
          return {
            ...t,
            status: isCompleting ? 'completed' : 'pending',
            completedAt: isCompleting ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  }, [triggerCelebration]);

  const moveTaskDay = useCallback((id: string, newDate: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, dueDate: newDate } : t))
    );
  }, []);

  // --- Exam Methods ---
  const addExam = useCallback((examData: Omit<Exam, 'id' | 'createdAt'>): Exam => {
    const newExam: Exam = {
      ...examData,
      id: `exam-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setExams((prev) => [newExam, ...prev]);
    return newExam;
  }, []);

  const updateExam = useCallback((id: string, updates: Partial<Exam>) => {
    setExams((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
    );
  }, []);

  const deleteExam = useCallback((id: string) => {
    setExams((prev) => prev.filter((e) => e.id !== id));
    // Also decouple associated study tasks
    setTasks((prev) =>
      prev.map((t) => (t.examId === id ? { ...t, examId: undefined } : t))
    );
  }, []);

  const toggleExamTopic = useCallback((examId: string, topicId: string) => {
    setExams((prev) =>
      prev.map((e) => {
        if (e.id === examId) {
          const updatedTopics = e.topics.map((tp) =>
            tp.id === topicId ? { ...tp, completed: !tp.completed } : tp
          );
          const allCompleted = updatedTopics.every((tp) => tp.completed);
          if (allCompleted) triggerCelebration();
          return {
            ...e,
            topics: updatedTopics,
            status: allCompleted ? 'Completed' : 'In Progress',
          };
        }
        return e;
      })
    );
  }, [triggerCelebration]);

  /**
   * Break an exam into study sessions distributed across the days
   * leading up to the exam! Automatically creates tasks linked to the exam.
   */
  const breakExamIntoStudySessions = useCallback(
    (examId: string, sessionsCount: number) => {
      const exam = exams.find((e) => e.id === examId);
      if (!exam) return;

      const todayStr = getTodayStr();
      const daysUntil = getDaysDifference(exam.examDate, todayStr);
      const effectiveDays = Math.max(1, daysUntil);
      const count = Math.min(sessionsCount, 14);

      const newStudyTasks: Task[] = [];
      const newStudyTaskIds: string[] = [];

      for (let i = 1; i <= count; i++) {
        // Distribute sessions across available days
        const dayOffset = Math.min(
          daysUntil,
          Math.floor((i * effectiveDays) / (count + 1))
        );
        const taskDate = addDays(todayStr, Math.max(0, dayOffset));
        const taskId = `task-study-${Date.now()}-${i}`;

        const topicName =
          exam.topics[i - 1]?.name || `Study Session ${i}: Review key concepts`;

        const studyTask: Task = {
          id: taskId,
          title: `[${exam.subject}] ${topicName}`,
          description: `Targeted study session #${i} for upcoming exam on ${exam.examDate}.`,
          dueDate: taskDate,
          scheduledTime: '10:00',
          timeSlot: i % 2 === 0 ? 'afternoon' : 'morning',
          priority: 'high',
          category: 'Academic',
          status: 'pending',
          examId: exam.id,
          createdAt: new Date().toISOString(),
        };

        newStudyTasks.push(studyTask);
        newStudyTaskIds.push(taskId);
      }

      setTasks((prev) => [...newStudyTasks, ...prev]);
      setExams((prev) =>
        prev.map((e) =>
          e.id === examId
            ? {
                ...e,
                studyTaskIds: [...(e.studyTaskIds || []), ...newStudyTaskIds],
              }
            : e
        )
      );

      triggerCelebration();
    },
    [exams, triggerCelebration]
  );

  // --- Project Methods ---
  const addProject = useCallback(
    (projectData: Omit<Project, 'id' | 'createdAt'>): Project => {
      const newProj: Project = {
        ...projectData,
        id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: new Date().toISOString(),
      };
      setProjects((prev) => [newProj, ...prev]);
      return newProj;
    },
    []
  );

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    // Decouple associated tasks
    setTasks((prev) =>
      prev.map((t) => (t.projectId === id ? { ...t, projectId: undefined } : t))
    );
  }, []);

  const toggleProjectMilestone = useCallback(
    (projectId: string, milestoneId: string) => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === projectId) {
            const updatedMilestones = p.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            const allCompleted = updatedMilestones.every((m) => m.completed);
            if (allCompleted) triggerCelebration();
            return {
              ...p,
              milestones: updatedMilestones,
              status: allCompleted ? 'Completed' : p.status,
            };
          }
          return p;
        })
      );
    },
    [triggerCelebration]
  );

  // --- Habit Methods ---
  const addHabit = useCallback(
    (habitData: Omit<Habit, 'id' | 'createdAt' | 'history'>): Habit => {
      const newHabit: Habit = {
        ...habitData,
        id: `h-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        history: {},
        createdAt: new Date().toISOString(),
      };
      setHabits((prev) => [...prev, newHabit]);
      return newHabit;
    },
    []
  );

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...updates } : h))
    );
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const toggleHabitForDate = useCallback(
    (habitId: string, dateStr: string) => {
      setHabits((prev) =>
        prev.map((h) => {
          if (h.id === habitId) {
            const current = !!h.history[dateStr];
            const updatedHistory = { ...h.history, [dateStr]: !current };
            if (!current) triggerCelebration();
            return { ...h, history: updatedHistory };
          }
          return h;
        })
      );
    },
    [triggerCelebration]
  );

  // --- Goal Methods ---
  const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'createdAt'>): Goal => {
    const newGoal: Goal = {
      ...goalData,
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    return newGoal;
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  }, []);

  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const toggleGoalMilestone = useCallback(
    (goalId: string, milestoneId: string) => {
      setGoals((prev) =>
        prev.map((g) => {
          if (g.id === goalId) {
            const updated = g.milestones.map((m) =>
              m.id === milestoneId ? { ...m, completed: !m.completed } : m
            );
            if (updated.every((m) => m.completed)) triggerCelebration();
            return { ...g, milestones: updated };
          }
          return g;
        })
      );
    },
    [triggerCelebration]
  );

  // --- Routine Methods ---
  const addRoutine = useCallback(
    (routineData: Omit<Routine, 'id' | 'createdAt' | 'completions'>): Routine => {
      const newRoutine: Routine = {
        ...routineData,
        id: `routine-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        completions: {},
        createdAt: new Date().toISOString(),
      };
      setRoutines((prev) => [...prev, newRoutine]);
      return newRoutine;
    },
    []
  );

  const updateRoutine = useCallback((id: string, updates: Partial<Routine>) => {
    setRoutines((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  }, []);

  const deleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const toggleRoutineStep = useCallback(
    (routineId: string, stepId: string, dateStr: string) => {
      setRoutines((prev) =>
        prev.map((r) => {
          if (r.id === routineId) {
            const currentSteps = r.completions[dateStr] || [];
            const isCompleted = currentSteps.includes(stepId);
            const newSteps = isCompleted
              ? currentSteps.filter((id) => id !== stepId)
              : [...currentSteps, stepId];

            if (!isCompleted && newSteps.length === r.steps.length) {
              triggerCelebration();
            }

            return {
              ...r,
              completions: {
                ...r.completions,
                [dateStr]: newSteps,
              },
            };
          }
          return r;
        })
      );
    },
    [triggerCelebration]
  );

  // --- Reflection Methods ---
  const saveDailyReflection = useCallback((reflection: DailyReflection) => {
    setReflections((prev) => ({
      ...prev,
      [reflection.date]: reflection,
    }));
  }, []);

  // --- Note Methods ---
  const addNote = useCallback(
    (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note => {
      const now = new Date().toISOString();
      const newNote: Note = {
        ...noteData,
        id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: now,
        updatedAt: now,
      };
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    },
    []
  );

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // --- Settings & Storage ---
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const exportData = useCallback((): string => {
    const payload = {
      app: 'DAYLY',
      version: 1,
      exportedAt: new Date().toISOString(),
      tasks,
      exams,
      projects,
      habits,
      goals,
      routines,
      reflections,
      notes,
      settings,
    };
    return JSON.stringify(payload, null, 2);
  }, [tasks, exams, projects, habits, goals, routines, reflections, notes, settings]);

  const importData = useCallback((jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error('Invalid DAYLY backup schema.');
      }

      setTasks(parsed.tasks || []);
      setExams(parsed.exams || []);
      setProjects(parsed.projects || []);
      setHabits(parsed.habits || []);
      setGoals(parsed.goals || []);
      setRoutines(parsed.routines || []);
      setReflections(parsed.reflections || {});
      setNotes(parsed.notes || []);
      if (parsed.settings) setSettings(parsed.settings);

      return true;
    } catch (e) {
      console.error('Import backup failed:', e);
      return false;
    }
  }, []);

  const resetData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    const seed = getInitialSeedData();
    setTasks(seed.tasks);
    setExams(seed.exams);
    setProjects(seed.projects);
    setHabits(seed.habits);
    setGoals(seed.goals);
    setRoutines(seed.routines);
    setReflections(seed.reflections);
    setNotes(seed.notes);
    setSettings(seed.settings);
  }, []);

  return (
    <DaylyContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        tasks,
        exams,
        projects,
        habits,
        goals,
        routines,
        reflections,
        notes,
        settings,
        isLoaded,
        quickAddOpen,
        quickAddType,
        openQuickAdd,
        closeQuickAdd,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        moveTaskDay,
        addExam,
        updateExam,
        deleteExam,
        toggleExamTopic,
        breakExamIntoStudySessions,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectMilestone,
        addHabit,
        updateHabit,
        deleteHabit,
        toggleHabitForDate,
        addGoal,
        updateGoal,
        deleteGoal,
        toggleGoalMilestone,
        addRoutine,
        updateRoutine,
        deleteRoutine,
        toggleRoutineStep,
        saveDailyReflection,
        addNote,
        updateNote,
        deleteNote,
        updateSettings,
        exportData,
        importData,
        resetData,
      }}
    >
      {children}
    </DaylyContext.Provider>
  );
}

export function useDayly() {
  const context = useContext(DaylyContext);
  if (!context) {
    throw new Error('useDayly must be used within a DaylyProvider');
  }
  return context;
}
