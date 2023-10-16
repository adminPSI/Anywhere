'use-strict';

//? table filtering
//? custom visible columns
//? row styles: grid, horizontal, free form,
//? row subtext, cell subtext? aka row note
//? pagination
//? allow table to go fullscreen

//TODO: multiselect rows w/bulk actions
//TODO: clickable end row icons
//TODO: table headline <caption></caption>
//TODO: row density control

(function (global, factory) {
  global = global || self;
  global.Table = factory();
})(this, function () {
  /**
   * Default configuration
   * @type {Object}
   */
  const DEFAULT_OPTIONS = {
    style: 'default',
    rowSortable: false,
    columnSortable: false,
    allowCopy: false,
  };

  /**
   * Merge default options with user options
   * @param {Object}  userOptions  User defined options object
   * @return {Object}              Merged options object
   */
  const mergOptionsWithDefaults = userOptions => {
    let formatedColumnOptions = {};

    if (userOptions.columns) {
      userOptions.columns.forEach(data => {
        // convert single column selection to array
        if (!isNaN(data.select)) {
          data.select = [data.select];
        }

        data.select.forEach(column => {
          formatedColumnOptions[column] = (({ select, ...rest }) => ({ ...rest }))(data);
        });
      });

      return Object.assign({}, DEFAULT_OPTIONS, userOptions, { columns: formatedColumnOptions });
    }

    return Object.assign({}, DEFAULT_OPTIONS, userOptions);
  };

  /**
   * Get the index of node related to sibilings
   * @param {HTMLElement} node
   * @returns {Number}
   */
  const getNodeIndex = node => {
    return Array.from(node.parentNode.children).indexOf(node);
  };

  /**
   * Formats the date for table view
   * @param {String} dateString  dateString format must be ISO YYYY-MM-DD
   */
  const formatDate = dateString => {
    const date = new Date(`${dateString}T00:00`);
    return new Intl.DateTimeFormat('en-US').format(date);
  };

  //=========================
  // MAIN LIB
  //-------------------------
  /**
   * @class Table
   * @param {Object}  options
   * @param {String}  [options.style]           Table style
   * @param {Boolean} [options.rowSortable]     Row re ordering
   * @param {Boolean} [options.columnSortable]  Column sorting by header
   * @param {Boolean} [options.allowCopy]       Row's can be duplicated by copy
   * @param {Array}   [optins.headings]
   * @param {Array}   [optins.data]
   */
  function Table(options) {
    this.options = mergOptionsWithDefaults(options);
    this.rows = {};
    this.selectedRows = {};

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
  Table.prototype.build = function () {
    const data = this.options.data;

    //* create table
    const wrapper = DOM.createElement('div', { class: 'ui_table' });
    const tableNav = DOM.createElement('div', { class: 'ui-table__nav' });
    const table = DOM.createElement('table');
    const tableBody = DOM.createElement('tbody');
    const tableHeader = DOM.createElement('thead', { html: '<tr></tr>' });

    console.log(wrapper);

    table.appendChild(tableHeader);
    table.appendChild(tableBody);

    wrapper.appendChild(tableNav);
    wrapper.appendChild(table);

    //* populate table header
    data.headings.forEach((heading, i) => {
      const dataType = this.options.columns[i]?.type ?? '';
      const cell = DOM.createElement('th', {
        text: heading,
        class: 'sortable',
        'data-type': dataType,
      });
      tableHeader.rows[0].appendChild(cell);
    });

    //* populate table body
    data.rows.forEach((row, i) => {
      const rowEle = DOM.createElement('tr', { ...row.attributes, id: row.id });

      this.rows[row.id] = rowEle;

      // populate row
      row.values.forEach((rd, i) => {
        const dataType = this.options.columns[i]?.type ?? '';
        rd = dataType === 'date' ? formatDate(rd) : rd;
        const cell = DOM.createElement('td', { text: rd, 'data-type': dataType });
        rowEle.appendChild(cell);
      });

      tableBody.appendChild(rowEle);
    });

    //* set refs
    this.table = table;
    this.wrapper = wrapper;

    return this;
  };

  /**
   * Multi select rows w/bulk actions
   */
  Table.prototype.multiSelect = function () {
    //TODO add bulk action dropdown/list

    // add checkbox to header
    const newCheckbox = new Input({
      id: 'headerCheckbox',
      type: 'checkbox',
      label: '',
    });
    const checkboxInput = newCheckbox.build().inputWrap;
    checkboxInput.addEventListener('change', e => {
      console.log('I was selected');
    });
    const th = DOM.createElement('th', { node: checkboxInput });
    this.table.tHead.rows[0].insertBefore(th, this.table.tHead.rows[0].cells[0]);

    // add checkbox to each tbody row
    const rows = Array.from(this.table.tBodies[0].rows);
    rows.forEach(row => {
      const newCheckbox = new Input({
        id: `${row.id}checkbox`,
        type: 'checkbox',
        label: '',
      });
      const checkboxInput = newCheckbox.build().inputWrap;
      checkboxInput.addEventListener('change', e => {
        console.log('I was selected', row);
      });
      const td = DOM.createElement('td', { node: checkboxInput });
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
  Table.prototype.columnSort = function () {
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
  Table.prototype.rowSort = function () {
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
      const cell = DOM.createElement('td', { html: ICONS.drag });
      rowEle.appendChild(cell);
    }

    // Init Row Sort
    if (this.options.rowSortable) {
      this.initRowSort();

      const td = DOM.createElement('th');
      this.tableHeader.rows[0].insertBefore(td, this.tableHeader.rows[0].cells[0]);
      this.table.classList.add('sortable');
    }
  };

  /**
   * Appends table to node
   */
  Table.prototype.render = function (node) {
    if (node instanceof Node) {
      node.appendChild(this.wrapper);
      return;
    }
    document.body.appendChild(this.wrapper);

    return this;
  };

  return Table;
});
