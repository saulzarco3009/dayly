'use client';

import React, { useEffect } from 'react';
import { DaylyProvider, useDayly } from '@/context/DaylyContext';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Header } from '@/components/Header';
import { GlobalQuickAddModal } from '@/components/GlobalQuickAddModal';

// Vistas
import { OverviewView } from '@/views/OverviewView';
import { MonthView } from '@/views/MonthView';
import { WeekView } from '@/views/WeekView';
import { TodayView } from '@/views/TodayView';
import { TasksView } from '@/views/TasksView';
import { ExamsView } from '@/views/ExamsView';
import { ProjectsView } from '@/views/ProjectsView';
import { HabitsView } from '@/views/HabitsView';
import { GoalsView } from '@/views/GoalsView';
import { RoutinesView } from '@/views/RoutinesView';
import { NotesView } from '@/views/NotesView';
import { SettingsView } from '@/views/SettingsView';

function AppContent() {
  const { activeTab, openQuickAdd } = useDayly();

  // Atajos de teclado globales (ej. 'N' para Añadir Rápido)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        openQuickAdd('task');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openQuickAdd]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView />;
      case 'month':
        return <MonthView />;
      case 'week':
        return <WeekView />;
      case 'today':
        return <TodayView />;
      case 'tasks':
        return <TasksView />;
      case 'exams':
        return <ExamsView />;
      case 'projects':
        return <ProjectsView />;
      case 'habits':
        return <HabitsView />;
      case 'goals':
        return <GoalsView />;
      case 'routines':
        return <RoutinesView />;
      case 'notes':
        return <NotesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewView />;
    }
  };

  const getHeaderMeta = () => {
    switch (activeTab) {
      case 'overview':
        return undefined; // Saludo dinámico y fecha de hoy
      case 'month':
        return {
          title: 'Planificación Mensual',
          subtitle: 'Perspectiva global de exámenes, proyectos y fechas clave del mes.',
        };
      case 'week':
        return {
          title: 'Organizador Semanal',
          subtitle: 'Distribuye equilibradamente tu carga de lunes a domingo.',
        };
      case 'today':
        return {
          title: 'Planificador Diario',
          subtitle: 'Bloques de mañana, tarde y noche para un enfoque sereno.',
        };
      case 'tasks':
        return {
          title: 'Gestión de Tareas',
          subtitle: 'Listado completo de pendientes, prioridades y fechas límite.',
        };
      case 'exams':
        return {
          title: 'Exámenes y Sesiones de Estudio',
          subtitle: 'Preparación académica sistemática y cuentas atrás.',
        };
      case 'projects':
        return {
          title: 'Proyectos e Iniciativas',
          subtitle: 'Supervisión de entregables, hitos y avances.',
        };
      case 'habits':
        return {
          title: 'Hábitos Diarios',
          subtitle: 'Mantén rachas activas y consolida tu constancia.',
        };
      case 'goals':
        return {
          title: 'Objetivos y Visión',
          subtitle: 'Metas a largo plazo divididas en hitos progresivos.',
        };
      case 'routines':
        return {
          title: 'Rutinas y Rituales',
          subtitle: 'Secuencias de mañana, estudio, trabajo y descanso.',
        };
      case 'notes':
        return {
          title: 'Notas e Ideas',
          subtitle: 'Pensamientos, fragmentos de lectura y conceptos de estudio.',
        };
      case 'settings':
        return {
          title: 'Configuración y Datos',
          subtitle: 'Preferencias, copias de seguridad en JSON y almacenamiento.',
        };
      default:
        return undefined;
    }
  };

  const headerMeta = getHeaderMeta();

  return (
    <div className="flex min-h-screen bg-[#FCFAFB]">
      {/* Barra lateral de escritorio */}
      <Sidebar />

      {/* Espacio principal de trabajo */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={headerMeta?.title} subtitle={headerMeta?.subtitle} />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Navegación móvil */}
      <MobileNav />

      {/* Modal global de creación rápida */}
      <GlobalQuickAddModal />
    </div>
  );
}

export default function Page() {
  return (
    <DaylyProvider>
      <AppContent />
    </DaylyProvider>
  );
}
