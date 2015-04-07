function open_option_page() {
    chrome.tabs.create({"url":"../html/options.html"});
}

window.onload = function() {
    document.getElementById('popup_option').onclick = open_option_page;
    document.getElementById('popup_command').onkeypress = function(e) {
        //console.log(e.which);
        if (e.which == 13) {
            var text = document.getElementById('popup_command').value;
            console.log(text);
            tab_action(text);
            document.getElementById('popup_command').value = "";
            window.close();
        }
    };
}
