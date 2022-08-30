const csSalesforce = (() => {
  let salesforceRelationships;
  let selectedSalesforce;
  // DOM
  let teamMemberPopup;
  let importPopup;
  let salesforceWrap;

  function buildPopupMessage() {
    const message = document.createElement('p');
    message.classList.add('message');
    message.innerText =
      'Select the name below from the OhioISP system that matches this Team Member';
    return message;
  }
  function buildRelationship(rel) {
    const name = contactInformation.cleanName({
      firstName: rel.FirstName,
      lastName: rel.LastName,
    });
    const relType = rel.Role;

    const relationshipDiv = document.createElement('div');
    relationshipDiv.classList.add('relationship');

    const nameEle = document.createElement('p');
    nameEle.innerText = `Name: ${name}`;
    if (!name) nameEle.classList.add('error');

    const relationshipEle = document.createElement('p');
    relationshipEle.innerText = `Relationship: ${relType}`;

    relationshipDiv.appendChild(nameEle);
    relationshipDiv.appendChild(relationshipEle);

    relationshipDiv.addEventListener('click', e => {
      if (!name) return;
      // apply relationsip to team member
      const currSelected = salesforceWrap.querySelector('.selected');
      if (currSelected) currSelected.classList.remove('selected');
      relationshipDiv.classList.add('selected');

      selectedSalesforce = rel;
    });

    return relationshipDiv;
  }

  async function showPopup() {
    const selectedConsumer = plan.getSelectedConsumer();
    salesforceRelationships = await consentAndSignAjax.getTeamMemberListFromState({
      peopleId: parseInt(selectedConsumer.id),
    });

    teamMemberPopup = document.getElementById('sig_mainPopup');

    importPopup = POPUP.build({
      id: 'importSalesforcePopup',
      closeCallback: () => {
        overlay.show();
        teamMemberPopup.style.display = 'block';
      },
    });

    const message = buildPopupMessage();

    //* Relationships
    //*------------------
    salesforceWrap = document.createElement('div');
    salesforceWrap.classList.add('salesforceSection');

    if (salesforceRelationships) {
      salesforceRelationships.forEach(rel => {
        const relationship = buildRelationship(rel);
        salesforceWrap.appendChild(relationship);
      });
    }

    //* ACTION BUTTONS
    //*----------------------------------
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    const doneBtn = button.build({
      text: 'Done',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(importPopup);
        POPUP.hide(teamMemberPopup);
        csTeamMember.linkToSalesForce(selectedSalesforce.Id);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'contained',
      callback: () => {
        POPUP.hide(importPopup);
        POPUP.hide(teamMemberPopup);
      },
    });

    btnWrap.appendChild(doneBtn);
    btnWrap.appendChild(cancelBtn);
    importPopup.appendChild(message);
    importPopup.appendChild(salesforceWrap);
    importPopup.appendChild(btnWrap);

    teamMemberPopup.style.display = 'none';
    POPUP.show(importPopup);
  }

  return {
    showPopup,
  };
})();
