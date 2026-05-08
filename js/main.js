// Rusty Dads - copy IP to clipboard
function copyIP() {
  const code = document.getElementById('server-ip');
  const text = 'client.connect 135.148.136.48:60408';
  navigator.clipboard.writeText(text).then(() => {
    const original = code.textContent;
    code.textContent = 'Copied! Paste into F1 console';
    code.style.color = 'var(--good)';
    setTimeout(() => {
      code.textContent = original;
      code.style.color = '';
    }, 2000);
  });
}

// ---------- Wipe schedule ----------
// Returns the Nth occurrence of dayOfWeek (0=Sun..6=Sat) in given year/month
function nthWeekday(year, month, dayOfWeek, n) {
  const firstOfMonth = new Date(year, month, 1);
  const firstDow = firstOfMonth.getDay();
  const offset = (dayOfWeek - firstDow + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, month, day, 15, 0, 0);
}

// Returns wipe info for a given Date, or null if not a wipe day
// Wipe rules:
//   1st Thursday at 3 PM EST = FULL wipe (map + blueprints), Facepunch forced
//   3rd Thursday at 3 PM EST = MAP wipe only (blueprints carry over)
function getWipeForDate(date) {
  if (date.getDay() !== 4) return null;
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstThu = nthWeekday(y, m, 4, 1);
  const thirdThu = nthWeekday(y, m, 4, 3);
  if (date.getDate() === firstThu.getDate()) {
    return { type: 'full', forced: true, label: 'Full wipe (map + blueprints) — Facepunch forced' };
  }
  if (date.getDate() === thirdThu.getDate()) {
    return { type: 'map', forced: false, label: 'Map wipe only — blueprints carry over' };
  }
  return null;
}

// Compute next N wipes from `now`
function getUpcomingWipes(count, now) {
  const wipes = [];
  let year = now.getFullYear();
  let month = now.getMonth();
  let safety = 0;
  while (wipes.length < count && safety < 24) {
    const firstThu = nthWeekday(year, month, 4, 1);
    const thirdThu = nthWeekday(year, month, 4, 3);
    if (firstThu > now) wipes.push({ date: firstThu, type: 'full', forced: true });
    if (thirdThu > now) wipes.push({ date: thirdThu, type: 'map', forced: false });
    month++;
    if (month > 11) { month = 0; year++; }
    safety++;
  }
  return wipes.slice(0, count);
}

function daysBetween(a, b) {
  const ms = b.getTime() - a.getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAY_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

let calYear, calMonth;

function sameDay(a, b) {
  return a.getFullYear() === b.getFullYear()
      && a.getMonth() === b.getMonth()
      && a.getDate() === b.getDate();
}

function renderMonth(year, month) {
  const titleEl = document.getElementById('cal-title');
  const gridEl  = document.getElementById('cal-grid');
  if (!titleEl || !gridEl) return;

  titleEl.textContent = `${MONTH_NAMES[month]} ${year}`;

  const today = new Date();
  const firstOfMonth = new Date(year, month, 1);
  const firstDow = firstOfMonth.getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Build 6 rows x 7 cols = 42 cells
  const cells = [];

  // Leading days from previous month
  for (let i = firstDow - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, outside: true, date: new Date(year, month - 1, daysInPrevMonth - i) });
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, outside: false, date: new Date(year, month, d) });
  }
  // Trailing days from next month
  let trailingDay = 1;
  while (cells.length < 42) {
    cells.push({ day: trailingDay, outside: true, date: new Date(year, month + 1, trailingDay) });
    trailingDay++;
  }

  gridEl.innerHTML = cells.map(cell => {
    const wipe = getWipeForDate(cell.date);
    const classes = ['cal-day'];
    if (cell.outside) classes.push('outside');
    if (sameDay(cell.date, today)) classes.push('today');
    if (cell.date < today && !sameDay(cell.date, today)) classes.push('past');

    let tags = '';
    let tooltip = '';
    if (wipe) {
      if (wipe.type === 'full') {
        classes.push('wipe-full');
        tags = '<div class="cal-tags"><span class="cal-tag cal-tag-bp">BP+Map</span><span class="cal-tag cal-tag-forced">Forced</span></div>';
        tooltip = `Full wipe — 3 PM EST · Map + blueprints · Facepunch monthly forced wipe`;
      } else if (wipe.type === 'map') {
        classes.push('wipe-map');
        tags = '<div class="cal-tags"><span class="cal-tag cal-tag-map">Map</span></div>';
        tooltip = `Map wipe — 3 PM EST · Blueprints carry over`;
      }
    }

    const tooltipAttr = tooltip ? ` data-tooltip="${tooltip.replace(/"/g, '&quot;')}"` : '';
    return `<div class="${classes.join(' ')}"${tooltipAttr}>
      <div class="cal-day-num">${cell.day}</div>
      ${tags}
    </div>`;
  }).join('');
}

function renderUpcomingWipes() {
  const container = document.getElementById('upcoming-wipes');
  if (!container) return;
  const now = new Date();
  const wipes = getUpcomingWipes(4, now);
  container.innerHTML = wipes.map(w => {
    const days = daysBetween(now, w.date);
    const cls = w.type === 'full' ? 'upcoming-wipe full' : 'upcoming-wipe';
    const label = w.type === 'full' ? 'Full wipe (BP + Map)' : 'Map wipe only';
    const forced = w.forced ? ' · Forced' : '';
    const dateStr = `${DAY_NAMES[w.date.getDay()]} ${MONTH_SHORT[w.date.getMonth()]} ${w.date.getDate()}`;
    const countdown = days <= 0 ? 'Today' : `in ${days} day${days === 1 ? '' : 's'}`;
    return `<div class="${cls}">
      <div class="upcoming-wipe-date">${dateStr}</div>
      <div class="upcoming-wipe-meta">${label}${forced}</div>
      <div class="upcoming-wipe-countdown">${countdown} · 3 PM EST</div>
    </div>`;
  }).join('');
}

function initCalendar() {
  const now = new Date();
  calYear = now.getFullYear();
  calMonth = now.getMonth();
  renderMonth(calYear, calMonth);
  renderUpcomingWipes();

  const prev = document.getElementById('cal-prev');
  const next = document.getElementById('cal-next');
  if (prev) prev.addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    renderMonth(calYear, calMonth);
  });
  if (next) next.addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    renderMonth(calYear, calMonth);
  });
}

document.addEventListener('DOMContentLoaded', initCalendar);
