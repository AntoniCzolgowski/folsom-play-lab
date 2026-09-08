import assert from 'node:assert/strict';
import {PLAYS,createSimulation,sampleFrame,LOS} from './simulation.ts';
let count=0;
for(const p of PLAYS)for(const c of ['cover1','cover2','cover3'])for(const seed of [1924,1925,1956]){
 const sim=createSimulation(p.id,c,seed);assert.equal(sim.frames.length,541);assert.ok(sim.duration>1&&sim.duration<=9);assert.ok(sim.outcome);
 const start=sim.frames[0];assert.equal(start.players.filter(x=>x.team==='home').length,11);assert.equal(start.players.filter(x=>x.team==='away').length,11);assert.equal(start.players.filter(x=>x.team==='home'&&Math.abs(x.z-LOS)<.01).length,7);
 for(const f of sim.frames){assert.ok(Number.isFinite(f.gain));assert.equal(new Set(f.players.map(p=>p.id)).size,22);for(const p of f.players){assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.z));assert.ok(Math.abs(p.x)<=24.6)}assert.ok(f.ball.y>=0&&f.ball.y<20);assert.ok(Object.values(f.separations).every(x=>Number.isFinite(x)&&x>=0));}
 const a=sampleFrame(sim,1.25),b=sampleFrame(sim,1.25);assert.deepEqual(a,b);assert.equal(a.t,1.25);assert.ok(['X','H','Y','Z','RB'].includes(sim.frames.at(-1)!.target));
 const repeat=createSimulation(p.id,c,seed);assert.equal(repeat.outcome,sim.outcome);assert.deepEqual(repeat.frames[150],sim.frames[150]);count++;
}
const man=createSimulation('mesh','cover1'),zone=createSimulation('mesh','cover3');assert.notDeepEqual(man.frames[120].players,zone.frames[120].players);
console.log(`PASS: ${count} complete play/coverage/seed combinations; 22-player formations, seven on line, finite trajectories, bounds, replay determinism and distinct coverage reactions.`);
