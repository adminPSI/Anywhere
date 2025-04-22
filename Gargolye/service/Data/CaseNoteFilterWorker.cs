using Anywhere.Log;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class CaseNoteFilterWorker
    {
        private static Loger logger = new Loger();
        private string gSAConnString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        StringBuilder sb = new StringBuilder();
        Sybase di = new Data.Sybase();
        string percent = "%";

        public string caseNotesFilterBuilder(string token, string billerId, string consumerId, string serviceStartDate, string serviceEndDate,
            string dateEnteredStart, string dateEnteredEnd, string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string corrected, string billed,
            string attachments, string noteText, string applicationName, string outcomeServiceMonitoring)
        {
            string jsonResult = "";
            string query = "";
            if (applicationName.Equals("Advisor"))
            {
                query = filterCaseNoteListQueryADV(billerId, consumerId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, billingCode, reviewStatus,
                                                     location, service, need, contact, confidential, billed, noteText);
            }
            else
            {
                query = filterCaseNoteListQueryGK(billerId, consumerId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd, billingCode, reviewStatus,
                                                         location, service, need, contact, confidential, corrected, billed, attachments, noteText, outcomeServiceMonitoring);
            }

            DataTable dt = di.SelectRowsDS(query).Tables[0];
            jsonResult = DataTableToJSONWithJSONNet(dt);
            return jsonResult;
        }

        public string filterCaseNoteListQueryADV(string billerId, string consumerId, string serviceStartDate, string serviceEndDate, string dateEnteredStart, string dateEnteredEnd,
               string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string billed, string noteText)
        {
            sb.Clear();
            sb.Append("select cn.case_note_id as casenoteid,cn.Service_Date as servicedate,cn.Start_Time as starttime,cn.End_Time as endtime,cn.Case_Manager_ID as casemanagerid,cn.ID,cn.Original_Update as originalupdate, ");
            sb.Append("cn.last_update  as mostrecentupdate,cn.Case_Note_Group_ID as groupnoteid,cn.User_ID as lastupdatedby,p.first_name as firstname,CN.service_id as mainbillingorservicecodeid, cn.Review_Required as review_required, cn.Review_Results as review_result, ");
            sb.Append("p.last_name as lastname,p.consumer_id as consumerid,cn.confidential as confidential,cn.Ratio_Consumers as numberInGroup,cn.Original_User_ID as enteredby,cn.service as serviceCode, cn.notes as caseNote, ");
            sb.Append("dba.ANYW_CaseNotes_GetService(cn.service) as serviceName,dba.ANYW_CaseNotes_GetLocation(cn.Location) as locationName,ug.First_Name+' '+ug.Last_Name as originalUserFullName ");
            sb.Append("from dba.case_notes as cn join dba.people as p on cn.id = p.Consumer_ID join dba.consumers as c on c.consumer_id = p.consumer_id ");
            sb.Append("join dba.Users_Groups as ug on ug.User_ID = cn.Original_User_ID  ");
            sb.AppendFormat("where service_date between '{0}' and '{1}' ", serviceStartDate, serviceEndDate);
            sb.AppendFormat("and cast(original_update as date) between '{0}' and '{1}' ", dateEnteredStart, dateEnteredEnd);
            if (billerId.Equals("%"))
            {
                sb.AppendFormat("and (case_manager_id like '{0}' or case_manager_id is null) ", billerId);
            }
            else
            {
                sb.AppendFormat("and (case_manager_id = '{0}') ", billerId);
            }
            if (consumerId.Equals("%"))
            {
                sb.AppendFormat("and (c.consumer_id like '{0}' or c.consumer_id is null) ", consumerId);
            }
            else
            {
                sb.AppendFormat("and (c.consumer_id = '{0}') ", consumerId);
            }
            if (billingCode.Equals("%"))
            {
                sb.AppendFormat("and (service_id like '{0}' or  service_id is null) ", billingCode);
            }
            else
            {
                sb.AppendFormat("and (service_id = '{0}') ", billingCode);
            }
            if (reviewStatus.Equals("%"))
            {
                sb.AppendFormat("and (review_results like '{0}' or  review_results is null) ", reviewStatus);
            }
            else
            {
                sb.AppendFormat("and (review_required = 'Y' and review_results = '{0}') ", reviewStatus);
            }
            if (location.Equals("%"))
            {
                sb.AppendFormat("and (location like '{0}' or  location is null) ", location);
            }
            else
            {
                sb.AppendFormat("and (location = '{0}') ", location);
            }
            if (service.Equals("%"))
            {
                sb.AppendFormat("and (service like '{0}' or  service is null) ", service);
            }
            else
            {
                sb.AppendFormat("and (service = '{0}') ", service);
            }
            if (need.Equals("%"))
            {
                sb.AppendFormat("and (service_need like '{0}' or  service_need is null) ", need);
            }
            else
            {
                sb.AppendFormat("and (service_need = '{0}') ", need);

            }
            if (contact.Equals("%"))
            {
                sb.AppendFormat("and (contact like '{0}' or  contact is null) ", contact);
            }
            else
            {
                sb.AppendFormat("and (contact = '{0}') ", contact);
            }
            if (confidential.Equals("%"))
            {
                sb.AppendFormat("and (confidential like '{0}' or  confidential is null) ", confidential);
            }
            else
            {
                sb.AppendFormat("and (confidential = '{0}') ", confidential);
            }
            if (billed.Equals("%"))
            {
                sb.AppendFormat("and (billing_id like '{0}' or  billing_id is null) ", billed);
            }
            else if (billed.Equals("Y"))
            {
                sb.AppendFormat("and (billing_id is not null) ");
            }
            else
            {
                sb.AppendFormat("and (billing_id is null) ");
            }
            if (noteText.Equals("%"))
            {
                sb.AppendFormat("and (cn.notes like '{0}' or  cn.notes is null) ", noteText);
            }
            else if (noteText.Equals(""))
            {
                sb.AppendFormat("and (cn.notes is null) ");
            }
            else
            {
                sb.AppendFormat("and (cn.notes like '{0}') ", noteText);
            }

            sb.Append("Group By cn.case_note_id,cn.Service_Date,cn.Start_Time,cn.End_Time,cn.Case_Manager_ID,cn.ID,cn.Original_Update,cn.last_update,cn.review_required,cn.review_results, ");
            sb.Append("cn.Case_Note_Group_ID,cn.User_ID,p.first_name,p.last_name, p.id,cn.confidential,cn.Ratio_Consumers,cn.service_id, ");
            sb.Append("cn.Original_User_ID,  cn.service,cn.notes,cn.Location,ug.First_Name,ug.Last_Name,p.consumer_id ");

            sb.Append("order by cn.service_date desc,cn.Start_Time desc,p.Last_Name asc ");
            string sbToPass = sb.ToString();
            return sbToPass;
        }

        public string filterCaseNoteListQueryGK(string billerId, string consumerId, string serviceStartDate, string serviceEndDate, string dateEnteredStart, string dateEnteredEnd,
               string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string corrected, string billed,
               string attachments, string noteText, string outcomeServiceMonitoring)
        {
            sb.Clear();
            sb.Append("select distinct cn.case_note_id as casenoteid,cn.Service_Date as servicedate,cn.Start_Time as starttime,cn.End_Time as endtime,cn.Case_Manager_ID as casemanagerid,cn.ID,cn.Original_Update as originalupdate, cn.Review_Required as review_required, cn.Review_Results as review_result, ");
            sb.Append("cn.last_update as mostrecentupdate,cn.Case_Note_Group_ID as groupnoteid,cn.User_ID as lastupdatedby,CN.service_id as mainbillingorservicecodeid,p.first_name as firstname,cn.Outcome_Service_Monitoring as outcomeServiceMonitoring, ");
            sb.Append("p.last_name as lastname,p.id as consumerid,cn.confidential as confidential, cn.corrected as corrected, cn.Ratio_Consumers as numberInGroup,cn.Original_User_ID as enteredby, ncr.Any_SSA_Note as isSSANote, Count(cna.Case_Note_ID) as attachcount,cn.service as serviceCode, cn.notes as caseNote, ");
            sb.Append("dba.ANYW_CaseNotes_GetService(cn.service) as serviceName,dba.ANYW_CaseNotes_GetLocation(cn.Location) as locationName,ug.First_Name+' '+ug.Last_Name as originalUserFullName ");
            sb.Append("from dba.case_notes as cn join dba.people as p on cn.id = p.id ");
            sb.Append("LEFT OUTER join dba.Note_Codes_Required as ncr on ncr.Service_ID = cn.Service_ID  ");
            sb.Append("LEFT OUTER join dba.Case_Notes_Attachments as cna on cna.Case_Note_ID = cn.Case_Note_ID  ");
            sb.Append("join dba.Users_Groups as ug on ug.User_ID = cn.Original_User_ID  ");
            sb.AppendFormat("where service_date between '{0}' and '{1}' ", serviceStartDate, serviceEndDate);
            sb.AppendFormat("and cast(original_update as date) between '{0}' and '{1}' ", dateEnteredStart, dateEnteredEnd);
            if (billerId.Equals("%"))
            {
                sb.AppendFormat("and (case_manager_id like '{0}' or case_manager_id is null) ", billerId);
            }
            else
            {
                sb.AppendFormat("and (case_manager_id = '{0}') ", billerId);
            }
            if (consumerId.Equals("%"))
            {
                sb.AppendFormat("and (p.id like '{0}' or p.id is null) ", consumerId);
            }
            else
            {
                sb.AppendFormat("and (p.id = '{0}') ", consumerId);
            }
            if (billingCode.Equals("%"))
            {
                sb.AppendFormat("and (cn.service_id like '{0}' or  cn.service_id is null) ", billingCode);
            }
            else
            {
                sb.AppendFormat("and (cn.service_id = '{0}') ", billingCode);
            }
            if (reviewStatus.Equals("%"))
            {
                sb.AppendFormat("and (review_results like '{0}' or  review_results is null) ", reviewStatus);
            }
            else
            {
                sb.AppendFormat("and (review_required = 'Y' and review_results = '{0}') ", reviewStatus);
            }
            if (location.Equals("%"))
            {
                sb.AppendFormat("and (location like '{0}' or  location is null) ", location);
            }
            else
            {
                sb.AppendFormat("and (location = '{0}') ", location);
            }
            if (service.Equals("%"))
            {
                sb.AppendFormat("and (service like '{0}' or  service is null) ", service);
            }
            else
            {
                sb.AppendFormat("and (service = '{0}') ", service);
            }
            if (need.Equals("%"))
            {
                sb.AppendFormat("and (service_need like '{0}' or  service_need is null) ", need);
            }
            else
            {
                sb.AppendFormat("and (service_need = '{0}') ", need);

            }
            if (contact.Equals("%"))
            {
                sb.AppendFormat("and (contact like '{0}' or  contact is null) ", contact);
            }
            else
            {
                sb.AppendFormat("and (contact = '{0}') ", contact);
            }
            if (confidential.Equals("%"))
            {
                sb.AppendFormat("and (confidential like '{0}' or  confidential is null) ", confidential);
            }
            else
            {
                sb.AppendFormat("and (confidential = '{0}') ", confidential);
            }
            if (corrected.Equals("%"))
            {
                sb.AppendFormat("and (corrected like '{0}' or  corrected is null) ", corrected);
            }
            else
            {
                sb.AppendFormat("and (corrected = '{0}') ", corrected);
            }
            if (outcomeServiceMonitoring.Equals("%"))
            {
                sb.AppendFormat("and (outcomeServiceMonitoring like '{0}' or  outcomeServiceMonitoring is null) ", outcomeServiceMonitoring);
            }
            else
            {
                sb.AppendFormat("and (outcomeServiceMonitoring = '{0}') ", outcomeServiceMonitoring);
            }
            if (billed.Equals("%"))
            {
                sb.AppendFormat("and (billing_id like '{0}' or  billing_id is null) ", billed);
            }
            else if (billed.Equals("Y"))
            {
                sb.AppendFormat("and (billing_id is not null) ");
            }
            else
            {
                sb.AppendFormat("and (billing_id is null) ");
            }
            if (noteText.Equals("%"))
            {
                sb.AppendFormat("and (cn.notes like '{0}' or  cn.notes is null) ", noteText);
            }
            else if (noteText.Equals(""))
            {
                sb.AppendFormat("and (cn.notes is null) ");
            }
            else
            {
                sb.AppendFormat("and (cn.notes like '{0}') ", noteText);
            }
            if (attachments.Equals("%"))
            {
                //Give all records
            }
            else if (attachments.Equals("N"))
            {
                sb.AppendFormat("and (cna.Attachment_ID is null) ");
            }
            else
            {
                sb.AppendFormat("and (cna.Attachment_ID is not null) ");
            }

            sb.Append("Group By cn.case_note_id,cn.Service_Date,cn.Start_Time,cn.End_Time,cn.Case_Manager_ID,cn.ID,cn.Original_Update,cn.last_update,cn.review_required,cn.review_results, ");
            sb.Append("cn.Case_Note_Group_ID,cn.User_ID,p.first_name,p.last_name, p.id,cn.confidential,cn.corrected,cn.Ratio_Consumers,cn.service_id, ");
            sb.Append("cn.Original_User_ID, ncr.Any_SSA_Note, cna.Case_Note_ID,cn.service,cn.notes,cn.Location,ug.First_Name,ug.Last_Name,cn.Outcome_Service_Monitoring ");


            sb.Append("order by cn.service_date desc,cn.Start_Time desc,p.Last_Name asc ");



            string sbToPass = sb.ToString();
            return sbToPass;
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
    }
}
