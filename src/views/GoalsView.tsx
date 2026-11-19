'use client';

import React, { useState } from 'react';
import {
  Flag,
  Plus,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2,
  Target,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { formatFriendlyDate, getTodayStr, getDaysDifference } from '@/utils/dateUtils';
import { GoalMilestone } from '@/types/dayly';

export function GoalsView() {
  const { goals, toggleGoalMilestone, deleteGoal, updateGoal, openQuickAdd } = useDayly();
  const todayStr = getTodayStr();

  const [newMilestoneText, setNewMilestoneText] = useState<Record<string, string>>({});

  const handleAddMilestone = (goalId: string) => {
    const text = (newMilestoneText[goalId] || '').trim();
    if (!text) return;

    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newM: GoalMilestone = {
      id: `gm-${Date.now()}`,
      title: text,
      completed: false,
    };

    updateGoal(goalId, {
      milestones: [...goal.milestones, newM],
    });

    setNewMilestoneText((prev) => ({ ...prev, [goalId]: '' }));
  };

  const translateCategory = (cat: string) => {
    switch (cat) {
      case 'Personal':
        return 'Personal';
      case 'Professional':
        return 'Profesional';
      case 'Academic':
        return 'Académico';
      case 'Health':
        return 'Salud';
      case 'Financial':
        return 'Financiero';
      default:
        return cat;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Cabecera */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FDF6EE] text-[#E4A86C] flex items-center justify-center">
              <Flag size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Objetivos y Visión a Largo Plazo
              </h2>
              <p className="text-xs text-[#928A91]">
                Define hitos, alinea tus prioridades y convierte grandes metas en pasos progresivos.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('goal')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>Nuevo Objetivo</span>
        </button>
      </div>

      {/* Cuadrícula de Objetivos */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <Target size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No hay objetivos definidos</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Establece metas personales o profesionales para orientar tu planificación diaria.
          </p>
          <button
            onClick={() => openQuickAdd('goal')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Crear Objetivo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {goals.map((goal) => {
            const completedM = goal.milestones.filter((m) => m.completed).length;
            const totalM = goal.milestones.length;
            const progress = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;
            const daysLeft = getDaysDifference(goal.targetDate, todayStr);

            return (
              <div
                key={goal.id}
                className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs hover:shadow-xs p-5 sm:p-6 transition-all space-y-4"
              >
                {/* Cabecera */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FBEFF4] text-[#D68EAD] border border-[#F7EAF0]">
                        {translateCategory(goal.category)}
                      </span>
                      <span className="text-[10px] text-[#928A91] flex items-center">
                        <Calendar size={11} className="mr-1" />
                        Meta: {formatFriendlyDate(goal.targetDate)}
                        {daysLeft > 0 && ` (${daysLeft} días)`}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#29252B]">
                      {goal.title}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="p-1.5 text-[#928A91] hover:text-[#DF7682] transition-colors"
                    title="Eliminar objetivo"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {goal.description && (
                  <p className="text-xs text-[#928A91] leading-relaxed">
                    {goal.description}
                  </p>
                )}

                {/* Progreso */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#928A91] mb-1.5">
                    <span className="font-medium text-[#29252B]">Progreso</span>
                    <span className="font-semibold text-[#D68EAD]">
                      {completedM}/{totalM} hitos ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] overflow-hidden">
                    <div
                      className="h-full bg-[#E5A6C0] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Hitos */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBEF]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#928A91]">
                    Hitos Clave
                  </span>

                  <div className="space-y-1.5">
                    {goal.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleGoalMilestone(goal.id, m.id)}
                        className={`flex items-center space-x-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                          m.completed
                            ? 'bg-[#FCFAFB] border-[#F6F2F5] text-[#928A91]'
                            : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/50 text-[#29252B]'
                        }`}
                      >
                        <button
                          type="button"
                          className={`shrink-0 ${
                            m.completed ? 'text-[#78AC8E]' : 'text-[#928A91]'
                          }`}
                        >
                          {m.completed ? (
                            <CheckCircle2 size={15} />
                          ) : (
                            <Circle size={15} />
                          )}
                        </button>
                        <span
                          className={`text-xs ${
                            m.completed ? 'line-through text-[#928A91]' : 'font-medium'
                          }`}
                        >
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Añadir hito inline */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Añadir hito..."
                      value={newMilestoneText[goal.id] || ''}
                      onChange={(e) =>
                        setNewMilestoneText((prev) => ({
                          ...prev,
                          [goal.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddMilestone(goal.id);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddMilestone(goal.id)}
                      className="px-2.5 py-1.5 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] rounded-xl text-xs font-medium"
                    >
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
