const addEditOutcomeServices = (() => {
  let outcomeServicesData;
  let selectedConsumer;
  let filterValues;
  let newFilterValues;
  let filterRow;
  let addOutCome;
  let importServicesBtn;
  let filesList = [];
  let backBtn;
  // DOM
  let pageWrap;
  let overviewTable;
  //--
  let filterPopup;
  let outcomeTypeDropdown;
  let effectiveDateStart;
  let effectiveDateEnd;
  let importDate;
  let applyFilterBtn;
  let btnWrap;
  let outcomeTypeBtnWrap;
  let effectiveDateBtnWrap;
  let importDateBtnWrap;

  async function init(selectedConsume) {
    selectedConsumer = selectedConsume;
    buildNewOutcomeServices();
  }

  async function buildNewOutcomeServices() {
    DOM.clearActionCenter();
    DOM.scrollToTopOfPage();
    initFilterValues();
    document.getElementById('mini_roster').style.display = 'none';
    pageWrap = document.createElement('div');
    const consumerCard = buildConsumerCard();
    const backbtnWrap = document.createElement('div');
    backbtnWrap.classList.add('addOutcomeBtnWrap');
    const addInsertServicesBtnWrap = document.createElement('div');
    addInsertServicesBtnWrap.classList.add('addInsertServicesBtnWrap');
    backbtnWrap.appendChild(addInsertServicesBtnWrap);

    filteredByData = buildFilteredByData();
    addOutCome = addOutcomesButton();
    backBtn = backButton();
    addInsertServicesBtnWrap.appendChild(addOutCome);

    if ($.session.InsertServices === true) {
      importServicesBtn = button.build({
        text: 'IMPORT SERVICES',
        style: 'secondary',
        type: 'contained',
        classNames: 'importServices',
        callback: async () => {
          createUploadPopup();
        },
      });

      addInsertServicesBtnWrap.appendChild(importServicesBtn);
    }

    backbtnWrap.appendChild(backBtn);

    pageWrap.appendChild(consumerCard);
    pageWrap.appendChild(backbtnWrap);
    pageWrap.appendChild(filteredByData);
    DOM.ACTIONCENTER.appendChild(pageWrap);

    if ($.session.InsertOutcomes == true) {
      addOutCome.classList.remove('disabled');
    } else {
      addOutCome.classList.add('disabled');
    }

    const spinner = PROGRESS.SPINNER.get('Gathering Data...');
    pageWrap.appendChild(spinner);

    outcomeServicesData = await outcomesAjax.getOutcomeServicsPageData({
      token: $.session.Token,
      selectedConsumerId: selectedConsumer.id,
      outcomeType: filterValues.outcomeTypeName,
      effectiveDateStart: filterValues.effectiveDateStart,
      effectiveDateEnd: filterValues.effectiveDateEnd,
      appName: $.session.applicationName,
    });

    pageWrap.removeChild(spinner);
    buildOverviewTable();
  }

  // Create and append the popup to the body
  function createUploadPopup() {
    let filesList = [];

    // Create the main popup container
    const popup = document.createElement('div');
    popup.id = 'upload-popup';
    popup.className = 'upload-popup hiddenPopup';

    // Create the content container
    const popupContent = document.createElement('div');
    popupContent.className = 'upload-popup-content';

    // Create the heading
    const heading = document.createElement('h2');
    heading.innerText = 'Upload File';

    // Create the drop area
    const dropArea = document.createElement('div');
    dropArea.id = 'drop-area';
    dropArea.className = 'drop-area';
    dropArea.style.display = 'flex'; // Make the dropArea a flex container
    dropArea.style.flexDirection = 'column';
    dropArea.style.alignItems = 'center';
    dropArea.style.justifyContent = 'center';

    // Add text to the drop area
    const dropText1 = document.createElement('p');
    dropText1.innerText = 'Drag & drop a file here';
    const dropText2 = document.createElement('p');
    dropText2.innerText = 'or';

    // Handle drag and drop
    dropArea.addEventListener('dragover', event => {
      event.preventDefault();
      dropArea.classList.add('active');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('active');
    });

    dropArea.addEventListener('drop', event => {
      event.preventDefault();
      dropArea.classList.remove('active');
      const files = event.dataTransfer.files;
      handleFiles(files);
    });

    // Create the file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.className = 'file-input';
    fileInput.multiple = true;
    fileInput.style.display = 'none'; // Hide the input element

    // Create the button for selecting files
    const selectFilesButton = button.build({
      text: 'Select File',
      id: 'select-files',
      style: 'primary',
      type: 'contained',
      classNames: 'btn',
      callback: async () => {
        fileInput.click();
      },
    });

    // Center the button in its container
    selectFilesButton.style.margin = '10px auto';

    // Event listener to handle file selection
    fileInput.addEventListener('change', event => {
      const files = event.target.files;
      handleFiles(files);
    });

    // Append text and button to drop area
    dropArea.appendChild(dropText1);
    dropArea.appendChild(dropText2);
    dropArea.appendChild(selectFilesButton);

    // Create the file list display area
    const fileListDisplay = document.createElement('div');
    fileListDisplay.id = 'file-list';
    fileListDisplay.className = 'file-list';

    // Create the close button
    const closeButton = button.build({
      text: 'Close',
      id: 'upload-close',
      style: 'secondary',
      type: 'contained',
      classNames: 'btn',
      callback: async () => {
        hidePopup();
        filesList = [];
      },
    });

    // Create the Import button
    const importButton = button.build({
      text: 'Start Import',
      id: 'upload-import',
      style: 'secondary',
      type: 'contained',
      classNames: ['btn', 'disabled'],
      callback: async () => {
        const attachmentsForSave = await processFilesForUpload(filesList);

        hidePopup();
        importServices.init(attachmentsForSave, outcomeServicesData, selectedConsumer);
      },
    });

    const uploadBtnsWrap = document.createElement('div');
    uploadBtnsWrap.className = 'uploadBtnsWrap';

    // Append all elements to the content container
    popupContent.appendChild(heading);
    popupContent.appendChild(dropArea);
    popupContent.appendChild(fileListDisplay);
    uploadBtnsWrap.appendChild(closeButton);
    uploadBtnsWrap.appendChild(importButton);
    popupContent.appendChild(uploadBtnsWrap);

    // Append the content container to the popup
    popup.appendChild(popupContent);

    // Append the popup to the body
    document.body.appendChild(popup);

    // Function to display file names
    function displayFileNames(filesList) {
      fileListDisplay.innerHTML = ''; // Clear previous file list
      const list = document.createElement('ul');
      filesList.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = file.name;

        // Create the remove button (X)
        const removeButton = document.createElement('button');
        removeButton.innerText = 'X';
        removeButton.style.marginLeft = '10px';
        removeButton.style.color = 'red';
        removeButton.style.border = 'none';
        removeButton.style.background = 'transparent';
        removeButton.style.cursor = 'pointer';

        // Event listener to remove the file from the list
        removeButton.addEventListener('click', () => {
          removeFile(index);
        });

        listItem.appendChild(removeButton);
        list.appendChild(listItem);
      });
      fileListDisplay.appendChild(list);
    }

    // Function to handle files
    function handleFiles(files) {
      filesList = filesList.concat(Array.from(files));
      displayFileNames(filesList);
      for (const file of files) {
        console.log('File uploaded:', file.name);
      }

      toggleButtonsDisabled('import', filesList);
    }

    function toggleButtonsDisabled(filesList) {
      const importButton = document.getElementById('upload-import');

      if (filesList.length > 0) {
        importButton.disabled = false;
        importButton.classList.remove('disabled');
      } else {
        importButton.disabled = true;
        importButton.classList.add('disabled');
      }
  }

    // Function to remove a file from the list
    function removeFile(index) {
      filesList.splice(index, 1);
      displayFileNames(filesList);
      
      toggleButtonsDisabled(filesList);
    }

    // Function to process files for upload
    async function processFilesForUpload(files) {
      let attachments = [];
  
      for (const file of files) {
          const attachmentDetails = await _DOM.getAttachmentDetails(file);
          attachments.push(attachmentDetails.attachment);
      }
  
      return attachments; // Return just the attachment data
    }
  }

  // Hide popup function
  function hidePopup() {
    const popup = document.getElementById('upload-popup');
    if (popup) {
      popup.remove();
    }
  }

  function addOutcomesButton() {
    return button.build({
      text: 'ADD NEW OUTCOME',
      style: 'secondary',
      type: 'contained',
      classNames: 'reportBtn',
      callback: async () => {
        if (!addOutCome.classList.contains('disabled')) {
          addOutcomes.init(selectedConsumer, 0);
        }
      },
    });
  }

  function backButton() {
    return button.build({
      text: 'BACK',
      style: 'secondary',
      type: 'outlined',
      callback: async () => {
        document.getElementById('mini_roster').style.display = 'block';
        outcomes.backToOutcomeLoad(selectedConsumer);
      },
    });
  }

  function initFilterValues() {
    filterValues = {
      outcomeType: '%',
      effectiveDateStart: dates.formatISO(dates.subYears(new Date(new Date().setHours(0, 0, 0, 0)), 10)).slice(0, 10),
      effectiveDateEnd: dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
      importDate: dates.formatISO(new Date(new Date().setHours(0, 0, 0, 0))).slice(0, 10),
      outcomeTypeName: '%',
    };
  }

  function buildConsumerCard() {
    selectedConsumer.card.classList.remove('highlighted');

    const wrap = document.createElement('div');
    wrap.classList.add('planConsumerCard');

    wrap.appendChild(selectedConsumer.card);

    return wrap;
  }

  function buildFilteredByData() {
    var currentFilterDisplay = document.querySelector('.filteredByData');

    effectiveDateEnd = `${formatDate(filterValues.effectiveDateEnd)}`;
    importDate = `${formatDate(filterValues.effectiveDateEnd)}`;

    if (!currentFilterDisplay) {
      currentFilterDisplay = document.createElement('div');
      currentFilterDisplay.classList.add('filteredByData');
      filterButtonSet();
      currentFilterDisplay.appendChild(btnWrap);
    }

    if (filterValues.outcomeType === '%') {
      btnWrap.appendChild(outcomeTypeBtnWrap);
      btnWrap.removeChild(outcomeTypeBtnWrap);
    } else {
      btnWrap.appendChild(outcomeTypeBtnWrap);
      if (document.getElementById('outcomeTypeBtn') != null)
        document.getElementById('outcomeTypeBtn').innerHTML = 'Outcome Type: ' + filterValues.outcomeTypeName;
    }

    if (effectiveDateEnd == '') {
      btnWrap.appendChild(effectiveDateBtnWrap);
      btnWrap.removeChild(effectiveDateBtnWrap);
    } else {
      btnWrap.appendChild(effectiveDateBtnWrap);
      if (document.getElementById('effectiveDateBtn') != null)
        document.getElementById('effectiveDateBtn').innerHTML = 'Effective As Of: ' + effectiveDateEnd;
    }

    if (importDate == '') {
      btnWrap.appendChild(importDateBtnWrap);
      btnWrap.removeChild(importDateBtnWrap);
    } else {
      btnWrap.appendChild(importDateBtnWrap);
      if (document.getElementById('importDateBtn') != null)
        document.getElementById('importDateBtn').innerHTML = 'ImportDate: ' + importDate;
    }

    return currentFilterDisplay;
  }

  function filterButtonSet() {
    filterBtn = button.build({
      text: 'Filter',
      icon: 'filter',
      style: 'secondary',
      type: 'contained',
      classNames: 'filterBtnNew',
      callback: () => {
        showFilterPopup('ALL');
      },
    });

    outcomeTypeBtn = button.build({
      id: 'outcomeTypeBtn',
      text: 'Outcome Type: ' + filterValues.outcomeType,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('outcomeTypeBtn');
      },
    });
    outcomeTypeCloseBtn = button.build({
      icon: 'Delete',
      style: 'secondary',
      type: 'text',
      classNames: 'filterCloseBtn',
      callback: () => {
        closeFilter('outcomeTypeBtn');
      },
    });

    effectiveDateBtn = button.build({
      id: 'effectiveDateBtn',
      text: 'Effective As Of: ' + effectiveDateEnd,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('effectiveDateBtn');
      },
    });

    importDateBtn = button.build({
      id: 'importDateBtn',
      text: 'Import Date: ' + importDate,
      style: 'secondary',
      type: 'text',
      classNames: 'filterSelectionBtn',
      callback: () => {
        showFilterPopup('importDateBtn');
      },
    });

    btnWrap = document.createElement('div');
    btnWrap.classList.add('filterBtnWrap');
    btnWrap.appendChild(filterBtn);

    outcomeTypeBtnWrap = document.createElement('div');
    outcomeTypeBtnWrap.classList.add('filterSelectionBtnWrap');
    outcomeTypeBtnWrap.appendChild(outcomeTypeBtn);
    outcomeTypeBtnWrap.appendChild(outcomeTypeCloseBtn);
    btnWrap.appendChild(outcomeTypeBtnWrap);

    effectiveDateBtnWrap = document.createElement('div');
    effectiveDateBtnWrap.classList.add('filterSelectionBtnWrap');
    effectiveDateBtnWrap.appendChild(effectiveDateBtn);
    btnWrap.appendChild(effectiveDateBtnWrap);

    importDateBtnWrap = document.createElement('div');
    importDateBtnWrap.classList.add('filterSelectionBtnWrap');
    importDateBtnWrap.appendChild(importDateBtn);
    btnWrap.appendChild(importDateBtnWrap);
  }

  function closeFilter(closeFilter) {
    if (closeFilter == 'outcomeTypeBtn') {
      filterValues.outcomeType = '%';
      filterValues.outcomeTypeName = '%';
      newFilterValues.outcomeType = '%';
      newFilterValues.outcomeTypeName = '%';
    }
    applyFilter();
  }

  function showFilterPopup(IsShow) {
    filterPopup = POPUP.build({});

    // Dropdowns
    outcomeTypeDropdown = dropdown.build({
      dropdownId: 'outcomeTypeDropdown',
      label: 'Outcome Type',
      style: 'secondary',
      value: filterValues.outcomeType,
    });

    // Date Inputs
    const effectiveDateWrap = document.createElement('div');
    effectiveDateEndInput = input.build({
      type: 'date',
      label: 'Effective As Of',
      style: 'secondary',
      value: filterValues.effectiveDateEnd,
    });

    const importDateWrap = document.createElement('div');
    importDateInput = input.build({
      type: 'date',
      label: 'Import Date',
      style: 'secondary',
      value: filterValues.importDate,
    });

    if (IsShow == 'ALL' || IsShow == 'effectiveDateBtn') {
      effectiveDateWrap.appendChild(effectiveDateEndInput);
    }

    if (IsShow == 'ALL' || IsShow == 'importDateBtn') {
      importDateWrap.appendChild(importDateInput);
    }

    const btnFilterWrap = document.createElement('div');
    btnFilterWrap.classList.add('btnWrap');
    applyFilterBtn = button.build({
      text: 'Apply',
      style: 'secondary',
      type: 'contained',
    });
    const cancelFilterBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: function () {
        POPUP.hide(filterPopup);
      },
    });
    btnFilterWrap.appendChild(applyFilterBtn);
    btnFilterWrap.appendChild(cancelFilterBtn);

    if (IsShow == 'ALL' || IsShow == 'outcomeTypeBtn') filterPopup.appendChild(outcomeTypeDropdown);

    filterPopup.appendChild(effectiveDateWrap);
    filterPopup.appendChild(importDateWrap);
    filterPopup.appendChild(btnFilterWrap);

    POPUP.show(filterPopup);
    populateOutcomeTypeDropdown();
    setupFilterEvents();
  }
  function setupFilterEvents() {
    newFilterValues = {};

    outcomeTypeDropdown.addEventListener('change', e => {
      var selectedOption = e.target.options[e.target.selectedIndex];
      newFilterValues.outcomeType = selectedOption.value;
      newFilterValues.outcomeTypeName = selectedOption.text;
    });

    effectiveDateEndInput.addEventListener('change', e => {
      if (e.target.value === '') {
        effectiveDateEndInput.classList.add('error');
      } else {
        effectiveDateEndInput.classList.remove('error');
        newFilterValues.effectiveDateEnd = e.target.value;
      }
      checkFilterPopForErrors();
    });
    applyFilterBtn.addEventListener('click', async e => {
      POPUP.hide(filterPopup);
      if (!applyFilterBtn.classList.contains('disabled')) {
        applyFilter();
      }
    });
  }

  async function populateOutcomeTypeDropdown() {
    const { getOutcomeTypeDropDownResult: OutcomeType } = await outcomesAjax.getOutcomeTypeDropDownAsync(selectedConsumer);
    let outcomeTypeData = OutcomeType.map(outcomeTypes => ({
      id: outcomeTypes.Goal_Type_ID,
      value: outcomeTypes.Goal_Type_ID,
      text: outcomeTypes.goal_type_description,
    }));
    outcomeTypeData.unshift({ id: '%', value: '%', text: 'ALL' });
    dropdown.populate('outcomeTypeDropdown', outcomeTypeData, filterValues.outcomeType);
  }

  function checkFilterPopForErrors() {
    const errors = [...filterPopup.querySelectorAll('.error')];
    const hasErrors = errors.length > 0 ? true : false;

    if (hasErrors) {
      applyFilterBtn.classList.add('disabled');
    } else {
      applyFilterBtn.classList.remove('disabled');
    }
  }

  async function applyFilter() {
    filterValues = { ...filterValues, ...newFilterValues };

    const spinner = PROGRESS.SPINNER.get('Gathering Data...');
    pageWrap.removeChild(overviewTable);
    pageWrap.appendChild(spinner);

    outcomeServicesData = await outcomesAjax.getOutcomeServicsPageData({
      token: $.session.Token,
      selectedConsumerId: selectedConsumer.id,
      outcomeType: filterValues.outcomeTypeName == 'ALL' ? '%' : filterValues.outcomeTypeName,
      effectiveDateStart: filterValues.effectiveDateStart,
      effectiveDateEnd: filterValues.effectiveDateEnd,
      appName: $.session.applicationName,
    });

    pageWrap.removeChild(spinner);

    buildOverviewTable();
    const newfilteredByData = buildFilteredByData();
    pageWrap.replaceChild(newfilteredByData, filteredByData);
    filteredByData = newfilteredByData;
  }

  function buildOverviewTable() {
    groupChildData();

    overviewTable = document.createElement('div');
    overviewTable.classList.add('outcomeTable');

    const mainHeading = document.createElement('div');
    mainHeading.classList.add('outcomeTable__header');
    mainHeading.innerHTML = `
      <div></div>
      <div>Outcome Type</div>
      <div>Outcome Statement</div>
      <div>Start Date</div>
      <div>End Date</div>  
      <div></div>
    `;
    overviewTable.appendChild(mainHeading);

    outcomeServicesData.pageDataParent.forEach(parent => {
      const goalID = parent.goal_id;
      var eventName;
      var startDate =
        parent.effectiveDateStart == null || ''
          ? ''
          : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(parent.effectiveDateStart.split('T')[0]));
      var endDate =
        parent.effectiveDateEnd == null || ''
          ? ''
          : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(parent.effectiveDateEnd.split('T')[0]));
      const rowWrap = document.createElement('div');
      rowWrap.classList.add('outcomeTable__subTableWrap');

      // TOP LEVEL ROW
      //---------------------------------
      const mainDataRow = document.createElement('div');
      mainDataRow.classList.add('outcomeTable__mainDataRow', 'outcomeTable__dataRow');
      mainDataRow.value = parent.goal_id;
      const endIcon = document.createElement('div');
      endIcon.classList.add('outcomeTable__endIcon');

      const toggleIcon = document.createElement('div');
      toggleIcon.id = 'authToggle';
      toggleIcon.classList.add('outcomeTable__endIcon');
      toggleIcon.innerHTML = icons['keyArrowRight'];
      mainDataRow.innerHTML = `       
        <div>${parent.outcomeType}</div>
        <div>${parent.outcomeStatement}</div>
        <div>${startDate}</div>
        <div>${endDate}</div>               
      `;
      mainDataRow.prepend(toggleIcon);
      if ($.session.InsertServices == true) {
        endIcon.innerHTML = icons['add'];
      } else {
        endIcon.innerHTML = `<div></div>`;
      }
      mainDataRow.appendChild(endIcon);
      rowWrap.appendChild(mainDataRow);

      // SUB ROWS
      //---------------------------------
      const subRowWrap = document.createElement('div');
      subRowWrap.classList.add('outcomeTable__subRowWrap');

      const subHeading = document.createElement('div');
      subHeading.classList.add('outcomeTable__subHeader');
      subHeading.innerHTML = `
        <div></div>
        <div>Service Type</div>
        <div>Service Statement</div>
        <div>Frequency</div>
        <div>Start Date</div>
        <div>End Date</div>
      `;
      subRowWrap.appendChild(subHeading);

      if (outcomeServicesData.pageDataChild[goalID]) {
        outcomeServicesData.pageDataChild[goalID].sort((a, b) => {
          return parseInt(a.itemnum) - parseInt(b.itemnum);
        });

        outcomeServicesData.pageDataChild[goalID].forEach(child => {
          const subDataRow = document.createElement('div');
          var startDate =
            child.serviceStartDate == null || ''
              ? ''
              : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.serviceStartDate.split('T')[0]));
          var endDate =
            child.serviceEndDate == null || ''
              ? ''
              : UTIL.abbreviateDateYear(UTIL.formatDateFromIso(child.serviceEndDate.split('T')[0]));
          var serviceTyp = child.serviceType == null ? '' : child.serviceType;
          subDataRow.classList.add('outcomeTable__subDataRow', 'outcomeTable__dataRow');
          subDataRow.innerHTML = `
            <div></div>
            <div>${serviceTyp}</div>     
            <div>${child.serviceStatement}</div>
            <div>${child.frequency}</div>
            <div>${startDate}</div>
            <div>${endDate}</div>            
          `;
          subRowWrap.appendChild(subDataRow);

          subDataRow.addEventListener('click', e => {
            if ($.session.UpdateServices == true) {
              addServicesForm.init(selectedConsumer, child.objective_Id, 0);
            }
          });
        });
      }

      // EVENT
      //---------------------------------
      mainDataRow.addEventListener('click', e => {
        var goalID = e.currentTarget.value;
        if (eventName != 'toggle' && eventName != 'add') {
          if ($.session.UpdateOutcomes == true) {
            addOutcomes.init(selectedConsumer, goalID);
          }
        }
        eventName = '';
      });

      toggleIcon.addEventListener('click', e => {
        const toggle = document.querySelector('#authToggle');
        eventName = 'toggle';
        if (subRowWrap.classList.contains('active')) {
          // close it
          subRowWrap.classList.remove('active');
          toggleIcon.innerHTML = icons.keyArrowRight;
        } else {
          // open it
          subRowWrap.classList.add('active');
          toggleIcon.innerHTML = icons.keyArrowDown;
        }
      });

      endIcon.addEventListener('click', e => {
        eventName = 'add';
        addServicesForm.init(selectedConsumer, 0, goalID);
      });

      // ASSEMBLY
      //---------------------------------
      rowWrap.appendChild(subRowWrap);
      overviewTable.appendChild(rowWrap);
    });

    pageWrap.appendChild(overviewTable);
  }

  function groupChildData() {
    if (!outcomeServicesData.pageDataChild) {
      return;
    }

    const groupedChildren = outcomeServicesData.pageDataChild.reduce((obj, child) => {
      if (!obj[child.goal_id]) {
        obj[child.goal_id] = [];
        obj[child.goal_id].push(child);
      } else {
        obj[child.goal_id].push(child);
      }

      return obj;
    }, {});

    outcomeServicesData.pageDataChild = { ...groupedChildren };
  }

  function formatDate(date) {
    if (!date) return '';

    return UTIL.abbreviateDateYear(UTIL.formatDateFromIso(date.split('T')[0]));
  }

  return {
    init,
    buildNewOutcomeServices,
  };
})();
