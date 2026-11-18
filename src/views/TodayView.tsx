'use client';

import React, { useState, useEffect } from 'react';
import {
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Edit2,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import {
  formatLongDate,
  formatFriendlyDate,
  getTodayStr,
  addDays,
} from '@/utils/dateUtils';
import { Priority, Task, TimeSlot } from '@/types/dayly';

export function TodayView() {
  const {
    tasks,
    selectedDate,
    setSelectedDate,
    toggleTaskComplete,
    deleteTask,
    updateTask,
    addTask,
    reflections,
    saveDailyReflection,
  } = useDayly();

  const todayStr = getTodayStr();
  const currentDate = selectedDate || todayStr;

  // Reflection state for this date
  const reflection = reflections[currentDate] || {
    date: currentDate,
    wentWell: '',
    improveTomorrow: '',
    mood: 'good',
  };

  const [wentWellText, setWentWellText] = useState(reflection.wentWell);
  const [improveText, setImproveText] = useState(reflection.improveTomorrow);
  const [currentMood, setCurrentMood] = useState(reflection.mood || 'good');

  // Update local inputs when date changes
  useEffect(() => {
    const curRef = reflections[currentDate];
    setWentWellText(curRef?.wentWell || '');
    setImproveText(curRef?.improveTomorrow || '');
    setCurrentMood(curRef?.mood || 'good');
  }, [currentDate, reflections]);

  // Tasks for the selected date
  const dayTasks = tasks.filter((t) => t.dueDate === currentDate);
  const completedTasks = dayTasks.filter((t) => t.status === 'completed');
  const pendingTasks = dayTasks.filter((t) => t.status !== 'completed');

  const total = dayTasks.length;
  const completed = completedTasks.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Split tasks by timeSlot (default to morning if undefined)
  const morningTasks = dayTasks.filter((t) => (t.timeSlot || 'morning') === 'morning');
  const afternoonTasks = dayTasks.filter((t) => t.timeSlot === 'afternoon');
  const eveningTasks = dayTasks.filter((t) => t.timeSlot === 'evening');

  // Inline add state
  const [activeSlotInput, setActiveSlotInput] = useState<TimeSlot | null>(null);
  const [slotTaskTitle, setSlotTaskTitle] = useState('');
  const [slotTaskTime, setSlotTaskTime] = useState('');

  // Edit task modal
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleCreateSlotTask = (slot: TimeSlot) => {
    if (!slotTaskTitle.trim()) return;
    addTask({
      title: slotTaskTitle.trim(),
      dueDate: currentDate,
      timeSlot: slot,
      scheduledTime: slotTaskTime || undefined,
      priority: 'medium',
      category: 'Personal',
      status: 'pending',
    });
    setSlotTaskTitle('');
    setSlotTaskTime('');
    setActiveSlotInput(null);
  };

  const handleSaveReflection = () => {
    saveDailyReflection({
      date: currentDate,
      wentWell: wentWellText,
      improveTomorrow: improveText,
      mood: currentMood as any,
    });
  };

  const renderSlotSection = (
    title: string,
    slot: TimeSlot,
    slotTasks: Task[],
    icon: React.ReactNode,
    timeRange: string
  ) => {
    return (
      <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 transition-all">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBEF] mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#D68EAD]">
              {icon}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#29252B]">{title}</h3>
              <span className="text-[10px] text-[#928A91]">{timeRange}</span>
            </div>
          </div>

          <span className="text-xs text-[#928A91] font-medium bg-[#FCFAFB] px-2 py-0.5 rounded-lg border border-[#F0EBEF]">
            {slotTasks.length} {slotTasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {/* Tasks in Slot */}
        <div className="space-y-2">
          {slotTasks.length === 0 ? (
            <div className="py-5 text-center text-xs text-[#928A91] italic bg-[#FCFAFB]/50 rounded-xl border border-dashed border-[#F0EBEF]">
              No tasks scheduled for {title.toLowerCase()}.
            </div>
          ) : (
            slotTasks.map((task) => {
              const isDone = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`group flex items-start justify-between p-3 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-[#FCFAFB] border-[#F6F2F5] text-[#928A91]'
                      : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/50'
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1 min-w-0 pr-2">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className={`mt-0.5 shrink-0 transition-colors ${
                        isDone ? 'text-[#78AC8E]' : 'text-[#928A91] group-hover:text-[#D68EAD]'
                      }`}
                    >
                      {isDone ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs leading-relaxed ${
                          isDone
                            ? 'line-through text-[#928A91]'
                            : 'text-[#29252B] font-medium'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                        {task.scheduledTime && (
                          <span className="text-[#928A91] flex items-center bg-[#FCFAFB] px-1.5 py-0.2 rounded border border-[#F0EBEF]">
                            <Clock size={10} className="mr-1" />
                            {task.scheduledTime}
                          </span>
                        )}
                        <span
                          className={`font-semibold uppercase px-1.5 py-0.2 rounded ${
                            task.priority === 'high'
                              ? 'bg-[#FDF0F2] text-[#DF7682]'
                              : task.priority === 'medium'
                              ? 'bg-[#FDF6EE] text-[#E4A86C]'
                              : 'bg-[#FCFAFB] text-[#928A91]'
                          }`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[#928A91] bg-[#FCFAFB] px-1.5 py-0.2 rounded border border-[#F0EBEF]">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Slot Switcher & Delete */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1.5 transition-opacity">
                    {/* Move to another time slot */}
                    <select
                      value={task.timeSlot || 'morning'}
                      onChange={(e) =>
                        updateTask(task.id, { timeSlot: e.target.value as TimeSlot })
                      }
                      className="text-[10px] bg-[#FCFAFB] border border-[#F0EBEF] rounded-lg px-1.5 py-1 text-[#928A91] hover:text-[#29252B]"
                      title="Move to another time block"
                    >
                      <option value="morning">Morning</option>
                      <option value="afternoon">Afternoon</option>
                      <option value="evening">Evening</option>
                    </select>

                    <button
                      onClick={() => setEditingTask(task)}
                      className="p-1 text-[#928A91] hover:text-[#29252B] transition-colors"
                      title="Edit task"
                    >
                      <Edit2 size={13} />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-1 text-[#928A91] hover:text-[#DF7682] transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Inline Add Task for Slot */}
        {activeSlotInput === slot ? (
          <div className="mt-3 pt-3 border-t border-[#F0EBEF] space-y-2">
            <input
              type="text"
              autoFocus
              placeholder={`Add task to ${title}...`}
              value={slotTaskTitle}
              onChange={(e) => setSlotTaskTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateSlotTask(slot);
                if (e.key === 'Escape') setActiveSlotInput(null);
              }}
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#E5A6C0] bg-white focus:outline-none"
            />
            <div className="flex items-center justify-between text-xs">
              <input
                type="time"
                value={slotTaskTime}
                onChange={(e) => setSlotTaskTime(e.target.value)}
                className="px-2 py-1 text-xs border border-[#F0EBEF] rounded-lg bg-[#FCFAFB]"
              />
              <div className="space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveSlotInput(null)}
                  className="text-xs text-[#928A91] hover:text-[#29252B]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCreateSlotTask(slot)}
                  className="text-xs font-semibold px-3 py-1 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setActiveSlotInput(slot);
              setSlotTaskTitle('');
              setSlotTaskTime('');
            }}
            className="w-full mt-3 py-2 text-xs font-medium text-[#928A91] hover:text-[#D68EAD] hover:bg-[#FCFAFB] rounded-xl border border-dashed border-[#F0EBEF] flex items-center justify-center space-x-1 transition-all"
          >
            <Plus size={13} />
            <span>Add task to {title}</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Date Header & Stepper */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#29252B]">
              {formatLongDate(currentDate)}
            </h2>
            {currentDate === todayStr && (
              <span className="text-[10px] font-bold uppercase bg-[#E5A6C0] text-white px-2 py-0.5 rounded-full">
                Today
              </span>
            )}
          </div>
          <p className="text-xs text-[#928A91] mt-0.5">
            {completed} of {total} tasks completed &middot; {percent}% daily progress
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {currentDate !== todayStr && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs font-semibold text-[#D68EAD] bg-[#FBEFF4] hover:bg-[#F7EAF0] px-3 py-1.5 rounded-xl border border-[#F0EBEF] transition-colors"
            >
              Back to Today
            </button>
          )}

          <div className="flex items-center space-x-1 border border-[#F0EBEF] rounded-xl p-0.5 bg-[#FCFAFB]">
            <button
              onClick={() => setSelectedDate(addDays(currentDate, -1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#928A91] hover:text-[#29252B] transition-colors"
              title="Previous day"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setSelectedDate(addDays(currentDate, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#928A91] hover:text-[#29252B] transition-colors"
              title="Next day"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Header */}
      <div className="w-full h-2 rounded-full bg-white border border-[#F0EBEF] overflow-hidden">
        <div
          className="h-full bg-[#E5A6C0] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* 3 TIME SECTIONS: MORNING, AFTERNOON, EVENING */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {renderSlotSection(
          'Morning Focus',
          'morning',
          morningTasks,
          <Sunrise size={18} />,
          '06:00 – 12:00'
        )}
        {renderSlotSection(
          'Afternoon Momentum',
          'afternoon',
          afternoonTasks,
          <Sun size={18} />,
          '12:00 – 18:00'
        )}
        {renderSlotSection(
          'Evening Wind-Down',
          'evening',
          eveningTasks,
          <Moon size={18} />,
          '18:00 – 23:00'
        )}
      </div>

      {/* DAILY REFLECTION SECTION */}
      <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-[#F0EBEF]">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles size={16} className="text-[#D68EAD]" />
              <h3 className="text-base font-semibold text-[#29252B]">
                Daily Reflection & Mindset
              </h3>
            </div>
            <p className="text-xs text-[#928A91] mt-0.5">
              Pause for 2 minutes to synthesize today&apos;s learnings and reset for tomorrow.
            </p>
          </div>

          {/* Mood Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-medium text-[#928A91]">Today&apos;s Mood:</span>
            <div className="flex items-center space-x-1 bg-[#FCFAFB] p-1 rounded-xl border border-[#F0EBEF]">
              {[
                { id: 'great', label: 'Great', emoji: '✨' },
                { id: 'good', label: 'Good', emoji: '🌿' },
                { id: 'neutral', label: 'Calm', emoji: '☕' },
                { id: 'tired', label: 'Tired', emoji: '🌙' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    setCurrentMood(m.id as any);
                    saveDailyReflection({
                      date: currentDate,
                      wentWell: wentWellText,
                      improveTomorrow: improveText,
                      mood: m.id as any,
                    });
                  }}
                  className={`px-2 py-1 text-xs rounded-lg transition-all ${
                    currentMood === m.id
                      ? 'bg-[#FBEFF4] text-[#D68EAD] font-bold border border-[#E5A6C0]'
                      : 'text-[#928A91] hover:text-[#29252B]'
                  }`}
                >
                  <span className="mr-1">{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#29252B] mb-1.5">
              1. What went well today?
            </label>
            <textarea
              rows={3}
              placeholder="Reflect on key wins, moments of deep focus, or gratitude..."
              value={wentWellText}
              onChange={(e) => setWentWellText(e.target.value)}
              onBlur={handleSaveReflection}
              className="w-full p-3 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#29252B] mb-1.5">
              2. What should I improve tomorrow?
            </label>
            <textarea
              rows={3}
              placeholder="What could be streamlined, simplified, or adjusted tomorrow?..."
              value={improveText}
              onChange={(e) => setImproveText(e.target.value)}
              onBlur={handleSaveReflection}
              className="w-full p-3 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white transition-colors"
            />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-[#928A91]">
          <span>Notes are saved locally & automatically</span>
          <button
            onClick={handleSaveReflection}
            className="text-xs font-semibold text-[#D68EAD] hover:underline"
          >
            Save Reflection
          </button>
        </div>
      </div>

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setEditingTask(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#F0EBEF] p-6 z-10 space-y-4">
            <h3 className="text-sm font-semibold text-[#29252B]">Edit Task</h3>
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
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Time Slot
                </label>
                <select
                  value={editingTask.timeSlot || 'morning'}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      timeSlot: e.target.value as TimeSlot,
                    })
                  }
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF]"
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
                  value={editingTask.priority}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      priority: e.target.value as Priority,
                    })
                  }
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
