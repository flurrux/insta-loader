import{s as g,n as h,f as q,i as D,p,a as v,l as s,r as c,c as d,d as f,e as Dt,g as Z,O as tt,m as Pt,t as At,h as Bt,j as _t,k as kt,b as P,o as j,q as et,u as Mt,v as Ot,w as Tt,x as qt,y as Ft,z as Nt}from"./vendor.b289aac1.js";const E={mainFeed:"mainFeed",post:"post",personFeed:"personFeed",stories:"stories"},w=()=>{let t=window.location.href;return t.endsWith("instagram.com/")||t.includes(".com/?")?E.mainFeed:t.includes("/p/")?E.post:t.includes("/reel/")?"reel":t.includes("/stories/")?E.stories:E.personFeed},Rt=t=>t==="post"||t==="reel";w();document.querySelector("#mount_0_0_8N");const M=()=>{const t=w();return t==="personFeed"?["preview"]:t==="stories"?["story"]:["post"]};function F(t,e){let n=e;for(let r=0;r<1e3;r++){if(t(n))return g(n);const o=n.parentElement;if(!o)return h;n=o}return h}const x=new EventTarget;function nt(t){return t.map(e=>e.parentElement).filter(e=>e!==null)}const Ht=q(t=>t.querySelectorAll('a[href*="/p/"]'),Array.from,nt);function Lt(t){if(w()==="mainFeed"){if(t.tagName=="ARTICLE")return[t];const e=Array.from(t.querySelectorAll("article"));if(e.length>0)return e}else return t.tagName=="MAIN"?[t]:Array.from(t.querySelectorAll("main"));return[]}function $t(t){if(t.matches("section")&&Array.from(t.children).findIndex(e=>e.tagName=="HEADER")>0)return[t];if(t.querySelector("*[aria-label=Menu]")){const e=F(n=>n.matches("section"),t);if(D(e))return[e.value]}return p(t.querySelectorAll("header"),Array.from,nt)}const W=(t,e)=>{x.dispatchEvent(new CustomEvent(t,{detail:{element:e}}))};class _{constructor(e,n){this.getContainedElements=n,this.elementType=e}matchesType(e){return e.includes(this.elementType)}buildEventName(e){const n=this.elementType;return`on${n[0].toUpperCase()+n.slice(1)}${e}`}onAdded(e){W(this.buildEventName("Added"),e)}onRemoved(e){W(this.buildEventName("Removed"),e)}}const Ut=[new _("post",Lt),new _("preview",Ht),new _("story",$t)];function rt(t,e){if(t.nodeType!=1)return;let n=M();for(let r of Ut){if(!r.matchesType(n))continue;let o=r.getContainedElements(t),i=e?r.onAdded.bind(r):r.onRemoved.bind(r);o.forEach(i)}}function ot(t){t instanceof HTMLElement&&rt(t,!0)}function jt(t){t instanceof HTMLElement&&rt(t,!1)}function Wt(t){t.addedNodes.forEach(ot),t.removedNodes.forEach(jt)}function zt(t){t.forEach(Wt)}function Vt(){var t=new MutationObserver(zt);t.observe(document,{childList:!0,subtree:!0})}function Qt(){ot(document.body)}function Xt(){Qt(),Vt()}x.start=Xt;function Kt(t){return new Promise(e=>setTimeout(e,t))}async function Gt(t,e,n){for(let r=0;r<e;r++){const o=n();if(D(o))return o.value;await Kt(t)}throw"attempt was unsuccessful"}function Yt(t,e){return v(t.querySelector(e))}async function Jt(t,e,n,r){return Gt(t,e,()=>Yt(n,r))}const N=t=>{const e=document.createElement("div");return e.innerHTML=t,e.firstElementChild};function it(t,e){return()=>{window.setTimeout(t,e)}}function R(t){return t?t[0]:null}function Zt(t){return t?g(t[0]):h}const te=t=>q(e=>t.exec(e),Zt);function ee(t){const e=t.parentElement;if(!e)return null;const n=e.parentElement;return n||null}function ne(t,e){const n=R(/(?<=translateX\()[\d\.]*(?=px)/.exec(e.style.transform));return n?Math.round(parseFloat(n)/t):null}function st(t){const e=ee(t);if(!e)return null;const n=e.getBoundingClientRect().x,r=1,o=t.children[r],i=parseFloat(getComputedStyle(o).getPropertyValue("width"));for(let a=r;a<t.children.length;a++){const u=t.children[a],l=u.getBoundingClientRect().x;if(Math.abs(n-l)>i/2)continue;const m=ne(i,u);if(m!==null)return{index:m,child:u}}return null}function re(t){const e=t.querySelector("ul");if(!e)return null;const n=st(e);return n?{list:e,...n}:null}function oe(t,e){let n=-1;const r=it(()=>{const i=st(t);if(!i){console.warn("could not find index and child of carousel!");return}i.index!==n&&(n=i.index,e(i))},100);new MutationObserver(r).observe(t,{childList:!0,subtree:!0}),r()}function ie(t){const e=t.querySelectorAll('a[href*="/p/"');if(e.length===0)return null;const n=e[e.length-1].href,r=n.indexOf("/p/");if(r<0)return null;const o=r+3,i=n.indexOf("/",o);return i<0?null:n.substring(0,i+1)}function se(t){return p(t.querySelectorAll("img"),Array.from,e=>e.find(n=>n.naturalWidth>400))}function A(t){return t.querySelector("video")??se(t)}function ae(t,e){let n=e;for(let r=0;r<1e3;r++){if(n.matches("li"))return!0;if(n===t)return!1;const o=n.parentElement;if(!o)return!1;n=o}return!1}function O(t){const e=A(t);return e?ae(t,e)?g("collection"):g(e.tagName==="VIDEO"?"video":"image"):h}function ue(t){const e=t.querySelector('img[alt*="profile picture"]');if(!e)return s(["could not find the authors username in this post",t]);const r=e.getAttribute("alt").replace("'s profile picture","");return c(r)}function ce(t,e){const n=le(e);return d(n)?n:c(t[n.right])}function le(t){const e=at(t);if(f(e))return s("attempted to find the indicator dots of a collection, but no luck. instagram might have changed the DOM and the current method of detection doesn't work anymore");const r=e.value.children;let o=0;for(let i=1;i<r.length;i++)r[i].className.length<=r[o].className.length||(o=i);return c(o)}function at(t){if(!("clientWidth"in t))return h;const{clientWidth:o,clientHeight:i}=t;if(o>100&&i<10&&i>4)return g(t);if(!("children"in t))return h;for(const a of t.children){const u=at(a);if(!f(u))return u}return h}function de(t){const e=t.split(" ");return{src:e[0],quality:parseInt(e[1])}}function fe(t){return t.split(",").map(de)}function he(t){const e=fe(t);let n=0;for(let r=1;r<e.length;r++)e[r].quality>e[n].quality&&(n=r);return e[n].src}function me(t){return t.srcset.length===0?t.src:he(t.srcset)}function ut(t){const e=t.tagName==="VIDEO"?"video":"image",n=e==="image"?me(t):t.src;return{type:e,src:n}}function ge(t){const e=A(t);return e?ut(e):(console.log("could not find any media element in post",t),null)}function pe(t,e){if(t==="video")return null;if(t==="image")return ge(e);const n=re(e);if(!n)return null;const r=A(n.child);return!r||!(r instanceof HTMLImageElement)?null:ut(r)}function ye(t){try{return c(JSON.parse(t.innerText))}catch(e){return s(e)}}function T(t,e){if(typeof e!="object")return h;if(e===null)return h;if(Array.isArray(e))for(const n of e){const r=T(t,n);if(!f(r))return r}for(const[n,r]of Object.entries(e)){if(n!==t){const o=T(t,r);if(f(o))continue;return o}return g(r)}return h}function we(){const t="xdt_api__v1__media__shortcode__web_info",e=p(document.body.querySelectorAll("script"),l=>Array.from(l),Dt(l=>l.innerText.includes(t)));if(f(e))return s(`could not find any script on this page that contains the string "${t}"`);const n=e.value,r=ye(n);if(d(r))return r;const o=r.right,i=T(t,o);if(f(i))return s([`could not find any property with they key "${t}", weirdly enough`,o]);const u=i.value.items;return!u||!Array.isArray(u)||u.length===0?s(["the 'items' property on the webInfo object does not exist or is not an array with at least one item",o]):c(u[0])}function ct(t){return parseInt(t.getAttribute("bandwidth"))}function ve(t){return t.hasAttribute("bandwidth")}const be=Z(ct)(tt),xe=Pt(be);function Se(t){const e=t.querySelector("BaseURL");if(!e)return s({failure:"element does not have a child of type BaseURL from which the url could be extracted.",context:t});const n=e.textContent;return n===null?s({failure:"found a BaseURL-node but its textContent is null",context:{element:t,baseUrlNode:e}}):c(n)}function Ee(t){const e=t.getAttribute("width");if(e===null)return s({failure:'element has no "width" attribute',context:t});const n=t.getAttribute("height");return n===null?s({failure:'element has no "height" attribute',context:t}):c({width:parseInt(e),height:parseInt(n)})}function z(t){const e=[];if(t.children.length===0)return s({failure:"AdaptationSet has zero child nodes",context:t});const n=Array.from(t.children),r=n.filter(ve);if(r.length===0)return s({failure:"none of the childnodes has a bandwidth attribute",context:t});r.length!==n.length&&e.push({failure:"some children of this AdaptationSet have no bandwidth attribute",context:t});const o=p(r,xe),i=Se(o);if(d(i))return i;const a=ct(o);return c({success:{element:o,mediaData:{url:i.right,bandwidth:a}},warnings:e})}function Ie(t){const e=[],n=t.children[0];if(n===null)return s({failure:"XMLDocument doc does not have a MPD-node",context:t});const r=Array.from(n.querySelectorAll("Period"));if(r.length===0)return s({failure:"could not find any nodes with the 'Period' tag in MPD",context:{doc:t,mpd:n}});r.length>1&&e.push({failure:"found more than 1 Period Element",context:{doc:t,MPD:n,periodNodes:r}});const o=r[0],i=Array.from(o.querySelectorAll("AdaptationSet"));if(i.length===0)return s({failure:"found no AdaptationSets in Period Element",context:o});i.length>2&&e.push({failure:"expected 2 AdaptationSets, 1 for video and 1 for audio, but got more than 2",context:{doc:t,period:o,adaptationSets:i}});const a=i.findIndex(S=>!!(S.getAttribute("contentType")==="video"||S.hasAttribute("maxFrameRate")));if(a<0)return s({failure:"could not find any AdaptationSets that contain videos, or maybe the attributes 'contentType' and 'maxFrameRate' do not work anymore.",context:{doc:t,period:o,adaptationSets:i}});const u=i[a],l=z(u);if(d(l))return s({failure:"error while trying to extract video data",context:{videoSet:u,subFailure:l.left}});const m=l.right,y=Ee(m.success.element);if(d(y))return s({failure:"could not extract width or height from video",context:{doc:t,subContext:y.left}});const Et=y.right,It=m.success.mediaData;let U=h;if(i.length>1){const S=i[a===0?1:0],B=z(S);if(Bt(B)){const Ct=B.right;U=g(Ct.success.mediaData)}}return c({data:{video:{...It,...Et},audio:U},warnings:e})}function Ce(t){const e=new DOMParser;return At(()=>e.parseFromString(t,"text/xml"),n=>n instanceof Error?n:new Error("unknown error"))}function De(t){const e=Ce(t);return d(e)?e:Ie(e.right)}const Pe=t=>t.width*t.height,Ae=Z(Pe)(_t(tt));function V(t){return kt(Ae)(t)[0].url}function Be(t){if(!t.video_dash_manifest)return h;const e=De(t.video_dash_manifest);if(d(e))return console.error(e.left),h;const n=e.right;return n.warnings.length>0&&console.warn(n.warnings),g({type:"video",src:n.data.video.url,previewSrc:t.image_versions2.candidates[0].url})}function I(t){if(t.video_versions){const n=Be(t);return D(n)?n.value:{type:"video",src:V(t.video_versions),previewSrc:t.image_versions2.candidates[0].url}}const e=V(t.image_versions2.candidates);return{type:"image",src:e,previewSrc:e}}function _e(t){return t.carousel_media.map(I)}function ke(t){const e=t.user.username;let n=[],r="video";return t.carousel_media?(r="collection",n=_e(t)):t.video_versions?(r="video",n.push(I(t))):(r="image",n.push(I(t))),n.length===0?s("no media found"):c({postType:r,mediaArray:n,username:e})}const Me=t=>{let e=h,n=h;return async function(){if(f(n)&&(n=O(t)),f(n))return s(["could not find type of post",t]);const r=n.value,o=pe(r,t);if(o){const l=ue(t);return d(l)?l:c({username:l.right,...o})}if(!Rt(w()))return s("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");if(f(e)){const l=we();if(d(l))return l;const m=l.right,y=ke(m);if(d(y))return y;e=g(y.right)}if(f(e))return s("this fail case should never occur");const i=e.value,{mediaArray:a}=i,u=r==="collection"?ce(a,t):c(a[0]);return d(u)?u.left:c({username:i.username,...u.right})}};function lt(t){return t.map(e=>`\\${e}`).join("|")}function Oe(t){const e=lt(t);return new RegExp(`[^/]*(${e})`)}function Te(t,e){return new RegExp(lt(t)).exec(e)!==null}const qe=(t,e)=>n=>{const r=t.exec(n);if(r!==null){const o=r[0];return c(o)}return Te(e,n)?s(`could not extract a filename from the url '${n}' although it appears to contain a valid file-extension.`):s(`the url '${n}' does not contain any of the expected file-extensions: ${e.join(", ")}`)},Fe=t=>qe(Oe(t),t),Ne=Fe([".mp4",".jpg",".webp",".webm",".heic"]),Re=(t,e)=>new Promise((n,r)=>{const o=P.exports.runtime.connect({name:"chrome-downloader"});let i=null;const a=()=>{o.postMessage({type:"request-state",id:i})};o.onMessage.addListener(u=>{if(u.type==="download-id"){i=u.id,a();return}if(u.type==="error"){r(u.error),o.disconnect();return}if(u.type==="success"){n(),o.disconnect();return}if(u.type==="progress"){e(u.progress.progress),a();return}}),o.postMessage({type:"request-download",filePath:t.filePath,url:t.url})});function C(t){return P.exports.runtime.getURL(`assets/icons/${t}.png`)}const Q={initial:"save",loading:"spinner-of-dots",success:"verify-sign-green",fail:"error"};class He{constructor(){this._downloadState="initial",this._loadingProgress=0,this._spinnerCtx=null,this._spinnerCanvas=null,this._buttonImg=null,this._rootElement=null,this._rootElement=document.createElement("a"),this._rootElement.classList.add("download-button"),Object.assign(this._rootElement.style,{width:"fit-content",height:"fit-content",cursor:"pointer"}),this._buttonImg=document.createElement("img"),Object.assign(this._buttonImg.style,{width:"inherit",height:"inherit"}),this._rootElement.appendChild(this._buttonImg),this._setInitialState()}get downloadState(){return this._downloadState}set downloadState(e){this._downloadState=e,this._onDownloadStateChanged()}get loadingProgress(){return this._loadingProgress}set loadingProgress(e){this._loadingProgress=e,this._downloadState==="loading"&&this._drawSpinner()}getElement(){return this._rootElement}_setInitialState(){let n=M()[0]=="post"?"dark":"white";const r=`${Q.initial}-${n}`;this._buttonImg.src=C(r)}_onDownloadStateChanged(){const e=this._downloadState;if(e==="loading")this._spinnerCanvas||(this._spinnerCanvas=document.createElement("canvas"),this._spinnerCtx=this._spinnerCanvas.getContext("2d"),this._drawSpinner());else{this._spinnerCanvas=null,this._spinnerCtx=null;let n=Q[e];e==="initial"&&(n+=`-${M()[0]=="post"?"dark":"white"}`),this._buttonImg.src=C(n)}}_drawSpinner(){const e=this._spinnerCtx,n=this._loadingProgress,r=32;Object.assign(this._spinnerCanvas,{width:r,height:r}),e.clearRect(0,0,r,r),e.lineWidth=4;const o=(r-e.lineWidth)/2;e.strokeStyle="cyan",e.lineCap="round",e.beginPath();const i=r/2,a=-Math.PI/2;e.arc(i,i,o,a,a+n*2*Math.PI),e.stroke(),this._buttonImg.src=this._spinnerCanvas.toDataURL()}}async function Le(t){const{mediaInfo:e,loadingCallback:n}=t,r=e.src,o=Ne(r);if(d(o))return o;const i=o.right;return await Re({filePath:`Instagram/${e.username}/${i}`,url:r},n),c(void 0)}function X(t){P.exports.runtime.sendMessage({type:"show-notification",notification:{title:"download failed",message:t,iconUrl:C("insta-loader-icon-48")}})}async function $e(t){const{fetchMediaInfo:e,loadingCallback:n}=t,r=await e();if(d(r))return console.error(r.left),X("something went wrong while trying to fetch the image or video. sorry for this vague message. i'm trying to provide better messages in future releases."),!1;const o=r.right,i=await Le({mediaInfo:o,loadingCallback:n});if(d(i)){const a=i.left;return console.error(a),X(`we've successfully figured out the download url and username, but the download failed anyway. not exactly sure why. i will try to include the exact reason soon. you may want to try downloading this file on your own. here's the url:
${o.src}
username: ${o.username}`),!1}return!0}const dt=t=>{const{fetchMediaInfo:e,onDownloadStart:n=j,onDownloadEnd:r=j}=t,o=new He,i=o.getElement(),a=async()=>{o.downloadState="loading";const u=m=>{o.loadingProgress=m};n(void 0);const l=await $e({fetchMediaInfo:e,loadingCallback:u});o.downloadState=l?"success":"fail",r(l)};return i.addEventListener("download-request",a),i.addEventListener("mousedown",a),i};function Ue(t){return N(`
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
					src="${C("external-link-white")}"
				/>
			</a>
		</div>
	`)}function ft(t){const e=t.querySelector('polygon[points="20 21 12 13.44 4 21 4 3 20 3 20 21"]');if(!e)return h;const n=F(i=>i.matches('*[role="button"]'),e);if(f(n))return h;const o=n.value.parentElement;return o==null?h:o.matches('*[role="button"]')?g(o):h}const je=t=>{const e=ft(t);if(f(e))return null;const n=e.value,r=n.parentElement;if(!r)return null;const o=n.clientHeight+"px",i=getComputedStyle(r).getPropertyValue("padding");return{width:o,height:o,padding:i}},ht=(t,e)=>{Object.assign(e.style,je(t))};function mt(t){const e=dt({fetchMediaInfo:Me(t)});ht(t,e);const n=N(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		></div>
	`);return n.appendChild(e),n}function We(t){const e=Ue(ie(t));return ht(t,e.firstElementChild),e}function ze(t){return new Promise(e=>{const n=O(t);if(D(n)){e(n.value);return}const r=it(()=>{const i=O(t);f(i)||(e(i.value),o.disconnect())},600),o=new MutationObserver(r);o.observe(t,{childList:!0,subtree:!0})})}async function Ve(t,e,n){const r=e.style.display,o=u=>{e.style.display=u?r:"none",t.style.display=u?"none":"initial"};if(w()!=="mainFeed"){t.style.display="none";return}const i=await ze(n);if(i==="image")return;if(i==="video"){o(!1);return}const a=n.querySelector("ul");!a||oe(a,({child:u,index:l})=>{const m=A(u);!m||o(m.matches("img"))})}function Qe(t){const e=ft(t);if(f(e)){console.warn("trying to inject download buttons into post, but cannot find the save-button for reference");return}const r=e.value.parentElement?.parentElement;Object.assign(r?.style,{display:"flex",alignItems:"center"});const o=We(t);r.appendChild(o);const i=mt(t);r.appendChild(i),Ve(o,i,t)}async function Xe(t){const e=await Jt(500,10,t,'[aria-label="Share"]');if(!e)return s(['did not find aria-label="Share" are 10 attempts.']);if(!e)return s([`couldn't find an element with the aria-label="Share"`]);const n=F(u=>u.matches('[role="button"]'),e);if(f(n))return s(["didn't find any parent with a role of button. here's the starting point:",e]);const r=n.value,o=r.parentElement;if(!o)return s(["found the share-button, but the DOM structure is not as expected and therefore can't find find the point where to inject the download button. here is the share-button:",r]);const i=o.parentElement,a=i.lastChild;return Object.assign(a.style,{display:"flex",alignItems:"baseline"}),c({likeCommentShareBar:i,saveButtonWrapper:a})}async function Ke(t){const e=await Xe(t);if(d(e)){console.warn(e.left);return}const{saveButtonWrapper:n,likeCommentShareBar:r}=e.right,o=mt(t);n.appendChild(o);const i=r.querySelector("svg")?.width.baseVal.value;i!==void 0&&Object.assign(o.querySelector("img").style,{width:`${i}px`,height:`${i}px`})}function Ge(t){w()==="mainFeed"?Qe(t):Ke(t)}function Ye(){return document.querySelector("article")?.parentElement}function H(){const t=Ye();return t?Array.from(t.children):[]}function Je(t){const e=t.getBoundingClientRect(),n=(e.top+e.bottom)/2;return Math.abs(n-window.innerHeight/2)}function gt(){const t=H();return t.length===0?null:t.reduce((n,r)=>{const o=Je(r);return o<n[0]?[o,r]:n},[1/0,null])[1]}const pt="Enter";function yt(t){t.dispatchEvent(new CustomEvent("download-request"))}function Ze(t){return t.querySelector(".download-button")}function tn(){const t=gt();if(!t){console.warn("download by shortcut: could not find the currently visible post to download");return}const e=Ze(t);if(e===null){console.warn("download by shortcut: found the currently visible post, but there seems to be no download button. are you sure it's there?");return}yt(e)}document.addEventListener("keydown",t=>{t.key===pt&&tn()});function wt(){return p(location.pathname,t=>/(?<=\/stories\/.*\/)\d*/.exec(t),R,v)}function en(){return p(document.querySelectorAll("section"),t=>Array.from(t),Tt(t=>({section:t,size:t.offsetWidth*t.offsetHeight})),t=>(t=t.slice(),t.sort((e,n)=>n.size-e.size),t),Ot(0),Mt(({section:t})=>t),et(()=>s("expected to find the story-element in the largest section element on this page, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."),t=>c(t)))}function nn(t){const e=t.querySelector(".download-button"),n=function(){let r=e;for(let o=0;o<20;o++){if(r.offsetWidth>200)return c(r);const i=v(r?.parentElement);if(f(i))break;r=i.value}return s("starting from the download button, we attempted to find an ancestor with a width greater than 200 pixels, but had no success.")}();return d(n)?n:p(n.right,r=>r.parentElement?.firstElementChild,v,et(()=>s("found an ancestor of the download button with the expected width, but not the expected DOM structure"),c))}function rn(t){return t.childElementCount>0}function on(){const t=en();if(d(t))return t;const e=nn(t.right);if(d(e))return e;const n=p(e.right.children,Array.from,qt(rn));return f(n)?s("trying to find the current story-index by looking for the first progress-bar that has not finished. but it appears that every single progress-bar has completed."):c(n.value)}function vt(){const{pathname:t}=location;return t.startsWith("/stories/highlights/")?"highlight_reel":"user_reel"}function sn(){const t=window.location.href;return location.pathname.startsWith("/stories/highlights/")?un():cn(t)}function an(t,e){return Ft(`could not extract username from url: ${e}`)(R(t.exec(e)))}function un(){const t=/(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/,e=p('link[href*="://www.instagram.com/"]',r=>document.querySelectorAll(r),Array.from,Nt(q(r=>r.href,r=>t.exec(r),v)));if(f(e))return s("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");const n=e.value[0];return c(n)}function cn(t){return an(/(?<=stories\/).*?(?=\/)/,t)}let b={"X-IG-App-ID":"936619743392459"};const bt="trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.";function xt(){if(!b)throw bt;return b}function ln(){return b?c(b):s(bt)}let K=h,G=!1;P.exports.runtime.onMessage.addListener(function(t){"requestBody"in t&&f(K)&&(K=g(t.requestBody)),"requestHeaders"in t&&!G&&(b=t.requestHeaders,G=!0)});const dn="https://www.instagram.com/api/v1/";function L(t){return`${dn}${t}`}function fn(t){return L(`feed/reels_media/?reel_ids=highlight%3A${t}`)}const hn=()=>p(location.pathname,te(/(?<=\/stories\/highlights\/)\d*/));async function mn(t,e){const n=await fetch(fn(e),{credentials:"include",headers:t});return c(await n.json())}async function gn(){const t=ln();if(d(t))return t;const e=hn();return f(e)?s("could not find the ID of the highlights-story"):mn(t.right,e.value)}function pn(t){return L(`feed/reels_media/?reel_ids=${t}`)}async function yn(t,e){const n=await fetch(pn(e),{credentials:"include",headers:t});return c(await n.json())}async function wn(t){const e=xt();return yn(e,t)}function vn(t){return L(`feed/user/${t}/username/?count=1`)}async function bn(t,e){const r=await(await fetch(vn(e),{credentials:"include",headers:t})).json();console.log("fetched user-info",r);const o=r.user;return c(o)}async function xn(t){const e=xt();return bn(e,t)}async function Sn(){const t=sn();if(d(t))return t;const e=t.right,n=await xn(e);if(d(n))return n;const o=n.right.pk.toString(),i=await wn(o);return d(i)?i:c(i.right.reels_media[0])}async function En(){const t=await gn();return d(t)?t:c(t.right.reels_media[0])}async function In(){return vt()==="highlight_reel"?En():Sn()}function Cn(t){const e=wt();if(f(e))return s(`could not story-id in url ${location.href}`);const n=e.value,r=t.items.find(o=>o.pk===n);return r?c(r):(console.log(t.items,n),s(`could not find story-ID ${n} in any of the fetched story-items`))}function Dn(t){const e=on();return d(e)?e:c(t.items[e.right])}function Pn(t){return t.reel_type==="user_reel"?Cn(t):Dn(t)}function An(t){if(vt()!==t.reel_type)return!0;const n=wt();if(f(n))return console.warn("trying to check if the current story-cache is stale by searching for the current story item, given the urls id, but could not find an id in the url. are you sure you are watching a story?"),!0;const r=n.value;return!t.items.some(o=>o.pk===r)}function Bn(){let t=h;return async()=>{if(f(t)||An(t.value)){console.log("refreshing story cache");const a=await In();if(d(a))return a;t=g(a.right)}const e=t.value,n=Pn(e);if(d(n))return n;const r=n.right,o=I(r),{username:i}=e.user;return c({src:o.src,username:i})}}const _n=t=>{const e=N(`
		<div style="margin-right: 8px;"></div>
	`),n=function(){let l=null;return{onDownloadStart:()=>{document.querySelector("video")&&(l=Mn(),l.keepPaused())},onDownloadEnd:m=>{!l||l.continue()}}}(),r=dt({fetchMediaInfo:Bn(),...n}),o=24;Object.assign(r.style,{width:`${o}px`}),e.appendChild(r);const i=kn(t);if(d(i)){console.warn(i.left);return}const u=i.right.parentElement;u?u.insertAdjacentElement("afterbegin",e):console.error("the playButton has no parentElement."),document.addEventListener("keypress",l=>{l.key===pt&&yt(r)})};function kn(t){const e=t.querySelector("*[aria-label=Play]")??t.querySelector("*[aria-label=Pause]");if(!e)return s("could not add download-button in story. the svg for the pause/play button has no button as an ancestor");const n=e.parentElement?.parentElement;return n?(n.getAttribute("role")!=="button"&&console.warn("the grandparent of this playButton has no role attribute with value 'button'. this is unexpected, but not necessarily breaking"),c(n)):s("found the playbutton but it has no grandparent which is very weird and will probably never ever happen")}function Mn(){let t=!1;const e=document.querySelector("video");return{keepPaused:()=>{t=!0;const o=()=>{e&&!e.paused&&e.pause(),t&&window.requestAnimationFrame(o)};o()},continue:()=>{t=!1}}}x.addEventListener("onPostAdded",t=>Ge(t.detail.element));x.addEventListener("onStoryAdded",t=>_n(t.detail.element));x.start();const St=30;function $(t){const e=t.querySelector("section");if(e===null)return console.warn("trying to calculate distance to bottom, cannot find a 'section' element in post"),h;const n=e.getBoundingClientRect().bottom,r=window.innerHeight;return g(r-n)}function On(t){const e=$(t);return f(e)?!1:e.value<-St}function Tn(t){const e=$(t);return f(e)?!1:e.value>St}function qn(){return H().find(On)}function Fn(){return H().reverse().find(Tn)}function Y(t){const e=t();if(!e){console.warn("could not find post to scroll to");return}const n=-$(e),r=window.scrollY+n;window.scrollTo({left:window.scrollX,top:r,behavior:"smooth"})}function Nn(){const t={"scroll-up":"w","scroll-down":"s"};document.addEventListener("keydown",e=>{e.key===t["scroll-up"]?Y(Fn):e.key===t["scroll-down"]&&Y(qn)})}Nn();const J={a:"left",d:"right"},Rn={left:"LeftChevron",right:"RightChevron"};function k(){console.warn("you've tried to navigate to the next or previous image/video but we couldn't find the button to click on")}function Hn(t){const n=w()==="stories"?document.body:gt();if(!n){k();return}const r=Rn[t],o=n.querySelector(`[class*="${r}"]`);if(!o){k();return}const i=o.parentElement;if(!i){k();return}i.click()}document.addEventListener("keydown",t=>{const{key:e}=t;e in J&&Hn(J[e])});console.log("### insta loader initialized ###");
