'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Split,
  Trash2,
  BookOpen,
  X,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import {
  formatFriendlyDate,
  formatLongDate,
  getTodayStr,
  getDaysDifference,
} from '@/utils/dateUtils';
import { Exam } from '@/types/dayly';

export function ExamsView() {
  const {
    exams,
    tasks,
    toggleExamTopic,
    deleteExam,
    updateExam,
    breakExamIntoStudySessions,
    openQuickAdd,
  } = useDayly();

  const todayStr = getTodayStr();

  const [breakdownExam, setBreakdownExam] = useState<Exam | null>(null);
  const [sessionCount, setSessionCount] = useState<number>(3);
  const [newTopicName, setNewTopicName] = useState<Record<string, string>>({});

  const sortedExams = [...exams].sort((a, b) => a.examDate.localeCompare(b.examDate));

  const handleAddTopic = (examId: string) => {
    const topicText = (newTopicName[examId] || '').trim();
    if (!topicText) return;

    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    const newTopic = {
      id: `tp-${Date.now()}`,
      name: topicText,
      completed: false,
    };

    updateExam(examId, {
      topics: [...exam.topics, newTopic],
    });

    setNewTopicName((prev) => ({ ...prev, [examId]: '' }));
  };

  const handleExecuteBreakdown = () => {
    if (!breakdownExam) return;
    breakExamIntoStudySessions(breakdownExam.id, sessionCount);
    setBreakdownExam(null);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Cabecera */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#FDF0F2] text-[#DF7682] flex items-center justify-center">
              <GraduationCap size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Planificador Académico y Exámenes
              </h2>
              <p className="text-xs text-[#928A91]">
                Supervisa exámenes, domina el temario y divide tu preparación en sesiones diarias de estudio.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('exam')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>Nuevo Examen</span>
        </button>
      </div>

      {/* Cuadrícula de Exámenes */}
      {sortedExams.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <GraduationCap size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No hay exámenes programados</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Añade asignaturas, pruebas y fechas para planificar con antelación.
          </p>
          <button
            onClick={() => openQuickAdd('exam')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Crear Examen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedExams.map((exam) => {
            const daysLeft = getDaysDifference(exam.examDate, todayStr);
            const completedTopics = exam.topics.filter((t) => t.completed).length;
            const totalTopics = exam.topics.length;
            const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

            const linkedTasks = tasks.filter((t) => t.examId === exam.id);
            const completedLinkedTasks = linkedTasks.filter((t) => t.status === 'completed');

            return (
              <div
                key={exam.id}
                className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs hover:shadow-xs p-5 sm:p-6 transition-all flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            exam.difficulty === 'Hard'
                              ? 'bg-[#FDF0F2] text-[#DF7682] border border-[#FAD8DC]'
                              : exam.difficulty === 'Medium'
                              ? 'bg-[#FDF6EE] text-[#E4A86C] border border-[#FAECD9]'
                              : 'bg-[#FCFAFB] text-[#78AC8E] border border-[#F0EBEF]'
                          }`}
                        >
                          {exam.difficulty === 'Hard' ? 'Difícil' : exam.difficulty === 'Medium' ? 'Media' : 'Fácil'}
                        </span>

                        <span className="text-[10px] text-[#928A91] bg-[#FCFAFB] px-2 py-0.5 rounded-full border border-[#F0EBEF]">
                          {exam.status === 'Completed' ? 'Completado' : exam.status === 'In Progress' ? 'En preparación' : 'Próximo'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-[#29252B]">
                        {exam.subject}
                      </h3>
                      <p className="text-xs text-[#928A91] flex items-center mt-0.5">
                        <Calendar size={12} className="mr-1" />
                        {formatLongDate(exam.examDate)}
                        {exam.examTime && ` a las ${exam.examTime}`}
                      </p>
                    </div>

                    {/* Cuenta atrás */}
                    <div className="text-right shrink-0">
                      <div
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs tracking-tight ${
                          daysLeft < 0
                            ? 'bg-[#FCFAFB] text-[#928A91] border border-[#F0EBEF]'
                            : daysLeft <= 2
                            ? 'bg-[#FDF0F2] text-[#DF7682] border border-[#FAD8DC]'
                            : 'bg-[#FBEFF4] text-[#D68EAD] border border-[#F7EAF0]'
                        }`}
                      >
                        {daysLeft < 0
                          ? 'Completado'
                          : daysLeft === 0
                          ? '¡Hoy!'
                          : daysLeft === 1
                          ? 'Mañana'
                          : `${daysLeft} días restantes`}
                      </div>
                    </div>
                  </div>

                  {exam.notes && (
                    <p className="text-xs text-[#928A91] mt-3 bg-[#FCFAFB] p-2.5 rounded-xl border border-[#F0EBEF]">
                      {exam.notes}
                    </p>
                  )}

                  {/* Barra de progreso */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-[#928A91] mb-1.5">
                      <span className="font-medium text-[#29252B]">Progreso de Preparación</span>
                      <span className="font-semibold text-[#D68EAD]">
                        {completedTopics}/{totalTopics} temas ({progress}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] overflow-hidden">
                      <div
                        className="h-full bg-[#E5A6C0] rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Temario */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#928A91]">
                        Temario y Temas
                      </span>
                      <span className="text-[10px] text-[#928A91]">
                        Haz clic para marcar como dominado
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {exam.topics.map((topic) => (
                        <div
                          key={topic.id}
                          onClick={() => toggleExamTopic(exam.id, topic.id)}
                          className={`flex items-center space-x-2.5 p-2 rounded-xl border cursor-pointer transition-colors ${
                            topic.completed
                              ? 'bg-[#FCFAFB] border-[#F6F2F5] text-[#928A91]'
                              : 'bg-white border-[#F0EBEF] hover:border-[#E5A6C0]/50 text-[#29252B]'
                          }`}
                        >
                          <button
                            type="button"
                            className={`shrink-0 ${
                              topic.completed ? 'text-[#78AC8E]' : 'text-[#928A91]'
                            }`}
                          >
                            {topic.completed ? (
                              <CheckCircle2 size={15} />
                            ) : (
                              <Circle size={15} />
                            )}
                          </button>
                          <span
                            className={`text-xs ${
                              topic.completed ? 'line-through text-[#928A91]' : 'font-medium'
                            }`}
                          >
                            {topic.name}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Añadir tema inline */}
                    <div className="flex items-center space-x-2 pt-1">
                      <input
                        type="text"
                        placeholder="Añadir otro tema..."
                        value={newTopicName[exam.id] || ''}
                        onChange={(e) =>
                          setNewTopicName((prev) => ({
                            ...prev,
                            [exam.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddTopic(exam.id);
                        }}
                        className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none"
                      />
                      <button
                        onClick={() => handleAddTopic(exam.id)}
                        className="px-2.5 py-1.5 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] rounded-xl text-xs font-medium"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>

                  {/* Bloques de estudio generados */}
                  {linkedTasks.length > 0 && (
                    <div className="mt-4 p-3 bg-[#FCFAFB] rounded-xl border border-[#F0EBEF]">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#29252B] flex items-center">
                          <BookOpen size={13} className="mr-1.5 text-[#D68EAD]" />
                          Sesiones en Calendario:
                        </span>
                        <span className="text-[#928A91]">
                          {completedLinkedTasks.length}/{linkedTasks.length} sesiones completadas
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Acciones inferiores */}
                <div className="pt-3 border-t border-[#F0EBEF] flex items-center justify-between">
                  <button
                    onClick={() => {
                      setBreakdownExam(exam);
                      setSessionCount(Math.min(Math.max(2, daysLeft), 5));
                    }}
                    className="flex items-center space-x-1.5 text-xs font-semibold text-[#D68EAD] hover:text-[#29252B] bg-[#FBEFF4] hover:bg-[#F7EAF0] px-3 py-1.5 rounded-xl border border-[#E5A6C0]/40 transition-colors"
                  >
                    <Split size={14} />
                    <span>Dividir en Sesiones de Estudio</span>
                  </button>

                  <button
                    onClick={() => deleteExam(exam.id)}
                    className="p-1.5 text-[#928A91] hover:text-[#DF7682] transition-colors"
                    title="Eliminar examen"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DIVISIÓN EN SESIONES DE ESTUDIO */}
      {breakdownExam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setBreakdownExam(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#F0EBEF] z-10 p-6 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-[#F0EBEF]">
              <div className="flex items-center space-x-2">
                <Split size={16} className="text-[#D68EAD]" />
                <h3 className="text-base font-semibold text-[#29252B]">
                  Dividir en Sesiones de Estudio
                </h3>
              </div>
              <button
                onClick={() => setBreakdownExam(null)}
                className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B]"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-xs text-[#928A91] leading-relaxed">
              DAYLY creará y distribuirá automáticamente sesiones de estudio en los días previos a{' '}
              <strong className="text-[#29252B]">{breakdownExam.subject}</strong> (examen el{' '}
              {formatFriendlyDate(breakdownExam.examDate)}). Estas tareas de estudio aparecerán en tu
              panel principal, planificador semanal y calendario mensual.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#29252B] mb-2">
                ¿Cuántas sesiones de estudio deseas programar?
              </label>
              <div className="flex items-center space-x-2">
                {[2, 3, 4, 5, 7].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setSessionCount(num)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      sessionCount === num
                        ? 'bg-[#FBEFF4] border-[#E5A6C0] text-[#D68EAD]'
                        : 'bg-[#FCFAFB] border-[#F0EBEF] text-[#928A91] hover:text-[#29252B]'
                    }`}
                  >
                    {num} sesiones
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#FCFAFB] rounded-xl border border-[#F0EBEF] text-xs text-[#928A91]">
              Cada sesión se asociará a los temas del examen y se distribuirá equitativamente.
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-[#F0EBEF]">
              <button
                type="button"
                onClick={() => setBreakdownExam(null)}
                className="px-3 py-1.5 text-xs text-[#928A91]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleExecuteBreakdown}
                className="px-4 py-2 text-xs font-semibold bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] rounded-xl shadow-2xs transition-all active:scale-98"
              >
                Generar Tareas de Estudio ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
