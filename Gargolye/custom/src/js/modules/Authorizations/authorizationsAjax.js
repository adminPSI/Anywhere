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

// select p.CompletionDate,p.plan_year_start,p.plan_year_end,p.plantype,p.match_source as sourceAndCaption, p.ID, p.PL_Vendor_ID as plVendorId, v.name, p.pas_id, p.RevisionNum as revisionNum
// from dba.pas as p
// left outer join code_table as ct on ct.code = p.Match_Source
// left outer join vendor as v on v.Vendor_ID = p.PL_Vendor_ID
// where (ct.Code like '%' or ct.Code is null)
// and (ct.Field_ID = 'Match Source' or ct.Field_ID is null)
// and (p.Match_Source like '%' or p.Match_Source is null)
// and p.planType like '%'
// and (p.PL_Vendor_ID like '%' or p.PL_Vendor_ID is null)
// and p.Id = '17056'
// and p.permanent = 'Y'
