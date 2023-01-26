const csAssignCaseload = (() => {
    let test;

    // *  TODO JOE: THIS JUST TESTING
  function showAssignCaseLoadPopup() {
    const assignCaseLoadPopup = POPUP.build({
      id: 'sig_assignCaseLoadPopup',
      classnames: 'assignCaseLoad-container',
     // hideX: true,
      header: 'Assign Case Load',
    });

    let SSAlist = [
      {
        'value' : '0011R000003GE3GQAW',
        'name' : 'Frank Sullivan',
      },
      {
        'value' : '0022R000003GE3GQAW',
        'name' : 'Derf Roeger',
      },
      {
        'value' : '0033R000003GE3GQAW',
        'name' : 'Jeff Wiedl',
      }
    ]

    let consumerlist = [
      {
        'value' : '0044R000003GE3GQAW',
        'name' : 'Matt Mahew',
      },
      {
        'value' : '0055R000003GE3GQAW',
        'name' : 'Scott Smith',
      },
      {
        'value' : '0066R000003GE3GQAW',
        'name' : 'Scott Curtis',
      },
      {
        'value' : '0077R000003GE3GQAW',
        'name' : 'Brent Norman',
      },
      {
        'value' : '0088R000003GE3GQAW',
        'name' : 'Kathy Shields',
      },
      {
        'value' : '0099R000003GE3GQAW',
        'name' : 'Lori Gelder',
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

        const Value = document.querySelector('#leftselector').value;
        const Value2 = document.querySelector('#rightselector').select;
        const value3 = Array.from(document.querySelector('#rightselector').options).filter(function (option) {return option.selected;}).map(function (option) {return option.value;});

        alert(
          `leftside: ${Value}. rightside: ${value3[0]}, ${value3[1]}, ${value3[2]}.`,
        );

        POPUP.hide(assignCaseLoadPopup);
      },
    });

    assignCaseLoadPopup.appendChild(leftselectDiv);
    assignCaseLoadPopup.appendChild(rightselectDiv);
    assignCaseLoadPopup.appendChild(saveBtn);

    POPUP.show(assignCaseLoadPopup);
  }
  
    return {
        showAssignCaseLoadPopup,
        
      };
    })();