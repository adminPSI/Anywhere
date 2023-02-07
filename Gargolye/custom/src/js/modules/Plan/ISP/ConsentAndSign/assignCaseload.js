const csAssignCaseload = (() => {
    let consumerswithSaleforceIds;
    let caseManagersfromOptionsTable;
    let assignmentResults;
    let selectedCaseManagerName;
    let selectedCaseManagerId;
    let consumersSelected;
    let currentconsumersSelected;
    let currentCaseManagerSelected;
    let assignBtn;

  async function showAssignCaseLoadPopup() {
    const assignCaseLoadPopup = POPUP.build({
      id: 'sig_assignCaseLoadPopup',
      classNames: 'assignCaseLoad-container',
     // hideX: true,
      header: 'Assign Case Load',
    });

    caseManagersfromOptionsTable = await consentAndSignAjax.getCaseManagersfromOptionsTable({
      token: $.session.Token,
    });

    consumerswithSaleforceIds = await consentAndSignAjax.getConsumerswithSaleforceIds({
      token: $.session.Token,
    });

     let CaseManagerHeadingDiv = document.createElement("div")
     CaseManagerHeadingDiv.classList.add("assignCaseLoad-peoplelist")
     CaseManagerHeadingDiv.innerHTML = `<b>Select a Case Manager</b>`;

      let selectCaseManagerDIV = document.createElement("select");
      selectCaseManagerDIV.setAttribute("id", "leftselector");
      selectCaseManagerDIV.setAttribute("size", "6");
      selectCaseManagerDIV.classList.add("assignCaseLoad-peoplelist")
      selectCaseManagerDIV.addEventListener("click", function() {
        currentCaseManagerSelected = Array.from(document.querySelector('#leftselector').options).filter
        (function (option) {return option.selected;});

        currentconsumersSelected = Array.from(document.querySelector('#rightselector').options).filter
        (function (option) {return option.selected;});

        if (currentCaseManagerSelected.length > 0 && currentconsumersSelected > 0) {
          assignBtn.classList.remove('disabled');
        } else {
          assignBtn.classList.add('disabled');
        }

     });

     caseManagersfromOptionsTable.forEach(person => {
      let caseManageroption = document.createElement("option");
      caseManageroption.value = person.id;
      caseManageroption.text = person.name;
      selectCaseManagerDIV.appendChild(caseManageroption);
     });

    let consumerHeadingDiv = document.createElement("div")
    consumerHeadingDiv.classList.add("assignCaseLoad-peoplelist")
    consumerHeadingDiv.innerHTML = `<b>Select one (or multiple) consumers</b>`;

     let selectConsumerDIV = document.createElement("select");
     selectConsumerDIV.setAttribute("id", "rightselector");
     selectConsumerDIV.setAttribute("multiple", "multiple");
     selectConsumerDIV.setAttribute("size", "6");
     selectConsumerDIV.classList.add("assignCaseLoad-peoplelist")
     selectConsumerDIV.addEventListener("click", function() {
        currentconsumersSelected = Array.from(document.querySelector('#rightselector').options).filter
        (function (option) {return option.selected;});

        currentCaseManagerSelected = Array.from(document.querySelector('#leftselector').options).filter
        (function (option) {return option.selected;});

        if (currentconsumersSelected.length > 0 && currentCaseManagerSelected.length > 0) {
          assignBtn.classList.remove('disabled');
        } else {
          assignBtn.classList.add('disabled');
        }

     });

     consumerswithSaleforceIds.forEach(person => {
     let consumersoption = document.createElement("option");
     consumersoption.value = person.id;
     consumersoption.text = person.name;
     selectConsumerDIV.appendChild(consumersoption);
    });

     assignBtn = button.build({
      text: 'ASSIGN',
      style: 'secondary',
      type: 'contained',
      callback: async function () {

          selectedCaseManagerId = document.querySelector('#leftselector').value;
          selectedCaseManagerName = document.querySelector('#leftselector').selectedOptions[0].innerHTML;
          consumersSelected = Array.from(document.querySelector('#rightselector').options).filter
          (function (option) {return option.selected;});

            const selectedConsumerObjs = consumersSelected.map( pers => (
              {
                id: pers.value, 
                name: pers.text
              }
            ));

            let listofSelectedConsumers = `These individuals are about to be assigned in Salesforce to ${selectedCaseManagerName}. Do you want to proceed?\n`
          
            selectedConsumerObjs.forEach(person => {
              listofSelectedConsumers = listofSelectedConsumers + `\t* ${person.name}\n`
            })

            if (
              confirm(listofSelectedConsumers)
            ) {

                assignmentResults = await consentAndSignAjax.assignStateCaseManagertoConsumers({
                  // token: $.session.Token,
                  caseManagerId: selectedCaseManagerId,
                  consumers: selectedConsumerObjs,
                });
        
                var processedStateConsumerObjs = JSON.parse(assignmentResults);
                
                  let listofProcessedConsumers = `The following consumers were assigned to ${selectedCaseManagerName}.\n`
                  processedStateConsumerObjs.forEach(person => {
                    listofProcessedConsumers = listofProcessedConsumers + `\t* ${person.name} assign result:  ${person.assignresult} \n`
                  })

              alert(listofProcessedConsumers);  
              
              POPUP.hide(assignCaseLoadPopup);
                      
            } else {
              alert(
                `Consumers were NOT assigned to ${selectedCaseManagerName}.`            
              );
              POPUP.hide(assignCaseLoadPopup);       
            }
      },
    });

    var cancelBtn = button.build({
      text: 'CANCEL',
      style: 'secondary',
      type: 'contained',
      callback: function () {
        POPUP.hide(assignCaseLoadPopup);
      },
    });

    var btnWrap = document.createElement('div');
    btnWrap.classList.add('btnWrap-popup');
    assignBtn.classList.add('disabled');
    btnWrap.appendChild(assignBtn)
    btnWrap.appendChild(cancelBtn)
    CaseManagerHeadingDiv
    assignCaseLoadPopup.appendChild(CaseManagerHeadingDiv);
    assignCaseLoadPopup.appendChild(consumerHeadingDiv);
    assignCaseLoadPopup.appendChild(selectCaseManagerDIV);
    assignCaseLoadPopup.appendChild(selectConsumerDIV);
    assignCaseLoadPopup.appendChild(btnWrap);
   // assignCaseLoadPopup.appendChild(assignBtn);
   // assignCaseLoadPopup.appendChild(cancelBtn);
    
    POPUP.show(assignCaseLoadPopup);
  }

    return {
        showAssignCaseLoadPopup,
        
      };
    })();