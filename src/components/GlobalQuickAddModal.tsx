'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckSquare,
  GraduationCap,
  FolderKanban,
  Sparkles,
  Flag,
  FileText,
  Clock,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useDayly, QuickAddType } from '@/context/DaylyContext';
import { getTodayStr, addDays } from '@/utils/dateUtils';
import { Priority, TimeSlot } from '@/types/dayly';

const QUICK_ADD_TABS: { id: QuickAddType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'task', label: 'Task', icon: CheckSquare },
  { id: 'exam', label: 'Exam', icon: GraduationCap },
  { id: 'project', label: 'Project', icon: FolderKanban },
  { id: 'habit', label: 'Habit', icon: Sparkles },
  { id: 'goal', label: 'Goal', icon: Flag },
  { id: 'note', label: 'Note', icon: FileText },
];

export function GlobalQuickAddModal() {
  const {
    quickAddOpen,
    quickAddType,
    closeQuickAdd,
    addTask,
    addExam,
    addProject,
    addHabit,
    addGoal,
    addNote,
    projects,
    exams,
  } = useDayly();

  const [activeTab, setActiveTab] = useState<QuickAddType>('task');

  // Task form state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(getTodayStr());
  const [taskTime, setTaskTime] = useState('');
  const [taskTimeSlot, setTaskTimeSlot] = useState<TimeSlot>('morning');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskExamId, setTaskExamId] = useState('');

  // Exam form state
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState(addDays(getTodayStr(), 7));
  const [examDifficulty, setExamDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [examTopicsInput, setExamTopicsInput] = useState('');
  const [examNotes, setExamNotes] = useState('');

  // Project form state
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectDeadline, setProjectDeadline] = useState(addDays(getTodayStr(), 14));
  const [projectNotes, setProjectNotes] = useState('');

  // Habit form state
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Health');
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');

  // Goal form state
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<'Personal' | 'Professional' | 'Academic' | 'Health' | 'Financial'>('Personal');
  const [goalTargetDate, setGoalTargetDate] = useState(addDays(getTodayStr(), 30));
  const [goalMilestone, setGoalMilestone] = useState('');

  // Note form state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Ideas');

  // Sync active tab with context quickAddType
  useEffect(() => {
    if (quickAddType) {
      setActiveTab(quickAddType);
    }
  }, [quickAddType]);

  // Handle ESC key and keyboard shortcut 'n'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && quickAddOpen) {
        closeQuickAdd();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quickAddOpen, closeQuickAdd]);

  if (!quickAddOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'task') {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle.trim(),
        dueDate: taskDueDate || getTodayStr(),
        scheduledTime: taskTime || undefined,
        timeSlot: taskTimeSlot,
        priority: taskPriority,
        category: taskCategory,
        status: 'pending',
        notes: taskNotes || undefined,
        projectId: taskProjectId || undefined,
        examId: taskExamId || undefined,
      });
      setTaskTitle('');
      setTaskNotes('');
    } else if (activeTab === 'exam') {
      if (!examSubject.trim()) return;
      const topicsList = examTopicsInput
        .split('\n')
        .map((t) => t.trim())
        .filter(Boolean)
        .map((name, i) => ({ id: `tp-${Date.now()}-${i}`, name, completed: false }));

      addExam({
        subject: examSubject.trim(),
        examDate: examDate || addDays(getTodayStr(), 7),
        difficulty: examDifficulty,
        status: 'Upcoming',
        topics: topicsList.length ? topicsList : [{ id: `tp-${Date.now()}-1`, name: 'Core Exam Review', completed: false }],
        notes: examNotes || undefined,
      });
      setExamSubject('');
      setExamTopicsInput('');
      setExamNotes('');
    } else if (activeTab === 'project') {
      if (!projectName.trim()) return;
      addProject({
        name: projectName.trim(),
        description: projectDesc.trim(),
        startDate: getTodayStr(),
        deadline: projectDeadline || addDays(getTodayStr(), 14),
        status: 'In Progress',
        notes: projectNotes || undefined,
        milestones: [{ id: `m-${Date.now()}`, title: 'Project Kickoff & Outline', completed: false }],
      });
      setProjectName('');
      setProjectDesc('');
      setProjectNotes('');
    } else if (activeTab === 'habit') {
      if (!habitName.trim()) return;
      addHabit({
        name: habitName.trim(),
        category: habitCategory,
        frequency: habitFrequency,
      });
      setHabitName('');
    } else if (activeTab === 'goal') {
      if (!goalTitle.trim()) return;
      addGoal({
        title: goalTitle.trim(),
        category: goalCategory,
        targetDate: goalTargetDate || addDays(getTodayStr(), 30),
        milestones: goalMilestone.trim()
          ? [{ id: `gm-${Date.now()}`, title: goalMilestone.trim(), completed: false }]
          : [{ id: `gm-${Date.now()}`, title: 'First Milestone', completed: false }],
      });
      setGoalTitle('');
      setGoalMilestone('');
    } else if (activeTab === 'note') {
      if (!noteTitle.trim()) return;
      addNote({
        title: noteTitle.trim(),
        content: noteContent.trim(),
        category: noteCategory,
        isPinned: false,
      });
      setNoteTitle('');
      setNoteContent('');
    }

    closeQuickAdd();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeQuickAdd}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F0EBEF] z-10 overflow-hidden animate-fade-in">
        {/* Top Header */}
        <div className="px-6 pt-5 pb-4 border-b border-[#F0EBEF] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#29252B]">
              Quick Create
            </h2>
            <p className="text-xs text-[#928A91]">
              Capture anything into DAYLY in seconds
            </p>
          </div>
          <button
            onClick={closeQuickAdd}
            className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Type Switcher Tabs */}
        <div className="flex border-b border-[#F0EBEF] bg-[#FCFAFB] px-4 overflow-x-auto">
          {QUICK_ADD_TABS.map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 py-3 px-3 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                  isCurrent
                    ? 'border-[#D68EAD] text-[#29252B] font-semibold bg-white rounded-t-lg -mb-[1px]'
                    : 'border-transparent text-[#928A91] hover:text-[#29252B]'
                }`}
              >
                <Icon
                  size={14}
                  className={isCurrent ? 'text-[#D68EAD]' : 'text-[#928A91]'}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* TASK FORM */}
          {activeTab === 'task' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Complete System Architecture review..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={taskTime}
                    onChange={(e) => setTaskTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Time Slot
                  </label>
                  <select
                    value={taskTimeSlot}
                    onChange={(e) => setTaskTimeSlot(e.target.value as TimeSlot)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="morning">Morning</option>
                    <option value="afternoon">Afternoon</option>
                    <option value="evening">Evening</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Category
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Academic">Academic</option>
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Project">Project</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              {projects.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Link to Project (Optional)
                  </label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {exams.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Link to Exam (Optional)
                  </label>
                  <select
                    value={taskExamId}
                    onChange={(e) => setTaskExamId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="">None</option>
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.subject} ({ex.examDate})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* EXAM FORM */}
          {activeTab === 'exam' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Subject / Course *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Distributed Computing & Algorithms..."
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Difficulty
                  </label>
                  <select
                    value={examDifficulty}
                    onChange={(e) => setExamDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Topics to Cover (one per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="Topic 1: Consistency models&#10;Topic 2: Consensus algorithms&#10;Topic 3: Practice mock questions"
                  value={examTopicsInput}
                  onChange={(e) => setExamTopicsInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* PROJECT FORM */}
          {activeTab === 'project' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Design Studio Launch..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief overview of goals and scope..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={projectDeadline}
                  onChange={(e) => setProjectDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* HABIT FORM */}
          {activeTab === 'habit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Habit Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Morning 10-minute meditation..."
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Category
                  </label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Health">Health</option>
                    <option value="Academic">Academic</option>
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Frequency
                  </label>
                  <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekdays">Weekdays</option>
                    <option value="weekends">Weekends</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* GOAL FORM */}
          {activeTab === 'goal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Goal Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Read 10 books on systems design..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Category
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Academic">Academic</option>
                    <option value="Professional">Professional</option>
                    <option value="Health">Health</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={goalTargetDate}
                    onChange={(e) => setGoalTargetDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  First Milestone
                </label>
                <input
                  type="text"
                  placeholder="e.g. Finish reading 'Thinking in Systems'..."
                  value={goalMilestone}
                  onChange={(e) => setGoalMilestone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* NOTE FORM */}
          {activeTab === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Thoughts on typography & space..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="Ideas, Research, Quotes..."
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Write your note or idea here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-4 border-t border-[#F0EBEF] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeQuickAdd}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#928A91] hover:text-[#29252B] hover:bg-[#FCFAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] shadow-2xs hover:shadow-xs active:scale-98 transition-all"
            >
              Save {QUICK_ADD_TABS.find((t) => t.id === activeTab)?.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
