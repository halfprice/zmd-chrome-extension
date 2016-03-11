function open_option_page() {
    chrome.tabs.create({"url":"../html/options.html"});
}

function getRegisteredKeys() {
    var config_csv = "";
    var entries = localStorage["zmd_config"];
    try {
        JSON.parse(entries).forEach(function(entry) {config_csv += entry.key+',  '+entry.key_words+',  '+entry.url+'<br/>';});
    } catch (e) {
        console.log("display registered key error.")
    }
    return config_csv;
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

    document.getElementById('registered').innerHTML = getRegisteredKeys();
}
