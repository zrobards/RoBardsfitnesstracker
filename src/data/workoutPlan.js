// 6-Day Push/Pull/Legs — Every Muscle 2x/Week
// Full workout template data for RoBards Training Log

export const PROGRAM_NAME = '6-Day PPL — All Muscles 2x/Week'

export const STARTER_WEIGHTS = [
  { exercise: 'Barbell Bench Press', range: '95-125 lb' },
  { exercise: 'Back Squat', range: '95-135 lb' },
  { exercise: 'Incline Dumbbell Press', range: '30-45 lb dumbbells' },
  { exercise: 'Barbell Rows', range: '65-95 lb' },
  { exercise: 'Lat Pulldown', range: '70-120 lb' },
  { exercise: 'Romanian Deadlift', range: '95-135 lb' },
  { exercise: 'Overhead Press', range: '65-95 lb' },
]

export const STARTER_WEIGHTS_NOTE = 'Always leave about 2 reps in reserve. Prioritize form over weight.'

export const workoutTemplates = [
  // ──────────────────────────────────────────
  // DAY 1 — Push A (Strength)
  // ──────────────────────────────────────────
  {
    id: 'day-1',
    day: 1,
    name: 'Push A (Strength)',
    category: 'Push',
    focus: 'Strength',
    color: '#ef4444',
    exercises: [
      { id: 'ex-1-1', name: 'Barbell Bench Press', sets: 4, reps: '4-6', muscleGroup: 'Chest' },
      { id: 'ex-1-2', name: 'Overhead Press', sets: 3, reps: '5-6', muscleGroup: 'Shoulders' },
      { id: 'ex-1-3', name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', muscleGroup: 'Chest' },
      { id: 'ex-1-4', name: 'Lateral Raises', sets: 3, reps: '12-15', muscleGroup: 'Shoulders' },
      { id: 'ex-1-5', name: 'Triceps Pushdown', sets: 3, reps: '10-12', muscleGroup: 'Triceps' },
      { id: 'ex-1-6', name: 'Overhead Triceps Extension', sets: 3, reps: '10-12', muscleGroup: 'Triceps' },
    ],
    core: [
      { name: 'Hanging Knee Raises', sets: 3, reps: '12' },
    ],
    coreNote: null,
    stretches: ['Chest doorway stretch', 'Shoulder band stretch'],
  },

  // ──────────────────────────────────────────
  // DAY 2 — Pull A (Strength)
  // ──────────────────────────────────────────
  {
    id: 'day-2',
    day: 2,
    name: 'Pull A (Strength)',
    category: 'Pull',
    focus: 'Strength',
    color: '#3b82f6',
    exercises: [
      { id: 'ex-2-1', name: 'Pull-Ups or Lat Pulldown', sets: 4, reps: '6-8', muscleGroup: 'Back', substitutions: ['Pull-Ups', 'Lat Pulldown'] },
      { id: 'ex-2-2', name: 'Barbell Rows', sets: 3, reps: '6-8', muscleGroup: 'Back' },
      { id: 'ex-2-3', name: 'Seated Cable Row', sets: 3, reps: '8-12', muscleGroup: 'Back' },
      { id: 'ex-2-4', name: 'Face Pulls', sets: 3, reps: '12-15', muscleGroup: 'Rear Delts' },
      { id: 'ex-2-5', name: 'Barbell Curl', sets: 3, reps: '8-12', muscleGroup: 'Biceps' },
      { id: 'ex-2-6', name: 'Hammer Curl', sets: 3, reps: '10-12', muscleGroup: 'Biceps' },
      { id: 'ex-2-7', name: 'Wrist Curls', sets: 3, reps: '12-15', muscleGroup: 'Forearms' },
    ],
    core: [],
    coreNote: null,
    stretches: ['Lat stretch', 'Biceps stretch'],
  },

  // ──────────────────────────────────────────
  // DAY 3 — Legs A (Strength)
  // ──────────────────────────────────────────
  {
    id: 'day-3',
    day: 3,
    name: 'Legs A (Strength)',
    category: 'Legs',
    focus: 'Strength',
    color: '#22c55e',
    exercises: [
      { id: 'ex-3-1', name: 'Back Squat', sets: 4, reps: '4-6', muscleGroup: 'Quads' },
      { id: 'ex-3-2', name: 'Romanian Deadlift', sets: 3, reps: '8-10', muscleGroup: 'Hamstrings' },
      { id: 'ex-3-3', name: 'Leg Press', sets: 3, reps: '10', muscleGroup: 'Quads' },
      { id: 'ex-3-4', name: 'Leg Curl (machine)', sets: 3, reps: '10-12', muscleGroup: 'Hamstrings' },
      { id: 'ex-3-5', name: 'Standing Calf Raises', sets: 4, reps: '12-15', muscleGroup: 'Calves' },
      { id: 'ex-3-6', name: 'Cable Pull-Throughs', sets: 3, reps: '12-15', muscleGroup: 'Glutes' },
    ],
    core: [
      { name: 'Plank', sets: 1, reps: '45 sec' },
      { name: 'Bicycle Crunch', sets: 1, reps: '20' },
      { name: 'Leg Raises', sets: 1, reps: '12-15' },
    ],
    coreNote: 'Core Circuit #1 — Perform 3 rounds',
    stretches: ['Hamstrings', 'Quads', 'Hip flexors'],
  },

  // ──────────────────────────────────────────
  // DAY 4 — Push B (Hypertrophy)
  // ──────────────────────────────────────────
  {
    id: 'day-4',
    day: 4,
    name: 'Push B (Hypertrophy)',
    category: 'Push',
    focus: 'Hypertrophy',
    color: '#f59e0b',
    exercises: [
      { id: 'ex-4-1', name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', muscleGroup: 'Chest' },
      { id: 'ex-4-2', name: 'Machine Chest Press', sets: 3, reps: '10-12', muscleGroup: 'Chest' },
      { id: 'ex-4-3', name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', muscleGroup: 'Shoulders' },
      { id: 'ex-4-4', name: 'Lateral Raises', sets: 4, reps: '15-20', muscleGroup: 'Shoulders' },
      { id: 'ex-4-5', name: 'Cable Fly', sets: 3, reps: '12-15', muscleGroup: 'Chest' },
      { id: 'ex-4-6', name: 'Skull Crushers', sets: 3, reps: '12', muscleGroup: 'Triceps' },
      { id: 'ex-4-7', name: 'Triceps Pushdown', sets: 3, reps: '12-15', muscleGroup: 'Triceps' },
    ],
    core: [
      { name: 'Hanging Knee Raises', sets: 3, reps: '12' },
    ],
    coreNote: null,
    stretches: ['Chest doorway stretch', 'Shoulder band stretch'],
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
      { id: 'ex-5-1', name: 'Lat Pulldown', sets: 4, reps: '8-12', muscleGroup: 'Back' },
      { id: 'ex-5-2', name: 'Seated Cable Row', sets: 3, reps: '10-12', muscleGroup: 'Back' },
      { id: 'ex-5-3', name: 'Chest-Supported Dumbbell Row', sets: 3, reps: '10-12', muscleGroup: 'Back' },
      { id: 'ex-5-4', name: 'Rear Delt Fly', sets: 3, reps: '15-20', muscleGroup: 'Rear Delts' },
      { id: 'ex-5-5', name: 'Face Pulls', sets: 3, reps: '15-20', muscleGroup: 'Rear Delts' },
      { id: 'ex-5-6', name: 'Cable Curl', sets: 3, reps: '12-15', muscleGroup: 'Biceps' },
      { id: 'ex-5-7', name: 'Incline Dumbbell Curl', sets: 3, reps: '10-12', muscleGroup: 'Biceps' },
      { id: 'ex-5-8', name: 'Reverse Curls', sets: 3, reps: '10-12', muscleGroup: 'Forearms' },
      { id: 'ex-5-9', name: 'Reverse Wrist Curls', sets: 3, reps: '12-15', muscleGroup: 'Forearms' },
    ],
    core: [],
    coreNote: null,
    stretches: ['Lat stretch', 'Biceps stretch', 'Forearm stretch'],
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
      { id: 'ex-6-1', name: 'Bulgarian Split Squat', sets: 4, reps: '8-10', muscleGroup: 'Quads' },
      { id: 'ex-6-2', name: 'Leg Extension', sets: 4, reps: '12-15', muscleGroup: 'Quads' },
      { id: 'ex-6-3', name: 'Leg Curl', sets: 4, reps: '12-15', muscleGroup: 'Hamstrings' },
      { id: 'ex-6-4', name: 'Hip Thrust', sets: 3, reps: '10-12', muscleGroup: 'Glutes' },
      { id: 'ex-6-5', name: 'Seated Calf Raises', sets: 4, reps: '12-15', muscleGroup: 'Calves' },
      { id: 'ex-6-6', name: 'Donkey Calf Raises', sets: 3, reps: '15-20', muscleGroup: 'Calves' },
    ],
    core: [
      { name: 'Russian Twists', sets: 1, reps: '20' },
      { name: 'Plank Shoulder Taps', sets: 1, reps: '20' },
      { name: 'Ab Rollouts or Stability Ball Rollouts', sets: 1, reps: '10', substitutions: ['Ab Rollouts', 'Stability Ball Rollouts'] },
    ],
    coreNote: 'Core Circuit #2 — Perform 3 rounds',
    stretches: ['Glutes', 'Hamstrings', 'Deep squat hold'],
  },

  // ──────────────────────────────────────────
  // DAY 7 — Active Recovery
  // ──────────────────────────────────────────
  {
    id: 'day-7',
    day: 7,
    name: 'Active Recovery',
    category: 'Recovery',
    focus: 'Recovery',
    color: '#64748b',
    isRecovery: true,
    exercises: [],
    tasks: [
      '20-30 min walking',
      'Full body stretch — 10-15 min',
      'Foam rolling',
    ],
    optional: ['Light core work'],
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
