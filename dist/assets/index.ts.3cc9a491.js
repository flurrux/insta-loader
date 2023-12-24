import{s as m,n as h,f as O,i as C,p as y,a as T,l as u,r as l,c as d,d as f,e as Dt,g as Z,O as tt,m as Pt,t as At,h as _t,j as Bt,k as Mt,b as D,o as U,q as et,u as kt,v as qt}from"./vendor.03513969.js";const S={mainFeed:"mainFeed",post:"post",personFeed:"personFeed",stories:"stories"},w=()=>{let t=window.location.href;return t.endsWith("instagram.com/")||t.includes(".com/?")?S.mainFeed:t.includes("/p/")?S.post:t.includes("/reel/")?"reel":t.includes("/stories/")?S.stories:S.personFeed},Ot=t=>t==="post"||t==="reel";w();document.querySelector("#mount_0_0_8N");const M=()=>{const t=w();return t==="personFeed"?["preview"]:t==="stories"?["story"]:["post"]};function F(t,e){let n=e;for(let r=0;r<1e3;r++){if(t(n))return m(n);const o=n.parentElement;if(!o)return h;n=o}return h}const b=new EventTarget;function nt(t){return t.map(e=>e.parentElement).filter(e=>e!==null)}const Tt=O(t=>t.querySelectorAll('a[href*="/p/"]'),Array.from,nt);function Ft(t){if(w()==="mainFeed"){if(t.tagName=="ARTICLE")return[t];const e=Array.from(t.querySelectorAll("article"));if(e.length>0)return e}else return t.tagName=="MAIN"?[t]:Array.from(t.querySelectorAll("main"));return[]}function Nt(t){if(t.matches("section")&&Array.from(t.children).findIndex(e=>e.tagName=="HEADER")>0)return[t];if(t.querySelector("*[aria-label=Menu]")){const e=F(n=>n.matches("section"),t);if(C(e))return[e.value]}return y(t.querySelectorAll("header"),Array.from,nt)}const W=(t,e)=>{b.dispatchEvent(new CustomEvent(t,{detail:{element:e}}))};class _{constructor(e,n){this.getContainedElements=n,this.elementType=e}matchesType(e){return e.includes(this.elementType)}buildEventName(e){const n=this.elementType;return`on${n[0].toUpperCase()+n.slice(1)}${e}`}onAdded(e){W(this.buildEventName("Added"),e)}onRemoved(e){W(this.buildEventName("Removed"),e)}}const Rt=[new _("post",Ft),new _("preview",Tt),new _("story",Nt)];function rt(t,e){if(t.nodeType!=1)return;let n=M();for(let r of Rt){if(!r.matchesType(n))continue;let o=r.getContainedElements(t),i=e?r.onAdded.bind(r):r.onRemoved.bind(r);o.forEach(i)}}function ot(t){t instanceof HTMLElement&&rt(t,!0)}function Lt(t){t instanceof HTMLElement&&rt(t,!1)}function Ht(t){t.addedNodes.forEach(ot),t.removedNodes.forEach(Lt)}function $t(t){t.forEach(Ht)}function jt(){var t=new MutationObserver($t);t.observe(document,{childList:!0,subtree:!0})}function Ut(){ot(document.body)}function Wt(){Ut(),jt()}b.start=Wt;function zt(t){return new Promise(e=>setTimeout(e,t))}async function Vt(t,e,n){for(let r=0;r<e;r++){const o=n();if(C(o))return o.value;await zt(t)}throw"attempt was unsuccessful"}function Qt(t,e){return T(t.querySelector(e))}async function Xt(t,e,n,r){return Vt(t,e,()=>Qt(n,r))}const N=t=>{const e=document.createElement("div");return e.innerHTML=t,e.firstElementChild};function it(t,e){return()=>{window.setTimeout(t,e)}}function R(t){return t?t[0]:null}function Kt(t){return t?m(t[0]):h}const Gt=t=>O(e=>t.exec(e),Kt);function Yt(t){const e=t.parentElement;if(!e)return null;const n=e.parentElement;return n||null}function Jt(t,e){const n=R(/(?<=translateX\()[\d\.]*(?=px)/.exec(e.style.transform));return n?Math.round(parseFloat(n)/t):null}function st(t){const e=Yt(t);if(!e)return null;const n=e.getBoundingClientRect().x,r=1,o=t.children[r],i=parseFloat(getComputedStyle(o).getPropertyValue("width"));for(let s=r;s<t.children.length;s++){const a=t.children[s],c=a.getBoundingClientRect().x;if(Math.abs(n-c)>i/2)continue;const g=Jt(i,a);if(g!==null)return{index:g,child:a}}return null}function Zt(t){const e=t.querySelector("ul");if(!e)return null;const n=st(e);return n?{list:e,...n}:null}function te(t,e){let n=-1;const r=it(()=>{const i=st(t);if(!i){console.warn("could not find index and child of carousel!");return}i.index!==n&&(n=i.index,e(i))},100);new MutationObserver(r).observe(t,{childList:!0,subtree:!0}),r()}function ee(t){const e=t.querySelectorAll('a[href*="/p/"');if(e.length===0)return null;const n=e[e.length-1].href,r=n.indexOf("/p/");if(r<0)return null;const o=r+3,i=n.indexOf("/",o);return i<0?null:n.substring(0,i+1)}function ne(t){return y(t.querySelectorAll("img"),Array.from,e=>e.find(n=>n.naturalWidth>400))}function P(t){return t.querySelector("video")??ne(t)}function re(t,e){let n=e;for(let r=0;r<1e3;r++){if(n.matches("li"))return!0;if(n===t)return!1;const o=n.parentElement;if(!o)return!1;n=o}return!1}function k(t){const e=P(t);return e?re(t,e)?m("collection"):m(e.tagName==="VIDEO"?"video":"image"):h}function oe(t){const e=t.querySelector('img[alt*="profile picture"]');if(!e)return u(["could not find the authors username in this post",t]);const r=e.getAttribute("alt").replace("'s profile picture","");return l(r)}function ie(t,e){const n=se(e);return d(n)?n:l(t[n.right])}function se(t){const e=at(t);if(f(e))return u("attempted to find the indicator dots of a collection, but no luck. instagram might have changed the DOM and the current method of detection doesn't work anymore");const r=e.value.children;let o=0;for(let i=1;i<r.length;i++)r[i].className.length<=r[o].className.length||(o=i);return l(o)}function at(t){if(!("clientWidth"in t))return h;const{clientWidth:o,clientHeight:i}=t;if(o>100&&i<10&&i>4)return m(t);if(!("children"in t))return h;for(const s of t.children){const a=at(s);if(!f(a))return a}return h}function ae(t){const e=t.split(" ");return{src:e[0],quality:parseInt(e[1])}}function ue(t){return t.split(",").map(ae)}function ce(t){const e=ue(t);let n=0;for(let r=1;r<e.length;r++)e[r].quality>e[n].quality&&(n=r);return e[n].src}function le(t){return t.srcset.length===0?t.src:ce(t.srcset)}function ut(t){const e=t.tagName==="VIDEO"?"video":"image",n=e==="image"?le(t):t.src;return{type:e,src:n}}function de(t){const e=P(t);return e?ut(e):(console.log("could not find any media element in post",t),null)}function fe(t,e){if(t==="video")return null;if(t==="image")return de(e);const n=Zt(e);if(!n)return null;const r=P(n.child);return!r||!(r instanceof HTMLImageElement)?null:ut(r)}function he(t){try{return l(JSON.parse(t.innerText))}catch(e){return u(e)}}function q(t,e){if(typeof e!="object")return h;if(e===null)return h;if(Array.isArray(e))for(const n of e){const r=q(t,n);if(!f(r))return r}for(const[n,r]of Object.entries(e)){if(n!==t){const o=q(t,r);if(f(o))continue;return o}return m(r)}return h}function ge(){const t="xdt_api__v1__media__shortcode__web_info",e=y(document.body.querySelectorAll("script"),c=>Array.from(c),Dt(c=>c.innerText.includes(t)));if(f(e))return u(`could not find any script on this page that contains the string "${t}"`);const n=e.value,r=he(n);if(d(r))return r;const o=r.right,i=q(t,o);if(f(i))return u([`could not find any property with they key "${t}", weirdly enough`,o]);const a=i.value.items;return!a||!Array.isArray(a)||a.length===0?u(["the 'items' property on the webInfo object does not exist or is not an array with at least one item",o]):l(a[0])}function ct(t){return parseInt(t.getAttribute("bandwidth"))}function me(t){return t.hasAttribute("bandwidth")}const ye=Z(ct)(tt),pe=Pt(ye);function we(t){const e=t.querySelector("BaseURL");if(!e)return u({failure:"element does not have a child of type BaseURL from which the url could be extracted.",context:t});const n=e.textContent;return n===null?u({failure:"found a BaseURL-node but its textContent is null",context:{element:t,baseUrlNode:e}}):l(n)}function ve(t){const e=t.getAttribute("width");if(e===null)return u({failure:'element has no "width" attribute',context:t});const n=t.getAttribute("height");return n===null?u({failure:'element has no "height" attribute',context:t}):l({width:parseInt(e),height:parseInt(n)})}function z(t){const e=[];if(t.children.length===0)return u({failure:"AdaptationSet has zero child nodes",context:t});const n=Array.from(t.children),r=n.filter(me);if(r.length===0)return u({failure:"none of the childnodes has a bandwidth attribute",context:t});r.length!==n.length&&e.push({failure:"some children of this AdaptationSet have no bandwidth attribute",context:t});const o=y(r,pe),i=we(o);if(d(i))return i;const s=ct(o);return l({success:{element:o,mediaData:{url:i.right,bandwidth:s}},warnings:e})}function be(t){const e=[],n=t.children[0];if(n===null)return u({failure:"XMLDocument doc does not have a MPD-node",context:t});const r=Array.from(n.querySelectorAll("Period"));if(r.length===0)return u({failure:"could not find any nodes with the 'Period' tag in MPD",context:{doc:t,mpd:n}});r.length>1&&e.push({failure:"found more than 1 Period Element",context:{doc:t,MPD:n,periodNodes:r}});const o=r[0],i=Array.from(o.querySelectorAll("AdaptationSet"));if(i.length===0)return u({failure:"found no AdaptationSets in Period Element",context:o});i.length>2&&e.push({failure:"expected 2 AdaptationSets, 1 for video and 1 for audio, but got more than 2",context:{doc:t,period:o,adaptationSets:i}});const s=i.findIndex(x=>!!(x.getAttribute("contentType")==="video"||x.hasAttribute("maxFrameRate")));if(s<0)return u({failure:"could not find any AdaptationSets that contain videos, or maybe the attributes 'contentType' and 'maxFrameRate' do not work anymore.",context:{doc:t,period:o,adaptationSets:i}});const a=i[s],c=z(a);if(d(c))return u({failure:"error while trying to extract video data",context:{videoSet:a,subFailure:c.left}});const g=c.right,p=ve(g.success.element);if(d(p))return u({failure:"could not extract width or height from video",context:{doc:t,subContext:p.left}});const Et=p.right,It=g.success.mediaData;let j=h;if(i.length>1){const x=i[s===0?1:0],A=z(x);if(_t(A)){const Ct=A.right;j=m(Ct.success.mediaData)}}return l({data:{video:{...It,...Et},audio:j},warnings:e})}function xe(t){const e=new DOMParser;return At(()=>e.parseFromString(t,"text/xml"),n=>n instanceof Error?n:new Error("unknown error"))}function Se(t){const e=xe(t);return d(e)?e:be(e.right)}const Ee=t=>t.width*t.height,Ie=Z(Ee)(Bt(tt));function V(t){return Mt(Ie)(t)[0].url}function Ce(t){if(!t.video_dash_manifest)return h;const e=Se(t.video_dash_manifest);if(d(e))return console.error(e.left),h;const n=e.right;return n.warnings.length>0&&console.warn(n.warnings),m({type:"video",src:n.data.video.url,previewSrc:t.image_versions2.candidates[0].url})}function E(t){if(t.video_versions){const n=Ce(t);return C(n)?n.value:{type:"video",src:V(t.video_versions),previewSrc:t.image_versions2.candidates[0].url}}const e=V(t.image_versions2.candidates);return{type:"image",src:e,previewSrc:e}}function De(t){return t.carousel_media.map(E)}function Pe(t){const e=t.user.username;let n=[],r="video";return t.carousel_media?(r="collection",n=De(t)):t.video_versions?(r="video",n.push(E(t))):(r="image",n.push(E(t))),n.length===0?u("no media found"):l({postType:r,mediaArray:n,username:e})}const Ae=t=>{let e=h,n=h;return async function(){if(f(n)&&(n=k(t)),f(n))return u(["could not find type of post",t]);const r=n.value,o=fe(r,t);if(o){const c=oe(t);return d(c)?c:l({username:c.right,...o})}if(!Ot(w()))return u("please open the page of this post in a new tab. downloading videos directly from the mainfeed is currently not supported.");if(f(e)){const c=ge();if(d(c))return c;const g=c.right,p=Pe(g);if(d(p))return p;e=m(p.right)}if(f(e))return u("this fail case should never occur");const i=e.value,{mediaArray:s}=i,a=r==="collection"?ie(s,t):l(s[0]);return d(a)?a.left:l({username:i.username,...a.right})}};function lt(t){return t.map(e=>`\\${e}`).join("|")}function _e(t){const e=lt(t);return new RegExp(`[^/]*(${e})`)}function Be(t,e){return new RegExp(lt(t)).exec(e)!==null}const Me=(t,e)=>n=>{const r=t.exec(n);if(r!==null){const o=r[0];return l(o)}return Be(e,n)?u(`could not extract a filename from the url '${n}' although it appears to contain a valid file-extension.`):u(`the url '${n}' does not contain any of the expected file-extensions: ${e.join(", ")}`)},ke=t=>Me(_e(t),t),qe=ke([".mp4",".jpg",".webp",".webm",".heic"]),Oe=(t,e)=>new Promise((n,r)=>{const o=D.exports.runtime.connect({name:"chrome-downloader"});let i=null;const s=()=>{o.postMessage({type:"request-state",id:i})};o.onMessage.addListener(a=>{if(a.type==="download-id"){i=a.id,s();return}if(a.type==="error"){r(a.error),o.disconnect();return}if(a.type==="success"){n(),o.disconnect();return}if(a.type==="progress"){e(a.progress.progress),s();return}}),o.postMessage({type:"request-download",filePath:t.filePath,url:t.url})});function I(t){return D.exports.runtime.getURL(`assets/icons/${t}.png`)}const Q={initial:"save",loading:"spinner-of-dots",success:"verify-sign-green",fail:"error"};class Te{constructor(){this._downloadState="initial",this._loadingProgress=0,this._spinnerCtx=null,this._spinnerCanvas=null,this._buttonImg=null,this._rootElement=null,this._rootElement=document.createElement("a"),this._rootElement.classList.add("download-button"),Object.assign(this._rootElement.style,{width:"fit-content",height:"fit-content",cursor:"pointer"}),this._buttonImg=document.createElement("img"),Object.assign(this._buttonImg.style,{width:"inherit",height:"inherit"}),this._rootElement.appendChild(this._buttonImg),this._setInitialState()}get downloadState(){return this._downloadState}set downloadState(e){this._downloadState=e,this._onDownloadStateChanged()}get loadingProgress(){return this._loadingProgress}set loadingProgress(e){this._loadingProgress=e,this._downloadState==="loading"&&this._drawSpinner()}getElement(){return this._rootElement}_setInitialState(){let n=M()[0]=="post"?"dark":"white";const r=`${Q.initial}-${n}`;this._buttonImg.src=I(r)}_onDownloadStateChanged(){const e=this._downloadState;if(e==="loading")this._spinnerCanvas||(this._spinnerCanvas=document.createElement("canvas"),this._spinnerCtx=this._spinnerCanvas.getContext("2d"),this._drawSpinner());else{this._spinnerCanvas=null,this._spinnerCtx=null;let n=Q[e];e==="initial"&&(n+=`-${M()[0]=="post"?"dark":"white"}`),this._buttonImg.src=I(n)}}_drawSpinner(){const e=this._spinnerCtx,n=this._loadingProgress,r=32;Object.assign(this._spinnerCanvas,{width:r,height:r}),e.clearRect(0,0,r,r),e.lineWidth=4;const o=(r-e.lineWidth)/2;e.strokeStyle="cyan",e.lineCap="round",e.beginPath();const i=r/2,s=-Math.PI/2;e.arc(i,i,o,s,s+n*2*Math.PI),e.stroke(),this._buttonImg.src=this._spinnerCanvas.toDataURL()}}async function Fe(t){const{mediaInfo:e,loadingCallback:n}=t,r=e.src,o=qe(r);if(d(o))return o;const i=o.right;return await Oe({filePath:`Instagram/${e.username}/${i}`,url:r},n),l(void 0)}function X(t){D.exports.runtime.sendMessage({type:"show-notification",notification:{title:"download failed",message:t,iconUrl:I("insta-loader-icon-48")}})}async function Ne(t){const{fetchMediaInfo:e,loadingCallback:n}=t;debugger;const r=await e();if(d(r))return console.error(r.left),X("something went wrong while trying to fetch the image or video. sorry for this vague message. i'm trying to provide better messages in future releases."),!1;const o=r.right,i=await Fe({mediaInfo:o,loadingCallback:n});if(d(i)){const s=i.left;return console.error(s),X(`we've successfully figured out the download url and username, but the download failed anyway. not exactly sure why. i will try to include the exact reason soon. you may want to try downloading this file on your own. here's the url:
${o.src}
username: ${o.username}`),!1}return!0}const dt=t=>{const{fetchMediaInfo:e,onDownloadStart:n=U,onDownloadEnd:r=U}=t,o=new Te,i=o.getElement(),s=async()=>{o.downloadState="loading";const a=g=>{o.loadingProgress=g};n(void 0);const c=await Ne({fetchMediaInfo:e,loadingCallback:a});o.downloadState=c?"success":"fail",r(c)};return i.addEventListener("download-request",s),i.addEventListener("mousedown",s),i};function Re(t){return N(`
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
					src="${I("external-link-white")}"
				/>
			</a>
		</div>
	`)}function ft(t){const e=t.querySelector('polygon[points="20 21 12 13.44 4 21 4 3 20 3 20 21"]');if(!e)return h;const n=F(i=>i.matches('*[role="button"]'),e);if(f(n))return h;const o=n.value.parentElement;return o==null?h:o.matches('*[role="button"]')?m(o):h}const Le=t=>{const e=ft(t);if(f(e))return null;const n=e.value,r=n.parentElement;if(!r)return null;const o=n.clientHeight+"px",i=getComputedStyle(r).getPropertyValue("padding");return{width:o,height:o,padding:i}},ht=(t,e)=>{Object.assign(e.style,Le(t))};function gt(t){const e=dt({fetchMediaInfo:Ae(t)});ht(t,e);const n=N(`
		<div 
			style="
				display: flex; 
				flex-direction: row;
				padding: 8px;
				padding-right: 0px;
				margin-left: 10px;
			"
		></div>
	`);return n.appendChild(e),n}function He(t){const e=Re(ee(t));return ht(t,e.firstElementChild),e}function $e(t){return new Promise(e=>{const n=k(t);if(C(n)){e(n.value);return}const r=it(()=>{const i=k(t);f(i)||(e(i.value),o.disconnect())},600),o=new MutationObserver(r);o.observe(t,{childList:!0,subtree:!0})})}async function je(t,e,n){const r=e.style.display,o=a=>{e.style.display=a?r:"none",t.style.display=a?"none":"initial"};if(w()!=="mainFeed"){t.style.display="none";return}const i=await $e(n);if(i==="image")return;if(i==="video"){o(!1);return}const s=n.querySelector("ul");!s||te(s,({child:a,index:c})=>{const g=P(a);!g||o(g.matches("img"))})}function Ue(t){const e=ft(t);if(f(e)){console.warn("trying to inject download buttons into post, but cannot find the save-button for reference");return}const r=e.value.parentElement?.parentElement;Object.assign(r?.style,{display:"flex",alignItems:"center"});const o=He(t);r.appendChild(o);const i=gt(t);r.appendChild(i),je(o,i,t)}async function We(t){if(!await Xt(200,10,t,"polygon"))return u(["trying to inject download buttons into post, but cannot find any child with tag 'polygon' that was expected to be in the following element: ",t]);const n=Array.from(t.querySelectorAll("polygon"));if(n.length!==2&&console.warn(`expected to find exactly two svg-polygon elements on this page, but got a different number, namely ${n.length}`),n.length<1)return u("expected to find atleast one svg-polygon on this page that belonged to the share-button, but did not find any.");const r=n[0],o=F(g=>g.matches("button"),r);if(f(o))return u(["found an svg-polygon element that was assumed to belong to the share-button. then we tried to find the share-button itself, but got no matches. here is the polygon element:",r]);const i=o.value,s=i.parentElement;if(!s)return u(["found the share-button, but the DOM structure is not as expected and therefore can't find find the point where to inject the download button. here is the share-button:",i]);const a=s.parentElement,c=a.lastChild;return Object.assign(c.style,{display:"flex",alignItems:"baseline"}),l({likeCommentShareBar:a,saveButtonWrapper:c})}async function ze(t){const e=await We(t);if(d(e)){console.warn(e.left);return}const{saveButtonWrapper:n,likeCommentShareBar:r}=e.right,o=gt(t);n.appendChild(o);const i=r.querySelector("svg")?.width.baseVal.value;i!==void 0&&Object.assign(o.querySelector("img").style,{width:`${i}px`,height:`${i}px`})}function Ve(t){w()==="mainFeed"?Ue(t):ze(t)}function Qe(){return document.querySelector("article")?.parentElement}function L(){const t=Qe();return t?Array.from(t.children):[]}function Xe(t){const e=t.getBoundingClientRect(),n=(e.top+e.bottom)/2;return Math.abs(n-window.innerHeight/2)}function mt(){const t=L();return t.length===0?null:t.reduce((n,r)=>{const o=Xe(r);return o<n[0]?[o,r]:n},[1/0,null])[1]}const yt="Enter";function pt(t){t.dispatchEvent(new CustomEvent("download-request"))}function Ke(t){return t.querySelector(".download-button")}function Ge(){const t=mt();if(!t){console.warn("download by shortcut: could not find the currently visible post to download");return}const e=Ke(t);if(e===null){console.warn("download by shortcut: found the currently visible post, but there seems to be no download button. are you sure it's there?");return}pt(e)}document.addEventListener("keydown",t=>{t.key===yt&&Ge()});function wt(){return y(location.pathname,t=>/(?<=\/stories\/.*\/)\d*/.exec(t),R,T)}const Ye=()=>y(document.querySelector("section section"),et("expected to find the story-element in a section inside another section, but this query returned null. are you sure you are currently watching a story? if yes, instagram might have changed things up in the DOM. i'm deeply sorry and ashamed."));function Je(t){const e=t.querySelector("header");if(!e)return u(["trying to find the progress-bars in this story but could not find the header-element that was expected to be there. look for yourself:",t]);const n=e.firstChild;return n?.firstChild?l(n):u(["there appears to be not a single progress-bar in this story. it is more likely that the DOM has another shape than expected. the following element was expected to contain all progress-bars of this story",n])}function Ze(t){for(const e of t.children){const{width:n}=e.style;if(n.length!==0)return parseFloat(n)}return 0}function tn(t){return Ze(t)<100}function en(){const t=Ye();if(d(t))return t;const e=Je(t.right);if(d(e))return e;const n=y(e.right.children,Array.from,kt(tn));return f(n)?u("trying to find the current story-index by looking for the first progress-bar that has not finished. but it appears that every single progress-bar has completed."):l(n.value)}function vt(){const{pathname:t}=location;return t.startsWith("/stories/highlights/")?"highlight_reel":"user_reel"}function nn(){const t=window.location.href;return location.pathname.startsWith("/stories/highlights/")?on():sn(t)}function rn(t,e){return et(`could not extract username from url: ${e}`)(R(t.exec(e)))}function on(){const t=/(?<=:\/\/www\.instagram\.com\/).*?(?=\/)/,e=y('link[href*="://www.instagram.com/"]',r=>document.querySelectorAll(r),Array.from,qt(O(r=>r.href,r=>t.exec(r),T)));if(f(e))return u("trying to find a username on the profile page, but there seems to be no link element where we could read off the url.");const n=e.value[0];return l(n)}function sn(t){return rn(/(?<=stories\/).*?(?=\/)/,t)}let v={"X-IG-App-ID":"936619743392459"};const bt="trying to fetch media info from instagram API, but there was no previous request that we could imitate. please check if `web-request-listener.ts` and `foreground-collector.ts` are working properly.";function xt(){if(!v)throw bt;return v}function an(){return v?l(v):u(bt)}let K=h,G=!1;D.exports.runtime.onMessage.addListener(function(t){"requestBody"in t&&f(K)&&(K=m(t.requestBody)),"requestHeaders"in t&&!G&&(v=t.requestHeaders,G=!0)});const un="https://www.instagram.com/api/v1/";function H(t){return`${un}${t}`}function cn(t){return H(`feed/reels_media/?reel_ids=highlight%3A${t}`)}const ln=()=>y(location.pathname,Gt(/(?<=\/stories\/highlights\/)\d*/));async function dn(t,e){const n=await fetch(cn(e),{credentials:"include",headers:t});return l(await n.json())}async function fn(){const t=an();if(d(t))return t;const e=ln();return f(e)?u("could not find the ID of the highlights-story"):dn(t.right,e.value)}function hn(t){return H(`feed/reels_media/?reel_ids=${t}`)}async function gn(t,e){const n=await fetch(hn(e),{credentials:"include",headers:t});return l(await n.json())}async function mn(t){const e=xt();return gn(e,t)}function yn(t){return H(`feed/user/${t}/username/?count=1`)}async function pn(t,e){const r=await(await fetch(yn(e),{credentials:"include",headers:t})).json();console.log("fetched user-info",r);const o=r.user;return l(o)}async function wn(t){const e=xt();return pn(e,t)}async function vn(){const t=nn();if(d(t))return t;const e=t.right,n=await wn(e);if(d(n))return n;const o=n.right.pk.toString(),i=await mn(o);return d(i)?i:l(i.right.reels_media[0])}async function bn(){const t=await fn();return d(t)?t:l(t.right.reels_media[0])}async function xn(){return vt()==="highlight_reel"?bn():vn()}function Sn(t){const e=wt();if(f(e))return u(`could not story-id in url ${location.href}`);const n=e.value,r=t.items.find(o=>o.pk===n);return r?l(r):(console.log(t.items,n),u(`could not find story-ID ${n} in any of the fetched story-items`))}function En(t){const e=en();return d(e)?e:l(t.items[e.right])}function In(t){return t.reel_type==="user_reel"?Sn(t):En(t)}function Cn(t){if(vt()!==t.reel_type)return!0;const n=wt();if(f(n))return console.warn("trying to check if the current story-cache is stale by searching for the current story item, given the urls id, but could not find an id in the url. are you sure you are watching a story?"),!0;const r=n.value;return!t.items.some(o=>o.pk===r)}function Dn(){let t=h;return async()=>{if(f(t)||Cn(t.value)){console.log("refreshing story cache");const s=await xn();if(d(s))return s;t=m(s.right)}const e=t.value,n=In(e);if(d(n))return n;const r=n.right,o=E(r),{username:i}=e.user;return l({src:o.src,username:i})}}function Pn(){let t=!1;const e=document.querySelector("video");return{keepPaused:()=>{t=!0;const o=()=>{e&&!e.paused&&e.pause(),t&&window.requestAnimationFrame(o)};o()},continue:()=>{t=!1}}}function An(t){const e=t.querySelector("*[aria-label=Play]")??t.querySelector("*[aria-label=Pause]");return e?l(e.parentElement):u("could not add download-button in story. the svg for the pause/play button has no button as an ancestor")}const _n=t=>{const e=N(`
		<div style="margin-right: 8px;"></div>
	`),n=function(){let c=null;return{onDownloadStart:()=>{document.querySelector("video")&&(c=Pn(),c.keepPaused())},onDownloadEnd:g=>{!c||c.continue()}}}(),r=dt({fetchMediaInfo:Dn(),...n}),o=24;Object.assign(r.style,{width:`${o}px`}),e.appendChild(r);const i=An(t);if(d(i)){console.warn(i.left);return}i.right.parentElement.insertAdjacentElement("afterbegin",e),document.addEventListener("keypress",c=>{c.key===yt&&pt(r)})};b.addEventListener("onPostAdded",t=>Ve(t.detail.element));b.addEventListener("onStoryAdded",t=>_n(t.detail.element));b.start();const St=30;function $(t){const e=t.querySelector("section");if(e===null)return console.warn("trying to calculate distance to bottom, cannot find a 'section' element in post"),h;const n=e.getBoundingClientRect().bottom,r=window.innerHeight;return m(r-n)}function Bn(t){const e=$(t);return f(e)?!1:e.value<-St}function Mn(t){const e=$(t);return f(e)?!1:e.value>St}function kn(){return L().find(Bn)}function qn(){return L().reverse().find(Mn)}function Y(t){const e=t();if(!e){console.warn("could not find post to scroll to");return}const n=-$(e),r=window.scrollY+n;window.scrollTo({left:window.scrollX,top:r,behavior:"smooth"})}function On(){const t={"scroll-up":"w","scroll-down":"s"};document.addEventListener("keydown",e=>{e.key===t["scroll-up"]?Y(qn):e.key===t["scroll-down"]&&Y(kn)})}On();const J={a:"left",d:"right"},Tn={left:"LeftChevron",right:"RightChevron"};function B(){console.warn("you've tried to navigate to the next or previous image/video but we couldn't find the button to click on")}function Fn(t){const n=w()==="stories"?document.body:mt();if(!n){B();return}const r=Tn[t],o=n.querySelector(`[class*="${r}"]`);if(!o){B();return}const i=o.parentElement;if(!i){B();return}i.click()}document.addEventListener("keydown",t=>{const{key:e}=t;e in J&&Fn(J[e])});console.log("### insta loader initialized ###");
