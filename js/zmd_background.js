// Author: Zhe Wu
// Email: towuzhe@gmail.com
// License: MIT license

var KeyWordOriginal = [
'm',
'c',
'i',
'w',
'dr',
'y',
'map',
'key'
];

var KeyUrl = [];
var KeyWord = KeyWordOriginal;

function MatchingKeyAndUrl(text, tab) {
    for (var i=0; i< KeyUrl.length; i++) {
        if (text == KeyUrl[i].key && tab.url.search(KeyUrl[i].url) > -1) {
            return true;
        }
    }
    if ((text == 'm' && tab.url.search("mail.google.com") > -1) ||
        (text == 'c' && tab.title.search("Google Calendar") > -1) ||
        (text == 'w' && tab.url.search("weibo.com") > -1) ||
        (text == 'i' && tab.url.search("inbox.google.com") > -1) ||
        (text == 'dr' && tab.url.search("drive.google.com") > -1) ||
        (text == 'y' && tab.url.search("youtube.com") > -1) ||
        (text == 'map' && tab.title.search("Google Map") > -1))
    {
        return true;
    }
    if (KeyWord.indexOf(text) == -1) {
        // Not keyword
        if ((tab.url.search(text) > -1) || (tab.title.search(text) > -1)) {
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
        chrome.tabs.create({"url":url});
    }
    else {
        chrome.tabs.update(null, {"url":url});
    }
}

function zmdMain(text) {
    console.log('inputEntered: ' + text);
    var entries = localStorage.entries;
    KeyUrl = []; //clear map
    KeyWord = KeyWordOriginal;
    console.log(entries);
    try {
        JSON.parse(entries).forEach(function(entry) {
            KeyUrl.push({key:entry.key, url:entry.url});
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
                    if (text == 'm') {
                        url = "https://mail.google.com";
                    } else if (text == 'c') {
                        url = "https://calendar.google.com";
                    } else if (text == 'w') {
                        url = "http://www.weibo.com";
                    } else if (text == 'i') {
                        url = "https://inbox.google.com";
                    } else if (text == 'dr') {
                        url = "https://drive.google.com";
                    } else if (text == 'y') {
                        url = "https://www.youtube.com";
                    } else if (text == 'map') {
                        url = "https://maps.google.com";
                    } else if (text == 'key') {
                        url = "https://keepersecurity.com/vault/";
                    } else {
                        // General rule, just use the typed url
                        url = text;
                    }
                }
                if (tabs.length == 1) {
                    // Get current tab. There should always be 1 tab active.
                    if (url.search("http") > -1) {
                        OpenNewPage(tabs[0], url);
                    }
                    else {
                        OpenNewPage(tabs[0], "http://"+url);
                    }
                } else {
                    // Don't know what to do. Creating new tab for now.
                    if (url.search("http") > -1) {
                        chrome.tabs.create({"url":url});
                    }
                    else {
                        chrome.tabs.create({"url":"http://"+url});
                    }
                }
            });
            
        }
    });
}

chrome.omnibox.onInputEntered.addListener(zmdMain);
