// Чат, рынок, запросы и друзья. NET_URL пустой → демо-режим (виртуальные игроки, сохраняются на этом телефоне).
// Для настоящего мультиплеера запусти server.py на сервере с HTTPS и впиши адрес, например:
// const NET_URL='https://my-fisher.onrender.com';
const NET_URL='';
let mk='buy',NETD=null,mktL=[],reqL=[],netLast=-12000;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const BAD=/^[а-яё]{0,3}(?:ху[йеёяию]|пизд|[её]б(?:ать|ан|ну|л[оа]|ут|ёт|ет|ыр)|бляд|блят|бляха|бля$|муда[кч]|залуп|пидо?р|гандон|сучар|сук[аие]|шлюх|дроч|мраз|ублюд)/i;
const cens=s=>esc(s).replace(/[а-яёa-z0-9]+/gi,w=>BAD.test(w)?'<span style="filter:blur(5px);user-select:none">'+w+'</span>':w);
const nlog=x=>{S.nlog=S.nlog||[];S.nlog.unshift({t:Date.now(),x});S.nlog.length=Math.min(S.nlog.length,30)};
const cloud=()=>{try{return Telegram.WebApp.CloudStorage}catch(e){return null}};
const cloudSet=(k,v)=>{const c=cloud();if(c&&v.length<3800)try{c.setItem(k,v,()=>{})}catch(e){}};
const cloudGet=k=>new Promise(r=>{const c=cloud();if(!c)return r(null);try{c.getItem(k,(e,v)=>r(e?null:v))}catch(e){r(null)}});
const colCount=()=>Object.keys(S.col||{}).filter(k=>F[k]).length,myScore=()=>lvlN()*1000+colCount()*50+Math.max(0,Math.floor(S.c/100));
const myInfo=()=>({uid:me().id,name:me().name,rank:rankInfo().n,lvl:lvlN(),coins:Math.floor(S.c),col:colCount(),score:myScore()});
function me(){let T=null;try{T=Telegram.WebApp.initDataUnsafe.user}catch(e){}if(!S.uid)S.uid=T?'t'+T.id:'u'+Math.random().toString(36).slice(2,9);return{id:S.uid,name:(T&&T.first_name)||'Рыбак '+S.uid.slice(-3)}}
function demoLoad(){if(!NETD){try{NETD=JSON.parse(localStorage.getItem('pfdemo'))}catch(e){}if(!NETD)demoInit()}}
function netInit(){me();setTimeout(pingNow,1200);try{const bye=()=>{if(NET_URL&&navigator.sendBeacon)navigator.sendBeacon(NET_URL+'/api/ping',new Blob([JSON.stringify(myInfo())],{type:'application/json'}))};document.addEventListener('visibilitychange',()=>{if(document.hidden)bye()});addEventListener('pagehide',bye)}catch(e){}if(!NET_URL)cloudGet('pfchat').then(v=>{if(!v)return;try{demoLoad();const ids=new Set(NETD.chat.map(m=>m.id));JSON.parse(v).forEach(m=>{if(!ids.has(m.id))NETD.chat.push(m)});NETD.chat.sort((a,b)=>a.id-b.id);demoSave()}catch(e){}})}
async function netCall(path,body){if(!NET_URL)return demoCall(path,body);
try{const r=await fetch(NET_URL+path,{method:body?'POST':'GET',headers:{'Content-Type':'application/json'},body:body?JSON.stringify(body):undefined});return await r.json()}catch(e){return{err:'Нет связи с сервером'}}}
// ---- демо-режим: хранится в localStorage, ничего не пропадает после перезагрузки ----
const demoSave=()=>{try{localStorage.setItem('pfdemo',JSON.stringify(NETD))}catch(e){}try{cloudSet('pfchat',JSON.stringify(NETD.chat.slice(-15)))}catch(e){}};
function demoInit(){const nm=['Ерофей','Алёна','Capitan_Vova','Сибиряк','Лена_Байкал','Дед Мазай'],D=NETD={id:100,chat:[],mk:[],rq:[],inbox:[]};
const pk_=()=>{let f;do f=F[Math.random()*F.length|0];while(f.t<0||f.t>4);return f};
for(let k=0;k<7;k++){const f=pk_();D.mk.push({id:D.id++,uid:'bot',name:nm[k%6],i:f.id,w:+(f.w0+Math.random()*(f.w1-f.w0)).toFixed(2),price:Math.round(f.p*(.8+Math.random()*1.2))})}
for(let k=0;k<3;k++){const f=pk_();D.rq.push({id:D.id++,uid:'bot',name:nm[(k+2)%6],i:f.id,price:Math.round(f.p*(1.5+Math.random()))})}
['Всем привет! Кто на Байкале?','Поймал осётра, продаю на рынке','Кому нужна нельма — заплачу дорого'].forEach((x,k)=>D.chat.push({id:D.id++,name:nm[k],text:x}))}
function demoTick(){const D=NETD,now=Date.now(),id=me().id;
D.mk=D.mk.filter(x=>{if(x.uid==id&&x.due&&x.due<=now){D.inbox.push({kind:'coins',n:Math.floor(x.price*.95),i:x.i,by:'Ерофей'});return 0}return 1});
D.rq=D.rq.filter(x=>{if(x.uid==id&&x.due&&x.due<=now){const f=F[x.i];D.inbox.push({kind:'fish',i:x.i,w:+(f.w0+Math.random()*(f.w1-f.w0)).toFixed(2),by:'Алёна'});return 0}return 1})}
function demoCall(p,b){demoLoad();demoTick();const D=NETD,u=p.split('?')[0],find=l=>D[l].findIndex(x=>x.id==(b&&b.id));let r;
if(u=='/api/chat'){if(b){D.chat.push({id:D.id++,name:b.name,text:b.text});D.chat=D.chat.slice(-200);r={ok:1}}else r={list:D.chat.slice(-40)}}
else if(u=='/api/market'){if(b){const id=D.id++;D.mk.push({id,...b,due:Date.now()+60000+Math.random()*120000});r={ok:1,id}}else r={list:D.mk}}
else if(u=='/api/market/buy'||u=='/api/market/cancel'){const k=find('mk');r=k<0?{err:'Лот уже продан'}:{ok:1,item:D.mk.splice(k,1)[0]}}
else if(u=='/api/req'){if(b){const id=D.id++;D.rq.push({id,...b,due:Date.now()+90000+Math.random()*120000});r={ok:1,id}}else r={list:D.rq}}
else if(u=='/api/req/fill'||u=='/api/req/cancel'){const k=find('rq');r=k<0?{err:'Запрос уже закрыт'}:{ok:1,price:D.rq.splice(k,1)[0].price}}
else if(u=='/api/inbox'){r={items:D.inbox};D.inbox=[]}
else if(u=='/api/ping')r={ok:1,...demoStats()};
else if(u=='/api/stats')r=demoStats();
else if(u=='/api/top')r={list:demoTop((p.split('by=')[1]||'score'))};
else r={list:[],ok:1};
demoSave();return r}
// ---- игроки, онлайн и топ (в демо-режиме игроки виртуальные) ----
const DN=['Ерофей','Алёна','Capitan_Vova','Сибиряк','Лена_Байкал','Дед Мазай','Рыбак_Миша','Тамара','Щукин','Кот_Мурзик','Волга-матушка','Акулов','Нептун','Ловец','Золотая_Рыбка','Баренц','Иваныч','Дагестанец','Камчатка','Север','Атлантида','Морской_волк','Поплавок','Карасёв','Удачник','Спиннингист','Сомов','Окунёк','Судак_Павел','Ладога'];
const rankAt=l=>{let r=RANKS[0][1];RANKS.forEach(a=>{if(l>=a[0])r=a[1]});return r};
function demoPlayers(){const out=[];for(let i=0;i<30;i++){const lvl=2+((i*37+11)%38),col=5+((i*53+7)%110),coins=(((i*7919+13)%900)+20)*(lvl*12);out.push({uid:'bot'+i,name:DN[i],rank:rankAt(lvl),lvl,col,coins,score:lvl*1000+col*50+Math.floor(coins/100),online:((i*7+Math.floor(Date.now()/90000))%4)==0})}return out.concat([{...myInfo(),online:true}])}
const kingOf=p=>{const c=p.filter(x=>x.lvl>=40).sort((a,b)=>b.score-a.score)[0];return c?c.uid:''};
const demoStats=()=>{const p=demoPlayers();return{total:p.length,online:p.filter(x=>x.online).length,king:kingOf(p)}};
const demoTop=by=>{const p=demoPlayers(),k=kingOf(p);return p.sort((a,b)=>b[by]-a[by]).slice(0,20).map(x=>({...x,king:x.uid==k}))};
let pingLast=-60000,lastCol=-1,pingFail=0;const pingState={ok:0,t:0,err:''};
const lsGet=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
async function pingNow(){const r=await netCall('/api/ping',myInfo());
if(!r||!r.ok){pingState.ok=0;pingState.err=(r&&r.err)||'нет ответа';if(NET_URL&&pingFail++<6)setTimeout(pingNow,8000+pingFail*4000);return r}
pingFail=0;pingState.ok=1;pingState.t=Date.now();pingState.err='';
const was=!!S.king;S.king=r.king===me().id;if(S.king!=was){sv();hdr();popup(S.king?'👑':'😢',S.king?'Ты — Абсолютный Король Рыбалки!':'Тебя обогнали',S.king?'Ты первый в рейтинге. Звание твоё, пока тебя никто не обгонит.':'Звание Короля перешло к другому игроку. Догоняй!')}
const c=lsGet('pftop');if(NET_URL&&c&&c.total>=5&&r.total<c.total*.6){await netCall('/api/restore',{players:c.list,chat:lsGet('pfchat2')||[]});lsSet('pftop',{total:r.total,list:c.list})}return r}
async function topRefresh(){const[s,t]=await Promise.all([netCall('/api/stats'),netCall('/api/top?by=score&n=200')]);const B=$('#tpb');if(!B)return;if(t.err||s.err){B.innerHTML='<p class="bd">⚠ '+esc(t.err||s.err)+'</p>';return}const id=me().id,all=t.list||[],tt=all.slice(0,20),pos=all.findIndex(x=>x.uid==id);if(NET_URL&&all.length)lsSet('pftop',{total:s.total,list:all.slice(0,200)});
const ps=pingState.ok?'✔ твои данные отправлены в '+new Date(pingState.t).toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'}):'⚠ твои данные не отправлены'+(pingState.err?' ('+esc(pingState.err)+')':'');
B.innerHTML='<p>👥 Игроков в игре: <b>'+(s.total==null?'—':s.total)+'</b> · 🟢 сейчас онлайн: <b>'+(s.online==null?'—':s.online)+'</b></p><p class="mu">'+ps+(pos>=0?' · твоё место: <b>#'+(pos+1)+'</b>':' · тебя пока нет в списке')+'</p><button class="g" data-x="tp">🔄 ОБНОВИТЬ</button>'+(tt.map((x,i)=>`<div class="rw" style="${x.uid==id?'background:#e8602c33':''}"><b style="width:34px">${i<3?['🥇','🥈','🥉'][i]:i+1}</b><span><b>${cens(x.name)}</b> ${x.king?'👑':''}${x.online?'🟢':''}<br><small>${esc(x.king?'Абсолютный Король Рыбалки':x.rank)} · ур. ${x.lvl} · 💰 ${fm(x.coins)} · 📖 ${x.col||0}/${F.length} рыб</small></span><b>${fm(x.score)}</b></div>`).join('')||'<p class="mu">Список пуст.</p>');bindX()}
function topTab(){$('#pn').innerHTML='<h3>🏆 Топ игроков</h3><p class="mu">'+(NET_URL?'':'Демо-режим: другие игроки виртуальные. ')+'Рейтинг = уровень×1000 + рыбы в коллекции×50 + монеты/100.</p><div id="tpb"></div>';pingNow().then(topRefresh)}
// ---- чат ----
async function chatRefresh(){const r=await netCall('/api/chat');if(!r.list){const e=$('#cl');if(e&&r.err)e.innerHTML='<small>⚠ '+esc(r.err)+'</small>';return}if(NET_URL&&r.list.length)lsSet('pfchat2',r.list.slice(-40));const e=$('#cl');if(e){e.innerHTML=r.list.map(m=>'<div><b>'+cens(m.name)+':</b> '+cens(m.text)+'</div>').join('')||'<small>Пока тихо…</small>';e.scrollTop=e.scrollHeight}}
function chatTab(){const r=rankInfo();$('#pn').innerHTML=`<h3>💬 Общий чат</h3><p class="mu">${NET_URL?'':'Демо-режим: сервер не подключён, собеседники виртуальные, а сообщения сохраняются только на этом телефоне. '}Ты: ${esc(me().name)} · ${r.n}. Грубые слова скрываются. ${NET_URL?'История хранится на сервере.':'История хранится на этом телефоне.'}</p><div id="cl" style="height:220px;overflow:auto;border:2px solid var(--ln);padding:6px;font-size:12px"></div><div class="ch" style="margin-top:6px;flex-wrap:nowrap"><input id="cin" maxlength="200" placeholder="Сообщение…" style="flex:1;min-width:0;padding:8px;font:inherit;border:3px solid var(--ln);background:var(--pn);color:var(--ink)"><button id="csd">➤</button></div>`;
$('#csd').onclick=async()=>{const i=$('#cin'),t=i.value.trim();if(!t)return;i.value='';const r=await netCall('/api/chat',{uid:me().id,name:me().name+' ['+rankInfo().n+']',text:t.slice(0,200)});if(r.err)say(r.err);chatRefresh()};chatRefresh()}
// ---- рынок ----
const fishOK=i=>F[i]&&((F[i].t>=0&&F[i].t<5)||F[i].t==6);
const inp='padding:6px;font:inherit;background:var(--pn);color:var(--ink);border:2px solid var(--ln)';
let mBusy=0;
async function mktRefresh(){const[a,b]=await Promise.all([netCall('/api/market'),netCall('/api/req')]);if(a.err)say(a.err);mktL=(a.list||[]).filter(x=>F[x.i]);reqL=(b.list||[]).filter(x=>F[x.i]);mktDraw()}
function mktTab(){$('#pn').innerHTML='<div class="pill" id="mks">'+[['buy','🛒 Купить'],['sell','💰 Продать'],['req','📋 Запросы'],['mine','👤 Мои']].map(a=>`<button class="g ${mk==a[0]?'on':''}" data-m="${a[0]}">${a[1]}</button>`).join('')+'</div><p class="mu">'+(NET_URL?'':'Демо-режим: лоты виртуальные и хранятся на этом телефоне. ')+'Комиссия рынка 5%.</p><div id="mkb"></div>';
$('#mks').querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{mk=b.dataset.m;mktTab()});mktRefresh()}
function mktDraw(){const B=$('#mkb');if(!B)return;const id=me().id,keep={};B.querySelectorAll('input,select').forEach(e=>{if(e.id)keep[e.id]=e.value});let h='';
if(mk=='buy')h=(mktL.filter(x=>x.uid!=id).map(x=>`<div class="rw">${im(x.i,32)}<span><b>${F[x.i].n}</b> · ${x.w} кг<br><small>${cens(x.name)}</small></span><button data-k="buy" data-id="${x.id}">${fm(x.price)}🪙</button></div>`).join('')||'<p class="mu">Лотов пока нет.</p>');
if(mk=='sell')h='<p class="mu">Выбери рыбу из рюкзака и назначь цену:</p>'+(S.inv.map((v,j)=>fishOK(v.i)?`<div class="rw">${im(v.i,32)}<span><b>${F[v.i].n}</b> · ${v.w} кг<br><input id="sp${j}" type="number" min="1" value="${v.p*2}" style="width:90px;${inp}"> 🪙</span><button data-k="sell" data-id="${j}" data-i="${v.i}" data-w="${v.w}">ВЫСТАВИТЬ</button></div>`:'').join('')||'<p class="mu">В рюкзаке нет рыбы.</p>');
if(mk=='req')h='<h3>Хочу купить</h3><div class="ch" style="flex-wrap:nowrap"><select id="rq_i" style="flex:1;min-width:0;'+inp+'">'+F.filter(f=>fishOK(f.id)).map(f=>`<option value="${f.id}">${f.n}</option>`).join('')+'</select><input id="rq_p" type="number" min="1" placeholder="цена" style="width:80px;'+inp+'"></div><button class="wide" data-k="rnew">ОПУБЛИКОВАТЬ ЗАПРОС</button><p class="mu">Деньги замораживаются, пока запрос не выполнят или ты его не отменишь. Когда кто-то выполнит запрос, рыба придёт к тебе сама — смотри «Мои → История».</p><h3>Запросы игроков</h3>'
+(reqL.filter(x=>x.uid!=id).map(x=>{const has=S.inv.some(v=>v.i==x.i);return `<div class="rw">${im(x.i,32)}<span><b>${F[x.i].n}</b><br><small>${cens(x.name)} платит ${fm(x.price)}🪙</small></span>${has?`<button data-k="fill" data-id="${x.id}">ОТДАТЬ</button>`:'<small>нет рыбы</small>'}</div>`}).join('')||'<p class="mu">Запросов пока нет.</p>');
if(mk=='mine')h='<h3>Мои лоты</h3>'+(mktL.filter(x=>x.uid==id).map(x=>`<div class="rw">${im(x.i,32)}<span><b>${F[x.i].n}</b> · ${x.w} кг<br><small>${fm(x.price)}🪙</small></span><button class="g" data-k="mcan" data-id="${x.id}">СНЯТЬ</button></div>`).join('')||'<p class="mu">Нет лотов.</p>')+'<h3>Мои запросы</h3>'+(reqL.filter(x=>x.uid==id).map(x=>`<div class="rw">${im(x.i,32)}<span><b>${F[x.i].n}</b><br><small>плачу ${fm(x.price)}🪙</small></span><button class="g" data-k="rcan" data-id="${x.id}">ОТМЕНИТЬ</button></div>`).join('')||'<p class="mu">Нет запросов.</p>')
+'<h3>История</h3>'+((S.nlog||[]).slice(0,15).map(n=>`<div class="rw"><small>${new Date(n.t).toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'})}</small><span>${esc(n.x)}</span></div>`).join('')||'<p class="mu">Пока пусто.</p>');
B.innerHTML=h;Object.keys(keep).forEach(i=>{const e=B.querySelector('#'+i);if(e&&keep[i]!=='')e.value=keep[i]});
B.onclick=e=>{const b=e.target.closest('[data-k]');if(b)mAct(b.dataset.k,+b.dataset.id,b.dataset)}}
async function mAct(k,x,ds){if(mBusy)return;mBusy=1;try{await mAct2(k,x,ds||{})}catch(e){say('Рынок: что-то пошло не так, попробуй ещё раз')}finally{mBusy=0}sv();hdr();mktRefresh()}
async function mAct2(k,x,ds){const u=me();let r;
if(k=='buy'){const it=mktL.find(q=>q.id==x);if(!it)return say('Лот уже недоступен');if(S.c<it.price)return say('Не хватает монет 🪙');r=await netCall('/api/market/buy',{id:x,uid:u.id});if(r.ok){S.c-=it.price;S.inv.push({i:it.i,w:it.w,p:Math.round(F[it.i].p*.8)});say('Куплено: '+F[it.i].n+' 🎣');nlog('Куплено: '+F[it.i].n+' за '+fm(it.price)+'🪙')}else say(r.err)}
else if(k=='sell'){let j=x;const it0=S.inv[j];if(!it0||it0.i!=+ds.i||it0.w!=+ds.w)j=S.inv.findIndex(v=>v.i==+ds.i&&v.w==+ds.w);const it=S.inv[j],p=Math.round(+($('#sp'+x)||{}).value);if(!it)return say('Этой рыбы уже нет в рюкзаке');if(!(p>=1&&p<=1e7))return say('Укажи цену от 1 до 10 000 000');r=await netCall('/api/market',{uid:u.id,name:u.name,i:it.i,w:it.w,price:p});if(r.ok){const q=S.inv.findIndex(v=>v===it);if(q>=0)S.inv.splice(q,1);say('Лот выставлен: '+fm(p)+'🪙');nlog('Выставлен лот: '+F[it.i].n+' за '+fm(p)+'🪙')}else say(r.err)}
else if(k=='mcan'){r=await netCall('/api/market/cancel',{id:x,uid:u.id});if(r.ok&&F[r.item.i]){S.inv.push({i:r.item.i,w:r.item.w,p:Math.round(F[r.item.i].p*.8)});say('Лот снят, рыба вернулась в рюкзак');nlog('Лот снят: '+F[r.item.i].n)}else say(r.err||'Лот не найден')}
else if(k=='rnew'){const i=+$('#rq_i').value,p=Math.round(+$('#rq_p').value);if(!F[i])return say('Выбери рыбу');if(!(p>=1&&p<=1e7))return say('Укажи цену от 1 до 10 000 000');if(S.c<p)return say('Не хватает монет 🪙');r=await netCall('/api/req',{uid:u.id,name:u.name,i,price:p});if(r.ok){S.c-=p;say('Запрос опубликован, деньги заморожены');nlog('Запрос на '+F[i].n+': готов заплатить '+fm(p)+'🪙')}else say(r.err)}
else if(k=='rcan'){r=await netCall('/api/req/cancel',{id:x,uid:u.id});if(r.ok){S.c+=r.price;say('Запрос отменён, деньги вернулись');nlog('Запрос отменён, возвращено '+fm(r.price)+'🪙')}else say(r.err||'Запрос не найден')}
else if(k=='fill'){const q=reqL.find(z=>z.id==x);if(!q)return say('Запрос уже закрыт');const js=S.inv.map((v,j)=>[v,j]).filter(a=>a[0].i==q.i).sort((a,b)=>a[0].w-b[0].w);if(!js.length)return say('У тебя нет такой рыбы');const it=js[0][0];r=await netCall('/api/req/fill',{id:x,uid:u.id,w:it.w});if(r.ok){const j=S.inv.findIndex(v=>v===it);if(j>=0)S.inv.splice(j,1);S.c+=r.price;say('Запрос выполнен: +'+fm(r.price)+'🪙');nlog('Выполнен запрос: '+F[q.i].n+' → +'+fm(r.price)+'🪙')}else say(r.err)}}
// ---- входящие (продажи, запросы, награды за друзей) ----
async function netTick(ts){const cc=colCount();if(ts-pingLast>45000||cc!=lastCol){pingLast=ts;lastCol=cc;pingNow()}if(ts-netLast<12000)return;netLast=ts;const r=await netCall('/api/inbox?uid='+encodeURIComponent(me().id));
if(r.items&&r.items.length){r.items.forEach(it=>{if(it.kind=='coins'){S.c+=it.n;const m='Продан лот'+(it.i!=null?' «'+F[it.i].n+'»':'')+': +'+fm(it.n)+'🪙';say('Рынок: '+m);nlog(m)}
else if(it.kind=='fish'){S.inv.push({i:it.i,w:it.w,p:Math.round(F[it.i].p*.8)});const m='Твой запрос выполнен: получена рыба «'+F[it.i].n+'»'+(it.by?' (от '+it.by+')':'');say(m+' 🐟');nlog(m)}
else if(it.kind=='ref'){S.c+=it.n;(S.rf=S.rf||[]).push(it.name||'Друг');const m='Друг '+(it.name||'')+' зашёл в игру: +'+it.n+'🪙';say('👥 '+m);nlog(m);popup('👥','Друг в игре!','+'+it.n+'🪙 за приглашение: '+esc(it.name||'друг')+' зашёл в игру.')}});sv();hdr()}
const typing=document.activeElement&&/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName||'');
if(tab=='chat'&&!typing)chatRefresh();else if(tab=='mkt'&&!typing&&!mBusy)mktRefresh()}
// ---- друзья: награда 300🪙 начисляется автоматически, когда друг зашёл ----
function frTab(){const T=tgInfo(),n=(S.rf||[]).length;
$('#pn').innerHTML=`<h3>👥 Друзья</h3><p>Отправь другу свою ссылку. Когда он зайдёт в игру, вы <b>оба сразу получите по 300🪙</b>, ничего подтверждать не нужно.</p>`+(NET_URL?'':'<p class="bd">⚠ Сервер не подключён: друг получит свои 300🪙, но тебе награда придёт только при работающем сервере (см. net.js).</p>')
+`<p class="mu">Друзей засчитано: <b>${n}</b></p>`+(S.rf||[]).map((x,i)=>`<div class="rw"><span>👤 ${esc(typeof x=='string'?x:'Друг №'+(i+1))}</span><b>+300🪙</b></div>`).join('')+(S.rb?'<p class="mu">Ты пришёл по приглашению друга.</p>':'')
+(T?'<button class="wide" id="iv">👥 ПРИГЛАСИТЬ ДРУГА</button>':'<p class="mu">Приглашения работают внутри Телеграма.</p>');
if(T)$('#iv').onclick=()=>shr('r'+T.id,'Заходи в «Пиксельный Рыбак» 🎣 — лови рыбу и получи 300🪙 в подарок!')}
function refs(){const T=tgInfo(),m=T&&/^r([0-9]+)$/.exec(T.sp);if(!m||S.rb)return;const inv='t'+m[1];if(inv==me().id)return;
S.rb=inv;S.c+=300;sv();upd2();netCall('/api/ref',{inviter:inv,friend:me().id,name:me().name});popup('🎁','Тебя пригласил друг!','+300🪙 тебе в подарок. Твой друг тоже получит 300🪙.')}
