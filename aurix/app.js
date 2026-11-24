(function(){
'use strict';
var LOGO_W='img/logo.png', KEY='aurix_pt_v4', DOW=['zo','ma','di','wo','do','vr','za'], DOWL=['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'], MON=['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec'];
var TYPES={pt:{name:'PT-sessie'},group:{name:'Groepsles'},scan:{name:'InBody-scan'},intro:{name:'Kennismaking'}};
var ST={pending:'Te bevestigen',confirmed:'Bevestigd',declined:'Geweigerd',cancelled:'Geannuleerd'};
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function pad(n){return (n<10?'0':'')+n}
function ymd(d){return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())}
function pd(s){var p=s.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
function addDays(d,n){var x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()+n);return x}
function today(){var n=new Date();return new Date(n.getFullYear(),n.getMonth(),n.getDate())}
function at(ds,t){var d=pd(ds),p=t.split(':');d.setHours(+p[0],+p[1],0,0);return d}
function mins(t){var p=t.split(':');return +p[0]*60+ +p[1]}
function hm(m){return pad(Math.floor(m/60))+':'+pad(m%60)}
function nice(ds){var d=pd(ds);return DOWL[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()]}
function short(ds){var d=pd(ds);return DOW[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()]}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function hrsTxt(h){return h%24===0&&h>72?(h/24)+' dagen':h+' uur'}
function sortB(a,b){return (a.date+a.time).localeCompare(b.date+b.time)}
function active(b){return b.status==='pending'||b.status==='confirmed'}
function uid(p){return p+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}

/* ---------- data ---------- */
function defaults(){
  var hours={};for(var i=0;i<7;i++){hours[i]=(i===0||i===6)?{on:true,ranges:[{from:'09:00',to:'13:00'}]}:{on:true,ranges:[{from:'18:00',to:'21:00'}]}}
  return {settings:{approval:true,minNoticeH:48,horizonDays:28,slotMin:60,cancelH:24,notify:'info@aurix.be',hours:hours,closed:[],blocked:[],groupMax:6,groupMin:4,groupPrice:15,ptPrice:80,scanMin:15,scanPrice:30},lessons:[],bookings:[],seeded:false};
}
var mem=null, S;
function load(){try{var r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}return mem}
function save(){mem=S;try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function person(n,k){return {first:n[0],last:n[1],email:(n[0]+'.'+n[1]).toLowerCase().replace(/ /g,'')+'@voorbeeld.be',tel:'+32 470 00 0'+pad(k)+' 0'+(k%10)}}
function seed(){
  var t=today(),now=new Date();
  /* group lessons: Tuesday 19:00 and Saturday 10:00, next 4 weeks */
  for(var i=0;i<=28;i++){var d=addDays(t,i),ds=ymd(d),w=d.getDay();
    if(w===2)S.lessons.push({id:'L'+ds,date:ds,time:'19:00',dur:60,title:'Groepstraining',status:'open'});
    if(w===6)S.lessons.push({id:'L'+ds,date:ds,time:'10:00',dur:60,title:'Bootcamp',status:'open'});
  }
  var gp=[['Eva','Mertens'],['Lucas','Goossens'],['Emma','Wouters'],['Noah','Jacobs'],['Lina','Vermeulen'],['Arthur','Hermans'],['Ella','Dubois'],['Louis','Aerts']];
  var up=S.lessons.filter(function(l){return at(l.date,l.time)>new Date(now.getTime()+S.settings.minNoticeH*36e5)});
  [[0,5],[1,2],[2,4],[3,1]].forEach(function(p,j){var l=up[p[0]];if(!l)return;for(var k=0;k<p[1];k++){var n=gp[(j*3+k)%gp.length],x=person(n,k+j);
    S.bookings.push({id:'g'+j+'_'+k,type:'group',lessonId:l.id,date:l.date,time:l.time,first:x.first,last:x.last,email:x.email,tel:x.tel,note:'',status:(k===p[1]-1&&j===1)?'pending':'confirmed',created:Date.now()-k*6e5})}});
  var names=[['Sofie','Peeters','pt'],['Thomas','Maes','pt'],['Lotte','Janssens','intro'],['Bram','Willems','pt'],['Nina','Claes','pt'],['Jonas','De Smet','intro']];
  var free=[];
  for(var i2=1;i2<=16&&free.length<40;i2++){var ds2=ymd(addDays(t,i2));freeStarts(ds2,'pt').forEach(function(tm){if(at(ds2,tm)>now)free.push([ds2,tm])})}
  [0,4,9,13,18,24].forEach(function(ix,k){var f=free[ix];if(!f)return;var n=names[k],x=person(n,k);
    S.bookings.push({id:'s'+k,type:n[2],date:f[0],time:f[1],first:x.first,last:x.last,email:x.email,tel:x.tel,note:k===1?'Herstart na knieblessure, graag rustig opbouwen.':'',status:(k===2||k===4)?'pending':'confirmed',created:Date.now()-k*36e5});
  });
  [[['Hanne','Smets'],3],[['Kobe','Lambrechts'],7]].forEach(function(p,k){for(var i3=p[1];i3<p[1]+6;i3++){var ds3=ymd(addDays(t,i3)),fs=freeStarts(ds3,'scan');if(fs.length){var x=person(p[0],k+6);S.bookings.push({id:'sc'+k,type:'scan',date:ds3,time:fs[0],first:x.first,last:x.last,email:x.email,tel:x.tel,note:k?'Eerste meting, wil vetpercentage opvolgen.':'',status:'confirmed',created:Date.now()});break}}});
  S.seeded=true;save();
}
/* availability: every booking has a duration, slots are free when nothing overlaps */
function typeDur(t){var s=S.settings;return t==='pt'?s.slotMin:t==='scan'?s.scanMin:t==='intro'?30:60}
function bDur(b){if(b.type==='group'){var l=lessonById(b.lessonId);return l?l.dur:60}return typeDur(b.type)}
function rawSlots(ds){return cands(ds,'pt')}
function cands(ds,type){
  var s=S.settings,h=s.hours[pd(ds).getDay()];if(!h||!h.on||s.closed.indexOf(ds)>-1)return [];
  var d=typeDur(type),step=type==='pt'?s.slotMin:type==='intro'?30:s.scanMin,out=[];
  h.ranges.forEach(function(r){var a=mins(r.from),b=mins(r.to);for(var m=a;m+d<=b;m+=step)out.push(hm(m))});
  return out.sort();
}
function lessonsOn(ds){return S.lessons.filter(function(l){return l.date===ds&&l.status!=='cancelled'})}
function lessonOverlap(ds,t,dur){var a=mins(t),b=a+(dur||S.settings.slotMin);for(var i=0,L=lessonsOn(ds);i<L.length;i++){var la=mins(L[i].time),lb=la+L[i].dur;if(a<lb&&la<b)return L[i]}return null}
function busy(ds,skip){var s=S.settings,out=[];
  S.bookings.forEach(function(b){if(b.id!==skip&&b.type!=='group'&&b.date===ds&&active(b)){var m=mins(b.time);out.push([m,m+bDur(b)])}});
  lessonsOn(ds).forEach(function(l){var m=mins(l.time);out.push([m,m+l.dur])});
  s.blocked.forEach(function(k){if(k.indexOf(ds+'T')===0){var m=mins(k.slice(ds.length+1));out.push([m,m+s.slotMin])}});
  return out}
function overlaps(B,a,b){return B.some(function(x){return a<x[1]&&x[0]<b})}
function freeStarts(ds,type,skip){var B=busy(ds,skip),d=typeDur(type);return cands(ds,type).filter(function(t){var a=mins(t);return !overlaps(B,a,a+d)})}
function bookingsIn(ds,a,b){return S.bookings.filter(function(x){if(x.type==='group'||x.date!==ds||!active(x))return false;var m=mins(x.time);return m>=a&&m<b}).sort(sortB)}
function isBlocked(ds,t){return S.settings.blocked.indexOf(ds+'T'+t)>-1}
function limit(){return new Date(Date.now()+S.settings.minNoticeH*36e5)}
function inHorizon(ds){return pd(ds)<=addDays(today(),S.settings.horizonDays)}
function publicFree(ds,type){if(!inHorizon(ds))return [];var lim=limit();return freeStarts(ds,type||'pt').filter(function(t){return at(ds,t)>=lim})}
function nextFree(n){var out=[],d=today();for(var i=0;i<=S.settings.horizonDays&&out.length<n;i++){var ds=ymd(addDays(d,i));publicFree(ds,'pt').forEach(function(t){if(out.length<n)out.push([ds,t])})}return out}
/* group lessons */
function lessonById(id){for(var i=0;i<S.lessons.length;i++)if(S.lessons[i].id===id)return S.lessons[i]}
function lessonBookings(l){return S.bookings.filter(function(b){return b.type==='group'&&b.lessonId===l.id&&active(b)})}
function lessonCount(l){return lessonBookings(l).length}
function publicLessons(){var lim=limit();return S.lessons.filter(function(l){return l.status!=='cancelled'&&at(l.date,l.time)>=lim&&inHorizon(l.date)}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)})}
function spotsLine(l){var s=S.settings,c=lessonCount(l),free=s.groupMax-c;
  if(free<=0)return {cls:'full',txt:'Volzet'};
  if(c>=s.groupMin)return {cls:'go',txt:'Gaat door | nog '+free+' '+(free===1?'plaats':'plaatsen')};
  var need=s.groupMin-c;return {cls:'need',txt:'Nog '+need+' '+(need===1?'deelnemer':'deelnemers')+' nodig'}}
function spotsBar(l){var s=S.settings,c=lessonCount(l),h='<span class="dots" aria-label="'+c+' van '+s.groupMax+' plaatsen bezet">';for(var i=0;i<s.groupMax;i++)h+='<i class="'+(i<c?'on':'')+(i===s.groupMin-1?' min':'')+'"></i>';return h+'</span>'}
function hoursSummary(){
  var h=S.settings.hours,groups=[],order=[1,2,3,4,5,6,0];
  order.forEach(function(i){var k=h[i].on&&h[i].ranges.length?h[i].ranges.map(function(r){return r.from+' tot '+r.to}).join(' en '):'gesloten';var g=groups[groups.length-1];if(g&&g.k===k)g.to=i;else groups.push({k:k,from:i,to:i})});
  return groups.map(function(g){return [(g.from===g.to?DOWL[g.from]:DOWL[g.from]+' tot '+DOWL[g.to].toLowerCase()),g.k]});
}
function toast(msg){var o=$('.toast');if(o)o.remove();var t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove()},3200)}

/* ---------- public site ---------- */
var P={type:'pt',date:null,time:null,lessonId:null,page:0,done:null,form:{}};
function renderStatic(){
  var s=S.settings;
  $('#facts').innerHTML=['Eén op één','InBody-scan','Groepslessen tot '+s.groupMax+' personen','Antwerpsebaan 143, Berendrecht'].map(function(x){return '<li>'+x+'</li>'}).join('');
  $('#bandN').textContent=hrsTxt(s.minNoticeH);$('#bandNs').textContent='Online boeken tot '+hrsTxt(s.minNoticeH)+' vooraf';
  $('#bookIntro').textContent='Boeken kan tot '+hrsTxt(s.minNoticeH)+' voor de start, en tot '+Math.round(s.horizonDays/7)+' weken vooruit.';
  $('#faqNotice').textContent='Je kan online boeken tot '+hrsTxt(s.minNoticeH)+' voor de start van de sessie. Zo kan elke training goed voorbereid worden. Momenten die dichterbij liggen, verschijnen niet meer in de agenda.';
  $('#faqApproval').textContent=s.approval?'Na je aanvraag krijg je meteen een ontvangstbevestiging per e-mail. Je coach bekijkt elke aanvraag persoonlijk en bevestigt ze zo snel mogelijk. Pas dan is je plaats definitief.':'Ja. Zodra je boekt, is je plaats gereserveerd en krijg je een bevestiging per e-mail.';
  $('#faqHours').textContent=hoursSummary().filter(function(r){return r[1]!=='gesloten'}).map(function(r){return r[0]+' van '+r[1]}).join('. ')+'. Een PT-sessie duurt '+s.slotMin+' minuten.';
  $('#faqCancel').textContent='Kosteloos verplaatsen of annuleren kan tot '+hrsTxt(s.cancelH)+' voor je sessie, via de link in je bevestigingsmail.';
  $('#faqGroup').textContent='Een groepsles telt maximaal '+s.groupMax+' deelnemers en gaat door vanaf '+s.groupMin+' inschrijvingen. Zijn er '+hrsTxt(s.minNoticeH)+' voor de start minder dan '+s.groupMin+' deelnemers, dan vervalt de les en krijg je meteen bericht. Je betaalt dan niets.';
  $('#hoursTable').innerHTML=hoursSummary().map(function(r){return '<tr><td>'+r[0]+'</td><td>'+r[1]+'</td></tr>'}).join('');
  $$('[data-dur]').forEach(function(e){e.textContent=s.slotMin});
  $$('[data-gmax]').forEach(function(e){e.textContent=s.groupMax});
  $$('[data-gmin]').forEach(function(e){e.textContent=s.groupMin});
  $$('[data-gprice]').forEach(function(e){e.textContent=s.groupPrice});
  $$('[data-sprice]').forEach(function(e){e.textContent=s.scanPrice});
  $$('[data-pprice]').forEach(function(e){e.textContent=s.ptPrice});
  var nf=nextFree(4);
  $('#nextList').innerHTML=nf.length?nf.map(function(f){var d=pd(f[0]);return '<button type="button" data-d="'+f[0]+'" data-t="'+f[1]+'"><span>'+DOWL[d.getDay()]+' '+d.getDate()+' '+MON[d.getMonth()]+'</span><b>'+f[1]+'</b></button>'}).join(''):'<div class="empty">Momenteel volzet. Stuur gerust een bericht.</div>';
  $('#nextNote').textContent='Rechtstreeks uit de agenda. Klik een moment om te boeken.';
  var L=publicLessons().slice(0,4);
  $('#groupList').innerHTML=L.length?L.map(function(l){var sp=spotsLine(l);return '<div class="gl"><div class="gl-when"><b>'+l.time+'</b><span>'+short(l.date)+'</span></div><div class="gl-what"><b>'+esc(l.title)+'</b>'+spotsBar(l)+'<span class="sp-'+sp.cls+'">'+sp.txt+'</span></div><button type="button" class="btn btn-sm '+(sp.cls==='full'?'btn-line" disabled':'btn-gold"')+' data-lesson="'+l.id+'">'+(sp.cls==='full'?'Volzet':'Inschrijven')+'</button></div>'}).join(''):'<div class="empty">Momenteel geen groepslessen gepland.</div>';
}
function dayList(){var out=[],d=today();for(var i=0;i<=S.settings.horizonDays;i++)out.push(ymd(addDays(d,i)));return out}
function typeSub(k){var s=S.settings;return k==='pt'?s.slotMin+' min, € '+s.ptPrice:k==='group'?'Max. '+s.groupMax+' pers., € '+s.groupPrice:k==='scan'?s.scanMin+' min, € '+s.scanPrice:'Gratis, incl. InBody-nulmeting'}
function renderBook(){
  var main=$('#bookMain'),sum=$('#bookSum'),s=S.settings;
  if(P.done){
    var b=P.done,w=b.status==='pending',g=b.type==='group',l=g&&lessonById(b.lessonId),extra='';
    if(g){var c=lessonCount(l);extra='<p>'+(c>=s.groupMin?'Goed nieuws: deze les gaat door ('+c+' van '+s.groupMax+' plaatsen bezet).':'Nu '+c+' van '+s.groupMax+' plaatsen bezet. De les gaat door vanaf '+s.groupMin+' deelnemers; je hoort uiterlijk '+hrsTxt(s.minNoticeH)+' vooraf of ze doorgaat.')+'</p>'}
    main.innerHTML='<div class="done'+(w?' wait':'')+'"><div class="big">'+(w?'…':'✓')+'</div><h3>'+(w?'Aanvraag ontvangen, '+esc(b.first):(g?'Je bent ingeschreven, ':'Je afspraak is geboekt, ')+esc(b.first))+'</h3>'+
      '<div class="recap"><span>'+(g?esc(l.title)+' (groepsles)':TYPES[b.type].name)+'</span><span>'+nice(b.date)+' om '+b.time+'</span></div>'+extra+
      '<p>'+(w?'Je coach bekijkt je aanvraag en bevestigt ze zo snel mogelijk. Je krijgt bericht op '+esc(b.email)+'.':'Een bevestiging is onderweg naar '+esc(b.email)+'.')+'</p>'+
      '<div class="cta-row" style="justify-content:center"><button class="btn btn-line" id="again">Nog iets boeken</button></div>'+
      '<div class="demo-note"><b>Demo:</b> deze boeking staat nu in de beheermodule'+(w?' met status "Te bevestigen"':'')+'. Open ze via de knop rechtsonder. In de live versie vertrekken de e-mails automatisch.</div></div>';
    sum.style.display='none';main.style.gridColumn='1/-1';return;
  }
  sum.style.display='';main.style.gridColumn='';
  var h='<p class="step-t">Wat wil je boeken?</p><div class="types">'+Object.keys(TYPES).map(function(k){return '<button type="button" class="pick'+(P.type===k?' on':'')+'" data-type="'+k+'" aria-pressed="'+(P.type===k)+'"><b>'+TYPES[k].name+'</b><span>'+typeSub(k)+'</span></button>'}).join('')+'</div>';
  var ready=false;
  if(P.type==='group'){
    var L=publicLessons();if(P.lessonId&&!L.some(function(l){return l.id===P.lessonId}))P.lessonId=null;
    h+='<p class="step-t">Kies een groepsles</p><p class="hint">Max. '+s.groupMax+' personen. De les gaat door vanaf '+s.groupMin+' deelnemers.</p>';
    h+=L.length?'<div class="lessons">'+L.map(function(l){var sp=spotsLine(l),full=sp.cls==='full';return '<button type="button" class="lesson'+(P.lessonId===l.id?' on':'')+'" data-lesson="'+l.id+'"'+(full?' disabled':'')+' aria-pressed="'+(P.lessonId===l.id)+'"><span class="ls-top"><b>'+short(l.date)+' | '+l.time+'</b><span>'+esc(l.title)+'</span></span>'+spotsBar(l)+'<span class="sp-'+sp.cls+'">'+sp.txt+'</span></button>'}).join('')+'</div>':'<div class="empty">Momenteel geen groepslessen gepland.</div>';
    ready=!!P.lessonId;
  }else{
    var days=dayList(),pages=Math.ceil(days.length/7);if(P.page>=pages)P.page=pages-1;
    var slice=days.slice(P.page*7,P.page*7+7);
    if(P.date&&publicFree(P.date,P.type).indexOf(P.time)<0)P.time=null;
    var first=pd(slice[0]),last=pd(slice[slice.length-1]);
    h+='<p class="step-t">Kies een dag</p><div class="days-nav"><button type="button" class="icon-btn" id="pgPrev" aria-label="Vorige week"'+(P.page===0?' disabled':'')+'>‹</button><span>'+first.getDate()+' '+MON[first.getMonth()]+' tot '+last.getDate()+' '+MON[last.getMonth()]+'</span><button type="button" class="icon-btn" id="pgNext" aria-label="Volgende week"'+(P.page>=pages-1?' disabled':'')+'>›</button></div><div class="days">';
    slice.forEach(function(ds){var d=pd(ds),n=publicFree(ds,P.type).length,open=cands(ds,P.type);
      var lab=n?n+' vrij':(open.length?(at(ds,open[open.length-1])<limit()?'voorbij':'volzet'):'dicht');
      h+='<button type="button" class="day'+(P.date===ds?' on':'')+'" data-day="'+ds+'"'+(n?'':' disabled')+' aria-label="'+nice(ds)+', '+lab+'"><div class="dw">'+DOW[d.getDay()]+'</div><div class="dn">'+d.getDate()+'</div><div class="df">'+lab+'</div></button>'});
    h+='</div><p class="step-t">Kies een uur</p>';
    if(!P.date)h+='<div class="empty">Kies eerst een dag hierboven.</div>';
    else h+='<div class="slots">'+publicFree(P.date,P.type).map(function(t){return '<button type="button" class="slot'+(P.time===t?' on':'')+'" data-slot="'+t+'" aria-pressed="'+(P.time===t)+'">'+t+'</button>'}).join('')+'</div>';
    ready=!!(P.date&&P.time);
  }
  if(ready){var f=P.form;
    h+='<p class="step-t" style="margin-top:22px">Je gegevens</p><form class="form" id="bookForm" novalidate>'+
    fld('first','Voornaam','text','given-name',f)+fld('last','Naam','text','family-name',f)+fld('email','E-mail','email','email',f)+fld('tel','Telefoon','tel','tel',f)+
    '<label class="f full">Opmerking (optioneel)<textarea name="note" rows="2" placeholder="Blessures, doel, iets wat je coach moet weten">'+esc(f.note||'')+'</textarea></label>'+
    '<label class="chk"><input type="checkbox" name="ok"><span>Ik ga akkoord dat Aurix mijn gegevens gebruikt om deze boeking te verwerken.</span></label>'+
    '<div class="full"><button class="btn btn-gold" type="submit">'+(P.type==='group'?(s.approval?'Inschrijving aanvragen':'Inschrijven'):(s.approval?'Boeking aanvragen':'Boeking bevestigen'))+'</button> <span class="e" id="formErr" style="font-weight:600;font-size:.86rem;margin-left:8px"></span></div></form>';
  }
  main.innerHTML=h;
  var dd,tt,price,rule;
  if(P.type==='group'){var l=P.lessonId&&lessonById(P.lessonId);dd=l?nice(l.date):'Nog te kiezen';tt=l?l.time+' ('+l.dur+' min)':'Nog te kiezen';price='€ '+s.groupPrice+' per les';rule='Gaat door vanaf '+s.groupMin+' deelnemers.'+(l?' Nu '+lessonCount(l)+' van '+s.groupMax+'.':'')}
  else{dd=P.date?nice(P.date):'Nog te kiezen';tt=P.time?P.time+' ('+typeDur(P.type)+' min)':'Nog te kiezen';price=P.type==='intro'?'Gratis':'€ '+(P.type==='scan'?s.scanPrice:s.ptPrice)+', te betalen ter plaatse';rule=P.type==='intro'?'Inclusief gratis InBody-nulmeting.':P.type==='scan'?'Resultaten meteen besproken met Kevin.':''}
  sum.innerHTML='<h3>Jouw boeking</h3><dl><div><dt>Type</dt><dd>'+TYPES[P.type].name+'</dd></div><div><dt>Dag</dt><dd>'+dd+'</dd></div><div><dt>Uur</dt><dd>'+tt+'</dd></div><div><dt>Prijs</dt><dd>'+price+'</dd></div></dl><div class="rule">'+(rule?rule+' ':'')+(s.approval?'Je coach bevestigt elke aanvraag persoonlijk.':'Je boeking is meteen definitief.')+'</div>';
}
function fld(n,l,t,ac,f){return '<label class="f" data-f="'+n+'">'+l+'<input name="'+n+'" type="'+t+'" autocomplete="'+ac+'" value="'+esc(f[n]||'')+'"><span class="e"></span></label>'}
function keepForm(){var fm=$('#bookForm');if(!fm)return;['first','last','email','tel','note'].forEach(function(n){P.form[n]=fm.elements[n].value})}
function submitBook(fm){
  keepForm();var f=P.form,ok=true,rules={first:f.first.trim().length>1,last:f.last.trim().length>1,email:/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim()),tel:f.tel.replace(/\D/g,'').length>=9};
  var msg={first:'Vul je voornaam in',last:'Vul je naam in',email:'Controleer je e-mailadres',tel:'Vul een geldig nummer in'};
  Object.keys(rules).forEach(function(k){var el=$('[data-f="'+k+'"]',fm);el.classList.toggle('bad',!rules[k]);$('.e',el).textContent=rules[k]?'':msg[k];if(!rules[k])ok=false});
  var err=$('#formErr');err.textContent='';
  if(!ok){var b=$('.bad input',fm);if(b)b.focus();return}
  if(!fm.elements.ok.checked){err.textContent='Vink het akkoord aan om verder te gaan.';return}
  var bk={id:uid('b'),type:P.type,first:f.first.trim(),last:f.last.trim(),email:f.email.trim(),tel:f.tel.trim(),note:(f.note||'').trim(),status:S.settings.approval?'pending':'confirmed',created:Date.now()};
  if(P.type==='group'){var l=lessonById(P.lessonId);
    if(!l||lessonCount(l)>=S.settings.groupMax){toast('Deze les is net volzet. Kies een andere les.');P.lessonId=null;renderBook();return}
    if(lessonBookings(l).some(function(x){return x.email.toLowerCase()===bk.email.toLowerCase()})){toast('Je bent al ingeschreven voor deze les.');return}
    bk.lessonId=l.id;bk.date=l.date;bk.time=l.time;
  }else{
    if(publicFree(P.date,P.type).indexOf(P.time)<0){toast('Dit moment is net ingenomen. Kies een ander uur.');P.time=null;renderBook();return}
    bk.date=P.date;bk.time=P.time;
  }
  S.bookings.push(bk);save();P.done=bk;P.date=P.time=P.lessonId=null;P.form={};renderAll();
  $('#boeken').scrollIntoView();
}
function renderAll(){renderStatic();renderBook();if(A.open)renderAdmin()}

document.addEventListener('click',function(e){
  if(e.target.closest('#admin,#modalHost'))return;
  var t=e.target.closest('[data-type]');
  if(t){var nt=t.getAttribute('data-type');if(nt!==P.type){P.date=P.time=P.lessonId=null}P.type=nt;P.done=null;keepForm();renderBook();return}
  var ls=e.target.closest('[data-lesson]');
  if(ls){keepForm();P.done=null;P.type='group';P.lessonId=ls.getAttribute('data-lesson');renderBook();if(!ls.closest('#bookMain'))$('#boeken').scrollIntoView();else{var fi=$('#bookForm input');if(fi&&!P.form.first)fi.focus({preventScroll:true})}return}
  var n=e.target.closest('#nextList button');
  if(n){P.done=null;P.type='pt';P.date=n.getAttribute('data-d');P.time=n.getAttribute('data-t');P.page=Math.floor(dayList().indexOf(P.date)/7);renderBook();$('#boeken').scrollIntoView();return}
  var d=e.target.closest('[data-day]');if(d){keepForm();P.date=d.getAttribute('data-day');P.time=null;renderBook();return}
  var sl=e.target.closest('[data-slot]');if(sl){keepForm();P.time=sl.getAttribute('data-slot');renderBook();var fi2=$('#bookForm input');if(fi2&&!P.form.first)fi2.focus({preventScroll:true});return}
  if(e.target.id==='pgPrev'){keepForm();P.page--;renderBook();return}
  if(e.target.id==='pgNext'){keepForm();P.page++;renderBook();return}
  if(e.target.id==='again'){P.done=null;renderBook();return}
});
document.addEventListener('submit',function(e){
  if(e.target.id==='bookForm'){e.preventDefault();submitBook(e.target)}
  if(e.target.id==='contactForm'){e.preventDefault();var fm=e.target;if(!fm.first.value.trim()||!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fm.email.value.trim())||!fm.msg.value.trim()){toast('Vul je voornaam, e-mail en vraag in.');return}fm.reset();toast('Bedankt! Je bericht is verstuurd (demo).')}
});

/* menu: simple dropdown */
var mb=$('#menuBtn'),ov=$('#menuOv');
function menuSet(open){ov.hidden=!open;mb.setAttribute('aria-expanded',open);mb.classList.toggle('open',open);$('.mb-t',mb).textContent=open?'Sluiten':'Menu';if(open){var a=$('a',ov);if(a)a.focus({preventScroll:true})}}
mb.addEventListener('click',function(){menuSet(ov.hidden)});
ov.addEventListener('click',function(e){if(e.target===ov||e.target.closest('a'))menuSet(false)});
$$('.photo img').forEach(function(im){function gone(){im.remove()}im.addEventListener('error',gone);if(im.complete&&!im.naturalWidth)gone()});
$('#yr').textContent=new Date().getFullYear();
var ck=$('#cookie'),fab=$('#adminFab');
function cookieGet(){try{return localStorage.getItem('aurix_cookie')}catch(e){return null}}
function cookieShow(v){ck.hidden=!v;fab.style.display=v?'none':''}
ck.addEventListener('click',function(e){var b=e.target.closest('[data-c]');if(!b)return;try{localStorage.setItem('aurix_cookie',b.getAttribute('data-c'))}catch(x){}cookieShow(false)});
$('#cookieOpen').addEventListener('click',function(e){e.preventDefault();cookieShow(true)});

/* ---------- admin ---------- */
var A={open:false,auth:false,tab:'bookings',filter:'upcoming',edit:null,week:0};
var host=$('#admin');
function openAdmin(){menuSet(false);A.open=true;host.classList.add('open');document.body.style.overflow='hidden';renderAdmin()}
function closeAdmin(){A.open=false;host.classList.remove('open');document.body.style.overflow='';if(location.hash==='#beheer')history.replaceState(null,'',location.pathname+location.search);renderAll()}
fab.addEventListener('click',openAdmin);
$('#adminLink').addEventListener('click',function(e){e.preventDefault();openAdmin()});
function pendingCount(){return S.bookings.filter(function(b){return b.status==='pending'}).length}
function renderAdmin(){
  if(!A.auth){host.innerHTML='<div class="a-login"><img src="'+LOGO_W+'" alt="Aurix" style="height:44px;margin-bottom:16px"><h2>Beheer</h2><p class="hint">Log in om boekingen en instellingen te beheren.</p><form id="aLogin" class="form" style="grid-template-columns:1fr"><label class="f">E-mail<input type="email" value="kevin@aurix.be" autocomplete="username"></label><label class="f">Wachtwoord<input type="password" value="demo-aurix" autocomplete="current-password"></label><button class="btn btn-navy" type="submit">Inloggen</button><button class="btn btn-line" type="button" data-a="close">Terug naar de website</button></form><div class="demo-note"><b>Demo:</b> de gegevens zijn vooraf ingevuld. In de live versie is dit een beveiligde login, enkel voor Kevin.</div></div>';return}
  var pc=pendingCount();
  var h='<div class="a-top"><div class="in"><img src="'+LOGO_W+'" alt="Aurix"><span class="who">Beheer | Kevin</span><div class="a-tabs">'+
    [['bookings','Boekingen'],['lessons','Groepslessen'],['agenda','Agenda'],['settings','Instellingen']].map(function(t){return '<button type="button" data-tab="'+t[0]+'" class="'+(A.tab===t[0]?'on':'')+'">'+t[1]+(t[0]==='bookings'&&pc?'<span class="cnt">'+pc+'</span>':'')+'</button>'}).join('')+
    '<button type="button" data-a="close">Naar de website ›</button></div></div></div><div class="a-main">';
  h+=A.tab==='bookings'?vBookings():A.tab==='lessons'?vLessons():A.tab==='agenda'?vAgenda():vSettings();
  host.innerHTML=h+'</div>';
}
function bLabel(b){if(b.type==='group'){var l=lessonById(b.lessonId);return 'Groepsles'+(l?': '+esc(l.title)+' ('+lessonCount(l)+'/'+S.settings.groupMax+')':'')}return TYPES[b.type].name}
function vBookings(){
  var now=new Date(),t0=ymd(today()),wk=ymd(addDays(today(),7));
  var up=S.bookings.filter(function(b){return active(b)&&at(b.date,b.time)>=now});
  var free7=0;for(var i=0;i<7;i++)free7+=publicFree(ymd(addDays(today(),i))).length;
  var gl=S.lessons.filter(function(l){return l.status!=='cancelled'&&at(l.date,l.time)>=now&&l.date<wk}).length;
  var h='<div class="stats"><div class="stat'+(pendingCount()?' hot':'')+'"><b>'+pendingCount()+'</b><span>Te bevestigen</span></div><div class="stat"><b>'+up.filter(function(b){return b.date<wk&&b.type!=='group'}).length+'</b><span>PT-sessies komende 7 dagen</span></div><div class="stat"><b>'+gl+'</b><span>Groepslessen komende 7 dagen</span></div><div class="stat"><b>'+free7+'</b><span>Vrije PT-momenten komende 7 dagen</span></div></div>';
  var F=[['upcoming','Gepland'],['pending','Te bevestigen'],['all','Alles'],['closed','Geweigerd en geannuleerd']];
  h+='<div class="bar">'+F.map(function(f){return '<button type="button" class="chip'+(A.filter===f[0]?' on':'')+'" data-filter="'+f[0]+'">'+f[1]+'</button>'}).join('')+'<span class="sp"></span><button type="button" class="btn btn-gold btn-sm" data-a="new">+ Nieuwe boeking</button></div>';
  var list=S.bookings.slice().sort(sortB).filter(function(b){
    if(A.filter==='pending')return b.status==='pending';
    if(A.filter==='closed')return b.status==='declined'||b.status==='cancelled';
    if(A.filter==='upcoming')return active(b)&&b.date>=t0;
    return true});
  if(!list.length)h+='<div class="empty">Geen boekingen in deze weergave.</div>';
  list.forEach(function(b){
    h+='<div class="bk" id="bk-'+b.id+'"><div class="when"><b>'+b.time+'</b><span>'+nice(b.date)+'</span></div><div class="who"><b>'+esc(b.first+' '+b.last)+'</b><span class="badge st-'+b.status+'">'+ST[b.status]+'</span><small>'+bLabel(b)+' | '+esc(b.email)+' | '+esc(b.tel)+'</small></div><div class="acts">';
    if(b.status==='pending')h+='<button class="btn btn-ok btn-sm" data-act="confirm" data-id="'+b.id+'">Goedkeuren</button><button class="btn btn-bad btn-sm" data-act="decline" data-id="'+b.id+'">Weigeren</button>';
    if(active(b)&&b.type!=='group')h+='<button class="btn btn-line btn-sm" data-act="edit" data-id="'+b.id+'">Verplaatsen</button>';
    if(b.status==='confirmed')h+='<button class="btn btn-bad btn-sm" data-act="cancel" data-id="'+b.id+'">Annuleren</button>';
    if(b.status==='declined'||b.status==='cancelled')h+='<button class="btn btn-line btn-sm" data-act="restore" data-id="'+b.id+'">Herstellen</button>';
    h+='</div>';
    if(b.note)h+='<div class="memo"><b>Opmerking klant:</b> '+esc(b.note)+'</div>';
    if(A.edit===b.id){var ed=A.editDate||b.date,opts=adminTimes(ed,b.id,b.type);
      h+='<div class="edit"><label class="f">Nieuwe dag<input type="date" id="edDate" value="'+ed+'" min="'+t0+'"></label><label class="f">Nieuw uur<select id="edTime">'+(opts.length?opts.map(function(t){return '<option'+(t===b.time&&ed===b.date?' selected':'')+'>'+t+'</option>'}).join(''):'<option value="">Geen vrije uren</option>')+'</select></label><button class="btn btn-navy btn-sm" data-act="saveEdit" data-id="'+b.id+'"'+(opts.length?'':' disabled')+'>Opslaan</button><button class="btn btn-line btn-sm" data-act="stopEdit">Sluiten</button><span class="hint" style="margin:0;flex-basis:100%">Als beheerder kan je ook binnen de '+hrsTxt(S.settings.minNoticeH)+' verplaatsen. De klant krijgt automatisch bericht.</span></div>'}
    h+='</div>'});
  return h;
}
function adminTimes(ds,skip,type){return freeStarts(ds,type||'pt',skip)}
function vLessons(){
  var s=S.settings,now=new Date(),t0=ymd(today()),d0=ymd(addDays(today(),2));
  var h='<div class="set-grid"><div class="panel set"><h3>Groepsles plannen</h3><p class="hint">Max. '+s.groupMax+' deelnemers, gaat door vanaf '+s.groupMin+'. Aan te passen in Instellingen.</p>'+
  '<form class="form" id="lessonForm"><label class="f full">Naam van de les<input name="title" value="Groepstraining" required></label><label class="f">Dag<input type="date" name="date" value="'+d0+'" min="'+t0+'" required></label><label class="f">Uur<input type="time" name="time" step="900" value="19:00" required></label><label class="f">Duur<select name="dur"><option value="45">45 minuten</option><option value="60" selected>60 minuten</option><option value="90">90 minuten</option></select></label><label class="f">Herhalen<select name="rep"><option value="1">Eenmalig</option><option value="4">Elke week, 4 weken</option><option value="8">Elke week, 8 weken</option><option value="12">Elke week, 12 weken</option></select></label><div class="full"><button class="btn btn-gold" type="submit">Les toevoegen</button></div></form></div>';
  h+='<div class="panel set"><h3>Hoe het werkt</h3><ul class="a-list"><li>Klanten schrijven zich online in tot '+hrsTxt(s.minNoticeH)+' voor de start.</li><li>Een les met minder dan '+s.groupMin+' inschrijvingen op dat moment krijgt de melding "Te weinig deelnemers". Je beslist zelf of je ze annuleert.</li><li>Een groepsles blokkeert dat uur voor PT-boekingen.</li><li>Annuleer je een les, dan worden alle inschrijvingen mee geannuleerd en krijgen de deelnemers bericht.</li></ul></div></div>';
  var L=S.lessons.filter(function(l){return at(l.date,l.time)>=now}).sort(function(a,b){return (a.date+a.time).localeCompare(b.date+b.time)});
  h+='<h3 class="a-h">Geplande groepslessen</h3>';
  if(!L.length)h+='<div class="empty">Nog geen groepslessen gepland.</div>';
  L.forEach(function(l){var B=lessonBookings(l),c=B.length,closeT=new Date(at(l.date,l.time).getTime()-s.minNoticeH*36e5),cls,txt;
    if(l.status==='cancelled'){cls='st-cancelled';txt='Geannuleerd'}
    else if(c>=s.groupMin){cls='st-confirmed';txt='Gaat door'}
    else if(now>=closeT){cls='st-declined';txt='Te weinig deelnemers'}
    else{cls='st-pending';txt='Nog '+(s.groupMin-c)+' nodig'}
    h+='<div class="bk lesson-row"><div class="when"><b>'+l.time+'</b><span>'+nice(l.date)+'</span></div><div class="who"><b>'+esc(l.title)+'</b><span class="badge '+cls+'">'+txt+'</span><small>'+c+' van '+s.groupMax+' plaatsen | '+l.dur+' min | inschrijven tot '+DOW[closeT.getDay()]+' '+closeT.getDate()+' '+MON[closeT.getMonth()]+' '+hm(closeT.getHours()*60+closeT.getMinutes())+'</small></div><div class="acts">'+
      (l.status==='cancelled'?'<button class="btn btn-line btn-sm" data-lact="restore" data-lid="'+l.id+'">Herstellen</button>':'<button class="btn btn-bad btn-sm" data-lact="cancel" data-lid="'+l.id+'">Les annuleren</button>')+'</div>'+
      '<div class="memo">'+(B.length?B.map(function(b){return '<span class="pp">'+esc(b.first+' '+b.last)+(b.status==='pending'?' <i>te bevestigen</i>':'')+'</span>'}).join(''):'Nog geen inschrijvingen.')+'</div></div>'});
  return h;
}
function vAgenda(){
  var t=today(),mon=addDays(t,-((t.getDay()+6)%7)+A.week*7),days=[],times={};
  for(var i=0;i<7;i++){var ds=ymd(addDays(mon,i));days.push(ds);rawSlots(ds).forEach(function(x){times[x]=1});lessonsOn(ds).forEach(function(l){times[l.time]=1})}
  var rows=Object.keys(times).sort(),sun=pd(days[6]);
  var h='<div class="bar"><button type="button" class="icon-btn" data-a="wkPrev" aria-label="Vorige week">‹</button><b class="wk-t">Week van '+mon.getDate()+' '+MON[mon.getMonth()]+' tot '+sun.getDate()+' '+MON[sun.getMonth()]+'</b><button type="button" class="icon-btn" data-a="wkNext" aria-label="Volgende week">›</button><button type="button" class="chip" data-a="wkNow">Deze week</button></div>';
  h+='<div class="agenda"><table><thead><tr><th></th>'+days.map(function(ds){var d=pd(ds);return '<th'+(ds===ymd(t)?' class="today"':'')+'>'+DOW[d.getDay()]+' '+d.getDate()+'<small>'+MON[d.getMonth()]+'</small></th>'}).join('')+'</tr></thead><tbody>';
  if(!rows.length)h+='<tr><td colspan="8" style="padding:24px">Geen openingsuren deze week.</td></tr>';
  rows.forEach(function(tm){h+='<tr><td>'+tm+'</td>'+days.map(function(ds){
    var l=lessonsOn(ds).filter(function(x){return x.time===tm})[0];
    if(l)return '<td><button class="cell c-group" data-tab="lessons">'+esc(l.title)+'<br>'+lessonCount(l)+'/'+S.settings.groupMax+'</button></td>';
    var ov2=lessonOverlap(ds,tm);if(ov2&&rawSlots(ds).indexOf(tm)>-1)return '<td class="c-closed">groepsles</td>';
    if(rawSlots(ds).indexOf(tm)<0)return '<td class="c-closed">dicht</td>';
    var bs=bookingsIn(ds,mins(tm),mins(tm)+S.settings.slotMin),b=bs[0];
    if(b)return '<td><button class="cell c-'+b.status+'" data-goto="'+b.id+'" title="'+ST[b.status]+'">'+esc(b.first+' '+b.last.charAt(0))+'.<br>'+({intro:'kennismaking',scan:'InBody '+b.time,pt:'PT'}[b.type])+(bs.length>1?' +'+(bs.length-1):'')+'</button></td>';
    if(isBlocked(ds,tm))return '<td><button class="cell c-blocked" data-block="'+ds+'T'+tm+'">geblokkeerd</button></td>';
    if(at(ds,tm)<new Date())return '<td class="c-closed">voorbij</td>';
    return '<td><button class="cell c-free" data-block="'+ds+'T'+tm+'">vrij</button></td>'}).join('')+'</tr>'});
  h+='</tbody></table></div><div class="legend"><span><i style="background:var(--ok-bg)"></i>Bevestigd</span><span><i style="background:var(--warn-bg)"></i>Te bevestigen</span><span><i style="background:#ece5d6"></i>Groepsles</span><span><i style="background:#e4e1d8"></i>Geblokkeerd</span><span><i style="background:#fff"></i>Vrij (klik om te blokkeren)</span></div><p class="hint" style="margin-top:10px">Klik op een vrij moment om het te blokkeren, bijvoorbeeld voor een privé-afspraak. Klik op een boeking om ze te openen.</p>';
  return h;
}
function vSettings(){
  var s=S.settings,h='<div class="set-grid"><div class="panel set"><h3>Boekingsregels</h3><p class="hint">Wijzigingen zijn meteen zichtbaar op de website.</p>'+
  '<div class="row"><label for="sAppr">Boekingen manueel goedkeuren<small>Uit: elke boeking is meteen definitief</small></label><span class="sw"><input type="checkbox" id="sAppr" data-set="approval"'+(s.approval?' checked':'')+'><span></span></span></div>'+
  '<div class="row"><label for="sMin">Minimaal vooraf boeken<small>Klanten kunnen boeken tot dit aantal uur voor de start</small></label><span><input type="number" id="sMin" data-set="minNoticeH" min="0" max="336" step="1" value="'+s.minNoticeH+'"> uur</span></div>'+
  '<div class="row"><label for="sHor">Maximaal vooruit boeken<small>Hoe ver de agenda open staat</small></label><span><input type="number" id="sHor" data-set="horizonDays" min="7" max="120" step="1" value="'+s.horizonDays+'"> dagen</span></div>'+
  '<div class="row"><label for="sDur">Duur van een PT-sessie</label><select id="sDur" data-set="slotMin">'+[30,45,60,90].map(function(m){return '<option value="'+m+'"'+(s.slotMin===m?' selected':'')+'>'+m+' minuten</option>'}).join('')+'</select></div>'+
  '<div class="row"><label for="sCan">Kosteloos annuleren tot<small>Wordt getoond in de veelgestelde vragen</small></label><span><input type="number" id="sCan" data-set="cancelH" min="0" max="168" value="'+s.cancelH+'"> uur</span></div>'+
  '<div class="row"><label for="sNot">Meldingen naar<small>E-mail bij elke nieuwe aanvraag</small></label><input type="email" id="sNot" data-set="notify" value="'+esc(s.notify)+'" style="width:220px"></div></div>';
  h+='<div class="panel set"><h3>Uren waarop geboekt kan worden</h3><p class="hint">Per dag aan of uit. Voeg meerdere momenten toe, bijvoorbeeld 09:00 tot 12:00 en 13:00 tot 15:00.</p><div class="days-set">';
  [1,2,3,4,5,6,0].forEach(function(i){var x=s.hours[i];
    h+='<div class="dset'+(x.on?'':' off')+'"><div class="dset-h"><span class="sw"><input type="checkbox" data-hon="'+i+'"'+(x.on?' checked':'')+' aria-label="'+DOWL[i]+' open"><span></span></span><b>'+DOWL[i]+'</b>'+(x.on?'':'<span class="closed-l">Gesloten</span>')+'</div>';
    if(x.on){h+='<div class="ranges">'+x.ranges.map(function(r,k){return '<div class="rg"><input type="time" step="900" data-rf="'+i+':'+k+'" value="'+r.from+'" aria-label="'+DOWL[i]+' moment '+(k+1)+' van"><span>tot</span><input type="time" step="900" data-rt="'+i+':'+k+'" value="'+r.to+'" aria-label="'+DOWL[i]+' moment '+(k+1)+' tot">'+(x.ranges.length>1?'<button type="button" class="rg-x" data-rrm="'+i+':'+k+'" aria-label="Moment verwijderen">✕</button>':'')+'</div>'}).join('')+'<button type="button" class="rg-add" data-radd="'+i+'">+ Moment toevoegen</button></div>'}
    h+='</div>'});
  h+='</div></div>';
  h+='<div class="panel set"><h3>Groepslessen</h3><p class="hint">Geldt voor alle groepslessen.</p>'+
  '<div class="row"><label for="gMax">Maximaal aantal deelnemers</label><span><input type="number" id="gMax" data-set="groupMax" min="2" max="20" value="'+s.groupMax+'"> personen</span></div>'+
  '<div class="row"><label for="gMin">Minimum om door te gaan<small>Minder inschrijvingen: de les vervalt</small></label><span><input type="number" id="gMin" data-set="groupMin" min="1" max="20" value="'+s.groupMin+'"> personen</span></div>'+
  '<div class="row"><label for="gPr">Prijs per les</label><span>€ <input type="number" id="gPr" data-set="groupPrice" min="0" max="200" value="'+s.groupPrice+'"></span></div></div>';
  h+='<div class="panel set"><h3>InBody-scan</h3><p class="hint">Scans worden ingepland tussen de PT-sessies, binnen je uren.</p>'+
  '<div class="row"><label for="scD">Duur van een scan<small>Meting en korte bespreking</small></label><select id="scD" data-set="scanMin">'+[10,15,20,30].map(function(m){return '<option value="'+m+'"'+(s.scanMin===m?' selected':'')+'>'+m+' minuten</option>'}).join('')+'</select></div>'+
  '<div class="row"><label for="scP">Prijs losse scan</label><span>€ <input type="number" id="scP" data-set="scanPrice" min="0" max="200" value="'+s.scanPrice+'"></span></div>'+
  '<div class="row"><label for="ptP">Prijs PT-sessie</label><span>€ <input type="number" id="ptP" data-set="ptPrice" min="0" max="300" value="'+s.ptPrice+'"></span></div></div>';
  h+='<div class="panel set"><h3>Gesloten dagen</h3><p class="hint">Verlof of feestdagen. Op deze dagen kan niemand boeken.</p><div class="bar"><input type="date" id="clDate" min="'+ymd(today())+'" class="in-date"><button class="btn btn-navy btn-sm" data-a="addClosed">Dag toevoegen</button></div>'+(s.closed.length?s.closed.slice().sort().map(function(d){return '<span class="pill-x">'+nice(d)+' '+pd(d).getFullYear()+'<button data-rmclosed="'+d+'" aria-label="Verwijder '+nice(d)+'">×</button></span>'}).join(''):'<span class="hint">Nog geen gesloten dagen.</span>')+'</div>';
  h+='<div class="panel set"><h3>Demo</h3><p class="hint">Zet alle voorbeeldboekingen en instellingen terug zoals bij de start.</p><button class="btn btn-line btn-sm" data-a="reset">Demo-gegevens herstellen</button></div></div>';
  return h;
}
function byId(id){for(var i=0;i<S.bookings.length;i++)if(S.bookings[i].id===id)return S.bookings[i]}
function newModal(){
  var t0=ymd(today()),d=A.newDate,ty=A.newType||'pt';function fut(x){return adminTimes(x,null,ty).filter(function(t){return at(x,t)>new Date()})}if(!d){d=t0;for(var i=0;i<60&&!fut(d).length;i++)d=ymd(addDays(today(),i+1))}var opts=fut(d);
  $('#modalHost').innerHTML='<div class="modal"><div class="panel"><h3 style="font-size:1.2rem;margin-bottom:4px">Nieuwe boeking</h3><p class="hint">Voor klanten die bellen of ter plaatse afspreken. De regel van '+hrsTxt(S.settings.minNoticeH)+' geldt hier niet. Inschrijven voor een groepsles kan via de website.</p><form class="form" id="newForm"><label class="f">Voornaam<input name="first" required></label><label class="f">Naam<input name="last" required></label><label class="f">E-mail<input name="email" type="email"></label><label class="f">Telefoon<input name="tel" type="tel"></label><label class="f">Type<select name="type" id="newType">'+['pt','scan','intro'].map(function(k){return '<option value="'+k+'"'+(ty===k?' selected':'')+'>'+TYPES[k].name+'</option>'}).join('')+'</select></label><label class="f">Dag<input name="date" type="date" id="newDate" value="'+d+'" min="'+t0+'" required></label><label class="f full">Uur<select name="time" required>'+(opts.length?opts.map(function(t){return '<option>'+t+'</option>'}).join(''):'<option value="">Geen vrije uren op deze dag</option>')+'</select></label><div class="full cta-row"><button class="btn btn-gold" type="submit"'+(opts.length?'':' disabled')+'>Boeking toevoegen</button><button class="btn btn-line" type="button" data-a="closeModal">Annuleren</button></div></form></div></div>';
}
host.addEventListener('submit',function(e){
  if(e.target.id==='aLogin'){e.preventDefault();A.auth=true;renderAdmin();return}
  if(e.target.id==='lessonForm'){e.preventDefault();var f=e.target.elements,title=f.title.value.trim()||'Groepsles',d=f.date.value,tm=f.time.value,dur=+f.dur.value,rep=+f.rep.value,made=0,skip=0;
    if(!d||!tm){toast('Kies een dag en een uur.');return}
    for(var k=0;k<rep;k++){var ds=ymd(addDays(pd(d),k*7));
      var clash=S.bookings.some(function(b){return b.type!=='group'&&active(b)&&b.date===ds&&mins(b.time)<mins(tm)+dur&&mins(tm)<mins(b.time)+bDur(b)})||lessonsOn(ds).some(function(l){return mins(l.time)<mins(tm)+dur&&mins(tm)<mins(l.time)+l.dur});
      if(clash){skip++;continue}
      S.lessons.push({id:uid('L'),date:ds,time:tm,dur:dur,title:title,status:'open'});made++}
    save();renderAdmin();toast(made+(made===1?' les':' lessen')+' toegevoegd'+(skip?', '+skip+' overgeslagen wegens een bestaande afspraak':'')+'.');}
});
$('#modalHost').addEventListener('change',function(e){if(e.target.id==='newDate'||e.target.id==='newType'){var fm=$('#newForm'),keep={};['first','last','email','tel','type'].forEach(function(n){keep[n]=fm.elements[n].value});if(e.target.id==='newDate')A.newDate=e.target.value;else{A.newType=e.target.value;A.newDate=null}newModal();fm=$('#newForm');Object.keys(keep).forEach(function(n){fm.elements[n].value=keep[n]})}});
$('#modalHost').addEventListener('click',function(e){if(e.target.closest('[data-a="closeModal"]')||e.target.classList.contains('modal'))$('#modalHost').innerHTML=''});
$('#modalHost').addEventListener('submit',function(e){e.preventDefault();var f=e.target.elements;if(!f.first.value.trim()||!f.last.value.trim()||!f.time.value)return;
  S.bookings.push({id:uid('b'),type:f.type.value,date:f.date.value,time:f.time.value,first:f.first.value.trim(),last:f.last.value.trim(),email:f.email.value.trim()||'geen e-mail',tel:f.tel.value.trim()||'geen nummer',note:'',status:'confirmed',created:Date.now()});
  save();$('#modalHost').innerHTML='';A.newDate=null;A.filter='upcoming';renderAdmin();toast('Boeking toegevoegd en bevestigd.')});
function rangesValid(rs){var x=rs.slice().sort(function(a,b){return mins(a.from)-mins(b.from)});for(var i=0;i<x.length;i++){if(mins(x[i].to)<=mins(x[i].from))return 'Het einduur moet na het beginuur liggen.';if(i&&mins(x[i].from)<mins(x[i-1].to))return 'Twee momenten op dezelfde dag mogen niet overlappen.'}return ''}
host.addEventListener('click',function(e){
  var el=e.target.closest('[data-tab],[data-a],[data-filter],[data-act],[data-goto],[data-block],[data-rmclosed],[data-lact],[data-radd],[data-rrm]');if(!el)return;
  var a=el.dataset,s=S.settings;
  if(a.tab){A.tab=a.tab;A.edit=null;renderAdmin();host.scrollTop=0;return}
  if(a.filter){A.filter=a.filter;renderAdmin();return}
  if(a.goto){A.tab='bookings';A.filter='all';renderAdmin();var r=$('#bk-'+a.goto);if(r){r.scrollIntoView({block:'center'});r.style.borderColor='var(--gold)'}return}
  if(a.block){var ix=s.blocked.indexOf(a.block);if(ix>-1)s.blocked.splice(ix,1);else s.blocked.push(a.block);save();renderAdmin();return}
  if(a.rmclosed){s.closed=s.closed.filter(function(d){return d!==a.rmclosed});save();renderAdmin();return}
  if(a.radd!=null){var rs=s.hours[a.radd].ranges,last=rs[rs.length-1],st=last?Math.min(mins(last.to)+60,22*60):9*60,en=Math.min(st+120,23*60+45);
    if(st>=en){toast('Er is geen ruimte meer na het laatste moment.');return}
    rs.push({from:hm(st),to:hm(en)});save();renderAdmin();toast('Moment toegevoegd. Pas de uren gerust aan.');return}
  if(a.rrm){var p=a.rrm.split(':');s.hours[p[0]].ranges.splice(+p[1],1);save();renderAdmin();toast('Moment verwijderd.');return}
  if(a.lact){var l=lessonById(a.lid);
    if(a.lact==='cancel'){l.status='cancelled';lessonBookings(l).forEach(function(b){b.status='cancelled'});save();renderAdmin();toast('Les geannuleerd. De deelnemers krijgen bericht.');return}
    if(a.lact==='restore'){var clash=S.bookings.some(function(b){return b.type!=='group'&&active(b)&&b.date===l.date&&mins(b.time)<mins(l.time)+l.dur&&mins(l.time)<mins(b.time)+bDur(b)});if(clash){toast('Er staat intussen een PT-boeking op dit uur.');return}l.status='open';save();renderAdmin();toast('Les staat opnieuw open.');return}}
  if(a.a==='close'){closeAdmin();return}
  if(a.a==='new'){A.newDate=null;A.newType='pt';newModal();return}
  if(a.a==='wkPrev'){A.week--;renderAdmin();return}
  if(a.a==='wkNext'){A.week++;renderAdmin();return}
  if(a.a==='wkNow'){A.week=0;renderAdmin();return}
  if(a.a==='addClosed'){var v=$('#clDate').value;if(!v){toast('Kies eerst een datum.');return}if(s.closed.indexOf(v)<0)s.closed.push(v);save();renderAdmin();toast(nice(v)+' is gesloten.');return}
  if(a.a==='reset'){S=defaults();seed();A.edit=null;renderAdmin();toast('Demo-gegevens hersteld.');return}
  var b=a.id&&byId(a.id);if(!b)return;
  if(a.act==='confirm'){if(b.type==='group'){var lb=lessonById(b.lessonId);if(lb&&S.bookings.filter(function(x){return x.lessonId===lb.id&&x.status==='confirmed'}).length>=s.groupMax){toast('Deze les is al volzet.');return}}b.status='confirmed';save();renderAdmin();toast('Goedgekeurd. '+b.first+' krijgt een bevestiging per e-mail.');return}
  if(a.act==='decline'){b.status='declined';save();renderAdmin();toast('Geweigerd. De plaats is opnieuw vrij.');return}
  if(a.act==='cancel'){b.status='cancelled';save();renderAdmin();toast('Geannuleerd. '+b.first+' krijgt bericht.');return}
  if(a.act==='restore'){
    if(b.type==='group'){var lr=lessonById(b.lessonId);if(!lr||lr.status==='cancelled'){toast('Deze les is geannuleerd.');return}if(lessonCount(lr)>=s.groupMax){toast('Deze les is intussen volzet.');return}}
    else if(overlaps(busy(b.date,b.id),mins(b.time),mins(b.time)+bDur(b))){toast('Dit moment is intussen ingenomen.');return}
    b.status='confirmed';save();renderAdmin();return}
  if(a.act==='edit'){A.edit=A.edit===b.id?null:b.id;A.editDate=null;renderAdmin();return}
  if(a.act==='stopEdit'){A.edit=null;renderAdmin();return}
  if(a.act==='saveEdit'){var nd=$('#edDate').value,nt=$('#edTime').value;if(!nd||!nt)return;b.date=nd;b.time=nt;A.edit=null;A.editDate=null;save();renderAdmin();toast('Verplaatst naar '+nice(nd)+' om '+nt+'.');return}
});
host.addEventListener('change',function(e){
  var t=e.target,d=t.dataset,s=S.settings;
  if(t.id==='edDate'){A.editDate=t.value;renderAdmin();return}
  if(d.set){
    if(t.type==='checkbox')s[d.set]=t.checked;
    else if(t.type==='email')s[d.set]=t.value.trim();
    else{var v=parseInt(t.value,10);if(isNaN(v)||v<+(t.min||0)){t.value=s[d.set];toast('Ongeldige waarde.');return}if(t.max&&v>+t.max)v=+t.max;
      if(d.set==='groupMin'&&v>s.groupMax){toast('Het minimum kan niet hoger zijn dan het maximum.');renderAdmin();return}
      if(d.set==='groupMax'&&v<s.groupMin){toast('Het maximum kan niet lager zijn dan het minimum.');renderAdmin();return}
      s[d.set]=v}
    save();renderAdmin();toast('Instelling opgeslagen.');return}
  if(d.hon!=null){var hh=s.hours[d.hon];hh.on=t.checked;if(hh.on&&!hh.ranges.length)hh.ranges.push({from:'09:00',to:'12:00'});save();renderAdmin();toast('Uren opgeslagen.');return}
  var key=d.rf||d.rt;if(!key)return;var p=key.split(':'),rs=s.hours[p[0]].ranges,r=rs[+p[1]],old={from:r.from,to:r.to};
  if(!t.value){renderAdmin();return}
  if(d.rf)r.from=t.value;else r.to=t.value;
  var err=rangesValid(rs);if(err){r.from=old.from;r.to=old.to;toast(err);renderAdmin();return}
  rs.sort(function(a,b){return mins(a.from)-mins(b.from)});save();renderAdmin();toast('Uren opgeslagen.');
});
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;if(!ov.hidden){menuSet(false);mb.focus();return}if($('#modalHost').innerHTML)$('#modalHost').innerHTML='';else if(A.open)closeAdmin()});

/* ---------- init ---------- */
S=load();
if(!S||!S.settings||!S.settings.hours||!S.settings.hours[1].ranges||!S.lessons||!S.settings.scanMin){S=defaults()}
if(!S.seeded)seed();
renderAll();
cookieShow(!cookieGet());
if(location.hash==='#beheer')openAdmin();
})();
