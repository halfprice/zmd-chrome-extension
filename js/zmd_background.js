// Author: Zhe Wu
// Email: towuzhe@gmail.com
// License: MIT license

function zmdMain(text) {
    console.log('inputEntered: ' + text);
    tab_action(text);
}

chrome.omnibox.onInputEntered.addListener(zmdMain);

chrome.omnibox.onInputChanged.addListener(function(text, suggest){
    // compose suggestion list.
    suggest([
        {content: text + ' 1', description: "test 1"},
        {content: text + ' 2', description: "test 2"}
        {content: text + ' 3', description: "test 3"}
    ]);
});

chrome.tabs.onActivated.addListener(function (w) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      console.log("windowid "+w.windowId+" windowidtab "+tabs[0].windowId+" tabid "+w.tabId+" tabidtab "+tabs[0].id+" index "+tabs[0].index);
    });
});
