parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"omYY":[function(require,module,exports) {
const e={},t=t=>e[t],n=t=>Reflect.ownKeys(e).find(n=>e[n]===t);class r extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`\n            <style>\n                #delete-button {\n                    border-radius: 50%; \n                    background-color: white; \n                    border: 1px solid black;\n                }\n            </style>\n            ${this.getContentHTML()}\n            <button id="delete-button">x</button>\n        `,this.shadowRoot.querySelector("#delete-button").addEventListener("click",e=>{this.remove(),i()})}getContentHTML(){return""}static getRuleLabel(){return""}getRuleValue(){return null}setRuleValue(e){this._currentRuleValue=e}}class o extends r{constructor(){super(),this.shadowRoot.querySelector("#rule-value-input").addEventListener("change",()=>i())}getContentHTML(){return`\n            <label>${this.constructor.getRuleLabel()}</label>\n            <input id="rule-value-input" type="text" value="" />\n        `}static getRuleLabel(){return""}getRuleValue(){return this.shadowRoot.querySelector("#rule-value-input").value}setRuleValue(e){return this.shadowRoot.querySelector("#rule-value-input").value=e}}class l extends o{getRuleValue(){return this.shadowRoot.querySelector("#rule-value-input").value.split(",").map(e=>e.trim())}setRuleValue(e){return this.shadowRoot.querySelector("#rule-value-input").value=e.join(", ")}}class u extends l{static getRuleLabel(){return"downloaded as"}}customElements.define("downloaded-as-rule-entry",u),e.downloadAs="downloaded-as-rule-entry";class s extends l{static getRuleLabel(){return"username"}}customElements.define("username-rule-entry",s),e.username="username-rule-entry";class a extends l{static getRuleLabel(){return"base directory"}}customElements.define("basedirectory-rule-entry",a),e.baseDirectory="basedirectory-rule-entry";class d extends l{static getRuleLabel(){return"folder path"}}customElements.define("folder-path-as-rule-entry",d),e.folderPath="folder-path-as-rule-entry";class c extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.innerHTML=`\n            <style>\n                #rule-body {\n                    display: flex;\n                    flex-direction: row;\n                    flex: 1;\n                }\n                #rules-container {\n                    //display: grid;\n                    //grid-template-columns: 200px 1fr;\n                    display: flex;\n                    flex-direction: column;\n                }\n                #add-rule-entry-button {\n                    height: fit-content;\n                }\n            </style>\n            <div id="rule-body">\n                <div id="rules-container"></div>\n                <select id="add-rule-entry-button" value="+">\n                    <option selected disabled>+</option>\n                    ${Reflect.ownKeys(e).map(e=>`\n                                <option data-rule-key="${e}">${e}</option>\n                            `).join("")}\n                </select>\n            </div>\n        `;const t=this.shadowRoot.querySelector("#add-rule-entry-button");t.addEventListener("change",()=>{const n=t.selectedOptions[0],r=e[n.getAttribute("data-rule-key")],o=this.shadowRoot.querySelector("#rules-container");if(this.hasRuleEntryOfType(r))return;const l=document.createElement(r);o.appendChild(l),i()})}addRuleEntry(e){this.shadowRoot.querySelector("#rules-container").appendChild(e)}hasRuleEntryOfType(e){const t=this.shadowRoot.querySelector("#rules-container");return Array.from(t.children).some(t=>t.tagName.toLowerCase()===e)}getRuleData(){const e=this.shadowRoot.querySelector("#rules-container"),t=Array.from(e.children),r={};for(let o of t)r[n(o.tagName.toLowerCase())]=o.getRuleValue();return r}}function i(){const e=Array.from(document.querySelector("#rule-list").children).map(e=>e.getRuleData());chrome.storage.sync.set({directoryRules:e},()=>console.log("saved"))}function y(){chrome.storage.sync.get({baseDownloadDirectory:"",directoryRules:[]},t=>{document.querySelector("#download-directory-input").value=t.baseDownloadDirectory;const n=document.querySelector("#rule-list");for(let r of t.directoryRules){const t=document.createElement("rule-element");n.appendChild(t);for(let n of Reflect.ownKeys(r)){const o=e[n],l=document.createElement(o);l.setRuleValue(r[n]),t.addRuleEntry(l)}}})}customElements.define("rule-element",c),document.querySelector("#add-rule-button").addEventListener("click",()=>{const e=document.createElement("rule-element");document.querySelector("#rule-list").appendChild(e)}),document.addEventListener("DOMContentLoaded",y),document.querySelector("#download-directory-input").addEventListener("change",()=>{chrome.storage.sync.set({baseDownloadDirectory:document.querySelector("#download-directory-input").value},()=>console.log("saved"))});
},{}]},{},["omYY"], null)
//# sourceMappingURL=/options.js.map