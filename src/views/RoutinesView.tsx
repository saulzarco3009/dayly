'use client';

import React, { useState } from 'react';
import {
  Repeat,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Sparkles,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { getTodayStr } from '@/utils/dateUtils';
import { Routine, RoutineStep } from '@/types/dayly';

export function RoutinesView() {
  const {
    routines,
    toggleRoutineStep,
    deleteRoutine,
    updateRoutine,
    addRoutine,
  } = useDayly();

  const todayStr = getTodayStr();

  // Inline step adder state (routineId -> { title, duration })
  const [newStepTitle, setNewStepTitle] = useState<Record<string, string>>({});
  const [newStepDuration, setNewStepDuration] = useState<Record<string, number>>({});

  // Add new routine modal state
  const [isAddingRoutine, setIsAddingRoutine] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineSlot, setNewRoutineSlot] = useState<'morning' | 'afternoon' | 'evening' | 'anytime'>('morning');

  const handleAddStep = (routineId: string) => {
    const title = (newStepTitle[routineId] || '').trim();
    if (!title) return;

    const routine = routines.find((r) => r.id === routineId);
    if (!routine) return;

    const newStep: RoutineStep = {
      id: `rs-${Date.now()}`,
      title,
      durationMinutes: newStepDuration[routineId] || 5,
    };

    updateRoutine(routineId, {
      steps: [...routine.steps, newStep],
    });

    setNewStepTitle((prev) => ({ ...prev, [routineId]: '' }));
  };

  const handleCreateRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineName.trim()) return;

    addRoutine({
      name: newRoutineName.trim(),
      timeSlot: newRoutineSlot,
      steps: [
        { id: `rs-${Date.now()}-1`, title: 'First step of this routine', durationMinutes: 5 },
      ],
    });

    setNewRoutineName('');
    setIsAddingRoutine(false);
  };

  const getSlotIcon = (slot: string) => {
    switch (slot) {
      case 'morning':
        return <Sunrise size={18} className="text-[#D68EAD]" />;
      case 'afternoon':
        return <Sun size={18} className="text-[#E4A86C]" />;
      case 'evening':
        return <Moon size={18} className="text-[#78AC8E]" />;
      default:
        return <Repeat size={18} className="text-[#D68EAD]" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FBEFF4] text-[#D68EAD] flex items-center justify-center">
              <Repeat size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Daily Routines & Rituals
              </h2>
              <p className="text-xs text-[#928A91]">
                Anchor your day with frictionless morning, study, work, and evening sequences.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsAddingRoutine(true)}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>New Routine</span>
        </button>
      </div>

      {/* Routines Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {routines.map((routine) => {
          const completedSteps = routine.completions[todayStr] || [];
          const totalSteps = routine.steps.length;
          const completedCount = completedSteps.length;
          const percent = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;
          const totalMinutes = routine.steps.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);

          return (
            <div
              key={routine.id}
              className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs hover:shadow-xs p-5 sm:p-6 transition-all space-y-4"
            >
              {/* Routine Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center">
                    {getSlotIcon(routine.timeSlot)}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#29252B]">
                      {routine.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-[10px] text-[#928A91] mt-0.5">
                      <span className="capitalize">{routine.timeSlot}</span>
                      {totalMinutes > 0 && (
                        <span>&middot; ~{totalMinutes} min total</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteRoutine(routine.id)}
                  className="p-1.5 text-[#928A91] hover:text-[#DF7682] transition-colors"
                  title="Delete routine"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-[#928A91] mb-1.5">
                  <span className="font-medium text-[#29252B]">Today&apos;s Progress</span>
                  <span className="font-semibold text-[#D68EAD]">
                    {completedCount}/{totalSteps} steps completed ({percent}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] overflow-hidden">
                  <div
                    className="h-full bg-[#E5A6C0] rounded-full transition-all duration-300"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-2 pt-2 border-t border-[#F0EBEF]">
                <div className="space-y-1.5">
                  {routine.steps.map((step, idx) => {
                    const isDone = completedSteps.includes(step.id);
                    return (
                      <div
                        key={step.id}
                        onClick={() => toggleRoutineStep(routine.id, step.id, todayStr)}
                        className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          isDone
                            ? 'bg-[#FCFAFB] border-[#F6F2F5] text-[#928A91]'
                            : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/50 text-[#29252B]'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 flex-1 min-w-0 pr-2">
                          <button
                            type="button"
                            className={`shrink-0 ${
                              isDone ? 'text-[#78AC8E]' : 'text-[#928A91]'
                            }`}
                          >
                            {isDone ? (
                              <CheckCircle2 size={16} />
                            ) : (
                              <Circle size={16} />
                            )}
                          </button>
                          <span
                            className={`text-xs ${
                              isDone ? 'line-through text-[#928A91]' : 'font-medium'
                            }`}
                          >
                            {idx + 1}. {step.title}
                          </span>
                        </div>

                        {step.durationMinutes && (
                          <span className="text-[10px] text-[#928A91] shrink-0 bg-[#FCFAFB] px-1.5 py-0.5 rounded border border-[#F0EBEF]">
                            {step.durationMinutes}m
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Add Step inline */}
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    placeholder="Add step to routine..."
                    value={newStepTitle[routine.id] || ''}
                    onChange={(e) =>
                      setNewStepTitle((prev) => ({
                        ...prev,
                        [routine.id]: e.target.value,
                      }))
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddStep(routine.id);
                    }}
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none"
                  />
                  <input
                    type="number"
                    placeholder="Min"
                    min={1}
                    max={120}
                    value={newStepDuration[routine.id] || 5}
                    onChange={(e) =>
                      setNewStepDuration((prev) => ({
                        ...prev,
                        [routine.id]: Number(e.target.value),
                      }))
                    }
                    className="w-14 px-2 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] text-center"
                  />
                  <button
                    onClick={() => handleAddStep(routine.id)}
                    className="px-2.5 py-1.5 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] rounded-xl text-xs font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ADD ROUTINE MODAL */}
      {isAddingRoutine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsAddingRoutine(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#F0EBEF] p-6 z-10 space-y-4">
            <h3 className="text-base font-semibold text-[#29252B]">Create Routine</h3>
            <form onSubmit={handleCreateRoutine} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Routine Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work Startup Ritual..."
                  value={newRoutineName}
                  onChange={(e) => setNewRoutineName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Time Slot
                </label>
                <select
                  value={newRoutineSlot}
                  onChange={(e) => setNewRoutineSlot(e.target.value as any)}
                  className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF]"
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                  <option value="anytime">Anytime</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F0EBEF]">
                <button
                  type="button"
                  onClick={() => setIsAddingRoutine(false)}
                  className="px-3 py-1.5 text-xs text-[#928A91]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-[#FBEFF4] border border-[#E5A6C0] text-[#29252B] rounded-xl"
                >
                  Create Routine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
