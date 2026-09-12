const steps = [
 ['.run-identity','Escolha como conduzir o plano','A Visionária desenvolve projetos e decide quando lançá-los. O Oligarca forma alianças que protegem negócios, mas precisa manter a lealdade. Sua partida deve aproveitar esse modo próprio de atuação.'],
 ['.metrics','Sustente suas operações','Você precisa chegar a 100% de caos na região escolhida. Conserve dinheiro para sustentar o grupo: falência encerra a partida. Exposição e investigação também causam derrota ao chegar a 100%. Invista antes de comprometer toda a reserva com crises.'],
 ['.opponent-overview','Conheça seus adversários','Helena Duarte investiga vínculos entre negócios e decisões políticas. O Pacto de Estabilidade reage a crises e concentração de poder. Eles mostram quem estão investigando e quando pretendem agir. Examine suas alternativas antes de gastar as três ações.'],
 ['.regional-crisis-panel','Escolha que crise alimentar','A run acontece apenas na região escolhida. Controle político pode levar a rebelião ou guerra civil; fragilidade digital pode paralisar serviços; pressão sanitária pode culminar em pandemia. Esses indicadores medem caminhos de crise. Ao atingir 100% de caos, valores de 70% ou mais definem o desfecho e podem se combinar.'],
 ['.business-panel','Decida como utilizar a empresa','Depois da aquisição, as decisões de uso do negócio passam a aparecer entre as opções do mês. Provocar uma crise pode gerar caos rapidamente, mas interromper a receita ou colocar a empresa em risco.'],
 ['.secret-panel','Interprete os rumores','Cada região guarda uma negociação exclusiva. Os relatos mudam com seus investimentos e oferecem pistas sem revelar os requisitos. Construa presença local e observe quais conversas avançam após o fechamento.'],
 ['.draft-options','Escolha uma entre três opções por mês','A cada mês, três opções aparecem — operações, cartas permanentes ou decisões do seu negócio e aliados — e você deve escolher uma delas. Cartas permanentes combinam com operações futuras: colecioná-las muda o que vale a pena fazer depois.'],
 ['.character-mechanic','Administre sua vantagem','A Visionária pode esperar a revisão de um projeto ou antecipar o lançamento com risco de falha. O Oligarca pode mobilizar aliados contra sanções, consumindo lealdade. Ignorar as exigências dos aliados pode levar a um rompimento.'],
 ['.turn-controls','Prepare o fechamento','O trimestre avança sozinho após a terceira escolha do mês. Confira o caixa, os projetos e os prazos anunciados pelos adversários antes de decidir. Resolva os dilemas que surgirem antes do próximo fechamento. Se o caixa ou a exposição ficarem críticos, avalie sacrificar um negócio ou influência pela saída de emergência, disponível uma vez por run.']
];
let completed=false;
try{completed=localStorage.getItem('ba-regional-tutorial-done')==='1';}catch{}
export function needsTutorial(){return !completed;}
export function startTutorial(){
 if(document.querySelector('#tutorial'))return;
 const previous=document.activeElement,scrollY=window.scrollY;
 const dialog=document.createElement('dialog');dialog.id='tutorial';dialog.className='tutorial-shell';
 dialog.setAttribute('aria-labelledby','tutorial-title');
 document.body.append(dialog);
 let index=0,closed=false,frame;
 function finish(){
  if(closed)return;closed=true;completed=true;
  try{localStorage.setItem('ba-regional-tutorial-done','1');}catch{}
  cancelAnimationFrame(frame);window.removeEventListener('resize',position);window.removeEventListener('scroll',position);
  dialog.close();dialog.remove();window.scrollTo({top:scrollY,behavior:'instant'});previous?.focus({preventScroll:true});
 }
 function position(){
  if(closed)return;
  const target=document.querySelector(steps[index][0]),ring=dialog.querySelector('.tutorial-focus'),card=dialog.querySelector('.tutorial-card');
  if(!target||!ring||!card)return;
  const r=target.getBoundingClientRect(),w=window.innerWidth,h=window.innerHeight;
  const top=Math.max(6,r.top-6),bottom=Math.min(h-6,r.bottom+6);
  Object.assign(ring.style,{left:Math.max(6,r.left-6)+'px',top:top+'px',width:Math.min(w-12,r.width+12)+'px',height:Math.max(10,bottom-top)+'px'});
  const ch=card.getBoundingClientRect().height,cw=card.getBoundingClientRect().width;
  const below=bottom+16;
  const y=below+ch<h-12?below:top-ch-16>=12?top-ch-16:Math.max(12,h-ch-12);
  Object.assign(card.style,{left:Math.max(12,Math.min(w-cw-12,r.left))+'px',top:y+'px'});
 }
 function show(){
  const [selector,title,description]=steps[index];
  dialog.innerHTML=`<div class="tutorial-focus" aria-hidden="true"></div><section class="tutorial-card"><div class="tutorial-meta"><span>TUTORIAL · ${index+1} / ${steps.length}</span><button id="skip-tutorial">Pular tutorial</button></div><h2 id="tutorial-title">${title}</h2><p>${description}</p><div class="tutorial-buttons"><button id="previous-step" ${index===0?'disabled':''}>Anterior</button><button class="primary" id="next-step">${index===steps.length-1?'Começar a jogar':'Próximo →'}</button></div></section>`;
  document.querySelector(selector)?.scrollIntoView({block:'center',behavior:'instant'});
  dialog.querySelector('#skip-tutorial').onclick=finish;
  dialog.querySelector('#previous-step').onclick=()=>{if(index>0){index--;show();}};
  dialog.querySelector('#next-step').onclick=()=>{if(index===steps.length-1)finish();else{index++;show();}};
  position();frame=requestAnimationFrame(position);dialog.querySelector('#next-step').focus({preventScroll:true});
 }
 dialog.addEventListener('cancel',event=>{event.preventDefault();finish();});
 window.addEventListener('resize',position);window.addEventListener('scroll',position,{passive:true});
 dialog.showModal();show();
}
