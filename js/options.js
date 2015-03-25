function Entry(data) {
  var entries = document.getElementById('entries');
  this.node = document.getElementById('key-template').cloneNode(true);

  this.node.id = 'entry' + (Entry.next_id++);

  this.node.entry = this;
  entries.appendChild(this.node);
  this.node.hidden = false;

  if (data) {
    this.getElement('key').value = data.key;
    this.getElement('url').value = data.url;
  }

  this.getElement('key').onkeyup = storeEntries;
  this.getElement('url').onkeyup = storeEntries;

  var entry = this;

  this.getElement('remove').onclick = function() {
    console.log(entry.node.parentNode.length);
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
    localStorage.entries = JSON.stringify(Array.prototype.slice.apply(
      document.getElementById('entries').childNodes).map(function(node) {
    return {key: node.entry.getElement('key').value,
            url: node.entry.getElement('url').value};
  }));
}

window.onload = function() {
  loadEntries();
  document.getElementById('new').onclick = function() {
    new Entry();
  };
}
