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

        public FSSWorker.FSSPageData getFSSPageData(string token, string familyName, string primaryPhone, string address, string appName)
        {
            FSSPageData pageData = new FSSPageData();
            js.MaxJsonLength = Int32.MaxValue;
            string parentString = getFSSPageDataParent(token, familyName, primaryPhone, address, appName);
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

        public string getFSSPageDataParent(string token, string familyName, string primaryPhone, string address, string appName)
        {
            try
            {
                string jsonResult = "";
                sb.Clear();

                sb.Append("SELECT ff.FSS_Family_ID as familyId ,ff.Family_Name as familyName, ff.address1 + ' ' + ff.address2 + ' ' + ff.city + ' ' + ff.state + ' ' + ff.zip_code as address , ff.Primary_Phone as primaryPhone , ff.Notes as notes ");
                sb.Append("from dba.fss_family as ff ");
                sb.AppendFormat("WHERE (ff.Family_Name like '%{0}%' )", familyName);
                sb.AppendFormat("AND (ff.Primary_Phone like '%{0}%')", primaryPhone);
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

                sb.Append("select ROW_NUMBER() OVER(ORDER BY fa.FSS_Authorization_ID) AS itemnum, fa.FSS_Authorization_ID as authId, fa.FSS_Family_ID as familyId, Start_Date as startDate, End_Date as endDate, Copay as coPay, Allocation_Amount as allocation, ");
                sb.Append("(select sum(fad.encumbered_amount) from dba.fss_authorization_detail as fad where fad.FSS_Authorization_ID = fa.FSS_Authorization_ID) as 'encumbered', ");
                sb.Append("(select sum(fad.paid_amount) from dba.fss_authorization_detail as fad where fad.FSS_Authorization_ID = fa.FSS_Authorization_ID) as 'amtPaid' , ");
                sb.Append("(allocation - ISNULL(encumbered, 0) - ISNULL(amtPaid, 0)) as 'balance' , ");
                sb.Append("(select fsi.description from dba.funding_source_info as fsi where fsi.funding_source_id = fa.funding_source_id) as 'funding' ");
                sb.Append("from dba.fss_authorizations fa ");
               
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
                sb.Append("(select v.Name from Vendor v where v.Vendor_ID = fad.Vendor_ID) as 'Vendor' ");
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

        public string updateFamilyInfo(string token, string familyName, string address1, string address2, string city, string state, string zip, string primaryPhone, string secondaryPhone, string email, string notes, string active, string userId, string familyID)
        {
            string objString = fdg.updateFamilyInfo(token, familyName, address1, address2, city, state, zip, primaryPhone, secondaryPhone, email, notes, active, userId, familyID);
            return objString;
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

        public string DataTableToJSONWithJSONNet(DataTable table)
        {
            string JSONString = string.Empty;
            JSONString = JsonConvert.SerializeObject(table);
            return JSONString;
        }

    }
}