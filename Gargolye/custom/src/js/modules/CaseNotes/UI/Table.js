//? table filtering
//? custom visible columns
//? row styles: grid, horizontal, free form,
//? row subtext, cell subtext? aka row note
//? pagination
//? allow table to go fullscreen

//TODO-ASH: multiselect rows w/bulk actions
//TODO-ASH: clickable end row icons
//TODO-ASH: table headline <caption></caption>
//TODO-ASH: row density control

(function (global, factory) {
  global = global || self;
  global.Table = factory();
})(this, function () {
  /**
   * Get the index of node related to sibilings
   * @param {HTMLElement} node
   * @returns {Number}
   */
  const getNodeIndex = node => {
    return Array.from(node.parentNode.children).indexOf(node);
  };

  function checkDateFormat(dateString) {
    // Regex pattern for ISO date format (YYYY-MM-DD)
    const isoFormatPattern = /^\d{4}-\d{2}-\d{2}$/;
    // Regex pattern for Standard format (MM/DD/YYYY)
    const standardFormatPattern = /^\d{2}\/\d{2}\/\d{4}$/;

    if (isoFormatPattern.test(dateString)) {
      return 'ISO';
    } else if (standardFormatPattern.test(dateString)) {
      return 'Standard';
    } else {
      return 'Unknown format';
    }
  }

  /**
   * Formats the date for table view
   * @param {String} dateString  dateString format must be ISO YYYY-MM-DD
   */
  const formatDate = dateString => {
    if (!dateString) return '';
    if (checkDateFormat(dateString) !== 'ISO') return '';
    const date = new Date(`${dateString}T00:00`);
    return new Intl.DateTimeFormat('en-US').format(date);
  };

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    style: 'default',
    rowSortable: false,
    columnSortable: false,
    allowCopy: false,
    allowDelete: false,
  };

  /**
   * @class Table
   * @param {Object}  options
   * @param {Array}   options.headings
   * @param {String}  [options.style]           Table style
   * @param {Boolean} [options.rowSortable]     Row re ordering
   * @param {Boolean} [options.columnSortable]  Column sorting by header
   * @param {Boolean} [options.allowCopy]       Row's can be duplicated by copy
   * @param {Boolean} [options.allowDelete]       Row's can be duplicated by copy
   */
  function Table(options) {
    // Data Init
    this.options = _UTIL.mergeObjects(DEFAULT_OPTIONS, options);
    this.rows = {};
    this.selectedRows = {};

    this.rootElement = null;
    this.table = null;

    this._build();
    this._setupEvents();

    // this.table = table ref
    // this.table.tHead = table header
    // this.table.tFoot = table footer
    // this.table.tBodies = html collection of table bodies
    // this.table.rows = html collection
    // this.table[rowID] = row ref
    // this.table.caption = table caption
  }

  /**
   * Builds & Populates Table
   */
  Table.prototype._build = function () {
    //* create table
    this.rootElement = _DOM.createElement('div', { class: 'ui_table' });
    const tableNav = _DOM.createElement('div', { class: 'ui-table__nav' });
    this.table = _DOM.createElement('table');
    const tableBody = _DOM.createElement('tbody');
    const tableHeader = _DOM.createElement('thead', { node: _DOM.createElement('tr') });

    this.table.appendChild(tableHeader);
    this.table.appendChild(tableBody);

    this.rootElement.appendChild(tableNav);
    this.rootElement.appendChild(this.table);

    //* populate table header
    this.options.headings.forEach(heading => {
      const cell = _DOM.createElement('th', {
        text: heading.text,
        class: this.options.columnSortable ? 'sortable' : '',
        'data-type': heading.type,
      });
      tableHeader.rows[0].appendChild(cell);
    });

    //* add col for delete
    if (this.options.allowDelete) {
      const cell = _DOM.createElement('th', {
        'data-type': 'deleteRow',
      });
      tableHeader.rows[0].appendChild(cell);
    }
  };

  /**
   * @function
   */
  Table.prototype._setupEvents = function () {
    this.table.tBodies[0].addEventListener('click', e => {
      if (e.target.dataset.type === 'deleteRow') {
        const customEvent = new CustomEvent('onRowDelete', { detail: e.target.closest('tr') });
        this.table.tBodies[0].dispatchEvent(customEvent);
        return;
      }

      const customEvent = new CustomEvent('onRowClick', { detail: e.target.closest('tr') });
      this.table.tBodies[0].dispatchEvent(customEvent);
    });
  };

  /**
   * Multi select rows w/bulk actions
   */
  Table.prototype._multiSelect = function () {
    //TODO add bulk action dropdown/list

    // add checkbox to header
    const newCheckbox = new Input({
      id: 'headerCheckbox',
      type: 'checkbox',
      label: '',
    });
    const checkboxInput = newCheckbox.rootElement;
    checkboxInput.addEventListener('change', e => {
      console.log('I was selected');
    });
    const th = _DOM.createElement('th', { node: checkboxInput });
    this.table.tHead.rows[0].insertBefore(th, this.table.tHead.rows[0].cells[0]);

    // add checkbox to each tbody row
    const rows = Array.from(this.table.tBodies[0].rows);
    rows.forEach(row => {
      const newCheckbox = new Input({
        id: `${row.id}checkbox`,
        type: 'checkbox',
        label: '',
      });
      const checkboxInput = newCheckbox.rootElement;
      checkboxInput.addEventListener('change', e => {
        console.log('I was selected', row);
      });
      const td = _DOM.createElement('td', { node: checkboxInput });
      row.insertBefore(td, row.cells[0]);
    });

    this.table.addEventListener('click', e => {
      console.log(e.target, 'i was clicked');
    });

    return this;
  };

  /**
   * Sort by column header
   */
  Table.prototype._columnSort = function () {
    this.table.classList.add('colSort');

    this.table.tHead.addEventListener('click', e => {
      if (e.target.nodeName !== 'TH') return;

      const colIndex = getNodeIndex(e.target);
      const rows = Array.from(this.table.tBodies[0].rows);

      let direction = !this.lastDirection ? 'asc' : this.lastDirection === 'asc' ? 'desc' : 'asc';
      let datetime;

      if (this.lastHeading) {
        this.lastHeading.classList.remove(this.lastDirection);
      }

      if (this.lastDirection) {
        e.target.classList.remove(this.lastDirection);
      }

      e.target.classList.add(direction);

      if (e.target.hasAttribute('data-type')) {
        if (e.target.getAttribute('data-type') === 'date') {
          datetime = true;
        }
      }

      //* sort table rows
      rows.sort((a, b) => {
        let ca = a.cells[colIndex].textContent;
        let cb = b.cells[colIndex].textContent;

        if (datetime) {
          ca = new Date(ca).getTime();
          cb = new Date(cb).getTime();
        } else {
          ca = ca.replace(/(\$|\,|\s|%)/g, '');
          cb = cb.replace(/(\$|\,|\s|%)/g, '');
        }

        ca = !isNaN(ca) ? parseInt(ca, 10) : ca;
        cb = !isNaN(cb) ? parseInt(cb, 10) : cb;

        if (direction === 'asc') {
          return ca > cb ? 1 : -1;
        } else {
          return ca < cb ? 1 : -1;
        }
      });

      this.lastHeading = e.target;
      this.lastDirection = direction;

      //* replace table rows with sorted ones
      const clonedTableBody = this.table.tBodies[0].cloneNode();

      for (let i = 0; i < rows.length; i++) {
        clonedTableBody.appendChild(rows[i]);
      }

      this.table.replaceChild(clonedTableBody, this.table.tBodies[0]);
    });

    return this;
  };

  /**
   * Sort table rows (drag and drop)
   */
  Table.prototype._rowSort = function () {
    //* This uses sortable.js
    //* https://github.com/SortableJS/Sortable
    return new Sortable(this.tableBody, {
      handle: 'td:first-child',
      draggable: 'tbody tr',
      onSort: function (evt) {
        const newSort = {
          oldIndex: evt.oldIndex,
          newIndex: evt.newIndex,
          row: evt.item,
        };
        console.log(newSort);
      },
    });

    // add drag cell for sorting rows
    if (this.options.rowSortable) {
      const cell = _DOM.createElement('td', { html: ICONS.drag });
      rowEle.appendChild(cell);
    }

    // Init Row Sort
    if (this.options.rowSortable) {
      this.initRowSort();

      const td = _DOM.createElement('th');
      this.tableHeader.rows[0].insertBefore(td, this.tableHeader.rows[0].cells[0]);
      this.table.classList.add('sortable');
    }
  };

  /**
   * Clears table body
   *
   * @function
   */
  Table.prototype.clear = function () {
    this.table.tBodies[0].innerHTML = '';
  };

  /**
   * @function
   * @param {Array} data
   */
  Table.prototype.populate = function (data) {
    this.clear();

    //* populate table body
    data.forEach((row, i) => {
      const rowEle = _DOM.createElement('tr', { ...row.attributes, id: row.id });

      this.rows[row.id] = rowEle;

      // populate row
      row.values.forEach((rd, i) => {
        const dataType = this.options.headings[i]?.type ?? '';
        rd = dataType === 'date' ? formatDate(rd) : rd;
        const cell = _DOM.createElement('td', { text: rd, 'data-type': dataType });
        rowEle.appendChild(cell);
      });

      // add col for delete
      if (this.options.allowDelete) {
        const cell = _DOM.createElement('td', {
          node: Icon.getIcon('delete'),
          'data-type': 'deleteRow',
        });
        rowEle.appendChild(cell);
      }

      this.table.tBodies[0].appendChild(rowEle);
    });
  };

  /**
   * Handles click event for table
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Table.prototype.onRowClick = function (cbFunc) {
    this.table.tBodies[0].addEventListener('onRowClick', e => {
      cbFunc(e.detail.id);
    });
  };

  /**
   * Handles click event for row delete
   *
   * @function
   * @param {Function} cbFunc Callback function to call
   */
  Table.prototype.onRowDelete = function (cbFunc) {
    this.table.tBodies[0].addEventListener('onRowDelete', e => {
      cbFunc(e.detail, e.detail.id);
    });
  };

  Table.prototype.removeRow = function (row) {
    row.remove();
  }

  /**
   * Renders Table markup to the specified DOM node.
   *
   * @function
   * @param {Node} node DOM node to render table to
   * @returns {Table} Returns the current instances for chaining
   */
  Table.prototype.renderTo = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.rootElement);
    }

    return this;
  };

  return Table;
});
