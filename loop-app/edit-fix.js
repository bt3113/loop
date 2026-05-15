(() => {
  function toast(message) {
    const t = document.querySelector('#toast');
    if (!t) return alert(message);
    t.textContent = message;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2400);
  }

  function client() {
    if (!window.LOOP_CONFIG || !window.supabase) return null;
    return window.supabase.createClient(window.LOOP_CONFIG.url, window.LOOP_CONFIG.key);
  }

  function normaliseTime(value) {
    if (!value) return null;
    return value.length === 5 ? `${value}:00` : value;
  }

  async function refreshAll() {
    if (typeof window.loadEvents === 'function') {
      try { await window.loadEvents(); } catch (_) {}
    }
    window.dispatchEvent(new CustomEvent('loop:events-changed'));
    setTimeout(() => window.dispatchEvent(new CustomEvent('loop:events-changed')), 600);
  }

  async function submitEdit(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const db = client();
    if (!db) return toast('Database not ready. Refresh and try again.');

    const id = document.querySelector('#editId')?.value;
    if (!id) return toast('No event selected for editing.');

    const payload = {
      name: document.querySelector('#editName')?.value.trim(),
      category: document.querySelector('#editCat')?.value,
      event_date: document.querySelector('#editDate')?.value,
      event_time: normaliseTime(document.querySelector('#editTime')?.value),
      ticket_url: document.querySelector('#editTicket')?.value.trim() || null,
      price: document.querySelector('#editPrice')?.value,
      postcode: (document.querySelector('#editPostcode')?.value || '').trim().toUpperCase()
    };

    if (!payload.name || !payload.category || !payload.event_date || !payload.event_time || !payload.postcode) {
      return toast('Complete all required fields before updating.');
    }

    const result = await db
      .from('loop_events')
      .update(payload)
      .eq('id', id)
      .select('id,name,event_date,event_time')
      .maybeSingle();

    if (result.error) return toast(`Update failed: ${result.error.message}`);
    if (!result.data) return toast('Update failed: no matching event was updated.');

    document.querySelector('#editModal')?.classList.remove('open');
    toast('Event updated');
    await refreshAll();
  }

  function bind() {
    const form = document.querySelector('#editForm');
    if (!form || form.dataset.loopEditFixed === '1') return;
    form.dataset.loopEditFixed = '1';
    form.onsubmit = submitEdit;
    form.addEventListener('submit', submitEdit, true);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  setTimeout(bind, 1000);
})();