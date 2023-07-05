const csRelationship = (() => {
  let selectedRelationship;
  let gkRelationships;
  // DOM
  let teamMemberPopup;
  let importPopup;
  let existingRelationshipPopup;
  let relationshipsWrap;
  let doneBtn;

  function buildExistingPopupMessage(selectedMemberData) {
    const message = document.createElement('div');
    message.classList.add('message');

    const name = contactInformation.cleanName({
      firstName: selectedMemberData.name,
      lastName: selectedMemberData.lastName,
    });

    message.innerHTML = `
    <h3>An existing record was found for this Team Member:</h3> 
    <p class="name">${name}</p>
    <p class="dob">${dates.removeTimestamp(selectedMemberData.dateOfBirth)}</p>
    <p class="bldnum">${selectedMemberData.buildingNumber}</p>
    <p class="prompt">Would you like to select this existing record?</p>
    `;
    return message;
  }
  function showExistingPopup(selectedMemberData, callback) {
    teamMemberPopup = document.getElementById('sig_mainPopup');

    existingRelationshipPopup = POPUP.build({
      id: 'existingRelationshipPopup',
      hideX: true,
    });

    const message = buildExistingPopupMessage(selectedMemberData);

    //* Action Btns
    //*------------------
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    const yesBtn = button.build({
      text: 'Yes',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        existingRelationshipPopup.style.display = 'none';
        teamMemberPopup.style.display = 'block';
        callback(true);
      },
    });
    const noBtn = button.build({
      text: 'No',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        existingRelationshipPopup.style.display = 'none';
        teamMemberPopup.style.display = 'block';
        callback(false);
      },
    });

    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    existingRelationshipPopup.appendChild(message);
    existingRelationshipPopup.appendChild(btnWrap);

    POPUP.show(existingRelationshipPopup);
  }
  const removeDups = data => {
    const flag = {};
    const unique = [];
    data.forEach(el => {
      if (!flag[el.peopleId]) {
        flag[el.peopleId] = true;
        unique.push(el);
      }
    });
    return unique;
  };

  //*------------------------------------------------------
  //* MAIN POPUP
  //*------------------------------------------------------
  function buildPopupMessage() {
    const message = document.createElement('p');
    message.classList.add('message');
    message.innerText = 'Select a name below to import from Relationships.'; //If the person is not in the list, click Add Relationship to add the person to Demographics.';
    return message;
  }
  function buildRelationship(rel) {
    const pplID = rel.peopleId;
    const salesforceID = rel.salesForceId;
    const contactID = rel.contactId;
    const name = contactInformation.cleanName(rel);
    const dob = dates.removeTimestamp(rel.dateOfBirth);
    const adress = `${rel.buildingNumber}`;
    const relationshipType = rel.relationship ? rel.relationship : '';

    const relationshipDiv = document.createElement('div');
    relationshipDiv.classList.add('relationship');

    const nameEle = document.createElement('p');
    nameEle.innerText = `Name: ${name}`;
    if (!name) nameEle.classList.add('error');

    const dobEle = document.createElement('p');
    dobEle.innerText = `Date of Birth: ${dob}`;

    const addressEle = document.createElement('p');
    addressEle.innerText = `Address: ${adress}`;

    const relationshipTypeEle = document.createElement('p');
    relationshipTypeEle.innerText = `Relationship Type: ${relationshipType}`;

    relationshipDiv.appendChild(nameEle);
    relationshipDiv.appendChild(dobEle);
    relationshipDiv.appendChild(addressEle);
    relationshipDiv.appendChild(relationshipTypeEle);

    relationshipDiv.addEventListener('click', e => {
      if (!name) {
        return;
      }

      doneBtn.classList.remove('disabled');
      // apply relationsip to team member
      const currSelected = relationshipsWrap.querySelector('.selected');
      if (currSelected) currSelected.classList.remove('selected');
      relationshipDiv.classList.add('selected');

      selectedRelationship = rel;
    });

    return relationshipDiv;
  }
  function showMainPopup() {
    gkRelationships = planData.getDropdownData().relationships;
    gkRelationships = removeDups(gkRelationships);
    teamMemberPopup = document.getElementById('sig_mainPopup');

    importPopup = POPUP.build({
      id: 'importRelationshipPopup',
      hideX: true,
    });

    const message = buildPopupMessage();

    //* Relationships
    //*------------------
    relationshipsWrap = document.createElement('div');
    relationshipsWrap.classList.add('relationshipsWrap');

    let teamMembers = planConsentAndSign.getTeamMemberData();
    if (!teamMembers) teamMembers = [];

    gkRelationships.forEach(rel => {
      if (teamMembers.length !== 0) {
        const filteredMember = teamMembers.filter(tm => tm.peopleId === rel.peopleId);
        if (filteredMember.length >= 1) return;
      }

      const relationship = buildRelationship(rel);
      relationshipsWrap.appendChild(relationship);
    });

    //* Action Btns
    //*------------------
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    doneBtn = button.build({
      text: 'Done',
      style: 'secondary',
      type: 'contained',
      callback: async () => {
        POPUP.hide(importPopup);
        overlay.show();
        teamMemberPopup.style.display = 'block';
        csTeamMember.applySelectedRelationship(selectedRelationship);
      },
    });
    doneBtn.classList.add('disabled');
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(importPopup);
        overlay.show();
        teamMemberPopup.style.display = 'block';
      },
    });

    btnWrap.appendChild(doneBtn);
    btnWrap.appendChild(cancelBtn);
    importPopup.appendChild(message);
    importPopup.appendChild(relationshipsWrap);
    importPopup.appendChild(btnWrap);

    teamMemberPopup.style.display = 'none';
    POPUP.show(importPopup);
  }

  return {
    showMainPopup,
    showExistingPopup,
  };
})();
