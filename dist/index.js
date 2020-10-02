parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"mxrb":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.subscribeToNavigation=exports.getCurrentPageType=exports.pageType=void 0,exports.pageType={mainFeed:"mainFeed",post:"post",personFeed:"personFeed",stories:"stories"},exports.getCurrentPageType=function(){var e=window.location.href;return e.endsWith("instagram.com/")||e.includes(".com/?")?exports.pageType.mainFeed:e.includes("/p/")?exports.pageType.post:e.includes("/stories/")?exports.pageType.stories:exports.pageType.personFeed};var e=[];exports.subscribeToNavigation=function(r){e.push(r)};var r=function(r){e.forEach(function(e){return e(r)})},o=window.location.href,t=exports.getCurrentPageType(),s=document.querySelector("#react-root"),n=function(){var e=window.location.href;if(e!==o){var s=o,n=t;o=e,t=exports.getCurrentPageType(),r({oldHref:s,newHref:e,oldPageType:n,newPageType:t})}};new MutationObserver(n).observe(s,{childList:!0,subtree:!0});
},{}],"fHsd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.findStoryElement=exports.getUsernameByStoryElement=exports.getUsernameByStoryUrl=exports.getSrcOfStory=exports.getMediaInfoByHtml=exports.findMediaElementInPost=exports.getHrefOfPost=exports.getPreviewSrcOfPost=exports.fetchMediaInfo=exports.getOwnUsername=exports.getHighestQualityFromSrcset=exports.getElementTypesOnCurrentPage=void 0;var e=require("./insta-navigation-observer");exports.getElementTypesOnCurrentPage=function(){var r=e.getCurrentPageType();return"mainFeed"===r||"post"===r?["post"]:"personFeed"===r?["preview"]:"stories"===r?["story"]:[]},exports.getHighestQualityFromSrcset=function(e){var r=e.split(","),t=r[r.length-1],n=t.indexOf(" ")+1;return(t=t.substring(0,n)).trim()};var r=function(e){for(var r=0,t=e[0].config_width,n=1;n<e.length;n++){var o=e[n].config_width;o>t&&(r=n,t=o)}return e[r].src};exports.getOwnUsername=function(){return/(?<="username":")[^"]*/.exec(document.body.innerHTML)[0]};var t=function(e){return e.querySelector("video, img[srcset]")},n=function(e){var t=/(?<=window\.__additionalDataLoaded\(.*',).*(?=\);<)/.exec(e);if(!t)throw"__additionalDataLoaded not found on window";var n=JSON.parse(t[0]);if(!n.graphql)throw"graphql not found";if(!n.graphql.shortcode_media)throw"shortcode_media not found";for(var o=n.graphql.shortcode_media,i=o.owner.username,s=void 0!==o.edge_sidecar_to_children?["collection",o.edge_sidecar_to_children.edges.map(function(e){return e.node})]:[void 0!==o.video_url?"video":"image",[o]],a=s[0],u=s[1],c=[],d=0;d<u.length;d++){var l=u[d],f={previewSrc:l.display_url};if(void 0!==l.video_url)Object.assign(f,{type:"video",src:l.video_url});else{var g=l.display_resources,p=r(g);Object.assign(f,{type:"image",srcset:g,src:p})}c.push(f)}if(0===c.length)throw"no media found";return{postType:a,mediaArray:c,username:i}};exports.fetchMediaInfo=function(e){return new Promise(function(r,t){var o=new XMLHttpRequest;o.addEventListener("load",function(){try{var e=n(this.responseText);r(e)}catch(o){t(o)}}),o.addEventListener("error",t),o.addEventListener("abort",t),o.open("GET",e),o.send()})},exports.getPreviewSrcOfPost=function(e){for(var r=["video[poster]","img[srcset]"],t=["poster","src"],n=0;n<t.length;n++){var o=e.querySelector(r[n]);if(null!==o)return o.getAttribute(t[n])}},exports.getHrefOfPost=function(e){var r=e.querySelector('a[href*="/p/"')[0].href,t=r.indexOf("/p/")+3,n=r.indexOf("/",t);return r.substring(0,n+1)},exports.findMediaElementInPost=function(e){return t(e)};var o=function(e){var r=e.querySelector("header a").href;return/(?<=\.com\/).*(?=\/)/.exec(r)[0]},i=function(e){return null!==e.querySelector("ul img[srcset], ul video")?"collection":"VIDEO"===exports.findMediaElementInPost(e).tagName?"video":"image"},s=function(e){var r="VIDEO"===e.tagName?"video":"image";return{type:r,src:"video"===r?e.src:exports.getHighestQualityFromSrcset(e.srcset)}},a=function(e){for(var r=e.querySelector("ul"),n=r.children[1],o=parseFloat(getComputedStyle(n).getPropertyValue("width")),i=r.parentElement.parentElement.getBoundingClientRect().x,a=1;a<r.children.length;a++){var u=r.children[a],c=u.getBoundingClientRect().x;if(Math.abs(i-c)<o/2){var d=t(u);return s(d)}}},u=function(e){return s(exports.findMediaElementInPost(e))};exports.getMediaInfoByHtml=function(e){var r=o(e),t=i(e);return{username:r,postType:t,media:"collection"===t?a(e):u(e)}},exports.getSrcOfStory=function(e){var r=e.querySelector("video");if(null!==r){var t=Array.from(r.querySelectorAll("source")),n=["42","4D","64"],o=function(e){return n.findIndex(function(r){return e.type.includes(r)})};return t.sort(function(e,r){return o(e)-o(r)}),t[t.length-1].src}var i=e.querySelector("img[srcset]");return null!==i?exports.getHighestQualityFromSrcset(i.srcset):null},exports.getUsernameByStoryUrl=function(e){return/(?<=stories\/).*?(?=\/)/.exec(e)[0]},exports.getUsernameByStoryElement=function(e){return Array.from(e.querySelectorAll("span")).find(function(e){return 0===e.children.length}).innerText},exports.findStoryElement=function(){var e=document.body.querySelector("button canvas");if(e){for(var r=e.parentElement,t=0;t<1e4;t++){var n=r.parentElement;if(!n)return;if(n.offsetHeight-r.offsetHeight<0)return n;r=n}console.warn("either something went wrong or the dom is very large")}};
},{"./insta-navigation-observer":"mxrb"}],"h7U7":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("./insta-info-util"),n=new EventTarget,t=function(e){return Array.from(e.querySelectorAll('a[href*="/p/"]')).filter(function(e){return null!=e.querySelector("img")}).map(function(e){return e.parentElement})},o=function(e){return"ARTICLE"==e.tagName?[e]:Array.from(e.querySelectorAll("article"))},r=function(e){return"SECTION"==e.tagName&&Array.from(e.children).findIndex(function(e){return"HEADER"==e.tagName})>0?[e]:Array.from(e.querySelectorAll("header")).map(function(e){return e.parentElement})},i=function(){function e(e,n,t,o){this.onAdded=null,this.onRemoved=null,this.getContainedElements=null,this.elementType=null,this.onAdded=t,this.onRemoved=o,this.getContainedElements=n,this.elementType=e}return e.prototype.matchesType=function(e){return e.includes(this.elementType)},e}(),u=[new i("post",o,l,a),new i("preview",t,c,f),new i("story",r,s,m)];function d(e,t){n.dispatchEvent(new CustomEvent(e,{detail:{element:t}}))}function c(e){d("onPreviewAdded",e)}function f(e){d("onPreviewRemoved",e)}function l(e){d("onPostAdded",e)}function a(e){d("onPostRemoved",e)}function s(e){d("onStoryAdded",e)}function m(e){d("onStoryRemoved",e)}function h(n,t){if(1==n.nodeType)for(var o=e.getElementTypesOnCurrentPage(),r=0,i=u;r<i.length;r++){var d=i[r];if(d.matchesType(o)){var c=d.getContainedElements(n),f=t?d.onAdded:d.onRemoved;c.forEach(f)}}}function y(e){h(e,!0)}function p(e){h(e,!1)}function v(e){e.addedNodes.forEach(y),e.removedNodes.forEach(p)}function E(e){e.forEach(v)}function A(){new MutationObserver(E).observe(document,{childList:!0,subtree:!0})}function g(){y(document.body)}function T(){g(),A()}n.start=T,exports.default=n;
},{"./insta-info-util":"fHsd"}],"C547":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createFileNameByUrl=void 0,exports.createFileNameByUrl=function(e){for(var r=0,t=[".mp4",".jpg"];r<t.length;r++){var s=t[r],i=e.indexOf(s);if(i>=0){var n=e.substring(0,i+s.length);return n=n.substring(n.lastIndexOf("/")+1)}}};
},{}],"WG80":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.download=void 0,exports.download=function(e,o){return new Promise(function(r,t){var s=chrome.runtime.connect({name:"chrome-downloader"}),n=null,d=function(){s.postMessage({type:"request-state",id:n})};s.onMessage.addListener(function(e){return"download-id"===e.type?(n=e.id,void d()):"error"===e.type?(t(e.error),void s.disconnect()):"success"===e.type?(r(),void s.disconnect()):"progress"===e.type?(o(e.progress.progress),void d()):void 0}),s.postMessage({type:"request-download",filePath:e.filePath,url:e.url})})};
},{}],"Nayg":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.download=void 0,exports.download=function(e,n){var o={requests:[{action:"write media by link",data:e}],time:window.performance.now()},t=null,r=null,s=new Promise(function(e,n){t=e,r=n}),i=chrome.runtime.connect({name:"disk-downloader"});return i.onMessage.addListener(function(e,o){if("native host disconnect"!==e.origin){if("native host response"===e.origin){var s=e.data[0],a=s.type;if("success"===a)return void t();if("error"===a)return void r(s.data);"progress"===a&&n(s.data.progress)}"success"===e.data[0].type&&i.disconnect()}else r(e.data)}),i.postMessage(o),s};
},{}],"DHJp":[function(require,module,exports) {
"use strict";var e=this&&this.__awaiter||function(e,r,t,n){return new(t||(t=Promise))(function(o,a){function i(e){try{l(n.next(e))}catch(r){a(r)}}function u(e){try{l(n.throw(e))}catch(r){a(r)}}function l(e){var r;e.done?o(e.value):(r=e.value,r instanceof t?r:new t(function(e){e(r)})).then(i,u)}l((n=n.apply(e,r||[])).next())})},r=this&&this.__generator||function(e,r){var t,n,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function u(a){return function(u){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,n&&(o=2&a[0]?n.return:a[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,a[1])).done)return o;switch(n=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,n=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=r.call(e,i)}catch(u){a=[6,u],n=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,u])}}},t=this&&this.__spreadArrays||function(){for(var e=0,r=0,t=arguments.length;r<t;r++)e+=arguments[r].length;var n=Array(e),o=0;for(r=0;r<t;r++)for(var a=arguments[r],i=0,u=a.length;i<u;i++,o++)n[o]=a[i];return n};Object.defineProperty(exports,"__esModule",{value:!0}),exports.getFolderPath=void 0;var n=function(e,r,n){var o=n.directoryRules||[];o.reverse();for(var a=n.baseDownloadDirectory||"",i=0,u=t(o,[{baseDirectory:a}]);i<u.length;i++){var l=u[i],s=l.username||[],c=l.downloadAs||[],f=l.baseDirectory||"",h=l.folderPath||"";if((0===s.length||s.includes(e))&&(0===c.length||c.includes(r))){var d=null;if(""!==f&&(d=f+"/"+e),""!==h&&(d=h),null!==d)return d}}};exports.getFolderPath=function(t){return e(void 0,void 0,Promise,function(){return r(this,function(e){return[2,new Promise(function(e,r){chrome.storage.sync.get({baseDownloadDirectory:"",directoryRules:[]},function(o){var a=n(t.userName,t.ownUserName,o);a?e(a):r("no path found. have you set a path in the extension-options?")})})]})})};
},{}],"qdiV":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.DownloadFeedbackButton=void 0;var t=require("../insta-info-util"),e={initial:"save",loading:"spinner-of-dots",success:"verify-sign-green",fail:"error"},n=function(){function n(){this._downloadState="initial",this._loadingProgress=0,this._spinnerCtx=null,this._spinnerCanvas=null,this._buttonImg=null,this._rootElement=null,this._rootElement=document.createElement("a"),Object.assign(this._rootElement.style,{width:"fit-content",height:"fit-content",cursor:"pointer"}),this._buttonImg=document.createElement("img"),Object.assign(this._buttonImg.style,{width:"inherit",height:"inherit"}),this._rootElement.appendChild(this._buttonImg),this._setInitialState()}return Object.defineProperty(n.prototype,"downloadState",{get:function(){return this._downloadState},set:function(t){this._downloadState=t,this._onDownloadStateChanged()},enumerable:!1,configurable:!0}),Object.defineProperty(n.prototype,"loadingProgress",{get:function(){return this._loadingProgress},set:function(t){this._loadingProgress=t,"loading"===this._downloadState&&this._drawSpinner()},enumerable:!1,configurable:!0}),n.prototype.getElement=function(){return this._rootElement},n.prototype._setInitialState=function(){var n="post"==t.getElementTypesOnCurrentPage()[0]?"dark":"white",i=e.initial+"-"+n;this._buttonImg.src=chrome.extension.getURL("icons/"+i+".png")},n.prototype._onDownloadStateChanged=function(){var n=this._downloadState;if("loading"===n)this._spinnerCanvas||(this._spinnerCanvas=document.createElement("canvas"),this._spinnerCtx=this._spinnerCanvas.getContext("2d"),this._drawSpinner());else{this._spinnerCanvas=null,this._spinnerCtx=null;var i=e[n];if("initial"===n)i+="-"+("post"==t.getElementTypesOnCurrentPage()[0]?"dark":"white");this._buttonImg.src=chrome.extension.getURL("icons/"+i+".png")}},n.prototype._drawSpinner=function(){var t=this._spinnerCtx,e=this._loadingProgress;Object.assign(this._spinnerCanvas,{width:32,height:32}),t.clearRect(0,0,32,32),t.lineWidth=4;var n=(32-t.lineWidth)/2;t.strokeStyle="cyan",t.lineCap="round",t.beginPath();var i=-Math.PI/2;t.arc(16,16,n,i,i+2*e*Math.PI),t.stroke(),this._buttonImg.src=this._spinnerCanvas.toDataURL()},n}();exports.DownloadFeedbackButton=n;
},{"../insta-info-util":"fHsd"}],"biLX":[function(require,module,exports) {
"use strict";var e=this&&this.__assign||function(){return(e=Object.assign||function(e){for(var n,t=1,r=arguments.length;t<r;t++)for(var o in n=arguments[t])Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);return e}).apply(this,arguments)},n=this&&this.__awaiter||function(e,n,t,r){return new(t||(t=Promise))(function(o,a){function i(e){try{u(r.next(e))}catch(n){a(n)}}function s(e){try{u(r.throw(e))}catch(n){a(n)}}function u(e){var n;e.done?o(e.value):(n=e.value,n instanceof t?n:new t(function(e){e(n)})).then(i,s)}u((r=r.apply(e,n||[])).next())})},t=this&&this.__generator||function(e,n){var t,r,o,a,i={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return a={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(a[Symbol.iterator]=function(){return this}),a;function s(a){return function(s){return function(a){if(t)throw new TypeError("Generator is already executing.");for(;i;)try{if(t=1,r&&(o=2&a[0]?r.return:a[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,a[1])).done)return o;switch(r=0,o&&(a=[2&a[0],o.value]),a[0]){case 0:case 1:o=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,r=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!(o=(o=i.trys).length>0&&o[o.length-1])&&(6===a[0]||2===a[0])){i=0;continue}if(3===a[0]&&(!o||a[1]>o[0]&&a[1]<o[3])){i.label=a[1];break}if(6===a[0]&&i.label<o[1]){i.label=o[1],o=a;break}if(o&&i.label<o[2]){i.label=o[2],i.ops.push(a);break}o[2]&&i.ops.pop(),i.trys.pop();continue}a=n.call(e,i)}catch(s){a=[6,s],r=0}finally{t=o=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,s])}}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.createDiskDownloadButton=void 0;var r=require("../../lib/url-to-filename"),o=require("../disk-writing/chrome-download"),a=require("../disk-writing/disk-download"),i=require("../disk-writing/lookup-write-path"),s=require("../insta-info-util"),u=require("./download-feedback-button"),c="chrome-background",l=function(){return new Promise(function(e,n){chrome.storage.sync.get({downloadMethod:c},function(t){chrome.runtime.lastError?n(chrome.runtime.lastError.message):e(t.downloadMethod)})})},d=function(e,u){return n(void 0,void 0,Promise,function(){var n,c,d,f,h;return t(this,function(t){switch(t.label){case 0:return[4,l()];case 1:return n=t.sent(),c=e.src,d=r.createFileNameByUrl(c),"native"!==n?[3,4]:(f=s.getOwnUsername(),[4,i.getFolderPath({mediaSrc:c,userName:e.username,ownUserName:f})]);case 2:return h=t.sent(),[4,a.download({link:c,folderPath:h,fileName:d},u)];case 3:return t.sent(),[3,6];case 4:return"chrome-background"!==n?[3,6]:[4,o.download({filePath:"Instagram/"+e.username+"/"+d,url:c},u)];case 5:t.sent(),t.label=6;case 6:return[2]}})})},f=function(e,r){return n(void 0,void 0,void 0,function(){var n,o,a;return t(this,function(t){switch(t.label){case 0:n=null,t.label=1;case 1:return t.trys.push([1,4,,5]),[4,e()];case 2:return n=t.sent(),[4,d(n,r)];case 3:return t.sent(),[3,5];case 4:throw o=t.sent(),console.error(o),a=n?o+", \n user: "+n.username+", \n src: "+n.src:o,chrome.runtime.sendMessage({type:"show-notification",notification:{title:"download failed",message:a,iconUrl:chrome.extension.getURL("icons/insta-loader-icon-48.png")}}),o;case 5:return[2]}})})};exports.createDiskDownloadButton=function(r,o){void 0===o&&(o={}),o=e({onDownloadStart:function(){},onDownloadEnd:function(){}},o);var a=new u.DownloadFeedbackButton,i=a.getElement();return i.addEventListener("mousedown",function(e){return n(void 0,void 0,void 0,function(){var e;return t(this,function(n){switch(n.label){case 0:a.downloadState="loading",e=function(e){return a.loadingProgress=e},o.onDownloadStart(),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,f(r,e)];case 2:return n.sent(),a.downloadState="success",[3,4];case 3:return n.sent(),a.downloadState="fail",[3,4];case 4:return o.onDownloadEnd(),[2]}})})}),i};
},{"../../lib/url-to-filename":"C547","../disk-writing/chrome-download":"WG80","../disk-writing/disk-download":"Nayg","../disk-writing/lookup-write-path":"DHJp","../insta-info-util":"fHsd","./download-feedback-button":"qdiV"}],"czBw":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createElementByHTML=void 0,exports.createElementByHTML=function(e){var t=document.createElement("div");return t.innerHTML=e,t.firstElementChild};
},{}],"S3Uq":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.injectDownloadButtonsIntoPost=void 0;var t=require("../download-buttons/disk-download-button"),e=require("../insta-info-util"),n=require("../../lib/html-util"),r=function(t){return t.querySelector("section")},o=function(t){var e=t.querySelector("section");if(e){var n=Array.from(e.querySelectorAll("svg"));return n[n.length-1]}console.warn("section with buttons not found")},i=function(t){var e=o(t),n=e.parentElement,r=e.clientHeight+"px";return{width:r,height:r,padding:getComputedStyle(n).getPropertyValue("padding")}},u=function(t,e){Object.assign(e.style,i(t))},s=function(t){if(!e.getPreviewSrcOfPost(t))return Promise.reject("preview-src not found");var n=e.getMediaInfoByHtml(t);return Promise.resolve({username:n.username,src:n.media.src})};exports.injectDownloadButtonsIntoPost=function(e){var o=r(e),i=n.createElementByHTML('\n\t\t<div \n\t\t\tstyle="\n\t\t\t\tdisplay: flex; \n\t\t\t\tflex-direction: row;\n\t\t\t\tpadding: 8px;\n\t\t\t\tpadding-right: 0px;\n\t\t\t\tmargin-left: 10px;\n\t\t\t"\n\t\t></div>\n\t'),d=t.createDiskDownloadButton(function(){return s(e)});u(e,d),i.appendChild(d),o.insertAdjacentElement("beforeend",i)};
},{"../download-buttons/disk-download-button":"biLX","../insta-info-util":"fHsd","../../lib/html-util":"czBw"}],"aEEA":[function(require,module,exports) {
"use strict";var t=this&&this.__awaiter||function(t,e,n,r){return new(n||(n=Promise))(function(o,i){function a(t){try{l(r.next(t))}catch(e){i(e)}}function u(t){try{l(r.throw(t))}catch(e){i(e)}}function l(t){var e;t.done?o(t.value):(e=t.value,e instanceof n?e:new n(function(t){t(e)})).then(a,u)}l((r=r.apply(t,e||[])).next())})},e=this&&this.__generator||function(t,e){var n,r,o,i,a={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:u(0),throw:u(1),return:u(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function u(i){return function(u){return function(i){if(n)throw new TypeError("Generator is already executing.");for(;a;)try{if(n=1,r&&(o=2&i[0]?r.return:i[0]?r.throw||((o=r.return)&&o.call(r),0):r.next)&&!(o=o.call(r,i[1])).done)return o;switch(r=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return a.label++,{value:i[1],done:!1};case 5:a.label++,r=i[1],i=[0];continue;case 7:i=a.ops.pop(),a.trys.pop();continue;default:if(!(o=(o=a.trys).length>0&&o[o.length-1])&&(6===i[0]||2===i[0])){a=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){a.label=i[1];break}if(6===i[0]&&a.label<o[1]){a.label=o[1],o=i;break}if(o&&a.label<o[2]){a.label=o[2],a.ops.push(i);break}o[2]&&a.ops.pop(),a.trys.pop();continue}i=e.call(t,a)}catch(u){i=[6,u],r=0}finally{n=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,u])}}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.injectDownloadButtonsIntoPreview=void 0;var n=require("../download-buttons/disk-download-button"),r=require("../insta-info-util"),o=require("../../lib/html-util"),i=function(n){return t(void 0,void 0,Promise,function(){var t,o,i,a;return e(this,function(e){switch(e.label){case 0:if(null===(t=n.querySelector("a")))throw"link-element not found";return o=t.href,[4,r.fetchMediaInfo(o)];case 1:return i=e.sent(),a=i.mediaArray[0].src,[2,{username:i.username,src:a}]}})})};exports.injectDownloadButtonsIntoPreview=function(t){var e=o.createElementByHTML('\n\t\t<div style="\n\t\t\t\twidth: 100%;\n\t\t\t\tposition: absolute;\n\t\t\t\tleft: 0px;\n\t\t\t\tbottom: 0px;\n\t\t\t\tflex-direction: row;"\n\t\t>\n\t\t</div>\n\t'),r=n.createDiskDownloadButton(function(){return i(t)});Object.assign(r.style,{width:"24px",height:"24px",padding:"5px"}),e.appendChild(r),t.appendChild(e)};
},{"../download-buttons/disk-download-button":"biLX","../insta-info-util":"fHsd","../../lib/html-util":"czBw"}],"Q6Ak":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.injectDownloadButtonsIntoStory=void 0;var e=require("../download-buttons/disk-download-button"),t=require("../insta-info-util"),n=require("../../lib/html-util"),o=function(e){return e.querySelector(".coreSpriteCloseLight").children[0]},r=function(e){try{var n=t.getSrcOfStory(e),o=t.getUsernameByStoryUrl(window.location.href);return Promise.resolve({src:n,username:o})}catch(r){return Promise.reject(r)}},i=function(e){var t=o(e),n=t.clientHeight+"px",r=t.parentElement.parentElement;return{width:n,height:n,margin:getComputedStyle(r).getPropertyValue("margin")}},u=function(){var e=!1,t=document.querySelector("video");return{keepPaused:function(){e=!0;var n=function(){t.paused||t.pause(),e&&window.requestAnimationFrame(n)};n()},continue:function(){e=!1}}};exports.injectDownloadButtonsIntoStory=function(t){var a=o(t);if(null!==a){var l,c=n.createElementByHTML('\n\t\t<div style="position: absolute; right: -56px; top: 56px;"></div>\n\t'),s=(l=null,{onDownloadStart:function(){document.querySelector("video")&&(l=u()).keepPaused()},onDownloadEnd:function(){l&&l.continue()}}),d=e.createDiskDownloadButton(function(){return r(t)},s);Object.assign(d.style,i(t)),c.appendChild(d),a.parentElement.parentElement.insertAdjacentElement("afterend",c)}else console.warn("cannot find the close button. instagram may have changed it.")};
},{"../download-buttons/disk-download-button":"biLX","../insta-info-util":"fHsd","../../lib/html-util":"czBw"}],"Ftk2":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});var t=e(require("../insta-change-detection")),n=require("./post-extension"),o=require("./preview-extension"),d=require("./story-extension");t.default.addEventListener("onPostAdded",function(e){n.injectDownloadButtonsIntoPost(e.detail.element)}),t.default.addEventListener("onPreviewAdded",function(e){o.injectDownloadButtonsIntoPreview(e.detail.element)}),t.default.addEventListener("onStoryAdded",function(e){d.injectDownloadButtonsIntoStory(e.detail.element)}),t.default.start();
},{"../insta-change-detection":"h7U7","./post-extension":"S3Uq","./preview-extension":"aEEA","./story-extension":"Q6Ak"}],"apT2":[function(require,module,exports) {
var n=30;function e(n){var e=n.querySelector("section").getBoundingClientRect().bottom;return window.innerHeight-e}function o(o,t){return e(o)<-n}function t(o,t){return e(o)>n}function r(){return document.querySelector("article").parentElement}function i(){return Array.from(r().children)}function c(){return i().find(o)}function l(){return i().reverse().find(t)}function u(n){var o=n();if(o){var t=-e(o);console.log("target",o,"scroll-delta",-t);var r=window.scrollY+t;window.scrollTo({left:window.scrollX,top:r,behavior:"smooth"})}else console.warn("could not find post to scroll to")}document.addEventListener("keydown",function(n){"w"===n.key?u(l):"s"===n.key&&u(c)});
},{}],"QCba":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),require("./download-extension/combined-download-extension"),require("./post-scroll-navigation");
},{"./download-extension/combined-download-extension":"Ftk2","./post-scroll-navigation":"apT2"}]},{},["QCba"], null)
//# sourceMappingURL=/index.js.map