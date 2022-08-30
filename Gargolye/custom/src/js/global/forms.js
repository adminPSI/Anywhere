var form = (function() {
  function build(options) {
    // options = {
    //   formElements = [
    //     {
    //       tag: input || textarea || select || button,
    //       opts: options needed for above build func
    //     }
    //   ]
    // }

    // setting options
    var formInputs = options.formElements;
    // build form
    var form = document.createElement('div');

    formInputs.forEach(fi => {
      var tag = fi.tag;
      switch(tag) {
        case 'input': {
          var INPUT = input.build(fi.opts);
          form.appendChild(INPUT);
          break;
        }
        case 'select': {
          var SELECT = dropdown.build(fi.opts);
          form.appendChild(SELECT);
          break;
        }
      }
    });

    return form;

  }

  return {
    build
  }
})();

var tmpReports = (function() {
  function init() {
    DOM.clearActionCenter();

    var formElements = [
      {
        tag: 'input',
        opts: {
          label: 'Provider Name',
          type: 'text',
          style: 'secondary',
        }
      },
      {
        tag: 'input',
        opts: {
          label: 'Address',
          type: 'text',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: 'Fiscal Telephone',
          type: 'tel',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: 'Fiscal Email',
          type: 'email',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: 'Fiscal Fax',
          type: 'tel',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: 'Authorization #',
          type: 'num',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: 'Provider Invoice #',
          type: 'num',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Individual's Name`,
          type: 'text',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Direct Service Staff Name(s)`,
          type: 'text',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Person Completing Report`,
          type: 'text',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `VR Counselor/Contractor`,
          type: 'text',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Invoice Date`,
          type: 'date',
          style: 'secondary'
        }
      },
      {
        tag: 'select',
        opts: {
          label: `Invoice Status`,
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Service Start Date`,
          type: 'date',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Service End Date`,
          type: 'date',
          style: 'secondary'
        }
      },
      {
        tag: 'input',
        opts: {
          label: `Service Description`,
          type: 'textarea',
          style: 'secondary'
        }
      },
    ];

    var reportForm = form.build({
      formElements,
      formStyle: 'secondary'
    });

    DOM.ACTIONCENTER.appendChild(reportForm);
  }
  return {
    init
  }
})();