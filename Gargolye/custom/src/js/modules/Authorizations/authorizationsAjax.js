const authorizationsAjax = (function () {
  async function getPageData(retrieveData) {
    // token
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getAuthorizationPageData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getAuthorizationPageDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  async function getFilterDropdownData(retrieveData) {
    // token
    try {
      const data = await $.ajax({
        type: 'POST',
        url:
          $.webServer.protocol +
          '://' +
          $.webServer.address +
          ':' +
          $.webServer.port +
          '/' +
          $.webServer.serviceName +
          '/getAuthorizationFilterData/',
        data: JSON.stringify(retrieveData),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
      });
      return data.getAuthorizationFilterDataResult;
    } catch (error) {
      console.log(error.responseText);
    }
  }

  return {
    getPageData,
    getFilterDropdownData,
  };
})();

// function buildOverviewTable() {
//   const tableData = groupAuthData();

//   overviewTable = document.createElement('div');
//   overviewTable.classList.add('authTable');

//   // HEADING
//   //---------------------------------------------------------
//   const mainHeading = document.createElement('div');
//   mainHeading.classList.add('authTable__header');
//   mainHeading.innerHTML = `
//     <div>Completed</div>
//     <div>Year Start</div>
//     <div>Year End</div>
//     <div>Plan Type</div>
//     <div>PL Vendor</div>
//   `;
//   overviewTable.appendChild(mainHeading);

//   // BODY
//   //---------------------------------------------------------
//   Object.values(tableData).forEach(ad => {
//     const rowWrap = document.createElement('div');
//     rowWrap.classList.add('authTable__subTableWrap');

//     // TOP LEVEL ROW
//     //---------------------------------
//     const mainDataRow = document.createElement('div');
//     mainDataRow.classList.add('authTable__mainDataRow', 'authTable__dataRow');
//     mainDataRow.innerHTML = `
//       <div>${ad.CompletionDate.split('T')[0]}</div>
//       <div>${ad.plan_year_start.split('T')[0]}</div>
//       <div>${ad.plan_year_end.split('T')[0]}</div>
//       <div>${ad.plantype}</div>
//       <div>${ad.vendorName}</div>
//     `;
//     rowWrap.appendChild(mainDataRow);

//     // SUB ROWS
//     //---------------------------------
//     const subRowWrap = document.createElement('div');
//     subRowWrap.classList.add('authTable__subRowWrap');

//     const subHeading = document.createElement('div');
//     subHeading.classList.add('authTable__subHeader');
//     subHeading.innerHTML = `
//       <div>Service</div>
//       <div>Service Code</div>
//       <div>Begin Date</div>
//       <div>End Date</div>
//       <div>Units</div>
//       <div>Frequency</div>
//       <div>Vendor</div>
//       <div>Auth Cost FY1</div>
//       <div>Auth Cost FY2</div>
//     `;
//     subRowWrap.appendChild(subHeading);

//     ad.children.forEach((acd, i) => {
//       const subDataRow = document.createElement('div');
//       subDataRow.classList.add('authTable__subDataRow', 'authTable__dataRow');
//       subDataRow.innerHTML = `
//         <div>${acd.service_code}</div>
//         <div>${acd.service_code}</div>
//         <div>${UTIL.abbreviateDateYear(acd.BeginDate.split('T')[0])}</div>
//         <div>${UTIL.abbreviateDateYear(acd.EndDate.split('T')[0])}</div>
//         <div>${parseInt(acd.FY1_units) + parseInt(acd.FY2_units)}</div>
//         <div>${acd.frequency}</div>
//         <div>${acd.vendorName}</div>
//         <div>${acd.FY1_total_Cost}</div>
//         <div>${acd.FY2_total_Cost}</div>
//       `;
//       subRowWrap.appendChild(subDataRow);
//     });

//     mainDataRow.addEventListener('click', e => {
//       if (subRowWrap.classList.contains('active')) {
//         subRowWrap.classList.remove('active');
//       } else {
//         subRowWrap.classList.add('active');
//       }
//     });

//     // ASSEMBLY
//     rowWrap.appendChild(subRowWrap);
//     overviewTable.appendChild(rowWrap);
//   });

//   pageWrap.appendChild(overviewTable);
// }
