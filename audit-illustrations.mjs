import {haloIllustration} from './dist/halo-display.js';
import assert from 'node:assert/strict';
import{N,sceneKernel,residualCylinder}from './dist/optics.js';
import{mixPSFs,examplePSFs,sceneFieldDegrees}from './dist/illustration-worker.js';
const sum=a=>a.reduce((v,x)=>v+x,0),center=N/2*N+N/2;
const far=examplePSFs('night','lens',false),near=examplePSFs('reading','lens',false),arm=examplePSFs('arm','lens',false);
for(const scene of [far,near,arm])for(const k of ['clear','blur','multi']){assert.ok(Math.abs(sum(scene[k])-1)<1e-10);assert.ok(scene[k].every(v=>Number.isFinite(v)&&v>=0));}
assert.ok(far.clear[center]>far.multi[center]);
assert.ok(near.multi[center]>near.blur[center]);
assert.ok(arm.multi[center]>arm.blur[center]);
assert.deepEqual(near.clear,arm.clear);
const expected=mixPSFs(far.clear,arm.blur,near.blur);assert.deepEqual(far.multi,expected);
const aligned=examplePSFs('night','astigmatism',false),rotated=examplePSFs('night','astigmatism',true);
assert.deepEqual(aligned.clear,aligned.multi);assert.ok(rotated.clear[center]>rotated.multi[center]);assert.ok(Math.abs(residualCylinder({glasses:false,astig:1,toric:true,rotation:15})-.5176380902050415)<1e-12);
let retained=1;for(const s of [far,near,arm,rotated]){const k=sceneKernel(s.multi,s.angle,8/640*Math.PI/180);retained=Math.min(retained,k.retained);assert.ok(Math.abs(sum(k.kernel)-1)<1e-10);assert.ok(k.retained>.99);}
console.log(JSON.stringify({passed:true,scenes:['far','80 cm','40 cm'],normalized:true,farSingleFocusPeakHigher:true,uncorrectedNearAndIntermediateTrifocalPeakHigher:true,alignedCylinderCorrectionsMatch:true,minimumRetained:retained}));

// A wider field must preserve energy while reducing the PSF footprint in pixels.
assert.equal(sceneFieldDegrees('night'),40);assert.equal(sceneFieldDegrees('everyday'),40);assert.equal(sceneFieldDegrees('reading'),8);assert.equal(sceneFieldDegrees('arm'),8);
const wide=sceneKernel(far.multi,far.angle,40/640*Math.PI/180),narrow=sceneKernel(far.multi,far.angle,8/640*Math.PI/180);
const moment=k=>k.kernel.reduce((v,p,i)=>v+p*((i%k.size-(k.size-1)/2)**2+(Math.floor(i/k.size)-(k.size-1)/2)**2),0);
assert.ok(wide.retained>.99);assert.ok(Math.abs(sum(wide.kernel)-1)<1e-10);assert.ok(moment(wide)<moment(narrow)/10);
console.log(JSON.stringify({streetFieldDegrees:40,wideFieldKernelNormalized:true,narrowToWideSecondMoment:moment(narrow)/moment(wide)}));

// Display-only blend must preserve endpoints and use linear light (not sRGB averages).
const black=new Uint8ClampedArray([0,0,0,255]),white=new Uint8ClampedArray([255,255,255,255]);
assert.deepEqual(haloIllustration(black,white,0),black);assert.deepEqual(haloIllustration(black,white,1),white);
assert.deepEqual(haloIllustration(black,white,.5),new Uint8ClampedArray([188,188,188,255]));
assert.deepEqual(haloIllustration(white,white,.3),white);assert.throws(()=>haloIllustration(black,white,NaN));
console.log('Display-only halo blend: endpoints and linear-light midpoint passed.');

// The continuous axis control must match the independently tested residual-cylinder law.
assert.deepEqual(examplePSFs('night','astigmatism',0).multi,aligned.multi);
assert.deepEqual(examplePSFs('night','astigmatism',15).multi,rotated.multi);
const thirty=examplePSFs('night','astigmatism',30);assert.ok(Math.abs(sum(thirty.multi)-1)<1e-10);assert.ok(Math.abs(residualCylinder({glasses:false,astig:1,toric:true,rotation:30})-1)<1e-12);
console.log('Continuous toric axis: 0, 15 and 30 degree checks passed.');
