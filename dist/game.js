// Demo: one shared, deterministic ruleset for the browser and future native builds.
export const archetypes = [
 {id:'visionario',name:'A Visionária',icon:'◈',tag:'PROJETOS TECNOLÓGICOS',desc:'Desenvolve projetos de três trimestres e decide se antecipa o lançamento, assumindo riscos.',bonus:'Projetos exclusivos · antecipação de lançamento',tech:15},
 {id:'oligarca',name:'O Oligarca',icon:'♜',tag:'REDE DE ALIADOS',desc:'Forma alianças que protegem negócios. Precisa sustentar a lealdade e responder às exigências dos aliados.',bonus:'Aliado inicial · proteção política regional',politics:20}
];
export const regions = [
 {name:'América do Sul',x:290,y:291,corruption:70,press:60,business:'energy'},
 {name:'Europa Ocidental',x:474,y:116,corruption:30,press:90,business:'media'},
 {name:'Sudeste Asiático',x:724,y:240,corruption:60,press:35,business:'data'}
];
export const regionalRules = [
 {title:'Acordos pessoais',text:'Campanhas e acordos geram 25% mais influência local. Aliados perdem 4 de lealdade por trimestre, em vez de 3.'},
 {title:'Fiscalização institucional',text:'Reportagens acrescentam 2 pontos de investigação. A defesa jurídica reduz 25 pontos, em vez de 20.'},
 {title:'Dependência digital',text:'Operações geram 25% mais fragilidade digital. A partir de 40%, a manutenção aumenta $0,15B por trimestre.'}
];
export const businesses = {
 energy:{name:'Companhia de energia',icon:'ϟ',income:1,desc:'Financia o grupo ou permite provocar uma crise energética, colocando a concessão em risco.'},
 media:{name:'Rede de emissoras',icon:'◉',income:.7,desc:'Pode proteger a reputação do grupo ou ampliar uma campanha de polarização.'},
 data:{name:'Centro de dados',icon:'◇',income:.9,desc:'Apoia pesquisa ou implanta um sistema instável com efeitos sobre a região.'}
};
export const opponents = {
 journalist:{name:'Helena Duarte',role:'Jornalista investigativa',initials:'HD',desc:'Investiga negócios controversos e repetições na mesma região. Anuncia uma reportagem antes de publicar.',color:'red'},
 coalition:{name:'Pacto de Estabilidade',role:'Coalizão de governos',initials:'PE',desc:'Reage a crises locais e concentração de poder. Pode suspender negócios e impor sanções.',color:'gold'}
};
export const operations = [
 ['acquisition','Adquirir negócio','economia',3,{},'Compre o negócio regional para receber renda e decidir como utilizá-lo.'],
 ['offshore','Criar offshore','economia',1.2,{exposure:-20},'Reduza sua exposição antes de comprometer mais recursos.'],
 ['legal','Mobilizar defesa jurídica','economia',1.6,{investigation:-20},'Conteste o caso internacional já aberto.'],
 ['ipo','Oferta especulativa','economia',0,{money:3.5,exposure:13},'Obtenha capital agora, atraindo o interesse da jornalista.'],
 ['campaign','Financiar campanha','politica',1.3,{politics:12},'Construa influência local. O Oligarca também forma uma aliança.'],
 ['senator','Comprar senador','politica',1.5,{politics:8,control:8,exposure:6},'Obtenha acesso político, deixando vínculos para a imprensa investigar.'],
 ['research','Financiar pesquisa','tech',2,{tech:18},'Prepare tecnologia. A Visionária desenvolve um projeto de três trimestres.'],
 ['disinfo','Campanha de polarização','midia',1.4,{chaos:9,exposure:5},'Use seu alcance de mídia para aumentar a instabilidade.',{media:12}],
 ['capture','Capturar instituições','politica',1.8,{control:18,chaos:10,exposure:7},'Amplie o controle sobre as instituições locais, atraindo fiscalização.'],
 ['digital','Centralizar serviços digitais','tech',1.5,{digital:18,chaos:10,exposure:5},'Concentre serviços essenciais em sistemas frágeis.',{tech:20}],
 ['austerity','Reduzir proteção sanitária','saude',1.3,{sanitary:18,chaos:8,exposure:5},'Cortes na assistência aumentam a pressão sobre a rede de saúde.'],
 ['health_crisis','Explorar crise hospitalar','saude',1.8,{sanitary:22,chaos:16,exposure:8},'Aproveite a rede sobrecarregada para ampliar a instabilidade.',{sanitary:30}],
 ['ai','Implantar IA sem revisão','tech',2.5,{tech:8,digital:12,chaos:16,exposure:9},'Acelere uma implantação que pode provocar uma crise regional.',{tech:30}]
].map(([id,name,category,cost,effect,desc,requires={}])=>({id,name,category,cost,effect,desc,requires}));
export const secretOperations = [
 {id:'state_owned',territory:0,name:'Controlar estatais',category:'economia',cost:3.5,effect:{income:.5,control:6,chaos:7,exposure:8},desc:'Associe as empresas públicas à operação da sua companhia.',requires:{},secret:{completed:'senator',control:30}},
 {id:'editorial_pact',territory:1,name:'Pacto editorial regional',category:'midia',cost:2.5,effect:{media:15,chaos:10,exposure:6},desc:'Amplie o alcance da rede através de um acordo regional.',requires:{},secret:{completed:'acquisition',influence:20,control:15}},
 {id:'emergency_license',territory:2,name:'Licença emergencial de pesquisa',category:'tech',cost:3,effect:{tech:12,chaos:15,exposure:8},desc:'Obtenha uma autorização excepcional para seu centro de dados.',requires:{tech:30},secret:{completed:'research',influence:20,heat:25}}
];
operations.push(...secretOperations);
export const labels={money:'patrimônio',income:'receita/tri.',chaos:'caos',politics:'influência',media:'mídia',tech:'tecnologia',exposure:'exposição',investigation:'investigação',influence:'influência local',control:'controle político local',digital:'fragilidade digital',sanitary:'pressão sanitária'};
const limit=(v,min=0,max=100)=>Math.max(min,Math.min(max,v));
export function newGame(archetype='visionario',territory=0){
 territory=Number.isInteger(territory)&&regions[territory]?territory:0;
 const a=archetypes.find(a=>a.id===archetype)||archetypes[0];
 return {version:6,decisions:[],dilemma:null,dilemmasSeen:[],recoveryUsed:false,territory,archetype:a.id,difficulty:'normal',turn:1,actions:0,turnUsed:[],money:12,income:1.5,chaos:0,politics:a.politics||0,media:0,tech:a.tech||0,exposure:0,
  regions:regions.map((r,i)=>({...r,stability:90,digital:0,sanitary:0,control:a.id==='oligarca'&&i===territory?20:0,influence:a.id==='oligarca'&&i===territory?20:0,heat:0,completed:[],unlocked:[],asset:null,crisisUntil:0,ally:a.id==='oligarca'&&i===territory?{loyalty:70,demandDue:4}:null})),
  selected:territory,history:[],status:'playing',used:[],pending:[],sequence:0,seed:Math.floor(Math.random()*1e9),rewarded:false,report:null,
  world:{alert:0,investigation:0,adaptation:{economia:0,politica:0,midia:0,tech:0,saude:0}},rivals:{journalist:{lastMove:'Ainda não identificou um vínculo relevante.'},coalition:{lastMove:'Acompanha a estabilidade da sua região.'}},stats:{operations:0,assetChoices:0,threatsFaced:0,threatsResolved:0,projectsRushed:0}};
}
export function restoreGame(saved){
 if(!saved||saved.version!==6||saved.regions?.length!==3||!Number.isInteger(saved.territory)||!regions[saved.territory]||!archetypes.some(a=>a.id===saved.archetype))return null;
 saved.decisions??=[];
 saved.dilemma??=null;saved.dilemmasSeen??=[];saved.recoveryUsed??=false;
 saved.selected=saved.territory;
 return saved;
}
export function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function log(s,title,text,type='neutral'){s.history.unshift({title,text,type,turn:s.turn});s.history=s.history.slice(0,100);}
function clamp(s){for(const k of ['chaos','politics','media','tech'])s[k]=limit(s[k]);s.exposure=limit(s.exposure);s.money=Math.round(s.money*100)/100;s.world.alert=limit(s.world.alert);s.world.investigation=limit(s.world.investigation);}
function apply(s,effect,region){
 for(const [k,v]of Object.entries(effect)){
  if(['control','digital','sanitary','influence'].includes(k)){if(region!==undefined)s.regions[region][k]=limit(s.regions[region][k]+v);}
  else if(k==='investigation')s.world.investigation+=v;else s[k]+=v;
 }
 if(region!==undefined){const r=s.regions[region];r.stability=limit(r.stability-(effect.chaos||0)*1.5);r.influence=limit(r.influence+(effect.politics||0)*(r.corruption/100+.5)*(region===0?1.25:1));r.control=limit(r.control+(effect.politics||0)*.5);if(effect.chaos>0)r.crisisUntil=Math.max(r.crisisUntil,s.turn+2);}
 clamp(s);
}
export function outcome(s){
 clamp(s);
 if(s.money<=0||s.exposure>=100||s.world.investigation>=100){s.status='lost';s.ending=s.money<=0?'A reserva acabou antes que seu plano fosse concluído.':s.exposure>=100?'As reportagens tornaram sua participação pública.':'O Pacto de Estabilidade reuniu provas para encerrar suas operações.';}
 else if(s.chaos>=100){s.status='won';s.finale=regionalEnding(s);s.ending=s.finale.text;}
 return s.status;
}

export function regionalEnding(s){
 const r=s.regions[s.territory];
 const paths=[{id:'political',value:r.control,title:r.control>=100?'Guerra civil':'Rebelião armada',text:r.control>=100?'Com o controle político integral e as instituições em colapso, facções disputam o comando da região em uma guerra civil.':'A crise de legitimidade e a concentração de poder alimentam uma rebelião armada contra a ordem regional.'},
  {id:'digital',value:r.digital,title:'Colapso tecnológico',text:'Falhas em sistemas interligados paralisam bancos, pagamentos e serviços essenciais. A região perde a capacidade de operar sua infraestrutura digital.'},
  {id:'sanitary',value:r.sanitary,title:'Pandemia sem contenção',text:'Uma onda epidêmica encontra a assistência e a vigilância sanitária esgotadas. A disseminação ultrapassa fronteiras e a região se torna o epicentro de uma pandemia.'}];
 const severe=paths.filter(p=>p.value>=70).sort((a,b)=>b.value-a.value);
 // Multiple severe crises survive in the ending, rather than silently breaking ties.
 const primary=severe[0];
 return {id:severe.length>1?'combined':primary?.id||'social',title:severe.length>1?'Colapso em múltiplas frentes':primary?.title||'Ruptura da ordem regional',
  text:`${r.name}: ${severe.length?severe.map(p=>p.text).join(' '):'A sucessão de crises, protestos e interrupções supera a resposta das instituições, sem que uma única causa domine o colapso.'}`,
  causes:severe.map(p=>({id:p.id,title:p.title,value:p.value})),snapshot:{chaos:s.chaos,control:r.control,digital:r.digital,sanitary:r.sanitary}};
}
export function regionalOutlook(s){
 const r=s.regions[s.territory];
 const signals=[['Controle político',r.control],['Fragilidade digital',r.digital],['Pressão sanitária',r.sanitary]].filter(([,v])=>v>=40);
 return signals.length?signals.map(([label,v])=>`${label}: ${Math.round(v)}%${v>=70?' · crise estrutural':' · em escalada'}`).join(' / '):'Nenhuma crise especializada domina a região. Suas próximas escolhas definirão o desfecho.';
}

export function describe(effect){return Object.entries(effect).filter(([,v])=>v).map(([k,v])=>`${v>0?'+':''}${Number.isInteger(v)?v:v.toFixed(1)}${['money','income'].includes(k)?'B':'%'} ${labels[k]}`).join(' · ');}
export function effectiveness(s,o,region=s.selected){return Math.max(.5,1-(s.world.adaptation[o.category]||0)*.004-s.regions[region].heat*.002);}
export function previewEffect(s,o){
 if(o.id==='acquisition'){const b=businesses[s.regions[s.selected].business];return {income:b.income,...(s.regions[s.selected].business==='media'?{media:12}:s.regions[s.selected].business==='data'?{tech:8}:{})};}
 const effect={...o.effect};if(o.id==='legal'&&s.territory===1)effect.investigation=-25;if(effect.digital&&s.territory===2)effect.digital=+(effect.digital*1.25).toFixed(1);if(effect.chaos)effect.chaos=+(effect.chaos*effectiveness(s,o)).toFixed(1);return effect;
}
export function operationDelay(s,o){return o.id==='research'&&s.archetype==='visionario'?3:1;}
export function secretRequirements(s,o,region=s.selected){
 if(!o.secret)return [];
 const r=s.regions[region];return Object.entries(o.secret).map(([k,v])=>k==='completed'?{met:r.completed.includes(v),text:`Concluir “${operations.find(x=>x.id===v).name}” nesta região`}:{met:r[k]>=v,text:`${v}% de ${{control:'controle político',influence:'influência local',heat:'pressão local'}[k]}`});
}
export function revealSecrets(s){for(const o of secretOperations){const r=s.regions[o.territory];if(!r.unlocked.includes(o.id)&&secretRequirements(s,o,o.territory).every(x=>x.met)&&Object.entries(o.requires).every(([k,v])=>s[k]>=v)){r.unlocked.push(o.id);log(s,'Negociação identificada',`${o.name} em ${r.name}. Seus contatos conseguiram acesso ao acordo.`,'positive');}}}
export function secretClue(s){
 const r=s.regions[s.selected];
 const clues=[
  ['A companhia regional convive com empresas públicas cuja gestão está em discussão. O debate ainda não avançou no legislativo.','Um representante abriu conversas sobre as empresas públicas, mas ainda falta apoio para conduzir o acordo.'],
  ['As emissoras locais buscam um interlocutor capaz de reunir interesses comerciais e políticos.','Sua rede foi convidada para conversas reservadas. Os outros participantes querem garantias de apoio regional.'],
  ['A administração discute autorizações excepcionais para lidar com falhas de serviços. Faltam propostas de pesquisa locais.','Seu projeto chegou às autoridades. O contexto regional ainda pesa na decisão de conceder uma autorização excepcional.']
 ];
 return clues[s.selected][r.completed.includes(['senator','acquisition','research'][s.selected])?1:0];
}
export function visibleOperations(s){return operations.filter(o=>!o.secret||(o.territory===s.selected&&s.regions[s.selected].unlocked.includes(o.id)));}
export function secretStatus(s,o){return s.pending.some(p=>p.kind==='impact'&&p.operation===o.id&&p.region===s.selected)?'Em andamento':'';}
function actionBlocked(s){return s.status!=='playing'?'Partida encerrada':s.actions>=3?'Sem ações neste trimestre':'';}
export function blocked(s,o){
 let reason=actionBlocked(s);if(reason)return reason;
 if(s.selected!==s.territory)return 'Esta região está fora da campanha';
 if(o.secret){if(o.territory!==s.selected||!s.regions[s.selected].unlocked.includes(o.id))return 'Acordo não descoberto nesta região';reason=secretRequirements(s,o).find(x=>!x.met)?.text;if(reason)return reason;}
 if(s.turnUsed.includes(o.id))return 'Já executada neste trimestre';
 if(s.money<o.cost)return 'Patrimônio insuficiente';
 if(o.id==='acquisition'&&(s.regions[s.selected].asset||s.pending.some(p=>p.operation==='acquisition'&&p.region===s.selected)))return 'Negócio já adquirido ou em aquisição';
 if(o.id==='research'&&s.pending.some(p=>p.kind==='project'))return 'Um projeto já está em desenvolvimento';
 for(const[k,v]of Object.entries(o.requires))if((['digital','sanitary'].includes(k)?s.regions[s.territory][k]:s[k])<v)return `Requer ${v}% de ${labels[k]}`;
 return '';
}
export function provokesResponse(s,o){return ['ipo','senator','disinfo','ai','capture','digital','austerity','health_crisis'].includes(o.id)||!!o.secret;}
export function threatPreview(s,p){
 const r=s.regions[p.region];
 if(p.opponent==='journalist')return {exposure:Math.round((8+p.strength)*(1-Math.min(.35,s.media*.004))),investigation:p.region===1?7:5};
 const protection=s.archetype==='oligarca'&&r.ally?.loyalty>=40?.55:1;
 return {money:-+(1.2*protection).toFixed(1),chaos:-Math.round(3*protection),[p.crisis||'control']:-Math.round((p.crisis?14:8)*protection),investigation:Math.round(5*protection)};
}
function scheduleThreat(s,opponent,region,source,strength=1){
 if((s.rivals[opponent].cooldownUntil||0)>s.turn)return;
 const rival=s.rivals[opponent],existing=s.pending.find(p=>p.kind==='response'&&p.opponent===opponent);
 if(existing){existing.strength=Math.min(4,existing.strength+.4);rival.lastMove=opponent==='journalist'?`A investigação foi ampliada após ${source}. O prazo original continua.`:`O Pacto acrescentou ${source} ao debate. A votação e as medidas previstas continuam.`;log(s,opponents[opponent].name,rival.lastMove,'danger');return;}
 const r=s.regions[region],due=s.turn+2;
 s.pending.push({id:++s.sequence,kind:'response',opponent,region,source,originTurn:s.turn,due,strength,crisis:opponent==='coalition'?dominantCrisis(s):null});
 rival.lastMove=opponent==='journalist'?`Apura ${source} em ${r.name}. Publicação prevista no T${due}.`:`Debate medidas após ${source} em ${r.name}. Votação no T${due}.`;
 log(s,opponent==='journalist'?'Helena prepara uma reportagem':'O Pacto prepara sanções',rival.lastMove,'danger');s.stats.threatsFaced++;
}
function heat(s,region,amount){s.regions[region].heat=limit(s.regions[region].heat+amount);s.world.alert=limit(s.world.alert+amount*.45);}
export function execute(s,id){
 const o=operations.find(o=>o.id===id);if(!o||blocked(s,o))return false;
 s.money-=o.cost;s.actions++;s.turnUsed.push(id);s.stats.operations++;
 const effect=previewEffect(s,o),immediate={},delayed={};
 for(const[k,v]of Object.entries(effect))(['exposure','investigation'].includes(k)||(id==='ipo'&&k==='money')?immediate:delayed)[k]=v;
 apply(s,immediate,s.selected);
 const kind=id==='research'&&s.archetype==='visionario'?'project':'impact';
 if(Object.keys(delayed).length)s.pending.push({id:++s.sequence,kind,operation:id,region:s.selected,originTurn:s.turn,due:s.turn+operationDelay(s,o),effect:delayed,rushed:false});
 if(provokesResponse(s,o)){heat(s,s.selected,4);scheduleThreat(s,'journalist',s.selected,o.name);if((effect.chaos||0)>=12||s.regions[s.selected].control>=35)scheduleThreat(s,'coalition',s.selected,o.name);}
 s.world.adaptation[o.category]=limit(s.world.adaptation[o.category]+(effect.chaos?2:0));s.used.push(id);
 if(!Object.keys(delayed).length)recordDecision(s,o.name,describe(immediate),immediate);
 log(s,o.name,`${s.regions[s.selected].name}. ${describe(immediate)}${Object.keys(delayed).length?` Resultado previsto no T${s.turn+operationDelay(s,o)}: ${describe(delayed)}.`:''}`,'positive');
 revealSecrets(s);outcome(s);return true;
}
export const assetOptions = {
 energy:[{id:'extract',name:'Extrair dividendos',cost:0,desc:'+$2B agora; +6 exposição. Helena investiga a empresa.'},{id:'disrupt',name:'Provocar crise energética',cost:1,desc:'+18 caos e +7 exposição; interrompe a receita por 2 trimestres. O Pacto pode retirar a concessão.'}],
 media:[{id:'shield',name:'Proteger a reputação',cost:.5,desc:'−10 exposição e +5 mídia. Adia uma reportagem uma única vez.'},{id:'polarize',name:'Ampliar polarização',cost:1,desc:'+13 caos e +7 exposição. A jornalista segue os vínculos da rede.'}],
 data:[{id:'develop',name:'Processar pesquisa',cost:.5,desc:'+10 tecnologia. A Visionária adianta seu projeto em 1 trimestre, sem o risco do lançamento antecipado.'},{id:'deploy',name:'Implantar sistema instável',cost:1,desc:'+22,5 fragilidade digital, +16 caos e +8 exposição; receita suspensa por 1 trimestre. O Pacto reage.'}]
};
export function assetBlocked(s,region,choice){
 const base=actionBlocked(s);if(base)return base;
 if(region!==s.territory)return 'Esta região está fora da campanha';
 const a=s.regions[region]?.asset;if(!a)return 'Negócio não adquirido';
 const option=assetOptions[a.type]?.find(o=>o.id===choice);if(!option)return 'Escolha inválida';
 if(a.suspendedUntil>s.turn)return `Operação suspensa até T${a.suspendedUntil}`;
 if(a.lastUsed===s.turn)return 'Negócio já utilizado neste trimestre';
 if(s.money<option.cost)return 'Patrimônio insuficiente';return '';
}
export function useAsset(s,region,choice){
 if(assetBlocked(s,region,choice))return false;
 const r=s.regions[region],a=r.asset,option=assetOptions[a.type].find(o=>o.id===choice);
 s.money-=option.cost;s.actions++;s.stats.assetChoices++;a.lastUsed=s.turn;
 if(choice==='extract'){apply(s,{money:2,exposure:6},region);heat(s,region,6);scheduleThreat(s,'journalist',region,'extração de dividendos da companhia');}
 if(choice==='disrupt'){apply(s,{chaos:18,exposure:7},region);a.suspendedUntil=s.turn+3;heat(s,region,14);scheduleThreat(s,'coalition',region,'crise energética');}
 if(choice==='shield'){
  apply(s,{exposure:-10,media:5},region);
  const p=s.pending.find(p=>p.kind==='response'&&p.opponent==='journalist');
  if(p&&!p.delayed){p.due++;p.delayed=true;log(s,'Publicação adiada',`A rede de emissoras deslocou a atenção. Helena publicará no T${p.due}; uma nova proteção não adiará esta pauta.`,'positive');}
 }
 if(choice==='polarize'){apply(s,{chaos:13,exposure:7},region);heat(s,region,10);scheduleThreat(s,'journalist',region,'polarização pela rede de emissoras');}
 if(choice==='develop'){
  apply(s,{tech:10},region);const p=s.pending.find(p=>p.kind==='project');if(p)p.due=Math.max(s.turn+1,p.due-1);
 }
 if(choice==='deploy'){apply(s,{digital:region===2?22.5:18,chaos:16,exposure:8},region);a.suspendedUntil=s.turn+2;heat(s,region,12);scheduleThreat(s,'coalition',region,'implantação do sistema instável');}
 if(s.archetype==='oligarca'&&r.ally&&['extract','disrupt','polarize','deploy'].includes(choice))r.ally.loyalty=limit(r.ally.loyalty-15);
 recordDecision(s,option.name,`${r.name}: ${option.desc}`,{chaos:['disrupt','polarize','deploy'].includes(choice)?16:0,money:choice==='extract'?2:0});
 log(s,option.name,`${r.name} · ${businesses[a.type].name}. ${option.desc}`,'positive');revealSecrets(s);outcome(s);return true;
}
export function rushBlocked(s,id){const p=s.pending.find(p=>p.id===id&&p.kind==='project');return actionBlocked(s)||(!p?'Projeto indisponível':p.rushed?'Já antecipado':p.due<=s.turn+1?'Projeto já chega no próximo trimestre':s.money<1?'Patrimônio insuficiente':'');}
export function rushProject(s,id){
 if(rushBlocked(s,id))return false;const p=s.pending.find(p=>p.id===id);p.rushed=true;p.due=s.turn+1;p.effect={tech:24,chaos:12};s.money--;s.actions++;s.exposure+=8;s.stats.projectsRushed++;heat(s,p.region,8);
 scheduleThreat(s,'journalist',p.region,'lançamento antecipado de pesquisa');
 log(s,'Lançamento antecipado autorizado',`Projeto em ${s.regions[p.region].name} chega no T${p.due}. 25% de risco de falha: apenas +8 tecnologia e +10 exposição adicional.`,'danger');outcome(s);return true;
}
export function allyBlocked(s,region){return actionBlocked(s)||(region!==s.territory?'Esta região está fora da campanha':s.archetype!=='oligarca'||!s.regions[region]?.ally?'Nenhum aliado disponível':s.turnUsed.includes('ally:'+region)?'Aliado já atendido neste trimestre':s.money<1?'Patrimônio insuficiente':'');}
export function supportAlly(s,region){
 if(allyBlocked(s,region))return false;const a=s.regions[region].ally;s.money--;s.actions++;s.turnUsed.push('ally:'+region);a.loyalty=limit(a.loyalty+30);a.demandDue=s.turn+4;
 log(s,'Compromisso com aliado renovado',`${s.regions[region].name}. −$1B; +30 lealdade. Próxima exigência no T${a.demandDue}.`,'positive');outcome(s);return true;
}
export function responseOptions(s,p){
 const result=p.opponent==='journalist'?
  [{id:'contest',name:'Contestar a apuração',cost:1.8,desc:'−8 exposição; reduz a gravidade da publicação pela metade, sem impedir a reportagem.'},
   {id:'divest',name:'Abandonar o negócio',cost:0,desc:'Vende o negócio por $1B, cancela a pauta, reduz 3 de caos e perde sua receita. A jornalista mantém interesse no grupo.'}]:
  [{id:'negotiate',name:'Aceitar supervisão',cost:2.2,desc:'Cancela a medida; −4 caos e −5 controle local. Preserva o negócio.'},
   {id:'ally',name:'Mobilizar aliado',cost:.8,desc:'Cancela a medida usando 25 de lealdade do aliado regional.'}];
 if(p.opponent==='coalition'&&p.crisis)result.unshift({id:'reform',name:crisisResponses[p.crisis],cost:1,desc:`Cancela a medida e preserva o negócio; −20% ${labels[p.crisis]} e −5% caos.`});
 return [...result,{id:'accept',name:p.opponent==='journalist'?'Aceitar a publicação':'Aceitar as sanções',cost:0,desc:'Mantém seus recursos agora. A consequência será aplicada no prazo anunciado. Não consome ação.'}];
}
export function responseBlocked(s,p,choice){
 if(s.status!=='playing'||!p||p.kind!=='response'||p.region!==s.territory)return 'Resposta indisponível';
 if(p.handled)return 'Decisão já registrada';
 const o=responseOptions(s,p).find(o=>o.id===choice);if(!o)return 'Escolha inválida';
 if(choice!=='accept'&&s.actions>=3)return 'Sem ações neste trimestre';
 if(s.money<o.cost)return 'Patrimônio insuficiente';
 if(choice==='divest'&&!s.regions[p.region].asset)return 'Sem negócio nesta região';
 if(choice==='ally'&&(s.archetype!=='oligarca'||!s.regions[p.region].ally||s.regions[p.region].ally.loyalty<40))return 'Exige aliado regional com 40 de lealdade';
 return '';
}
export function respond(s,id,choice){
 const p=s.pending.find(p=>p.id===id);if(responseBlocked(s,p,choice))return false;
 const o=responseOptions(s,p).find(o=>o.id===choice),r=s.regions[p.region];s.money-=o.cost;if(choice!=='accept')s.actions++;p.handled=choice;
 if(choice==='contest'){s.exposure-=8;p.contested=true;}
 if(choice==='divest'){r.asset=null;s.money++;s.chaos=Math.max(0,s.chaos-3);}
 if(choice==='negotiate'){s.chaos=Math.max(0,s.chaos-4);r.control=Math.max(0,r.control-5);}
 if(choice==='ally')r.ally.loyalty-=25;
 if(choice==='reform')apply(s,{[p.crisis]:-20,chaos:-5},p.region);
 if(['divest','negotiate','ally','reform'].includes(choice)){s.pending=s.pending.filter(x=>x.id!==id);s.stats.threatsResolved++;}
 s.rivals[p.opponent].lastMove=choice==='accept'?`Você aceitou a consequência no T${p.due}.`:choice==='contest'?`Helena revisa a apuração. Publicação reduzida mantida para T${p.due}.`:`Medida contida em ${r.name} por ${o.name.toLowerCase()}.`;
 recordDecision(s,o.name,`${opponents[p.opponent].name}: ${o.desc}`,{money:-o.cost,chaos:-4});
 log(s,o.name,`${opponents[p.opponent].name} · ${r.name}. ${o.desc}`,'neutral');outcome(s);return true;
}
export function phase(s){return s.world.alert>=60?'Cerco internacional':s.world.alert>=25?'Adversários mobilizados':'Monitoramento inicial';}
export function forecast(s,turn=s.turn+1){
 const assetIncome=s.regions.reduce((n,r)=>n+(r.asset&&r.asset.suspendedUntil<=turn?businesses[r.asset.type].income:0),0);
 const sanctions=s.world.alert>=40?s.world.alert*.008:0;
 return {revenue:+(s.income+assetIncome).toFixed(2),upkeep:+(.7+turn*.055+(s.territory===2&&s.regions[2].digital>=40?.15:0)).toFixed(2),sanctions:+sanctions.toFixed(2)};
}
export function endTurn(s){
 if(s.status!=='playing'||s.dilemma)return false;
 const before={money:s.money,chaos:s.chaos,exposure:s.exposure,investigation:s.world.investigation};
 s.turn++;s.actions=0;s.turnUsed=[];
 const f=forecast(s,s.turn);s.money+=f.revenue-f.upkeep-f.sanctions;s.exposure=Math.max(0,s.exposure-1-s.media*.025);
 const recovery=1+s.world.alert*.01;s.chaos=Math.max(0,s.chaos-recovery);
 for(const r of s.regions){r.heat=Math.max(0,r.heat-3);r.control=Math.max(0,r.control-1);r.influence=Math.max(0,r.influence-1);r.stability=limit(r.stability+2);}
 for(const k of Object.keys(s.world.adaptation))s.world.adaptation[k]=Math.max(0,s.world.adaptation[k]-1);
 log(s,'Fechamento financeiro',`Receita +$${f.revenue.toFixed(1)}B; manutenção −$${f.upkeep.toFixed(1)}B; sanções −$${f.sanctions.toFixed(1)}B. Recuperação do mundo: −${recovery.toFixed(1)}% caos.`);
 const due=s.pending.filter(p=>p.due<=s.turn);s.pending=s.pending.filter(p=>p.due>s.turn);
 for(const p of due.filter(p=>p.kind==='response')){
  s.rivals[p.opponent].cooldownUntil=s.turn+2;
  const r=s.regions[p.region];let e=threatPreview(s,p);if(p.contested)e=Object.fromEntries(Object.entries(e).map(([k,v])=>[k,+(v*.5).toFixed(1)]));apply(s,e,p.region);
  let loss='';if(p.opponent==='coalition'&&r.asset){if(r.business==='energy'&&r.crisisUntil>=s.turn){r.asset=null;loss=' A concessão de energia foi retirada.';}else{r.asset.suspendedUntil=s.turn+3;loss=' O negócio ficará suspenso por dois trimestres.';}}
  s.rivals[p.opponent].lastMove=`${p.opponent==='journalist'?'Reportagem publicada':'Sanções aprovadas'} em ${r.name}.${loss}`;
  log(s,opponents[p.opponent].name,`${s.rivals[p.opponent].lastMove} Origem: ${p.source} (T${p.originTurn}). ${describe(e)}`,'danger');
 }
 for(const p of due.filter(p=>p.kind!=='response')){
  const r=s.regions[p.region];let e=p.effect;
  if(p.kind==='project'&&p.rushed&&random(s)<.25){e={tech:8,exposure:10};log(s,'Falha no lançamento antecipado',`${r.name}. A revisão incompleta impediu o resultado esperado; não houve ganho de caos.`,'danger');}
  if(p.operation==='acquisition'){
   r.asset={type:r.business,lastUsed:0,suspendedUntil:0};e={...e};delete e.income;
   log(s,'Negócio adquirido',`${businesses[r.business].name} em ${r.name}. Agora você pode decidir como usar a empresa.`,'positive');
  }
  apply(s,e,p.region);
  if(p.operation==='campaign'&&s.archetype==='oligarca')r.ally=r.ally?{...r.ally,loyalty:limit(r.ally.loyalty+15)}:{loyalty:65,demandDue:s.turn+3};
  if(!r.completed.includes(p.operation))r.completed.push(p.operation);
  recordDecision(s,operations.find(o=>o.id===p.operation).name,`Decisão do T${p.originTurn}, concluída no T${s.turn}. ${p.operation==='acquisition'?'Negócio adquirido: '+businesses[r.business].name:describe(e)}`,e,p.originTurn);
  log(s,`${operations.find(o=>o.id===p.operation).name} · resultado`,`${r.name} · decisão do T${p.originTurn}. ${describe(e)}`,'positive');
 }
 for(let i=0;i<s.regions.length;i++){
  const r=s.regions[i];if(r.ally){r.ally.loyalty=Math.max(0,r.ally.loyalty-(i===0?4:3));
   if(r.ally.demandDue<=s.turn){r.ally.loyalty=Math.max(0,r.ally.loyalty-25);r.ally.demandDue=s.turn+3;log(s,'Aliado cobra apoio',`${r.name}: a exigência não foi atendida. −25 lealdade.`,'danger');}
   if(r.ally.loyalty<20){r.ally=null;r.control=Math.max(0,r.control-15);log(s,'Aliado rompe com o grupo',`${r.name}: perda de proteção e −15 controle político.`,'danger');scheduleThreat(s,'journalist',i,'rompimento do aliado');}
  }
 }
 const hotspot=s.territory;
 if(s.exposure>=30&&!s.pending.some(p=>p.opponent==='journalist'))scheduleThreat(s,'journalist',hotspot,'vínculos acumulados do grupo');
 if((s.regions[hotspot].control>=40||s.regions[hotspot].heat>=35||dominantCrisis(s))&&!s.pending.some(p=>p.opponent==='coalition'))scheduleThreat(s,'coalition',hotspot,dominantCrisis(s)?'avanço de '+labels[dominantCrisis(s)]:'concentração de poder regional');
 if(s.world.alert>=25)s.world.investigation+=.5+s.world.alert*.01;
 s.world.alert=Math.max(0,s.world.alert-1);
 revealSecrets(s);outcome(s);offerDilemma(s);
 s.report={turn:s.turn,before,after:{money:s.money,chaos:s.chaos,exposure:s.exposure,investigation:s.world.investigation},entries:s.history.filter(h=>h.turn===s.turn),phase:phase(s),brief:turnBrief(s)};return true;
}

export const crisisResponses={control:'Aceitar fiscalização eleitoral',digital:'Descentralizar sistemas essenciais',sanitary:'Financiar atendimento emergencial'};
export function dominantCrisis(s){const r=s.regions[s.territory];return ['control','digital','sanitary'].filter(k=>r[k]>=40).sort((a,b)=>r[b]-r[a])[0]||null;}
const dilemmaStories={
 control:[['Prefeitos recusam o acordo','Prefeitos exigem garantias de autonomia antes de apoiar o grupo. Ceder preserva relações; impor o acordo expõe sua interferência.'],['Parlamento dividido','A oposição consegue bloquear votações. Você pode abrir mão de parte do comando ou sustentar o confronto publicamente.'],['Ruptura institucional','Governos locais deixam de reconhecer decisões da administração. Uma negociação pode reduzir a concentração de poder; insistir agrava a disputa.']],
 digital:[['Pagamentos interrompidos','Comerciantes relatam transações recusadas. A equipe pede recursos para redundância; manter a centralização preserva seu plano, mas torna as falhas públicas.'],['Bancos sem conciliação','Bancos suspendem operações enquanto verificam registros inconsistentes. Dividir a infraestrutura reduz sua fragilidade; manter os sistemas como estão amplia a investigação.'],['Serviços essenciais offline','As interrupções chegam ao transporte e aos serviços públicos. Uma recuperação coordenada exige recuar; preservar a dependência aprofunda o risco de colapso.']],
 sanitary:[['Hospitais sem capacidade','Filas crescem após a redução da assistência. Financiar atendimento alivia a pressão; preservar o caixa mantém a rede sobrecarregada e expõe o grupo.'],['Equipes pedem intervenção','Equipes de saúde exigem apoio para manter o atendimento. Você pode financiar a resposta ou assumir o desgaste de prolongar a crise.'],['Emergência sanitária','Uma onda epidêmica encontra hospitais saturados. Reforçar a resposta pode conter a deterioração; manter os cortes agrava a crise e atrai investigação.']]
};
export function offerDilemma(s){
 if(s.status!=='playing'||s.dilemma)return;
 const r=s.regions[s.territory];
 for(let stage=0;stage<2;stage++){const id='regional:'+s.territory+':'+stage;if(s.chaos>=[30,65][stage]&&!s.dilemmasSeen.includes(id)){const event=regionalEvents[s.territory][stage];s.dilemma={...event,id,stage,regional:true,turn:s.turn,value:r[event.axis]};s.dilemmasSeen.push(id);log(s,event.title,event.text+' Origem: caos regional em '+Math.round(s.chaos)+'%.','danger');return;}}
 for(let stage=0;stage<3;stage++)for(const axis of ['control','digital','sanitary']){
  const id=axis+':'+stage;if(r[axis]<[30,55,80][stage]||s.chaos<[20,40,60][stage]||s.dilemmasSeen.includes(id))continue;
  const [title,text]=dilemmaStories[axis][stage];s.dilemma={id,axis,stage,title,text,turn:s.turn,value:r[axis]};s.dilemmasSeen.push(id);
  log(s,title,`${text} Origem: ${labels[axis]} em ${Math.round(r[axis])}%, caos em ${Math.round(s.chaos)}%. Uma decisão é necessária antes do próximo fechamento.`,'danger');return;
 }
}
export function dilemmaOptions(s){const d=s.dilemma;if(!d)return [];if(d.regional)return regionalEvents[s.territory][d.stage].options;return [
 {id:'fund',name:d.axis==='control'?'Negociar garantias':'Financiar resposta',cost:1.2,effect:{[d.axis]:-12,chaos:-4,exposure:-5}},
 {id:'persist',name:'Manter o plano',cost:0,effect:{exposure:6,investigation:2}},
 {id:'trade',...({control:{name:'Ceder apoio dos contatos',cost:0,effect:{influence:-15,control:-6,exposure:-10}},digital:{name:'Retirar equipes de pesquisa',cost:0,effect:{tech:-15,digital:-16,exposure:-5}},sanitary:{name:'Comprometer receita com atendimento',cost:0,effect:{income:-.3,sanitary:-18,exposure:-5}}}[d.axis])}
 ];}
export function resolveDilemma(s,id,choice){
 const d=s.dilemma,o=dilemmaOptions(s).find(o=>o.id===choice);if(s.status!=='playing'||!d||d.id!==id||!o||dilemmaBlocked(s,choice))return false;
 s.money-=o.cost;apply(s,o.effect,s.territory);log(s,d.title,`${o.name}: −$${o.cost}B. ${describe(o.effect)}. Decisão sobre o dilema do T${d.turn}.`);recordDecision(s,d.title,o.name+'. '+describe(o.effect),o.effect);s.dilemma=null;outcome(s);return true;
}
export function recoveryAvailable(s){return s.status==='playing'&&!s.recoveryUsed&&(s.money<=4||s.exposure>=75||s.world.investigation>=75);}
export function recoveryOptions(s){return [
 {id:'sell',name:'Vender o negócio em emergência',desc:'Recebe $5B, reduz 10% de caos e 10% de exposição. Perde o negócio e sua receita.'},
 {id:'concede',name:'Negociar proteção institucional',desc:'Recebe $3B; reduz 25% de investigação, 10% de exposição e 10% de caos. Cede 20% de controle político e 20% de influência local; cancela a medida atual do Pacto.'}
 ];}
export function recoveryBlocked(s,id){return !recoveryAvailable(s)?'Saída de emergência indisponível':id==='sell'?!s.regions[s.territory].asset?'Sem negócio para vender':'':id==='concede'?(s.regions[s.territory].control<20||s.regions[s.territory].influence<20)?'Exige 20% de controle e influência local':'':'Escolha inválida';}
export function recover(s,id){
 if(recoveryBlocked(s,id))return false;const r=s.regions[s.territory];s.recoveryUsed=true;
 if(id==='sell'){r.asset=null;apply(s,{money:5,chaos:-10,exposure:-10},s.territory);}
 else{r.influence-=20;apply(s,{money:3,control:-20,chaos:-10,exposure:-10,investigation:-25},s.territory);const p=s.pending.find(p=>p.opponent==='coalition');if(p){s.pending=s.pending.filter(x=>x!==p);s.stats.threatsResolved++;s.rivals.coalition.lastMove='A medida foi cancelada após concessões institucionais.';}}
 recordDecision(s,'Saída de emergência',recoveryOptions(s).find(o=>o.id===id).desc,{money:5,chaos:-10});
 log(s,'Saída de emergência',recoveryOptions(s).find(o=>o.id===id).desc+' O recurso de emergência desta run foi utilizado.','positive');outcome(s);return true;
}

const regionalEvents=[
 [
  {axis:'control',title:'Governadores pedem uma contrapartida',text:'Com a crise avançando, governadores condicionam seu apoio a uma transferência de recursos ou a uma promessa pública.',options:[{id:'fund',name:'Financiar o acordo',cost:1.5,effect:{influence:12,control:4}},{id:'persist',name:'Prometer sem transferir recursos',cost:0,effect:{exposure:7,control:-4}}]},
  {axis:'control',title:'Disputa pela concessão energética',text:'A companhia regional se torna o centro de uma disputa sobre serviços essenciais. Mesmo fora do seu grupo, seu fornecimento afeta as operações locais.',options:[{id:'fund',name:'Financiar a continuidade dos serviços',cost:1.5,effect:{chaos:-6,exposure:-8}},{id:'persist',name:'Apoiar publicamente a disputa',cost:0,effect:{control:6,exposure:9}}]}
 ],
 [
  {axis:'control',title:'Audiência sobre os vínculos do grupo',text:'Uma comissão convoca representantes do grupo. A presença regional permite negociar apoio; a ausência deixa a investigação avançar.',options:[{id:'fund',name:'Mobilizar contatos na comissão',cost:0,effect:{influence:-12,investigation:-8}},{id:'persist',name:'Não comparecer à audiência',cost:0,effect:{investigation:5}}]},
  {axis:'digital',title:'Exigência de acesso aos registros',text:'Órgãos de fiscalização exigem uma revisão dos registros digitais utilizados pelo grupo. Abrir o processo compromete projetos; resistir amplia o caso.',options:[{id:'fund',name:'Suspender projetos para a revisão',cost:0,effect:{tech:-12,investigation:-10,digital:-8}},{id:'persist',name:'Contestar o acesso',cost:0,effect:{exposure:5,investigation:4}}]}
 ],
 [
  {axis:'digital',title:'Comerciantes exigem pagamentos alternativos',text:'A dependência de plataformas digitais transforma interrupções em perdas locais. Uma alternativa de pagamento exige parte da receita futura.',options:[{id:'fund',name:'Financiar uma rede alternativa',cost:0,effect:{income:-.2,digital:-12,exposure:-5}},{id:'persist',name:'Manter a centralização',cost:0,effect:{digital:5,exposure:6}}]},
  {axis:'digital',title:'Operadoras pedem capacidade de reserva',text:'Operadoras buscam acesso à capacidade computacional do grupo para manter os serviços. Ceder capacidade atrasa seus projetos; negar o pedido torna a dependência mais visível.',options:[{id:'fund',name:'Ceder capacidade de pesquisa',cost:0,effect:{tech:-15,digital:-10}},{id:'persist',name:'Reservar capacidade para o grupo',cost:0,effect:{exposure:8,investigation:2}}]}
 ]
];
export function dilemmaBlocked(s,choice){
 const o=dilemmaOptions(s).find(o=>o.id===choice);if(s.status!=='playing'||!o)return 'Decisão indisponível';if(s.money<o.cost)return 'Patrimônio insuficiente';
 for(const key of ['tech','income','influence']){const value=key==='influence'?s.regions[s.territory].influence:s[key];if(o.effect[key]<0&&value < -o.effect[key]+(key==='income'?.5:0))return key==='income'?'Preserve ao menos $0,5B de receita-base':`Exige ${-o.effect[key]}% de ${labels[key]}`;}
 return '';
}
function recordDecision(s,title,text,effect={},turn=s.turn){
 const score=Object.entries(effect).reduce((n,[k,v])=>n+Math.abs(v)*(['chaos','control','digital','sanitary'].includes(k)?1:['money','income'].includes(k)?3:.3),0);
 s.decisions.push({title,text,turn,score:score||10});
}
export function runSummary(s){
 const r=s.regions[s.territory],chosen=[...(s.decisions||[])].sort((a,b)=>b.score-a.score||a.turn-b.turn);const seen=new Set();
 const decisions=chosen.filter(d=>{if(seen.has(d.title))return false;seen.add(d.title);return true;}).slice(0,3).sort((a,b)=>a.turn-b.turn);
 return {decisions,business:r.asset?`${businesses[r.asset.type].name}: ${r.asset.suspendedUntil>s.turn?'receita suspensa no encerramento':'sob controle do grupo no encerramento'}.`:r.completed.includes('acquisition')?'O grupo encerrou a run sem o negócio adquirido; a venda ou perda da concessão retirou sua receita.':'Nenhum negócio foi adquirido nesta campanha.',ally:r.ally?`O aliado permaneceu na rede com ${Math.round(r.ally.loyalty)}% de lealdade.`:s.archetype==='oligarca'?'A campanha terminou sem aliado regional.':'A Visionária conduziu a campanha sem uma rede de aliados políticos.',next:s.status==='won'?'Experimente outro negócio regional ou uma crise diferente para comparar as respostas do mundo.':s.money<=0?'Na próxima run, compare a receita com manutenção e sanções antes de financiar outra crise.':s.exposure>=100?'Na próxima run, reserve recursos para exposição e examine os prazos das reportagens.':'Na próxima run, considere recuar diante do Pacto antes de acumular novas investigações.'};
}
export function turnBrief(s){
 const entries=s.history.filter(h=>h.turn===s.turn);
 return {consequences:entries.filter(h=>h.title.includes('· resultado')||Object.values(opponents).some(o=>o.name===h.title)||h.title.includes('rompe')).slice(0,4),
 threats:s.pending.filter(p=>p.kind==='response').map(p=>({name:opponents[p.opponent].name,due:p.due,source:p.source,effect:describe(p.contested?Object.fromEntries(Object.entries(threatPreview(s,p)).map(([k,v])=>[k,+(v*.5).toFixed(1)])):threatPreview(s,p)),decision:p.handled||null})),
 opportunities:[...(s.dilemma?[s.dilemma.title+': escolha necessária antes do próximo trimestre.']:[]),...(recoveryAvailable(s)?['Uma saída de emergência está disponível.']:[]),...entries.filter(h=>['Negócio adquirido','Negociação identificada'].includes(h.title)).map(h=>h.text)]};
}
