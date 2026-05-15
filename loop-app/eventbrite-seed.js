(() => {
  const drafts = [
    ['The White Knight ICE','Theatre & Performance','2026-05-19','18:00','https://www.eventbrite.co.uk/e/the-white-knight-ice-tickets-1776784513309'],
    ['Forging Better Futures for You and AI','AI & Technology','2026-05-19','18:30','https://www.eventbrite.co.uk/e/forging-better-futures-for-you-and-ai-tickets-1777029124949'],
    ["Pluto Isn't a Planet",'Astronomy & Space','2026-05-19','19:00','https://www.eventbrite.co.uk/e/pluto-isnt-a-planet-tickets-1777043798839']
  ];

  async function run(){
    if(!window.LOOP_CONFIG || !window.supabase) return setTimeout(run, 500);
    const db = window.supabase.createClient(window.LOOP_CONFIG.url, window.LOOP_CONFIG.key);
    for(const d of drafts){
      const check = await db.from('loop_events').select('id').eq('ticket_url', d[4]).limit(1);
      if(check.error || (check.data && check.data.length)) continue;
      await db.from('loop_events').insert({
        name:d[0],
        category:d[1],
        event_date:d[2],
        event_time:d[3],
        ticket_url:d[4],
        price:"I don't know",
        postcode:'TBC',
        added_by:'BT'
      });
    }
    setTimeout(() => {
      if(typeof window.loadEvents === 'function') window.loadEvents();
    }, 500);
  }

  setTimeout(run, 1000);
})();