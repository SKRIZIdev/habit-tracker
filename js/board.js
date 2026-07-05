// only runs on index.html
const board = document.getElementById('board');
if (board) {
  const week = weekDates();
  const todayIso = iso(new Date());
  document.getElementById('weekLabel').textContent =
    week[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' – ' +
    week[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  function render() {
    const habits = loadHabits();
    if (!habits.length) { board.innerHTML = '<div class="empty">No habits yet. Add your first one above 👆</div>'; return; }
    board.innerHTML = habits.map((h, hi) => `
      <div class="habit">
        <div class="top"><h3>${escapeHtml(h.name)}</h3><button class="rm" data-h="${hi}">remove</button></div>
        <div class="days">${week.map((d, di) => {
          const key = iso(d); const on = (h.done || []).includes(key);
          return `<div class="day"><small>${LABELS[di]}</small>
            <div class="box ${on ? 'on' : ''} ${key === todayIso ? 'today' : ''}" data-h="${hi}" data-d="${key}">✓</div></div>`;
        }).join('')}</div>
      </div>`).join('');
    board.querySelectorAll('.box').forEach(b => b.onclick = () => {
      const habits = loadHabits(); const h = habits[+b.dataset.h];
      h.done = h.done || [];
      const k = b.dataset.d;
      h.done = h.done.includes(k) ? h.done.filter(x => x !== k) : [...h.done, k];
      saveHabits(habits); render();
    });
    board.querySelectorAll('.rm').forEach(b => b.onclick = async () => {
      const habits = loadHabits(); const name = habits[+b.dataset.h].name;
      const ok = await UI.confirm(`Remove “${name}”? Its history will be lost.`, { danger: true, ok: 'Remove' });
      if (!ok) return;
      habits.splice(+b.dataset.h, 1); saveHabits(habits); render();
      UI.toast('Habit removed', 'info');
    });
  }
  function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  document.getElementById('add').onclick = () => {
    const inp = document.getElementById('newHabit'); const name = inp.value.trim();
    if (!name) return;
    const habits = loadHabits(); habits.push({ name, done: [] }); saveHabits(habits); inp.value = ''; render();
    if (window.UI) UI.toast('Habit added 💪', 'success');
  };
  document.getElementById('newHabit').addEventListener('keydown', e => { if (e.key === 'Enter') document.getElementById('add').click(); });
  render();
}
