import test from 'node:test';
import assert from 'node:assert/strict';

test('tutorial permite navegar, pular, lembrar a conclusão e repetir pela ajuda',async()=>{
 // Minimal DOM double tests lifecycle and storage, not browser layout.
 const original=Object.fromEntries(['document','window','localStorage','requestAnimationFrame','cancelAnimationFrame'].map(k=>[k,globalThis[k]]));
 const storage=new Map(),listeners=new Set();let active=null,restoredFocus=0;
 const target={getBoundingClientRect:()=>({left:30,top:100,bottom:200,width:400,height:100}),scrollIntoView(){}};
 const makeElement=()=>({style:{},nodes:new Map(),innerHTML:'',setAttribute(){},
  querySelector(selector){if(!this.nodes.has(selector))this.nodes.set(selector,{style:{},focus(){},getBoundingClientRect:()=>({width:400,height:260})});return this.nodes.get(selector);},
  showModal(){},close(){},remove(){active=null;},addEventListener(type,callback){this[type]=callback;}});
 globalThis.document={activeElement:{focus(){restoredFocus++;}},querySelector:s=>s==='#tutorial'?active:target,createElement:makeElement,body:{append(el){active=el;}}};
 globalThis.window={scrollY:70,innerWidth:1024,innerHeight:768,scrollTo(){},addEventListener:t=>listeners.add(t),removeEventListener:t=>listeners.delete(t)};
 globalThis.localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
 globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
 try{
  const {needsTutorial,startTutorial}=await import('./dist/tutorial.js');
  assert.equal(needsTutorial(),true);startTutorial();const first=active;
  assert.match(active.innerHTML,/1 \/ 9/);startTutorial();assert.equal(active,first);
  active.querySelector('#next-step').onclick();assert.match(active.innerHTML,/2 \/ 9/);
  active.querySelector('#previous-step').onclick();assert.match(active.innerHTML,/1 \/ 9/);
  active.querySelector('#skip-tutorial').onclick();assert.equal(active,null);assert.equal(needsTutorial(),false);
  assert.equal(storage.get('ba-regional-tutorial-done'),'1');assert.equal(listeners.size,0);assert.equal(restoredFocus,1);
  const reloaded=await import('./dist/tutorial.js?reload');assert.equal(reloaded.needsTutorial(),false);
  reloaded.startTutorial();for(let i=0;i<9;i++)active.querySelector('#next-step').onclick();
  assert.equal(active,null);assert.equal(listeners.size,0);
 }finally{for(const[k,v]of Object.entries(original))if(v===undefined)delete globalThis[k];else globalThis[k]=v;}
});
