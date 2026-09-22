import{sources}from './evidence.js';import{updateIllustration}from './illustrations.js';
const $=id=>document.getElementById(id);const params=new URLSearchParams(location.search);const pick=(key,values,fallback)=>values.includes(params.get(key))?params.get(key):fallback;let lens=pick('lens',['multi','enhanced','edof'],'multi'),topic=pick('topic',['lens','astigmatism'],'lens'),situation=pick('scene',['night','arm','reading','everyday'],'night'),view=pick('view',['a','both','b'],'both'),feature=null,step=0,answers=[];
const data={
mono:{night:['较少光晕等光学干扰','与 Multifocal（多焦点）相比，通常光晕较少、对比度损失较小，但不保证完全没有光晕。','benefit','guideline'],reading:['通常需要阅读眼镜','前提是双眼均以看远为目标。','cost','rcophth']},
multi:{title:'Multifocal（多焦点）',subtitle:'多个焦点 · 包括 Trifocal（三焦点）',night:['光晕与对比度方面的取舍更多','可能增加夜间驾驶的困难；程度因型号及个人而异。','cost','patient'],reading:['较少依赖阅读眼镜','做某些事情时，仍可能需要眼镜。','benefit','patient']},
enhanced:{title:'Enhanced monofocal（增强型单焦点）',subtitle:'一个主要焦点 · 增加部分中距离范围',night:['要看具体型号','一项短期试验在所测对比度及光晕、眩光方面未发现显著差异；这不等于证明完全相同。','neutral','enhanced'],reading:['通常仍需阅读眼镜','额外收益主要在中距离视物，近距离阅读通常仍需眼镜。','cost','patient']},
edof:{title:'EDOF（延长焦深）',subtitle:'EDOF（延长焦深）',night:['取舍取决于具体设计','请询问拟用型号在暗处的对比度表现，以及光晕情况。','neutral','guideline'],reading:['看近通常仍需眼镜','主要把可用视距扩展到中距离。','cost','guideline']}}
data.mono.intermediate=['可能需要中距离眼镜','双眼以看远为目标时，手臂距离的清晰度可能不足。','cost','patient'];
data.multi.intermediate=['可减少中距离眼镜依赖','Trifocal（三焦点）包含中距离焦点；效果因型号与眼睛情况而异。','benefit','guideline'];
data.enhanced.intermediate=['增加部分中距离范围','研究中的部分型号改善了中距离视力，仍需看具体型号。','benefit','enhanced'];
data.edof.intermediate=['主要扩展到中距离','中距离是 EDOF（延长焦深）的主要目标之一。','benefit','guideline'];
const contexts={arm:['手臂距离：看清手上的番石榴','目标约 80 cm；默认不戴眼镜，可拉下眼镜比较。'],night:['更重视夜间清晰，还是少戴眼镜？','两者都以改善视力为目标，但各有取舍。'],reading:['接受戴眼镜阅读，还是希望少戴？','也要一并考虑夜间视物的取舍。'],everyday:['白天的细节与对比度','这里比较远处街景；要看近距离效果，请选「阅读书本」。']};
function cell(id,entry){const [title,body,kind,source]=entry;const e=$(id);e.classList.remove('benefit','cost','neutral');e.classList.add(kind);e.replaceChildren();const h=document.createElement('h3');h.textContent=title;const p=document.createElement('p');p.textContent=body+' ';const a=document.createElement('a');a.textContent='依据 ↗';a.href=sources[source];a.target='_blank';a.rel='noopener';p.append(a);e.append(h,p);}
function render(){updateIllustration({lens,situation,view,topic});const first=situation==='reading'?'reading':situation==='arm'?'intermediate':'night',second=first==='night'?'reading':'night';$('situation').value=situation;$('comparison').dataset.view=view;$('context').dataset.scene=situation;$('scene-title').textContent=contexts[situation][0];$('scene-description').textContent=contexts[situation][1];$('image-note').hidden=situation!=='night';$('b-title').textContent=data[lens].title;$('b-subtitle').textContent=data[lens].subtitle;for(const[n,k]of [['one',first],['two',second]]){$('row-'+n).textContent=(n==='one'?'01':'02')+' · '+(k==='night'?'夜间视物':k==='intermediate'?'手臂距离，不戴眼镜':'不戴眼镜阅读');cell('a-'+n,k==='night'&&lens!=='multi'?['标准单焦点光学','可用作参考，评估 B 增加的视距与光学影响。','neutral','patient']:data.mono[k]);cell('b-'+n,data[lens][k]);}$('takeaway').textContent=lens==='multi'?'主要取舍：较少依赖眼镜，可能伴随更多光晕等光学干扰。':lens==='enhanced'?'重点问题：这个型号实际能增加多少有用的中距离视力？':'重点问题：增加的中距离范围，是否值得接受这个型号的光学取舍？';document.querySelectorAll('[data-view]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.view===view)));document.querySelectorAll('[data-lens]').forEach(e=>e.setAttribute('aria-pressed',String(e.dataset.lens===lens)));}
const featureText={toric:'<p><strong>Toric（散光型）把散光矫正做在人工晶状体内。</strong>如果规则性角膜散光需要矫正，Toric（散光型）可减少对散光眼镜的依赖。非散光型人工晶状体配合适当眼镜，也是矫正方法之一。</p><p><strong>需要考虑：</strong>Toric（散光型）需要准确对准轴位；旋转后可留下残余散光，有时需要手术调整位置。这并不消除单焦点与多焦点本身的取舍。</p><p>请医生根据她的检查数据判断是否值得采用。<a href="'+sources.guideline+'" target="_blank" rel="noopener">ESCRS 临床建议 ↗</a> · <a href="'+sources.toric+'" target="_blank" rel="noopener">旋转与复位研究 ↗</a></p>',aspheric:'<p><strong>Aspheric（非球面）：镜面并非球面的一部分。</strong>不同设计处理球差的方式不同；部分设计可补偿角膜球差。</p><p><strong>需要考虑：</strong>收益取决于眼睛情况和晶状体设计；部分补偿球差的设计对倾斜或偏心更敏感。它常是晶状体本身的设计特点，并非一定要另加的选项。</p><p>单凭 Aspheric（非球面）这个名称，不能判断阅读范围。<a href="'+sources.aspheric+'" target="_blank" rel="noopener">光学说明 ↗</a></p>'};
function showFeature(which){feature=feature===which?null:which;for(const k of ['toric','aspheric']){$(k+'-open').setAttribute('aria-expanded',String(feature===k));$(k+'-open').querySelector('span').textContent=feature===k?'−':'＋';}$('feature-note').hidden=!feature;$('feature-note').innerHTML=feature?featureText[feature]:'';}
$('situation').onchange=()=>{situation=$('situation').value;render();};document.querySelectorAll('[data-view]').forEach(e=>e.onclick=()=>{view=e.dataset.view;render();});document.querySelectorAll('[data-lens]').forEach(e=>e.onclick=()=>{lens=e.dataset.lens;render();$('options').close();});$('alternatives').onclick=()=>$('options').showModal();$('sources-open').onclick=()=>$('sources').showModal();for(const k of ['toric','aspheric'])$(k+'-open').onclick=()=>showFeature(k);document.querySelectorAll('[data-close]').forEach(e=>e.onclick=()=>e.closest('dialog').close());
const sourceNames={guideline:'ESCRS 白内障手术临床建议',patient:'ESCRS 患者说明',rcophth:'英国皇家眼科学院／RNIB 患者指南（2025）',enhanced:'Enhanced monofocal（增强型单焦点）随机试验（2025）',toric:'Toric（散光型）的旋转与复位研究（2023）',aspheric:'ESCRS 球差说明'};for(const[k,v]of Object.entries(sourceNames)){const a=document.createElement('a');a.textContent=v+' ↗';a.href=sources[k];a.target='_blank';a.rel='noopener';$('source-list').append(a);}const trial=document.createElement('p');trial.textContent='增强型晶状体试验：172 位患者，比较 Eyhance Optiblue、Impress、NSP-3 与 Tecnis monofocal Optiblue，随访两个月。结果不能证明完全等效、长期安全，或所有增强型型号都有同样表现。';$('source-list').append(trial);
const qs=[['您更重视哪一项？',[['contrast','夜间舒适、对比清晰'],['freedom','较少依赖眼镜']]],['可以接受阅读时戴眼镜吗？',[['yes','可以，我习惯戴眼镜'],['no','我希望尽量少戴']]],['做过角膜散光测量了吗？',[['yes','做过，可以向医生询问结果'],['unknown','还没有／不太确定']]]];
function decision(){const done=step===3;$('step-label').textContent=done?'可带给医生的问题':'您的偏好 · '+(step+1)+' / 3';$('back').hidden=step===0;$('answers').replaceChildren();if(!done){$('question').textContent=qs[step][0];$('decision-note').textContent=step===2?'是否适合 Toric（散光型），需要检查数据来判断。':'没有一种晶状体具备所有优点；先想清楚自己最重视什么。';for(const[v,t]of qs[step][1]){const b=document.createElement('button');b.textContent=t;b.onclick=()=>{answers[step]=v;step++;decision();};$('answers').append(b);}}else{const mono=answers[0]==='contrast'&&answers[1]==='yes';$('question').textContent=mono?'“以看远为目标的 Monofocal（单焦点），是否适合我的偏好？”':answers[0]==='contrast'?'“能否增加中距离范围，同时尽量保留夜间视物质量？”':'“对我来说，减少多少眼镜依赖，才值得接受这些光学取舍？”';$('decision-note').textContent='这是就诊讨论提示，不是选定晶状体的处方。'+(answers[2]==='unknown'?'请询问角膜散光的测量结果。':'请询问测得的散光是否值得采用 Toric（散光型）。');const b=document.createElement('button');b.textContent='返回比较';b.onclick=()=>{$('decision').close();};const r=document.createElement('button');r.textContent='重新开始';r.onclick=()=>{step=0;answers=[];decision();};$('answers').append(b,r);}}
$('help').onclick=()=>{decision();$('decision').showModal();};$('back').onclick=()=>{step=Math.max(0,step-1);answers=answers.slice(0,step);decision();};document.addEventListener('keydown',e=>{if(document.querySelector('dialog[open]')||/SELECT|INPUT|TEXTAREA/.test(e.target.tagName))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();changeScene(e.key==='ArrowLeft'?-1:1);}});
if(document.modelContext?.registerTool){const ac=new AbortController();window.addEventListener('pagehide',()=>ac.abort(),{once:true});try{Promise.resolve(document.modelContext.registerTool({name:'compare_lens_choices',description:'Show source-linked lens trade-offs. Changes only the educational comparison; does not recommend an implant.',inputSchema:{type:'object',properties:{situation:{type:'string',enum:['night','arm','reading','everyday']},lens:{type:'string',enum:['multi','enhanced','edof']},view:{type:'string',enum:['a','both','b']}},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:async input=>{if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Expected comparison options');const allowed={situation:['night','arm','reading','everyday'],lens:['multi','enhanced','edof'],view:['a','both','b']};for(const[k,v]of Object.entries(input))if(!allowed[k]?.includes(v))throw Error('Invalid '+k);situation=input.situation||situation;lens=input.lens||lens;view=input.view||view;render();return{lensA:'distance-targeted monofocal',lensB:lens,situation,view,scope:'General evidence; not a patient-specific prediction'};}},{signal:ac.signal})).catch(()=>{});}catch{}}
render();

function showPanel(panel){
  const illustration=panel==='illustration';
  $('comparison').dataset.panel=panel;
  $('illustration-panel').hidden=!illustration;
  $('details-panel').hidden=illustration;
  for(const p of ['illustration','details']){const t=$(p+'-tab');t.setAttribute('aria-selected',String(p===panel));t.tabIndex=p===panel?0:-1;}
}
for(const p of ['illustration','details']){
  $(p+'-tab').onclick=()=>showPanel(p);
  $(p+'-tab').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();e.stopPropagation();const next=e.key==='Home'?'illustration':e.key==='End'?'details':p==='illustration'?'details':'illustration';showPanel(next);$(next+'-tab').focus();}};
}
$('return-illustration').onclick=()=>{showPanel('illustration');$('illustration-tab').focus();};

function changeScene(direction){const scenes=['night','arm','reading','everyday'];situation=scenes[(scenes.indexOf(situation)+direction+scenes.length)%scenes.length];render();}
$('scene-prev').onclick=()=>changeScene(-1);
$('scene-next').onclick=()=>changeScene(1);
let swipeStart=null;
$('comparison').addEventListener('touchstart',e=>{
  swipeStart=null;
  if(document.querySelector('dialog[open]')||e.touches.length!==1||e.target.closest('input,select,button,a,[role="tab"]'))return;
  swipeStart={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
$('comparison').addEventListener('touchend',e=>{
  if(!swipeStart)return;
  const t=e.changedTouches[0],dx=t.clientX-swipeStart.x,dy=t.clientY-swipeStart.y;swipeStart=null;
  if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.7)changeScene(dx<0?1:-1);
},{passive:true});
$('comparison').addEventListener('touchcancel',()=>{swipeStart=null;},{passive:true});

document.querySelectorAll('[data-topic]').forEach(button=>button.onclick=()=>{topic=button.dataset.topic;document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));render();});

const languageLink=document.querySelector('.language-switch');languageLink.addEventListener('click',()=>{const target=new URL(languageLink.href);target.search=new URLSearchParams({scene:situation,lens,topic,view}).toString();languageLink.href=target.href;});
document.querySelectorAll('[data-topic]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.topic===topic)));
