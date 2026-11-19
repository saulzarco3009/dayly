'use client';

import React, { useState } from 'react';
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
  Menu,
  X,
  Plus,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { NavTab } from '@/types/dayly';
import { getTodayStr } from '@/utils/dateUtils';

export function MobileNav() {
  const { activeTab, setActiveTab, tasks, exams, openQuickAdd, settings } = useDayly();
  const [menuOpen, setMenuOpen] = useState(false);

  const todayStr = getTodayStr();
  const todayPendingCount = tasks.filter(
    (t) => t.dueDate === todayStr && t.status !== 'completed'
  ).length;

  const upcomingExamsCount = exams.filter(
    (e) => e.status !== 'Completed' && e.examDate >= todayStr
  ).length;

  const handleSelectTab = (tab: NavTab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  const ALL_NAV_ITEMS = [
    { id: 'overview' as NavTab, label: 'Vista General', icon: LayoutDashboard },
    { id: 'month' as NavTab, label: 'Mi Mes', icon: Calendar },
    { id: 'week' as NavTab, label: 'Mi Semana', icon: CalendarDays },
    {
      id: 'today' as NavTab,
      label: 'Hoy',
      icon: SunMedium,
      badge: todayPendingCount > 0 ? todayPendingCount : undefined,
    },
    { id: 'tasks' as NavTab, label: 'Tareas', icon: CheckSquare },
    {
      id: 'exams' as NavTab,
      label: 'Exámenes y Estudio',
      icon: GraduationCap,
      badge: upcomingExamsCount > 0 ? upcomingExamsCount : undefined,
    },
    { id: 'projects' as NavTab, label: 'Proyectos', icon: FolderKanban },
    { id: 'habits' as NavTab, label: 'Hábitos', icon: Sparkles },
    { id: 'goals' as NavTab, label: 'Objetivos', icon: Flag },
    { id: 'routines' as NavTab, label: 'Rutinas', icon: Repeat },
    { id: 'notes' as NavTab, label: 'Notas', icon: FileText },
    { id: 'settings' as NavTab, label: 'Configuración y Datos', icon: Settings2 },
  ];

  return (
    <>
      {/* Barra de Navegación Inferior en Móvil */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F0EBEF] px-4 py-2 pb-safe shadow-sm">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button
            onClick={() => handleSelectTab('overview')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'overview'
                ? 'text-[#D68EAD]'
                : 'text-[#928A91] hover:text-[#29252B]'
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="mt-1">Inicio</span>
          </button>

          <button
            onClick={() => handleSelectTab('today')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors relative ${
              activeTab === 'today'
                ? 'text-[#D68EAD]'
                : 'text-[#928A91] hover:text-[#29252B]'
            }`}
          >
            <SunMedium size={18} />
            <span className="mt-1">Hoy</span>
            {todayPendingCount > 0 && (
              <span className="absolute top-0 right-2 w-2 h-2 rounded-full bg-[#E5A6C0]" />
            )}
          </button>

          {/* Botón Central de Creación Rápida */}
          <button
            onClick={() => openQuickAdd('task')}
            className="w-10 h-10 rounded-full bg-[#FBEFF4] border border-[#E5A6C0] text-[#D68EAD] flex items-center justify-center -mt-3 shadow-md hover:bg-[#F7EAF0] active:scale-95 transition-all"
            aria-label="Crear Actividad"
          >
            <Plus size={20} />
          </button>

          <button
            onClick={() => handleSelectTab('month')}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              activeTab === 'month'
                ? 'text-[#D68EAD]'
                : 'text-[#928A91] hover:text-[#29252B]'
            }`}
          >
            <Calendar size={18} />
            <span className="mt-1">Mes</span>
          </button>

          <button
            onClick={() => setMenuOpen(true)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
              menuOpen ? 'text-[#D68EAD]' : 'text-[#928A91] hover:text-[#29252B]'
            }`}
          >
            <Menu size={18} />
            <span className="mt-1">Menú</span>
          </button>
        </div>
      </div>

      {/* Menú Desplegable Completo en Móvil */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-xs transition-opacity animate-fade-in"
            onClick={() => setMenuOpen(false)}
          />

          <div className="relative bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto px-6 pt-5 pb-8 shadow-2xl border-t border-[#F0EBEF] z-10 animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EBEF]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5A6C0]" />
                <span className="text-base font-semibold text-[#29252B]">
                  Menú DAYLY
                </span>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-[#FCFAFB] border border-[#F0EBEF] flex items-center justify-center text-[#928A91] hover:text-[#29252B]"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mt-4">
              {ALL_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center space-x-3 p-3 rounded-2xl border text-left text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#FBEFF4] border-[#E5A6C0] text-[#29252B] font-semibold'
                        : 'bg-[#FCFAFB] border-[#F0EBEF] text-[#29252B] hover:bg-[#FBEFF4]/50'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-white text-[#D68EAD]'
                          : 'bg-white border border-[#F0EBEF] text-[#928A91]'
                      }`}
                    >
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.label}</div>
                      {item.badge !== undefined && (
                        <span className="text-[10px] text-[#D68EAD] font-semibold">
                          {item.badge} pendientes
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[#F0EBEF] flex items-center justify-between">
              <div className="text-xs text-[#928A91]">
                Sesión de <span className="font-semibold text-[#29252B]">{settings.userName}</span>
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  openQuickAdd('task');
                }}
                className="text-xs font-medium px-3 py-1.5 rounded-xl bg-[#FBEFF4] text-[#D68EAD] border border-[#E5A6C0]/50"
              >
                + Añadir Rápido
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
