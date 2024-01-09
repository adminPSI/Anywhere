const OODForm4MonthlySummary = (() => {

  // Inputs
  let monthYearDropdown;
  let referenceNumberDropdown;
  let nextScheduledReviewInput;
  let employmentGoalInput;
  let referralQuestionsInput;
  let individualsInputInput;
  let issuesConcernswithProgressInput;
  let planGoalsNextMonthInput;
  let numberConsumerContactsInput;
  let numberEmployerContactsbyConsumerInput;
  let numberEmployerContactsbyStaffInput;
  let numberMonthsinJobDevelopmentInput;

  // values
  let consumerId;
  let emReviewId;
  let emReviewDate;         // monthYearDropdown
  let emReviewDateDBValue;  // monthYearDropdown  
  let emReferenceNumber;    // referenceNumberDropdown
  let emNextScheduledReview;  //  nextScheduledReviewInput
  let emEmploymentGoal;   //  employmentGoalInput
  let emReferralQuestions;  //referralQuestionsInput
  let emIndivInputonSearch;  // individualsInputInput
  let emPotentialIssueswithProgress;   // issuesConcernswithProgressInput
  let emPlanGoalsNextMonth;  // planGoalsNextMonthInput
  let emNumberofConsumerContacts; // numberConsumerContactsInput
  let emNumberEmployerContactsbyConsumer; // numberEmployerContactsbyConsumerInput
  let emNumberEmployerContactsbyStaff; // numberEmployerContactsbyStaffInput
  let emNumberMonthsJobDevelopment;  // numberMonthsinJobDevelopmentInput

  // buttons
  let saveBtn;
  let saveAndNewBtn;
  let cancelBtn;
  let updateBtn;
  let deleteBtn;

  //Review Data
//let caseManagerId;
let userId;
let serviceId;
let reviewStartDate;
let reviewEndDate;

let formReadOnly = false;
const FORMNUMBER = '4'; // Form 4

let OODMonthlySummariesTable; // To be added in future release

    async function init(emReviewData, currentConsumer, selectedServiceId, currentRecordUserId, clickSource = 'OODGrid') {

          DOM.clearActionCenter();
          document.querySelectorAll('.consumerListBtn').forEach(e => e.remove());

          let todaysdate = new Date();
          var thisMonthFirstDay = new Date(todaysdate.getFullYear(), todaysdate.getMonth(), 1);

          consumerId = currentConsumer.id;
          currentEntryUserId = currentRecordUserId;

          if (emReviewData && Object.keys(emReviewData).length !== 0) {

            userId = $.session.UserId;
            emReviewId = emReviewData.emReviewId;
            emReviewDate = getShortDate(emReviewData.emReviewDate); 
            emReviewDateDBValue = new Date(emReviewData.emReviewDate);                         
            emReferenceNumber = emReviewData.emReferenceNumber;
            emNextScheduledReview = emReviewData.emNextScheduledReview;
            emEmploymentGoal = emReviewData.emEmploymentGoal;
            emReferralQuestions = emReviewData.emReferralQuestions;  //-- REMOVED FROM FORM ON 4/7/22
            emIndivInputonSearch = emReviewData.emIndivInputonSearch;
            emPotentialIssueswithProgress = emReviewData.emPotentialIssueswithProgress;
            emPlanGoalsNextMonth = emReviewData.emPlanGoalsNextMonth; //-- REMOVED FROM FORM ON 4/7/22
            emNumberofConsumerContacts = emReviewData.emNumberofConsumerContacts;    //-- REMOVED FROM FORM ON 4/7/22
            emNumberEmployerContactsbyConsumer = emReviewData.emNumberEmployerContactsbyConsumer; //-- REMOVED FROM FORM ON 4/7/22
            emNumberEmployerContactsbyStaff = emReviewData.emNumberEmployerContactsbyStaff; //-- REMOVED FROM FORM ON 4/7/22
            emNumberMonthsJobDevelopment = emReviewData.emNumberMonthsJobDevelopment; //-- REMOVED FROM FORM ON 4/7/22

          } else {
            userId = $.session.UserId;
            serviceId = selectedServiceId;
            emReviewId = '0';
            emReviewDate = ('0' + (todaysdate.getMonth() + 1)).slice(-2) + '/' + todaysdate.getFullYear();   
            emReviewDateDBValue = new Date(todaysdate.getFullYear(), todaysdate.getMonth(), 1);                          
            emReferenceNumber = '';
            emNextScheduledReview = '';
            emEmploymentGoal = '';
            emReferralQuestions = ''; //-- REMOVED FROM FORM ON 4/7/22
            emIndivInputonSearch = '';
            emPotentialIssueswithProgress = '';
            emPlanGoalsNextMonth = '';  //-- REMOVED FROM FORM ON 4/7/22
            emNumberofConsumerContacts = ''; //-- REMOVED FROM FORM ON 4/7/22
            emNumberEmployerContactsbyConsumer = ''; //-- REMOVED FROM FORM ON 4/7/22
            emNumberEmployerContactsbyStaff = ''; //-- REMOVED FROM FORM ON 4/7/22
            emNumberMonthsJobDevelopment = '';  //-- REMOVED FROM FORM ON 4/7/22
          }

          if (clickSource === 'OODGrid' &&  !$.session.OODUpdate) {
            formReadOnly = true;
           }
      
           if (clickSource === 'monthlySummary' &&  !$.session.OODInsert) {
            formReadOnly = true;
           }
      
           if ((userId !== currentRecordUserId)) {
            formReadOnly = true;
           }


         let myconsumer = buildConsumerCard(currentConsumer)

         let container = document.createElement("div");
         container.classList.add("monthlyForm");
        var LineBr = document.createElement('br');

     const heading = document.createElement('h2');
     heading.innerHTML = 'Monthly Placement -- OOD Form 4 Monthly Summary';
     heading.classList.add('OODsectionHeading');

     container.appendChild(myconsumer);
    // container.appendChild(LineBr);
    container.appendChild(LineBr);
    container.appendChild(heading);
    container.appendChild(LineBr);

    //var date = new Date();
    monthYearDropdown = dropdown.build({
      label: 'Month',
      //classNames: 'monthYear',
      dropdownId: "monthYearDropdown",
      value: emReviewDate,
      readonly: formReadOnly,
      // value: ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear()
      //readonly: true,
    });

    referenceNumberDropdown = dropdown.build({
      label: 'Reference Number',
      dropdownId: "referenceNumberDropdown",
      value: emReferenceNumber,
      readonly: formReadOnly,
      // readonly: (userId !== currentRecordUserId) ? true : false,
    });

    nextScheduledReviewInput = input.build({
			type: 'date',
			label: 'Next Scheduled Review',
			style: 'secondary',
      value: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
      readonly: formReadOnly,
			//value: filterValues.serviceDateStart
		  });

    // employmentGoalInput textarea
    employmentGoalInput = input.build({
      label: 'Employment Goal',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: emEmploymentGoal,
      readonly: formReadOnly,
      charLimit: 256,
      forceCharLimit: true,
    });
   // employmentGoalInput.classList.add('OODTextArea');

  // referralQuestionsInput textarea -- REMOVED FROM FORM ON 4/7/22
  referralQuestionsInput = input.build({
      label: 'Referral Questions',
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: emReferralQuestions,
      readonly: formReadOnly,
    });
  //  referralQuestionsInput.classList.add('introTextArea');

          // individualsInput textarea
    individualsInputInput = input.build({
        label: `Individual's Self-Assessment`,
        type: 'textarea',
        style: 'secondary',
        classNames: 'autosize',
        value: emIndivInputonSearch,
        readonly: formReadOnly,
      });
    //  individualsInputInput.classList.add('introTextArea');
  
      // issuesConcernswithProgress textarea
    issuesConcernswithProgressInput = input.build({
        label: `Provider's Assessment & Recommendations`,
        type: 'textarea',
        style: 'secondary',
        classNames: 'autosize',
        value: emPotentialIssueswithProgress,
        readonly: formReadOnly,
      });
    //  issuesConcernswithProgressInput.classList.add('introTextArea');
      
      // planGoalsNextMonth textarea -- REMOVED FROM FORM ON 4/7/22
    planGoalsNextMonthInput = input.build({
        label: 'Plan/Goals for Next Month',
        type: 'textarea',
        style: 'secondary',
        classNames: 'autosize',
        value: emPlanGoalsNextMonth,
        readonly: formReadOnly,
      });
     // planGoalsNextMonthInput.classList.add('introTextArea');
      planGoalsNextMonthInput.addEventListener('input', e => {
        emPlanGoalsNextMonth = e.target.value;
       // updateIntroduction();
      });
  
      //-- REMOVED FROM FORM ON 4/7/22
    numberConsumerContactsInput = input.build({
        id: "numberConsumerContactsInput",
        label: "No. of Consumer Contacts",
        type: "number",
        style: "secondary",
        value: emNumberofConsumerContacts,
        readonly: formReadOnly,
        attributes: [
          { key: "min", value: "0" },
          { key: "max", value: "100" },
          {
            key: "onkeypress",
            value: "return event.charCode >= 48 && event.charCode <= 57"
          }
        ]
      });

      //-- REMOVED FROM FORM ON 4/7/22
    numberEmployerContactsbyConsumerInput = input.build({
        id: "numberEmployerContactsbyConsumerInput",
        label: "No. of Employer Contacts by Consumer",
        type: "number",
        style: "secondary",
        value: emNumberEmployerContactsbyConsumer,
        readonly: formReadOnly,
        attributes: [
          { key: "min", value: "0" },
          { key: "max", value: "100" },
          {
            key: "onkeypress",
            value: "return event.charCode >= 48 && event.charCode <= 57"
          }
        ]
      });

      //-- REMOVED FROM FORM ON 4/7/22
    numberEmployerContactsbyStaffInput = input.build({
        id: "numberEmployerContactsbyStaffInput",
        label: "No. of Employer Contacts by Staff",
        type: "number",
        style: "secondary",
        value: emNumberEmployerContactsbyStaff,
        readonly: formReadOnly,
        attributes: [
          { key: "min", value: "0" },
          { key: "max", value: "100" },
          {
            key: "onkeypress",
            value: "return event.charCode >= 48 && event.charCode <= 57"
          }
        ]
      });

      //-- REMOVED FROM FORM ON 4/7/22
    numberMonthsinJobDevelopmentInput = input.build({
        id: "numberMonthsinJobDevelopmentInput",
        label: "No. of Months in Job Development",
        type: "number",
        style: "secondary",
        value: emNumberMonthsJobDevelopment,
        readonly: formReadOnly,
        attributes: [
          { key: "min", value: "0" },
          { key: "max", value: "100" },
          {
            key: "onkeypress",
            value: "return event.charCode >= 48 && event.charCode <= 57"
          }
        ]
      });

      saveBtn = button.build({
        text: 'Save',
        style : 'secondary',
        type: 'contained',
        icon: 'save',
        classNames: ['caseNoteSave', 'disabled'],
        callback: async () => { 
          insertFormData('save');  
        },
      });
      saveAndNewBtn = button.build({
        text: 'Save & New',
        style : 'secondary',
        type: 'contained',
        icon: 'add',
        classNames: ['caseNoteSave', 'disabled'],
        callback: async () => {
            insertFormData('saveandNew');
        },
      });
      updateBtn = button.build({
        text: 'update',
        style : 'secondary',
        type: 'contained',
        icon: 'add',
      //  classNames: 'disabled',
        callback: async () => {      
           updateFormData(); 
        },
      });
      deleteBtn = button.build({
        text: 'Delete',
        style : 'secondary',
        type: 'contained',
        icon: 'delete',
       // classNames: 'disabled',
        callback: async () => {
          deleteConfirmation(emReviewId); 
        },
      });
      cancelBtn = button.build({
        text: 'cancel',
        style : 'secondary',
        type: 'outlined',
        icon: 'close',
        classNames: ['caseNoteCancel'],
        callback: async () =>  {
          OOD.loadOODLanding();
        },
      });
  
      setupEvents();

      const inputContainer1 = document.createElement('div');
      inputContainer1.classList.add('ood_form4monthlysummary_inputContainer1');

      inputContainer1.appendChild(monthYearDropdown);
      inputContainer1.appendChild(referenceNumberDropdown);
      inputContainer1.appendChild(nextScheduledReviewInput);

      container.appendChild(inputContainer1);

     container.appendChild(employmentGoalInput);    
     container.appendChild(individualsInputInput);
     container.appendChild(issuesConcernswithProgressInput);

    //  container.appendChild(planGoalsNextMonthInput); //-- REMOVED FROM FORM ON 4/7/22
// container.appendChild(referralQuestionsInput); //-- REMOVED FROM FORM ON 4/7/22
     // const inputContainer2 = document.createElement('div');
     // inputContainer2.classList.add('ood_form4monthlysummary_inputContainer2');

     // inputContainer2.appendChild(numberConsumerContactsInput); //-- REMOVED FROM FORM ON 4/7/22
    //  inputContainer2.appendChild(numberEmployerContactsbyConsumerInput); //-- REMOVED FROM FORM ON 4/7/22
     // inputContainer2.appendChild(numberEmployerContactsbyStaffInput); //-- REMOVED FROM FORM ON 4/7/22
     //// inputContainer2.appendChild(numberMonthsinJobDevelopmentInput); //-- REMOVED FROM FORM ON 4/7/22

     // container.appendChild(inputContainer2);

      let updatecontainer = document.createElement("div");
      updatecontainer.classList.add("updatecontainer");

      let updatemessage = document.createElement("div");
      updatemessage.classList.add("updatemessage");
      updatemessage.innerHTML = `<span style="color: red">This record was created by another user therefore no edits can be made.</span>`;
      updatecontainer.appendChild(updatemessage);

      let btnWrap = document.createElement("div");
      btnWrap.classList.add("btnWrap");
      (emReviewId == '0') ? btnWrap.appendChild(saveBtn) :  btnWrap.appendChild(updateBtn);
      (emReviewId == '0') ? btnWrap.appendChild(saveAndNewBtn) : btnWrap.appendChild(deleteBtn) ;

      let btnWrap2 = document.createElement("div");
      btnWrap2.classList.add("btnWrap");
      btnWrap2.appendChild(cancelBtn);

     let btnRow = document.createElement("div");
     btnRow.classList.add("btnRow");
      btnRow.appendChild(btnWrap);
      btnRow.appendChild(btnWrap2);
      if (userId !== currentEntryUserId) btnRow.appendChild(updatecontainer);
     container.appendChild(btnRow);

       var LineBr = document.createElement('br');
       var LineBr2 = document.createElement('br');
       var LineBr3 = document.createElement('br');
       container.appendChild(LineBr);
       container.appendChild(LineBr2);
       container.appendChild(LineBr3);
       
      // NOTE: This summary table will be added in a later release; will need this code eventually -- JMM 02/05/2022
     //  OODMonthlySummariesTable = await buildOODMonthlySummariesTable();
	   // container.appendChild(OODMonthlySummariesTable);
     
     DOM.ACTIONCENTER.appendChild(container);

     DOM.autosizeTextarea();

     populateReferenceNumberDropdown();
     populateStaticDropDowns();

     checkRequiredFields(); 

    }

    function getShortDate(fullDate) {

    var thisDate = new Date(fullDate);
    var thisShortDate = (thisDate.getMonth() + 1).toString().padStart(2, "0") + '/' + thisDate.getFullYear();
    return thisShortDate;

    }

    async function populateReferenceNumberDropdown() { 
 
        setReviewStartandEndDates();

          const {
            getConsumerReferenceNumbersResult: referencenumbers,
          } = await OODAjax.getConsumerReferenceNumbersAsync(consumerId, reviewStartDate, reviewEndDate, FORMNUMBER);
        // const templates = WorkflowViewerComponent.getTemplates();
        let data = referencenumbers.map((referencenumber) => ({
          id: referencenumber.referenceNumber, 
          value: referencenumber.referenceNumber, 
          text: referencenumber.referenceNumber,
        })); 

        
        if (data.length == 0) {
            displaynoReferenceNumberPopup();
        } 

        // if creating a new record and there is only one referenceNumber in the data, then automatically select it in the DDL
        if (emReferenceNumber == '' && data.length == 1) {
          emReferenceNumber = data[0].value;
        }

        if (!emReferenceNumber || emReferenceNumber === '') {
          referenceNumberDropdown.classList.add('error');
        } else {
          referenceNumberDropdown.classList.remove('error');
        }

        data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
        dropdown.populate("referenceNumberDropdown", data, emReferenceNumber); 

    }

    function setReviewStartandEndDates() {

      var dateparts = emReviewDate.split('/');
      var thisMonth = dateparts[0];

      var daysinMonth = dates.getDaysInMonth(emReviewDateDBValue)
      var thisYear = emReviewDateDBValue.getFullYear();

      reviewStartDate = thisYear + '-' + thisMonth + '-01';
      reviewEndDate = thisYear + '-' + thisMonth + '-' + daysinMonth;

    }

    function displaynoReferenceNumberPopup() {

      // no reference Numbers
			let noReferenceNumberPopup = POPUP.build({
				header: "No Reference Numbers Found",
				hideX: true,
				id: "noReferenceNumberPopup"
			});   

			let OKBtn = button.build({
				text: 'Ok',
				style: 'secondary',
				type: 'contained',
				callback: function () {
				  POPUP.hide(noReferenceNumberPopup);
				 // overlay.hide();

				},
			  });

			  let btnWrap = document.createElement("div");
			  let warningMessage = document.createElement('p');
			  warningMessage.innerHTML = 'There are no reference numbers for this consumer and date combination. Please change the Month/Year to see a list of valid reference numbers or contact your Advisor Administrator to enter an OOD Authorization for the selected consumer.';
			  btnWrap.classList.add("btnWrap");
			  btnWrap.appendChild(OKBtn);    
			  //noServicesPopup.appendChild(consumerServicesDropdown);
			  noReferenceNumberPopup.appendChild(warningMessage);
			  noReferenceNumberPopup.appendChild(btnWrap);
			 	overlay.show();
			  POPUP.show(noReferenceNumberPopup);

    }

    // for monthYearDropdown DDL
    function populateStaticDropDowns() {
    
      var mydate = new Date();
      var arrayDates = [];

      for (let i = 0; i < 24; i++) {
      var firstDay = new Date(mydate.getFullYear() - 1, mydate.getMonth() + i, 1);
      arrayDates.push({
        partialdate: (firstDay.getMonth() +1).toString().padStart(2,"0") + '/' + (firstDay.getFullYear().toString()),
        fulldate: firstDay.toDateString(),
      });
    }

    let data = arrayDates.map((thisDate) => ({
      id: thisDate.fulldate, 
      value: thisDate.partialdate, 
      text: thisDate.partialdate,
    })); 
    data.unshift({ id: null, value: 'SELECT', text: 'SELECT' }); //ADD Blank value         
    dropdown.populate("monthYearDropdown", data, emReviewDate);          
    }

    function checkRequiredFields() {

      if (!emReviewDate || emReviewDate === '') {
        monthYearDropdown.classList.add('error');
      } else {
        monthYearDropdown.classList.remove('error');
      }

      if (!emReferenceNumber || emReferenceNumber === '') {
        referenceNumberDropdown.classList.add('error');
      } else {
        referenceNumberDropdown.classList.remove('error');
      }

      if (!emNextScheduledReview || emNextScheduledReview === '') {
        nextScheduledReviewInput.classList.add('error');
      } else {
        nextScheduledReviewInput.classList.remove('error');
      }

      var employmentGoalInpt = employmentGoalInput.querySelector('textarea');
      if (employmentGoalInpt.value === '') {
        employmentGoalInput.classList.add('error');
      } else {
        employmentGoalInput.classList.remove('error');
      }
      //-- REMOVED FROM FORM ON 4/7/22
      var referralQuestionsInpt = referralQuestionsInput.querySelector('textarea');  //-- REMOVED FROM FORM ON 4/7/22
      if (referralQuestionsInpt.value === '') {
        referralQuestionsInput.classList.add('error');
      } else {
        referralQuestionsInput.classList.remove('error');
      }

      var individualsInputInpt = individualsInputInput.querySelector('textarea');
      if (individualsInputInpt.value === '') {
        individualsInputInput.classList.add('error');
      } else {
        individualsInputInput.classList.remove('error');
      }

      var issuesConcernswithProgressInpt = issuesConcernswithProgressInput.querySelector('textarea');
      if (issuesConcernswithProgressInpt.value === '') {
        issuesConcernswithProgressInput.classList.add('error');
      } else {
        issuesConcernswithProgressInput.classList.remove('error');
      }
      //-- REMOVED FROM FORM ON 4/7/22
      var planGoalsNextMonthInpt = planGoalsNextMonthInput.querySelector('textarea');
      if (planGoalsNextMonthInpt.value === '') {
        planGoalsNextMonthInput.classList.add('error');
      } else {
        planGoalsNextMonthInput.classList.remove('error');
      }
      //-- REMOVED FROM FORM ON 4/7/22
      var numberConsumerContactsInpt = numberConsumerContactsInput.querySelector('#numberConsumerContactsInput'); 
      if (numberConsumerContactsInpt.value === '' ) {
        numberConsumerContactsInput.classList.add('error');
      } else {
        numberConsumerContactsInput.classList.remove('error');
      }
      //-- REMOVED FROM FORM ON 4/7/22
      var numberEmployerContactsbyConsumerInpt = numberEmployerContactsbyConsumerInput.querySelector('#numberEmployerContactsbyConsumerInput');
      if (numberEmployerContactsbyConsumerInpt.value === '' ) {
        numberEmployerContactsbyConsumerInput.classList.add('error');
      } else {
        numberEmployerContactsbyConsumerInput.classList.remove('error');
      }
      //-- REMOVED FROM FORM ON 4/7/22
      var numberEmployerContactsbyStaffInpt = numberEmployerContactsbyStaffInput.querySelector('#numberEmployerContactsbyStaffInput');
      if (numberEmployerContactsbyStaffInpt.value === '' ) {
        numberEmployerContactsbyStaffInput.classList.add('error');
      } else {
        numberEmployerContactsbyStaffInput.classList.remove('error');
      }
      //-- REMOVED FROM FORM ON 4/7/22
      var numberMonthsinJobDevelopmentInpt = numberMonthsinJobDevelopmentInput.querySelector('#numberMonthsinJobDevelopmentInput');
      if (numberMonthsinJobDevelopmentInpt.value === '' ) {
        numberMonthsinJobDevelopmentInput.classList.add('error');
      } else {
        numberMonthsinJobDevelopmentInput.classList.remove('error');
      }

      setBtnStatus();
    }

    function checknextScheduledReviewDateInput() {
      let todaydate = new Date();
      let thisNextReviewDate = new Date(emNextScheduledReview);
  
      var isDateBefore = dates.isBefore(thisNextReviewDate, todaydate);
  
      if (isDateBefore) {
        nextScheduledReviewInput.classList.add('error');
      } else {
        nextScheduledReviewInput.classList.remove('error');
      }

    }

    function setBtnStatus() {
      var hasErrors = [].slice.call(document.querySelectorAll('.error'));
      if ((hasErrors.length !== 0) || formReadOnly) {
          saveBtn.classList.add('disabled');
          saveAndNewBtn.classList.add('disabled');
          updateBtn.classList.add('disabled');
        } else {
          saveBtn.classList.remove('disabled');
          saveAndNewBtn.classList.remove('disabled');
          updateBtn.classList.remove('disabled');
        }
  
        if ((userId !== currentEntryUserId) || !$.session.OODDelete) {
          deleteBtn.classList.add('disabled');
        } else {
          deleteBtn.classList.remove('disabled')
        }
  
    }

    function setupEvents() {
     
      monthYearDropdown.addEventListener('change', event => {
        var selectedOption = event.target.options[event.target.selectedIndex];
        var dateparts = selectedOption.value.split('/');
        var updatedFullDate = new Date(dateparts[1], dateparts[0] -1, 1)
        emReviewDateDBValue = updatedFullDate;
         
        if (selectedOption.value == "SELECT") {
          emReviewDate = '';
        } else {
          emReviewDate = selectedOption.value;
        }

        emReferenceNumber = '';
        populateReferenceNumberDropdown();
        checkRequiredFields();
      });

      referenceNumberDropdown.addEventListener('change', event => {
        var selectedOption = event.target.options[event.target.selectedIndex];
         
        if (selectedOption.value == "SELECT") {
          emReferenceNumber = '';
        } else {
          emReferenceNumber = selectedOption.value;
        }
        checkRequiredFields();
      });

      nextScheduledReviewInput.addEventListener('change', event => {
        emNextScheduledReview = event.target.value;
       checknextScheduledReviewDateInput();
        setBtnStatus();
        
      });
      // nextScheduledReviewInput.addEventListener('keydown', event => {
      //   event.preventDefault();
      //   event.stopPropagation();
      // });


    employmentGoalInput.addEventListener('input', event => {
      emEmploymentGoal = event.target.value;
      checkRequiredFields();
    });

    //-- REMOVED FROM FORM ON 4/7/22
    referralQuestionsInput.addEventListener('input', event => {
      emReferralQuestions = event.target.value;
      checkRequiredFields();
    });

    individualsInputInput.addEventListener('input', event => {
      emIndivInputonSearch = event.target.value;
      checkRequiredFields();
    });

    issuesConcernswithProgressInput.addEventListener('input', event => {
      emPotentialIssueswithProgress = event.target.value;
      checkRequiredFields();
    });
    //-- REMOVED FROM FORM ON 4/7/22
    planGoalsNextMonthInput.addEventListener('input', event => {
      emPlanGoalsNextMonth = event.target.value;
      checkRequiredFields();
    });
    //-- REMOVED FROM FORM ON 4/7/22
    numberConsumerContactsInput.addEventListener('input', event => {
      emNumberofConsumerContacts = event.target.value;
      checkRequiredFields();
    });
    //-- REMOVED FROM FORM ON 4/7/22
    numberEmployerContactsbyConsumerInput.addEventListener('input', event => {
      emNumberEmployerContactsbyConsumer = event.target.value;
      checkRequiredFields();
    });
    //-- REMOVED FROM FORM ON 4/7/22
    numberEmployerContactsbyStaffInput.addEventListener('input', event => {
      emNumberEmployerContactsbyStaff = event.target.value;
      checkRequiredFields();
    });
    //-- REMOVED FROM FORM ON 4/7/22
    numberMonthsinJobDevelopmentInput.addEventListener('input', event => {
      emNumberMonthsJobDevelopment = event.target.value;
      checkRequiredFields();
    });

    saveAndNewBtn.addEventListener('click', event => {
			// event.target.classList.add('disabled');
      saveAndNewBtn.classList.add('disabled');
      saveBtn.classList.add('disabled');
		});

    saveBtn.addEventListener('click', event => {
			// event.target.classList.add('disabled');
      saveAndNewBtn.classList.add('disabled');
      saveBtn.classList.add('disabled');
		});



  }
        // build the listing of OOD Entries (based off of filter settings) -- Note: will be used in future release -- JMM 02/05/2022
        async function buildOODMonthlySummariesTable() {
            const tableOptions = {
            plain: false,
            tableId: 'OODMonthlySummaryTable',
            columnHeadings: ['Month','Individual Input on Search', 'Potential Issues/Concerns with Progress', 'Plan/Goals for Next Month'],
            endIcon: false,
            
            };
            
	            // FAKE DATA : build table data -- see forms.js line 93
		        const tableData = [{ values : ['11/2021', 'This is my input', 'This is my concern', 'Got no plans, bucko']}, 
		        					{ values : ['11/2021', 'No, this is my input', 'Yes, this is my concern', 'No plans here either']} ];


		    const oTable = table.build(tableOptions);
		    table.populate(oTable, tableData);

	        return oTable;
        }


      	// build display of selected consumers with their associated "Entry" buttons
          function buildConsumerCard(consumer) {

            const consumerRow =  document.createElement('div');
            var LineBr = document.createElement('br');
      
            consumer.card.classList.remove('highlighted');
      
                const wrap = document.createElement('div');
                wrap.classList.add('planConsumerCard');
          
                wrap.appendChild(consumer.card);
      
            consumerRow.appendChild(wrap);
            consumerRow.appendChild(LineBr);
            //  wrap.appendChild(LineBr);
        
            return consumerRow;
          }

          function updateFormData() {

            //var myserviceDate ="2/7/2022 12:00:00 AM";
            // '2022-02-07'
            var data = {
              consumerId,
              emReviewId,
              emReviewDate: emReviewDateDBValue.getFullYear() + '-' + (emReviewDateDBValue.getMonth() +1).toString().padStart(2, "0") + '-' + '01', 
             // emReviewDate: UTIL.formatDateToIso(emReviewDateDBValue.split(' ')[0]), 
              emReferenceNumber,
             emNextScheduledReview: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
              emEmploymentGoal,
              emReferralQuestions,  //-- REMOVED FROM FORM ON 4/7/22
              emIndivInputonSearch,
              emPotentialIssueswithProgress,
              emPlanGoalsNextMonth,   //-- REMOVED FROM FORM ON 4/7/22
              emNumberofConsumerContacts, //-- REMOVED FROM FORM ON 4/7/22
              emNumberEmployerContactsbyConsumer, //-- REMOVED FROM FORM ON 4/7/22
              emNumberEmployerContactsbyStaff, //-- REMOVED FROM FORM ON 4/7/22
              emNumberMonthsJobDevelopment, //-- REMOVED FROM FORM ON 4/7/22
              userId,
            };

            OODAjax.updateForm4MonthlySummary(data, function(results) {
              successfulSave.show();
                setTimeout(function() {
                  successfulSave.hide();
                  OOD.loadOODLanding();
                }, 2000);
              
            });
      
            function getReviewDate(DBValue) {
              if (DBValue instanceof Date && !isNaN(DBValue.valueOf())) {
                    return DBValue.getFullYear() + '-' + (DBValue.getMonth()).toString().padStart(2, "0") + '-' + '1';
              } else {
                    return UTIL.formatDateToIso(DBValue.split(' ')[0]);
              }
            }
          }

          function insertFormData(saveType) {

            var data = {
              consumerId,
              emReviewId,
              emReviewDate: emReviewDateDBValue.getFullYear() + '-' + (emReviewDateDBValue.getMonth() +1).toString().padStart(2, "0") + '-' + '01', 
              emReferenceNumber,
             // emNextScheduledReview: emNextScheduledReviewDBValue.getFullYear() + '-' + (emNextScheduledReviewDBValue.getMonth()).toString().padStart(2, "0") + '-' + '01',
             emNextScheduledReview: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
              emEmploymentGoal,
              emReferralQuestions,  //-- REMOVED FROM FORM ON 4/7/22
              emIndivInputonSearch,
              emPotentialIssueswithProgress,
              emPlanGoalsNextMonth,  //-- REMOVED FROM FORM ON 4/7/22
              emNumberofConsumerContacts, //-- REMOVED FROM FORM ON 4/7/22
              emNumberEmployerContactsbyConsumer, //-- REMOVED FROM FORM ON 4/7/22
              emNumberEmployerContactsbyStaff, //-- REMOVED FROM FORM ON 4/7/22
              emNumberMonthsJobDevelopment, //-- REMOVED FROM FORM ON 4/7/22
              userId,
              serviceId,
            };

            OODAjax.insertForm4MonthlySummary(data, function(results) {
              successfulSave.show();
              if (saveType == 'saveandNew') {
                setTimeout(function() {
                  successfulSave.hide();
                  overlay.show();
                  OOD.buildSummaryServicePopUp(consumerId, 'monthlySummary');
                }, 2000);
              } else {  //save
                setTimeout(function() {
                  successfulSave.hide();
                  OOD.loadOODLanding();
                }, 2000);
              }
            });

          }

          function deleteConfirmation(emReviewId) {
            var deletepopup = POPUP.build({
              id: 'deleteWarningPopup',
              classNames: 'warning',
            });
            var btnWrap = document.createElement('div');
            btnWrap.classList.add('btnWrap');
            var yesBtn = button.build({
              text: 'Yes',
              style: 'secondary',
              type: 'contained',
              icon: 'checkmark',
              callback: async function() {
                        POPUP.hide(deletepopup);
                         let result = await OODAjax.deleteFormMonthlySummaryAsync(emReviewId);  
                         if (result.deleteFormMonthlySummaryResult === "1"){
                              OOD.loadOODLanding();                
                         }
              },
            });
            var noBtn = button.build({
              text: 'No',
              style: 'secondary',
              type: 'contained',
              icon: 'close',
              callback: function() {
                POPUP.hide(deletepopup);
              },
            });
            btnWrap.appendChild(yesBtn);
            btnWrap.appendChild(noBtn);
            var warningMessage = document.createElement('p');
            warningMessage.innerHTML = 'Are you sure you want to delete this record?';
            deletepopup.appendChild(warningMessage);
            deletepopup.appendChild(btnWrap);
            POPUP.show(deletepopup);
          }
          


    return {
        init,
        
      };
    })();