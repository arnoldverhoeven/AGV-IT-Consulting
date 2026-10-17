(function(){
  var root=document.documentElement, sw=document.querySelectorAll('.js-pw'), flash=document.getElementById('flash');
  function setState(on, animate){
    root.setAttribute('data-state', on?'on':'off');
    if(animate&&navigator.vibrate){try{navigator.vibrate(on?[14,40,14]:10)}catch(e){}}
    sw.forEach(function(b){b.setAttribute('aria-checked', on?'true':'false')});
    if(on&&animate){flash.classList.remove('go');void flash.offsetWidth;flash.classList.add('go')}
  }
  sw.forEach(function(b){b.addEventListener('click',function(){setState(root.getAttribute('data-state')!=='on', true)})});

  // header
  var h=document.getElementById('hdr');
  function sc(){h.classList.toggle('scrolled',window.scrollY>40)} sc(); addEventListener('scroll',sc,{passive:true});

  // mobile menu
  var mb=document.getElementById('menuBtn'), dr=document.getElementById('drawer');
  mb.addEventListener('click',function(){var o=dr.classList.toggle('open');mb.setAttribute('aria-expanded',o)});
  dr.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){dr.classList.remove('open');mb.setAttribute('aria-expanded','false')})});

  // reveal
  var els=document.querySelectorAll('.rv');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(e){io.observe(e)});
  } else { els.forEach(function(e){e.classList.add('in')}) }

  // chips + form
  document.querySelectorAll('.chip').forEach(function(c){c.addEventListener('click',function(){c.classList.toggle('sel')})});
  var f=document.getElementById('intakeForm');
  f.addEventListener('submit',function(e){e.preventDefault();if(!f.naam.value||!f.mail.value){f.reportValidity();return}document.getElementById('ok').style.display='block';setState(true,true)});

  // mobile dock: show after hero, hide near the intake form
  var dock=document.getElementById('dock'), intake=document.getElementById('intake'), inIntake=false;
  function dk(){dock.classList.toggle('show', window.scrollY>520 && !inIntake)}
  if('IntersectionObserver' in window){new IntersectionObserver(function(es){inIntake=es[0].isIntersecting;dk()},{threshold:.25}).observe(intake)}
  addEventListener('scroll',dk,{passive:true}); dk();

  document.getElementById('yr').textContent=new Date().getFullYear();
})();
