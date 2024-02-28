chrome.runtime.onInstalled.addListener(() => {

    chrome.contextMenus.create({
        id: "replaceSelectToSpan",
        title: "Remove Select",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "replaceInputToSpan",
        title: "Remove Input",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "selectFirstOption",
        title: "Select First Option",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "enterValuesInAllInput",
        title: "Enter Values In All Input",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "enterValuesInGivenInput",
        title: "Enter Values In Given Column Input",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "maskValues",
        title: "Mask Values",
        contexts: ["page"]
    });

    chrome.contextMenus.create({
        id: "downloadTable",
        title: "Download table",
        contexts: ["page"]
    });
    
    chrome.contextMenus.create({
        id: "uploadFile",
        title: "Upload a file",
        contexts: ["page"]
    });

});


chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log(tab);
    if(tab.url.includes("rajshaladarpan")){
        if (info.menuItemId === "replaceSelectToSpan") {
            chrome.tabs.sendMessage(tab.id, { type: "replaceSelectToSpan", url: tab.url })
        }
    
        else if (info.menuItemId === "replaceInputToSpan") {
            chrome.tabs.sendMessage(tab.id, { type: "replaceInputToSpan", url: tab.url })
        }
    
        else if (info.menuItemId === "selectFirstOption") {
            chrome.tabs.sendMessage(tab.id, { type: "selectFirstOption", url: tab.url })
        }
        else if (info.menuItemId === "enterValuesInAllInput") {
            chrome.tabs.sendMessage(tab.id, { type: "enterValuesInAllInput", url: tab.url })
        }
        else if (info.menuItemId === "enterValuesInGivenInput") {
            chrome.tabs.sendMessage(tab.id, { type: "enterValuesInGivenInput", url: tab.url })
        }
        else if (info.menuItemId === "maskValues") {
            chrome.tabs.sendMessage(tab.id, { type: "maskValues", url: tab.url })
        }
        else if (info.menuItemId === "downloadTable") {
            chrome.tabs.sendMessage(tab.id, { type: "downloadTable", url: tab.url })
        }
        else if (info.menuItemId === "uploadFile") {
            chrome.tabs.sendMessage(tab.id, { type: "uploadFile", url: tab.url })
        }
    }
});