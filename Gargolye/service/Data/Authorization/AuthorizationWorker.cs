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
        public class FilterResults
        {
            public string CompletionDate { get; set; }
            public string plan_year_start { get; set; }
            public string plan_year_end { get; set; }
            public string sourceAndCaption { get; set; }
            public string frequency { get; set; }
            public string vendorName { get; set; }
            public string BeginDate { get; set; }
            public string EndDate { get; set; }
            public string description { get; set; }
            public string service_code { get; set; }

        }

        public string getAuthorizationPageData(string code, string matchSource, string vendorId, string planType, string planYearStartStart, string planYearStartEnd,
                                string planYearEndStart, string planYearEndEnd, string completedDateStart, string completedDateEnd, string selectedConsumerId)
        {
            string jsonResult = "";
            string fieldId = "Match Source";
            sb.Clear();
            sb.Append("select p.CompletionDate,p.plan_year_start,p.plan_year_end,p.match_source+' '+ct.caption as sourceAndCaption,pd.period as frequency,v.name as vendorName, ");
            sb.Append("pd.BeginDate,pd.EndDate,si.description,si.service_code ");
            sb.Append("from dba.pas as p ");
            sb.Append("left outer join dba.pas_detail as pd on pd.pas_id = p.pas_id ");
            sb.Append("left outer join dba.vendor as v on v.vendor_id = pd.vendor_id ");
            sb.Append("left outer join dba.service_info as si on si.service_id = pd.service_id ");
            sb.Append("left outer join dba.code_table as ct on ct.code = p.Match_Source ");
            sb.AppendFormat("where ct.Code = '{0}' ", code);
            sb.AppendFormat("and ct.Field_ID = '{0}' ", fieldId);
            sb.AppendFormat("and p.Match_Source = '{0}' ", matchSource);
            sb.AppendFormat("and v.vendor_id = '{0}' ", vendorId);
            sb.AppendFormat("and p.planType = '{0}' ", planType);
            sb.AppendFormat("p.plan_year_start between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
            sb.AppendFormat("p.Plan_Year_End between '{0}' and '{1}' ", planYearEndStart, planYearEndEnd);
            sb.AppendFormat("p.CompletionDate between '{0}' and '{1}' ", completedDateStart, completedDateEnd);
            sb.AppendFormat("p.Id = '{0}' ", selectedConsumerId);
            DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
            jsonResult = DataTableToJSONWithJSONNet(dt);
            //FilterResults[] filterResultssObj = js.Deserialize<FilterResults[]>(jsonResult.ToString());

            return jsonResult;
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
            string vendorsString = adg.getServiceVendors(token);
            PlanVendors[] vendorsObj = js.Deserialize<PlanVendors[]>(vendorsString);

            AuthorizationPopup ap = new AuthorizationPopup();
            ap.matchSources = matchSourcesObj;
            ap.planVendors = vendorsObj;

            return ap;
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