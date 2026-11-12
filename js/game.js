import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount=document.querySelector('#game'),scene=new THREE.Scene();
scene.background=new THREE.Color(0x9bd7ed);scene.fog=new THREE.Fog(0x9bd7ed,32,88);
const camera=new THREE.PerspectiveCamera(62,innerWidth/innerHeight,.1,150);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.35));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xeaf8ff,0x607b43,2.0));const sun=new THREE.DirectionalLight(0xfff0d1,2.1);sun.position.set(-12,20,10);scene.add(sun);
const M=c=>new THREE.MeshStandardMaterial({color:c,roughness:.92});
const mat={grass:M(0x72b95b),path:M(0xcbb77e),bark:M(0x79502f),leaf:M(0x32844b),leaf2:M(0x58a84d),stone:M(0x87958b),wall:M(0xf0d5a4),roof:M(0xb94e35),bear:M(0x98603a),cream:M(0xe9c99c),dark:M(0x34251e),black:M(0x171412),water:new THREE.MeshStandardMaterial({color:0x42b8d0,roughness:.35,metalness:.08}),gold:new THREE.MeshStandardMaterial({color:0xffcf35,metalness:.5,roughness:.28,emissive:0x543500}),slime:M(0x78d64b)};
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

// Character: explicitly bipedal bear — TWO LEGS + TWO ARMS
const bear=group(0,0,4),head=group(0,1.95,0,bear);
ball(.57,1,.95,.73,mat.bear,0,1.12,0,bear);
ball(.39,1,1,.85,mat.cream,0,1.02,.43,bear);
ball(.43,1,1,.95,mat.bear,0,0,0,head);
for(const x of [-.31,.31]){ball(.18,1,1,1,mat.bear,x,.34,0,head);ball(.095,1,1,1,mat.cream,x,.34,.045,head);ball(.052,1,1,.5,mat.black,x*.52,.12,.38,head)}
ball(.22,1,.75,1,mat.cream,0,-.12,.34,head);ball(.085,1,1,.7,mat.black,0,-.08,.53,head);
// Only two leg pivots, left and right
const legs=[];
for(const x of [-.29,.29]){const pivot=group(x,.55,0,bear);ball(.22,1,1,1,mat.bear,0,-.17,.02,pivot);ball(.13,1,.55,1,mat.dark,0,-.29,.12,pivot);legs.push(pivot)}
// Only two arm pivots, left and right
const arms=[];
for(const x of [-.53,.53]){const pivot=group(x,1.48,0,bear);ball(.17,1,1,1,mat.bear,0,-.22,.02,pivot);arms.push(pivot)}
const bearStart=new THREE.Vector3(0,0,4);bear.position.copy(bearStart);

// Coins
const coins=[];for(let i=0;i<12;i++){const a=i/12*Math.PI*2,r=5.8+(i%3)*.55,c=add(new THREE.TorusGeometry(.31,.1,8,16),mat.gold,Math.cos(a)*r,.95,Math.sin(a)*r-5);c.rotation.x=Math.PI/2;coins.push(c)}

// One simple patrol slime enemy
const enemy=group(4,0,-12);ball(.52,1.15,.8,.9,mat.slime,0,.48,0,enemy);ball(.065,1,1,.5,mat.black,-.18,.58,.43,enemy);ball(.065,1,1,.5,mat.black,.18,.58,.43,enemy);
const enemyHome=enemy.position.clone();let enemyPhase=0;

// Checkpoint flag
const checkpoint=group(0,0,-24);box(.12,2.8,.12,mat.bark,0,1.4,0,checkpoint);const flag=add(new THREE.PlaneGeometry(1.1,.65),M(0xffdf57),.58,2.35,0,checkpoint);flag.rotation.y=-.12;
let checkpointReached=false;

// State, controls and UI
const keys={};let active=false,vy=0,onGround=true,camYaw=0,camPitch=.22,coinsTaken=0,lives=3,invuln=0,toastTimer=0;
const toast=document.querySelector('#toast');
function say(t){toast.textContent=t;toastTimer=2.2}
function updateHUD(){document.querySelector('#coins').textContent=coinsTaken;document.querySelector('#lives').textContent=lives;document.querySelector('#mission').textContent=coinsTaken>=12?'Misi koin selesai! Menuju pos pemeriksaan':'Misi: kumpulkan 12 koin dan capai pos pemeriksaan'}
addEventListener('keydown',e=>{keys[e.code]=true;if(['Space','ArrowUp','ArrowDown'].includes(e.code))e.preventDefault();if(e.code==='Space')jump()});
addEventListener('keyup',e=>keys[e.code]=false);function jump(){if(active&&onGround){vy=7.3;onGround=false}}
let dragging=false,lx=0,ly=0;renderer.domElement.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){dragging=true;lx=e.clientX;ly=e.clientY}});addEventListener('pointerup',()=>dragging=false);addEventListener('pointermove',e=>{if(dragging){camYaw-=(e.clientX-lx)*.006;camPitch=THREE.MathUtils.clamp(camPitch+(e.clientY-ly)*.003,-.05,.7);lx=e.clientX;ly=e.clientY}});
let sx=0,sy=0,stick=document.querySelector('#stick'),knob=document.querySelector('#knob'),stickOn=false;
function stickMove(e){const r=stick.getBoundingClientRect();let dx=e.clientX-r.left-r.width/2,dy=e.clientY-r.top-r.height/2,l=Math.hypot(dx,dy),m=38;if(l>m){dx*=m/l;dy*=m/l}sx=dx/m;sy=dy/m;knob.style.transform=`translate(${dx}px,${dy}px)`}
stick.addEventListener('pointerdown',e=>{stickOn=true;stick.setPointerCapture(e.pointerId);stickMove(e)});stick.addEventListener('pointermove',e=>{if(stickOn)stickMove(e)});function resetStick(){stickOn=false;sx=sy=0;knob.style.transform='translate(0,0)'}stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);document.querySelector('#jump').addEventListener('pointerdown',jump);
document.querySelector('#start').onclick=()=>{active=true;document.querySelector('#overlay').style.display='none'};
function blocked(x,z){return obstacles.some(o=>(x-o.x)**2+(z-o.z)**2<(o.r+.52)**2)}
function movePlayer(dx,dz){const nx=bear.position.x+dx,nz=bear.position.z+dz;if(!blocked(nx,bear.position.z))bear.position.x=nx;if(!blocked(bear.position.x,nz))bear.position.z=nz;bear.position.x=THREE.MathUtils.clamp(bear.position.x,-16,16);bear.position.z=THREE.MathUtils.clamp(bear.position.z,-34,18)}
function hurt(){if(invuln>0)return;lives--;invuln=1.8;say('Aduh! Terkena slime.');if(lives<=0){lives=3;bear.position.copy(checkpointReached?new THREE.Vector3(0,0,-24):bearStart);say('Coba lagi! Kembali ke titik aman.')}else bear.position.copy(checkpointReached?new THREE.Vector3(0,0,-24):bearStart);updateHUD()}
const clock=new THREE.Clock();
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;
 if(active){
  if(invuln>0)invuln-=dt;if(toastTimer>0){toastTimer-=dt;if(toastTimer<=0)toast.textContent=''}
  const f=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0)-sy,s=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0)+sx,len=Math.hypot(f,s);let ff=f,ss=s;if(len>1){ff/=len;ss/=len}
  const moving=len>.08,cf=new THREE.Vector3(-Math.sin(camYaw),0,-Math.cos(camYaw)),cr=new THREE.Vector3(Math.cos(camYaw),0,-Math.sin(camYaw)),dir=cf.multiplyScalar(ff).add(cr.multiplyScalar(ss));
  if(moving){bear.rotation.y=Math.atan2(dir.x,dir.z);const speed=(keys.ShiftLeft||keys.ShiftRight)?7:4.8;movePlayer(dir.x*speed*dt,dir.z*speed*dt)}
  vy-=19*dt;bear.position.y+=vy*dt;if(bear.position.y<=0){bear.position.y=0;vy=0;onGround=true}
  legs.forEach((p,i)=>p.rotation.x=moving&&onGround?Math.sin(t*11+i*Math.PI)*.55:THREE.MathUtils.damp(p.rotation.x,0,8,dt));
  arms.forEach((p,i)=>p.rotation.x=moving&&onGround?Math.sin(t*11+i*Math.PI+Math.PI)*.4:THREE.MathUtils.damp(p.rotation.x,0,8,dt));
  bear.visible=invuln<=0||Math.floor(t*12)%2===0;
  coins.forEach((c,i)=>{if(!c.visible)return;c.rotation.z+=dt*2;c.position.y=.95+Math.sin(t*2+i)*.1;const dx=c.position.x-bear.position.x,dz=c.position.z-bear.position.z;if(dx*dx+dz*dz<1.15&&bear.position.y<1.15){c.visible=false;coinsTaken++;updateHUD();say('Koin ditemukan! 🪙')}});
  enemyPhase+=dt;enemy.position.x=enemyHome.x+Math.sin(enemyPhase*1.25)*2.3;enemy.position.z=enemyHome.z+Math.cos(enemyPhase*.8)*1.1;enemy.rotation.y=Math.PI/2+Math.sin(enemyPhase)*.25;
  if(Math.hypot(enemy.position.x-bear.position.x,enemy.position.z-bear.position.z)<1.05&&bear.position.y<1.1)hurt();
  if(!checkpointReached&&Math.hypot(bear.position.x,bear.position.z+24)<2.2){checkpointReached=true;say('Pos pemeriksaan tercapai!');updateHUD()}
  if(coinsTaken>=12&&checkpointReached){missionText('PETUALANGAN 0.3 SELESAI! 🎉')}
 }
 const target=new THREE.Vector3(bear.position.x,bear.position.y+1.25,bear.position.z),d=8.2,h=Math.cos(camPitch)*d,pos=new THREE.Vector3(target.x+Math.sin(camYaw)*h,target.y+2+Math.sin(camPitch)*d,target.z+Math.cos(camYaw)*h);camera.position.lerp(pos,.12);camera.lookAt(target);renderer.render(scene,camera)
}
function missionText(t){document.querySelector('#mission').textContent=t}
updateHUD();animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.35))});
if('serviceWorker'in navigator&&location.protocol.startsWith('http'))addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
