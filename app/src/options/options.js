

//rules ###
//downloaded as, username, baseDirectory, folderPath
const ruleEntryClasses = {};
const getRuleEntryTagNameByKey = key => {
    return ruleEntryClasses[key];
};
const getRuleEntryKeyByTagName = tagName => {
    return Reflect.ownKeys(ruleEntryClasses).find(key => ruleEntryClasses[key] === tagName);
};

class RuleEntry extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                #delete-button {
                    border-radius: 50%; 
                    background-color: white; 
                    border: 1px solid black;
                }
            </style>
            ${this.getContentHTML()}
            <button id="delete-button">x</button>
        `;
        this.shadowRoot.querySelector("#delete-button").addEventListener("click", e => {
            this.remove()
            saveRules();
        });
    }
    getContentHTML(){
        return "";
    }
    static getRuleLabel(){
        return "";
    }
    getRuleValue(){
        return null;
    }
    setRuleValue(newRuleValue){
        this._currentRuleValue = newRuleValue;
    }
}
class TextRuleEntry extends RuleEntry {
    constructor(){
        super();
        this.shadowRoot.querySelector("#rule-value-input").addEventListener("change", () => saveRules());
    }
    getContentHTML(){
        return `
            <label>${this.constructor.getRuleLabel()}</label>
            <input id="rule-value-input" type="text" value="" />
        `;
    }
    static getRuleLabel(){
        return "";
    }
    getRuleValue(){
        return this.shadowRoot.querySelector("#rule-value-input").value;
    }
    setRuleValue(newRuleValue){
        return this.shadowRoot.querySelector("#rule-value-input").value = newRuleValue;
    }
}
class CommaSeperatedTextRuleEntry extends TextRuleEntry {
    getRuleValue(){
        const rawText = this.shadowRoot.querySelector("#rule-value-input").value;
        return rawText.split(",").map(part => part.trim());
    }
    setRuleValue(newRuleValue){
        return this.shadowRoot.querySelector("#rule-value-input").value = newRuleValue.join(", ");
    }
}

class DownloadedAsRuleEntry extends CommaSeperatedTextRuleEntry {
    static getRuleLabel(){
        return "downloaded as";
    }
}
customElements.define("downloaded-as-rule-entry", DownloadedAsRuleEntry);
ruleEntryClasses.downloadAs = "downloaded-as-rule-entry";

class UserNameRuleEntry extends CommaSeperatedTextRuleEntry {
    static getRuleLabel(){
        return "username";
    }
}
customElements.define("username-rule-entry", UserNameRuleEntry);
ruleEntryClasses.username = "username-rule-entry";

class BaseDirectoryRuleEntry extends CommaSeperatedTextRuleEntry {
    static getRuleLabel(){
        return "base directory";
    }
}
customElements.define("basedirectory-rule-entry", BaseDirectoryRuleEntry);
ruleEntryClasses.baseDirectory = "basedirectory-rule-entry";

class FolderPathRuleEntry extends CommaSeperatedTextRuleEntry {
    static getRuleLabel(){
        return "folder path";
    }
}
customElements.define("folder-path-as-rule-entry", FolderPathRuleEntry);
ruleEntryClasses.folderPath = "folder-path-as-rule-entry";

class RuleElement extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.innerHTML = `
            <style>
                #rule-body {
                    display: flex;
                    flex-direction: row;
                    flex: 1;
                }
                #rules-container {
                    //display: grid;
                    //grid-template-columns: 200px 1fr;
                    display: flex;
                    flex-direction: column;
                }
                #add-rule-entry-button {
                    height: fit-content;
                }
            </style>
            <div id="rule-body">
                <div id="rules-container"></div>
                <select id="add-rule-entry-button" value="+">
                    <option selected disabled>+</option>
                    ${
                        Reflect.ownKeys(ruleEntryClasses).map(key => {
                            return `
                                <option data-rule-key="${key}">${key}</option>
                            `;
                        })
                        .join("")
                    }
                </select>
            </div>
        `;
        
        const addRuleEntryButton = this.shadowRoot.querySelector("#add-rule-entry-button");
        addRuleEntryButton.addEventListener("change", () => {
            const selectedOption = addRuleEntryButton.selectedOptions[0];
            const selectedTagName = ruleEntryClasses[selectedOption.getAttribute("data-rule-key")];
            const rulesContainer = this.shadowRoot.querySelector("#rules-container");
            if (this.hasRuleEntryOfType(selectedTagName)){
                return;
            }
            const ruleEntryElement = document.createElement(selectedTagName);
            rulesContainer.appendChild(ruleEntryElement);
            saveRules();
        });
    }
    addRuleEntry(entryElement){
        this.shadowRoot.querySelector("#rules-container").appendChild(entryElement);
    }
    hasRuleEntryOfType(tagName){
        const rulesContainer = this.shadowRoot.querySelector("#rules-container");
        return Array.from(rulesContainer.children).some(child => child.tagName.toLowerCase() === tagName);
    }
    getRuleData(){
        const rulesContainer = this.shadowRoot.querySelector("#rules-container");
        const ruleEntries = Array.from(rulesContainer.children);
        const ruleData = {};
        for (let entry of ruleEntries){
            ruleData[getRuleEntryKeyByTagName(entry.tagName.toLowerCase())] = entry.getRuleValue();
        }
        return ruleData;
    }
}
customElements.define("rule-element", RuleElement);

document.querySelector("#add-rule-button").addEventListener("click", () => {
    const ruleElement = document.createElement("rule-element");
    document.querySelector("#rule-list").appendChild(ruleElement);
});

function saveRules(){
    const ruleElements = Array.from(document.querySelector("#rule-list").children);
    const rulesData = ruleElements.map(ruleElement => ruleElement.getRuleData());
    chrome.storage.sync.set(
        { directoryRules: rulesData }, 
        () => console.log("saved")
    )
}

function restoreOptions() {
    chrome.storage.sync.get(
        {
            baseDownloadDirectory: "", 
            directoryRules: []
        }, 
        (items) => {
            document.querySelector("#download-directory-input").value = items.baseDownloadDirectory;
        
            const ruleList = document.querySelector("#rule-list");
            for (let rule of items.directoryRules){
                const ruleElement = document.createElement("rule-element");
                ruleList.appendChild(ruleElement);

                for (let ruleKey of Reflect.ownKeys(rule)){
                    const entryClass = ruleEntryClasses[ruleKey];
                    const entryElement = document.createElement(entryClass);
                    entryElement.setRuleValue(rule[ruleKey]);
                    ruleElement.addRuleEntry(entryElement);
                }
            }
        }
    );
}
document.addEventListener('DOMContentLoaded', restoreOptions);

//baseDirectory ###
document.querySelector("#download-directory-input").addEventListener("change", () => {
    chrome.storage.sync.set(
        { baseDownloadDirectory: document.querySelector("#download-directory-input").value }, 
        () => console.log("saved")
    )
});