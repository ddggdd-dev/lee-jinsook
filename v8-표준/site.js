/* 이진숙 프로파일링 연구소 v7 공통 스크립트 — 모든 페이지가 이 파일 하나를 씁니다.
   요소가 없는 페이지에서는 그 부분을 건너뜁니다(오류 없음). */
const $=s=>document.querySelector(s),$$=s=>Array.from(document.querySelectorAll(s));
const el=(tag,cls,text)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e};

/* ================================================================
   인사이트 글 — 여기 한 곳에만 적으면 홈 '최근 소식'(최신 3개), 인사이트 게시판, 글 창에 모두 보입니다.
   글 하나를 { ... } 로 더합니다.
   - "title": 제목 (필수)
   - "date": "2024-02" 처럼 연-월 또는 연-월-일. 날짜가 없는 예시 글은 "" 로 두면 "예시 글"로 표시됩니다.
   - "category": 소식 / 칼럼 / 사례 / 강연 / 방송 / 출간 중 하나
   - "label": (선택) 분류 옆에 붙는 말. 예: "칼럼 예시"
   - "summary": 카드에 보이는 한두 줄 요약
   - "body": 본문 문단 배열 ["첫 문단", "둘째 문단"]
   - "list": (선택) 번호 목록 배열,  "after": (선택) 목록 뒤 문단 배열
   - "image": { "src": "img/파일.jpg", "alt": "사진 설명", "note": "사진 표시(예: AI 연출 이미지)" }
   - "link": (선택) { "url": "https://…", "text": "버튼 글자" }   ("blank": true 면 아직 받지 못한 자리로 표시)
   - "cta": (선택) { "href": "sias.html", "text": "관련 서비스로 가는 버튼 글자" }  — 다른 페이지는 파일 이름으로
   사진은 drafts/img/ 에 넣고 "img/파일.jpg" 로 적습니다. 사례 글은 공개 동의를 받은 뒤, 개인을 알아볼 수 없게 정리해 올립니다.
   ================================================================ */
const POSTS=[
 {
  "title": "『이진숙의 행선지 — 행복한 선택, 지금!』",
  "date": "2025-11",
  "category": "출간",
  "summary": "사람의 선택을 분석해 온 프로파일러가 전하는 행복한 삶의 방향.",
  "body": [
   "이진숙 소장의 책 『이진숙의 행선지 — 행복한 선택, 지금!』.",
   "나는 왜 그런 선택을 했을까? 내가 정말 원하는 행복은 무엇일까? 앞으로 나는 어떤 삶을 선택할 것인가?"
  ],
  "image": {
   "src": "img/ref-book-hangseonji.jpg",
   "alt": "책 『이진숙의 행선지』 표지",
   "note": "표지 시안"
  },
  "cta": {
   "href": "index.html#dest",
   "text": "이진숙의 행선지 보기"
  }
 },
 {
  "title": "이진숙프로파일링 연구소 [문] 오픈식",
  "date": "2025-11",
  "category": "소식",
  "label": "소식",
  "summary": "11월 7일(금) 오후 4시 30분, 송도국제업무지구 연수세무서 건물에서 오픈식을 엽니다.",
  "body": [
   "사람을 이해하는 마음, 행복한 내일을 여는 이진숙프로파일링 연구소 [문]. 그 시작의 자리에 여러분을 초대합니다.",
   "일시: 11월 7일(금) 오후 4시 30분",
   "장소: 송도국제업무지구 연수세무서 건물"
  ],
  "image": {
   "src": "img/ref-opening-songdo.jpg",
   "alt": "송도국제업무지구 야경 연출 이미지",
   "note": "AI 연출 이미지"
  },
  "cta": {
   "href": "contact.html",
   "text": "오픈식 문의하기"
  }
 },
 {
  "title": "『내 안의 악마를 꺼내지 마세요』 출간",
  "date": "2024-02",
  "category": "출간",
  "summary": "이진숙 프로파일러의 책이 2024년 2월 행성B에서 나왔습니다.",
  "body": [
   "이진숙 프로파일러의 책 『내 안의 악마를 꺼내지 마세요』가 2024년 2월 행성B에서 나왔습니다.",
   "앞서 2020년 10월에는 『오늘도 살인범을 만나러 갑니다』(행성B)를 냈습니다."
  ],
  "image": {
   "src": "img/ref-v3-5.jpg",
   "alt": "책상 위 원고에 메모하는 손의 연출 사진",
   "note": "AI 연출 이미지 · 책 표지가 아닙니다"
  },
  "link": {
   "url": "https://www.yes24.com/product/goods/124754339",
   "text": "예스24에서 책 보기 ↗"
  },
  "cta": {
   "href": "about.html",
   "text": "연구소 소개 보기"
  }
 },
 {
  "title": "tvN 「유 퀴즈 온 더 블럭」 출연",
  "date": "2020-12",
  "category": "방송",
  "summary": "이진숙 프로파일러가 2020년 12월 tvN 「유 퀴즈 온 더 블럭」에 출연했습니다.",
  "body": [
   "이진숙 프로파일러가 2020년 12월 tvN 「유 퀴즈 온 더 블럭」에 출연했습니다."
  ],
  "image": {
   "src": "img/ref-v3-2.jpg",
   "alt": "사건 자료를 정리한 분석실 연출 사진",
   "note": "AI 연출 이미지 · 방송 장면이 아닙니다"
  },
  "link": {
   "url": "#",
   "text": "방송 다시보기 링크 — 확인 후",
   "blank": true
  },
  "cta": {
   "href": "edu.html",
   "text": "교육·강연 알아보기"
  }
 },
 {
  "title": "거짓말하는 사람의 진술에서 나타나는 7가지 특징",
  "date": "",
  "category": "칼럼",
  "label": "칼럼 예시",
  "summary": "진술을 읽을 때 더 살펴보는 일곱 가지 지점. 게시판 구성을 보여 주는 예시 글입니다.",
  "body": [
   "진술분석 칼럼 예시입니다. 아래 일곱 가지는 진술을 읽을 때 더 살펴보는 지점입니다."
  ],
  "list": [
   "단정 대신 모호한 표현이 늘어난다",
   "핵심 시간대에 설명 없는 공백이 생긴다",
   "“솔직히” 같은 진실 강조 표현이 반복된다",
   "관련 인물을 거리 두는 호칭으로 부른다",
   "사건과 무관한 세부 묘사가 길어진다",
   "시제나 인칭이 갑자기 바뀐다",
   "감정 표현이 사건 흐름과 맞지 않는다"
  ],
  "after": [
   "한 가지 신호만으로 거짓을 단정할 수는 없습니다. 여러 신호와 자료를 함께 살펴봅니다."
  ],
  "image": {
   "src": "img/ref-f-docs2.jpg",
   "alt": "진술 기록에 연필로 표시하는 손의 연출 사진",
   "note": "AI 연출 이미지"
  },
  "cta": {
   "href": "sias.html",
   "text": "SIAS 진술분석 알아보기"
  }
 }
];

/* 메뉴 */
const menu=$('.menu'),nav=$('#nav');
function setMenu(open){if(!menu||!nav)return;menu.setAttribute('aria-expanded',open);menu.setAttribute('aria-label',open?'메뉴 닫기':'메뉴 열기');menu.textContent=open?'닫기':'메뉴';nav.classList.toggle('open',open)}
if(menu&&nav){
 menu.onclick=()=>setMenu(menu.getAttribute('aria-expanded')!=='true');
 $$('.nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){setMenu(false);menu.focus()}});
}

/* 심리검사 9가지 (가안 이름 그대로) — 문의 정리 창의 '관심 있는 검사'에도 씁니다 */
const TESTS=[["관계소통 유형 프로파일링","사랑의 언어","내가 사랑을 표현하고 받는 방식","관계"],["감정 네이밍","","지금 내 감정에 정확한 이름 붙이기","정서"],["욕구진단검사","","나를 움직이는 핵심 욕구 찾기","동기"],["스트레스검사","","현재 스트레스 수준과 요인 확인","정서"],["우울검사","","우울 신호 자가점검","정서"],["심리지배 테스트","가스라이팅","관계 속 심리적 통제 신호 점검","관계"],["참과 거짓 판별","진술분석","말과 진술의 신빙성 신호 읽기","SIAS"],["에니어그램","","9가지 성격 유형으로 보는 나","성격"],["셀프프로파일링","BBSP-S60 · SP-CHANGE","나의 패턴을 이해하고 실천을 설계합니다","변화"]];
const testGrid=$('#testGrid');
if(testGrid)testGrid.replaceChildren(...TESTS.map((t,i)=>{const self=i===8;const b=self?el('a','test'):el('button','test');if(self)b.href='profiling.html#sp-change';else{b.type='button';b.dataset.need='2';b.dataset.test=t[0]}
 b.append(el('span','no',String(i+1).padStart(2,'0')));const d=el('div');const h=el('h4',null,t[0]);if(t[1])h.append(el('i',null,t[1]));d.append(h,el('p',null,t[2]),el('span','pill',t[3]+' · '+(self?'프로그램 보기 →':'검사 신청 ↗')));b.append(d);return b}));

/* 진술 예시 밑줄 (진술분석 페이지) */
const NOTES=[["a · 모호한 표현","“있었다” 대신 “있었던 것 같다”. 자기 행적을 확신하지 않는 표현은 정밀 확인 지점입니다."],["b · 진실성 강조","“솔직히 말하면”처럼 진실함을 따로 강조하면 앞뒤 문장의 확인 우선순위가 올라갑니다."],["c · 거리두기 호칭","이름 대신 “그 사람”. 대상과의 심리적 거리를 드러내는 단서입니다."],["d · 설명 없는 시간 공백","“그리고 나서”가 건너뛴 시간이 질문의 출발점입니다."]];
const marks=$$('mark.m'),noteBox=$('#note');
if(marks.length&&noteBox){
 const showNote=k=>{marks.forEach(m=>m.classList.toggle('on',+m.dataset.k===k));const n=NOTES[k];noteBox.replaceChildren(el('b',null,n[0]),document.createTextNode(n[1]))};
 marks.forEach(m=>{const k=+m.dataset.k;['mouseenter','click','focus'].forEach(ev=>m.addEventListener(ev,()=>showNote(k)));m.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showNote(k)}})});
 showNote(0);
}

/* 3문항 미리보기 (프로파일링 페이지 · 데모, 결과는 예시) */
const qz=$('#quiz');
if(qz){
 const Q=[["갈등 상황에서 나는 먼저…",["상대의 말을 끝까지 듣는다","사실관계부터 따진다","일단 자리를 피한다"]],["중요한 결정을 내릴 때 나는…",["주변 사람의 의견을 구한다","자료와 근거를 모은다","직감을 따른다"]],["스트레스를 받으면 나는…",["누군가와 이야기한다","해야 할 일을 정리한다","혼자 시간을 보낸다"]]];
 const TYPES=["관계 중심형 · 공감 프로파일","분석 중심형 · 사실 프로파일","내면 중심형 · 성찰 프로파일"];
 let qi=0,score=[0,0,0];
 const bar=p=>{const b=el('div','bar-p'),i=el('i');i.style.width=p+'%';b.append(i);return b};
 const renderQ=()=>{
  if(qi>=Q.length){const t=score.indexOf(Math.max(...score));
   const acts=el('div','ctas');const a=el('button','btn primary','정식 검사 신청 ↗');a.type='button';a.dataset.need='2';const r=el('button','btn','다시 하기');r.type='button';r.id='quiz-again';r.onclick=()=>{qi=0;score=[0,0,0];renderQ();qz.querySelector('button')?.focus()};acts.append(a,r);
   qz.replaceChildren(bar(100),el('span','qn','결과 예시'),el('h4',null,TYPES[t]),el('p','muted','데모 결과입니다. 정식 BBSP-S60은 60문항으로 MY PROFILE과 CORE MIND까지 분석합니다.'),acts);return}
  const [q,o]=Q[qi];const opts=el('div','opts');
  o.forEach((t,i)=>{const b=el('button',null,t);b.type='button';b.onclick=()=>{score[i]++;qi++;renderQ();qz.querySelector('button')?.focus()};opts.append(b)});
  qz.replaceChildren(bar(qi/Q.length*100),el('span','qn',(qi+1)+' / '+Q.length+' · 데모'),el('h4',null,q),opts);
 };
 renderQ();
}

/* 인사이트: 카드·게시판·글 창 */
const CATS=['전체','소식','칼럼','사례','강연','방송','출간'];
const EMPTY={'소식':{img:'img/ref-v3-1.jpg',title:'연구소 소식을 올립니다',text:'소식 — 확인 후'},'사례':{img:'img/ref-v3-2.jpg',title:'공개에 동의받은 사례를 정리해 올립니다',text:'사례 글 — 소장님 확인 후'},'강연':{img:'img/ref-v3-4.jpg',title:'강연·교육 소식을 올립니다',text:'강연 소식 — 소장님 확인 후'},'방송':{img:'img/ref-f-desk.jpg',title:'방송·언론 소식을 올립니다',text:'방송 소식 — 확인 후'},'칼럼':{img:'img/ref-f-docs2.jpg',title:'칼럼을 올립니다',text:'칼럼 — 소장님 확인 후'},'출간':{img:'img/ref-f-report.jpg',title:'출간 소식을 올립니다',text:'출간 소식 — 확인 후'}};
const fmtDate=d=>{if(!d)return'예시 글';const [y,m,dd]=d.split('-');return y+'년 '+(+m)+'월'+(dd?' '+(+dd)+'일':'')};
const byDate=(a,b)=>(b[0].date||'').localeCompare(a[0].date||'');
function thumb(src,alt,note){const p=el('div','ph');const im=el('img');im.src=src;im.alt=alt||'';im.loading='lazy';p.append(im,el('span','note-img',note||'AI 연출 이미지'));return p}
function card(p,idx){const b=el('button','post');b.type='button';b.append(thumb(p.image?.src,p.image?.alt,p.image?.note),el('span','meta',(p.label||p.category)+' · '+fmtDate(p.date)),el('h3',null,p.title),el('p',null,p.summary||''),el('span','read','읽기 →'));b.onclick=()=>openPost(idx);return b}
function emptyCard(cat){const e=EMPTY[cat];const d=el('div','post empty');const p=el('p');p.append(el('span','blank',e.text));d.append(thumb(e.img,'','AI 연출 이미지'),el('span','meta',cat),el('h3',null,e.title),p);return d}
const postDlg=$('#post-dialog');
function openPost(i){const p=POSTS[i],body=$('#post-body');if(!p||!postDlg||!body)return;body.replaceChildren();
 body.append(el('span','meta',(p.label||p.category)+' · '+fmtDate(p.date)));const h=el('h2',null,p.title);h.id='post-title';body.append(h);
 if(p.image)body.append(thumb(p.image.src,p.image.alt,p.image.note));
 const bd=el('div','body');(p.body||[]).forEach(t=>bd.append(el('p',null,t)));if(p.list){const ol=el('ol');p.list.forEach(t=>ol.append(el('li',null,t)));bd.append(ol)}(p.after||[]).forEach(t=>bd.append(el('p',null,t)));body.append(bd);
 const acts=el('div','acts');
 if(p.link){if(p.link.blank){acts.append(el('span','blank',p.link.text))}else{const a=el('a','btn',p.link.text);a.href=p.link.url;a.target='_blank';a.rel='noopener';acts.append(a)}}
 if(p.cta){const a=el('a','btn primary',p.cta.text+' →');a.href=p.cta.href;a.onclick=()=>postDlg.close();acts.append(a)}
 body.append(acts);postDlg.showModal();body.scrollTop=0}
/* 게시판 (인사이트 페이지) */
const filters=$('#filters'),postsList=$('#posts-list');
function filt(c){if(!filters||!postsList)return;
 $$('#filters button').forEach(b=>{b.classList.toggle('on',b.dataset.c===c);b.setAttribute('aria-pressed',b.dataset.c===c)});
 const list=POSTS.map((p,i)=>[p,i]).filter(([p])=>c==='전체'||p.category===c).sort(byDate);
 const out=list.map(([p,i])=>card(p,i));
 if(c==='전체'&&!POSTS.some(p=>p.category==='사례'))out.push(emptyCard('사례'));
 if(c!=='전체'&&!list.length)out.push(emptyCard(c));
 postsList.replaceChildren(...out)}
if(filters&&postsList){CATS.forEach(c=>{const b=el('button',null,c);b.type='button';b.dataset.c=c;b.onclick=()=>filt(c);filters.append(b)});filt('전체')}
/* 최근 소식 3개 (홈) */
const recent=$('#recent-list');
if(recent)recent.replaceChildren(...POSTS.map((p,i)=>[p,i]).filter(([p])=>p.date).sort(byDate).slice(0,3).map(([p,i])=>card(p,i)));

/* 상담·의뢰: 7가지 상황 → 문의 정리 (모든 페이지의 data-need 버튼이 이 창을 엽니다) */
const NEEDS=[
 {t:'진술분석이 필요합니다',to:'SIAS',svc:'진술분석 SIAS 의뢰',d:'자료를 사전검토한 뒤 분석 범위와 견적을 안내합니다.',label:'현재 단계',opts:['아직 잘 모르겠습니다','수사 단계','재판 단계','소송 준비','그 외']},
 {t:'프로파일링보고서가 필요합니다',to:'프로파일링',svc:'프로파일링보고서 의뢰',d:'사건 단계와 보유 자료를 알려 주시면 분석 범위·기간·비용을 안내합니다.',label:'현재 단계',opts:['아직 잘 모르겠습니다','수사 단계','재판 단계(1심)','항소심','그 외']},
 {t:'나에 대해 알고 싶습니다',to:'심리검사',svc:'상담심리검사 신청',d:'9가지 검사 중 맞는 검사를 안내합니다.',label:'관심 있는 검사',opts:['아직 잘 모르겠습니다',...TESTS.map(t=>t[0]+(t[1]?' ('+t[1]+')':'')),'변화 90일 프로그램']},
 {t:'개인상담·코칭을 받고 싶습니다',to:'상담',svc:'전문가 상담 예약',d:'관계·갈등·자기이해 주제의 1:1 상담입니다.',label:'상담 주제',opts:['아직 잘 모르겠습니다','검사 해석 상담','관계·갈등 상담','1:1 전문가 상담']},
 {t:'기업·기관 강연이 필요합니다',to:'강연',svc:'기업·기관 강연 문의',d:'대상·인원·일정을 알려 주시면 강연안을 보내 드립니다.',label:'참여 대상',opts:['아직 정해지지 않았습니다','기업 CEO·임원','공공기관 리더·관리자','법률·조사 실무자','그 외']},
 {t:'직원교육이 필요합니다',to:'교육',svc:'직원교육 문의',d:'진술분석·면담기법·리더십 과정을 맞춤 설계합니다.',label:'교육 주제',opts:['아직 정해지지 않았습니다','진술분석','면담·질문기법','리더십','프로파일링 아카데미 개설 소식']},
 {t:'기업 내부 사건을 분석하고 싶습니다',to:'기업',svc:'기업 내부조사 프로젝트',d:'면담 설계와 진술 분석을 프로젝트로 진행합니다.',label:'자료 형태',opts:['아직 잘 모르겠습니다','면담·인터뷰','진술서·서면','녹취·메시지','그 외']}
];
$$('[data-needs]').forEach(box=>NEEDS.forEach((n,i)=>{const b=el('button');b.type='button';b.dataset.need=i;b.append(el('span',null,n.t),el('small',null,n.to+' ↗'));box.append(b)}));
const inqDlg=$('#inquiry-dialog'),kindSel=$('#inquiry-kind'),ctxSel=$('#inquiry-context');
function updateOutput(){if(!kindSel)return;const n=NEEDS[+kindSel.value];const v=s=>($(s)?.value||'').trim();const name=v('#f-name'),tel=v('#f-tel'),note=v('#inquiry-note');
 $('#inquiry-output').value='[이진숙 프로파일링 연구소 문의]\n서비스: '+n.svc+'\n'+n.label+': '+ctxSel.value+(name?'\n이름/기관: '+name:'')+(tel?'\n회신 연락처: '+tel:'')+'\n상황 · 희망 일정: '+(note||'상담 때 말씀드리겠습니다');$('#copy-status').textContent=''}
function updateKind(pre){const n=NEEDS[+kindSel.value];$('#svc').textContent=n.svc;$('#svcDesc').textContent=n.d;$('#context-title').textContent=n.label;
 ctxSel.replaceChildren(...n.opts.map(t=>el('option',null,t)));if(pre){const o=[...ctxSel.options].find(o=>o.textContent.startsWith(pre));if(o)o.selected=true}updateOutput()}
function openInquiry(i,pre){if(!inqDlg||!kindSel)return;kindSel.value=String(i??1);updateKind(pre);if(!inqDlg.open)inqDlg.showModal()}
if(inqDlg&&kindSel&&ctxSel){
 NEEDS.forEach((n,i)=>{const o=el('option',null,n.t);o.value=i;kindSel.append(o)});
 document.addEventListener('click',e=>{const t=e.target.closest('[data-need]');if(!t)return;e.preventDefault();setMenu(false);openInquiry(+t.dataset.need,t.dataset.test)});
 kindSel.onchange=()=>updateKind();ctxSel.onchange=updateOutput;['#f-name','#f-tel','#inquiry-note'].forEach(s=>{const f=$(s);if(f)f.oninput=updateOutput});
 $('#inquiry-form').onsubmit=e=>e.preventDefault();
 $('#copy-inquiry').onclick=async()=>{try{await navigator.clipboard.writeText($('#inquiry-output').value);$('#copy-status').textContent='복사했습니다. 아래 연락처로 보내 주세요.'}catch(err){const ta=$('#inquiry-output');ta.focus();ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}$('#copy-status').textContent=ok?'복사했습니다. 아래 연락처로 보내 주세요.':'선택된 내용을 길게 눌러 복사해 주세요.'}};
 /* 다른 페이지에서 contact.html#need-1 처럼 오면 그 항목으로 창을 엽니다 */
 const m=/^#need-(\d)$/.exec(location.hash);if(m&&NEEDS[+m[1]])openInquiry(+m[1]);
}
/* 떠 있는 상담·의뢰 버튼: 페이지 머리가 보이는 동안은 숨김 */
const floating=$('#floating-open'),head=$('.hv8, .hero, .page-hero, .page-head');
if(floating){floating.onclick=()=>openInquiry(1);
 if(head&&'IntersectionObserver'in window)new IntersectionObserver(([en])=>floating.classList.toggle('away',en.isIntersecting),{threshold:.15}).observe(head);else floating.classList.remove('away')}

/* 창 공통 */
const sampleBtn=$('#sample-open'),sampleDlg=$('#sample-dialog');
if(sampleBtn&&sampleDlg)sampleBtn.onclick=()=>sampleDlg.showModal();
$$('dialog .close').forEach(b=>b.onclick=()=>b.closest('dialog').close());
$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
