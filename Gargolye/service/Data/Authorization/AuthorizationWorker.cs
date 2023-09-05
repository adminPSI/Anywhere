using Anywhere.Log;
using CrystalDecisions.Shared.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.PlanServicesAndSupports.ServicesAndSupportsWorker;
using Newtonsoft.Json;
using static Anywhere.service.Data.IncidentTrackingWorker;
using System.Management.Automation.Language;
using CrystalDecisions.Shared;
using static Anywhere.service.Data.Authorization.AuthorizationWorker;
using System.Security.Cryptography;

namespace Anywhere.service.Data.Authorization
{
    public class AuthorizationWorker
    {
        private static Loger logger = new Loger();
        private string gSAConnString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        StringBuilder sb = new StringBuilder();
        Sybase di = new Data.Sybase();
        string percent = "%";
        AssessmentDataGetter adg = new AssessmentDataGetter();
        public class PDParent
        {
            public string CompletionDate { get; set; }
            public string plan_year_start { get; set; }
            public string plan_year_end { get; set; }
            public string plantype { get; set; }
            public string sourceAndCaption { get; set; }
            public string plVendorId { get; set; }
            public string pas_id { get; set; }
            public string revisionNum { get; set; }

        }

        public class PDChild
        {
            public string pas_id { get; set; }
            public string frequency { get; set; }
            public string vendorName { get; set; }
            public string BeginDate { get; set; }
            public string EndDate { get; set; }
            public string itemnum { get; set; }
            public string description { get; set; }
            public string service_code { get; set; }
            public string MaxUnits { get; set; }
            public string authCostFY1 { get; set; }
            public string authCostFY2 { get; set; }    
                
            
            
        }

        public class PageData
        {
            public PDParent[] pageDataParent { get; set; }
            public PDChild[] pageDataChild { get; set; }
        }
        public PageData getAuthorizationPageData(string code, string matchSource, string vendorId, string planType, string planYearStartStart, string planYearStartEnd,
                                string planYearEndStart, string planYearEndEnd, string completedDateStart, string completedDateEnd, string selectedConsumerId)
        {
            PageData pageData = new PageData();

            string parentString = getAuthorizationPageDataParent( code,  matchSource,  vendorId,  planType,  planYearStartStart,  planYearStartEnd,
                                 planYearEndStart,  planYearEndEnd,  completedDateStart,  completedDateEnd,  selectedConsumerId);
            PDParent[] parentObj = js.Deserialize<PDParent[]>(parentString);

            string childString = getAuthorizationPageDataChildren(code, matchSource, vendorId, planType, planYearStartStart, planYearStartEnd,
                                 planYearEndStart, planYearEndEnd, completedDateStart, completedDateEnd, selectedConsumerId);
            PDChild[] childObj = js.Deserialize<PDChild[]>(childString);

            pageData.pageDataParent = parentObj;
            pageData.pageDataChild = childObj;

            return pageData;
        }


            //Parent
        public string getAuthorizationPageDataParent(string code, string matchSource, string vendorId, string planType, string planYearStartStart, string planYearStartEnd,
                                string planYearEndStart, string planYearEndEnd, string completedDateStart, string completedDateEnd, string selectedConsumerId)
        {
            try
            {

                string jsonResult = "";
                string fieldId = "Match Source";
                sb.Clear();
  
                sb.Append("select p.CompletionDate,p.plan_year_start,p.plan_year_end,p.plantype,p.match_source + ' ' + ct.caption as sourceAndCaption, p.ID, p.PL_Vendor_ID as plVendorId, v.name, p.pas_id, p.RevisionNum as revisionNum "); 
                sb.Append("from dba.pas as p ");
                sb.Append("join code_table as ct on ct.code = p.Match_Source ");
                sb.Append("left outer join vendor as v on v.Vendor_ID = p.PL_Vendor_ID ");
                sb.AppendFormat("where ct.Code like '{0}' ", code);
                sb.AppendFormat("and ct.Field_ID like '{0}' ", fieldId);
                sb.AppendFormat("and p.Match_Source like '{0}' ", matchSource);
                sb.AppendFormat("and p.planType like '{0}' ", planType);
                sb.AppendFormat("and p.plan_year_start between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
                sb.AppendFormat("and p.CompletionDate between '{0}' and '{1}' ", completedDateStart, completedDateEnd);
                sb.AppendFormat("and p.Id = '{0}' and p.permanent = 'Y' ", selectedConsumerId);
                sb.Append("order by p.CompletionDate desc ");

                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);
                //FilterResults[] filterResultssObj = js.Deserialize<FilterResults[]>(jsonResult.ToString());

                return jsonResult;

            }
            catch (Exception ex)
            {

                
            }
            return String.Empty;
        }

        //Child
        public string getAuthorizationPageDataChildren(string code, string matchSource, string vendorId, string planType, string planYearStartStart, string planYearStartEnd,
                            string planYearEndStart, string planYearEndEnd, string completedDateStart, string completedDateEnd, string selectedConsumerId)
        {

            try
            {

                string jsonResult = "";
                string fieldId = "Match Source";
                sb.Clear();

                sb.Append("select distinct pd.pas_id, pd.period as frequency,v.name as vendorName, pd.BeginDate,pd.EndDate,pd.itemnum, si.description,si.service_code,pd.MaxUnits,pd.AuthorizedCostCFY as authCostFY1,pd.AuthorizedCostNFY as authCostFY2 ");
                sb.Append("from dba.pas as p ");
                sb.Append("join dba.pas_detail as pd on pd.pas_id = p.pas_id ");
                sb.Append("join dba.vendor as v on v.vendor_id = pd.vendor_id ");
                sb.Append("join dba.service_info as si on si.service_id = pd.service_id ");
                sb.Append("where pd.pas_id in (select distinct pas_id ");
                sb.Append("from pas as p ");
                sb.AppendFormat("where p.Match_Source like '{0}' ", matchSource);
                sb.AppendFormat("and p.planType like '{0}' ", planType);
                sb.AppendFormat("and p.plan_year_start between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
                sb.AppendFormat("and p.CompletionDate between '{0}' and '{1}' ", completedDateStart, completedDateEnd);
                sb.AppendFormat("and p.Id = '{0}' and p.permanent = 'Y') ", selectedConsumerId);
                sb.Append("and pd.Detail_Type = 'C' ");
                sb.AppendFormat("and pd.BeginDate between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
                sb.AppendFormat("and pd.enddate between '{0}' and '{1}'", planYearStartStart, planYearStartEnd);

   
                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);
                //FilterResults[] filterResultssObj = js.Deserialize<FilterResults[]>(jsonResult.ToString());

                return jsonResult;

            }
            catch (Exception ex)
            {


            }
            return String.Empty;

        }


            public string DataTableToJSONWithJSONNet(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }

        public string DataTableToJSONWithJavaScriptSerializer(DataTable table)
        {
            JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
            List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
            Dictionary<string, object> childRow;
            foreach (DataRow row in table.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in table.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            return jsSerializer.Serialize(parentRow);
        }

        public AuthorizationPopup getAuthorizationFilterData(string token)
        {
            //MatchSources
            string matchSourcesString = adg.getMatchSources(token);
            MatchSources[] matchSourcesObj = js.Deserialize<MatchSources[]>(matchSourcesString);
            //Vendors
            string vendorsString = getPlanServiceVendors();
            PlanVendors[] vendorsObj = js.Deserialize<PlanVendors[]>(vendorsString);

            AuthorizationPopup ap = new AuthorizationPopup();
            ap.matchSources = matchSourcesObj;
            ap.planVendors = vendorsObj;

            return ap;
        }

        public string getPlanServiceVendors()
        {

            try
            {

                string jsonResult = "";
                sb.Clear();

                sb.Append("select Distinct p.PL_Vendor_ID as vendorId, v.name as vendorName ");
                sb.Append("from dba.pas as p ");
                sb.Append("left outer join vendor as v on v.Vendor_ID = p.PL_Vendor_ID where active = 'Y' ");
                sb.Append("order by vendorName");
                
                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);
                //FilterResults[] filterResultssObj = js.Deserialize<FilterResults[]>(jsonResult.ToString());

                return jsonResult;

            }
            catch (Exception ex)
            {


            }
            return String.Empty;

        }


        public class AuthorizationPopup
        {
            public PlanVendors[] planVendors { get; set; }

            public MatchSources[] matchSources { get; set; }
        }

        
        public class PlanVendors
        {
            public string vendorId { get; set; }
            public string vendorName { get; set; }
        }

        public class MatchSources
        {
            public string code { get; set; }
            public string caption { get; set; }
        }

        
    }
}