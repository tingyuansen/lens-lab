import{opticalPSF,sceneKernel}from './optics.js';
import{convolve}from './worker.js';
// Uncalibrated teaching example: equal incoherent weights at 0, 1.25, 2.5 D.
// These are NOT a commercial trifocal pupil function or measured light allocation.
const state={aspheric:true,toric:false,glasses:false,astig:0,rotation:0,pupil:4,decenter:0,scene:'reading',distance:0};
const psfs=new Map();
function at(distance){const d=Math.abs(distance);if(!psfs.has(d))psfs.set(d,opticalPSF({...state,distance:d}));return psfs.get(d);}
export function mixPSFs(...arrays){if(!arrays.length||arrays.some(a=>a.length!==arrays[0].length))throw Error('PSF size mismatch');return Float64Array.from(arrays[0],(_,i)=>arrays.reduce((sum,a)=>sum+a[i],0)/arrays.length);}
export function examplePSFs(scene,topic,rotated){const focused=at(0);if(topic==='astigmatism'){const corrected=opticalPSF({...state,astig:1,toric:true,rotation:typeof rotated==='number'?Math.max(0,Math.min(30,rotated)):rotated?15:0});return{clear:focused.psf,blur:focused.psf,multi:corrected.psf,angle:focused.angle};}const distance=scene==='reading'?2.5:scene==='arm'?1.25:0;return{clear:focused.psf,blur:at(distance).psf,multi:mixPSFs(...[0,1.25,2.5].map(power=>at(distance-power).psf)),angle:focused.angle};}
// Street assets are illustrative wide views, not measured camera geometry.
export function sceneFieldDegrees(scene){return ['night','everyday'].includes(scene)?40:8;}
if(typeof self!=='undefined')self.onmessage=({data:d})=>{try{const p=examplePSFs(d.scene,d.topic,d.rotated);const pixelAngle=(sceneFieldDegrees(d.scene)/640)*Math.PI/180,a=sceneKernel(p.clear,p.angle,pixelAngle),b=sceneKernel(p.blur,p.angle,pixelAngle),m=sceneKernel(p.multi,p.angle,pixelAngle);const clear=convolve(d.input,640,360,a.kernel,a.size,d.scene),blur=convolve(d.input,640,360,b.kernel,b.size,d.scene),multi=convolve(d.input,640,360,m.kernel,m.size,d.scene);postMessage({id:d.id,clear,blur,multi,retained:Math.min(a.retained,b.retained,m.retained)},[clear.buffer,blur.buffer,multi.buffer]);}catch(e){postMessage({id:d.id,error:String(e)});}};
