(() => {
  const ready = (fn) => {
    const tick = () => (window.LOOP_CONFIG && window.supabase && document.querySelector('#timelineList')) ? fn() : setTimeout(tick, 300);
    tick();
  };
  const esc = (v) => String(v || '').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const dobj = (s) => new Date(s + 'T00:00:00');
  const mon = (s) => dobj(s).toLocaleDateString('en-GB', { month: 'short' });
  const day = (s) => dobj(s).toLocaleDateString('en-GB', { day: '2-digit' });
  const monthTitle = (s) => dobj(s).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const maps = (p) => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p || '');
  let cursor = new Date();
  let lastSig = '';
  async function getEvents() {
    const db = window.supabase.createClient(window.LOOP_CONFIG.url, window.LOOP_CONFIG.key);
    const { data, error } = await db.from('loop_events').select('*').order('event_date').order('event_time');
    if (error) return [];
    return (data || []).map(r => ({ id:r.id, name:r.name, category:r.category, date:r.event_date, time:String(r.event_time).slice(0,5), ticket:r.ticket_url || '', price:r.price, postcode:r.postcode }));
  }
  function renderTimeline(events) {
    const box = document.querySelector('#timelineList');
    if (!box) return;
    const list = [...events].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
    const title = document.querySelector('#timelineTitle');
    if (title) title.textContent = list[0] ? monthTitle(list[0].date) : 'Timeline';
    box.innerHTML = list.length ? list.map(e => `<div class="tl-item"><div class="tl-date"><span class="mm">${mon(e.date)}</span><span class="dd">${day(e.date)}</span></div><div class="tl-body"><h3>${esc(e.name)}</h3><div class="row-meta">${esc(e.time)} · ${esc(e.category)} · ${esc(e.postcode)}</div><div class="timeline-actions"><a class="dark" target="_blank" rel="noreferrer" href="${maps(e.postcode)}">Directions</a>${e.ticket ? `<a target="_blank" rel="noreferrer" href="${esc(e.ticket)}">Event page</a>` : ''}</div></div></div>`).join('') : '<div class="empty">Events appear here once added.</div>';
  }
  function renderMonth(events) {
    const box = document.querySelector('#ganttBox');
    if (!box) return;
    const y = cursor.getFullYear(), m = cursor.getMonth();
    const title = document.querySelector('#ganttTitle');
    if (title) title.textContent = monthTitle(`${y}-${String(m+1).padStart(2,'0')}-01`);
    const days = new Date(y, m + 1, 0).getDate();
    const off = (new Date(y, m, 1).getDay() + 6) % 7;
    let html = '<div class="month-controls"><button id="enhPrev">‹ Prev</button><button id="enhNext">Next ›</button></div><div class="month-grid">' + '<div class="month-day"></div>'.repeat(off);
    for (let d = 1; d <= days; d++) {
      const matches = events.filter(e => { const x = dobj(e.date); return x.getFullYear() === y && x.getMonth() === m && x.getDate() === d; });
      html += `<div class="month-day"><div class="month-day-num">${d}</div>${matches.map(e => `<button class="month-card" data-month-card><span>${esc(e.time)}</span>${esc(e.name)}<div class="month-pop"><a target="_blank" rel="noreferrer" href="${maps(e.postcode)}">Directions</a>${e.ticket ? `<a target="_blank" rel="noreferrer" href="${esc(e.ticket)}">Event page</a>` : ''}</div></button>`).join('')}</div>`;
    }
    box.innerHTML = html + '</div>';
    document.querySelector('#enhPrev').onclick = () => { cursor = new Date(y, m - 1, 1); refresh(true); };
    document.querySelector('#enhNext').onclick = () => { cursor = new Date(y, m + 1, 1); refresh(true); };
    document.querySelectorAll('[data-month-card]').forEach(card => card.onclick = () => card.classList.toggle('open'));
  }
  async function refresh(force=false) {
    const events = await getEvents();
    const sig = JSON.stringify(events);
    if (!force && sig === lastSig) return;
    lastSig = sig;
    if (events[0] && !force) cursor = dobj(events[0].date);
    renderTimeline(events);
    renderMonth(events);
  }
  ready(() => { refresh(true); setInterval(refresh, 5000); });
})();