// Visual illustration only, NOT a model of a different IOL or neural adaptation.
// Blend a focused reference and the model rendering in linear light.
import {linear,srgb} from './optics.js';
const lut=Float64Array.from({length:256},(_,i)=>linear(i));
export function haloIllustration(reference,model,strength){
 if(reference.length!==model.length||reference.length%4||!Number.isFinite(strength))throw new Error('Invalid halo illustration inputs');
 const t=Math.max(0,Math.min(1,strength));
 if(t===0)return new Uint8ClampedArray(reference);
 if(t===1)return new Uint8ClampedArray(model);
 const out=new Uint8ClampedArray(model.length);
 for(let i=0;i<out.length;i+=4){for(let c=0;c<3;c++)out[i+c]=srgb(lut[reference[i+c]]*(1-t)+lut[model[i+c]]*t);out[i+3]=255;}
 return out;
}
