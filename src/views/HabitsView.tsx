'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Flame,
  Check,
  X,
  Trash2,
  Calendar,
  Award,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { getTodayStr, addDays, parseISODate } from '@/utils/dateUtils';
import { Habit } from '@/types/dayly';

export function HabitsView() {
  const { habits, toggleHabitForDate, deleteHabit, openQuickAdd } = useDayly();

  const todayStr = getTodayStr();

  // Past 7 days array (from 6 days ago up to today)
  const rollingDays: string[] = [];
  for (let i = 6; i >= 0; i--) {
    rollingDays.push(addDays(todayStr, -i));
  }

  // Calculate streak for a habit
  const calculateStreak = (habit: Habit): number => {
    let streak = 0;
    let checkDate = todayStr;

    // If today is checked, count starts at today; if not yet checked today, check yesterday
    if (!habit.history[checkDate]) {
      checkDate = addDays(todayStr, -1);
    }

    while (habit.history[checkDate]) {
      streak++;
      checkDate = addDays(checkDate, -1);
    }

    return streak;
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FBEFF4] text-[#D68EAD] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Habits & Consistency
              </h2>
              <p className="text-xs text-[#928A91]">
                Small daily practices done consistently create remarkable outcomes.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('habit')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habits Table / Grid Card */}
      {habits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <Sparkles size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No habits yet</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Build your morning routine, study habits, or mindfulness routines.
          </p>
          <button
            onClick={() => openQuickAdd('habit')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Add Habit
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs overflow-hidden">
          {/* Header Row */}
          <div className="grid grid-cols-12 p-4 border-b border-[#F0EBEF] bg-[#FCFAFB] text-xs font-semibold uppercase tracking-wider text-[#928A91] items-center">
            <div className="col-span-5 sm:col-span-4">Habit Name</div>
            <div className="col-span-2 hidden sm:block text-center">Streak</div>
            <div className="col-span-7 sm:col-span-6 flex items-center justify-around">
              {rollingDays.map((d) => {
                const dateObj = parseISODate(d);
                const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' });
                const isToday = d === todayStr;
                return (
                  <div key={d} className="text-center w-8">
                    <span className={`block text-[10px] ${isToday ? 'text-[#D68EAD] font-bold' : ''}`}>
                      {dayName}
                    </span>
                    <span className={`text-[11px] font-bold ${isToday ? 'text-[#D68EAD]' : 'text-[#29252B]'}`}>
                      {dateObj.getDate()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habit Rows */}
          <div className="divide-y divide-[#F0EBEF]">
            {habits.map((habit) => {
              const streak = calculateStreak(habit);
              return (
                <div
                  key={habit.id}
                  className="grid grid-cols-12 p-4 items-center hover:bg-[#FCFAFB]/50 transition-colors group"
                >
                  {/* Title & Category */}
                  <div className="col-span-5 sm:col-span-4 pr-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#29252B] truncate">
                      {habit.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-[#928A91] bg-[#FCFAFB] px-1.5 py-0.2 rounded border border-[#F0EBEF]">
                        {habit.category}
                      </span>
                      <span className="text-[10px] text-[#928A91] capitalize">
                        {habit.frequency}
                      </span>
                    </div>
                  </div>

                  {/* Streak pill */}
                  <div className="col-span-2 hidden sm:flex items-center justify-center">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FBEFF4] border border-[#F7EAF0] text-xs font-bold text-[#D68EAD]">
                      <Flame size={12} className="text-[#D68EAD]" />
                      <span>{streak} days</span>
                    </div>
                  </div>

                  {/* 7-Day Matrix */}
                  <div className="col-span-7 sm:col-span-6 flex items-center justify-around">
                    {rollingDays.map((dateStr) => {
                      const isCompleted = !!habit.history[dateStr];
                      const isToday = dateStr === todayStr;

                      return (
                        <button
                          key={dateStr}
                          onClick={() => toggleHabitForDate(habit.id, dateStr)}
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center transition-all ${
                            isCompleted
                              ? 'bg-[#E5A6C0] text-white shadow-xs scale-100'
                              : isToday
                              ? 'border-2 border-dashed border-[#E5A6C0] bg-white hover:bg-[#FBEFF4]'
                              : 'border border-[#F0EBEF] bg-[#FCFAFB] hover:bg-white text-transparent'
                          }`}
                          title={`Toggle ${habit.name} on ${dateStr}`}
                        >
                          {isCompleted && <Check size={14} className="stroke-[3]" />}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#928A91] hover:text-[#DF7682] transition-opacity ml-1 hidden sm:block"
                      title="Delete habit"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
