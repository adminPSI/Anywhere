//? THOUGHTS
//? Web Components??????????

//* OPTIONS
//-----------------------
// style: string | plain, default | default
const defaultOptions = '';

function TABLE(options) {
  this._options = { ...options };
}

TABLE.prototype.build = function () {
  console.log(this._options);
};
TABLE.prototype.populate = () => {};
TABLE.prototype.clear = () => {};
TABLE.prototype.addRow = () => {};
TABLE.prototype.updateRow = () => {};
TABLE.prototype.deleteRow = () => {};

//* PUBLIC
//*--------------------------------
function getTable(options) {
  const tableInstance = new TABLE(options);

  return tableInstance;
}
