// =====================================================
//  汉字冒险 5.0 — Complete Game Engine
// =====================================================

const G = {
  currentScreen:'home-screen', courseIdx:0, lesson:null, levelIdx:0, learnIdx:0,
  gateQs:[],gateQIdx:0,gateCorrect:0,
  bossPlayerHP:5,bossEnemyHP:0,bossQs:[],bossQIdx:0,bossCorrect:0,bossWrong:0,bossPhase:0,bossPhases:[],bossPhaseWords:[[],[],[]],
  filterCat:'all',importTab:'json',qWord:null,qSolved:false,
  levelMistakes:0,totalLevelMistakes:0,
  dailyWords:[],dailyIdx:0,dailyCorrect:0,
  detailHanzi:null,detailBack:'home-screen',
  mgType:'',mgPairs:[],mgSelected:null,mgMatched:new Set(),
  mgMemoryCards:[],mgMemoryFlipped:[],mgMemoryMatched:new Set(),mgMemoryLocked:false,
  mgSpeedQs:[],mgSpeedIdx:0,mgSpeedScore:0,mgSpeedTimer:0,mgSpeedInterval:null,
  mgWords:[],mgScore:0,
  lockA:0,lockB:0,lockCallback:null,
  storyCallback:null,
};

const E = {
  canvas:null,ctx:null,W:800,H:450,
  running:false,paused:false,player:null,
  camera:{x:0},platforms:[],coins:[],qBlocks:[],enemies:[],gates:[],gaps:[],
  levelWidth:0,worldTheme:null,groundY:0,
  collectedCoins:0,answeredQs:0,totalQs:0,
  hearts:5,maxHearts:5,nearGate:false,gatePrompted:false,
  animFrame:0,requestId:null,
  keys:{},touch:{left:false,right:false,jump:false},
};

// ===== UTILITIES =====
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}
function todayStr(){return new Date().toISOString().slice(0,10);}
function daysBetween(a,b){return Math.floor((new Date(b)-new Date(a))/86400000);}
function masteryColor(m){if(m>=80)return'#059669';if(m>=50)return'#F59E0B';return'#EF4444';}

function speak(text){
  if(!('speechSynthesis' in window))return;
  const s=getSettings();
  if(!s.sound)return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=0.75;u.pitch=1.05;
  try{const voices=speechSynthesis.getVoices();const zh=voices.find(v=>v.lang.startsWith('zh'));if(zh)u.voice=zh;}catch(e){}
  speechSynthesis.speak(u);
}
function autoSpeak(text){const s=getSettings();if(s.autospeak)speak(text);}

function toast(text,dur=2500){let t=document.querySelector('.toast');if(!t){t=document.createElement('div');t.className='toast';document.body.appendChild(t);}t.textContent=text;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}
function confetti(){const c=document.createElement('div');c.className='confetti-container';document.body.appendChild(c);const cols=['#FF6B6B','#4ECDC4','#FFE66D','#A78BFA','#F472B6','#34D399','#60A5FA'];for(let i=0;i<50;i++){const p=document.createElement('div');p.className='confetti-piece';p.style.left=Math.random()*100+'%';p.style.background=cols[i%cols.length];p.style.animationDuration=(2+Math.random()*2)+'s';p.style.animationDelay=Math.random()*1.5+'s';p.style.width=(6+Math.random()*6)+'px';p.style.height=p.style.width;c.appendChild(p);}setTimeout(()=>c.remove(),5000);}

// ===== SETTINGS (v5.0) =====
const SK='hanzi_settings';
function getSettings(){try{const d=localStorage.getItem(SK);if(d)return JSON.parse(d);}catch(e){}return{sound:true,autospeak:true,pinyin:false,difficulty:'normal'};}
function saveSettings(s){localStorage.setItem(SK,JSON.stringify(s));}
G.openSettings=function(){
  const s=getSettings();
  document.getElementById('toggle-sound').className='toggle'+(s.sound?' on':'');
  document.getElementById('toggle-autospeak').className='toggle'+(s.autospeak?' on':'');
  document.getElementById('toggle-pinyin').className='toggle'+(s.pinyin?' on':'');
  document.querySelectorAll('.diff-btn').forEach(b=>{b.className='diff-btn'+(b.dataset.d===s.difficulty?' active':'');});
  G.showScreen('settings-screen');
};
G.toggleSetting=function(key){const s=getSettings();s[key]=!s[key];saveSettings(s);document.getElementById('toggle-'+key).className='toggle'+(s[key]?' on':'');};
G.setDifficulty=function(d){const s=getSettings();s.difficulty=d;saveSettings(s);document.querySelectorAll('.diff-btn').forEach(b=>{b.className='diff-btn'+(b.dataset.d===d?' active':'');});};

// ===== SCREENS =====
G.showScreen=function(id){
  if(G.currentScreen==='game-screen'&&id!=='game-screen'){E.running=false;if(E.requestId){cancelAnimationFrame(E.requestId);E.requestId=null;}E.keys={};E.touch={left:false,right:false,jump:false};}
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el=document.getElementById(id);if(el)el.classList.add('active');
  G.currentScreen=id;if(id==='game-screen'){G.resizeCanvas();if(E.running)E.draw();}
  window.scrollTo(0,0);
};
G.goHome=function(){G.renderHome();G.showScreen('home-screen');};

// ===== DATA =====
function getCourses(){try{const d=localStorage.getItem('hanzi_courses');if(d)return JSON.parse(d);}catch(e){}return getDefaultCourses();}
function saveCourses(cs){localStorage.setItem('hanzi_courses',JSON.stringify(cs));}
function getLessons(){return getCourses().map(c=>c.lesson);}
function getAllWords(){const all=[];getCourses().forEach(c=>c.lesson.words.forEach(w=>all.push({...w,category:c.lesson.category})));return all;}
G.findWordByHanzi=function(hanzi){for(const c of getCourses())for(const w of c.lesson.words)if(w.hanzi===hanzi)return{...w,category:c.lesson.category,categoryZh:c.lesson.categoryZh};return null;};

// ===== PROGRESS =====
const PK='hanzi_progress';
function getProgress(){try{const d=localStorage.getItem(PK);if(d)return JSON.parse(d);}catch(e){}return initProgress();}
function initProgress(){const n=getCourses().length;const u=[];for(let i=0;i<n;i++)u.push(i);return{unlocked:u,stars:{},defeated:{},bestMistakes:{},coins:0,learned:0,mistakes:0,badges:{},lastPlayed:null,streak:0,streakDays:[]};}
function saveProgress(p){p.lastPlayed=todayStr();localStorage.setItem(PK,JSON.stringify(p));}

// ===== STREAKS (v5.0) =====
function updateStreak(){
  const prog=getProgress();const today=todayStr();
  if(!prog.streakDays)prog.streakDays=[];
  if(prog.streakDays.includes(today))return; // already counted today
  const yesterday=new Date();yesterday.setDate(yesterday.getDate()-1);const yStr=yesterday.toISOString().slice(0,10);
  if(prog.streakDays.includes(yStr)){prog.streak=(prog.streak||0)+1;}
  else{prog.streak=1;}
  prog.streakDays.push(today);
  if(prog.streakDays.length>100)prog.streakDays=prog.streakDays.slice(-100);
  // Streak bonus coins
  if(prog.streak>=3){prog.coins=(prog.coins||0)+Math.min(prog.streak,10);toast(`🔥 Серия ${prog.streak} дней! +${Math.min(prog.streak,10)} 🪙`);}
  saveProgress(prog);
}

// ===== MASTERY =====
const PP='hanzi_profiles';
function getProfiles(){try{const d=localStorage.getItem(PP);if(d)return JSON.parse(d);}catch(e){}return{};}
function saveProfiles(ps){localStorage.setItem(PP,JSON.stringify(ps));}
function ensureProfile(hanzi){const ps=getProfiles();if(!ps[hanzi])ps[hanzi]={hanzi,mastery:0,streak:0,errors:0,lastSeen:todayStr(),nextReview:todayStr(),timesCorrect:0,totalAttempts:0};saveProfiles(ps);return ps[hanzi];}
function updateMastery(hanzi,correct,context){
  const ps=getProfiles();const now=todayStr();
  if(!ps[hanzi])ps[hanzi]={hanzi,mastery:0,streak:0,errors:0,lastSeen:now,nextReview:now,timesCorrect:0,totalAttempts:0};
  const p=ps[hanzi];p.lastSeen=now;p.totalAttempts++;
  const s=getSettings();const diffMult=s.difficulty==='easy'?0.7:s.difficulty==='hard'?1.3:1;
  const gains={learn:5,practice:10,boss:15,daily:10,gate:10};
  const losses={learn:0,practice:10,boss:15,daily:5,gate:5};
  if(correct){p.streak++;p.timesCorrect++;p.mastery=clamp(p.mastery+Math.round((gains[context]||10)*diffMult),0,100);const intervals=[1,2,4,8,16,30];const days=intervals[Math.min(p.streak,intervals.length-1)];const next=new Date();next.setDate(next.getDate()+days);p.nextReview=next.toISOString().slice(0,10);}
  else{p.streak=0;p.errors++;p.mastery=clamp(p.mastery-Math.round((losses[context]||10)*diffMult),0,100);p.nextReview=now;}
  saveProfiles(ps);updateStreak();
}
function shouldShowPinyin(hanzi){const s=getSettings();if(s.pinyin)return true;const ps=getProfiles();if(!ps[hanzi])return true;return ps[hanzi].mastery<30;}
function applyDecay(){const ps=getProfiles();const now=todayStr();let ch=false;for(const h in ps){const p=ps[h];if(p.nextReview&&p.nextReview<now){const d=daysBetween(p.nextReview,now);if(d>0){p.mastery=clamp(p.mastery-Math.min(d,10),0,100);ch=true;}}}if(ch)saveProfiles(ps);}

// ===== SMART REVIEW =====
function getSmartReviewQueue(max){
  max=max||10;const ps=getProfiles();const now=todayStr();const cands=[];
  for(const h in ps){const p=ps[h];if(p.mastery>=80)continue;let pr=0;pr+=p.errors*20;pr+=(100-p.mastery)*0.5;if(p.lastSeen)pr+=Math.min(daysBetween(p.lastSeen,now),30)*2;if(p.totalAttempts<=2)pr+=15;if(p.mastery<30)pr+=25;cands.push({hanzi:h,pr});}
  cands.sort((a,b)=>b.pr-a.pr);return cands.slice(0,max).map(c=>c.hanzi);
}
function getDailyReviewWords(){applyDecay();const smart=getSmartReviewQueue(8);const ps=getProfiles();const prog=getProgress();const lessons=getLessons();const seen=new Set(Object.keys(ps));const fresh=[];for(const idx of prog.unlocked){if(idx<lessons.length)for(const w of lessons[idx].words)if(!seen.has(w.hanzi))fresh.push(w.hanzi);}return shuffle([...new Set([...smart,...shuffle(fresh).slice(0,3)])]).slice(0,10);}

// ===== BADGES =====
function earnBadge(idx){const prog=getProgress();const cs=getCourses();const c=cs[idx];if(!prog.badges[idx]){prog.badges[idx]={date:todayStr(),icon:c.icon,name:c.nameRu};saveProgress(prog);}}

// ===== PARENT LOCK =====
G.parentLockAction=function(action){G.lockA=Math.floor(Math.random()*9)+1;G.lockB=Math.floor(Math.random()*9)+1;document.getElementById('lock-question').textContent=`${G.lockA} + ${G.lockB} = ?`;document.getElementById('lock-answer').value='';document.getElementById('lock-error').textContent='';G.lockCallback=action;document.getElementById('lock-modal').classList.add('active');setTimeout(()=>document.getElementById('lock-answer').focus(),100);};
G.checkLock=function(){const ans=parseInt(document.getElementById('lock-answer').value);if(ans===G.lockA+G.lockB){document.getElementById('lock-modal').classList.remove('active');if(G.lockCallback==='editor')G.openEditor();else if(G.lockCallback==='reset'){if(confirm('Сбросить весь прогресс?')){localStorage.clear();location.reload();}}else if(G.lockCallback==='backup')G.doExportBackup();}else{document.getElementById('lock-error').textContent='Неверно! Попробуй ещё раз.';}};
G.closeLock=function(){document.getElementById('lock-modal').classList.remove('active');};

// ===== STORY MODE (v5.0) =====
G.showStory=function(emoji,title,text,callback){
  document.getElementById('story-emoji').textContent=emoji;document.getElementById('story-title').textContent=title;document.getElementById('story-text').textContent=text;G.storyCallback=callback;document.getElementById('story-overlay').classList.add('active');
};
G.closeStory=function(){document.getElementById('story-overlay').classList.remove('active');if(G.storyCallback)G.storyCallback();G.storyCallback=null;};

// ===== SMART RECOMMENDATION (v5.0) =====
G.smartRecommend=function(){
  const prog=getProgress();const cs=getCourses();const ps=getProfiles();
  // 1. Check for unfinished courses
  for(let i=0;i<cs.length;i++){
    if(!prog.defeated[i]&&prog.unlocked.includes(i)){
      const course=cs[i];const words=course.lesson.words;
      const avgMastery=words.length>0?words.reduce((s,w)=>{const p=ps[w.hanzi];return s+(p?p.mastery:0);},0)/words.length:0;
      if(avgMastery<30){G.openLearnPreview(i);return;}
      if(avgMastery>=30&&!prog.defeated[i]){G.openLearnPreview(i);return;}
    }
  }
  // 2. Check for difficult words
  const diffCount=Object.values(ps).filter(p=>p.mastery<50&&p.totalAttempts>0).length;
  if(diffCount>3){G.openDifficultWords();return;}
  // 3. Check daily review
  const dailyWords=getDailyReviewWords();
  if(dailyWords.length>0){G.openDailyReview();return;}
  // 4. Default: open course select
  G.openCourseSelect();
};

// ===== HOME =====
G.renderHome=function(){
  const prog=getProgress();const allWords=getAllWords();const profiles=getProfiles();
  const mastered=Object.values(profiles).filter(p=>p.mastery>=80).length;
  document.getElementById('home-stats').innerHTML=`<div class="home-stat">🪙 ${prog.coins||0}</div><div class="home-stat">📚 ${mastered}/${allWords.length}</div><div class="home-stat">🔥 ${prog.streak||0} дн.</div><div class="home-stat">🏆 ${Object.keys(prog.badges||{}).length}</div>`;
  // Smart recommendation
  const rec=document.getElementById('home-recommend');
  const ps=getProfiles();const cs=getCourses();const today=todayStr();
  // Find best recommendation
  let recText='📚 Начать обучение';let recSub='Выбери курс';let recIcon='📚';
  // Check unfinished courses
  for(let i=0;i<cs.length;i++){
    if(!prog.defeated[i]&&prog.unlocked.includes(i)){
      const words=cs[i].lesson.words;const avg=words.length>0?words.reduce((s,w)=>{const p=ps[w.hanzi];return s+(p?p.mastery:0);},0)/words.length:0;
      if(avg<50){recText=`Продолжить: ${cs[i].nameRu}`;recSub=`${Math.round(avg)}% мастерства`;recIcon=cs[i].icon;break;}
    }
  }
  // Check streak
  if(prog.streak>0){recSub=`🔥 Серия ${prog.streak} дней · ${recSub}`;}
  // Check daily
  const daily=getDailyReviewWords();
  if(daily.length>0&&recText==='📚 Начать обучение'){recText=`📖 Повторение: ${daily.length} слов`;recSub='Рекомендуется повторить';recIcon='📖';}
  rec.innerHTML=`<div class="home-recommend-label">${recIcon} Рекомендация</div><div class="home-recommend-text">${recText}</div><div class="home-recommend-sub">${recSub}</div>`;
};

// ===== COURSE SELECT (v5.0) =====
G.openCourseSelect=function(){
  const cs=getCourses();const prog=getProgress();const ps=getProfiles();
  const grid=document.getElementById('course-grid');grid.innerHTML='';
  cs.forEach((c,i)=>{
    const words=c.lesson.words;
    const avgMastery=words.length>0?Math.round(words.reduce((s,w)=>{const p=ps[w.hanzi];return s+(p?p.mastery:0);},0)/words.length):0;
    const defeated=!!prog.defeated[i];const stars=prog.stars[i]||0;const hasBadge=!!(prog.badges&&prog.badges[i]);
    const card=document.createElement('div');card.className=`course-card ${defeated?'done':'active'}`;
    let st='';for(let s=0;s<3;s++)st+=`<span class="course-star ${s<stars?'':'empty'}">⭐</span>`;
    card.innerHTML=`
      <div class="course-num">${i+1}</div>
      <div class="course-icon">${c.icon}</div>
      <div class="course-info">
        <div class="course-name">${c.nameRu}${hasBadge?' 🏅':''}</div>
        <div class="course-desc">${c.desc} · ${words.length} слов</div>
        <div class="course-progress"><div class="course-bar"><div class="course-bar-fill" style="width:${avgMastery}%;background:${masteryColor(avgMastery)}"></div></div><div class="course-pct">${avgMastery}%</div></div>
        <div class="course-stars">${st}</div>
      </div>
      ${defeated?'<div class="course-badge">Пройдено!</div>':''}
    `;
    card.addEventListener('click',()=>G.openLearnPreview(i));
    grid.appendChild(card);
  });
  G.showScreen('course-screen');
};

// ===== LEARN PREVIEW =====
G.openLearnPreview=function(idx){
  G.courseIdx=idx;const cs=getCourses();G.lesson=cs[idx].lesson;G.learnIdx=0;G.totalLevelMistakes=0;G.levelMistakes=0;
  G.lesson.words.forEach(w=>ensureProfile(w.hanzi));
  // Show story if first time
  const prog=getProgress();const course=cs[idx];
  if(!prog.defeated[idx]&&course.storyPre&&!G._storyShown){G._storyShown=true;G.showStory(course.icon,course.nameRu,course.storyPre,()=>{G.renderLearn();G.showScreen('learn-screen');});return;}
  G.renderLearn();G.showScreen('learn-screen');
};
G.renderLearn=function(){
  const l=G.lesson;const w=l.words[G.learnIdx];
  document.getElementById('learn-title').textContent=l.category;
  document.getElementById('learn-counter').textContent=`${G.learnIdx+1}/${l.words.length}`;
  document.getElementById('learn-bar').style.width=((G.learnIdx+1)/l.words.length*100)+'%';
  document.getElementById('learn-card').innerHTML=`
    <div class="learn-emoji">${w.emoji||''}</div>
    <div class="learn-hanzi" onclick="G.openDetail('${w.hanzi}','learn-screen')">${w.hanzi}</div>
    <div class="learn-pinyin">${w.pinyin}</div>
    <div class="learn-ru">${w.ru}</div>
    <button class="audio-btn" onclick="speak('${w.hanzi}')">🔊</button>
  `;
  autoSpeak(w.hanzi);
  document.getElementById('lprev').style.display=G.learnIdx>0?'flex':'none';
  document.getElementById('lnext').style.display=G.learnIdx<l.words.length-1?'flex':'none';
  document.getElementById('ldone').style.display=G.learnIdx>=l.words.length-1?'flex':'none';
};
G.learnNext=function(){if(G.learnIdx<G.lesson.words.length-1){G.learnIdx++;G.renderLearn();}};
G.learnPrev=function(){if(G.learnIdx>0){G.learnIdx--;G.renderLearn();}};
G.startLevel=function(){G.levelIdx=0;G.levelMistakes=0;G.totalLevelMistakes=0;G.launchPlatformer();};

// ===== LEVEL GENERATOR =====
G.generateLevel=function(lesson,lvl){
  const words=lesson.words;const segW=300;const numSeg=4+Math.min(lvl,2);
  const totalW=segW*numSeg+800;const groundY=E.H-40;const platYs=[groundY-80,groundY-140,groundY-200];
  const platforms=[{x:0,y:groundY,w:totalW,h:40,type:'ground'}];const gaps=[];
  for(let i=1;i<numSeg;i+=2){const gx=segW*i+150;const gw=100+Math.min(lvl,2)*20;gaps.push({x:gx,w:gw});platforms.push({x:gx+20,y:groundY-60,w:gw-40,h:14,type:'float'});}
  for(let i=0;i<numSeg-1;i++)platforms.push({x:segW*i+100+Math.random()*150,y:platYs[Math.floor(Math.random()*platYs.length)],w:80+Math.random()*40,h:14,type:'float'});
  const qBlocks=[];const qWords=shuffle(words);
  for(let i=0;i<Math.min(qWords.length,4+lvl);i++)qBlocks.push({x:segW*(i+1)*0.8+100,y:groundY-160-Math.random()*40,w:40,h:40,word:qWords[i%qWords.length],answered:false});
  const coins=[];const cWords=shuffle(words);
  for(let i=0;i<cWords.length;i++)coins.push({x:120+i*(totalW-200)/cWords.length+Math.random()*40,y:groundY-70-Math.random()*120,w:30,h:30,word:cWords[i],collected:false});
  const enemies=[];const eWords=shuffle(words);
  for(let i=0;i<Math.min(3+lvl,eWords.length);i++){const ex=segW*(i+1)+200+Math.random()*100;enemies.push({x:ex,y:groundY-36,w:32,h:36,word:eWords[i],alive:true,dir:Math.random()<0.5?-1:1,speed:0.5+Math.random()*0.5,minX:ex-60,maxX:ex+60});}
  return{platforms,gaps,qBlocks,coins,enemies,gate:{x:totalW-200,y:groundY-80,w:50,h:80,opened:false},totalW,groundY};
};

// ===== PLATFORMER ENGINE =====
G.launchPlatformer=function(){const level=G.generateLevel(G.lesson,G.levelIdx);G.showScreen('game-screen');setTimeout(()=>G.initEngine(level,G.lesson),50);};
G.initEngine=function(level,lesson){
  E.canvas=document.getElementById('gameCanvas');E.ctx=E.canvas.getContext('2d');G.resizeCanvas();
  E.player={x:60,y:level.groundY-44,w:28,h:44,vx:0,vy:0,onGround:false,facing:1,frame:0};
  E.platforms=level.platforms;E.gaps=level.gaps;E.qBlocks=level.qBlocks;E.coins=level.coins;E.enemies=level.enemies;E.gates=[level.gate];
  E.levelWidth=level.totalW;E.groundY=level.groundY;E.collectedCoins=0;E.answeredQs=0;E.totalQs=level.qBlocks.length;
  E.hearts=5;E.nearGate=false;E.gatePrompted=false;E.paused=false;E.running=true;E.worldTheme=lesson;E.animFrame=0;E.camera.x=0;
  G.levelMistakes=0;G.updateHUD();document.getElementById('gate-prompt').style.display='none';G.bindInput();
  if(E.requestId)cancelAnimationFrame(E.requestId);G.gameLoop();
};
G.resizeCanvas=function(){if(!E.canvas)return;const ww=window.innerWidth,wh=window.innerHeight-60,ratio=E.W/E.H;let cw=ww,ch=ww/ratio;if(ch>wh){ch=wh;cw=wh*ratio;}E.canvas.width=E.W;E.canvas.height=E.H;E.canvas.style.width=Math.floor(cw)+'px';E.canvas.style.height=Math.floor(ch)+'px';};
window.addEventListener('resize',()=>{if(G.currentScreen==='game-screen')G.resizeCanvas();});
G.bindInput=function(){
  document.onkeydown=e=>{if(G.currentScreen!=='game-screen')return;E.keys[e.code]=true;if(e.code==='Space')e.preventDefault();};document.onkeyup=e=>{E.keys[e.code]=false;};
  const bind=(id,key)=>{const el=document.getElementById(id);if(!el)return;el.ontouchstart=e=>{e.preventDefault();E.touch[key]=true;};el.ontouchend=e=>{e.preventDefault();E.touch[key]=false;};el.onmousedown=()=>{E.touch[key]=true;};el.onmouseup=()=>{E.touch[key]=false;};el.onmouseleave=()=>{E.touch[key]=false;};};
  bind('ctrl-left','left');bind('ctrl-right','right');bind('ctrl-jump','jump');
};
G.gameLoop=function(){if(!E.running)return;E.requestId=requestAnimationFrame(G.gameLoop);if(E.paused){E.draw();return;}E.animFrame++;G.processInput();G.updatePlayer();G.updateEnemies();G.checkInteractions();G.updateCamera();E.draw();};
G.processInput=function(){const p=E.player;const l=E.keys['ArrowLeft']||E.keys['KeyA']||E.touch.left,r=E.keys['ArrowRight']||E.keys['KeyD']||E.touch.right,j=E.keys['Space']||E.keys['ArrowUp']||E.keys['KeyW']||E.touch.jump;if(l){p.vx=-4;p.facing=-1;}else if(r){p.vx=4;p.facing=1;}else{p.vx*=0.7;if(Math.abs(p.vx)<0.3)p.vx=0;}if(j&&p.onGround){p.vy=-12;p.onGround=false;}};
G.updatePlayer=function(){const p=E.player;p.vy+=0.6;if(p.vy>12)p.vy=12;p.x+=p.vx;p.x=Math.max(0,Math.min(p.x,E.levelWidth-p.w));for(const pl of E.platforms){if(pl.type==='ground')continue;if(G.rectsOverlap(p,pl)){if(p.vx>0)p.x=pl.x-p.w;else if(p.vx<0)p.x=pl.x+pl.w;}}p.y+=p.vy;p.onGround=false;for(const pl of E.platforms){if(pl.type==='ground'){let ig=false;for(const g of E.gaps){if(p.x+p.w>g.x&&p.x<g.x+g.w){ig=true;break;}}if(ig)continue;}if(G.rectsOverlap(p,pl)&&p.vy>=0){if(p.y+p.h-p.vy<=pl.y+4){p.y=pl.y-p.h;p.vy=0;p.onGround=true;}}}if(p.y>E.H+50){G.playerHit(2);p.x=60;p.y=E.groundY-60;p.vx=0;p.vy=0;}if(Math.abs(p.vx)>0.5)p.frame+=0.15;};
G.updateEnemies=function(){for(const e of E.enemies){if(!e.alive)continue;e.x+=e.dir*e.speed;if(e.x<e.minX||e.x>e.maxX)e.dir*=-1;}};
G.checkInteractions=function(){const p=E.player;for(const c of E.coins){if(c.collected)continue;if(G.rectsOverlap(p,c)){c.collected=true;E.collectedCoins++;speak(c.word.hanzi);toast(`${c.word.hanzi} — ${c.word.ru}`);G.updateHUD();}}for(const q of E.qBlocks){if(q.answered)continue;if(G.rectsOverlap(p,q)&&p.vy<0&&p.y>q.y){q.answered=true;E.paused=true;G.showQModal(q.word,()=>{E.answeredQs++;G.updateHUD();},()=>{q.answered=false;});}}for(const e of E.enemies){if(!e.alive)continue;if(G.rectsOverlap(p,e)){e.alive=false;E.paused=true;G.showQModal(e.word,()=>{},()=>{G.playerHit(1);});}}const gate=E.gates[0];if(gate&&!gate.opened){const near=Math.abs(p.x-gate.x)<60&&Math.abs(p.y-(gate.y+gate.h-p.h))<30;if(near&&!E.nearGate&&!E.gatePrompted){if(!E.qBlocks.every(b=>b.answered)){toast(`Ответь на все вопросы! (${E.qBlocks.filter(b=>b.answered).length}/${E.qBlocks.length})`);E.nearGate=true;setTimeout(()=>{E.nearGate=false;},2000);}else{gate.opened=true;E.paused=true;E.gatePrompted=true;document.getElementById('gate-prompt').style.display='block';}}}if(p.x>=E.levelWidth-60&&E.qBlocks.every(b=>b.answered))if(!E.gates[0]||E.gates[0].opened)G.levelComplete();};
G.updateCamera=function(){E.camera.x+=(E.player.x-E.W/3-E.camera.x)*0.08;E.camera.x=Math.max(0,Math.min(E.camera.x,E.levelWidth-E.W));};

// ===== DRAWING =====
E.draw=function(){const ctx=E.ctx,cam=E.camera,colors=E.worldTheme?E.worldTheme.skyColors:['#87CEEB','#E0F0FF'];const grad=ctx.createLinearGradient(0,0,0,E.H);grad.addColorStop(0,colors[0]);grad.addColorStop(1,colors[1]);ctx.fillStyle=grad;ctx.fillRect(0,0,E.W,E.H);ctx.fillStyle='rgba(255,255,255,0.6)';for(let i=0;i<5;i++){const cx=(i*350+100-cam.x*0.3)%(E.W+200)-100;ctx.beginPath();ctx.arc(cx,40+i*25,20*(0.6+i*0.1),0,Math.PI*2);ctx.arc(cx+25*(0.6+i*0.1),40+i*25-10*(0.6+i*0.1),25*(0.6+i*0.1),0,Math.PI*2);ctx.arc(cx+50*(0.6+i*0.1),40+i*25,20*(0.6+i*0.1),0,Math.PI*2);ctx.fill();}ctx.save();ctx.translate(-cam.x,0);const gc=E.worldTheme?E.worldTheme.groundColor:'#4CAF50';for(const pl of E.platforms){if(pl.type==='ground'){let x=pl.x;const sg=[...E.gaps].sort((a,b)=>a.x-b.x);for(const g of sg){if(g.x>x){ctx.fillStyle=gc;ctx.fillRect(x,g.x-x,pl.y,pl.h);ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillRect(x,g.x-x,pl.y,4);}x=g.x+g.w;}if(x<pl.x+pl.w){ctx.fillStyle=gc;ctx.fillRect(x,pl.x+pl.w-x,pl.y,pl.h);ctx.fillStyle='rgba(255,255,255,0.2)';ctx.fillRect(x,pl.x+pl.w-x,pl.y,4);}}else{ctx.fillStyle=gc;ctx.fillRect(pl.x,pl.y,pl.w,pl.h);ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(pl.x,pl.y,pl.w,4);}}for(const q of E.qBlocks){if(q.answered){ctx.fillStyle='#BDBDBD';ctx.fillRect(q.x,q.y,q.w,q.h);ctx.fillStyle='#9E9E9E';ctx.font='bold 20px sans-serif';ctx.textAlign='center';ctx.fillText('✓',q.x+q.w/2,q.y+q.h/2+7);}else{const bob=Math.sin(E.animFrame*0.05+q.x)*3,y=q.y+bob;ctx.fillStyle='#FFD54F';ctx.fillRect(q.x,y,q.w,q.h);ctx.strokeStyle='#FF8F00';ctx.lineWidth=2;ctx.strokeRect(q.x,y,q.w,q.h);ctx.fillStyle='#E65100';ctx.font='bold 22px sans-serif';ctx.textAlign='center';ctx.fillText('?',q.x+q.w/2,y+q.h/2+8);}}for(const c of E.coins){if(c.collected)continue;const bob=Math.sin(E.animFrame*0.06+c.x*0.1)*4,y=c.y+bob;ctx.fillStyle='#FFD700';ctx.beginPath();ctx.arc(c.x+c.w/2,y+c.h/2,14,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#FFA000';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='#E65100';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(c.word.hanzi,c.x+c.w/2,y+c.h/2+1);}ctx.textBaseline='alphabetic';for(const e of E.enemies){if(!e.alive)continue;const colors2=['#E57373','#BA68C8','#64B5F6','#FFB74D','#81C784'];ctx.fillStyle=colors2[e.word.hanzi.charCodeAt(0)%colors2.length];ctx.beginPath();ctx.arc(e.x+e.w/2,e.y+e.h/2,16,0,Math.PI*2);ctx.fill();ctx.fillStyle='#FFF';ctx.beginPath();ctx.arc(e.x+10,e.y+12,5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(e.x+22,e.y+12,5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#333';ctx.beginPath();ctx.arc(e.x+10,e.y+13,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(e.x+22,e.y+13,2.5,0,Math.PI*2);ctx.fill();ctx.save();ctx.shadowColor='rgba(0,0,0,0.5)';ctx.shadowBlur=3;ctx.fillStyle='#FFF';ctx.font='bold 14px sans-serif';ctx.textAlign='center';ctx.fillText(e.word.hanzi,e.x+e.w/2,e.y+e.h/2+12);ctx.restore();ctx.textAlign='left';}const pl=E.player,cx=pl.x+pl.w/2;ctx.fillStyle='#FFF';ctx.fillRect(pl.x+2,pl.y+18,pl.w-4,20);ctx.beginPath();ctx.arc(cx,pl.y+14,14,0,Math.PI*2);ctx.fillStyle='#FFF';ctx.fill();ctx.strokeStyle='#333';ctx.lineWidth=1.5;ctx.stroke();ctx.fillStyle='#333';ctx.beginPath();ctx.arc(cx-10,pl.y+3,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+10,pl.y+3,6,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx-5,pl.y+13,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+5,pl.y+13,2.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx,pl.y+17,2,0,Math.PI*2);ctx.fill();const as=pl.onGround?Math.sin(pl.frame)*8:0;ctx.fillRect(pl.x-2,pl.y+20+as,6,12);ctx.fillRect(pl.x+pl.w-4,pl.y+20-as,6,12);const ls=pl.onGround?Math.sin(pl.frame)*6:4;ctx.fillRect(pl.x+4,pl.y+36+ls,8,8);ctx.fillRect(pl.x+pl.w-12,pl.y+36-ls,8,8);for(const g of E.gates){if(g.opened){ctx.fillStyle='rgba(76,175,80,0.3)';ctx.fillRect(g.x,g.y,g.w,g.h);ctx.fillStyle='#4CAF50';ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.fillText('✓',g.x+g.w/2,g.y+g.h/2+10);ctx.textAlign='left';}else{ctx.fillStyle='#795548';ctx.fillRect(g.x,g.y,g.w,g.h);ctx.fillStyle='#5D4037';ctx.fillRect(g.x+4,g.y+4,g.w-8,g.h-4);ctx.fillStyle='#FFD54F';ctx.font='bold 24px sans-serif';ctx.textAlign='center';ctx.fillText('🔒',g.x+g.w/2,g.y+g.h/2+8);ctx.textAlign='left';}}ctx.restore();};
G.rectsOverlap=function(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;};
G.playerHit=function(dmg){E.hearts-=dmg;if(E.hearts<0)E.hearts=0;G.updateHUD();if(E.hearts<=0){E.running=false;if(E.requestId){cancelAnimationFrame(E.requestId);E.requestId=null;}setTimeout(()=>G.showResult(false),300);}};
G.updateHUD=function(){let h='';for(let i=0;i<E.maxHearts;i++)h+=i<E.hearts?'❤️':'🖤';document.getElementById('hud-hearts').textContent=h;document.getElementById('hud-coins').textContent=`🪙 ${E.collectedCoins}`;document.getElementById('hud-level').textContent=`${G.lesson.category} #${G.levelIdx+1}`;};

// ===== QUESTION MODAL (v5.0 smarter generation) =====
G.showQModal=function(word,onCorrect,onWrong,forceP){
  G.qWord=word;G.qSolved=false;
  const showP=forceP!==undefined?forceP:shouldShowPinyin(word.hanzi);
  // Better distractor generation: prefer same category, avoid duplicates
  const allWords=getAllWords();const sameCat=allWords.filter(w=>w.category===word.category&&w.hanzi!==word.hanzi);
  let wrongs=shuffle(sameCat).slice(0,3);
  if(wrongs.length<3){const others=shuffle(allWords.filter(w=>w.hanzi!==word.hanzi&&!wrongs.find(x=>x.hanzi===w.hanzi))).slice(0,3-wrongs.length);wrongs=[...wrongs,...others];}
  const opts=shuffle([word,...wrongs]);
  document.getElementById('qm-emoji').textContent=word.emoji||'';document.getElementById('qm-hanzi').textContent=word.hanzi;
  document.getElementById('qm-pinyin').textContent=showP?word.pinyin:'';document.getElementById('qm-pinyin').style.display=showP?'block':'none';
  document.getElementById('qm-feedback').textContent='';document.getElementById('qm-feedback').className='modal-feedback';document.getElementById('qm-next').style.display='none';
  const grid=document.getElementById('qm-options');grid.innerHTML='';
  opts.forEach(o=>{const btn=document.createElement('button');btn.className='modal-opt';btn.textContent=o.ru;
    btn.addEventListener('click',()=>{if(G.qSolved)return;const all=grid.querySelectorAll('.modal-opt');all.forEach(b=>b.classList.add('disabled'));
      if(o.hanzi===word.hanzi){G.qSolved=true;btn.classList.add('correct');document.getElementById('qm-feedback').textContent='Молодец! ✨';document.getElementById('qm-feedback').className='modal-feedback ok';speak(word.hanzi);updateMastery(word.hanzi,true,'practice');onCorrect();}
      else{btn.classList.add('wrong');all.forEach(b=>{if(b.textContent===word.ru)b.classList.add('correct');});document.getElementById('qm-feedback').textContent=`Правильный ответ: ${word.ru}`;document.getElementById('qm-feedback').className='modal-feedback fail';updateMastery(word.hanzi,false,'practice');G.levelMistakes++;G.totalLevelMistakes++;const prog=getProgress();prog.mistakes++;saveProgress(prog);if(onWrong)onWrong();}
      document.getElementById('qm-next').style.display='inline-flex';});grid.appendChild(btn);});
  document.getElementById('q-modal').classList.add('active');
};
G.speakQ=function(){if(G.qWord)speak(G.qWord.hanzi);};
G.closeQModal=function(){document.getElementById('q-modal').classList.remove('active');E.paused=false;};

// ===== GATE =====
G.startGateQuestions=function(){document.getElementById('gate-prompt').style.display='none';G.gateQs=shuffle(G.lesson.words).slice(0,3);G.gateQIdx=0;G.gateCorrect=0;G.showGateQ();};
G.showGateQ=function(){if(G.gateQIdx>=G.gateQs.length){if(G.gateCorrect>=3)G.levelComplete();else{toast('Попробуй ещё раз!');G.gateQIdx=0;G.gateCorrect=0;G.showGateQ();}return;}const w=G.gateQs[G.gateQIdx];G.showQModal(w,()=>{updateMastery(w.hanzi,true,'gate');G.gateCorrect++;G.gateQIdx++;setTimeout(()=>G.showGateQ(),600);},()=>{updateMastery(w.hanzi,false,'gate');G.gateQIdx++;setTimeout(()=>G.showGateQ(),800);},G.gateQIdx<2);};

// ===== LEVEL COMPLETE =====
G.levelComplete=function(){E.running=false;if(E.requestId){cancelAnimationFrame(E.requestId);E.requestId=null;}const prog=getProgress();prog.coins+=E.collectedCoins;prog.learned+=E.answeredQs;saveProgress(prog);if(G.levelIdx<2){toast('Отлично! 🎉');confetti();G.levelIdx++;setTimeout(()=>G.launchPlatformer(),1500);}else G.openBossBattle();};

// ===== BOSS (3 phases, NO PINYIN) =====
G.openBossBattle=function(){const lesson=G.lesson;const words=lesson.words;G.bossPlayerHP=5;G.bossEnemyHP=words.length;G.bossCorrect=0;G.bossWrong=0;G.bossPhase=0;
  const cs=getCourses();const course=cs[G.courseIdx];
  // Show boss story line
  if(course.bossLine){toast(course.bossLine,3000);}
  const all=shuffle([...words]);const n1=Math.ceil(all.length/3),n2=Math.ceil((all.length-n1)/2);
  G.bossPhaseWords=[all.slice(0,n1),all.slice(n1,n1+n2),all.slice(n1+n2)];
  G.bossPhases=[{type:'hanzi2ru',desc:'汉字 → 俄语'},{type:'ru2hanzi',desc:'俄语 → 汉字'},{type:'audio2hanzi',desc:'听力 → 汉字'}];
  G.bossQs=G.bossPhaseWords[0];G.bossQIdx=0;
  document.getElementById('boss-title').textContent=lesson.bossName;document.getElementById('b-boss-emoji').textContent=lesson.bossEmoji;
  G.updateBossPhaseBar();G.renderBossQ();G.showScreen('boss-screen');G.showBossPhaseOverlay(0);
};
G.showBossPhaseOverlay=function(phase){const ph=G.bossPhases[phase];document.getElementById('bpo-title').textContent=`Фаза ${phase+1}`;document.getElementById('bpo-desc').textContent=ph.desc;document.getElementById('boss-phase-overlay').style.display='flex';setTimeout(()=>{document.getElementById('boss-phase-overlay').style.display='none';},1200);};
G.updateBossPhaseBar=function(){const bar=document.getElementById('boss-phase-bar');bar.innerHTML='';for(let i=0;i<3;i++){const seg=document.createElement('div');seg.className='boss-phase-seg'+(i<G.bossPhase?' done':i===G.bossPhase?' active':'');bar.appendChild(seg);}document.getElementById('boss-phase-label').textContent=`Фаза ${G.bossPhase+1}/3: ${G.bossPhases[G.bossPhase].desc}`;};
G.renderBossQ=function(){if(G.bossQIdx>=G.bossQs.length){if(G.bossPhase<2){G.bossPhase++;G.bossQs=G.bossPhaseWords[G.bossPhase];G.bossQIdx=0;G.updateBossPhaseBar();G.showBossPhaseOverlay(G.bossPhase);setTimeout(()=>G.renderBossQ(),1400);return;}else{G.bossWin();return;}}const w=G.bossQs[G.bossQIdx],words=G.lesson.words,ptype=G.bossPhases[G.bossPhase].type;let ph='',bh='';for(let i=0;i<5;i++)ph+=i<G.bossPlayerHP?'❤️':'🖤';for(let i=0;i<words.length;i++)bh+=i<G.bossEnemyHP?'💜':'🖤';document.getElementById('b-player-hp').textContent=ph;document.getElementById('b-boss-hp').textContent=bh;document.getElementById('b-feedback').textContent='';const wrongs=shuffle(words.filter(x=>x.hanzi!==w.hanzi)).slice(0,3);const bqL=document.getElementById('bq-label'),bqH=document.getElementById('bq-hanzi');
  if(ptype==='hanzi2ru'){bqL.textContent='Что означает?';bqH.textContent=w.hanzi;bqH.style.fontSize='3rem';const opts=shuffle([w,...wrongs]),grid=document.getElementById('b-options');grid.innerHTML='';opts.forEach(o=>{const btn=document.createElement('button');btn.className='boss-opt';btn.textContent=o.ru;btn.dataset.hanzi=o.hanzi;btn.addEventListener('click',()=>G.handleBossAns(btn,o.hanzi===w.hanzi,w));grid.appendChild(btn);});}
  else if(ptype==='ru2hanzi'){bqL.textContent='Какой иероглиф?';bqH.textContent=w.ru;bqH.style.fontSize='1.5rem';const opts=shuffle([w,...wrongs]),grid=document.getElementById('b-options');grid.innerHTML='';opts.forEach(o=>{const btn=document.createElement('button');btn.className='boss-opt';btn.innerHTML=`<span class="boss-opt-hanzi">${o.hanzi}</span>`;btn.dataset.hanzi=o.hanzi;btn.addEventListener('click',()=>G.handleBossAns(btn,o.hanzi===w.hanzi,w));grid.appendChild(btn);});}
  else{bqL.textContent='Послушай и выбери 👂';bqH.textContent='🔊';bqH.style.fontSize='2rem';speak(w.hanzi);const opts=shuffle([w,...wrongs]),grid=document.getElementById('b-options');grid.innerHTML='';opts.forEach(o=>{const btn=document.createElement('button');btn.className='boss-opt';btn.innerHTML=`<span class="boss-opt-hanzi">${o.hanzi}</span>`;btn.dataset.hanzi=o.hanzi;btn.addEventListener('click',()=>G.handleBossAns(btn,o.hanzi===w.hanzi,w));grid.appendChild(btn);});}
};
G.handleBossAns=function(btn,correct,word){const all=document.querySelectorAll('#b-options .boss-opt');all.forEach(b=>b.classList.add('disabled'));const fb=document.getElementById('b-feedback'),ps=document.getElementById('b-player-sprite'),bs=document.getElementById('b-boss-sprite');
  if(correct){btn.classList.add('correct');G.bossEnemyHP--;G.bossCorrect++;fb.textContent='Отличный удар! 💥';speak(word.hanzi);updateMastery(word.hanzi,true,'boss');bs.classList.add('hit');setTimeout(()=>bs.classList.remove('hit'),400);G.updateBossHP();setTimeout(()=>{G.bossQIdx++;G.renderBossQ();},1000);}
  else{btn.classList.add('wrong');G.bossPlayerHP--;G.bossWrong++;fb.textContent=`Ответ: ${word.ru}`;updateMastery(word.hanzi,false,'boss');ps.classList.add('hit');setTimeout(()=>ps.classList.remove('hit'),400);all.forEach(b=>{if(b.dataset.hanzi===word.hanzi)b.classList.add('correct');});const prog=getProgress();prog.mistakes++;saveProgress(prog);G.updateBossHP();setTimeout(()=>{if(G.bossPlayerHP<=0)G.bossLose();else{G.bossQIdx++;G.renderBossQ();}},1500);}
};
G.updateBossHP=function(){let ph='',bh='';for(let i=0;i<5;i++)ph+=i<G.bossPlayerHP?'❤️':'🖤';for(let i=0;i<G.lesson.words.length;i++)bh+=i<G.bossEnemyHP?'💜':'🖤';document.getElementById('b-player-hp').textContent=ph;document.getElementById('b-boss-hp').textContent=bh;};
G.speakBoss=function(){const w=G.bossPhaseWords[G.bossPhase]?G.bossPhaseWords[G.bossPhase][G.bossQIdx]:null;if(w)speak(w.hanzi);};

// ===== RESULT & REPORT =====
G.bossWin=function(){
  const prog=getProgress();const total=G.totalLevelMistakes+G.bossWrong;let stars=1;if(total===0)stars=3;else if(total<3)stars=2;
  const prev=prog.stars[G.courseIdx]||0;if(stars>prev)prog.stars[G.courseIdx]=stars;
  const prevM=prog.bestMistakes[G.courseIdx];if(prevM===undefined||total<prevM)prog.bestMistakes[G.courseIdx]=total;
  prog.defeated[G.courseIdx]=true;prog.coins+=E.collectedCoins+5;
  if(G.courseIdx+1<getCourses().length&&!prog.unlocked.includes(G.courseIdx+1))prog.unlocked.push(G.courseIdx+1);
  saveProgress(prog);earnBadge(G.courseIdx);
  // Show story post
  const cs=getCourses();const course=cs[G.courseIdx];
  if(course.storyPost){G.showStory(course.icon,'Победа!',course.storyPost,()=>G.showCourseReport(stars));}
  else G.showResult(true,stars);
};
G.bossLose=function(){G.showResult(false,0);};
G.showResult=function(won,stars){
  document.getElementById('res-emoji').textContent=won?'🎉':'😢';
  document.getElementById('res-title').textContent=won?'Победа!':'Не сдался!';
  document.getElementById('res-title').className=`result-title ${won?'win':'lose'}`;
  const msgs={win:['Ты победил! Ты настоящий герой!','Потрясающе! Отличная работа!','Великолепно! Ты справился!'],lose:['Почти получилось! Попробуй ещё!','Не переживай, ты уже многому научился!','Следующий раз точно получится!']};
  document.getElementById('res-msg').textContent=won?msgs.win[Math.floor(Math.random()*msgs.win.length)]:msgs.lose[Math.floor(Math.random()*msgs.lose.length)];
  let st='';for(let i=0;i<3;i++)st+=`<span class="result-star ${i<stars?'earned':''}">⭐</span>`;document.getElementById('res-stars').innerHTML=won?st:'';
  const nb=document.getElementById('res-next');
  if(won){confetti();const cs=getCourses();if(G.courseIdx+1<cs.length){nb.style.display='flex';nb.textContent='➡️ Следующий курс';nb.onclick=()=>G.openLearnPreview(G.courseIdx+1);}else{nb.style.display='flex';nb.textContent='🏠 На главную';nb.onclick=()=>G.goHome();}}
  else{nb.style.display='flex';nb.textContent='🔄 Попробовать снова';nb.onclick=()=>G.openBossBattle();}
  G.showScreen('result-screen');
};

// ===== COURSE REPORT (v5.0) =====
G.showCourseReport=function(stars){
  const cs=getCourses();const course=cs[G.courseIdx];const words=course.lesson.words;const ps=getProfiles();
  const mastered=words.filter(w=>{const p=ps[w.hanzi];return p&&p.mastery>=80;}).length;
  const weak=words.filter(w=>{const p=ps[w.hanzi];return p&&p.mastery<50;});
  const prog=getProgress();
  let st='';for(let i=0;i<3;i++)st+=i<stars?'⭐':'☆';
  const card=document.getElementById('report-card');
  let wordsHTML='';words.forEach(w=>{const p=ps[w.hanzi];const m=p?p.mastery:0;wordsHTML+=`<span class="report-word ${m<50?'weak':''}">${w.hanzi} ${m}%</span>`;});
  card.innerHTML=`
    <div class="report-stars">${st}</div>
    <div class="report-title">${course.nameRu}</div>
    <div class="report-desc">${course.desc}</div>
    <div class="report-stats">
      <div class="report-stat"><div class="report-stat-val">${words.length}</div><div class="report-stat-label">Всего слов</div></div>
      <div class="report-stat"><div class="report-stat-val">${mastered}</div><div class="report-stat-label">Усвоено</div></div>
      <div class="report-stat"><div class="report-stat-val">${G.totalLevelMistakes+G.bossWrong}</div><div class="report-stat-label">Ошибок</div></div>
      <div class="report-stat"><div class="report-stat-val">${prog.coins||0}</div><div class="report-stat-label">Монет 🪙</div></div>
    </div>
    <div class="report-words">${wordsHTML}</div>
  `;
  const nb=document.getElementById('report-next');
  if(G.courseIdx+1<cs.length){nb.style.display='flex';nb.textContent='➡️ Следующий курс';nb.onclick=()=>G.openLearnPreview(G.courseIdx+1);}
  else{nb.style.display='flex';nb.textContent='🏠 На главную';nb.onclick=()=>G.goHome();}
  G.showScreen('report-screen');
};

// ===== CHARACTER DETAIL =====
G.openDetail=function(hanzi,back){G.detailHanzi=hanzi;G.detailBack=back||'home-screen';const word=G.findWordByHanzi(hanzi);if(!word)return;const p=ensureProfile(hanzi);const mc=masteryColor(p.mastery);document.getElementById('detail-card').innerHTML=`<div class="detail-hanzi">${hanzi}</div><div class="detail-pinyin">${word.pinyin}</div><div class="detail-ru">${word.ru}</div><div class="detail-audio"><button class="audio-btn" onclick="speak('${hanzi}')">🔊</button></div><div class="detail-category">${word.category}${word.categoryZh?' ('+word.categoryZh+')':''}</div>${word.example?`<div class="detail-example"><div class="detail-example-label">Пример:</div><div class="detail-example-word">${word.example}</div><div class="detail-example-ru">${word.exampleRu||''}</div></div>`:''}<div class="detail-mastery"><div class="detail-mastery-label">Мастерство: ${p.mastery}%</div><div class="detail-mastery-bar"><div class="detail-mastery-fill" style="width:${p.mastery}%;background:${mc}"></div></div></div><div class="detail-stats"><div class="detail-stat"><div class="detail-stat-val" style="color:var(--green-dark)">${p.timesCorrect}</div><div class="detail-stat-label">Правильно</div></div><div class="detail-stat"><div class="detail-stat-val" style="color:var(--red)">${p.errors}</div><div class="detail-stat-label">Ошибок</div></div><div class="detail-stat"><div class="detail-stat-val">${p.streak}</div><div class="detail-stat-label">Серия</div></div><div class="detail-stat"><div class="detail-stat-val">${p.lastSeen||'—'}</div><div class="detail-stat-label">Последний</div></div></div>`;
  document.getElementById('detail-back').onclick=()=>G.showScreen(G.detailBack);
  G.showScreen('detail-screen');autoSpeak(hanzi);
};

// ===== DAILY REVIEW =====
G.openDailyReview=function(){G.dailyWords=getDailyReviewWords();G.dailyIdx=0;G.dailyCorrect=0;
  if(!G.dailyWords.length){document.getElementById('daily-empty').style.display='block';document.getElementById('daily-empty').innerHTML='<div class="daily-empty-icon">✅</div><h3>Всё повторено!</h3><p>Приходи завтра!</p>';document.getElementById('daily-card').style.display='none';document.getElementById('daily-options').style.display='none';document.getElementById('daily-next').style.display='none';document.getElementById('daily-feedback').textContent='';}
  else{document.getElementById('daily-empty').style.display='none';document.getElementById('daily-card').style.display='block';document.getElementById('daily-options').style.display='grid';G.renderDailyQ();}
  G.showScreen('daily-screen');};
G.renderDailyQ=function(){const idx=G.dailyIdx,total=G.dailyWords.length;if(idx>=total){G.dailyComplete();return;}
  document.getElementById('daily-counter').textContent=`${idx+1}/${total}`;document.getElementById('daily-bar').style.width=(idx/total*100)+'%';
  const hanzi=G.dailyWords[idx],word=G.findWordByHanzi(hanzi);if(!word){G.dailyIdx++;G.renderDailyQ();return;}
  const showP=shouldShowPinyin(hanzi),p=ensureProfile(hanzi);
  document.getElementById('daily-card').innerHTML=`<div class="daily-hanzi" onclick="G.openDetail('${hanzi}','daily-screen')">${hanzi}</div>${showP?`<div class="daily-pinyin">${word.pinyin}</div>`:''}<div class="daily-ru">${word.ru}</div><button class="audio-btn" onclick="speak('${hanzi}')">🔊</button><div style="font-size:.7rem;color:var(--text-light);margin-top:3px">Мастерство: ${p.mastery}%</div>`;
  autoSpeak(hanzi);
  const allW=getAllWords(),sameCat=allW.filter(w=>w.category===word.category&&w.hanzi!==hanzi);let wrongs=shuffle(sameCat).slice(0,3);if(wrongs.length<3){wrongs=[...wrongs,...shuffle(allW.filter(w=>w.hanzi!==hanzi&&!wrongs.find(x=>x.hanzi===w.hanzi))).slice(0,3-wrongs.length)];}
  const opts=shuffle([word,...wrongs]),grid=document.getElementById('daily-options');grid.innerHTML='';document.getElementById('daily-feedback').textContent='';document.getElementById('daily-feedback').className='daily-feedback';document.getElementById('daily-next').style.display='none';
  opts.forEach(o=>{const btn=document.createElement('button');btn.className='daily-opt';btn.textContent=o.ru;
    btn.addEventListener('click',()=>{grid.querySelectorAll('.daily-opt').forEach(b=>b.classList.add('disabled'));
      if(o.hanzi===hanzi){btn.classList.add('correct');G.dailyCorrect++;updateMastery(hanzi,true,'daily');document.getElementById('daily-feedback').textContent='Отлично! ✨';document.getElementById('daily-feedback').className='daily-feedback ok';speak(hanzi);}
      else{btn.classList.add('wrong');grid.querySelectorAll('.daily-opt').forEach(b=>{if(b.textContent===word.ru)b.classList.add('correct');});document.getElementById('daily-feedback').textContent=`Это: ${word.ru}`;document.getElementById('daily-feedback').className='daily-feedback fail';updateMastery(hanzi,false,'daily');}
      document.getElementById('daily-next').style.display='inline-flex';});grid.appendChild(btn);});};
G.dailyNext=function(){G.dailyIdx++;G.renderDailyQ();};
G.dailyComplete=function(){const prog=getProgress();prog.coins+=G.dailyCorrect;saveProgress(prog);document.getElementById('daily-card').style.display='none';document.getElementById('daily-options').style.display='none';document.getElementById('daily-next').style.display='none';document.getElementById('daily-empty').style.display='block';document.getElementById('daily-empty').innerHTML=`<div class="daily-empty-icon">🎉</div><h3>Готово!</h3><p>${G.dailyCorrect}/${G.dailyWords.length} правильно. +${G.dailyCorrect} 🪙</p>`;document.getElementById('daily-bar').style.width='100%';};

// ===== MINI GAMES (same as v4.0, slightly compact) =====
G.openMiniGameSelect=function(){G.showScreen('mg-select-screen');};
G.startMiniGame=function(type){G.mgType=type;G.mgScore=0;const all=getSmartReviewQueue(20),words=all.map(h=>G.findWordByHanzi(h)).filter(Boolean);if(words.length<4){toast('Нужно больше слов!');return;}G.mgWords=shuffle(words).slice(0,8);G.showScreen('minigame-screen');document.getElementById('mg-result').style.display='none';if(type==='match')G.renderMatchGame();else if(type==='audio')G.renderAudioGame();else if(type==='memory')G.renderMemoryGame();else if(type==='speed')G.startSpeedGame();};
G.renderMatchGame=function(){document.getElementById('mg-title').textContent='🔗 Соедини пары';document.getElementById('mg-timer').textContent='';document.getElementById('mg-score').textContent='';const pairs=G.mgWords.slice(0,6);G.mgPairs=pairs;G.mgMatched=new Set();G.mgSelected=null;document.getElementById('mg-instruction').textContent='Выбери иероглиф и его перевод';
  const left=shuffle([...pairs]),right=shuffle([...pairs]),area=document.getElementById('mg-area');area.innerHTML='<div class="mg-match-grid"><div class="mg-match-col" id="mg-left"></div><div class="mg-match-col" id="mg-right"></div></div>';
  const makeHandler=(side)=>(w)=>{if(G.mgMatched.has(w.hanzi))return;if(G.mgSelected&&G.mgSelected.side!==side){if(G.mgSelected.hanzi===w.hanzi){G.mgMatched.add(w.hanzi);G.mgScore++;document.querySelectorAll(`[data-hanzi="${w.hanzi}"]`).forEach(b=>{b.classList.add('matched');b.classList.remove('selected');});G.mgSelected=null;toast('Правильно! ✨');updateMastery(w.hanzi,true,'practice');if(G.mgMatched.size>=pairs.length)G.mgGameComplete('match');}else{document.querySelectorAll('.mg-match-card.selected').forEach(b=>b.classList.remove('selected'));G.mgSelected=null;toast('Попробуй ещё!');updateMastery(w.hanzi,false,'practice');}}else{document.querySelectorAll('.mg-match-card.selected').forEach(b=>b.classList.remove('selected'));G.mgSelected={hanzi:w.hanzi,side};}};
  left.forEach(w=>{const btn=document.createElement('button');btn.className='mg-match-card';btn.textContent=w.hanzi;btn.dataset.hanzi=w.hanzi;btn.addEventListener('click',()=>makeHandler('left')(w));document.getElementById('mg-left').appendChild(btn);});
  right.forEach(w=>{const btn=document.createElement('button');btn.className='mg-match-card';btn.textContent=w.ru;btn.dataset.hanzi=w.hanzi;btn.addEventListener('click',()=>makeHandler('right')(w));document.getElementById('mg-right').appendChild(btn);});};
G.renderAudioGame=function(){document.getElementById('mg-title').textContent='👂 Угадай на слух';document.getElementById('mg-instruction').textContent='Послушай и выбери иероглиф';document.getElementById('mg-timer').textContent='';const words=G.mgWords.slice(0,8);G.mgSpeedQs=words;G.mgSpeedIdx=0;G.mgScore=0;G.renderAudioQ();};
G.renderAudioQ=function(){const words=G.mgSpeedQs,idx=G.mgSpeedIdx;document.getElementById('mg-score').textContent=`${G.mgScore}/${words.length}`;if(idx>=words.length){G.mgGameComplete('audio');return;}const w=words[idx];speak(w.hanzi);const wrongs=shuffle(G.mgWords.filter(x=>x.hanzi!==w.hanzi)).slice(0,3),opts=shuffle([w,...wrongs]),area=document.getElementById('mg-area');area.innerHTML='';const label=document.createElement('div');label.className='mg-speed-question';label.textContent='Что это?';area.appendChild(label);const grid=document.createElement('div');grid.className='mg-speed-options';area.appendChild(grid);
  opts.forEach(o=>{const btn=document.createElement('button');btn.className='mg-speed-opt';btn.innerHTML=`<span style="font-size:2rem;font-weight:900">${o.hanzi}</span>`;btn.addEventListener('click',()=>{grid.querySelectorAll('.mg-speed-opt').forEach(b=>b.style.pointerEvents='none');if(o.hanzi===w.hanzi){btn.classList.add('correct');G.mgScore++;updateMastery(w.hanzi,true,'practice');toast('Молодец! ✨');speak(w.hanzi);}else{btn.classList.add('wrong');updateMastery(w.hanzi,false,'practice');toast(`Это ${w.hanzi}`);}setTimeout(()=>{G.mgSpeedIdx++;G.renderAudioQ();},1200);});grid.appendChild(btn);});};
G.renderMemoryGame=function(){document.getElementById('mg-title').textContent='🃏 Память';document.getElementById('mg-instruction').textContent='Найди пары: иероглиф + русский';document.getElementById('mg-timer').textContent='';const pairs=G.mgWords.slice(0,4);G.mgMemoryCards=[];G.mgMemoryFlipped=[];G.mgMemoryMatched=new Set();G.mgMemoryLocked=false;G.mgScore=0;pairs.forEach(w=>{G.mgMemoryCards.push({id:w.hanzi+'-h',hanzi:w.hanzi,display:w.hanzi,type:'h'});G.mgMemoryCards.push({id:w.hanzi+'-r',hanzi:w.hanzi,display:w.ru,type:'r'});});G.mgMemoryCards=shuffle(G.mgMemoryCards);
  const area=document.getElementById('mg-area');area.innerHTML='';document.getElementById('mg-score').textContent='';const grid=document.createElement('div');grid.className='mg-memory-grid';area.appendChild(grid);
  G.mgMemoryCards.forEach((card,i)=>{const el=document.createElement('div');el.className='mg-memory-card hidden';el.dataset.idx=i;el.addEventListener('click',()=>{if(G.mgMemoryLocked||el.classList.contains('flipped')||el.classList.contains('matched'))return;el.classList.remove('hidden');el.classList.add('flipped');el.textContent=card.display;el.style.fontSize=card.type==='h'?'2rem':'1rem';G.mgMemoryFlipped.push({el,card});
    if(G.mgMemoryFlipped.length===2){const[a,b]=G.mgMemoryFlipped;if(a.card.hanzi===b.card.hanzi&&a.card.type!==b.card.type){a.el.classList.add('matched');b.el.classList.add('matched');G.mgMemoryMatched.add(a.card.hanzi);G.mgScore++;updateMastery(a.card.hanzi,true,'practice');toast('Пара! ✨');speak(a.card.hanzi);G.mgMemoryFlipped=[];if(G.mgMemoryMatched.size>=pairs.length)G.mgGameComplete('memory');}else{G.mgMemoryLocked=true;updateMastery(a.card.hanzi,false,'practice');setTimeout(()=>{a.el.classList.add('hidden');a.el.classList.remove('flipped');a.el.textContent='';b.el.classList.add('hidden');b.el.classList.remove('flipped');b.el.textContent='';G.mgMemoryFlipped=[];G.mgMemoryLocked=false;},800);}}});grid.appendChild(el);});};
G.startSpeedGame=function(){document.getElementById('mg-title').textContent='⚡ Быстрый ответ';document.getElementById('mg-instruction').textContent='60 секунд!';const words=shuffle([...G.mgWords]);G.mgSpeedQs=words;G.mgSpeedIdx=0;G.mgScore=0;G.mgSpeedTimer=60;const te=document.getElementById('mg-timer');te.textContent='60';if(G.mgSpeedInterval)clearInterval(G.mgSpeedInterval);G.mgSpeedInterval=setInterval(()=>{G.mgSpeedTimer--;te.textContent=G.mgSpeedTimer;if(G.mgSpeedTimer<=10)te.classList.add('warning');if(G.mgSpeedTimer<=0){clearInterval(G.mgSpeedInterval);G.mgSpeedInterval=null;G.mgGameComplete('speed');}},1000);G.renderSpeedQ();};
G.renderSpeedQ=function(){if(G.mgSpeedIdx>=G.mgSpeedQs.length||G.mgSpeedTimer<=0)return;const w=G.mgSpeedQs[G.mgSpeedIdx];document.getElementById('mg-score').textContent=`⭐ ${G.mgScore}`;const wrongs=shuffle(G.mgWords.filter(x=>x.hanzi!==w.hanzi)).slice(0,3),opts=shuffle([w,...wrongs]),area=document.getElementById('mg-area');area.innerHTML=`<div class="mg-speed-hanzi">${w.hanzi}</div>`;const grid=document.createElement('div');grid.className='mg-speed-options';area.appendChild(grid);
  opts.forEach(o=>{const btn=document.createElement('button');btn.className='mg-speed-opt';btn.textContent=o.ru;btn.addEventListener('click',()=>{if(G.mgSpeedTimer<=0)return;grid.querySelectorAll('.mg-speed-opt').forEach(b=>b.style.pointerEvents='none');if(o.hanzi===w.hanzi){btn.classList.add('correct');G.mgScore++;updateMastery(w.hanzi,true,'practice');speak(w.hanzi);}else{btn.classList.add('wrong');updateMastery(w.hanzi,false,'practice');}setTimeout(()=>{G.mgSpeedIdx++;G.renderSpeedQ();},500);});grid.appendChild(btn);});};
G.mgGameComplete=function(type){if(G.mgSpeedInterval){clearInterval(G.mgSpeedInterval);G.mgSpeedInterval=null;}const total=type==='speed'?G.mgSpeedIdx:G.mgWords.slice(0,type==='match'?6:8).length;const prog=getProgress();prog.coins+=G.mgScore;saveProgress(prog);
  const result=document.getElementById('mg-result');result.style.display='block';result.innerHTML=`<div class="mg-result-emoji">${G.mgScore>=total*0.7?'🎉':'💪'}</div><div class="mg-result-score">⭐ ${G.mgScore}</div><div class="mg-result-msg">${type==='speed'?`Ответил на ${G.mgScore}!`:`${G.mgScore}/${total} правильно!`}</div><button class="btn btn-primary btn-small" onclick="G.startMiniGame('${type}')">🔄 Ещё</button> <button class="btn btn-ghost btn-small" onclick="G.openMiniGameSelect()">⬅️</button>`;document.getElementById('mg-area').innerHTML='';};

// ===== DIFFICULT WORDS / BADGES / EDITOR / PROGRESS =====
G.openDifficultWords=function(){const ps=getProfiles();const dw=Object.values(ps).filter(p=>p.mastery<50&&p.totalAttempts>0).sort((a,b)=>a.mastery-b.mastery).slice(0,20);const list=document.getElementById('diff-list');list.innerHTML='';
  if(!dw.length){list.innerHTML='<div class="diff-empty"><div class="diff-empty-icon">🌟</div><h3>Нет сложных слов!</h3><p style="color:var(--text-light)">Все иероглифы даются легко!</p></div>';G.showScreen('difficult-screen');return;}
  dw.forEach(p=>{const word=G.findWordByHanzi(p.hanzi);if(!word)return;const item=document.createElement('div');item.className='diff-word-card';item.innerHTML=`<div class="diff-hanzi">${p.hanzi}</div><div class="diff-info"><div class="diff-pinyin">${word.pinyin}</div><div class="diff-ru">${word.ru}</div><div class="diff-meta">Мастерство: ${p.mastery}% · Серия: ${p.streak}</div></div><div class="diff-count">${p.mastery}%</div>`;item.addEventListener('click',()=>G.openDetail(p.hanzi,'difficult-screen'));list.appendChild(item);});G.showScreen('difficult-screen');};
G.openBadges=function(){const prog=getProgress();const cs=getCourses();const grid=document.getElementById('badge-grid');grid.innerHTML='';cs.forEach((c,i)=>{const earned=!!(prog.badges&&prog.badges[i]);const card=document.createElement('div');card.className=`badge-card ${earned?'earned':'locked'}`;card.innerHTML=`<div class="badge-icon">${earned?c.icon:'🔒'}</div><div class="badge-name">${c.nameRu}</div>${earned?`<div class="badge-date">${prog.badges[i].date}</div>`:'<div style="font-size:.65rem;color:var(--text-light);margin-top:2px">Не пройдено</div>'}`;grid.appendChild(card);});G.showScreen('badges-screen');};
G.openEditor=function(){G.filterCat='all';G.renderEditorFilter();G.renderWordList();G.showScreen('editor-screen');};
G.renderEditorFilter=function(){const cs=getCourses();const cats=['all',...cs.map(c=>c.lesson.category)];const div=document.getElementById('editor-filter');div.innerHTML='';cats.forEach(c=>{const btn=document.createElement('button');btn.className=`filter-chip ${G.filterCat===c?'active':''}`;btn.textContent=c==='all'?'Все':c;btn.addEventListener('click',()=>{G.filterCat=c;G.renderEditorFilter();G.renderWordList();});div.appendChild(btn);});};
G.renderWordList=function(){const cs=getCourses();const list=document.getElementById('word-list');list.innerHTML='';cs.forEach((course,ci)=>{course.lesson.words.forEach((w,wi)=>{if(G.filterCat!=='all'&&course.lesson.category!==G.filterCat)return;const item=document.createElement('div');item.className='word-item';item.innerHTML=`<div class="word-hanzi-lg">${w.hanzi}</div><div class="word-details"><div class="word-pinyin-text">${w.pinyin}</div><div class="word-ru-text">${w.ru}</div><div class="word-meta">${course.lesson.category}</div></div><div class="word-actions"><button class="word-act-btn word-act-edit" data-ci="${ci}" data-wi="${wi}">✏️</button><button class="word-act-btn word-act-del" data-ci="${ci}" data-wi="${wi}">🗑️</button></div>`;item.querySelector('.word-hanzi-lg').addEventListener('click',()=>G.openDetail(w.hanzi,'editor-screen'));list.appendChild(item);});});list.querySelectorAll('.word-act-edit').forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();G.editWord(+btn.dataset.ci,+btn.dataset.wi);});});list.querySelectorAll('.word-act-del').forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();const cs=getCourses();if(confirm(`Удалить "${cs[+btn.dataset.ci].lesson.words[+btn.dataset.wi].hanzi}"?`)){cs[+btn.dataset.ci].lesson.words.splice(+btn.dataset.wi,1);saveCourses(cs);G.renderEditorFilter();G.renderWordList();}});});};
G.showAddForm=function(){document.getElementById('ef-title').textContent='Добавить';['ef-hanzi','ef-pinyin','ef-ru','ef-cat','ef-emoji','ef-example','ef-example-ru'].forEach(id=>document.getElementById(id).value='');document.getElementById('ef-diff').value='easy';document.getElementById('ef-edit-idx').value='-1';document.getElementById('editor-form').classList.add('active');};
G.hideAddForm=function(){document.getElementById('editor-form').classList.remove('active');};
G.editWord=function(ci,wi){const cs=getCourses();const w=cs[ci].lesson.words[wi];document.getElementById('ef-title').textContent='Редактировать';document.getElementById('ef-hanzi').value=w.hanzi;document.getElementById('ef-pinyin').value=w.pinyin;document.getElementById('ef-ru').value=w.ru;document.getElementById('ef-cat').value=cs[ci].lesson.category;document.getElementById('ef-diff').value=w.difficulty||'easy';document.getElementById('ef-emoji').value=w.emoji||'';document.getElementById('ef-example').value=w.example||'';document.getElementById('ef-example-ru').value=w.exampleRu||'';document.getElementById('ef-edit-idx').value=`${ci},${wi}`;document.getElementById('editor-form').classList.add('active');};
G.saveWord=function(){const hanzi=document.getElementById('ef-hanzi').value.trim(),pinyin=document.getElementById('ef-pinyin').value.trim(),ru=document.getElementById('ef-ru').value.trim(),cat=document.getElementById('ef-cat').value.trim()||'Другое',diff=document.getElementById('ef-diff').value,emoji=document.getElementById('ef-emoji').value.trim(),example=document.getElementById('ef-example').value.trim(),exampleRu=document.getElementById('ef-example-ru').value.trim();if(!hanzi||!ru){toast('Нужны汉字 и русский!');return;}const cs=getCourses(),editStr=document.getElementById('ef-edit-idx').value,wd={hanzi,pinyin,ru,difficulty:diff,emoji,example,exampleRu};
  if(editStr!=='-1'){const[ci,wi]=editStr.split(',').map(Number);cs[ci].lesson.words[wi]=wd;}
  else{let target=cs.find(c=>c.lesson.category===cat);if(!target){cs.push({id:'custom_'+Date.now(),nameRu:cat,desc:'Пользовательский',icon:'📝',storyPre:'',storyPost:'',bossLine:'',lesson:{category:cat,categoryZh:'',bossEmoji:'👾',bossName:`Босс ${cat}`,skyColors:['#87CEEB','#E0F0FF'],groundColor:'#4CAF50',theme:'grass',words:[]}});target=cs[cs.length-1];}target.lesson.words.push(wd);}
  saveCourses(cs);G.hideAddForm();G.renderEditorFilter();G.renderWordList();toast('Сохранено! ✅');};
G.exportWords=function(){const json=JSON.stringify(getCourses(),null,2);navigator.clipboard.writeText(json).then(()=>toast('Скопировано! 📋')).catch(()=>{});const blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='hanzi_courses.json';a.click();URL.revokeObjectURL(url);toast('Экспорт! 📤');};
G.toggleImport=function(){const area=document.getElementById('import-area');area.style.display=area.style.display==='none'?'block':'none';};
G.setImportTab=function(tab){G.importTab=tab;document.getElementById('import-json-tab').className=`btn btn-small ${tab==='json'?'btn-primary':'btn-ghost'}`;document.getElementById('import-csv-tab').className=`btn btn-small ${tab==='csv'?'btn-primary':'btn-ghost'}`;};
G.doImport=function(){try{const text=document.getElementById('import-text').value;if(G.importTab==='csv'){const words=parseCSV(text);if(!words.length)throw new Error('Empty');const cs=getCourses();const byCat={};words.forEach(w=>{if(!byCat[w.category])byCat[w.category]=[];byCat[w.category].push(w);});for(const cat in byCat){let target=cs.find(c=>c.lesson.category===cat);if(!target){cs.push({id:'csv_'+Date.now(),nameRu:cat,desc:'CSV импорт',icon:'📝',storyPre:'',storyPost:'',bossLine:'',lesson:{category:cat,categoryZh:'',bossEmoji:'👾',bossName:`Босс ${cat}`,skyColors:['#87CEEB','#E0F0FF'],groundColor:'#4CAF50',theme:'grass',words:[]}});target=cs[cs.length-1];}byCat[cat].forEach(w=>{target.lesson.words.push({hanzi:w.hanzi,pinyin:w.pinyin,ru:w.ru,difficulty:w.difficulty,emoji:w.emoji||'',example:'',exampleRu:''});});}saveCourses(cs);}else{const data=JSON.parse(text);if(!Array.isArray(data))throw new Error('Expected array');saveCourses(data);}G.renderEditorFilter();G.renderWordList();G.toggleImport();toast('Импортировано! ✅');}catch(e){toast('Ошибка! ❌');}};
G.openProgress=function(){const prog=getProgress(),cs=getCourses(),allWords=getAllWords(),profiles=getProfiles();const mastered=Object.values(profiles).filter(p=>p.mastery>=80).length,totalErrors=Object.values(profiles).reduce((s,p)=>s+p.errors,0);
  document.getElementById('stats-grid').innerHTML=`<div class="stat-card"><div class="stat-value">${Object.keys(profiles).length}</div><div class="stat-label">Видел</div></div><div class="stat-card"><div class="stat-value">${mastered}</div><div class="stat-label">Усвоено</div></div><div class="stat-card"><div class="stat-value">${prog.coins||0}</div><div class="stat-label">Монет 🪙</div></div><div class="stat-card"><div class="stat-value">${prog.streak||0}</div><div class="stat-label">Серия дн.</div></div>`;
  const wl=document.getElementById('wp-list');wl.innerHTML='';cs.forEach((c,i)=>{const defeated=!!prog.defeated[i],stars=prog.stars[i]||0,m=prog.bestMistakes[i];let st='';for(let s=0;s<3;s++)st+=s<stars?'⭐':'☆';const words=c.lesson.words,avg=words.length>0?Math.round(words.reduce((s,w)=>{const p=profiles[w.hanzi];return s+(p?p.mastery:0);},0)/words.length):0;const item=document.createElement('div');item.className='wp-item';item.innerHTML=`<div class="wp-icon">${c.icon}</div><div class="wp-info"><div class="wp-name">${c.nameRu}</div><div class="wp-detail">${words.length} слов · ${defeated?'✅':'—'} · ${avg}%${m!==undefined?' · ❌'+m:''}</div></div><div class="wp-stars">${st}</div>`;wl.appendChild(item);});
  const ml=document.getElementById('mistake-list');ml.innerHTML='';const top=Object.values(profiles).filter(p=>p.errors>=2).sort((a,b)=>b.errors-a.errors).slice(0,10);if(!top.length)ml.innerHTML='<span style="color:var(--text-light);font-size:.85rem">Пока нет частых ошибок</span>';else top.forEach(p=>{const tag=document.createElement('span');tag.className='mistake-tag';tag.textContent=`${p.hanzi} (${p.mastery}%)`;tag.addEventListener('click',()=>G.openDetail(p.hanzi,'progress-screen'));ml.appendChild(tag);});G.showScreen('progress-screen');};
G.exportAllData=function(){G.parentLockAction('backup');};
G.doExportBackup=function(){const data={version:'5.0',date:todayStr(),courses:getCourses(),progress:getProgress(),profiles:getProfiles(),settings:getSettings()};const json=JSON.stringify(data,null,2),blob=new Blob([json],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`hanzi_backup_${todayStr()}.json`;a.click();URL.revokeObjectURL(url);toast('Бэкап скачан! 📤');};
G.triggerImportBackup=function(){document.getElementById('backup-file').click();};
G.importAllData=function(event){const file=event.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=function(e){try{const data=JSON.parse(e.target.result);if(!data.version)throw new Error('Invalid');if(data.courses)saveCourses(data.courses);if(data.progress)saveProgress(data.progress);if(data.profiles)saveProfiles(data.profiles);if(data.settings)saveSettings(data.settings);toast('Данные восстановлены! ✅');G.renderHome();}catch(err){toast('Ошибка! ❌');}};reader.readAsText(file);event.target.value='';};

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{
  try{if(!localStorage.getItem('hanzi_courses'))saveCourses(getDefaultCourses());}catch(e){saveCourses(getDefaultCourses());}
  try{if(!localStorage.getItem('hanzi_settings'))saveSettings({sound:true,autospeak:true,pinyin:false,difficulty:'normal'});}catch(e){}
  // Ensure all courses unlocked
  try{const prog=getProgress();const n=getCourses().length;for(let i=0;i<n;i++)if(!prog.unlocked.includes(i))prog.unlocked.push(i);saveProgress(prog);}catch(e){}
  applyDecay();G._storyShown=false;G.renderHome();G.showScreen('home-screen');G.setImportTab('json');
});
