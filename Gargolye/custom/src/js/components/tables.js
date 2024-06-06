var table = (function () {
    var opts;

    function build(options) {
        // options = {
        //   plain=true?false
        //   tableId=''
        //   headline=''
        //   columnHeadings=[]
        //   callback=function
        //* NEW SORTABLE OPTIONS
        //   sortable=true?false
        //   onSortCallback=function
        //* END ICON OPTIONS
        //   endIcon=true?false
         //* SECOND END ICON OPTIONS
        //   secondendIcon=true?false
        //* COPY OPTIONS
        //   allowCopy=true?false
        // }
        opts = options;
        // Create Base Elements
        var table = document.createElement('div');
        var tableBody = document.createElement('div');
        // Set Attributes
        if (opts.tableId) table.id = options.tableId;
        tableBody.classList.add('table__body');

        // Set Sortable
        if (options.sortable) {
            new Sortable(tableBody, {
                handle: '.dragHandle',
                draggable: '>.table__row',
                onSort: function (evt) {
                    options.onSortCallback({
                        oldIndex: evt.oldIndex,
                        newIndex: evt.newIndex,
                        row: evt.item,
                    });
                },
            });

            table.classList.add('sortableTable');
        }

        // plain table?
        if (opts.plain) {
            table.classList.add('table', 'table__plain');
        } else {
            table.classList.add('table');
        }

        // Add Headline
        if (opts.headline) {
            var headline = document.createElement('div');
            headline.classList.add('table__headline');
            headline.innerHTML = `<h2>${opts.headline}</h2>`;
            table.appendChild(headline);
        }

        // Build Header Row
        var headerRow = document.createElement('div');
        headerRow.classList.add('table__row', 'header');

        // add emtpy cell for drag handle
        if (options.sortable) {
            var td = document.createElement('div');
            td.classList.add('dragHandle');
            headerRow.appendChild(td);
        }

        // populate column row
        options.columnHeadings.forEach(heading => {
            var td = document.createElement('div');
            td.innerHTML = heading;
            headerRow.appendChild(td);
        });
       
        // add empty cell for endIcon
        if (options.endIcon) {
            var td = document.createElement('div');
            td.classList.add('endIcon');
            if (options.endIconHeading == undefined) {
                options.endIconHeading = '';
            }
            td.innerHTML = options.endIconHeading;
            headerRow.appendChild(td);
        }

        // add empty cell for secondendIcon
        if (options.secondendIcon) {
            var td = document.createElement('div');
            td.classList.add('secondendIcon');
            if (options.secondendIconHeading == undefined) {
                options.secondendIconHeading = '';
            }
            td.innerHTML = options.secondendIconHeading;
            headerRow.appendChild(td);
        }

        // add empty cell for copyIcon
        if (options.allowCopy) {
            var td = document.createElement('div');
            td.classList.add('copyIcon');
            headerRow.appendChild(td);
        }

        // append row to table
        table.appendChild(headerRow);

        // Putting it all together
        table.appendChild(tableBody);

        if (opts.callback) {
            table.addEventListener('click', opts.callback);
        }

        return table;
    }

    function populate(table, data, isSortable, disabled) {
        // table can be element or tableID
        // data = [{ id="", values=[], attributes=[{}], onClick}] = oneRow
        // isSortable = sortable=true?false
    
        if (typeof table === 'string') {
            var table = document.getElementById(table);
        }
    
        const tableBody = table.querySelector('.table__body');
        tableBody.innerHTML = '';
    
        data.forEach(d => {
            // build row
            const row = document.createElement('div');
            row.classList.add('table__row');
            if (d.overlap !== null) {
                if (d.overlap === true) {
                    row.classList.add('yellowbackground'); //
                }
            }
            // set id & attributes
            if (d.id) row.id = d.id;
            if (d.attributes) {
                d.attributes.forEach(a => {
                    row.setAttribute(a.key, a.value);
                });
            }

            // Add error class to row if there is an error
            if (d.hasError) {
                row.classList.add('errorRow');
            }

            // set onclick
            if (d.onClick && !disabled) {
                row.addEventListener('click', async e => {
                    if (e.target === row) {
                        e.target.classList.add('noPointerEvents');
                        await d.onClick(e);
                        e.target.classList.remove('noPointerEvents');
                    }
                });
                row.classList.add('customLink');
            }
            if (!disabled) {
                row.classList.add('disabledRow');
            }
    
            // add drag handle
            if (isSortable) {
                var cell = document.createElement('div');
                cell.classList.add('dragHandle');
                cell.innerHTML = icons.drag;
    
                row.appendChild(cell);
            }
    
            // populate row cells
            d.values.forEach(v => {
                const cell = document.createElement('div');
                cell.innerHTML = v;
                row.appendChild(cell);
            });
    
            if (d.endIcon) {
                const cell = document.createElement('div');
                cell.classList.add('endIcon');
                cell.innerHTML = d.endIcon;
                cell.addEventListener('click', d.endIconCallback);
                row.appendChild(cell);
            }
    
            if (d.secondendIcon) {
                const cell = document.createElement('div');
                cell.classList.add('secondendIcon');
                cell.innerHTML = d.secondendIcon;
                cell.addEventListener('click', d.secondendIconCallback);
                row.appendChild(cell);
            }
    
            if (disabled !== true) {
                if (d.onCopyClick) {
                    const cell = document.createElement('div');
                    cell.classList.add('copyIcon');
                    cell.innerHTML = icons.copy;
                    cell.addEventListener('click', d.onCopyClick);
                    row.appendChild(cell);
                }
            }
    
            tableBody.appendChild(row);
        });
    }

    function addRows(table, rowData, isSortable) {
        // table can be element or tableID
        // data = [{ id="", values=[], attributes=[{}], onClick, hasError }] = oneRow
        // isSortable = true/false
    
        if (typeof table === 'string') {
            var table = document.getElementById(table);
        }
    
        const tableBody = table.querySelector('.table__body');
    
        rowData.forEach(d => {
            // build row
            const row = document.createElement('div');
            row.classList.add('table__row');
    
            if (d.id) row.id = d.id;
            if (d.attributes) {
                d.attributes.forEach(a => {
                    row.setAttribute(a.key, a.value);
                });
            }
    
            // Add errorRow class if hasError is true
            if (d.hasError) {
                row.classList.add('errorRow');
            }
    
            if (d.onClick) {
                row.addEventListener('click', e => {
                    if (e.target === row) {
                        d.onClick(e);
                    }
                });
                row.classList.add('customLink');
            }
    
            if (isSortable) {
                var cell = document.createElement('div');
                cell.classList.add('dragHandle');
                cell.innerHTML = icons.drag;
                row.appendChild(cell);
            }
    
            // populate row cells
            d.values.forEach(v => {
                const cell = document.createElement('div');
                cell.innerHTML = v;
                row.appendChild(cell);
            });
            if (d.endIcon) {
                const cell = document.createElement('div');
                cell.classList.add('endIcon');
                cell.innerHTML = d.endIcon;
                cell.addEventListener('click', d.endIconCallback);
                row.appendChild(cell);
            }
    
            if (d.onCopyClick) {
                const cell = document.createElement('div');
                cell.classList.add('copyIcon');
                cell.innerHTML = icons.copy;
                cell.addEventListener('click', d.onCopyClick);
                row.appendChild(cell);
            }
    
            tableBody.appendChild(row);
        });
    }
    

    function updateRows(table, rowData, isSortable) {
        // table can be element or tableID
        // data = [{ id="", values=[], attributes=[{}], onClick, hasError }] = oneRow
        // isSortable = true/false
        if (typeof table === 'string') {
            var table = document.getElementById(table);
        }
    
        const tableBody = table.querySelector('.table__body');
    
        rowData.forEach(d => {
            // get & clear row
            const rowId = `#${d.id}`;
            const oldRow = tableBody.querySelector(rowId);
            oldRow.innerHTML = '';
            const newRow = oldRow.cloneNode(true);
            tableBody.replaceChild(newRow, oldRow);
    
            // Remove errorRow class if it exists and hasError is false
            if (!d.hasError) {
                newRow.classList.remove('errorRow');
            }
    
            // Add errorRow class if hasError is true and the class is not already on the row
            if (d.hasError && !newRow.classList.contains('errorRow')) {
                newRow.classList.add('errorRow');
            }
    
            if (d.onClick) {
                newRow.addEventListener('click', e => {
                    if (e.target === newRow) {
                        d.onClick(e);
                    }
                });
                newRow.classList.add('customLink');
            }
    
            if (isSortable) {
                var cell = document.createElement('div');
                cell.classList.add('dragHandle');
                cell.innerHTML = icons.drag;
                newRow.appendChild(cell);
            }
    
            // populate row cells
            d.values.forEach(v => {
                const cell = document.createElement('div');
                cell.innerHTML = v;
                newRow.appendChild(cell);
            });
  
            if (d.endIcon) {
                const cell = document.createElement('div');
                cell.classList.add('endIcon');
                cell.innerHTML = d.endIcon;
                cell.addEventListener('click', d.endIconCallback);
                newRow.appendChild(cell);
            }
    
            if (d.onCopyClick) {
                const cell = document.createElement('div');
                cell.classList.add('copyIcon');
                cell.innerHTML = icons.copy;
                cell.addEventListener('click', d.onCopyClick);
                newRow.appendChild(cell);
            }
        });
    }
    

    function deleteRow(rowId) {
        const row = document.getElementById(rowId);
        row.remove();
    }

    function clear(table) {
        if (typeof table === 'string') {
            var table = document.getElementById(table);
        }

        const tableBody = table.querySelector('.table__body');
        if (tableBody) tableBody.innerHTML = '';
    }

    function getRowCount(table) {
        if (typeof table === 'string') {
            var table = document.getElementById(table);
        }

        const tableBody = table.querySelector('.table__body');

        const tableRows = [...tableBody.querySelectorAll('.table__row')];

        return tableRows.length;
    }

    // Add the ability to click a header on the the table to sort the table
    function sortTableByHeader(table) {
        // Query the headers
        const headers = table.querySelectorAll('.header div');

        // Track sort directions
        const directions = Array.from(headers).map(function (header) {
            return '';
        });

        // Loop over the headers
        [].forEach.call(headers, function (header, index) {
            header.addEventListener('click', function () {
                // This function will sort the column
                sortColumn(index);
            });
        });

        // Transform the content of given cell in given column
        const transform = function (index, content) {
            // Get the data type of column
            const type = headers[index].getAttribute('data-type');
            switch (type) {
                case 'number':
                    return parseFloat(content);
                case 'date':
                    return Date.parse(content);
                case 'string':
                default:
                    return content;
            }
        };

        const sortColumn = function (index) {
            //Loop over the headers, removing the sort order class
            [].forEach.call(headers, function (header) {
                header.classList.remove('headersortup');
                header.classList.remove('headersortdown');
            });

            // Get the current direction
            const direction = directions[index] || 'asc';

            // A factor based on the direction
            const multiplier = direction === 'asc' ? 1 : -1;

            // Query all rows
            const tableBody = table.querySelector('.table__body');
            const rows = [...tableBody.querySelectorAll('.table__row')];

            // Clone the rows
            const newRows = Array.from(rows);

            // Sort rows by the content of cells
            newRows.sort(function (rowA, rowB) {
                // Get the content of cells
                const cellA = rowA.childNodes[index].innerText;
                const cellB = rowB.childNodes[index].innerText;

                // Transform the content of cells
                var a = transform(index, cellA);
                var b = transform(index, cellB);

                // Make string comparison case insensitive
                const type = headers[index].getAttribute('data-type');
                if (type === 'string') {
                    a = a.toLowerCase();
                    b = b.toLowerCase();
                }

                // And compare them
                switch (true) {
                    case a > b:
                        return 1 * multiplier;
                    case a < b:
                        return -1 * multiplier;
                    case a === b:
                        return 0;
                }
            });

            // Reverse the direction
            directions[index] = direction === 'asc' ? 'desc' : 'asc';

            // Assign the appropriate sort direction class
            if (direction === 'asc') {
                headers[index].classList.remove('headersortup');
                headers[index].classList.add('headersortdown');
            } else if (direction === 'desc') {
                headers[index].classList.remove('headersortdown');
                headers[index].classList.add('headersortup');
            }

            // Remove old rows
            [].forEach.call(rows, function (row) {
                tableBody.removeChild(row);
            });

            // Append new row
            newRows.forEach(function (newRow) {
                tableBody.appendChild(newRow);
            });
        };
    }

    return {
        build,
        populate,
        addRows,
        updateRows,
        deleteRow,
        clear,
        getRowCount,
        sortTableByHeader,
    };
})();
