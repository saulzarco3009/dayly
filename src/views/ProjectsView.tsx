'use client';

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  Tag,
  Briefcase,
  ListTodo,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { formatFriendlyDate, formatLongDate, getTodayStr } from '@/utils/dateUtils';
import { Project, ProjectMilestone } from '@/types/dayly';

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

  // New Milestone inline input state (projectId -> title)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<Record<string, string>>({});
  // New task for project inline
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
      category: 'Project',
      status: 'pending',
      projectId,
    });

    setNewProjectTaskTitle((prev) => ({ ...prev, [projectId]: '' }));
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-[#EBF5F0] text-[#78AC8E] flex items-center justify-center">
              <Briefcase size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
                Projects & Initiatives
              </h2>
              <p className="text-xs text-[#928A91]">
                Track high-level ventures, deliverables, milestones and linked tasks.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => openQuickAdd('project')}
          className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2 rounded-xl text-xs font-semibold self-start sm:self-auto transition-all"
        >
          <Plus size={15} className="text-[#D68EAD]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        {['all', 'in_progress', 'planning', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${
              statusFilter === tab
                ? 'bg-[#FBEFF4] text-[#29252B] font-semibold border border-[#E5A6C0]'
                : 'bg-white text-[#928A91] hover:text-[#29252B] border border-[#F0EBEF]'
            }`}
          >
            {tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#F0EBEF] p-12 text-center">
          <FolderKanban size={32} className="mx-auto text-[#928A91] mb-2" />
          <h3 className="text-sm font-semibold text-[#29252B]">No projects found</h3>
          <p className="text-xs text-[#928A91] mt-1 mb-4">
            Create your first project to organize long-term initiatives.
          </p>
          <button
            onClick={() => openQuickAdd('project')}
            className="text-xs font-semibold px-4 py-2 bg-[#FBEFF4] text-[#D68EAD] rounded-xl border border-[#E5A6C0]"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {filteredProjects.map((project) => {
            const completedM = project.milestones.filter((m) => m.completed).length;
            const totalM = project.milestones.length;
            const progress = totalM > 0 ? Math.round((completedM / totalM) * 100) : 0;

            const linkedTasks = tasks.filter((t) => t.projectId === project.id);
            const completedLinked = linkedTasks.filter((t) => t.status === 'completed');

            const isExpanded = expandedProjectId === project.id;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs hover:shadow-xs p-5 sm:p-6 transition-all space-y-4"
              >
                {/* Project Header */}
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
                        {project.status}
                      </span>
                      <span className="text-[10px] text-[#928A91]">
                        Due {formatFriendlyDate(project.deadline)}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#29252B]">
                      {project.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 text-[#928A91] hover:text-[#DF7682] transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <p className="text-xs text-[#928A91] leading-relaxed">
                  {project.description}
                </p>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-xs text-[#928A91] mb-1.5">
                    <span className="font-medium text-[#29252B]">Milestone Progress</span>
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

                {/* Milestones Checklist */}
                <div className="space-y-2 pt-2 border-t border-[#F0EBEF]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#928A91]">
                      Milestones
                    </span>
                    <span className="text-[10px] text-[#928A91]">
                      {project.milestones.length} milestones
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

                  {/* Add Milestone */}
                  <div className="flex items-center space-x-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add milestone..."
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
                      Add
                    </button>
                  </div>
                </div>

                {/* Collapsible Linked Tasks Section */}
                <div className="pt-2 border-t border-[#F0EBEF]">
                  <button
                    onClick={() =>
                      setExpandedProjectId(isExpanded ? null : project.id)
                    }
                    className="w-full flex items-center justify-between text-xs font-medium text-[#29252B] hover:text-[#D68EAD] py-1"
                  >
                    <div className="flex items-center space-x-1.5">
                      <ListTodo size={14} className="text-[#928A91]" />
                      <span>Associated Tasks ({linkedTasks.length})</span>
                    </div>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>

                  {isExpanded && (
                    <div className="mt-3 space-y-2 animate-fade-in">
                      {linkedTasks.length === 0 ? (
                        <p className="text-xs text-[#928A91] italic py-1">
                          No tasks linked to this project yet.
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

                      {/* Add Linked Task Inline */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          placeholder="Add new task to this project..."
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
                          Add
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
