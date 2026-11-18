import { Task, Exam, Project, Habit, Goal, Routine, Note, UserSettings, DailyReflection } from '@/types/dayly';
import { getTodayStr, addDays } from './dateUtils';

export function getInitialSeedData() {
  const today = getTodayStr();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);
  const day3 = addDays(today, 3);
  const day5 = addDays(today, 5);
  const day8 = addDays(today, 8);
  const day12 = addDays(today, 12);

  const initialSettings: UserSettings = {
    userName: 'Alex',
    weekStartsOnMonday: true,
    soundEnabled: true,
    defaultTaskPriority: 'medium',
  };

  const initialProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'DAYLY Mobile Companion App',
      description: 'Designing and polishing the responsive companion experience and widget sync.',
      startDate: yesterday,
      deadline: day12,
      status: 'In Progress',
      color: '#E5A6C0',
      notes: 'Focus on minimal interactions and micro-haptics.',
      milestones: [
        { id: 'm-1', title: 'Design system specifications', completed: true, dueDate: yesterday },
        { id: 'm-2', title: 'Interactive navigation prototypes', completed: true, dueDate: today },
        { id: 'm-3', title: 'Offline storage layer verification', completed: false, dueDate: day5 },
        { id: 'm-4', title: 'Beta test release', completed: false, dueDate: day12 },
      ],
      createdAt: yesterday,
    },
    {
      id: 'proj-2',
      name: 'Architectural Portfolio 2026',
      description: 'Curating modern minimalist design case studies and thesis publication.',
      startDate: addDays(today, -5),
      deadline: addDays(today, 20),
      status: 'In Progress',
      color: '#78AC8E',
      notes: 'Clean typography, high-resolution photography, monochromatic palette.',
      milestones: [
        { id: 'm-201', title: 'Select top 5 projects', completed: true },
        { id: 'm-202', title: 'Write rationale & case studies', completed: false },
        { id: 'm-203', title: 'Print layout proofs', completed: false },
      ],
      createdAt: addDays(today, -5),
    },
  ];

  const initialExams: Exam[] = [
    {
      id: 'exam-1',
      subject: 'Advanced System Architecture',
      examDate: day5,
      examTime: '10:00',
      difficulty: 'Hard',
      status: 'Upcoming',
      notes: 'Covers distributed consensus, memory models, cache coherence, and fault tolerance.',
      topics: [
        { id: 't-1', name: 'Distributed Consensus (Raft/Paxos)', completed: true },
        { id: 't-2', name: 'Event-driven Architecture & Sagas', completed: true },
        { id: 't-3', name: 'Database Partitioning & CAP Theorem', completed: false },
        { id: 't-4', name: 'Microservices Resiliency Patterns', completed: false },
        { id: 't-5', name: 'Performance Benchmarking & Profiling', completed: false },
      ],
      studyTaskIds: ['task-study-1', 'task-study-2'],
      createdAt: yesterday,
    },
    {
      id: 'exam-2',
      subject: 'Human-Computer Interaction & Ergonomics',
      examDate: day12,
      examTime: '14:30',
      difficulty: 'Medium',
      status: 'Upcoming',
      notes: 'Cognitive load, Fitts law, accessible design systems.',
      topics: [
        { id: 't-201', name: 'Gestalt Principles in UI', completed: true },
        { id: 't-202', name: 'Accessibility & WCAG 2.2 AA', completed: false },
        { id: 't-203', name: 'Qualitative User Research Methods', completed: false },
      ],
      studyTaskIds: [],
      createdAt: yesterday,
    },
  ];

  const initialTasks: Task[] = [
    // Today's Priorities
    {
      id: 'task-1',
      title: 'Review System Architecture Lecture 4: Consensus',
      description: 'Deep dive into Raft leader election and log replication notes.',
      dueDate: today,
      scheduledTime: '09:00',
      timeSlot: 'morning',
      priority: 'high',
      category: 'Academic',
      status: 'completed',
      completedAt: `${today}T10:15:00Z`,
      examId: 'exam-1',
      isPriority: true,
      createdAt: yesterday,
    },
    {
      id: 'task-2',
      title: 'Refine Navigation Micro-interactions for Mobile',
      description: 'Ensure tab switching is fluid and active states render the subtle pink accent.',
      dueDate: today,
      scheduledTime: '11:30',
      timeSlot: 'morning',
      priority: 'high',
      category: 'Project',
      status: 'in_progress',
      projectId: 'proj-1',
      isPriority: true,
      createdAt: yesterday,
    },
    {
      id: 'task-3',
      title: 'Draft weekly summary & milestone check-in',
      description: 'Document achievements, blockers, and update project deadlines.',
      dueDate: today,
      scheduledTime: '16:00',
      timeSlot: 'afternoon',
      priority: 'medium',
      category: 'Work',
      status: 'pending',
      isPriority: true,
      createdAt: yesterday,
    },
    {
      id: 'task-4',
      title: 'Prepare flashcards for CAP theorem & ACID guarantees',
      description: '30 high-yield flashcards for final revision.',
      dueDate: today,
      scheduledTime: '17:30',
      timeSlot: 'afternoon',
      priority: 'medium',
      category: 'Academic',
      status: 'pending',
      examId: 'exam-1',
      createdAt: yesterday,
    },
    {
      id: 'task-5',
      title: 'Evening reading: The Design of Everyday Things (Ch. 5)',
      description: 'Take margin notes on affordances and conceptual models.',
      dueDate: today,
      scheduledTime: '21:00',
      timeSlot: 'evening',
      priority: 'low',
      category: 'Personal',
      status: 'pending',
      createdAt: yesterday,
    },
    // Tomorrow and upcoming
    {
      id: 'task-study-1',
      title: 'Study Session 1: Sagas & Distributed Transactions',
      description: 'Exam preparation block for Advanced System Architecture.',
      dueDate: tomorrow,
      scheduledTime: '10:00',
      timeSlot: 'morning',
      priority: 'high',
      category: 'Academic',
      status: 'pending',
      examId: 'exam-1',
      createdAt: today,
    },
    {
      id: 'task-study-2',
      title: 'Study Session 2: Mock Exam & Timed Practice Questions',
      description: 'Exam preparation block for Advanced System Architecture.',
      dueDate: day3,
      scheduledTime: '14:00',
      timeSlot: 'afternoon',
      priority: 'high',
      category: 'Academic',
      status: 'pending',
      examId: 'exam-1',
      createdAt: today,
    },
    {
      id: 'task-6',
      title: 'Portfolio typography proof review',
      dueDate: day3,
      scheduledTime: '16:30',
      timeSlot: 'afternoon',
      priority: 'medium',
      category: 'Project',
      status: 'pending',
      projectId: 'proj-2',
      createdAt: today,
    },
    {
      id: 'task-7',
      title: 'Order studio paper samples & archival swatch kit',
      dueDate: day5,
      priority: 'low',
      category: 'Personal',
      status: 'pending',
      createdAt: today,
    },
    {
      id: 'task-8',
      title: 'Monthly financial audit & subscription cleanup',
      dueDate: day8,
      priority: 'medium',
      category: 'Finance',
      status: 'pending',
      createdAt: today,
    },
  ];

  const initialHabits: Habit[] = [
    {
      id: 'h-1',
      name: 'Morning Hydration & Green Tea',
      category: 'Health',
      frequency: 'daily',
      history: {
        [addDays(today, -6)]: true,
        [addDays(today, -5)]: true,
        [addDays(today, -4)]: true,
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: true,
        [yesterday]: true,
        [today]: true,
      },
      createdAt: addDays(today, -10),
    },
    {
      id: 'h-2',
      name: '25 min Focused Study Session',
      category: 'Academic',
      frequency: 'daily',
      history: {
        [addDays(today, -5)]: true,
        [addDays(today, -4)]: true,
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: true,
        [yesterday]: true,
        [today]: true,
      },
      createdAt: addDays(today, -10),
    },
    {
      id: 'h-3',
      name: 'Daily 20-min Walk in Sunlight',
      category: 'Health',
      frequency: 'daily',
      history: {
        [addDays(today, -4)]: true,
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: false,
        [yesterday]: true,
        [today]: false,
      },
      createdAt: addDays(today, -10),
    },
    {
      id: 'h-4',
      name: 'Nightly Reflection & Desk Reset',
      category: 'Personal',
      frequency: 'daily',
      history: {
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: true,
        [yesterday]: true,
        [today]: false,
      },
      createdAt: addDays(today, -10),
    },
  ];

  const initialGoals: Goal[] = [
    {
      id: 'goal-1',
      title: 'Graduate with Academic Honors (GPA 3.9+)',
      description: 'Maintain strict exam preparation routines, complete all project milestones early.',
      category: 'Academic',
      targetDate: addDays(today, 90),
      milestones: [
        { id: 'gm-1', title: 'Score A+ in System Architecture', completed: false },
        { id: 'gm-2', title: 'Submit HCI Thesis with distinctions', completed: false },
        { id: 'gm-3', title: 'Complete all 4 capstone modules', completed: true },
      ],
      associatedTaskIds: ['task-1', 'task-study-1'],
      notes: 'Consistency over cramming. 2 deep work blocks daily.',
      createdAt: addDays(today, -30),
    },
    {
      id: 'goal-2',
      title: 'Launch DAYLY Productivity App Publicly',
      description: 'Craft an unforgettable product experience with zero unnecessary clutter.',
      category: 'Professional',
      targetDate: addDays(today, 30),
      milestones: [
        { id: 'gm-201', title: 'Complete all 11 core sections', completed: true },
        { id: 'gm-202', title: 'Implement full offline LocalStorage sync', completed: true },
        { id: 'gm-203', title: 'Publish design system document', completed: false },
      ],
      associatedTaskIds: ['task-2'],
      notes: 'Simplicity is the ultimate sophistication.',
      createdAt: addDays(today, -14),
    },
    {
      id: 'goal-3',
      title: 'Read 12 Books on Design, Systems & Philosophy',
      description: 'Focus on timeless principles rather than passing trends.',
      category: 'Personal',
      targetDate: addDays(today, 120),
      milestones: [
        { id: 'gm-301', title: 'The Design of Everyday Things', completed: false },
        { id: 'gm-302', title: 'Thinking in Systems (Donella Meadows)', completed: true },
        { id: 'gm-303', title: 'Atomic Habits (James Clear)', completed: true },
      ],
      createdAt: addDays(today, -60),
    },
  ];

  const initialRoutines: Routine[] = [
    {
      id: 'routine-morning',
      name: 'Mindful Morning Routine',
      timeSlot: 'morning',
      steps: [
        { id: 'rs-1', title: 'Drink tall glass of water + stretch', durationMinutes: 5 },
        { id: 'rs-2', title: '5-minute breathwork & meditation', durationMinutes: 5 },
        { id: 'rs-3', title: 'Healthy nutrient-dense breakfast', durationMinutes: 20 },
        { id: 'rs-4', title: 'Open DAYLY & review top 3 priorities', durationMinutes: 5 },
      ],
      completions: {
        [today]: ['rs-1', 'rs-2', 'rs-3'],
        [yesterday]: ['rs-1', 'rs-2', 'rs-3', 'rs-4'],
      },
      createdAt: addDays(today, -20),
    },
    {
      id: 'routine-study',
      name: 'Deep Work & Study Session',
      timeSlot: 'afternoon',
      steps: [
        { id: 'rs-201', title: 'Clear physical desk & close browser tabs', durationMinutes: 5 },
        { id: 'rs-202', title: 'Enable Do Not Disturb on all devices', durationMinutes: 2 },
        { id: 'rs-203', title: '50-minute deep concentration sprint', durationMinutes: 50 },
        { id: 'rs-204', title: '10-minute movement & hydration break', durationMinutes: 10 },
      ],
      completions: {
        [today]: ['rs-201', 'rs-202'],
      },
      createdAt: addDays(today, -20),
    },
    {
      id: 'routine-evening',
      name: 'Evening Wind-Down & Reflection',
      timeSlot: 'evening',
      steps: [
        { id: 'rs-301', title: 'Review completed tasks in DAYLY', durationMinutes: 5 },
        { id: 'rs-302', title: 'Write daily reflection: What went well?', durationMinutes: 5 },
        { id: 'rs-303', title: 'Set tomorrow’s top 3 intentions', durationMinutes: 5 },
        { id: 'rs-304', title: 'Screens off & 20 min reading', durationMinutes: 20 },
      ],
      completions: {
        [yesterday]: ['rs-301', 'rs-302', 'rs-303', 'rs-304'],
      },
      createdAt: addDays(today, -20),
    },
  ];

  const initialReflection: DailyReflection = {
    date: today,
    wentWell: 'Maintained high focus during morning consensus lecture review. The subtle pink design system is feeling balanced and calm.',
    improveTomorrow: 'Schedule an uninterrupted 90-minute block for the HCI practice problems before opening messaging apps.',
    mood: 'great',
  };

  const initialNotes: Note[] = [
    {
      id: 'note-1',
      title: 'DAYLY Design Principles & Notes',
      content: `1. PLAN YOUR MONTH. ORGANIZE YOUR WEEK. FOCUS ON TODAY.
2. Extensive whitespace, delicate borders (#F0EBEF), soft pink accents (#E5A6C0).
3. Connect all planning levels: Month -> Week -> Day -> Task.
4. Minimalist, calm, modern, and delightful to use every single morning.`,
      category: 'Productivity',
      isPinned: true,
      createdAt: addDays(today, -3),
      updatedAt: today,
    },
    {
      id: 'note-2',
      title: 'System Architecture Key Concepts',
      content: `• Raft Consensus: Leader election with randomized timeouts, log replication, safety invariant.
• CAP Theorem: In a distributed system with network partitions (P), you can only choose between Consistency (C) or Availability (A).
• Distributed Sagas: Orchestration vs Choreography for cross-service transactions with compensating actions.`,
      category: 'Academic',
      isPinned: false,
      createdAt: yesterday,
      updatedAt: today,
    },
    {
      id: 'note-3',
      title: 'Book Recommendations & Reading List',
      content: `• "Make Time" — Jake Knapp & John Zeratsky
• "Essentialism: The Disciplined Pursuit of Less" — Greg McKeown
• "Deep Work" — Cal Newport
• "The Elements of Typographic Style" — Robert Bringhurst`,
      category: 'Reading',
      isPinned: false,
      createdAt: addDays(today, -7),
      updatedAt: yesterday,
    },
  ];

  return {
    tasks: initialTasks,
    exams: initialExams,
    projects: initialProjects,
    habits: initialHabits,
    goals: initialGoals,
    routines: initialRoutines,
    reflections: { [today]: initialReflection },
    notes: initialNotes,
    settings: initialSettings,
  };
}
