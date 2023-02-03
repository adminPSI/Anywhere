const csAssignCaseload = (() => {
    let consumerswithSaleforceIds;
    let caseManagersfromOptionsTable;
    let assignmentResults;
    let selectedCaseManagerName;
    let selectedCaseManagerId;
    let consumersSelected;

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

    let leftselectDiv = document.createElement("div")
    leftselectDiv.classList.add("assignCaseLoad-peoplelist")
    let selectleftHTML = `<select id='leftselector' size='6'>`

    caseManagersfromOptionsTable.forEach(person => {
      selectleftHTML = selectleftHTML + `<option value='${person.id}'>${person.name}</option>` })

      selectleftHTML = selectleftHTML + `</select>`;
      leftselectDiv.innerHTML = selectleftHTML;

    let consumerHeadingDiv = document.createElement("div")
    consumerHeadingDiv.classList.add("assignCaseLoad-peoplelist")
    consumerHeadingDiv.innerHTML = `<b>Select one (or multiple) consumers</b>`;

    let rightselectDiv = document.createElement("div")
     rightselectDiv.classList.add("assignCaseLoad-peoplelist")

     let selectrightHTML = `<select id='rightselector' multiple='multiple' size='6'>`

     consumerswithSaleforceIds.forEach(person => {
       selectrightHTML = selectrightHTML + `<option value='${person.id}'>${person.name}</option>` })
 
       selectrightHTML = selectrightHTML + `</select>`;
       rightselectDiv.innerHTML = selectrightHTML;
 
     var assignBtn = button.build({
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

       /// alert(listofSelectedConsumers);
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
                listofProcessedConsumers = listofProcessedConsumers + `\t* ${person.name} assign result ${person.assignresult} \n`
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
    btnWrap.appendChild(assignBtn)
    btnWrap.appendChild(cancelBtn)
    CaseManagerHeadingDiv
    assignCaseLoadPopup.appendChild(CaseManagerHeadingDiv);
    assignCaseLoadPopup.appendChild(consumerHeadingDiv);
    assignCaseLoadPopup.appendChild(leftselectDiv);
    assignCaseLoadPopup.appendChild(rightselectDiv);
    assignCaseLoadPopup.appendChild(btnWrap);
   // assignCaseLoadPopup.appendChild(assignBtn);
   // assignCaseLoadPopup.appendChild(cancelBtn);
    

    POPUP.show(assignCaseLoadPopup);
  }
  
    return {
        showAssignCaseLoadPopup,
        
      };
    })();