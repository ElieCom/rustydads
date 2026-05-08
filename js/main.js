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

// Wipe schedule calendar
// Returns the Nth occurrence of dayOfWeek (0=Sun..6=Sat) in given year/month
function nthWeekday(year, month, dayOfWeek, n) {
  const firstOfMonth = new Date(year, month, 1);
  const firstDow = firstOfMonth.getDay();
  let offset = (dayOfWeek - firstDow + 7) % 7;
  const day = 1 + offset + (n - 1) * 7;
  return new Date(year, month, day, 15, 0, 0); // 3 PM local
}

function getUpcomingWipes(count) {
  const wipes = [];
  const now = new Date();
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

function renderWipeCalendar() {
  const container = document.getElementById('wipe-calendar');
  if (!container) return;
  const wipes = getUpcomingWipes(6);
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  container.innerHTML = wipes.map(w => {
    const days = daysBetween(now, w.date);
    const typeClass = w.type === 'full' ? 'wipe-full' : 'wipe-map';
    const typeLabel = w.type === 'full' ? 'Full Wipe' : 'Map Wipe';
    const forcedTag = w.forced ? '<span class="wipe-forced-tag">Forced</span>' : '';
    return `
      <div class="wipe-card ${typeClass}">
        <div class="wipe-day">${dayNames[w.date.getDay()]}</div>
        <div class="wipe-date">${monthNames[w.date.getMonth()]} ${w.date.getDate()}</div>
        <div class="wipe-year">${w.date.getFullYear()}</div>
        <div class="wipe-type">${typeLabel} ${forcedTag}</div>
        <div class="wipe-countdown">${days <= 0 ? 'Today' : `in ${days} day${days === 1 ? '' : 's'}`}</div>
      </div>
    `;
  }).join('');
}

document.addEventListener('DOMContentLoaded', renderWipeCalendar);
