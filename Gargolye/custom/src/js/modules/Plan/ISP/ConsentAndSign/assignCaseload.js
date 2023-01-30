const csAssignCaseload = (() => {
    
  function showAssignCaseLoadPopup() {
    const assignCaseLoadPopup = POPUP.build({
      id: 'sig_assignCaseLoadPopup',
      classNames: 'assignCaseLoad-container',
     // hideX: true,
      header: 'Assign Case Load',
    });

    // TODO 96855: Replace this data with a call to the GK database ABD Double check this works for GK AND ADV
    // NEW -- ANYW_ISP_GetCaseManagersfromOptionsTable -- need AJAX and C# layers
    // SELECT p.ID as peopleId, p.Last_Name + ', ' + p.First_Name as name, cmo.Salesforce_ID as salesForceId FROM "dba"."ANYW_ISP_Case_Manager_Options" cmo
    // join people p on p.Salesforce_ID = cmo.Salesforce_ID order by p.Last_Name, p.First_Name
    let SSAlist = [
      {
        'value' : '17094',
        'name' : 'OISP-SSA, FRANKTHREE',
      },
      {
        'value' : '17093',
        'name' : 'OISP-SSA, FRANKTWO',
      },
      {
        'value' : '17010',
        'name' : 'Turner, Jim',
      }
    ]

    // TODO 96855: Replace this data with a call to the GK database ABD Double check this works for GK AND ADV
    // NEW -- ANYW_ISP_GetConsumerswithSaleforceIds -- need AJAX and C# layers
    //Select p.ID as peopleId, p.Last_Name + ', ' + p.First_Name + ' (' + Cast(p.Date_of_Birth as varchar(10)) + ')' as name, p.Salesforce_ID as salesForceId from people p  
    //join Person_Type pt on p.ID = pt.ID
    //where (p.Salesforce_ID is not null and  p.Salesforce_ID <> '') and pt.Type_ID = 1 
    //order by p.Last_Name, p.First_Name

    let consumerlist = [
      {
        'value' : '17080',
        'name' : 'OISP, FranklinOne (1989-07-04)',
      },
      {
        'value' : '17016',
        'name' : 'OISP, FranklinTwo (2017-05-05)',
      },
      {
        'value' : '1352',
        'name' : 'OISP-Dill, Joshua (1983-01-14)',
      },
      {
        'value' : '139',
        'name' : 'OISP-Kernan, FranklinThree (1942-09-02)',
      },
      {
        'value' : '6892',
        'name' : 'Orozco-Ruiz, Cristobal (2008-04-27)',
      },
      {
        'value' : '2568',
        'name' : 'Orsini, Jaggerd (1983-02-25)',
      }
    ]


    let leftselectDiv = document.createElement("div")
    leftselectDiv.classList.add("assignCaseLoad-peoplelist")
    let selectleftHTML = `<select id='leftselector' size='3'>`

    SSAlist.forEach(person => {
      selectleftHTML = selectleftHTML + `<option value='${person.value}'>${person.name}</option>` })

      selectleftHTML = selectleftHTML + `</select>`;
      leftselectDiv.innerHTML = selectleftHTML;

    let rightselectDiv = document.createElement("div")
     rightselectDiv.classList.add("assignCaseLoad-peoplelist")

     let selectrightHTML = `<select id='rightselector' multiple='multiple' size='6'>`

     consumerlist.forEach(person => {
       selectrightHTML = selectrightHTML + `<option value='${person.value}'>${person.name}</option>` })
 
       selectrightHTML = selectrightHTML + `</select>`;
       rightselectDiv.innerHTML = selectrightHTML;
 
     var saveBtn = button.build({
      text: 'SAVE',
      style: 'secondary',
      type: 'contained',
      callback: function () {

        const SSASelected = document.querySelector('#leftselector').value;
       const consumersSelected = Array.from(document.querySelector('#rightselector').options).filter
       (function (option) {return option.selected;});

        const consumerObjs = consumersSelected.map( pers => (
          {
            peopleId: pers.value, 
            name: pers.text
          }
        ));

        let output = `List of selected consumers:\n`
       
       consumerObjs.forEach(person => {
          // TODO 96855: this is a C# call (not JS)  -- need AJAX and C# layers
          // OISPDLL.AddCaseMangerToIndividal(ByVal PeopleID As Long, ByVal CasemangerPeopleID As Long, ByVal Status As String) As String
          // let returnmsg = OISPDLL.AddCaseMangerToIndividal(person.peopleId, SSASelected, 'Assigned'); 
          // if (returnmsg = 'failed') --> then add person.name to the output
          output = output + `\t* ${person.name}\n`
        })

        alert(output);

        POPUP.hide(assignCaseLoadPopup);
      },
    });


    // var btnWrap = document.createElement('div');
    // btnWrap.classList.add('btnWrap');
    // btnWrap.appendChild(saveBtn)

    assignCaseLoadPopup.appendChild(leftselectDiv);
    assignCaseLoadPopup.appendChild(rightselectDiv);
    assignCaseLoadPopup.appendChild(saveBtn);

    POPUP.show(assignCaseLoadPopup);
  }
  
    return {
        showAssignCaseLoadPopup,
        
      };
    })();