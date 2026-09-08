export type Point={x:number,z:number};
export type Player=Point&{id:string,team:'home'|'away',vx:number,vz:number};
export type SimFrame={t:number,players:Player[],ball:{x:number,y:number,z:number},phase:string,gain:number,separations:Record<string,number>,target:string,carrier:string};
export type Play={id:string,name:string,kind:'run'|'pass',tag:string,note:string,release:number,primary:string,routes:Record<string,number[][]>};
export const YARD=.9144,LOS=12;
const routes=(r:Record<string,number[][]>)=>r;
export const PLAYS:Play[]=[
 {id:'mesh',name:'Mesh Cross',kind:'pass',tag:'Shallow crossers',note:'Two shallow crossers create traffic against man coverage. Read the near crosser, then the opposite crosser. The post clears space above them.',release:2.65,primary:'H',routes:routes({X:[[-19,0],[-18,15],[-4,32]],H:[[-10,-1],[-8,5],[18,6]],Y:[[7,-1],[4,6],[-19,5]],Z:[[19,0],[18,12],[23,27]],RB:[[-2.4,-6],[-7,-3],[-16,1]]})},
 {id:'zone',name:'Inside Zone',kind:'run',tag:'Read the A gap',note:'The line steps together to the right. The back presses the play-side gap, then cuts vertically behind the double team. Linebackers fit the open gaps.',release:1.05,primary:'RB',routes:routes({X:[[-19,0],[-19,7],[-16,9]],H:[[-10,-1],[-7,5],[-5,8]],Y:[[7,-1],[5,4],[4,7]],Z:[[19,0],[19,8],[16,10]],RB:[[-2.4,-6],[1.6,-1],[2.3,8],[-1,24]]})},
 {id:'slant',name:'Slant / Flat',kind:'pass',tag:'Quick game',note:'The outside slant and inside flat stretch an underneath defender in two directions. The quarterback releases quickly before the pass rush arrives.',release:1.65,primary:'X',routes:routes({X:[[-19,0],[-18,3],[-6,14]],H:[[-10,-1],[-16,1],[-24,2]],Y:[[7,-1],[15,1],[23,2]],Z:[[19,0],[18,3],[6,14]],RB:[[-2.4,-6],[-2,-2],[1,3]]})},
 {id:'verts',name:'Four Verticals',kind:'pass',tag:'Attack the seams',note:'Four vertical routes stretch the deep coverage. Against Cover 3, the two seams challenge the middle safety. The running back provides a checkdown.',release:3.25,primary:'Y',routes:routes({X:[[-19,0],[-20,40]],H:[[-10,-1],[-7,10],[-7,39]],Y:[[7,-1],[7,39]],Z:[[19,0],[20,40]],RB:[[-2.4,-6],[-5,-1],[-4,5]]})},
 {id:'levels',name:'Levels Dig',kind:'pass',tag:'Layered in-breakers',note:'An underneath route and a deeper dig put the hook defenders in conflict. The outside vertical occupies the safety. Read from the deeper dig to the short outlet.',release:2.9,primary:'H',routes:routes({X:[[-19,0],[-18,16],[9,16]],H:[[-10,-1],[-10,9],[13,9]],Y:[[7,-1],[6,4],[-8,4]],Z:[[19,0],[20,37]],RB:[[-2.4,-6],[-11,-1],[-16,2]]})},
 {id:'flood',name:'Boot Flood',kind:'pass',tag:'Three-level stretch',note:'The quarterback rolls right after a run fake. A deep route, an intermediate crossing route, and a flat route stretch the sideline coverage at three depths.',release:3.1,primary:'Y',routes:routes({X:[[-19,0],[-16,12],[18,19]],H:[[-10,-1],[-7,9],[17,13]],Y:[[7,-1],[10,10],[22,18]],Z:[[19,0],[22,37]],RB:[[-2.4,-6],[1,-2],[18,1]]})},
 {id:'power',name:'Power Right',kind:'run',tag:'Pulling guard',note:'The left guard pulls behind the line and leads through the right-side gap. The back follows the puller while the receivers stalk-block outside defenders.',release:1.1,primary:'RB',routes:routes({X:[[-19,0],[-18,7]],H:[[-10,-1],[-6,5]],Y:[[7,-1],[7,4],[8,8]],Z:[[19,0],[18,8]],RB:[[-2.4,-6],[3,-2],[5,4],[8,20]]})},
 {id:'screen',name:'RB Slip Screen',kind:'pass',tag:'Invite the rush',note:'The back delays before slipping left. The line briefly sets in pass protection, then releases toward the screen. An aggressive rush creates space behind it.',release:2.7,primary:'RB',routes:routes({X:[[-19,0],[-19,30]],H:[[-10,-1],[-8,18]],Y:[[7,-1],[9,25]],Z:[[19,0],[20,32]],RB:[[-2.4,-6],[-3,-5],[-12,-2],[-17,17]]})}
];
const O=[['C',0,0],['LG',-1.4,0],['RG',1.4,0],['LT',-2.8,0],['RT',2.8,0],['QB',0,-5],['RB',-2.4,-6],['X',-19,0],['H',-10,-1],['Y',7,-1],['Z',19,0]] as [string,number,number][];
const D=[['DE1',-4,1],['DT1',-1.4,1],['DT2',1.4,1],['DE2',4,1],['W',-6,5],['M',0,5],['S',6,5],['CB1',-19,6],['CB2',19,6],['FS',-8,14],['SS',8,14]] as [string,number,number][];
const eligible=['X','H','Y','Z','RB'];
const dist=(a:Point,b:Point)=>Math.hypot(a.x-b.x,a.z-b.z);
const pt=(a:number[]):Point=>({x:a[0]*YARD,z:LOS-a[1]*YARD});
export function plannedPosition(play:Play,id:string,t:number):Point{
 if(id==='QB'){if(play.kind==='run')return{x:1.1,z:LOS+2.0};if(play.id==='flood')return{x:Math.min(7,Math.max(0,t-1)*3),z:LOS+4};return{x:0,z:LOS+Math.min(6.4,4.57+t*.8)}}
 const r=play.routes[id];if(!r)return{x:0,z:LOS};
 let travel=Math.max(0,t-(id==='RB'&&play.id==='screen'?.9:0));travel=(travel-.28*(1-Math.exp(-travel/.28)))*(id==='RB'?6.9:7.35);
 for(let i=1;i<r.length;i++){const a=pt(r[i-1]),b=pt(r[i]),l=dist(a,b);if(travel<=l){const f=travel/l;return{x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f}}travel-=l}return pt(r[r.length-1]);
}
function advance(p:Player,target:Point,dt:number,speed:number,accel=7){const dx=target.x-p.x,dz=target.z-p.z,len=Math.hypot(dx,dz);const desired=Math.min(speed,len/dt);let vx=len?dx/len*desired:0,vz=len?dz/len*desired:0;const dv=Math.hypot(vx-p.vx,vz-p.vz);const scale=Math.min(1,accel*dt/(dv||1));p.vx+=(vx-p.vx)*scale;p.vz+=(vz-p.vz)*scale;p.x+=p.vx*dt;p.z+=p.vz*dt;p.x=Math.max(-24.1,Math.min(24.1,p.x))}
export type Simulation={play:Play,coverage:string,seed:number,frames:SimFrame[],duration:number,outcome:string};
export function createSimulation(playId:string,coverage:string,seed=1924):Simulation{
 const play=PLAYS.find(p=>p.id===playId)||PLAYS[0];let state=seed>>>0;const rand=()=>{state=(state*1664525+1013904223)>>>0;return state/4294967296};
 const players:Player[]=[...O.map(([id,x,d])=>({id,team:'home' as const,...pt([x,d]),vx:0,vz:0})),...D.map(([id,x,d])=>({id,team:'away' as const,...pt([x,d]),vx:0,vz:0}))];
 const by=(id:string)=>players.find(p=>p.id===id)!;const defense=players.filter(p=>p.team==='away');const reaction=.14+rand()*.18;const skill=.93+rand()*.12;
 const frames:SimFrame[]=[];let target='',carrier='QB',phase='Pre-snap',released=false,air=false,completed=false,ended=false,flightStart=0,flightEnd=0,finish=9,outcome='',ball={x:0,y:.4,z:LOS},from={...ball},to={...ball};
 const nearest=(p:Point)=>Math.min(...defense.map(d=>dist(d,p)));
 for(let n=0;n<=540;n++){
  const t=n/60,dt=1/60;
  if(t>0&&!ended){
   for(const p of players.filter(p=>p.team==='home')){
    let dest:Point;
    if(eligible.includes(p.id))dest=plannedPosition(play,p.id,t);
    else if(p.id==='QB')dest=plannedPosition(play,'QB',t);
    else{const base=O.find(o=>o[0]===p.id)!;dest={x:base[1]*YARD,z:LOS+(play.kind==='run'?-Math.min(t*.8,3):Math.min(t*.8,2))};if(play.kind==='run')dest.x+=Math.min(1.5,t*.65);if(play.id==='power'&&p.id==='LG')dest={x:Math.min(4.3,-1.28+t*3),z:LOS+(t<1.2?1.6:-Math.min(4,(t-1.2)*2))};if(play.id==='screen'&&t>1.4)dest={x:base[1]*YARD-(t-1.4)*3,z:LOS-(t-1.4)*1.4}}
    if(completed&&p.id===carrier)dest={x:p.x*.98,z:p.z-8};
    advance(p,dest,dt,completed&&p.id===carrier?6.75:p.id==='QB'?4.8:eligible.includes(p.id)?8.2:4.5);
   }
   for(const p of defense){let dest:Point={x:p.x,z:p.z};const r=t-reaction;
    if(r>0){
     if(completed||play.kind==='run'&&t>1.2){const runner=by(carrier==='QB'?'RB':carrier);dest={x:runner.x+runner.vx*.22,z:runner.z+runner.vz*.22}}
     else if(p.id.startsWith('D')){const qb=by('QB');const lane=D.find(a=>a[0]===p.id)![1];const blocked=t<3.3&&play.id!=='screen';dest=blocked?{x:lane*.9,z:LOS+Math.min(1.1,t*.35)}:{x:qb.x+lane*.08,z:qb.z}}
     else if(coverage==='cover1'){const mark:Record<string,string>={CB1:'X',CB2:'Z',W:'H',S:'Y',M:'RB',SS:'Y'};if(p.id==='FS')dest={x:by(target||'Y').x*.55,z:Math.min(LOS-19,by(target||'Y').z-5)};else{const m=by(mark[p.id]);dest={x:m.x+(p.id==='CB1'?-.65:.65),z:m.z-.7}}}
     else{
      const anchors:Record<string,number[]>=coverage==='cover3'?{CB1:[-17,24],CB2:[17,24],FS:[0,27],SS:[12,8],W:[-12,7],M:[-2,10],S:[5,10]}:{CB1:[-20,5],CB2:[20,5],FS:[-12,25],SS:[12,25],W:[-10,10],M:[0,13],S:[10,10]};
      const a=pt(anchors[p.id]);const threat=eligible.map(id=>by(id)).sort((u,v)=>dist(u,a)-dist(v,a))[0];const blend=dist(threat,a)<13?.35:.08;dest={x:a.x*(1-blend)+threat.x*blend,z:a.z*(1-blend)+threat.z*blend};
      if(air&&t>flightStart+.28&&dist(p,to)<15)dest=to;
     }
     advance(p,dest,dt,(p.id.startsWith('D')?(completed?6.7:4.9):8.1)*skill,6.5);
    }
   }
   // Preserve body space among players instead of letting routes occupy one point.
   for(let i=0;i<players.length;i++)for(let j=i+1;j<players.length;j++){const a=players[i],b=players[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d>0&&d<.48){const push=(.48-d)*.22;a.x-=dx/d*push;a.z-=dz/d*push;b.x+=dx/d*push;b.z+=dz/d*push}}
   phase=t<.3?'Snap':play.kind==='run'?'Run action':'Reading coverage';
   if(play.kind==='run'&&t>=play.release&&!released){released=true;completed=true;carrier='RB';target='RB'}
   if(play.kind==='pass'&&t>=play.release&&!released){
    released=true;air=true;carrier='';phase='Pass airborne';
    target=nearest(by(play.primary))>1.35?play.primary:eligible.map(id=>({id,score:nearest(by(id))+(id===play.primary?1.4:0)-(id==='RB'&&play.id!=='screen'?1.0:0)-dist(by('QB'),by(id))*.045})).sort((a,b)=>b.score-a.score)[0].id;
    flightStart=t;const receiver=by(target),qb=by('QB');flightEnd=t+.3+dist(qb,receiver)/24;const lead={...receiver};for(let u=dt;u<=flightEnd-t;u+=dt)advance(lead,plannedPosition(play,target,t+u),dt,8.2);from={x:qb.x,y:1.65,z:qb.z};to={x:lead.x,y:1.3,z:lead.z};
   }
   if(air){phase='Pass airborne';const f=Math.min(1,(t-flightStart)/(flightEnd-flightStart));ball={x:from.x+(to.x-from.x)*f,z:from.z+(to.z-from.z)*f,y:from.y+(to.y-from.y)*f+Math.sin(f*Math.PI)*(2+dist(from,to)*.07)};
    if(f>=1){air=false;const r=by(target);const cover=nearest(r);if(dist(r,to)<2.8&&(cover>1||rand()>.38)){completed=true;carrier=target;phase='After catch'}else{ended=true;finish=t;outcome='Incomplete pass';phase='Incomplete';ball.y=.15}}
   }else{const p=by(carrier||'QB');ball={x:p.x+.2,y:1.05,z:p.z-.25};if(t<.18){const f=t/.18;ball={x:0,y:.4+f*.6,z:LOS+(by('QB').z-LOS)*f}}}
   if(completed){phase=play.kind==='run'?'Ball carrier':'After catch';const r=by(carrier);const near=nearest(r);if(t>play.release+.55&&(near<.78||Math.abs(r.x)>23.9||r.z<-45.72)){ended=true;finish=t;const gain=(LOS-r.z)/YARD;outcome=r.z<-45.72?'Touchdown':Math.abs(r.x)>23.9?`Out of bounds · ${gain.toFixed(1)} yd`:`Tackled · ${gain.toFixed(1)} yd`;phase=outcome.split(' · ')[0]}}
  }
  const separations:Record<string,number>={};for(const id of eligible)separations[id]=nearest(by(id))/YARD;
  frames.push({t,players:players.map(p=>({...p})),ball:{...ball},phase:ended?outcome.split(' · ')[0]:phase,gain:outcome==='Incomplete pass'?0:(LOS-ball.z)/YARD,separations,target,carrier});
 }
 if(!outcome){const gain=frames[540].gain;outcome=`Whistle · ${gain.toFixed(1)} yd`;finish=9}
 const duration=Math.min(9,finish+.45);return{play,coverage,seed,frames,duration,outcome};
}
export function sampleFrame(sim:Simulation,t:number):SimFrame{const x=Math.max(0,Math.min(t,9))*60,i=Math.min(539,Math.floor(x)),a=sim.frames[i],b=sim.frames[i+1],f=x-i;return{...a,t,players:a.players.map((p,j)=>({...p,x:p.x+(b.players[j].x-p.x)*f,z:p.z+(b.players[j].z-p.z)*f})),ball:{x:a.ball.x+(b.ball.x-a.ball.x)*f,y:a.ball.y+(b.ball.y-a.ball.y)*f,z:a.ball.z+(b.ball.z-a.ball.z)*f},gain:a.gain+(b.gain-a.gain)*f}}
