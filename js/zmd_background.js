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
    ]);
});
