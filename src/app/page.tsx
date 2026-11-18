'use client';

import React, { useEffect } from 'react';
import { DaylyProvider, useDayly } from '@/context/DaylyContext';
import { Sidebar } from '@/components/Sidebar';
import { MobileNav } from '@/components/MobileNav';
import { Header } from '@/components/Header';
import { GlobalQuickAddModal } from '@/components/GlobalQuickAddModal';

// Views
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
  const { activeTab, setActiveTab, openQuickAdd, isLoaded } = useDayly();

  // Global hotkeys (e.g. 'n' for Quick Add, ESC handled in modal)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input or textarea
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
        return undefined; // uses default personalized greeting & today's date
      case 'month':
        return {
          title: 'Monthly Planning',
          subtitle: 'High-level calendar overview of exams, projects, and deadlines.',
        };
      case 'week':
        return {
          title: 'Weekly Organizer',
          subtitle: 'Balance your workload across Monday through Sunday.',
        };
      case 'today':
        return {
          title: 'Daily Planner',
          subtitle: 'Morning, afternoon, and evening time blocks for peak focus.',
        };
      case 'tasks':
        return {
          title: 'Task Management',
          subtitle: 'Complete list of all to-dos, priorities, and deadlines.',
        };
      case 'exams':
        return {
          title: 'Exams & Study Sessions',
          subtitle: 'Academic preparation tracking and countdowns.',
        };
      case 'projects':
        return {
          title: 'Projects & Ventures',
          subtitle: 'Track milestones, tasks, and deliverables.',
        };
      case 'habits':
        return {
          title: 'Daily Habits',
          subtitle: 'Maintain streaks and build consistency.',
        };
      case 'goals':
        return {
          title: 'Goals & Vision',
          subtitle: 'Long-term milestones and progressive achievements.',
        };
      case 'routines':
        return {
          title: 'Routines & Rituals',
          subtitle: 'Morning, study, work, and evening sequences.',
        };
      case 'notes':
        return {
          title: 'Notes & Ideas',
          subtitle: 'Distraction-free thoughts and study concepts.',
        };
      case 'settings':
        return {
          title: 'Settings & Data',
          subtitle: 'Preferences and JSON backup management.',
        };
      default:
        return undefined;
    }
  };

  const headerMeta = getHeaderMeta();

  return (
    <div className="flex min-h-screen bg-[#FCFAFB]">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header title={headerMeta?.title} subtitle={headerMeta?.subtitle} />

        <main className="flex-1 px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Global Quick Add Modal */}
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
