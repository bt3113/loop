console.log('Loop app booting');
function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.appendChild(s);});}
(async()=>{await loadScript('./config.js?v=20260513b');await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');await loadScript('./loop-main.js?v=20260513b');})();