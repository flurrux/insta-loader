console.log("listening for instagram videos ...");chrome.webRequest.onBeforeRequest.addListener(function(e){const{url:r}=e;if(!r.includes("instagram")&&!r.includes(".webm"))return;const{tabId:o}=e,t=/.*(?=&bytestart)/.exec(r);return t!==null&&chrome.tabs.sendMessage(o,{url:t[0]}),{cancel:!1}},{urls:["*://*.fbcdn.net/*"]});function a(e){const r=chrome.runtime.lastError;return r===void 0?e:r.message||e}const i=e=>new Promise((r,o)=>{chrome.downloads.download(e,t=>{if(t!==void 0){r(t);return}o(a("chrome.runtime.lastError is undefined. no idea what the issue is, sorry"))})});chrome.runtime.onConnect.addListener(e=>{e.name==="chrome-downloader"&&(e.onDisconnect.addListener(()=>console.log("port disconnected")),e.onMessage.addListener(async(r,o)=>{if(console.log(r),r.type==="request-download"){try{const t=await i({url:r.url,filename:r.filePath,conflictAction:"overwrite"});e.postMessage({type:"download-id",id:t})}catch(t){e.postMessage({type:"error",error:t})}return}r.type==="request-state"&&chrome.downloads.search({id:r.id},t=>{if(t.length===0){e.postMessage({type:"error",error:"download started but file not found. this may be a problem with chrome."});return}else{t.length>1&&console.warn("more than one file for this download found. this shoud not happen");const s=t[0],n=s.state;if(n==="interrupted"){e.postMessage({type:"error",error:s.error});return}if(n==="complete"){e.postMessage({type:"success"});return}if(n==="in_progress"){e.postMessage({type:"progress",progress:{bytesReceived:s.bytesReceived,totalBytes:s.totalBytes,progress:s.bytesReceived/s.totalBytes}});return}}})}))});
