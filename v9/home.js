/* v9 홈(시네마): 포스터 등장, 장면 넘김, 크레딧, 전체 메뉴 */
(()=>{
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

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

/* 포스터 등장: 사진이 준비되면 어둠 속에서 떠오름 */
const poster=$('.poster'),pimg=$('.p-photo img');
const go=()=>requestAnimationFrame(()=>poster.classList.add('ready'));
if(reduce||pimg.complete)go();else{pimg.addEventListener('load',go);pimg.addEventListener('error',go);setTimeout(go,2500)}

/* 머리: 포스터를 지나면 바탕 */
const top=$('.top');
const onScroll=()=>top.classList.toggle('solid',scrollY>40);
addEventListener('scroll',onScroll,{passive:true});onScroll();

/* 장면·크레딧: 화면에 들어오면 */
$$('.cr-h,.cr-list div,.cr-links,.end>*').forEach(el=>el.classList.add('fade'));
const targets=[...$$('.scene'),...$$('.fade')];
if(reduce||!('IntersectionObserver'in window))targets.forEach(t=>t.classList.add('in'));
else{const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}}),{threshold:.35,rootMargin:'0px 0px -8% 0px'});targets.forEach(t=>io.observe(t))}
})();
