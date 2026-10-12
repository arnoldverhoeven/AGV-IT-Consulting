
(function(){var h=document.getElementById('hdr');function s(){h.classList.toggle('scrolled',window.scrollY>40)}s();window.addEventListener('scroll',s,{passive:true});
var els=document.querySelectorAll('.reveal');if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(function(e){e.classList.add('in')});return}
var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});els.forEach(function(e){io.observe(e)});})();

(function(){
var b=document.documentElement.classList,btn=document.getElementById('menubtn'),dr=document.getElementById('drawer'),lbl=btn.querySelector('.lbl');
function set(o,kb){b.toggle('menu-open',o);btn.setAttribute('aria-expanded',o);lbl.textContent=o?'Sluiten':'Menu';if(o&&kb){var f=dr.querySelector('a');f&&setTimeout(function(){f.focus({preventScroll:true})},60)}}
btn.addEventListener('click',function(e){set(!b.contains('menu-open'),e.detail===0)});
dr.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&b.contains('menu-open')){set(false);btn.focus()}});
matchMedia('(min-width:901px)').addEventListener('change',function(m){if(m.matches)set(false)});
/* open of gesloten, Brusselse tijd */
var H={0:[10,16],1:[9,16],2:null,3:[9,16],4:[9,16],5:[9,16],6:[9,16]},D=['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'];
try{var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Brussels',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()),o={};p.forEach(function(x){o[x.type]=x.value});
var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(o.weekday),h=+o.hour+(+o.minute)/60,t=H[d],el=document.getElementById('opennow'),txt;
if(t&&h>=t[0]&&h<t[1]){txt='Nu open — tot '+t[1]+':00 u'}else{var n=d,k=0;if(t&&h<t[0]){k=0}else{do{n=(n+1)%7;k++}while(!H[n])}txt='Nu gesloten — '+(k===0?'vandaag':k===1?'morgen':D[n])+' open vanaf '+H[n][0]+':00 u';el.classList.add('closed')}
el.textContent=txt}catch(e){}
/* actieve sectie in desktopmenu */
if('IntersectionObserver' in window){var nl=document.querySelectorAll('nav.main a');var so=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting)nl.forEach(function(a){a.setAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id)})})},{rootMargin:'-45% 0px -50% 0px'});['kaart','verhaal','reviews','bezoek'].forEach(function(i){var s=document.getElementById(i);s&&so.observe(s)})}
})();
