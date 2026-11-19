'use client';

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  Circle,
  GraduationCap,
  FolderKanban,
  Trash2,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import {
  getMonthDays,
  formatMonthYear,
  formatFriendlyDate,
  formatLongDate,
  getTodayStr,
} from '@/utils/dateUtils';
import { Priority } from '@/types/dayly';

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function MonthView() {
  const {
    tasks,
    exams,
    projects,
    toggleTaskComplete,
    deleteTask,
    addTask,
    setSelectedDate,
    setActiveTab,
  } = useDayly();

  const todayStr = getTodayStr();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayModal, setSelectedDayModal] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');

  const [inlineTaskTitle, setInlineTaskTitle] = useState('');
  const [inlineTaskPriority, setInlineTaskPriority] = useState<Priority>('medium');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = getMonthDays(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Filtrado de tareas
  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter === 'Todas') return true;
    return t.category.toLowerCase() === categoryFilter.toLowerCase();
  });

  const categories = ['Todas', 'Académico', 'Trabajo', 'Personal', 'Proyecto', 'Salud'];

  const handleAddInlineTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDayModal || !inlineTaskTitle.trim()) return;

    addTask({
      title: inlineTaskTitle.trim(),
      dueDate: selectedDayModal,
      priority: inlineTaskPriority,
      category: 'Personal',
      status: 'pending',
    });
    setInlineTaskTitle('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Barra Superior de Controles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-[#29252B]">
            {formatMonthYear(currentDate)}
          </h2>
          <button
            onClick={goToToday}
            className="text-[11px] font-semibold text-[#D68EAD] bg-[#FBEFF4] hover:bg-[#F7EAF0] px-2.5 py-1 rounded-lg border border-[#F0EBEF] transition-colors"
          >
            Hoy
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Filtro de Categoría */}
          <div className="flex items-center space-x-1 overflow-x-auto pr-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#FBEFF4] text-[#29252B] font-semibold border border-[#E5A6C0]'
                    : 'text-[#928A91] hover:text-[#29252B] bg-[#FCFAFB] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Navegación de Mes */}
          <div className="flex items-center space-x-1 border border-[#F0EBEF] rounded-xl p-0.5 bg-[#FCFAFB]">
            <button
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#928A91] hover:text-[#29252B] transition-colors"
              aria-label="Mes anterior"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white text-[#928A91] hover:text-[#29252B] transition-colors"
              aria-label="Mes siguiente"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Cuadrícula del Calendario */}
      <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs overflow-hidden">
        {/* Cabecera de Días de la Semana */}
        <div className="grid grid-cols-7 border-b border-[#F0EBEF] bg-[#FCFAFB]">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#928A91]"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del Calendario */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#F0EBEF]">
          {calendarDays.map((calDay) => {
            const { dateStr, dayNumber, isCurrentMonth, isToday } = calDay;

            const dayTasks = filteredTasks.filter((t) => t.dueDate === dateStr);
            const dayExams = exams.filter((e) => e.examDate === dateStr);
            const dayProjects = projects.filter((p) => p.deadline === dateStr);

            const hasItems = dayTasks.length > 0 || dayExams.length > 0 || dayProjects.length > 0;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDayModal(dateStr)}
                className={`min-h-[105px] sm:min-h-[125px] p-1.5 sm:p-2 cursor-pointer transition-colors group relative flex flex-col justify-between ${
                  isCurrentMonth
                    ? 'bg-white hover:bg-[#FCFAFB]'
                    : 'bg-[#FCFAFB]/60 text-[#928A91]'
                }`}
              >
                {/* Cabecera del día */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full transition-colors ${
                      isToday
                        ? 'bg-[#E5A6C0] text-white shadow-2xs'
                        : isCurrentMonth
                        ? 'text-[#29252B]'
                        : 'text-[#928A91]/60'
                    }`}
                  >
                    {dayNumber}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDayModal(dateStr);
                    }}
                    className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#D68EAD] flex items-center justify-center transition-all"
                    title="Añadir tarea a este día"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Etiquetas de actividades */}
                <div className="space-y-1 flex-1 overflow-hidden">
                  {/* Examen */}
                  {dayExams.map((exam) => (
                    <div
                      key={exam.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#FDF0F2] text-[#DF7682] border border-[#FAD8DC] truncate flex items-center space-x-1"
                    >
                      <GraduationCap size={10} className="shrink-0" />
                      <span className="truncate">{exam.subject}</span>
                    </div>
                  ))}

                  {/* Límite de Proyecto */}
                  {dayProjects.map((p) => (
                    <div
                      key={p.id}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#EBF5F0] text-[#78AC8E] border border-[#D5EADF] truncate flex items-center space-x-1"
                    >
                      <FolderKanban size={10} className="shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </div>
                  ))}

                  {/* Tareas */}
                  {dayTasks.slice(0, 2).map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <div
                        key={t.id}
                        className={`px-1.5 py-0.5 rounded text-[10px] truncate border flex items-center space-x-1 ${
                          isDone
                            ? 'bg-[#FCFAFB] text-[#928A91] line-through border-[#F0EBEF]'
                            : 'bg-[#FBEFF4]/60 text-[#29252B] border-[#F7EAF0]'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isDone ? 'bg-[#78AC8E]' : 'bg-[#E5A6C0]'
                          }`}
                        />
                        <span className="truncate">{t.title}</span>
                      </div>
                    );
                  })}

                  {dayTasks.length > 2 && (
                    <div className="text-[9px] font-semibold text-[#D68EAD] px-1">
                      +{dayTasks.length - 2} más
                    </div>
                  )}
                </div>

                {hasItems && (
                  <div className="sm:hidden flex items-center justify-center space-x-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E5A6C0]" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL DETALLES DEL DÍA */}
      {selectedDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setSelectedDayModal(null)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F0EBEF] z-10 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-[#F0EBEF] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-[#D68EAD]">
                  Actividades del Día
                </span>
                <h3 className="text-base font-bold text-[#29252B]">
                  {formatLongDate(selectedDayModal)}
                </h3>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSelectedDate(selectedDayModal);
                    setActiveTab('today');
                  }}
                  className="text-xs font-medium text-[#D68EAD] bg-[#FBEFF4] hover:bg-[#F7EAF0] px-2.5 py-1 rounded-lg border border-[#F0EBEF] transition-colors"
                >
                  Abrir en Planificador Diario
                </button>

                <button
                  onClick={() => setSelectedDayModal(null)}
                  className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B]"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* Exámenes de este día */}
              {exams.filter((e) => e.examDate === selectedDayModal).map((exam) => (
                <div
                  key={exam.id}
                  className="p-3.5 rounded-xl bg-[#FDF0F2] border border-[#FAD8DC] flex items-start justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#DF7682]">
                      <GraduationCap size={15} />
                      <span>EXAMEN: {exam.subject}</span>
                    </div>
                    {exam.notes && (
                      <p className="text-xs text-[#928A91] mt-1">{exam.notes}</p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#DF7682] bg-white px-2 py-0.5 rounded-md border border-[#FAD8DC]">
                    {exam.difficulty === 'Easy' ? 'Fácil' : exam.difficulty === 'Medium' ? 'Media' : 'Difícil'}
                  </span>
                </div>
              ))}

              {/* Lista de Tareas */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#928A91] mb-2">
                  Tareas Programadas
                </h4>

                {tasks.filter((t) => t.dueDate === selectedDayModal).length === 0 ? (
                  <p className="text-xs text-[#928A91] italic py-2">
                    No hay tareas programadas para este día todavía.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {tasks
                      .filter((t) => t.dueDate === selectedDayModal)
                      .map((task) => {
                        const isDone = task.status === 'completed';
                        return (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-3 rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] hover:border-[#E5A6C0]/50 transition-colors"
                          >
                            <div className="flex items-center space-x-3 flex-1 min-w-0 pr-2">
                              <button
                                onClick={() => toggleTaskComplete(task.id)}
                                className={`transition-colors ${
                                  isDone ? 'text-[#78AC8E]' : 'text-[#928A91] hover:text-[#D68EAD]'
                                }`}
                              >
                                {isDone ? (
                                  <CheckCircle2 size={16} />
                                ) : (
                                  <Circle size={16} />
                                )}
                              </button>
                              <div className="min-w-0 flex-1">
                                <span
                                  className={`text-xs block truncate ${
                                    isDone
                                      ? 'line-through text-[#928A91]'
                                      : 'text-[#29252B] font-medium'
                                  }`}
                                >
                                  {task.title}
                                </span>
                                <div className="flex items-center space-x-2 text-[10px] text-[#928A91]">
                                  <span>{task.category}</span>
                                  {task.scheduledTime && (
                                    <span>&middot; {task.scheduledTime}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-[#928A91] hover:text-[#DF7682] p-1 transition-colors"
                              title="Eliminar tarea"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Añadir Tarea Directamente a esta Fecha */}
              <form onSubmit={handleAddInlineTask} className="pt-3 border-t border-[#F0EBEF]">
                <h4 className="text-xs font-semibold text-[#29252B] mb-2">
                  Añadir tarea para el {formatFriendlyDate(selectedDayModal)}
                </h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    required
                    placeholder="Título de la tarea..."
                    value={inlineTaskTitle}
                    onChange={(e) => setInlineTaskTitle(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none focus:border-[#E5A6C0]"
                  />
                  <select
                    value={inlineTaskPriority}
                    onChange={(e) => setInlineTaskPriority(e.target.value as Priority)}
                    className="px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] rounded-xl text-xs font-semibold transition-all active:scale-98"
                  >
                    Añadir
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
