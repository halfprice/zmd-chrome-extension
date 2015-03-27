var KeyUrl = [];
//var KeyWord = KeyWordOriginal;
var KeyWord = [];

function MatchingKeyAndUrl(text, tab) {
    for (var i=0; i< KeyUrl.length; i++) {
        // If url match
        if (KeyUrl[i].url.length > 0 && text == KeyUrl[i].key && tab.url.toLowerCase().search(KeyUrl[i].url.toLowerCase()) > -1) {
            return true;
        }
    }
    for (var i=0; i< KeyUrl.length; i++) {
        // If title match long key
        if (KeyUrl[i].long_key.length > 0 && text == KeyUrl[i].key && tab.title.toLowerCase().search(KeyUrl[i].long_key.toLowerCase()) > -1) {
            return true;
        }
        if (KeyUrl[i].long_key.length > 0 && text == KeyUrl[i].key && tab.url.toLowerCase().search(KeyUrl[i].long_key.toLowerCase()) > -1) {
            return true;
        }
    }
    if (KeyWord.indexOf(text) == -1) {
        // Not keyword, only search for title
        if ((tab.url.toLowerCase().search(text.toLowerCase()) > -1) || (tab.title.toLowerCase().search(text.toLowerCase()) > -1)) {
            return true;
        }
    }
    return false;
}

function TabExists(currentWindow, text) {
    for (var i = 0; i < currentWindow.tabs.length; i++) {
        if (MatchingKeyAndUrl(text, currentWindow.tabs[i])) {
            return {exist: true, id: currentWindow.tabs[i].id};
        }
    }
    return {exist: false, id: -1};
}

function OpenNewPage(currentTab, url) {
    if (currentTab.pinned) {
        console.log("open new page "+url);
        chrome.tabs.create({"url":url});
    }
    else {
        console.log("update current page "+url);
        chrome.tabs.update(null, {"url":url});
    }
}

function tab_action(text) {
    //console.log('inputEntered: ' + text);
    var entries = localStorage.entries;
    KeyUrl = []; //clear map
    KeyWord = [];
    //console.log(entries);
    try {
        JSON.parse(entries).forEach(function(entry) {
            KeyUrl.push({key:entry.key, long_key:entry.long_key, url:entry.url});
            KeyWord.push(entry.key);
        });
    } catch (e) {
        // Couldn't find configurations
        console.log("Can't find configuration while loading.");
        localStorage.entries = JSON.stringify([]);
    }

    chrome.windows.getCurrent({populate: true}, function(currentWindow) {
        var x = new TabExists(currentWindow, text);
        if (x.exist) {
            chrome.tabs.update(x.id, {active:true});
        }
        else { 
            // Tab does not exist.
            chrome.tabs.query({active:true}, function(tabs) {
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
                if (tabs.length == 1) {
                    // Get current tab. There should always be 1 tab active.
                    if (url.search("://") > -1) {
                        OpenNewPage(tabs[0], url);
                    }
                    else {
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
