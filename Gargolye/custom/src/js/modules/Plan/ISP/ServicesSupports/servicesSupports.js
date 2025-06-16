const servicesSupports = (() => {
  let isReadOnly;
  let isSortable;
  let planID; // aka: assessmentId
  let modificationsId;
  let servicesSupportsData; // data
  let dropdownData;
  let selectedVendors = [];
  let selectedFundingSources = [];
  let hasPaidSupports;
  let paidSupportsTable;
  let additionalSupportsTable;
  let professionalReferralsTable;
  let enableMultiEdit = false;
  let selectedPaidSupportIds = [];
  let selectedPaidSupportRows = [];
  let multiEditBtn;
  let multiEditUpdateBtn;
  let multiEditCancelBtn;
  let fundingSourceDropdownSelectedText;
  let servicesDropdownSelectedText;
  let servicesOtherDropdownSelectedText;
  let providerDropdownSelectedText;
  let hcbsSelected;
  let saveUpdateProvider = '';
  let charLimits;

  // UTILS
  //------------------------------------------------------
  function refreshDropdownData(newDropdownData) {
    dropdownData = newDropdownData;
  }
  function mapPaidSupportDataForTable(ps) {
    let assessmentAreaId;
    let assessmentArea;

    const providerId = ps.providerId;
    const serviceNameId = ps.serviceNameId;
    const serviceNameOther = ps.serviceNameOther;
    const scopeOfService = ps.scopeOfService ? ps.scopeOfService : ps.scopeOfservice;
    const howOftenValue = ps.howOftenValue;
    const howOftenFrequency = ps.howOftenFrequency;
    const howOftenText = ps.howOftenText;
    const fundingSource = ps.fundingSource;
    const fundingSourceText = ps.fundingSourceText;
    const paidSupportsId = ps.paidSupportsId;
    let beginDate = ps.beginDate ? ps.beginDate.split(' ')[0] : '';
    let endDate = ps.endDate ? ps.endDate.split(' ')[0] : '';
    beginDate = beginDate ? UTIL.formatDateToIso(beginDate) : '';
    endDate = endDate ? UTIL.formatDateToIso(endDate) : '';
    let bDate = beginDate ? UTIL.formatDateFromIso(beginDate) : '';
    let eDate = endDate ? UTIL.formatDateFromIso(endDate) : '';
    if (bDate !== '') {
      const splitDate = bDate.split('/');
      bDate = `${splitDate[0]}/${splitDate[1]}/${splitDate[2].substring(2)}`;
    }
    if (eDate !== '') {
      const splitDate = eDate.split('/');
      eDate = `${splitDate[0]}/${splitDate[1]}/${splitDate[2].substring(2)}`;
    }

    const a = assessment.getApplicableSections();
    if (a[ps.assessmentAreaId]) {
      assessmentAreaId = ps.assessmentAreaId;
      assessmentArea = getAssessmentAreaById(assessmentAreaId);
    } else {
      assessmentAreaId = '';
      assessmentArea = '';
    }

    const rowOrder = ps.rowOrder;

    const providerName = getProviderNameById(providerId);
    const serviceName = getServiceNameById(serviceNameId);
    const serviceOtherName = getOtherServiceNameById(serviceNameOther);
    const fundingSourceDesc = fundingSource ? getFundingSourceById(fundingSource) : '';
    const howOftenFrequencyText = howOftenFrequency ? getHowOftenHowMuchFrequencyById(howOftenFrequency) : '';

    let howOften = '';
    if (howOftenValue) howOften += howOftenValue;
    // if (howOftenFrequency && howOftenFrequency !== '4') {
    //   howOften += ` x `;
    // }
    if (howOftenFrequency && howOftenFrequency !== '5') {
      howOften += ` ${howOftenFrequencyText}`;
    }
    if (howOftenText) howOften += ` ${howOftenText}`;

    let funding = '';
    if (fundingSource && fundingSource !== '8') {
      funding = fundingSourceDesc;
    } else {
      if (fundingSourceText) {
        funding = fundingSourceText;
      }
    }
    let service = '';
    if (serviceNameId && serviceNameId !== '47') {
      service = serviceName;
    } else {
      if (serviceOtherName) {
        service = serviceOtherName;
      }
    }

    return {
      tableValues: [assessmentArea, funding, service, providerName, scopeOfService, howOften, bDate, eDate],
      psData: {
        assessmentAreaId,
        providerId,
        providerName,
        serviceNameId,
        serviceNameOther,
        scopeOfService,
        howOftenValue,
        howOftenFrequency,
        howOftenText,
        beginDate,
        endDate,
        fundingSource,
        fundingSourceText,
        paidSupportsId,
        rowOrder,
      },
    };
  }
  function mapAdditionalSupportDataForTable(as) {
    let assessmentAreaId;
    let assessmentArea;

    const whoSupports = as.whoSupports;
    const whoSupportsText = planData.getRelationshipNameById(whoSupports);
    const whatSupportLooksLike = as.whatSupportLooksLike ? as.whatSupportLooksLike : as.whatSupportsLookLike;
    const howOftenValue = as.howOftenValue;
    const howOftenFrequency = as.howOftenFrequency;
    const howOftenText = as.howOftenText;
    const additionalSupportsId = as.additionalSupportsId;
    const rowOrder = as.rowOrder;

    const a = assessment.getApplicableSections();
    if (a[as.assessmentAreaId]) {
      assessmentAreaId = as.assessmentAreaId;
      assessmentArea = getAssessmentAreaById(assessmentAreaId);
    } else {
      assessmentAreaId = '';
      assessmentArea = '';
    }

    const whenHowOftenDesc = howOftenFrequency ? getWhenHowOftenFrequencyById(howOftenFrequency) : '';
    let howOften = '';
    if (howOftenValue) howOften += howOftenValue;
    if (howOftenFrequency && howOftenFrequency !== '4') {
      howOften += ` ${whenHowOftenDesc}`;
    } else {
      if (howOftenText) howOften += ` ${howOftenText}`;
    }

    return {
      tableValues: [assessmentArea, whoSupportsText, whatSupportLooksLike, howOften],
      asData: {
        assessmentAreaId,
        whoSupports,
        whatSupportLooksLike,
        howOftenValue,
        howOftenFrequency,
        howOftenText,
        additionalSupportsId,
        rowOrder,
      },
    };
  }
  function mapProfessionalReferralDataForTable(pr) {
    let assessmentAreaId;
    let assessmentArea;

    const newOrExisting = pr.newOrExisting;
    const whoSupports = pr.whoSupports;
    const whoSupportsText = planData.getRelationshipNameById(whoSupports);
    const reasonForReferral = pr.reasonForReferral;
    const professionalReferralId = pr.professionalReferralId;
    const rowOrder = pr.rowOrder;

    const a = assessment.getApplicableSections();
    if (a[pr.assessmentAreaId]) {
      assessmentAreaId = pr.assessmentAreaId;
      assessmentArea = getAssessmentAreaById(assessmentAreaId);
    } else {
      assessmentAreaId = '';
      assessmentArea = '';
    }

    const newExisting = newOrExisting === '0' ? '' : newOrExisting === '1' ? 'New' : 'Existing';

    return {
      tableValues: [assessmentArea, newExisting, whoSupportsText, reasonForReferral],
      prData: {
        assessmentAreaId,
        newOrExisting,
        whoSupports,
        reasonForReferral,
        professionalReferralId,
        rowOrder,
      },
    };
  }
  // Counts
  function getNumberOfPaidSupports() {
    if (paidSupportsTable) {
      const tableBody = paidSupportsTable.querySelector('.table__body');
      const tableRows = [...tableBody.querySelectorAll('.table__row')];
      return tableRows.length;
    }
  }
  function getNumberOfAdditionalSupports(sectionId) {
    return additionalSupportsCount;
  }
  function getNumberOfProfessionalReferrals(sectionId) {
    return professionalReferralsCount;
  }
  function getHasPaidSupports() {
    return hasPaidSupports;
  }
  // VendorId
  function setInitialSelectedVendorIds() {
    selectedVendors = servicesSupportsData.paidSupport.reduce((acc, ps) => {
      if (ps.providerId && ps.providerId !== '') {
        acc.push({
          providerId: ps.providerId,
          providerName: ps.providerName ? ps.providerName : getProviderNameById(ps.providerId),
          row: ps.rowOrder,
        });
      }

      return acc;
    }, []);
  }
  function getSelectedVendors() {
    return selectedVendors;
  }
  function getSelectedVendorIds() {
    return selectedVendors.reduce((acc, vendor) => {
      acc.push(vendor.providerId);
      return acc;
    }, []);
  }
  // funding source names
  function setInitialFundingSourceNames() {
    selectedFundingSources = servicesSupportsData.paidSupport.reduce((acc, ps) => {
      if (ps.fundingSource && ps.fundingSource !== '') {
        acc.push({
          fundingSource: ps.fundingSource,
          row: ps.rowOrder,
        });
      }

      return acc;
    }, []);
  }
  function getSelectedFudningSourceNames() {
    return selectedFundingSources.reduce((acc, fs) => {
      if (getFundingSourceById(fs.fundingSource) == 'Other') {
        acc.push(servicesSupportsData.paidSupport[fs.row].fundingSourceText);
      } else {
        acc.push(getFundingSourceById(fs.fundingSource));
      }
      return acc;
    }, []);
  }

  // DROPDOWNS
  //------------------------------------------------------
  //-- populate -------
  function populateAssessmentAreaDropdown(dropdownEle, defaultValue) {
    const a = assessment.getApplicableSections();

    const data = dropdownData.assessmentAreas
      .filter(dd => a[dd.assessmentAreaId])
      .map(dd => {
        return {
          value: dd.assessmentAreaId,
          text: dd.assessmentArea,
        };
      });

    data.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    data.unshift({ value: '%', text: '' });

    dropdown.populate(dropdownEle, data, defaultValue);
  }
  function populateFundingSourceDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.fundingSource.map(dd => {
      return {
        value: dd.value,
        text: dd.text,
      };
    });

    // if ($.session.applicationName === 'Advisor' && defaultValue === '') {
    //   defaultValue = '4';
    //   hcbsSelected = true;
    // }

    if (defaultValue && defaultValue !== '') fundingSourceDropdownSelectedText = data[defaultValue].text;

    dropdown.populate(dropdownEle, data, defaultValue);
  }

  function populateServiceNameDropdown(dropdownEle, defaultValue, fundingSourceVal) {
    const data = [];
    dropdownData.serviceTypes.forEach(dd => {
      if (dd.showWith.includes(fundingSourceVal) || (fundingSourceVal === '8' && dd.value === '47')) {
        data.push({
          value: dd.value,
          text: dd.text,
        });
      }
    });

    data.sort((a, b) => a.text.localeCompare(b.text));

    dropdown.populate(dropdownEle, data, defaultValue);
    return defaultValue;
  }

  function populateOtherServiceTypesDropdown(dropdownEle, defaultValue) {
    const data = dropdownData.serviceTypesOther.map(dd => {
      return {
        value: dd.serviceId,
        text: dd.serviceTypeDescription,
      };
    });

    data.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    data.unshift({ value: '%', text: '' });

    dropdown.populate(dropdownEle, data, defaultValue);
  }

  async function populateMultiSelectServiceVendorsDropdown(dropdownEle, thisSelectedArray) {
    var test = dropdownEle;
    let thisfundingSourceSelectedText;
    let thisServiceNameSelectedText;

    let completeVendorList = [];

    for (let i = 0; i < thisSelectedArray.length; i++) {
      thisfundingSourceSelectedText = thisSelectedArray[i].fundingSourceName;
      thisServiceNameSelectedText = thisSelectedArray[i].serviceName;

      const { getPaidSupportsVendorsResult: vendorNumbers } = await servicesSupportsAjax.getPaidSupportsVendors(
        thisfundingSourceSelectedText,
        thisServiceNameSelectedText,
      );

      completeVendorList.push(...vendorNumbers);
    }

    var test6 = { vendorId: '7500002', vendorName: 'RMS of Ohio, Inc.' };
    var test7 = { vendorId: '7500001', vendorName: 'IHS Services' };
    var test8 = { vendorId: '7500002', vendorName: 'XX' };
    var test9 = { vendorId: '7500001', vendorName: 'XXXX' };
    // completeVendorList.push(test6);
    // completeVendorList.push(test6);
    // completeVendorList.push(test7);
    //completeVendorList.push(test7);
    // completeVendorList.push(test8);
    // completeVendorList.push(test9);

    // Filter original concat list to just the vendors that have more than one in the list
    const duplicateVendors = completeVendorList.filter((item, index, self) => {
      return self.findIndex(t => t.vendorId === item.vendorId) !== index;
    });

    // need to get duplicateVendors list down to just the vendors with the correct number of occurances
    let minOccurancePaidSupports;
    // thisSelectedArray.length = 3
    if (thisSelectedArray.length > 2) {
      minOccurancePaidSupports = removeDuplicatesBasedOnCount(duplicateVendors, 'vendorId', thisSelectedArray.length);
    } else {
      minOccurancePaidSupports = duplicateVendors;
    }

    let minOccurancePaidSupportsFiltered = removeDuplicateObjects(minOccurancePaidSupports, 'vendorId');

    let vendorArray = [];
    // vendorArray contains the duplicate vendors data in Dropdown data formnat
    minOccurancePaidSupportsFiltered.forEach(row => {
      let thisVendorObject = { value: row.vendorId, text: row.vendorName };
      vendorArray.push(thisVendorObject);
    });

    vendorArray.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    if (vendorArray.length > 0) {
      vendorArray.unshift({ value: '', text: '[SELECT A PROVIDER]' });
    } else {
      vendorArray.unshift({ value: '', text: 'No Common Provider' });
    }

    dropdown.populate(dropdownEle, vendorArray);

    return;
  }

  async function populateServiceVendorsDropdown(dropdownEle, defaultValue, ignoreGuardClauses) {
    // const data = dropdownData.serviceVendors.map(dd => {
    //   return {
    //     value: dd.vendorId,
    //     text: dd.vendorName,
    //   };
    // });
    // let data = vendorNumbers.map(vendorNumber => ({
    //   value: vendorNumber.vendorId,
    //   text: vendorNumber.vendorName,
    // }));

    if (!ignoreGuardClauses) {
      // handles populating provider DDL when: 1. a service has just been selected 2. a service already exists for an existing record
      // Guard clause -- if no fundingSource selected , therefore no data in serviceVEndorDropDown
      if (!fundingSourceDropdownSelectedText || fundingSourceDropdownSelectedText == '') {
        const thisVendorDropDownData = [].map(dd => {
          return {
            value: dd.vendorId,
            text: dd.vendorName,
          };
        });

        //if there's no default value, and only one option, make that option the default
        if (!defaultValue) {
          if (thisVendorDropDownData.length === 1) {
            defaultValue = thisVendorDropDownData[0].value;
            saveUpdateProvider = defaultValue;
            dropdownEle.classList.remove('error');
          }
        }

        thisVendorDropDownData.unshift({ value: '%', text: '' });
        dropdown.populate(dropdownEle, thisVendorDropDownData, defaultValue);

        return;
      }

      // Guard clause --if HCBS/ICF fundingSource selected but no service selected, therefore no data in serviceVEndorDropDown
      if (
        (fundingSourceDropdownSelectedText.includes('HCBS') || fundingSourceDropdownSelectedText.includes('ICF')) &&
        servicesDropdownSelectedText == '%'
      ) {
        const thisVendorDropDownData = [].map(dd => {
          return {
            value: dd.vendorId,
            text: dd.vendorName,
          };
        });

        //if there's no default value, and only one option, make that option the default
        if (!defaultValue) {
          if (thisVendorDropDownData.length === 1) {
            defaultValue = thisVendorDropDownData[0].value;
            saveUpdateProvider = defaultValue;
            dropdownEle.classList.remove('error');
          }
        }

        thisVendorDropDownData.unshift({ value: '%', text: '' });
        dropdown.populate(dropdownEle, thisVendorDropDownData, defaultValue);

        return;
      }
    }

    // if guard clauses are not used (see above), then repopulate serviceVEndorDropDown
    const { getPaidSupportsVendorsResult: vendorNumbers } = await servicesSupportsAjax.getPaidSupportsVendors(
      fundingSourceDropdownSelectedText,
      servicesDropdownSelectedText,
    );

    const selectedVendorIds = getSelectedVendorIds();

    const nonPaidSupportData = vendorNumbers.filter(provider => selectedVendorIds.indexOf(provider.vendorId) < 0);
    const paidSupportData = vendorNumbers.filter(provider => selectedVendorIds.indexOf(provider.vendorId) >= 0);
    const nonPaidSupportDropdownData = nonPaidSupportData.map(dd => {
      return {
        value: dd.vendorId,
        text: dd.vendorName,
      };
    });
    const paidSupportDropdownData = paidSupportData.map(dd => {
      return {
        value: dd.vendorId,
        text: dd.vendorName,
      };
    });

    nonPaidSupportDropdownData.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    paidSupportDropdownData.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    const nonGroupedDropdownData = [{ value: '', text: '[SELECT A PROVIDER]' }];
    const paidSupportGroup = {
      groupLabel: 'Paid Support Providers',
      groupId: 'isp_ss_providerDropdown_paidSupportProviders',
      dropdownValues: paidSupportDropdownData,
    };
    const nonPaidSupportGroup = {
      groupLabel: 'Other Providers',
      groupId: 'isp_ss_providerDropdown_nonPaidSupportProviders',
      dropdownValues: nonPaidSupportDropdownData,
    };

    const groupDropdownData = [];
    if (paidSupportDropdownData.length > 0) {
      groupDropdownData.push(paidSupportGroup);
    }

    //if there's no default value, and only one option, make that option the default
    if (!defaultValue) {
      const tempData = [...nonPaidSupportDropdownData, ...paidSupportDropdownData];
      if (tempData.length === 1) {
        defaultValue = tempData[0].value;
        saveUpdateProvider = defaultValue;
        dropdownEle.classList.remove('error');
      }
    }

    groupDropdownData.push(nonPaidSupportGroup);

    dropdown.groupingPopulate({
      dropdown: dropdownEle,
      data: groupDropdownData,
      nonGroupedData: nonGroupedDropdownData,
      defaultVal: defaultValue,
    });
  }

  function populateHowOftenHowMuchFrequencyDropdown(dropdownEle, defaultValue) {
    dropdown.populate(dropdownEle, dropdownData.howOftenHowMuchFrequency, defaultValue);
  }
  function populateWhenHowOftenFrequencyDropdown(dropdownEle, defaultValue) {
    dropdown.populate(dropdownEle, dropdownData.whenHowOftenFrequency, defaultValue);
  }
  function populateNewOrExistingDropdown(dropdownEle, defaultValue) {
    dropdown.populate(dropdownEle, dropdownData.newOrExisting, defaultValue);
  }

  function getAssessmentAreaById(id) {
    const filteredAssessment = dropdownData.assessmentAreas.filter(dd => dd.assessmentAreaId === id);
    return filteredAssessment.length > 0 ? filteredAssessment[0].assessmentArea : '';
  }
  function getProviderNameById(id) {
    const filteredProvider = dropdownData.serviceVendors.filter(dd => dd.vendorId === id);
    return filteredProvider.length > 0 ? filteredProvider[0].vendorName : '';
  }
  function getServiceNameById(id) {
    const filteredService = dropdownData.serviceTypes.filter(dd => dd.value === id);
    return filteredService.length > 0 ? filteredService[0].text : '';
  }
  function getOtherServiceNameById(id) {
    const filteredService = dropdownData.serviceTypesOther.filter(dd => dd.serviceId === id);
    return filteredService.length > 0 ? filteredService[0].serviceTypeDescription : '';
  }
  function getFundingSourceById(id) {
    const filteredFunding = dropdownData.fundingSource.filter(dd => dd.value === id);
    return filteredFunding.length > 0 ? filteredFunding[0].text : '';
  }
  function getHowOftenHowMuchFrequencyById(id) {
    const filteredFrequency = dropdownData.howOftenHowMuchFrequency.filter(dd => dd.value === id);
    return filteredFrequency.length > 0 ? filteredFrequency[0].text : '';
  }
  function getWhenHowOftenFrequencyById(id) {
    const filteredFrequency = dropdownData.whenHowOftenFrequency.filter(dd => dd.value === id);
    return filteredFrequency.length > 0 ? filteredFrequency[0].text : '';
  }

  // PAID SUPPORTS
  //------------------------------------------------------
  async function insertPaidSupport(saveData, fromAssessment) {
    const { scopeOfService, fundingSourceText, howOftenText, ...rest } = saveData;

    if (!planID) {
      planID = plan.getCurrentPlanId();
    }

    const paidSupportId = await servicesSupportsAjax.insertPaidSupports({
      token: $.session.Token,
      anywAssessmentId: planID,
      scopeOfService: scopeOfService,
      fundingSourceText: fundingSourceText,
      howOftenText: howOftenText,
      ...rest,
    });

    if (fromAssessment) return;

    const parsedId = JSON.parse(paidSupportId.replace('[', '').replace(']', ''));
    const { tableValues, psData } = mapPaidSupportDataForTable({
      paidSupportsId: parsedId.paidSupportsId,
      ...saveData,
    });
    const rowId = `ps${psData.paidSupportsId}`;

    table.addRows(
      paidSupportsTable,
      [
        {
          id: rowId,
          values: tableValues,
          onClick: () => {
            if (!enableMultiEdit) {
              showAddPaidSupportPopup({
                popupData: psData,
                isNew: false,
                fromAssessment: false,
                isCopy: false,
                charLimits,
              });
              return;
            }

            const isSelected = event.target.classList.contains('selected');

            if (isSelected) {
              event.target.classList.remove('selected');
              selectedPaidSupportIds = selectedPaidSupportIds.filter(sr => sr !== psData.paidSupportsId);
              selectedPaidSupportRows = selectedPaidSupportRows.filter(
                sr => sr.paidSupportsId !== psData.paidSupportsId,
              );
            } else {
              event.target.classList.add('selected');
              selectedPaidSupportIds.push(psData.paidSupportsId);
              selectedPaidSupportRows.push({ ...psData, rowNode: event.target });
            }

            if (selectedPaidSupportIds.length === 0) {
              multiEditUpdateBtn.classList.add('disabled');
            } else {
              multiEditUpdateBtn.classList.remove('disabled');
            }
          },
          onCopyClick: () => {
            if (isReadOnly) return;
            const copiedData = { ...psData, paidSupportsId: '' };
            showAddPaidSupportPopup({
              popupData: copiedData,
              isNew: true,
              fromAssessment: false,
              isCopy: true,
              charLimits,
            });
          },
        },
      ],
      isSortable,
    );

    selectedVendors.push({
      providerId: psData.providerId,
      providerName: psData.providerName,
      row: psData.rowOrder,
    });
    selectedFundingSources.push({
      fundingSource: psData.fundingSource,
      row: psData.rowOrder,
    });

    //Update CI Funding Sources
    contactInformation.updateFundingSources();
    // Summary questions that require paid supports
    const numPaidSupports = getNumberOfPaidSupports();
    planSummary.checkForPaidSupports(numPaidSupports);
  }
  async function updatePaidSupport(updateData) {
    const { scopeOfService, fundingSourceText, howOftenText, ...rest } = updateData;

    await servicesSupportsAjax.updatePaidSupports({
      token: $.session.Token,
      anywAssessmentId: planID,
      scopeOfService: scopeOfService,
      fundingSourceText: fundingSourceText,
      howOftenText: howOftenText,
      ...rest,
    });

    const { tableValues, psData } = mapPaidSupportDataForTable({
      ...updateData,
    });
    const rowId = `ps${psData.paidSupportsId}`;

    table.updateRows(
      paidSupportsTable,
      [
        {
          id: rowId,
          values: tableValues,
          onClick: () => {
            if (!enableMultiEdit) {
              showAddPaidSupportPopup({
                popupData: psData,
                isNew: false,
                fromAssessment: false,
                isCopy: false,
                charLimits,
              });
              return;
            }

            const isSelected = event.target.classList.contains('selected');

            if (isSelected) {
              event.target.classList.remove('selected');
              selectedPaidSupportIds = selectedPaidSupportIds.filter(sr => sr !== psData.paidSupportsId);
              selectedPaidSupportRows = selectedPaidSupportRows.filter(
                sr => sr.paidSupportsId !== psData.paidSupportsId,
              );
            } else {
              event.target.classList.add('selected');
              selectedPaidSupportIds.push(psData.paidSupportsId);
              selectedPaidSupportRows.push({ ...psData, rowNode: event.target });
            }

            if (selectedPaidSupportIds.length === 0) {
              multiEditUpdateBtn.classList.add('disabled');
            } else {
              multiEditUpdateBtn.classList.remove('disabled');
            }
          },
          onCopyClick: () => {
            if (isReadOnly) return;
            const copiedData = { ...psData, paidSupportsId: '' };
            showAddPaidSupportPopup({
              popupData: copiedData,
              isNew: true,
              fromAssessment: false,
              isCopy: true,
              charLimits,
            });
          },
        },
      ],
      isSortable,
    );

    selectedVendors = selectedVendors.filter(vendor => vendor.rowOrder !== psData.rowOrder);
    selectedFundingSources = selectedFundingSources.filter(fs => fs.rowOrder !== psData.rowOrder);
    selectedVendors.push({
      providerId: psData.providerId,
      row: psData.rowOrder,
    });
    selectedFundingSources.push({
      fundingSource: psData.fundingSource,
      row: psData.rowOrder,
    });

    //Update CI Funding Sources
    contactInformation.updateFundingSources();
  }
  async function deletePaidSupport(paidSupportId) {
    await servicesSupportsAjax.deletePaidSupports({
      token: $.session.Token,
      paidSupportsId: paidSupportId,
    });

    table.deleteRow(`ps${paidSupportId}`);

    //Update CI Funding Sources
    contactInformation.updateFundingSources();
    // Summary questions that require paid supports
    const numPaidSupports = getNumberOfPaidSupports();
    planSummary.checkForPaidSupports(numPaidSupports);
  }
  async function updatePaidSupportsRowFromMultiEdit(multiSaveUpdateData) {
    selectedPaidSupportRows.forEach(row => {
      const { rowNode, ...tableData } = row;

      if (multiSaveUpdateData.beginDate !== '') {
        tableData.beginDate = multiSaveUpdateData.beginDate;
      }
      if (multiSaveUpdateData.endDate !== '') {
        tableData.endDate = multiSaveUpdateData.endDate;
      }
      if (multiSaveUpdateData.providerId !== '0' && multiSaveUpdateData.providerId !== '') {
        tableData.providerId = multiSaveUpdateData.providerId;
      }

      const { tableValues, psData } = mapPaidSupportDataForTable({
        ...tableData,
      });
      const rowId = `ps${psData.paidSupportsId}`;

      if (multiSaveUpdateData.providerId !== '0' && multiSaveUpdateData.providerId !== '') {
        tableValues.providerName = multiSaveUpdateData.providerName;
        psData.providerName = multiSaveUpdateData.providerName;
      }

      let isValid = true;

      if (multiSaveUpdateData.beginDate !== '' && multiSaveUpdateData.endDate !== '') {
        isValid = planValidation.validatePaidSupportsDates(multiSaveUpdateData.beginDate, multiSaveUpdateData.endDate);
      } else {
        if (multiSaveUpdateData.beginDate === '' || multiSaveUpdateData.endDate === '') {
          if (multiSaveUpdateData.beginDate !== '') {
            isValid = isDateValid(multiSaveUpdateData.beginDate, 'beginDate');
          }

          if (multiSaveUpdateData.endDate !== '') {
            isValid = isDateValid(multiSaveUpdateData.endDate, 'endDate');
          }
        }
      }

      table.updateRows(
        paidSupportsTable,
        [
          {
            id: rowId,
            hasError: !isValid,
            values: tableValues,
            onClick: event => {
              if (!enableMultiEdit) {
                showAddPaidSupportPopup({
                  popupData: psData,
                  isNew: false,
                  fromAssessment: false,
                  isCopy: false,
                  charLimits,
                });
                return;
              }

              const isSelected = event.target.classList.contains('selected');

              if (isSelected) {
                event.target.classList.remove('selected');
                selectedPaidSupportIds = selectedPaidSupportIds.filter(sr => sr !== psData.paidSupportsId);
                selectedPaidSupportRows = selectedPaidSupportRows.filter(
                  sr => sr.paidSupportsId !== psData.paidSupportsId,
                );
              } else {
                event.target.classList.add('selected');
                selectedPaidSupportIds.push(psData.paidSupportsId);
                selectedPaidSupportRows.push({ ...psData, rowNode: event.target });
              }

              if (selectedPaidSupportIds.length === 0) {
                multiEditUpdateBtn.classList.add('disabled');
              } else {
                multiEditUpdateBtn.classList.remove('disabled');
              }
            },
            onCopyClick: () => {
              if (isReadOnly) return;
              const copiedData = { ...psData, paidSupportsId: '' };
              showAddPaidSupportPopup({
                popupData: copiedData,
                isNew: true,
                fromAssessment: false,
                isCopy: true,
                charLimits,
              });
            },
          },
        ],
        isSortable,
      );

      selectedVendors = selectedVendors.filter(vendor => vendor.rowOrder !== psData.rowOrder);
      selectedVendors.push({
        providerId: psData.providerId,
        row: psData.rowOrder,
      });
    });

    let ISPValidation = await planValidation.ISPValidation(planID);
    planValidation.checkExperiencesAfterAddingNewPaidSupport(ISPValidation);
    planValidation.updatedIspOutcomesSetAlerts(ISPValidation);

    let serviceAlertDiv = document.getElementById('servicesAlert');

    if (ISPValidation.paidSupportsValidDates === false) {
      serviceAlertDiv.style.display = 'flex';
    } else {
      serviceAlertDiv.style.display = 'none';
    }
  }
  function checkForMatchingFundingSourceAndSeriviceNames(paidSupportRows) {
    // grab the first row to set values
    const fundingSource = paidSupportRows[0].fundingSource;
    const serviceNameId = paidSupportRows[0].serviceNameId;
    return paidSupportRows.every(psRow => {
      return psRow.fundingSource === fundingSource && psRow.serviceNameId === serviceNameId;
    });
  }
  //-- Markup ---------
  function toggleMultiEditUpdateBtn(multiSaveUpdateData, updateBtn) {
    let isValid = true;

    if (multiSaveUpdateData.beginDate !== '' && multiSaveUpdateData.endDate !== '') {
      isValid = planValidation.validatePaidSupportsDates(multiSaveUpdateData.beginDate, multiSaveUpdateData.endDate);
    } else {
      if (multiSaveUpdateData.beginDate === '' || multiSaveUpdateData.endDate === '') {
        if (multiSaveUpdateData.beginDate !== '') {
          isValid = isDateValid(multiSaveUpdateData.beginDate, 'beginDate');
        }

        if (multiSaveUpdateData.endDate !== '') {
          isValid = isDateValid(multiSaveUpdateData.endDate, 'endDate');
        }
      }
    }

    if (
      (multiSaveUpdateData.beginDate !== '' ||
        multiSaveUpdateData.endDate !== '' ||
        multiSaveUpdateData.providerId !== '') &&
      isValid
    ) {
      updateBtn.classList.remove('disabled');
      updateBtn.disabled = false;
    } else {
      updateBtn.classList.add('disabled');
      updateBtn.disabled = true;
    }

    // updateBtn.classList.remove('disabled');
  }

  function isDateValid(date, dateType) {
    const planStartDate = UTIL.formatDateFromDateObj(planDates.getPlanYearStartDate());
    const planEndDate = UTIL.formatDateFromDateObj(planDates.getPlanYearEndDate());

    const planStart = new Date(planStartDate);
    const planEnd = new Date(planEndDate);
    const inputDate = new Date(date);

    if (isNaN(inputDate)) {
      return false; // Invalid date input
    }

    if (dateType === 'beginDate') {
      // Begin Date must be within the Plan Span
      return inputDate >= planStart && inputDate <= planEnd;
    }

    if (dateType === 'endDate') {
      // End Date must be within the Plan Span
      return inputDate >= planStart && inputDate <= planEnd;
    }

    return false; // Default return if dateType is incorrect
  }

  function showMultiEditPopup() {
    let multiSaveUpdateData = {
      beginDate: '',
      endDate: '',
      providerId: '',
      providerName: '',
    };

    const multiEditPopup = POPUP.build({
      header: 'Update Paid Supports',
      classNames: 'multiEditPopup',
      hideX: true,
    });

    const message = document.createElement('p');
    message.classList.add('popupMessage');
    message.innerText = `Fields left blank will not be updated`;

    // set all multiselct data
    let thisSelectedPaidSupportItems = [];
    selectedPaidSupportRows.forEach(row => {
      let thisfundingSource = getFundingSourceById(row.fundingSource);
      let thisserviceName = getServiceNameById(row.serviceNameId);
      let thisSelectedObject = { fundingSourceName: thisfundingSource, serviceName: thisserviceName };
      thisSelectedPaidSupportItems.push(thisSelectedObject);
    });

    // set fundingSourceDropdownSelectedText & servicesDropdownSelectedText
    const fundingSource = getFundingSourceById(selectedPaidSupportRows[0].fundingSource);
    const serviceName = getServiceNameById(selectedPaidSupportRows[0].serviceNameId);
    fundingSourceDropdownSelectedText = fundingSource;
    servicesDropdownSelectedText = serviceName;

    // check for matching funding source and service names
    const matchingRows = checkForMatchingFundingSourceAndSeriviceNames(selectedPaidSupportRows);

    const providerNameDropdown = dropdown.build({
      dropdownId: 'providerNameDropdownPS',
      label: '*Provider Name',
      style: 'secondary',
      callback: (e, selectedOption) => {
        multiSaveUpdateData.providerId = selectedOption.value;
        multiSaveUpdateData.providerName = selectedOption.innerText;
        toggleMultiEditUpdateBtn(multiSaveUpdateData, updateBtn);
      },
    });
    // if (!matchingRows) {
    //   input.disableInputField(providerNameDropdown);
    // }

    const beginDateInput = input.build({
      label: 'Begin Date',
      type: 'date',
      style: 'secondary',
      // value: multiSaveUpdateData.beginDate,
      callback: e => {
        multiSaveUpdateData.beginDate = e.target.value;
        toggleMultiEditUpdateBtn(multiSaveUpdateData, updateBtn);
        if (isDateValid(e.target.value, 'beginDate')) {
          beginDateInput.classList.remove('error');
        } else {
          beginDateInput.classList.add('error');
        }
      },
    });
    const endDateInput = input.build({
      label: 'End Date',
      type: 'date',
      style: 'secondary',
      // value: multiSaveUpdateData.endDate,
      callback: e => {
        multiSaveUpdateData.endDate = e.target.value;
        toggleMultiEditUpdateBtn(multiSaveUpdateData, updateBtn);
        if (isDateValid(e.target.value, 'endDate')) {
          endDateInput.classList.remove('error');
        } else {
          endDateInput.classList.add('error');
        }
      },
    });

    const wrap = document.createElement('div');
    wrap.classList.add('btnWrap');

    const updateBtn = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: async () => {
        await servicesSupportsAjax.updateMultiPaidSupports({
          token: $.session.Token,
          beginDate: multiSaveUpdateData.beginDate !== '' ? multiSaveUpdateData.beginDate : '1900-01-01',
          endDate: multiSaveUpdateData.endDate !== '' ? multiSaveUpdateData.endDate : '1900-01-01',
          providerId: multiSaveUpdateData.providerId !== '' ? multiSaveUpdateData.providerId : '0',
          paidSupportsId: selectedPaidSupportIds.join(','),
        });

        multiEditUpdateBtn.classList.add('disabled');
        multiEditUpdateBtn.classList.add('hidden');
        multiEditCancelBtn.classList.add('hidden');

        multiEditBtn.classList.toggle('enabled');

        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));

        await updatePaidSupportsRowFromMultiEdit(multiSaveUpdateData);
        selectedPaidSupportIds = [];
        selectedPaidSupportRows = [];

        POPUP.hide(multiEditPopup);

        enableMultiEdit = false;
        fundingSourceDropdownSelectedText = '';
        servicesDropdownSelectedText = '';
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(multiEditPopup);
      },
    });

    wrap.appendChild(updateBtn);
    wrap.appendChild(cancelBtn);

    multiEditPopup.appendChild(message);
    multiEditPopup.appendChild(beginDateInput);
    multiEditPopup.appendChild(endDateInput);
    multiEditPopup.appendChild(providerNameDropdown);
    multiEditPopup.appendChild(wrap);

    // populateServiceVendorsDropdown(providerNameDropdown, multiSaveUpdateData.providerId);
    populateMultiSelectServiceVendorsDropdown(providerNameDropdown, thisSelectedPaidSupportItems);

    POPUP.show(multiEditPopup);
  }
  function buildMultiRowEdit() {
    const wrap = document.createElement('div');
    wrap.classList.add('mutliEditBtnWrap');

    multiEditBtn = button.build({
      text: 'Multi Select Supports',
      icon: 'multiSelect',
      style: 'secondary',
      type: 'contained',
      classNames: 'multiEditBtn',
      callback: () => {
        enableMultiEdit = !enableMultiEdit;

        multiEditBtn.classList.toggle('enabled');

        if (enableMultiEdit) {
          selectedPaidSupportIds = [];
          selectedPaidSupportRows = [];
          multiEditUpdateBtn.classList.remove('hidden');
          multiEditCancelBtn.classList.remove('hidden');
        } else {
          selectedPaidSupportIds = [];
          selectedPaidSupportRows = [];
          multiEditUpdateBtn.classList.add('disabled');
          multiEditUpdateBtn.classList.add('hidden');
          multiEditCancelBtn.classList.add('hidden');
          var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
          highlightedRows.forEach(row => row.classList.remove('selected'));
        }
      },
    });

    multiEditUpdateBtn = button.build({
      text: 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'disabled',
      callback: () => {
        showMultiEditPopup();
      },
    });
    multiEditCancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        enableMultiEdit = false;
        multiEditBtn.classList.toggle('enabled');
        multiEditUpdateBtn.classList.add('disabled');
        multiEditUpdateBtn.classList.add('hidden');
        multiEditCancelBtn.classList.add('hidden');

        selectedPaidSupportIds = [];
        selectedPaidSupportRows = [];
        var highlightedRows = [].slice.call(document.querySelectorAll('.table__row.selected'));
        highlightedRows.forEach(row => row.classList.remove('selected'));
      },
    });
    multiEditUpdateBtn.classList.add('hidden');
    multiEditCancelBtn.classList.add('hidden');

    wrap.appendChild(multiEditBtn);
    wrap.appendChild(multiEditUpdateBtn);
    wrap.appendChild(multiEditCancelBtn);

    return wrap;
  }
  function togglePaidSupportDoneBtn() {
    const inputsWithErrors = document.querySelector('.paidSupportPopup .error');
    const doneBtn = document.querySelector('.paidSupportPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
      doneBtn.disabled = true;
    } else {
      doneBtn.classList.remove('disabled');
      doneBtn.disabled = false;
    }
  }
  function showAddPaidSupportPopup({ popupData, isNew, fromAssessment, isCopy, charLimits }) {
    if (!dropdownData) {
      dropdownData = planData.getDropdownData();
    }

    let hasInitialErros;

    const saveUpdateData = {
      assessmentAreaId: !popupData.assessmentAreaId ? '' : popupData.assessmentAreaId,
      providerId: !popupData.providerId ? '' : popupData.providerId,
      serviceNameId: !popupData.serviceNameId ? '' : popupData.serviceNameId,
      serviceNameOther: !popupData.serviceNameOther ? '' : popupData.serviceNameOther,
      scopeOfService: !popupData.scopeOfService ? '' : popupData.scopeOfService,
      howOftenValue: !popupData.howOftenValue ? '' : popupData.howOftenValue,
      howOftenFrequency: !popupData.howOftenFrequency ? '' : popupData.howOftenFrequency,
      howOftenText: !popupData.howOftenText ? '' : popupData.howOftenText,
      beginDate: !popupData.beginDate ? '' : popupData.beginDate,
      endDate: !popupData.endDate ? '' : popupData.endDate,
      fundingSource: !popupData.fundingSource ? '' : popupData.fundingSource,
      fundingSourceText: !popupData.fundingSourceText ? '' : popupData.fundingSourceText,
      rowOrder: !popupData.rowOrder ? '' : popupData.rowOrder,
    };

    if (!isNew) {
      saveUpdateData.paidSupportsId = popupData.paidSupportsId;
    } else {
      if (!isCopy) {
        saveUpdateData.beginDate = UTIL.formatDateFromDateObj(planDates.getEffectiveStartDate());
        saveUpdateData.endDate = UTIL.formatDateFromDateObj(planDates.getEffectiveEndDate());
      }
    }

    if ($.session.applicationName === 'Advisor' && saveUpdateData.fundingSource === '') {
      hcbsSelected = true;
      saveUpdateData.fundingSource = '4';
    }

    const availableServiceTypes = [];
    const data = [];
    dropdownData.serviceTypes.forEach(dd => {
      if (dd.showWith.includes(saveUpdateData.fundingSource)) {
        availableServiceTypes.push(dd.value);
        data.push({
          value: dd.value,
          text: dd.text,
        });
      }
    });

    if (availableServiceTypes.includes(saveUpdateData.serviceNameId)) {
      let servicesDropdownSelected = data.find(e => e.value === saveUpdateData.serviceNameId);
      servicesDropdownSelectedText = servicesDropdownSelected.text;
    } else {
      if (saveUpdateData.fundingSource === '8') {
        servicesDropdownSelectedText = 'Other (please specify)';
      } else {
        saveUpdateData.serviceNameId = $.session.applicationName === 'Advisor' ? '24' : '%';
      }
    }

    // Popup
    const paidSupportPopup = POPUP.build({
      header: isNew ? 'Add Paid Support' : 'Edit Paid Support',
      classNames: 'paidSupportPopup',
      hideX: true,
    });

    // Asessment Area
    const assessmentAreaDropdown = dropdown.build({
      dropdownId: 'assessmentAreaDropdownPS',
      label: '*Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.assessmentAreaId = selectedOption.value;
        if (saveUpdateData.assessmentAreaId === '' || saveUpdateData.assessmentAreaId === '%') {
          assessmentAreaDropdown.classList.add('error');
        } else {
          assessmentAreaDropdown.classList.remove('error');
        }

        togglePaidSupportDoneBtn();
      },
    });
    if (fromAssessment) {
      assessmentAreaDropdown.classList.add('disabled');
    }
    // Funding Source Drop Down
    const fundingSourceDropdown = dropdown.build({
      dropdownId: 'fundingSourceDropdownPS',
      label: '*Funding Source',
      style: 'secondary',
      callback: async (e, selectedOption) => {
        saveUpdateData.fundingSource = selectedOption.value;

        if (saveUpdateData.fundingSource === '8') {
          serviceNameDropdown.classList.add('disabled');
          serviceNameOtherDropdown.classList.remove('disabled');
          serviceNameOtherDropdown.classList.add('error');

          saveUpdateData.serviceNameId = populateServiceNameDropdown(serviceNameDropdown, '47', '5');
          populateOtherServiceTypesDropdown(serviceNameOtherDropdown, '%');
        } else {
          serviceNameDropdown.classList.remove('disabled');

          saveUpdateData.serviceNameId = populateServiceNameDropdown(
            serviceNameDropdown,
            saveUpdateData.serviceNameId,
            selectedOption.value,
          );
          populateOtherServiceTypesDropdown(serviceNameOtherDropdown, '%');
        }

        // store currently selected fundingSource (fundingSourceDropdownSelectedText) for use when populating the vendor dropdown
        // store type of fundingSource (hcbsSelected) for use when populating service and vendor dropdowns
        fundingSourceDropdownSelectedText = selectedOption.innerText;
        if (selectedOption.innerText.includes('HCBS') || selectedOption.innerText.includes('ICF')) {
          hcbsSelected = true;
        } else {
          hcbsSelected = false;
        }

        if (hcbsSelected) {
          providerNameDropdown.classList.remove('disabled');
          await populateServiceVendorsDropdown(providerNameDropdown, saveUpdateData.providerId);
          if (saveUpdateProvider) {
            saveUpdateData.providerId = saveUpdateProvider;
          }
        } else {
          // re-enable provider dropdown if it was disabled
          providerNameDropdown.classList.remove('disabled');
          providerNameDropdown.classList.add('error');

          // non-waver -- get all Active Providers
          servicesDropdownSelectedText = '%';
          await populateServiceVendorsDropdown(providerNameDropdown, saveUpdateData.providerId);
          if (saveUpdateProvider) {
            saveUpdateData.providerId = saveUpdateProvider;
          }
        }

        if (saveUpdateData.fundingSource === '5') {
          // if 'State Plan Services' is selected, disable Provider Name Dropdown
          providerNameDropdown.querySelector('select').selectedIndex = -1;
          saveUpdateData.providerId = '';
          providerNameDropdown.classList.remove('error');
          providerNameDropdown.classList.add('disabled');
        }

        // validation of fundingSource DDL
        if (saveUpdateData.fundingSource === '' || saveUpdateData.fundingSource === '%') {
          fundingSourceDropdown.classList.add('error');
        } else {
          fundingSourceDropdown.classList.remove('error');
        }

        // validation of fundingSource Input
        const fundingSourceInputField = fundingSourceInput.querySelector('.input-field__input');

        // enable/disable funding source text input
        if (saveUpdateData.fundingSource === '8') {
          fundingSourceInput.classList.remove('disabled');
          fundingSourceInputField.removeAttribute('tabindex');

          if (saveUpdateData.fundingSourceText === '') {
            fundingSourceInput.classList.add('error');
          } else {
            fundingSourceInput.classList.remove('error');
          }
        } else {
          fundingSourceInput.classList.remove('error');
          fundingSourceInput.classList.add('disabled');
          fundingSourceInputField.setAttribute('tabindex', '-1');
          saveUpdateData.fundingSourceText = '';
          const textInput = fundingSourceInput.querySelector('.input-field__input');
          textInput.value = '';
        }

        await validateServicesDropdown();
        validateProviderDropdown();

        togglePaidSupportDoneBtn();
      },
    });

    async function validateServicesDropdown() {
      // Validation of Services DDL after selecting from fundingSource DDL
      const servicesDropdownSelect = document.querySelector('#serviceNameDropdownPS');
      const servicesOtherDropdownSelect = document.querySelector('#serviceNameOtherDropdownPS');

      if (hcbsSelected) {
        if (
          servicesDropdownSelect.options[servicesDropdownSelect.selectedIndex] &&
          servicesDropdownSelect.options[servicesDropdownSelect.selectedIndex].text !== ''
        ) {
          servicesDropdownSelectedText = servicesDropdownSelect.options[servicesDropdownSelect.selectedIndex].text;
          await populateServiceVendorsDropdown(providerNameDropdown, saveUpdateData.providerId);
          if (saveUpdateProvider) {
            saveUpdateData.providerId = saveUpdateProvider;
          }
        } else {
          servicesDropdownSelectedText = '';
          saveUpdateData.providerId = '';
          await populateServiceVendorsDropdown(providerNameDropdown, saveUpdateData.providerId);
          if (saveUpdateProvider) {
            saveUpdateData.providerId = saveUpdateProvider;
          }
        }
      }

      if (servicesDropdownSelect.options[servicesDropdownSelect.selectedIndex]) {
        servicesDropdownSelectedText = servicesDropdownSelect.options[servicesDropdownSelect.selectedIndex].text;
      } else {
        servicesDropdownSelectedText = '';
        serviceNameOtherDropdown.classList.add('disabled');
        saveUpdateData.serviceNameOther = '';
      }

      // if (saveUpdateData.serviceNameId === '' || saveUpdateData.serviceNameId === '%' || servicesDropdownSelectedText === '') {
      if (servicesDropdownSelectedText === '') {
        serviceNameDropdown.classList.add('error');
      } else {
        serviceNameDropdown.classList.remove('error');
      }
    }

    function validateProviderDropdown() {
      // Validation of Provider DDL after selecting from fundingSource DDL
      const providerDropdown = document.querySelector('#providerNameDropdownPS');

      if (
        providerDropdown.options[providerDropdown.selectedIndex] &&
        !providerNameDropdown.classList.contains('disabled')
      ) {
        providerDropdownSelectedText = providerDropdown.options[providerDropdown.selectedIndex].text;
      } else {
        providerDropdownSelectedText = '';
      }

      // if (saveUpdateData.providerId === '' || saveUpdateData.providerId === '%' || saveUpdateData.providerId === '[SELECT A PROVIDER]') {
      if (
        (providerDropdownSelectedText === '' || providerDropdownSelectedText === '[SELECT A PROVIDER]') &&
        !providerNameDropdown.classList.contains('disabled')
      ) {
        providerNameDropdown.classList.add('error');
      } else {
        providerNameDropdown.classList.remove('error');
      }
    }

    // Funding Source Other
    const fundingSourceInput = input.build({
      type: 'textarea',
      label: '*Funding Source Other',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.fundingSourceText,
      charLimit: charLimits.fundingSourceOther,
      forceCharLimit: true,
      callback: e => {
        if (!fundingSourceInput.classList.contains('disabled')) {
          saveUpdateData.fundingSourceText = e.target.value;

          if (saveUpdateData.fundingSource === '8') {
            if (saveUpdateData.fundingSourceText === '') {
              fundingSourceInput.classList.add('error');
            } else {
              fundingSourceInput.classList.remove('error');
            }
          }
        }

        togglePaidSupportDoneBtn();
      },
    });
    fundingSourceInput.classList.add('fundingSourceInput');
    fundingSourceInput.addEventListener('input', e => {
      if (!fundingSourceInput.classList.contains('disabled')) {
        saveUpdateData.fundingSourceText = e.target.value;

        if (saveUpdateData.fundingSource === '8') {
          if (saveUpdateData.fundingSourceText === '') {
            fundingSourceInput.classList.add('error');
          } else {
            fundingSourceInput.classList.remove('error');
          }
        }
      }

      togglePaidSupportDoneBtn();
    });
    if (saveUpdateData.fundingSource !== '8') {
      const fundingSourceInputField = fundingSourceInput.querySelector('.input-field__input');
      fundingSourceInputField.setAttribute('tabindex', '-1');
      fundingSourceInput.classList.add('disabled');
    }
    // Provider Name
    const providerNameDropdown = dropdown.build({
      dropdownId: 'providerNameDropdownPS',
      label: '*Provider Name',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.providerId = selectedOption.value;
        if (
          (saveUpdateData.providerId === '' || saveUpdateData.providerId === '%') &&
          !providerNameDropdown.classList.contains('disabled')
        ) {
          providerNameDropdown.classList.add('error');
        } else {
          providerNameDropdown.classList.remove('error');
        }

        togglePaidSupportDoneBtn();
      },
    });
    // Service Name
    const serviceNameDropdown = dropdown.build({
      dropdownId: 'serviceNameDropdownPS',
      label: '*Service Name',
      style: 'secondary',
      callback: async (e, selectedOption) => {
        saveUpdateData.serviceNameId = selectedOption.value;
        servicesDropdownSelectedText = selectedOption.text;
        // saveUpdateData.providerId = '';

        // store currently selected fundingSource (fundingSourceDropdownSelectedText) for use when populating the vendor dropdown
        // store type of fundingSource (hcbsSelected) for use when populating service and vendor dropdowns
        const fundingSourceDropdown = document.querySelector('#fundingSourceDropdownPS');
        fundingSourceDropdownSelectedText = fundingSourceDropdown.options[fundingSourceDropdown.selectedIndex].text;
        if (fundingSourceDropdownSelectedText.includes('HCBS') || fundingSourceDropdownSelectedText.includes('ICF')) {
          hcbsSelected = true;
        } else {
          hcbsSelected = false;
        }

        if (hcbsSelected) {
          await populateServiceVendorsDropdown(providerNameDropdown, saveUpdateData.providerId);
          if (saveUpdateProvider) {
            saveUpdateData.providerId = saveUpdateProvider;
          }
        }

        // Validation of Services DDL
        if (saveUpdateData.serviceNameId === '' || saveUpdateData.serviceNameId === '%') {
          serviceNameDropdown.classList.add('error');
        } else {
          serviceNameDropdown.classList.remove('error');
        }

        // validation of Service Name Other DDL
        if (saveUpdateData.serviceNameId === '47') {
          serviceNameOtherDropdown.classList.remove('disabled');
          serviceNameOtherDropdown.classList.add('error');
        } else {
          document.getElementById('serviceNameOtherDropdownPS').value = '%';
          saveUpdateData.serviceNameOther = '';
          serviceNameOtherDropdown.classList.add('disabled');
          serviceNameOtherDropdown.classList.remove('error');
        }

        validateProviderDropdown();

        togglePaidSupportDoneBtn();
      },
    }); // End -- Service Drop Down Handling

    // Service Name Other
    const serviceNameOtherDropdown = dropdown.build({
      dropdownId: 'serviceNameOtherDropdownPS',
      label: '*Service Name Other',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.serviceNameOther = selectedOption.value === '%' ? '' : selectedOption.value;
        if (saveUpdateData.serviceNameOther === '' || saveUpdateData.serviceNameOther === '%') {
          serviceNameOtherDropdown.classList.add('error');
        } else {
          serviceNameOtherDropdown.classList.remove('error');
        }
        togglePaidSupportDoneBtn();
      },
    });
    // Scope Of Service
    const scopeOfserviceInput = input.build({
      label: '*Scope of Service / What support looks like',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.scopeOfService,
      charLimit: charLimits.scopeOfService,
      forceCharLimit: true,
      callback: e => {
        saveUpdateData.scopeOfService = e.target.value;

        if (saveUpdateData.scopeOfService === '') {
          scopeOfserviceInput.classList.add('error');
        } else {
          scopeOfserviceInput.classList.remove('error');
        }

        togglePaidSupportDoneBtn();
      },
    });
    scopeOfserviceInput.classList.add('scopeOfService');
    scopeOfserviceInput.addEventListener('input', e => {
      saveUpdateData.scopeOfService = e.target.value;
      if (saveUpdateData.scopeOfService === '') {
        scopeOfserviceInput.classList.add('error');
      } else {
        scopeOfserviceInput.classList.remove('error');
      }

      togglePaidSupportDoneBtn();
    });
    // How Often/How Much Value
    const howOftenHowMuchValueInput = input.build({
      type: 'textarea',
      label: '*How Often/How Much',
      style: 'secondary',
      value: saveUpdateData.howOftenValue,
      classNames: 'autosize',
      charLimit: charLimits.howOftenHowMuch,
      forceCharLimit: true,
      callback: e => {
        saveUpdateData.howOftenValue = e.target.value;

        if (saveUpdateData.howOftenValue === '') {
          howOftenHowMuchValueInput.classList.add('error');
        } else {
          howOftenHowMuchValueInput.classList.remove('error');
        }

        togglePaidSupportDoneBtn();
      },
    });
    howOftenHowMuchValueInput.classList.add('howOftenHowMuchValueInput');
    howOftenHowMuchValueInput.addEventListener('input', e => {
      saveUpdateData.howOftenValue = e.target.value;

      if (saveUpdateData.howOftenValue === '') {
        howOftenHowMuchValueInput.classList.add('error');
      } else {
        howOftenHowMuchValueInput.classList.remove('error');
      }

      togglePaidSupportDoneBtn();
    });
    // How Often/How Much Freq
    const howOftenHowMuchFrequencyDropdown = dropdown.build({
      dropdownId: 'howOftenHowMuchDropdownPS',
      label: '*How Often/How Much Frequency',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.howOftenFrequency = selectedOption.value;

        const howOftenHowMuchTextInputField = howOftenHowMuchTextInput.querySelector('.input-field__input');

        if (saveUpdateData.howOftenFrequency === '' || saveUpdateData.howOftenFrequency === '%') {
          howOftenHowMuchFrequencyDropdown.classList.add('error');
        } else {
          howOftenHowMuchFrequencyDropdown.classList.remove('error');
        }

        if (saveUpdateData.howOftenFrequency === '5') {
          howOftenHowMuchTextInput.classList.remove('disabled');
          howOftenHowMuchTextInputField.removeAttribute('tabindex');

          if (saveUpdateData.howOftenText === '') {
            howOftenHowMuchTextInput.classList.add('error');
          } else {
            howOftenHowMuchTextInput.classList.remove('error');
          }
        } else {
          howOftenHowMuchTextInput.classList.remove('error');
          howOftenHowMuchTextInput.classList.add('disabled');
          howOftenHowMuchTextInputField.setAttribute('tabindex', '-1');
          saveUpdateData.howOftenText = '';
          const textInput = howOftenHowMuchTextInput.querySelector('.input-field__input');
          textInput.value = '';
        }

        togglePaidSupportDoneBtn();
      },
    });
    // How Often/How Much Other
    const howOftenHowMuchTextInput = input.build({
      type: 'textarea',
      label: '*How Often/How Much Other',
      style: 'secondary',
      value: saveUpdateData.howOftenText,
      classNames: 'autosize',
      charLimit: charLimits.howOftenOther,
      forceCharLimit: true,
      callback: e => {
        if (!howOftenHowMuchTextInput.classList.contains('disabled')) {
          saveUpdateData.howOftenText = e.target.value;

          if (saveUpdateData.howOftenFrequency === '5') {
            if (saveUpdateData.howOftenText === '') {
              howOftenHowMuchTextInput.classList.add('error');
            } else {
              howOftenHowMuchTextInput.classList.remove('error');
            }
          }

          togglePaidSupportDoneBtn();
        }
      },
    });
    howOftenHowMuchTextInput.classList.add('howOftenHowMuchTextInput');
    howOftenHowMuchTextInput.addEventListener('input', e => {
      if (!howOftenHowMuchTextInput.classList.contains('disabled')) {
        saveUpdateData.howOftenText = e.target.value;

        if (saveUpdateData.howOftenFrequency === '5') {
          if (saveUpdateData.howOftenText === '') {
            howOftenHowMuchTextInput.classList.add('error');
          } else {
            howOftenHowMuchTextInput.classList.remove('error');
          }
        }

        togglePaidSupportDoneBtn();
      }
    });
    if (saveUpdateData.howOftenFrequency !== '5') {
      const howOftenHowMuchTextInputField = howOftenHowMuchTextInput.querySelector('.input-field__input');
      howOftenHowMuchTextInput.classList.add('disabled');
      howOftenHowMuchTextInputField.setAttribute('tabindex', '-1');
    }
    // Begin Date
    const beginDateInput = input.build({
      label: 'Begin Date',
      type: 'date',
      style: 'secondary',
      value: saveUpdateData.beginDate,
      callback: e => {
        saveUpdateData.beginDate = e.target.value;

        // Run validation and determine if the input has an error
        const isValid = planValidation.validatePaidSupportsDates(saveUpdateData.beginDate, saveUpdateData.endDate);

        if (saveUpdateData.beginDate === '' || !isValid) {
          beginDateInput.classList.add('error');
        } else {
          beginDateInput.classList.remove('error');
        }

        togglePaidSupportDoneBtn();
      },
    });
    // End Date
    const endDateInput = input.build({
      label: 'End Date',
      type: 'date',
      style: 'secondary',
      value: saveUpdateData.endDate,
      callback: e => {
        saveUpdateData.endDate = e.target.value;

        // Run validation and determine if the input has an error
        const isValid = planValidation.validatePaidSupportsDates(saveUpdateData.beginDate, saveUpdateData.endDate);

        // Add or remove error class based on validation result
        if (saveUpdateData.endDate === '' || !isValid) {
          endDateInput.classList.add('error');
        } else {
          endDateInput.classList.remove('error');
        }

        togglePaidSupportDoneBtn();
      },
    });

    // Buttons
    const doneBtn = button.build({
      text: isCopy ? 'Save Copy' : isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');
        doneBtn.disabled = true;

        if (isNew) {
          if (fromAssessment) {
            saveUpdateData.rowOrder = 0;
            planID = plan.getCurrentPlanId();
          } else {
            const rowOrder = table.getRowCount('paidSupportsTable');
            saveUpdateData.rowOrder = rowOrder + 1;
          }
          await insertPaidSupport(saveUpdateData, fromAssessment);
        } else {
          await updatePaidSupport(saveUpdateData);
        }

        const vendorIds = getSelectedVendorIds();

        doneBtn.classList.remove('disabled');
        doneBtn.disabled = false;
        POPUP.hide(paidSupportPopup);

        fundingSourceDropdownSelectedText = undefined;
        servicesDropdownSelectedText = undefined;
        servicesOtherDropdownSelectedText = undefined;
        providerDropdownSelectedText = undefined;

        hcbsSelected = undefined;
        saveUpdateProvider = '';

        let ISPValidation = await planValidation.ISPValidation(planID);
        planValidation.checkExperiencesAfterAddingNewPaidSupport(ISPValidation);
        planValidation.updatedIspOutcomesSetAlerts(ISPValidation);

        let serviceAlertDiv = document.getElementById('servicesAlert');

        if (ISPValidation.paidSupportsValidDates === false) {
          serviceAlertDiv.style.display = 'flex';
        } else {
          serviceAlertDiv.style.display = 'none';
        }

        let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
        planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation);
        planValidation.updatedAssessmenteValidation(assessmentPlanValidation);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(paidSupportPopup);

        fundingSourceDropdownSelectedText = undefined;
        servicesDropdownSelectedText = undefined;
        servicesOtherDropdownSelectedText = undefined;
        providerDropdownSelectedText = undefined;

        hcbsSelected = undefined;
        saveUpdateProvider = '';
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: async () => {
        const message = 'Do you want to delete this Paid Support?';
        ISP.showDeleteWarning(paidSupportPopup, message, async () => {
          await deletePaidSupport(saveUpdateData.paidSupportsId);

          let ISPValidation = await planValidation.ISPValidation(planID);
          planValidation.checkExperiencesAfterAddingNewPaidSupport(ISPValidation);
          planValidation.updatedIspOutcomesSetAlerts(ISPValidation);

          let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
          planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation);
          planValidation.updatedAssessmenteValidation(assessmentPlanValidation);
        });

        fundingSourceDropdownSelectedText = undefined;
        servicesDropdownSelectedText = undefined;
        servicesOtherDropdownSelectedText = undefined;
        providerDropdownSelectedText = undefined;

        hcbsSelected = undefined;
        saveUpdateProvider = '';
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (saveUpdateData.assessmentAreaId === '' || saveUpdateData.assessmentAreaId === '%') {
      assessmentAreaDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (
      (saveUpdateData.providerId === '' || saveUpdateData.providerId === '%') &&
      !providerNameDropdown.classList.contains('disabled')
    ) {
      providerNameDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.serviceNameId === '' || saveUpdateData.serviceNameId === '%') {
      serviceNameDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.serviceNameId !== '47') {
      serviceNameOtherDropdown.classList.add('disabled');
    } else if (saveUpdateData.serviceNameOther === '' || saveUpdateData.serviceNameOther === '%') {
      serviceNameOtherDropdown.classList.add('error');
    }
    if (saveUpdateData.scopeOfService === '') {
      scopeOfserviceInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.howOftenValue === '') {
      howOftenHowMuchValueInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.howOftenFrequency === '' || saveUpdateData.howOftenFrequency === '%') {
      howOftenHowMuchFrequencyDropdown.classList.add('error');
    }
    if (saveUpdateData.howOftenFrequency === '5') {
      if (saveUpdateData.howOftenText === '') {
        howOftenHowMuchTextInput.classList.add('error');
        hasInitialErros = true;
      }
    }
    if (saveUpdateData.beginDate === '') {
      beginDateInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.endDate === '') {
      endDateInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.fundingSource === '' || saveUpdateData.fundingSource === '%') {
      fundingSourceDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.fundingSource === '8') {
      fundingSourceInput.classList.remove('disabled');
      if (saveUpdateData.fundingSourceText === '') {
        fundingSourceInput.classList.add('error');
        hasInitialErros = true;
      }
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
      doneBtn.disabled = true;
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      providerNameDropdown.classList.add('disabled');
      serviceNameDropdown.classList.add('disabled');
      serviceNameOtherDropdown.classList.add('disabled');
      scopeOfserviceInput.classList.add('disabled');
      howOftenHowMuchValueInput.classList.add('disabled');
      howOftenHowMuchFrequencyDropdown.classList.add('disabled');
      howOftenHowMuchTextInput.classList.add('disabled');
      beginDateInput.classList.add('disabled');
      endDateInput.classList.add('disabled');
      fundingSourceDropdown.classList.add('disabled');
      fundingSourceInput.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    } else {
      if (saveUpdateData.fundingSource === '8') {
        serviceNameDropdown.classList.add('disabled');
      }
    }

    // popup assemble!!
    const left = document.createElement('div');
    left.classList.add('left');
    left.appendChild(assessmentAreaDropdown);
    left.appendChild(fundingSourceDropdown);
    left.appendChild(fundingSourceInput);
    left.appendChild(serviceNameDropdown);
    left.appendChild(serviceNameOtherDropdown);
    left.appendChild(providerNameDropdown);
    const right = document.createElement('div');
    right.classList.add('right');
    right.appendChild(scopeOfserviceInput);
    right.appendChild(howOftenHowMuchValueInput);
    right.appendChild(howOftenHowMuchFrequencyDropdown);
    right.appendChild(howOftenHowMuchTextInput);
    right.appendChild(beginDateInput);
    right.appendChild(endDateInput);

    paidSupportPopup.appendChild(left);
    paidSupportPopup.appendChild(right);
    paidSupportPopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, saveUpdateData.assessmentAreaId);
    populateOtherServiceTypesDropdown(serviceNameOtherDropdown, saveUpdateData.serviceNameOther);
    populateHowOftenHowMuchFrequencyDropdown(howOftenHowMuchFrequencyDropdown, saveUpdateData.howOftenFrequency);
    populateFundingSourceDropdown(fundingSourceDropdown, saveUpdateData.fundingSource);

    if (isNew && $.session.applicationName === 'Advisor') {
      populateServiceNameDropdown(serviceNameDropdown, '24', '4');

      fundingSourceDropdown.classList.remove('error');
      serviceNameDropdown.classList.remove('error');
    } else {
      populateServiceNameDropdown(serviceNameDropdown, saveUpdateData.serviceNameId, saveUpdateData.fundingSource);
    }

    populateServiceVendorsDropdown(providerNameDropdown, saveUpdateData.providerId);
    if (saveUpdateProvider) {
      saveUpdateData.providerId = saveUpdateProvider;
    }

    // if fundingSourceDropdown is set to State Plan Services, then disable providerNameDropdown
    if (saveUpdateData.fundingSource === '5') {
      providerNameDropdown.querySelector('select').selectedIndex = -1;
      providerNameDropdown.classList.remove('error');
      providerNameDropdown.classList.add('disabled');
    }

    if (saveUpdateData && saveUpdateData.providerId === '') {
      fundingSourceDropdownSelectedText = '';
      servicesDropdownSelectedText = '';
      providerDropdownSelectedText = '';
    }

    POPUP.show(paidSupportPopup);
    DOM.autosizeTextarea();
  }
  function addPaidSupportRow() {
    showAddPaidSupportPopup({ popupData: {}, isNew: true, charLimits });
  }
  function getPaidSupportsMarkup() {
    const paidSupportsDiv = document.createElement('div');
    paidSupportsDiv.classList.add('ispPaidSupports');
    paidSupportsDiv.classList.add('ispServicesSection');

    paidSupportsTable = table.build({
      tableId: 'paidSupportsTable',
      headline: 'Paid Supports',
      columnHeadings: [
        'Assessment Area',
        'Funding Source',
        'Service Name',
        'Provider Name',
        'Scope of Service/ What support looks like',
        'How Often / How Much',
        'Begin Date',
        'End Date',
      ],
      sortable: isSortable,
      allowCopy: isReadOnly === true ? false : true,
      onSortCallback: async sortData => {
        const supportId = sortData.row.id.replace('ps', '');
        sortData.newIndex = sortData.newIndex + 1;
        sortData.oldIndex = sortData.oldIndex + 1;
        await servicesSupportsAjax.updatePaidSupportsRowOrder({
          token: $.session.Token,
          assessmentId: parseInt(planID),
          supportId: parseInt(supportId),
          newPos: parseInt(sortData.newIndex),
          oldPos: parseInt(sortData.oldIndex),
        });
      },
    });

    let number = 0;
    // Set the data type for each header, for sorting purposes
    const headers = paidSupportsTable.querySelectorAll('.header div');
    if (headers.length > 9) number = 1;

    headers[0 + number].setAttribute('data-type', 'string'); // Assessment Area
    headers[1 + number].setAttribute('data-type', 'string'); // Funding Source
    headers[2 + number].setAttribute('data-type', 'string'); // Service Name
    headers[3 + number].setAttribute('data-type', 'string'); // Provider Name
    headers[4 + number].setAttribute('data-type', 'string'); // Scope of Service/ What support looks like
    headers[5 + number].setAttribute('data-type', 'string'); // How Often / How Much
    headers[6 + number].setAttribute('data-type', 'date'); // Begin Date
    headers[7 + number].setAttribute('data-type', 'date'); // End Date

    table.sortTableByHeader(paidSupportsTable);

    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');

    const addRowBtn = button.build({
      text: 'Add Paid Support',
      style: 'secondary',
      type: 'contained',
      callback: () => addPaidSupportRow(),
    });
    addRowBtn.classList.add('addRowBtnPaidSupports');

    // multi edit section
    mutliEditBtnWrap = buildMultiRowEdit();

    if (isReadOnly) {
      addRowBtn.classList.add('disabled');
      multiEditBtn.classList.add('disabled');
    }

    if (servicesSupportsData && servicesSupportsData.paidSupport) {
      const tableData = servicesSupportsData.paidSupport
        .sort((a, b) => {
          return parseInt(a.rowOrder) < parseInt(b.rowOrder) ? -1 : parseInt(a.rowOrder) > parseInt(b.rowOrder) ? 1 : 0;
        })
        .map(ps => {
          const { tableValues, psData } = mapPaidSupportDataForTable(ps);
          const rowId = `ps${psData.paidSupportsId}`;

          const isValid = planValidation.validatePaidSupportsDates(psData.beginDate, psData.endDate);

          return {
            id: rowId,
            values: tableValues,
            hasError: !isValid,
            attributes: [{ key: 'sectionId', value: psData.assessmentAreaId }],
            onClick: event => {
              if (!enableMultiEdit) {
                showAddPaidSupportPopup({
                  popupData: psData,
                  isNew: false,
                  fromAssessment: false,
                  isCopy: false,
                  charLimits,
                });
                return;
              }

              const isSelected = event.target.classList.contains('selected');

              if (isSelected) {
                event.target.classList.remove('selected');
                selectedPaidSupportIds = selectedPaidSupportIds.filter(sr => sr !== psData.paidSupportsId);
                selectedPaidSupportRows = selectedPaidSupportRows.filter(
                  sr => sr.paidSupportsId !== psData.paidSupportsId,
                );
              } else {
                event.target.classList.add('selected');
                selectedPaidSupportIds.push(psData.paidSupportsId);
                selectedPaidSupportRows.push({ ...psData, rowNode: event.target });
              }

              if (selectedPaidSupportIds.length === 0) {
                multiEditUpdateBtn.classList.add('disabled');
              } else {
                multiEditUpdateBtn.classList.remove('disabled');
              }
            },
            onCopyClick: () => {
              if (isReadOnly || enableMultiEdit) return;

              const copiedData = { ...psData, paidSupportsId: '' };
              showAddPaidSupportPopup({
                popupData: copiedData,
                isNew: true,
                fromAssessment: false,
                isCopy: true,
                charLimits,
              });
            },
          };
        });

      table.populate(paidSupportsTable, tableData, isSortable, isReadOnly);
    }

    btnWrap.appendChild(addRowBtn);
    btnWrap.appendChild(mutliEditBtnWrap);

    paidSupportsDiv.appendChild(paidSupportsTable);
    paidSupportsDiv.appendChild(btnWrap);

    return paidSupportsDiv;
  }

  // ADDITIONAL SUPPORTS
  //------------------------------------------------------
  async function insertAdditionalSupport(saveData, fromAssessment) {
    const { whoSupports, whatSupportLooksLike, howOftenText, ...rest } = saveData;

    if (!planID) {
      planID = plan.getCurrentPlanId();
    }

    const additionalSupportId = await servicesSupportsAjax.insertAdditionalSupports({
      token: $.session.Token,
      anywAssessmentId: planID,
      whoSupports: whoSupports,
      whatSupportLooksLike: whatSupportLooksLike,
      howOftenText: howOftenText,
      ...rest,
    });

    if (fromAssessment) return;

    const parsedId = JSON.parse(additionalSupportId.replace('[', '').replace(']', ''));
    const { tableValues, asData } = mapAdditionalSupportDataForTable({
      additionalSupportsId: parsedId.additionalSupportsId,
      ...saveData,
    });
    const rowId = `as${asData.additionalSupportsId}`;

    table.addRows(
      additionalSupportsTable,
      [
        {
          id: rowId,
          values: tableValues,
          onClick: () => {
            if (isReadOnly == true) return;
            else showAddAdditionalSupportPopup(asData, false, false, charLimits);
          },
          endIcon: isReadOnly == true ? '' : `${icons['copy']}`,
          endIconCallback: e => {
            if (isReadOnly == true) return;
            else showAddAdditionalSupportPopup(asData, true, false, charLimits);
          },
        },
      ],
      isSortable,
    );
  }
  async function updateAdditionalSupport(updateData) {
    const { whoSupports, whatSupportLooksLike, howOftenText, ...rest } = updateData;

    await servicesSupportsAjax.updateAdditionalSupports({
      token: $.session.Token,
      anywAssessmentId: planID,
      whoSupports: whoSupports,
      whatSupportLooksLike: whatSupportLooksLike,
      howOftenText: howOftenText,
      ...rest,
    });

    const { tableValues, asData } = mapAdditionalSupportDataForTable({
      ...updateData,
    });
    const rowId = `as${asData.additionalSupportsId}`;

    table.updateRows(
      additionalSupportsTable,
      [
        {
          id: rowId,
          values: tableValues,
          onClick: () => {
            if (isReadOnly == true) return;
            else showAddAdditionalSupportPopup(asData, false, false, charLimits);
          },
          endIcon: isReadOnly == true ? '' : `${icons['copy']}`,
          endIconCallback: e => {
            if (isReadOnly == true) return;
            else showAddAdditionalSupportPopup(asData, true, false, charLimits);
          },
        },
      ],
      isSortable,
    );
  }
  async function deleteAdditionalSupport(additionalSupportData) {
    await servicesSupportsAjax.deleteAdditionalSupports({
      token: $.session.Token,
      additionalSupportsId: additionalSupportData.additionalSupportsId,
    });

    table.deleteRow(`as${additionalSupportData.additionalSupportsId}`);

    let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
    planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation);
    planValidation.updatedAssessmenteValidation(assessmentPlanValidation);
  }
  //-- Markup ---------
  function toggleAdditionalSupportDoneBtn() {
    const inputsWithErrors = document.querySelector('.additionalSupportPopup .error');
    const doneBtn = document.querySelector('.additionalSupportPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showAddAdditionalSupportPopup(popupData, isNew, fromAssessment, charLimits) {
    if (!dropdownData) {
      dropdownData = planData.getDropdownData();
    }

    let hasInitialErros;

    const saveUpdateData = {
      assessmentAreaId: !popupData.assessmentAreaId ? '' : popupData.assessmentAreaId,
      whoSupports: !popupData.whoSupports ? '' : popupData.whoSupports,
      whatSupportLooksLike: !popupData.whatSupportLooksLike ? '' : popupData.whatSupportLooksLike,
      howOftenValue: !popupData.howOftenValue ? '' : popupData.howOftenValue,
      howOftenFrequency: !popupData.howOftenFrequency ? '' : popupData.howOftenFrequency,
      howOftenText: !popupData.howOftenText ? '' : popupData.howOftenText,
      rowOrder: !popupData.rowOrder ? '' : popupData.rowOrder,
    };

    if (!isNew) saveUpdateData.additionalSupportsId = popupData.additionalSupportsId;

    const additionalSupportPopup = POPUP.build({
      header: isNew ? 'Add Additional Support' : 'Edit Additional Support',
      classNames: 'additionalSupportPopup',
      hideX: true,
    });

    // Assessment Area
    const assessmentAreaDropdown = dropdown.build({
      dropdownId: 'assessmentAreaDropdownAS',
      label: '*Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.assessmentAreaId = selectedOption.value;
        if (saveUpdateData.assessmentAreaId === '' || saveUpdateData.assessmentAreaId === '%') {
          assessmentAreaDropdown.classList.add('error');
        } else {
          assessmentAreaDropdown.classList.remove('error');
        }

        toggleAdditionalSupportDoneBtn();
      },
    });
    if (fromAssessment) {
      assessmentAreaDropdown.classList.add('disabled');
    }
    // Who Supports
    const whoSupportsDropdown = dropdown.build({
      label: '*Who Supports',
      dropdownId: 'whoSupportsDropdown',
      readonly: isReadOnly,
      callback: (e, selectedOption) => {
        saveUpdateData.whoSupports = selectedOption.value;

        if (saveUpdateData.whoSupports === '') {
          whoSupportsDropdown.classList.add('error');
        } else {
          whoSupportsDropdown.classList.remove('error');
        }

        toggleAdditionalSupportDoneBtn();
      },
    });

    // What Support Looks LIke
    const whatSupportLooksLikeInput = input.build({
      label: '*What Support Looks Like',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.whatSupportLooksLike,
      charLimit: charLimits.whatSupportLooksLike,
      forceCharLimit: true,
      callback: e => {
        saveUpdateData.whatSupportLooksLike = e.target.value;
        if (saveUpdateData.whatSupportLooksLike === '') {
          whatSupportLooksLikeInput.classList.add('error');
        } else {
          whatSupportLooksLikeInput.classList.remove('error');
        }

        toggleAdditionalSupportDoneBtn();
      },
    });
    whatSupportLooksLikeInput.classList.add('whatSupportLooksLike');
    whatSupportLooksLikeInput.addEventListener('input', e => {
      saveUpdateData.whatSupportLooksLike = e.target.value;
      if (saveUpdateData.whatSupportLooksLike === '') {
        whatSupportLooksLikeInput.classList.add('error');
      } else {
        whatSupportLooksLikeInput.classList.remove('error');
      }

      toggleAdditionalSupportDoneBtn();
    });
    // When/How Often Value
    const whenHowOftenValueInput = input.build({
      type: 'textarea',
      label: '*When/How Often',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.howOftenValue,
      charLimit: charLimits.whenHowOften,
      forceCharLimit: true,
      callback: e => {
        saveUpdateData.howOftenValue = e.target.value;

        if (saveUpdateData.howOftenValue === '') {
          whenHowOftenValueInput.classList.add('error');
        } else {
          whenHowOftenValueInput.classList.remove('error');
        }

        toggleAdditionalSupportDoneBtn();
      },
    });
    whenHowOftenValueInput.classList.add('whenHowOftenValueInput');
    whenHowOftenValueInput.addEventListener('input', e => {
      saveUpdateData.howOftenValue = e.target.value;

      if (saveUpdateData.howOftenValue === '') {
        whenHowOftenValueInput.classList.add('error');
      } else {
        whenHowOftenValueInput.classList.remove('error');
      }

      toggleAdditionalSupportDoneBtn();
    });
    // When/How Often Freq
    const whenHowOftenFrequencyDropdown = dropdown.build({
      dropdownId: 'whenHowOftenDropdownPS',
      label: '*When/How Often Frequency',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.howOftenFrequency = selectedOption.value;

        const whenHowOftenTextInputField = whenHowOftenTextInput.querySelector('.input-field__input');

        if (saveUpdateData.howOftenFrequency === '' || saveUpdateData.howOftenFrequency === '%') {
          whenHowOftenFrequencyDropdown.classList.add('error');
        } else {
          whenHowOftenFrequencyDropdown.classList.remove('error');
        }

        if (saveUpdateData.howOftenFrequency === '4') {
          whenHowOftenTextInput.classList.remove('disabled');
          whenHowOftenTextInputField.removeAttribute('tabindex');

          if (saveUpdateData.howOftenText === '') {
            whenHowOftenTextInput.classList.add('error');
          } else {
            whenHowOftenTextInput.classList.remove('error');
          }
        } else {
          whenHowOftenTextInput.classList.remove('error');
          whenHowOftenTextInput.classList.add('disabled');
          whenHowOftenTextInputField.setAttribute('tabindex', '-1');
          saveUpdateData.howOftenText = '';
          const textInput = whenHowOftenTextInput.querySelector('.input-field__input');
          textInput.value = '';
        }

        toggleAdditionalSupportDoneBtn();
      },
    });
    // When/How Often Other
    const whenHowOftenTextInput = input.build({
      type: 'textarea',
      label: '*When/How Often Other',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.howOftenText,
      charLimit: charLimits.whenHowOftenOther,
      forceCharLimit: true,
      callback: e => {
        if (!whenHowOftenTextInput.classList.contains('disabled')) {
          saveUpdateData.howOftenText = e.target.value;

          if (saveUpdateData.howOftenFrequency === '4') {
            if (saveUpdateData.howOftenText === '') {
              whenHowOftenTextInput.classList.add('error');
            } else {
              whenHowOftenTextInput.classList.remove('error');
            }
          }

          toggleAdditionalSupportDoneBtn();
        }
      },
    });
    whenHowOftenTextInput.classList.add('whenHowOftenTextInput');
    whenHowOftenTextInput.addEventListener('input', e => {
      if (!whenHowOftenTextInput.classList.contains('disabled')) {
        saveUpdateData.howOftenText = e.target.value;

        if (saveUpdateData.howOftenFrequency === '4') {
          if (saveUpdateData.howOftenText === '') {
            whenHowOftenTextInput.classList.add('error');
          } else {
            whenHowOftenTextInput.classList.remove('error');
          }
        }

        toggleAdditionalSupportDoneBtn();
      }
    });
    if (saveUpdateData.howOftenFrequency !== '4') {
      const whenHowOftenTextInputField = whenHowOftenTextInput.querySelector('.input-field__input');
      whenHowOftenTextInput.classList.add('disabled');
      whenHowOftenTextInputField.setAttribute('tabindex', '-1');
    }
    // Buttons
    const doneBtn = button.build({
      text: isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');
        if (isNew) {
          if (fromAssessment) {
            planID = plan.getCurrentPlanId();
            saveUpdateData.rowOrder = 0;
          } else {
            const rowOrder = table.getRowCount('additionalSupportsTable');
            saveUpdateData.rowOrder = rowOrder + 1;
          }
          insertAdditionalSupport(saveUpdateData, fromAssessment);

          let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
          planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation, saveUpdateData.assessmentAreaId);
          planValidation.updatedAssessmenteValidation(assessmentPlanValidation);
        } else {
          updateAdditionalSupport(saveUpdateData);
        }

        let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
        planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation);
        planValidation.updatedAssessmenteValidation(assessmentPlanValidation);

        doneBtn.classList.remove('disabled');
        POPUP.hide(additionalSupportPopup);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(additionalSupportPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: () => {
        const message = 'Do you want to delete this Additional Support?';
        ISP.showDeleteWarning(additionalSupportPopup, message, () => {
          deleteAdditionalSupport(saveUpdateData);
        });
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (saveUpdateData.assessmentAreaId === '' || saveUpdateData.assessmentAreaId === '%') {
      assessmentAreaDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.whoSupports === '') {
      whoSupportsDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.whatSupportLooksLike === '') {
      whatSupportLooksLikeInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.howOftenValue === '') {
      whenHowOftenValueInput.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.howOftenFrequency === '' || saveUpdateData.howOftenFrequency === '%') {
      whenHowOftenFrequencyDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.howOftenFrequency === '4') {
      if (saveUpdateData.howOftenText === '') {
        whenHowOftenTextInput.classList.add('error');
        hasInitialErros = true;
      }
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      whoSupportsDropdown.classList.add('disabled');
      whatSupportLooksLikeInput.classList.add('disabled');
      whenHowOftenValueInput.classList.add('disabled');
      whenHowOftenFrequencyDropdown.classList.add('disabled');
      whenHowOftenTextInput.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    additionalSupportPopup.appendChild(assessmentAreaDropdown);
    additionalSupportPopup.appendChild(whoSupportsDropdown);
    additionalSupportPopup.appendChild(whatSupportLooksLikeInput);
    additionalSupportPopup.appendChild(whenHowOftenValueInput);
    additionalSupportPopup.appendChild(whenHowOftenFrequencyDropdown);
    additionalSupportPopup.appendChild(whenHowOftenTextInput);
    additionalSupportPopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, saveUpdateData.assessmentAreaId);
    populateWhenHowOftenFrequencyDropdown(whenHowOftenFrequencyDropdown, saveUpdateData.howOftenFrequency);
    planData.populateRelationshipDropdown(whoSupportsDropdown, saveUpdateData.whoSupports);

    POPUP.show(additionalSupportPopup);
    DOM.autosizeTextarea();
  }
  function addAdditionalSupportRow() {
    showAddAdditionalSupportPopup({}, true, false, charLimits);
  }
  function getAdditionalSupportsMarkup() {
    const additionalSupportsDiv = document.createElement('div');
    additionalSupportsDiv.classList.add('ispAdditionalSupports');
    additionalSupportsDiv.classList.add('ispServicesSection');

    additionalSupportsTable = table.build({
      tableId: 'additionalSupportsTable',
      headline: `Additional Supports: <span>Family, friends, community resources, technology, etc.</span>`,
      columnHeadings: ['Assessment Area', 'Who Supports', 'What Support Looks Like', 'When/How Often'],
      endIcon: isReadOnly ? false : true,
      sortable: isSortable,
      onSortCallback: async sortData => {
        const supportId = sortData.row.id.replace('as', '');
        sortData.newIndex = sortData.newIndex + 1;
        sortData.oldIndex = sortData.oldIndex + 1;
        await servicesSupportsAjax.updateAdditionalSupportsRowOrder({
          token: $.session.Token,
          assessmentId: parseInt(planID),
          addSupportId: parseInt(supportId),
          newPos: parseInt(sortData.newIndex),
          oldPos: parseInt(sortData.oldIndex),
        });
      },
    });

    let number = 0;
    // Set the data type for each header, for sorting purposes
    const headers = additionalSupportsTable.querySelectorAll('.header div');
    if (headers.length > 5) number = 1;

    headers[0 + number].setAttribute('data-type', 'string'); // Assessment Area
    headers[1 + number].setAttribute('data-type', 'string'); // Who Supports
    headers[2 + number].setAttribute('data-type', 'string'); // What Support Looks Like
    headers[3 + number].setAttribute('data-type', 'string'); // When/How Often

    // Call function to allow table sorting by clicking on a header.
    table.sortTableByHeader(additionalSupportsTable);

    const addRowBtn = button.build({
      text: 'Add Additional Support',
      style: 'secondary',
      type: 'contained',
      callback: () => addAdditionalSupportRow(),
    });
    if (isReadOnly) {
      addRowBtn.classList.add('disabled');
    }

    if (servicesSupportsData && servicesSupportsData.additionalSupport) {
      const tableData = servicesSupportsData.additionalSupport
        .sort((a, b) => {
          return parseInt(a.rowOrder) < parseInt(b.rowOrder) ? -1 : parseInt(a.rowOrder) > parseInt(b.rowOrder) ? 1 : 0;
        })
        .map(as => {
          const { tableValues, asData } = mapAdditionalSupportDataForTable(as);
          const rowId = `as${asData.additionalSupportsId}`;

          return {
            id: rowId,
            values: tableValues,
            attributes: [{ key: 'sectionId', value: asData.assessmentAreaId }],
            onClick: () => {
              if (isReadOnly == true) return;
              else showAddAdditionalSupportPopup(asData, false, false, charLimits);
            },
            endIcon: isReadOnly == true ? '' : `${icons['copy']}`,
            endIconCallback: e => {
              if (isReadOnly == true) return;
              else showAddAdditionalSupportPopup(asData, true, false, charLimits);
            },
          };
        });

      table.populate(additionalSupportsTable, tableData, isSortable);
    }

    additionalSupportsDiv.appendChild(additionalSupportsTable);
    additionalSupportsDiv.appendChild(addRowBtn);

    return additionalSupportsDiv;
  }

  // PROFESSIONAL REFERRALS
  //------------------------------------------------------
  async function insertProfessionalReferral(saveData, fromAssessment) {
    const { whoSupports, reasonForReferral, ...rest } = saveData;

    if (!planID) {
      planID = plan.getCurrentPlanId();
    }

    const profRefId = await servicesSupportsAjax.insertProfessionalReferral({
      token: $.session.Token,
      anywAssessmentId: planID,
      whoSupports: whoSupports,
      reasonForReferral: reasonForReferral,
      ...rest,
    });

    if (fromAssessment) return;

    const parsedId = JSON.parse(profRefId.replace('[', '').replace(']', ''));
    const { tableValues, prData } = mapProfessionalReferralDataForTable({
      professionalReferralId: parsedId.professionalReferralId,
      ...saveData,
    });
    const rowId = `pr${prData.professionalReferralId}`;

    table.addRows(
      professionalReferralsTable,
      [
        {
          id: rowId,
          values: tableValues,
          onClick: () => {
            showAddProfessionalReferralPopup(prData, false, false, charLimits);
          },
        },
      ],
      isSortable,
    );
  }
  async function updateProfessionalReferral(updateData) {
    const { whoSupports, reasonForReferral, ...rest } = updateData;

    await servicesSupportsAjax.updateProfessionalReferral({
      token: $.session.Token,
      anywAssessmentId: planID,
      whoSupports: whoSupports,
      reasonForReferral: reasonForReferral,
      ...rest,
    });

    const { tableValues, prData } = mapProfessionalReferralDataForTable({
      ...updateData,
    });
    const rowId = `pr${prData.professionalReferralId}`;

    table.updateRows(
      professionalReferralsTable,
      [
        {
          id: rowId,
          values: tableValues,
          onClick: () => {
            showAddProfessionalReferralPopup(prData, false, false, charLimits);
          },
        },
      ],
      isSortable,
    );
  }
  async function deleteProfessionalReferral(saveUpdateData) {
    await servicesSupportsAjax.deleteProfessionalReferral({
      token: $.session.Token,
      professionalReferralId: saveUpdateData.professionalReferralId,
    });

    table.deleteRow(`pr${saveUpdateData.professionalReferralId}`);

    let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
    planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation);
    planValidation.updatedAssessmenteValidation(assessmentPlanValidation);
  }
  //-- Markup ---------
  function toggleProfessionalReferralDoneBtn() {
    const inputsWithErrors = document.querySelector('.professionalReferralPopup .error');
    const doneBtn = document.querySelector('.professionalReferralPopup .doneBtn');
    if (inputsWithErrors) {
      doneBtn.classList.add('disabled');
    } else {
      doneBtn.classList.remove('disabled');
    }
  }
  function showAddProfessionalReferralPopup(popupData, isNew, fromAssessment, charLimits) {
    if (!dropdownData) {
      dropdownData = planData.getDropdownData();
    }

    let hasInitialErros;

    const saveUpdateData = {
      assessmentAreaId: !popupData.assessmentAreaId ? '' : popupData.assessmentAreaId,
      newOrExisting: !popupData.newOrExisting ? '' : popupData.newOrExisting,
      whoSupports: !popupData.whoSupports ? '' : popupData.whoSupports,
      reasonForReferral: !popupData.reasonForReferral ? '' : popupData.reasonForReferral,
      rowOrder: !popupData.rowOrder ? '' : popupData.rowOrder,
    };

    if (!isNew) saveUpdateData.professionalReferralId = popupData.professionalReferralId;

    // Popup
    const professionalReferralPopup = POPUP.build({
      header: isNew ? 'Add Professional Referral' : 'Edit Professional Referral',
      classNames: 'professionalReferralPopup',
      hideX: true,
    });

    // Asessment Area
    const assessmentAreaDropdown = dropdown.build({
      dropdownId: 'assessmentAreaDropdownAS',
      label: '*Assessment Area',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.assessmentAreaId = selectedOption.value;
        if (saveUpdateData.assessmentAreaId === '' || saveUpdateData.assessmentAreaId === '%') {
          assessmentAreaDropdown.classList.add('error');
        } else {
          assessmentAreaDropdown.classList.remove('error');
        }

        toggleProfessionalReferralDoneBtn();
      },
    });
    if (fromAssessment) {
      assessmentAreaDropdown.classList.add('disabled');
    }
    // New Or Existing
    const newOrExistingDropdown = dropdown.build({
      dropdownId: 'newOrExistingDropdown',
      label: '*New or Existing',
      style: 'secondary',
      callback: (e, selectedOption) => {
        saveUpdateData.newOrExisting = selectedOption.value;
        if (saveUpdateData.newOrExisting === '' || saveUpdateData.newOrExisting === '%') {
          newOrExistingDropdown.classList.add('error');
        } else {
          newOrExistingDropdown.classList.remove('error');
        }
        toggleProfessionalReferralDoneBtn();
      },
    });
    // Who Supports
    const whoSupportsDropdown = dropdown.build({
      label: '*Who Supports',
      dropdownId: 'whoSupportsDropdown',
      readonly: isReadOnly,
      callback: (e, selectedOption) => {
        saveUpdateData.whoSupports = selectedOption.value;

        if (saveUpdateData.whoSupports === '') {
          whoSupportsDropdown.classList.add('error');
        } else {
          whoSupportsDropdown.classList.remove('error');
        }

        toggleProfessionalReferralDoneBtn();
      },
    });

    // Reason For Referral
    const reasonForReferralInput = input.build({
      label: '*Reason For Referral',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: saveUpdateData.reasonForReferral,
      charLimit: charLimits.reasonForReferral,
      forceCharLimit: true,
      callback: e => {
        saveUpdateData.reasonForReferral = e.target.value;
        if (saveUpdateData.reasonForReferral === '') {
          reasonForReferralInput.classList.add('error');
        } else {
          reasonForReferralInput.classList.remove('error');
        }

        toggleProfessionalReferralDoneBtn();
      },
    });
    reasonForReferralInput.classList.add('reasonForReferral');
    reasonForReferralInput.addEventListener('keyup', e => {
      saveUpdateData.reasonForReferral = e.target.value;
      if (saveUpdateData.reasonForReferral === '') {
        reasonForReferralInput.classList.add('error');
      } else {
        reasonForReferralInput.classList.remove('error');
      }

      toggleProfessionalReferralDoneBtn();
    });
    // Buttons
    const doneBtn = button.build({
      text: isNew ? 'Save' : 'Update',
      style: 'secondary',
      type: 'contained',
      classNames: 'doneBtn',
      callback: async () => {
        doneBtn.classList.add('disabled');

        if (isNew) {
          if (fromAssessment) {
            saveUpdateData.rowOrder = 0;
            planID = plan.getCurrentPlanId();
          } else {
            const rowOrder = table.getRowCount('professionalReferralsTable');
            saveUpdateData.rowOrder = rowOrder + 1;
          }

          insertProfessionalReferral(saveUpdateData, fromAssessment);
        } else {
          updateProfessionalReferral(saveUpdateData);
        }

        let assessmentPlanValidation = await planValidation.getAssessmentValidation(planID);
        planValidation.servicesAndSupportsBtnCheck(assessmentPlanValidation);
        planValidation.updatedAssessmenteValidation(assessmentPlanValidation);

        doneBtn.classList.remove('disabled');
        POPUP.hide(professionalReferralPopup);
      },
    });
    const cancelBtn = button.build({
      text: 'Cancel',
      style: 'secondary',
      type: 'outlined',
      callback: () => {
        POPUP.hide(professionalReferralPopup);
      },
    });
    const deleteBtn = button.build({
      text: 'Delete',
      style: 'danger',
      type: 'contained',
      callback: () => {
        const message = 'Do you want to delete this Professional Referral?';
        ISP.showDeleteWarning(professionalReferralPopup, message, () => {
          deleteProfessionalReferral(saveUpdateData);
        });
      },
    });
    const btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap');
    btnWrap.appendChild(doneBtn);
    if (!isNew) btnWrap.appendChild(deleteBtn);
    btnWrap.appendChild(cancelBtn);

    // init required fields
    if (saveUpdateData.assessmentAreaId === '' || saveUpdateData.assessmentAreaId === '%') {
      assessmentAreaDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.newOrExisting === '' || saveUpdateData.newOrExisting === '%') {
      newOrExistingDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.whoSupports === '') {
      whoSupportsDropdown.classList.add('error');
      hasInitialErros = true;
    }
    if (saveUpdateData.reasonForReferral === '') {
      reasonForReferralInput.classList.add('error');
      hasInitialErros = true;
    }
    if (hasInitialErros) {
      doneBtn.classList.add('disabled');
    }
    // end required fields

    if (isReadOnly) {
      assessmentAreaDropdown.classList.add('disabled');
      newOrExistingDropdown.classList.add('disabled');
      whoSupportsDropdown.classList.add('disabled');
      reasonForReferralInput.classList.add('disabled');
      doneBtn.classList.add('disabled');
      deleteBtn.classList.add('disabled');
    }

    professionalReferralPopup.appendChild(assessmentAreaDropdown);
    professionalReferralPopup.appendChild(newOrExistingDropdown);
    professionalReferralPopup.appendChild(whoSupportsDropdown);
    professionalReferralPopup.appendChild(reasonForReferralInput);
    professionalReferralPopup.appendChild(btnWrap);

    populateAssessmentAreaDropdown(assessmentAreaDropdown, saveUpdateData.assessmentAreaId);
    populateNewOrExistingDropdown(newOrExistingDropdown, saveUpdateData.newOrExisting);
    planData.populateRelationshipDropdown(whoSupportsDropdown, saveUpdateData.whoSupports);

    POPUP.show(professionalReferralPopup);
    DOM.autosizeTextarea();
  }
  function addProfessionalReferralRow() {
    showAddProfessionalReferralPopup({}, true, false, charLimits);
  }
  function getProfessionalReferralsMarkup() {
    const professionalReferralsDiv = document.createElement('div');
    professionalReferralsDiv.classList.add('ispProfessionalReferrals');
    professionalReferralsDiv.classList.add('ispServicesSection');

    professionalReferralsTable = table.build({
      tableId: 'professionalReferralsTable',
      headline: `Professional Referrals: <span>Medical professionals, therapists, etc.</span>`,
      columnHeadings: [
        'Assessment Area',
        'New or Existing',
        'Who Supports',
        'Reason for Referral',
        // 'When/How Often',
      ],
      sortable: isSortable,
      onSortCallback: async sortData => {
        const supportId = sortData.row.id.replace('pr', '');
        sortData.newIndex = sortData.newIndex + 1;
        sortData.oldIndex = sortData.oldIndex + 1;
        await servicesSupportsAjax.updateServiceReferralRowOrder({
          token: $.session.Token,
          assessmentId: parseInt(planID),
          referralId: parseInt(supportId),
          newPos: parseInt(sortData.newIndex),
          oldPos: parseInt(sortData.oldIndex),
        });
      },
    });

    // Set the data type for each header, for sorting purposes
    let number = 0;
    const headers = professionalReferralsTable.querySelectorAll('.header div');
    if (headers.length > 4) number = 1;
    headers[0 + number].setAttribute('data-type', 'string'); // Assessment Area
    headers[1 + number].setAttribute('data-type', 'string'); // New or Existing
    headers[2 + number].setAttribute('data-type', 'string'); // Who Supports
    headers[3 + number].setAttribute('data-type', 'string'); // Reason for Referral

    // Call function to allow table sorting by clicking on a header.
    table.sortTableByHeader(professionalReferralsTable);

    const addRowBtn = button.build({
      text: 'Add Referral',
      style: 'secondary',
      type: 'contained',
      callback: () => addProfessionalReferralRow(),
    });
    if (isReadOnly) {
      addRowBtn.classList.add('disabled');
    }

    if (servicesSupportsData && servicesSupportsData.professionalReferral) {
      const tableData = servicesSupportsData.professionalReferral
        .sort((a, b) => {
          return parseInt(a.rowOrder) < parseInt(b.rowOrder) ? -1 : parseInt(a.rowOrder) > parseInt(b.rowOrder) ? 1 : 0;
        })
        .map(pr => {
          const { tableValues, prData } = mapProfessionalReferralDataForTable(pr);
          const rowId = `pr${prData.professionalReferralId}`;

          return {
            id: rowId,
            values: tableValues,
            attributes: [{ key: 'sectionId', value: prData.assessmentAreaId }],
            onClick: () => {
              showAddProfessionalReferralPopup(prData, false, false, charLimits);
            },
          };
        });

      table.populate(professionalReferralsTable, tableData, isSortable);
    }

    professionalReferralsDiv.appendChild(professionalReferralsTable);
    professionalReferralsDiv.appendChild(addRowBtn);

    return professionalReferralsDiv;
  }

  // SS MODIFICATIONS
  //------------------------------------------------------
  async function insertSSModification(saveData) {
    modificationsId = await servicesSupportsAjax.insertSSModifications({
      token: $.session.Token,
      anywAssessmentId: planID,
      ...saveData,
    });
  }
  async function updateSSModification(updateData) {
    await servicesSupportsAjax.updateSSModifications({
      token: $.session.Token,
      anywAssessmentId: planID,
      modificationsId,
      ...updateData,
    });
  }
  async function deleteSSModification(ssId) {
    await servicesSupportsAjax.deleteProfessionalReferral({
      token: $.session.Token,
      modificationsId: ssId,
    });
  }
  //-- Markup ---------
  function getSSModificationsMarkup() {
    const { supportModification } = servicesSupportsData;

    const saveUpdateData = {
      medicalRate: supportModification[0] ? (supportModification[0].medicalRate === 't' ? 't' : 'f') : 'f',
      behaviorRate: supportModification[0] ? (supportModification[0].behaviorRate === 't' ? 't' : 'f') : 'f',
      icfRate: supportModification[0] ? (supportModification[0].icfRate === 't' ? 't' : 'f') : 'f',
      complexRate: supportModification[0] ? (supportModification[0].complexRate === 't' ? 't' : 'f') : 'f',
      developmentalRate: supportModification[0] ? (supportModification[0].developmentalRate === 't' ? 't' : 'f') : 'f',
      childIntensiveRate: supportModification[0]
        ? supportModification[0].childIntensiveRate === 't'
          ? 't'
          : 'f'
        : 'f',
    };

    const modificationDiv = document.createElement('div');
    modificationDiv.classList.add('ispModification');
    modificationDiv.classList.add('ispServicesSection');

    const heading = document.createElement('h3');
    heading.classList.add('subSectionHeading');
    heading.innerHTML = 'Modifications';
    modificationDiv.appendChild(heading);

    const tagline = document.createElement('p');
    tagline.classList.add('subSectionHeadingTagline');
    tagline.innerHTML = 'Does this person meet criteria for any add-ons? Select all that apply.';
    modificationDiv.appendChild(tagline);

    const checkboxGroup = document.createElement('div');
    checkboxGroup.classList.add('checkboxGroup');

    const medicalRateCheckbox = input.buildCheckbox({
      text: 'Medical Assistance',
      isChecked: saveUpdateData.medicalRate === 't' ? true : false,
      callback: e => {
        saveUpdateData.medicalRate = e.target.checked ? 't' : 'f';
        updateSSModification(saveUpdateData);
      },
    });
    const behaviorRateCheckbox = input.buildCheckbox({
      text: 'Behavior Support',
      isChecked: saveUpdateData.behaviorRate === 't' ? true : false,
      callback: e => {
        saveUpdateData.behaviorRate = e.target.checked ? 't' : 'f';
        updateSSModification(saveUpdateData);
      },
    });
    const icfRateCheckbox = input.buildCheckbox({
      text: 'Intermediate Care Facility',
      isChecked: saveUpdateData.icfRate === 't' ? true : false,
      callback: e => {
        saveUpdateData.icfRate = e.target.checked ? 't' : 'f';
        updateSSModification(saveUpdateData);
      },
    });
    const complexRateCheckbox = input.buildCheckbox({
      text: 'Complex Care',
      isChecked: saveUpdateData.complexRate === 't' ? true : false,
      callback: e => {
        saveUpdateData.complexRate = e.target.checked ? 't' : 'f';
        updateSSModification(saveUpdateData);
      },
    });
    const developmentalRateCheckbox = input.buildCheckbox({
      text: 'Developmental Center',
      isChecked: saveUpdateData.developmentalRate === 't' ? true : false,
      callback: e => {
        saveUpdateData.developmentalRate = e.target.checked ? 't' : 'f';
        updateSSModification(saveUpdateData);
      },
    });
    const childIntensiveRateCheckbox = input.buildCheckbox({
      text: `Children's Intensive Behavioral Support`,
      isChecked: saveUpdateData.childIntensiveRate === 't' ? true : false,
      callback: e => {
        saveUpdateData.childIntensiveRate = e.target.checked ? 't' : 'f';
        updateSSModification(saveUpdateData);
      },
    });

    if (isReadOnly) {
      const checkboxes = [
        medicalRateCheckbox,
        behaviorRateCheckbox,
        icfRateCheckbox,
        complexRateCheckbox,
        developmentalRateCheckbox,
        childIntensiveRateCheckbox,
      ];

      checkboxes.forEach(cb => {
        const cbi = cb.querySelector('input');
        cbi.setAttribute('disabled', true);
      });
    }

    checkboxGroup.appendChild(medicalRateCheckbox);
    checkboxGroup.appendChild(behaviorRateCheckbox);
    checkboxGroup.appendChild(icfRateCheckbox);
    checkboxGroup.appendChild(complexRateCheckbox);
    checkboxGroup.appendChild(developmentalRateCheckbox);
    checkboxGroup.appendChild(childIntensiveRateCheckbox);

    modificationDiv.appendChild(checkboxGroup);

    return modificationDiv;
  }

  // -- Manipulate MULTI SELECT Provider DROP DOWN DATA to display Vendors shared by all Selected Paid Supports
  // Code below (1.,2.,3.) is used to find the intersection (SQL) of the Vendor Lists associated with each selected Paid Supports
  // 1. From the original data (arr), remove the elements that don't have the minimum number
  function removeDuplicatesBasedOnCount(arr, prop, count) {
    let occurrences = countOccurrences(arr, prop);
    return arr.filter(obj => {
      let key = JSON.stringify(obj[prop]);
      return occurrences[key] >= count - 1;
    });
  }
  // 2. IN original data (arr), count number of occurances of a property value
  function countOccurrences(arr, prop) {
    return arr.reduce((a, obj) => {
      let key = JSON.stringify(obj[prop]);
      if (!a[key]) {
        a[key] = 0;
      }
      a[key]++;
      return a;
    }, {});
  }
  // 3. Now have list of elements with minimumn number of occurences, but you just need one occurance for final Vendor DropDown display
  function removeDuplicateObjects(array, property) {
    const uniqueIds = [];

    const unique = array.filter(element => {
      const isDuplicate = uniqueIds.includes(element[property]);

      if (!isDuplicate) {
        uniqueIds.push(element[property]);
        return true;
      }

      return false;
    });

    return unique;
  }

  // CONTINUOUS MONITORING
  //------------------------------------------------------
  function buildContinuousMonitoringQuestion() {
    const wrap = document.createElement('div');
    wrap.classList.add('continuousMonitoring');

    const headingText = `*Monitoring / Continuous review process`;
    const subHeadingText = `What is the schedule for the SSA/QIDP to follow up and communicate with the person receiving services?`;
    const labelText = `How will you communicate with the person? In-person, by phone, by text etc. How often will you communicate/follow up with the person? One time per year? Monthly? Expectation: SSA should visit the person in all settings where services are provided.`;

    const heading = document.createElement('h2');
    const subHeading = document.createElement('p');
    const label = document.createElement('p');

    heading.className = 'headingText';
    subHeading.className = 'subHeadingText';
    label.className = 'labelText';

    heading.textContent = headingText;
    subHeading.textContent = subHeadingText;
    label.textContent = labelText;

    const textInput = input.build({
      type: 'textarea',
      value: servicesSupportsData.monitoringContinuousReviewProcess[0].monitoringContinuousReviewProcess,
      charLimit: 10000,
      forceCharLimit: true,
      callback: async e => {
        let ISPValidation = await planValidation.ISPValidation(planID);

        if (!e.target.value) {
          textInput.classList.add('error');
          ISPValidation.continuousMonitoring = false;
        } else {
          textInput.classList.remove('error');
          ISPValidation.continuousMonitoring = true;
        }

        servicesSupportsAjax.updateContinuousMonitoring({
          planId: planID,
          reviewProcess: e.target.value,
        });

        planValidation.updatedIspOutcomesSetAlerts(ISPValidation);
      },
    });

    if (!servicesSupportsData.monitoringContinuousReviewProcess[0].monitoringContinuousReviewProcess) {
      textInput.classList.add('error');
    }

    wrap.appendChild(heading);
    wrap.appendChild(subHeading);
    wrap.appendChild(label);
    wrap.appendChild(textInput);

    return wrap;
  }

  // MAIN
  //------------------------------------------------------
  function getMarkup() {
    const servicesSupportsDiv = document.createElement('div');
    servicesSupportsDiv.classList.add('servicesSupports');

    const heading = document.createElement('h2');
    heading.innerHTML = 'Services And Supports';
    heading.classList.add('sectionHeading');
    servicesSupportsDiv.appendChild(heading);

    const monitoringSec = buildContinuousMonitoringQuestion();
    const paidSec = getPaidSupportsMarkup();
    const additionalSec = getAdditionalSupportsMarkup();
    const profRefSec = getProfessionalReferralsMarkup();
    const modsSec = getSSModificationsMarkup();

    servicesSupportsDiv.appendChild(monitoringSec);
    servicesSupportsDiv.appendChild(paidSec);
    servicesSupportsDiv.appendChild(modsSec);
    servicesSupportsDiv.appendChild(additionalSec);
    servicesSupportsDiv.appendChild(profRefSec);

    return servicesSupportsDiv;
  }

  async function init({ planId, readOnly, data }) {
    planID = planId;
    isReadOnly = readOnly;
    servicesSupportsData = data;
    dropdownData = planData.getDropdownData();
    charLimits = planData.getISPCharacterLimits('servicesSupports');
    enableMultiEdit = false;

    if (!$.session.planUpdate) {
      isSortable = false;
    } else {
      isSortable = isReadOnly ? false : true;
    }

    hasPaidSupports = servicesSupportsData && servicesSupportsData.paidSupport.length > 0 ? true : false;

    setInitialSelectedVendorIds();
    setInitialFundingSourceNames();

    if (
      !servicesSupportsData ||
      !servicesSupportsData.supportModification[0] ||
      !servicesSupportsData.supportModification[0].modificationsId
    ) {
      await insertSSModification({
        medicalRate: 'f',
        behaviorRate: 'f',
        icfRate: 'f',
        complexRate: 'f',
        developmentalRate: 'f',
        childIntensiveRate: 'f',
      });
    } else {
      modificationsId = servicesSupportsData.supportModification[0].modificationsId;
    }
  }

  return {
    init,
    getMarkup,
    getNumberOfPaidSupports,
    getNumberOfAdditionalSupports,
    getNumberOfProfessionalReferrals,
    getHasPaidSupports,
    getSelectedVendors,
    getSelectedVendorIds,
    getSelectedFudningSourceNames,
    getFundingSourceById,
    showAddPaidSupportPopup,
    showAddAdditionalSupportPopup,
    showAddProfessionalReferralPopup,
    refreshDropdownData,
  };
})();
