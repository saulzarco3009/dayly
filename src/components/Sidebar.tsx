'use client';

import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarDays,
  SunMedium,
  CheckSquare,
  GraduationCap,
  FolderKanban,
  Sparkles,
  Flag,
  Repeat,
  FileText,
  Settings2,
  Plus,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { NavTab } from '@/types/dayly';
import { getTodayStr } from '@/utils/dateUtils';

interface NavItemConfig {
  id: NavTab;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: (counts: { todayTasks: number; upcomingExams: number }) => number | null;
}

const NAV_ITEMS: NavItemConfig[] = [
  { id: 'overview', label: 'Vista General', icon: LayoutDashboard },
  { id: 'month', label: 'Mi Mes', icon: Calendar },
  { id: 'week', label: 'Mi Semana', icon: CalendarDays },
  {
    id: 'today',
    label: 'Hoy',
    icon: SunMedium,
    badge: (c) => (c.todayTasks > 0 ? c.todayTasks : null),
  },
  { id: 'tasks', label: 'Tareas', icon: CheckSquare },
  {
    id: 'exams',
    label: 'Exámenes',
    icon: GraduationCap,
    badge: (c) => (c.upcomingExams > 0 ? c.upcomingExams : null),
  },
  { id: 'projects', label: 'Proyectos', icon: FolderKanban },
  { id: 'habits', label: 'Hábitos', icon: Sparkles },
  { id: 'goals', label: 'Objetivos', icon: Flag },
  { id: 'routines', label: 'Rutinas', icon: Repeat },
  { id: 'notes', label: 'Notas', icon: FileText },
];

export function Sidebar() {
  const { activeTab, setActiveTab, tasks, exams, openQuickAdd, settings } = useDayly();

  const todayStr = getTodayStr();
  const todayPendingCount = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== 'completed'
  ).length;

  const upcomingExamsCount = exams.filter(
    (e) => e.status !== 'Completed' && e.examDate >= todayStr
  ).length;

  return (
    <aside className="hidden lg:flex w-64 flex-col justify-between border-r border-[#F0EBEF] bg-white h-screen sticky top-0 px-4 py-6 select-none shrink-0">
      <div className="flex flex-col space-y-6">
        {/* Encabezado de Marca */}
        <div className="px-3 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center space-x-2.5 text-left group transition-transform active:scale-95"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FBEFF4] border border-[#F7EAF0] flex items-center justify-center shadow-xs group-hover:border-[#E5A6C0] transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E5A6C0]" />
            </div>
            <div>
              <span className="text-lg font-semibold tracking-tight text-[#29252B] block leading-none">
                DAYLY<span className="text-[#D68EAD]">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#928A91] font-medium block mt-1">
                Sistema Personal
              </span>
            </div>
          </button>
        </div>

        {/* Botón Global de Acción Rápida */}
        <div className="px-1">
          <button
            onClick={() => openQuickAdd('task')}
            className="w-full flex items-center justify-center space-x-2 py-2 px-3.5 rounded-xl bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#F0EBEF] text-xs font-medium tracking-wide transition-all shadow-2xs hover:shadow-xs active:scale-[0.99]"
          >
            <Plus size={15} className="text-[#D68EAD]" />
            <span>Nueva Actividad</span>
            <span className="ml-auto text-[10px] text-[#928A91] bg-white px-1.5 py-0.5 rounded border border-[#F0EBEF]">
              N
            </span>
          </button>
        </div>

        {/* Lista de Navegación */}
        <nav className="flex flex-col space-y-1 overflow-y-auto max-h-[calc(100vh-270px)] pr-1">
          <div className="text-[10px] uppercase font-semibold text-[#928A91] tracking-wider px-3 mb-1">
            Planificación y Vida
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const badgeValue = item.badge
              ? item.badge({
                  todayTasks: todayPendingCount,
                  upcomingExams: upcomingExamsCount,
                })
              : null;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#FBEFF4] text-[#29252B] font-semibold shadow-2xs'
                    : 'text-[#928A91] hover:text-[#29252B] hover:bg-[#FCFAFB]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon
                    size={16}
                    className={
                      isActive
                        ? 'text-[#D68EAD]'
                        : 'text-[#928A91] group-hover:text-[#29252B]'
                    }
                  />
                  <span>{item.label}</span>
                </div>

                {badgeValue !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-[#E5A6C0] text-white'
                        : 'bg-[#F7EAF0] text-[#D68EAD]'
                    }`}
                  >
                    {badgeValue}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sección inferior: Configuración y Usuario */}
      <div className="pt-4 border-t border-[#F0EBEF] flex flex-col space-y-1 px-1">
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex items-center space-x-2.5 w-full px-3 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'settings'
              ? 'bg-[#FBEFF4] text-[#29252B] font-semibold'
              : 'text-[#928A91] hover:text-[#29252B] hover:bg-[#FCFAFB]'
          }`}
        >
          <Settings2
            size={16}
            className={activeTab === 'settings' ? 'text-[#D68EAD]' : 'text-[#928A91]'}
          />
          <span>Configuración y Copias</span>
        </button>

        <div className="flex items-center space-x-2.5 px-3 py-2 mt-1">
          <div className="w-7 h-7 rounded-full bg-[#F7EAF0] border border-[#E5A6C0]/40 flex items-center justify-center text-[11px] font-semibold text-[#D68EAD]">
            {settings.userName ? settings.userName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex flex-col text-left overflow-hidden">
            <span className="text-xs font-medium text-[#29252B] truncate">
              {settings.userName || 'Alex'}
            </span>
            <span className="text-[10px] text-[#928A91]">Espacio local</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
