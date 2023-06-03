import{f as F,i as K,a as N,n as h,s as y,p,c as d,r as l,d as f,l as c,e as J,O as Y,m as De,t as Pe,g as Z,h as Ce,j as Ae,k as Be,o as _e,q as ke,b as w,u as ee,v as Me,w as qe}from"./vendor.adf0e26f.js";const D={mainFeed:"mainFeed",post:"post",personFeed:"personFeed",stories:"stories"},v=()=>{let e=window.location.href;return e.endsWith("instagram.com/")||e.includes(".com/?")?D.mainFeed:e.includes("/p/")?D.post:e.includes("/reel/")?"reel":e.includes("/stories/")?D.stories:D.personFeed},Te=e=>e==="post"||e==="reel";v();document.querySelector("#mount_0_0_8N");const T=()=>{const e=v();return e==="personFeed"?["preview"]:e==="stories"?["story"]:["post"]},I=new EventTarget;function te(e){return e.map(t=>t.parentElement).filter(t=>t!==null)}const Oe=F(e=>e.querySelectorAll('a[href*="/p/"]'),Array.from,te);function Fe(e){if(v()==="mainFeed"){if(e.tagName=="ARTICLE")return[e];const t=Array.from(e.querySelectorAll("article"));if(t.length>0)return t}else return e.tagName=="MAIN"?[e]:Array.from(e.querySelectorAll("main"));return[]}function Ne(e){return e.tagName=="SECTION"&&Array.from(e.children).findIndex(t=>t.tagName=="HEADER")>0?[e]:te(Array.from(e.querySelectorAll("header")))}const j=(e,t)=>{I.dispatchEvent(new CustomEvent(e,{detail:{element:t}}))};class M{constructor(t,n){this.getContainedElements=n,this.elementType=t}matchesType(t){return t.includes(this.elementType)}buildEventName(t){const n=this.elementType;return`on${n[0].toUpperCase()+n.slice(1)}${t}`}onAdded(t){j(this.buildEventName("Added"),t)}onRemoved(t){j(this.buildEventName("Removed"),t)}}const Re=[new M("post",Fe),new M("preview",Oe),new M("story",Ne)];function ne(e,t){if(e.nodeType!=1)return;let n=T();for(let r of Re){if(!r.matchesType(n))continue;let o=r.getContainedElements(e),i=t?r.onAdded.bind(r):r.onRemoved.bind(r);o.forEach(i)}}function re(e){e instanceof HTMLElement&&ne(e,!0)}function Le(e){e instanceof HTMLElement&&ne(e,!1)}function He(e){e.addedNodes.forEach(re),e.removedNodes.forEach(Le)}function $e(e){e.forEach(He)}function Ue(){var e=new MutationObserver($e);e.observe(document,{childList:!0,subtree:!0})}function je(){re(document.body)}function We(){je(),Ue()}I.start=We;function ze(e){return new Promise(t=>setTimeout(t,e))}async function Ve(e,t,n){for(let r=0;r<t;r++){const o=n();if(K(o))return o.value;await ze(e)}throw"attempt was unsuccessful"}function Qe(e,t){return N(e.querySelector(t))}async function Ge(e,t,n,r){return Ve(e,t,()=>Qe(n,r))}const R=e=>{const t=document.createElement("div");return t.innerHTML=e,t.firstElementChild};function oe(e,t){return()=>{window.setTimeout(e,t)}}function L(e){return e?e[0]:null}function Xe(e){return e?y(e[0]):h}const Ke=e=>F(t=>e.exec(t),Xe);function Je(e){const t=e.parentElement;if(!t)return null;const n=t.parentElement;return n||null}function Ye(e,t){const n=L(/(?<=translateX\()[\d\.]*(?=px)/.exec(t.style.transform));return n?Math.round(parseFloat(n)/e):null}function ie(e){const t=Je(e);if(!t)return null;const n=t.getBoundingClientRect().x,r=1,o=e.children[r],i=parseFloat(getComputedStyle(o).getPropertyValue("width"));for(let a=r;a<e.children.length;a++){const s=e.children[a],u=s.getBoundingClientRect().x;if(Math.abs(n-u)>i/2)continue;const g=Ye(i,s);if(g!==null)return{index:g,child:s}}return null}function Ze(e){const t=e.querySelector("ul");if(!t)return null;const n=ie(t);return n?{list:t,...n}:null}function et(e,t){let n=-1;const r=oe(()=>{const i=ie(e);if(!i){console.warn("could not find index and child of carousel!");return}i.index!==n&&(n=i.index,t(i))},100);new MutationObserver(r).observe(e,{childList:!0,subtree:!0}),r()}function tt(e){return p(e.querySelectorAll("img"),Array.from,t=>t.find(n=>n.naturalWidth>400))}function B(e){return e.querySelector("video")??tt(e)}function se(e){const t=e.querySelectorAll('a[href*="/p/"');if(t.length===0)return null;const n=t[t.length-1].href,r=n.indexOf("/p/");if(r<0)return null;const o=r+3,i=n.indexOf("/",o);return i<0?null:n.substring(0,i+1)}function nt(e,t){let n=t;for(let r=0;r<1e3;r++){if(n.matches("li"))return!0;if(n===e)return!1;const o=n.parentElement;if(!o)return!1;n=o}return!1}function O(e){const t=B(e);return t?nt(e,t)?"collection":t.tagName==="VIDEO"?"video":"image":null}function rt(e){const t=e.querySelector("header a").href,n=/(?<=\.com\/).*(?=\/)/.exec(t);return n?n[0]:null}function ot(e,t){const n=it(t);return d(n)?n:l(e[n.right])}function it(e){const t=ae(e);if(f(t))return c("attempted to find the indicator dots of a collection, but no luck. instagram might have changed the DOM and the current method of detection doesn't work anymore");const r=t.value.children;let o=0;for(let i=1;i<r.length;i++)r[i].className.length<=r[o].className.length||(o=i);return l(o)}function ae(e){if(!("clientWidth"in e))return h;const{clientWidth:o,clientHeight:i}=e;if(o>100&&i<10&&i>4)return y(e);if(!("children"in e))return h;for(const a of e.children){const s=ae(a);if(!f(s))return s}return h}function ce(e){return parseInt(e.getAttribute("bandwidth"))}function st(e){return e.hasAttribute("bandwidth")}const at=J(ce)(Y),ct=De(at);function ut(e){const t=e.querySelector("BaseURL");if(!t)return c({failure:"element does not have a child of type BaseURL from which the url could be extracted.",context:e});const n=t.textContent;return n===null?c({failure:"found a BaseURL-node but its textContent is null",context:{element:e,baseUrlNode:t}}):l(n)}function lt(e){const t=e.getAttribute("width");if(t===null)return c({failure:'element has no "width" attribute',context:e});const n=e.getAttribute("height");return n===null?c({failure:'element has no "height" attribute',context:e}):l({width:parseInt(t),height:parseInt(n)})}function W(e){const t=[];if(e.children.length===0)return c({failure:"AdaptationSet has zero child nodes",context:e});const n=Array.from(e.children),r=n.filter(st);if(r.length===0)return c({failure:"none of the childnodes has a bandwidth attribute",context:e});r.length!==n.length&&t.push({failure:"some children of this AdaptationSet have no bandwidth attribute",context:e});const o=p(r,ct),i=ut(o);if(d(i))return i;const a=ce(o);return l({success:{element:o,mediaData:{url:i.right,bandwidth:a}},warnings:t})}function dt(e){const t=[],n=e.children[0];if(n===null)return c({failure:"XMLDocument doc does not have a MPD-node",context:e});const r=Array.from(n.querySelectorAll("Period"));if(r.length===0)return c({failure:"could not find any nodes with the 'Period' tag in MPD",context:{doc:e,mpd:n}});r.length>1&&t.push({failure:"found more than 1 Period Element",context:{doc:e,MPD:n,periodNodes:r}});const o=r[0],i=Array.from(o.querySelectorAll("AdaptationSet"));if(i.length===0)return c({failure:"found no AdaptationSets in Period Element",context:o});i.length>2&&t.push({failure:"expected 2 AdaptationSets, 1 for video and 1 for audio, but got more than 2",context:{doc:e,period:o,adaptationSets:i}});const a=i.findIndex(E=>!!(E.getAttribute("contentType")==="video"||E.hasAttribute("maxFrameRate")));if(a<0)return c({failure:"could not find any AdaptationSets that contain videos, or maybe the attributes 'contentType' and 'maxFrameRate' do not work anymore.",context:{doc:e,period:o,adaptationSets:i}});const s=i[a],u=W(s);if(d(u))return c({failure:"error while trying to extract video data",context:{videoSet:s,subFailure:u.left}});const g=u.right,m=lt(g.success.element);if(d(m))return c({failure:"could not extract width or height from video",context:{doc:e,subContext:m.left}});const b=m.right,x=g.success.mediaData;let U=h;if(i.length>1){const E=i[a===0?1:0],k=W(E);if(Z(k)){const Ee=k.right;U=y(Ee.success.mediaData)}}return l({data:{video:{...x,...b},audio:U},warnings:t})}function ft(e){const t=new DOMParser;return Pe(()=>t.parseFromString(e,"text/xml"),n=>n instanceof Error?n:new Error("unknown error"))}function ht(e){const t=ft(e);return d(t)?t:dt(t.right)}const gt=e=>e.width*e.height,mt=J(gt)(Ce(Y));function z(e){return Ae(mt)(e)[0].url}function yt(e){if(!e.video_dash_manifest)return h;const t=ht(e.video_dash_manifest);if(d(t))return console.error(t.left),h;const n=t.right;return n.warnings.length>0&&console.warn(n.warnings),y({type:"video",src:n.data.video.url,previewSrc:e.image_versions2.candidates[0].url})}function P(e){if(e.video_versions){const n=yt(e);return K(n)?n.value:{type:"video",src:z(e.video_versions),previewSrc:e.image_versions2.candidates[0].url}}const t=z(e.image_versions2.candidates);return{type:"image",src:t,previewSrc:t}}function pt(e){return e.carousel_media.map(P)}function wt(e){if(!e.items)throw console.log(e),"items not found in dataObject (see above log)";const t=e.items;if(t.length===0)throw"items are empty";const n=t[0],r=n.user.username;let o=[],i="video";if(n.video_versions&&(i="video",o.push(P(n))),n.image_versions2&&(i="image",o.push(P(n))),n.carousel_media&&(i="collection",o=pt(n)),o.length===0)throw"no media found";return{postType:i,mediaArray:o,username:r}}const vt=e=>p(e,ke(t=>encodeURIComponent(t[0])),_e,Be(([t,n])=>`${t}=${n}`),t=>t.join("&"));let S={"X-IG-App-ID":"936619743392459"};const ue="trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.";function le(){if(!S)throw ue;return S}function de(){return S?l(S):c(ue)}let C=h,V=!1;w.exports.runtime.onMessage.addListener(function(e){"requestBody"in e&&f(C)&&(C=y(e.requestBody)),"requestHeaders"in e&&!V&&(S=e.requestHeaders,V=!0)});function bt(){const e=de();return d(e)?e:f(C)?c("we have not received any requestBody from the background script so far. please check if everything is working in order."):l({headers:e.right,body:C.value})}let fe=c("trying to find the media ID, but there was no previous request. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.");function xt(){return fe}w.exports.runtime.onMessage.addListener(function(e){"mediaID"in e&&(fe=l(e.mediaID))});const St="https://www.instagram.com/api/v1/";function _(e){return`${St}${e}`}async function It(e){const{headers:t,body:n}=e,r=vt(n);try{const i=await(await fetch("https://www.instagram.com/api/graphql",{method:"POST",credentials:"include",headers:t,body:r})).json();return l(i)}catch(o){return c(o)}}function Et(e){return _(`media/${e}/info/`)}async function Dt(e){const t=xt();if(d(t))return t;const n=t.right,{headers:r}=e,o=await fetch(Et(n),{credentials:"include",headers:r});return l(await o.json())}async function Pt(){const e=bt();if(d(e))return e;const t=e.right;let n=await Dt(t);if(Z(n))return n;console.warn(n.left);const r=await It(t);if(d(r))return r;const o="xdt_api__v1__media__shortcode__web_info",i=r.right.data?.[o];return i===void 0?c({message:`'response.data.${o}' is not defined`,response:r.right}):l(i)}async function Ct(){const e=await Pt();if(d(e))throw e;const t=wt(e.right);return l(t)}function At(e){const t=e.split(" ");return{src:t[0],quality:parseInt(t[1])}}function Bt(e){return e.split(",").map(At)}function _t(e){const t=Bt(e);let n=0;for(let r=1;r<t.length;r++)t[r].quality>t[n].quality&&(n=r);return t[n].src}function kt(e){return e.srcset.length===0?e.src:_t(e.srcset)}function he(e){const t=e.tagName==="VIDEO"?"video":"image",n=t==="image"?kt(e):e.src;return{type:t,src:n}}function Mt(e){const t=B(e);return t?he(t):(console.log("could not find any media element in post",e),null)}function qt(e,t){if(e==="video")return null;if(e==="image")return Mt(t);const n=Ze(t);if(!n)return null;const r=B(n.child);return!r||!(r instanceof HTMLImageElement)?null:he(r)}const Tt=e=>{let t=null,n=null;return async()=>{if(!n&&(n=O(e),!n)){console.error("could not find type of post",e);return}const r=qt(n,e);if(r)return{username:rt(e),...r};if(!Te(v())){console.warn("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");return}if(!t){if(!se(e)){console.error("could not find href of post");return}const u=await Ct();if(d(u)){console.error(u.left);return}t=u.right}const{username:o,mediaArray:i}=t,a=n==="collection"?ot(i,e):l(i[0]);if(d(a)){console.error(a.left);return}return{username:o,...a.right}}};function ge(e){return e.map(t=>`\\${t}`).join("|")}function Ot(e){const t=ge(e);return new RegExp(`[^/]*(${t})`)}function Ft(e,t){return new RegExp(ge(e)).exec(t)!==null}const Nt=(e,t)=>n=>{const r=e.exec(n);if(r!==null){const o=r[0];return l(o)}return Ft(t,n)?c(`could not extract a filename from the url '${n}' although it appears to contain a valid file-extension.`):c(`the url '${n}' does not contain any of the expected file-extensions: ${t.join(", ")}`)},Rt=e=>Nt(Ot(e),e),Lt=Rt([".mp4",".jpg",".webp",".webm",".heic"]);function Ht(){const e=/(?<="username":")[^"]*/.exec(document.body.innerHTML);return e?e[0]:null}const $t=(e,t)=>new Promise((n,r)=>{const o=w.exports.runtime.connect({name:"chrome-downloader"});let i=null;const a=()=>{o.postMessage({type:"request-state",id:i})};o.onMessage.addListener(s=>{if(s.type==="download-id"){i=s.id,a();return}if(s.type==="error"){r(s.error),o.disconnect();return}if(s.type==="success"){n(),o.disconnect();return}if(s.type==="progress"){t(s.progress.progress),a();return}}),o.postMessage({type:"request-download",filePath:e.filePath,url:e.url})}),Ut=(e,t)=>{const n={requests:[{action:"write media by link",data:e}],time:window.performance.now()};let r=null,o=null;const i=new Promise((s,u)=>{r=s,o=u}),a=w.exports.runtime.connect({name:"disk-downloader"});return a.onMessage.addListener((s,u)=>{if(s.origin==="native host disconnect"){o(s.data);return}else if(s.origin==="native host response"){const m=s.data[0],b=m.type;if(b==="success"){r();return}else if(b==="error"){o(m.data);return}else b==="progress"&&t(m.data.progress)}s.data[0].type==="success"&&a.disconnect()}),a.postMessage(n),i},jt=(e,t,n)=>{const r=n.directoryRules||[];r.reverse();const o=n.baseDownloadDirectory||"",i=[...r,{baseDirectory:o}];for(let a of i){const s=a.username||[],u=a.downloadAs||[],g=a.baseDirectory||"",m=a.folderPath||"";if(!((s.length===0||s.includes(e))&&(u.length===0||u.includes(t))))continue;let x=null;if(g!==""&&(x=`${g}/${e}`),m!==""&&(x=m),x!==null)return x}return null};async function Wt(e){const t=await w.exports.storage.sync.get({baseDownloadDirectory:"",directoryRules:[]}),n=jt(e.userName,e.ownUserName,t);if(!n)throw"no path found. have you set a path in the extension-options?";return n}function A(e){return w.exports.runtime.getURL(`assets/icons/${e}.png`)}const Q={initial:"save",loading:"spinner-of-dots",success:"verify-sign-green",fail:"error"};class zt{constructor(){this._downloadState="initial",this._loadingProgress=0,this._spinnerCtx=null,this._spinnerCanvas=null,this._buttonImg=null,this._rootElement=null,this._rootElement=document.createElement("a"),this._rootElement.classList.add("download-button"),Object.assign(this._rootElement.style,{width:"fit-content",height:"fit-content",cursor:"pointer"}),this._buttonImg=document.createElement("img"),Object.assign(this._buttonImg.style,{width:"inherit",height:"inherit"}),this._rootElement.appendChild(this._buttonImg),this._setInitialState()}get downloadState(){return this._downloadState}set downloadState(t){this._downloadState=t,this._onDownloadStateChanged()}get loadingProgress(){return this._loadingProgress}set loadingProgress(t){this._loadingProgress=t,this._downloadState==="loading"&&this._drawSpinner()}getElement(){return this._rootElement}_setInitialState(){let n=T()[0]=="post"?"dark":"white";const r=`${Q.initial}-${n}`;this._buttonImg.src=A(r)}_onDownloadStateChanged(){const t=this._downloadState;if(t==="loading")this._spinnerCanvas||(this._spinnerCanvas=document.createElement("canvas"),this._spinnerCtx=this._spinnerCanvas.getContext("2d"),this._drawSpinner());else{this._spinnerCanvas=null,this._spinnerCtx=null;let n=Q[t];t==="initial"&&(n+=`-${T()[0]=="post"?"dark":"white"}`),this._buttonImg.src=A(n)}}_drawSpinner(){const t=this._spinnerCtx,n=this._loadingProgress,r=32;Object.assign(this._spinnerCanvas,{width:r,height:r}),t.clearRect(0,0,r,r),t.lineWidth=4;const o=(r-t.lineWidth)/2;t.strokeStyle="cyan",t.lineCap="round",t.beginPath();const i=r/2,a=-Math.PI/2;t.arc(i,i,o,a,a+n*2*Math.PI),t.stroke(),this._buttonImg.src=this._spinnerCanvas.toDataURL()}}const Vt="chrome-background";async function Qt(){return(await w.exports.storage.sync.get({downloadMethod:Vt})).downloadMethod}const Gt=async(e,t)=>{const n=await Qt(),r=e.src,o=Lt(r);if(d(o))throw o.left;const i=o.right;if(n==="native"){const a=Ht(),s=await Wt({mediaSrc:r,userName:e.username,ownUserName:a});await Ut({link:r,folderPath:s,fileName:i},t)}else n==="chrome-background"&&await $t({filePath:`Instagram/${e.username}/${i}`,url:r},t)},Xt=async(e,t)=>{let n=null;try{n=await e(),await Gt(n,t)}catch(r){console.error(r);const o=n?`${r}, 
 user: ${n.username}, 
 src: ${n.src}`:r;throw w.exports.runtime.sendMessage({type:"show-notification",notification:{title:"download failed",message:o,iconUrl:A("insta-loader-icon-48")}}),r}},me=(e,t={})=>{t={onDownloadStart:()=>{},onDownloadEnd:()=>{},...t};const n=new zt,r=n.getElement(),o=async()=>{n.downloadState="loading";const i=a=>n.loadingProgress=a;t.onDownloadStart();try{await Xt(e,i),n.downloadState="success"}catch{n.downloadState="fail"}t.onDownloadEnd()};return r.addEventListener("download-request",o),r.addEventListener("mousedown",o),r};function Kt(e){return R(`
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
					src="${A("external-link-white")}"
				/>
			</a>
		</div>
	`)}function Jt(e,t){let n=t;for(let r=0;r<1e3;r++){if(e(n))return y(n);const o=n.parentElement;if(!o)return h;n=o}return h}function Yt(e){const t=e.querySelector("section");if(!t)return console.warn("trying to find bar with like-button, save-button, etc. in order to inject the download-button, but cannot find it!"),null;const n=Array.from(t.querySelectorAll("svg"));return n.length===0?null:n[n.length-1]}const Zt=e=>{const t=Yt(e);if(!t)return null;const n=t.parentElement;if(!n)return null;const r=t.clientHeight+"px",o=getComputedStyle(n).getPropertyValue("padding");return{width:r,height:r,padding:o}},ye=(e,t)=>{Object.assign(t.style,Zt(e))};function pe(e){const t=me(Tt(e));ye(e,t);const n=R(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		></div>
	`);return n.appendChild(t),n}function en(e){const t=Kt(se(e));return ye(e,t.firstElementChild),t}function tn(e){return new Promise(t=>{const n=O(e);if(n){t(n);return}const r=oe(()=>{const i=O(e);!i||(t(i),o.disconnect())},600),o=new MutationObserver(r);o.observe(e,{childList:!0,subtree:!0})})}async function nn(e,t,n){const r=t.style.display,o=s=>{t.style.display=s?r:"none",e.style.display=s?"none":"initial"};if(v()!=="mainFeed"){e.style.display="none";return}const i=await tn(n);if(i==="image")return;if(i==="video"){o(!1);return}const a=n.querySelector("ul");!a||et(a,({child:s})=>{const u=B(s);!u||o(u.matches("img"))})}function rn(e){const t=e.querySelector("section");if(!t){console.warn("trying to inject download buttons into post, but cannot find any child with tag 'Section'");return}const n=en(e);t.appendChild(n);const r=pe(e);t.appendChild(r),nn(n,r,e)}async function on(e){if(!await Ge(200,10,e,"polygon"))return c(["trying to inject download buttons into post, but cannot find any child with tag 'polygon' that was expected to be in the following element: ",e]);const n=Array.from(e.querySelectorAll("polygon"));if(n.length!==2&&console.warn(`expected to find exactly two svg-polygon elements on this page, but got a different number, namely ${n.length}`),n.length<1)return c("expected to find atleast one svg-polygon on this page that belonged to the share-button, but did not find any.");const r=n[0],o=Jt(g=>g.matches("button"),r);if(f(o))return c(["found an svg-polygon element that was assumed to belong to the share-button. then we tried to find the share-button itself, but got no matches. here is the polygon element:",r]);const i=o.value,a=i.parentElement;if(!a)return c(["found the share-button, but the DOM structure is not as expected and therefore can't find find the point where to inject the download button. here is the share-button:",i]);const s=a.parentElement,u=s.lastChild;return Object.assign(u.style,{display:"flex",alignItems:"baseline"}),l({likeCommentShareBar:s,saveButtonWrapper:u})}async function sn(e){const t=await on(e);if(d(t)){console.warn(t.left);return}const{saveButtonWrapper:n,likeCommentShareBar:r}=t.right,o=pe(e);n.appendChild(o);const i=r.querySelector("svg")?.width.baseVal.value;i!==void 0&&Object.assign(o.querySelector("img").style,{width:`${i}px`,height:`${i}px`})}function an(e){v()==="mainFeed"?rn(e):sn(e)}function cn(){return document.querySelector("article")?.parentElement}function H(){const e=cn();return e?Array.from(e.children):[]}function un(e){const t=e.getBoundingClientRect(),n=(t.top+t.bottom)/2;return Math.abs(n-window.innerHeight/2)}function we(){const e=H();return e.length===0?null:e.reduce((n,r)=>{const o=un(r);return o<n[0]?[o,r]:n},[1/0,null])[1]}const ve="Enter";function be(e){e.dispatchEvent(new CustomEvent("download-request"))}function ln(e){return e.querySelector(".download-button")}function dn(){const e=we();if(!e){console.warn("download by shortcut: could not find the currently visible post to download");return}const t=ln(e);if(t===null){console.warn("download by shortcut: found the currently visible post, but there seems to be no download button. are you sure it's there?");return}be(t)}document.addEventListener("keydown",e=>{e.key===ve&&dn()});function xe(){return p(location.pathname,e=>/(?<=\/stories\/.*\/)\d*/.exec(e),L,N)}const fn=()=>p(document.querySelector("section section"),ee("expected to find the story-element in a section inside another section, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."));function hn(e){const t=e.querySelector("header");if(!t)return c(["trying to find the progress-bars in this story but could not find the header-element that was expected to be there. look for yourself:",e]);const n=t.firstChild;return n?.firstChild?l(n):c(["there appears to be not a single progress-bar in this story. it is more likely that the DOM has another shape than expected. the following element was expected to contain all progress-bars of this story",n])}function gn(e){for(const t of e.children){const{width:n}=t.style;if(n.length!==0)return parseFloat(n)}return 0}function mn(e){return gn(e)<100}function yn(){const e=fn();if(d(e))return e;const t=hn(e.right);if(d(t))return t;const n=p(t.right.children,Array.from,Me(mn));return f(n)?c("trying to find the current story-index by looking for the first progress-bar that has not finished. but it appears that every single progress-bar has completed."):l(n.value)}function Se(){const{pathname:e}=location;return e.startsWith("/stories/highlights/")?"highlight_reel":"user_reel"}function pn(){const e=window.location.href;return location.pathname.startsWith("/stories/highlights/")?vn():bn(e)}function wn(e,t){return ee(`could not extract username from url: ${t}`)(L(e.exec(t)))}function vn(){const e=/(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/,t=p('link[href*="://www.instagram.com/"]',r=>document.querySelectorAll(r),Array.from,qe(F(r=>r.href,r=>e.exec(r),N)));if(f(t))return c("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");const n=t.value[0];return l(n)}function bn(e){return wn(/(?<=stories\/).*?(?=\/)/,e)}function xn(e){return _(`feed/reels_media/?reel_ids=highlight%3A${e}`)}const Sn=()=>p(location.pathname,Ke(/(?<=\/stories\/highlights\/)\d*/));async function In(e,t){const n=await fetch(xn(t),{credentials:"include",headers:e});return l(await n.json())}async function En(){const e=de();if(d(e))return e;const t=Sn();return f(t)?c("could not find the ID of the highlights-story"):In(e.right,t.value)}function Dn(e){return _(`feed/reels_media/?reel_ids=${e}`)}async function Pn(e,t){const n=await fetch(Dn(t),{credentials:"include",headers:e});return l(await n.json())}async function Cn(e){const t=le();return Pn(t,e)}function An(e){return _(`feed/user/${e}/username/?count=1`)}async function Bn(e,t){const r=await(await fetch(An(t),{credentials:"include",headers:e})).json();console.log("fetched user-info",r);const o=r.user;return l(o)}async function _n(e){const t=le();return Bn(t,e)}async function kn(){const e=pn();if(d(e))return e;const t=e.right,n=await _n(t);if(d(n))return n;const o=n.right.pk.toString(),i=await Cn(o);return d(i)?i:l(i.right.reels_media[0])}async function Mn(){const e=await En();return d(e)?e:l(e.right.reels_media[0])}async function qn(){return Se()==="highlight_reel"?Mn():kn()}function Tn(e){const t=xe();if(f(t))return c(`could not story-id in url ${location.href}`);const n=t.value,r=e.items.find(o=>o.pk===n);return r?l(r):(console.log(e.items,n),c(`could not find story-ID ${n} in any of the fetched story-items`))}function On(e){const t=yn();return d(t)?t:l(e.items[t.right])}function Fn(e){return e.reel_type==="user_reel"?Tn(e):On(e)}function Nn(e){if(Se()!==e.reel_type)return!0;const n=xe();if(f(n))return console.warn("trying to check if the current story-cache is stale by searching for the current story item, given the urls id, but could not find an id in the url. are you sure you are watching a story?"),!0;const r=n.value;return!e.items.some(o=>o.pk===r)}function Rn(){let e=h;return async()=>{if(f(e)||Nn(e.value)){console.log("refreshing story cache");const s=await qn();if(d(s))throw s.left;e=y(s.right)}const t=e.value,n=Fn(t);if(d(n))return n;const r=n.right,o=P(r),{username:i}=t.user;return{src:o.src,username:i}}}const Ln=()=>{let e=!1;const t=document.querySelector("video");return{keepPaused:()=>{e=!0;const o=()=>{t.paused||t.pause(),e&&window.requestAnimationFrame(o)};o()},continue:()=>{e=!1}}};function Hn(){const e=document.querySelector("header button");return e?l(e):c("could not add download-button in story. the svg for the pause/play button has not button as an ancestor")}const $n=e=>{const t=R(`
		<div style="margin-right: 8px;"></div>
	`),n=(()=>{let u=null;return{onDownloadStart:()=>{document.querySelector("video")&&(u=Ln(),u.keepPaused())},onDownloadEnd:()=>{!u||u.continue()}}})(),r=me(Rn(),n),o=24;Object.assign(r.style,{width:`${o}px`}),t.appendChild(r);const i=Hn();if(d(i)){console.warn(i.left);return}i.right.parentElement.insertAdjacentElement("afterbegin",t),document.addEventListener("keypress",u=>{u.key===ve&&be(r)})};I.addEventListener("onPostAdded",e=>an(e.detail.element));I.addEventListener("onStoryAdded",e=>$n(e.detail.element));I.start();const Ie=30;function $(e){const t=e.querySelector("section");if(t===null)return console.warn("trying to calculate distance to bottom, cannot find a 'section' element in post"),h;const n=t.getBoundingClientRect().bottom,r=window.innerHeight;return y(r-n)}function Un(e){const t=$(e);return f(t)?!1:t.value<-Ie}function jn(e){const t=$(e);return f(t)?!1:t.value>Ie}function Wn(){return H().find(Un)}function zn(){return H().reverse().find(jn)}function G(e){const t=e();if(!t){console.warn("could not find post to scroll to");return}const n=-$(t),r=window.scrollY+n;window.scrollTo({left:window.scrollX,top:r,behavior:"smooth"})}function Vn(){const e={"scroll-up":"w","scroll-down":"s"};document.addEventListener("keydown",t=>{t.key===e["scroll-up"]?G(zn):t.key===e["scroll-down"]&&G(Wn)})}Vn();const X={a:"left",d:"right"},Qn={left:"LeftChevron",right:"RightChevron"};function q(){console.warn("you've tried to navigate to the next or previous image/video but we couldn't find the button to click on")}function Gn(e){const n=v()==="stories"?document.body:we();if(!n){q();return}const r=Qn[e],o=n.querySelector(`[class*="${r}"]`);if(!o){q();return}const i=o.parentElement;if(!i){q();return}i.click()}document.addEventListener("keydown",e=>{const{key:t}=e;t in X&&Gn(X[t])});console.log("### insta loader initialized ###");
