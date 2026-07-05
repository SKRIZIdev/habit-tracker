const box = document.getElementById('stats');
const habits = loadHabits();
function currentStreak(done) {
  const set = new Set(done);
  let streak = 0; const d = new Date();
  // if today not done, start from yesterday
  if (!set.has(iso(d))) d.setDate(d.getDate() - 1);
  while (set.has(iso(d))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}
if (!habits.length) box.innerHTML = '<div class="empty">No habits to show yet.</div>';
else box.innerHTML = habits.map(h => {
  const total = (h.done || []).length;
  const streak = currentStreak(h.done || []);
  return `<div class="srow"><h3>${h.name.replace(/[&<>]/g, '')}</h3>
    <div class="nums"><div><b>${streak}</b><small>day streak</small></div>
    <div><b>${total}</b><small>total days</small></div></div></div>`;
}).join('');
