var itEmployeeSection = (function() {
  // DOM
  //---------------------
  var section;
  var sectionBody;
	// DATA
  //---------------------
  var employeesInvolved;
	// Values
  //---------------------

  function displayCount() {
    var employees = [].slice.call(section.querySelectorAll('.employeeRow'));
    var count = employees ? employees.length : 0;
    var countHolder = section.querySelector('span[data-count="employees"]');
		countHolder.innerHTML = `( ${count} )`;
  }

  function addNewEmployeeRow() {
    var employeeCard = buildEmployeeCard();
    sectionBody.appendChild(employeeCard);
    displayCount();
  }
  
  // Populate
  //-----------------------------------------------
  function populate() {
    employeesInvolved.forEach(e => {
      var name = `${e.lastName}, ${e.firstName}`;
      var notify = e.notifyEmployee === 'Y' ? true : false;
      var employeeId = e.employeeId;
      var involvementType = e.description;
      var involvementTypeId = e.employeeInvolvementTypeId;

      var card = buildEmployeeCard({
        name, involvementTypeId, notify
      });

      sectionBody.appendChild(card);
    });

    displayCount();
  }

  // Employee Card
  //-----------------------------------------------
  function buildNameDropdown(name) {
    var nameDropdown = dropdown.build({
			className: 'employeeNameDropdown',
			label: 'Name',
			style: 'secondary',
    });

    var employeeNames = incidentTracking.getEmployeeNames();
    var data = employeeNames.map(n => {
			return {
				value: n.employeeName,
				text: n.employeeName,
				attributes: [{ key: 'data-employeeid', value: n.employeeId }],
			};
    });
    
    data.unshift({ value: '', text: '' });
    dropdown.populate(nameDropdown, data, name);

    return nameDropdown;
  }
  function buildInvolvmentDropdown(involvementId) {
    var involvmentTypeDropdown = dropdown.build({
			className: 'involvmentTypeDropdown',
			label: 'Involvement Type',
			style: 'secondary',
    });

    var involvementTypes = incidentTracking.getInvolvementTypes();
    var data = involvementTypes.map(it => {
			var involvementId = it.involvementId === '%' ? '' : it.involvementId;
			return { value: involvementId, text: it.description };
		});
    
    data.unshift({ value: '', text: '' });
		dropdown.populate(involvmentTypeDropdown, data, involvementId);

    return involvmentTypeDropdown;
  }
  function buildCheckbox(checkedValue) {
    var checkbox = input.buildCheckbox({
			text: 'Notify',
			isChecked: checkedValue,
    });
    
    return checkbox;
  }
  function buildEmployeeCard(values) {
		// values = {name, involvement, notify}
		var name = values ? values.name : '';
		var involvement = values ? values.involvementTypeId : '';
		var notify = values ? values.notify : false;

		var employeeRow = document.createElement('div');
		employeeRow.classList.add('employeeRow');

		var nameDropdown = buildNameDropdown(name);
		var involvmentTypeDropdown = buildInvolvmentDropdown(involvement);
		var checkbox = buildCheckbox(notify);
    var delteBtn = button.build({
			text: 'Delete Employee',
			icon: 'delete',
			type: 'text',
			style: 'secondary',
			callback: function() {
				var parent = employeeRow.parentElement;
				parent.removeChild(employeeRow);
				displaySectionCount('employees');
			}
    });
    
		// build row
		employeeRow.appendChild(delteBtn);
		employeeRow.appendChild(nameDropdown);
		employeeRow.appendChild(involvmentTypeDropdown);
		employeeRow.appendChild(checkbox);

		return employeeRow;
  }
  
  // Section
  //-----------------------------------------------
  function buildSection(options, data) {
    var opts = options;
    employeesInvolved = data;

    section = document.createElement('div');
		section.classList.add('incidentSection');
		section.setAttribute('data-card-page', 'employees');
		section.setAttribute('data-page-num', opts.pageNumber);

		var heading = document.createElement('div');
		heading.classList.add('incidentSection__header');
		heading.innerHTML = `<h3>Employees Involved <span data-count="employees"></span></h3>`;

		sectionBody = document.createElement('div');
		sectionBody.classList.add('incidentSection__body');

		var addEmployeeBtn = button.build({
			text: 'Add New Employee',
			icon: 'add',
			type: 'contained',
			style: 'secondary',
			callback: addNewEmployeeRow
		});

		sectionBody.appendChild(addEmployeeBtn);

    section.appendChild(heading);
    section.appendChild(sectionBody);

    if (employeesInvolved) populate();

    return section;
  }
  
  return {
    build: buildSection
  }
})();