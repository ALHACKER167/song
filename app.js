// ===== SPLASH =====
function enterSite(){document.getElementById('splash').classList.add('gone');window.scrollTo(0,0);}
// particles
(function(){const c=document.getElementById('pts');for(let i=0;i<60;i++){const p=document.createElement('div');p.className='pt';p.style.cssText=`left:${Math.random()*100}%;animation-duration:${4+Math.random()*8}s;animation-delay:${Math.random()*6}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;opacity:${0.3+Math.random()*0.6}`;c.appendChild(p);}})();

// ===== BUILD ALPHABET =====
function buildGrid(id,data,showEx){
  const g=document.getElementById(id);
  data.forEach(d=>{
    const c=document.createElement('div');c.className='lcard';
    c.onclick=()=>speak(d.l||d.r||'');
    c.innerHTML=`<span class="lk">${d.k}</span><div class="ll">${d.l}</div>${showEx&&d.ex?`<div class="le">${d.ex}</div>`:''}`;
    g.appendChild(c);
  });
}
buildGrid('cGrid',CONSONANTS,true);
buildGrid('vGrid',VOWELS,true);
buildGrid('dGrid',DIGITS,false);

// ===== VOCAB =====
const vCats=Object.keys(VOCAB);
const vtabs=document.getElementById('vtabs');
vCats.forEach((cat,i)=>{
  const b=document.createElement('button');
  b.className='vtab'+(i===0?' on':'');
  b.textContent=cat;
  b.onclick=()=>showVocab(cat,b);
  vtabs.appendChild(b);
});
function showVocab(cat,btn){
  document.querySelectorAll('.vtab').forEach(b=>b.classList.remove('on'));
  btn.classList.add('on');
  const g=document.getElementById('vgrid');g.innerHTML='';
  VOCAB[cat].forEach(v=>{
    const c=document.createElement('div');c.className='vcard';
    c.innerHTML=`<div class="vk">${v.k}</div><div class="vr">${v.r}</div><div class="vm">${v.m}</div><div class="vex">${v.ex}</div><button class="vsnd" onclick="event.stopPropagation();speak('${v.r}')">🔊 Dengar</button>`;
    c.onclick=()=>speak(v.r);
    g.appendChild(c);
  });
}
showVocab(vCats[0],vtabs.firstChild);

// ===== PHRASES =====
const acc=document.getElementById('phraseAcc');
PHRASES.forEach((p,i)=>{
  const rows=p.rows.map(r=>`<tr><td>${r.k}</td><td>${r.r}</td><td>${r.i}</td><td>${r.n}</td></tr>`).join('');
  const item=document.createElement('div');item.className='pitem';item.id='pi'+i;
  item.innerHTML=`<div class="phead" onclick="toggleP(${i})"><div><div class="pcat">${p.cat}</div><div class="ptit">${p.title}</div></div><div class="pchev">⌄</div></div><div class="pbody"><table class="ptable"><thead><tr><th>Khmer</th><th>Cara Baca</th><th>Artinya</th><th>Catatan</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  acc.appendChild(item);
});
function toggleP(i){document.getElementById('pi'+i).classList.toggle('open');}

// ===== NUMBERS =====
const ng=document.getElementById('nGrid');
NUMBERS.forEach(n=>{
  const c=document.createElement('div');c.className='ncard';
  c.onclick=()=>speak(n.r);
  c.innerHTML=`<div class="nnum">${n.n}</div><div class="nk">${n.k}</div><div class="nr">${n.r}</div><div class="nm">${n.m}</div>`;
  ng.appendChild(c);
});

// ===== GRAMMAR =====
const gg=document.getElementById('gramGrid');
GRAMMAR.forEach(g=>{
  const c=document.createElement('div');c.className='gcard';
  c.innerHTML=`<div class="gt">${g.ico} ${g.title}</div><div class="gb">${g.body}</div><div class="gex"><span class="ek">${g.k}</span><span class="er">${g.r}</span><span class="ei">${g.i}</span></div>`;
  gg.appendChild(c);
});

// ===== SONGS =====
const sg=document.getElementById('songGrid');
SONGS.forEach(s=>{
  const rows=s.lyrics.map(l=>`<tr><td>${l.k}</td><td>${l.r}</td><td>${l.i}</td><td>${l.n}</td></tr>`).join('');
  const card=document.createElement('div');card.className='scard';
  card.innerHTML=`<div class="s-head"><div class="s-cover">${s.emoji}</div><div class="s-info"><h3>${s.title}</h3><h4>${s.titleIndo}</h4><p>🎤 ${s.singer} &nbsp;·&nbsp; ${s.desc}</p></div></div><div class="s-body"><div style="font-size:.78rem;color:var(--t4);font-style:italic;margin-bottom:1rem">📌 Tabel berisi: Lirik Khmer asli | Cara baca (transliterasi) | Terjemahan Indonesia | Catatan arti kata</div><table class="ltable"><thead><tr><th>🇰🇭 Lirik Khmer</th><th>🔤 Cara Baca</th><th>🇮🇩 Terjemahan</th><th>📚 Catatan</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  sg.appendChild(card);
});

// ===== QUIZ =====
const QDATA=[];
Object.values(VOCAB).forEach(arr=>arr.forEach(v=>{if(v.m&&v.m.length>1)QDATA.push({k:v.k,r:v.r,ans:v.m});}));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
let qPool=shuffle([...QDATA]),qIdx=0,score=0,total=0,answered=false;
const TOTAL_Q=20;
function loadQ(){
  answered=false;
  if(qIdx>=qPool.length){qPool=shuffle([...QDATA]);qIdx=0;}
  const q=qPool[qIdx];
  document.getElementById('qNum').textContent=`Soal ${Math.min(total+1,TOTAL_Q)} dari ${TOTAL_Q}`;
  document.getElementById('qK').textContent=q.k;
  document.getElementById('qL').textContent=q.r;
  document.getElementById('qFeed').textContent='';
  document.getElementById('qFeed').style.color='';
  document.getElementById('qprog').style.width=((total/TOTAL_Q)*100)+'%';
  // build options
  const pool=QDATA.filter(x=>x.ans!==q.ans).map(x=>x.ans);
  const wrongs=shuffle(pool).slice(0,3);
  const opts=shuffle([q.ans,...wrongs]);
  const oc=document.getElementById('qOpts');oc.innerHTML='';
  opts.forEach(o=>{
    const b=document.createElement('button');b.className='qopt';b.textContent=o;
    b.onclick=()=>checkQ(o,q.ans,b);
    oc.appendChild(b);
  });
}
function checkQ(ans,correct,btn){
  if(answered)return;answered=true;total++;
  if(ans===correct){score++;btn.classList.add('ok');document.getElementById('qFeed').textContent='✅ Benar! Bagus sekali!';document.getElementById('qFeed').style.color='#4fff90';}
  else{btn.classList.add('ng');document.getElementById('qFeed').textContent='❌ Salah! Jawaban: '+correct;document.getElementById('qFeed').style.color='#ff8888';document.querySelectorAll('.qopt').forEach(b=>{if(b.textContent===correct)b.classList.add('ok');});}
  document.getElementById('qScore').textContent=`Pertanyaan ${Math.min(total+1,TOTAL_Q)} dari ${TOTAL_Q}  |  Skor: ${score}`;
  document.getElementById('qprog').style.width=((total/TOTAL_Q)*100)+'%';
  if(total>=TOTAL_Q){document.getElementById('qNext').textContent='🏆 Lihat Hasil';document.getElementById('qNext').onclick=showResult;}
}
function nextQ(){if(total>=TOTAL_Q){showResult();return;}qIdx++;loadQ();}
function showResult(){const pct=Math.round((score/TOTAL_Q)*100);document.getElementById('qOpts').innerHTML='';document.getElementById('qK').textContent='🏆';document.getElementById('qL').textContent='Kuis Selesai!';document.getElementById('qFeed').textContent=`Skor kamu: ${score}/${TOTAL_Q} (${pct}%)`;document.getElementById('qFeed').style.color=pct>=70?'#4fff90':'#FFD700';document.getElementById('qNum').textContent=pct>=80?'Luar biasa! Kamu hebat!':pct>=50?'Bagus! Terus belajar!':'Jangan menyerah! Coba lagi!';}
function resetQ(){qPool=shuffle([...QDATA]);qIdx=0;score=0;total=0;answered=false;document.getElementById('qNext').textContent='Pertanyaan Berikutnya →';document.getElementById('qNext').onclick=nextQ;document.getElementById('qScore').textContent='Pertanyaan 1 dari 20  |  Skor: 0';loadQ();}
loadQ();

// ===== PROVERBS =====
const pg=document.getElementById('provGrid');
PROVERBS.forEach(p=>{
  const c=document.createElement('div');c.className='provcard';
  c.innerHTML=`<div class="pq">"</div><div class="pk">${p.k}</div><div class="pr">${p.r}</div><div class="pi">${p.i}</div><div class="pm">💡 ${p.m}</div>`;
  pg.appendChild(c);
});

// ===== CULTURE =====
const cg=document.getElementById('cultGrid');
CULTURES.forEach(c=>{
  const card=document.createElement('div');card.className='ccard';
  card.innerHTML=`<span class="cico">${c.ico}</span><div class="ctit">${c.title}</div><div class="cdesc">${c.desc}</div><div class="ckhm">${c.khm}</div>`;
  cg.appendChild(card);
});

// ===== SPEECH =====
function speak(text){
  if(!text)return;
  try{const u=new SpeechSynthesisUtterance(text);u.lang='km-KH';u.rate=0.85;speechSynthesis.cancel();speechSynthesis.speak(u);}catch(e){}
  showToast('🔊 '+text);
}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200);}

// ===== SCROLL REVEAL =====
const obs=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');}});},{threshold:0.08});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ===== MOBILE MENU =====
function toggleMenu(){const n=document.querySelector('.nav-links');n.style.display=n.style.display==='flex'?'none':'flex';n.style.flexDirection='column';n.style.position='absolute';n.style.top='62px';n.style.left='0';n.style.right='0';n.style.background='rgba(5,3,0,.98)';n.style.padding='1rem';}
