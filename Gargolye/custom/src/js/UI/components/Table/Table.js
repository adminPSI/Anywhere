//? THOUGHTS

//* OPTIONS
//-----------------------
// base options do not include data or callbacks
//-----------------------
// style: default || plain
// rowSortable: true || false
// columnSortable: true || false
// allowCopy: true || false

//*

const DEFAULT_TABLE_OPTIONS = {
  style: 'default',
  rowSortable: false,
  columnSortable: false,
  allowCopy: false,
};

function TABLE(options) {
  this._options = { ...DEFAULT_TABLE_OPTIONS, ...options };
}

TABLE.prototype.build = function () {
  const table = document.createElement('div');
  const tableHeader = document.createElement('div');
  const tableBody = document.createElement('div');

  table.classList.add('table');
  tableHeader.classList.add('tableHeader');
  tableBody.classList.add('tableBody');

  table.appendChild(tableHeader);
  table.appendChild(tableBody);

  // set reference
  this.table = table;
  this.tableBody = tableBody;

  return this;
};
TABLE.prototype.render = function () {
  document.body.prepend(this.table);

  return this;
};
TABLE.prototype.populate = function () {};
TABLE.prototype.clear = function () {};
TABLE.prototype.addRow = function () {};
TABLE.prototype.updateRow = function () {};
TABLE.prototype.deleteRow = function () {};

//* PUBLIC
//*--------------------------------
function getNewTable(opts) {
  return new TABLE(opts);
}
const newTable = getNewTable({
  style: 'plain',
});

newTable.build().render();
