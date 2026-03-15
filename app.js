// ============================================================
// AL JUNIOR — APP.JS
// ============================================================

// ===== SPLASH =====
function enterSite(){
  document.getElementById('splash').classList.add('gone');
  buildAll();
}
(function(){
  const c=document.getElementById('pts');
  for(let i=0;i<55;i++){
    const p=document.createElement('div');p.className='pt';
    p.style.cssText=`left:${Math.random()*100}%;animation-duration:${4+Math.random()*8}s;animation-delay:${Math.random()*6}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px`;
    c.appendChild(p);
  }
})();

// ===== PAGE NAVIGATION =====
let currentPage = 'home';
function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const pg = document.getElementById('page-'+id);
  if(pg){ pg.classList.add('active'); currentPage=id; window.scrollTo(0,0); }
  document.querySelectorAll('.nav-links a').forEach(a=>a.classList.remove('active-nav'));
}
function nav(id){
  showPage(id);
  closeMobileMenu();
}
function navVocab(e){
  e.preventDefault();
  const sub=document.getElementById('subVocab');
  if(window.innerWidth<=900){
    sub.classList.toggle('open');
  }
}
function showVocabPage(cat){
  showPage('vocab');
  closeMobileMenu();
  setTimeout(()=>selectVocabTab(cat),50);
}

// ===== MOBILE MENU =====
function toggleMenu(){
  const nl=document.getElementById('navLinks');
  nl.classList.toggle('open');
}
function closeMobileMenu(){
  document.getElementById('navLinks').classList.remove('open');
  const sub=document.getElementById('subVocab');
  if(sub) sub.classList.remove('open');
}

// ===== BUILD ALL =====
function buildAll(){
  buildAlpha();
  buildVocabTabs();
  buildSubMenu();
  buildHeroCats();
  buildPhrases();
  buildNumbers();
  buildGrammar();
  buildSongs();
  buildKaraokeUI();
  buildQuiz();
  buildProverbs();
  buildCulture();
}

// ===== ALPHABET =====
function buildAlpha(){
  buildGrid('cGrid',CONSONANTS,true);
  buildGrid('vGrid',VOWELS,true);
  buildGrid('dGrid',DIGITS,false);
}
function buildGrid(id,data,showEx){
  const g=document.getElementById(id); if(!g)return;
  data.forEach(d=>{
    const c=document.createElement('div'); c.className='lcard';
    c.onclick=()=>speak(d.sound||d.l||'');
    c.innerHTML=`<span class="lk">${d.k}</span><div class="ll">${d.l}</div>${showEx&&d.ex?`<div class="le">${d.ex}</div>`:''}`;
    g.appendChild(c);
  });
}

// ===== VOCAB =====
const vCats=Object.keys(VOCAB);
let currentVocabCat = vCats[0];
function buildVocabTabs(){
  const tabs=document.getElementById('vtabs'); if(!tabs)return;
  const sub=document.getElementById('subVocab'); if(!sub)return;
  vCats.forEach((cat,i)=>{
    // tab buttons
    const b=document.createElement('button');
    b.className='vtab'+(i===0?' on':'');
    b.textContent=cat; b.dataset.cat=cat;
    b.onclick=()=>selectVocabTab(cat);
    tabs.appendChild(b);
    // submenu
    const li=document.createElement('li');
    const a=document.createElement('a');
    a.textContent=cat; a.href='#';
    a.onclick=(e)=>{e.preventDefault();showVocabPage(cat);};
    li.appendChild(a); sub.appendChild(li);
  });
  renderVocab(vCats[0]);
}
function buildHeroCats(){
  const cats=[
    {cat:'Salam & Sapaan',emoji:'👋'},
    {cat:'Makanan',emoji:'🍜'},
    {cat:'Minuman',emoji:'🥤'},
    {cat:'Pertanyaan Harian',emoji:'❓'},
    {cat:'Keluarga',emoji:'👨‍👩‍👧'},
    {cat:'Tempat',emoji:'📍'},
    {cat:'Waktu',emoji:'⏰'},
    {cat:'Warna',emoji:'🎨'},
    {cat:'Alam',emoji:'🌿'},
    {cat:'Tubuh',emoji:'🫀'},
    {cat:'Emosi',emoji:'❤️'},
    {cat:'Perjalanan',emoji:'✈️'},
  ];
  const hc=document.getElementById('heroCats'); if(!hc)return;
  cats.forEach(c=>{
    const d=document.createElement('div');d.className='hcat';
    d.innerHTML=`<span>${c.emoji}</span>${c.cat}`;
    d.onclick=()=>showVocabPage(c.cat);
    hc.appendChild(d);
  });
}
function selectVocabTab(cat){
  currentVocabCat=cat;
  document.querySelectorAll('.vtab').forEach(b=>b.classList.toggle('on',b.dataset.cat===cat));
  const title=document.getElementById('vocabTitle');
  if(title) title.innerHTML=`Kosakata <em>${cat}</em>`;
  renderVocab(cat);
}
function renderVocab(cat){
  const g=document.getElementById('vgrid'); if(!g)return;
  g.innerHTML='';
  const data=VOCAB[cat]||[];
  data.forEach(v=>{
    const c=document.createElement('div');c.className='vcard';
    c.innerHTML=`<div class="vk">${v.k}</div>
      <div class="vr">🔊 ${v.r}</div>
      <div class="vm">${v.m}</div>
      <div class="vex">${v.ex||''}</div>
      <button class="vsnd" onclick="event.stopPropagation();speak('${(v.sound||v.r).replace(/'/g,'\\\'')}")">▶ Dengar</button>`;
    c.onclick=()=>speak(v.sound||v.r);
    g.appendChild(c);
  });
}

// ===== PHRASES =====
function buildPhrases(){
  const acc=document.getElementById('phraseAcc'); if(!acc)return;
  PHRASES.forEach((p,i)=>{
    const rows=p.rows.map(r=>`<tr onclick="speak('${(r.r).replace(/'/g,'\\\'')}")">
      <td class="td-kh">${r.k}</td>
      <td class="td-read">${r.r}</td>
      <td class="td-idn">${r.i}</td>
      <td class="td-note">${r.n||''}</td>
    </tr>`).join('');
    const item=document.createElement('div');item.className='pitem';item.id='pi'+i;
    item.innerHTML=`<div class="phead" onclick="toggleP(${i})">
      <div><div class="pcat">${p.cat}</div><div class="ptit">${p.title}</div></div>
      <div class="pchev">⌄</div>
    </div>
    <div class="pbody">
      <table class="phrase-table">
        <thead><tr><th>🇰🇭 Khmer</th><th>🔤 Cara Baca (logat Khmer)</th><th>🇮🇩 Artinya</th><th>Catatan</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
    acc.appendChild(item);
  });
  // Buka accordion pertama otomatis
  document.getElementById('pi0').classList.add('open');
}
function toggleP(i){document.getElementById('pi'+i).classList.toggle('open');}

// ===== NUMBERS =====
function buildNumbers(){
  const wrap=document.getElementById('numContainer'); if(!wrap)return;
  const sections=[
    {title:'🔢 Angka Dasar 0 — 9',start:0,end:9},
    {title:'🔢 Belasan 10 — 19',start:10,end:19},
    {title:'🔢 Puluhan 20 — 29',start:20,end:29},
    {title:'🔢 Puluhan 30 — 99',start:30,end:99},
    {title:'🔢 Ratusan 100 — 900',start:100,end:900},
    {title:'🔢 Ribuan dan ke atas',start:1000,end:99999999},
  ];
  sections.forEach(sec=>{
    const filtered=NUMBERS.filter(n=>{
      const val=parseFloat(n.n.replace(/\./g,'').replace(/,/g,''));
      return val>=sec.start && val<=sec.end;
    });
    if(filtered.length===0)return;
    const title=document.createElement('div');title.className='num-section-title';title.textContent=sec.title;
    wrap.appendChild(title);
    const grid=document.createElement('div');grid.className='ngrid';
    filtered.forEach(n=>{
      const c=document.createElement('div');c.className='ncard';
      c.onclick=()=>speak(n.r);
      c.innerHTML=`<div class="nnum">${n.n}</div><div class="nk">${n.k}</div><div class="nr">${n.r}</div><div class="nm">${n.m}</div>`;
      grid.appendChild(c);
    });
    wrap.appendChild(grid);
  });
  // Rumus pembentukan angka
  const formula=document.createElement('div');formula.className='num-formula';
  formula.innerHTML=`<h4>📐 RUMUS PEMBENTUKAN ANGKA</h4>
  <table>
    <tr><td>31</td><td>សាមសិបមួយ</td><td>saam-seb-muoy (30+1)</td></tr>
    <tr><td>45</td><td>សែសិបប្រាំ</td><td>sae-seb-pram (40+5)</td></tr>
    <tr><td>102</td><td>មួយរយពីរ</td><td>muoy-roi-pii (100+2)</td></tr>
    <tr><td>250</td><td>ពីររយហាសិប</td><td>pii-roi-haa-seb (200+50)</td></tr>
    <tr><td>1.500</td><td>មួយពាន់ប្រាំរយ</td><td>muoy-poan-pram-roi (1000+500)</td></tr>
    <tr><td>12.000</td><td>មួយម៉ឺនពីរពាន់</td><td>muoy-meun-pii-poan (10000+2000)</td></tr>
  </table>`;
  wrap.appendChild(formula);
}

// ===== GRAMMAR =====
function buildGrammar(){
  const g=document.getElementById('gramGrid'); if(!g)return;
  GRAMMAR.forEach(gr=>{
    const c=document.createElement('div');c.className='gcard';
    c.innerHTML=`<div class="gt">${gr.ico} ${gr.title}</div>
    <div class="gb">${gr.body}</div>
    <div class="gex">
      <span class="ek">${gr.k}</span>
      <span class="er">${gr.r}</span>
      <span class="ei">${gr.i}</span>
    </div>`;
    g.appendChild(c);
  });
}

// ===== SONGS =====
function buildSongs(){
  const sg=document.getElementById('songGrid'); if(!sg)return;
  SONGS.forEach(s=>{
    const rows=s.lyrics.map(l=>`<tr>
      <td>${l.k}</td><td>${l.r}</td><td>${l.i}</td><td>${l.n}</td>
    </tr>`).join('');
    const card=document.createElement('div');card.className='scard';
    card.innerHTML=`<div class="s-head">
      <div class="s-cover">${s.emoji}</div>
      <div class="s-info">
        <h3>${s.title}</h3>
        <h4>${s.titleIndo}</h4>
        <p>🎤 ${s.singer} &nbsp;·&nbsp; ${s.desc}</p>
      </div>
    </div>
    <div class="s-body">
      <div style="font-size:.75rem;color:var(--t4);font-style:italic;margin-bottom:1rem">Klik baris untuk mendengar cara baca</div>
      <table class="ltable">
        <thead><tr><th>🇰🇭 Lirik Khmer</th><th>🔤 Cara Baca (logat Khmer)</th><th>🇮🇩 Terjemahan</th><th>📚 Catatan</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>`;
    // click rows
    sg.appendChild(card);
    card.querySelectorAll('tbody tr').forEach((tr,i)=>{
      tr.style.cursor='pointer';
      tr.onclick=()=>speak(s.lyrics[i].r);
    });
  });
}

// ===== KARAOKE =====
let ytPlayer=null, karaokeTimer=null, currentKSong=null, selectedKSongIdx=0;
function buildKaraokeUI(){
  const btns=document.getElementById('kSongBtns'); if(!btns)return;
  KARAOKE_SONGS.forEach((s,i)=>{
    const b=document.createElement('button');
    b.className='btn-out';
    b.textContent=s.title;
    b.onclick=()=>selectKSong(i,b);
    btns.appendChild(b);
  });
  // select first
  selectKSong(0, btns.firstChild);
  // init custom rows
  addCustomRow(); addCustomRow(); addCustomRow();
}
function selectKSong(idx, btn){
  selectedKSongIdx=idx;
  currentKSong=KARAOKE_SONGS[idx];
  document.querySelectorAll('#kSongBtns button').forEach(b=>b.classList.remove('btn-gold'));
  if(btn) btn.classList.add('btn-gold');
  renderLyrics(currentKSong.lines, -1);
  document.getElementById('karaokeStatus').textContent=`Lagu dipilih: ${currentKSong.title} — Tekan Mulai Karaoke`;
}
function renderLyrics(lines, activeIdx){
  const wrap=document.getElementById('lyricsSync'); if(!wrap)return;
  wrap.innerHTML='';
  lines.forEach((l,i)=>{
    const row=document.createElement('div');row.className='lyric-row'+(i===activeIdx?' active':'');
    row.id='lr-'+i;
    const mm=Math.floor(l.time/60);const ss=(l.time%60).toString().padStart(2,'0');
    row.innerHTML=`<div class="lr-time">${mm}:${ss}</div>
      <div class="lr-kh">${l.k}</div>
      <div class="lr-read">${l.r}</div>
      <div class="lr-read" style="color:var(--cream2);font-style:normal">${l.i}</div>`;
    row.onclick=()=>{ if(ytPlayer&&ytPlayer.seekTo) ytPlayer.seekTo(l.time,true); };
    wrap.appendChild(row);
  });
}
function startKaraoke(){
  if(!currentKSong){ showToast('Pilih lagu dulu!'); return; }
  stopKaraoke();
  document.getElementById('karaokeStatus').textContent='▶ Karaoke berjalan...';
  let lastIdx=-1;
  karaokeTimer=setInterval(()=>{
    let currentTime=0;
    if(ytPlayer&&ytPlayer.getCurrentTime) currentTime=ytPlayer.getCurrentTime();
    else currentTime+=0.5;
    const lines=currentKSong.lines;
    let activeIdx=-1;
    for(let i=lines.length-1;i>=0;i--){
      if(currentTime>=lines[i].time){activeIdx=i;break;}
    }
    if(activeIdx!==lastIdx){
      lastIdx=activeIdx;
      document.querySelectorAll('.lyric-row').forEach((r,i)=>r.classList.toggle('active',i===activeIdx));
      if(activeIdx>=0){
        const activeRow=document.getElementById('lr-'+activeIdx);
        if(activeRow) activeRow.scrollIntoView({behavior:'smooth',block:'center'});
        // auto speak
        speak(lines[activeIdx].r);
      }
    }
  },500);
}
function stopKaraoke(){
  if(karaokeTimer){ clearInterval(karaokeTimer); karaokeTimer=null; }
  document.getElementById('karaokeStatus').textContent='⏹ Karaoke dihentikan';
}

// YouTube IFrame API
function loadYT(){
  const url=document.getElementById('ytUrl').value.trim();
  if(!url){ showToast('Masukkan link YouTube dulu!'); return; }
  const vid=extractYTId(url);
  if(!vid){ showToast('Link YouTube tidak valid!'); return; }
  document.getElementById('ytPlayerWrap').style.display='block';
  document.getElementById('ytStatus').textContent='Loading video...';
  if(ytPlayer){
    ytPlayer.loadVideoById(vid);
    document.getElementById('ytStatus').textContent='✅ Video dimuat! Tekan play di video.';
  } else {
    document.getElementById('ytPlayer').id='ytPlayer';
    ytPlayer=new YT.Player('ytPlayer',{
      height:'100%',width:'100%',videoId:vid,
      playerVars:{playsinline:1,rel:0},
      events:{
        onReady:()=>{ document.getElementById('ytStatus').textContent='✅ Video siap! Pilih lagu lalu tekan Mulai Karaoke.'; },
        onStateChange:(e)=>{ if(e.data===YT.PlayerState.PLAYING) startKaraoke(); if(e.data===YT.PlayerState.PAUSED||e.data===YT.PlayerState.ENDED) stopKaraoke(); }
      }
    });
  }
}
function clearYT(){
  if(ytPlayer) ytPlayer.stopVideo();
  document.getElementById('ytPlayerWrap').style.display='none';
  document.getElementById('ytUrl').value='';
  document.getElementById('ytStatus').textContent='Video dihapus.';
  stopKaraoke();
}
function extractYTId(url){
  const m=url.match(/(?:youtu\.be\/|v=|embed\/)([a-zA-Z0-9_-]{11})/);
  return m?m[1]:null;
}
function onYouTubeIframeAPIReady(){ /* handled above */ }

// Custom song builder
let customRows=[];
function addCustomRow(){
  const wrap=document.getElementById('customLyricRows'); if(!wrap)return;
  const idx=customRows.length;
  customRows.push({});
  const row=document.createElement('div');
  row.style.cssText='display:grid;grid-template-columns:70px 1fr 1fr 1fr;gap:.5rem;margin-bottom:.5rem;align-items:center';
  row.id='cr-'+idx;
  row.innerHTML=`<input class="yt-input" placeholder="Detik" type="number" id="ct-${idx}" style="padding:.4rem">
    <input class="yt-input" placeholder="Teks Khmer (contoh: សួស្តី)" id="ck-${idx}" style="padding:.4rem">
    <input class="yt-input" placeholder="Cara baca (Suos-sdei)" id="cr2-${idx}" style="padding:.4rem">
    <input class="yt-input" placeholder="Artinya (Halo)" id="ci-${idx}" style="padding:.4rem">`;
  wrap.appendChild(row);
}
function saveCustomSong(){
  const title=document.getElementById('customSongTitle').value.trim()||'Lagu Custom';
  const lines=[];
  customRows.forEach((_,i)=>{
    const t=parseFloat(document.getElementById('ct-'+i)?.value)||0;
    const k=document.getElementById('ck-'+i)?.value.trim()||'';
    const r=document.getElementById('cr2-'+i)?.value.trim()||'';
    const idn=document.getElementById('ci-'+i)?.value.trim()||'';
    if(k||r) lines.push({time:t,k,r,i:idn});
  });
  if(lines.length===0){showToast('Tambahkan lirik dulu!');return;}
  const newSong={title,artist:'Custom',ytId:'',lines};
  KARAOKE_SONGS.push(newSong);
  const btns=document.getElementById('kSongBtns');
  const b=document.createElement('button');b.className='btn-out';b.textContent=title;
  const newIdx=KARAOKE_SONGS.length-1;
  b.onclick=()=>selectKSong(newIdx,b);
  btns.appendChild(b);
  showToast('✅ Lagu disimpan: '+title);
}
function clearCustom(){
  document.getElementById('customLyricRows').innerHTML='';
  customRows=[];
  addCustomRow();addCustomRow();addCustomRow();
}

// ===== QUIZ =====
const QDATA=[];
Object.values(VOCAB).forEach(arr=>arr.forEach(v=>{if(v.m&&v.m.length>1)QDATA.push({k:v.k,r:v.r,ans:v.m,sound:v.sound||v.r});}));
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
let qPool=shuffle([...QDATA]),qIdx=0,score=0,total=0,answered=false;
const TOTAL_Q=20;
function buildQuiz(){ loadQ(); }
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
  const wrongs=shuffle(QDATA.filter(x=>x.ans!==q.ans)).slice(0,3).map(x=>x.ans);
  const opts=shuffle([q.ans,...wrongs]);
  const oc=document.getElementById('qOpts');oc.innerHTML='';
  opts.forEach(o=>{
    const b=document.createElement('button');b.className='qopt';b.textContent=o;
    b.onclick=()=>checkQ(o,q.ans,b,q.sound);
    oc.appendChild(b);
  });
}
function checkQ(ans,correct,btn,snd){
  if(answered)return;answered=true;total++;
  speak(snd||correct);
  if(ans===correct){
    score++;btn.classList.add('ok');
    document.getElementById('qFeed').textContent='✅ Benar! Bagus sekali!';
    document.getElementById('qFeed').style.color='#4fff90';
  }else{
    btn.classList.add('ng');
    document.getElementById('qFeed').textContent='❌ Salah! Jawaban: '+correct;
    document.getElementById('qFeed').style.color='#ff8888';
    document.querySelectorAll('.qopt').forEach(b=>{if(b.textContent===correct)b.classList.add('ok');});
  }
  document.getElementById('qScore').textContent=`Pertanyaan ${Math.min(total+1,TOTAL_Q)} dari ${TOTAL_Q} | Skor: ${score}`;
  document.getElementById('qprog').style.width=((total/TOTAL_Q)*100)+'%';
  if(total>=TOTAL_Q) document.getElementById('qNext').textContent='🏆 Lihat Hasil';
}
function nextQ(){
  if(total>=TOTAL_Q){showResult();return;}
  qIdx++;loadQ();
}
function showResult(){
  const pct=Math.round((score/TOTAL_Q)*100);
  document.getElementById('qOpts').innerHTML='';
  document.getElementById('qK').textContent='🏆';
  document.getElementById('qL').textContent='Kuis Selesai!';
  document.getElementById('qFeed').textContent=`Skor: ${score}/${TOTAL_Q} (${pct}%)`;
  document.getElementById('qFeed').style.color=pct>=70?'#4fff90':'#FFD700';
  document.getElementById('qNum').textContent=pct>=80?'Luar biasa!':pct>=50?'Bagus! Terus belajar!':'Jangan menyerah! Coba lagi!';
}
function resetQ(){
  qPool=shuffle([...QDATA]);qIdx=0;score=0;total=0;answered=false;
  document.getElementById('qNext').textContent='Pertanyaan Berikutnya →';
  document.getElementById('qScore').textContent='Pertanyaan 1 dari 20 | Skor: 0';
  loadQ();
}

// ===== PROVERBS =====
function buildProverbs(){
  const pg=document.getElementById('provGrid'); if(!pg)return;
  PROVERBS.forEach(p=>{
    const c=document.createElement('div');c.className='provcard';
    c.innerHTML=`<div class="pq">"</div>
      <div class="pk">${p.k}</div>
      <div class="pr">${p.r}</div>
      <div class="pi">${p.i}</div>
      <div class="pm">💡 ${p.m}</div>`;
    pg.appendChild(c);
  });
}

// ===== CULTURE =====
function buildCulture(){
  const cg=document.getElementById('cultGrid'); if(!cg)return;
  CULTURES.forEach(c=>{
    const card=document.createElement('div');card.className='ccard';
    card.innerHTML=`<span class="cico">${c.ico}</span>
      <div class="ctit">${c.title}</div>
      <div class="cdesc">${c.desc}</div>
      <div class="ckhm">${c.khm}</div>`;
    cg.appendChild(card);
  });
}

// ===== SPEECH — logat Khmer asli =====
function speak(text){
  if(!text||text==='—')return;
  // Bersihkan teks dari karakter non-latin jika perlu
  const cleanText = text.replace(/[^\w\s\-']/g,'').trim();
  if(!cleanText)return;
  try{
    window.speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(cleanText);
    // Coba bahasa Khmer dulu
    const voices=window.speechSynthesis.getVoices();
    const khVoice=voices.find(v=>v.lang.startsWith('km'));
    if(khVoice){ u.voice=khVoice; u.lang='km-KH'; }
    else { u.lang='km-KH'; }
    u.rate=0.75; // Lebih pelan agar jelas
    u.pitch=1;
    window.speechSynthesis.speak(u);
  }catch(e){}
  showToast('🔊 '+text);
}

// ===== TOAST =====
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),2200);
}

// ===== SCROLL REVEAL =====
window.addEventListener('scroll',()=>{
  document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top<window.innerHeight*0.92) el.classList.add('vis');
  });
},{passive:true});
