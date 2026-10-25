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
const qs=$$('[data-q] span');
function frame(){
 const H=innerHeight,W=innerWidth,r=kh.getBoundingClientRect();
 const p=reduce?1:clamp(-r.top/(r.height-H));
 if(!reduce){
  const h0=Math.min(H*.34,W<720?210:270);
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
  img.style.transform=`translateX(${(1-e)*(1-e)*(W<720?-22:14)}%) scale(${1.3-.3*e})`;
  beam.style.transform=`translate(${W/2-150}px,${y+h*.93}px)`;beam.style.opacity=clamp(1-p*4);
  img.style.filter=`sepia(.35) saturate(.9) brightness(${1.25-.45*e}) contrast(1.05)`;
  view.style.setProperty('--ov',clamp((p-.5)/.3));
  const c=clamp((p-.66)/.16);
  copy.style.opacity=c;copy.style.transform=`translateY(${(1-c)*36}px)`;copy.classList.toggle('on',c>.5);
  note.style.opacity=clamp((p-.6)/.2);
 }
 top.classList.toggle('solid',r.bottom<H*.35||(p>.95));
 for(const s of qs){if(s.getBoundingClientRect().top<H*.66)s.classList.add('on');else if(!reduce)s.classList.remove('on')}
}
let ticking=false;
const onScroll=()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{frame();ticking=false})}};
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);
frame();

/* 네 개의 문: 화면에 들어오면 차례로 열림 */
const doors=$$('.door');
if(reduce||!('IntersectionObserver'in window))doors.forEach(d=>d.classList.add('open'));
else{const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){const d=en.target,i=doors.indexOf(d);setTimeout(()=>d.classList.add('open'),innerWidth>720?i*220:150);io.unobserve(d)}}),{threshold:.55});doors.forEach(d=>io.observe(d))}
})();
