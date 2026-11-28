// Интерфейс: двухуровневая навигация, рюкзак, магазин, мастерская, рисунки лодок.
(()=>{if(!document.head)return;const s=document.createElement('style');s.textContent=`#sub{display:flex;gap:5px;overflow-x:auto;padding:2px 2px 8px}#sub button{flex:0 0 auto;font-size:8px;padding:7px 10px;box-shadow:none;border-width:2px}
.pill{display:flex;gap:4px;overflow-x:auto;margin-bottom:8px}.pill button{flex:1 0 auto;font-size:8px;padding:7px 8px;border-width:2px;box-shadow:none}
.card{border:3px solid var(--ln);background:var(--pn);padding:8px;margin-bottom:8px}
#hb{position:fixed;top:calc(env(safe-area-inset-top,0px) + 8px);left:8px;z-index:6;width:44px;height:44px;font-size:20px;padding:0}
#dr{position:fixed;top:0;left:0;bottom:0;width:80%;max-width:330px;background:var(--pn);border-right:3px solid var(--ln);z-index:30;transform:translateX(-106%);transition:transform .2s;overflow:auto;padding:calc(env(safe-area-inset-top,0px) + 12px) 10px 24px}
#dr.open{transform:none}#dbk{position:fixed;inset:0;background:#000a;z-index:29;display:none}#dbk.open{display:block}
#dr .dh{display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:10px;font:10px 'Press Start 2P',monospace}
#dr .di{display:flex;align-items:center;gap:12px;width:100%;text-align:left;font-size:10px;padding:13px 8px;margin:3px 0;box-shadow:none;background:transparent;color:var(--ink);border:2px solid transparent}
#dr .di.on{border-color:var(--ln);background:#e8602c33}#dr .ic2{font-size:20px;width:26px;text-align:center}
#pbar{position:fixed;top:0;left:0;right:0;z-index:8;display:flex;align-items:center;gap:8px;padding:calc(env(safe-area-inset-top,0px) + 8px) 10px 8px;background:var(--bg);border-bottom:3px solid var(--ln)}
#pbar b{flex:1;font:10px 'Press Start 2P',monospace}#pbar button{width:44px;height:40px;padding:0;font-size:16px}
#pn.page{position:fixed;inset:0;z-index:7;overflow:auto;margin:0;border:0;box-shadow:none;background:var(--bg);padding:calc(env(safe-area-inset-top,0px) + 64px) 12px calc(env(safe-area-inset-bottom,0px) + 24px)}
#pn.page>*{max-width:560px;margin-left:auto;margin-right:auto}
#toast{position:fixed;left:50%;bottom:calc(env(safe-area-inset-bottom,0px) + 22px);transform:translateX(-50%) translateY(30px);max-width:88%;background:var(--ln);color:#fff;padding:10px 14px;font-size:12px;font-weight:bold;border:2px solid #fff;z-index:40;opacity:0;pointer-events:none;transition:all .2s}
#toast.show{opacity:1;transform:translateX(-50%)}`;document.head.appendChild(s)})();
const MENU=[['inv','🎣','Рыбалка и рюкзак'],['shop','🏪','Магазин'],['gear','🔧','Мастерская'],['map','🗺','Карта'],['col','📖','Коллекция рыб'],['look','👕','Образ'],['house','🏠','Дом'],['pond','🐟','Пруд'],['chat','💬','Чат'],['mkt','🤝','Рынок'],['top','🏆','Топ игроков'],['fr','👥','Друзья']];
let HB,DR,BK,PB,TE,TO;
function toast(t){if(!document.body)return;if(!TE){TE=document.createElement('div');TE.id='toast';document.body.appendChild(TE)}TE.textContent=t;TE.classList.add('show');clearTimeout(TO);TO=setTimeout(()=>TE.classList.remove('show'),2800)}
function drawerOpen(o){if(!DR)return;DR.innerHTML='<div class="dh"><b>🎣 ПИКСЕЛЬНЫЙ РЫБАК</b><button id="dx" class="g">✕</button></div>'+MENU.map(m=>`<button class="di ${tab==m[0]?'on':''}" data-n="${m[0]}"><span class="ic2">${m[1]}</span>${m[2]}</button>`).join('')+'<p class="mu" style="margin-top:14px">🪙 '+fm(S.c)+' · '+rankInfo().n+'</p>';DR.classList.toggle('open',o);BK.classList.toggle('open',o)}
function go(t){tab=t;drawerOpen(false);render();const pn=$('#pn');if(pn)pn.scrollTop=0;try{window.scrollTo(0,0)}catch(e){}}
function navDraw(){const pg=tab!='inv',pn=$('#pn');pn.classList.toggle('page',pg);if(PB){PB.hidden=!pg;const m=MENU.find(x=>x[0]==tab);const t=$('#pbt');if(t)t.textContent=m?m[1]+' '+m[2]:''}if(HB)HB.hidden=pg;if(document.body)document.body.style.overflow=pg?'hidden':'';$('#nav').innerHTML='';$('#sub').innerHTML=''}
function navInit(){if(!document.body||HB)return;HB=document.createElement('button');HB.id='hb';HB.textContent='☰';BK=document.createElement('div');BK.id='dbk';DR=document.createElement('div');DR.id='dr';PB=document.createElement('div');PB.id='pbar';PB.innerHTML='<button id="pbm">☰</button><b id="pbt"></b><button id="pbx" class="g">✕</button>';PB.hidden=true;[HB,BK,DR,PB].forEach(e=>document.body.appendChild(e));
HB.onclick=()=>drawerOpen(true);BK.onclick=()=>drawerOpen(false);DR.onclick=e=>{if(e.target.closest('#dx'))return drawerOpen(false);const b=e.target.closest('[data-n]');if(b)go(b.dataset.n)};PB.onclick=e=>{if(e.target.closest('#pbm'))drawerOpen(true);else if(e.target.closest('#pbx'))go('inv')}}
function popup(ic,t,tx){$('#mc').innerHTML=`<div class="ic">${ic}</div><h2>${t}</h2><p>${tx}</p><button id="ok">ОК</button>`;$('#md').hidden=false;$('#ok').onclick=()=>{$('#md').hidden=true}}
const row=(i,t,s,b)=>`<div class="rw">${i||''}<span><b>${t}</b>${s?'<br><small>'+s+'</small>':''}</span>${b||''}</div>`,bt=(a,t,c)=>`<button class="${c||''}" data-a="${a}">${t}</button>`;
function invTab(){const gr={};S.inv.forEach(x=>{const a=gr[x.i]=gr[x.i]||{n:0,s:0,w:0};a.n++;a.s+=x.p;a.w+=x.w});const ks=Object.keys(gr),tot=S.inv.reduce((a,x)=>a+x.p,0);
$('#pn').innerHTML='<h3>🎒 Улов</h3>'+(ks.length?ks.map(k=>row(im(k,36),F[k].n+' ×'+gr[k].n,lab(F[k].t)+' · '+gr[k].w.toFixed(1)+' кг · ~'+fm(gr[k].s/gr[k].n)+'🪙/шт',bt('sell,'+k,fm(gr[k].s)+'🪙'))).join('')+bt('sa','💰 ПРОДАТЬ ВСЁ · '+fm(tot)+'🪙','wide'):'<p class="mu">Пусто. Иди ловить!</p>')}
function baitTab(){const sl=(a,on)=>bt(a,on?'✔':'ВЗЯТЬ',on?'on':'g');
$('#pn').innerHTML='<h3>🪱 Наживка</h3><p class="mu">Ускоряет клёв и повышает шанс на хорошую рыбу. Чем дороже, тем лучше. Расходуется на каждый заброс.</p>'+row('','Без наживки','клёв медленный, много мусора',sl('sel,-1',S.sel<0))+ord(BAITS,'price').map(([b,i])=>row('',b.n+' ×'+S.b[i],'клёв ×'+b.spd+(b.rare?' · редкая рыба +'+Math.round(b.rare*100)+'%':''),sl('sel,'+i,S.sel==i))).join('')
+'<h3>🌾 Прикормка</h3><p class="mu">Привлекает крупную рыбу: чем дороже, тем выше шанс на редкий и дорогой улов.</p>'+row('','Без прикормки','',sl('cs,-1',S.cs<0))+ord(CH,'price').map(([c,i])=>row('',c.n+' ×'+S.ch[i],'редкая рыба +'+Math.round(c.rare*100)+'%',sl('cs,'+i,S.cs==i))).join('')
+'<p class="mu">⚠ Без наживки и без прикормки дорогая рыба почти не клюёт, а мифическая не клюёт совсем.</p>'}
let shk='bait';
const SHOP=[['bait','🪱 Наживка'],['chum','🌾 Прикормка'],['rod','🎣 Удочки'],['line','🧵 Лески'],['reel','⚙ Катушки'],['boat','⛵ Лодки'],['deco','🎨 Декор'],['don','💎 Донат']];
const pillsH=(L,cur,at)=>'<div class="pill" style="flex-wrap:wrap">'+L.map(a=>`<button class="g ${cur==a[0]?'on':''}" data-${at}="${a[0]}">${a[1]}</button>`).join('')+'</div>';
function shopList(k){
if(k=='bait')return ord(BAITS,'price').map(([b,i])=>row('',b.n+' (есть '+S.b[i]+')','клёв ×'+b.spd+(b.rare?' · редкая +'+Math.round(b.rare*100)+'%':'')+(b.tx?' · '+b.tx:''),bt('bb,'+i+',1','+1 · '+b.price+'🪙')+' '+bt('bb,'+i+',5','+5'))).join('');
if(k=='chum')return ord(CH,'price').map(([c,i])=>row('',c.n+' (есть '+S.ch[i]+')','редкая рыба +'+Math.round(c.rare*100)+'%',bt('cb,'+i+',1','+1 · '+c.price+'🪙')+' '+bt('cb,'+i+',5','+5'))).join('');
if(k=='rod')return rodRows();
if(k=='line')return lineRows();
if(k=='reel')return reelRows();
if(k=='boat')return '<p class="mu">Надувная лодка и плоскодонка — для мелководья. Моря — только катер или яхта, океаны — только яхта.</p>'+BOATS.map((b,i)=>`<div class="card"><img class="px" style="width:100%;max-width:230px;display:block;margin:0 auto 6px" src="${boatImg(i)}">${row('',b.n,'HP '+b.hp+' · '+['мелководье','мелководье','моря и мелководье','океаны'][i],S.boats[i]?(S.boat==i?'<b>ПОД ТОБОЙ</b>':bt('eb,'+i,'ВЗЯТЬ','g')):bt('bo,'+i,fm(b.price)+'🪙'))}</div>`).join('');
if(k=='deco')return decorRows();
return donateRows()}
function shopTab(){$('#pn').innerHTML=pillsH(SHOP,shk,'sk')+shopList(shk);$('#pn').querySelectorAll('[data-sk]').forEach(b=>b.onclick=()=>{shk=b.dataset.sk;shopTab()});bindX()}
function gearTab(){const r=S.rods[S.eq],L=LINES[S.ln.t];let h='<h3>🔧 Мастерская</h3>'+row('','Улучшить «'+RODS[S.eq].n+'»','ур. '+r.l+'/5 · +12% силы и прочности',r.l<5?bt('ur',fm(upc())+'🪙'):'<b>MAX</b>')+'<h3>Ремонт (в долг до −150🪙)</h3>';
Object.keys(S.rods).forEach(i=>{const c=rrc(i);h+=row('','🎣 '+RODS[i].n,Math.ceil(S.rods[i].hp)+'/'+mx(i)+' HP',c?bt('rr,'+i,c+'🪙'):'<small>ОК</small>')});
const lc=lrc();h+=row('','🧵 '+L.n,Math.ceil(S.ln.hp)+'/'+L.hp+' HP',lc?bt('rl',lc+'🪙'):'<small>ОК</small>');
Object.keys(S.boats).forEach(i=>{const c=brc(i);h+=row('','⛵ '+BOATS[i].n,Math.ceil(S.boats[i].hp)+'/'+BOATS[i].hp+' HP',c?bt('rb,'+i,c+'🪙'):'<small>ОК</small>')});$('#pn').innerHTML=h}
const grab=f=>{f();return $('#pn').innerHTML};
const ord=(A,k)=>A.map((x,i)=>[x,i]).sort((a,b)=>a[0][k]-b[0][k]);
const UI={inv:()=>{$('#pn').innerHTML=grab(baitTab)+grab(invTab)},shop:shopTab,gear:gearTab,look:()=>lookTab(),top:()=>topTab()};
function bindX(){$('#pn').querySelectorAll('[data-x]').forEach(b=>b.onclick=()=>xAct(b.dataset.x))}
function xAct(a){const k=a.split(',')[0];if(k=='lk'||k=='lc')lookAct(a);else if(k=='db'||k=='dt')pAct(a);else if(k=='rl')reelAct(a);else if(k=='dn')donateBuy(a.split(',')[1]);else if(k=='rd')redeemCode();else if(k=='tp')pingNow().then(topRefresh)}
// ---- лодки ----
function boatArt(Q,k,x,y){
if(k==0){Q('#c8650a',x+2,y+4,56,2);Q('#f59a23',x+2,y,56,4);Q('#ffc266',x+4,y,52,1);Q('#f59a23',x,y+1,2,3);Q('#f59a23',x+58,y+1,2,3);Q('#9a4a05',x+6,y+6,48,1);Q('#8a5a2b',x+20,y-1,3,2);Q('#8a5a2b',x+38,y-1,3,2);Q('#333',x-2,y+1,3,6);Q('#666',x-3,y+6,3,2);Q('#ddd',x+58,y+4,3,1)}
else if(k==1){Q('#8a5a2b',x+2,y+1,56,3);Q('#a8763a',x+2,y+1,56,1);Q('#6e4620',x+6,y+4,48,3);Q('#8a5a2b',x+58,y,2,2);for(let i=0;i<5;i++)Q('#5a3a18',x+10+i*10,y+1,1,6);Q('#d8b070',x+12,y-5,1,7);Q('#d8b070',x+10,y-6,5,1);Q('#a8763a',x+36,y,8,1)}
else if(k==2){Q('#c83a3a',x+6,y+6,50,2);Q('#f4f4f4',x+2,y+2,56,4);Q('#f4f4f4',x+58,y+1,3,3);Q('#f4f4f4',x+60,y,2,2);Q('#2a6ab8',x+2,y+4,58,1);Q('#e8e8e8',x+38,y-2,12,4);Q('#8ad0f0',x+42,y-5,8,3);Q('#555',x+42,y-5,8,1);Q('#555',x+12,y,10,2);Q('#bbb',x+52,y,6,1);Q('#333',x-2,y+1,4,7);Q('#555',x-3,y+6,3,3)}
else{Q('#1a3a78',x+4,y+10,60,2);Q('#fff',x,y+4,68,6);Q('#fff',x+66,y+2,4,4);Q('#1a3a78',x+2,y+7,66,1);Q('#d8b030',x+2,y+9,66,1);Q('#f0f0f0',x+34,y-3,26,7);for(let i=0;i<4;i++)Q('#2a4a78',x+36+i*6,y-1,4,2);Q('#e8e8e8',x+40,y-7,16,4);Q('#2a4a78',x+42,y-6,12,2);Q('#999',x+48,y-16,1,9);Q('#bbb',x+45,y-12,7,1);Q('#d33',x+49,y-16,4,2);Q('#bbb',x+2,y+2,20,1);Q('#f08a1a',x+22,y+1,8,3)}}
const BIMG={};
function boatImg(k){if(BIMG[k])return BIMG[k];const c=document.createElement('canvas');c.width=76;c.height=30;const g2=c.getContext('2d'),Q=(col,x,y,w,h)=>{g2.fillStyle=col;g2.fillRect(x|0,y|0,w|0,h|0)};Q('#bfe8fc',0,0,76,16);Q('#2c82d0',0,16,76,14);Q('#8fd0f7',6,20,8,1);Q('#8fd0f7',50,24,10,1);boatArt(Q,k,4,[13,13,11,9][k]);return BIMG[k]=c.toDataURL()}
function drawBoat(t){const k=S.boat<0?0:S.boat;boatArt(R,k,2,[49,49,47,45][k]+Math.sin(t/500)*1.2)}
