'use client';

import React from 'react';
import {
  Sparkles,
  Plus,
  Flame,
  Check,
  Trash2,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { getTodayStr, addDays, parseISODate } from '@/utils/dateUtils';
import { Habit } from '@/types/dayly';

export function HabitsView() {
  const { habits, toggleHabitForDate, deleteHabit, openQuickAdd } = useDayly();

  const todayStr = getTodayStr();

  // Últimos 7 días
  const rollingDays: string[] = [];
  for (let i = 6; i >= 0; i--) {
    rollingDays.push(addDays(todayStr, -i));
  }

  const calculateStreak = (habit: Habit): number => {
    let streak = 0;
    let checkDate = todayStr;

    if (!habit.history[checkDate]) {
      checkDate = addDays(todayStr, -1);
    }

    while (habit.history[checkDate]) {
      streak++;
      checkDate = addDays(checkDate, -1);
    }

    return streak;
  };

  const translateFrequency = (freq: string) => {
    switch (freq) {
      case 'daily':
        return 'Todos los días';
      case 'weekdays':
        return 'Días laborables';
      case 'weekends':
        return 'Fines de semana';
      default:
        return freq;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Cabecera */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FBEFF4] text-[#D68EAD] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Hábitos y Constancia
              </h2>
              <p className="text-xs text-[#928A91]">
                Pequeñas prácticas diarias repetidas con constancia generan resultados extraordinarios.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('habit')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>Nuevo Hábito</span>
        </button>
      </div>

      {/* Tabla de Hábitos */}
      {habits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <Sparkles size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No hay hábitos creados</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Construye tus rutinas matutinas, hábitos de estudio o momentos de descanso.
          </p>
          <button
            onClick={() => openQuickAdd('habit')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Añadir Hábito
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs overflow-hidden">
          {/* Fila de cabecera */}
          <div className="grid grid-cols-12 p-4 border-b border-[#F0EBEF] bg-[#FCFAFB] text-xs font-semibold uppercase tracking-wider text-[#928A91] items-center">
            <div className="col-span-5 sm:col-span-4">Nombre del Hábito</div>
            <div className="col-span-2 hidden sm:block text-center">Racha</div>
            <div className="col-span-7 sm:col-span-6 flex items-center justify-around">
              {rollingDays.map((d) => {
                const dateObj = parseISODate(d);
                const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'narrow' });
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

          {/* Filas de hábitos */}
          <div className="divide-y divide-[#F0EBEF]">
            {habits.map((habit) => {
              const streak = calculateStreak(habit);
              return (
                <div
                  key={habit.id}
                  className="grid grid-cols-12 p-4 items-center hover:bg-[#FCFAFB]/50 transition-colors group"
                >
                  {/* Título y Categoría */}
                  <div className="col-span-5 sm:col-span-4 pr-2">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#29252B] truncate">
                      {habit.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] text-[#928A91] bg-[#FCFAFB] px-1.5 py-0.2 rounded border border-[#F0EBEF]">
                        {habit.category}
                      </span>
                      <span className="text-[10px] text-[#928A91]">
                        {translateFrequency(habit.frequency)}
                      </span>
                    </div>
                  </div>

                  {/* Racha */}
                  <div className="col-span-2 hidden sm:flex items-center justify-center">
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-[#FBEFF4] border border-[#F7EAF0] text-xs font-bold text-[#D68EAD]">
                      <Flame size={12} className="text-[#D68EAD]" />
                      <span>{streak} días</span>
                    </div>
                  </div>

                  {/* Matriz de 7 Días */}
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
                          title={`Alternar ${habit.name} el ${dateStr}`}
                        >
                          {isCompleted && <Check size={14} className="stroke-[3]" />}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => deleteHabit(habit.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#928A91] hover:text-[#DF7682] transition-opacity ml-1 hidden sm:block"
                      title="Eliminar hábito"
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
