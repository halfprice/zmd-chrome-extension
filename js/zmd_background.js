// Author: Zhe Wu
// Email: towuzhe@gmail.com
// License: MIT license

function zmdMain(text) {
    console.log('inputEntered: ' + text);
    tab_action(text);
}

chrome.omnibox.onInputEntered.addListener(zmdMain);
