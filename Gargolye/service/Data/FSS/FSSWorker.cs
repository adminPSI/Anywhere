using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using OneSpanSign.Sdk;
using System;
using System.Data;
using System.ServiceModel.Web;
using System.Text;
using System.Web.Script.Serialization;
using System.Web.Security;
using static Anywhere.service.Data.Employment.EmploymentWorker;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using static System.Windows.Forms.AxHost;

namespace Anywhere.service.Data.FSS
{
    public class FSSWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        Anywhere.service.Data.FSS.FSSDataGetter fdg = new Anywhere.service.Data.FSS.FSSDataGetter();
        StringBuilder sb = new StringBuilder();
        Sybase di = new Data.Sybase();


        public class FSSPageData
        {
            public PDParentFSS[] pageDataParent { get; set; }
            public PDChildFSS[] pageDataChild { get; set; }
            public PDSubChildFSS[] pageDataSubChild { get; set; }
        }

        public class PDParentFSS
        {
            public string familyId { get; set; }
            public string familyName { get; set; }
            public string address { get; set; }
            public string primaryPhone { get; set; }
            public string notes { get; set; }

        }

        public class PDChildFSS
        {
            public string authId { get; set; }
            public string familyId { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
            public string coPay { get; set; }
            public string allocation { get; set; }
            public string encumbered { get; set; }
            public string amtPaid { get; set; }
            public string balance { get; set; }
            public string funding { get; set; }
            public string fundingSourceID { get; set; }
        }

        public class PDSubChildFSS
        {
            public string authDetailId { get; set; }
            public string authId { get; set; }
            public string familyMember { get; set; }
            public string serviceCode { get; set; }
            public string Vendor { get; set; }
            public string encumbered { get; set; }
            public string paidAmt { get; set; }
            public string paidDate { get; set; }
            public string familyMemberId { get; set; }
            public string serviceCodeId { get; set; }
            public string vendorId { get; set; }
        }

        public class ActiveInactiveFamily
        {
            public string familyId { get; set; }
            public string familyName { get; set; }
            public string address { get; set; }
            public string primaryPhone { get; set; }
            public string active { get; set; }
        }

        public class FamilyInformation
        {
            public string familyId { get; set; } 
            public string familyName { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
            public string primaryPhone { get; set; }
            public string secondaryPhone { get; set; }
            public string email { get; set; }
            public string notes { get; set; }
            public string active { get; set; }
        }

        public class Members
        {
            public string familyId { get; set; }
            public string memberId { get; set; }
            public string memberName { get; set; }
            public string active { get; set; }
        }

        public class dropdowns
        {
            public string id { get; set; }
            public string name { get; set; }
        }

        public class UtilizationBillable
        {
            public string previousPaid { get; set; }
            public string currentPaid { get; set; }
            public string isReceivable { get; set; }
            public string isSuccess { get; set; }
        }

        public class FSSAuthorizationDetail
        {
            public string FSS_Authorization_Detail_ID { get; set; }
            public string FSS_Authorization_ID { get; set; }
            public string ID { get; set; }
            public string Service_ID { get; set; }
            public string Vendor_ID { get; set; }
            public string Encumbered_Amount { get; set; }
            public string Paid_Amount { get; set; }
            public string Voucher { get; set; }
            public string Notes { get; set; }
            public string Start_Date { get; set; }
            public string End_Date { get; set; }
            public string remote_location { get; set; }
            public string User_ID { get; set; }
            public string Last_Update { get; set; }
            public string Date_Paid { get; set; }
        }


        public FSSWorker.FSSPageData getFSSPageData(string token, string familyName, string primaryPhone, string address, string appName, string consumerID)
        {
            FSSPageData pageData = new FSSPageData();
            js.MaxJsonLength = Int32.MaxValue;
            string parentString = getFSSPageDataParent(token, familyName, primaryPhone, address, appName, consumerID);
            PDParentFSS[] parentObj = js.Deserialize<PDParentFSS[]>(parentString);

            string childString = getFSSPageDataChildren();
            PDChildFSS[] childObj = js.Deserialize<PDChildFSS[]>(childString);

            string subChildString = getFSSPageDataSubChildren();
            PDSubChildFSS[] subChildObj = js.Deserialize<PDSubChildFSS[]>(subChildString);

            pageData.pageDataParent = parentObj;
            pageData.pageDataChild = childObj;
            pageData.pageDataSubChild = subChildObj;
            return pageData;
        }

        public string getFSSPageDataParent(string token, string familyName, string primaryPhone, string address, string appName, string consumerID)
        {
            try
            {
                string jsonResult = "";
                sb.Clear();

                sb.Append("SELECT ff.FSS_Family_ID as familyId ,ff.Family_Name as familyName, ff.address1 + ' ' + ff.address2 + ' ' + ff.city + ', ' + ff.state + ' ' + ff.zip_code as address , ff.Primary_Phone as primaryPhone , ff.Notes as notes ");
                sb.Append("from dba.fss_family as ff ");
                sb.AppendFormat("WHERE ff.FSS_Family_ID IN(select FSS_Family_ID from dba.fss_family_member where ID like '{0}' )", consumerID);
                if (familyName == "%")
                    sb.AppendFormat("AND (ff.Family_Name like '%' OR ff.Family_Name IS NULL)");
                else
                    sb.AppendFormat("AND (ff.Family_Name like '%{0}%' )", familyName);
                if (primaryPhone == "%")
                    sb.AppendFormat("AND (ff.Primary_Phone like '%' OR ff.Primary_Phone IS NULL )");
                else
                    sb.AppendFormat("AND (ff.Primary_Phone like '%{0}%' )", primaryPhone);
                if (address == "%")
                    sb.AppendFormat("AND (address like '%' OR  address IS NULL)");
                else
                    sb.AppendFormat("AND address like '%{0}%'", address);

                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);

                return jsonResult;

            }
            catch (Exception ex)
            {


            }
            return String.Empty;
        }

        //Child
        public string getFSSPageDataChildren()
        {
            try
            {
                string jsonResult = "";
                sb.Clear();

                sb.Append("select ROW_NUMBER() OVER(ORDER BY fa.Start_Date desc) AS itemnum, fa.FSS_Authorization_ID as authId, fa.FSS_Family_ID as familyId, Start_Date as startDate, End_Date as endDate, Copay as coPay, Allocation_Amount as allocation, ");
                sb.Append("(select sum(fad.encumbered_amount) from dba.fss_authorization_detail as fad where fad.FSS_Authorization_ID = fa.FSS_Authorization_ID) as 'encumbered', ");
                sb.Append("(select sum(fad.paid_amount) from dba.fss_authorization_detail as fad where fad.FSS_Authorization_ID = fa.FSS_Authorization_ID) as 'amtPaid' , ");
                sb.Append("(allocation - ISNULL(encumbered, 0) - ISNULL(amtPaid, 0)) as 'balance' , ");
                sb.Append("(select fsi.description from dba.funding_source_info as fsi where fsi.funding_source_id = fa.funding_source_id) as 'funding' , ");
                sb.Append("(select fsi.Funding_Source_ID from dba.funding_source_info as fsi where fsi.funding_source_id = fa.funding_source_id) as 'fundingSourceID' ");
                sb.Append("from dba.fss_authorizations fa order by Start_Date desc");

                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);

                return jsonResult;
            }
            catch (Exception ex)
            {
            }
            return String.Empty;
        }

        public string getFSSPageDataSubChildren()
        {
            try
            {
                string jsonResult = "";
                sb.Clear();

                sb.Append("select ROW_NUMBER() OVER(ORDER BY fad.FSS_Authorization_Detail_ID) AS itemnum, fad.FSS_Authorization_Detail_ID as authDetailId, fad.FSS_Authorization_ID as authId, fad.encumbered_amount as encumbered, fad.paid_amount as paidAmt, fad.date_paid as paidDate, ");
                sb.Append("(select people.last_name + ' ' + people.generation + ' ' + people.first_name + ' ' + people.middle_name   from dba.People as people where people.ID = fad.ID) as 'familyMember', ");
                sb.Append("(select si.Service_Code + ' - ' + si.Description  from dba.service_info si where si.Service_ID = fad.Service_ID) as 'serviceCode', ");
                sb.Append("(select v.Name from Vendor v where v.Vendor_ID = fad.Vendor_ID) as 'Vendor' , fad.ID as familyMemberId , fad.Service_ID as serviceCodeId , fad.Vendor_ID as vendorId ");
                sb.Append("from dba.fss_authorization_detail fad ");

                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);

                return jsonResult;
            }
            catch (Exception ex)
            {
            }
            return String.Empty;
        }

        public ActiveInactiveFamily[] getActiveInactiveFamilylist(string token, string isActive)
        {
            string seByDateString = fdg.getActiveInactiveFamilylist(token, isActive);
            ActiveInactiveFamily[] seByDateObj = js.Deserialize<ActiveInactiveFamily[]>(seByDateString);
            return seByDateObj;
        }

        public FamilyInformation[] getFamilyInfoByID(string token, string familyId)
        {
            string objString = fdg.getFamilyInfoByID(token, familyId);
            FamilyInformation[] seByDateObj = js.Deserialize<FamilyInformation[]>(objString);
            return seByDateObj;
        }

        public FamilyInformation[] updateFamilyInfo(string token, string familyName, string address1, string address2, string city, string state, string zip, string primaryPhone, string secondaryPhone, string email, string notes, string active, string userId, string familyID)
        {
            string objString = fdg.updateFamilyInfo(token, familyName, address1, address2, city, state, zip, primaryPhone, secondaryPhone, email, notes, active, userId, familyID);
            FamilyInformation[] seByDateObj = js.Deserialize<FamilyInformation[]>(objString);
            return seByDateObj;
        }

        public Members[] getFamilyMembers(string token, string familyId)
        {
            string objString = fdg.getFamilyMembers(token, familyId);
            Members[] seByDateObj = js.Deserialize<Members[]>(objString);
            return seByDateObj;
        }

        public Members[] getMembers(string token)
        {
            string objString = fdg.getMembers(token);
            Members[] seByDateObj = js.Deserialize<Members[]>(objString);
            return seByDateObj;
        }
        public string insertMemberInfo(string token, string memberId, string familyID, string active, string userId, string newMemberId)
        {
            string objString = fdg.insertMemberInfo(token, memberId, familyID, active, userId, newMemberId);
            return objString;
        }
        public string deleteMemberInfo(string token, string memberId, string familyID)
        {
            string objString = fdg.deleteMemberInfo(token, memberId, familyID);
            return objString;
        }
        public dropdowns[] getFunding(string token)
        {
            string objString = fdg.getFunding(token);
            dropdowns[] seByDateObj = js.Deserialize<dropdowns[]>(objString);
            return seByDateObj;
        }

        public dropdowns[] getFamilyMembersDropDown(string familyId)
        {
            string objString = fdg.getFamilyMembersDropDown(familyId);
            dropdowns[] seByDateObj = js.Deserialize<dropdowns[]>(objString);
            return seByDateObj;
        }

        public dropdowns[] getServiceCodes(string fundingSourceID)
        {
            string objString = fdg.getServiceCodes(fundingSourceID);
            dropdowns[] seByDateObj = js.Deserialize<dropdowns[]>(objString);
            return seByDateObj;
        }

        public dropdowns[] getVendors(string token)
        {
            string objString = fdg.getVendors(token);
            dropdowns[] seByDateObj = js.Deserialize<dropdowns[]>(objString);
            return seByDateObj;
        }

        public string DataTableToJSONWithJSONNet(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }

        public string insertAuthorization(string token, string coPay, string allocation, string fundingSource, string startDate, string endDate, string userId, string familyID, string authID)
        {
            string objString = fdg.insertAuthorization(token, coPay, allocation, fundingSource, startDate, endDate, userId, familyID, authID);
            return objString;
        }

        public UtilizationBillable insertUtilization(string token, string encumbered, string familyMember, string serviceCode, string paidAmount, string vendor, string datePaid, string userId, string familyID, string authID, string consumerID, string isSimpleBilling, string authDetailID)
        {
            UtilizationBillable billable = new UtilizationBillable();
            billable.previousPaid = "";
            billable.currentPaid = "";
            billable.isReceivable = "";
            billable.isSuccess = "";
            try
            {
                // Simple Billing Entry functionality 
                string utilizationData = getUtilization(authID);
                FSSAuthorizationDetail[] familyUtilizationData = js.Deserialize<FSSAuthorizationDetail[]>(utilizationData);


                //If the user provides a Date Paid and a Paid Amount in the popup in mockup #7 above, insert a record into Gatekeeper's billing module.
                // If Simple Billing ‘Y’ and there is at least one row on the Family Utilization tab then
                if (isSimpleBilling == "Y" && paidAmount != "" && datePaid != "" && familyUtilizationData.Length > 0)
                {                   
                    // variable to see if vendor is receivable, which means entry will be inserted into County Simple Billing Entry
                    if (!string.IsNullOrEmpty(vendor))
                    {
                        string isReceivable = getIsReceivable(vendor);
                        UtilizationBillable[] billableReceivable = js.Deserialize<UtilizationBillable[]>(isReceivable);
                        billable.isReceivable = billableReceivable[0].isReceivable;
                    }
                    else
                    {
                        billable.isReceivable = "N";
                    }

                    billable.currentPaid = string.IsNullOrEmpty(paidAmount) ? "0" : paidAmount;

                    //at least one row on the Family Utilization tab then Loop through the rows
                    foreach (FSSAuthorizationDetail data in familyUtilizationData)
                    {
                        // make sure the row was modified in some way
                        if (data.Encumbered_Amount != encumbered || data.ID != familyMember || data.Service_ID != serviceCode || data.Paid_Amount != paidAmount || data.Date_Paid != datePaid || data.Vendor_ID != vendor)
                        {
                            decimal perviousAmt = string.IsNullOrEmpty(data.Paid_Amount) ? 0 : Convert.ToDecimal(data.Paid_Amount) == Convert.ToDecimal(paidAmount) ? 0 : Convert.ToDecimal(data.Paid_Amount);                         
                            decimal currentAmt = string.IsNullOrEmpty(paidAmount) ? 0 : Convert.ToDecimal(paidAmount);
                            
                            billable.previousPaid = perviousAmt.ToString();

                            // check to see if paid amount is going from $0 to a new value that is greater than 0, then create the simple billing entry with info from window
                            if (perviousAmt == 0 && currentAmt > 0)
                            {
                                // insert a new row into the datastore so row can be added to simple billing window
                                string notes = string.IsNullOrWhiteSpace(data.Notes) ? data.Voucher : data.Notes;
                                fdg.insertSimpleBilling(token, vendor, userId, familyMember, paidAmount, datePaid, notes, serviceCode);
                                break;
                            }
                        }
                    }
                    billable.isSuccess = "Y";
                }
                fdg.insertUtilization(token, encumbered, familyMember, serviceCode, paidAmount, vendor, datePaid, userId, familyID, authID, consumerID, authDetailID);
                return billable;
            }
            catch (Exception)
            {
                billable.isSuccess = "N";
                return billable;
            }

        }

        public string getIsReceivable(string vendor)
        {
            try
            {
                string jsonResult = "";
                sb.Clear();
                sb.AppendFormat("select vendor.default_receivable as isReceivable from dba.vendor where vendor.Vendor_ID = '{0}' ", vendor);
                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);
                return jsonResult;
            }
            catch (Exception ex)
            {
                return String.Empty;
            }
        }

        public string getUtilization(string AuthId)
        {
            try
            {
                string jsonResult = "";
                sb.Clear();
                sb.Append("SELECT FSS_Authorization_Detail_ID,FSS_Authorization_ID,ID,Service_ID,Vendor_ID,Encumbered_Amount,Paid_Amount,Voucher,Notes,Start_Date,End_Date,remote_location,User_ID,Last_Update,Date_Paid from dba.FSS_Authorization_Detail where ");
                sb.AppendFormat(" FSS_Authorization_ID = '{0}' ", AuthId);
                sb.Append(" order by Last_Update desc");

                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);
                return jsonResult;
            }
            catch (Exception ex)
            {
                return String.Empty;
            }
        }

        public void deleteAuthorization(string token, string authDetailId)
        {
            fdg.deleteAuthorization(token, authDetailId);
        }

    }
}