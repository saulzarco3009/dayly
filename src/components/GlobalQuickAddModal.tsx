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
} from 'lucide-react';
import { useDayly, QuickAddType } from '@/context/DaylyContext';
import { getTodayStr, addDays } from '@/utils/dateUtils';
import { Priority, TimeSlot } from '@/types/dayly';

const QUICK_ADD_TABS: { id: QuickAddType; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'task', label: 'Tarea', icon: CheckSquare },
  { id: 'exam', label: 'Examen', icon: GraduationCap },
  { id: 'project', label: 'Proyecto', icon: FolderKanban },
  { id: 'habit', label: 'Hábito', icon: Sparkles },
  { id: 'goal', label: 'Objetivo', icon: Flag },
  { id: 'note', label: 'Nota', icon: FileText },
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

  // Estado formulario tarea
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(getTodayStr());
  const [taskTime, setTaskTime] = useState('');
  const [taskTimeSlot, setTaskTimeSlot] = useState<TimeSlot>('morning');
  const [taskPriority, setTaskPriority] = useState<Priority>('medium');
  const [taskCategory, setTaskCategory] = useState('Personal');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskProjectId, setTaskProjectId] = useState('');
  const [taskExamId, setTaskExamId] = useState('');

  // Estado formulario examen
  const [examSubject, setExamSubject] = useState('');
  const [examDate, setExamDate] = useState(addDays(getTodayStr(), 7));
  const [examDifficulty, setExamDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [examTopicsInput, setExamTopicsInput] = useState('');
  const [examNotes, setExamNotes] = useState('');

  // Estado formulario proyecto
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectDeadline, setProjectDeadline] = useState(addDays(getTodayStr(), 14));
  const [projectNotes, setProjectNotes] = useState('');

  // Estado formulario hábito
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Salud');
  const [habitFrequency, setHabitFrequency] = useState<'daily' | 'weekdays' | 'weekends'>('daily');

  // Estado formulario objetivo
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<'Personal' | 'Professional' | 'Academic' | 'Health' | 'Financial'>('Personal');
  const [goalTargetDate, setGoalTargetDate] = useState(addDays(getTodayStr(), 30));
  const [goalMilestone, setGoalMilestone] = useState('');

  // Estado formulario nota
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('Ideas');

  useEffect(() => {
    if (quickAddType) {
      setActiveTab(quickAddType);
    }
  }, [quickAddType]);

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
        topics: topicsList.length ? topicsList : [{ id: `tp-${Date.now()}-1`, name: 'Repaso general del temario', completed: false }],
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
        milestones: [{ id: `m-${Date.now()}`, title: 'Definición inicial e inicio', completed: false }],
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
          : [{ id: `gm-${Date.now()}`, title: 'Primer hito', completed: false }],
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
      {/* Fondo */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeQuickAdd}
      />

      {/* Ventana modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#F0EBEF] z-10 overflow-hidden animate-fade-in">
        <div className="px-6 pt-5 pb-4 border-b border-[#F0EBEF] flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#29252B]">
              Creación Rápida
            </h2>
            <p className="text-xs text-[#928A91]">
              Añade cualquier elemento a DAYLY en segundos
            </p>
          </div>
          <button
            onClick={closeQuickAdd}
            className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Pestañas de tipo */}
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

        {/* Formulario */}
        <form onSubmit={handleCreate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* TAREA */}
          {activeTab === 'task' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Título de la Tarea *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Repasar apuntes de arquitectura..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Fecha de Vencimiento
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
                    Hora Programada
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
                    Franja del Día
                  </label>
                  <select
                    value={taskTimeSlot}
                    onChange={(e) => setTaskTimeSlot(e.target.value as TimeSlot)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="morning">Mañana</option>
                    <option value="afternoon">Tarde</option>
                    <option value="evening">Noche</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Prioridad
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as Priority)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="low">Baja</option>
                    <option value="medium">Media</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Categoría
                  </label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Académico">Académico</option>
                    <option value="Trabajo">Trabajo</option>
                    <option value="Salud">Salud</option>
                    <option value="Proyecto">Proyecto</option>
                    <option value="Finanzas">Finanzas</option>
                  </select>
                </div>
              </div>

              {projects.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Vincular a Proyecto (Opcional)
                  </label>
                  <select
                    value={taskProjectId}
                    onChange={(e) => setTaskProjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="">Ninguno</option>
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
                    Vincular a Examen (Opcional)
                  </label>
                  <select
                    value={taskExamId}
                    onChange={(e) => setTaskExamId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="">Ninguno</option>
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

          {/* EXAMEN */}
          {activeTab === 'exam' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Asignatura / Curso *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Algoritmos y Estructuras de Datos..."
                  value={examSubject}
                  onChange={(e) => setExamSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] focus:outline-none focus:border-[#E5A6C0] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Fecha del Examen *
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
                    Dificultad
                  </label>
                  <select
                    value={examDifficulty}
                    onChange={(e) => setExamDifficulty(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Easy">Fácil</option>
                    <option value="Medium">Media</option>
                    <option value="Hard">Difícil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Temas a estudiar (uno por línea)
                </label>
                <textarea
                  rows={3}
                  placeholder="Tema 1: Grafos y árboles&#10;Tema 2: Programación dinámica&#10;Tema 3: Simulacro de examen"
                  value={examTopicsInput}
                  onChange={(e) => setExamTopicsInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* PROYECTO */}
          {activeTab === 'project' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Rediseño del sitio web..."
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  placeholder="Breve resumen de metas y alcance..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Fecha Límite
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

          {/* HÁBITO */}
          {activeTab === 'habit' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Nombre del Hábito *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Meditación matutina de 10 min..."
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Categoría
                  </label>
                  <select
                    value={habitCategory}
                    onChange={(e) => setHabitCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Salud">Salud</option>
                    <option value="Académico">Académico</option>
                    <option value="Personal">Personal</option>
                    <option value="Trabajo">Trabajo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Frecuencia
                  </label>
                  <select
                    value={habitFrequency}
                    onChange={(e) => setHabitFrequency(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="daily">Todos los días</option>
                    <option value="weekdays">Días laborables</option>
                    <option value="weekends">Fines de semana</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* OBJETIVO */}
          {activeTab === 'goal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Título del Objetivo *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Leer 10 libros de diseño..."
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Categoría
                  </label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                  >
                    <option value="Personal">Personal</option>
                    <option value="Académico">Académico</option>
                    <option value="Profesional">Profesional</option>
                    <option value="Salud">Salud</option>
                    <option value="Financiero">Financiero</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#29252B] mb-1">
                    Fecha Objetivo
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
                  Primer Hito
                </label>
                <input
                  type="text"
                  placeholder="ej. Terminar el primer libro..."
                  value={goalMilestone}
                  onChange={(e) => setGoalMilestone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* NOTA */}
          {activeTab === 'note' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Título de la Nota *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="ej. Reflexiones sobre diseño y espacio..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  placeholder="Ideas, Lectura, Citas..."
                  value={noteCategory}
                  onChange={(e) => setNoteCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#29252B] mb-1">
                  Contenido
                </label>
                <textarea
                  rows={4}
                  placeholder="Escribe tus notas o reflexiones aquí..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB]"
                />
              </div>
            </div>
          )}

          {/* Pie de guardado */}
          <div className="pt-4 border-t border-[#F0EBEF] flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={closeQuickAdd}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#928A91] hover:text-[#29252B] hover:bg-[#FCFAFB] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] shadow-2xs hover:shadow-xs active:scale-98 transition-all"
            >
              Guardar {QUICK_ADD_TABS.find((t) => t.id === activeTab)?.label}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
