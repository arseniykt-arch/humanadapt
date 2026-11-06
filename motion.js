'use strict';
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = x => Math.max(0,Math.min(1,x));
  const ease = p => p*p*(3-2*p);
  const emblem = document.querySelector('.hero-emblem-space');
  const assembly = document.querySelector('.assembly-canvas');
  const actx = assembly.getContext('2d');
  const rows = [...document.querySelectorAll('.direction')];
  const image = new Image();
  let targets=[],aw=0,ah=0,lastP=-1,spineRequested=false;
  function fitAssembly(){const r=assembly.getBoundingClientRect();aw=r.width;ah=r.height;const d=Math.min(devicePixelRatio||1,1.5);assembly.width=aw*d;assembly.height=ah*d;actx?.setTransform(d,0,0,d,0,0);lastP=-1;}
  function drawAssembly(p){
    if(!actx||!targets.length||p===lastP)return;lastP=p;
    actx.clearRect(0,0,aw,ah);
    const e=ease(clamp(p/.88)),opacity=1-clamp((p-.82)/.16);
    emblem.style.setProperty('--assembled',reduce?1:clamp((p-.82)/.16));
    if(opacity<.01)return;
    for(let i=0;i<targets.length;i++){
      const t=targets[i],angle=(1-e)*(2.7+t.seed*1.4);
      const x=(t.x*Math.cos(angle)-t.y*Math.sin(angle))*e;
      const y=(t.x*Math.sin(angle)+t.y*Math.cos(angle))*e;
      actx.fillStyle=`rgba(${130+t.seed*80},${167+t.seed*65},255,${opacity*(.6+t.seed*.4)})`;
      actx.beginPath();actx.arc(aw/2+x*aw,ah/2+y*ah,Math.max(.5,aw/620),0,Math.PI*2);actx.fill();
    }
    if(p<.3){const a=1-p/.3;const g=actx.createRadialGradient(aw/2,ah/2,0,aw/2,ah/2,25);g.addColorStop(0,`rgba(190,220,255,${a})`);g.addColorStop(1,'rgba(80,130,255,0)');actx.fillStyle=g;actx.fillRect(aw/2-25,ah/2-25,50,50);}
  }
  const graph=rows[1].querySelector('.graph-curve');
  const graphLength=graph.getTotalLength();
  window.updateNarratives = p => {
    if(!reduce)drawAssembly(p);
    rows.forEach((row,i)=>{
      const r=row.getBoundingClientRect();
      if(r.bottom<0||r.top>innerHeight)return;
      const q=reduce?1:clamp((innerHeight*.9-r.top)/(innerHeight*.58));
      row.style.setProperty('--motion',q);
      if(i===0){
        const m=ease(q), travel=clamp((m-.08)/.82);
        row.querySelectorAll('.input-dot').forEach((dot,n)=>{
          const local=clamp((travel-n*.035)/.77),x=+dot.dataset.x,y=+dot.dataset.y;
          const cx=x+(224-x)*local;
          const funnel=clamp((cx-70)/67);
          dot.setAttribute('cx',cx);dot.setAttribute('cy',y+(70-y)*funnel);
          dot.setAttribute('r',2+(local*.7));dot.style.opacity=String(1-clamp((local-.9)/.1));
        });
        row.style.setProperty('--channel-output',clamp((q-.3)/.6));
        row.style.setProperty('--channel-scale',.15+ease(clamp((q-.3)/.7))*.85);
      }
      if(i===1){
        row.style.setProperty('--growth',q);row.style.setProperty('--growth-offset',1-q);
        row.querySelector('.growth-clip').setAttribute('width',20+q*225);
        const point=graph.getPointAtLength(graphLength*q);
        const head=row.querySelector('.graph-head');head.setAttribute('cx',point.x);head.setAttribute('cy',point.y);
      }
      if(i===2){
        row.style.setProperty('--page-angle',(-170*ease(clamp(q*2.8)))+'deg');
        row.style.setProperty('--page-angle-2',(-160*ease(clamp((q-.25)*2.5)))+'deg');
        row.style.setProperty('--page-angle-3',(-145*ease(clamp((q-.55)*2.3)))+'deg');
      }
    });
  };
  function requestSpine(){if(spineRequested)return;spineRequested=true;import('./spine.js').catch(()=>{document.querySelector('.spine-canvas')?.remove();});}
  new IntersectionObserver((entries,obs)=>{if(entries[0].isIntersecting){requestSpine();obs.disconnect();}},{rootMargin:'500px'}).observe(document.querySelector('.course-art'));
  image.onload=()=>{
    const off=document.createElement('canvas');off.width=off.height=240;
    const c=off.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0,240,240);
    const pixels=c.getImageData(0,0,240,240).data;
    for(let y=0;y<240;y+=2)for(let x=0;x<240;x+=2){if(pixels[(y*240+x)*4+3]>150)targets.push({x:(x/240-.5)*1.57,y:(y/240-.5)*1.57,seed:((x*17+y*31)%101)/100});}
    fitAssembly();drawAssembly(reduce?1:0);
    if(reduce){emblem.style.setProperty('--assembled',1);window.updateNarratives(1);}
    else maybeIntro();
  };
  image.onerror=()=>{emblem.style.setProperty('--assembled',1);};
  image.src='assets/ifach-logo.png';
  window.addEventListener('resize',fitAssembly);
  function maybeIntro(){
    let seen=false;try{seen=sessionStorage.getItem('ifach-intro-v1')==='1';}catch{}
    if(seen&&!new URLSearchParams(location.search).has('intro'))return;
    const overlay=document.createElement('div');overlay.className='preloader';
    overlay.innerHTML='<canvas aria-hidden="true"></canvas><span class="preloader-note">ИФАЧ / НАУКА. ЧЕЛОВЕК. ДВИЖЕНИЕ.</span><div class="preloader-title">ИНСТИТУТ ФИЗИЧЕСКОЙ<br>АДАПТАЦИИ ЧЕЛОВЕКА</div><div class="preloader-progress"></div><button class="preloader-skip">Пропустить вступление ↗</button>';
    document.body.append(overlay);document.body.classList.add('preloader-open');
    const cv=overlay.querySelector('canvas'),c=cv.getContext('2d'),title=overlay.querySelector('.preloader-title');
    const w=innerWidth,h=innerHeight,d=Math.min(devicePixelRatio||1,1.5);cv.width=w*d;cv.height=h*d;c.setTransform(d,0,0,d,0,0);
    const tc=document.createElement('canvas');tc.width=1000;tc.height=300;
    const tctx=tc.getContext('2d',{willReadFrequently:true});tctx.fillStyle='white';tctx.textAlign='center';tctx.font=`500 ${w<700?68:49}px Arial`;
    ['ИНСТИТУТ ФИЗИЧЕСКОЙ','АДАПТАЦИИ ЧЕЛОВЕКА'].forEach((s,i)=>tctx.fillText(s,500,125+i*65));
    const td=tctx.getImageData(0,0,1000,300).data,letters=[];
    for(let y=60;y<220;y+=3)for(let x=50;x<950;x+=3)if(td[(y*1000+x)*4+3]>120)letters.push({x:(x-500)/1000,y:(y-150)/1000});
    let finished=false,raf=0;
    const priorFocus=document.activeElement;
    const surfaces=[...document.querySelectorAll('body>header,body>main,body>footer')];surfaces.forEach(el=>el.inert=true);
    function finish(){if(finished)return;finished=true;cancelAnimationFrame(raf);overlay.classList.add('complete');document.body.classList.remove('preloader-open');surfaces.forEach(el=>el.inert=false);if(overlay.contains(document.activeElement)){if(priorFocus?.matches('a,button'))priorFocus.focus({preventScroll:true});else document.activeElement.blur();}try{sessionStorage.setItem('ifach-intro-v1','1');}catch{}setTimeout(()=>overlay.remove(),650);}
    overlay.querySelector('button').addEventListener('click',finish);
    overlay.addEventListener('keydown',e=>{if(e.key==='Escape')finish();if(e.key==='Tab'){e.preventDefault();overlay.querySelector('button').focus({preventScroll:true});}});
    overlay.querySelector('button').focus({preventScroll:true});
    const start=performance.now(),size=Math.min(w*.52,h*.43,320),textSize=Math.min(w*.94,1100);
    function tick(now){
      if(finished)return;
      const t=(now-start)/1000;
      overlay.style.setProperty('--intro-progress',Math.min(t/3.9,1));
      c.clearRect(0,0,w,h);
      const assemble=ease(clamp(t/1.55)),morph=ease(clamp((t-1.9)/1.05));
      const fade=1-clamp((t-2.95)/.45);
      const count=Math.max(targets.length,letters.length);
      for(let i=0;i<count;i++){
        const a=targets[i%targets.length],b=letters[(i*37)%letters.length];
        const angle=(1-assemble)*(4+a.seed*3),radius=assemble;
        const lx=(a.x*Math.cos(angle)-a.y*Math.sin(angle))*size*radius;
        const ly=(a.x*Math.sin(angle)+a.y*Math.cos(angle))*size*radius;
        const x=lx*(1-morph)+b.x*textSize*morph;
        const y=ly*(1-morph)+b.y*textSize*morph;
        c.fillStyle=`rgba(${150+a.seed*65},${185+a.seed*50},255,${fade*.8})`;
        c.beginPath();c.arc(w/2+x,h/2+y,.7,0,6.283);c.fill();
      }
      if(t>2.95)title.classList.add('show');
      if(t>=3.9){finish();return;}raf=requestAnimationFrame(tick);
    }
    raf=requestAnimationFrame(tick);
    setTimeout(finish,5500);
  }
})();
