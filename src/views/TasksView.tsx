'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit3,
  Calendar,
  GraduationCap,
  FolderKanban,
  ArrowUpDown,
  Tag,
  X,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { formatFriendlyDate, getTodayStr } from '@/utils/dateUtils';
import { Priority, Task, TaskStatus, TimeSlot } from '@/types/dayly';

type SortOption = 'dueDate' | 'priority' | 'title' | 'status';

export function TasksView() {
  const {
    tasks,
    projects,
    exams,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    addTask,
    openQuickAdd,
  } = useDayly();

  const todayStr = getTodayStr();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('dueDate');

  // Modal / Drawer state for full editing
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fast inline creator
  const [fastTitle, setFastTitle] = useState('');
  const [fastDate, setFastDate] = useState(todayStr);
  const [fastPriority, setFastPriority] = useState<Priority>('medium');

  const categories = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => {
      if (t.category) set.add(t.category);
    });
    return ['all', ...Array.from(set)];
  }, [tasks]);

  // Filtered and sorted tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(q);
          const matchesDesc = task.description?.toLowerCase().includes(q);
          const matchesNotes = task.notes?.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesNotes) return false;
        }

        // Status
        if (statusFilter === 'pending' && task.status === 'completed') return false;
        if (statusFilter === 'completed' && task.status !== 'completed') return false;
        if (statusFilter === 'in_progress' && task.status !== 'in_progress') return false;

        // Priority
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Category
        if (categoryFilter !== 'all' && task.category.toLowerCase() !== categoryFilter.toLowerCase())
          return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          return a.dueDate.localeCompare(b.dueDate);
        }
        if (sortBy === 'priority') {
          const score = (p: Priority) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
          return score(b.priority) - score(a.priority);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'status') {
          return a.status.localeCompare(b.status);
        }
        return 0;
      });
  }, [tasks, searchQuery, statusFilter, priorityFilter, categoryFilter, sortBy]);

  const handleFastAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fastTitle.trim()) return;
    addTask({
      title: fastTitle.trim(),
      dueDate: fastDate || todayStr,
      priority: fastPriority,
      category: 'Personal',
      status: 'pending',
    });
    setFastTitle('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Header & Fast Creation Bar */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
              Tasks & To-Dos
            </h2>
            <p className="text-xs text-[#928A91]">
              Manage and track every task across projects, academics, and personal life.
            </p>
          </div>

          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
          >
            <Plus size={15} className="text-[#D68EAD]" />
            <span>New Task</span>
          </button>
        </div>

        {/* Quick Inline Creation Input */}
        <form onSubmit={handleFastAdd} className="flex flex-wrap sm:flex-nowrap gap-2 pt-2">
          <input
            type="text"
            placeholder="Quick task title... (Press Enter to add)"
            value={fastTitle}
            onChange={(e) => setFastTitle(e.target.value)}
            className="flex-1 min-w-[200px] px-3.5 py-2 text-xs rounded-xl border border-[#F0EBEF] focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white focus:outline-none"
          />
          <input
            type="date"
            value={fastDate}
            onChange={(e) => setFastDate(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] text-[#29252B]"
          />
          <select
            value={fastPriority}
            onChange={(e) => setFastPriority(e.target.value as Priority)}
            className="px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <button
            type="submit"
            className="px-4 py-2 bg-[#FBEFF4] text-[#29252B] hover:bg-[#F7EAF0] border border-[#F0EBEF] rounded-xl text-xs font-semibold shrink-0"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#F0EBEF] shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#928A91]"
            />
            <input
              type="text"
              placeholder="Search tasks, notes or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#F0EBEF] focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#928A91] hover:text-[#29252B]"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-[#928A91] flex items-center shrink-0">
              <ArrowUpDown size={13} className="mr-1" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1.5 rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] text-xs font-medium text-[#29252B]"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="title">Title (A-Z)</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F0EBEF]">
          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-[#FCFAFB] p-1 rounded-xl border border-[#F0EBEF]">
            {(['all', 'pending', 'in_progress', 'completed'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-white text-[#29252B] font-semibold shadow-2xs border border-[#F0EBEF]'
                    : 'text-[#928A91] hover:text-[#29252B]'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] capitalize"
          >
            <option value="all">All Categories</option>
            {categories
              .filter((c) => c !== 'all')
              .map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
          </select>

          <span className="ml-auto text-xs text-[#928A91]">
            Showing {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
            <p className="text-xs text-[#928A91] mb-2">No tasks found matching your filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              className="text-xs font-semibold text-[#D68EAD] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const project = projects.find((p) => p.id === task.projectId);
            const exam = exams.find((e) => e.id === task.examId);

            return (
              <div
                key={task.id}
                className={`group bg-white rounded-2xl border p-4 transition-all shadow-2xs hover:shadow-xs ${
                  isDone
                    ? 'border-[#F6F2F5] bg-[#FCFAFB]/70 text-[#928A91]'
                    : 'border-[#F0EBEF] hover:border-[#E5A6C0]/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-0.5 shrink-0 transition-colors ${
                        isDone ? 'text-[#78AC8E]' : 'text-[#928A91] group-hover:text-[#D68EAD]'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            isDone ? 'line-through text-[#928A91]' : 'text-[#29252B]'
                          }`}
                        >
                          {task.title}
                        </span>

                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-[#FDF0F2] text-[#DF7682] border border-[#FAD8DC]'
                              : task.priority === 'medium'
                              ? 'bg-[#FDF6EE] text-[#E4A86C] border border-[#FAECD9]'
                              : 'bg-[#FCFAFB] text-[#928A91] border border-[#F0EBEF]'
                          }`}
                        >
                          {task.priority}
                        </span>

                        <span className="text-[10px] text-[#928A91] bg-[#FCFAFB] px-1.5 py-0.5 rounded border border-[#F0EBEF]">
                          {task.category}
                        </span>

                        {task.status === 'in_progress' && (
                          <span className="text-[9px] font-semibold text-[#D68EAD] bg-[#FBEFF4] px-1.5 py-0.5 rounded">
                            In Progress
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-xs text-[#928A91] mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Meta badges: Due Date, Project, Exam */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-[#928A91]">
                        <span className="flex items-center">
                          <Calendar size={11} className="mr-1 text-[#928A91]" />
                          {formatFriendlyDate(task.dueDate)}
                        </span>

                        {task.scheduledTime && (
                          <span className="flex items-center">
                            <Clock size={11} className="mr-1 text-[#928A91]" />
                            {task.scheduledTime}
                          </span>
                        )}

                        {project && (
                          <span className="flex items-center text-[#78AC8E] font-medium bg-[#EBF5F0] px-1.5 py-0.2 rounded">
                            <FolderKanban size={10} className="mr-1" />
                            {project.name}
                          </span>
                        )}

                        {exam && (
                          <span className="flex items-center text-[#DF7682] font-medium bg-[#FDF0F2] px-1.5 py-0.2 rounded">
                            <GraduationCap size={10} className="mr-1" />
                            {exam.subject}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1.5 text-[#928A91] hover:text-[#29252B] hover:bg-[#FCFAFB] rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-[#928A91] hover:text-[#DF7682] hover:bg-[#FDF0F2] rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FULL TASK EDITING MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingTask(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F0EBEF] z-10 overflow-hidden animate-fade-in p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBEF]">
              <h3 className="text-base font-semibold text-[#29252B]">Edit Task</h3>
              <button
                onClick={() => setEditingTask(null)}
                className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={editingTask.description || ''}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, description: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, dueDate: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Scheduled Time
                  </label>
                  <input
                    type="time"
                    value={editingTask.scheduledTime || ''}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        scheduledTime: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        priority: e.target.value as Priority,
                      })
                    }
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Status
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        status: e.target.value as TaskStatus,
                      })
                    }
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editingTask.category}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, category: e.target.value })
                    }
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows={2}
                  value={editingTask.notes || ''}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F0EBEF]">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-3 py-1.5 text-xs text-[#928A91]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateTask(editingTask.id, editingTask);
                  setEditingTask(null);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-[#FBEFF4] border border-[#E5A6C0] text-[#29252B] rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
