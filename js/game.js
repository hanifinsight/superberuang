import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount=document.querySelector('#game'),scene=new THREE.Scene();
scene.background=new THREE.Color(0x9bd7ed);scene.fog=new THREE.Fog(0x9bd7ed,32,88);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.35));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xeaf8ff,0x607b43,2.0));const sun=new THREE.DirectionalLight(0xfff0d1,2.1);sun.position.set(-12,20,10);scene.add(sun);
const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.92});
const textureLoader=new THREE.TextureLoader();
function loadTexture(file,rx=1,ry=1){
 const tex=textureLoader.load('./assets/textures/'+file);
 tex.wrapS=THREE.RepeatWrapping;tex.wrapT=THREE.RepeatWrapping;
 tex.repeat.set(rx,ry);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
 return tex;
}
const mat={
 grass:new THREE.MeshStandardMaterial({map:loadTexture('grass.png',18,18),roughness:1}),
 path:new THREE.MeshStandardMaterial({map:loadTexture('dirt-path.png',2,18),roughness:1}),
 bark:new THREE.MeshStandardMaterial({map:loadTexture('bark.png',1,2),roughness:1}),
 leaf:new THREE.MeshStandardMaterial({map:loadTexture('leaves.png',2,2),roughness:1}),
 leaf2:new THREE.MeshStandardMaterial({map:loadTexture('leaves.png',2,2),color:0x9bd58b,roughness:1}),
 stone:new THREE.MeshStandardMaterial({map:loadTexture('stone.png',2,2),roughness:1}),
 wall:new THREE.MeshStandardMaterial({map:loadTexture('plaster.png',2,2),roughness:1}),
 roof:new THREE.MeshStandardMaterial({map:loadTexture('roof.png',2,2),roughness:1}),
 bear:M(0x98603a),cream:M(0xe9c99c),dark:M(0x34251e),black:M(0x171412),
 water:new THREE.MeshStandardMaterial({map:loadTexture('water.png',3,2),color:0x9de9f4,roughness:.35,metalness:.08}),
 gold:new THREE.MeshStandardMaterial({color:0xffcf35,metalness:.5,roughness:.28,emissive:0x543500}),
 slime:M(0x78d64b),shell:M(0x3c8050),shellLight:M(0x79b86b),yellow:M(0xffd43b),stripe:M(0x33251c),wing:new THREE.MeshStandardMaterial({color:0xe7f7ff,transparent:true,opacity:.72,roughness:.25})
};
function add(geo,m,x=0,y=0,z=0,p=scene){const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);p.add(o);return o}
function box(w,h,d,m,x,y,z,p=scene){return add(new THREE.BoxGeometry(w,h,d),m,x,y,z,p)}
function group(x=0,y=0,z=0,p=scene){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);return g}
function ball(r,sx,sy,sz,m,x,y,z,p,seg=12){const o=add(new THREE.SphereGeometry(r,seg,10),m,x,y,z,p);o.scale.set(sx,sy,sz);return o}

// Ground and forest
add(new THREE.PlaneGeometry(110,110),mat.grass,0,-.13,0).rotation.x=-Math.PI/2;
const path=add(new THREE.PlaneGeometry(5,48),mat.path,0,-.1,-7);path.rotation.x=-Math.PI/2;
const obstacles=[];
function tree(x,z,s=1){const g=group(x,0,z);g.scale.setScalar(s);add(new THREE.CylinderGeometry(.18,.26,1.5,7),mat.bark,0,.75,0,g);add(new THREE.ConeGeometry(1,2,7),mat.leaf,0,2,0,g);add(new THREE.ConeGeometry(.75,1.6,7),mat.leaf2,0,2.8,0,g);obstacles.push({x,z,r:.62*s})}
for(let i=0;i<46;i++){const a=i/46*Math.PI*2,r=18+(i%4)*2;tree(Math.cos(a)*r,Math.sin(a)*r,.8+(i%3)*.12)}
for(let i=0;i<18;i++){const x=(Math.random()-.5)*30,z=(Math.random()-.5)*30;if(Math.hypot(x,z)>7)tree(x,z,.58+(i%3)*.12)}
function house(x,z,s=1){const g=group(x,0,z);g.scale.setScalar(s);box(2.5,1.8,2,mat.wall,0,.9,0,g);const r=add(new THREE.ConeGeometry(1.9,1.2,4),mat.roof,0,2.35,0,g);r.rotation.y=Math.PI/4;box(.55,1,.08,mat.bark,0,.5,1.04,g);obstacles.push({x,z,r:1.35*s})}
house(-7,-4);house(7,-10,.9);house(-8,-14,.8);

// River, banks and bridge
const river=add(new THREE.PlaneGeometry(13,4.4),mat.water,0,-.02,-20);river.rotation.x=-Math.PI/2;
for(let x of [-7.1,7.1])box(.9,.35,5.2,mat.path,x,.02,-20);
for(let z of [-21.3,-18.7]){box(5,.25,.22,mat.bark,0,.48,z);for(let x=-2;x<=2;x+=1)box(.85,.12,.9,mat.path,x,.32,z)}
for(let x of [-2.5,2.5])for(let z of [-21.2,-18.8])box(.18,.85,.18,mat.bark,x,.45,z);

// Cave entrance at far end
const cave=group(0,0,-29);
add(new THREE.CylinderGeometry(2.7,2.7,1.1,12,1,true,0,Math.PI),mat.stone,0,1.4,0,cave).rotation.z=Math.PI/2;
add(new THREE.CircleGeometry(1.65,18),mat.dark,0,1.35,.2,cave);
box(7,.3,2,mat.stone,0,.15,-30);


// Expanded exploration zone: meadow, small ruins and extra trees
const meadow=add(new THREE.PlaneGeometry(34,18),M(0x83c96a),0,-.12,-39);meadow.rotation.x=-Math.PI/2;
for(let i=0;i<18;i++){const x=-15+(i%6)*6,z=-34-Math.floor(i/6)*7;tree(x,z,.48+(i%3)*.08)}
// Low stone ruins to make the northern clearing feel like a destination
for(const [x,z] of [[-10,-39],[-7,-42],[8,-40],[11,-36]]){box(1.3,1.1,.8,mat.stone,x,.5,z);box(.9,.25,.9,mat.stone,x,.95,z)}
// Decorative path markers
for(const z of [-27,-32,-37]){const sign=group(3,0,z);box(.12,1,.12,mat.bark,0,.5,0,sign);box(.9,.42,.12,mat.wall,.42,.82,0,sign)}

// Character: explicitly bipedal bear — TWO LEGS + TWO ARMS
const bear=group(0,0,4),head=group(0,1.95,0,bear);
ball(.57,1,.95,.73,mat.bear,0,1.12,0,bear);
ball(.39,1,1,.85,mat.cream,0,1.02,.43,bear);
ball(.43,1,1,.95,mat.bear,0,0,0,head);
for(const x of [-.31,.31]){ball(.18,1,1,1,mat.bear,x,.34,0,head);ball(.095,1,1,1,mat.cream,x,.34,.045,head);ball(.052,1,1,.5,mat.black,x*.52,.12,.38,head)}
ball(.22,1,.75,1,mat.cream,0,-.12,.34,head);ball(.085,1,1,.7,mat.black,0,-.08,.53,head);
// Only two leg pivots, left and right
const legs=[]; // exactly TWO legs
for(const x of [-.29,.29]){const pivot=group(x,.55,0,bear);ball(.22,1,1,1,mat.bear,0,-.17,.02,pivot);ball(.13,1,.55,1,mat.dark,0,-.29,.12,pivot);legs.push(pivot)}
// Only two arm pivots, left and right
const arms=[]; // exactly TWO arms
for(const x of [-.53,.53]){const pivot=group(x,1.48,0,bear);ball(.17,1,1,1,mat.bear,0,-.22,.02,pivot);arms.push(pivot)}
const bearStart=new THREE.Vector3(0,0,4);bear.position.copy(bearStart);
// The player uses a procedural articulated rig. Every arm and leg has its own pivot,
// so the running cycle remains visible and responsive on all devices.
const torso=bear.children[0];

// Persistent progress and sound
const keys={};const SAVE='bearAdventure06';
let saved={};try{saved=JSON.parse(localStorage.getItem(SAVE)||'{}')}catch(e){}
let collected=new Set(saved.collected||[]),active=false,vy=0,onGround=true,camYaw=0,camPitch=.22,coinsTaken=collected.size,lives=saved.lives||3,invuln=0,toastTimer=0;
function save(){try{localStorage.setItem(SAVE,JSON.stringify({collected:[...collected],lives,checkpoint:checkpointReached,questStage}))}catch(e){console.warn('Progress tidak dapat disimpan pada browser ini.',e)}}
let audioCtx=null;
const soundPaths={
 coin:'coin.wav',jump:'jump.wav',hurt:'hurt.wav',checkpoint:'checkpoint.wav',
 step:'step.wav',dialog:'dialog.wav'
};
const soundAudio={};
for(const [key,file] of Object.entries(soundPaths)){
 const a=new Audio('./assets/audio/'+file);a.preload='auto';
 a.volume=key==='step'?.28:.58;soundAudio[key]=a;
}
const forestAudio=new Audio('./assets/audio/forest-ambience.wav');
forestAudio.loop=true;forestAudio.volume=.20;forestAudio.preload='auto';
let ambienceStarted=false;
function startAudio(){
 if(ambienceStarted)return;
 ambienceStarted=true;
 forestAudio.play().catch(()=>{ambienceStarted=false;});
}
function fallbackSound(type){
 try{
  audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
  if(audioCtx.state==='suspended')audioCtx.resume();
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.connect(g);g.connect(audioCtx.destination);
  const now=audioCtx.currentTime,pr={coin:[880,1320,.12],jump:[260,430,.14],hurt:[180,85,.22],checkpoint:[520,900,.3],step:[130,100,.035],dialog:[520,660,.075]},v=pr[type]||pr.coin;
  o.type=type==='hurt'?'sawtooth':'sine';o.frequency.setValueAtTime(v[0],now);
  o.frequency.exponentialRampToValueAtTime(v[1],now+v[2]);
  g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.07,now+.01);
  g.gain.exponentialRampToValueAtTime(.0001,now+v[2]);o.start();o.stop(now+v[2]+.02);
 }catch(e){}
}
function sound(type){
 const a=soundAudio[type];
 if(!a){fallbackSound(type);return;}
 try{a.pause();a.currentTime=0;const p=a.play();if(p&&p.catch)p.catch(()=>fallbackSound(type));}
 catch(e){fallbackSound(type);}
}

// Coins
const coins=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=5.8+(i%3)*.55,c=add(new THREE.TorusGeometry(.31,.1,8,16),mat.gold,Math.cos(a)*r,.95,Math.sin(a)*r-5);c.rotation.x=Math.PI/2;if(collected.has(i))c.visible=false;coins.push(c)}

// Three enemy types: slime, a shell-protected turtle, and a flying bee.
const enemies=[];
function makeSlime(x,z){
 const g=group(x,0,z);ball(.52,1.15,.8,.9,mat.slime,0,.48,0,g);ball(.065,1,1,.5,mat.black,-.18,.58,.43,g);ball(.065,1,1,.5,mat.black,.18,.58,.43,g);
 enemies.push({type:'slime',root:g,home:g.position.clone(),phase:Math.random()*6,speed:1.25,range:2.3});
}
function makeTurtle(x,z){
 const g=group(x,0,z),body=group(0,.43,0,g);
 ball(.48,1.2,.58,1.05,mat.shellLight,0,0,0,body);
 const shell=ball(.55,1.18,.82,1.08,mat.shell,0,.24,-.02,body);shell.rotation.x=-.12;
 ball(.17,1,1,1,mat.shellLight,0,.12,.48,body);
 ball(.23,1,.85,.9,mat.shellLight,0,.18,.72,body);
 ball(.035,1,1,.5,mat.black,-.09,.22,.91,body);ball(.035,1,1,.5,mat.black,.09,.22,.91,body);
 const feet=[];for(const x0 of [-.34,.34])for(const z0 of [-.32,.32]){const f=group(x0,-.12,z0,body);ball(.14,1,.8,1,mat.shellLight,0,0,0,f);feet.push(f)}
 enemies.push({type:'turtle',root:g,body,feet,home:g.position.clone(),phase:Math.random()*6,speed:.8,range:2.6});
}
function makeBee(x,z){
 const g=group(x,1.9,z),body=group(0,0,0,g);
 ball(.28,1.15,.9,1.25,mat.yellow,0,0,0,body);
 for(const zz of [-.18,.18])box(.48,.43,.12,mat.stripe,0,0,zz,body);
 ball(.17,1,1,.9,mat.yellow,0,.02,.34,body);
 ball(.035,1,1,.5,mat.black,-.07,.08,.48,body);ball(.035,1,1,.5,mat.black,.07,.08,.48,body);
 const wings=[];for(const side of [-1,1]){const w=ball(.22,.7,.12,1.45,mat.wing,side*.23,.25,0,body,10);w.rotation.z=side*-.35;wings.push(w)}
 enemies.push({type:'bee',root:g,body,wings,home:g.position.clone(),phase:Math.random()*6,speed:1.5,range:3.1});
}
makeSlime(4,-12);makeTurtle(-10,-27);makeBee(7, -36);
// A visible hive marks the bee territory in the meadow.
const hive=group(9,0,-37);ball(.42,.72,1,.72,mat.gold,0,1.45,0,hive);ball(.12,1,1,.5,mat.dark,0,1.2,.31,hive);box(.12,.55,.12,mat.bark,0,.55,0,hive);

// Checkpoint flag
const checkpoint=group(0,0,-24);box(.12,2.8,.12,mat.bark,0,1.4,0,checkpoint);const flag=add(new THREE.PlaneGeometry(1.1,.65),M(0xffdf57),.58,2.35,0,checkpoint);flag.rotation.y=-.12;

let checkpointReached=!!saved.checkpoint;

// Friendly NPC: Pak Beruang, with a simple waving animation
const npc=group(-5,0,-9);
ball(.43,1,.95,.78,mat.bear,0,1.05,0,npc);
ball(.34,1,1,.9,mat.bear,0,1.92,0,npc);
ball(.16,1,1,1,mat.bear,-.24,2.18,0,npc);ball(.16,1,1,1,mat.bear,.24,2.18,0,npc);
ball(.18,1,.7,.8,mat.cream,0,1.95,.29,npc);ball(.045,1,1,.5,mat.black,0,1.98,.45,npc);
ball(.08,1,1,.8,mat.cream,0,.98,.35,npc);
const npcArms=[];
for(const x of [-.48,.48]){const a=group(x,1.35,0,npc);ball(.14,1,1,1,mat.bear,0,-.22,0,a);npcArms.push(a)}
// Small name plate above the villager
const namePlate=group(-5,2.75,-9);box(1.8,.32,.08,M(0x24523a),0,0,0,namePlate);


// State, controls and UI
const toast=document.querySelector('#toast');
function say(t){toast.textContent=t;toastTimer=2.2}
let questStage=Number(saved.questStage||0); // 0 meet NPC, 1 collect 6 coins, 2 report back
function updateQuest(){
 const q=document.querySelector('#quest');
 if(questStage===0)q.textContent='MISI 1/3 · Temui Pak Beruang di desa (tekan E)';
 else if(questStage===1)q.textContent='MISI 2/3 · Kumpulkan 6 koin untuk Pak Beruang ('+Math.min(coinsTaken,6)+'/6)';
 else if(questStage===2)q.textContent='MISI 3/3 · Kembali ke Pak Beruang dan tekan E';
 else q.textContent='MISI SELESAI · Terima kasih, penjelajah!';
}
function updateHUD(){document.querySelector('#coins').textContent=coinsTaken;document.querySelector('#lives').textContent=lives;document.querySelector('#mission').textContent=coinsTaken>=12?'Koin terkumpul! Jelajahi area dan capai checkpoint':'Jelajahi hutan, kumpulkan koin, hindari slime, kura-kura, dan lebah';updateQuest()}
function interact(){
 sound('dialog');
 const near=Math.hypot(npc.position.x-bear.position.x,npc.position.z-bear.position.z);
 if(near>2.7){say('Dekati Pak Beruang untuk berbicara.');return}
 if(questStage===0){questStage=1;say('Pak Beruang: Tolong kumpulkan 6 koin di sekitar hutan!');}
 else if(questStage===1&&coinsTaken>=6){questStage=2;say('Pak Beruang: Hebat! Kembali lagi untuk menyelesaikan misi.');}
 else if(questStage===1){say('Pak Beruang: Aku masih menunggu 6 koin.');}
 else if(questStage===2){questStage=3;say('Misi selesai! Kamu pahlawan Hutan Ceria! 🎉');sound('checkpoint');}
 else say('Pak Beruang: Terima kasih sudah membantu desa!');
 save();updateHUD();
}

addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.code==='Space')jump();if(e.code==='KeyE'&&active)interact()});
addEventListener('keyup',e=>keys[e.code]=false);function jump(){if(active&&onGround){vy=7.3;onGround=false}}
let dragging=false,lx=0,ly=0;renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;lx=e.clientX;ly=e.clientY}});addEventListener('pointerup',()=>dragging=false);addEventListener('pointermove',e=>{if(dragging){camYaw-=(e.clientX-lx)*.006;camPitch=THREE.MathUtils.clamp(camPitch+(e.clientY-ly)*.003,-.05,.7);lx=e.clientX;ly=e.clientY}});
let sx=0,sy=0,stick=document.querySelector('#stick'),knob=document.querySelector('#knob'),stickOn=false,mobileSprint=false;
function stickMove(e){const r=stick.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dy),m=38;if(l>m){dx*=m/l;dy*=m/l}sx=dx/m;sy=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`}
stick.addEventListener('pointerdown',e=>{stickOn=true;stick.setPointerCapture(e.pointerId);stickMove(e)});stick.addEventListener('pointermove',e=>{if(stickOn)stickMove(e)});function resetStick(){stickOn=false;sx=sy=0;knob.style.transform='translate(0,0)'}stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);document.querySelector('#jump').addEventListener('pointerdown',jump);
const sprintBtn=document.querySelector('#sprint');if(sprintBtn){sprintBtn.addEventListener('pointerdown',e=>{e.preventDefault();mobileSprint=true});['pointerup','pointercancel','pointerleave'].forEach(ev=>sprintBtn.addEventListener(ev,()=>mobileSprint=false));}
const interactBtn=document.createElement('button');interactBtn.id='interact';interactBtn.textContent='TEKAN E · BICARA';document.querySelector('#hud').appendChild(interactBtn);interactBtn.addEventListener('pointerdown',e=>{e.preventDefault();if(active)interact()});
document.querySelector('#start').addEventListener('click',()=>{active=true;startAudio();document.querySelector('#overlay').style.display='none';say('Petualangan dimulai! Temui Pak Beruang.');});
function blocked(x,z){return obstacles.some(o=>(x-o.x)**2+(z-o.z)**2<(o.r+.52)**2)}
function movePlayer(dx,dz){const nx=bear.position.x+dx,nz=bear.position.z+dz;if(!blocked(nx,bear.position.z))bear.position.x=nx;if(!blocked(bear.position.x,nz))bear.position.z=nz;bear.position.x=THREE.MathUtils.clamp(bear.position.x,-23,23);bear.position.z=THREE.MathUtils.clamp(bear.position.z,-48,18)}
function hurt(){if(invuln>0)return;lives--;invuln=1.8;say('Aduh! Musuh menyerang!');save();sound('hurt');if(lives<=0){lives=3;bear.position.copy(checkpointReached?new THREE.Vector3(0,0,-24):bearStart);say('Coba lagi! Kembali ke titik aman.')}else bear.position.copy(checkpointReached?new THREE.Vector3(0,0,-24):bearStart);updateHUD()}
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
 if(active){
  if(invuln>0)invuln-=dt;if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.textContent=''}
  const f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-sy,s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+sx,len=Math.hypot(f,s);let ff=f,ss=s;if(len>1){ff/=len;ss/=len}
  const moving=len>.08,cf=new THREE.Vector3(-Math.sin(camYaw),0,-Math.cos(camYaw)),cr=new THREE.Vector3(Math.cos(camYaw),0,-Math.sin(camYaw)),dir=cf.multiplyScalar(ff).add(cr.multiplyScalar(ss));
  if(moving){bear.rotation.y=Math.atan2(dir.x,dir.z);const speed=(keys.ShiftLeft||keys.ShiftRight||mobileSprint)?7:4.8;movePlayer(dir.x*speed*dt,dir.z*speed*dt)}
  vy-=19*dt;bear.position.y+=vy*dt;if(bear.position.y<=0){bear.position.y=0;vy=0;onGround=true}
  const sprinting=!!(keys.ShiftLeft||keys.ShiftRight||mobileSprint),gait=sprinting?15:10,amp=sprinting?.88:.62;
  legs.forEach((p,i)=>{p.rotation.x=moving&&onGround?Math.sin(t*gait+i*Math.PI)*amp:THREE.MathUtils.damp(p.rotation.x,0,9,dt);p.rotation.z=moving&&onGround?Math.sin(t*gait+i*Math.PI)*.045:THREE.MathUtils.damp(p.rotation.z,0,8,dt)});
  arms.forEach((p,i)=>{p.rotation.x=moving&&onGround?Math.sin(t*gait+i*Math.PI+Math.PI)* (sprinting?.78:.58):THREE.MathUtils.damp(p.rotation.x,0,9,dt);p.rotation.z=(i===0?-.1:.1)+(moving?Math.sin(t*gait+i*Math.PI)*.055:0)});
  head.rotation.x=onGround?Math.sin(t*2)*.025:-.13;
  torso.rotation.z=moving&&onGround?THREE.MathUtils.clamp(ss*.12,-.12,.12):THREE.MathUtils.damp(torso.rotation.z,0,6,dt);
  torso.position.y=1.12+(moving&&onGround?Math.abs(Math.sin(t*gait))*.045:0);
  if(moving&&onGround&&Math.floor(t*3)!==Math.floor((t-dt)*3))sound('step');
  if(!onGround){legs.forEach((p,i)=>p.rotation.x=THREE.MathUtils.damp(p.rotation.x,-.28,8,dt));arms.forEach((p,i)=>p.rotation.x=THREE.MathUtils.damp(p.rotation.x,-.62,8,dt));}
  bear.visible=invuln<=0||Math.floor(t*12)%2===0;
  coins.forEach((c,i)=>{if(!c.visible)return;c.rotation.z+=dt*2;c.position.y=.95+Math.sin(t*2+i)*.1;const dx=c.position.x-bear.position.x,dz=c.position.z-bear.position.z;if(dx*dx+dz*dz<1.15&&bear.position.y<1.15){c.visible=false;collected.add(i);coinsTaken=collected.size;updateHUD();save();sound('coin');say('Koin ditemukan! 🪙')}});
  enemies.forEach((e)=>{
   e.phase+=dt;
   if(e.type==='bee'){
    const dx=bear.position.x-e.home.x,dz=bear.position.z-e.home.z,dist=Math.hypot(dx,dz);
    const chase=dist<5.5,tx=chase?bear.position.x:e.home.x+Math.sin(e.phase*.7)*e.range,tz=chase?bear.position.z:e.home.z+Math.cos(e.phase*.65)*e.range;
    const vx=tx-e.root.position.x,vz=tz-e.root.position.z,vl=Math.max(.001,Math.hypot(vx,vz));
    e.root.position.x+=vx/vl*e.speed*dt;e.root.position.z+=vz/vl*e.speed*dt;e.root.position.y=1.85+Math.sin(e.phase*5)*.22;
    e.root.rotation.y=Math.atan2(vx,vz);e.wings.forEach((w,i)=>{w.rotation.z=(i===0?-.35:.35)+Math.sin(e.phase*28)*.48});
   }else{
    e.root.position.x=e.home.x+Math.sin(e.phase*(e.type==='turtle'?.65:1.25))*e.range;
    e.root.position.z=e.home.z+Math.cos(e.phase*.7)*.7;e.root.rotation.y=Math.sin(e.phase)*.28;
    if(e.type==='turtle')e.feet.forEach((f,i)=>f.rotation.x=Math.sin(e.phase*5+i*Math.PI)*.22);
    if(e.type==='slime')e.root.scale.y=1+Math.sin(e.phase*5)*.07;
   }
   const hitDist=e.type==='bee'? .9 : 1.05;
   if(Math.hypot(e.root.position.x-bear.position.x,e.root.position.z-bear.position.z)<hitDist && (e.type==='bee'?Math.abs(e.root.position.y-bear.position.y-1)<1.3:bear.position.y<1.1))hurt();
  });
  const npcNear=Math.hypot(npc.position.x-bear.position.x,npc.position.z-bear.position.z)<2.7;
  npcArms[1].rotation.x=Math.sin(t*2.4)*.15;
  npcArms[0].rotation.z=npcNear?Math.sin(t*5)*.35:-.08;
  const prompt=document.querySelector('#interact');if(prompt)prompt.style.display=npcNear?'block':'none';
  if(!checkpointReached&&Math.hypot(bear.position.x,bear.position.z+24)<2.2){checkpointReached=true;say('Pos pemeriksaan tercapai!');updateHUD();save();sound('checkpoint')}
  if(coinsTaken>=12&&checkpointReached&&questStage===3){missionText('PETUALANGAN 0.5 SELESAI! 🎉')}
 }
 const target=new THREE.Vector3(bear.position.x,bear.position.y+1.25,bear.position.z),d=8.2,h=Math.cos(camPitch)*d,pos=new THREE.Vector3(target.x+Math.sin(camYaw)*h,target.y+2+Math.sin(camPitch)*d,target.z+Math.cos(camYaw)*h);camera.position.lerp(pos,.12);camera.lookAt(target);renderer.render(scene,camera)
}
function missionText(t){document.querySelector('#mission').textContent=t}
updateHUD();animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.35))});
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
