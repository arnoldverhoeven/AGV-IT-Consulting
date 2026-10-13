/* Beeldmateriaal: één keer ingeladen, overal hergebruikt */
const IMG={};
const _st=document.getElementById('imgstore');
[...document.querySelectorAll('img[data-img]'),...(_st?_st.content.querySelectorAll('img[data-img]'):[])].forEach(i=>{const s=i.getAttribute('src');if(s&&s.startsWith('data:'))IMG[i.dataset.img]=s});
document.querySelectorAll('img[data-img]:not([src])').forEach(i=>{i.src=IMG[i.dataset.img]});

/* Productcatalogus — later 1-op-1 te vervangen door de Shopzo-API */
const GLAZES=[
 {k:"drama",n:"Drama (crème · zwart · amber)",c:"linear-gradient(135deg,#efe6d4 45%,#2b2622 46%)"},
 {k:"toffee",n:"Toffee",c:"#8a5a33"},
 {k:"schildpad",n:"Schildpad",c:"radial-gradient(circle at 30% 30%,#3a2412 12%,transparent 13%),radial-gradient(circle at 70% 60%,#3a2412 10%,transparent 11%),#a8702e"},
 {k:"creme",n:"Crème",c:"#efe6d4"}
];
const P=[
 {id:"beker-drama",name:"Beker Drama",cat:"bekers",img:"potteria-ig-03.jpg",pos:"50% 42%",price:34,stock:1,badge:"Uniek stuk",bc:"",order:3,
  glz:"Crème met zwart &amp; amber glazuur",
  desc:"Een tikkeltje dramatisch — maar op de beste manier. Het zwarte glazuur liep in de oven over het crème en liet een amberkleurige rand achter. Precies dit exemplaar, één keer gemaakt.",
  dims:"± 8 cm hoog · ± 7,5 cm doorsnede · past ± 200 ml (voorbeeld)"},
 {id:"beker-schildpad",name:"Beker Schildpad",cat:"bekers",img:"potteria-ig-08.jpg",pos:"50% 50%",price:32,stock:2,badge:"Vers uit de oven",bc:"b-glaze",order:1,
  glz:"Gespikkeld amber, met duimafdrukken",
  desc:"Net uit de oven gehaald: een glanzend gespikkeld glazuur dat aan schildpad doet denken. De zachte deukjes liggen perfect in je hand.",
  dims:"± 7 cm hoog · ± 8 cm doorsnede (voorbeeld)"},
 {id:"schaal-golf",name:"Schaal Golf",cat:"schalen",img:"potteria-ig-09.jpg",pos:"50% 38%",price:42,stock:1,badge:"Vers uit de oven",bc:"b-glaze",order:2,
  glz:"Golvende rand, gespikkeld amber",
  desc:"Een schaal met een vrije, golvende rand — voor fruit, sieraden of gewoon om naar te kijken. Met de hand gevormd, dus geen twee hetzelfde.",
  dims:"± 18 cm doorsnede (voorbeeld)"},
 {id:"beker-toffee",name:"Beker Toffee",cat:"bekers",img:"potteria-ig-04.jpg",pos:"45% 45%",price:29,stock:3,badge:"",bc:"",order:4,
  glz:"Warm toffeebruin, met deukjes",
  desc:"Een rustige, warmbruine beker met zachte duimafdrukken rondom. Mooi voor koffie, thee of een handvol droogbloemen.",
  dims:"± 7 cm hoog · ± 8,5 cm doorsnede (voorbeeld)"},
 {id:"beker-op-bestelling",name:"Beker op bestelling",cat:"bestelling",img:"potteria-ig-05.jpg",pos:"50% 40%",price:36,from:true,stock:99,made:true,badge:"Op bestelling",bc:"b-ok",order:5,
  glz:"Kies zelf je glazuur",
  desc:"Jouw beker, gemaakt vanaf een klomp klei. Kies het glazuur dat je het mooist vindt; Elise neemt na je bestelling contact op om de details en de timing af te stemmen.",
  dims:"Afmetingen in overleg",swatches:true},
 {id:"set-op-bestelling",name:"Set van 4 bekers",cat:"bestelling",img:"potteria-ig-11.jpg",pos:"20% 85%",price:130,from:true,stock:99,made:true,badge:"Op bestelling",bc:"b-ok",order:6,
  glz:"Vier bekers in één glazuur naar keuze",
  desc:"Een kleine reeks die samen hoort: vier bekers in hetzelfde glazuur, elk met een eigen karakter. Ideaal als cadeau of voor je eigen koffiehoek.",
  dims:"Afmetingen in overleg",swatches:true},
 {id:"cadeaubon",name:"Cadeaubon",cat:"cadeau",img:null,price:25,stock:99,gift:true,badge:"",bc:"",order:7,
  glz:"€ 25 · € 50 · € 75",
  desc:"Twijfel je welk stuk? Geef een cadeaubon en laat de ontvanger zelf kiezen — ook te gebruiken voor stukken op bestelling.",
  dims:"Digitaal, meteen in je mailbox (voorbeeld)"}
];
const CATS=[["alles","Alles"],["bekers","Bekers"],["schalen","Schalen"],["bestelling","Op bestelling"],["cadeau","Cadeaubon"]];
const FREE=75, SHIP=6.95;

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const eur=n=>"€ "+n.toFixed(2).replace(".",",").replace(",00",",–");
const store={get(k,d){try{return JSON.parse(localStorage.getItem("lp-"+k))??d}catch(e){return d}},set(k,v){try{localStorage.setItem("lp-"+k,JSON.stringify(v))}catch(e){}}};
let state={cat:"alles",sort:"feat",only:false,q:"",wishOnly:false};
let cart=store.get("cart",[]), wish=store.get("wish",[]);

function phHTML(p){
  return p.gift?`<div class="gift-face"><span class="gf2">La Pottería</span><span class="gf3">€ 25</span><span class="gf1">Cadeaubon</span></div>`
   :`<img src="${IMG[p.img]}" alt="${p.name} — ${p.glz.replace(/&amp;/g,'&')}" style="object-position:${p.pos}">`;
}
function stockHTML(p){
  if(p.made) return `<span class="stock">Op bestelling</span>`;
  if(p.gift) return `<span class="stock">Direct leverbaar</span>`;
  return p.stock===1?`<span class="stock low">Laatste exemplaar</span>`:`<span class="stock">Nog ${p.stock} op voorraad</span>`;
}
function renderChips(){
  $("#chips").innerHTML=CATS.map(([k,n])=>{const c=k==="alles"?P.length:P.filter(p=>p.cat===k).length;return `<button class="chip" data-cat="${k}" aria-pressed="${state.cat===k}">${n} <span class="n">${c}</span></button>`}).join("")
   + `<button class="chip" data-wish aria-pressed="${state.wishOnly}">♡ Favorieten <span class="n">${wish.length}</span></button>`;
}
function list(){
  let l=P.filter(p=>(state.cat==="alles"||p.cat===state.cat)&&(!state.only||(!p.made&&!p.gift))&&(!state.wishOnly||wish.includes(p.id)));
  if(state.q){const q=state.q.toLowerCase();l=l.filter(p=>(p.name+" "+p.glz+" "+p.desc+" "+p.cat).toLowerCase().includes(q))}
  const s={feat:(a,b)=>a.order-b.order,new:(a,b)=>(b.badge==="Vers uit de oven")-(a.badge==="Vers uit de oven")||a.order-b.order,low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price}[state.sort];
  return l.sort(s);
}
function renderGrid(){
  const l=list();
  $("#resultLine").textContent=(state.q?`Zoekresultaten voor “${state.q}” · `:"")+`${l.length} ${l.length===1?"stuk":"stukken"}`;
  $("#grid").innerHTML=l.length?l.map(p=>`
   <article class="card">
     <div class="ph" data-open="${p.id}" role="button" tabindex="0" aria-label="Bekijk ${p.name}">
       ${phHTML(p)}
       ${p.badge?`<span class="badge ${p.bc}">${p.badge}</span>`:""}
       <span class="qv-hint">Snel bekijken · ${p.dims.split("·")[0]}</span>
     </div>
     <button class="heart" data-wish-id="${p.id}" aria-pressed="${wish.includes(p.id)}" aria-label="${p.name} bewaren als favoriet"><svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button>
     <div class="body">
       <h3>${p.name}</h3>
       <p class="glz">${p.glz}</p>
       ${stockHTML(p)}
       <div class="row">
         <span class="price">${p.from?"<small>vanaf </small>":""}${eur(p.price)}</span>
         ${p.swatches||p.gift?`<button class="add" data-open="${p.id}">Kies opties</button>`:`<button class="add" data-add="${p.id}" ${inCart(p.id)>=p.stock?"disabled":""}>${inCart(p.id)>=p.stock?"In je mandje":"+ In mandje"}</button>`}
       </div>
     </div>
   </article>`).join(""):`<div class="empty"><h3>Niets gevonden</h3><p>Probeer een andere categorie of zoekterm.</p></div>`;
}
const inCart=id=>cart.filter(i=>i.id===id).reduce((a,i)=>a+i.q,0);
function lineKey(i){return i.id+"|"+(i.opt||"")}
function addToCart(id,q=1,opt="",price){
  const p=P.find(x=>x.id===id); price=price??p.price;
  if(!p.made&&!p.gift&&inCart(id)+q>p.stock){toast("Dit stuk is uniek — het zit al in je mandje.");return}
  const ex=cart.find(i=>lineKey(i)===id+"|"+opt);
  ex?ex.q+=q:cart.push({id,q,opt,price});
  save(); toast(`${p.name} ligt in je mandje`,true);
  const c=$("#count");c.classList.remove("bump");void c.offsetWidth;c.classList.add("bump");
}
function save(){store.set("cart",cart);store.set("wish",wish);renderCart();renderGrid();renderChips()}
function totals(){const sub=cart.reduce((a,i)=>a+i.price*i.q,0);const ship=sub===0||sub>=FREE?0:SHIP;return{sub,ship,tot:sub+ship,n:cart.reduce((a,i)=>a+i.q,0)}}
function renderCart(){
  const t=totals();
  $("#count").textContent=t.n;
  $("#mcCount").textContent=t.n+(t.n===1?" stuk":" stuks"); $("#mcTotal").textContent=eur(t.sub);
  $("#mcart").classList.toggle("on",t.n>0&&!$("#drawer").classList.contains("on")); document.body.classList.toggle("has-cart",t.n>0);
  const left=FREE-t.sub;
  $("#ship").innerHTML=t.n===0?"Gratis verzending vanaf "+eur(FREE)+" (voorbeeld).":left>0?`Nog <b>${eur(left)}</b> tot gratis verzending<div class="meter"><i style="width:${Math.min(100,t.sub/FREE*100)}%"></i></div>`:`<b>Je verzending is gratis</b> 🎉<div class="meter"><i style="width:100%"></i></div>`;
  if(!cart.length){$("#items").innerHTML=`<div class="cart-empty"><h3>Nog leeg</h3><p>Elk stuk is uniek — wacht niet te lang.</p><a class="btn btn-dark" href="#shop" id="emptyShop" style="margin-top:1rem">Naar de shop</a></div>`;$("#dfoot").innerHTML="";return}
  $("#items").innerHTML=cart.map((i,ix)=>{const p=P.find(x=>x.id===i.id);return `
    <div class="item"><div class="th">${p.gift?'<div class="gift-face" style="padding:.5rem"><span class="gf1" style="font-size:.9rem">Bon</span></div>':`<img src="${IMG[p.img]}" alt="" style="object-position:${p.pos}">`}</div>
     <div><h4>${p.name}</h4><div class="meta">${i.opt?i.opt:p.glz}</div>
      <div class="qty"><button data-dec="${ix}" aria-label="Eén minder">−</button><span>${i.q}</span><button data-inc="${ix}" aria-label="Eén meer" ${(!p.made&&!p.gift&&inCart(p.id)>=p.stock)?"disabled style='opacity:.35'":""}>+</button></div>
      <button class="rm" data-rm="${ix}">Verwijderen</button></div>
     <div class="ip">${eur(i.price*i.q)}</div></div>`}).join("");
  $("#dfoot").innerHTML=`
    <label class="giftnote"><input type="checkbox" id="giftwrap"> Verpakken als cadeau, met een handgeschreven kaartje</label>
    <div class="tot"><span>Subtotaal</span><span>${eur(t.sub)}</span></div>
    <div class="tot"><span>Verzending</span><span>${t.ship?eur(t.ship):"Gratis"}</span></div>
    <div class="tot big"><span>Totaal</span><span>${eur(t.tot)}</span></div>
    <button class="btn btn-glaze" id="checkout">Veilig afrekenen →</button>`;
}
/* drawer */
function openCart(){$("#drawer").classList.add("on");$("#scrim").classList.add("on");$("#drawer").setAttribute("aria-hidden","false");$("#mcart").classList.remove("on");setTimeout(()=>$("#closeCart").focus(),50)}
function closeCart(){$("#drawer").classList.remove("on");$("#scrim").classList.remove("on");$("#drawer").setAttribute("aria-hidden","true");renderCart()}
/* quick view */
function openQV(id){
  const p=P.find(x=>x.id===id), d=$("#qv"); let opt=p.swatches?GLAZES[0].n:p.gift?"€ 25":""; let q=1;
  d.innerHTML=`<button class="x" data-close aria-label="Sluiten">×</button>
   <div class="qv"><div class="ph">${p.gift?phHTML(p):`<img src="${IMG[p.img]}" alt="${p.name} van dichtbij" style="object-position:${p.pos}">`}</div>
   <div class="info">
     ${p.badge?`<span class="eyebrow">${p.badge}</span>`:`<span class="eyebrow">${CATS.find(c=>c[0]===p.cat)[1]}</span>`}
     <h2>${p.name}</h2>
     <div class="price" id="qvPrice">${p.from?"<small>vanaf </small>":""}${eur(p.price)}</div>
     ${stockHTML(p)}
     <p class="desc">${p.desc}</p>
     ${p.swatches?`<div><span class="opt-label">Glazuur</span><div class="swatches">${GLAZES.map((g,ix)=>`<button class="sw" data-sw="${g.n}" aria-pressed="${ix===0}"><i style="background:${g.c}"></i>${g.n.split(" (")[0]}</button>`).join("")}</div></div>`:""}
     ${p.gift?`<div><span class="opt-label">Bedrag</span><div class="swatches">${[25,50,75].map((v,ix)=>`<button class="sw" data-amt="${v}" aria-pressed="${ix===0}" style="padding:0 1rem">€ ${v}</button>`).join("")}</div></div>`:""}
     <div class="buyrow">
       ${(p.made||p.gift)?`<div class="qty"><button data-q="-1" aria-label="Eén minder">−</button><span id="qvQ">1</span><button data-q="1" aria-label="Eén meer">+</button></div>`:""}
       <button class="btn btn-dark" id="qvAdd" ${(!p.made&&!p.gift&&inCart(p.id)>=p.stock)?"disabled":""}>${(!p.made&&!p.gift&&inCart(p.id)>=p.stock)?"Zit al in je mandje":"In mijn mandje"}</button>
     </div>
     <div class="unique"><b>Elk stuk is uniek.</b> Kleine verschillen in vorm en glazuur zijn geen fout maar het bewijs dat het met de hand gemaakt is.</div>
     <div class="acc">
       <details open><summary>Afmetingen</summary><p>${p.dims}</p></details>
       <details><summary>Onderhoud</summary><p>Spoel na gebruik met lauw water en een zachte spons. Elise geeft bij elk stuk advies over vaatwasser en microgolf mee.</p></details>
       <details><summary>Verzending &amp; afhalen</summary><p>Zorgvuldig verpakt verzonden in België, of af te halen na afspraak. Stukken op bestelling: timing in overleg. (voorbeeldtekst)</p></details>
     </div>
   </div></div>`;
  d.showModal();
  d.onclick=e=>{
    if(e.target===d||e.target.closest("[data-close]")){d.close();return}
    const sw=e.target.closest("[data-sw]"); if(sw){$$("#qv [data-sw]").forEach(b=>b.setAttribute("aria-pressed",b===sw));opt=sw.dataset.sw}
    const am=e.target.closest("[data-amt]"); if(am){$$("#qv [data-amt]").forEach(b=>b.setAttribute("aria-pressed",b===am));opt="€ "+am.dataset.amt;$("#qvPrice").textContent=eur(+am.dataset.amt);$("#qv .gf3").textContent="€ "+am.dataset.amt}
    const qb=e.target.closest("[data-q]"); if(qb){q=Math.max(1,Math.min(10,q+ +qb.dataset.q));$("#qvQ").textContent=q}
    if(e.target.closest("#qvAdd")){const price=p.gift?+(opt.replace("€ ","")):p.price;addToCart(p.id,q,p.swatches?"Glazuur: "+opt:p.gift?"Waarde "+opt:"",price);d.close()}
  };
}
/* checkout (mock) */
function openCO(){
  closeCart(); const d=$("#co"); let step=1; const t=totals();
  const side=()=>`<p class="eyebrow">Je bestelling</p>${cart.map(i=>{const p=P.find(x=>x.id===i.id);return `<div class="mini"><div class="th">${p.gift?"":`<img src="${IMG[p.img]}" alt="" style="object-position:${p.pos}">`}</div><div class="t">${p.name}<br><small style="color:var(--ink-2)">${i.q} × ${eur(i.price)}</small></div><b>${eur(i.price*i.q)}</b></div>`}).join("")}
    <div class="tot" style="margin-top:1rem"><span>Subtotaal</span><span>${eur(t.sub)}</span></div><div class="tot" id="coShip"><span>Verzending</span><span>${t.ship?eur(t.ship):"Gratis"}</span></div><div class="tot big"><span>Totaal</span><span id="coTot">${eur(t.tot)}</span></div>`;
  const steps=["Gegevens","Levering","Betalen"];
  const body=()=>step===4?`<div class="thanks"><div class="ok">✓</div><h2>Bedankt voor je bestelling!</h2><p style="color:var(--ink-2);margin:.8rem auto 1.4rem;max-width:26rem">Je ontvangt zo een bevestiging per e-mail. Elise pakt je stuk met zorg in — of neemt contact op voor je bestelling op maat.</p><button class="btn btn-dark" data-close>Verder kijken</button><p style="font-size:.8rem;color:var(--ink-2);margin-top:1rem">(Mock-up: er is niets besteld of betaald.)</p></div>`:
   `<p class="eyebrow">Afrekenen</p><h2 style="font-size:2rem">${steps[step-1]}</h2>
    <ol class="stepper">${steps.map((s,ix)=>`<li class="${ix+1===step?"on":ix+1<step?"done":""}">${ix+1}. ${s}</li>`).join("")}</ol>
    ${step===1?`<div class="fgrid2"><label class="field">Voornaam<input autocomplete="given-name" placeholder="Voornaam"></label><label class="field">Achternaam<input autocomplete="family-name" placeholder="Achternaam"></label><label class="field full">E-mailadres<input type="email" autocomplete="email" placeholder="jouw@email.be"></label><label class="field full">Straat en nummer<input autocomplete="street-address" placeholder="Straat en nummer"></label><label class="field">Postcode<input autocomplete="postal-code" placeholder="2000"></label><label class="field">Gemeente<input autocomplete="address-level2" placeholder="Gemeente"></label></div>`:""}
    ${step===2?`<div class="choice"><label><input type="radio" name="dl" value="ship" checked><span class="c-t"><b>Verzenden met bpost</b><span>Zorgvuldig verpakt · 2–4 werkdagen</span></span><b>${t.ship?eur(t.ship):"Gratis"}</b></label><label><input type="radio" name="dl" value="pick"><span class="c-t"><b>Afhalen na afspraak</b><span>Elise stuurt je een berichtje met de details</span></span><b>Gratis</b></label></div>`:""}
    ${step===3?`<div class="choice"><label><input type="radio" name="pm" checked><span class="c-t"><b>Bancontact</b><span>Betaal met je bankkaart of de app</span></span></label><label><input type="radio" name="pm"><span class="c-t"><b>Payconiq</b><span>Scan en klaar</span></span></label><label><input type="radio" name="pm"><span class="c-t"><b>Visa / Mastercard</b><span>Kredietkaart</span></span></label></div>`:""}
    <div class="co-nav">${step>1?`<button class="btn btn-line" data-back>← Terug</button>`:`<button class="btn btn-line" data-close>Verder shoppen</button>`}<button class="btn btn-glaze" data-next>${step===3?"Bestelling plaatsen":"Volgende →"}</button></div>`;
  const draw=()=>{d.innerHTML=`<button class="x" data-close aria-label="Sluiten">×</button><div class="co"><div class="main">${body()}</div><div class="side">${side()}</div></div>`};
  draw(); d.showModal();
  d.onclick=e=>{
    if(e.target===d||e.target.closest("[data-close]")){d.close();return}
    if(e.target.closest("[data-next]")){if(step===3){step=4;cart=[];save();draw();return}step++;draw()}
    if(e.target.closest("[data-back]")){step--;draw()}
  };
  d.onchange=e=>{if(e.target.name==="dl"){const pick=e.target.value==="pick";$("#coShip").lastElementChild.textContent=pick||!t.ship?"Gratis":eur(t.ship);$("#coTot").textContent=eur(pick?t.sub:t.tot)}};
}
/* toast */
let tt;function toast(m,withBtn){$("#toastTxt").textContent=m;$("#toastBtn").style.display=withBtn?"":"none";$("#toast").classList.add("on");clearTimeout(tt);tt=setTimeout(()=>$("#toast").classList.remove("on"),3200)}

/* events */
document.addEventListener("click",e=>{
  const a=e.target.closest("[data-add]"); if(a){addToCart(a.dataset.add);return}
  const o=e.target.closest("[data-open]"); if(o){openQV(o.dataset.open);return}
  const h=e.target.closest("[data-wish-id]"); if(h){const id=h.dataset.wishId;wish=wish.includes(id)?wish.filter(x=>x!==id):[...wish,id];save();toast(wish.includes(id)?"Bewaard bij je favorieten ♡":"Verwijderd uit je favorieten");return}
  const c=e.target.closest("[data-cat]"); if(c){state.cat=c.dataset.cat;state.wishOnly=false;renderChips();renderGrid();return}
  if(e.target.closest("[data-wish]")){state.wishOnly=!state.wishOnly;renderChips();renderGrid();return}
  const f=e.target.closest("[data-filter]"); if(f){state.cat=f.dataset.filter;state.wishOnly=false;renderChips();renderGrid()}
  const inc=e.target.closest("[data-inc]"); if(inc){const i=cart[+inc.dataset.inc];const p=P.find(x=>x.id===i.id);if(p.made||p.gift||inCart(p.id)<p.stock){i.q++;save()}return}
  const dec=e.target.closest("[data-dec]"); if(dec){const i=cart[+dec.dataset.dec];i.q--;if(i.q<1)cart.splice(+dec.dataset.dec,1);save();return}
  const rm=e.target.closest("[data-rm]"); if(rm){cart.splice(+rm.dataset.rm,1);save();return}
  if(e.target.closest("#checkout")){openCO();return}
  if(e.target.closest("#emptyShop")){closeCart()}
});
document.addEventListener("keydown",e=>{if((e.key==="Enter"||e.key===" ")&&e.target.matches(".ph[data-open]")){e.preventDefault();openQV(e.target.dataset.open)}if(e.key==="Escape"&&$("#drawer").classList.contains("on"))closeCart()});
$("#cartBtn").onclick=openCart; $("#mcOpen").onclick=openCart; $("#toastBtn").onclick=()=>{$("#toast").classList.remove("on");openCart()};
$("#closeCart").onclick=closeCart; $("#scrim").onclick=closeCart;
$("#sort").onchange=e=>{state.sort=e.target.value;renderGrid()};
$("#onlyStock").onchange=e=>{state.only=e.target.checked;renderGrid()};
$("#wishBtn").onclick=()=>{state.wishOnly=true;state.cat="alles";renderChips();renderGrid();location.hash="";document.getElementById("shop").scrollIntoView()};
$("#searchBtn").onclick=()=>{const sb=$("#searchbar");sb.classList.toggle("open");$("#searchBtn").setAttribute("aria-expanded",sb.classList.contains("open"));if(sb.classList.contains("open"))$("#q").focus()};
document.getElementById("newsForm").onsubmit=e=>{e.preventDefault();toast("Bedankt! Je hoort het als eerste.")};
$("#q").oninput=e=>{state.q=e.target.value.trim();renderGrid()};
$("#searchForm").onsubmit=e=>{e.preventDefault();document.getElementById("shop").scrollIntoView()};
$("#menuBtn").onclick=()=>{const m=$("#mnav");const o=m.classList.toggle("open");$("#menuBtn").setAttribute("aria-expanded",o)};
$$("#mnav a").forEach(a=>a.onclick=()=>{$("#mnav").classList.remove("open");$("#menuBtn").setAttribute("aria-expanded","false")});
addEventListener("scroll",()=>$("#top").classList.toggle("scrolled",scrollY>40),{passive:true});
/* active nav */
const secs=["shop","op-bestelling","atelier","elise"].map(id=>document.getElementById(id));
const io2=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting)$$(".nav a").forEach(a=>a.classList.toggle("on",a.getAttribute("href")==="#"+en.target.id))}),{rootMargin:"-45% 0px -50% 0px"});
secs.forEach(s=>io2.observe(s));
/* reveal */
const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));

renderChips();renderGrid();renderCart();
