/* v12 홈: 문 너머(열쇠 구멍으로 들어가기), 질문 불 켜기, 네 개의 문, 전체 메뉴 */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

/* 전체 메뉴 */
const btn=$('.menu-btn'),menu=$('#menu');
function setMenu(on){
 btn.setAttribute('aria-expanded',on);document.body.classList.toggle('menu-open',on);
 if(on){menu.hidden=false;requestAnimationFrame(()=>menu.classList.add('on'));document.documentElement.style.overflow='hidden';menu.querySelector('a').focus({preventScroll:true})}
 else{menu.classList.remove('on');document.documentElement.style.overflow='';setTimeout(()=>{if(!menu.classList.contains('on'))menu.hidden=true},800)}
}
btn.addEventListener('click',()=>setMenu(btn.getAttribute('aria-expanded')!=='true'));
addEventListener('keydown',e=>{if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){setMenu(false);btn.focus()}});
menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});


/* ===== 문 너머 ===== */
const journey=$('.journey'),stage=$('.stage'),room=$('.room'),canvas=$('.door-cv'),ctx=canvas.getContext('2d'),
 khBtn=$('.kh-btn'),copy=$('.j-copy'),inside=$('.j-inside'),hint=$('.j-hint'),skip=$('.j-skip'),note=$('.j-note'),top=$('.top');
const IW=1672,IH=941; /* 문 사진(ref-door-keyhole.jpg) 크기 — 아래 구멍 좌표는 이 사진 기준 */
const KEY=new Path2D('M1080 497L1080 355Q1080 342 1072 332Q1063 318 1063 298A52 52 0 0 1 1167 298Q1167 318 1158 332Q1150 342 1150 355L1150 497Q1150 503 1144 503L1086 503Q1080 503 1080 497Z');
const KC={x:1115,y:330}; /* 구멍 가운데(확대 중심) */
const WOMAN={x:842,y:430}; /* 연구실 사진 속 자료를 읽는 사람 */
const door=new Image();door.src='img/ref-door-keyhole.jpg';
let W=0,H=0,dpr=1,lookX=0,lookY=0,aimX=0,aimY=0,lastMove=-1e9,tween=null;
function layout(){
 const mobile=W<720;let dw,dh,dx,dy;
 if(mobile){dh=H;dw=dh*IW/IH;dx=W*.6-KC.x/IW*dw;dy=0}
 else{const f=Math.max(W/IW,H/IH);dw=IW*f;dh=IH*f;dx=(W-dw)/2;dy=(H-dh)/2}
 const s=dw/IW;return{dw,dh,dx,dy,s,kx:dx+KC.x*s,ky:dy+KC.y*s}
}
function progress(){if(reduce)return 0;const r=journey.getBoundingClientRect();return clamp(-r.top/(journey.offsetHeight-H))}
function paint(t){
 const p=progress(),e0=clamp(p/.85),e=e0*e0*(3-2*e0),zoom=Math.exp(e*Math.log(70)),L=layout();
 /* 문 */
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
 if(door.complete&&door.naturalWidth){
  ctx.save();ctx.translate(L.kx,L.ky);ctx.scale(zoom,zoom);ctx.translate(-L.kx,-L.ky);
  ctx.fillStyle='#070d0c';ctx.fillRect(-W,-H,W*3,H*3);
  ctx.drawImage(door,L.dx,L.dy,L.dw,L.dh);
  ctx.translate(L.dx,L.dy);ctx.scale(L.s,L.s);ctx.globalCompositeOperation='destination-out';ctx.fill(KEY);
  ctx.restore();
 }
 canvas.style.opacity=1-clamp((p-.82)/.1);
 /* 열쇠 구멍 버튼: 사진 속 구멍 위치에 맞춤 */
 const bw=(1167-1063)*L.s,bh=(503-246)*L.s;
 khBtn.style.cssText=`width:${bw+16}px;height:${bh+16}px;transform:translate(${L.dx+1063*L.s-8}px,${L.dy+246*L.s-8}px)`;
 khBtn.hidden=p>.05;
 /* 안쪽 연구실: 처음엔 구멍 안에 사람이 걸리게, 들어가면 제자리 */
 const f=Math.max(W/IW,H/IH),ox=(W-IW*f)/2,oy=(H-IH*f)/2,S0=1.5,S=S0+(1-S0)*e;
 const wx=ox+WOMAN.x*f,wy=oy+WOMAN.y*f;
 const idle=(t||0)-lastMove>2500;
 const tx=idle?Math.sin((t||0)/2600)*.6:aimX,ty=idle?Math.cos((t||0)/3500)*.4:aimY;
 lookX+=(tx-lookX)*.05;lookY+=(ty-lookY)*.05;
 const peek=(1-e)*(1-e);
 const trX=((L.kx-W/2)-(wx-W/2)*S0+18*L.s*0)*(1-e)-lookX*30*peek, trY=((L.ky+40*L.s-H/2)-(wy-H/2)*S0)*(1-e)-lookY*20*peek;
 room.style.transform=`translate(${trX}px,${trY}px) scale(${S})`;
 room.style.filter=`brightness(${.8+.2*e}) blur(${2.4*(1-clamp(p/.4))}px)`;
 /* 글 */
 const c=1-clamp(p/.14);copy.style.opacity=c;copy.style.transform=`translateY(${-p*60}px)`;copy.style.visibility=c>0?'visible':'hidden';
 hint.style.opacity=c;skip.style.opacity=c;skip.style.visibility=c>.05?'visible':'hidden';
 const r=clamp((p-.8)/.14);inside.style.opacity=r;inside.style.transform=`translateY(${20*(1-r)}px)`;inside.classList.toggle('on',r>.5);room.style.setProperty('--io',r);
 note.style.opacity=clamp((p-.6)/.2);
 top.classList.toggle('solid',journey.getBoundingClientRect().bottom<H*.4);
}
function resize(){W=stage.clientWidth;H=stage.clientHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=W*dpr;canvas.height=H*dpr;paint(performance.now())}
addEventListener('resize',resize);door.onload=resize;
addEventListener('pointermove',e=>{aimX=clamp((e.clientX/innerWidth-.5)*2,-1,1);aimY=clamp((e.clientY/innerHeight-.5)*2,-1,1);lastMove=performance.now()},{passive:true});

/* 들어가기: 글자 버튼과 열쇠 구멍 버튼 모두 같은 연출(스크롤로 구멍을 통과) */
function scrollToY(y,ms){
 if(tween)cancelAnimationFrame(tween.id);
 if(reduce){scrollTo({top:y,behavior:'instant'});return}
 const y0=scrollY,d=y-y0,t0=performance.now();tween={};
 const step=now=>{const k=clamp((now-t0)/ms),q=k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2;scrollTo({top:y0+d*q,behavior:'instant'});if(k<1)tween.id=requestAnimationFrame(step);else tween=null};
 tween.id=requestAnimationFrame(step);
}
const stopTween=()=>{if(tween){cancelAnimationFrame(tween.id);tween=null}};
addEventListener('wheel',stopTween,{passive:true});addEventListener('touchstart',stopTween,{passive:true});
const enter=()=>{if(reduce){$('#doors').scrollIntoView();return}scrollToY(journey.offsetTop+journey.offsetHeight-H,2600)};
$('.j-enter').addEventListener('click',enter);
khBtn.addEventListener('click',enter);
skip.addEventListener('click',()=>scrollToY($('#doors').getBoundingClientRect().top+scrollY-64,900));
$('.replay').addEventListener('click',()=>scrollToY(0,1800));

/* 질문 불 켜기 */
const qs=$$('[data-q] span');
function loop(t){paint(t);const Hh=innerHeight;for(const s of qs){if(s.getBoundingClientRect().top<Hh*.66)s.classList.add('on');else if(!reduce)s.classList.remove('on')}requestAnimationFrame(loop)}
resize();requestAnimationFrame(loop);

/* 네 개의 문: 화면에 들어오면 차례로 열림 */
const doors=$$('.door-card,.d-list .door');
if(reduce||!('IntersectionObserver'in window))doors.forEach(d=>d.classList.add('open'));
else{const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const d=en.target,i=doors.indexOf(d);setTimeout(()=>d.classList.add('open'),innerWidth>720?i*220:150);io.unobserve(d)}}),{threshold:.55});doors.forEach(d=>io.observe(d))}
})();
