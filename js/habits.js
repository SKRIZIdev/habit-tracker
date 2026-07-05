const HKEY = 'habitly.habits';
const loadHabits = () => JSON.parse(localStorage.getItem(HKEY) || '[]');
const saveHabits = h => localStorage.setItem(HKEY, JSON.stringify(h));
const iso = d => d.toISOString().slice(0, 10);

// Monday-based week containing today
function weekDates() {
  const now = new Date();
  const day = (now.getDay() + 6) % 7; // 0 = Mon
  const monday = new Date(now); monday.setDate(now.getDate() - day);
  return [...Array(7)].map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
}
const LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
