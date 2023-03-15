const communityBasedAssessmentSummaryForm = (() => {

  // Inputs
  let monthYearDropdown;
  let referenceNumberDropdown;
  let nextScheduledReviewInput;
  let selfAssessmentInput;
  let referralQuestionsInput;
  let employerAssessmentInput;
  let providerAssessmentInput;
  let supportAndTransitionInput;
  let reviewVTSDropdown;

  // values
  let consumerId;
  let emReviewId;
  let emReviewDate;         // monthYearDropdown
  let emReviewDateDBValue;  // monthYearDropdown  
  let emReferenceNumber;    // referenceNumberDropdown
  let emNextScheduledReview;  //  nextScheduledReviewInput
  let emSummaryIndivSelfAssessment;   //  selfAssessmentInput
  let emReferralQuestions;  //referralQuestionsInput
  let emSummaryIndivEmployerAssessment;  // employerAssessmentInput
  let emSummaryIndivProviderAssessment;  // providerAssessmentInput
  let emSupportandTransition;  //supportAndTransitionInput
  let emReviewVTS;   // reviewVTSDropdown

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
const SERVICETYPE = 'T2';  // Form 8

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
            emSummaryIndivSelfAssessment = emReviewData.emSummaryIndivSelfAssessment;  
            emSummaryIndivEmployerAssessment = emReviewData.emSummaryIndivEmployerAssessment; 
           emSummaryIndivProviderAssessment = emReviewData.emSummaryIndivProviderAssessment; 
           emSupportandTransition = emReviewData.emSupportandTransition;
           emReviewVTS = emReviewData.emReviewVTS;

          } else {
            userId = $.session.UserId;
            serviceId = selectedServiceId;
            emReviewId = '0';
            emReviewDate = ('0' + (todaysdate.getMonth() + 1)).slice(-2) + '/' + todaysdate.getFullYear();   
            emReviewDateDBValue = new Date(todaysdate.getFullYear(), todaysdate.getMonth(), 1);      
            emReferenceNumber = '';                    
            emNextScheduledReview = '';
            emSummaryIndivSelfAssessment = '';
            emSummaryIndivEmployerAssessment = '';
            emSummaryIndivProviderAssessment = '';
            emSupportandTransition = '';
            emReviewVTS = '';
            
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
     heading.innerHTML = 'Community Based Assessment -- OOD Form 8 Monthly Summary';
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
     // classNames: 'nextScheduledReviewInput',
      value: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
      readonly: formReadOnly,
			//value: filterValues.serviceDateStart
		  });

    // selfAssessmentInput textarea
    selfAssessmentInput = input.build({
      label: `Summary of Individual's Self-Assessment. Likes and/or Dislikes of Work, concerns, etc. `,
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: emSummaryIndivSelfAssessment,
      readonly: formReadOnly,
      // charLimit: 256,
     // forceCharLimit: true,
    });
   // selfAssessmentInput.classList.add('OODTextArea');

          // employerAssessment textarea
     employerAssessmentInput = input.build({
        label: `Summary of Employer's Assessment of Individual, Performance or Soft Skill Concerns, etc. `,
        type: 'textarea',
        style: 'secondary',
        classNames: 'autosize',
        value: emSummaryIndivEmployerAssessment,
        readonly: formReadOnly,
      });
    //  employerAssessmentInput.classList.add('introTextArea');
  
      // providerAssessment textarea
      providerAssessmentInput = input.build({
        label: `Summary of Provider's Assessment of Individual's Performance and Soft Skill Concerns. Recommendations of next steps or services. `,
        type: 'textarea',
        style: 'secondary',
        classNames: 'autosize',
        value: emSummaryIndivProviderAssessment,
        readonly: formReadOnly,
      });
    //  providerAssessmentInput.classList.add('introTextArea');

    supportAndTransitionInput = input.build({
      label: `Support and Transition Plan. `,
      type: 'textarea',
      style: 'secondary',
      classNames: 'autosize',
      value: emSupportandTransition,
      readonly: formReadOnly,
    });

      // reviewVTS textarea
    reviewVTSDropdown = dropdown.build({
        label: `Has the Vocational Training Stipend (VTS) been reviewed with the individual? Does it only reflect the time the individual participated? Does the individual agree to the amount of the VTS?`,
        dropdownId: "reviewVTSDropdown",
        value: emReviewVTS,
        readonly: formReadOnly,
      });
    //  reviewVTSDropdown.classList.add('introTextArea');


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
      inputContainer1.classList.add('ood_form8monthlysummary_inputContainer1');

      inputContainer1.appendChild(monthYearDropdown);
      inputContainer1.appendChild(referenceNumberDropdown);
      // inputContainer1.appendChild(referenceNumberDropdown);

      //inputContainer1.appendChild(nextScheduledReviewInput);
      
      const nextScheduledReviewInputDIV = document.createElement('div');
      nextScheduledReviewInputDIV.classList.add('nextScheduledReviewInput');
      nextScheduledReviewInputDIV.appendChild(nextScheduledReviewInput);

      inputContainer1.appendChild(nextScheduledReviewInputDIV);

      container.appendChild(inputContainer1);

     container.appendChild(selfAssessmentInput);    
     container.appendChild(employerAssessmentInput);
     container.appendChild(providerAssessmentInput);
     container.appendChild(supportAndTransitionInput);   
     container.appendChild(reviewVTSDropdown);


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
     
    // populateStaticDropDowns();

     DOM.ACTIONCENTER.appendChild(container);

     DOM.autosizeTextarea();

     populateStaticDropDowns();
     populateReferenceNumberDropdown();

     checkRequiredFields(); 

    }

    function getShortDate(fullDate) {

    var thisDate = new Date(fullDate);
    var thisShortDate = (thisDate.getMonth() + 1).toString().padStart(2, "0") + '/' + thisDate.getFullYear();
    return thisShortDate;

    }

    function setReviewStartandEndDates() {

      var dateparts = emReviewDate.split('/');
      var thisMonth = dateparts[0];

      var daysinMonth = dates.getDaysInMonth(emReviewDateDBValue)
      var thisYear = emReviewDateDBValue.getFullYear();

      reviewStartDate = thisYear + '-' + thisMonth + '-01';
      reviewEndDate = thisYear + '-' + thisMonth + '-' + daysinMonth;

    }

    async function populateReferenceNumberDropdown() { 
 
      setReviewStartandEndDates();

        const {
          getConsumerReferenceNumbersResult: referencenumbers,
        } = await OODAjax.getConsumerReferenceNumbersAsync(consumerId, reviewStartDate, reviewEndDate, SERVICETYPE);
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

    // for monthYearDropdown DDL
    function populateStaticDropDowns() {
    
      const yesNoDropdownData = [
        { text: 'SELECT', value: 'SELECT' },
        { text: 'Yes', value: 'Y' },
        { text: 'No', value: 'N' },
        
      ];
      
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
    
    dropdown.populate(reviewVTSDropdown, yesNoDropdownData, emReviewVTS); 

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

      var selfAssessmentInpt = selfAssessmentInput.querySelector('textarea');
      if (selfAssessmentInpt.value === '') {
        selfAssessmentInput.classList.add('error');
      } else {
        selfAssessmentInput.classList.remove('error');
      }
      

      var employerAssessmentInpt = employerAssessmentInput.querySelector('textarea');
      if (employerAssessmentInpt.value === '') {
        employerAssessmentInput.classList.add('error');
      } else {
        employerAssessmentInput.classList.remove('error');
      }

      // provider
      var providerAssessmentInpt = providerAssessmentInput.querySelector('textarea');
      if (providerAssessmentInpt.value === '') {
        providerAssessmentInput.classList.add('error');
      } else {
        providerAssessmentInput.classList.remove('error');
      }

      var supportAndTransitionInpt = supportAndTransitionInput.querySelector('textarea');
      if (supportAndTransitionInpt.value === '') {
        supportAndTransitionInput.classList.add('error');
      } else {
        supportAndTransitionInput.classList.remove('error');
      }

      // var reviewVTSInpt = reviewVTSInput.querySelector('textarea');
      // if (reviewVTSInpt.value === '') {
      //   reviewVTSInput.classList.add('error');
      // } else {
      //   reviewVTSInput.classList.remove('error');
      // }
      
      if (!emReviewVTS || emReviewVTS === '') {
        reviewVTSDropdown.classList.add('error');
      } else {
        reviewVTSDropdown.classList.remove('error');
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

      selfAssessmentInput.addEventListener('input', event => {
        emSummaryIndivSelfAssessment = event.target.value;
      checkRequiredFields();
    });


    employerAssessmentInput.addEventListener('input', event => {
      emSummaryIndivEmployerAssessment = event.target.value;
      checkRequiredFields();
    });

    // provider
    providerAssessmentInput.addEventListener('input', event => {
      emSummaryIndivProviderAssessment = event.target.value;
      checkRequiredFields();
    });

    supportAndTransitionInput.addEventListener('input', event => {
      emSupportandTransition = event.target.value;
      checkRequiredFields();
    });

    reviewVTSDropdown.addEventListener('change', event => {
      var selectedOption = event.target.options[event.target.selectedIndex];
       
      if (selectedOption.value == "SELECT") {
        emReviewVTS = '';
      } else {
        emReviewVTS = selectedOption.value;
      }
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
              emReferenceNumber,
             // emReviewDate: UTIL.formatDateToIso(emReviewDateDBValue.split(' ')[0]), 
             emNextScheduledReview: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
             emSummaryIndivSelfAssessment,
             emSummaryIndivEmployerAssessment,
             emSummaryIndivProviderAssessment,
             emSupportandTransition,
             emReviewVTS,
             userId,
             
            };
            // TODO JOE: need new C# and SP for Form 8
            OODAjax.updateForm8MonthlySummary(data, function(results) {
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
             // emNextScheduledReview: emNextScheduledReviewDBValue.getFullYear() + '-' + (emNextScheduledReviewDBValue.getMonth()).toString().padStart(2, "0") + '-' + '01',
             emReferenceNumber,
             emNextScheduledReview: UTIL.formatDateToIso(emNextScheduledReview.split(' ')[0]),
             emSummaryIndivSelfAssessment,
             emSummaryIndivEmployerAssessment,
             emSummaryIndivProviderAssessment,
             emSupportandTransition,
             emReviewVTS,
             userId,
             serviceId,
           
            };
            // TODO JOE: need new C# and SP for Form 8
            OODAjax.insertForm8MonthlySummary(data, function(results) {
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
          // TODO JOE: need new C# and SP for Form 8 ???
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