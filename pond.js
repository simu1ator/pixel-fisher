// Пруд: рыбы растут, стареют и умирают, размножаются, вода портится от тесноты. Декорации. Выведенные рыбы (🍼) стоят на 5% дороже.
const FEED=[{n:'Комбикорм',p:2,m:1},{n:'Гранулы+',p:6,m:1.6},{n:'Витаминный микс',p:15,m:2.4}];
const POND_SZ=[4,8,14,22,35,50,70,100,150,220],POND_SZP=[0,150,500,1500,5000,12000,30000,70000,150000,350000];
const FILT=[{n:'Без фильтра',d:1,p:0},{n:'Сетка',d:.7,p:80},{n:'Биофильтр',d:.45,p:300},{n:'УФ-стерилизатор',d:.25,p:1000},{n:'Аэратор + УФ',d:.1,p:3500}];
const GROW=[12,20,30,45,60],LIFE=[720,960,1200,1800,2400]; // минут до роста / до старости, по редкости
const DECOR=[{n:'Камни',p:80,k:'rock',v:[14,70,42,16]},{n:'Водоросли',p:100,k:'weed',cl:.05,v:[42,56,50,30]},{n:'Кувшинки',p:150,k:'lily',cl:.05,v:[64,16,46,14]},{n:'Коряга',p:200,k:'log',v:[98,58,44,22]},{n:'Ракушки',p:120,k:'shell',v:[56,72,58,14]},{n:'Утка',p:350,k:'duck',v:[34,12,40,18]},{n:'Мостик',p:450,k:'bridge',v:[52,6,56,28]},{n:'Фонарики на берегу',p:700,k:'lamp',v:[0,0,26,32]},{n:'Фонтанчик',p:600,k:'fount',cl:.05,v:[60,0,40,28]},{n:'Водолаз',p:900,k:'diver',v:[24,50,40,32]},{n:'Затонувший корабль',p:1500,k:'ship',v:[92,42,48,42]},{n:'Сундук с сокровищами',p:2000,k:'chest',v:[40,60,24,26]},{n:'Подводный замок',p:2500,k:'castle',v:[46,36,52,50]},{n:'Неоновая подсветка',p:3000,k:'neon',v:[4,22,152,66]},{n:'Статуя дракона',p:4000,k:'dragon',v:[102,40,44,46]}];
let pk='view';
const CAP=()=>POND_SZ[S.pd.lv.size];
const lifeOf=i=>LIFE[F[i].t]*(.8+Math.random()*.4);
const pondOK=i=>F[i].t>=0&&F[i].t<5;
function newFish(i,w,b){const q=F[i];return{i,w:+w.toFixed(3),mx:+(b?q.w0+(q.w1-q.w0)*(.5+Math.random()*.5):Math.max(w*1.12,q.w1*(.95+Math.random()*.25))).toFixed(2),age:b?0:Math.random()*lifeOf(i)*.3,life:lifeOf(i),b:b?1:0}}
const pbase=f=>{const q=F[f.i];return Math.max(1,Math.round(q.p*(.25+.9*Math.min(1,f.w/f.mx))))};
const pval=f=>f.d?Math.max(1,Math.round(f.dv*.04)):f.b?Math.max(pbase(f)+1,Math.round(pbase(f)*1.05)):pbase(f);
const ready=f=>!f.d&&(f.w>=f.mx*.95||f.age>=f.life*.85);
const cleanCost=()=>Math.ceil(15+S.pd.fish.length*4.5);
function modInit(){houseInit();S.pd=S.pd||{t:Date.now(),q:100,lv:{size:0,filter:0},feed:[10,0,0],fs:0,fish:[]};S.pd.dec=S.pd.dec||{own:[],on:[]};
S.pd.fish.forEach(f=>{if(f.mx==null){f.mx=+Math.max(f.w,F[f.i].w1*1.1).toFixed(2);f.age=f.age||0;f.life=lifeOf(f.i)}
if(!f.g2&&!f.d&&!f.b&&f.w>=f.mx*.97){f.mx=+Math.max(f.w*1.12,F[f.i].w1*1.15).toFixed(2);f.g2=1}});
worldInit();contentInit();content2Init();lookInit();inflate();navInit();netInit();houseWear();pondTick()}
function kill(f){f.dv=pval(f);f.d=1}
function pondTick(){const p=S.pd,now=Date.now();let dm=Math.min((now-p.t)/60000,720);if(dm<1/6)return;p.t=now;
const n=Math.ceil(dm),st=dm/n,born=[],aged=[],dirty=[],cl=1-Math.min(.3,p.dec.on.reduce((s,i)=>s+(DECOR[i].cl||0),0));
for(let k=0;k<n;k++){const live=p.fish.filter(f=>!f.d),dead=p.fish.length-live.length,fc=live.length,crowd=1+Math.max(0,fc/CAP()-.6)*5;
 p.q=Math.max(0,p.q-.03*(fc+3*dead)*crowd*FILT[p.lv.filter].d*cl*st);
 const need=fc/10*st;let mul=0;if(fc&&p.feed[p.fs]>=need){p.feed[p.fs]-=need;mul=FEED[p.fs].m}
 const qf=p.q<25?.3:p.q<60?.7:1;
 live.forEach(f=>{const q=F[f.i];f.age+=st;f.w=Math.min(f.mx,f.w+Math.max(.01,f.mx-q.w0*.1)/GROW[q.t]*mul*qf*st);
  if(f.age>f.life&&Math.random()<.03*st){kill(f);aged.push(F[f.i].n)}else if(p.q<10&&Math.random()<.004*st){kill(f);dirty.push(F[f.i].n)}});
 if(p.q>60&&mul&&p.fish.length<CAP()){const cnt={};p.fish.forEach(f=>{if(!f.d&&f.w>=f.mx*.7)cnt[f.i]=(cnt[f.i]||0)+1});
  for(const i in cnt)if(cnt[i]>=2&&Math.random()<.06*st&&p.fish.length<CAP()){p.fish.push(newFish(+i,Math.max(.003,F[i].w0*.1),1));born.push(F[i].n)}}}
const u=a=>[...new Set(a)].join(', ');
if(aged.length||dirty.length)say((aged.length?'🕯 Умерли от старости: '+u(aged)+'. ':'')+(dirty.length?'💀 Погибли из-за грязной воды: '+u(dirty)+'. ':'')+'Продай их и посади новых.');else if(born.length)say('🍼 В пруду родились мальки: '+u(born));sv()}
function pondStat(){const p=S.pd,live=p.fish.filter(f=>!f.d),dead=p.fish.length-live.length,rd=live.filter(ready),bn=live.filter(f=>f.b).length,tight=live.length/CAP()>.6;
return `🐟 Живых: <b>${live.length}/${CAP()}</b>${bn?' · 🍼 выведено: <b>'+bn+'</b>':''}${dead?' · ☠ мёртвых: <b>'+dead+'</b>':''}<br>✅ Готово к продаже: <b>${rd.length}</b> на <b>${fm(rd.reduce((s,f)=>s+pval(f),0))}🪙</b>${tight?'<br>⚠ Тесновато: вода портится быстрее':''}${live.length&&p.feed[p.fs]<live.length/10?'<br>⚠ Корм закончился — рыбы не растут':''}${p.q<60&&live.length?'<br>⚠ Грязная вода замедляет рост':''}<br>💧 Чистота воды ${Math.round(p.q)}%${bar(p.q/100)}🍽 Корм (${FEED[p.fs].n}): <b>${Math.floor(p.feed[p.fs])}</b>`}
const DIMG={};
function decoImg(k){if(DIMG[k])return DIMG[k];const d=DECOR.find(x=>x.k==k),v=d.v,c=document.createElement('canvas');c.width=v[2];c.height=v[3];const Y=c.getContext('2d'),Q=(col,x,y,w,h)=>{Y.fillStyle=col;Y.fillRect(x|0,y|0,w|0,h|0)};
Y.translate(-v[0],-v[1]);Q('#9bd6fa',0,0,160,20);Q('#5fae5f',0,16,160,8);Q('#2c82d0',6,24,148,62);Y.globalAlpha=.25;Q('#001a40',6,56,148,30);Y.globalAlpha=1;Q('#c8b078',6,82,148,4);decoDraw(Y,Q,500,k);return DIMG[k]=c.toDataURL()}
function decorList(){const d=S.pd.dec;return DECOR.map((x,i)=>[x,i]).sort((a,b)=>a[0].p-b[0].p).map(([x,i])=>`<div class="rw"><img class="px" style="width:${Math.min(96,x.v[2]*2)}px;border:2px solid var(--ln);flex:none" src="${decoImg(x.k)}"><span><b>${x.n}</b>${x.cl?'<br><small>вода чище на '+x.cl*100+'%</small>':''}</span>${d.own.includes(i)?`<button class="${d.on.includes(i)?'':'g'}" data-x="dt,${i}">${d.on.includes(i)?'УБРАТЬ':'ПОСТАВИТЬ'}</button>`:`<button data-x="db,${i}">${fm(x.p)}🪙</button>`}</div>`).join('')}
const decorRows=()=>'<p class="mu">Купи один раз и ставь или убирай, когда хочется. Водоросли, кувшинки и фонтанчик ещё и очищают воду.</p>'+decorList();
function pAct(a){const[k,x,y]=a.split(','),p=S.pd,i=+x;
if(k=='pk'){pk=x;return upd2()}
if(k=='fs')p.fs=i;
else if(k=='bf'){const c=FEED[i].p*+y;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.feed[i]+=+y}
else if(k=='cl'){const c=cleanCost();if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.q=100;say('Пруд почищен 🧽')}
else if(k=='up'){const l=p.lv.size+1,c=POND_SZP[l];if(l>=POND_SZ.length||S.c<c)return say(l>=POND_SZ.length?'Максимум':'Не хватает монет 🪙');S.c-=c;p.lv.size=l;say('Пруд расширен до '+POND_SZ[l]+' рыб')}
else if(k=='ft'){const l=p.lv.filter+1,c=FILT[l]&&FILT[l].p;if(!c||S.c<c)return say(c?'Не хватает монет 🪙':'Максимум');S.c-=c;p.lv.filter=l;say('Установлено: '+FILT[l].n)}
else if(k=='st'){if(p.fish.length>=CAP())return say('В пруду нет места — расширь его или продай мёртвых');const its=S.inv.filter(v=>v.i==i).sort((a,b)=>a.w-b.w);if(!its.length)return;S.inv.splice(S.inv.indexOf(its[0]),1);p.fish.push(newFish(i,its[0].w,0));say('Рыба посажена в пруд 🐟')}
else if(k=='sr'||k=='sa'||k=='sd'){let e=0,n=0;p.fish=p.fish.filter(f=>{const hit=k=='sd'?f.d:(ready(f)&&(k=='sa'||(f.i==i&&!!f.b==(y=='1'))));if(hit){e+=pval(f);n++;return 0}return 1});S.c+=e;say(n?'Продано '+n+' рыб: +'+fm(e)+'🪙':'Подходящих рыб пока нет')}
else if(k=='db'){const c=DECOR[i].p;if(S.c<c)return say('Не хватает монет 🪙');S.c-=c;p.dec.own.push(i);p.dec.on.push(i);say('Куплено и поставлено: '+DECOR[i].n+' 🎨')}
else if(k=='dt'){const d=p.dec;if(d.on.includes(i))d.on=d.on.filter(z=>z!=i);else d.on.push(i)}
sv();upd2()}
function pondTab(){pondTick();const p=S.pd,live=p.fish.filter(f=>!f.d),rd=live.filter(ready),rdV=rd.reduce((s,f)=>s+pval(f),0),totV=p.fish.reduce((s,f)=>s+pval(f),0);
let h='<div class="pill">'+[['view','🏞 Пруд'],['fish','🐟 Рыбы'],['care','🍽 Уход'],['up','⬆ Улучшения'],['dec','🎨 Декор']].map(a=>`<button class="g ${pk==a[0]?'on':''}" data-p="pk,${a[0]}">${a[1]}</button>`).join('')+'</div>';
const sellAll=rd.length?`<button class="wide" data-p="sa">💰 ПРОДАТЬ ГОТОВЫХ · ${fm(rdV)}🪙</button>`:'';
if(pk=='view')h+=`<canvas id="pc" width="160" height="90" style="width:100%;image-rendering:pixelated;border:3px solid var(--ln)"></canvas><div id="pst">${pondStat()}</div><p class="mu">🍼 — рыбы, рождённые в твоём пруду, стоят на 5% дороже. Рыбы стареют и умирают (чаще от старости, реже от грязной воды), а когда в пруду тесно, вода портится быстрее.</p>`+sellAll;
else if(pk=='fish'){const gr={};p.fish.forEach(f=>{const key=f.i+(f.b?'b':'')+(f.d?'d':''),a=gr[key]=gr[key]||{i:f.i,b:f.b?1:0,d:f.d?1:0,n:0,w:0,m:0,r:0,v:0,rv:0,left:1e9};a.n++;a.w+=f.w;a.m+=f.mx;a.v+=pval(f);a.left=Math.min(a.left,f.life-f.age);if(ready(f)){a.r++;a.rv+=pval(f)}});
 h+=`<p class="mu">Всего в пруду на <b>${fm(totV)}🪙</b>, готовых к продаже на <b>${fm(rdV)}🪙</b>. Продаются полностью выросшие и старые рыбы.</p>`+sellAll+(Object.values(gr).sort((a,b)=>a.d-b.d).map(a=>a.d?`<div class="rw"><span style="flex:none;filter:grayscale(1);opacity:.6">${im(a.i,34)}</span><span><b>☠ ${F[a.i].n}</b> ×${a.n}<br><small>мёртвые · ~${fm(a.v/a.n)}🪙/шт (4% от прежней цены)</small></span><button class="g" data-p="sd">Продать · ${fm(a.v)}🪙</button></div>`
 :`<div class="rw"><span style="position:relative;flex:none">${im(a.i,34)}${a.b?'<span style="position:absolute;right:-6px;top:-8px;font-size:13px">🍼</span>':''}</span><span><b>${F[a.i].n}</b> ×${a.n}${a.b?' · выведены тобой':''}<br><small>ср. вес ${(a.w/a.n).toFixed(2)} кг (${Math.round(a.w/a.m*100)}% от взрослого) · ~${fm(a.v/a.n)}🪙/шт · готово ${a.r}${a.left<240?' · старость через ~'+Math.max(0,Math.round(a.left/60*10)/10)+' ч':''}</small></span>${a.r?`<button data-p="sr,${a.i},${a.b}">Продать ${a.r} шт · ${fm(a.rv)}🪙</button>`:`<small>растёт…<br>всего ${fm(a.v)}🪙</small>`}</div>`).join('')||'<p class="mu">Пруд пуст.</p>');
 const bk={};S.inv.forEach(v=>{if(pondOK(v.i))bk[v.i]=(bk[v.i]||0)+1});
 h+='<h3>Посадить из рюкзака</h3>'+(Object.keys(bk).map(i=>`<div class="rw">${im(i,32)}<span>${F[i].n} ×${bk[i]}</span><button data-p="st,${i}">В ПРУД</button></div>`).join('')||'<p class="mu">В рюкзаке нет подходящей рыбы (мусор, клады и мифические рыбы в пруд не посадить).</p>')}
else if(pk=='care')h+=`<div id="pst">${pondStat()}</div><h3>Корм</h3><div class="ch">${FEED.map((f,i)=>`<button class="g ${p.fs==i?'on':''}" data-p="fs,${i}">${f.n} ×${Math.floor(p.feed[i])}</button>`).join('')}</div><p class="mu">Чем лучше корм, тем быстрее растут рыбы: ×${FEED.map(f=>f.m).join(' / ×')}.</p><div class="ch">${FEED.map((f,i)=>`<button data-p="bf,${i},10">+10 · ${f.p*10}🪙</button>`).join('')}</div><button class="wide g" data-p="cl">🧽 ПОЧИСТИТЬ ПРУД · ${cleanCost()}🪙</button>`;
else if(pk=='up'){const nl=p.lv.size+1<POND_SZ.length,nf=p.lv.filter+1<FILT.length;
 h+=`<div class="rw"><span>📐 Размер: <b>${POND_SZ[p.lv.size]}</b> рыб</span>${nl?`<button data-p="up">${POND_SZ[p.lv.size+1]} рыб · ${fm(POND_SZP[p.lv.size+1])}🪙</button>`:'<b>MAX</b>'}</div><div class="rw"><span>🔧 Фильтр: <b>${FILT[p.lv.filter].n}</b><br><small>чем лучше фильтр, тем реже нужно чистить пруд</small></span>${nf?`<button data-p="ft">${FILT[p.lv.filter+1].n} · ${fm(FILT[p.lv.filter+1].p)}🪙</button>`:'<b>MAX</b>'}</div>`}
else h+='<p class="mu">Декорации можно ставить и убирать. Водоросли, кувшинки и фонтанчик ещё и очищают воду.</p>'+decorList();
$('#pn').innerHTML=h;$('#pn').querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>pAct(b.dataset.p));bindX()}
function decoDraw(Y,Q,t,k){
if(k=='rock'){Q('#5a5a62',17,81,30,3);Q('#6a6a72',18,75,16,9);Q('#8a8a92',19,73,14,9);Q('#a8a8b0',21,73,7,2);Q('#4a8a4a',20,76,5,1);Q('#7a7a82',35,78,11,6);Q('#98989f',36,76,8,4);Q('#b4b4bc',37,76,3,1);Q('#6a6a72',47,80,7,4);Q('#8a8a92',48,79,5,3)}
else if(k=='weed')for(let i=0;i<7;i++){const bx=46+i*6,h=14+(i*5)%12;for(let y=0;y<h;y+=2){const sx=Math.sin(t/500+i+y/5)*2;Q(y%4?'#2f9a4a':'#46c060',bx+sx,84-y,2,2);if(y%6==2)Q('#46c060',bx+2+sx,84-y,2,1)}}
else if(k=='lily')[[68,24],[92,25]].forEach(([x,y])=>{Q('#2a8a40',x,y,13,2);Q('#3fba5a',x+1,y-1,11,1);Q('#2a8a40',x+2,y+2,9,1);Q('#1a6a30',x+6,y,1,2);Q('#ff8ac8',x+4,y-4,5,3);Q('#ffc0e0',x+5,y-5,3,2);Q('#ffe14d',x+6,y-3,1,1);Q('#ff8ac8',x+3,y-3,1,2)});
else if(k=='log'){Q('#4a3018',102,77,34,2);Q('#6a4a2a',104,70,32,8);Q('#7a5a38',104,70,32,2);Q('#5a3a1a',104,75,32,3);for(let i=0;i<5;i++)Q('#4a3018',108+i*6,71,1,6);Q('#8a6a44',102,71,3,7);Q('#4a3018',103,73,1,3);Q('#6a4a2a',126,62,3,9);Q('#6a4a2a',122,60,3,4);Q('#4a8a4a',112,69,8,1);Q('#4a8a4a',128,69,5,1)}
else if(k=='shell'){const fan=(x,y,c,d)=>{for(let i=0;i<5;i++)Q(i%2?d:c,x+i*2,y+Math.abs(2-i),2,6-Math.abs(2-i));Q('#c89aa8',x+3,y+6,4,1)};fan(98,76,'#f6d6e0','#e0a8bc');fan(60,79,'#fff0f4','#e8c0cc');Q('#e8704a',78,80,9,2);Q('#e8704a',81,77,3,8);Q('#e8704a',79,78,2,2);Q('#e8704a',85,78,2,2);Q('#f0a080',82,81,1,1)}
else if(k=='duck'){const x=40+((t/45)%70);Q('#cfeeff',x-3,26,18,1);Q('#f4e460',x,21,11,5);Q('#e8d040',x+1,24,9,2);Q('#f4e460',x+8,16,5,6);Q('#f08a1a',x+13,18,4,2);Q('#222',x+11,17,1,1);Q('#e8d040',x+2,22,5,3);Q('#f4e460',x-2,20,3,3)}
else if(k=='bridge'){Q('#6a4a2a',64,19,3,13);Q('#6a4a2a',96,19,3,13);Q('#5a3a1a',63,28,5,2);Q('#5a3a1a',95,28,5,2);Q('#a8763a',56,17,48,3);Q('#8a5a2b',56,20,48,1);for(let i=0;i<9;i++){Q('#7a4a1a',58+i*5,17,1,3);Q('#8a5a2b',57+i*5.5,11,2,6)}Q('#b8864a',56,10,48,2);Q('#8a5a2b',56,13,48,1)}
else if(k=='lamp')[10,148].forEach((x,j)=>{Q('#222',x,8,2,16);Q('#3a3a3a',x-1,22,4,2);Q('#3a3a3a',x-2,5,6,2);Q('#555',x-1,4,4,1);Q('#ffe08a',x-1,6,4,4);Q('#fff7c0',x,7,2,2);Y.globalAlpha=.22;Q('#ffe08a',x-5,2,12,12);Y.globalAlpha=.12;Q('#ffe08a',x-8,26,18,2+(Math.sin(t/300+j)>0?1:0));Y.globalAlpha=1});
else if(k=='fount'){Q('#6a6a72',62,23,36,3);Q('#9a9aa0',64,19,32,4);Q('#b8b8c0',64,19,32,1);Q('#4ab0f0',66,20,28,2);Q('#9a9aa0',77,12,6,8);Q('#b0b0b8',72,12,16,2);Q('#9a9aa0',78,6,4,6);Q('#b8b8c0',76,5,8,2);for(let a=-1;a<=1;a+=2)for(let j=0;j<5;j++){const ph=(t/160+j*1.3)%6;Q('#cfeeff',80+a*(2+ph*2),4+ph*ph*.6-ph*1.2+j,1,1)}Q('#cfeeff',80,t/60%3,1,6)}
else if(k=='diver'){const x=30+Math.sin(t/900)*8,y=60+Math.sin(t/700)*2;Q('#f0c030',x,y-2,3,9);Q('#d8a010',x,y+4,3,2);Q('#1a1a2a',x+3,y-2,7,10);Q('#2a2a3a',x+3,y,7,2);Q('#1a1a2a',x+10,y-4,5,6);Q('#8ad0f0',x+12,y-3,3,3);Q('#fff',x+12,y-3,1,1);Q('#1a1a2a',x+10,y+3,7,2);Q('#1a1a2a',x+3,y+8,3,8);Q('#1a1a2a',x+7,y+8,3,8);Q('#2aa84a',x+1,y+16,6,2);Q('#2aa84a',x+6,y+17,6,2);for(let i=0;i<3;i++)Q('#cfeeff',x+14+(i%2)*2,y-6-((t/70+i*9)%14),1+i%2,1+i%2)}
else if(k=='ship'){Q('#2f5a2a',96,80,38,3);Q('#4a2a10',98,70,36,11);Q('#5a3a1a',96,66,40,5);Q('#6a4a2a',98,64,36,2);for(let i=0;i<6;i++)Q('#3a2410',100+i*6,67,1,13);[106,116,126].forEach(x=>Q('#8ad0f0',x,69,3,3));Q('#f0c030',106,69,1,1);Q('#3a2410',112,48,3,19);Q('#3a2410',112,48,12,1);Q('#c8c0a8',114,50,10,9);Q('#a8a088',116,56,3,3);Q('#a8a088',121,52,2,4);Q('#222',112,45,7,3);Q('#fff',114,46,2,1);Q('#3a8a4a',122,76,2,5);Q('#3a8a4a',100,77,2,4)}
else if(k=='chest'){Q('#3a2410',43,83,18,2);Q('#8a5a2a',44,75,16,9);Q('#6a4010',44,75,16,1);Q('#7a4a1a',44,79,16,1);Q('#f0c030',44,75,2,9);Q('#f0c030',58,75,2,9);Q('#e8b020',50,78,4,4);Q('#222',51,80,2,2);Q('#9a6a30',43,68,18,3);Q('#7a4a1a',44,66,16,3);Q('#f0c030',43,68,2,3);Q('#f0c030',59,68,2,3);Q('#f0c030',46,72,12,3);Q('#fff0a0',48,72,3,1);Q('#fff0a0',54,73,2,1);Q('#d33',55,71,2,2);Q('#4ab0f0',49,71,2,2);if((t/350|0)%2){Q('#fff',46,66,1,1);Q('#fff',58,70,1,1)}else Q('#fff',52,64,1,1)}
else if(k=='castle'){Q('#7a7a82',50,82,44,3);Q('#9a9aa2',54,64,32,19);for(let i=0;i<4;i++)Q('#8a8a92',54+i*8,63,5,2);Q('#a8a8b0',50,56,9,27);Q('#a8a8b0',81,56,9,27);for(let i=0;i<3;i++){Q('#9a9aa2',50+i*4,54,3,3);Q('#9a9aa2',81+i*4,54,3,3)}Q('#c83a3a',49,50,11,5);Q('#c83a3a',51,46,7,4);Q('#c83a3a',80,50,11,5);Q('#c83a3a',82,46,7,4);Q('#f0c030',54,40,1,8);Q('#d33',55,40,5,3);Q('#f0c030',85,40,1,8);Q('#d33',86,40,5,3);Q('#2a1a0a',64,72,12,11);Q('#2a1a0a',66,70,8,3);Q('#5a3a1a',67,72,1,11);Q('#5a3a1a',72,72,1,11);Q('#222',53,62,2,5);Q('#222',84,62,2,5);Q('#222',60,66,2,4);Q('#222',78,66,2,4);for(let j=0;j<6;j++)Q('#8a8a92',54,66+j*3,32,1);Q('#3a8a4a',56,80,3,3);Q('#3a8a4a',86,79,3,4)}
else if(k=='neon'){const c=['#40e0ff','#ff40c0','#40ff80'][(t/1500|0)%3];Y.globalAlpha=.16;Q(c,6,24,148,62);Y.globalAlpha=.5;Q(c,6,85,148,1);Q(c,6,24,1,62);Q(c,153,24,1,62);Y.globalAlpha=1;Q('#fff',6,85,148,1);Q('#fff',6,24,1,62);Q('#fff',153,24,1,62)}
else if(k=='dragon'){const g1='#7a8a7a',g2='#6a7a6a',g3='#5a6a5a',g4='#9aaa9a',dk='#3a3a42';
Q('#6a6a72',111,83,30,2);Q('#8a8a92',112,80,28,4);Q('#a2a2aa',114,78,24,2);
Q(g1,112,74,10,3);Q(g1,109,71,5,4);Q(g2,107,69,3,3);Q(dk,105,67,3,3);Q(g3,114,76,8,1);
Q(g1,118,72,6,7);Q(dk,117,78,7,1);
for(let i=0;i<13;i++)Q(i%3?g2:g3,115+i*.5,66-i,13-i*.4,1);Q('#4a5a4a',123,52,1,14);Q('#4a5a4a',119,56,1,10);
Q(g1,121,62,14,17);Q(g3,121,72,14,6);Q(g4,123,64,3,12);for(let i=0;i<5;i++)Q(g3,123,65+i*3,3,1);Q('#a8b8a8',122,63,2,2);
Q(g1,132,72,4,7);Q(dk,131,78,5,1);
Q(g1,129,52,5,12);Q(g4,131,54,1,8);Q('#8a9a8a',127,46,10,6);Q('#8a9a8a',136,48,5,3);Q(dk,128,43,2,4);Q(dk,133,43,2,4);Q('#d33',132,48,1,1);Q('#fff',136,51,1,1);Q('#fff',139,51,1,1);
for(let i=0;i<3;i++)Q('#cfeeff',140+i,46-((t/90+i*7)%16),1,1);Q('#3a8a4a',113,80,4,2);Q('#3a8a4a',134,81,4,2)}}
function pondDraw(t){const cv=$('#pc');if(!cv)return;const Y=cv.getContext('2d'),p=S.pd;Y.imageSmoothingEnabled=false;
const Q=(c,x,y,w,h)=>{Y.fillStyle=c;Y.fillRect(x|0,y|0,w|0,h|0)};
Q('#9bd6fa',0,0,160,20);Q('#5fae5f',0,16,160,8);Q(p.q>60?'#2c82d0':p.q>25?'#4a8a6a':'#6a6a3a',6,24,148,62);
Y.globalAlpha=.25;Q('#001a40',6,56,148,30);Y.globalAlpha=1;
Q('#7a5a3a',0,22,6,68);Q('#7a5a3a',154,22,6,68);Q('#7a5a3a',0,86,160,4);Q('#c8b078',6,82,148,4);
Q('#888',20,8,12,10);Q('#c83a3a',18,6,16,3);if(p.feed[p.fs]>=1&&p.fish.some(f=>!f.d))for(let i=0;i<3;i++)Q('#c8a060',24+i*3,20+((t/150+i*5)%20),1,1);
if(p.lv.filter>0){Q('#444',130,6,18,12);Q('#2a2a2a',132,8,14,4);Q('#3af',134,13,3,2);Q('#555',138,18,3,8)}
if(p.lv.filter>=4)for(let i=0;i<8;i++)Q('#cfeeff',100+(i%2)*3,82-((t/60+i*14)%58),1+i%2,1+i%2);
p.dec.on.forEach(i=>{try{decoDraw(Y,Q,t,DECOR[i].k)}catch(e){}});
const N=p.fish.length,sz=Math.max(.55,1-N/260);
p.fish.forEach((f,j)=>{try{const sp=spr(f.i),sc=(.5+Math.min(1.3,(f.w||0)/(f.mx||1))*.9)*sz,w=Math.max(3,Math.floor(sp.width*sc)),h=Math.max(2,Math.floor(sp.height*sc)),rx=(j*.6180339887)%1,ry=(j*.7548776662)%1;
 if(f.d){const x=10+rx*128,y=25;Y.save();Y.globalAlpha=.85;Y.translate(x,y+h);Y.scale(1,-1);Y.drawImage(sp,0,0,w,h);Y.restore();Q('#cfcfd8',x+w/2-1,y-4,2,3);Q('#cfcfd8',x+w/2-2,y-3,4,1);return}
 const x=10+rx*128+Math.sin(t/900+j*1.7)*6,y=30+ry*46+Math.sin(t/700+j)*3;Y.drawImage(sp,x|0,y|0,w,h);
 if(f.b){const hy=y-5,c='#ff6b9a';Q(c,x+1,hy,2,1);Q(c,x+4,hy,2,1);Q(c,x,hy+1,7,1);Q(c,x+1,hy+2,5,1);Q(c,x+2,hy+3,3,1)}}catch(e){}})}
function modLoop(ts){if(tab=='house')houseDraw(ts);else if(tab=='pond'&&pk=='view')pondDraw(ts);netTick(ts);
if(ts-(modLoop.l||0)>4000){modLoop.l=ts;pondTick();houseWear();const a=$('#pst');if(a&&tab=='pond')a.innerHTML=pondStat();if(tab=='house')houseStat()}}
