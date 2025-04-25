const individualAssessment = (() => {
    //--------------------------
    // SESSION DATA
    //--------------------------
    let wlData;
    let wlLinkID;
    let wlLocations;
    let locationData;
    let wlRelationship;
    let wlCategory;
    let wlAppoinment;
    let appoinmentData;
    //--------------------------
    // DOM
    //--------------------------
    let assessmentWrap;
    let tableOfContents;
    let tocLinks;
    //--------------------------
    // UI INSTANCES
    //--------------------------
    let backButton;
    let consumerCard;
    let wlForms;
    let locationsTable;
    let relationshipTable;
    let categoryTable;
    let appoinmentTable;
    let classificationsTable;
    let tempConsumer;
    let rowClickedId;
    let listClick = true;
    let previousTarget = null;
    let appontmentRowClickedId;

    const observerCallback = entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && listClick == false) {
                const sectionId = entry.target.id;
                for (let i = 0; i < tableOfContents.childNodes.length; i++) {
                    const child = tableOfContents.childNodes[i];
                    if (child.classList.contains(sectionId)) {
                        child.classList.add('backgroundColor');
                        child.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center',
                            inline: 'nearest'
                        });
                        previousTarget = child;
                    } else {
                        child.classList.remove('backgroundColor');
                    }
                }
            }
        });
        listClick = false;
    };

    const observer = new IntersectionObserver(observerCallback, {
        root: DOM.ACTIONCENTER,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.08,
    });


    const sections = {
        ContactInfo: {
            name: 'Contact Info',
            dbtable: 'WLA_Contact_Information',
            enabled: true,
            formElements: [
                {
                    id: 'cIFirstName',
                    type: 'text',
                    label: 'First Name',
                    disabled: true,
                },
                {
                    id: 'cIMiddleName',
                    label: 'Middle Name',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cILastName',
                    label: 'Last Name',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIGeneration',
                    label: 'Generation',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cINickName',
                    label: 'Nickname',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIAddress1',
                    type: 'text',
                    label: 'Address1',
                    disabled: true,
                },
                {
                    id: 'cIAddress2',
                    label: 'Address2',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cICity',
                    label: 'City',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIState',
                    label: 'State',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIZip',
                    label: 'Zip',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIResidentialAddressEffectiveDate',
                    label: 'Residential Address Effective Date',
                    type: 'date',
                    disabled: true,
                },
                {
                    id: 'cIResidentialCounty',
                    label: 'Residential County',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIPhone1',
                    type: 'text',
                    label: 'Phone 1',
                    disabled: true,
                },
                {
                    id: 'cIPhone2',
                    label: 'Phone 2',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'cIEmail',
                    label: 'Email',
                    type: 'text',
                    disabled: true,
                },
            ],
        },
        PersonalIdentificationNumbers: {
            name: 'Personal Identification Numbers',
            dbtable: 'WLA_Personal_Identification_Numbers',
            enabled: true,
            formElements: [
                {
                    id: 'pNConsumerNumber',
                    type: 'text',
                    label: 'Consumer Number',
                    disabled: true,
                },
                {
                    id: 'pNBillingNumber',
                    label: 'Billing Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNSSN',
                    label: 'Social Security Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNContractNumber',
                    type: 'text',
                    label: ' Contract Number',
                    disabled: true,
                },
                {
                    id: 'pNMedicaidNumber',
                    label: 'Medicaid Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNMedicareNumber',
                    label: 'Medicare Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNResidentNumber',
                    label: 'Resident Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNAreaConsumerNumber',
                    label: 'Area Consumer Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNNPI',
                    label: 'NPI',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNPayrollID',
                    label: 'Payroll ID',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNSalesforceID',
                    label: 'Salesforce ID',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNEnrollmentNumber',
                    label: 'Enrollment Number',
                    type: 'text',
                    disabled: true,
                },
                {
                    id: 'pNCaseNumber',
                    label: 'Case Number',
                    type: 'text',
                    disabled: true,
                },
            ],
        },
        DemographicInfo: {
            name: 'Demographic Info',
            dbtable: 'WLA_Demographic_Information',
            enabled: true,
            formElements: [
                {
                    id: 'dIActiveDate',
                    type: 'date',
                    label: 'Active Date',
                    disabled: true,
                },
                {
                    id: 'dIInactiveDate',
                    type: 'date',
                    label: 'Inactive Date',
                    disabled: true,
                },
                {
                    id: 'dIDateofBirth',
                    type: 'date',
                    label: 'Date of Birth',
                    disabled: true,
                },
                {
                    id: 'dITitle',
                    type: 'text',
                    label: 'Title',
                    disabled: true,
                },
                {
                    id: 'dIMaritalStatus',
                    type: 'text',
                    label: 'Marital Status',
                    disabled: true,
                },
                {
                    id: 'dIGender',
                    type: 'text',
                    label: 'Gender',
                    disabled: true,
                },
                {
                    id: 'dIPrimaryFundingSource',
                    type: 'text',
                    label: 'Primary Funding Source',
                    disabled: true,
                },
                {
                    id: 'dIPlanYearStartMonth',
                    type: 'text',
                    label: 'Plan Year Start Month',
                    disabled: true,
                },
                {
                    id: 'dIPlanYearStartDay',
                    type: 'text',
                    label: 'Plan Year Start Day',
                    disabled: true,
                },
                {
                    id: 'dIPlanYearEndMonth',
                    type: 'text',
                    label: 'Plan Year End Month',
                    disabled: true,
                },
                {
                    id: 'dIPlanYearEndDay',
                    type: 'text',
                    label: 'Plan Year End Day',
                    disabled: true,
                },
                {
                    id: 'dIPrimaryLanguage',
                    type: 'text',
                    label: 'Primary Language',
                    disabled: true,
                },
                {
                    id: 'dIOtherLanguage',
                    type: 'text',
                    label: 'Other Language',
                    disabled: true,
                },
                {
                    id: 'dIPrimaryLanguageatHome',
                    type: 'text',
                    label: 'Primary Language at Home',
                    disabled: true,
                },
                {
                    id: 'dIOtherLanguageatHome',
                    type: 'text',
                    label: 'Other Language at Home ',
                    disabled: true,
                },
                {
                    id: 'dIRace',
                    type: 'text',
                    label: 'Race',
                    disabled: true,
                },
                {
                    id: 'dIEthnicity',
                    type: 'text',
                    label: 'Ethnicity',
                    disabled: true,
                },
                {
                    id: 'dIReligion',
                    type: 'text',
                    label: 'Religion',
                    disabled: true,
                },
                {
                    id: 'dILivingArrangementCategory',
                    type: 'text',
                    label: 'Living Arrangement Category',
                    disabled: true,
                },
                {
                    id: 'dILivingArrangementSubcategory',
                    type: 'text',
                    label: 'Living Arrangement Subcategory',
                    disabled: true,
                },
                {
                    id: 'dIFacilityName',
                    type: 'text',
                    label: 'Facility Name',
                    disabled: true,
                },
                {
                    id: 'dIFacilityNumber',
                    type: 'text',
                    label: 'Facility Number',
                    disabled: true,
                },
                {
                    id: 'dISite',
                    type: 'text',
                    label: 'Site',
                    disabled: true,
                },
                {
                    id: 'dILanguagePreference',
                    type: 'text',
                    label: 'Language Preference',
                    disabled: true,
                },
                {
                    id: 'dIEducationLevel',
                    type: 'text',
                    label: ' Education Level',
                    disabled: true,
                },
                {
                    id: 'dICourtLegalInvolvement',
                    type: 'text',
                    label: 'Court/Legal Involvement',
                    disabled: true,
                },
                {
                    id: 'dICommunicationType',
                    type: 'text',
                    label: 'Communication Type',
                    disabled: true,
                },
                {
                    id: 'dIFirstProcedureDate',
                    type: 'date',
                    label: 'First Procedure Date',
                    disabled: true,
                },
                {
                    id: 'dISecondProcedureDate',
                    type: 'date',
                    label: 'Second Procedure Date',
                    disabled: true,
                },
                {
                    id: 'dIOtherSource',
                    type: 'text',
                    label: 'Other Source',
                    disabled: true,
                },
                {
                    id: 'dIeMAREligible',
                    type: 'text',
                    label: 'eMAR Eligible',
                    disabled: true,
                },
            ],
        },
        Locations: {
            name: 'Locations',
            enabled: true,
        },
        Relationships: {
            name: 'Relationships',
            enabled: true,
        },
        Categories: {
            name: 'Categories',
            enabled: true,
        },
        Appointments: {
            name: 'Appointments',
            enabled: true,
        },
        Classifications: {
            name: 'Classifications',
            enabled: true,
        },
        Intake: {
            name: 'Intake',
            enabled: true,
            dbtable: 'WLA_Intake_Information',
            formElements: [
                {
                    id: 'iNFundingPreference',
                    type: 'text',
                    label: 'Funding Preference',
                    disabled: true,
                },
                {
                    id: 'iNLocationPreference',
                    type: 'text',
                    label: 'Location Preference',
                    disabled: true,
                },
                {
                    id: 'iNHousingPreference',
                    type: 'text',
                    label: 'Housing Preference',
                    disabled: true,
                },
                {
                    id: 'iNIntensityEstimate',
                    type: 'text',
                    label: 'Intensity Estimate',
                    disabled: true,
                },
                {
                    id: 'iNSDD',
                    type: 'text',
                    label: 'SDD',
                    disabled: true,
                },
                {
                    id: 'iNOnsetofDisabilityAge',
                    type: 'text',
                    label: 'Onset of Disability Age',
                    disabled: true,
                },

            ],
        },
    };

    // UTILS
    //--------------------------------------------------
    async function unload() {

        wlData = undefined;
        wlLinkID = undefined;
        wlCircID = undefined;
        wlNeedID = undefined;
        wlDocuments = undefined;
        wlLocations = undefined;
        wlRelationship = undefined;
        wlCategory = undefined;
        wlAppoinment = undefined;
        wlClassifications = undefined;
    }

    // REVIEW / EDIT
    //--------------------------------------------------
    function mapDataBySection(opts) {
        var assessmentData = opts.wlData;
        var locations = opts.locations;
        var relation = opts.relationship;

        if ($.session.applicationName === 'Advisor') {
            var categ = opts.categories;
            var appoint = opts.appointment;
        } else {
            var classific = opts.classifications;
            var intakeData = opts.intake;
        }

        if (!assessmentData) return '';

        wlLinkID = assessmentData.ConsumerId;
        wlLocations = {};
        if (locations.length > 0) {
            if ($.session.applicationName === 'Advisor') {
                for (const loc of locations) {
                    wlLocations[loc.rowNum] = {
                        id: loc.locationId,
                        values: [loc.locationName, loc.startDate == '' ? '' :  moment(loc.startDate).format('MM/DD/YYYY'), loc.endDate == '' ? '' : moment(loc.endDate).format('MM/DD/YYYY'), loc.consumerType],
                    };
                }
            } else {
                for (const loc of locations) {   
                    wlLocations[loc.rowNum] = {
                        id: loc.locationId,
                        values: [loc.locationName, loc.startDate == '' ? '' : moment(loc.startDate).format('MM/DD/YYYY'), loc.endDate == '' ? '' : moment(loc.endDate).format('MM/DD/YYYY')],
                    };
                }
            }
        }

        wlRelationship = {};
        if (relation.length > 0) {
            for (const rel of relation) {
                wlRelationship[rel.rowNum] = {
                    id: rel.personId,
                    values: [rel.relationshipType, rel.name, rel.startDate == '' ? '' : moment(rel.startDate).format('MM/DD/YYYY'), rel.endDate == '' ? '' : moment(rel.endDate).format('MM/DD/YYYY')],
                };
            }
        }

        if ($.session.applicationName === 'Advisor') {
            wlCategory = {};
            if (categ.length > 0) {
                for (const cat of categ) {
                    wlCategory[cat.rowNum] = {
                        id: cat.categoryID,
                        values: [cat.categoryName],
                    };
                }
            }

            wlAppoinment = {};
            if (appoint.length > 0) {
                for (const apt of appoint) {
                    wlAppoinment[apt.rowNum] = {
                        id: apt.trackingId,
                        values: [apt.appointmentDate == '' ? '' : moment(apt.appointmentDate).format('MM/DD/YYYY'), apt.appointmentTime == '' ? '' : UTIL.convertFromMilitary(apt.appointmentTime), apt.appointmentType, apt.provider],
                    };
                }
            }
        } else {
            wlClassifications = {};
            if (classific.length > 0) {
                for (const cla of classific) {
                    wlClassifications[cla.rowNum] = {
                        id: cla.rowNum,
                        values: [cla.description, cla.startDate == '' ? '' : moment(cla.startDate).format('MM/DD/YYYY'), cla.endDate == '' ? '' : moment(cla.endDate).format('MM/DD/YYYY')],
                    };
                }
            }
        }

        wlFormInfo['ContactInfo'].id = wlLinkID;
        wlFormInfo['PersonalIdentificationNumbers'].id = wlLinkID;
        wlFormInfo['DemographicInfo'].id = wlLinkID;


        const data = {
            ContactInfo: {
                cIFirstName: assessmentData.firstname,
                cIMiddleName: assessmentData.middlename,
                cILastName: assessmentData.lastname,
                cIGeneration: assessmentData.generation,
                cINickName: assessmentData.nickname,
                cIAddress1: assessmentData.addressone,
                cIAddress2: assessmentData.addresstwo,
                cICity: assessmentData.mailcity,
                cIState: assessmentData.mailstate,
                cIZip: assessmentData.mailzipcode ? formatZipCode(assessmentData.mailzipcode) : '',
                cIResidentialAddressEffectiveDate: assessmentData.residentialAddressEffectiveDate,
                cIResidentialCounty: assessmentData.county,
                cIPhone1: assessmentData.primaryphone ? formatPhoneNumber(assessmentData.primaryphone) : '',
                cIPhone2: assessmentData.secondaryphone ? formatPhoneNumber(assessmentData.secondaryphone) : '',
                cIEmail: assessmentData.email,
            },
            PersonalIdentificationNumbers: {
                pNConsumerNumber: assessmentData.consumerNumber,
                pNBillingNumber: assessmentData.billingNumber,
                pNSSN: assessmentData.SSN ? formatSSN(assessmentData.SSN) : '',
                pNContractNumber: assessmentData.contractNumber,
                pNMedicaidNumber: assessmentData.MedicaidNumber,
                pNMedicareNumber: assessmentData.MedicareNumber,
                pNResidentNumber: assessmentData.ResidentNumber,
                pNAreaConsumerNumber: assessmentData.areaConsumerNumber,
                pNNPI: assessmentData.NPI,
                pNPayrollID: assessmentData.payrollId,
                pNSalesforceID: assessmentData.salesforceId,
                pNEnrollmentNumber: assessmentData.enrollmentNumber,
                pNCaseNumber: assessmentData.caseNumber,
            },
            DemographicInfo: {
                dIActiveDate: assessmentData.activeDate,
                dIInactiveDate: assessmentData.inactiveDate,
                dIDateofBirth: assessmentData.DOB,
                dITitle: assessmentData.title,
                dIMaritalStatus: assessmentData.maritalStatus,
                dIGender: assessmentData.gender,
                dIPrimaryFundingSource: assessmentData.primaryFundingSource,
                dIPlanYearStartMonth: assessmentData.planYearStartMonth ? getMonthName(assessmentData.planYearStartMonth) : '',
                dIPlanYearStartDay: assessmentData.planYearStartDay,
                dIPlanYearEndMonth: assessmentData.planYearEndMonth ? getMonthName(assessmentData.planYearEndMonth) : '',
                dIPlanYearEndDay: assessmentData.planYearEndDay,
                dIPrimaryLanguage: assessmentData.language,
                dIOtherLanguage: assessmentData.otherLanguage,
                dIPrimaryLanguageatHome: assessmentData.languageAtHome,
                dIOtherLanguageatHome: assessmentData.otherLanguageAtHome,
                dIRace: assessmentData.race,
                dIEthnicity: assessmentData.ethnicity,
                dIReligion: assessmentData.religion,
                dILivingArrangementCategory: assessmentData.livingArrangementCategory,
                dILivingArrangementSubcategory: assessmentData.livingArrangementSubcategory,
                dIFacilityName: assessmentData.facilityName,
                dIFacilityNumber: assessmentData.facilityNumber,
                dISite: assessmentData.site,
                dILanguagePreference: assessmentData.language,
                dIEducationLevel: assessmentData.educationLevel,
                dICourtLegalInvolvement: assessmentData.courtLegalInvolvement,
                dICommunicationType: assessmentData.communicationType,
                dIFirstProcedureDate: assessmentData.firstProcedureDate,
                dISecondProcedureDate: assessmentData.secondProcedureDate,
                dIOtherSource: assessmentData.otherSource,
                dIeMAREligible: assessmentData.eMarConsumer,
            },
            Intake: {
                iNFundingPreference: $.session.applicationName !== 'Advisor' ? intakeData.fundingPreference : '',
                iNLocationPreference: $.session.applicationName !== 'Advisor' ? intakeData.locationPreference : '',
                iNHousingPreference: $.session.applicationName !== 'Advisor' ? intakeData.housingPreference : '',
                iNIntensityEstimate: $.session.applicationName !== 'Advisor' ? intakeData.intensityofService : '',
                iNSDD: $.session.applicationName !== 'Advisor' ? intakeData.SDD : '',
                iNOnsetofDisabilityAge: $.session.applicationName !== 'Advisor' ? intakeData.onsetOfDisabilityAge : '',
            },
        };

        for (d in data) {
            for (dd in data[d]) {
                const fieldType = findFieldTypeById(sections[d].formElements, dd);

                if (fieldType === 'radiogroup') {
                    if (data[d][dd] === '0') {
                        data[d][dd] = `${dd}no`;
                    }

                    if (data[d][dd] === '1') {
                        data[d][dd] = `${dd}yes`;
                    }
                }

                if (fieldType === 'checkboxgroup') {
                    if (data[d][dd] === '' || data[d][dd] === '0') {
                        data[d][dd] = false;
                    }

                    if (data[d][dd] === '1') {
                        data[d][dd] = true;
                    }
                }
            }
        }

        return data;
    }

    function findFieldTypeById(formElements, targetId) {
        let fieldtype;

        for (const element of formElements) {
            if (element.id === targetId) {
                fieldtype = element.type;
                break;
            }
            if (element.type === 'checkboxgroup') {
                if (element.fields.some(f => f.id === targetId)) {
                    fieldtype = 'checkboxgroup';
                    break;
                }
            }
        }

        return fieldtype;
    }

    function loadPage() {
        // Header
        consumerCard.renderTo(moduleHeader);
        const primaryButtonWrap = _DOM.createElement('div');
        backButton.renderTo(primaryButtonWrap);
        moduleHeader.appendChild(primaryButtonWrap);
        // Build TOC
        for (section in sections) {
            if ($.session.applicationName !== 'Advisor' && (section === 'Categories' || section === 'Appointments')) {
                continue;
            }
            if ($.session.applicationName === 'Advisor' && (section === 'Classifications' || section === 'Intake')) {
                continue;
            }

            const className = 'section';
            const tocSection = _DOM.createElement('p', { class: [className, section] });
            const tocSectionLink = _DOM.createElement('a', { href: `#${section}`, text: sections[section].name });
            tocSection.appendChild(tocSectionLink);
            tableOfContents.appendChild(tocSection);
            tocSection.classList.toggle('hiddenPage', !sections[section].enabled);
            tocLinks[section] = tocSection;


            if (section == 'ContactInfo') {
                tocSection.classList.add('backgroundColor');
                previousTarget = tocSection;
            }

            tocSection.addEventListener('click', e => {
                if (previousTarget) {
                    previousTarget.classList.remove('backgroundColor');
                }
                e.currentTarget.classList.add('backgroundColor');
                previousTarget = e.currentTarget;
                listClick = true;
            });

            // Build Form
            const sectionWrap = _DOM.createElement('div', { id: section, class: 'wlPage' });
            const sectionHeader = _DOM.createElement('h2', {
                text: _UTIL.convertCamelCaseToTitle(section),
            });
            sectionWrap.appendChild(sectionHeader);
            sectionWrap.classList.toggle('hiddenPage', !sections[section].enabled);
            observer.observe(sectionWrap);
            if (section === 'Locations') {
                locationsTable.renderTo(sectionWrap);
                locationsForm.renderTo(sectionWrap);
                assessmentWrap.appendChild(sectionWrap);
                continue;
            }

            if (section === 'Relationships') {
                relationshipTable.renderTo(sectionWrap);
                assessmentWrap.appendChild(sectionWrap);
                continue;
            }

            if (section === 'Categories') {
                categoryTable.renderTo(sectionWrap);
                assessmentWrap.appendChild(sectionWrap);
                continue;
            }

            if (section === 'Appointments') {
                appoinmentTable.renderTo(sectionWrap);
                appoinmentForm.renderTo(sectionWrap);
                assessmentWrap.appendChild(sectionWrap);
                continue;
            }

            if (section === 'Classifications') {
                classificationsTable.renderTo(sectionWrap);
                assessmentWrap.appendChild(sectionWrap);
                continue;
            }

            if (sections[section].formElements) {
                wlForms[section] = new Form({
                    hideAllButtons: true,
                    fields: sections[section].formElements,
                    formName: section,
                });

                wlForms[section].renderTo(sectionWrap);
            }
            assessmentWrap.appendChild(sectionWrap);
        }

    }

    function loadPageSkeleton() {
        moduleBody.innerHTML = '';
        moduleHeader.innerHTML = '';

        tableOfContents = _DOM.createElement('div', { class: 'demographicesListTableOFContents' });
        assessmentWrap = _DOM.createElement('div', { class: 'demographicesListAssessment' });

        assessmentWrap.addEventListener('scroll', e => {

        });

        moduleBody.appendChild(tableOfContents);
        moduleBody.appendChild(assessmentWrap);
    }

    // INIT (data & defaults)
    //--------------------------------------------------
    function initFormInfo() {
        return {
            ContactInfo: { dbtable: 'WLA_Contact_Information' },
            PersonalIdentificationNumbers: { dbtable: 'WLA_Personal_Identification_Numbers' },
            DemographicInfo: { dbtable: 'WLA_Demographic_Information' },
            Intake: { dbtable: 'WLA_Intake_Information' },
        };
    }
    function initComponents(selectedConsumer) {
        // Locations
        if ($.session.applicationName === 'Advisor') {
            locationsTable = new Table({
                columnSortable: true,
                allowDelete: false,
                headings: [
                    {
                        text: 'Location',
                        type: 'string',
                    },
                    {
                        text: 'Start Date',
                        type: 'date',
                    },
                    {
                        text: 'End Date',
                        type: 'date',
                    },
                    {
                        text: 'Type',
                        type: 'string',
                    },
                ],
            });

            locationsForm = new Form({
                hideAllButtons: true,
                fields: [
                    {
                        type: 'text',
                        label: 'Location',
                        id: 'lLocations',
                        disabled: true,
                    },
                    {
                        type: 'date',
                        label: 'Start Date',
                        id: 'lStartDate',
                        disabled: true,
                    },
                    {
                        type: 'date',
                        label: 'End Date',
                        id: 'lEndDate',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Status',
                        id: 'lStatus',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Default Day Service Type',
                        id: 'lDefaultType',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Default Group',
                        id: 'lDefaultGroup',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun Start',
                        id: 'lSunStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon Start',
                        id: 'lMonStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues Start',
                        id: 'lTuesStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed Start',
                        id: 'lWedStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs Start',
                        id: 'lThursStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri Start',
                        id: 'lFriStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat Start',
                        id: 'lSatStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun End',
                        id: 'lSunEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon End',
                        id: 'lMonEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues End',
                        id: 'lTuesEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed End',
                        id: 'lWedEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs End',
                        id: 'lThursEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri End',
                        id: 'lFriEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat End',
                        id: 'lSatEnd',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeSun',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeMon',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeTues',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeWed',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeThurs',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeFri',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeSat',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun Start',
                        id: 'lSunStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon Start',
                        id: 'lMonStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues Start',
                        id: 'lTuesStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed Start',
                        id: 'lWedStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs Start',
                        id: 'lThursStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri Start',
                        id: 'lFriStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat Start',
                        id: 'lSatStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun End',
                        id: 'lSunEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon End',
                        id: 'lMonEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues End',
                        id: 'lTuesEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed End',
                        id: 'lWedEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs End',
                        id: 'lThursEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri End',
                        id: 'lFriEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat End',
                        id: 'lSatEnd2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeSun2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeMon2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeTues2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeWed2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeThurs2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeFri2',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'DS Type',
                        id: 'lDSTypeSat2',
                        disabled: true,
                    },
                    {
                        id: 'lMRC',
                        type: 'radiogroup',
                        disabled: true,
                        groupLabel: `Include in MRC?`,
                        fields: [
                            { type: 'radio', label: 'Yes', value: 'yes', id: 'Y' },
                            { type: 'radio', label: 'No', value: 'no', id: 'N' },
                        ],
                    },
                    {
                        id: 'lNotes',
                        label: 'Notes',
                        fullscreen: true,
                        type: 'textarea',
                        disabled: true,
                    },

                ],
            });
        } else {
            locationsTable = new Table({
                columnSortable: true,
                allowDelete: false,
                headings: [
                    {
                        text: 'Location',
                        type: 'string',
                    },
                    {
                        text: 'Start Date',
                        type: 'date',
                    },
                    {
                        text: 'End Date',
                        type: 'date',
                    },
                ],
            });

            locationsForm = new Form({
                hideAllButtons: true,
                fields: [
                    {
                        type: 'text',
                        label: 'Location',
                        id: 'lLocations',
                        disabled: true,
                    },
                    {
                        type: 'date',
                        label: 'Start Date',
                        id: 'lStartDate',
                        disabled: true,
                    },
                    {
                        type: 'date',
                        label: 'End Date',
                        id: 'lEndDate',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun Start',
                        id: 'lSunStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon Start',
                        id: 'lMonStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues Start',
                        id: 'lTuesStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed Start',
                        id: 'lWedStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs Start',
                        id: 'lThursStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri Start',
                        id: 'lFriStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat Start',
                        id: 'lSatStart',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun End',
                        id: 'lSunEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon End',
                        id: 'lMonEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues End',
                        id: 'lTuesEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed End',
                        id: 'lWedEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs End',
                        id: 'lThursEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri End',
                        id: 'lFriEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat End',
                        id: 'lSatEnd',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun Start',
                        id: 'lSunStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon Start',
                        id: 'lMonStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues Start',
                        id: 'lTuesStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed Start',
                        id: 'lWedStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs Start',
                        id: 'lThursStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri Start',
                        id: 'lFriStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat Start',
                        id: 'lSatStart2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sun End',
                        id: 'lSunEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Mon End',
                        id: 'lMonEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Tues End',
                        id: 'lTuesEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Wed End',
                        id: 'lWedEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Thurs End',
                        id: 'lThursEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Fri End',
                        id: 'lFriEnd2',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Sat End',
                        id: 'lSatEnd2',
                        disabled: true,
                    },
                ],
            });
        }


        relationshipTable = new Table({
            columnSortable: true,
            allowDelete: false,
            headings: [
                {
                    text: 'Relationship Type',
                    type: 'string',
                },
                {
                    text: 'Name',
                    type: 'string',
                },
                {
                    text: 'Start Date',
                    type: 'date',
                },
                {
                    text: 'End Date',
                    type: 'date',
                },
            ],
        });

        if ($.session.applicationName === 'Advisor') {
            categoryTable = new Table({
                columnSortable: true,
                allowDelete: false,
                headings: [
                    {
                        text: 'Category',
                        type: 'string',
                    },
                ],
            });

            appoinmentTable = new Table({
                columnSortable: true,
                allowDelete: false,
                headings: [
                    {
                        text: 'Appointment Date',
                        type: 'date',
                    },
                    {
                        text: 'Time',
                        type: 'date',
                    },
                    {
                        text: 'Type',
                        type: 'string',
                    },
                    {
                        text: 'Provider',
                        type: 'string',
                    },
                ],
            });

            appoinmentForm = new Form({
                hideAllButtons: true,
                fields: [
                    {
                        type: 'date',
                        label: 'Appointment Date',
                        id: 'aAppointmentDate',
                        disabled: true,
                    },
                    {
                        type: 'time',
                        label: 'Appointment Time',
                        id: 'aAppointmentTime',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Appointment Type',
                        id: 'aAppointmentType',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Provider',
                        id: 'aProvider',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Employee',
                        id: 'aEmployee',
                        disabled: true,
                    },
                    {
                        type: 'text',
                        label: 'Treatment',
                        id: 'aTreatment',
                        disabled: true,
                    },
                    {
                        fullscreen: true,
                        type: 'textarea',
                        label: 'Reason',
                        id: 'aReason',
                        disabled: true,
                    },
                    {
                        id: 'aNotes',
                        label: 'Notes',
                        fullscreen: true,
                        type: 'textarea',
                        disabled: true,
                    },
                ],
            });
        } else {
            classificationsTable = new Table({
                columnSortable: true,
                allowDelete: false,
                headings: [
                    {
                        text: 'Classification',
                        type: 'string',
                    },
                    {
                        text: 'Start Date',
                        type: 'date',
                    },
                    {
                        text: 'End Date',
                        type: 'date',
                    },
                ],
            });
        }
        // Back to overview
        backButton = new Button({
            text: 'Back',
            style: 'primary',
            styleType: 'outlined',
        });

        // consumer card
        consumerCard = new RosterCard({
            consumerId: selectedConsumer.ConsumerId,
            firstName: selectedConsumer.firstname,
            middleName: selectedConsumer.middlename,
            lastName: selectedConsumer.lastname,
        });
    }

    function attachEvents() {
        locationsTable.onRowClick(rowId => {
            if (rowId == rowClickedId && !locationsForm.form.classList.contains('hiddenPage')) {
                locationsForm.form.classList.add('hiddenPage');
            } else {
                locationsForm.form.classList.remove('hiddenPage');
            }
            locationsForm.clear();
            const rowData = locationData.find(l => l.locationId == rowId);
            rowClickedId = rowId;

            if ($.session.applicationName === 'Advisor') {
                locationsForm.populate(
                    {
                        lLocations: rowData.locationName,
                        lStartDate: rowData.startDate,
                        lEndDate: rowData.endDate,
                        lStatus: rowData.LocationStatus,
                        lDefaultType: rowData.consumerType,
                        lDefaultGroup: rowData.defaultGroup,
                        lSunStart: rowData.SunStartTime,
                        lMonStart: rowData.monStartTime,
                        lTuesStart: rowData.tuesStartTime,
                        lWedStart: rowData.wedStartTime,
                        lThursStart: rowData.thurStartTime,
                        lFriStart: rowData.friStartTime,
                        lSatStart: rowData.satStartTime,
                        lSunEnd: rowData.sunEndTime,
                        lMonEnd: rowData.monEndTime,
                        lTuesEnd: rowData.tuesEndTime,
                        lWedEnd: rowData.wedEndTime,
                        lThursEnd: rowData.thurEndTime,
                        lFriEnd: rowData.friEndTime,
                        lSatEnd: rowData.satEndTime,
                        lDSTypeSun: rowData.sunDStype,
                        lDSTypeMon: rowData.monDSType,
                        lDSTypeTues: rowData.tueDSType,
                        lDSTypeWed: rowData.wedDSType,
                        lDSTypeThurs: rowData.thuDSType,
                        lDSTypeFri: rowData.friDSType,
                        lDSTypeSat: rowData.satDSType,
                        lSunStart2: rowData.sunStartTime2,
                        lMonStart2: rowData.monStartTime2,
                        lTuesStart2: rowData.tueStartTime2,
                        lWedStart2: rowData.wedStartTime2,
                        lThursStart2: rowData.thurStartTime2,
                        lFriStart2: rowData.friStartTime2,
                        lSatStart2: rowData.satStartTime2,
                        lSunEnd2: rowData.sunEndTime2,
                        lMonEnd2: rowData.monEndTime2,
                        lTuesEnd2: rowData.tueEndTime2,
                        lWedEnd2: rowData.wedEndTime2,
                        lThursEnd2: rowData.thurEndTime2,
                        lFriEnd2: rowData.friEndTime2,
                        lSatEnd2: rowData.satEndTime2,
                        lDSTypeSun2: rowData.sunDSType2,
                        lDSTypeMon2: rowData.monDSType2,
                        lDSTypeTues2: rowData.tueDSType2,
                        lDSTypeWed2: rowData.wedDSType2,
                        lDSTypeThurs2: rowData.thuDSType2,
                        lDSTypeFri2: rowData.friDSType2,
                        lDSTypeSat2: rowData.satDSType2,
                        lNotes: rowData.notes,
                        lMRC: rowData.MRC,
                    },
                    rowId,
                );
            } else {
                if ($.session.viewLocationSchedulesKey) {
                    locationsForm.populate(
                        {
                            lLocations: rowData.locationName,
                            lStartDate: rowData.startDate,
                            lEndDate: rowData.endDate,
                            lSunStart: rowData.SunStartTime,
                            lMonStart: rowData.monStartTime,
                            lTuesStart: rowData.tuesStartTime,
                            lWedStart: rowData.wedStartTime,
                            lThursStart: rowData.thurStartTime,
                            lFriStart: rowData.friStartTime,
                            lSatStart: rowData.satStartTime,
                            lSunEnd: rowData.sunEndTime,
                            lMonEnd: rowData.monEndTime,
                            lTuesEnd: rowData.tuesEndTime,
                            lWedEnd: rowData.wedEndTime,
                            lThursEnd: rowData.thurEndTime,
                            lFriEnd: rowData.friEndTime,
                            lSatEnd: rowData.satEndTime,
                            lSunStart2: rowData.sunStartTime2,
                            lMonStart2: rowData.monStartTime2,
                            lTuesStart2: rowData.tueStartTime2,
                            lWedStart2: rowData.wedStartTime2,
                            lThursStart2: rowData.thurStartTime2,
                            lFriStart2: rowData.friStartTime2,
                            lSatStart2: rowData.satStartTime2,
                            lSunEnd2: rowData.sunEndTime2,
                            lMonEnd2: rowData.monEndTime2,
                            lTuesEnd2: rowData.tueEndTime2,
                            lWedEnd2: rowData.wedEndTime2,
                            lThursEnd2: rowData.thurEndTime2,
                            lFriEnd2: rowData.friEndTime2,
                            lSatEnd2: rowData.satEndTime2,
                        },
                        rowId,
                    );
                }
                else {
                    locationsForm.form.classList.add('hiddenPage');
                }
               
            }
        });

        if ($.session.applicationName === 'Advisor') {
            appoinmentTable.onRowClick(rowId => {
                if (rowId == appontmentRowClickedId && !appoinmentForm.form.classList.contains('hiddenPage')) {
                    appoinmentForm.form.classList.add('hiddenPage');
                } else {
                    appoinmentForm.form.classList.remove('hiddenPage');
                }

                appoinmentForm.clear();
                const rowData = appoinmentData.find(a => a.trackingId == rowId);
                appontmentRowClickedId = rowId; 

                appoinmentForm.populate(
                    {
                        aAppointmentDate: rowData.appointmentDate,
                        aAppointmentTime: rowData.appointmentTime,
                        aAppointmentType: rowData.appointmentType,
                        aProvider: rowData.provider,
                        aEmployee: rowData.employee,
                        aTreatment: rowData.treatment,
                        aReason: rowData.reason,
                        aNotes: rowData.notes,
                    },
                    rowId,
                );
            });
        }
        backButton.onClick(() => {
            _DOM.ACTIONCENTER.removeAttribute('data-ui');
            roster2.loadRosterInfo();
        });

    }
    function showHideSections() {
        wlForms['PersonalIdentificationNumbers'].inputs['pNSSN'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewSSN);
        wlForms['PersonalIdentificationNumbers'].inputs['pNMedicaidNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewMedicaid);
        wlForms['PersonalIdentificationNumbers'].inputs['pNResidentNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewResident);

        if ($.session.applicationName === 'Advisor') {
            wlForms['PersonalIdentificationNumbers'].inputs['pNConsumerNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewConsumerNumber);
            wlForms['PersonalIdentificationNumbers'].inputs['pNMedicareNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewMedicare);
            wlForms['DemographicInfo'].inputs['dIDateofBirth'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewDOB);
            wlForms['DemographicInfo'].inputs['dIeMAREligible'].rootElement.classList.toggle('hiddenPage', !$.session.emarVisible);
            wlForms['PersonalIdentificationNumbers'].inputs['pNNPI'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['PersonalIdentificationNumbers'].inputs['pNPayrollID'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['PersonalIdentificationNumbers'].inputs['pNSalesforceID'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['PersonalIdentificationNumbers'].inputs['pNEnrollmentNumber'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['PersonalIdentificationNumbers'].inputs['pNCaseNumber'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['ContactInfo'].inputs['cIResidentialAddressEffectiveDate'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['ContactInfo'].inputs['cIResidentialCounty'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dITitle'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPrimaryFundingSource'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPlanYearStartMonth'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPlanYearStartDay'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPlanYearEndMonth'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPlanYearEndDay'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPrimaryLanguage'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIOtherLanguage'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIPrimaryLanguageatHome'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIOtherLanguageatHome'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIEthnicity'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIReligion'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dILivingArrangementCategory'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dILivingArrangementSubcategory'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIFacilityName'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIFacilityNumber'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dISite'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['ContactInfo'].inputs['cIGeneration'].rootElement.classList.toggle('hiddenPage', true);

            wlForms['ContactInfo'].inputs['cIAddress1'].labelEle.innerHTML = 'Address1';
            wlForms['ContactInfo'].inputs['cIAddress2'].labelEle.innerHTML = 'Address2';
            wlForms['ContactInfo'].inputs['cIPhone1'].labelEle.innerHTML = 'Phone 1';
            wlForms['ContactInfo'].inputs['cIPhone2'].labelEle.innerHTML = 'Phone 2';
            wlForms['PersonalIdentificationNumbers'].inputs['pNConsumerNumber'].labelEle.innerHTML = 'Consumer Number';

        }
        else {
            wlForms['DemographicInfo'].inputs['dIDateofBirth'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewDOB);
            wlForms['PersonalIdentificationNumbers'].inputs['pNMedicareNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewMedicare);
            wlForms['PersonalIdentificationNumbers'].inputs['pNConsumerNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewLocalId);
            wlForms['PersonalIdentificationNumbers'].inputs['pNBillingNumber'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['PersonalIdentificationNumbers'].inputs['pNContractNumber'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['PersonalIdentificationNumbers'].inputs['pNAreaConsumerNumber'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIActiveDate'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIInactiveDate'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dILanguagePreference'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIEducationLevel'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dICourtLegalInvolvement'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dICommunicationType'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIFirstProcedureDate'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dISecondProcedureDate'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIOtherSource'].rootElement.classList.toggle('hiddenPage', true);
            wlForms['DemographicInfo'].inputs['dIeMAREligible'].rootElement.classList.toggle('hiddenPage', true);

            wlForms['ContactInfo'].inputs['cIAddress1'].labelEle.innerHTML = 'Residential Address1';
            wlForms['ContactInfo'].inputs['cIAddress2'].labelEle.innerHTML = 'Residential Address2';
            wlForms['ContactInfo'].inputs['cIPhone1'].labelEle.innerHTML = 'Primary Phone';
            wlForms['ContactInfo'].inputs['cIPhone2'].labelEle.innerHTML = 'Cell Phone';
            wlForms['PersonalIdentificationNumbers'].inputs['pNConsumerNumber'].labelEle.innerHTML = 'Local ID';
        }

    }

    function formatPhoneNumber(number) {
        if (!number) return;
        const splitNumber = number
            .replace(/[^\w\s]/gi, '')
            .replaceAll(' ', '')
            .replaceAll('x', '');

        const phoneNumber = UTIL.formatPhoneNumber(splitNumber.substr(0, 10));
        const phoneExt = splitNumber.substr(10);

        const phone = phoneExt ? `${phoneNumber} (${phoneExt})` : `${phoneNumber}`;

        return phone;
    }

    function formatZipCode(zipCode) {
        const zip = zipCode.replace(/[^\w\s]/gi, '').replaceAll(' ', '');
        if (zip.length <= 5) {
            return zip;
        } else {
            return zip.slice(0, 5) + '-' + zip.slice(5);
        }
    }

    function formatSSN(ssn) {
        let SSN = stringAdd(ssn, 3, '-');
        SSN = stringAdd(SSN, 6, '-');
        return SSN;
    }

    function stringAdd(string, start, newSubStr) {
        return string.slice(0, start) + newSubStr + string.slice(start);
    }

    function getMonthName(monthNumber) {
        const monthNames = ["Month",
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[monthNumber];
    }

    async function init(opts) {
        wlCircID = '';
        wlNeedID = '';
        wlForms = {};
        tocLinks = {};
        wlDocuments = [];
        wlLocations = {};
        wlClassifications = {};
        wlAppoinment = {};
        wlRelationship = {};
        wlCategory = {};

        locationData = opts.locations;
        if ($.session.applicationName === 'Advisor') {
            appoinmentData = opts.appointment;
        }
        wlFormInfo = initFormInfo();
        wlData = mapDataBySection(opts);
        moduleHeader = opts.moduleHeader;
        moduleBody = opts.moduleBody;
        tempConsumer = opts.selectedConsumer;
        loadPageSkeleton();
        initComponents(opts.wlData);
        loadPage();

        attachEvents();

        for (section in wlData) {
            if ($.session.applicationName === 'Advisor' && section === 'Intake') {
                continue;
            }
            wlForms[section].populate(wlData[section]);
        }

        locationsTable.populate(Object.values(wlLocations));
        locationsForm.form.classList.add('hiddenPage');
        relationshipTable.populate(Object.values(wlRelationship));

        if ($.session.applicationName === 'Advisor') {
            categoryTable.populate(Object.values(wlCategory));

            appoinmentTable.populate(Object.values(wlAppoinment));
            appoinmentForm.form.classList.add('hiddenPage');
        }
        else {
            classificationsTable.populate(Object.values(wlClassifications));
        }

        showHideSections();
    }

    return { init, unload };
})();
