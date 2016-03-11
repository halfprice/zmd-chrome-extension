function Entry(data) {
  var entries = document.getElementById('entries');
  this.node = document.getElementById('key-template').cloneNode(true);

  this.node.id = 'entry' + (Entry.next_id++);

  this.node.entry = this;
  entries.appendChild(this.node);
  this.node.hidden = false;


  if (data) {
    this.getElement('key').value = data.key;
    this.getElement('key-words').value = data.key_words;
    this.getElement('url').value = data.url;
  }

  this.getElement('key').oninput = storeEntries;
  this.getElement('key-words').oninput = storeEntries;
  this.getElement('url').oninput = storeEntries;

  var entry = this;


  this.getElement('remove').onclick = function() {
    entry.node.parentNode.removeChild(entry.node);
    storeEntries();
  };
  storeEntries();
}

var toType = function(obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}

function tableNodeFilter(node) {
    // Ignore table header
    if (node.nodeName == '#text' || node.nodeName == 'TBODY') {
        return false;
    }
    return true;
}

Entry.next_id = 0;

Entry.prototype.getElement = function(name) {
  return document.querySelector('#' + this.node.id + ' .' + name);
}

function loadEntries() {
  var entries = localStorage["zmd_config"];
  console.log(entries);
  try {
    JSON.parse(entries).forEach(function(entry) {new Entry(entry);});
  } catch (e) {
    localStorage["zmd_config"] = JSON.stringify([]);
  }
}

function storeEntries() {
    console.log("Storing configuration.");
    //console.log(document.getElementById('entries').childNodes);

    //Creating entry array and store it to localStorage
    localStorage["zmd_config"] = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('entries').childNodes).filter(tableNodeFilter).map(function(node) {
        return {
            key: node.entry.getElement('key').value,
            key_words: node.entry.getElement('key-words').value,
            url: node.entry.getElement('url').value};
    }));
}

function readConfigFile() {
  // first check if file reader is supported
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Get file input element
    var files = document.getElementById('file');
    if (files.value != ""){
      // file exists
      if (files.files.length == 1) {

        console.log(files.files[0].name+' '+files.files.length+' '+files.files[0].type);

        var reader = new FileReader();

        reader.onload = function(event) {
          var content = reader.result;
          var lines = content.split('\n');
          lines.forEach(function(line){
            items = line.split(/[,]+/);
            if (items[0] == "") {
              items.splice(0, 1);  // remove first element in array
            }
            console.log(items);
            if (items.length >= 3) {
              console.log('selected '+items);
              var new_entry = {key: items[0], key_words: items[1], url: items[2]};
              // create new entry
              new Entry(new_entry);
            }
          });
        }
        reader.readAsText(files.files[0]);
      }
      else{
        console.log("Wrong file length.");
      }
    }
    else{
      window.alert("No file selected!");
    }
  }
}

function exportConfiguration() {
    var config_csv = "";
    Array.prototype.slice.apply(
      document.getElementById('entries').childNodes).filter(tableNodeFilter).map(function(node) {
        config_csv += node.entry.getElement('key').value+','+node.entry.getElement('key-words').value+','+node.entry.getElement('url').value+'\n'
    });
    window.open('data:text/csv;charset=utf-8;filename=configuration.txt,' + escape(config_csv), "configuration.txt");
    //window.saveAs(config_csv, "configuration.txt");
}

window.onload = function() {
  loadEntries();
  document.getElementById('new').onclick = function() {
    new Entry();
  };
  document.getElementById('upload').onclick = readConfigFile;
  document.getElementById('removeall').onclick = function() {
    var entries = document.getElementById('entries');
    while (entries.childNodes.length > 0){
        var entry = entries.childNodes[0];
        console.log('remove'+entry);
        entries.removeChild(entry);
        storeEntries();
    }
  };
  document.getElementById('export').onclick = exportConfiguration;
  //document.getElementById('save').onclick = function() {
  //  storeEntries();
  //}
}
