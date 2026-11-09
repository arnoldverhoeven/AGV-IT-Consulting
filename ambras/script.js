/* ---------- menu data ---------- */
const S='<span class="star" title="Onze favoriet">★</span>', V='<span class="vg" title="Vegetarisch">V</span>';
const MENU=[
 {id:'lunch',label:'Lunch',small:'11 – 15u',notes:['Di – za van 11u tot 15u','Keuken open tot 14u','Buns & toast ook als lunch om te delen'],cats:[
  {t:'Pancakes',items:[{n:'Pancakes',p:'16',d:'Fluffy American pancakes · maple syrup · opgeklopte mascarpone · blauwe bessen · banaan · pecannoten',ex:[['+ bacon','4,5']]}]},
  {t:'Buns',items:[{n:'Crispy Chicken',p:'19',d:'Kippenburger · Ambrassaus · ijsbergsla · ui · tomaat'},{n:'Hot Honey Berloumi',p:'19',v:1,d:'Berloumi · pittige honingmarinade · truffelmayonaise · gekarameliseerde ui · ijsbergsla · tomaat'},{n:'Traag gegaard buikspek',p:'19',d:'Koreaans buikspek · kimchi · sriracha mayo · koriander',ex:[['+ spiegeleitje','2']]}]},
  {t:'Toast avocado',cls:'green',items:[{n:'Basic',p:'14',v:1,d:'Avocado · pico de gallo',ex:[['+ spiegeleitje','2'],['+ feta','3']]},{n:'Gerookte zalm',p:'22',d:'Avocado · zalm · roomkaas · spiegeleitje · microgreens'},{n:'Countryside',p:'18',d:'Avocado · bacon · spiegeleitje · microgreens · chiliflakes'},{n:'Pulled Chicken',p:'22',d:'Avocado · pulled chicken · pico de gallo · 1000 island dressing'}]},
  {t:'Croques',sub:'Geserveerd met slaatje',items:[{n:'Monsieur',p:'16',d:'Zuurdesemtoast · Flandrien kaas · gegrilde beenham · ketchup en/of mayonaise'},{n:'Madame',p:'18',d:'Zuurdesemtoast · Flandrien kaas · gegrilde beenham · 2 spiegeleitjes · ketchup en/of mayonaise'}]},
  {t:'Bowls',items:'BOWLS'},
  {t:'Tacos',sub:'Geserveerd met slaatje · limoen · zure room · salsa verde',items:'TACOS'},
  {t:'Kleine deugenieten',sub:'Voor de kids',items:[{n:'Krokske',p:'7',d:'Met ketchup of mayonaise',ex:[['+ spiegeleitje','2'],['+ slaatje','3,5']]},{n:'Boke choco',p:'3,5'},{n:'Boke kaas',p:'4,5'},{n:'Pancakes met suiker',p:'7',ex:[['+ banaan','1']]},{n:'Burger met frietjes',p:'12',d:'Crispy kip · broodje · frietjes · mayo of ketchup'},{n:'Kipnuggets met frietjes',p:'11',d:'Nuggets · frietjes · appelmoes · mayo of ketchup'}]},
  {t:'Zoete kaart',cls:'black',items:'ZOET'}
 ]},
 {id:'avond',label:'Avond',small:'17.30 – 22u',notes:['Di – za van 17.30u tot 22u','Alle beefburgers zijn ook veggie verkrijgbaar','★ = onze favorieten'],cats:[
  {t:'Sticky fingers',sub:'Geserveerd met ranch dressing',cls:'green',items:[{n:'Buffalo Hot Wings',p:'11',d:'Spicy · tangy · juicy'},{n:'Cauliflower Hot Wings',p:'11',v:1,d:'Veggie versie van de hot wings'},{n:'Onion Rings',p:'9',v:1},{n:'Jalapeño Cheese Bombs',p:'11',v:1,d:'Jalapeño gevuld met roomkaas in een krokant jasje'},{n:'Louisiana Shrimp Poppers',p:'12',d:'Crispy scampibites'}]},
  {t:'Nachos',items:[{n:'Pork Carnitas',p:'15',d:'Kaassaus · carnitas · pico de gallo · jalapeño · zure room'},{n:'Veggie',p:'14',v:1,d:'Kaassaus · avocado · pico de gallo · zure room · jalapeño'},{n:'Pulled Chicken',p:'16',d:'Guacamole · pico de gallo · zure room · jalapeño'}]},
  {t:'Empenadas',items:[{n:'Mini empenadas · 6 stuks',p:'14,5',d:'Mix rund · kip · veggie'}]},
  {t:'Burgers',sub:'Geserveerd met frietjes en koolsla · alle beefburgers ook veggie verkrijgbaar',items:[
   {n:'Crispy Chick',p:'23',d:'Kippenburger · Ambrassaus · ijsbergsla · ui · tomaat'},
   {n:'Hot Honey Chick',p:'23',d:'Kippenburger · pittige honingmarinade · mosterdmayo · koolsla · augurk'},
   {n:'Ambras',p:'19',d:'Beefburger · Ambrassaus · cheddar · ijsbergsla · ui · augurk'},
   {n:'Bacon Cheese',p:'23',d:'Beefburger · spicy burgersaus · cheddar · bacon · ijsbergsla · tomaat · gekarameliseerde ui'},
   {n:'Cali Smash',p:'23',d:'Beefburger · smokey cocktailsaus · avocado · pico de gallo'},
   {n:'Fancy Pants',p:'24',s:1,d:'Beefburger · truffelmayonaise · ijsbergsla · tomaat · gekarameliseerde ui · baconjam · provolone'},
   {n:'Vijfenveertig',p:'22',s:1,d:'Beefburger · chipotle BBQ saus · mayonaise · onion rings · cheddar · ijsbergsla · tomaat'},
   {n:'Classic Cheese',p:'18',d:'Beefburger · cheddar · ketchup · mosterd · ui · augurk'},
   {n:'Hot Honey Berloumi',p:'23',v:1,d:'Berloumi · pittige honingmarinade · truffelmayonaise · gekarameliseerde ui · ijsbergsla · tomaat'}]},
  {t:'Kids',cls:'green',items:[{n:'Burger met frietjes',p:'12',d:'Vleesje (crispy kip of beef) · broodje · frietjes · mayo of ketchup'},{n:'Kipnuggets met frietjes',p:'11',d:'Nuggets · frietjes · appelmoes · mayo of ketchup'}]},
  {t:'Bowls',items:'BOWLS'},
  {t:'Tacos',sub:'Geserveerd met slaatje · limoen · zure room · salsa verde',items:'TACOS'},
  {t:'Zoete kaart',cls:'black',items:'ZOET'}
 ]},
 {id:'drinks',label:'Drinks',small:'cocktails & meer',notes:['Vraag je drankje gerust deca, met haver- of erwtenmelk','★ = onze favorieten'],cats:[
  {t:'Cocktails',items:[{n:'Ambras',p:'13',s:1,d:'Gin · bloedappelsien · rozemarijn'},{n:'Negroni',p:'13',d:'Rode vermout · Campari · gin'},{n:'Moscow Mule',p:'12',d:'Vodka · gingerbeer · limoensap'},{n:'Gin Tonic',p:'12',d:'Bombay gin · Goldberg tonic'},{n:"Dark 'n Stormy",p:'12',d:'Bruine rum · gingerbeer · limoensap'},{n:'Paloma',p:'12',d:'Tequila · Goldberg pink grapefruit · limoensap'},{n:'Espresso Martini',p:'11',d:'Vodka · cold brew koffie · vanille'},{n:'Lazy Red Cheeks',p:'12',d:'Vodka · frambozencoulis · violetsiroop · limoensap'},{n:'Aperol Spritz',p:'11',d:'Aperol · cava · bruiswater'}]},
  {t:'Mocktails',cls:'green',items:[{n:'Ambras',p:'9',s:1,d:'Bloedappelsien · rozemarijn · tonic'},{n:'Mock Mule',p:'7',d:'Gingerbeer · bruiswater · limoensap'},{n:'Virgin Lazy Red Cheeks',p:'11',d:'Frambozencoulis · violetsiroop · limoensap'},{n:'Nada Paloma',p:'11',d:'Pompelmoes · limoen'},{n:'Safe S*x on the Beach',p:'11',d:'Perzik · veenbessen'}]},
  {t:'Fris & homemade',items:[{n:'Homemade lemonade',p:'5',d:'Bruis of plat · vlierbloesem & citroen · gember & passievrucht · granaatappel & munt'},{n:'Homemade ice tea',p:'5',d:'Butterfly (groene thee, appel, perzik) · Ma Chérie (appel, hibiscus, kers)'},{n:'Kombucha ginger lemon',p:'6'},{n:'Goldberg gingerbeer · tonic · pink grapefruit',p:'4,5'},{n:'Fritz cola · cola zero · orange · lemon · appel-kers',p:'3,5'},{n:'Appelsap · chocomelk',p:'3,2'},{n:'Fles water bruis / plat',p:'4 / 7',d:'Klein / groot'}]},
  {t:'Wijn & bubbels',items:[{n:'Wijn · wit, rosé of rood',p:'6 / 27',d:'Glas / fles'},{n:'Bubbels · cava of cava 0%',p:'7,5 / 35',d:'Glas / fles'}]},
  {t:'Bier',items:[{n:'Vedett (33cl)',p:'3,8'},{n:'Tank 7',p:'5,5'},{n:'Duvel',p:'5'},{n:'Liefmans',p:'4'},{n:"Triple d'Anvers",p:'5'},{n:'Jour de Fête',p:'6'},{n:'Vedett 0,0%',p:'3,8'},{n:'Liefmans 0,0%',p:'4'},{n:'Niveau Nihil 0,5%',p:'6'}]},
  {t:'Koffie & thee',cls:'black',items:[{n:'Espresso',p:'3'},{n:'Koffie (lungo) · americano',p:'3,5'},{n:'Doppio',p:'4'},{n:'Cappuccino',p:'4,2'},{n:'Flat white · latte',p:'4,5'},{n:'Chai latte',p:'5',d:'Spiced · golden · vanille · pink · pumpkin spice · matcha · hot chocolat'},{n:'Verse thee',p:'5',d:'Munt · gember · munt-gember'},{n:"Pip's thee",p:'3,2',d:'Green tea · rosehip hibiscus · earl grey · chamomille · apple berry · french lemon · cotton candy'},{n:"Extra's",p:'0,7',d:'Vanille · karamel · hazelnoot · make it iced · make it dirty'}]}
 ]}
];
const SHARED={
 BOWLS:[{n:'Salade Geitenkaas',p:'23',v:1,d:'Sla · kool · komkommer · kerstomaat · appel · wortel · honingmosterddressing · crumble tijm en honing · zuurdesemtoast'},{n:'Falafel',p:'24',v:1,d:'Zoete aardappel · feta · komkommer · kerstomaat · wortel · avocado · sla · dillesaus · crumble groene kruiden'},{n:'Caesar Salade',p:'22',d:'Pulled chicken · parmezaan · hardgekookt ei · kerstomaat · ijsbergsla · croutons · caesardressing'}],
 TACOS:[{n:'Dirty Chorizo',p:'22',d:'Chorizogehakt · ui · paprika · kaassaus · pico de gallo'},{n:'Pulled Chicken',p:'21',d:'Mozzarella · avocado · pico de gallo'},{n:'Pork Carnitas',p:'22',d:'Feta · gesnipperde ui · koriander'}],
 ZOET:[{n:'Strawberry cheesecake',p:'8',d:'Met aardbeiencoulis'},{n:'Coupe Ambras',p:'12',d:'Churros · vanille-ijs · chocoladesaus · slagroom'},{n:'Brownie met ijs',p:'12',d:'Brownie · vanille-ijs · salted caramel · bresiliennenootjes'}]
};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
function item(i){return `<div class="it"><div class="row"><span class="nm">${esc(i.n)}${i.s?S:''}${i.v?V:''}</span><span class="dots"></span><span class="pr">${esc(i.p)}</span></div>${i.d?`<div class="ds">${esc(i.d)}</div>`:''}${(i.ex||[]).map(e=>`<div class="ex"><span>${esc(e[0])}</span><span>${esc(e[1])}</span></div>`).join('')}</div>`}
function cat(c){const items=typeof c.items==='string'?SHARED[c.items]:c.items;return `<div class="cat ${c.cls||''}"><h3>${esc(c.t)}</h3>${c.sub?`<div class="sub">${esc(c.sub)}</div>`:''}${items.map(item).join('')}</div>`}
const tabs=document.getElementById('tabs'),panels=document.getElementById('panels');
MENU.forEach((m,k)=>{
  tabs.insertAdjacentHTML('beforeend',`<button class="tab" role="tab" id="tab-${m.id}" aria-selected="${k===0}" aria-controls="panel-${m.id}" data-t="${m.id}">${m.label}<small>${m.small}</small></button>`);
  panels.insertAdjacentHTML('beforeend',`<div class="panel ${k===0?'on':''}" role="tabpanel" id="panel-${m.id}" aria-labelledby="tab-${m.id}"><div class="pnote">${m.notes.map(n=>`<span>${esc(n)}</span>`).join('')}</div><div class="cols">${m.cats.map(cat).join('')}</div></div>`);
});
tabs.addEventListener('click',e=>{const t=e.target.closest('.tab');if(!t)return;tabs.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected',x===t));panels.querySelectorAll('.panel').forEach(p=>{p.classList.remove('on');if(p.id==='panel-'+t.dataset.t){p.classList.add('on');}});
  const top=document.getElementById('kaart').getBoundingClientRect().top+scrollY;if(scrollY>top+40)scrollTo({top:top,behavior:'smooth'});});
// open the right tab by time of day
(function(){const h=new Date().getHours()+new Date().getMinutes()/60;if(h>=15.5){document.getElementById('tab-avond').click();}})();

/* ---------- open / closed ---------- */
(function(){
  const d=new Date(),day=d.getDay(),t=d.getHours()+d.getMinutes()/60,open=day>=2&&day<=6;
  const dn=['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
  let msg,on=false;
  if(open&&t>=11&&t<15){on=true;msg='Nu open · lunch tot 15u'}
  else if(open&&t>=17.5&&t<22){on=true;msg='Nu open · avondkaart tot 22u'}
  else if(open&&t>=15&&t<17.5)msg='Even gesloten · vanavond weer open om 17.30u';
  else if(open&&t<11)msg='Vandaag open vanaf 11u';
  else{let n=(day+1)%7;while(n<2||n>6)n=(n+1)%7;msg=(day===6||(open&&t>=22)?'Vandaag gesloten · ':'Gesloten · ')+(n===2&&(day===0||day===1||day===6)?'dinsdag':dn[n])+' weer open om 11u';}
  const chip=document.getElementById('chipTop');chip.querySelector('span').textContent=msg;chip.classList.toggle('closed',!on);
  const tl=document.getElementById('todayLine');tl.querySelector('span').textContent=msg;tl.classList.toggle('closed',!on);
})();

/* ---------- header / drawer / sticky ---------- */
const hdr=document.getElementById('hdr'),btn=document.getElementById('menuBtn'),dr=document.getElementById('drawer');
function closeDrawer(){dr.classList.remove('open');btn.setAttribute('aria-expanded','false');document.body.style.overflow=''}
btn.addEventListener('click',()=>{const o=!dr.classList.contains('open');dr.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
dr.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeDrawer));
addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
addEventListener('scroll',()=>{hdr.classList.toggle('sc',scrollY>8)},{passive:true});

/* ---------- reveal ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px',threshold:.08});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ---------- count-up ---------- */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target,end=parseFloat(el.dataset.count),dec=+(el.dataset.dec||0),suf=el.querySelector('small'),t0=performance.now(),dur=1400;
  (function step(now){const p=Math.min(1,(now-t0)/dur),v=end*(1-Math.pow(1-p,3));el.firstChild.textContent=v.toFixed(dec).replace('.',',');if(p<1)requestAnimationFrame(step)})(t0);co.unobserve(el)}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>co.observe(el));

/* ---------- subtle parallax on hero collage (desktop only) ---------- */
if(matchMedia('(min-width:960px) and (prefers-reduced-motion:no-preference)').matches){
  const ps=[...document.querySelectorAll('[data-par]')];
  addEventListener('scroll',()=>{const y=scrollY;if(y>900)return;ps.forEach(p=>p.style.transform=`translateY(${(y*parseFloat(p.dataset.par)).toFixed(1)}px)`)},{passive:true});
}


/* =====================================================================
   Reservaties — Supabase (project General, prefix ambras_)
   ===================================================================== */
const CMS={url:'https://mlfqwuzdqpfbykkjoequ.supabase.co',key:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZnF3dXpkcXBmYnlra2pvZXF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk2NDgyODMsImV4cCI6MjEwNTIyNDI4M30.yN1LpuyxhBysUyPSg9VaUE4javJ6ueBPFM1j4fD15W8',site:'ambras'};
const DEFAULTS={step:15,openDays:[2,3,4,5,6],services:{lunch:{label:'Lunch',from:'11:00',to:'13:45'},dinner:{label:'Diner',from:'17:30',to:'20:45'}},maxGuests:6,capacity:12,minLeadMinutes:60,maxDaysAhead:90,closed:[]};
let SET=structuredClone(DEFAULTS), DEMO=false, TOKEN=sessionStorage.getItem('ambras-admin-token')||'';
const DAYS=['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],DAYS_S=['zo','ma','di','wo','do','vr','za'];
const MONTHS=['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];
const iso=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const parseISO=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fmtDate=s=>{const d=parseISO(s);return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`};
const hm=t=>t.slice(0,5);
async function sb(path,opt={},auth){
  const h={'apikey':CMS.key,'Content-Type':'application/json','Authorization':'Bearer '+(auth||CMS.key),...(opt.headers||{})};
  const r=await fetch(CMS.url+path,{...opt,headers:h});
  if(!r.ok){let m='';try{m=(await r.json()).message||''}catch(e){} const e=new Error(m||('HTTP '+r.status));e.status=r.status;throw e}
  const txt=await r.text();return txt?JSON.parse(txt):null;
}
// instellingen laden (valt terug op demo-modus als de tabellen er nog niet staan)
const settingsReady=(async()=>{try{const rows=await sb(`/rest/v1/ambras_settings?site=eq.${CMS.site}&select=data`);if(rows&&rows[0])SET={...DEFAULTS,...rows[0].data};}catch(e){DEMO=true}})();
function localSlots(date,service,guests){ // demo: zelfde regels als de databasefunctie, zonder bezetting
  const svc=SET.services[service];if(!svc)return[];const d=parseISO(date);if(!SET.openDays.includes(d.getDay()))return[];
  const out=[];const [fh,fm]=svc.from.split(':').map(Number),[th,tm]=svc.to.split(':').map(Number);const now=Date.now()+SET.minLeadMinutes*60000;
  for(let m=fh*60+fm;m<=th*60+tm;m+=SET.step){const dt=new Date(d);dt.setHours(Math.floor(m/60),m%60,0,0);if(dt.getTime()>now)out.push({slot:`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}:00`,free:SET.capacity})}
  return out;
}
async function getSlots(date,service,guests){await settingsReady;if(DEMO)return localSlots(date,service,guests);
  try{return await sb('/rest/v1/rpc/ambras_slots',{method:'POST',body:JSON.stringify({p_date:date,p_service:service,p_guests:guests})})}catch(e){if(e.status===404){DEMO=true;return localSlots(date,service,guests)}throw e}}

/* ---------- boekingswidget ---------- */
(function(){
  const $=id=>document.getElementById(id);
  const svcEl=$('bkService'),dateEl=$('bkDate'),guestsEl=$('bkGuests'),slotsEl=$('bkSlots'),form=$('bkForm'),done=$('bkDone');
  if(!svcEl)return;
  const st={service:'lunch',date:'',guests:2,time:''};
  const today=new Date();dateEl.min=iso(today);const mx=new Date();mx.setDate(mx.getDate()+DEFAULTS.maxDaysAhead);dateEl.max=iso(mx);
  // standaard: eerstvolgende open dag; 's avonds standaard diner
  (function(){const d=new Date();if(d.getHours()>=15.5)st.service='dinner';while(!DEFAULTS.openDays.includes(d.getDay()))d.setDate(d.getDate()+1);st.date=iso(d);dateEl.value=st.date;
    svcEl.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.v===st.service));})();
  svcEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st.service=b.dataset.v;svcEl.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));st.time='';loadSlots()});
  guestsEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st.guests=+b.dataset.v;guestsEl.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    const big=st.guests>DEFAULTS.maxGuests;$('bkGroup').hidden=!big;$('bkStep3').hidden=big;form.hidden=true;st.time='';if(!big)loadSlots()});
  dateEl.addEventListener('change',()=>{st.date=dateEl.value;st.time='';form.hidden=true;loadSlots()});
  async function loadSlots(){
    const msg=$('bkDateMsg');msg.hidden=true;
    if(!st.date){slotsEl.innerHTML='<p class="bk-hint">Kies eerst een datum.</p>';return}
    const d=parseISO(st.date);
    if(!DEFAULTS.openDays.includes(d.getDay())){slotsEl.innerHTML='';msg.textContent=`Op ${DAYS[d.getDay()]} zijn we gesloten. Kies een dag van dinsdag tot zaterdag.`;msg.hidden=false;return}
    slotsEl.innerHTML=Array.from({length:8},()=>'<div class="skel"></div>').join('');
    let slots=[];try{slots=await getSlots(st.date,st.service,st.guests)}catch(e){slotsEl.innerHTML='<p class="bk-msg">De beschikbaarheid kon niet geladen worden. Probeer het zo opnieuw.</p>';return}
    if(!slots.length){slotsEl.innerHTML=`<p class="bk-hint">Geen vrije tafel meer voor ${st.guests} ${st.guests===1?'persoon':'personen'} bij de ${SET.services[st.service].label.toLowerCase()} op ${fmtDate(st.date)}. Probeer een ander moment of <a href="https://www.instagram.com/ambras.kontich/" target="_blank" rel="noopener" style="color:var(--green);font-weight:700;text-decoration:underline">stuur ons een DM</a>.</p>`;return}
    slotsEl.innerHTML=slots.map(s=>`<button type="button" data-t="${s.slot}" class="${s.free<=st.guests+2?'low':''}" aria-pressed="false">${hm(s.slot)}</button>`).join('');
  }
  slotsEl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;st.time=b.dataset.t;slotsEl.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    $('bkSum').innerHTML=`<span>${SET.services[st.service].label}</span><span>${fmtDate(st.date)}</span><span>${hm(st.time)}</span><span>${st.guests} ${st.guests===1?'persoon':'personen'}</span>`;
    form.hidden=false;form.querySelector('input[name=name]').focus({preventScroll:true});form.scrollIntoView({behavior:'smooth',block:'nearest'})});
  form.addEventListener('submit',async e=>{
    e.preventDefault();const err=$('bkErr');err.hidden=true;
    if(!form.reportValidity())return;
    const f=new FormData(form),btn=$('bkSubmit');btn.disabled=true;btn.textContent='Even geduld…';
    const data={p_date:st.date,p_service:st.service,p_time:st.time,p_guests:st.guests,p_name:f.get('name'),p_email:f.get('email'),p_phone:f.get('phone'),p_note:f.get('note')||''};
    try{
      if(!DEMO){await sb('/rest/v1/rpc/ambras_book',{method:'POST',body:JSON.stringify(data)})}
      // melding naar het restaurant (Netlify Forms)
      try{const nf=new URLSearchParams({'form-name':'ambras-reservatie',dienst:SET.services[st.service].label,datum:fmtDate(st.date),uur:hm(st.time),gasten:st.guests,naam:data.p_name,email:data.p_email,telefoon:data.p_phone,opmerking:data.p_note});
        if(location.protocol.startsWith('http'))await fetch(location.pathname,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:nf.toString()});}catch(_){}
      $('bkDoneTxt').textContent=`${SET.services[st.service].label} op ${fmtDate(st.date)} om ${hm(st.time)}, voor ${st.guests} ${st.guests===1?'persoon':'personen'}, op naam van ${data.p_name}.`+(DEMO?' (demo — nog niet gekoppeld aan de database)':'');
      document.querySelectorAll('#book .bk-step').forEach(x=>x.hidden=true);done.hidden=false;done.scrollIntoView({behavior:'smooth',block:'center'});
    }catch(ex){
      err.textContent=ex.message==='slot_unavailable'?'Oei, dit uur is net volgeboekt. Kies een ander uur.':ex.message==='invalid_contact'?'Controleer je naam en e-mailadres.':'Er liep iets mis. Probeer opnieuw of stuur ons een DM.';err.hidden=false;
      if(ex.message==='slot_unavailable'){st.time='';form.hidden=true;loadSlots()}
    }finally{btn.disabled=false;btn.textContent='Bevestig reservatie'}
  });
  $('bkAgain').addEventListener('click',()=>{done.hidden=true;document.querySelectorAll('#book .bk-step').forEach(x=>x.hidden=false);form.hidden=true;form.reset();st.time='';loadSlots()});
  settingsReady.then(loadSlots);
})();

/* ---------- admin (#admin) ---------- */
(function(){
  const root=document.getElementById('adm');if(!root)return;
  let day=iso(new Date()),view='dag',rows=[];
  const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  function open(){root.hidden=false;document.body.style.overflow='hidden';render()}
  function close(){root.hidden=true;document.body.style.overflow='';if(location.hash==='#admin')history.replaceState(null,'',location.pathname)}
  const check=()=>{if(location.hash==='#admin')open()};addEventListener('hashchange',check);check();
  async function login(email,pw){const r=await fetch(CMS.url+'/auth/v1/token?grant_type=password',{method:'POST',headers:{'apikey':CMS.key,'Content-Type':'application/json'},body:JSON.stringify({email,password:pw})});const j=await r.json();if(!r.ok)throw new Error(j.error_description||j.msg||'Inloggen mislukt');
    const apps=j.user?.app_metadata?.apps||[];if(!apps.includes(CMS.site))throw new Error('Dit account heeft geen toegang tot Ambras.');TOKEN=j.access_token;sessionStorage.setItem('ambras-admin-token',TOKEN)}
  async function load(){rows=await sb(`/rest/v1/ambras_bookings?site=eq.${CMS.site}&date=eq.${day}&order=time.asc,created_at.asc`,{},TOKEN);}
  async function loadWeek(){const d=parseISO(day);const mon=new Date(d);mon.setDate(d.getDate()-((d.getDay()+6)%7));const sun=new Date(mon);sun.setDate(mon.getDate()+6);
    const r=await sb(`/rest/v1/ambras_bookings?site=eq.${CMS.site}&status=eq.confirmed&date=gte.${iso(mon)}&date=lte.${iso(sun)}&select=date,guests`,{},TOKEN);const m={};r.forEach(x=>m[x.date]=(m[x.date]||0)+x.guests);return {mon,m}}
  async function render(){
    if(!TOKEN){root.innerHTML=`<div class="bar"><b>Ambras · admin</b><button class="btn btn-white" id="admClose">Sluiten</button></div><form class="login card" id="admLogin"><h2>Inloggen</h2><label class="fld"><span>E-mail</span><input type="email" name="email" required autocomplete="username"></label><label class="fld"><span>Wachtwoord</span><input type="password" name="pw" required autocomplete="current-password"></label><button class="btn btn-green" type="submit">Inloggen</button><p class="bk-msg" id="admErr" hidden></p></form>`;
      root.querySelector('#admClose').onclick=close;root.querySelector('#admLogin').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);try{await login(f.get('email'),f.get('pw'));render()}catch(ex){const el=root.querySelector('#admErr');el.textContent=ex.message;el.hidden=false}};return}
    root.innerHTML=`<div class="bar"><b>Ambras · admin</b><div style="display:flex;gap:8px"><button class="btn btn-o" id="admOut" style="color:#fff">Uitloggen</button><button class="btn btn-white" id="admClose">Naar de site</button></div></div>
      <div class="in"><div class="tabs2"><button aria-pressed="${view==='dag'}" data-v="dag">Reservaties</button><button aria-pressed="${view==='inst'}" data-v="inst">Instellingen</button></div><div id="admBody"><p class="bk-hint">Laden…</p></div></div>`;
    root.querySelector('#admClose').onclick=close;root.querySelector('#admOut').onclick=()=>{TOKEN='';sessionStorage.removeItem('ambras-admin-token');render()};
    root.querySelector('.tabs2').onclick=e=>{const b=e.target.closest('button');if(!b)return;view=b.dataset.v;render()};
    try{view==='dag'?await renderDay():await renderSettings()}catch(ex){if(ex.status===401){TOKEN='';sessionStorage.removeItem('ambras-admin-token');return render()}root.querySelector('#admBody').innerHTML=`<p class="bk-msg">${esc(ex.message)}</p><p class="bk-hint">Staan de tabellen al in Supabase? Voer <code>ambras_supabase.sql</code> uit.</p>`}
  }
  async function renderDay(){
    await settingsReady;await load();const {mon,m}=await loadWeek();const body=root.querySelector('#admBody');
    const week=Array.from({length:7},(_,i)=>{const d=new Date(mon);d.setDate(mon.getDate()+i);const k=iso(d);return `<button data-d="${k}" aria-pressed="${k===day}" class="${SET.openDays.includes(d.getDay())?'':'off'}"><span>${DAYS_S[d.getDay()]}</span><b>${d.getDate()}</b><span>${m[k]?m[k]+' p.':'–'}</span></button>`}).join('');
    const svcBlock=svc=>{const list=rows.filter(r=>r.service===svc);const tot=list.filter(r=>r.status==='confirmed').reduce((a,r)=>a+r.guests,0);
      return `<div class="svc-h"><span>${SET.services[svc].label}</span><small>${tot} personen · ${list.filter(r=>r.status==='confirmed').length} tafels</small></div>`+(list.length?`<table><tr><th>Uur</th><th>Gasten</th><th>Naam</th><th>Contact</th><th>Opmerking</th><th></th></tr>${list.map(r=>`<tr class="${r.status}"><td><b>${hm(r.time)}</b></td><td>${r.guests}</td><td>${esc(r.name)}${r.source==='admin'?' <span class="st">admin</span>':''}</td><td><a href="tel:${esc(r.phone)}">${esc(r.phone)}</a><br><a href="mailto:${esc(r.email)}" style="color:var(--mute)">${esc(r.email)}</a></td><td>${esc(r.note)}</td><td class="act">${r.status==='confirmed'?`<button data-a="cancelled" data-id="${r.id}" class="danger">Annuleer</button><button data-a="noshow" data-id="${r.id}">No-show</button>`:`<button data-a="confirmed" data-id="${r.id}">Herstel</button>`}</td></tr>`).join('')}</table>`:'<p class="bk-hint">Nog geen reservaties.</p>')};
    body.innerHTML=`<div class="card"><div class="day"><button class="ico" data-nav="-7">‹</button><h3>${fmtDate(day)}</h3><button class="ico" data-nav="7">›</button><button class="btn btn-o" data-nav="0" style="min-height:40px;padding:8px 14px;font-size:.85rem">Vandaag</button></div><div class="week" style="margin-top:12px">${week}</div></div>
      <div class="card">${svcBlock('lunch')}${svcBlock('dinner')}</div>
      <div class="card"><h3 style="font-size:1.4rem;margin-bottom:10px">Reservatie toevoegen</h3><form id="admAdd" class="grid3"><label class="fld"><span>Dienst</span><select name="service"><option value="lunch">Lunch</option><option value="dinner">Diner</option></select></label><label class="fld"><span>Uur</span><input name="time" type="time" step="900" required></label><label class="fld"><span>Gasten</span><input name="guests" type="number" min="1" max="20" value="2" required></label><label class="fld"><span>Naam</span><input name="name" required></label><label class="fld"><span>Telefoon</span><input name="phone"></label><label class="fld"><span>E-mail</span><input name="email" type="email"></label><label class="fld" style="grid-column:1/-1"><span>Opmerking</span><input name="note"></label><div><button class="btn btn-green" type="submit">Toevoegen op ${fmtDate(day)}</button></div></form><p class="bk-hint" style="margin-top:8px">Telefonische reservaties en grote groepen zet je hier; die tellen mee voor de bezetting.</p></div>`;
    body.querySelectorAll('[data-nav]').forEach(b=>b.onclick=()=>{if(b.dataset.nav==='0')day=iso(new Date());else{const d=parseISO(day);d.setDate(d.getDate()+ +b.dataset.nav);day=iso(d)}renderDay()});
    body.querySelector('.week').onclick=e=>{const b=e.target.closest('button');if(!b)return;day=b.dataset.d;renderDay()};
    body.querySelectorAll('.act button').forEach(b=>b.onclick=async()=>{await sb(`/rest/v1/ambras_bookings?id=eq.${b.dataset.id}`,{method:'PATCH',body:JSON.stringify({status:b.dataset.a}),headers:{Prefer:'return=minimal'}},TOKEN);renderDay()});
    body.querySelector('#admAdd').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const o={site:CMS.site,service:f.get('service'),date:day,time:f.get('time'),guests:+f.get('guests'),name:f.get('name'),phone:f.get('phone')||'',email:f.get('email')||'',note:f.get('note')||'',source:'admin',status:'confirmed'};
      await sb('/rest/v1/ambras_bookings',{method:'POST',body:JSON.stringify(o),headers:{Prefer:'return=minimal'}},TOKEN);renderDay()};
  }
  async function renderSettings(){
    await settingsReady;const body=root.querySelector('#admBody');const S=SET;
    body.innerHTML=`<form class="card" id="admSet" style="display:grid;gap:14px"><h3 style="font-size:1.4rem">Regels</h3><div class="grid3">
      <label class="fld"><span>Max. gasten online</span><input name="maxGuests" type="number" min="1" max="20" value="${S.maxGuests}"></label>
      <label class="fld"><span>Capaciteit per kwartier (personen)</span><input name="capacity" type="number" min="1" max="200" value="${S.capacity}"></label>
      <label class="fld"><span>Min. vooraf (minuten)</span><input name="minLeadMinutes" type="number" min="0" max="2880" value="${S.minLeadMinutes}"></label>
      <label class="fld"><span>Lunch eerste uur</span><input name="lf" type="time" step="900" value="${S.services.lunch.from}"></label><label class="fld"><span>Lunch laatste uur</span><input name="lt" type="time" step="900" value="${S.services.lunch.to}"></label><label class="fld"><span>Max. dagen vooruit</span><input name="maxDaysAhead" type="number" min="1" max="365" value="${S.maxDaysAhead}"></label>
      <label class="fld"><span>Diner eerste uur</span><input name="df" type="time" step="900" value="${S.services.dinner.from}"></label><label class="fld"><span>Diner laatste uur</span><input name="dt" type="time" step="900" value="${S.services.dinner.to}"></label>
      <label class="fld"><span>Open op</span><div class="pills" id="admDays">${[1,2,3,4,5,6,0].map(d=>`<button type="button" data-v="${d}" aria-pressed="${S.openDays.includes(d)}">${DAYS_S[d]}</button>`).join('')}</div></label></div>
      <div><button class="btn btn-green" type="submit">Opslaan</button> <span class="ok" id="admOk"></span></div></form>
      <div class="card"><h3 style="font-size:1.4rem;margin-bottom:10px">Gesloten dagen &amp; uitzonderingen</h3><div class="closed-list" id="admClosed">${(S.closed||[]).map((c,i)=>`<div><span>${fmtDate(c.from)}${c.to&&c.to!==c.from?' – '+fmtDate(c.to):''} · ${c.service?S.services[c.service].label:'hele dag'}${c.note?' · '+esc(c.note):''}</span><button data-i="${i}" class="danger" style="color:#B3261E;font-weight:700">✕</button></div>`).join('')||'<p class="bk-hint">Geen uitzonderingen.</p>'}</div>
      <form id="admAddClosed" class="grid3" style="margin-top:12px"><label class="fld"><span>Van</span><input name="from" type="date" required></label><label class="fld"><span>Tot (optioneel)</span><input name="to" type="date"></label><label class="fld"><span>Dienst</span><select name="service"><option value="">Hele dag gesloten</option><option value="lunch">Enkel lunch gesloten</option><option value="dinner">Enkel diner gesloten</option></select></label><label class="fld" style="grid-column:1/-1"><span>Notitie</span><input name="note" placeholder="Vakantie, privéfeest…"></label><div><button class="btn btn-o" type="submit">Toevoegen</button></div></form></div>`;
    body.querySelector('#admDays').onclick=e=>{const b=e.target.closest('button');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true')};
    const save=async(data)=>{await sb(`/rest/v1/ambras_settings?site=eq.${CMS.site}`,{method:'PATCH',body:JSON.stringify({data}),headers:{Prefer:'return=minimal'}},TOKEN);SET=data};
    body.querySelector('#admSet').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const data={...SET,maxGuests:+f.get('maxGuests'),capacity:+f.get('capacity'),minLeadMinutes:+f.get('minLeadMinutes'),maxDaysAhead:+f.get('maxDaysAhead'),
      services:{lunch:{...SET.services.lunch,from:f.get('lf'),to:f.get('lt')},dinner:{...SET.services.dinner,from:f.get('df'),to:f.get('dt')}},openDays:[...body.querySelectorAll('#admDays button[aria-pressed=true]')].map(b=>+b.dataset.v)};
      await save(data);body.querySelector('#admOk').textContent='Opgeslagen ✓'};
    body.querySelector('#admClosed').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const c=[...SET.closed];c.splice(+b.dataset.i,1);await save({...SET,closed:c});renderSettings()};
    body.querySelector('#admAddClosed').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target);const c=[...(SET.closed||[]),{from:f.get('from'),to:f.get('to')||f.get('from'),service:f.get('service')||null,note:f.get('note')||''}];await save({...SET,closed:c});renderSettings()};
  }
})();
