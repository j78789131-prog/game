import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa9c9df);
scene.fog = new THREE.Fog(0xa9c9df, 90, 420);
const camera = new THREE.PerspectiveCamera(65, innerWidth / innerHeight, 0.1, 900);
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
document.body.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdbeeff, 0x72705f, 2.1));
const sun = new THREE.DirectionalLight(0xffedcf, 3.0); sun.position.set(-80, 130, 45); sun.castShadow = true; sun.shadow.mapSize.set(2048,2048); scene.add(sun);

const mat = (color, roughness=0.85) => new THREE.MeshStandardMaterial({color, roughness});
const asphalt = mat(0x343a3e), sidewalk = mat(0xbab6ad), stone = mat(0xd5c7ac), roof = mat(0x55505a), windowMat = new THREE.MeshStandardMaterial({color:0x405765, roughness:.35, metalness:.2});
const ground = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000), mat(0x72836b)); ground.rotation.x=-Math.PI/2; ground.position.y=-.16; ground.receiveShadow=true; scene.add(ground);
const roadMat = asphalt;
function road(x,z,w,d){const m=new THREE.Mesh(new THREE.BoxGeometry(w,.12,d),roadMat);m.position.set(x,-.04,z);m.receiveShadow=true;scene.add(m);
  const edge= new THREE.Mesh(new THREE.BoxGeometry(w,.13,.13),mat(0xe4dfc8));edge.position.set(x,.02,z-d/2+1.3);scene.add(edge);
  for(let p=-w/2+3;p<w/2-1;p+=8){const dash=new THREE.Mesh(new THREE.BoxGeometry(2.8,.025,.12),mat(0xe4dfc8));dash.position.set(x+p,.03,z);scene.add(dash);}
}
road(0,0,22,540); road(0,0,540,22);
for(let k=-4;k<=4;k++){if(k===0)continue;road(k*70,0,16,540);road(0,k*70,540,16);}
function building(x,z,w,d,h,seed){
 const group=new THREE.Group(); const base=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),stone);base.position.y=h/2; base.castShadow=true;base.receiveShadow=true;group.add(base);
 const top=new THREE.Mesh(new THREE.BoxGeometry(w+0.6,.7,d+0.6),roof);top.position.y=h+.35;top.castShadow=true;group.add(top);
 const floors=Math.max(2,Math.floor(h/3.15)), cols=Math.max(2,Math.floor(w/2.5));
 for(let f=1;f<floors;f++)for(let c=0;c<cols;c++){
   const xx=-w/2+(c+.5)*w/cols, yy=f* h/floors;
   for(const side of [-1,1]){const win=new THREE.Mesh(new THREE.BoxGeometry(.72,1.05,.08),windowMat);win.position.set(xx,yy,side*(d/2+.045));group.add(win);}
 }
 const balcony=new THREE.Mesh(new THREE.BoxGeometry(w+.15,.18,d+.15),mat(0x8c8274));balcony.position.y=1.15;group.add(balcony);
 group.position.set(x,0,z);scene.add(group);
}
let seed=28;function rand(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;}
for(let x=-5;x<=5;x++)for(let z=-5;z<=5;z++){
 const px=x*70,pz=z*70;if(Math.abs(px)<20||Math.abs(pz)<20)continue;
 for(const side of [-1,1])for(const along of [-1,1]){
  const bx=px+side*(18+rand()*8),bz=pz+along*(18+rand()*8);
  building(bx,bz,18+rand()*10,18+rand()*10,12+rand()*25,seed);
 }
}
// Eiffel Tower-inspired landmark: tapered four-leg lattice silhouette.
function eiffel(x,z){
 const g=new THREE.Group(), iron=mat(0x5e6c62,.6);
 const make=(a,b,c,px,py,pz,material=iron)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),material);o.position.set(px,py,pz);o.castShadow=true;g.add(o);return o;};
 make(17,.5,17,0,.25,0,mat(0x8d9388)); 
 for(let s of [-1,1])for(let t of [-1,1]){const leg=new THREE.Mesh(new THREE.CylinderGeometry(.28,.75,22,8),iron);leg.position.set(s*4.7,11,t*4.7);leg.scale.set(.45,1,.45);g.add(leg);}
 make(11,.55,11,0,8,0);make(6,.45,6,0,14,0);make(2,.4,2,0,20,0);make(.18,5,.18,0,22.7,0);
 for(let y of [3,5,10,12,16,18])make(y*.6,.18,y*.6,0,y,0);
 g.position.set(x,0,z);scene.add(g);
}
function arc(x,z){const g=new THREE.Group();const m=mat(0xd2c2a1);const p=new THREE.Mesh(new THREE.BoxGeometry(13,8,3.5),m);p.position.y=4;g.add(p);
 const hole=new THREE.Mesh(new THREE.BoxGeometry(5,5,4),asphalt);hole.position.set(0,2.7,0);g.add(hole);
 const cap=new THREE.Mesh(new THREE.BoxGeometry(14,1,4.3),m);cap.position.y=8.4;g.add(cap);g.position.set(x,0,z);scene.add(g);}
eiffel(-125,-130);arc(135,-135);
// Hero car with a distinct body, glass cabin, wheels and headlights.
const car=new THREE.Group();scene.add(car);
const body=new THREE.Mesh(new THREE.BoxGeometry(2.15,.62,4.15),mat(0x172e4a,.32));body.position.y=.78;body.castShadow=true;car.add(body);
const hood=new THREE.Mesh(new THREE.BoxGeometry(1.9,.2,1.25),mat(0x233f60,.3));hood.position.set(0,1.12,-1.25);car.add(hood);
const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.6,.67,1.8),new THREE.MeshStandardMaterial({color:0x8ba6b8,roughness:.18,metalness:.2}));cabin.position.set(0,1.35,.25);cabin.castShadow=true;car.add(cabin);
const roofCar=new THREE.Mesh(new THREE.BoxGeometry(1.38,.13,1.2),mat(0x172b40,.35));roofCar.position.set(0,1.73,.25);car.add(roofCar);
const wheels=[];
for(const x of [-1.08,1.08])for(const z of [-1.35,1.35]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.39,.39,.24,20),mat(0x111315,.92));w.rotation.z=Math.PI/2;w.position.set(x,.43,z);w.castShadow=true;car.add(w);wheels.push(w);}
const headMat=new THREE.MeshStandardMaterial({color:0xfff2c4,emissive:0xffd26a,emissiveIntensity:1.3});
for(const x of [-.7,.7]){const l=new THREE.Mesh(new THREE.BoxGeometry(.42,.16,.08),headMat);l.position.set(x,.87,-2.1);car.add(l);}
car.position.set(0,0,12);

const keys=new Set();
addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());});
addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));
document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key.toLowerCase();const down=e=>{e.preventDefault();keys.add(k);b.classList.add('down')};const up=e=>{e.preventDefault();keys.delete(k);b.classList.remove('down')};b.addEventListener('pointerdown',down);for(const ev of ['pointerup','pointercancel','pointerleave'])b.addEventListener(ev,up);});
let velocity=0, steer=0, heading=0;
const speedEl=document.getElementById('speed');
function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);
 const forward=keys.has('w')||keys.has('arrowup'),back=keys.has('s')||keys.has('arrowdown'),left=keys.has('a')||keys.has('arrowleft'),right=keys.has('d')||keys.has('arrowright'),hand=keys.has(' ');
 if(forward)velocity+=17*dt;else if(back)velocity-=26*dt;else velocity*=Math.pow(.986,dt*60);
 if(hand)velocity*=Math.pow(.94,dt*60);velocity=THREE.MathUtils.clamp(velocity,-12,42);
 const input=(right?1:0)-(left?1:0);steer=THREE.MathUtils.damp(steer,input,5,dt);
 heading+=steer*velocity*.021*dt;
 car.rotation.y=heading;car.position.x-=Math.sin(heading)*velocity*dt;car.position.z-=Math.cos(heading)*velocity*dt;
 wheels.forEach(w=>w.rotation.x+=velocity*dt*1.4);
 const target=new THREE.Vector3(car.position.x+Math.sin(heading)*9,car.position.y+5.3,car.position.z+Math.cos(heading)*9);
 camera.position.lerp(target,.09);camera.lookAt(car.position.x,1.1,car.position.z);
 speedEl.textContent=String(Math.round(Math.abs(velocity)*3.6)).padStart(3,'0');
 document.getElementById('gear').textContent=velocity<-.3?'R':velocity<.5?'N':'1';
 renderer.render(scene,camera);
}
const clock=new THREE.Clock();
document.getElementById('status').textContent='PARIS DISTRICT · FREE DRIVE';
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
animate();
