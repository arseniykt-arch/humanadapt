import * as THREE from 'three';
import {GLTFLoader} from './vendor/three/loaders/GLTFLoader.js';
const canvas=document.querySelector('.spine-canvas');
const section=canvas.closest('.course-art');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let renderer;
try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{canvas.remove();}
if(renderer){
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.7));
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 const scene=new THREE.Scene();const camera=new THREE.PerspectiveCamera(30,1,.1,100);camera.position.set(0,0,8.3);
 scene.add(new THREE.HemisphereLight(0xd9eaff,0x14234a,1.8));
 const key=new THREE.DirectionalLight(0xeaf3ff,2.8);key.position.set(-3,4,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0x4e86ff,5);rim.position.set(3,1,-2);scene.add(rim);
 const fill=new THREE.DirectionalLight(0xa9caff,1.4);fill.position.set(2,-2,3);scene.add(fill);
 let model,active=false,frame=0,last=0;
 function resize(){const r=section.getBoundingClientRect();renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();if(model)renderer.render(scene,camera);}
 new ResizeObserver(resize).observe(section);resize();
 new GLTFLoader().load('assets/spine.glb',g=>{
   model=g.scene;model.rotation.set(.03,-.85,-.08);
   model.traverse(o=>{if(o.isMesh){o.material=new THREE.MeshStandardMaterial({color:0xb0caff,metalness:.12,roughness:.43});}});
   scene.add(model);section.querySelector('.knowledge-art').style.opacity='0';renderer.render(scene,camera);
 },undefined,()=>{canvas.remove();});
 new IntersectionObserver(e=>{active=e[0].isIntersecting;}).observe(section);
 function render(t){frame=requestAnimationFrame(render);if(!active||!model||document.hidden||t-last<40)return;last=t;
   if(!reduced){const r=section.getBoundingClientRect();const p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height)));model.rotation.y=-1.05+p*.9;}
   renderer.render(scene,camera);
 }
 if(!reduced)frame=requestAnimationFrame(render);
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);canvas.style.opacity='0';section.querySelector('.knowledge-art').style.opacity='1';});
}
