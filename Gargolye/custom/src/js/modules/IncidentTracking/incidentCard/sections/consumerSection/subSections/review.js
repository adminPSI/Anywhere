var consumerReview = (function() {
  // DOM
  //---------------------
  var section;
  var reviewsHome;
  var newReviewBtn;
  var reviewsReviewTable;
  //*form
  var reviewDateInput;
  var reviewedByDropdown;
  var notesInput;
  var formButtons;
  var deleteBtn;
  var saveBtn;
  var cancelBtn;
	// DATA
  //---------------------
  var reviewData;
  var reviewDeleteData;
  var reviewedByDropdownData;
	// Values
  //---------------------
  var selectedConsumerId;
  var selectedReviewId;
  //*form values
  var reviewedDate;
  var reviewedById;
  var reviewNotes;
  var lastUpdatedBy;
  var lastUpdatedOn;

  var isEdit;
  var formReadOnly;
  
  function getDataForSave() {
    return reviewData;
  }
  function getDataForDelete() {
    return reviewDeleteData;
  }
  function clearData() {
    reviewData = undefined;
    reviewDeleteData = undefined;
    selectedConsumerId = undefined;
    selectedReviewId = undefined;

    clearFormDataDefaults();
    clearReviewTable();
  }
  function deleteConsumerData(consumerId) {
    if (reviewData[consumerId]) {
      var { [consumerId]: removedConsumer, ...newReviewData } = reviewData;
      reviewData = newReviewData;

      if (!reviewDeleteData[consumerId]) {
        reviewDeleteData[consumerId] = removedConsumerData;
      }
    }
  }
  function deleteConsumerReviewData() {
    if (!selectedReviewId.includes('new')) {
      var deletedReview = reviewData[selectedConsumerId][selectedReviewId];
      if (!reviewDeleteData[selectedConsumerId]) reviewDeleteData[selectedConsumerId] = {};
      reviewDeleteData[selectedConsumerId][selectedReviewId] = deletedReview;
    }

    delete reviewData[selectedConsumerId][selectedReviewId];
    
    selectedReviewId = undefined;
    var form = section.querySelector('.reviewForm');
    section.removeChild(form);
    reviewsHome.classList.remove('hidden');
    consumerSubSections.showBackBtn();
    clearFormDataDefaults();
    populateReviewTable();
  }
  
  function getDropdownData() {
    incidentTrackingAjax.getReviewedByDropdown(function(res) {
      reviewedByDropdownData = res;
    });
  }

  // Form
  //-----------------------------------------------
  function showDeleteWarning() {
    var deleteWarningPopup = POPUP.build({});

    var message = document.createElement('p');
    message.innerHTML = 'Are you sure you want to delete?';

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    var yesBtn = button.build({
			text: 'Yes',
			type: 'contained',
			style: 'secondary',
			callback: () => {
        deleteConsumerReviewData();
        POPUP.hide(deleteWarningPopup);
      }
    });
    var noBtn = button.build({
			text: 'No',
			type: 'contained',
			style: 'secondary',
			callback: () => {
        POPUP.hide(deleteWarningPopup);
      }
    });
    
    btnWrap.appendChild(yesBtn);
    btnWrap.appendChild(noBtn);

    deleteWarningPopup.appendChild(message);
    deleteWarningPopup.appendChild(btnWrap);
    
    POPUP.show(deleteWarningPopup);
  }
  function checkRequiredFields() {
    var hasErrors = false;

    var dateInput = reviewDateInput.querySelector('input');
    if (!dateInput.value) {
      reviewDateInput.classList.add('error');
      hasErrors = true;
    } else {
      reviewDateInput.classList.remove('error');
    }

    if (hasErrors) {
      saveBtn.classList.add('disabled');
    } else {
      saveBtn.classList.remove('disabled');
    }
  }
  function clearFormDataDefaults() {
    reviewedDate = undefined;
    reviewedById = undefined;
    reviewNotes = undefined;
    lastUpdatedBy = undefined;
    lastUpdatedOn = undefined;
  }
  function setFormDataDefaults(formData) {
    if (formData) {
      reviewedDate = formData.reviewedDate;
      reviewedById = formData.reviewedBy;
      reviewNotes = formData.notes;
    }
  }
  // events
  function setupFormEvents() {
    var tmpReviewDate;
    var tmpReviewedBy;
    var tmpNote;

    reviewDateInput.addEventListener('change', e => {
      tmpReviewDate = e.target.value;
      checkRequiredFields();
    });
    reviewedByDropdown.addEventListener('change', e => {
      tmpReviewedBy = e.target.value;
    });
    notesInput.addEventListener('change', e => {
      tmpNote = e.target.value;
    });

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        showDeleteWarning();
      });
    }
    
    formButtons.addEventListener('click', e => {
      if (e.target === saveBtn) {
        if (!reviewData[selectedConsumerId]) {
          reviewData[selectedConsumerId] = {};
        }

        if (!reviewData[selectedConsumerId][selectedReviewId]) {
          var keys = Object.keys(reviewData[selectedConsumerId]);
          selectedReviewId = keys.length === 0 ? `new${keys.length}` : `new${keys.length + 1}`;

          reviewData[selectedConsumerId][selectedReviewId] = {
            reviewedDate: '',
            reviewedBy: '',
            notes: '',
            updated: ''
          };
        }

        if (tmpReviewDate || tmpReviewedBy || tmpNote) {
          reviewData[selectedConsumerId][selectedReviewId].updated = true;
        }

        if (tmpReviewDate) reviewData[selectedConsumerId][selectedReviewId].reviewedDate = tmpReviewDate;
        if (tmpReviewedBy) reviewData[selectedConsumerId][selectedReviewId].reviewedBy = tmpReviewedBy;
        if (tmpNote) reviewData[selectedConsumerId][selectedReviewId].notes = tmpNote;

        selectedReviewId = undefined;

        var form = section.querySelector('.reviewForm');
        section.removeChild(form);
        reviewsHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        populateReviewTable();
        return;
      }

      if (e.target === cancelBtn) {
        selectedReviewId = undefined;
        var form = section.querySelector('.reviewForm');
        section.removeChild(form);
        reviewsHome.classList.remove('hidden');
        consumerSubSections.showBackBtn();
        clearFormDataDefaults();
        return;
      }
    });
  }
  // build
  function buildReviewDateInput() {
    var opts = {
      label: 'Review Date',
      type: 'date',
      style: 'secondary',
      value: reviewedDate
    };
    
    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var dateInput = input.build(opts);

    return dateInput;
  }
  function buildReviewedByDropdown() {
    var opts = {
      label: 'Reviewed By',
      style: 'secondary'
    };
    
    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var rbDrop = dropdown.build(opts);

    var data = reviewedByDropdownData.map(rb => {
      return {
        value: rb.employeeId,
        text: rb.employeeName
      }
    });

    data.unshift({ value: '%', text: '' });

    dropdown.populate(rbDrop, data, reviewedById);

    return rbDrop;
  }
  function buildNotesInput() {
    var opts = {
      label: 'Notes',
      type: 'textarea',
      style: 'secondary',
      value: reviewNotes
    };
    
    if (isEdit && formReadOnly) {
      opts.readonly = true;
    }

    var nInput = input.build(opts);

    return nInput;
  }
  function buildFormBtns() {
    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    saveBtn = button.build({
      text: 'Done',
      type: 'contained',
      style: 'secondary'
    });
    cancelBtn = button.build({
      text: 'Cancel',
      type: 'outlined',
      style: 'secondary'
    });

    if ((!isEdit || (isEdit && !formReadOnly)) && $.session.incidentTrackingUpdate) btnWrap.appendChild(saveBtn);
    btnWrap.appendChild(cancelBtn);

    return btnWrap;
  }
  function buildDeleteBtn() {
    var btn = button.build({
      text: 'Delete',
      type: 'contained',
      style: 'secondary',
      classNames: 'error'
    });

    return btn;
  }
  function buildNewReviewForm() {
    var form = document.createElement('div');
    form.classList.add('reviewForm');

    reviewDateInput = buildReviewDateInput();
    reviewedByDropdown = buildReviewedByDropdown();
    notesInput = buildNotesInput();
    formButtons = buildFormBtns();

    if (isEdit && $.session.incidentTrackingUpdate && $.session.incidentTrackingDelete) {
      deleteBtn = buildDeleteBtn();
      form.appendChild(deleteBtn);
    }
    
    form.appendChild(reviewDateInput);
    form.appendChild(reviewedByDropdown);
    form.appendChild(notesInput);
    form.appendChild(formButtons);

    return form;
  }
  // show
  function showForm(isedit) {
    isEdit = isedit;

    consumerSubSections.hideBackBtn();
      
    reviewsHome.classList.add('hidden');

    var reviewForm = buildNewReviewForm();
    section.appendChild(reviewForm);

    setupFormEvents();
    checkRequiredFields();
  }

  // Review Table
  //-----------------------------------------------
  function clearReviewTable() {
    var tableBody = reviewsReviewTable.querySelector('.table__body');
    tableBody.innerHTML = '';
  }
  function populateReviewTable() {
    if (!reviewData) return;
    if (!reviewData[selectedConsumerId]) return;

    var tableData = [];

    var keys = Object.keys(reviewData[selectedConsumerId]);
    keys.forEach(key => {
      var data = reviewData[selectedConsumerId][key];

      var reviewedBy = reviewedByDropdownData.find(d => d.employeeId === data.reviewedBy);
      reviewedBy = reviewedBy ? reviewedBy.employeeName : '';
      var dateReviewed = UTIL.formatDateFromIso(data.reviewedDate);

      tableData.push({
        id: key,
        values: [reviewedBy, dateReviewed]
      });
    });

    table.populate(reviewsReviewTable, tableData);
  }
  function buildReviewTable() {
    var reviewTable = table.build({
      tableId: 'consumerReviewTable',
      columnHeadings: [
        'Reviewed By',
        'Date Reviewed',
      ]
    });

    reviewTable.addEventListener('click', event => {
      if (event.target.classList.contains('table__row') && !event.target.classList.contains('header')) {
        selectedReviewId = event.target.id;
        setFormDataDefaults(reviewData[selectedConsumerId][selectedReviewId]);
        showForm(true);
      }
    });

    return reviewTable;
  }

  // Home Page
  //-----------------------------------------------
  function init() {
    formReadOnly = $.session.incidentTrackingUpdate === true ? false : true;
    
    reviewData = {};
    reviewDeleteData = {};
    getDropdownData();
  }
  function buildAddNewReviewBtn() {
    var btn = button.build({
      text: 'Add New Review',
      type: 'contained',
      style: 'secondary'
    });

    btn.addEventListener('click', () => showForm(false));

    return btn;
  }
  function build() {
    init();

    section = document.createElement('div');
    section.classList.add('consumerSections__section', 'reviewSection');

    reviewsHome = document.createElement('div');
    reviewsHome.classList.add('consumerSections__section__home');

    newReviewBtn = buildAddNewReviewBtn();
    reviewsReviewTable = buildReviewTable();

    if ($.session.incidentTrackingUpdate) reviewsHome.appendChild(newReviewBtn);
    reviewsHome.appendChild(reviewsReviewTable);
    
    section.appendChild(reviewsHome);

    return section;
  }
  function populate(data, selectedConsumerID) {
    selectedConsumerId = selectedConsumerID;

    if (data) {
      data.forEach(d => {
        if (!reviewData[selectedConsumerId]) {
          reviewData[selectedConsumerId] = {};
        }
  
        if (!reviewData[selectedConsumerId][d.itConsumerReviewId]) {
          reviewData[selectedConsumerId][d.itConsumerReviewId] = d;
          reviewData[selectedConsumerId][d.itConsumerReviewId].updated = false;
  
          // format dates
          if (reviewData[selectedConsumerId][d.itConsumerReviewId].reviewedDate) {
            var reviewDate = reviewData[selectedConsumerId][d.itConsumerReviewId].reviewedDate.split(' ')[0];
            reviewData[selectedConsumerId][d.itConsumerReviewId].reviewedDate = UTIL.formatDateToIso(reviewDate);
          }
        }
      });
    }

    clearReviewTable();
    populateReviewTable();
  }

  return {
    build,
    populate,
    clearData,
    deleteConsumerData,
    getData: getDataForSave,
    getDeleteData: getDataForDelete
  }
})();