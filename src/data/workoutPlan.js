// 6-Day Push/Pull/Legs — A/B Split with Sunday Rest

export const PROGRAM_NAME = '6-Day PPL — Push/Pull/Legs A/B Split'

export const PROGRAM_SCHEDULE = [
  { day: 'Mon', workout: 'Push A' },
  { day: 'Tue', workout: 'Pull A' },
  { day: 'Wed', workout: 'Legs A' },
  { day: 'Thu', workout: 'Push B' },
  { day: 'Fri', workout: 'Pull B' },
  { day: 'Sat', workout: 'Legs B' },
  { day: 'Sun', workout: 'Rest' },
]

export const PROGRESSION_RULES = [
  'Keep compounds around 1–2 RIR and isolations around 0–2 RIR.',
  'When all sets reach the top of the rep range cleanly, increase load next session.',
  'Rest 3–5 min on heavy compounds, 2–3 min on other compounds, and 1–2 min on isolations.',
]

export const CLIMBING_SUBSTITUTIONS = [
  {
    title: 'Hard climbing on a Pull day',
    details: 'Climb hard for 45–60 min, then do chest-supported row 2–3×6–10, rear delts 2×12–20, and one curl 2×8–12. Skip weighted pull-ups that day.',
  },
  {
    title: 'Moderate/technical climbing on a Pull day',
    details: 'Climb for 60–75 min, then do weighted pull-ups 2–3×5–8, rear delts 2×12–20, and one curl 2×8–12. Skip the extra rows.',
  },
  {
    title: 'No climbing',
    details: 'Complete the full scheduled Pull workout.',
  },
]

export const WEEKLY_CHECKIN_FIELDS = [
  'Week / dates',
  'Average bodyweight',
  'Bench best working set',
  'Weighted pull-up best set',
  'Squat best working set',
  'RDL best working set',
  'Climbing grade / project',
  'Recovery / notes',
]

export const workoutTemplates = [
  // ──────────────────────────────────────────
  // DAY 1 — Push A
  // ──────────────────────────────────────────
  {
    id: 'day-1',
    day: 1,
    name: 'Push A',
    category: 'Push',
    focus: 'A',
    color: '#ef4444',
    exercises: [
      { id: 'ex-1-1', name: 'Barbell Bench Press', sets: 3, reps: '5-8', muscleGroup: 'Chest' },
      { id: 'ex-1-2', name: 'Overhead Press', sets: 3, reps: '6-10', muscleGroup: 'Shoulders' },
      { id: 'ex-1-3', name: 'Cable or Machine Fly', sets: 2, reps: '10-15', muscleGroup: 'Chest' },
      { id: 'ex-1-4', name: 'Cable Lateral Raise', sets: 3, reps: '12-20', muscleGroup: 'Shoulders' },
      { id: 'ex-1-5', name: 'Overhead Cable Triceps Extension', sets: 3, reps: '8-12', muscleGroup: 'Triceps' },
      { id: 'ex-1-6', name: 'Weighted Dips', sets: 2, reps: '6-10', muscleGroup: 'Triceps' },
    ],
    core: [],
    coreNote: null,
    stretches: [],
  },

  // ──────────────────────────────────────────
  // DAY 2 — Pull A (Heavier)
  // ──────────────────────────────────────────
  {
    id: 'day-2',
    day: 2,
    name: 'Pull A (Heavier)',
    category: 'Pull',
    focus: 'Heavier',
    color: '#3b82f6',
    exercises: [
      { id: 'ex-2-1', name: 'Weighted Pull-Up', sets: 3, reps: '5-8', muscleGroup: 'Back' },
      { id: 'ex-2-2', name: 'Chest-Supported Row', sets: 3, reps: '6-10', muscleGroup: 'Back' },
      { id: 'ex-2-3', name: 'Single-Arm Cable Row', sets: 2, reps: '8-12', muscleGroup: 'Back' },
      { id: 'ex-2-4', name: 'Rear-Delt Fly', sets: 3, reps: '12-20', muscleGroup: 'Rear Delts' },
      { id: 'ex-2-5', name: 'Bayesian Cable Curl', sets: 3, reps: '8-12', muscleGroup: 'Biceps' },
      { id: 'ex-2-6', name: 'Hammer Curl', sets: 2, reps: '10-15', muscleGroup: 'Biceps' },
    ],
    core: [],
    coreNote: null,
    stretches: [],
  },

  // ──────────────────────────────────────────
  // DAY 3 — Legs A
  // ──────────────────────────────────────────
  {
    id: 'day-3',
    day: 3,
    name: 'Legs A',
    category: 'Legs',
    focus: 'A',
    color: '#22c55e',
    exercises: [
      { id: 'ex-3-1', name: 'Back Squat', sets: 3, reps: '5-8', muscleGroup: 'Quads' },
      { id: 'ex-3-2', name: 'Romanian Deadlift', sets: 3, reps: '6-10', muscleGroup: 'Hamstrings' },
      { id: 'ex-3-3', name: 'Leg Extension', sets: 3, reps: '10-15', muscleGroup: 'Quads' },
      { id: 'ex-3-4', name: 'Leg Curl', sets: 3, reps: '10-15', muscleGroup: 'Hamstrings' },
      { id: 'ex-3-5', name: 'Hip Adductor Machine', sets: 2, reps: '10-15', muscleGroup: 'Adductors' },
      { id: 'ex-3-6', name: 'Hip Abductor Machine', sets: 2, reps: '12-20', muscleGroup: 'Abductors' },
      { id: 'ex-3-7', name: 'Calf Raise', sets: 4, reps: '8-15', muscleGroup: 'Calves' },
    ],
    core: [],
    coreNote: null,
    stretches: [],
  },

  // ──────────────────────────────────────────
  // DAY 4 — Push B
  // ──────────────────────────────────────────
  {
    id: 'day-4',
    day: 4,
    name: 'Push B',
    category: 'Push',
    focus: 'B',
    color: '#f59e0b',
    exercises: [
      { id: 'ex-4-1', name: 'Incline Smith Press', sets: 3, reps: '6-10', muscleGroup: 'Chest' },
      { id: 'ex-4-2', name: 'Machine Shoulder Press', sets: 3, reps: '8-12', muscleGroup: 'Shoulders' },
      { id: 'ex-4-3', name: 'Cable Fly', sets: 2, reps: '10-15', muscleGroup: 'Chest' },
      { id: 'ex-4-4', name: 'Cable Lateral Raise', sets: 3, reps: '12-20', muscleGroup: 'Shoulders' },
      { id: 'ex-4-5', name: 'Overhead Cable Triceps Extension', sets: 3, reps: '10-15', muscleGroup: 'Triceps' },
      { id: 'ex-4-6', name: 'Triceps Pressdown', sets: 2, reps: '10-15', muscleGroup: 'Triceps' },
    ],
    core: [],
    coreNote: null,
    stretches: [],
  },

  // ──────────────────────────────────────────
  // DAY 5 — Pull B (Hypertrophy)
  // ──────────────────────────────────────────
  {
    id: 'day-5',
    day: 5,
    name: 'Pull B (Hypertrophy)',
    category: 'Pull',
    focus: 'Hypertrophy',
    color: '#a855f7',
    exercises: [
      { id: 'ex-5-1', name: 'Weighted Pull-Up', sets: 3, reps: '8-10', muscleGroup: 'Back' },
      { id: 'ex-5-2', name: 'Machine or Chest-Supported Row', sets: 3, reps: '8-12', muscleGroup: 'Back' },
      { id: 'ex-5-3', name: 'Single-Arm Cable Row', sets: 2, reps: '10-15', muscleGroup: 'Back' },
      { id: 'ex-5-4', name: 'Rear-Delt Fly', sets: 3, reps: '12-20', muscleGroup: 'Rear Delts' },
      { id: 'ex-5-5', name: 'Incline Dumbbell Curl', sets: 3, reps: '8-12', muscleGroup: 'Biceps' },
      { id: 'ex-5-6', name: 'Hammer Curl', sets: 2, reps: '10-15', muscleGroup: 'Biceps' },
    ],
    core: [],
    coreNote: null,
    stretches: [],
  },

  // ──────────────────────────────────────────
  // DAY 6 — Legs B (Hypertrophy)
  // ──────────────────────────────────────────
  {
    id: 'day-6',
    day: 6,
    name: 'Legs B (Hypertrophy)',
    category: 'Legs',
    focus: 'Hypertrophy',
    color: '#ec4899',
    exercises: [
      { id: 'ex-6-1', name: 'Leg Press', sets: 3, reps: '8-12', muscleGroup: 'Quads' },
      { id: 'ex-6-2', name: 'Bulgarian Split Squat', sets: 2, reps: '8-12 / leg', muscleGroup: 'Quads' },
      { id: 'ex-6-3', name: 'Romanian Deadlift', sets: 2, reps: '8-12', muscleGroup: 'Hamstrings' },
      { id: 'ex-6-4', name: 'Leg Curl', sets: 3, reps: '10-15', muscleGroup: 'Hamstrings' },
      { id: 'ex-6-5', name: 'Leg Extension', sets: 2, reps: '10-15', muscleGroup: 'Quads' },
      { id: 'ex-6-6', name: 'Hip Adductor Machine', sets: 2, reps: '10-15', muscleGroup: 'Adductors' },
      { id: 'ex-6-7', name: 'Hip Abductor Machine', sets: 2, reps: '12-20', muscleGroup: 'Abductors' },
      { id: 'ex-6-8', name: 'Calf Raise', sets: 4, reps: '10-20', muscleGroup: 'Calves' },
    ],
    core: [],
    coreNote: null,
    stretches: [],
  },

  // ──────────────────────────────────────────
  // DAY 7 — Rest
  // ──────────────────────────────────────────
  {
    id: 'day-7',
    day: 7,
    name: 'Rest',
    category: 'Recovery',
    focus: 'Rest',
    color: '#64748b',
    isRecovery: true,
    exercises: [],
    tasks: ['Rest day'],
    optional: ['Optional: light walking or mobility'],
    core: [],
    coreNote: null,
    stretches: [],
  },
]

// Build a unique exercise library from all templates
export function getExerciseLibrary() {
  const seen = new Set()
  const library = []
  for (const template of workoutTemplates) {
    for (const ex of template.exercises) {
      if (!seen.has(ex.name)) {
        seen.add(ex.name)
        library.push({
          name: ex.name,
          muscleGroup: ex.muscleGroup,
          usedInDays: [template.day],
          substitutions: ex.substitutions || null,
        })
      } else {
        const existing = library.find(e => e.name === ex.name)
        if (existing && !existing.usedInDays.includes(template.day)) {
          existing.usedInDays.push(template.day)
        }
      }
    }
    for (const core of template.core) {
      if (!seen.has(core.name)) {
        seen.add(core.name)
        library.push({
          name: core.name,
          muscleGroup: 'Core',
          usedInDays: [template.day],
          substitutions: core.substitutions || null,
        })
      } else {
        const existing = library.find(e => e.name === core.name)
        if (existing && !existing.usedInDays.includes(template.day)) {
          existing.usedInDays.push(template.day)
        }
      }
    }
  }
  return library
}
