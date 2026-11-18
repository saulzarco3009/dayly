'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  ArrowRight,
  Plus,
  Flame,
  GraduationCap,
  Sparkles,
  Calendar,
  AlertCircle,
  Target,
  ChevronRight,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import {
  getTodayStr,
  getWeekDays,
  formatFriendlyDate,
  parseISODate,
  getDaysDifference,
  addDays,
} from '@/utils/dateUtils';
import { Priority, Task } from '@/types/dayly';

export function OverviewView() {
  const {
    tasks,
    exams,
    habits,
    projects,
    toggleTaskComplete,
    addTask,
    setActiveTab,
    openQuickAdd,
    setSelectedDate,
  } = useDayly();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const todayStr = getTodayStr();

  // Tasks for today
  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const completedTodayTasks = todayTasks.filter((t) => t.status === 'completed');
  const pendingTodayTasks = todayTasks.filter((t) => t.status !== 'completed');

  const totalToday = todayTasks.length;
  const completedToday = completedTodayTasks.length;
  const completionPercentage =
    totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Top 3 Priorities: High priority or flagged isPriority pending tasks
  const topPriorities = pendingTodayTasks
    .sort((a, b) => {
      const pScore = (p: Priority) => (p === 'high' ? 3 : p === 'medium' ? 2 : 1);
      return pScore(b.priority) - pScore(a.priority);
    })
    .slice(0, 3);

  // Upcoming Exams within next 14 days
  const upcomingExams = exams
    .filter((e) => e.status !== 'Completed' && e.examDate >= todayStr)
    .sort((a, b) => a.examDate.localeCompare(b.examDate))
    .slice(0, 3);

  // Upcoming Project Deadlines
  const upcomingProjects = projects
    .filter((p) => p.status !== 'Completed' && p.deadline >= todayStr)
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 2);

  // 7-day mini calendar
  const currentWeekDays = getWeekDays(todayStr);

  const handleQuickAddTodayTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      dueDate: todayStr,
      priority: 'medium',
      category: 'Personal',
      status: 'pending',
      timeSlot: 'morning',
    });
    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* SECTION A: TODAY'S OVERVIEW STATS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Progress Card */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#928A91]">Daily Progress</span>
            <span className="text-xs font-semibold text-[#D68EAD]">
              {completionPercentage}%
            </span>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] overflow-hidden">
              <div
                className="h-full bg-[#E5A6C0] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-[#928A91]">
            <span>{completedToday} of {totalToday} tasks done</span>
            {completionPercentage === 100 && totalToday > 0 && (
              <span className="text-[#78AC8E] font-medium flex items-center">
                All done! ✨
              </span>
            )}
          </div>
        </div>

        {/* Total Tasks Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#928A91]">Today&apos;s Total</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29252B]">
              {totalToday}
            </span>
            <span className="text-xs text-[#928A91]">scheduled</span>
          </div>
          <div className="mt-2 text-[11px] text-[#928A91]">
            Plan your day carefully
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-medium text-[#928A91]">Pending Focus</span>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29252B]">
              {pendingTodayTasks.length}
            </span>
            <span className="text-xs text-[#E5A6C0] font-medium">remaining</span>
          </div>
          <div className="mt-2 text-[11px] text-[#928A91]">
            {topPriorities.length > 0 ? `${topPriorities.length} high priority` : 'Smooth pacing'}
          </div>
        </div>

        {/* Habits Checked Today */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#928A91]">Habits Active</span>
            <Sparkles size={14} className="text-[#D68EAD]" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#29252B]">
              {habits.filter((h) => h.history[todayStr]).length}
              <span className="text-base text-[#928A91] font-normal">/{habits.length}</span>
            </span>
          </div>
          <div className="mt-2 text-[11px] text-[#928A91]">
            Daily consistency streak
          </div>
        </div>
      </div>

      {/* SECTION E: TOP PRIORITIES */}
      {topPriorities.length > 0 && (
        <div className="bg-[#FBEFF4]/60 border border-[#F0EBEF] rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-md bg-[#E5A6C0] text-white flex items-center justify-center text-[10px] font-bold">
                ★
              </div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#29252B]">
                Today&apos;s Top Priorities
              </h2>
            </div>
            <span className="text-[11px] text-[#928A91]">Focus on these first</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {topPriorities.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => toggleTaskComplete(item.id)}
                className="group bg-white p-3 rounded-xl border border-[#F0EBEF] hover:border-[#E5A6C0] cursor-pointer transition-all shadow-2xs flex items-start space-x-3"
              >
                <div className="mt-0.5 text-[#928A91] group-hover:text-[#D68EAD] transition-colors">
                  <Circle size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-1.5 mb-0.5">
                    <span className="text-[10px] font-bold text-[#D68EAD]">
                      0{idx + 1}
                    </span>
                    <span className="text-[10px] text-[#928A91] px-1.5 py-0.2 rounded bg-[#FCFAFB] border border-[#F0EBEF]">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xs font-medium text-[#29252B] line-clamp-2 leading-relaxed">
                    {item.title}
                  </h3>
                  {item.scheduledTime && (
                    <span className="text-[10px] text-[#928A91] flex items-center mt-1">
                      <Clock size={10} className="mr-1" /> {item.scheduledTime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION B & C: TWO-COLUMN MAIN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLS: TODAY'S TASKS LIST */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#29252B]">
                  Today&apos;s Tasks
                </h2>
                <p className="text-xs text-[#928A91]">
                  Organized for today &middot; {todayTasks.length} total
                </p>
              </div>

              <button
                onClick={() => setActiveTab('today')}
                className="text-xs font-medium text-[#D68EAD] hover:text-[#29252B] flex items-center space-x-1 transition-colors"
              >
                <span>Planner View</span>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* Quick inline task creator */}
            <form
              onSubmit={handleQuickAddTodayTask}
              className="flex items-center space-x-2 mb-4"
            >
              <input
                type="text"
                placeholder="Add a task for today..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white transition-colors"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] hover:border-[#E5A6C0] rounded-xl text-xs font-medium flex items-center space-x-1 transition-all active:scale-98"
              >
                <Plus size={14} className="text-[#D68EAD]" />
                <span className="hidden sm:inline">Add</span>
              </button>
            </form>

            {/* Tasks list */}
            {todayTasks.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-[#F0EBEF] bg-[#FCFAFB]">
                <p className="text-xs text-[#928A91] mb-2">
                  No tasks scheduled for today yet.
                </p>
                <button
                  onClick={() => openQuickAdd('task')}
                  className="text-xs font-medium text-[#D68EAD] hover:underline"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {todayTasks.map((task) => {
                  const isCompleted = task.status === 'completed';
                  return (
                    <div
                      key={task.id}
                      className={`group flex items-start justify-between p-3 rounded-xl border transition-all ${
                        isCompleted
                          ? 'bg-[#FCFAFB] border-[#F6F2F5] text-[#928A91]'
                          : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3 flex-1 min-w-0 pr-2">
                        <button
                          type="button"
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`mt-0.5 shrink-0 transition-colors ${
                            isCompleted
                              ? 'text-[#78AC8E]'
                              : 'text-[#928A91] group-hover:text-[#D68EAD]'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <Circle size={16} />
                          )}
                        </button>

                        <div className="min-w-0 flex-1">
                          <span
                            className={`text-xs block leading-relaxed ${
                              isCompleted
                                ? 'line-through text-[#928A91]'
                                : 'text-[#29252B] font-medium'
                            }`}
                          >
                            {task.title}
                          </span>

                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {task.scheduledTime && (
                              <span className="text-[10px] text-[#928A91] flex items-center bg-[#FCFAFB] px-1.5 py-0.5 rounded border border-[#F0EBEF]">
                                <Clock size={10} className="mr-1" />
                                {task.scheduledTime}
                              </span>
                            )}

                            <span
                              className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ${
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

                            {task.timeSlot && (
                              <span className="text-[10px] text-[#D68EAD] capitalize">
                                &middot; {task.timeSlot}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SECTION D: WEEKLY MINI CALENDAR OVERVIEW */}
          <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-[#29252B]">
                  Weekly Overview
                </h3>
                <p className="text-xs text-[#928A91]">
                  Workload and scheduled activities
                </p>
              </div>
              <button
                onClick={() => setActiveTab('week')}
                className="text-xs font-medium text-[#D68EAD] hover:text-[#29252B] flex items-center space-x-1"
              >
                <span>Full Week</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {currentWeekDays.map((dateStr) => {
                const dayDate = parseISODate(dateStr);
                const dayName = dayDate.toLocaleDateString('en-US', {
                  weekday: 'narrow',
                });
                const dayNum = dayDate.getDate();
                const isCurrent = dateStr === todayStr;

                const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
                const dayCompleted = dayTasks.filter((t) => t.status === 'completed');
                const hasExams = exams.some((e) => e.examDate === dateStr);

                return (
                  <button
                    key={dateStr}
                    onClick={() => {
                      setSelectedDate(dateStr);
                      setActiveTab('today');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isCurrent
                        ? 'bg-[#FBEFF4] border-[#E5A6C0] text-[#29252B] shadow-xs'
                        : 'bg-[#FCFAFB] border-[#F0EBEF] hover:bg-white text-[#928A91] hover:text-[#29252B]'
                    }`}
                  >
                    <div className="text-[10px] font-semibold uppercase">{dayName}</div>
                    <div
                      className={`text-sm font-bold my-1 ${
                        isCurrent ? 'text-[#D68EAD]' : 'text-[#29252B]'
                      }`}
                    >
                      {dayNum}
                    </div>

                    <div className="flex items-center justify-center space-x-1 mt-1">
                      {dayTasks.length > 0 && (
                        <span
                          className={`text-[9px] font-semibold px-1 rounded ${
                            isCurrent
                              ? 'bg-white text-[#D68EAD]'
                              : 'bg-white border border-[#F0EBEF] text-[#928A91]'
                          }`}
                        >
                          {dayTasks.length}
                        </span>
                      )}
                      {hasExams && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#DF7682]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COL: UPCOMING EXAMS & DEADLINES */}
        <div className="space-y-4">
          {/* UPCOMING EXAMS WIDGET */}
          <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <GraduationCap size={16} className="text-[#D68EAD]" />
                <h3 className="text-sm font-semibold text-[#29252B]">
                  Upcoming Exams
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('exams')}
                className="text-xs text-[#D68EAD] hover:underline"
              >
                View all
              </button>
            </div>

            {upcomingExams.length === 0 ? (
              <p className="text-xs text-[#928A91] py-4 text-center">
                No upcoming exams scheduled.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingExams.map((exam) => {
                  const daysLeft = getDaysDifference(exam.examDate, todayStr);
                  const completedTopics = exam.topics.filter((t) => t.completed).length;
                  const totalTopics = exam.topics.length;
                  const prepPercent =
                    totalTopics > 0
                      ? Math.round((completedTopics / totalTopics) * 100)
                      : 0;

                  return (
                    <div
                      key={exam.id}
                      onClick={() => setActiveTab('exams')}
                      className="p-3 rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] hover:border-[#E5A6C0] cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-[#29252B]">
                            {exam.subject}
                          </h4>
                          <span className="text-[10px] text-[#928A91]">
                            {formatFriendlyDate(exam.examDate)}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            daysLeft <= 3
                              ? 'bg-[#FDF0F2] text-[#DF7682]'
                              : 'bg-[#FBEFF4] text-[#D68EAD]'
                          }`}
                        >
                          {daysLeft === 0
                            ? 'Today!'
                            : daysLeft === 1
                            ? 'Tomorrow'
                            : `${daysLeft} days left`}
                        </span>
                      </div>

                      {/* Prep progress */}
                      <div className="mt-2.5">
                        <div className="flex items-center justify-between text-[10px] text-[#928A91] mb-1">
                          <span>Topics prepared</span>
                          <span className="font-semibold">{prepPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white border border-[#F0EBEF] overflow-hidden">
                          <div
                            className="h-full bg-[#E5A6C0] rounded-full"
                            style={{ width: `${prepPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PROJECT DEADLINES WIDGET */}
          <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-[#29252B]">
                Active Projects
              </h3>
              <button
                onClick={() => setActiveTab('projects')}
                className="text-xs text-[#D68EAD] hover:underline"
              >
                View all
              </button>
            </div>

            {upcomingProjects.length === 0 ? (
              <p className="text-xs text-[#928A91] py-4 text-center">
                No active projects.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingProjects.map((project) => {
                  const completedM = project.milestones.filter((m) => m.completed).length;
                  const totalM = project.milestones.length;
                  const pPercent = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;

                  return (
                    <div
                      key={project.id}
                      onClick={() => setActiveTab('projects')}
                      className="p-3 rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] hover:border-[#E5A6C0] cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-[#29252B] truncate pr-2">
                          {project.name}
                        </h4>
                        <span className="text-[10px] text-[#928A91] shrink-0">
                          Due {formatFriendlyDate(project.deadline)}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#928A91] line-clamp-1 mt-1">
                        {project.description}
                      </p>

                      <div className="mt-2.5">
                        <div className="w-full h-1.5 rounded-full bg-white border border-[#F0EBEF] overflow-hidden">
                          <div
                            className="h-full bg-[#78AC8E] rounded-full"
                            style={{ width: `${pPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* MINIMAL MOTIVATIONAL NOTE */}
          <div className="p-4 rounded-2xl border border-[#F0EBEF] bg-gradient-to-br from-white to-[#FCFAFB] text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D68EAD]">
              Philosophy
            </span>
            <p className="text-xs text-[#29252B] font-medium mt-1 italic">
              &ldquo;Plan your month. Organize your week. Focus on today.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
