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
    let tempConsumer;

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
        PersonalNumbers: {
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
            ],
        },
        DemographicInfo: {
            name: 'Demographic Info',
            dbtable: 'WLA_Demographic_Information',
            enabled: $.session.applicationName === 'Advisor' ? false : true,
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
                    id: 'dIRace',
                    type: 'text',
                    label: 'Race',
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
                {
                    id: 'dIMedCart',
                    type: 'text',
                    label: 'MedCart',
                    disabled: true,
                },
                {
                    id: 'dIDNROnFile',
                    type: 'text',
                    label: 'DNR On File?',
                    disabled: true,
                },
            ],
        },
        Locations: {
            name: 'Locations',
            enabled: $.session.applicationName === 'Advisor' ? false : true,
        },
        Relationships: {
            name: 'Relationships',
            enabled: $.session.applicationName === 'Advisor' ? false : true,
        },
        Categories: {
            name: 'Categories',
            enabled: $.session.applicationName === 'Advisor' ? false : true,
        },
        Appointmnets: {
            name: 'Appointmnets',
            enabled: $.session.applicationName === 'Advisor' ? false : true,
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
    }

    // REVIEW / EDIT
    //--------------------------------------------------
    function mapDataBySection(opts) {
        var assessmentData = opts.wlData;
        var locations = opts.locations;
        var relation = opts.relationship;
        var categ = opts.categories;
        var appoint = opts.appointment;

        if (!assessmentData) return '';

        wlLinkID = assessmentData.ConsumerId;
        wlLocations = {};
        if (locations.length > 0) {
            for (const loc of locations) {
                wlLocations[loc.locationId] = {
                    id: loc.locationId,
                    values: [loc.locationName, moment(loc.startDate).format('MM/DD/YY'), loc.endDate == '' ? '' : moment(loc.endDate).format('MM/DD/YY'), loc.consumerType],
                };
            }
        }

        wlRelationship = {};
        if (relation.length > 0) {
            for (const rel of relation) {
                wlRelationship[rel.personId] = {
                    id: rel.personId,
                    values: [rel.relationshipType, rel.name, moment(rel.startDate).format('MM/DD/YY'), rel.endDate == '' ? '' : moment(rel.endDate).format('MM/DD/YY')],
                };
            }
        }

        wlCategory = {};
        if (categ.length > 0) {
            for (const cat of categ) {
                wlCategory[cat.categoryID] = {
                    id: cat.categoryID,
                    values: [cat.categoryName],
                };
            }
        }

        wlAppoinment = {};
        if (appoint.length > 0) {
            for (const apt of appoint) {
                wlAppoinment[apt.trackingId] = {
                    id: apt.trackingId,
                    values: [apt.appointmentDate == '' ? '' : moment(apt.appointmentDate).format('MM/DD/YY'), apt.appointmentTime == '' ? '' : UTIL.convertFromMilitary(apt.appointmentTime), apt.appointmentType, apt.provider],
                };
            }
        }

        wlFormInfo['ContactInfo'].id = wlLinkID;
        wlFormInfo['PersonalNumbers'].id = wlLinkID;
        wlFormInfo['DemographicInfo'].id = wlLinkID;


        const data = {
            ContactInfo: {
                cIFirstName: assessmentData.firstname,
                cIMiddleName: assessmentData.middlename,
                cILastName: assessmentData.lastname,
                cINickName: assessmentData.nickname,
                cIAddress1: assessmentData.addressone,
                cIAddress2: assessmentData.addresstwo,
                cICity: assessmentData.mailcity,
                cIState: assessmentData.mailstate,
                cIZip: assessmentData.mailzipcode ? formatZipCode(assessmentData.mailzipcode) : '',
                cIPhone1: assessmentData.primaryphone ? formatPhoneNumber(assessmentData.primaryphone) : '',
                cIPhone2: assessmentData.secondaryphone ? formatPhoneNumber(assessmentData.secondaryphone) : '',
                cIEmail: assessmentData.email,
            },
            PersonalNumbers: {
                pNConsumerNumber: assessmentData.consumerNumber,
                pNBillingNumber: assessmentData.billingNumber,
                pNSSN: assessmentData.SSN,
                pNContractNumber: assessmentData.contractNumber,
                pNMedicaidNumber: assessmentData.MedicaidNumber,
                pNMedicareNumber: assessmentData.MedicareNumber,
                pNResidentNumber: assessmentData.ResidentNumber,
                pNAreaConsumerNumber: assessmentData.areaConsumerNumber,
            },
            DemographicInfo: {
                dIActiveDate: assessmentData.activeDate,
                dIInactiveDate: assessmentData.inactiveDate,
                dIDateofBirth: assessmentData.DOB,
                dIMaritalStatus: assessmentData.maritalStatus,
                dIGender: assessmentData.gender,
                dIRace: assessmentData.race,
                dILanguagePreference: assessmentData.language,
                dIEducationLevel: assessmentData.educationLevel,
                dICourtLegalInvolvement: assessmentData.courtLegalInvolvement,
                dICommunicationType: assessmentData.communicationType,
                dIFirstProcedureDate: assessmentData.firstProcedureDate,
                dISecondProcedureDate: assessmentData.secondProcedureDate,
                dIOtherSource: assessmentData.otherSource,
                dIeMAREligible: assessmentData.eMarConsumer,
                dIMedCart: assessmentData.eMarMadCart,
                dIDNROnFile: assessmentData.DNRFile,
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
        var previousTarget = null;
        // Build TOC
        for (section in sections) {
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
            });

            // Build Form
            const sectionWrap = _DOM.createElement('div', { id: section, class: 'wlPage' });
            const sectionHeader = _DOM.createElement('h2', {
                text: _UTIL.convertCamelCaseToTitle(section),
            });
            sectionWrap.appendChild(sectionHeader);
            sectionWrap.classList.toggle('hiddenPage', !sections[section].enabled);

            if ($.session.applicationName === 'Advisor') {
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

                if (section === 'Appointmnets') {
                    appoinmentTable.renderTo(sectionWrap);
                    appoinmentForm.renderTo(sectionWrap);
                    assessmentWrap.appendChild(sectionWrap);
                    continue;
                }
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
            PersonalNumbers: { dbtable: 'WLA_Personal_Identification_Numbers' },
            DemographicInfo: { dbtable: 'WLA_Demographic_Information' },
        };
    }
    function initComponents(selectedConsumer) {
        // Locations
        locationsTable = new Table({
            columnSortable: false,
            allowDelete: false,
            headings: [
                {
                    text: 'Location',
                    type: 'string',
                },
                {
                    text: 'Start Date',
                    type: 'string',
                },
                {
                    text: 'End Date',
                    type: 'string',
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

        if ($.session.applicationName === 'Advisor') {

            relationshipTable = new Table({
                columnSortable: false,
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
                        type: 'string',
                    },
                    {
                        text: 'End Date',
                        type: 'string',
                    },
                ],
            });

            categoryTable = new Table({
                columnSortable: false,
                allowDelete: false,
                headings: [
                    {
                        text: 'Category',
                        type: 'string',
                    },
                ],
            });

            appoinmentTable = new Table({
                columnSortable: false,
                allowDelete: false,
                headings: [
                    {
                        text: 'Appointment Date',
                        type: 'string',
                    },
                    {
                        text: 'Time',
                        type: 'string',
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
            locationsForm.form.classList.remove('hiddenPage');
            locationsForm.clear();
            const rowData = locationData.find(l => l.locationId == rowId);
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
        });

        appoinmentTable.onRowClick(rowId => {
            appoinmentForm.form.classList.remove('hiddenPage');
            appoinmentForm.clear();
            const rowData = appoinmentData.find(a => a.trackingId == rowId);
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

        backButton.onClick(() => {
            _DOM.ACTIONCENTER.removeAttribute('data-ui');
            roster2.loadRosterInfo();
        });

    }
    function showHideSections() {
        if ($.session.applicationName === 'Advisor') {
            wlForms['PersonalNumbers'].inputs['pNConsumerNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewConsumerNumber);
            wlForms['PersonalNumbers'].inputs['pNSSN'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewSSN);
            wlForms['PersonalNumbers'].inputs['pNMedicaidNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewMedicaid);
            wlForms['PersonalNumbers'].inputs['pNMedicareNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewMedicare);
            wlForms['PersonalNumbers'].inputs['pNResidentNumber'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewResident);

            wlForms['DemographicInfo'].inputs['dIDateofBirth'].rootElement.classList.toggle('hiddenPage', !$.session.DemographicsViewDOB);
            wlForms['DemographicInfo'].inputs['dIeMAREligible'].rootElement.classList.toggle('hiddenPage', !$.session.emarVisible);
            wlForms['DemographicInfo'].inputs['dIMedCart'].rootElement.classList.toggle('hiddenPage', !$.session.emarVisible);
            wlForms['DemographicInfo'].inputs['dIDNROnFile'].rootElement.classList.toggle('hiddenPage', !$.session.emarVisible);
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

    async function init(opts) {
        wlCircID = '';
        wlNeedID = '';
        wlForms = {};
        tocLinks = {};
        wlDocuments = [];
        wlLocations = {};
        wlAppoinment = {};
        wlRelationship = {};
        wlCategory = {};
        if ($.session.applicationName === 'Advisor') {
            locationData = opts.locations;
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

        if ($.session.applicationName === 'Advisor') {
            attachEvents();
        }

        for (section in wlData) {
            wlForms[section].populate(wlData[section]);
        }

        if ($.session.applicationName === 'Advisor') {
            locationsTable.populate(Object.values(wlLocations));
            locationsForm.form.classList.add('hiddenPage');

            relationshipTable.populate(Object.values(wlRelationship));
            categoryTable.populate(Object.values(wlCategory));

            appoinmentTable.populate(Object.values(wlAppoinment));
            appoinmentForm.form.classList.add('hiddenPage');
        }

        showHideSections();
    }

    return { init, unload };
})();
