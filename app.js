'use strict';
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('js-ready');
const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
}), { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.header nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Открыть меню');
}));
const details = {
  partnership: { label: '01 / ПАРТНЁРСТВО', title: 'Возможности растут в сотрудничестве.', body: '<p>Помогаем находить дистрибуционные каналы и расширять продуктовую линейку через существующие каналы партнёра.</p><ul><li>Поиск точек пересечения между продуктами, экспертизой и аудиторией.</li><li>Совместное развитие и распространение продуктов и программ.</li><li>Гибкие модели взаимодействия со специалистами, студиями и организациями.</li></ul><p>Расскажите, какие ресурсы есть у вас и какую задачу хотите решить. Обсудим подходящий формат и условия.</p>' },
  support: { label: '02 / ПОДДЕРЖКА ОТРАСЛИ', title: 'От идеи — к развитию практики.', body: '<p>Поддержка для специалистов и организаций на разных этапах развития.</p><ul><li>Методическая помощь и консультации.</li><li>Запуск и развитие бизнеса, профессиональных практик и продуктов.</li><li>Экспертная оценка и продвижение.</li><li>Взаимодействие с профессиональным сообществом.</li></ul><p>Объём работы, формат и стоимость определяем по договорённости, исходя из вашей задачи.</p>' },
  research: { label: '04 / ИССЛЕДОВАНИЯ', title: 'Вопросы, на которые ищем ответы вместе.', body: '<p>Приглашаем организации и специалистов к совместной исследовательской работе в области осанки, движения и физической адаптации человека.</p><p>Одно из направлений — корпоративный проект для офисных сотрудников: первичная оценка осанки, рекомендации для самостоятельных двигательных практик и повторные измерения через месяц.</p><p>Состав участников, методику, бюджет и условия представления результатов обсуждаем с партнёром. Можно предложить собственный исследовательский вопрос.</p>' },
  course: { label: '03 / ОБРАЗОВАНИЕ', title: 'Научные основы работы с осанкой.', body: '<p>Программа «Нейрофизиологические и биомеханические основы работы с осанкой» для специалистов физкультурно-оздоровительной практики.</p><ul><li>8 академических часов: 4 часа видеолекций и 4 часа самостоятельной работы и тестовых материалов.</li><li>Обязательные встречи с преподавателем по расписанию через Яндекс Телемост или Google Meet.</li><li>Доступ к материалам на 6 месяцев после покупки.</li><li>Проходной балл тестирования — 80%, число попыток не ограничено.</li><li>Завершение подтверждает преподаватель; сертификат оформляется вручную.</li></ul><p><strong>Стоимость — 8 450 ₽.</strong> Для организаций предусмотрено согласование группового обучения и оплаты по счёту.</p><p>Платформа готовится к запуску. Сейчас можно задать вопросы о программе и сообщить об интересе к обучению.</p>', action: 'Узнать об обучении' }
};
const dialog = document.querySelector('#detail');
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
  const data = details[button.dataset.direction];
  dialog.querySelector('.dialog-kicker').textContent = data.label;
  dialog.querySelector('h2').textContent = data.title;
  dialog.querySelector('.dialog-content').innerHTML = data.body;
  dialog.querySelector('.dialog-action').innerHTML = (data.action || 'Обсудить в Telegram') + ' <span>↗</span>';
  dialog.showModal(); document.body.classList.add('modal-open');
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));

const callDialog = document.querySelector('#call-dialog');
const copyStatus = document.querySelector('#copy-status');
document.querySelector('#call-button').addEventListener('click', () => {
  copyStatus.textContent = '';
  callDialog.showModal(); document.body.classList.add('modal-open');
});
callDialog.querySelector('.dialog-close').addEventListener('click', () => callDialog.close());
callDialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
callDialog.addEventListener('click', e => {
  if(e.target !== callDialog) return;
  const r = callDialog.getBoundingClientRect();
  if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) callDialog.close();
});
document.querySelector('#copy-phone').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText('+79152284498'); copyStatus.textContent = 'Номер скопирован'; }
  catch { copyStatus.textContent = 'Номер для копирования: +7 915 228-44-98'; }
});

// Original emblem, a slow light field, and scroll-linked scene movement.
const canvas = document.querySelector('#field');
const ctx = canvas.getContext('2d');
const hero = document.querySelector('.hero');
const stage = document.querySelector('.hero-stage');
const bridge = document.querySelector('.bridge');
const progressLine = document.createElement('div');
progressLine.className = 'section-progress'; progressLine.setAttribute('aria-hidden','true');
document.body.append(progressLine);
let width=0,height=0,active=true,px=0,py=0,sx=0,sy=0,lastDraw=0;
function resizeScene() {
  const r = hero.getBoundingClientRect();width=r.width;height=r.height;
  const dpr=Math.min(devicePixelRatio||1,1.5);
  canvas.width=width*dpr;canvas.height=height*dpr;
  if(ctx)ctx.setTransform(dpr,0,0,dpr,0,0);
  if(reducedMotion)drawField(0);
}
function drawField(time) {
  if(!ctx)return;
  ctx.clearRect(0,0,width,height);
  const mobile=width<700, cx=width*(mobile?.74:.79),cy=height*(mobile?.72:.49);
  const phase=time*.00012;
  const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,width*.47);
  glow.addColorStop(0,'rgba(42,83,210,.10)');glow.addColorStop(1,'rgba(25,42,90,0)');
  ctx.fillStyle=glow;ctx.fillRect(0,0,width,height);
  for(let i=0;i<28;i++) {
    const offset=i/27;
    ctx.beginPath();
    for(let j=0;j<=90;j++) {
      const u=j/90, x=width*(.30+u*.85);
      const wave=Math.sin(u*4.6+phase+offset*.9);
      const y=cy+wave*(height*.32)+Math.cos(u*3-phase)*70+(offset-.5)*120;
      if(!j)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=`rgba(${90+i},${128+i},255,${.02+.055*Math.sin(offset*Math.PI)})`;
    ctx.lineWidth=i%7===0?1:.5;ctx.stroke();
  }
}
function updateScene(time) {
  requestAnimationFrame(updateScene);
  if(document.hidden)return;
  sx+=(px-sx)*.035;sy+=(py-sy)*.035;
  const top=stage.getBoundingClientRect().top;
  const span=Math.max(1,stage.offsetHeight-height);
  const progress=Math.max(0,Math.min(1,-top/span));
  window.updateNarratives?.(progress);
  const documentSpan=document.documentElement.scrollHeight-innerHeight;
  document.documentElement.style.setProperty('--page-progress',Math.max(0,Math.min(1,scrollY/Math.max(1,documentSpan))));
  const b=bridge.getBoundingClientRect();
  if(b.top<innerHeight&&b.bottom>0) {
    const p=(innerHeight-b.top)/(innerHeight+b.height);
    bridge.style.setProperty('--bridge-angle',(-30+p*60)+'deg');
    bridge.style.setProperty('--bridge-scale',.9+p*.3);
  }
  if(active&&time-lastDraw>40){lastDraw=time;drawField(time);}
}
hero.addEventListener('pointermove',e=>{px=(e.clientX/width-.5)*2;py=(e.clientY/height-.5)*2;});
hero.addEventListener('pointerleave',()=>{px=py=0;});
new IntersectionObserver(entries=>{active=entries[0].isIntersecting;}).observe(hero);
window.addEventListener('resize',resizeScene);resizeScene();
if(!reducedMotion)requestAnimationFrame(updateScene);
const directionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('active',entry.isIntersecting)),{rootMargin:'-30% 0px -35% 0px'});
document.querySelectorAll('.direction').forEach(el=>directionObserver.observe(el));

