import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,restoreGame,execute,endTurn,operations,outcome,archetypes,visibleOperations,revealSecrets,secretOperations,secretClue,useAsset,assetBlocked,forecast,respond,rushProject,supportAlly,offerDilemma,resolveDilemma,recover,recoveryAvailable,threatPreview,responseOptions,dilemmaOptions,dilemmaBlocked,runSummary,turnBrief,previewEffect} from './dist/game.js';
const threat=(s,id)=>s.pending.find(p=>p.opponent===id);
function acquire(s,region){s.selected=region;assert.ok(execute(s,'acquisition'));endTurn(s);}
test('demo limitada a dois perfis, três territórios e treze operações comuns',()=>{
 assert.equal(archetypes.length,2);assert.equal(newGame().regions.length,3);assert.equal(operations.filter(o=>!o.secret).length,13);
 const s=newGame();execute(s,'ipo');execute(s,'offshore');execute(s,'legal');assert.equal(execute(s,'campaign'),false);
});
test('aquisição preserva região e receita não é duplicada',()=>{
 const s=newGame();execute(s,'acquisition');s.selected=1;endTurn(s);
 assert.equal(s.regions[0].asset.type,'energy');assert.equal(s.regions[1].asset,null);assert.equal(s.income,1.5);assert.equal(s.money,9.69);assert.equal(forecast(s).revenue,2.5);
 assert.ok(useAsset(s,0,'extract'));assert.match(assetBlocked(s,0,'disrupt'),/já utilizado/);
});
test('crise energética perde receita por dois fechamentos e pode perder concessão',()=>{
 const s=newGame();acquire(s,0);useAsset(s,0,'disrupt');const p=threat(s,'coalition');assert.equal(p.due,4);assert.equal(forecast(s).revenue,1.5);
 endTurn(s);assert.ok(s.regions[0].asset);endTurn(s);assert.equal(s.regions[0].asset,null);
 assert.ok(s.report.entries.some(e=>e.text.includes('concessão de energia foi retirada')));
});
test('supervisão custa recursos e preserva o negócio',()=>{
 const s=newGame();acquire(s,0);useAsset(s,0,'disrupt');const p=threat(s,'coalition'),before=s.money;
 assert.ok(respond(s,p.id,'negotiate'));assert.equal(s.money,+(before-2.2).toFixed(2));assert.equal(respond(s,p.id,'negotiate'),false);
 endTurn(s);endTurn(s);assert.ok(s.regions[0].asset);assert.equal(forecast(s).revenue,2.5);
});
test('reportagem mantém origem e prazo após salvar; contestação reduz danos',()=>{
 let s=newGame();execute(s,'ipo');const p=threat(s,'journalist');execute(s,'senator');assert.equal(p.due,3);assert.ok(p.strength>1);
 assert.ok(respond(s,p.id,'contest'));s=restoreGame(JSON.parse(JSON.stringify(s)));endTurn(s);assert.ok(threat(s,'journalist'));endTurn(s);
 assert.ok(s.report.entries.some(e=>e.text.includes('Oferta especulativa (T1)')));assert.equal(s.world.investigation,2.5);
});
test('rede adia cada pauta apenas uma vez; centro de dados acelera projeto seguro',()=>{
 const s=newGame('visionario',1);acquire(s,1);execute(s,'ipo');let p=threat(s,'journalist');useAsset(s,1,'shield');assert.equal(p.due,5);endTurn(s);useAsset(s,1,'shield');assert.equal(p.due,5);
 const v=newGame('visionario',2);acquire(v,2);execute(v,'research');const project=v.pending.find(p=>p.kind==='project');assert.equal(project.due,5);useAsset(v,2,'develop');assert.equal(project.due,4);assert.equal(project.rushed,false);
});
test('projeto antecipado tem sucesso ou falha reproduzível; não permite antecipar duas vezes',()=>{
 for(const [seed,success] of [[1,false],[42,true]]){
  const s=newGame();s.seed=seed;execute(s,'research');const p=s.pending.find(p=>p.kind==='project');assert.equal(p.due,4);
  assert.ok(rushProject(s,p.id));assert.equal(rushProject(s,p.id),false);endTurn(s);assert.equal(s.tech,success?39:23);assert.equal(s.chaos,success?12:0);
 }
});
test('alianças exigem manutenção e oferecem resposta exclusiva',()=>{
 const s=newGame('oligarca');assert.ok(s.regions[0].ally);acquire(s,0);useAsset(s,0,'disrupt');assert.ok(respond(s,threat(s,'coalition').id,'ally'));assert.ok(supportAlly(s,0));assert.equal(supportAlly(s,0),false);
 const idle=newGame('oligarca');for(let i=0;i<10;i++)endTurn(idle);assert.equal(idle.regions[0].ally,null);assert.ok(idle.history.some(h=>h.title==='Aliado rompe com o grupo'));
});
test('segredos exclusivos, rumores progressivos e controle de estatais em 30%',()=>{
 const s=newGame();const initial=secretClue(s);s.regions[0].completed=['senator'];assert.notEqual(secretClue(s),initial);
 s.regions[0].control=29;revealSecrets(s);assert.equal(visibleOperations(s).some(o=>o.secret),false);
 s.regions[0].control=30;revealSecrets(s);assert.ok(visibleOperations(s).some(o=>o.id==='state_owned'));
 for(const r of s.regions){r.completed=['senator','acquisition','research'];r.control=50;r.influence=50;r.heat=50;}s.tech=50;revealSecrets(s);
 for(let i=0;i<3;i++){s.selected=i;const ops=visibleOperations(s).filter(o=>o.secret);assert.equal(ops.length,1);assert.equal(ops[0].territory,i);assert.equal(ops[0].id,secretOperations[i].id);}
});
test('save antigo não é convertido silenciosamente; demo mantém todas as decisões',()=>{
 const s=newGame();execute(s,'ipo');assert.deepEqual(restoreGame(JSON.parse(JSON.stringify(s))),s);assert.equal(restoreGame({...s,version:4}),null);
});
test('falência e exposição têm prioridade sobre vitória; espera nunca vence',()=>{
 for(const k of ['money','exposure','investigation']){const s=newGame();s.chaos=100;if(k==='investigation')s.world.investigation=100;else s[k]=k==='money'?0:100;assert.equal(outcome(s),'lost');}
 for(const a of archetypes){const s=newGame(a.id);for(let t=0;t<200&&s.status==='playing';t++)endTurn(s);assert.equal(s.status,'lost');assert.equal(s.chaos,0);}
});

test('escolha regional bloqueia operações e negócios fora da campanha',()=>{
 for(let i=0;i<3;i++){
  const s=newGame('oligarca',i);assert.equal(s.selected,i);assert.ok(s.regions[i].ally);
  assert.equal(s.regions.filter(r=>r.ally).length,1);
  const before=s.money;s.selected=(i+1)%3;assert.equal(execute(s,'acquisition'),false);assert.equal(useAsset(s,s.selected,'extract'),false);assert.equal(s.money,before);
  const restored=restoreGame(JSON.parse(JSON.stringify(s)));assert.equal(restored.selected,i);
 }
 assert.equal(restoreGame({...newGame(),version:5}),null);
});
test('crises sanitária e digital afetam somente a região após o fechamento',()=>{
 const s=newGame('visionario',2);s.tech=30;
 assert.equal(execute(s,'health_crisis'),false);assert.ok(execute(s,'austerity'));assert.ok(execute(s,'digital'));
 assert.equal(s.regions[2].sanitary,0);endTurn(s);assert.equal(s.regions[2].sanitary,18);assert.equal(s.regions[2].digital,22.5);
 assert.equal(s.regions[0].sanitary,0);assert.equal(s.regions[1].digital,0);assert.equal(s.tech,30);
 execute(s,'austerity');endTurn(s);assert.ok(execute(s,'health_crisis'));
});
test('finais usam condições regionais, combinam crises e preservam prioridade da derrota',()=>{
 for(const [control,digital,sanitary,title] of [[100,0,0,'Guerra civil'],[70,0,0,'Rebelião armada'],[0,70,0,'Colapso tecnológico'],[0,0,70,'Pandemia sem contenção'],[100,100,100,'Colapso em múltiplas frentes'],[69,69,69,'Ruptura da ordem regional']]){
  const s=newGame('visionario',1);Object.assign(s.regions[1],{control,digital,sanitary});s.chaos=100;assert.equal(outcome(s),'won');assert.equal(s.finale.title,title);assert.match(s.ending,/Europa Ocidental/);
  assert.deepEqual(restoreGame(JSON.parse(JSON.stringify(s))).finale,s.finale);
 }
 const s=newGame();s.tech=100;s.chaos=100;outcome(s);assert.equal(s.finale.id,'social','capacidade tech não equivale a dano digital');
 const fail=newGame();fail.money=0;fail.chaos=100;fail.regions[0].sanitary=100;outcome(fail);assert.equal(fail.status,'lost');assert.equal(fail.finale,undefined);
});

test('caminhos sanitário e digital permitem concluir todas as regiões com ambos os perfis',()=>{
 for(const arch of archetypes)for(let region=0;region<3;region++)for(const path of ['sanitary','digital']){
  const s=newGame(arch.id,region);s.seed=42;
  for(let t=0;t<60&&s.status==='playing';t++){
   for(let a=0;a<3&&s.status==='playing';a++){
    if(s.exposure>32&&execute(s,'offshore'))continue;
    if(s.world.investigation>35&&execute(s,'legal'))continue;
    if(s.money<5&&execute(s,'ipo'))continue;
    if(!s.regions[region].asset&&s.money>5&&execute(s,'acquisition'))continue;
    if(path==='digital'&&s.tech<30&&(useAsset(s,region,'develop')||execute(s,'research')))continue;
    if(path==='sanitary'&&(execute(s,'austerity')||execute(s,'health_crisis')))continue;
    if(path==='digital'&&(execute(s,'digital')||execute(s,'ai')))continue;
    if(useAsset(s,region,'extract'))continue;
    break;
   }
   if(s.dilemma)resolveDilemma(s,s.dilemma.id,'persist');
   if(s.status==='playing')endTurn(s);
  }
  assert.equal(s.status,'won',arch.id+' '+region+' '+path);assert.equal(s.finale.id,path);assert.ok(s.stats.threatsFaced>0);
 }
});

test('uma campanha política alcança guerra civil sem manipular os recursos',()=>{
 const s=newGame('oligarca',1);s.seed=42;
 for(let t=0;t<60&&s.status==='playing';t++){
  for(let a=0;a<3&&s.status==='playing';a++){
   if(s.exposure>32&&execute(s,'offshore'))continue;
   if(s.world.investigation>35&&execute(s,'legal'))continue;
   if(s.money<5&&execute(s,'ipo'))continue;
   if(!s.regions[1].asset&&s.money>5&&execute(s,'acquisition'))continue;
   if(execute(s,'capture')||execute(s,'senator')||execute(s,'campaign'))continue;
   break;
  }
  if(s.dilemma)resolveDilemma(s,s.dilemma.id,'persist');
   if(s.status==='playing')endTurn(s);
 }
 assert.equal(s.status,'won');assert.equal(s.finale.title,'Guerra civil');assert.equal(s.finale.snapshot.control,100);
});

test('nove dilemas são causais, persistentes, não repetem e bloqueiam fechamento',()=>{
 for(const axis of ['control','digital','sanitary']){
  let s=newGame();s.chaos=65;s.regions[0][axis]=85;s.dilemmasSeen=['regional:0:0','regional:0:1'];
  for(let stage=0;stage<3;stage++){
   offerDilemma(s);assert.equal(s.dilemma.id,axis+':'+stage);
   s=restoreGame(JSON.parse(JSON.stringify(s)));const id=s.dilemma.id,turn=s.turn;
   assert.equal(endTurn(s),false);assert.equal(s.turn,turn);
   assert.equal(resolveDilemma(s,id,'invalid'),false);assert.ok(s.dilemma);
   assert.ok(resolveDilemma(s,id,'persist'));assert.equal(resolveDilemma(s,id,'persist'),false);
  }
  offerDilemma(s);assert.equal(s.dilemma,null);assert.equal(s.dilemmasSeen.length,5);
 }
});
test('financiar resposta reduz a crise e preserva ações; falta de caixa não trava a decisão',()=>{
 const s=newGame();s.chaos=25;s.regions[0].sanitary=40;offerDilemma(s);const before=s.money;
 assert.ok(resolveDilemma(s,s.dilemma.id,'fund'));assert.equal(s.regions[0].sanitary,28);assert.equal(s.money,before-1.2);assert.equal(s.actions,0);
 const poor=newGame();poor.money=.5;poor.chaos=25;poor.regions[0].digital=40;offerDilemma(poor);
 assert.equal(resolveDilemma(poor,poor.dilemma.id,'fund'),false);assert.ok(resolveDilemma(poor,poor.dilemma.id,'persist'));
});
test('Pacto ataca a crise dominante; reforma cancela a medida mediante recuo real',()=>{
 for(const axis of ['control','digital','sanitary']){
  const s=newGame();s.regions[0][axis]=60;endTurn(s);const p=threat(s,'coalition');assert.equal(p.crisis,axis);
  assert.equal(threatPreview(s,p)[axis],-14);assert.ok(responseOptions(s,p).some(o=>o.id==='reform'));
  const before=s.regions[0][axis];assert.ok(respond(s,p.id,'reform'));assert.equal(s.regions[0][axis],before-20);assert.equal(threat(s,'coalition'),undefined);
 }
});
test('saída de emergência vende patrimônio uma vez e nunca ressuscita run encerrada',()=>{
 let s=newGame();acquire(s,0);s.money=3;s.actions=3;assert.ok(recoveryAvailable(s));assert.ok(recover(s,'sell'));
 assert.equal(s.money,8);assert.equal(s.regions[0].asset,null);assert.equal(s.actions,3);
 s=restoreGame(JSON.parse(JSON.stringify(s)));s.money=3;assert.equal(recover(s,'sell'),false);
 const lost=newGame();lost.money=0;outcome(lost);assert.equal(recover(lost,'concede'),false);
});
test('proteção institucional gasta influência, controle e a única saída da run',()=>{
 const s=newGame('oligarca');s.money=3;s.regions[0].control=50;s.regions[0].influence=50;endTurn(s);
 s.money=3;const control=s.regions[0].control,influence=s.regions[0].influence;assert.ok(threat(s,'coalition'));
 assert.ok(recover(s,'concede'));assert.equal(s.money,6);assert.equal(s.regions[0].control,control-20);assert.equal(s.regions[0].influence,influence-20);assert.equal(threat(s,'coalition'),undefined);
});

test('trocas nos dilemas gastam recursos próprios e não permitem descontos sem saldo',()=>{
 for(const [axis,key,value,expected] of [['control','influence',20,5],['digital','tech',20,5],['sanitary','income',1.5,1.2]]){
  const s=newGame();s.chaos=25;s.regions[0][axis]=40;if(key==='influence')s.regions[0][key]=value;else s[key]=value;
  offerDilemma(s);assert.ok(dilemmaOptions(s).some(o=>o.id==='trade'));assert.equal(dilemmaBlocked(s,'trade'),'');
  const id=s.dilemma.id;assert.ok(resolveDilemma(s,id,'trade'));assert.equal(key==='influence'?s.regions[0][key]:s[key],expected);
  assert.equal(resolveDilemma(s,id,'trade'),false);
 }
 const low=newGame();low.tech=14;low.chaos=25;low.regions[0].digital=40;offerDilemma(low);
 assert.match(dilemmaBlocked(low,'trade'),/15/);assert.equal(resolveDilemma(low,low.dilemma.id,'trade'),false);assert.equal(low.tech,14);
 const poor=newGame();poor.income=.6;poor.chaos=25;poor.regions[0].sanitary=40;offerDilemma(poor);assert.ok(dilemmaBlocked(poor,'trade'));assert.ok(resolveDilemma(poor,poor.dilemma.id,'persist'));
});
test('cada região tem dois eventos exclusivos, com escolhas persistentes',()=>{
 const titles=new Set();
 for(let region=0;region<3;region++){
  let s=newGame('visionario',region);s.chaos=66;
  for(let stage=0;stage<2;stage++){
   offerDilemma(s);assert.equal(s.dilemma.id,`regional:${region}:${stage}`);titles.add(s.dilemma.title);
   s=restoreGame(JSON.parse(JSON.stringify(s)));assert.ok(resolveDilemma(s,s.dilemma.id,'persist'));
  }
  assert.ok(s.dilemmasSeen.includes(`regional:${region}:1`));
 }
 assert.equal(titles.size,6);
});
test('regras regionais afetam campanha, fiscalização, tecnologia e despesas',()=>{
 const south=newGame('oligarca',0);execute(south,'campaign');endTurn(south);assert.equal(south.regions[0].influence,37);assert.equal(south.regions[0].ally.loyalty,81);
 const europe=newGame('visionario',1);assert.equal(previewEffect(europe,operations.find(o=>o.id==='legal')).investigation,-25);execute(europe,'ipo');assert.equal(threatPreview(europe,threat(europe,'journalist')).investigation,7);
 const asia=newGame('visionario',2);assert.equal(previewEffect(asia,operations.find(o=>o.id==='digital')).digital,22.5);const before=forecast(asia).upkeep;asia.regions[2].digital=40;assert.equal(forecast(asia).upkeep,+(before+.15).toFixed(2));
});
test('relatório separa efeitos concluídos, prazos e oportunidades; snapshot não muda',()=>{
 const s=newGame();execute(s,'acquisition');execute(s,'ipo');endTurn(s);
 assert.ok(s.report.brief.consequences.some(h=>h.title.includes('Adquirir')));assert.equal(s.report.brief.threats[0].due,3);assert.ok(s.report.brief.opportunities.some(t=>t.includes('Companhia')));
 const snapshot=JSON.stringify(s.report.brief);respond(s,threat(s,'journalist').id,'contest');assert.equal(JSON.stringify(s.report.brief),snapshot);
 assert.ok(turnBrief(s).threats[0].decision);
});
test('encerramento recupera escolhas reais e destino dos negócios, inclusive após reload',()=>{
 let s=newGame();acquire(s,0);useAsset(s,0,'extract');s.money=3;recover(s,'sell');s=restoreGame(JSON.parse(JSON.stringify(s)));
 const summary=runSummary(s);assert.ok(summary.decisions.some(d=>d.title==='Saída de emergência'));assert.ok(summary.decisions.some(d=>d.title==='Adquirir negócio'));assert.match(summary.business,/sem o negócio/);assert.ok(summary.decisions.length<=3);
 const legacy=newGame();delete legacy.decisions;assert.deepEqual(runSummary(restoreGame(legacy)).decisions,[]);
});
