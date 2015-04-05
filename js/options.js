function Entry(data) {
  var entries = document.getElementById('entries');
  this.node = document.getElementById('key-template').cloneNode(true);

  this.node.id = 'entry' + (Entry.next_id++);

  this.node.entry = this;
  entries.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('key').value = data.key;
    this.getElement('long-key').value = data.long_key;
    this.getElement('url').value = data.url;
  }

  this.getElement('key').oninput = storeEntries;
  this.getElement('long-key').oninput = storeEntries;
  this.getElement('url').oninput = storeEntries;

  var entry = this;

  this.getElement('remove').onclick = function() {
    entry.node.parentNode.removeChild(entry.node);
    storeEntries();
  };
  storeEntries();
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
    console.log("store");
    console.log(document.getElementById('entries').childNodes);
    //Creating entry array and store it to localStorage
    localStorage["zmd_config"] = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('entries').childNodes).map(function(node) {
        return {
            key: node.entry.getElement('key').value,
            long_key: node.entry.getElement('long-key').value,
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
            items = line.split(/[\s]+/);
            if (items[0] == "") {
              items.splice(0, 1);  // remove first element in array
            }
            console.log(items);
            if (items.length >= 3) {
              console.log('selected '+items);
              var new_entry = {key: items[0], long_key: items[1], url: items[2]};
              // create new entry
              new Entry(new_entry);
            }
          });
        }
        reader.readAsText(files.files[0]);
      }
      else{
        console.log("error file length");
      }
    }
    else{
      window.alert("No file selected!");
    }
  }
}

window.onload = function() {
  loadEntries();
  document.getElementById('new').onclick = function() {
    new Entry();
  };
  document.getElementById('upload').onclick = readConfigFile;
  //document.getElementById('save').onclick = function() {
  //  storeEntries();
  //}
}
