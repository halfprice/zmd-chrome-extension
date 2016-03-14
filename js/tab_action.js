var bkg = chrome.extension.getBackgroundPage(); // used for logging

var KeyUrl = []; // List of key urls
var KeyWord = []; // List of short key words
var KeyWords = [];

var Commands = ["dg", "ds"]; // command is used to do some action on tabs

function MatchingKeyAndUrl(text, tab, key_index) {
    // the key is pre-defined key. Check if url of that key match tab url
    if (KeyUrl[key_index].url.length > 0 && text == KeyUrl[key_index].key && 
        tab.url.toLowerCase().search(KeyUrl[key_index].url.toLowerCase()) > -1) {
        return true;
    }
    return false
}

function MatchingKeyAndLongkey(text, tab, key_index){
    // If tab title match long key
    if (KeyUrl[key_index].key_words.length > 0 && text == KeyUrl[key_index].key && 
        tab.title.toLowerCase().search(KeyUrl[key_index].key_words.toLowerCase()) > -1) {
        return true;
    }
    // If tab url contains long key
    if (KeyUrl[key_index].key_words.length > 0 && text == KeyUrl[key_index].key &&
        tab.url.toLowerCase().search(KeyUrl[key_index].key_words.toLowerCase()) > -1) {
        return true;
    }
    return false;
}

function MatchingKeyAndTitle(text, tab, key_index){
    if (KeyWord.indexOf(text) == -1) { // if it is keyword, don't do url or title maching.
        // Not keyword, only search for title
        if ((tab.url.toLowerCase().search(text.toLowerCase()) > -1) || (tab.title.toLowerCase().search(text.toLowerCase()) > -1)) {
            return true;
        }
    }
    return false;
}

function TabExists(currentWindow, text) {
    for (var i = 0; i < currentWindow.tabs.length; i++) {
        for (var j = 0; j < KeyUrl.length; j++){
            if (MatchingKeyAndUrl(text, currentWindow.tabs[i], j)) {
                return {exist: true, id: currentWindow.tabs[i].id};
            }
        }
    }
    for (var i = 0; i < currentWindow.tabs.length; i++) {
        for (var j = 0; j < KeyUrl.length; j++){
            if (MatchingKeyAndLongkey(text, currentWindow.tabs[i], j)) {
                return {exist: true, id: currentWindow.tabs[i].id};
            }
        }
    }
    for (var i = 0; i < currentWindow.tabs.length; i++) {
        for (var j = 0; j < KeyUrl.length; j++){
            if (MatchingKeyAndTitle(text, currentWindow.tabs[i], j)) {
                return {exist: true, id: currentWindow.tabs[i].id};
            }
        }
    }
    return {exist: false, id: -1};
}

function ExecuteCommand(currentWindow, text) {
    if (text == "dg") {
        // Delete all google search tabs
        for (var i = 0; i < currentWindow.tabs.length; i++) {
            if ((currentWindow.tabs[i].url.toLowerCase().search("www.google.com/search") > -1) || 
                (currentWindow.tabs[i].url.toLowerCase().search("www.google.com/webhp") > -1)) {
                // Close that tab
                chrome.tabs.remove(currentWindow.tabs[i].id);
            }
        }
    }
    if (text == "ds") {
        // Delete all stack overflow tabls
        for (var i = 0; i < currentWindow.tabs.length; i++) {
            if ((currentWindow.tabs[i].url.toLowerCase().search("stackoverflow.com") > -1)) {
                // Close that tab
                chrome.tabs.remove(currentWindow.tabs[i].id);
            }
        }
    }
}

function OpenNewPage(currentTab, url) {
    /*
    if (currentTab.pinned) {
        bkg.console.log("open new page "+url);
        chrome.tabs.create({"url":url});
    }
    else {
        bkg.console.log("update current page "+url);
        chrome.tabs.update(null, {"url":url});
    }*/

    bkg.console.log("open new page "+url);
    chrome.tabs.create({"url":url});
}

function tab_action(text) {
    //bkg.console.log('inputEntered: ' + text);
    var entries = localStorage["zmd_config"];
    KeyUrl = []; //clear map
    KeyWord = [];
    bkg.console.log(entries);
    try {
        JSON.parse(entries).forEach(function(entry) {
            KeyUrl.push({key:entry.key, key_words:entry.key_words, url:entry.url});
            KeyWord.push(entry.key);
        });
    } catch (e) {
        // Couldn't find configurations
        bkg.console.log("Can't find configuration while loading.");
        localStorage["zmd_config"] = JSON.stringify([]);
    }

    chrome.windows.getAll({populate: true}, function(currentWindows){
        var actionTaken = currentWindows.some(function(currentWindow) {
            if ( Commands.indexOf(text) > -1 ) {
                // Execute Command
                ExecuteCommand(currentWindow, text);
            }
            else {
                var x = new TabExists(currentWindow, text);
                if (x.exist) {
                    chrome.tabs.update(x.id, {active:true});
                    return true; // Stop windows iteration. See Array.some()
                }
                else {}
            }
        });

        if (Commands.indexOf(text) == -1 && !actionTaken) {
            // text is not a command and Tab does not exist.
            chrome.tabs.query({active:true}, function(tabs) {
                // See if text is a pre-defined key
                var found_url = false
                for (i = 0; i < KeyUrl.length; i++) {
                    if (text == KeyUrl[i].key) {
                        url = KeyUrl[i].url;
                        found_url = true;
                        break;
                    }
                }
                if (!found_url) {
                    // General rule, just use the typed url
                    url = text;
                }
                if (tabs.length > 0) {  // TODO: is this right?
                    // Get current tab. There should always be 1 tab active.
                    if (url.search("://") > -1) {
                        bkg.console.log("open new page "+ url);
                        OpenNewPage(tabs[0], url);
                    }
                    else {
                        bkg.console.log("open new page "+ url);
                        OpenNewPage(tabs[0], "http://"+url);
                    }
                } /*else {
                    // Don't know what to do. Creating new tab for now.
                    if (url.search("http") > -1) {
                        chrome.tabs.create({"url":url});
                    }
                    else {
                        chrome.tabs.create({"url":"http://"+url});
                    }
                }*/
            });
        }
    });
}
