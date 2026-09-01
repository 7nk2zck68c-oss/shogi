// SPDX-License-Identifier: GPL-3.0-only
// Single-thread YaneuraOu WASM bridge for the "勇者" difficulty.

let engine=null;
let engineReady=false;
let initPromise=null;
let initResolve=null;
let initReject=null;
let activeSearch=null;
let currentGame=null;

async function supportsSIMD(){
  try{
    const probe=new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,10,1,8,0,65,0,253,15,253,98,11]);
    await WebAssembly.instantiate(probe);
    return true;
  }catch{return false}
}

async function initialize(){
  if(engineReady)return;
  if(initPromise)return initPromise;
  initPromise=(async()=>{
    const variant=await supportsSIMD()?'sse42':'nosimd';
    const base=new URL(`./yaneuraou/${variant}/`,self.location.href);
    importScripts(new URL('yaneuraou.js',base).href);
    const name=variant==='sse42'?'YaneuraOu_sse42':'YaneuraOu_nosimd';
    const factory=self[name];
    if(typeof factory!=='function')throw new Error(`${name}を読み込めません`);
    engine=await factory({locateFile:path=>new URL(path,base).href});
    if(engine.ready)await engine.ready;
    engine.addMessageListener(handleLine);
    await new Promise((resolve,reject)=>{
      initResolve=resolve;
      initReject=reject;
      setTimeout(()=>reject(new Error('初期化がタイムアウトしました')),120000);
      engine.postMessage('usi');
    });
  })();
  try{await initPromise}catch(error){initPromise=null;throw error}
}

function handleLine(line){
  if(line==='usiok'){
    engine.postMessage('setoption name Threads value 1');
    engine.postMessage('setoption name USI_Hash value 32');
    engine.postMessage('setoption name USI_Ponder value false');
    engine.postMessage('setoption name PvInterval value 0');
    engine.postMessage('setoption name MinimumThinkingTime value 1000');
    engine.postMessage('isready');
    return;
  }
  if(line==='readyok'){
    engineReady=true;
    initResolve?.();
    initResolve=null;
    initReject=null;
    self.postMessage({type:'ready'});
    return;
  }
  if(line.startsWith('info ')&&activeSearch)activeSearch.info=line;
  if(line.startsWith('bestmove ')&&activeSearch){
    const current=activeSearch;
    activeSearch=null;
    self.postMessage({type:'bestmove',id:current.id,bestmove:line.split(/\s+/)[1]||null,info:current.info});
  }
}

self.onmessage=async event=>{
  const message=event.data||{};
  try{
    if(message.type==='init'){
      await initialize();
      self.postMessage({type:'ready'});
      return;
    }
    if(message.type==='search'){
      await initialize();
      if(activeSearch)throw new Error('前の探索が完了していません');
      if(currentGame!==message.gameId){
        engine.postMessage('usinewgame');
        currentGame=message.gameId;
      }
      activeSearch={id:message.id,info:''};
      engine.postMessage(`position sfen ${message.sfen}`);
      engine.postMessage(`go movetime ${Math.max(1000,Number(message.movetime)||1800)}`);
    }
  }catch(error){
    if(initReject){initReject(error);initReject=null}
    activeSearch=null;
    self.postMessage({type:'error',id:message.id||null,error:error?.message||String(error)});
  }
};
