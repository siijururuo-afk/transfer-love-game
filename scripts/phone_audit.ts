import assert from 'node:assert/strict';
import {renderToString} from 'react-dom/server';
import React from 'react';
import{PHONE_STEPS,PHONE_GROUPS,routeStep,streamAt,groupsFor,indexOfLocation}from'../src/utils/phoneStory';
import{ContentRenderer}from'../src/renderers';
import{globalBlocks}from'../src/utils/reading';
const covered=new Set(PHONE_STEPS.flatMap(e=>e.step.sourceIds));
for(const b of globalBlocks())assert(covered.has(b.sourceId),`missing source ${b.sourceId}`);
let transitions=0,rendered=0;
for(let i=0;i<PHONE_STEPS.length;i++){
 const e=PHONE_STEPS[i],g=PHONE_GROUPS[e.group];
 assert.equal(e.index,i);assert.equal(indexOfLocation(e.location),i);
 assert.equal(routeStep(e.step),e.app);assert(i>=g.start&&i<=g.end);
 assert(groupsFor(e.app,i).some(item=>item.id===e.group),'current clue must be reachable from its app');
 assert(groupsFor(e.app,i).every(item=>item.start<=i),'no future group may be unlocked');
 const stream=streamAt(i);assert.equal(stream.at(-1)?.sourceId,e.step.sourceId);
 assert(stream.every(s=>s.sceneKey===e.step.sceneKey||stream.length===1),'crossed stream boundary');
 for(const revealed of [false,true]){const html=renderToString(React.createElement(ContentRenderer,{step:e.step,stream,revealed}));assert(html.length>0);rendered++;}
 if(i&&PHONE_STEPS[i-1].group!==e.group){transitions++;assert.equal(g.start,i);assert.equal(PHONE_GROUPS[PHONE_STEPS[i-1].group].end,i-1);}
}
assert.equal(PHONE_GROUPS[0].start,0);assert.equal(PHONE_GROUPS.at(-1)?.end,PHONE_STEPS.length-1);
console.log(JSON.stringify({steps:PHONE_STEPS.length,sources:covered.size,groups:PHONE_GROUPS.length,notifications:transitions,rendered,apps:[...new Set(PHONE_STEPS.map(e=>e.app))],result:'PASS'}));
