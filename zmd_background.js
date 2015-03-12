// Author: Zhe Wu
// Email: towuzhe@gmail.com
// License: MIT license

chrome.omnibox.onInputEntered.addListener(
  function(text) {
    console.log('inputEntered: ' + text);
    if (text == 'm') {
        chrome.tabs.update(null, {url:"https://mail.google.com"});
        return;
    }
    if (text == 'c') {
        chrome.tabs.update(null, {url:"https://calendar.google.com"});
        return;
    }
    if (text == 'w') {
        chrome.tabs.update(null, {url:"http://www.weibo.com"});
        return;
    }
    if (text == 'douban') {
        chrome.tabs.update(null, {url:"https://www.douban.com"});
        return;
    }
    if (text == 'xiaonei') {
        chrome.tabs.update(null, {url:"http://www.renren.com"});
        return;
    }
    if (text == 'f') {
        chrome.tabs.update(null, {url:"https://www.facebook.com"});
        return;
    }
    if (text == 'dr') {
        chrome.tabs.update(null, {url:"https://drive.google.com"});
        return;
    }
    if (text == 'y') {
        chrome.tabs.update(null, {url:"https://www.youtube.com"});
        return;
    }
    if (text == 'youku') {
        chrome.tabs.update(null, {url:"http://www.youku.com"});
        return;
    }
    if (text == 'map') {
        chrome.tabs.update(null, {url:"https://maps.google.com"});
        return;
    }
    if (text == 'magic') {
        chrome.tabs.update(null, {url:"http://mbus.doublemap.com/map/"});
        return;
    }
    if (text == 'wol') {
        chrome.tabs.update(null, {url:"http://wolverineaccess.umich.edu"});
        return;
    }
    if (text == 'key') {
        chrome.tabs.update(null, {url:"https://keepersecurity.com/vault/"});
        return;
    }
    if (text == 'ex') {
        chrome.tabs.update(null, {url:"chrome://extensions/"});
        return;
    }
  });
