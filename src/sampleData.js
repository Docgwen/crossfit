export const SAMPLE_WODS = [
  { id: '1', date: 'Mer 30 Avr', type: 'FOR TIME', name: 'Fran', result: '3:47', scale: 'Rx', box: 'CrossFit SUD', coach: 'Romain', drop: false, city: 'Montpellier', notes: '', movements: [{ name: 'Thrusters', detail: '21-15-9 × 43 kg' }, { name: 'Pull-ups', detail: '21-15-9 reps' }], garmin: { cal: 380, fcMax: 187, z2: 18, z3: 34, z4: 31, z5: 17 } },
  { id: '2', date: 'Lun 28 Avr', type: 'AMRAP 20', name: 'Cindy', result: '22 rds', scale: 'Rx', box: 'CrossFit BCN', coach: 'Maria', drop: true, city: 'Barcelone', notes: '', movements: [{ name: 'Pull-ups', detail: '5 reps' }, { name: 'Push-ups', detail: '10 reps' }, { name: 'Air Squats', detail: '15 reps' }], garmin: { cal: 520, fcMax: 178, z2: 28, z3: 42, z4: 22, z5: 8 } },
  { id: '3', date: 'Sam 26 Avr', type: 'STRENGTH', name: 'Snatch', result: '80 kg', scale: '1RM', box: 'CrossFit SUD', coach: 'Alex', drop: false, city: 'Montpellier', notes: '', movements: [{ name: 'Snatch', detail: '1RM' }], garmin: { cal: 290, fcMax: 165, z2: 41, z3: 35, z4: 18, z5: 6 } },
  { id: '4', date: 'Mer 23 Avr', type: 'FOR TIME', name: 'Grace', result: '4:12', scale: 'Rx', box: 'CrossFit SUD', coach: 'Romain', drop: false, city: 'Montpellier', notes: '', movements: [{ name: 'Clean & Jerk', detail: '30 reps × 61 kg' }], garmin: { cal: 310, fcMax: 182, z2: 12, z3: 29, z4: 38, z5: 21 } },
  { id: '5', date: 'Lun 21 Avr', type: 'EMOM 12', name: 'Clean', result: '70 kg', scale: 'Rx+', box: 'Box Du Sud', coach: 'Julie', drop: true, city: 'Marseille', notes: '', movements: [{ name: 'Clean', detail: 'EMOM 12 × 70 kg' }], garmin: { cal: 420, fcMax: 174, z2: 35, z3: 38, z4: 20, z5: 7 } },
  { id: '6', date: 'Sam 19 Avr', type: 'CHIPPER', name: 'DT', result: '5:28', scale: 'Rx', box: 'CrossFit SUD', coach: 'Alex', drop: false, city: 'Montpellier', notes: '', movements: [{ name: 'Deadlift', detail: '12 × 70 kg' }, { name: 'Hang Power Clean', detail: '9 × 70 kg' }, { name: 'Push Jerk', detail: '6 × 70 kg' }], garmin: { cal: 460, fcMax: 185, z2: 14, z3: 27, z4: 35, z5: 24 } },
];

export const SAMPLE_PRS = [
  { id: 'pr1', cat: 'halte', name: 'Clean & Jerk', type: '1RM', value: '105', unit: 'kg', date: 'Fév 26', notes: '', history: [90, 95, 95, 100, 100, 105, 105], trend: '+5 kg' },
  { id: 'pr2', cat: 'halte', name: 'Back Squat', type: '1RM', value: '140', unit: 'kg', date: 'Jan 26', notes: '', history: [110, 120, 125, 130, 130, 140, 140], trend: '+10 kg' },
  { id: 'pr3', cat: 'halte', name: 'Snatch', type: '1RM', value: '80', unit: 'kg', date: 'Avr 26', notes: '', history: [65, 70, 72, 75, 77, 77, 80], trend: '+3 kg' },
  { id: 'pr4', cat: 'halte', name: 'Deadlift', type: '1RM', value: '180', unit: 'kg', date: 'Mar 26', notes: '', history: [150, 160, 165, 170, 175, 180, 180], trend: '+5 kg' },
  { id: 'pr5', cat: 'halte', name: 'Front Squat', type: '1RM', value: '115', unit: 'kg', date: 'Fév 26', notes: '', history: [90, 95, 100, 105, 110, 110, 115], trend: '+5 kg' },
  { id: 'pr6', cat: 'gymn', name: 'Pull-ups', type: 'Max reps', value: '32', unit: 'reps', date: 'Mar 26', notes: '', history: [18, 20, 22, 25, 27, 30, 32], trend: '+2' },
  { id: 'pr7', cat: 'gymn', name: 'HSPU', type: 'Max reps', value: '18', unit: 'reps', date: 'Avr 26', notes: '', history: [8, 10, 12, 14, 15, 16, 18], trend: '+2' },
  { id: 'pr8', cat: 'gymn', name: 'Muscle-up', type: 'Max reps', value: '8', unit: 'reps', date: 'Jan 26', notes: '', history: [2, 3, 4, 5, 6, 7, 8], trend: '+1' },
  { id: 'pr9', cat: 'gymn', name: 'T2B', type: 'Max reps', value: '25', unit: 'reps', date: 'Mar 26', notes: '', history: [12, 15, 17, 20, 21, 23, 25], trend: '+2' },
  { id: 'pr10', cat: 'cardio', name: 'Run 5K', type: 'Temps', value: '22:34', unit: 'min:sec', date: 'Fév 26', notes: '', history: [27, 26, 25, 24, 23, 23, 22], trend: '-48s' },
  { id: 'pr11', cat: 'cardio', name: 'Row 500m', type: 'Temps', value: '1:34', unit: 'min:sec', date: 'Jan 26', notes: '', history: [170, 165, 162, 158, 155, 156, 154], trend: '-2s' },
  { id: 'pr12', cat: 'cardio', name: 'Run 1 mile', type: 'Temps', value: '6:48', unit: 'min:sec', date: 'Mar 26', notes: '', history: [480, 470, 460, 450, 445, 440, 408], trend: '-12s' },
  { id: 'pr13', cat: 'bench', name: 'Fran', type: 'Temps', value: '3:47', unit: 'min:sec', date: 'Avr 26', notes: '', history: [360, 320, 290, 270, 260, 240, 227], trend: '-13s' },
  { id: 'pr14', cat: 'bench', name: 'Grace', type: 'Temps', value: '4:12', unit: 'min:sec', date: 'Avr 26', notes: '', history: [500, 450, 400, 360, 320, 290, 252], trend: '-22s' },
  { id: 'pr15', cat: 'bench', name: 'Cindy', type: 'Max reps', value: '25', unit: 'rds', date: 'Jan 26', notes: '', history: [18, 19, 20, 21, 22, 23, 25], trend: '+2 rds' },
  { id: 'pr16', cat: 'bench', name: 'Murph', type: 'Temps', value: '47:22', unit: 'min:sec', date: 'Mar 26', notes: '', history: [65, 63, 61, 58, 55, 52, 50], trend: '-2:30' },
];

export const STATS_MONTHLY = [
  { m: 'Oct', kg: 4200, sessions: 9, prs: 1 },
  { m: 'Nov', kg: 5100, sessions: 11, prs: 2 },
  { m: 'Déc', kg: 4800, sessions: 10, prs: 1 },
  { m: 'Jan', kg: 5600, sessions: 12, prs: 3 },
  { m: 'Fév', kg: 6200, sessions: 13, prs: 4 },
  { m: 'Mar', kg: 5900, sessions: 11, prs: 2 },
  { m: 'Avr', kg: 6800, sessions: 14, prs: 3 },
];

export const GARMIN_MONTHLY = [
  { m: 'Oct', cal: 3800, z2: 31, z3: 28, z4: 24, z5: 10, fcAvg: 154 },
  { m: 'Nov', cal: 4600, z2: 33, z3: 30, z4: 22, z5: 9, fcAvg: 157 },
  { m: 'Déc', cal: 4200, z2: 35, z3: 27, z4: 23, z5: 8, fcAvg: 155 },
  { m: 'Jan', cal: 5100, z2: 30, z3: 32, z4: 25, z5: 11, fcAvg: 160 },
  { m: 'Fév', cal: 5600, z2: 28, z3: 34, z4: 26, z5: 12, fcAvg: 162 },
  { m: 'Mar', cal: 5200, z2: 32, z3: 31, z4: 24, z5: 10, fcAvg: 158 },
  { m: 'Avr', cal: 6100, z2: 29, z3: 33, z4: 27, z5: 13, fcAvg: 163 },
];

export const PR_EXERCISES = {
  halte: ['Clean & Jerk', 'Back Squat', 'Snatch', 'Deadlift', 'Front Squat', 'Overhead Squat', 'Clean', 'Jerk', 'Power Clean', 'Power Snatch'],
  gymn: ['Pull-ups', 'HSPU', 'Muscle-up', 'T2B', 'Ring Dips', 'Pistol', 'L-sit', 'Bar Muscle-up'],
  cardio: ['Run 5K', 'Run 1 mile', 'Row 500m', 'Row 2K', 'Ski 500m', 'Bike 10K', 'Assault Bike'],
  bench: ['Fran', 'Grace', 'Cindy', 'Murph', 'Annie', 'Isabel', 'Helen', 'Diane', 'Karen'],
};

export const PR_UNITS = { halte: 'kg', gymn: 'reps', cardio: 'min:sec', bench: 'min:sec' };
export const RM_OPTIONS = ['1RM', '2RM', '3RM', '5RM', 'Max reps', 'Temps', 'Distance'];

// April 2026 session days
export const APRIL_SESSIONS = { 2: true, 5: true, 7: true, 9: true, 12: true, 14: true, 16: true, 19: true, 21: true, 23: true, 26: true, 28: true, 30: true };
