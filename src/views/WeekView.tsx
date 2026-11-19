'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Circle,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import {
  getWeekDays,
  parseISODate,
  getTodayStr,
  addDays,
} from '@/utils/dateUtils';

export function WeekView() {
  const {
    tasks,
    exams,
    toggleTaskComplete,
    moveTaskDay,
    addTask,
    setSelectedDate,
    setActiveTab,
  } = useDayly();

  const todayStr = getTodayStr();
  const [anchorDate, setAnchorDate] = useState(todayStr);
  const [activeInputDay, setActiveInputDay] = useState<string | null>(null);
  const [inputTitle, setInputTitle] = useState('');

  const weekDays = getWeekDays(anchorDate);

  const prevWeek = () => {
    setAnchorDate(addDays(anchorDate, -7));
  };

  const nextWeek = () => {
    setAnchorDate(addDays(anchorDate, 7));
  };

  const resetToCurrentWeek = () => {
    setAnchorDate(todayStr);
  };

  const handleQuickAddForDay = (dateStr: string) => {
    if (!inputTitle.trim()) return;
    addTask({
      title: inputTitle.trim(),
      dueDate: dateStr,
      priority: 'medium',
      category: 'Personal',
      status: 'pending',
    });
    setInputTitle('');
    setActiveInputDay(null);
  };

  // Texto del rango semanal
  const startDay = parseISODate(weekDays[0]);
  const endDay = parseISODate(weekDays[6]);
  const rangeStr = `${startDay.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
  })} – ${endDay.toLocaleDateString('es-ES', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Encabezado y Navegación de la Semana */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D68EAD]">
            Planificador Semanal
          </span>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#29252B] capitalize">
            {rangeStr}
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetToCurrentWeek}
            className="text-xs font-semibold text-[#D68EAD] bg-[#FBEFF4] hover:bg-[#F7EAF0] px-3 py-1.5 rounded-xl border border-[#F0EBEF] transition-colors"
          >
            Esta Semana
          </button>

          <div className="flex items-center space-x-1 border border-[#F0EBEF] rounded-xl p-0.5 bg-[#FCFAFB]">
            <button
              onClick={prevWeek}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#928A91] hover:text-[#29252B] transition-colors"
              title="Semana anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextWeek}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white text-[#928A91] hover:text-[#29252B] transition-colors"
              title="Semana siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Cuadrícula de 7 Días */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-7 gap-4 items-start">
        {weekDays.map((dateStr) => {
          const dayDate = parseISODate(dateStr);
          const dayName = dayDate.toLocaleDateString('es-ES', {
            weekday: 'short',
          });
          const dayNumber = dayDate.getDate();
          const isToday = dateStr === todayStr;

          const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
          const completedCount = dayTasks.filter((t) => t.status === 'completed').length;
          const dayExams = exams.filter((e) => e.examDate === dateStr);

          return (
            <div
              key={dateStr}
              className={`rounded-2xl border flex flex-col transition-all shadow-2xs ${
                isToday
                  ? 'bg-white border-[#E5A6C0] ring-2 ring-[#E5A6C0]/20'
                  : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/40'
              }`}
            >
              {/* Encabezado del día */}
              <div
                onClick={() => {
                  setSelectedDate(dateStr);
                  setActiveTab('today');
                }}
                className={`p-3.5 border-b cursor-pointer transition-colors flex items-center justify-between rounded-t-2xl ${
                  isToday ? 'bg-[#FBEFF4]' : 'bg-[#FCFAFB] hover:bg-[#FBEFF4]/40'
                }`}
              >
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#928A91]">
                    {dayName}
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <span
                      className={`text-base font-bold ${
                        isToday ? 'text-[#D68EAD]' : 'text-[#29252B]'
                      }`}
                    >
                      {dayNumber}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold uppercase bg-[#E5A6C0] text-white px-1.5 py-0.2 rounded">
                        Hoy
                      </span>
                    )}
                  </div>
                </div>

                {/* Contador de carga */}
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-[#928A91] bg-white px-2 py-0.5 rounded-full border border-[#F0EBEF]">
                    {completedCount}/{dayTasks.length}
                  </span>
                </div>
              </div>

              {/* Contenido del día */}
              <div className="p-3 space-y-2 flex-1 min-h-[160px]">
                {/* Exámenes si los hay */}
                {dayExams.map((exam) => (
                  <div
                    key={exam.id}
                    className="p-2 rounded-xl bg-[#FDF0F2] border border-[#FAD8DC] text-[11px] font-semibold text-[#DF7682] flex items-center space-x-1.5"
                  >
                    <GraduationCap size={13} className="shrink-0" />
                    <span className="truncate">{exam.subject}</span>
                  </div>
                ))}

                {/* Lista de tareas */}
                {dayTasks.length === 0 && dayExams.length === 0 ? (
                  <div className="py-6 text-center text-[11px] text-[#928A91] italic">
                    Sin tareas
                  </div>
                ) : (
                  dayTasks.map((task) => {
                    const isCompleted = task.status === 'completed';
                    return (
                      <div
                        key={task.id}
                        className={`group p-2.5 rounded-xl border transition-all text-xs ${
                          isCompleted
                            ? 'bg-[#FCFAFB] border-[#F6F2F5] text-[#928A91]'
                            : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/50'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`mt-0.5 shrink-0 transition-colors ${
                              isCompleted
                                ? 'text-[#78AC8E]'
                                : 'text-[#928A91] group-hover:text-[#D68EAD]'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 size={14} />
                            ) : (
                              <Circle size={14} />
                            )}
                          </button>

                          <div className="flex-1 min-w-0">
                            <p
                              className={`leading-snug ${
                                isCompleted
                                  ? 'line-through text-[#928A91]'
                                  : 'text-[#29252B] font-medium'
                              }`}
                            >
                              {task.title}
                            </p>

                            <div className="flex items-center justify-between mt-1 text-[9px] text-[#928A91]">
                              <span
                                className={`font-semibold uppercase ${
                                  task.priority === 'high'
                                    ? 'text-[#DF7682]'
                                    : task.priority === 'medium'
                                    ? 'text-[#E4A86C]'
                                    : 'text-[#928A91]'
                                }`}
                              >
                                {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                              </span>

                              {/* Mover tarea de día */}
                              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 transition-opacity">
                                <button
                                  onClick={() =>
                                    moveTaskDay(task.id, addDays(dateStr, -1))
                                  }
                                  className="hover:text-[#D68EAD] p-0.5"
                                  title="Mover a ayer"
                                >
                                  <ArrowLeft size={11} />
                                </button>
                                <button
                                  onClick={() =>
                                    moveTaskDay(task.id, addDays(dateStr, 1))
                                  }
                                  className="hover:text-[#D68EAD] p-0.5"
                                  title="Mover a mañana"
                                >
                                  <ArrowRight size={11} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Añadir tarea rápida para el día */}
                {activeInputDay === dateStr ? (
                  <div className="pt-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Título de la tarea..."
                      value={inputTitle}
                      onChange={(e) => setInputTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleQuickAddForDay(dateStr);
                        if (e.key === 'Escape') setActiveInputDay(null);
                      }}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-[#E5A6C0] bg-white focus:outline-none mb-1.5"
                    />
                    <div className="flex items-center justify-between text-[10px]">
                      <button
                        onClick={() => setActiveInputDay(null)}
                        className="text-[#928A91] hover:text-[#29252B]"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={() => handleQuickAddForDay(dateStr)}
                        className="font-semibold text-[#D68EAD] bg-[#FBEFF4] px-2 py-0.5 rounded border border-[#E5A6C0]/50"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setActiveInputDay(dateStr);
                      setInputTitle('');
                    }}
                    className="w-full py-1.5 text-[11px] font-medium text-[#928A91] hover:text-[#D68EAD] hover:bg-[#FCFAFB] rounded-lg border border-dashed border-[#F0EBEF] flex items-center justify-center space-x-1 transition-all mt-2"
                  >
                    <Plus size={12} />
                    <span>Añadir Tarea</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
