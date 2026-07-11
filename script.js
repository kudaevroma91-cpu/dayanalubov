const reveals=document.querySelectorAll('.reveal');
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
reveals.forEach(el=>observer.observe(el));

const glow=document.getElementById('glow');
addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});

function makeHeart(x=null,y=null,burst=false){
  const h=document.createElement('span');h.className='float-heart';h.textContent=Math.random()>.25?'♥':'♡';
  h.style.left=(x??Math.random()*100)+(x===null?'vw':'px');
  if(y!==null){h.style.bottom=(innerHeight-y)+'px'}
  h.style.fontSize=(12+Math.random()*(burst?34:20))+'px';h.style.opacity=.3+Math.random()*.65;
  h.style.animationDuration=(burst?1.8:4+Math.random()*4)+'s';document.body.appendChild(h);setTimeout(()=>h.remove(),8000)
}
setInterval(()=>makeHeart(),650);
document.getElementById('heartBtn').addEventListener('click',e=>{
  document.getElementById('secret').classList.add('show');
  const r=e.currentTarget.getBoundingClientRect();for(let i=0;i<35;i++)setTimeout(()=>makeHeart(r.left+r.width/2,r.top+r.height/2,true),i*18);
  const burst=document.getElementById('loveBurst');burst.classList.remove('active');void burst.offsetWidth;burst.classList.add('active');
  const colors=['#ff2f7d','#ff72a7','#ffb3cd','#ffffff','#e92f86','#ff86c0'];
  for(let wave=0;wave<3;wave++)setTimeout(()=>{for(let i=0;i<55;i++){const p=document.createElement(i%6===0?'i':'span');p.className=i%6===0?'burst-spark':'burst-particle';if(i%6!==0)p.textContent=i%4===0?'♡':'♥';const a=Math.random()*Math.PI*2,d=180+Math.random()*Math.max(innerWidth,innerHeight)*.72;p.style.setProperty('--x',Math.cos(a)*d+'px');p.style.setProperty('--y',Math.sin(a)*d+'px');p.style.setProperty('--rot',(Math.random()*900-450)+'deg');p.style.setProperty('--dur',(1.35+Math.random()*1.5)+'s');p.style.setProperty('--scale',(.5+Math.random()*1.8));p.style.setProperty('--particle',colors[Math.floor(Math.random()*colors.length)]);p.style.fontSize=(14+Math.random()*48)+'px';document.body.appendChild(p);setTimeout(()=>p.remove(),3200)}},wave*240);
  setTimeout(()=>burst.classList.remove('active'),3500)
});

let audio,master,playing=false,musicTimer,step=0;
const progression=[[261.63,329.63,392],[220,261.63,329.63],[174.61,220,261.63],[196,246.94,293.66],[220,277.18,329.63],[174.61,220,261.63],[196,246.94,293.66],[196,261.63,329.63]];
const melody=[659.25,587.33,523.25,493.88,440,392,440,523.25,587.33,523.25,440,392,349.23,392,440,493.88];
function tone(freq,when,duration,volume,type='sine'){const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.0001,when);g.gain.exponentialRampToValueAtTime(volume,when+.12);g.gain.exponentialRampToValueAtTime(.0001,when+duration);o.connect(g).connect(master);o.start(when);o.stop(when+duration+.05)}
function scheduleMusic(){if(!playing)return;const now=audio.currentTime+.06,chord=progression[Math.floor(step/4)%progression.length];if(step%4===0)chord.forEach((n,i)=>tone(n/(i===0?2:1),now,3.7,.027,i===0?'triangle':'sine'));tone(melody[step%melody.length],now,1.55,.025);tone(chord[step%3]*2,now+.75,.55,.012,'triangle');step=(step+1)%256;musicTimer=setTimeout(scheduleMusic,1500)}
document.getElementById('sound').addEventListener('click',e=>{if(!audio){audio=new (window.AudioContext||window.webkitAudioContext)();master=audio.createGain();master.connect(audio.destination)}playing=!playing;e.currentTarget.style.background=playing?'#ec3d83':'#fff7';e.currentTarget.style.color=playing?'white':'#ec3d83';document.getElementById('nowPlaying').classList.toggle('show',playing);if(playing){master.gain.setTargetAtTime(.8,audio.currentTime,.1);audio.resume();scheduleMusic()}else{clearTimeout(musicTimer);master.gain.setTargetAtTime(.0001,audio.currentTime,.15)}});

const field=document.getElementById('gameField'),scoreEl=document.getElementById('score'),timerEl=document.getElementById('timer'),intro=document.getElementById('gameIntro'),message=document.getElementById('gameMessage');let score=0,timeLeft=20,gameActive=false,spawnTimer,countTimer;
function spawnGameHeart(){if(!gameActive)return;const h=document.createElement('button');h.className='catch-heart';h.textContent=Math.random()>.18?'♥':'♡';h.setAttribute('aria-label','Поймать сердечко');const size=28+Math.random()*38;h.style.fontSize=size+'px';h.style.left=Math.random()*(field.clientWidth-size-12)+6+'px';h.style.top=Math.random()*(field.clientHeight-size-12)+6+'px';h.onclick=()=>{if(!gameActive)return;score++;scoreEl.textContent=score;h.classList.add('caught');setTimeout(()=>h.remove(),350)};field.appendChild(h);setTimeout(()=>h.remove(),1700);spawnTimer=setTimeout(spawnGameHeart,380+Math.random()*300)}
function finishGame(){gameActive=false;clearTimeout(spawnTimer);clearInterval(countTimer);field.querySelectorAll('.catch-heart').forEach(h=>h.remove());intro.classList.remove('hide');intro.querySelector('h3').textContent=score>=20?'Даяна окружена любовью!':'Любви стало ещё больше!';document.getElementById('startGame').textContent='Сыграть ещё';message.textContent=`Ты собрал ${score} сердечек для Даяны ♡`}
document.getElementById('startGame').onclick=()=>{score=0;timeLeft=20;scoreEl.textContent=0;timerEl.textContent=20;gameActive=true;intro.classList.add('hide');message.textContent='Лови сердечки — не упусти любовь!';spawnGameHeart();countTimer=setInterval(()=>{timeLeft--;timerEl.textContent=timeLeft;if(timeLeft<=0)finishGame()},1000)};
