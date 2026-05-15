(() => {
  const ready = (fn) => {
    const tick = () => (window.LOOP_CONFIG && window.supabase && document.querySelector('#ganttBox')) ? fn() : setTimeout(tick, 250);
    tick();
  };
  const clean = (v) => String(v || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const dObj = (s) => new Date(s + 'T00:00:00');
  const monthName = (s) => dObj(s).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const pretty = (s) => dObj(s).toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short' });
  const mapUrl = (p) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p || '');
  let cursor = new Date();
  let selectedId = null;
  let lastJson = '';

  async function loadRows() {
    const db = window.supabase.createClient(window.LOOP_CONFIG.url, window.LOOP_CONFIG.key);
    const res = await db.from('loop_events').select('*').order('event_date').order('event_time');
    if (res.error) return [];
    return (res.data || []).map(r => ({
      id: r.id,
      name: r.name,
      category: r.category,
      date: r.event_date,
      time: String(r.event_time).slice(0, 5),
      ticket: r.ticket_url || '',
      postcode: r.postcode || ''
    }));
  }

  function detail(event) {
    if (!event) return '<div class="month-detail-panel empty-panel"><p>No events in this month yet.</p></div>';
    const meta = `${pretty(event.date)} · ${event.time} · ${event.category}${event.postcode ? ' · ' + event.postcode : ''}`;
    const second = event.ticket
      ? `<a target="_blank" rel="noreferrer" href="${clean(event.ticket)}">Event details</a>`
      : '<button type="button" disabled>No event link</button>';
    return `<div class="month-detail-panel active"><div class="month-detail-card"><div class="month-detail-icon"></div><div class="month-detail-copy"><p class="month-detail-kicker">Selected event</p><h3>${clean(event.name)}</h3><p>${clean(meta)}</p></div></div><div class="month-detail-actions"><a class="primary" target="_blank" rel="noreferrer" href="${mapUrl(event.postcode)}">Directions</a>${second}</div></div>`;
  }

  function render(events, forceMonth) {
    const box = document.querySelector('#ganttBox');
    if (!box) return;
    if (forceMonth) cursor = forceMonth;
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const key = `${y}-${String(m + 1).padStart(2, '0')}-01`;
    const title = document.querySelector('#ganttTitle');
    if (title) title.textContent = monthName(key);

    const monthEvents = events.filter(e => {
      const x = dObj(e.date);
      return x.getFullYear() === y && x.getMonth() === m;
    });
    if (!selectedId || !monthEvents.some(e => String(e.id) === String(selectedId))) selectedId = monthEvents[0]?.id || null;
    const selected = monthEvents.find(e => String(e.id) === String(selectedId));

    const days = new Date(y, m + 1, 0).getDate();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    let html = '<div class="month-shell"><div class="month-controls"><button id="agendaPrev">‹ Prev</button><button id="agendaNext">Next ›</button></div><div class="month-weekdays"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div><div class="month-grid">';
    html += '<div class="month-day month-pad" aria-hidden="true"></div>'.repeat(offset);

    for (let d = 1; d <= days; d++) {
      const matches = monthEvents.filter(e => dObj(e.date).getDate() === d);
      html += `<div class="month-day ${matches.length ? 'has-events' : ''}"><div class="month-day-num">${d}</div><div class="month-events">`;
      html += matches.slice(0, 2).map(e => `<button class="month-event ${String(e.id) === String(selectedId) ? 'selected' : ''}" data-event-id="${clean(e.id)}"><span class="month-event-time">${clean(e.time)}</span><span class="month-event-title">${clean(e.name)}</span></button>`).join('');
      if (matches.length > 2) html += `<button class="month-more" data-event-id="${clean(matches[0].id)}">+${matches.length - 2}</button>`;
      html += '</div></div>';
    }

    html += `</div>${detail(selected)}</div>`;
    box.innerHTML = html;
    document.querySelector('#agendaPrev').onclick = () => { selectedId = null; cursor = new Date(y, m - 1, 1); draw(true); };
    document.querySelector('#agendaNext').onclick = () => { selectedId = null; cursor = new Date(y, m + 1, 1); draw(true); };
    document.querySelectorAll('[data-event-id]').forEach(btn => {
      btn.onclick = () => {
        selectedId = btn.dataset.eventId;
        render(events);
        document.querySelector('.month-detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
    });
  }

  async function draw(force = false) {
    const events = await loadRows();
    const json = JSON.stringify(events);
    if (!force && json === lastJson) return;
    lastJson = json;
    if (events[0] && !force) cursor = dObj(events[0].date);
    render(events);
  }

  ready(() => {
    draw(true);
    setInterval(draw, 5000);
    document.querySelectorAll('[data-view="gantt"]').forEach(btn => btn.addEventListener('click', () => setTimeout(() => draw(true), 50)));
  });
})();