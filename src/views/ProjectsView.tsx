'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Briefcase,
  ListTodo,
  CheckCircle2,
  Circle,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { formatFriendlyDate, getTodayStr } from '@/utils/dateUtils';
import { ProjectMilestone } from '@/types/dayly';

export function ProjectsView() {
  const {
    projects,
    tasks,
    toggleProjectMilestone,
    deleteProject,
    updateProject,
    addTask,
    openQuickAdd,
  } = useDayly();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  const [newMilestoneTitle, setNewMilestoneTitle] = useState<Record<string, string>>({});
  const [newProjectTaskTitle, setNewProjectTaskTitle] = useState<Record<string, string>>({});

  const filteredProjects = projects.filter((p) => {
    if (statusFilter === 'all') return true;
    return p.status.toLowerCase().replace(' ', '_') === statusFilter;
  });

  const handleAddMilestone = (projectId: string) => {
    const title = (newMilestoneTitle[projectId] || '').trim();
    if (!title) return;

    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    const newMilestone: ProjectMilestone = {
      id: `m-${Date.now()}`,
      title,
      completed: false,
    };

    updateProject(projectId, {
      milestones: [...project.milestones, newMilestone],
    });

    setNewMilestoneTitle((prev) => ({ ...prev, [projectId]: '' }));
  };

  const handleAddLinkedTask = (projectId: string) => {
    const title = (newProjectTaskTitle[projectId] || '').trim();
    if (!title) return;

    addTask({
      title,
      dueDate: getTodayStr(),
      priority: 'medium',
      category: 'Proyecto',
      status: 'pending',
      projectId,
    });

    setNewProjectTaskTitle((prev) => ({ ...prev, [projectId]: '' }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Cabecera */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#EBF5F0] text-[#78AC8E] flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Proyectos e Iniciativas
              </h2>
              <p className="text-xs text-[#928A91]">
                Supervisa iniciativas clave, entregables, hitos y tareas vinculadas.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('project')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Pestañas de Filtro */}
      <div className="flex items-center space-x-2">
        {[
          { id: 'all', label: 'Todos' },
          { id: 'in_progress', label: 'En progreso' },
          { id: 'planning', label: 'Planificación' },
          { id: 'completed', label: 'Completados' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              statusFilter === tab.id
                ? 'bg-[#FBEFF4] text-[#29252B] font-semibold border border-[#E5A6C0]'
                : 'bg-white text-[#928A91] hover:text-[#29252B] border border-[#F0EBEF]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Cuadrícula de Proyectos */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <FolderKanban size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No hay proyectos encontrados</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Crea tu primer proyecto para organizar iniciativas a medio y largo plazo.
          </p>
          <button
            onClick={() => openQuickAdd('project')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Crear Proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredProjects.map((project) => {
            const completedM = project.milestones.filter((m) => m.completed).length;
            const totalM = project.milestones.length;
            const progress = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;

            const linkedTasks = tasks.filter((t) => t.projectId === project.id);
            const isExpanded = expandedProjectId === project.id;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs hover:shadow-xs p-5 sm:p-6 transition-all space-y-4"
              >
                {/* Cabecera del proyecto */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          project.status === 'Completed'
                            ? 'bg-[#EBF5F0] text-[#78AC8E] border border-[#D5EADF]'
                            : project.status === 'In Progress'
                            ? 'bg-[#FBEFF4] text-[#D68EAD] border border-[#F7EAF0]'
                            : 'bg-[#FCFAFB] text-[#928A91] border border-[#F0EBEF]'
                        }`}
                      >
                        {project.status === 'Completed' ? 'Completado' : project.status === 'In Progress' ? 'En progreso' : 'Planificación'}
                      </span>
                      <span className="text-[10px] text-[#928A91]">
                        Límite {formatFriendlyDate(project.deadline)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#29252B]">
                      {project.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 text-[#928A91] hover:text-[#DF7682] transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p className="text-xs text-[#928A91] leading-relaxed">
                  {project.description}
                </p>

                {/* Barra de progreso */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#928A91] mb-1.5">
                    <span className="font-medium text-[#29252B]">Progreso de Hitos</span>
                    <span className="font-semibold text-[#78AC8E]">
                      {completedM}/{totalM} ({progress}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] overflow-hidden">
                    <div
                      className="h-full bg-[#78AC8E] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Hitos */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBEF]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#928A91]">
                      Hitos Clave
                    </span>
                    <span className="text-[10px] text-[#928A91]">
                      {project.milestones.length} hitos
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {project.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => toggleProjectMilestone(project.id, m.id)}
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

                  {/* Añadir Hito */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Añadir hito..."
                      value={newMilestoneTitle[project.id] || ''}
                      onChange={(e) =>
                        setNewMilestoneTitle((prev) => ({
                          ...prev,
                          [project.id]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddMilestone(project.id);
                      }}
                      className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleAddMilestone(project.id)}
                      className="px-2.5 py-1.5 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] rounded-xl text-xs font-medium"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                {/* Tareas asociadas */}
                <div className="pt-2 border-t border-[#F0EBEF]">
                  <button
                    onClick={() =>
                      setExpandedProjectId(isExpanded ? null : project.id)
                    }
                    className="w-full flex items-center justify-between text-xs font-medium text-[#29252B] hover:text-[#D68EAD] py-1"
                  >
                    <div className="flex items-center space-x-1.5">
                      <ListTodo size={14} className="text-[#928A91]" />
                      <span>Tareas Asociadas ({linkedTasks.length})</span>
                    </div>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 animate-fade-in">
                      {linkedTasks.length === 0 ? (
                        <p className="text-xs text-[#928A91] italic py-1">
                          No hay tareas vinculadas a este proyecto todavía.
                        </p>
                      ) : (
                        linkedTasks.map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-xl bg-[#FCFAFB] border border-[#F0EBEF] text-xs flex items-center justify-between"
                          >
                            <span
                              className={
                                t.status === 'completed'
                                  ? 'line-through text-[#928A91]'
                                  : 'text-[#29252B]'
                              }
                            >
                              {t.title}
                            </span>
                            <span className="text-[10px] text-[#928A91]">
                              {formatFriendlyDate(t.dueDate)}
                            </span>
                          </div>
                        ))
                      )}

                      {/* Añadir Tarea vinculada */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          placeholder="Añadir nueva tarea a este proyecto..."
                          value={newProjectTaskTitle[project.id] || ''}
                          onChange={(e) =>
                            setNewProjectTaskTitle((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleAddLinkedTask(project.id);
                          }}
                          className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddLinkedTask(project.id)}
                          className="px-2.5 py-1.5 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] rounded-xl text-xs font-medium"
                        >
                          Añadir
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
