const planData = (() => {
  let planId;
  let ispData;
  let dropdowns;

  // CHARACTER LIMITS
  //-----------------------------------------
  const characterLimits = {
    assessment: {},
    isp: {
      consentAndSign: {
        dissentAreaDisagree: 2500,
        dissentHowToAddress: 2500,
      },
      contactInfo: {
        moreDetail: 10000,
      },
      restrictiveMeasures: {
        rmKeepSelfSafe: 2500,
        rmFadeRestriction: 10000,
        rmWhatCouldHappenGood: 2500,
        rmWhatCouldHappenBad: 2500,
        rmOtherWayHelpGood: 2500,
        rmOtherWayHelpBad: 2500,
      },
      introduction: {
        likeAdmire: 2464,
        thingsImportantTo: 2464,
        thingsImportantFor: 2464,
        howToSupport: 2464,
      },
      outcomes: {
        description: 2500,
        details: 2500,
        history: 2500,
        carryOverReason: 255,
        whatNeedsToHappen: 2500, // exp
        howItShouldHappen: 2500, // exp
        whenHowOften: 255, // exp
        whenHowOftenOther: 255, // exp
        whatWillHappen: 2500, // rev
        whenToCheckIn: 2500, // rev
      },
      servicesSupports: {
        scopeOfService: 10000, // paid supp
        fundingSourceOther: 2500, // paid supp
        howOftenHowMuch: 255, // paid supp
        howOftenOther: 2500, // paid supp
        whatSupportLooksLike: 2500, // add supp
        whenHowOften: 2500, // add supp
        whenHowOftenOther: 2500, // add supp
        reasonForReferral: 2500, // prof ref
      },
      summary: {
        aloneTime: 10000,
        importantTo: 10000,
        importantFor: 10000,
        skillsAndAbilities: 10000,
        whatIsRisk: 10000,
        whatSupportLooksLike: 10000,
      },
    },
  };
  function getISPCharacterLimits(section) {
    return characterLimits.isp[section];
  }
  function getAllISPcharacterLimts() {
    return characterLimits.isp;
  }
  function getAssessmentCharacterLimits(section) {
    return characterLimits.assessment[section];
  }

  // DROPDOWN DATA
  //-----------------------------------------
  const removeDupRelationships = relationships => {
    const unique = [];
    const flag = {};
    relationships.forEach(el => {
      if (!flag[el.peopleId]) {
        flag[el.peopleId] = true;
        el.lastName = el.lastName.split('|')[0];
        unique.push(el);
      }
    });
    return unique;
  };
  const removeDups = data => {
    const flag = {};
    const flagN = {};
    const unique = [];
    data.forEach(el => {
      if (!flag[el.value] && !flagN[el.text]) {
        flag[el.value] = true;
        flagN[el.text] = true;
        unique.push(el);
      }
    });
    return unique;
  };
  async function setDropdownData() {
    /**
     * -- Service Type changes for Ticket 66872 --
     * Service Types no longer populate from GK, but instead are static,
     * and are also tied to a specific funding source. Some service types
     * only show with specific funding sources
     *  Show with '%' displays with all funding sources
     * DON'T CHANGE VALUE!
     */
    const defaultDropdowns = {
      fundingSource: [
        { value: '%', text: '' },
        { value: '1', text: 'HCBS Individual Options Waiver' },
        { value: '2', text: 'HCBS Level One Waiver' },
        { value: '3', text: 'HCBS SELF Waiver' },
        { value: '4', text: 'ICF' },
        { value: '5', text: 'State Plan Services' },
        { value: '6', text: 'Local Funds' },
        { value: '7', text: 'Local Funds--Contracted with Ohio Department of Aging' },
        { value: '8', text: 'Other' },
      ],
      serviceTypes: [
        {
          value: '1',
          text: 'Adult Day Support - Community',
          showWith: ['1', '2', '3', '6', '7', '8'],
        },
        {
          value: '2',
          text: 'Adult Day Support - Facility',
          showWith: ['1', '2', '3', '6', '7', '8'],
        },
        {
          value: '51',
          text: 'Adult Day Support - Virtual',
          showWith: ['1', '2', '3', '6', '7'],
        },
        {
          value: '3',
          text: 'Assistive Technology Consultation & Supports',
          showWith: ['1', '2', '3', '6', '8'],
        },
        {
          value: '4',
          text: 'Assistive Technology Equipment & Supports',
          showWith: ['1', '2', '3', '6', '8'],
        },
        { value: '5', text: 'Career Planning', showWith: ['1', '2', '3', '6', '8'] },
        {
          value: '6',
          text: 'Career Planning--Benefits Education and Analysis',
          showWith: ['1', '2', '3', '6', '8'],
        },
        {
          value: '7',
          text: 'Career Planning--Worksite Accessibility',
          showWith: ['1', '2', '3', '6', '8'],
        },
        { value: '8', text: 'Community Respite', showWith: ['1', '2', '3', '8'] },
        { value: '9', text: 'Community Transition', showWith: ['1', '8'] },
        {
          value: '10',
          text: 'CTI--Clinical/Therapeutic Interventionist (SELF Service)',
          showWith: ['2', '3', '8'],
        },
        {
          value: '11',
          text: 'CTI--Senior Level Specialized Clinical/Therapeutic Interventionist (SELF Service)',
          showWith: ['3', '8'],
        },
        {
          value: '12',
          text: 'CTI--Specialized Clinical/Therapeutic Interventionist (SELF Service)',
          showWith: ['3', '8'],
        },
        { value: '13', text: 'DD Waiver Nursing', showWith: ['1', '8'] },
        { value: '14', text: 'Environmental Accessibility Adaptations', showWith: ['1', '2', '8'] },
        {
          value: '15',
          text: 'Functional Behavioral Assessment (SELF Service)',
          showWith: ['3', '8'],
        },
        { value: '16', text: 'Group Employment Supports', showWith: ['1', '2', '3', '6', '8'] },
        { value: '17', text: 'Home Delivered Meals', showWith: ['1', '2', '3', '8'] },
        { value: '18', text: 'Homemaker Personal Care', showWith: ['1', '2', '8'] },
        {
          value: '19',
          text: 'Homemaker Personal Care (HPC) Transportation',
          showWith: ['1', '2', '3', '8'],
        },
        { value: '20', text: 'HPC Transportation (Commercial)', showWith: ['1', '2', '8'] },
        {
          value: '21',
          text: 'Individual Employment Supports',
          showWith: ['1', '2', '3', '6', '8'],
        },
        { value: '22', text: 'Informal Respite--Family Only', showWith: ['2', '8'] },
        { value: '23', text: 'Informal Respite--Non-Family Only', showWith: ['2', '8'] },
        { value: '24', text: 'Intermediate Care Facility', showWith: ['4', '8'] },
        { value: '25', text: 'Interpreter Services', showWith: ['1', '8'] },
        { value: '26', text: 'Money Management', showWith: ['1', '2', '8'] },
        {
          value: '27',
          text: 'Non-Medical Transportation - Commercial (CNMT)',
          showWith: ['1', '2', '3', '6', '8'],
        },
        {
          value: '28',
          text: 'Non-Medical Transportation (NMT)',
          showWith: ['1', '2', '3', '6', '8'],
        },
        { value: '29', text: 'Nutritional Services', showWith: ['1', '8'] },
        { value: '30', text: 'Participant Directed HPC', showWith: ['1', '2', '3', '8'] },
        { value: '31', text: 'Participant Directed Goods and Services', showWith: ['2', '3', '8'] },
        {
          value: '32',
          text: 'Participant/Family Stability Assistance--Counseling (SELF Service)',
          showWith: ['3', '8'],
        },
        {
          value: '33',
          text: 'Participant/Family Stability Assistance--Training (SELF Service)',
          showWith: ['2', '3', '8'],
        },
        { value: '34', text: 'Remote Supports', showWith: ['1', '2', '3', '6', '8'] },
        { value: '35', text: 'Residential Respite', showWith: ['1', '2', '3', '8'] },
        { value: '36', text: 'Shared Living', showWith: ['1', '8'] },
        { value: '37', text: 'Social Work', showWith: ['1', '8'] },
        {
          value: '38',
          text: 'Specialized Medical Equipment (Adaptive Assistive Equipment)',
          showWith: ['1', '2', '8'],
        },
        { value: '39', text: 'Support Brokerage (SELF Service)', showWith: ['3', '8'] },
        { value: '40', text: 'Support Brokerage--Unpaid (SELF Service)', showWith: ['3', '8'] },
        { value: '41', text: 'Supported Living', showWith: ['8'] },
        { value: '42', text: 'Targeted Case Management', showWith: ['8'] },
        {
          value: '43',
          text: 'Vocational Habilitation - Community',
          showWith: ['1', '2', '3', '6', '8'],
        },
        {
          value: '44',
          text: 'Vocational Habilitation - Facility',
          showWith: ['1', '2', '3', '6', '8'],
        },
        { value: '45', text: 'Waiver Facility Licensee Only', showWith: ['8'] },
        { value: '46', text: 'Waiver Nursing Delegation (WND)', showWith: ['1', '2', '3', '8'] },
        { value: '47', text: 'Other (please specify)', showWith: ['5', '6'] },
        { value: '48', text: 'Self Directed Transportation', showWith: ['1', '2', '3'] },
        { value: '49', text: 'Adult Day Support - Both', showWith: ['1', '2', '3', '6', '7', '8'] },
        {
          value: '50',
          text: 'Vocational Habilitation - Both',
          showWith: ['1', '2', '3', '6', '8'],
        },
        {
          value: '52',
          text: 'Vocational Habilitation - Virtual',
          showWith: ['1', '2', '3', '6'],
          },
          {
              value: '53',
              text: 'Health Care Assessment',
              showWith: ['1', '2', '3'],
          },
      ],
      newOrExisting: [
        { value: '%', text: '' },
        { value: '1', text: 'New' },//
        { value: '2', text: 'Existing' },
      ],
      howOftenHowMuchFrequency: [
        { value: '%', text: '' },
        { value: '1', text: 'Daily' },
        { value: '2', text: 'Weekly' },
        { value: '3', text: 'Monthly' },
        { value: '4', text: 'Miles' },
        { value: '5', text: 'Other' },
      ],
      whenHowOftenFrequency: [
        { value: '%', text: '' },
        { value: '1', text: 'Daily' },
        { value: '2', text: 'Weekly' },
        { value: '3', text: 'Monthly' },
        { value: '4', text: 'Other' },
      ],
      howOFtenExperiences: [
        { value: '%', text: '' },
        { value: '1', text: 'Weekly' },
        { value: '2', text: 'Monthly' },
        { value: '3', text: 'Other' },
      ],
      communicationType: [
        // { value: '%', text: '' },
        { value: '1', text: 'Letter / Mail.' },
        { value: '2', text: 'Phone Call.' },
        { value: '3', text: 'Text.' },
        { value: '4', text: 'Email.' },
        { value: '5', text: 'Social Media.' },
        { value: '6', text: 'Video Meeting.' },
        { value: '7', text: 'Other.' },
      ],
      dailyLifeDropdownType: [
        { value: '%', text: '' },
        {
          value: '1',
          text: '1 Person has a job, may be interested in a different one or moving up.',
        },
        { value: '2', text: '2 Person wants a job and needs help to find one.' },
        {
          value: '3',
          text: `3 Person isn't sure about work and may need to learn more.`,
        },
        {
          value: '4',
          text: `4 Person doesn't think they want to work, but may not know enough about it.`,
        },
      ],
      levelsOfSupervision: [
        { value: '%', text: '' },
        { value: '1', text: 'No Paid Supports' },
        { value: '2', text: 'General' },
        { value: '3', text: 'Auditory' },
        { value: '4', text: 'Visual' },
        { value: '5', text: 'Close & Constant' },
        { value: '6', text: 'Technology' },
      ],
      outcomeStatus: [
        { value: '0', text: 'In Progress' },
        { value: '1', text: 'Complete' },
      ],
    };

    const retrieveData = {
      token: $.session.Token,
      effectiveStartDate: UTIL.getFormattedDateFromDate(planDates.getEffectiveStartDate(), {
        format: 'iso',
      }),
      effectiveEndDate: UTIL.getFormattedDateFromDate(planDates.getEffectiveEndDate(), {
        format: 'iso',
      }),
      consumerId: plan.getSelectedConsumer().id,
      areInSalesForce: $.session.areInSalesForce,
      planId,
    };

    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getServiceAndSupportsData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });

      dropdowns = {
        ...data.getServiceAndSupportsDataResult,
        ...defaultDropdowns,
      };

      dropdowns.relationshipsWithDups = dropdowns.relationships;
      dropdowns.relationships = removeDupRelationships(dropdowns.relationships);
    } catch (error) {
      console.log(error);

      dropdowns = {
        ...defaultDropdowns,
      };
    }
  }
  function getDropdownData() {
    return dropdowns;
  }
  async function refreshDropdownData() {
    await setDropdownData();
    planSummary.refreshDropdownData(dropdowns);
    planOutcomes.refreshDropdownData(dropdowns);
    servicesSupports.refreshDropdownData(dropdowns);
    contactInformation.refreshDropdownData(dropdowns);
  }
  function getRelationshipNameById(contactId) {
    if (!contactId) return '';

    if (contactId.endsWith('V')) {
      const supportData = servicesSupports.getSelectedVendors();
      const filteredService = supportData.filter(dd => `${dd.providerId}V` === contactId);
      if (filteredService.length > 0) {
        return `${filteredService[0].providerName}`;
      } else {
        return '';
      }
    } else {
      const filteredService = dropdowns.relationships.filter(dd => dd.contactId === contactId);
      if (filteredService.length > 0) {
        if (!filteredService[0].lastName || !filteredService[0].firstName) return '';
        return `${filteredService[0].lastName}, ${filteredService[0].firstName}`;
      } else {
        return '';
      }
    }
  }
  function populateRelationshipDropdown(dropdownEle, defaultValue, includeSupports = false) {
    //if ($.session.areInSalesForce) {
    // group populate
    const teamMemberGroup = {
      groupLabel: 'Plan Team Member',
      groupId: 'teamMemberGroup',
      dropdownValues: [],
    };
    const nonTeamMemberGroup = {
      groupLabel: 'Not a Team Member on this Plan',
      groupId: 'nonTeamMemberGroup',
      dropdownValues: [],
    };
    const paidSupportsGroup = {
      groupLabel: 'Providers on this Plan',
      groupId: 'paidSupportsGroup',
      dropdownValues: [],
    };

    dropdowns.relationships.forEach(dd => {
      if (dd.signatureId) {
        teamMemberGroup.dropdownValues.push({
          value: dd.contactId,
          text: `${dd.lastName}, ${dd.firstName}`,
        });
      } else {
        nonTeamMemberGroup.dropdownValues.push({
          value: dd.contactId,
          text: `${dd.lastName}, ${dd.firstName}`,
        });
      }
    });

    teamMemberGroup.dropdownValues = removeDups(teamMemberGroup.dropdownValues);
    nonTeamMemberGroup.dropdownValues = removeDups(nonTeamMemberGroup.dropdownValues);

    teamMemberGroup.dropdownValues.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    nonTeamMemberGroup.dropdownValues.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    const groupDropdownData = [];
    groupDropdownData.push(teamMemberGroup);
    groupDropdownData.push(nonTeamMemberGroup);

    if (includeSupports)  {
      const supportData = servicesSupports.getSelectedVendors();
      paidSupportsGroup.dropdownValues = supportData.map(ps => {
        return {
          value: `${ps.providerId}V`,
          text: ps.providerName,
        };
      });

      paidSupportsGroup.dropdownValues = removeDups(paidSupportsGroup.dropdownValues);
      paidSupportsGroup.dropdownValues.sort((a, b) => {
        const textA = a.text.toUpperCase();
        const textB = b.text.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      groupDropdownData.push(paidSupportsGroup);
   }

    dropdown.groupingPopulate({
      dropdown: dropdownEle,
      data: groupDropdownData,
      nonGroupedData: [{ value: '', text: '' }],
      defaultVal: defaultValue,
    });
    // } else {
    //   let data;
    //   // normal populate
    //   const data1 = dropdowns.relationships.map(dd => {
    //     return {
    //       value: dd.contactId,
    //       text: `${dd.lastName}, ${dd.firstName}`,
    //     };
    //   });

    //   if (includeSupports) {
    //     const supportData = servicesSupports.getSelectedVendors();
    //     const data2 = supportData.map(ps => {
    //       return {
    //         value: `${ps.providerId}V`,
    //         text: ps.providerName,
    //       };
    //     });

    //     data = [...data1, ...data2];
    //   } else {
    //     data = data1;
    //   }

    //   data.sort((a, b) => {
    //     const textA = a.text.toUpperCase();
    //     const textB = b.text.toUpperCase();
    //     return textA < textB ? -1 : textA > textB ? 1 : 0;
    //   });
    //   data.unshift({ value: '', text: '' });

    //   dropdown.populate(dropdownEle, removeDups(data), defaultValue);
    // }
  }

  async function populateOutcomesReviewWhoDropdown(dropdownEle, defaultValue) {
    //if ($.session.areInSalesForce) {
    // group populate
    const teamMemberGroup = {
      groupLabel: 'Plan Team Member',
      groupId: 'teamMemberGroup',
      dropdownValues: [],
    };
    const nonTeamMemberGroup = {
      groupLabel: 'Not a Team Member on this Plan',
      groupId: 'nonTeamMemberGroup',
      dropdownValues: [],
    };
    const paidSupportsGroup = {
      groupLabel: 'Providers on this Plan',
      groupId: 'paidSupportsGroup',
      dropdownValues: [],
    };
    const locationsGroup = {
      groupLabel: 'Facilities on this Plan ',
      groupId: 'locationsGroup',
      dropdownValues: [],
    };

    dropdowns.relationships.forEach(dd => {
      if (dd.signatureId) {
        teamMemberGroup.dropdownValues.push({
          value: dd.contactId,
          text: `${dd.lastName}, ${dd.firstName}`,
        });
      } else {
        nonTeamMemberGroup.dropdownValues.push({
          value: dd.contactId,
          text: `${dd.lastName}, ${dd.firstName}`,
        });
      }
    });

    teamMemberGroup.dropdownValues = removeDups(teamMemberGroup.dropdownValues);
    nonTeamMemberGroup.dropdownValues = removeDups(nonTeamMemberGroup.dropdownValues);

    teamMemberGroup.dropdownValues.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
    nonTeamMemberGroup.dropdownValues.sort((a, b) => {
      const textA = a.text.toUpperCase();
      const textB = b.text.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });

    const groupDropdownData = [];
    groupDropdownData.push(teamMemberGroup);
    groupDropdownData.push(nonTeamMemberGroup);

      const teamMemberData = await consentAndSignAjax.getConsentAndSignData({
        token: $.session.Token,
        assessmentId: planId,
      });

     // var theseVendors = teamMemberData.filter(vendor => vendor.vendorId !== '' && vendor.salesForceId !== '');
      var theseVendors = teamMemberData.filter(member => member.vendorId !== '');
      paidSupportsGroup.dropdownValues = theseVendors.map(ps => {
        return {
          value: `${ps.vendorId}V`,
          text: ps.name,
        };
      });

      paidSupportsGroup.dropdownValues = removeDups(paidSupportsGroup.dropdownValues);
      paidSupportsGroup.dropdownValues.sort((a, b) => {
        const textA = a.text.toUpperCase();
        const textB = b.text.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      if (theseVendors.length > 0) groupDropdownData.push(paidSupportsGroup);

      if ($.session.applicationName !== 'Gatekeeper') {  
      var theseLocations = teamMemberData.filter(member => member.locationId !== '');
     //var theseLocations = teamMemberData.filter(member => member.locationId !== '');
      locationsGroup.dropdownValues = theseLocations.map(ps => {
        return {
          value: `${ps.locationId}L`,
          text: ps.name,
        };
      });

      locationsGroup.dropdownValues = removeDups(locationsGroup.dropdownValues);
      locationsGroup.dropdownValues.sort((a, b) => {
        const textA = a.text.toUpperCase();
        const textB = b.text.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });
      if (theseLocations.length > 0) groupDropdownData.push(locationsGroup);
    }
  // }

    dropdown.groupingPopulate({
      dropdown: dropdownEle,
      data: groupDropdownData,
      nonGroupedData: [{ value: '', text: '' }],
      defaultVal: defaultValue,
    });
    
  }

  async function init(planID) {
    planId = planID;
    await setDropdownData();
    await planValidation.init(planId);
  }

  return {
    init,
    getDropdownData,
    getRelationshipNameById,
    getISPCharacterLimits,
    getAllISPcharacterLimts,
    getAssessmentCharacterLimits,
    populateRelationshipDropdown,
    populateOutcomesReviewWhoDropdown,
    refreshDropdownData,
  };
})();
