import{s as g,n as h,f as F,i as v,p,a as b,l as u,r as c,c as d,d as f,e as Dt,g as Z,O as tt,m as Pt,t as At,h as Bt,j as _t,k as kt,b as A,o as j,q as et,u as Mt,v as Ot,w as qt,x as Tt,y as Ft,z as Nt}from"./vendor.b289aac1.js";const I={mainFeed:"mainFeed",post:"post",personFeed:"personFeed",stories:"stories"},w=()=>{let t=window.location.href;return t.endsWith("instagram.com/")||t.includes(".com/?")?I.mainFeed:t.includes("/p/")?I.post:t.includes("/reel/")?"reel":t.includes("/stories/")?I.stories:I.personFeed},Rt=t=>t==="post"||t==="reel";w();document.querySelector("#mount_0_0_8N");const O=()=>{const t=w();return t==="personFeed"?["preview"]:t==="stories"?["story"]:["post"]};function C(t,e){let n=e;for(let r=0;r<1e3;r++){if(t(n))return g(n);const o=n.parentElement;if(!o)return h;n=o}return h}const S=new EventTarget;function nt(t){return t.map(e=>e.parentElement).filter(e=>e!==null)}const Lt=F(t=>t.querySelectorAll('a[href*="/p/"]'),Array.from,nt);function Ht(t){if(w()==="mainFeed"){if(t.tagName=="ARTICLE")return[t];const e=Array.from(t.querySelectorAll("article"));if(e.length>0)return e}else return t.tagName=="MAIN"?[t]:Array.from(t.querySelectorAll("main"));return[]}function $t(t){if(t.matches("section")&&Array.from(t.children).findIndex(e=>e.tagName=="HEADER")>0)return[t];if(t.querySelector("*[aria-label=Menu]")){const e=C(n=>n.matches("section"),t);if(v(e))return[e.value]}return p(t.querySelectorAll("header"),Array.from,nt)}const W=(t,e)=>{S.dispatchEvent(new CustomEvent(t,{detail:{element:e}}))};class k{constructor(e,n){this.getContainedElements=n,this.elementType=e}matchesType(e){return e.includes(this.elementType)}buildEventName(e){const n=this.elementType;return`on${n[0].toUpperCase()+n.slice(1)}${e}`}onAdded(e){W(this.buildEventName("Added"),e)}onRemoved(e){W(this.buildEventName("Removed"),e)}}const Ut=[new k("post",Ht),new k("preview",Lt),new k("story",$t)];function rt(t,e){if(t.nodeType!=1)return;let n=O();for(let r of Ut){if(!r.matchesType(n))continue;let o=r.getContainedElements(t),i=e?r.onAdded.bind(r):r.onRemoved.bind(r);o.forEach(i)}}function ot(t){t instanceof HTMLElement&&rt(t,!0)}function jt(t){t instanceof HTMLElement&&rt(t,!1)}function Wt(t){t.addedNodes.forEach(ot),t.removedNodes.forEach(jt)}function zt(t){t.forEach(Wt)}function Vt(){var t=new MutationObserver(zt);t.observe(document,{childList:!0,subtree:!0})}function Qt(){ot(document.body)}function Xt(){Qt(),Vt()}S.start=Xt;function Kt(t){return new Promise(e=>setTimeout(e,t))}async function Gt(t,e,n){for(let r=0;r<e;r++){const o=n();if(v(o))return o.value;await Kt(t)}throw"attempt was unsuccessful"}function Yt(t,e){return b(t.querySelector(e))}async function Jt(t,e,n,r){return Gt(t,e,()=>Yt(n,r))}const N=t=>{const e=document.createElement("div");return e.innerHTML=t,e.firstElementChild};function it(t,e){return()=>{window.setTimeout(t,e)}}function R(t){return t?t[0]:null}function Zt(t){return t?g(t[0]):h}const te=t=>F(e=>t.exec(e),Zt);function ee(t){const e=t.parentElement;if(!e)return null;const n=e.parentElement;return n||null}function ne(t,e){const n=R(/(?<=translateX\()[\d\.]*(?=px)/.exec(e.style.transform));return n?Math.round(parseFloat(n)/t):null}function st(t){const e=ee(t);if(!e)return null;const n=e.getBoundingClientRect().x,r=1,o=t.children[r],i=parseFloat(getComputedStyle(o).getPropertyValue("width"));for(let a=r;a<t.children.length;a++){const s=t.children[a],l=s.getBoundingClientRect().x;if(Math.abs(n-l)>i/2)continue;const m=ne(i,s);if(m!==null)return{index:m,child:s}}return null}function re(t){const e=t.querySelector("ul");if(!e)return null;const n=st(e);return n?{list:e,...n}:null}function oe(t,e){let n=-1;const r=it(()=>{const i=st(t);if(!i){console.warn("could not find index and child of carousel!");return}i.index!==n&&(n=i.index,e(i))},100);new MutationObserver(r).observe(t,{childList:!0,subtree:!0}),r()}function ie(t){const e=t.querySelectorAll('a[href*="/p/"');if(e.length===0)return null;const n=e[e.length-1].href,r=n.indexOf("/p/");if(r<0)return null;const o=r+3,i=n.indexOf("/",o);return i<0?null:n.substring(0,i+1)}function se(t){return p(t.querySelectorAll("img"),Array.from,e=>e.find(n=>n.naturalWidth>400))}function B(t){return t.querySelector("video")??se(t)}function ae(t,e){let n=e;for(let r=0;r<1e3;r++){if(n.matches("li"))return!0;if(n===t)return!1;const o=n.parentElement;if(!o)return!1;n=o}return!1}function q(t){const e=B(t);return e?ae(t,e)?g("collection"):g(e.tagName==="VIDEO"?"video":"image"):h}function ue(t){const e=t.querySelector('img[alt*="profile picture"]');if(!e)return u(["could not find the authors username in this post",t]);const r=e.getAttribute("alt").replace("'s profile picture","");return c(r)}function ce(t,e){const n=le(e);return d(n)?n:c(t[n.right])}function le(t){const e=at(t);if(f(e))return u("attempted to find the indicator dots of a collection, but no luck. instagram might have changed the DOM and the current method of detection doesn't work anymore");const r=e.value.children;let o=0;for(let i=1;i<r.length;i++)r[i].className.length<=r[o].className.length||(o=i);return c(o)}function at(t){if(!("clientWidth"in t))return h;const{clientWidth:o,clientHeight:i}=t;if(o>100&&i<10&&i>4)return g(t);if(!("children"in t))return h;for(const a of t.children){const s=at(a);if(!f(s))return s}return h}function de(t){const e=t.split(" ");return{src:e[0],quality:parseInt(e[1])}}function fe(t){return t.split(",").map(de)}function he(t){const e=fe(t);let n=0;for(let r=1;r<e.length;r++)e[r].quality>e[n].quality&&(n=r);return e[n].src}function me(t){return t.srcset.length===0?t.src:he(t.srcset)}function ut(t){const e=t.tagName==="VIDEO"?"video":"image",n=e==="image"?me(t):t.src;return{type:e,src:n}}function ge(t){const e=B(t);return e?ut(e):(console.log("could not find any media element in post",t),null)}function pe(t,e){if(t==="video")return null;if(t==="image")return ge(e);const n=re(e);if(!n)return null;const r=B(n.child);return!r||!(r instanceof HTMLImageElement)?null:ut(r)}function ye(t){try{return c(JSON.parse(t.innerText))}catch(e){return u(e)}}function T(t,e){if(typeof e!="object")return h;if(e===null)return h;if(Array.isArray(e))for(const n of e){const r=T(t,n);if(!f(r))return r}for(const[n,r]of Object.entries(e)){if(n!==t){const o=T(t,r);if(f(o))continue;return o}return g(r)}return h}function we(){const t="xdt_api__v1__media__shortcode__web_info",e=p(document.body.querySelectorAll("script"),l=>Array.from(l),Dt(l=>l.innerText.includes(t)));if(f(e))return u(`could not find any script on this page that contains the string "${t}"`);const n=e.value,r=ye(n);if(d(r))return r;const o=r.right,i=T(t,o);if(f(i))return u([`could not find any property with they key "${t}", weirdly enough`,o]);const s=i.value.items;return!s||!Array.isArray(s)||s.length===0?u(["the 'items' property on the webInfo object does not exist or is not an array with at least one item",o]):c(s[0])}function ct(t){return parseInt(t.getAttribute("bandwidth"))}function ve(t){return t.hasAttribute("bandwidth")}const be=Z(ct)(tt),xe=Pt(be);function Se(t){const e=t.querySelector("BaseURL");if(!e)return u({failure:"element does not have a child of type BaseURL from which the url could be extracted.",context:t});const n=e.textContent;return n===null?u({failure:"found a BaseURL-node but its textContent is null",context:{element:t,baseUrlNode:e}}):c(n)}function Ee(t){const e=t.getAttribute("width");if(e===null)return u({failure:'element has no "width" attribute',context:t});const n=t.getAttribute("height");return n===null?u({failure:'element has no "height" attribute',context:t}):c({width:parseInt(e),height:parseInt(n)})}function z(t){const e=[];if(t.children.length===0)return u({failure:"AdaptationSet has zero child nodes",context:t});const n=Array.from(t.children),r=n.filter(ve);if(r.length===0)return u({failure:"none of the childnodes has a bandwidth attribute",context:t});r.length!==n.length&&e.push({failure:"some children of this AdaptationSet have no bandwidth attribute",context:t});const o=p(r,xe),i=Se(o);if(d(i))return i;const a=ct(o);return c({success:{element:o,mediaData:{url:i.right,bandwidth:a}},warnings:e})}function Ie(t){const e=[],n=t.children[0];if(n===null)return u({failure:"XMLDocument doc does not have a MPD-node",context:t});const r=Array.from(n.querySelectorAll("Period"));if(r.length===0)return u({failure:"could not find any nodes with the 'Period' tag in MPD",context:{doc:t,mpd:n}});r.length>1&&e.push({failure:"found more than 1 Period Element",context:{doc:t,MPD:n,periodNodes:r}});const o=r[0],i=Array.from(o.querySelectorAll("AdaptationSet"));if(i.length===0)return u({failure:"found no AdaptationSets in Period Element",context:o});i.length>2&&e.push({failure:"expected 2 AdaptationSets, 1 for video and 1 for audio, but got more than 2",context:{doc:t,period:o,adaptationSets:i}});const a=i.findIndex(E=>!!(E.getAttribute("contentType")==="video"||E.hasAttribute("maxFrameRate")));if(a<0)return u({failure:"could not find any AdaptationSets that contain videos, or maybe the attributes 'contentType' and 'maxFrameRate' do not work anymore.",context:{doc:t,period:o,adaptationSets:i}});const s=i[a],l=z(s);if(d(l))return u({failure:"error while trying to extract video data",context:{videoSet:s,subFailure:l.left}});const m=l.right,y=Ee(m.success.element);if(d(y))return u({failure:"could not extract width or height from video",context:{doc:t,subContext:y.left}});const Et=y.right,It=m.success.mediaData;let U=h;if(i.length>1){const E=i[a===0?1:0],_=z(E);if(Bt(_)){const Ct=_.right;U=g(Ct.success.mediaData)}}return c({data:{video:{...It,...Et},audio:U},warnings:e})}function Ce(t){const e=new DOMParser;return At(()=>e.parseFromString(t,"text/xml"),n=>n instanceof Error?n:new Error("unknown error"))}function De(t){const e=Ce(t);return d(e)?e:Ie(e.right)}const Pe=t=>t.width*t.height,Ae=Z(Pe)(_t(tt));function V(t){return kt(Ae)(t)[0].url}function Be(t){if(!t.video_dash_manifest)return h;const e=De(t.video_dash_manifest);if(d(e))return console.error(e.left),h;const n=e.right;return n.warnings.length>0&&console.warn(n.warnings),g({type:"video",src:n.data.video.url,previewSrc:t.image_versions2.candidates[0].url})}function D(t){if(t.video_versions){const n=Be(t);return v(n)?n.value:{type:"video",src:V(t.video_versions),previewSrc:t.image_versions2.candidates[0].url}}const e=V(t.image_versions2.candidates);return{type:"image",src:e,previewSrc:e}}function _e(t){return t.carousel_media.map(D)}function ke(t){const e=t.user.username;let n=[],r="video";return t.carousel_media?(r="collection",n=_e(t)):t.video_versions?(r="video",n.push(D(t))):(r="image",n.push(D(t))),n.length===0?u("no media found"):c({postType:r,mediaArray:n,username:e})}const Me=t=>{let e=h,n=h;return async function(){if(f(n)&&(n=q(t)),f(n))return u(["could not find type of post",t]);const r=n.value,o=pe(r,t);if(o){const l=ue(t);return d(l)?l:c({username:l.right,...o})}if(!Rt(w()))return u("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");if(f(e)){const l=we();if(d(l))return l;const m=l.right,y=ke(m);if(d(y))return y;e=g(y.right)}if(f(e))return u("this fail case should never occur");const i=e.value,{mediaArray:a}=i,s=r==="collection"?ce(a,t):c(a[0]);return d(s)?s.left:c({username:i.username,...s.right})}};function lt(t){return t.map(e=>`\\${e}`).join("|")}function Oe(t){const e=lt(t);return new RegExp(`[^/]*(${e})`)}function qe(t,e){return new RegExp(lt(t)).exec(e)!==null}const Te=(t,e)=>n=>{const r=t.exec(n);if(r!==null){const o=r[0];return c(o)}return qe(e,n)?u(`could not extract a filename from the url '${n}' although it appears to contain a valid file-extension.`):u(`the url '${n}' does not contain any of the expected file-extensions: ${e.join(", ")}`)},Fe=t=>Te(Oe(t),t),Ne=Fe([".mp4",".jpg",".webp",".webm",".heic"]),Re=(t,e)=>new Promise((n,r)=>{const o=A.exports.runtime.connect({name:"chrome-downloader"});let i=null;const a=()=>{o.postMessage({type:"request-state",id:i})};o.onMessage.addListener(s=>{if(s.type==="download-id"){i=s.id,a();return}if(s.type==="error"){r(s.error),o.disconnect();return}if(s.type==="success"){n(),o.disconnect();return}if(s.type==="progress"){e(s.progress.progress),a();return}}),o.postMessage({type:"request-download",filePath:t.filePath,url:t.url})});function P(t){return A.exports.runtime.getURL(`assets/icons/${t}.png`)}const Q={initial:"save",loading:"spinner-of-dots",success:"verify-sign-green",fail:"error"};class Le{constructor(){this._downloadState="initial",this._loadingProgress=0,this._spinnerCtx=null,this._spinnerCanvas=null,this._buttonImg=null,this._rootElement=null,this._rootElement=document.createElement("a"),this._rootElement.classList.add("download-button"),Object.assign(this._rootElement.style,{width:"fit-content",height:"fit-content",cursor:"pointer"}),this._buttonImg=document.createElement("img"),Object.assign(this._buttonImg.style,{width:"inherit",height:"inherit"}),this._rootElement.appendChild(this._buttonImg),this._setInitialState()}get downloadState(){return this._downloadState}set downloadState(e){this._downloadState=e,this._onDownloadStateChanged()}get loadingProgress(){return this._loadingProgress}set loadingProgress(e){this._loadingProgress=e,this._downloadState==="loading"&&this._drawSpinner()}getElement(){return this._rootElement}_setInitialState(){let n=O()[0]=="post"?"dark":"white";const r=`${Q.initial}-${n}`;this._buttonImg.src=P(r)}_onDownloadStateChanged(){const e=this._downloadState;if(e==="loading")this._spinnerCanvas||(this._spinnerCanvas=document.createElement("canvas"),this._spinnerCtx=this._spinnerCanvas.getContext("2d"),this._drawSpinner());else{this._spinnerCanvas=null,this._spinnerCtx=null;let n=Q[e];e==="initial"&&(n+=`-${O()[0]=="post"?"dark":"white"}`),this._buttonImg.src=P(n)}}_drawSpinner(){const e=this._spinnerCtx,n=this._loadingProgress,r=32;Object.assign(this._spinnerCanvas,{width:r,height:r}),e.clearRect(0,0,r,r),e.lineWidth=4;const o=(r-e.lineWidth)/2;e.strokeStyle="cyan",e.lineCap="round",e.beginPath();const i=r/2,a=-Math.PI/2;e.arc(i,i,o,a,a+n*2*Math.PI),e.stroke(),this._buttonImg.src=this._spinnerCanvas.toDataURL()}}async function He(t){const{mediaInfo:e,loadingCallback:n}=t,r=e.src,o=Ne(r);if(d(o))return o;const i=o.right;return await Re({filePath:`Instagram/${e.username}/${i}`,url:r},n),c(void 0)}function X(t){A.exports.runtime.sendMessage({type:"show-notification",notification:{title:"download failed",message:t,iconUrl:P("insta-loader-icon-48")}})}async function $e(t){const{fetchMediaInfo:e,loadingCallback:n}=t,r=await e();if(d(r))return console.error(r.left),X("something went wrong while trying to fetch the image or video. sorry for this vague message. i'm trying to provide better messages in future releases."),!1;const o=r.right,i=await He({mediaInfo:o,loadingCallback:n});if(d(i)){const a=i.left;return console.error(a),X(`we've successfully figured out the download url and username, but the download failed anyway. not exactly sure why. i will try to include the exact reason soon. you may want to try downloading this file on your own. here's the url:
${o.src}
username: ${o.username}`),!1}return!0}const dt=t=>{const{fetchMediaInfo:e,onDownloadStart:n=j,onDownloadEnd:r=j}=t,o=new Le,i=o.getElement(),a=async()=>{o.downloadState="loading";const s=m=>{o.loadingProgress=m};n(void 0);const l=await $e({fetchMediaInfo:e,loadingCallback:s});o.downloadState=l?"success":"fail",r(l)};return i.addEventListener("download-request",a),i.addEventListener("mousedown",a),i};function Ue(t){return N(`
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
				href="${t}"
				style="width: fit-content; height: fit-content; cursor: pointer;"
			>
				<img 
					style="width: inherit; height: inherit;"
					src="${P("external-link-white")}"
				/>
			</a>
		</div>
	`)}function ft(t){const e=t.querySelector('[aria-label="Save"]');if(!e)return h;const n=C(i=>i.matches('*[role="button"]'),e);if(f(n))return h;const o=n.value.parentElement;return o==null?h:o.matches('*[role="button"]')?g(o):h}const je=t=>{const e=ft(t);if(f(e))return null;const n=e.value,r=n.parentElement;if(!r)return null;const o=n.clientHeight+"px",i=getComputedStyle(r).getPropertyValue("padding");return{width:o,height:o,padding:i}},ht=(t,e)=>{Object.assign(e.style,je(t))};function mt(t){const e=dt({fetchMediaInfo:Me(t)});ht(t,e);const n=N(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		></div>
	`);return n.appendChild(e),n}function We(t){const e=Ue(ie(t));return ht(t,e.firstElementChild),e}function ze(t){return new Promise(e=>{const n=q(t);if(v(n)){e(n.value);return}const r=it(()=>{const i=q(t);f(i)||(e(i.value),o.disconnect())},600),o=new MutationObserver(r);o.observe(t,{childList:!0,subtree:!0})})}async function Ve(t,e,n){const r=e.style.display,o=s=>{e.style.display=s?r:"none",t.style.display=s?"none":"initial"};if(w()!=="mainFeed"){t.style.display="none";return}const i=await ze(n);if(i==="image")return;if(i==="video"){o(!1);return}const a=n.querySelector("ul");!a||oe(a,({child:s,index:l})=>{const m=B(s);!m||o(m.matches("img"))})}function Qe(t){const e=ft(t);if(f(e)){console.warn("trying to inject download buttons into post, but cannot find the save-button for reference");return}const r=e.value.parentElement?.parentElement;Object.assign(r?.style,{display:"flex",alignItems:"center"});const o=We(t);r.appendChild(o);const i=mt(t);r.appendChild(i),Ve(o,i,t)}async function Xe(t){const e='aria-label*="Share"',n=await Jt(500,10,t,`[${e}]`);if(!n)return u([`did not find ${e} after 10 attempts.`]);const r=Ke(n);if(d(r))return r;const o=r.right,i=o.parentElement;if(!i)return u(["found the share-button, but the DOM structure is not as expected and therefore can't find find the point where to inject the download button. here is the share-button:",o]);const a=i.parentElement,s=a.lastChild;return Object.assign(s.style,{display:"flex",alignItems:"baseline"}),c({likeCommentShareBar:a,saveButtonWrapper:s})}function Ke(t){const e=C(r=>r.matches('[role="button"]'),t);if(v(e))return c(e.value);const n=C(r=>r.matches('[type="button"]'),t);return v(n)?c(n.value):u(["didn't find any parent with a role of button. here's the starting point:",t])}async function Ge(t){const e=await Xe(t);if(d(e)){console.warn(e.left);return}const{saveButtonWrapper:n,likeCommentShareBar:r}=e.right,o=mt(t);n.appendChild(o);const i=r.querySelector("svg")?.width.baseVal.value;i!==void 0&&Object.assign(o.querySelector("img").style,{width:`${i}px`,height:`${i}px`})}function Ye(t){w()==="mainFeed"?Qe(t):Ge(t)}function Je(){return document.querySelector("article")?.parentElement}function L(){const t=Je();return t?Array.from(t.children):[]}function Ze(t){const e=t.getBoundingClientRect(),n=(e.top+e.bottom)/2;return Math.abs(n-window.innerHeight/2)}function gt(){const t=L();return t.length===0?null:t.reduce((n,r)=>{const o=Ze(r);return o<n[0]?[o,r]:n},[1/0,null])[1]}const pt="Enter";function yt(t){t.dispatchEvent(new CustomEvent("download-request"))}function tn(t){return t.querySelector(".download-button")}function en(){const t=gt();if(!t){console.warn("download by shortcut: could not find the currently visible post to download");return}const e=tn(t);if(e===null){console.warn("download by shortcut: found the currently visible post, but there seems to be no download button. are you sure it's there?");return}yt(e)}document.addEventListener("keydown",t=>{t.key===pt&&en()});function wt(){return p(location.pathname,t=>/(?<=\/stories\/.*\/)\d*/.exec(t),R,b)}function nn(){return p(document.querySelectorAll("section"),t=>Array.from(t),qt(t=>({section:t,size:t.offsetWidth*t.offsetHeight})),t=>(t=t.slice(),t.sort((e,n)=>n.size-e.size),t),Ot(0),Mt(({section:t})=>t),et(()=>u("expected to find the story-element in the largest section element on this page, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."),t=>c(t)))}function rn(t){const e=t.querySelector(".download-button"),n=function(){let r=e;for(let o=0;o<20;o++){if(r.offsetWidth>200)return c(r);const i=b(r?.parentElement);if(f(i))break;r=i.value}return u("starting from the download button, we attempted to find an ancestor with a width greater than 200 pixels, but had no success.")}();return d(n)?n:p(n.right,r=>r.parentElement?.firstElementChild,b,et(()=>u("found an ancestor of the download button with the expected width, but not the expected DOM structure"),c))}function on(t){return t.childElementCount>0}function sn(){const t=nn();if(d(t))return t;const e=rn(t.right);if(d(e))return e;const n=p(e.right.children,Array.from,Tt(on));return f(n)?u("trying to find the current story-index by looking for the first progress-bar that has not finished. but it appears that every single progress-bar has completed."):c(n.value)}function vt(){const{pathname:t}=location;return t.startsWith("/stories/highlights/")?"highlight_reel":"user_reel"}function an(){const t=window.location.href;return location.pathname.startsWith("/stories/highlights/")?cn():ln(t)}function un(t,e){return Ft(`could not extract username from url: ${e}`)(R(t.exec(e)))}function cn(){const t=/(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/,e=p('link[href*="://www.instagram.com/"]',r=>document.querySelectorAll(r),Array.from,Nt(F(r=>r.href,r=>t.exec(r),b)));if(f(e))return u("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");const n=e.value[0];return c(n)}function ln(t){return un(/(?<=stories\/).*?(?=\/)/,t)}let x={"X-IG-App-ID":"936619743392459"};const bt="trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.";function xt(){if(!x)throw bt;return x}function dn(){return x?c(x):u(bt)}let K=h,G=!1;A.exports.runtime.onMessage.addListener(function(t){"requestBody"in t&&f(K)&&(K=g(t.requestBody)),"requestHeaders"in t&&!G&&(x=t.requestHeaders,G=!0)});const fn="https://www.instagram.com/api/v1/";function H(t){return`${fn}${t}`}function hn(t){return H(`feed/reels_media/?reel_ids=highlight%3A${t}`)}const mn=()=>p(location.pathname,te(/(?<=\/stories\/highlights\/)\d*/));async function gn(t,e){const n=await fetch(hn(e),{credentials:"include",headers:t});return c(await n.json())}async function pn(){const t=dn();if(d(t))return t;const e=mn();return f(e)?u("could not find the ID of the highlights-story"):gn(t.right,e.value)}function yn(t){return H(`feed/reels_media/?reel_ids=${t}`)}async function wn(t,e){const n=await fetch(yn(e),{credentials:"include",headers:t});return c(await n.json())}async function vn(t){const e=xt();return wn(e,t)}function bn(t){return H(`feed/user/${t}/username/?count=1`)}async function xn(t,e){const r=await(await fetch(bn(e),{credentials:"include",headers:t})).json();console.log("fetched user-info",r);const o=r.user;return c(o)}async function Sn(t){const e=xt();return xn(e,t)}async function En(){const t=an();if(d(t))return t;const e=t.right,n=await Sn(e);if(d(n))return n;const o=n.right.pk.toString(),i=await vn(o);return d(i)?i:c(i.right.reels_media[0])}async function In(){const t=await pn();return d(t)?t:c(t.right.reels_media[0])}async function Cn(){return vt()==="highlight_reel"?In():En()}function Dn(t){const e=wt();if(f(e))return u(`could not story-id in url ${location.href}`);const n=e.value,r=t.items.find(o=>o.pk===n);return r?c(r):(console.log(t.items,n),u(`could not find story-ID ${n} in any of the fetched story-items`))}function Pn(t){const e=sn();return d(e)?e:c(t.items[e.right])}function An(t){return t.reel_type==="user_reel"?Dn(t):Pn(t)}function Bn(t){if(vt()!==t.reel_type)return!0;const n=wt();if(f(n))return console.warn("trying to check if the current story-cache is stale by searching for the current story item, given the urls id, but could not find an id in the url. are you sure you are watching a story?"),!0;const r=n.value;return!t.items.some(o=>o.pk===r)}function _n(){let t=h;return async()=>{if(f(t)||Bn(t.value)){console.log("refreshing story cache");const a=await Cn();if(d(a))return a;t=g(a.right)}const e=t.value,n=An(e);if(d(n))return n;const r=n.right,o=D(r),{username:i}=e.user;return c({src:o.src,username:i})}}const kn=t=>{const e=N(`
		<div style="margin-right: 8px;"></div>
	`),n=function(){let l=null;return{onDownloadStart:()=>{document.querySelector("video")&&(l=On(),l.keepPaused())},onDownloadEnd:m=>{!l||l.continue()}}}(),r=dt({fetchMediaInfo:_n(),...n}),o=24;Object.assign(r.style,{width:`${o}px`}),e.appendChild(r);const i=Mn(t);if(d(i)){console.warn(i.left);return}const s=i.right.parentElement;s?s.insertAdjacentElement("afterbegin",e):console.error("the playButton has no parentElement."),document.addEventListener("keypress",l=>{l.key===pt&&yt(r)})};function Mn(t){const e=t.querySelector("*[aria-label=Play]")??t.querySelector("*[aria-label=Pause]");if(!e)return u("could not add download-button in story. the svg for the pause/play button has no button as an ancestor");const n=e.parentElement?.parentElement;return n?(n.getAttribute("role")!=="button"&&console.warn("the grandparent of this playButton has no role attribute with value 'button'. this is unexpected, but not necessarily breaking"),c(n)):u("found the playbutton but it has no grandparent which is very weird and will probably never ever happen")}function On(){let t=!1;const e=document.querySelector("video");return{keepPaused:()=>{t=!0;const o=()=>{e&&!e.paused&&e.pause(),t&&window.requestAnimationFrame(o)};o()},continue:()=>{t=!1}}}S.addEventListener("onPostAdded",t=>Ye(t.detail.element));S.addEventListener("onStoryAdded",t=>kn(t.detail.element));S.start();const St=30;function $(t){const e=t.querySelector("section");if(e===null)return console.warn("trying to calculate distance to bottom, cannot find a 'section' element in post"),h;const n=e.getBoundingClientRect().bottom,r=window.innerHeight;return g(r-n)}function qn(t){const e=$(t);return f(e)?!1:e.value<-St}function Tn(t){const e=$(t);return f(e)?!1:e.value>St}function Fn(){return L().find(qn)}function Nn(){return L().reverse().find(Tn)}function Y(t){const e=t();if(!e){console.warn("could not find post to scroll to");return}const n=-$(e),r=window.scrollY+n;window.scrollTo({left:window.scrollX,top:r,behavior:"smooth"})}function Rn(){const t={"scroll-up":"w","scroll-down":"s"};document.addEventListener("keydown",e=>{e.key===t["scroll-up"]?Y(Nn):e.key===t["scroll-down"]&&Y(Fn)})}Rn();const J={a:"left",d:"right"},Ln={left:"LeftChevron",right:"RightChevron"};function M(){console.warn("you've tried to navigate to the next or previous image/video but we couldn't find the button to click on")}function Hn(t){const n=w()==="stories"?document.body:gt();if(!n){M();return}const r=Ln[t],o=n.querySelector(`[class*="${r}"]`);if(!o){M();return}const i=o.parentElement;if(!i){M();return}i.click()}document.addEventListener("keydown",t=>{const{key:e}=t;e in J&&Hn(J[e])});console.log("### insta loader initialized ###");
