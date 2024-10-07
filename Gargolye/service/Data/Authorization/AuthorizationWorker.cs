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
using static Anywhere.service.Data.Employment.EmploymentWorker;
using System.ServiceModel.Web;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.ResetPassword.ResetPasswordWorker;
using OneSpanSign.Sdk;
using System.Reflection.Emit;
using System.IO;

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

        public class AssessmentEntries
        {
            public string ID { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string methodology { get; set; }
            public string score { get; set; }
            public string behaviorMod { get; set; }
            public string medicalMod { get; set; }
            public string DCMod { get; set; }
            public string CCMod { get; set; }
            public string priorAuthApplied { get; set; }
            public string priorAuthReceived { get; set; }
            public string priorAuthAmount { get; set; }
        }

        public class Score
        {
            public string scoreID { get; set; }
            public string scoreDescription { get; set; }
        }

        public class LandingPageData
        {
            public string vendorID { get; set; }
            public string name { get; set; }
            public string DBA { get; set; }
            public string DDNumber { get; set; }
            public string localNumber { get; set; }
            public string contact { get; set; }
            public string phone { get; set; }
        }

        public class VendorInfo
        {
            public string vendorID { get; set; }
            public string name { get; set; }
            public string DDNumber { get; set; }
            public string localNumber { get; set; }
            public string contact { get; set; }
            public string phone { get; set; }
            public string goodStanding { get; set; }        
            public string takingNewReferrals { get; set; }
            public string homeServices { get; set; }           
            public string fundingSource { get; set; }
            public string serviceCode { get; set; }
        }

        public class VendorGeneralEntry
        {
            public string vendorID { get; set; }
            public string name { get; set; }      
            public string contactName { get; set; }
            public string contactPhone { get; set; }
            public string contactEmail { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zipCode { get; set; }
            public string primaryPhone { get; set; }
            public string providerFirstName { get; set; }
            public string providerLastName { get; set; }
            public string providerBirthDate { get; set; }
            public string providerBuildingNumber { get; set; }
            public string salesforceId { get; set; }
            public string DDStateNumber { get; set; }
            public string ein { get; set; }
            public string submitterId { get; set; }
            public string LocalNumber { get; set; }
            public string ssn { get; set; }
            public string sender { get; set; }
            public string MHStateNumber { get; set; }
            public string TDDStateNumber { get; set; }
            public string NPI { get; set; }
            public string MHNPI { get; set; }
            public string goodStanding { get; set; }
            public string takingNewReferrals { get; set; }
            public string FSSVendor { get; set; }
            public string sanctionsAdministered { get; set; }
            public string homeServices { get; set; }
            public string DBA { get; set; }
        }

        public class DropdownValue
        {
            public string ID { get; set; } 
            public string Code { get; set; }
            public string Description { get; set; }

        }

        public class vendorService
        {
            public string fundingSource { get; set; } 
            public string serviceCode { get; set; }
            public string serviceDescription { get; set; }
        }

        public class vendorUCR
        {
            public string service { get; set; }
            public string groupSize { get; set; }
            public string serviceLocation { get; set; }
            public string CDBCategory { get; set; }
            public string assessmentAcuityScore { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string UCR { get; set; }           
        }

        public class vendorProviderType
        {
            public string ProviderType { get; set; }       
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string Notes { get; set; }
        }

        public class vendorCertifiction
        { 
            public string Certifiction { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
        }

        public class vendorLocationReviews
        {
            public string location { get; set; }
            public string reviewType { get; set; }
            public string dueDate { get; set; }
            public string completedDate { get; set; }
            public string responsibleStaff { get; set; }
        }

        public PageData getAuthorizationPageData(string code, string matchSource, string vendorId, string planType, string planYearStartStart, string planYearStartEnd,
                                string planYearEndStart, string planYearEndEnd, string completedDateStart, string completedDateEnd, string selectedConsumerId)
        {
            PageData pageData = new PageData();
            js.MaxJsonLength = Int32.MaxValue;
            string parentString = getAuthorizationPageDataParent(code, matchSource, vendorId, planType, planYearStartStart, planYearStartEnd,
                                 planYearEndStart, planYearEndEnd, completedDateStart, completedDateEnd, selectedConsumerId);
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

                if (vendorId.Equals("%"))
                { }
                else
                {
                    vendorId = vendorId.Substring(0, vendorId.IndexOf('.', 0));
                }

                string jsonResult = "";
                string fieldId = "Match Source";
                sb.Clear();

                sb.Append("select p.CompletionDate,p.plan_year_start,p.plan_year_end,p.plantype,p.match_source + ' ' + ct.caption as sourceAndCaption, p.ID, p.PL_Vendor_ID as plVendorId, v.name, p.pas_id, p.RevisionNum as revisionNum ");
                sb.Append("from dba.pas as p ");
                sb.Append("left outer join dba.code_table as ct on ct.code = p.Match_Source ");
                sb.Append("left outer join dba.vendor as v on v.Vendor_ID = p.PL_Vendor_ID ");
                sb.AppendFormat("where (ct.Code like '{0}' or ct.Code is null) ", code);
                sb.Append("and (ct.Field_ID like '%' or ct.Field_ID is null) ");
                // sb.AppendFormat("and (ct.Field_ID like '{0}' or ct.Field_ID is null) ", fieldId);
                sb.AppendFormat("and (p.Match_Source like '{0}' or p.Match_Source is null) ", matchSource);
                sb.AppendFormat("and p.planType like '{0}' ", planType);
                sb.AppendFormat("and p.plan_year_start between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
                if (planYearEndStart != "" && planYearEndEnd != "")
                {
                    sb.AppendFormat("and p.plan_year_end between '{0}' and '{1}' ", planYearEndStart, planYearEndEnd);
                }
                if (planYearEndStart != "" && planYearEndEnd == "")
                {
                    sb.AppendFormat("and p.plan_year_end <= '{0}' ", planYearEndStart);
                }
                if (planYearEndStart == "" && planYearEndEnd != "")
                {
                    sb.AppendFormat("and p.plan_year_end <= '{0}' ", planYearEndEnd);
                }
                sb.AppendFormat("and p.CompletionDate between '{0}' and '{1}' ", completedDateStart, completedDateEnd);
                sb.AppendFormat("and p.Id = '{0}' and p.permanent = 'Y' ", selectedConsumerId);
                if (vendorId.Equals("%"))
                {
                    sb.AppendFormat("and (p.PL_Vendor_ID like '{0}' or p.PL_Vendor_ID is null) ", vendorId);
                }
                else
                {
                    sb.AppendFormat("and p.PL_Vendor_ID like '{0}' ", vendorId);
                }

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
                if (vendorId.Equals("%"))
                { }
                else
                {
                    vendorId = vendorId.Substring(0, vendorId.IndexOf('.', 0));
                }

                string jsonResult = "";
                string fieldId = "Match Source";
                sb.Clear();

                sb.Append("select distinct pd.pas_id, pd.period as frequency,v.name as vendorName, pd.BeginDate,pd.EndDate,pd.itemnum, si.description,si.service_code,pd.MaxUnits,pd.AuthorizedCostCFY as authCostFY1,pd.AuthorizedCostNFY as authCostFY2 ");
                sb.Append("from dba.pas as p ");
                sb.Append("join dba.pas_detail as pd on pd.pas_id = p.pas_id ");
                sb.Append("join dba.vendor as v on v.vendor_id = pd.vendor_id ");
                sb.Append("join dba.service_info as si on si.service_id = pd.service_id ");
                sb.Append("where pd.pas_id in (select distinct pas_id ");
                sb.Append("from dba.pas as p ");
                sb.AppendFormat("where (p.Match_Source like '{0}' or p.Match_Source is null) ", matchSource);
                sb.AppendFormat("and p.planType like '{0}' ", planType);
                sb.AppendFormat("and p.plan_year_start between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
                sb.AppendFormat("and p.CompletionDate between '{0}' and '{1}' ", completedDateStart, completedDateEnd);
                sb.AppendFormat("and p.Id = '{0}' and p.permanent = 'Y') ", selectedConsumerId);
                sb.Append("and pd.Detail_Type = 'C' ");
                sb.AppendFormat("and pd.BeginDate between '{0}' and '{1}' ", planYearStartStart, planYearStartEnd);
                //sb.AppendFormat("and pd.enddate between '{0}' and '{1}'", planYearStartStart, planYearStartEnd);
                if (planYearEndStart != "" && planYearEndEnd != "")
                {
                    sb.AppendFormat("and p.plan_year_end between '{0}' and '{1}' ", planYearEndStart, planYearEndEnd);
                }
                if (planYearEndStart != "" && planYearEndEnd == "")
                {
                    sb.AppendFormat("and p.plan_year_end <= '{0}' ", planYearEndStart);
                }
                if (planYearEndStart == "" && planYearEndEnd != "")
                {
                    sb.AppendFormat("and p.plan_year_end <= '{0}' ", planYearEndEnd);
                }


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
                sb.Append("left outer join dba.vendor as v on v.Vendor_ID = p.PL_Vendor_ID where active = 'Y' ");
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

        public AssessmentEntries[] getAssessmentEntries(string token, string consumerIds, string methodology, string score, string startDateFrom, string startDateTo, string endDateFrom, string endDateTo, string priorAuthApplFrom, string priorAuthApplTo, string priorAuthRecFrom, string priorAuthRecTo, string priorAuthAmtFrom, string priorAuthAmtTo)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    AssessmentEntries[] entries = js.Deserialize<AssessmentEntries[]>(adg.getAssessmentEntries(token, consumerIds, methodology, score, startDateFrom, startDateTo, endDateFrom, endDateTo, priorAuthApplFrom, priorAuthApplTo, priorAuthRecFrom, priorAuthRecTo, priorAuthAmtFrom, priorAuthAmtTo, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public Score[] getScore(string token, string methodologyID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    Score[] score = js.Deserialize<Score[]>(adg.getScore(transaction, methodologyID));
                    return score;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        
       public LandingPageData[] authorizationGetLandingPageData(string token)
       {
            string landingPageString = adg.authorizationGetLandingPageData(token);
            js.MaxJsonLength = Int32.MaxValue;
            LandingPageData[] landingPageObj = js.Deserialize<LandingPageData[]>(landingPageString);
            return landingPageObj;
       }

        public VendorInfo[] getVendorInfo(string token, string vendor, string DDNumber, string localNumber, string goodStanding, string homeServices, string takingNewReferrals, string fundingSource, string serviceCode)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    VendorInfo[] vendorInfo = js.Deserialize<VendorInfo[]>(adg.getVendorInfo(token, vendor, DDNumber, localNumber, goodStanding, homeServices, takingNewReferrals, fundingSource, serviceCode, transaction));
                    return vendorInfo;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public DropdownValue[] getVendor(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    DropdownValue[] Info = js.Deserialize<DropdownValue[]>(adg.getVendor(transaction, token));
                    return Info;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public DropdownValue[] getFundingSource(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    DropdownValue[] Info = js.Deserialize<DropdownValue[]>(adg.getFundingSource(transaction, token));
                    return Info;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public DropdownValue[] getServiceCode(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    DropdownValue[] Info = js.Deserialize<DropdownValue[]>(adg.getServiceCode(transaction, token));
                    return Info;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public VendorGeneralEntry[] getVendorEntriesById(string token, string vendorID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    VendorGeneralEntry[] generalEntry = js.Deserialize<VendorGeneralEntry[]>(adg.getVendorEntriesById(token, vendorID, transaction));
                    return generalEntry;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public vendorService[] getVenderServicesEntries(string token, string vendorID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    vendorService[] servicesEntry = js.Deserialize<vendorService[]>(adg.getVenderServicesEntries(token, vendorID, transaction));
                    return servicesEntry;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public vendorUCR[] getVenderUCREntries(string token, string vendorID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    vendorUCR[] vendorUCR = js.Deserialize<vendorUCR[]>(adg.getVenderUCREntries(token, vendorID, transaction));
                    return vendorUCR;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public vendorProviderType[] getProviderTypeEntries(string token, string vendorID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    vendorProviderType[] vendorProviderTypeEntry = js.Deserialize<vendorProviderType[]>(adg.getProviderTypeEntries(token, vendorID, transaction));
                    return vendorProviderTypeEntry;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public vendorCertifiction[] getVenderCertificationEntries(string token, string vendorID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    vendorCertifiction[] vendorCertifictionEntry = js.Deserialize<vendorCertifiction[]>(adg.getVenderCertificationEntries(token, vendorID, transaction));
                    return vendorCertifictionEntry;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public vendorLocationReviews[] getVenderLocationReviewEntries(string token, string vendorID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    vendorLocationReviews[] vendorLocationReviewsEntry = js.Deserialize<vendorLocationReviews[]>(adg.getVenderLocationReviewEntries(token, vendorID, transaction));
                    return vendorLocationReviewsEntry;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

    }
}