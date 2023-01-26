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

    let leftselectDiv = document.createElement("div")
    leftselectDiv.classList.add("assignCaseLoad-peoplelist")
   leftselectDiv.innerHTML = `
   <select id='leftselector' size='3'>
   <option value='0033R000003GE3GQAW'>Frank Sullivan</option>
   <option value='0044R000003GE3GQAW'>Derf Roeger</option>
   <option value='0055R000003GE3GQAW'>Jeff Wiedl</option>
   </select>
    `
    let rightselectDiv = document.createElement("div")
     rightselectDiv.classList.add("assignCaseLoad-peoplelist")
    rightselectDiv.innerHTML = `
    <select id='rightselector' multiple='multiple' size='6'>
    <option value='0066R000003GE3GQAW'>Matt Mahew</option>
    <option value='0077R000003GE3GQAW'>Tim Masingale</option>
    <option value='0088R000003GE3GQAW'>Scott Curtis</option>
    <option value='0099R000003GE3GQAW'>Kathy Shields</option>
    <option value='0011R000003GE3GQAW'>Lori Gelder</option>
    <option value='0022R000003GE3GQAW'>Lisa Golder</option>
    </select>
     `
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