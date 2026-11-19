'use client';

import React, { useMemo } from 'react';
import { Plus, Sparkles, Settings } from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { formatLongDate, getTodayStr } from '@/utils/dateUtils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const { settings, openQuickAdd, setActiveTab } = useDayly();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  const todayLong = useMemo(() => {
    return formatLongDate(getTodayStr());
  }, []);

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-[#F0EBEF] sticky top-0 z-30 px-4 sm:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Saludo y Fecha o Título de Página */}
        <div>
          {title ? (
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#29252B]">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-[#928A91] mt-0.5 font-medium">
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-base sm:text-xl font-semibold tracking-tight text-[#29252B]">
                  {greeting}, {settings.userName || 'Alex'}
                </span>
                <span className="inline-flex items-center text-[11px] text-[#D68EAD] bg-[#FBEFF4] px-2 py-0.5 rounded-full font-medium border border-[#F7EAF0]">
                  <Sparkles size={11} className="mr-1" /> Modo enfoque
                </span>
              </div>
              <p className="text-xs text-[#928A91] mt-0.5 font-medium">
                {todayLong}
              </p>
            </div>
          )}
        </div>

        {/* Acciones Rápidas */}
        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={() => openQuickAdd('task')}
            className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] hover:text-[#29252B] border border-[#F0EBEF] hover:border-[#E5A6C0] px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-2xs hover:shadow-xs active:scale-98"
          >
            <Plus size={15} className="text-[#D68EAD]" />
            <span>Añadir Rápido</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className="w-9 h-9 rounded-xl border border-[#F0EBEF] hover:border-[#E5A6C0] bg-white hover:bg-[#FCFAFB] flex items-center justify-center text-[#928A91] hover:text-[#29252B] transition-colors"
            title="Configuración y Gestión de Datos"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}
