/* v9 홈: 열쇠 구멍 → 문 열기, 질문 불 켜기, 네 개의 문 열기, 전체 메뉴 */
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

/* 열쇠 구멍 */
const kh=$('.kh'),view=$('.kh-view'),img=$('.kh-view img'),ring=$('.kh-ring'),star=$('.kh-star'),
 beam=$('.kh-beam'),intro=$('.kh-intro'),hint=$('.kh-hint'),copy=$('.kh-copy'),note=$('.kh-note'),top=$('.top');
const qs=$$('[data-q] span'),shadow=$('.kh-shadow'),dust=$('.kh-dust');
/* 들여다보기: 손(마우스·손가락)을 움직이면 구멍 안의 장면이 반대로 움직여 다른 쪽이 보인다 */
let aimX=0,aimY=0,lookX=0,lookY=0,near=0,nearT=0,lastMove=-1e9,khc={x:0,y:0,h:200};
function aim(cx,cy){const W=innerWidth,H=innerHeight;aimX=clamp((cx/W-.5)*2,-1,1);aimY=clamp((cy/H-.5)*2,-1,1);lastMove=performance.now();
 const d=Math.hypot(cx-khc.x,cy-khc.y);nearT=clamp(1-(d-khc.h*.4)/(khc.h*1.6))}
addEventListener('pointermove',e=>aim(e.clientX,e.clientY),{passive:true});
addEventListener('touchmove',e=>{const t=e.touches[0];if(t)aim(t.clientX,t.clientY)},{passive:true});
function frame(){
 const H=innerHeight,W=innerWidth,r=kh.getBoundingClientRect();
 const p=reduce?1:clamp(-r.top/(r.height-H));
 if(!reduce){
  const h0=Math.min(H*.36,W<720?230:290)*(1+.1*near);
  const e=clamp(p/.78),g=Math.pow(e,1.9);
  const h=h0*Math.pow(80,g),w=h*100/160;
  const x=(W-w)/2,y=H*.5-h*.44;
  if(e<1){
   view.classList.remove('full');
   view.style.webkitMaskSize=view.style.maskSize=`${w}px ${h}px`;
   view.style.webkitMaskPosition=view.style.maskPosition=`${x}px ${y}px`;
  }else view.classList.add('full');
  ring.style.width=w+'px';ring.style.height=h+'px';ring.style.transform=`translate(${x}px,${y}px)`;
  ring.style.opacity=clamp(1-p*5);
  star.style.setProperty('--st',`translate(${W/2-13}px,${y-h0*.02-40}px)`);
  star.style.opacity=clamp(1-p*6);
  intro.style.opacity=clamp(1-p*5);hint.style.opacity=clamp(1-p*8);
  const k=(1-e)*(1-e);img.style.transform=`translate(${k*((W<720?-30:16)-lookX*11)}%,${k*(9-lookY*7)}%) scale(${1.3-.3*e})`;
  shadow.style.opacity=clamp(1-p*6);dust.style.opacity=clamp(1-p*3);khc={x:W/2,y:y+h*.3,h};
  beam.style.transform=`translate(${W/2-150}px,${y+h*.93}px)`;beam.style.opacity=clamp(1-p*4);
  img.style.filter=`sepia(.35) saturate(.9) brightness(${1.06-.26*e}) contrast(1.05)`;
  view.style.setProperty('--ov',clamp((p-.5)/.3));
  const c=clamp((p-.66)/.16);
  copy.style.opacity=c;copy.style.transform=`translateY(${(1-c)*36}px)`;copy.classList.toggle('on',c>.5);
  note.style.opacity=clamp((p-.6)/.2);
 }
 top.classList.toggle('solid',r.bottom<H*.35||(p>.95));
 for(const s of qs){if(s.getBoundingClientRect().top<H*.66)s.classList.add('on');else if(!reduce)s.classList.remove('on')}
}
/* 빛 속 먼지 */
const ctx=dust.getContext('2d');let motes=[];
function sizeDust(){const d=Math.min(2,devicePixelRatio||1);dust.width=innerWidth*d;dust.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0);
 motes=Array.from({length:innerWidth<720?34:60},()=>({x:Math.random(),y:Math.random(),r:.5+Math.random()*1.6,v:.00004+Math.random()*.00012,ph:Math.random()*6.3}))}
function drawDust(t){const W=innerWidth,H=innerHeight;ctx.clearRect(0,0,W,H);
 for(const m of motes){m.y-=m.v*16;if(m.y<0)m.y=1;const x=khc.x+(m.x-.5)*khc.h*1.3+Math.sin(t/2400+m.ph)*14,y=khc.y-khc.h*.2+m.y*H*.62;
  const dx=(x-khc.x)/(khc.h*.75),a=Math.max(0,1-dx*dx)*(.25+.35*Math.sin(t/900+m.ph)**2);if(a<.02)continue;
  ctx.beginPath();ctx.arc(x,y,m.r,0,6.3);ctx.fillStyle=`rgba(240,215,160,${a})`;ctx.fill()}}
sizeDust();addEventListener('resize',sizeDust);
/* 매 순간 그리기(첫 장면이 보일 때만) */
function tick(t){
 const idle=t-lastMove>2200;
 const tx=idle?Math.sin(t/2600)*.55:aimX,ty=idle?Math.cos(t/3400)*.35:aimY;
 lookX+=(tx-lookX)*.06;lookY+=(ty-lookY)*.06;near+=((idle?0:nearT)-near)*.08;
 if(kh.getBoundingClientRect().bottom>0){frame();if(!reduce)drawDust(t)}
 requestAnimationFrame(tick)}
if(reduce){addEventListener('scroll',frame,{passive:true});frame()}else requestAnimationFrame(tick);

/* 네 개의 문: 화면에 들어오면 차례로 열림 */
const doors=$$('.door');
if(reduce||!('IntersectionObserver'in window))doors.forEach(d=>d.classList.add('open'));
else{const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const d=en.target,i=doors.indexOf(d);setTimeout(()=>d.classList.add('open'),innerWidth>720?i*220:150);io.unobserve(d)}}),{threshold:.55});doors.forEach(d=>io.observe(d))}
})();
