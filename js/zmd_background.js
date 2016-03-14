// Author: Zhe Wu
// Email: towuzhe@gmail.com
// License: MIT license

var kHistoryLength = 10;

function zmdMain(text) {
    console.log('inputEntered: ' + text);
    tab_action(text);
}

chrome.omnibox.onInputEntered.addListener(zmdMain);

chrome.omnibox.onInputChanged.addListener(function(text, suggest){
    // compose suggestion list.
    suggest([
        {content: text + ' 1', description: "test 1"},
        {content: text + ' 2', description: "test 2"},
        {content: text + ' 3', description: "test 3"}
    ]);
});

chrome.tabs.onActivated.addListener(function (w) {
    /*
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        if (tabs.length > 0) {
            console.log("windowid "+w.windowId+" windowidtab "+tabs[0].windowId+" tabid "+w.tabId+" tabidtab "+tabs[0].id+" index "+tabs[0].index);
        }
    });*/
    try {
        var tab_history = JSON.parse(localStorage["tab_history"]);
    } catch (e) {
        tab_history = []
    }
    var current_tab = {id:w.tabId, win:w.windowId};
    tab_history.push(current_tab);
    //console.log(tab_history);
    while (tab_history.length > kHistoryLength) {
        tab_history.shift();
    }
    localStorage["tab_history"] =JSON.stringify(tab_history);
    //delete localStorage["tab_history"];
});

chrome.tabs.onRemoved.addListener(function (w) {
    try {
        var tab_history = JSON.parse(localStorage["tab_history"]);
    } catch (e) {
        tab_history = []
    }
    for (var i = 0; i < tab_history.length; i++) {
        if (tab_history[i].id == w.tabId &&
            tab_history[i].win == w.windowId) {
            tab_history.splice(i, 1);
            break;
        }
    }
    //console.log(tab_history);
    localStorage["tab_history"] =JSON.stringify(tab_history);
});

chrome.commands.onCommand.addListener(function(command) {
  console.log('onCommand event received for message: ', command);
});

chrome.windows.onCreated.addListener(function (w){
    // Check if this is the first window. If true, create pinned tab. If false, don't do anything
    chrome.windows.getAll({populate: true}, function(currentWindows){
        console.log(currentWindows.length);
        console.log(currentWindows.length == 1);
        if (currentWindows.length == 1) {
            // This is the first window. Create pinned tabs.
            // First read configuration
            var entries = localStorage["zmd_config"];
            var KeyUrl = []
            try {
                JSON.parse(entries).forEach(function(entry) {
                    KeyUrl.push({key:entry.key, key_words:entry.key_words, url:entry.url, pin:entry.pin});
                });
            } catch (e) {
                // Couldn't find configurations
                console.log("Can't find configuration while loading.");
            }
            console.log(KeyUrl.length);
            for (var i = 0; i < KeyUrl.length; i++) {
                if (KeyUrl[i].pin) {
                    chrome.tabs.create({"url": KeyUrl[i].url, "pinned": true});
                }
            }
        }
    });
});
