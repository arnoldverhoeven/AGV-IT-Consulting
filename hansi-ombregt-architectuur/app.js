document.documentElement.classList.add('js');

document.querySelectorAll('img[data-copy]').forEach(i=>{ const src=document.querySelector(i.dataset.copy); if(src) i.src=src.src; });

/* hero slider */
(function(){
  const slides=[...document.querySelectorAll('#slides .slide')], n=slides.length;
  const capT=document.getElementById('capT'), capS=document.getElementById('capS'), capBtn=document.getElementById('capBtn'); let prog=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DUR=6000; let i=0, t0=performance.now(), auto=!reduce, raf, paused=false;
  requestAnimationFrame(()=>requestAnimationFrame(()=>slides[0].classList.add('is-active')));
  function go(k,manual){
    const prev=slides[i]; i=(k+n)%n; const nx=slides[i];
    prev.classList.remove('is-active'); prev.classList.add('is-leaving'); setTimeout(()=>prev.classList.remove('is-leaving'),1200);
    nx.classList.add('is-active');
    capT.textContent=nx.dataset.t; capS.textContent=nx.dataset.s; capBtn.dataset.p=nx.dataset.p;
    t0=performance.now(); if(manual){ auto=false; }
  }
  function tick(now){ if(auto&&!paused){ prog=Math.min(1,(now-t0)/DUR); if(prog>=1) go(i+1,false);} raf=requestAnimationFrame(tick); }
  if(auto) raf=requestAnimationFrame(tick);
  document.getElementById('next').addEventListener('click',()=>go(i+1,true));
  document.getElementById('prev').addEventListener('click',()=>go(i-1,true));
  capBtn.addEventListener('click',()=>openP(capBtn.dataset.p));
  const hero=document.querySelector('.hero');
  hero.addEventListener('mouseenter',()=>{paused=true;}); hero.addEventListener('mouseleave',()=>{paused=false; t0=performance.now()-prog*DUR;});
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) t0=performance.now(); });
  addEventListener('keydown',e=>{ if(document.getElementById('dlg').open) return; if(window.scrollY>innerHeight*.8) return; if(e.key==='ArrowRight') go(i+1,true); if(e.key==='ArrowLeft') go(i-1,true); });
  let sx=null; hero.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  hero.addEventListener('touchend',e=>{ if(sx===null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) go(dx<0?i+1:i-1,true); sx=null; });
})();
const P = {
  rio:{t:'woning RIO',l:'Schoten',ty:'woning',st:'nieuwbouw',j:'2023',o:'380 m²',s:'opgeleverd'},
  mhd:{t:'woning MHD',l:'Brugge',ty:'woning',st:'nieuwbouw',j:'2018',o:'400 m²',s:'gerealiseerd'},
  bbl:{t:'woning BBL',l:'Schoten',ty:'woning',st:'nieuwbouw',j:'2019',o:'280 m²',s:'gerealiseerd'},
  khl:{t:'woning KHL',l:'Schoten',ty:'woning',st:'nieuwbouw',j:'2015',o:'400 m²',s:'gerealiseerd'},
  ptl:{t:'woning PTL',l:'Schilde',ty:'woning',st:'renovatie',j:'2022',o:'75 m²',s:'opgeleverd'},
  ls36:{t:'loft LS36',l:'Mechelen',ty:'woning',st:'renovatie',j:'2018',o:'350 m²',s:'gerealiseerd'},
  znd:{t:'woning ZND',l:'Retie',ty:'woning',st:'nieuwbouw',j:'2013',o:'280 m²',s:'gerealiseerd'},
  pkl:{t:'woning PKL',l:'Schilde',ty:'woning',st:'nieuwbouw',j:'2014',o:'240 m²',s:'gerealiseerd'},
  lhd:{t:'paviljoen LHD',l:'Schoten',ty:'tuinpaviljoen',st:'nieuwbouw',j:'2023',o:'75 m²',s:'opgeleverd'},
  brz:{t:'woning BRZ',l:'Antwerpen',ty:'woning',st:'nieuwbouw',j:'2012',o:'220 m²',s:'gerealiseerd'},
  knt:{t:'woning KNT',l:'Schoten',ty:'woning',st:'nieuwbouw',j:'2013',o:'225 m²',s:'gerealiseerd'},
  dkj:{t:'appartementen DKJ',l:'Lier',ty:'appartementen',st:'nieuwbouw',j:'2012',o:'650 m²',s:'gerealiseerd'}
};
const imgFor = k => { const c=document.querySelector('.card[data-p="'+k+'"] img'); return c?c.src:''; };
function openP(k){
  const p=P[k]; if(!p) return;
  document.getElementById('dImg').src=imgFor(k);
  document.getElementById('dImg').alt=p.t+', '+p.l;
  document.getElementById('dEyebrow').textContent=p.st+' · '+p.l;
  document.getElementById('dTitle').textContent=p.t;
  document.getElementById('dMeta').innerHTML=
    '<div><small>Locatie</small>'+p.l+'</div><div><small>Jaar</small>'+p.j+'</div>'+
    '<div><small>Type</small>'+p.ty+' · '+p.st+'</div><div><small>Oppervlakte</small>'+p.o+'</div>'+
    '<div><small>Status</small>'+p.s+'</div>';
  document.getElementById('dlg').showModal();
}
document.querySelectorAll('.card, .card-open').forEach(el=>el.addEventListener('click',()=>openP(el.dataset.p)));
document.getElementById('dlg').addEventListener('click',e=>{ if(e.target.id==='dlg') e.target.close(); });

/* featured photo switchers */
document.querySelectorAll('.feat .img').forEach(box=>{
  const imgs=[...box.querySelectorAll('.fimgs img')]; let k=0;
  const show=j=>{ imgs[k].classList.remove('on'); k=(j+imgs.length)%imgs.length; imgs[k].classList.add('on'); };
  box.querySelector('.fprev').addEventListener('click',()=>show(k-1));
  box.querySelector('.fnext').addEventListener('click',()=>show(k+1));
  let sx=null; box.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});
  box.addEventListener('touchend',e=>{ if(sx===null) return; const dx=e.changedTouches[0].clientX-sx; if(Math.abs(dx)>50) show(dx<0?k+1:k-1); sx=null; });
});

/* filters */
document.querySelectorAll('.filters button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.filters button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
  const f=b.dataset.f;
  document.querySelectorAll('#grid .card').forEach(c=>c.classList.toggle('hide', f!=='all' && !c.dataset.tags.split(' ').includes(f)));
}));

/* header + progress + active nav */
const header=document.getElementById('header'), prog=document.getElementById('progress');
const secs=[...document.querySelectorAll('main section[id]')];
function onScroll(){
  const y=window.scrollY; header.classList.toggle('scrolled', y>40);
  const h=document.documentElement.scrollHeight-innerHeight; prog.style.width=(h>0?y/h*100:0)+'%';
  let cur=''; secs.forEach(s=>{ if(y>=s.offsetTop-200) cur=s.id; });
  const map={uitgelicht:'projecten',instagram:''};
  const id=map[cur]!==undefined?map[cur]:cur;
  document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active', a.getAttribute('href')==='#'+id));
}
addEventListener('scroll',onScroll,{passive:true}); onScroll();

/* mobile menu */
const ov=document.getElementById('overlay'), mb=document.getElementById('menuBtn');
function setMenu(o){ ov.classList.toggle('open',o); ov.setAttribute('aria-hidden',!o); mb.setAttribute('aria-expanded',o); document.body.style.overflow=o?'hidden':''; }
mb.addEventListener('click',()=>setMenu(true));
document.getElementById('menuClose').addEventListener('click',()=>setMenu(false));
ov.querySelectorAll('[data-close]').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
addEventListener('keydown',e=>{ if(e.key==='Escape') setMenu(false); });

/* publicaties */
document.getElementById('showPubs').addEventListener('click',function(){ const p=document.getElementById('pubs'); p.classList.toggle('all'); this.textContent=p.classList.contains('all')?'Toon minder':'Toon alle 18 publicaties'; });

/* reveal */
const io='IntersectionObserver' in window ? new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }),{rootMargin:'0px 0px -8% 0px',threshold:.05}) : null;
document.querySelectorAll('.rv').forEach(el=>io?io.observe(el):el.classList.add('in'));

/* cookies */
const ck=document.getElementById('cookie');
function store(k,v){ try{ localStorage.setItem(k,v);}catch(e){} }
function read(k){ try{ return localStorage.getItem(k);}catch(e){ return null; } }
function loadMap(){}
function consent(ok){ store('ho-consent', ok?'all':'necessary'); ck.classList.remove('show'); if(ok) loadMap(); }
function showCookie(){ ck.classList.add('show'); }
const c=read('ho-consent');
if(c==='all') loadMap(); else if(!c){ let shown=false; const trig=()=>{ if(!shown){shown=true; showCookie(); removeEventListener('scroll',trig);} }; addEventListener('scroll',trig,{passive:true}); setTimeout(trig,6000); }

document.getElementById('ckYes').addEventListener('click',()=>consent(true));
document.getElementById('ckNo').addEventListener('click',()=>consent(false));
document.getElementById('showCk').addEventListener('click',showCookie);
document.getElementById('dClose').addEventListener('click',()=>document.getElementById('dlg').close());
document.getElementById('cform').addEventListener('submit',function(e){ e.preventDefault(); this.querySelector('.row small').textContent='Bedankt — in de echte website komt uw bericht rechtstreeks in de mailbox van het bureau terecht.'; });
