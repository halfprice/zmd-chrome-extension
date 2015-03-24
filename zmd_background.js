// Author: Zhe Wu
// Email: towuzhe@gmail.com
// License: MIT license

function MatchingKeyAndUrl(text, tab) {
    if ((tab.url.search(text) > -1) ||  //general rules
        (tab.title.search(text) > -1) ||  //general rules
        (text == 'm' && tab.url.search("mail.google.com") > -1) ||
        (text == 'c' && tab.title.search("Google Calendar") > -1) ||
        (text == 'i' && tab.url.search("inbox.google.com") > -1) ||
        (text == 'dr' && tab.url.search("drive.google.com") > -1) ||
        (text == 'y' && tab.url.search("youtube.com") > -1) ||
        (text == 'map' && tab.title.search("Google Map") > -1))
    {
        return true;
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

function zmdMain(text) {
    console.log('inputEntered: ' + text);
    chrome.windows.getCurrent({populate: true}, function(currentWindow) {
        var x = new TabExists(currentWindow, text);
        if (x.exist) {
            chrome.tabs.update(x.id, {active:true});
        }
        else { 
            // Tab does not exist.
            if (text == 'm') {
                chrome.tabs.update(null, {url:"https://mail.google.com"});
            } else if (text == 'c') {
                chrome.tabs.update(null, {url:"https://calendar.google.com"});
            } else if (text == 'w') {
                chrome.tabs.update(null, {url:"http://www.weibo.com"});
            } else if (text == 'f') {
                chrome.tabs.update(null, {url:"https://www.facebook.com"});
            } else if (text == 'dr') {
                chrome.tabs.update(null, {url:"https://drive.google.com"});
            } else if (text == 'y') {
                chrome.tabs.update(null, {url:"https://www.youtube.com"});
            } else if (text == 'map') {
                chrome.tabs.update(null, {url:"https://maps.google.com"});
            } else if (text == 'key') {
                chrome.tabs.update(null, {url:"https://keepersecurity.com/vault/"});
            } else {
                // General rule, just use the typed url
                chrome.tabs.update(null, {url:"http://"+text});
            }
        }
    });
}

chrome.omnibox.onInputEntered.addListener(zmdMain);
