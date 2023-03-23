var itPeopleSection = (function () {
  // DOM
  //---------------------
  var section;
  var sectionBody;
  // DATA
  //---------------------
  var othersInvolved;
  // Values
  //---------------------

  function displayCount() {
    var people = [].slice.call(section.querySelectorAll('.peopleRow'));
    var count = people ? people.length : 0;
    var countHolder = section.querySelector('span[data-count="people"]');
    countHolder.innerHTML = `( ${count} )`;
  }

  function addNewPersonRow() {
    var peopleCard = buildOtherPersonCard();
    sectionBody.appendChild(peopleCard);
    displayCount();
    incidentCard.checkEntireIncidentCardforErrors();
  }

  // Populate
  //-----------------------------------------------
  function populate() {
    othersInvolved.forEach(o => {
      var card = buildOtherPersonCard({
        name: o.name,
        company: o.company,
        involvementTypeId: o.involvementTypeId,
        address1: o.address1,
        address2: o.address2,
        city: o.city,
        state: o.state,
        zipCode: o.zipCode,
        phone: o.phone,
      });
      sectionBody.appendChild(card);
    });

    displayCount();
  }

  // Person Card
  //-----------------------------------------------
  function buildOtherPersonCard(values) {
    // values = {name, company, involvementTypeId, address1, address2, city, state, zipCode, phone}
    var name = values ? values.name : '';
    var company = values ? values.company : '';
    var involvementId = values ? values.involvementTypeId : '';
    var address1 = values ? values.address1 : '';
    var address2 = values ? values.address2 : '';
    var city = values ? values.city : '';
    var state = values ? values.state : '';
    var zip = values ? values.zipCode : '';
    var phone = values ? values.phone : '';

    var otherPeopleRow = document.createElement('div');
    otherPeopleRow.classList.add('peopleRow');
    otherPeopleRow.addEventListener('change', e => {
      incidentCard.checkEntireIncidentCardforErrors();
    });

    var nameInput = input.build({
      label: 'Name',
      type: 'text',
      style: 'secondary',
      classNames: ['name'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: name,
    });
    var involvementDropdown = dropdown.build({
      label: 'Involvement Type',
      style: 'secondary',
      className: 'involvmentTypeDropdown',
    });
    var companyInput = input.build({
      label: 'Company',
      type: 'text',
      style: 'secondary',
      classNames: ['company'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: company,
    });
    var address1Input = input.build({
      label: 'Address 1',
      type: 'text',
      style: 'secondary',
      classNames: ['address1'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: address1,
    });
    var address2Input = input.build({
      label: 'Address 2',
      type: 'text',
      style: 'secondary',
      classNames: ['address2'],
      attributes: [{ key: 'maxlength', value: '50' }],
      value: address2,
    });
    var cityInput = input.build({
      label: 'City',
      type: 'text',
      style: 'secondary',
      classNames: ['city'],
      attributes: [{ key: 'maxlength', value: '27' }],
      value: city,
    });
    var stateInput = input.build({
      label: 'State',
      type: 'text',
      style: 'secondary',
      classNames: ['state'],
      attributes: [{ key: 'maxlength', value: '2' }],
      value: state,
    });
    var zipInput = input.build({
      label: 'Zip Code',
      type: 'text',
      style: 'secondary',
      classNames: ['zip'],
      attributes: [{ key: 'maxlength', value: '9' }],
      value: zip,
    });
    var phoneInput = input.build({
      label: 'Phone',
      type: 'tel',
      style: 'secondary',
      classNames: ['phone'],
      attributes: [{ key: 'maxlength', value: '14' }],
      value: phone,
    });
    var deleteBtn = button.build({
      text: 'Delete Person',
      icon: 'delete',
      type: 'text',
      style: 'secondary',
      callback: function () {
        var parent = otherPeopleRow.parentElement;
        parent.removeChild(otherPeopleRow);
        displayCount();
        incidentCard.checkEntireIncidentCardforErrors();
      },
    });

    // populate drodowns
    var involvementTypes = incidentTracking.getInvolvementTypes();
    var involvementDropdownData = involvementTypes.map(it => {
      var involvementId = it.involvementId === '%' ? '' : it.involvementId;
      return { value: involvementId, text: it.description };
    });
    var defaultValue = { value: '', text: '' };
    involvementDropdownData.unshift(defaultValue);
    dropdown.populate(involvementDropdown, involvementDropdownData, involvementId);

    // build card
    var wrap1 = document.createElement('div');
    var wrap2 = document.createElement('div');
    var wrap3 = document.createElement('div');
    wrap1.classList.add('wrap1');
    wrap2.classList.add('wrap2');
    wrap3.classList.add('wrap3');

    wrap1.appendChild(nameInput);
    wrap1.appendChild(companyInput);

    wrap2.appendChild(address1Input);
    wrap2.appendChild(address2Input);

    wrap3.appendChild(cityInput);
    wrap3.appendChild(stateInput);
    wrap3.appendChild(zipInput);

    otherPeopleRow.appendChild(deleteBtn);
    otherPeopleRow.appendChild(wrap1);
    otherPeopleRow.appendChild(involvementDropdown);
    otherPeopleRow.appendChild(wrap2);
    otherPeopleRow.appendChild(wrap3);
    otherPeopleRow.appendChild(phoneInput);

    return otherPeopleRow;
  }

  // Section
  //-----------------------------------------------
  function buildSection(options, data) {
    var opts = options;
    othersInvolved = data;

    section = document.createElement('div');
    section.classList.add('incidentSection');
    section.setAttribute('data-card-page', 'people');
    section.setAttribute('data-page-num', opts.pageNumber);

    var heading = document.createElement('div');
    heading.classList.add('incidentSection__header');
    heading.innerHTML = `<h3>Other People Involved <span data-count="people"></span></h3>`;

    sectionBody = document.createElement('div');
    sectionBody.classList.add('incidentSection__body');

    var addPeopleBtn = button.build({
      text: 'Add New Person',
      icon: 'add',
      type: 'contained',
      style: 'secondary',
      callback: addNewPersonRow,
    });

    sectionBody.appendChild(addPeopleBtn);

    section.appendChild(heading);
    section.appendChild(sectionBody);

    if (othersInvolved) populate();

    return section;
  }

  return {
    build: buildSection,
  };
})();
