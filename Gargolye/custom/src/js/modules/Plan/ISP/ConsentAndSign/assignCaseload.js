const csAssignCaseload = (() => {
    let test;

    // *  TODO JOE: THIS JUST TESTING
  function showAssignCaseLoadPopup() {
    assignCaseLoadPopup = POPUP.build({
      id: 'sig_assignCaseLoadPopup',
     // hideX: true,
      header: 'Assign Case Load',
    });

    POPUP.show(assignCaseLoadPopup);
  }
  
    return {
        showAssignCaseLoadPopup,
        
      };
    })();