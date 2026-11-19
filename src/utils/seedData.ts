import { Task, Exam, Project, Habit, Goal, Routine, Note, UserSettings, DailyReflection } from '@/types/dayly';
import { getTodayStr, addDays } from './dateUtils';

export function getInitialSeedData() {
  const today = getTodayStr();
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, 1);
  const day3 = addDays(today, 3);
  const day5 = addDays(today, 5);
  const day8 = addDays(today, 8);
  const day12 = addDays(today, 12);

  const initialSettings: UserSettings = {
    userName: 'Alex',
    weekStartsOnMonday: true,
    soundEnabled: true,
    defaultTaskPriority: 'medium',
  };

  const initialProjects: Project[] = [
    {
      id: 'proj-1',
      name: 'Aplicación Móvil DAYLY',
      description: 'Diseño y optimización de la experiencia móvil y sincronización sin conexión.',
      startDate: yesterday,
      deadline: day12,
      status: 'In Progress',
      color: '#E5A6C0',
      notes: 'Enfoque en interacciones minimalistas y transiciones fluidas.',
      milestones: [
        { id: 'm-1', title: 'Especificación del sistema de diseño', completed: true, dueDate: yesterday },
        { id: 'm-2', title: 'Prototipos de navegación interactiva', completed: true, dueDate: today },
        { id: 'm-3', title: 'Verificación de persistencia offline', completed: false, dueDate: day5 },
        { id: 'm-4', title: 'Lanzamiento de versión beta', completed: false, dueDate: day12 },
      ],
      createdAt: yesterday,
    },
    {
      id: 'proj-2',
      name: 'Portafolio de Diseño 2026',
      description: 'Curación de casos de estudio y publicación de proyectos destacados.',
      startDate: addDays(today, -5),
      deadline: addDays(today, 20),
      status: 'In Progress',
      color: '#78AC8E',
      notes: 'Tipografía cuidada, fotografía limpia y paleta monocromática.',
      milestones: [
        { id: 'm-201', title: 'Seleccionar los 5 mejores proyectos', completed: true },
        { id: 'm-202', title: 'Redactar memorias y casos de estudio', completed: false },
        { id: 'm-203', title: 'Revisión final de maquetación', completed: false },
      ],
      createdAt: addDays(today, -5),
    },
  ];

  const initialExams: Exam[] = [
    {
      id: 'exam-1',
      subject: 'Arquitectura de Sistemas Distribuidos',
      examDate: day5,
      examTime: '10:00',
      difficulty: 'Hard',
      status: 'Upcoming',
      notes: 'Temas: consenso distribuido, modelos de memoria, tolerancia a fallos y particiones CAP.',
      topics: [
        { id: 't-1', name: 'Consenso Distribuido (Raft y Paxos)', completed: true },
        { id: 't-2', name: 'Arquitecturas dirigidas por eventos y Sagas', completed: true },
        { id: 't-3', name: 'Particionamiento y Teorema CAP', completed: false },
        { id: 't-4', name: 'Patrones de resiliencia en microservicios', completed: false },
        { id: 't-5', name: 'Optimización y profiling de rendimiento', completed: false },
      ],
      studyTaskIds: ['task-study-1', 'task-study-2'],
      createdAt: yesterday,
    },
    {
      id: 'exam-2',
      subject: 'Interacción Persona-Ordenador (HCI)',
      examDate: day12,
      examTime: '14:30',
      difficulty: 'Medium',
      status: 'Upcoming',
      notes: 'Carga cognitiva, Ley de Fitts, sistemas de diseño accesibles WCAG 2.2.',
      topics: [
        { id: 't-201', name: 'Principios Gestalt aplicados a UI', completed: true },
        { id: 't-202', name: 'Accesibilidad y estándares WCAG 2.2 AA', completed: false },
        { id: 't-203', name: 'Métodos de investigación cualitativa', completed: false },
      ],
      studyTaskIds: [],
      createdAt: yesterday,
    },
  ];

  const initialTasks: Task[] = [
    // Prioridades de hoy
    {
      id: 'task-1',
      title: 'Repasar Tema 4 de Arquitectura: Consenso Raft',
      description: 'Estudiar elección de líder y replicación de registros en Raft.',
      dueDate: today,
      scheduledTime: '09:00',
      timeSlot: 'morning',
      priority: 'high',
      category: 'Académico',
      status: 'completed',
      completedAt: `${today}T10:15:00Z`,
      examId: 'exam-1',
      isPriority: true,
      createdAt: yesterday,
    },
    {
      id: 'task-2',
      title: 'Ajustar microinteracciones de navegación móvil',
      description: 'Verificar fluidez al cambiar de pestaña y estados activos en rosa suave.',
      dueDate: today,
      scheduledTime: '11:30',
      timeSlot: 'morning',
      priority: 'high',
      category: 'Proyecto',
      status: 'in_progress',
      projectId: 'proj-1',
      isPriority: true,
      createdAt: yesterday,
    },
    {
      id: 'task-3',
      title: 'Redactar balance semanal y revisión de hitos',
      description: 'Documentar logros alcanzados y actualizar fechas límite.',
      dueDate: today,
      scheduledTime: '16:00',
      timeSlot: 'afternoon',
      priority: 'medium',
      category: 'Trabajo',
      status: 'pending',
      isPriority: true,
      createdAt: yesterday,
    },
    {
      id: 'task-4',
      title: 'Crear tarjetas de repaso de ACID y Teorema CAP',
      description: '25 preguntas clave para el repaso final.',
      dueDate: today,
      scheduledTime: '17:30',
      timeSlot: 'afternoon',
      priority: 'medium',
      category: 'Académico',
      status: 'pending',
      examId: 'exam-1',
      createdAt: yesterday,
    },
    {
      id: 'task-5',
      title: 'Lectura nocturna: El diseño de las cosas cotidianas (Cap. 5)',
      description: 'Tomar notas sobre affordances y modelos mentales.',
      dueDate: today,
      scheduledTime: '21:00',
      timeSlot: 'evening',
      priority: 'low',
      category: 'Personal',
      status: 'pending',
      createdAt: yesterday,
    },
    // Días siguientes
    {
      id: 'task-study-1',
      title: '[Arquitectura] Sesión de estudio: Sagas y Transacciones',
      description: 'Bloque de estudio para el examen de Arquitectura de Sistemas Distribuidos.',
      dueDate: tomorrow,
      scheduledTime: '10:00',
      timeSlot: 'morning',
      priority: 'high',
      category: 'Académico',
      status: 'pending',
      examId: 'exam-1',
      createdAt: today,
    },
    {
      id: 'task-study-2',
      title: '[Arquitectura] Simulacro de examen y preguntas prácticas',
      description: 'Práctica cronometrada para el examen de Arquitectura.',
      dueDate: day3,
      scheduledTime: '14:00',
      timeSlot: 'afternoon',
      priority: 'high',
      category: 'Académico',
      status: 'pending',
      examId: 'exam-1',
      createdAt: today,
    },
    {
      id: 'task-6',
      title: 'Revisión tipográfica de pruebas de imprenta',
      dueDate: day3,
      scheduledTime: '16:30',
      timeSlot: 'afternoon',
      priority: 'medium',
      category: 'Proyecto',
      status: 'pending',
      projectId: 'proj-2',
      createdAt: today,
    },
    {
      id: 'task-7',
      title: 'Comprar muestras de papel verjurado y archivo',
      dueDate: day5,
      priority: 'low',
      category: 'Personal',
      status: 'pending',
      createdAt: today,
    },
    {
      id: 'task-8',
      title: 'Auditoría financiera mensual y revisión de suscripciones',
      dueDate: day8,
      priority: 'medium',
      category: 'Finanzas',
      status: 'pending',
      createdAt: today,
    },
  ];

  const initialHabits: Habit[] = [
    {
      id: 'h-1',
      name: 'Hidratación matutina y té verde',
      category: 'Salud',
      frequency: 'daily',
      history: {
        [addDays(today, -6)]: true,
        [addDays(today, -5)]: true,
        [addDays(today, -4)]: true,
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: true,
        [yesterday]: true,
        [today]: true,
      },
      createdAt: addDays(today, -10),
    },
    {
      id: 'h-2',
      name: '25 min de lectura y estudio enfocado',
      category: 'Académico',
      frequency: 'daily',
      history: {
        [addDays(today, -5)]: true,
        [addDays(today, -4)]: true,
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: true,
        [yesterday]: true,
        [today]: true,
      },
      createdAt: addDays(today, -10),
    },
    {
      id: 'h-3',
      name: 'Paseo de 20 min al aire libre',
      category: 'Salud',
      frequency: 'daily',
      history: {
        [addDays(today, -4)]: true,
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: false,
        [yesterday]: true,
        [today]: false,
      },
      createdAt: addDays(today, -10),
    },
    {
      id: 'h-4',
      name: 'Reflexión nocturna y orden del escritorio',
      category: 'Personal',
      frequency: 'daily',
      history: {
        [addDays(today, -3)]: true,
        [addDays(today, -2)]: true,
        [yesterday]: true,
        [today]: false,
      },
      createdAt: addDays(today, -10),
    },
  ];

  const initialGoals: Goal[] = [
    {
      id: 'goal-1',
      title: 'Graduación con Matrícula de Honor',
      description: 'Mantener constancia en el estudio y entregar los proyectos antes de la fecha límite.',
      category: 'Academic',
      targetDate: addDays(today, 90),
      milestones: [
        { id: 'gm-1', title: 'Sobresaliente en Arquitectura de Sistemas', completed: false },
        { id: 'gm-2', title: 'Entregar tesis de HCI con mención de honor', completed: false },
        { id: 'gm-3', title: 'Completar los 4 módulos de especialización', completed: true },
      ],
      associatedTaskIds: ['task-1', 'task-study-1'],
      notes: 'Constancia diaria antes que atracones de última hora. 2 bloques de trabajo profundo al día.',
      createdAt: addDays(today, -30),
    },
    {
      id: 'goal-2',
      title: 'Lanzar la Aplicación DAYLY',
      description: 'Crear una experiencia de productividad serena, rápida y sin elementos innecesarios.',
      category: 'Professional',
      targetDate: addDays(today, 30),
      milestones: [
        { id: 'gm-201', title: 'Completar las 11 secciones principales', completed: true },
        { id: 'gm-202', title: 'Implementar persistencia local y copias de seguridad', completed: true },
        { id: 'gm-203', title: 'Publicar guía de diseño y arquitectura', completed: false },
      ],
      associatedTaskIds: ['task-2'],
      notes: 'La sencillez es la máxima sofisticación.',
      createdAt: addDays(today, -14),
    },
    {
      id: 'goal-3',
      title: 'Leer 12 libros esenciales de Diseño y Sistemas',
      description: 'Priorizar principios atemporales sobre tendencias pasajeras.',
      category: 'Personal',
      targetDate: addDays(today, 120),
      milestones: [
        { id: 'gm-301', title: 'El diseño de las cosas cotidianas', completed: false },
        { id: 'gm-302', title: 'Pensar en sistemas (Donella Meadows)', completed: true },
        { id: 'gm-303', title: 'Hábitos Atómicos (James Clear)', completed: true },
      ],
      createdAt: addDays(today, -60),
    },
  ];

  const initialRoutines: Routine[] = [
    {
      id: 'routine-morning',
      name: 'Rutina Matutina Consciente',
      timeSlot: 'morning',
      steps: [
        { id: 'rs-1', title: 'Vaso de agua grande + estiramiento', durationMinutes: 5 },
        { id: 'rs-2', title: '5 minutos de respiración y calma', durationMinutes: 5 },
        { id: 'rs-3', title: 'Desayuno saludable y nutritivo', durationMinutes: 20 },
        { id: 'rs-4', title: 'Abrir DAYLY y revisar las 3 prioridades', durationMinutes: 5 },
      ],
      completions: {
        [today]: ['rs-1', 'rs-2', 'rs-3'],
        [yesterday]: ['rs-1', 'rs-2', 'rs-3', 'rs-4'],
      },
      createdAt: addDays(today, -20),
    },
    {
      id: 'routine-study',
      name: 'Sesión de Trabajo y Estudio Profundo',
      timeSlot: 'afternoon',
      steps: [
        { id: 'rs-201', title: 'Despejar el escritorio y cerrar pestañas innecesarias', durationMinutes: 5 },
        { id: 'rs-202', title: 'Activar modo concentración sin distracciones', durationMinutes: 2 },
        { id: 'rs-203', title: 'Bloque de concentración profunda de 50 minutos', durationMinutes: 50 },
        { id: 'rs-204', title: '10 minutos de pausa activa e hidratación', durationMinutes: 10 },
      ],
      completions: {
        [today]: ['rs-201', 'rs-202'],
      },
      createdAt: addDays(today, -20),
    },
    {
      id: 'routine-evening',
      name: 'Cierre de Jornada y Desconexión',
      timeSlot: 'evening',
      steps: [
        { id: 'rs-301', title: 'Marcar tareas completadas en DAYLY', durationMinutes: 5 },
        { id: 'rs-302', title: 'Escribir la reflexión del día: ¿Qué fue bien?', durationMinutes: 5 },
        { id: 'rs-303', title: 'Definir las 3 intenciones de mañana', durationMinutes: 5 },
        { id: 'rs-304', title: 'Apagar pantallas y 20 minutos de lectura', durationMinutes: 20 },
      ],
      completions: {
        [yesterday]: ['rs-301', 'rs-302', 'rs-303', 'rs-304'],
      },
      createdAt: addDays(today, -20),
    },
  ];

  const initialReflection: DailyReflection = {
    date: today,
    wentWell: 'Gran concentración durante el repaso matutino de sistemas distribuidos. El diseño limpio en rosa suave transmite mucha calma.',
    improveTomorrow: 'Programar un bloque ininterrumpido de 90 minutos para la práctica de HCI antes de abrir aplicaciones de mensajería.',
    mood: 'great',
  };

  const initialNotes: Note[] = [
    {
      id: 'note-1',
      title: 'Principios de Diseño de DAYLY',
      content: `1. PLANIFICA TU MES. ORGANIZA TU SEMANA. ENFÓCATE EN HOY.
2. Amplios espacios en blanco, bordes delicados (#F0EBEF) y sutiles acentos rosas (#E5A6C0).
3. Conectar todos los niveles de planificación: Mes -> Semana -> Día -> Tarea.
4. Minimalista, sereno, moderno y agradable de usar cada mañana.`,
      category: 'Productividad',
      isPinned: true,
      createdAt: addDays(today, -3),
      updatedAt: today,
    },
    {
      id: 'note-2',
      title: 'Conceptos Clave de Arquitectura',
      content: `• Consenso Raft: Elección de líder con tiempos aleatorios, replicación de log e invariante de seguridad.
• Teorema CAP: En sistemas distribuidos con particiones de red (P), solo es posible garantizar Consistencia (C) o Disponibilidad (A).
• Sagas Distribuidas: Orquestación vs Coreografía para transacciones entre servicios con acciones de compensación.`,
      category: 'Académico',
      isPinned: false,
      createdAt: yesterday,
      updatedAt: today,
    },
    {
      id: 'note-3',
      title: 'Libros Recomendados',
      content: `• "Make Time" — Jake Knapp & John Zeratsky
• "Esencialismo: Logra el máximo con el mínimo esfuerzo" — Greg McKeown
• "Deep Work: Concentración en un mundo distraído" — Cal Newport
• "Los elementos del estilo tipográfico" — Robert Bringhurst`,
      category: 'Lectura',
      isPinned: false,
      createdAt: addDays(today, -7),
      updatedAt: yesterday,
    },
  ];

  return {
    tasks: initialTasks,
    exams: initialExams,
    projects: initialProjects,
    habits: initialHabits,
    goals: initialGoals,
    routines: initialRoutines,
    reflections: { [today]: initialReflection },
    notes: initialNotes,
    settings: initialSettings,
  };
}
