// 7-Day PPL / UL Strength + Hypertrophy Plan (Optimized)
// Full workout template data for RoBards Training Log

export const PROGRAM_NAME = '7-Day PPL / UL Strength + Hypertrophy Plan (Optimized)'

export const STARTER_WEIGHTS = [
  { exercise: 'Barbell Bench Press', range: '95-125 lb' },
  { exercise: 'Back Squat', range: '95-135 lb' },
  { exercise: 'Incline Dumbbell Press', range: '30-45 lb dumbbells' },
  { exercise: 'Barbell Rows', range: '65-95 lb' },
  { exercise: 'Lat Pulldown', range: '70-120 lb' },
]

export const STARTER_WEIGHTS_NOTE = 'Always leave about 2 reps in reserve. Prioritize form over weight.'

export const workoutTemplates = [
  {
    id: 'day-1',
    day: 1,
    name: 'Push (Strength)',
    category: 'Push',
    focus: 'Strength',
    color: '#ef4444',
    exercises: [
      { id: 'ex-1-1', name: 'Barbell Bench Press', sets: 4, reps: '4-6', muscleGroup: 'Chest' },
      { id: 'ex-1-2', name: 'Overhead Press', sets: 3, reps: '5-6', muscleGroup: 'Shoulders' },
      { id: 'ex-1-3', name: 'Incline Dumbbell Press', sets: '2-3', reps: '8-10', muscleGroup: 'Chest' },
      { id: 'ex-1-4', name: 'Lateral Raises', sets: 4, reps: '12-15', muscleGroup: 'Shoulders' },
      { id: 'ex-1-5', name: 'Triceps Pushdown', sets: 3, reps: '10-12', muscleGroup: 'Triceps' },
      { id: 'ex-1-6', name: 'Overhead Triceps Extension', sets: '2-3', reps: '10-12', muscleGroup: 'Triceps' },
    ],
    core: [
      { name: 'Hanging Knee Raises', sets: 3, reps: '12' },
    ],
    coreNote: null,
    stretches: ['Chest doorway stretch', 'Shoulder band stretch'],
  },
  {
    id: 'day-2',
    day: 2,
    name: 'Pull (Strength + Forearms)',
    category: 'Pull',
    focus: 'Strength',
    color: '#3b82f6',
    exercises: [
      { id: 'ex-2-1', name: 'Pull-Ups or Lat Pulldown', sets: 4, reps: '6-8', muscleGroup: 'Back', substitutions: ['Pull-Ups', 'Lat Pulldown'] },
      { id: 'ex-2-2', name: 'Barbell Rows', sets: 3, reps: '6-10', muscleGroup: 'Back' },
      { id: 'ex-2-3', name: 'Seated Cable Row', sets: 3, reps: '8-12', muscleGroup: 'Back' },
      { id: 'ex-2-4', name: 'Face Pulls', sets: 3, reps: '12-15', muscleGroup: 'Rear Delts' },
      { id: 'ex-2-5', name: 'Barbell Curl', sets: 3, reps: '8-12', muscleGroup: 'Biceps' },
      { id: 'ex-2-6', name: 'Hammer Curl', sets: 3, reps: '10-12', muscleGroup: 'Biceps' },
      { id: 'ex-2-7', name: 'Wrist Curls', sets: 3, reps: '12-15', muscleGroup: 'Forearms' },
      { id: 'ex-2-8', name: 'Reverse Wrist Curls', sets: 3, reps: '12-15', muscleGroup: 'Forearms' },
    ],
    core: [],
    coreNote: null,
    stretches: ['Lat stretch', 'Biceps stretch'],
  },
  {
    id: 'day-3',
    day: 3,
    name: 'Legs (Strength)',
    category: 'Legs',
    focus: 'Strength',
    color: '#22c55e',
    exercises: [
      { id: 'ex-3-1', name: 'Back Squat', sets: 4, reps: '4-6', muscleGroup: 'Quads' },
      { id: 'ex-3-2', name: 'Leg Curl (machine)', sets: 4, reps: '10-12', muscleGroup: 'Hamstrings' },
      { id: 'ex-3-3', name: 'Leg Press', sets: 3, reps: '10', muscleGroup: 'Quads' },
      { id: 'ex-3-4', name: 'Walking Lunges', sets: 3, reps: '10 each leg', muscleGroup: 'Quads' },
      { id: 'ex-3-5', name: 'Standing Calf Raises', sets: 4, reps: '12-15', muscleGroup: 'Calves' },
    ],
    core: [
      { name: 'Plank', sets: 1, reps: '45 sec' },
      { name: 'Bicycle Crunch', sets: 1, reps: '20' },
      { name: 'Leg Raises', sets: 1, reps: '12-15' },
    ],
    coreNote: 'Core Circuit #1 — Perform 3 rounds',
    stretches: ['Hamstrings', 'Quads', 'Hip flexors'],
  },
  {
    id: 'day-4',
    day: 4,
    name: 'Upper (Hypertrophy + Forearms)',
    category: 'Upper',
    focus: 'Hypertrophy',
    color: '#f59e0b',
    exercises: [
      { id: 'ex-4-1', name: 'Incline Dumbbell Press', sets: 4, reps: '8-12', muscleGroup: 'Chest' },
      { id: 'ex-4-2', name: 'Lat Pulldown', sets: 4, reps: '8-12', muscleGroup: 'Back' },
      { id: 'ex-4-3', name: 'Machine Chest Press', sets: 3, reps: '10-12', muscleGroup: 'Chest' },
      { id: 'ex-4-4', name: 'Seated Cable Row', sets: 3, reps: '10-12', muscleGroup: 'Back' },
      { id: 'ex-4-5', name: 'Lateral Raises', sets: 4, reps: '15', muscleGroup: 'Shoulders' },
      { id: 'ex-4-6', name: 'Rear Delt Fly', sets: 3, reps: '15', muscleGroup: 'Rear Delts' },
      { id: 'ex-4-7', name: 'Cable Curl', sets: 3, reps: '12', muscleGroup: 'Biceps' },
      { id: 'ex-4-8', name: 'Skull Crushers', sets: 3, reps: '12', muscleGroup: 'Triceps' },
      { id: 'ex-4-9', name: 'Reverse Curls', sets: 3, reps: '10-12', muscleGroup: 'Forearms' },
    ],
    core: [],
    coreNote: null,
    stretches: ['Full upper body stretch'],
  },
  {
    id: 'day-5',
    day: 5,
    name: 'Lower (Hypertrophy)',
    category: 'Lower',
    focus: 'Hypertrophy',
    color: '#a855f7',
    exercises: [
      { id: 'ex-5-1', name: 'Bulgarian Split Squat', sets: 4, reps: '8-10', muscleGroup: 'Quads' },
      { id: 'ex-5-2', name: 'Leg Extension', sets: 4, reps: '12-15', muscleGroup: 'Quads' },
      { id: 'ex-5-3', name: 'Leg Curl', sets: 5, reps: '12-15', muscleGroup: 'Hamstrings' },
      { id: 'ex-5-4', name: 'Hip Thrust', sets: 3, reps: '10-12', muscleGroup: 'Glutes' },
      { id: 'ex-5-5', name: 'Seated Calf Raises', sets: 5, reps: '12-15', muscleGroup: 'Calves' },
    ],
    core: [
      { name: 'Hanging Knee Raises', sets: 1, reps: '12' },
      { name: 'Russian Twists', sets: 1, reps: '20' },
      { name: 'Plank Shoulder Taps', sets: 1, reps: '20' },
    ],
    coreNote: 'Core Circuit #2 — Perform 3 rounds',
    stretches: ['Glutes', 'Hamstrings', 'Deep squat hold'],
  },
  {
    id: 'day-6',
    day: 6,
    name: 'Pump + Core',
    category: 'Pump',
    focus: 'Pump',
    color: '#ec4899',
    exercises: [
      { id: 'ex-6-1', name: 'Cable Fly', sets: 3, reps: '15-20', muscleGroup: 'Chest' },
      { id: 'ex-6-2', name: 'Lat Pulldown', sets: 3, reps: '12-15', muscleGroup: 'Back' },
      { id: 'ex-6-3', name: 'Rear Delt Fly', sets: 3, reps: '15-20', muscleGroup: 'Rear Delts' },
      { id: 'ex-6-4', name: 'Cable Curl', sets: 3, reps: '15', muscleGroup: 'Biceps' },
      { id: 'ex-6-5', name: 'Triceps Pushdown', sets: 3, reps: '15', muscleGroup: 'Triceps' },
      { id: 'ex-6-6', name: 'Standing Calf Raises', sets: 3, reps: '15-20', muscleGroup: 'Calves' },
      { id: 'ex-6-7', name: "Farmer's Carries", sets: 3, reps: '30-45 sec', muscleGroup: 'Forearms' },
    ],
    core: [
      { name: 'Ab Rollouts or Stability Ball Rollouts', sets: 1, reps: '10', substitutions: ['Ab Rollouts', 'Stability Ball Rollouts'] },
      { name: 'Reverse Crunch', sets: 1, reps: '15' },
      { name: 'Side Plank', sets: 1, reps: '30 sec each side' },
    ],
    coreNote: 'Core Circuit #3 — Perform 3 rounds',
    stretches: ['Full body mobility'],
  },
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
    // Include core exercises
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
