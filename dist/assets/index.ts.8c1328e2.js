import{f as q,i as G,a as A,n as d,s as m,p as y,r as h,l as c,b as w,c as f,d as g,e as K,g as Ee,h as Pe,j as Y,O as J,m as Ie,t as De,k as Ce,o as Ae,q as Be}from"./vendor.302a3247.js";const D={mainFeed:"mainFeed",post:"post",personFeed:"personFeed",stories:"stories"},v=()=>{let e=window.location.href;return e.endsWith("instagram.com/")||e.includes(".com/?")?D.mainFeed:e.includes("/p/")?D.post:e.includes("/reel/")?"reel":e.includes("/stories/")?D.stories:D.personFeed},Me=e=>e==="post"||e==="reel";v();document.querySelector("#mount_0_0_8N");const k=()=>{const e=v();return e==="personFeed"?["preview"]:e==="stories"?["story"]:["post"]},E=new EventTarget;function Z(e){return e.map(t=>t.parentElement).filter(t=>t!==null)}const _e=q(e=>e.querySelectorAll('a[href*="/p/"]'),Array.from,Z);function ke(e){if(v()==="mainFeed"){if(e.tagName=="ARTICLE")return[e];const t=Array.from(e.querySelectorAll("article"));if(t.length>0)return t}else return e.tagName=="MAIN"?[e]:Array.from(e.querySelectorAll("main"));return[]}function Te(e){return e.tagName=="SECTION"&&Array.from(e.children).findIndex(t=>t.tagName=="HEADER")>0?[e]:Z(Array.from(e.querySelectorAll("header")))}const $=(e,t)=>{E.dispatchEvent(new CustomEvent(e,{detail:{element:t}}))};class M{constructor(t,n){this.getContainedElements=n,this.elementType=t}matchesType(t){return t.includes(this.elementType)}buildEventName(t){const n=this.elementType;return`on${n[0].toUpperCase()+n.slice(1)}${t}`}onAdded(t){$(this.buildEventName("Added"),t)}onRemoved(t){$(this.buildEventName("Removed"),t)}}const qe=[new M("post",ke),new M("preview",_e),new M("story",Te)];function ee(e,t){if(e.nodeType!=1)return;let n=k();for(let r of qe){if(!r.matchesType(n))continue;let o=r.getContainedElements(e),i=t?r.onAdded.bind(r):r.onRemoved.bind(r);o.forEach(i)}}function te(e){e instanceof HTMLElement&&ee(e,!0)}function Oe(e){e instanceof HTMLElement&&ee(e,!1)}function Ne(e){e.addedNodes.forEach(te),e.removedNodes.forEach(Oe)}function Fe(e){e.forEach(Ne)}function Re(){var e=new MutationObserver(Fe);e.observe(document,{childList:!0,subtree:!0})}function Le(){te(document.body)}function Ue(){Le(),Re()}E.start=Ue;function $e(e){return new Promise(t=>setTimeout(t,e))}async function He(e,t,n){for(let r=0;r<t;r++){const o=n();if(G(o))return o.value;await $e(e)}throw"attempt was unsuccessful"}function je(e,t){return A(e.querySelector(t))}async function ne(e,t,n,r){return He(e,t,()=>je(n,r))}const O=e=>{const t=document.createElement("div");return t.innerHTML=e,t.firstElementChild};function re(e,t){return()=>{window.setTimeout(e,t)}}function N(e){return e?e[0]:null}function Ve(e){return e?m(e[0]):d}const We=e=>q(t=>e.exec(t),Ve);function ze(e){const t=e.parentElement;if(!t)return null;const n=t.parentElement;return n||null}function Qe(e,t){const n=N(/(?<=translateX\()[\d\.]*(?=px)/.exec(t.style.transform));return n?Math.round(parseFloat(n)/e):null}function oe(e){const t=ze(e);if(!t)return null;const n=t.getBoundingClientRect().x,r=1,o=e.children[r],i=parseFloat(getComputedStyle(o).getPropertyValue("width"));for(let a=r;a<e.children.length;a++){const s=e.children[a],u=s.getBoundingClientRect().x;if(Math.abs(n-u)>i/2)continue;const l=Qe(i,s);if(l!==null)return{index:l,child:s}}return null}function Xe(e){const t=e.querySelector("ul");if(!t)return null;const n=oe(t);return n?{list:t,...n}:null}function ie(e,t){let n=-1;const r=re(()=>{const i=oe(e);if(!i){console.warn("could not find index and child of carousel!");return}i.index!==n&&(n=i.index,t(i))},100);new MutationObserver(r).observe(e,{childList:!0,subtree:!0}),r()}function Ge(e){return y(e.querySelectorAll("img"),Array.from,t=>t.find(n=>n.naturalWidth>400))}function P(e){return e.querySelector("video")??Ge(e)}function Ke(e){const t=e.querySelectorAll('a[href*="/p/"');if(t.length===0)return null;const n=t[t.length-1].href,r=n.indexOf("/p/");if(r<0)return null;const o=r+3,i=n.indexOf("/",o);return i<0?null:n.substring(0,i+1)}function Ye(e,t){let n=t;for(let r=0;r<1e3;r++){if(n.matches("li"))return!0;if(n===e)return!1;const o=n.parentElement;if(!o)return!1;n=o}return!1}function T(e){const t=P(e);return t?Ye(e,t)?"collection":t.tagName==="VIDEO"?"video":"image":null}function se(e){return e.map(t=>`\\${t}`).join("|")}function Je(e){const t=se(e);return new RegExp(`[^/]*(${t})`)}function Ze(e,t){return new RegExp(se(e)).exec(t)!==null}const et=(e,t)=>n=>{const r=e.exec(n);if(r!==null){const o=r[0];return h(o)}return Ze(t,n)?c(`could not extract a filename from the url '${n}' although it appears to contain a valid file-extension.`):c(`the url '${n}' does not contain any of the expected file-extensions: ${t.join(", ")}`)},tt=e=>et(Je(e),e),nt=tt([".mp4",".jpg",".webp",".webm",".heic"]);function rt(){const e=/(?<="username":")[^"]*/.exec(document.body.innerHTML);return e?e[0]:null}const ot=(e,t)=>new Promise((n,r)=>{const o=w.exports.runtime.connect({name:"chrome-downloader"});let i=null;const a=()=>{o.postMessage({type:"request-state",id:i})};o.onMessage.addListener(s=>{if(s.type==="download-id"){i=s.id,a();return}if(s.type==="error"){r(s.error),o.disconnect();return}if(s.type==="success"){n(),o.disconnect();return}if(s.type==="progress"){t(s.progress.progress),a();return}}),o.postMessage({type:"request-download",filePath:e.filePath,url:e.url})}),it=(e,t)=>{const n={requests:[{action:"write media by link",data:e}],time:window.performance.now()};let r=null,o=null;const i=new Promise((s,u)=>{r=s,o=u}),a=w.exports.runtime.connect({name:"disk-downloader"});return a.onMessage.addListener((s,u)=>{if(s.origin==="native host disconnect"){o(s.data);return}else if(s.origin==="native host response"){const p=s.data[0],b=p.type;if(b==="success"){r();return}else if(b==="error"){o(p.data);return}else b==="progress"&&t(p.data.progress)}s.data[0].type==="success"&&a.disconnect()}),a.postMessage(n),i},st=(e,t,n)=>{const r=n.directoryRules||[];r.reverse();const o=n.baseDownloadDirectory||"",i=[...r,{baseDirectory:o}];for(let a of i){const s=a.username||[],u=a.downloadAs||[],l=a.baseDirectory||"",p=a.folderPath||"";if(!((s.length===0||s.includes(e))&&(u.length===0||u.includes(t))))continue;let x=null;if(l!==""&&(x=`${l}/${e}`),p!==""&&(x=p),x!==null)return x}return null};async function at(e){const t=await w.exports.storage.sync.get({baseDownloadDirectory:"",directoryRules:[]}),n=st(e.userName,e.ownUserName,t);if(!n)throw"no path found. have you set a path in the extension-options?";return n}function C(e){return w.exports.runtime.getURL(`assets/icons/${e}.png`)}const H={initial:"save",loading:"spinner-of-dots",success:"verify-sign-green",fail:"error"};class ct{constructor(){this._downloadState="initial",this._loadingProgress=0,this._spinnerCtx=null,this._spinnerCanvas=null,this._buttonImg=null,this._rootElement=null,this._rootElement=document.createElement("a"),this._rootElement.classList.add("download-button"),Object.assign(this._rootElement.style,{width:"fit-content",height:"fit-content",cursor:"pointer"}),this._buttonImg=document.createElement("img"),Object.assign(this._buttonImg.style,{width:"inherit",height:"inherit"}),this._rootElement.appendChild(this._buttonImg),this._setInitialState()}get downloadState(){return this._downloadState}set downloadState(t){this._downloadState=t,this._onDownloadStateChanged()}get loadingProgress(){return this._loadingProgress}set loadingProgress(t){this._loadingProgress=t,this._downloadState==="loading"&&this._drawSpinner()}getElement(){return this._rootElement}_setInitialState(){let n=k()[0]=="post"?"dark":"white";const r=`${H.initial}-${n}`;this._buttonImg.src=C(r)}_onDownloadStateChanged(){const t=this._downloadState;if(t==="loading")this._spinnerCanvas||(this._spinnerCanvas=document.createElement("canvas"),this._spinnerCtx=this._spinnerCanvas.getContext("2d"),this._drawSpinner());else{this._spinnerCanvas=null,this._spinnerCtx=null;let n=H[t];t==="initial"&&(n+=`-${k()[0]=="post"?"dark":"white"}`),this._buttonImg.src=C(n)}}_drawSpinner(){const t=this._spinnerCtx,n=this._loadingProgress,r=32;Object.assign(this._spinnerCanvas,{width:r,height:r}),t.clearRect(0,0,r,r),t.lineWidth=4;const o=(r-t.lineWidth)/2;t.strokeStyle="cyan",t.lineCap="round",t.beginPath();const i=r/2,a=-Math.PI/2;t.arc(i,i,o,a,a+n*2*Math.PI),t.stroke(),this._buttonImg.src=this._spinnerCanvas.toDataURL()}}const ut="chrome-background";async function lt(){return(await w.exports.storage.sync.get({downloadMethod:ut})).downloadMethod}const dt=async(e,t)=>{const n=await lt(),r=e.src,o=nt(r);if(f(o))throw o.left;const i=o.right;if(n==="native"){const a=rt(),s=await at({mediaSrc:r,userName:e.username,ownUserName:a});await it({link:r,folderPath:s,fileName:i},t)}else n==="chrome-background"&&await ot({filePath:`Instagram/${e.username}/${i}`,url:r},t)},ft=async(e,t)=>{let n=null;try{n=await e(),await dt(n,t)}catch(r){console.error(r);const o=n?`${r}, 
 user: ${n.username}, 
 src: ${n.src}`:r;throw w.exports.runtime.sendMessage({type:"show-notification",notification:{title:"download failed",message:o,iconUrl:C("insta-loader-icon-48")}}),r}},ae=(e,t={})=>{t={onDownloadStart:()=>{},onDownloadEnd:()=>{},...t};const n=new ct,r=n.getElement(),o=async()=>{n.downloadState="loading";const i=a=>n.loadingProgress=a;t.onDownloadStart();try{await ft(e,i),n.downloadState="success"}catch{n.downloadState="fail"}t.onDownloadEnd()};return r.addEventListener("download-request",o),r.addEventListener("mousedown",o),r};function ht(e){return O(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		>
			<a 
				href="${e}"
				style="width: fit-content; height: fit-content; cursor: pointer;"
			>
				<img 
					style="width: inherit; height: inherit;"
					src="${C("external-link-white")}"
				/>
			</a>
		</div>
	`)}function ce(e,t){let n=t;for(let r=0;r<1e3;r++){if(e(n))return m(n);const o=n.parentElement;if(!o)return d;n=o}return d}function gt(e){const t=e.split(" ");return{src:t[0],quality:parseInt(t[1])}}function pt(e){return e.split(",").map(gt)}function mt(e){const t=pt(e);let n=0;for(let r=1;r<t.length;r++)t[r].quality>t[n].quality&&(n=r);return t[n].src}function yt(e){return e.srcset.length===0?e.src:mt(e.srcset)}function ue(e){const t=e.tagName==="VIDEO"?"video":"image",n=t==="image"?yt(e):e.src;return{type:t,src:n}}function wt(e){const t=P(e);return t?ue(t):(console.log("could not find any media element in post",e),null)}function vt(e,t){if(e==="video")return null;if(e==="image")return wt(t);const n=Xe(t);if(!n)return null;const r=P(n.child);return!r||!(r instanceof HTMLImageElement)?null:ue(r)}function bt(e){const t=e.querySelector('img[alt*="profile picture"]');if(!t)return c(["could not find the authors username in this post",e]);const r=t.getAttribute("alt").replace("'s profile picture","");return h(r)}function xt(e){let t=0;return async function(){const n=await ne(100,5,e,"ul");let r=!1,o=!1,i=0;ie(n,({child:a,index:s})=>{const u=P(a);if(!u)return;const l=u.matches("video");r?(s>i?t+=l?1:0:s<i&&(t+=o?-1:0),o=l):(o=l,t=o?0:-1,r=!0),i=s})}(),()=>t}function St(){const e=document.querySelector('script[type="application/ld+json"]');if(!e)return d;try{const t=JSON.parse(e.innerHTML);if(typeof t!="object")return d;const r=(Array.isArray(t)?t:[t]).find(o=>typeof o!="object"?!1:o["@type"]==="SocialMediaPosting");return r?m(r):d}catch{return d}}function Et(e){const t=xt(e);let n=d,r=d;return async()=>{if(g(r)&&(r=A(T(e))),g(r)){console.error("could not find type of post",e);return}const o=r.value,i=vt(o,e);if(i){const p=bt(e);if(f(p)){console.warn(p.left);return}return{username:p.right,...i}}if(!Me(v())){console.warn("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");return}if(g(n)&&(n=St()),g(n)){console.error("could not find social media posting in DOM");return}const a=n.value,s=a.video,u=a.author.identifier.value,l=t();if(l<0||l>=s.length){console.warn("video index is out of bounds. somethings wrong!");return}return{type:"video",username:u,src:s[l].contentUrl}}}function le(e){const t=e.querySelector('polygon[points="20 21 12 13.44 4 21 4 3 20 3 20 21"]');if(!t)return d;const n=ce(i=>i.matches('*[role="button"]'),t);if(g(n))return d;const o=n.value.parentElement;return o==null?d:o.matches('*[role="button"]')?m(o):d}const Pt=e=>{const t=le(e);if(g(t))return null;const n=t.value,r=n.parentElement;if(!r)return null;const o=n.clientHeight+"px",i=getComputedStyle(r).getPropertyValue("padding");return{width:o,height:o,padding:i}},de=(e,t)=>{Object.assign(t.style,Pt(e))};function fe(e){const t=ae(Et(e));de(e,t);const n=O(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		></div>
	`);return n.appendChild(t),n}function It(e){const t=ht(Ke(e));return de(e,t.firstElementChild),t}function Dt(e){return new Promise(t=>{const n=T(e);if(n){t(n);return}const r=re(()=>{const i=T(e);!i||(t(i),o.disconnect())},600),o=new MutationObserver(r);o.observe(e,{childList:!0,subtree:!0})})}async function Ct(e,t,n){const r=t.style.display,o=s=>{t.style.display=s?r:"none",e.style.display=s?"none":"initial"};if(v()!=="mainFeed"){e.style.display="none";return}const i=await Dt(n);if(i==="image")return;if(i==="video"){o(!1);return}const a=n.querySelector("ul");!a||ie(a,({child:s,index:u})=>{const l=P(s);!l||o(l.matches("img"))})}function At(e){const t=le(e);if(g(t)){console.warn("trying to inject download buttons into post, but cannot find the save-button for reference");return}const r=t.value.parentElement?.parentElement;Object.assign(r?.style,{display:"flex",alignItems:"center"});const o=It(e);r.appendChild(o);const i=fe(e);r.appendChild(i),Ct(o,i,e)}async function Bt(e){if(!await ne(200,10,e,"polygon"))return c(["trying to inject download buttons into post, but cannot find any child with tag 'polygon' that was expected to be in the following element: ",e]);const n=Array.from(e.querySelectorAll("polygon"));if(n.length!==2&&console.warn(`expected to find exactly two svg-polygon elements on this page, but got a different number, namely ${n.length}`),n.length<1)return c("expected to find atleast one svg-polygon on this page that belonged to the share-button, but did not find any.");const r=n[0],o=ce(l=>l.matches("button"),r);if(g(o))return c(["found an svg-polygon element that was assumed to belong to the share-button. then we tried to find the share-button itself, but got no matches. here is the polygon element:",r]);const i=o.value,a=i.parentElement;if(!a)return c(["found the share-button, but the DOM structure is not as expected and therefore can't find find the point where to inject the download button. here is the share-button:",i]);const s=a.parentElement,u=s.lastChild;return Object.assign(u.style,{display:"flex",alignItems:"baseline"}),h({likeCommentShareBar:s,saveButtonWrapper:u})}async function Mt(e){const t=await Bt(e);if(f(t)){console.warn(t.left);return}const{saveButtonWrapper:n,likeCommentShareBar:r}=t.right,o=fe(e);n.appendChild(o);const i=r.querySelector("svg")?.width.baseVal.value;i!==void 0&&Object.assign(o.querySelector("img").style,{width:`${i}px`,height:`${i}px`})}function _t(e){v()==="mainFeed"?At(e):Mt(e)}function kt(){return document.querySelector("article")?.parentElement}function F(){const e=kt();return e?Array.from(e.children):[]}function Tt(e){const t=e.getBoundingClientRect(),n=(t.top+t.bottom)/2;return Math.abs(n-window.innerHeight/2)}function he(){const e=F();return e.length===0?null:e.reduce((n,r)=>{const o=Tt(r);return o<n[0]?[o,r]:n},[1/0,null])[1]}const ge="Enter";function pe(e){e.dispatchEvent(new CustomEvent("download-request"))}function qt(e){return e.querySelector(".download-button")}function Ot(){const e=he();if(!e){console.warn("download by shortcut: could not find the currently visible post to download");return}const t=qt(e);if(t===null){console.warn("download by shortcut: found the currently visible post, but there seems to be no download button. are you sure it's there?");return}pe(t)}document.addEventListener("keydown",e=>{e.key===ge&&Ot()});function me(){return y(location.pathname,e=>/(?<=\/stories\/.*\/)\d*/.exec(e),N,A)}const Nt=()=>y(document.querySelector("section section"),K("expected to find the story-element in a section inside another section, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."));function Ft(e){const t=e.querySelector("header");if(!t)return c(["trying to find the progress-bars in this story but could not find the header-element that was expected to be there. look for yourself:",e]);const n=t.firstChild;return n?.firstChild?h(n):c(["there appears to be not a single progress-bar in this story. it is more likely that the DOM has another shape than expected. the following element was expected to contain all progress-bars of this story",n])}function Rt(e){for(const t of e.children){const{width:n}=t.style;if(n.length!==0)return parseFloat(n)}return 0}function Lt(e){return Rt(e)<100}function Ut(){const e=Nt();if(f(e))return e;const t=Ft(e.right);if(f(t))return t;const n=y(t.right.children,Array.from,Ee(Lt));return g(n)?c("trying to find the current story-index by looking for the first progress-bar that has not finished. but it appears that every single progress-bar has completed."):h(n.value)}function ye(){const{pathname:e}=location;return e.startsWith("/stories/highlights/")?"highlight_reel":"user_reel"}function $t(){const e=window.location.href;return location.pathname.startsWith("/stories/highlights/")?jt():Vt(e)}function Ht(e,t){return K(`could not extract username from url: ${t}`)(N(e.exec(t)))}function jt(){const e=/(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/,t=y('link[href*="://www.instagram.com/"]',r=>document.querySelectorAll(r),Array.from,Pe(q(r=>r.href,r=>e.exec(r),A)));if(g(t))return c("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");const n=t.value[0];return h(n)}function Vt(e){return Ht(/(?<=stories\/).*?(?=\/)/,e)}function we(e){return parseInt(e.getAttribute("bandwidth"))}function Wt(e){return e.hasAttribute("bandwidth")}const zt=Y(we)(J),Qt=Ie(zt);function Xt(e){const t=e.querySelector("BaseURL");if(!t)return c({failure:"element does not have a child of type BaseURL from which the url could be extracted.",context:e});const n=t.textContent;return n===null?c({failure:"found a BaseURL-node but its textContent is null",context:{element:e,baseUrlNode:t}}):h(n)}function Gt(e){const t=e.getAttribute("width");if(t===null)return c({failure:'element has no "width" attribute',context:e});const n=e.getAttribute("height");return n===null?c({failure:'element has no "height" attribute',context:e}):h({width:parseInt(t),height:parseInt(n)})}function j(e){const t=[];if(e.children.length===0)return c({failure:"AdaptationSet has zero child nodes",context:e});const n=Array.from(e.children),r=n.filter(Wt);if(r.length===0)return c({failure:"none of the childnodes has a bandwidth attribute",context:e});r.length!==n.length&&t.push({failure:"some children of this AdaptationSet have no bandwidth attribute",context:e});const o=y(r,Qt),i=Xt(o);if(f(i))return i;const a=we(o);return h({success:{element:o,mediaData:{url:i.right,bandwidth:a}},warnings:t})}function Kt(e){const t=[],n=e.children[0];if(n===null)return c({failure:"XMLDocument doc does not have a MPD-node",context:e});const r=Array.from(n.querySelectorAll("Period"));if(r.length===0)return c({failure:"could not find any nodes with the 'Period' tag in MPD",context:{doc:e,mpd:n}});r.length>1&&t.push({failure:"found more than 1 Period Element",context:{doc:e,MPD:n,periodNodes:r}});const o=r[0],i=Array.from(o.querySelectorAll("AdaptationSet"));if(i.length===0)return c({failure:"found no AdaptationSets in Period Element",context:o});i.length>2&&t.push({failure:"expected 2 AdaptationSets, 1 for video and 1 for audio, but got more than 2",context:{doc:e,period:o,adaptationSets:i}});const a=i.findIndex(I=>!!(I.getAttribute("contentType")==="video"||I.hasAttribute("maxFrameRate")));if(a<0)return c({failure:"could not find any AdaptationSets that contain videos, or maybe the attributes 'contentType' and 'maxFrameRate' do not work anymore.",context:{doc:e,period:o,adaptationSets:i}});const s=i[a],u=j(s);if(f(u))return c({failure:"error while trying to extract video data",context:{videoSet:s,subFailure:u.left}});const l=u.right,p=Gt(l.success.element);if(f(p))return c({failure:"could not extract width or height from video",context:{doc:e,subContext:p.left}});const b=p.right,x=l.success.mediaData;let U=d;if(i.length>1){const I=i[a===0?1:0],B=j(I);if(Ce(B)){const Se=B.right;U=m(Se.success.mediaData)}}return h({data:{video:{...x,...b},audio:U},warnings:t})}function Yt(e){const t=new DOMParser;return De(()=>t.parseFromString(e,"text/xml"),n=>n instanceof Error?n:new Error("unknown error"))}function Jt(e){const t=Yt(e);return f(t)?t:Kt(t.right)}const Zt=e=>e.width*e.height,en=Y(Zt)(Ae(J));function V(e){return Be(en)(e)[0].url}function tn(e){if(!e.video_dash_manifest)return d;const t=Jt(e.video_dash_manifest);if(f(t))return console.error(t.left),d;const n=t.right;return n.warnings.length>0&&console.warn(n.warnings),m({type:"video",src:n.data.video.url,previewSrc:e.image_versions2.candidates[0].url})}function nn(e){if(e.video_versions){const n=tn(e);return G(n)?n.value:{type:"video",src:V(e.video_versions),previewSrc:e.image_versions2.candidates[0].url}}const t=V(e.image_versions2.candidates);return{type:"image",src:t,previewSrc:t}}let S={"X-IG-App-ID":"936619743392459"};const ve="trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.";function be(){if(!S)throw ve;return S}function rn(){return S?h(S):c(ve)}let W=d,z=!1;w.exports.runtime.onMessage.addListener(function(e){"requestBody"in e&&g(W)&&(W=m(e.requestBody)),"requestHeaders"in e&&!z&&(S=e.requestHeaders,z=!0)});const on="https://www.instagram.com/api/v1/";function R(e){return`${on}${e}`}function sn(e){return R(`feed/reels_media/?reel_ids=highlight%3A${e}`)}const an=()=>y(location.pathname,We(/(?<=\/stories\/highlights\/)\d*/));async function cn(e,t){const n=await fetch(sn(t),{credentials:"include",headers:e});return h(await n.json())}async function un(){const e=rn();if(f(e))return e;const t=an();return g(t)?c("could not find the ID of the highlights-story"):cn(e.right,t.value)}function ln(e){return R(`feed/reels_media/?reel_ids=${e}`)}async function dn(e,t){const n=await fetch(ln(t),{credentials:"include",headers:e});return h(await n.json())}async function fn(e){const t=be();return dn(t,e)}function hn(e){return R(`feed/user/${e}/username/?count=1`)}async function gn(e,t){const r=await(await fetch(hn(t),{credentials:"include",headers:e})).json();console.log("fetched user-info",r);const o=r.user;return h(o)}async function pn(e){const t=be();return gn(t,e)}async function mn(){const e=$t();if(f(e))return e;const t=e.right,n=await pn(t);if(f(n))return n;const o=n.right.pk.toString(),i=await fn(o);return f(i)?i:h(i.right.reels_media[0])}async function yn(){const e=await un();return f(e)?e:h(e.right.reels_media[0])}async function wn(){return ye()==="highlight_reel"?yn():mn()}function vn(e){const t=me();if(g(t))return c(`could not story-id in url ${location.href}`);const n=t.value,r=e.items.find(o=>o.pk===n);return r?h(r):(console.log(e.items,n),c(`could not find story-ID ${n} in any of the fetched story-items`))}function bn(e){const t=Ut();return f(t)?t:h(e.items[t.right])}function xn(e){return e.reel_type==="user_reel"?vn(e):bn(e)}function Sn(e){if(ye()!==e.reel_type)return!0;const n=me();if(g(n))return console.warn("trying to check if the current story-cache is stale by searching for the current story item, given the urls id, but could not find an id in the url. are you sure you are watching a story?"),!0;const r=n.value;return!e.items.some(o=>o.pk===r)}function En(){let e=d;return async()=>{if(g(e)||Sn(e.value)){console.log("refreshing story cache");const s=await wn();if(f(s))throw s.left;e=m(s.right)}const t=e.value,n=xn(t);if(f(n))return n;const r=n.right,o=nn(r),{username:i}=t.user;return{src:o.src,username:i}}}const Pn=()=>{let e=!1;const t=document.querySelector("video");return{keepPaused:()=>{e=!0;const o=()=>{t.paused||t.pause(),e&&window.requestAnimationFrame(o)};o()},continue:()=>{e=!1}}};function In(){const e=document.querySelector('header *[role="button"]');return e?h(e):c("could not add download-button in story. the svg for the pause/play button has not button as an ancestor")}const Dn=e=>{const t=O(`
		<div style="margin-right: 8px;"></div>
	`),n=(()=>{let u=null;return{onDownloadStart:()=>{document.querySelector("video")&&(u=Pn(),u.keepPaused())},onDownloadEnd:()=>{!u||u.continue()}}})(),r=ae(En(),n),o=24;Object.assign(r.style,{width:`${o}px`}),t.appendChild(r);const i=In();if(f(i)){console.warn(i.left);return}i.right.parentElement.insertAdjacentElement("afterbegin",t),document.addEventListener("keypress",u=>{u.key===ge&&pe(r)})};E.addEventListener("onPostAdded",e=>_t(e.detail.element));E.addEventListener("onStoryAdded",e=>Dn(e.detail.element));E.start();const xe=30;function L(e){const t=e.querySelector("section");if(t===null)return console.warn("trying to calculate distance to bottom, cannot find a 'section' element in post"),d;const n=t.getBoundingClientRect().bottom,r=window.innerHeight;return m(r-n)}function Cn(e){const t=L(e);return g(t)?!1:t.value<-xe}function An(e){const t=L(e);return g(t)?!1:t.value>xe}function Bn(){return F().find(Cn)}function Mn(){return F().reverse().find(An)}function Q(e){const t=e();if(!t){console.warn("could not find post to scroll to");return}const n=-L(t),r=window.scrollY+n;window.scrollTo({left:window.scrollX,top:r,behavior:"smooth"})}function _n(){const e={"scroll-up":"w","scroll-down":"s"};document.addEventListener("keydown",t=>{t.key===e["scroll-up"]?Q(Mn):t.key===e["scroll-down"]&&Q(Bn)})}_n();const X={a:"left",d:"right"},kn={left:"LeftChevron",right:"RightChevron"};function _(){console.warn("you've tried to navigate to the next or previous image/video but we couldn't find the button to click on")}function Tn(e){const n=v()==="stories"?document.body:he();if(!n){_();return}const r=kn[e],o=n.querySelector(`[class*="${r}"]`);if(!o){_();return}const i=o.parentElement;if(!i){_();return}i.click()}document.addEventListener("keydown",e=>{const{key:t}=e;t in X&&Tn(X[t])});console.log("### insta loader initialized ###");