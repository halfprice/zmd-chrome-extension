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
  var entries = localStorage.entries;
  console.log(entries);
  try {
    JSON.parse(entries).forEach(function(entry) {new Entry(entry);});
  } catch (e) {
    localStorage.entries = JSON.stringify([]);
  }
}

function storeEntries() {
    console.log("store");
    console.log(document.getElementById('entries').childNodes);
    //Creating entry array and store it to localStorage.entries
    localStorage.entries = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('entries').childNodes).map(function(node) {
        return {
            key: node.entry.getElement('key').value,
            long_key: node.entry.getElement('long-key').value,
            url: node.entry.getElement('url').value};
  }));
}

window.onload = function() {
  loadEntries();
  document.getElementById('new').onclick = function() {
    new Entry();
  };
  //document.getElementById('save').onclick = function() {
  //  storeEntries();
  //}
}
