(() => {
  const categories = ['Food','Music','Comedy','Culture','Sport','Nightlife','Market','Science & Ideas','AI & Technology','Astronomy & Space','Talks & Lectures','Theatre & Performance','Film & Screening','Art & Exhibition','Workshop','Networking','Business','Community','Education','Family','Wellness','Outdoors','Travel','Other'];
  function apply(){
    const add = document.querySelector('#cat');
    const edit = document.querySelector('#editCat');
    if(add) add.innerHTML = '<option value="" selected disabled>Select category</option>' + categories.map(c => `<option>${c}</option>`).join('');
    if(edit) edit.innerHTML = categories.map(c => `<option>${c}</option>`).join('');
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', apply); else apply();
})();