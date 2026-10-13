
/* ========= CONFIG ========= */
const SYNC_URL = '/api/sync';  // Netlify Function (zie netlify/functions/sync.mjs); zet op '' om enkel lokaal te bewaren
const START = new Date(2026, 10, 20, 17, 0, 0); // vr 20 nov 2026, 17:00 (aankomst 17-19u)
const END   = new Date(2026, 10, 22, 20, 0, 0); // zo 22 nov, vertrek voor 20u

/* ========= DATA ========= */
const GROUPS = [
  {id:'g1', nl:'Arnold, Jessica & George', es:'Arnold, Jessica y George', color:'var(--brick)', members:['arnold','jessica','george']},
  {id:'g2', nl:'Katrien, Peter, Wout & Janne', es:'Katrien, Peter, Wout y Janne', color:'var(--oak)',   members:['katrien','peter','wout','janne']},
  {id:'g3', nl:'Emma, Yorick & Suzan', es:'Emma, Yorick y Suzan', color:'var(--rose)',  members:['emma','yorick','suzan']},
  {id:'g4', nl:'Marieke & Amelie', es:'Marieke y Amelie', color:'var(--sage)', members:['marieke','amelie']},
  {id:'g5', nl:'Mamy & Tati', es:'Mamy y Tati', color:'var(--lilac)', members:['mamy','tati']},
];
const GUESTS = {
  arnold:{n:'Arnold'}, jessica:{n:'Jessica'}, george:{n:'George', tag:{nl:'8 j',es:'8 a'}},
  katrien:{n:'Katrien', tag:{nl:'oma',es:'abuela'}}, peter:{n:'Peter'}, wout:{n:'Wout', tag:{nl:'16 j',es:'16 a'}}, janne:{n:'Janne', tag:{nl:'liefje van Wout',es:'novia de Wout'}},
  emma:{n:'Emma'}, yorick:{n:'Yorick'}, suzan:{n:'Suzan', tag:{nl:'3 j',es:'3 a'}},
  marieke:{n:'Marieke'}, amelie:{n:'Amelie', tag:{nl:'9 j',es:'9 a'}},
  mamy:{n:'Mamy'}, tati:{n:'Tati'},
};
const LODGES = [
  {id:'l1', nl:'Logement 1', es:'Alojamiento 1', note:{nl:'Zithoek met kachel, keuken met afwasmachine & raclette',es:'Salón con estufa, cocina con lavavajillas y raclette'}, rooms:[
    {id:'r1', nl:'Kamer 1', es:'Habitación 1', cap:2, note:{nl:'badkamer met ligbad delen',es:'baño compartido con bañera'}},
    {id:'r2', nl:'Kamer 2', es:'Habitación 2', cap:2, note:{nl:'eigen douche',es:'ducha privada'}},
    {id:'r3', nl:'Kamer 3', es:'Habitación 3', cap:2, note:{nl:'eigen douche',es:'ducha privada'}},
  ]},
  {id:'l2', nl:'Logement 2', es:'Alojamiento 2', note:{nl:'Grote eettafel (14), kicker, zithoek met kachel',es:'Mesa grande (14), futbolín, salón con estufa'}, rooms:[
    {id:'r4', nl:'Kamer 4', es:'Habitación 4', cap:4, note:{nl:'4 bedden · eigen douche',es:'4 camas · ducha privada'}},
    {id:'r5', nl:'Kamer 5', es:'Habitación 5', cap:2, note:{nl:'eigen douche',es:'ducha privada'}},
    {id:'r6', nl:'Kamer 6', es:'Habitación 6', cap:2, note:{nl:'badkamer met ligbad delen',es:'baño compartido con bañera'}},
  ]},
];
const NEARBY = [
  [{nl:'Bos',es:'Bosque'}, '1 km'],
  [{nl:'Toeristische dienst (Heure-en-Famenne)',es:'Oficina de turismo (Heure-en-Famenne)'}, '2 km'],
  [{nl:'Apotheek & geldautomaat (Baillonville)',es:'Farmacia y cajero (Baillonville)'}, '5 km'],
  [{nl:'Bakkerij (Noiseux)',es:'Panadería (Noiseux)'}, '7 km'],
  [{nl:'Winkels (Somme-Leuze)',es:'Tiendas (Somme-Leuze)'}, '7 km'],
  [{nl:'Rivier de Ourthe',es:'Río Ourthe'}, '7 km'],
  [{nl:'Restaurants',es:'Restaurantes'}, '8 km'],
  [{nl:'Markt (Marche-en-Famenne)',es:'Mercado (Marche-en-Famenne)'}, '10 km'],
  [{nl:'Station (Ciney)',es:'Estación (Ciney)'}, '18 km'],
];
const DEFAULT_ITEMS = [
  ['g1','Vaatdoeken & keukenhanddoeken'],['g1','Aanmaakblokjes + lucifers'],['g1','Speaker'],
  ['g2','Raclette-ingrediënten vrijdag'],['g2','Wijn & bier'],['g2','Petanqueballen (check of ze er zijn)'],
  ['g3','Babybedje-lakentje & kinderstoel-kussen'],['g3','Ontbijt zaterdag (eieren, spek, brood)'],
  ['g4','Gezelschapsspellen'],['g4','Koffie, thee, suiker, melk'],
  ['g5','Zondagse taart'],['g5','Kaarsen & servetten'],
];

/* ========= I18N ========= */
const T = {
 nl:{},
 es:{
  brand:'Fin de semana familiar Ardenas', nav_home:'Inicio', nav_info:'Práctico', nav_rooms:'Habitaciones', nav_pack:'Qué llevar', nav_photos:'Fotos', nav_game:'🐗 Juego', nav_home_m:'Inicio', nav_info_m:'Práctico', nav_rooms_m:'Habitac.', nav_pack_m:'Qué llevar', nav_game_m:'Juego', photos_strip:'Ver todas las fotos →',
  sync_local:'local', sync_on:'sincronizado', sync_off:'sin conexión', sync_busy:'guardando…',
  hero_eyebrow:'Viernes 20 nov 17 h → domingo 22 nov — Somme-Leuze', hero_title:'Juntos en las Ardenas',
  count_lbl:'Falta', d_days:'días', d_hours:'horas', d_min:'min', d_sec:'seg',
  st_people:'invitados (capacidad 14)', st_rooms:'habitaciones + baños', st_lodges:'alojamientos, cada uno con estufa', st_garden:'de jardín, parque y petanca',
  tile_rooms:'Habitaciones', tile_rooms_d:'Arrástrate a una habitación.', tile_pack:'Qué llevar', tile_pack_d:'Apunta lo que traes — no olvides los paños de cocina.', tile_info:'Práctico', tile_info_d:'Llegada viernes 17–19 h · salida domingo antes de las 20 h.', tile_info_s:'Dirección, casa, cocina, niños →',
  home_about_eye:'La casa', home_about_h:'Dos viviendas bajo un mismo techo',
  home_about_1:'La casa en Somme-Leuze tiene dos alojamientos separados (Alojamiento 1 y 2), cada uno con cocina, salón con estufa de leña y tres habitaciones. En total: sitio para 14, con cuna y trona para Suzan.',
  home_about_2:'En el Alojamiento 2 está la mesa grande para 14 y el futbolín — allí cenaremos todos juntos. El jardín tiene parque infantil con tobogán y columpios, pista de petanca y barbacoa de leña en la terraza.',
  home_link:'Ver la casa en Ardennes-Étape (nota 9,8) →',
  home_todo_eye:'Organizar', home_todo_h:'Lo que puedes hacer tú',
  home_todo_1:'Arrástrate a una habitación en <b>Habitaciones</b>.', home_todo_2:'Apunta en <b>Qué llevar</b> lo que traes — así no compramos pan tres veces.',
  home_todo_3:'No olvides los paños de cocina: no hay en la casa.', home_todo_4:'Sábanas y toallas se alquilan en la casa — no hace falta traerlas.',
  btn_rooms:'Ir a las habitaciones', btn_pack:'Ir a la lista',
  prog_eye:'Plan aproximado', prog_h:'De viernes a domingo',
  day1_h:'Viernes 20 nov', day1_d:'Llegada 17 – 19 h', day1_1:'Llegar, elegir habitación, encender la estufa', day1_2:'Cocinar juntos en el Alojamiento 2 (¡hay raclette!)', day1_3:'Torneo de futbolín para los valientes',
  day2_h:'Sábado 21 nov', day2_d:'Adventure Valley Durbuy', day2_1:'<b>Adventure Valley Durbuy</b> — tirolinas, circuitos de escalada, kayak y más, para pequeños y grandes (±20 min en coche)', day2_2:'Después, un paseo por el centro de Durbuy', day2_3:'Noche: barbacoa o sobremesa larga',
  day3_h:'Domingo 22 nov', day3_d:'Paseo y salida antes de las 20 h', day3_1:'Desayuno largo (panadería en Noiseux, 7 km)', day3_2:'<b>Paseo</b> por el bosque a 1 km, o por la Famenne — antes de salir', day3_3:'Recoger, repartir todo entre los coches y salir antes de las 20 h',
  prog_hint:'El plan es una propuesta — cámbialo en el grupo sin problema.',
  info_eye:'Práctico', info_h:'Todo lo que hay que saber',
  f_where:'Dónde', f_where_1:'<b>Rue Moressée 3, 5377 Heure-en-Famenne</b> (Somme-Leuze) · <a href="https://www.google.com/maps/search/?api=1&query=Rue+Moress%C3%A9e+3%2C+5377+Heure-en-Famenne" target="_blank" rel="noopener">ruta</a>', f_where_2:'Aprox. 1h45 en coche desde Amberes por la E411/N4', f_where_3:'Persona de contacto: Jean-François Leboutte · <a href="tel:+32475515690">+32 475 51 56 90</a>',
  f_when:'Cuándo', f_when_1:'Viernes 20 de noviembre → domingo 22 de noviembre de 2026', f_when_2:'<b>Llegada el viernes entre las 17 y las 19 h</b> · <b>salida el domingo antes de las 20 h</b>', f_when_3:'Avisa en el grupo a qué hora llegas',
  f_bring:'Obligatorio / traer', f_bring_1:'<b>Sábanas y toallas se alquilan obligatoriamente</b> en la casa', f_bring_2:'<b>Paños de cocina: traerlos</b>',
  f_kitchen:'Cocina', f_kitchen_1:'Dos cocinas: vitrocerámica (4 fuegos), horno, microondas, nevera con congelador', f_kitchen_2:'Alojamiento 1 además: lavavajillas, Senseo y cafetera de filtro, hervidor, tostadora, batidora, raclette', f_kitchen_3:'Mesa de comedor con 14 sillas en el Alojamiento 2', f_kitchen_4:'Barbacoa de leña en la terraza (traer leña/carbón)',
  f_kids:'Niños', f_kids_1:'Cuna y trona disponibles', f_kids_2:'Parque: tobogán, columpios, torre', f_kids_3:'Futbolín dentro, petanca fuera', f_kids_4:'El jardín <b>no está vallado</b> — ojo con los peques',
  f_comfort:'Confort', f_comfort_1:'Estufa de leña en los dos salones', f_comfort_2:'TV con Proximus en ambos alojamientos', f_comfort_3:'Secador en cada baño', f_comfort_4:'Terraza 35 m², jardín 300 m²',
  call_b:'Atención:', call_t:'no hace falta traer sábanas ni toallas (se alquilan allí), pero los paños de cocina sí. ¿Quién los trae? Apúntalo en la lista.',
  house_h:'Distribución de la casa', lodge1:'Alojamiento 1', lodge2:'Alojamiento 2', lv0:'Planta baja', lv1:'Primera planta', lv0b:'Planta baja', lv1b:'Primera planta',
  l1_0:'Hall · salón con <b>estufa de leña</b> y TV · comedor · cocina completa (lavavajillas, Senseo, café de filtro, raclette) · aseo',
  l1_1:'<b>Habitación 1</b> (2p) · <b>Habitación 2</b> (2p, ducha propia) · <b>Habitación 3</b> (2p, ducha propia) · baño con <b>bañera</b> · aseo',
  beds_note:'Todas las camas son individuales y se pueden juntar.',
  l2_0:'Hall · salón con <b>estufa de leña</b>, TV, 2 sofás de tres + 2 sillones · <b>mesa para 14</b> · cocina · futbolín · aseo',
  l2_1:'<b>Habitación 4</b> (4p, ducha propia) · <b>Habitación 5</b> (2p, ducha propia) · <b>Habitación 6</b> (2p) · baño con <b>bañera</b> · aseo',
  beds_note2:'La habitación 4 es la única con cuatro camas — ideal para una familia con niños.',
  near_h:'Cerca de la casa', rules_h:'Normas y consejos',
  rules_1:'Leña para la estufa: comprobar al llegar si hay reserva; si no, se compra en Somme-Leuze (7 km). Unas pastillas de encendido en el coche nunca sobran.',
  rules_2:'Cajero en Baillonville (5 km), farmacia también allí. La estación más cercana es Ciney (18 km) para quien venga en tren.',
  rules_3:'Comida: mercado en Marche-en-Famenne el sábado (10 km), panadería en Noiseux (7 km), restaurantes a 8 km. La compra grande mejor hacerla antes.',
  tips_h:'Excursiones cerca',
  tip_durbuy:'“La ciudad más pequeña del mundo” — callejuelas pintorescas, terrazas y el jardín de topiaria. El sábado vamos a <b>Adventure Valley Durbuy</b>, el parque de aventuras a las afueras. Unos 20 minutos en coche.',
  tip_hotton_h:'Grutas de Hotton', tip_hotton:'Una de las grutas más bonitas de Bélgica, con una garganta subterránea espectacular. Dentro siempre 12 °C: tiempo perfecto para noviembre.',
  tip_geo_h:'Geoparque Famenne-Ardenne', tip_geo:'Geoparque Unesco con formaciones geológicas únicas, rutas y miradores — y el bosque empieza a 1 km de la casa.',
  tip_modave_h:'Castillo de Modave', tip_modave:'Castillo elegante con jardines preciosos y una mirada a la vida de la nobleza. Divertido también para los niños: jardines enormes para corretear.',
  more:'Más info →', more2:'Más info →', more3:'Más info →', more4:'Más info →',
  rooms_eye:'Reparto de habitaciones', rooms_h:'¿Quién duerme dónde?',
  rooms_hint:'Arrastra un nombre a una habitación (también en el móvil). Todos ven el mismo reparto — los cambios se guardan solos.',
  pool_h:'Sin habitación', btn_auto:'✨ Rellenar propuesta', btn_reset:'Vaciar todo',
  pool_hint:'La propuesta tiene en cuenta las familias, Mamy y Tati juntas, y la habitación de 4.',
  pack_eye:'Qué llevar', pack_h:'¿Quién trae qué?',
  pack_hint:'Escribe algo en tu grupo, marca lo que ya está en la maleta y arrastra un artículo a otro grupo si lo trae otra persona. Haz clic en un texto para editarlo.',
  ph_eye:'Ambiente', ph_h:'Así es la casa',
  ph_1:'Terraza con barbacoa y vistas a la Famenne', ph_2:'Salón con estufa de leña (Alojamiento 2)', ph_3:'La mesa del comedor', ph_4:'Salón con cocina abierta', ph_5:'El futbolín', ph_6:'Parque infantil en el jardín', ph_7:'Baño con bañera', ph_8:'Salón del Alojamiento 1', ph_9:'La fachada', ph_credit:'Fotos: Ardennes-Étape',
  foot:'Fin de semana familiar Ardenas · 20–22 de noviembre de 2026 · Somme-Leuze',
  cd_before:'Todavía queda un poco. Hasta pronto.', cd_soon:'¡Última semana! Haz la maleta.', cd_now:'¡Es ahora! Que lo paséis genial en las Ardenas.', cd_after:'Ya pasó. Hasta la próxima.',
  saved:'Guardado', saved_local:'Guardado en este navegador', loaderr:'Sin conexión con el servidor — guardando solo localmente',
  lastsaved:'última modificación', add_ph:'Añadir…', add_btn:'Añadir', items_done:'listo', delete_q:'¿Eliminar este artículo?', reset_q:'¿Vaciar todas las habitaciones?',
  auto_done:'Propuesta rellenada — ajusta lo que quieras.', persons:'pers.',
  gb_eye:'Juego', gb_h:'Caza del jabalí', gb_d:'30 segundos, nueve madrigueras, un bosque lleno de jabalíes. ¿Quién será el mejor cazador de la familia?', gb_btn:'¡Juega! →',
  game_eye:'Juego', game_h:'Caza del jabalí', game_hint:'Toca lo más rápido posible los jabalíes que salen del bosque. Jabalí dorado = 5 puntos. Al ciervo déjalo en paz: −3. Tienes 30 segundos.', g_score:'Puntos', g_time:'Tiempo', g_best:'Mejor', g_ready:'¿Listo para la caza?', g_sub:'Pon tu nombre y pulsa start.', g_start:'¡Start!', g_top:'🏆 Mejores cazadores', g_top_hint:'Las puntuaciones se comparten con todos — por nombre cuenta tu mejor puntuación.', g_over:'¡Se acabó!', g_over_sub:'{s} puntos', g_again:'¡Otra vez!', g_newbest:'¡Nuevo récord personal!', g_name:'Tu nombre',
  ideas_eye:'Ideas', ideas_h:'¿Propones una actividad?', ideas_hint:'Apunta tu idea aquí — un paseo, un juego, un restaurante, lo que sea. Todos ven la lista y pueden dar un pulgar arriba.', idea_btn:'Enviar', idea_name:'Tu nombre', idea_ph:'Tu idea…', idea_empty:'Todavía no hay ideas — ¡sé el primero!', idea_delq:'¿Eliminar esta idea?',
 }
};
const NL = {
  sync_on:'gesynchroniseerd', sync_off:'offline', sync_busy:'bewaren…', sync_local:'lokaal',
  cd_before:'Nog even geduld. Tot binnenkort.', cd_soon:'Laatste week! Valiezen maken.', cd_now:'Het is zover! Veel plezier in de Ardennen.', cd_after:'Voorbij. Tot de volgende keer.',
  saved:'Bewaard', saved_local:'Bewaard in deze browser', loaderr:'Geen verbinding met de server — enkel lokaal bewaard',
  lastsaved:'laatst gewijzigd', add_ph:'Iets toevoegen…', add_btn:'Voeg toe', items_done:'klaar', delete_q:'Dit item verwijderen?', reset_q:'Alle kamers leegmaken?',
  auto_done:'Voorstel ingevuld — pas aan wat je wil.', persons:'pers.', idea_name:'Je naam', idea_ph:'Je idee…', idea_empty:'Nog geen ideeën — wees de eerste!', idea_delq:'Dit idee verwijderen?', g_over:'Tijd om!', g_over_sub:'{s} punten', g_again:'Nog eens!', g_newbest:'Nieuw persoonlijk record!', g_name:'Je naam',
};
let lang = 'nl';
try{ lang = localStorage.getItem('fw-lang') || 'nl'; }catch(e){}
function t(k){ return (lang==='es' && T.es[k]) || NL[k] || k; }
function L(obj){ return obj ? (obj[lang] || obj.nl) : ''; }

/* Snapshot of the original Dutch text so we can switch back */
const nlText = {};
document.querySelectorAll('[data-t]').forEach(el=>{ nlText[el.dataset.t]=el.innerHTML; });
function applyLang(){
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-t]').forEach(el=>{
    const k=el.dataset.t;
    el.innerHTML = (lang==='es' && T.es[k]) ? T.es[k] : nlText[k];
  });
  document.querySelectorAll('.lang button').forEach(b=>b.classList.toggle('active',b.dataset.lang===lang));
  renderNearby(); renderRooms(); renderPack(); renderIdeas(); renderScores(); setSync(syncState); tickCountdown();
}
document.querySelectorAll('.lang button').forEach(b=>b.addEventListener('click',()=>{
  lang=b.dataset.lang; try{localStorage.setItem('fw-lang',lang);}catch(e){} applyLang();
}));

/* ========= THEME ========= */
const root=document.documentElement;
function setTheme(th){ if(th) root.setAttribute('data-theme',th); else root.removeAttribute('data-theme'); try{localStorage.setItem('fw-theme',th||'');}catch(e){} }
try{ const s=localStorage.getItem('fw-theme'); if(s) setTheme(s); }catch(e){}
document.getElementById('themeBtn').addEventListener('click',()=>{
  setTheme(root.getAttribute('data-theme')==='light' ? '' : 'light');
});

/* ========= TABS ========= */
function go(view){
  document.querySelectorAll('#tabs button,#bottombar button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  document.querySelectorAll('section.view').forEach(s=>s.classList.toggle('active',s.id==='view-'+view));
  try{ history.replaceState(null,'','#'+view); }catch(e){}
  window.scrollTo({top:0});
}
document.querySelectorAll('#tabs button,#bottombar button').forEach(b=>b.addEventListener('click',()=>go(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',e=>{ e.preventDefault(); go(b.dataset.go); }));
if(location.hash && document.getElementById('view-'+location.hash.slice(1))) go(location.hash.slice(1));

/* ========= COUNTDOWN ========= */
function pad(n){ return String(n).padStart(2,'0'); }
function tickCountdown(){
  const now=new Date(); let diff=START-now; const msg=document.getElementById('cd-msg');
  if(now>=START && now<=END){ diff=0; msg.textContent=t('cd_now'); }
  else if(now>END){ diff=0; msg.textContent=t('cd_after'); }
  else msg.textContent = diff < 7*864e5 ? t('cd_soon') : t('cd_before');
  const d=Math.floor(diff/864e5), h=Math.floor(diff%864e5/36e5), m=Math.floor(diff%36e5/6e4), s=Math.floor(diff%6e4/1e3);
  document.getElementById('cd-d').textContent=d; document.getElementById('cd-h').textContent=pad(h);
  document.getElementById('cd-m').textContent=pad(m); document.getElementById('cd-s').textContent=pad(s);
}
setInterval(tickCountdown,1000);

/* ========= STATE & SYNC ========= */
let state = null;
function freshState(){
  return { v:1, updatedAt:0, rooms:{}, ideas:[], items: DEFAULT_ITEMS.map((x,i)=>({id:'i'+i, g:x[0], text:x[1], done:false})) };
}
let syncState='local', saveTimer=null, lastRemote=0, pollTimer=null;
function setSync(s){
  syncState=s;
  document.querySelectorAll('.sync').forEach(el=>{
    el.classList.remove('on','off','busy'); if(s==='on'||s==='off'||s==='busy') el.classList.add(s);
    const label=t(s==='on'?'sync_on':s==='off'?'sync_off':s==='busy'?'sync_busy':'sync_local');
    el.querySelector('span').textContent=label; el.title=label;
  });
}
function loadLocal(){ try{ const j=localStorage.getItem('fw-state'); return j?JSON.parse(j):null; }catch(e){ return null; } }
function saveLocal(){ try{ localStorage.setItem('fw-state',JSON.stringify(state)); }catch(e){} }
async function loadRemote(){
  if(!SYNC_URL) return null;
  const r=await fetch(SYNC_URL+'?t='+Date.now(),{cache:'no-store'}); if(!r.ok) throw new Error(r.status);
  const txt=await r.text(); return txt && txt!=='null' ? JSON.parse(txt) : null;
}
async function pushRemote(){
  if(!SYNC_URL) return;
  setSync('busy');
  try{
    const r=await fetch(SYNC_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(state)});
    if(!r.ok) throw new Error(r.status);
    lastRemote=state.updatedAt; setSync('on'); toast(t('saved'));
  }catch(e){ setSync('off'); toast(t('saved_local')); }
}
function changed(){
  state.updatedAt=Date.now(); saveLocal(); updateFooter();
  clearTimeout(saveTimer); saveTimer=setTimeout(pushRemote,600);
}
async function poll(){
  if(!SYNC_URL || saveTimer) return;
  try{
    const remote=await loadRemote();
    if(remote && remote.updatedAt>state.updatedAt){ state=remote; saveLocal(); renderRooms(); renderPack(); renderIdeas(); renderScores(); updateFooter(); }
    if(syncState!=='busy') setSync('on');
  }catch(e){ setSync('off'); }
}
function updateFooter(){
  const el=document.getElementById('lastSaved');
  el.textContent = state.updatedAt ? t('lastsaved')+' '+new Date(state.updatedAt).toLocaleString(lang==='es'?'es-ES':'nl-BE',{dateStyle:'short',timeStyle:'short'}) : '';
}
async function init(){
  state = loadLocal() || freshState();
  renderAll();
  if(SYNC_URL){
    try{
      const remote=await loadRemote();
      if(remote && remote.updatedAt>=state.updatedAt){ state=remote; saveLocal(); renderAll(); }
      else if(state.updatedAt>0){ pushRemote(); }
      setSync('on');
    }catch(e){ setSync('off'); toast(t('loaderr')); }
    pollTimer=setInterval(poll,5000);
    document.addEventListener('visibilitychange',()=>{ if(!document.hidden) poll(); });
  }
}
function renderAll(){ renderNearby(); renderRooms(); renderPack(); renderIdeas(); renderScores(); updateFooter(); }
function updateTiles(){ if(!state) return; const un=Object.keys(GUESTS).filter(g=>!roomOf(g)).length; document.getElementById('tileRooms').textContent = un? (lang==='es'?`${un} todavía sin habitación →`:`${un} nog zonder kamer →`) : (lang==='es'?'Todos tienen habitación ✓':'Iedereen heeft een kamer ✓'); const tot=state.items.length, dn=state.items.filter(i=>i.done).length; document.getElementById('tilePack').textContent = (lang==='es'?`${dn} de ${tot} artículos listos →`:`${dn} van ${tot} items klaar →`); }
let toastT;
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),1800); }

/* ========= HELPERS ========= */
function groupOf(gid){ return GROUPS.find(g=>g.members.includes(gid)); }
function initials(n){ return n.slice(0,2).toUpperCase(); }
function esc(s){ return s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ========= NEARBY ========= */
function renderNearby(){
  document.getElementById('nearby').innerHTML = NEARBY.map(([n,d])=>`<tr><td>${L(n)}</td><td class="tnum">${d}</td></tr>`).join('');
}

/* ========= ROOMS ========= */
function roomOf(gid){ for(const r in state.rooms){ if(state.rooms[r].includes(gid)) return r; } return null; }
function guestChip(gid){
  const g=GUESTS[gid], grp=groupOf(gid);
  const el=document.createElement('div'); el.className='guest'; el.dataset.guest=gid;
  el.innerHTML=`<span class="av" style="background:${grp.color}">${initials(g.n)}</span><span>${g.n}</span>${g.tag?`<span class="tag">${L(g.tag)}</span>`:''}`;
  return el;
}
function renderRooms(){
  if(!state) return;
  document.getElementById('legend').innerHTML = GROUPS.map(g=>`<span><i style="background:${g.color}"></i>${L(g)}</span>`).join('');
  const pool=document.getElementById('pool'); pool.innerHTML='';
  const unassigned=Object.keys(GUESTS).filter(g=>!roomOf(g));
  unassigned.forEach(g=>pool.appendChild(guestChip(g)));
  document.getElementById('poolCount').textContent = unassigned.length ? unassigned.length+' '+t('persons') : '✓';
  updateTiles();
  const houses=document.getElementById('houses'); houses.innerHTML='';
  LODGES.forEach(lg=>{
    const d=document.createElement('div'); d.className='lodge';
    d.innerHTML=`<h3>${L(lg)} <small>${L(lg.note)}</small></h3><div class="rooms"></div>`;
    const rs=d.querySelector('.rooms');
    lg.rooms.forEach(r=>{
      const occ=state.rooms[r.id]||[];
      const rd=document.createElement('div'); rd.className='room'+(occ.length===r.cap?' full':occ.length>r.cap?' over':'');
      rd.innerHTML=`<div class="rh"><div><b>${L(r)}</b><div class="beds">${r.cap} × 1p</div></div><span class="cap tnum">${occ.length}/${r.cap}</span></div><div class="note">${L(r.note)}</div><div class="dropzone" data-room="${r.id}"></div>`;
      const dz=rd.querySelector('.dropzone'); occ.forEach(g=>dz.appendChild(guestChip(g)));
      rs.appendChild(rd);
    });
    houses.appendChild(d);
  });
}
function moveGuest(gid, roomId){
  for(const r in state.rooms){ state.rooms[r]=state.rooms[r].filter(x=>x!==gid); }
  if(roomId && roomId!=='pool'){ (state.rooms[roomId]=state.rooms[roomId]||[]).push(gid); }
  changed(); renderRooms();
}
document.getElementById('resetRooms').addEventListener('click',()=>{ if(confirm(t('reset_q'))){ state.rooms={}; changed(); renderRooms(); } });
document.getElementById('autoBtn').addEventListener('click',()=>{
  state.rooms={ r1:['katrien','peter'], r2:['mamy','tati'], r3:['arnold','jessica'], r4:['emma','yorick','suzan','george'], r5:['marieke','amelie'], r6:['wout','janne'] };
  changed(); renderRooms(); toast(t('auto_done'));
});

/* ========= IDEAS ========= */
let myId='';
try{ myId=localStorage.getItem('fw-me')||''; if(!myId){ myId=Math.random().toString(36).slice(2,10); localStorage.setItem('fw-me',myId);} }catch(e){ myId='anon'; }
function renderIdeas(){
  if(!state) return; state.ideas=state.ideas||[];
  const wrap=document.getElementById('ideas'); wrap.innerHTML='';
  document.getElementById('ideaName').placeholder=t('idea_name'); document.getElementById('ideaText').placeholder=t('idea_ph');
  try{ const n=localStorage.getItem('fw-name'); if(n && !document.getElementById('ideaName').value) document.getElementById('ideaName').value=n; }catch(e){}
  if(!state.ideas.length){ wrap.innerHTML=`<div class="empty">${t('idea_empty')}</div>`; return; }
  [...state.ideas].sort((a,b)=>(b.votes||[]).length-(a.votes||[]).length || a.at-b.at).forEach(idea=>{
    const votes=idea.votes||[]; const mine=votes.includes(myId);
    const el=document.createElement('div'); el.className='idea';
    el.innerHTML=`<div class="what"><span class="who">${esc(idea.who)}</span> · ${esc(idea.text)}<div class="when">${new Date(idea.at).toLocaleDateString(lang==='es'?'es-ES':'nl-BE',{day:'numeric',month:'short'})}</div></div>
      <button class="vote${mine?' mine':''}" type="button">👍 ${votes.length}</button><button class="del" type="button" aria-label="verwijder">×</button>`;
    el.querySelector('.vote').addEventListener('click',()=>{ idea.votes=mine?votes.filter(v=>v!==myId):[...votes,myId]; changed(); renderIdeas(); });
    el.querySelector('.del').addEventListener('click',()=>{ if(confirm(t('idea_delq'))){ state.ideas=state.ideas.filter(x=>x!==idea); changed(); renderIdeas(); } });
    wrap.appendChild(el);
  });
}
document.getElementById('ideaForm').addEventListener('submit',e=>{
  e.preventDefault();
  const who=document.getElementById('ideaName').value.trim(), text=document.getElementById('ideaText').value.trim();
  if(!who||!text) return;
  try{ localStorage.setItem('fw-name',who); }catch(e){}
  state.ideas.push({id:'d'+Date.now().toString(36), who, text, at:Date.now(), votes:[myId]});
  document.getElementById('ideaText').value='';
  changed(); renderIdeas(); toast(t('saved'));
});

/* ========= PACKING ========= */
function renderPack(){
  if(!state) return;
  const wrap=document.getElementById('groups'); wrap.innerHTML='';
  let total=0, done=0;
  GROUPS.forEach(g=>{
    const items=state.items.filter(i=>i.g===g.id); const dn=items.filter(i=>i.done).length; total+=items.length; done+=dn;
    const d=document.createElement('div'); d.className='group'; d.style.setProperty('--gc',g.color); d.dataset.group=g.id;
    d.innerHTML=`<div class="gh"><h3>${L(g)}</h3><span class="gcount">${dn}/${items.length} ${t('items_done')}</span></div>
      <div class="items" data-group="${g.id}"></div>
      <form class="addrow"><input placeholder="${t('add_ph')}" maxlength="80" autocomplete="off"><button type="submit">${t('add_btn')}</button></form>`;
    const list=d.querySelector('.items');
    items.forEach(it=>{
      const el=document.createElement('div'); el.className='item'+(it.done?' done':''); el.dataset.item=it.id;
      el.innerHTML=`<span class="grip" title="sleep">⋮⋮</span><button class="chk" type="button" aria-label="klaar">${it.done?'✓':''}</button><span class="txt" contenteditable="true" spellcheck="false">${esc(it.text)}</span><button class="del" type="button" aria-label="verwijder">×</button>`;
      el.querySelector('.chk').addEventListener('click',()=>{ it.done=!it.done; changed(); renderPack(); });
      const txt=el.querySelector('.txt');
      txt.addEventListener('blur',()=>{ const v=txt.textContent.trim().slice(0,120); if(v && v!==it.text){ it.text=v; changed(); } else if(!v) renderPack(); });
      txt.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); txt.blur(); } });
      el.querySelector('.del').addEventListener('click',()=>{ if(confirm(t('delete_q'))){ state.items=state.items.filter(x=>x.id!==it.id); changed(); renderPack(); } });
      list.appendChild(el);
    });
    d.querySelector('form').addEventListener('submit',e=>{
      e.preventDefault(); const inp=e.target.querySelector('input'); const v=inp.value.trim(); if(!v) return;
      state.items.push({id:'i'+Date.now().toString(36)+Math.random().toString(36).slice(2,6), g:g.id, text:v, done:false});
      changed(); renderPack(); wrap.querySelector(`[data-group="${g.id}"] input`)?.focus();
    });
    wrap.appendChild(d);
  });
  document.getElementById('packStat').textContent = `${done} / ${total} ${t('items_done')}`;
  document.getElementById('packBar').style.width = total ? (100*done/total)+'%' : '0%';
  updateTiles();
}
function moveItem(id, gid){ const it=state.items.find(x=>x.id===id); if(!it||it.g===gid) return; it.g=gid; changed(); renderPack(); }

/* ========= DRAG & DROP (pointer events: mouse + touch) ========= */
function enableDrag({selector, zoneSelector, handle, onDrop}){
  let src=null, ghost=null, sx=0, sy=0, active=false, pid=null, curZone=null;
  document.addEventListener('pointerdown',e=>{
    const el=e.target.closest(selector); if(!el) return;
    if(handle && !e.target.closest(handle)) return;
    if(e.target.matches('input,button,[contenteditable]') && !(handle && e.target.closest(handle))) return;
    src=el; sx=e.clientX; sy=e.clientY; pid=e.pointerId; active=false;
  });
  document.addEventListener('pointermove',e=>{
    if(!src || e.pointerId!==pid) return;
    if(!active){ if(Math.hypot(e.clientX-sx,e.clientY-sy)<6) return; active=true;
      ghost=src.cloneNode(true); ghost.classList.add('ghost'); const r=src.getBoundingClientRect(); ghost.style.width=r.width+'px'; ghost.dataset.ox=e.clientX-r.left; ghost.dataset.oy=e.clientY-r.top; document.body.appendChild(ghost); src.classList.add('dragging'); }
    e.preventDefault();
    ghost.style.left=(e.clientX-ghost.dataset.ox)+'px'; ghost.style.top=(e.clientY-ghost.dataset.oy)+'px';
    ghost.style.display='none'; const under=document.elementFromPoint(e.clientX,e.clientY); ghost.style.display='';
    const zone=under && under.closest(zoneSelector);
    if(zone!==curZone){ curZone&&curZone.classList.remove('over'); curZone=zone; curZone&&curZone.classList.add('over'); }
  },{passive:false});
  function end(e){
    if(!src) return;
    if(active){ ghost.remove(); src.classList.remove('dragging'); if(curZone){ curZone.classList.remove('over'); onDrop(src,curZone); } }
    src=null; ghost=null; active=false; curZone=null;
  }
  document.addEventListener('pointerup',end); document.addEventListener('pointercancel',end);
}
enableDrag({selector:'.guest:not(.ghost)', zoneSelector:'.dropzone', onDrop:(el,zone)=>moveGuest(el.dataset.guest, zone.dataset.room)});
enableDrag({selector:'.item:not(.ghost)', zoneSelector:'.items', handle:'.grip', onDrop:(el,zone)=>moveItem(el.dataset.item, zone.dataset.group)});

/* ========= GAME: everzwijnen jagen ========= */
const G={ BOAR:`<svg viewBox="0 0 100 80" class="critter-svg"><ellipse cx="50" cy="48" rx="34" ry="24" fill="#4a3426"/><ellipse cx="48" cy="34" rx="30" ry="14" fill="#5b3f2c"/><circle cx="26" cy="44" r="16" fill="#4a3426"/><ellipse cx="14" cy="50" rx="9" ry="7" fill="#c98b7a"/><circle cx="12" cy="49" r="1.8" fill="#3a2418"/><circle cx="16" cy="49" r="1.8" fill="#3a2418"/><circle cx="24" cy="38" r="2.6" fill="#fff"/><circle cx="24.5" cy="38.5" r="1.4" fill="#111"/><path d="M28 28 l6 -14 l6 12z" fill="#4a3426"/><path d="M18 55 q-4 6 -2 9" stroke="#f3ead8" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="32" y="66" width="8" height="12" rx="3" fill="#3a2418"/><rect x="58" y="66" width="8" height="12" rx="3" fill="#3a2418"/><path d="M82 44 q10 -6 6 6" stroke="#4a3426" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`, GOLD:`<svg viewBox="0 0 100 80" class="critter-svg"><ellipse cx="50" cy="48" rx="34" ry="24" fill="#c99a2e"/><ellipse cx="48" cy="34" rx="30" ry="14" fill="#e0b447"/><circle cx="26" cy="44" r="16" fill="#c99a2e"/><ellipse cx="14" cy="50" rx="9" ry="7" fill="#f0cf82"/><circle cx="12" cy="49" r="1.8" fill="#8a6415"/><circle cx="16" cy="49" r="1.8" fill="#8a6415"/><circle cx="24" cy="38" r="2.6" fill="#fff"/><circle cx="24.5" cy="38.5" r="1.4" fill="#111"/><path d="M28 28 l6 -14 l6 12z" fill="#c99a2e"/><path d="M18 55 q-4 6 -2 9" stroke="#f3ead8" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="32" y="66" width="8" height="12" rx="3" fill="#8a6415"/><rect x="58" y="66" width="8" height="12" rx="3" fill="#8a6415"/><path d="M82 44 q10 -6 6 6" stroke="#c99a2e" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`, DEER:`<svg viewBox="0 0 100 80" class="critter-svg"><path d="M30 20 l-8 -16 M30 20 l-14 -6 M30 20 l2 -18 M70 20 l8 -16 M70 20 l14 -6 M70 20 l-2 -18" stroke="#7a5a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/><ellipse cx="50" cy="52" rx="30" ry="24" fill="#b8865a"/><ellipse cx="50" cy="60" rx="16" ry="12" fill="#e9d3b5"/><ellipse cx="34" cy="26" rx="8" ry="5" fill="#b8865a"/><ellipse cx="66" cy="26" rx="8" ry="5" fill="#b8865a"/><ellipse cx="50" cy="34" rx="22" ry="16" fill="#c4956a"/><circle cx="41" cy="32" r="3.2" fill="#fff"/><circle cx="41.5" cy="32.5" r="1.8" fill="#111"/><circle cx="59" cy="32" r="3.2" fill="#fff"/><circle cx="59.5" cy="32.5" r="1.8" fill="#111"/><ellipse cx="50" cy="44" rx="5" ry="3.5" fill="#3a2418"/></svg>` };
const HOLES=9; let game={running:false,score:0,time:30,timer:null,spawner:null,best:0};
const holesEl=document.getElementById('holes');
for(let i=0;i<HOLES;i++){ const d=document.createElement('div'); d.className='hole'; d.dataset.i=i; d.innerHTML='<div class="critter"></div>'; holesEl.appendChild(d); }
let audioCtx=null;
function beep(freq,dur,type='square',vol=.06){ try{ audioCtx=audioCtx||new (window.AudioContext||window.webkitAudioContext)(); const o=audioCtx.createOscillator(), g=audioCtx.createGain(); o.type=type; o.frequency.value=freq; g.gain.value=vol; o.connect(g); g.connect(audioCtx.destination); o.start(); g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur); o.stop(audioCtx.currentTime+dur); }catch(e){} }
function renderScores(){
  if(!state) return; state.scores=state.scores||[];
  const ol=document.getElementById('scoreList');
  const bestByName={};
  state.scores.forEach(s=>{ const k=s.who.trim().toLowerCase(); if(!bestByName[k] || s.score>bestByName[k].score || (s.score===bestByName[k].score && s.at<bestByName[k].at)) bestByName[k]=s; });
  const top=Object.values(bestByName).sort((a,b)=>b.score-a.score||a.at-b.at).slice(0,10);
  ol.innerHTML= top.length ? top.map((s,i)=>`<li><span class="rank">${i+1}</span><span class="who">${esc(s.who)}</span><span class="pts tnum">${s.score}</span></li>`).join('') : `<li class="muted">${lang==='es'?'Todavía nadie ha cazado…':'Nog niemand heeft gejaagd…'}</li>`;
  const gb=document.getElementById('gbLeader'); if(gb) gb.textContent = top.length ? (lang==='es'?`🏆 Líder: ${top[0].who} con ${top[0].score} puntos`:`🏆 Koploper: ${top[0].who} met ${top[0].score} punten`) : (lang==='es'?'🏆 Todavía nadie tiene el récord — ¡sé el primero!':'🏆 Nog niemand heeft het record — wees de eerste!');
  const me=(document.getElementById('gName').value||'').trim().toLowerCase();
  const mine=state.scores.filter(s=>s.who.toLowerCase()===me).map(s=>s.score);
  game.best=mine.length?Math.max(...mine):0; document.getElementById('gBest').textContent=game.best||'–';
  document.getElementById('gName').placeholder=t('g_name');
}
try{ const n=localStorage.getItem('fw-name'); if(n) document.getElementById('gName').value=n; }catch(e){}
document.getElementById('gName').addEventListener('input',renderScores);
function spawn(){
  if(!game.running) return;
  const free=[...holesEl.children].filter(h=>!h.querySelector('.critter').classList.contains('up'));
  if(free.length){
    const hole=free[Math.floor(Math.random()*free.length)]; const c=hole.querySelector('.critter');
    const r=Math.random(); const kind= r<.12?'gold': r<.30?'deer':'boar';
    c.dataset.kind=kind; c.innerHTML=G[kind.toUpperCase()]; c.classList.remove('hit'); c.classList.add('up');
    const stay= kind==='gold'? 650 : 700 + Math.random()*500 + (game.time>20?300:0);
    c._hide=setTimeout(()=>{ c.classList.remove('up'); },stay);
  }
  const elapsed=30-game.time; const gap=Math.max(380, 900-elapsed*17);
  game.spawner=setTimeout(spawn, gap*(0.7+Math.random()*.6));
}
function hit(e){
  if(!game.running) return;
  const hole=e.target.closest('.hole'); if(!hole) return;
  const c=hole.querySelector('.critter'); if(!c.classList.contains('up')) return;
  clearTimeout(c._hide); c.classList.remove('up'); c.classList.add('hit');
  const k=c.dataset.kind; let d=k==='gold'?5:k==='deer'?-3:1;
  game.score=Math.max(0,game.score+d); document.getElementById('gScore').textContent=game.score;
  const pop=document.createElement('div'); pop.className='pop'+(d<0?' bad':k==='gold'?' gold':''); pop.textContent=(d>0?'+':'')+d; hole.appendChild(pop); setTimeout(()=>pop.remove(),700);
  if(d<0){ beep(140,.25,'sawtooth',.08); const f=document.querySelector('.forest'); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); }
  else if(k==='gold'){ beep(880,.12); setTimeout(()=>beep(1320,.18),90); }
  else beep(520,.08);
  if(navigator.vibrate) navigator.vibrate(d<0?[60,40,60]:20);
}
holesEl.addEventListener('pointerdown',hit);
function startGame(){
  const who=document.getElementById('gName').value.trim(); if(!who) { document.getElementById('gName').focus(); return; }
  try{ localStorage.setItem('fw-name',who); }catch(e){}
  renderScores();
  game.running=true; game.score=0; game.time=30;
  document.getElementById('gScore').textContent='0'; document.getElementById('gTime').textContent='30';
  document.getElementById('gOverlay').hidden=true;
  [...holesEl.querySelectorAll('.critter')].forEach(c=>{ c.classList.remove('up','hit'); clearTimeout(c._hide); });
  beep(660,.1); setTimeout(()=>beep(880,.15),120);
  clearTimeout(game.spawner); setTimeout(spawn,500);
  clearInterval(game.timer);
  game.timer=setInterval(()=>{
    game.time--; document.getElementById('gTime').textContent=game.time;
    if(game.time<=5 && game.time>0) beep(440,.06,'sine',.04);
    if(game.time<=0) endGame();
  },1000);
}
function endGame(){
  game.running=false; clearInterval(game.timer); clearTimeout(game.spawner);
  [...holesEl.querySelectorAll('.critter')].forEach(c=>{ clearTimeout(c._hide); c.classList.remove('up'); });
  beep(523,.15); setTimeout(()=>beep(659,.15),150); setTimeout(()=>beep(784,.3),300);
  const who=document.getElementById('gName').value.trim();
  const newBest=game.score>game.best;
  state.scores=state.scores||[]; state.scores.push({who, score:game.score, at:Date.now()});
  state.scores=state.scores.sort((a,b)=>b.score-a.score||a.at-b.at).slice(0,50);
  changed(); renderScores();
  document.getElementById('gTitle').textContent=t('g_over');
  document.getElementById('gSub').textContent=t('g_over_sub').replace('{s}',game.score)+(newBest&&game.score>0?' · '+t('g_newbest'):'');
  document.getElementById('gForm').querySelector('button').textContent=t('g_again');
  document.getElementById('gOverlay').hidden=false;
}
document.getElementById('gForm').addEventListener('submit',e=>{ e.preventDefault(); startGame(); });
document.addEventListener('visibilitychange',()=>{ if(document.hidden && game.running) endGame(); });

/* ========= GO ========= */
applyLang();
init();
