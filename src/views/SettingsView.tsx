'use client';

import React, { useState } from 'react';
import {
  Settings2,
  Download,
  Upload,
  RotateCcw,
  User,
  ShieldCheck,
  AlertTriangle,
  Database,
  Sparkles,
} from 'lucide-react';
import { useDayly } from '@/context/DaylyContext';
import { getTodayStr } from '@/utils/dateUtils';

export function SettingsView() {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    resetData,
    tasks,
    exams,
    projects,
    habits,
    notes,
  } = useDayly();

  const [userNameInput, setUserNameInput] = useState(settings.userName);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ userName: userNameInput.trim() || 'Alex' });
  };

  const handleExportJSON = () => {
    const jsonStr = exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dayly-copia-seguridad-${getTodayStr()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = importData(text);
        if (success) {
          setImportStatus('¡Copia de seguridad restaurada con éxito! Todas las secciones se han actualizado.');
        } else {
          setImportStatus('Error al importar copia de seguridad: formato de archivo no válido.');
        }
      } catch (err) {
        setImportStatus('Error al leer el archivo. Por favor sube un archivo JSON válido.');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    resetData();
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-16 max-w-4xl">
      {/* Cabecera */}
      <div className="bg-white p-5 rounded-2xl border border-[#F0EBEF] shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-[#FCFAFB] border border-[#F0EBEF] text-[#D68EAD] flex items-center justify-center">
            <Settings2 size={18} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#29252B]">
              Configuración y Datos del Espacio
            </h2>
            <p className="text-xs text-[#928A91]">
              Preferencias, persistencia en LocalStorage, copias de seguridad y arquitectura del sistema.
            </p>
          </div>
        </div>
      </div>

      {/* Preferencias de Usuario */}
      <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#F0EBEF]">
          <User size={16} className="text-[#D68EAD]" />
          <h3 className="text-sm font-semibold text-[#29252B]">
            Preferencias de Perfil
          </h3>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-medium text-[#29252B] mb-1">
              Tu Nombre / Saludo preferido
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#F0EBEF] bg-[#FCFAFB] focus:bg-white focus:outline-none focus:border-[#E5A6C0]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] rounded-xl text-xs font-semibold transition-all"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Almacenamiento y Copias */}
      <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EBEF]">
          <div className="flex items-center space-x-2">
            <Database size={16} className="text-[#D68EAD]" />
            <h3 className="text-sm font-semibold text-[#29252B]">
              Copia de Seguridad y Gestión de Datos
            </h3>
          </div>
          <span className="text-[11px] text-[#78AC8E] font-semibold flex items-center bg-[#EBF5F0] px-2 py-0.5 rounded-full">
            <ShieldCheck size={12} className="mr-1" /> LocalStorage Persistente
          </span>
        </div>

        <p className="text-xs text-[#928A91] leading-relaxed">
          DAYLY funciona de forma 100% privada y local con guardado inmediato en tu navegador. Puedes exportar
          una copia de seguridad en cualquier momento, transferirla a otro equipo o restaurarla cuando lo necesites.
        </p>

        {/* Resumen de Datos Actuales */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3 bg-[#FCFAFB] rounded-xl border border-[#F0EBEF] text-center">
          <div>
            <div className="text-xs text-[#928A91]">Tareas</div>
            <div className="text-sm font-bold text-[#29252B]">{tasks.length}</div>
          </div>
          <div>
            <div className="text-xs text-[#928A91]">Exámenes</div>
            <div className="text-sm font-bold text-[#29252B]">{exams.length}</div>
          </div>
          <div>
            <div className="text-xs text-[#928A91]">Proyectos</div>
            <div className="text-sm font-bold text-[#29252B]">{projects.length}</div>
          </div>
          <div>
            <div className="text-xs text-[#928A91]">Hábitos</div>
            <div className="text-sm font-bold text-[#29252B]">{habits.length}</div>
          </div>
          <div>
            <div className="text-xs text-[#928A91]">Notas</div>
            <div className="text-sm font-bold text-[#29252B]">{notes.length}</div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center space-x-2 bg-[#FBEFF4] hover:bg-[#F7EAF0] text-[#29252B] border border-[#E5A6C0] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-2xs"
          >
            <Download size={14} className="text-[#D68EAD]" />
            <span>Exportar Copia (JSON)</span>
          </button>

          <label className="flex items-center space-x-2 bg-white hover:bg-[#FCFAFB] text-[#29252B] border border-[#F0EBEF] hover:border-[#E5A6C0] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all">
            <Upload size={14} className="text-[#928A91]" />
            <span>Importar Copia (JSON)</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-2 text-[#DF7682] hover:bg-[#FDF0F2] border border-[#FAD8DC] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ml-auto"
          >
            <RotateCcw size={14} />
            <span>Restablecer Datos Iniciales</span>
          </button>
        </div>

        {importStatus && (
          <div className="p-3 bg-[#FCFAFB] border border-[#F0EBEF] rounded-xl text-xs text-[#29252B]">
            {importStatus}
          </div>
        )}
      </div>

      {/* Filosofía del Producto */}
      <div className="bg-white rounded-2xl border border-[#F0EBEF] shadow-2xs p-5 sm:p-6 space-y-3">
        <div className="flex items-center space-x-2 pb-3 border-b border-[#F0EBEF]">
          <Sparkles size={16} className="text-[#D68EAD]" />
          <h3 className="text-sm font-semibold text-[#29252B]">
            Arquitectura y Filosofía de Diseño
          </h3>
        </div>

        <div className="space-y-2 text-xs text-[#928A91] leading-relaxed">
          <p className="font-semibold text-[#29252B]">
            PLANIFICA TU MES. ORGANIZA TU SEMANA. ENFÓCATE EN HOY.
          </p>
          <p>
            DAYLY conecta armónicamente todos los niveles de planificación: <strong>Mes &rarr; Semana &rarr; Día &rarr; Tarea</strong>.
            Una tarea creada para una fecha se refleja automáticamente en la cuadrícula mensual, en la vista semanal y en las franjas horarias del día.
          </p>
          <p>
            La capa de almacenamiento está desacoplada en el contexto de React, preparada para conectarse con servicios en la nube como Supabase sin necesidad de reescribir la aplicación.
          </p>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN DE RESTABLECIMIENTO */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity"
            onClick={() => setShowResetConfirm(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-[#F0EBEF] p-6 z-10 space-y-4">
            <div className="flex items-center space-x-2 text-[#DF7682]">
              <AlertTriangle size={18} />
              <h3 className="text-sm font-bold">¿Restablecer datos de DAYLY?</h3>
            </div>
            <p className="text-xs text-[#928A91] leading-relaxed">
              Esta acción restaurará los datos de ejemplo iniciales en español. Tus tareas o notas
              personalizadas se reemplazarán. Te sugerimos exportar una copia JSON previamente si deseas conservarlas.
            </p>
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#F0EBEF]">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 text-xs text-[#928A91]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                className="px-4 py-2 text-xs font-semibold bg-[#DF7682] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Sí, restablecer datos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
