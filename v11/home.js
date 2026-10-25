/* v11 홈(사건 파일): 종이가 책상에 떨어짐, 스탠드 불빛·종이가 손을 따라 살짝 움직임, 서류철 탭, 메뉴 */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js');

/* 메뉴 */
const btn=$('.menu-btn'),menu=$('#menu');
function setMenu(on){
 btn.setAttribute('aria-expanded',on);document.body.classList.toggle('menu-open',on);
 if(on){menu.hidden=false;requestAnimationFrame(()=>menu.classList.add('on'));document.documentElement.style.overflow='hidden'}
 else{menu.classList.remove('on');document.documentElement.style.overflow='';setTimeout(()=>{if(!menu.classList.contains('on'))menu.hidden=true},800)}
}
btn.addEventListener('click',()=>setMenu(btn.getAttribute('aria-expanded')!=='true'));
addEventListener('keydown',e=>{if(e.key==='Escape'&&btn.getAttribute('aria-expanded')==='true'){setMenu(false);btn.focus()}});
menu.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});

/* 머리 바탕 */
const top=$('.top');const onScroll=()=>top.classList.toggle('solid',scrollY>40);
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* 책상: 종이가 차례로 놓임 */
const desk=$('.desk');
requestAnimationFrame(()=>desk.classList.add('on'));

/* 손(마우스·손가락)을 따라 스탠드 불빛과 종이가 살짝 움직임 */
if(!reduce){
 const papers=$$('.desk [data-depth]');
 const move=(x,y)=>{
  const r=desk.getBoundingClientRect();if(r.bottom<0)return;
  const nx=(x-r.left)/r.width-.5,ny=(y-r.top)/r.height-.5;
  desk.style.setProperty('--lx',(50+nx*40)+'%');desk.style.setProperty('--ly',(42+ny*40)+'%');
  for(const p of papers){const d=+p.dataset.depth/2;p.style.translate=`${-nx*d}px ${-ny*d}px`}
 };
 desk.addEventListener('pointermove',e=>move(e.clientX,e.clientY),{passive:true});
}

/* 서류철 탭 */
const tabs=$$('[role=tab]');
function pick(t,focus){tabs.forEach(b=>{const on=b===t;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1;$('#'+b.getAttribute('aria-controls')).hidden=!on});if(focus)t.focus()}
tabs.forEach((t,i)=>{t.addEventListener('click',()=>pick(t));t.addEventListener('keydown',e=>{const n=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(n){e.preventDefault();pick(tabs[(i+n+tabs.length)%tabs.length],true)}})});
})();
