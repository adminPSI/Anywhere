var consumerInvolvement = (function() {
	// DOM
	//---------------------
	var section;
	var involvementDropdown;
	var locationDropdown;
	var ppiCheckbox;
	var actionBtns;
	var saveBtn;
	var cancelBtn;
	// DATA
	//---------------------
	var involvementsData;
	var involvementTypes;
	var consumerLocationData;
	// Values
	//---------------------
	var selectedConsumerId;

  var isEdit;
  var formReadOnly;

	function getDataForSave() {
		return involvementsData;
	}

	function deleteConsumerData(consumerId) {
		if (involvementsData[consumerId]) {
			var { [consumerId]: removedConsumer, ...newInvolvementsData } = involvementsData;
			involvementsData = newInvolvementsData;
		}
	}

	function clearData() {
		selectedConsumerId = undefined;
		involvementsData = undefined;
	}

	function setInvolvementsData(data) {
		involvementsData = {};

		if (data) {
			data.forEach(d => {
				involvementsData[d.consumerId] = {
					includeInCount: d.includeInCount,
					involvementId: d.involvementId,
					locationId: d.locationId,
					name: `${d.firstName} ${d.LastName}`,
				};
			});
		}
	}
	function initConsumerInvolvementData(consumerId) {
		// get location data for consumer
		return new Promise((fulfill, reject) => {
			incidentTrackingAjax.getConsumerServiceLocations(consumerId, results => {
				consumerLocationData[consumerId] = results.map(r => {
					return {
						value: r.locationId,
						text: r.description,
					};
				});

				if (!involvementsData[consumerId]) {
					var includeInCount = 'Y';
					var involvementId = involvementTypes[0].involvementId;
					var locationId = consumerLocationData[consumerId].length === 1 ? consumerLocationData[consumerId][0].value : '';

					console.log(`Location Id for consumer${consumerId} = ${locationId}`);

					involvementsData[consumerId] = {
						includeInCount,
						involvementId,
						locationId,
					};
				}

				fulfill();
			});
		});
	}

	function toggleSaveDisabled() {
		var errors = [].slice.call(section.querySelectorAll('.error'));

		if (errors.length > 0) {
			saveBtn.classList.add('disabled');
		} else {
			saveBtn.classList.remove('disabled');
		}
	}
	function checkRequiredFields() {
		var allHaveLocation = true;
		var oneHasPPI = false;
		var consumerIds = [];

		var keys = Object.keys(involvementsData);
		keys.forEach(k => {
			var data = involvementsData[k];
			if (data.locationId === '') {
				allHaveLocation = false;
				consumerIds.push(k);
			}
			if (data.includeInCount === 'Y') oneHasPPI = true;
		});

		if (!oneHasPPI) {
			itConsumerSection.showConsumerError(['%'], 'At least one consumer must have PPI checked.');
			return;
		} else {
			if (!allHaveLocation) {
				itConsumerSection.showConsumerError(consumerIds, 'Involvement location is required.');
			} else {
				itConsumerSection.removeConsumerErrors();
			}
		}
	}

	function checkOneHasPPI() {
		let oneHasPPI = false;
		const keys = Object.keys(involvementsData);
		keys.forEach(k => {
			const data = involvementsData[k];
			if (data.includeInCount === 'Y') oneHasPPI = true;
		});
		return oneHasPPI
	}

	function doesAnotherConsumerHavePPIChecked() {
		var otherConsumerHasPPI = false;

		var keys = Object.keys(involvementsData);

		if (keys.length === 1) {
			return true;
		}

		keys.forEach(k => {
			var data = involvementsData[k];
			if (data.includeInCount === 'Y') otherConsumerHasPPI = true;
		});

		return otherConsumerHasPPI;
	}

	// Events
	//-----------------------------------------------
	function setupEvents() {
		var tmpInvolvementId;
		var tmpLocationId;
		var tmpPpi;

		involvementDropdown.addEventListener('change', e => {
			tmpInvolvementId = e.target.value;
			if (tmpInvolvementId === '') {
				involvementDropdown.classList.add('error');
			} else {
				involvementDropdown.classList.remove('error');
			}
			toggleSaveDisabled();
		});
		locationDropdown.addEventListener('change', e => {
			tmpLocationId = e.target.value;
			if (tmpLocationId === '') {
				locationDropdown.classList.add('error');
			} else {
				locationDropdown.classList.remove('error');
			}
			toggleSaveDisabled();
		});
		ppiCheckbox.addEventListener('change', e => {
			tmpPpi = e.target.checked ? 'Y' : 'N';

			if (tmpPpi === 'Y') {
				ppiCheckbox.classList.remove('error');
			} else {
				if (doesAnotherConsumerHavePPIChecked()) {
					ppiCheckbox.classList.remove('error');
				} else {
					ppiCheckbox.classList.add('error');
				}
			}

			toggleSaveDisabled();
		});

		actionBtns.addEventListener('click', e => {
			if (e.target === saveBtn) {
				if (tmpPpi) involvementsData[selectedConsumerId].includeInCount = tmpPpi;
				if (tmpInvolvementId) involvementsData[selectedConsumerId].involvementId = tmpInvolvementId;
				if (tmpLocationId) involvementsData[selectedConsumerId].locationId = tmpLocationId;

				tmpPpi = undefined;
				tmpInvolvementId = undefined;
				tmpLocationId = undefined;

				const locationId = involvementsData[selectedConsumerId].locationId;
				const involvementSec = document.querySelector("[data-sectionid='4']");
				if (locationId === "" || consumerInvolvement.checkOneHasPPI() === false) {
					involvementSec.classList.add('sectionError');
				} else {
					involvementSec.classList.remove('sectionError');
				}

				section.classList.remove('visible');
				consumerSubSections.showSectionMenu();
				checkRequiredFields();
			}

			if (e.target === cancelBtn) {
				section.classList.remove('visible');
				consumerSubSections.showSectionMenu();
			}
		});
	}
	// Populate
	//-----------------------------------------------
	function populateLocationDropdown() {
		function populateDropdown(data) {
			var locationId = involvementsData[selectedConsumerId].locationId;

			if (!locationId && data.length > 1) {
				if (data[0].value !== '') data.unshift({ value: '', text: '' });
				locationDropdown.classList.add('error');
			}

			dropdown.populate(locationDropdown, data, locationId);
		}

		var data = consumerLocationData[selectedConsumerId];

		if (!data) {
			incidentTrackingAjax.getConsumerServiceLocations(selectedConsumerId, results => {
				consumerLocationData[selectedConsumerId] = results.map(r => {
					return {
						value: r.locationId,
						text: r.description,
					};
				});

				populateDropdown(consumerLocationData[selectedConsumerId]);
			});

			return;
		}

		populateDropdown(data);
	}
	function setInvolvmentDropdownValue() {
		var consumerData = involvementsData[selectedConsumerId];
		var involvmentSelect = involvementDropdown.querySelector('select');
		if (consumerData.involvementId !== '') {
			involvmentSelect.value = consumerData.involvementId;
			involvementDropdown.classList.remove('error');
		}
	}
	function setPPICheckboxValue() {
		var consumerData = involvementsData[selectedConsumerId];
		var ppiCheckboxInput = ppiCheckbox.querySelector('input');
		if (consumerData.includeInCount === 'Y' || consumerData.includeInCount === '') {
			ppiCheckboxInput.checked = true;
		} else {
			ppiCheckboxInput.checked = false;
		}
	}
	// Build
	//-----------------------------------------------
	function buildInvolvementDropdown() {
    var opts = {
			className: `involvementDropdown`,
			label: 'Involvement',
			style: 'secondary',
		};
    
    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

		var iDropdown = dropdown.build(opts);

		involvementTypes = incidentTracking.getInvolvementTypes();

		var data = involvementTypes.map(it => {
			var involvementId = it.involvementId === '%' ? '' : it.involvementId;
			return { value: involvementId, text: it.description };
		});

		dropdown.populate(iDropdown, data);

		return iDropdown;
	}
	function buildLocationDropdown() {
    var opts = {
			dropdownId: `involvementLocation-${selectedConsumerId}`,
			className: `locationDropdown`,
			label: 'Location',
			style: 'secondary',
		};
    
    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

		var lDropdown = dropdown.build(opts);

		return lDropdown;
	}
	function buildCheckbox() {
    var opts = {
			className: 'ppiCheckbox',
			text: 'Include in Counts',
			isChecked: true,
		};
    
    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

		var checkbox = input.buildCheckbox(opts);

		return checkbox;
	}
	function buildBtns() {
		var btnWrap = document.createElement('div');
		btnWrap.classList.add('btnWrap');

		var saveText = true ? 'Update' : 'Save';

		saveBtn = button.build({
			text: saveText,
			type: 'contained',
			style: 'secondary',
		});
		cancelBtn = button.build({
			text: 'Cancel',
			type: 'outlined',
			style: 'secondary',
		});

		if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
		btnWrap.appendChild(cancelBtn);

		return btnWrap;
	}

	function involvementDataLookup(consumerId) {
		return involvementsData[consumerId]
	}

	function build(consumersInvolvedData) {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;
		consumerLocationData = {};
    setInvolvementsData(consumersInvolvedData);
    isEdit = consumersInvolvedData ? true : false;

		section = document.createElement('div');
		section.classList.add('consumerSections__section', 'involvementSection');

		involvementDropdown = buildInvolvementDropdown();
		locationDropdown = buildLocationDropdown();
		ppiCheckbox = buildCheckbox();
		actionBtns = buildBtns();

		section.appendChild(involvementDropdown);
		section.appendChild(locationDropdown);
		section.appendChild(ppiCheckbox);
		section.appendChild(actionBtns);

		setupEvents();
		toggleSaveDisabled();

		return section;
	}
	function populate(consumerId) {
		selectedConsumerId = consumerId;

		populateLocationDropdown();
		setInvolvmentDropdownValue();
		setPPICheckboxValue();
		checkRequiredFields();
	}

	return {
		build,
		populate,
		checkRequiredFields,
		initConsumerData: initConsumerInvolvementData,
		deleteConsumerData,
		getData: getDataForSave,
		clearData,
		involvementDataLookup,
		checkOneHasPPI
	};
})();
