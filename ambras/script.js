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
const hdr=document.getElementById('hdr'),btn=document.getElementById('menuBtn'),dr=document.getElementById('drawer'),st=document.getElementById('sticky');
function closeDrawer(){dr.classList.remove('open');btn.setAttribute('aria-expanded','false');document.body.style.overflow=''}
btn.addEventListener('click',()=>{const o=!dr.classList.contains('open');dr.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''});
dr.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeDrawer));
addEventListener('keydown',e=>{if(e.key==='Escape')closeDrawer()});
addEventListener('scroll',()=>{hdr.classList.toggle('sc',scrollY>8);st.classList.toggle('show',scrollY>560&&!dr.classList.contains('open'))},{passive:true});

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

/* ---------- ticker duplicate ---------- */
const tk=document.getElementById('tick');tk.innerHTML+=tk.innerHTML;

