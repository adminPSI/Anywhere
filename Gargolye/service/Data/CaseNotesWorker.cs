using Anywhere.Data;
using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class CaseNotesWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        CaseNoteFilterWorker cnfw = new CaseNoteFilterWorker();

        public string addCaseNoteAttachment(string token, string caseNoteId, string description, string attachmentType, string attachment)
        {
            return dg.addCaseNoteAttachment(token, caseNoteId, description, attachmentType, attachment);
        }
        // my comment

        public ConsumersThatCanHaveMileage[] getConsumersThatCanHaveMileageJSON(string token)
        {
            string consumersThatCanHaveMileageString = dg.getConsumersThatCanHaveMileageJSON(token);
            ConsumersThatCanHaveMileage[] consumersThatCanHaveMileageObj = js.Deserialize<ConsumersThatCanHaveMileage[]>(consumersThatCanHaveMileageString);
            return consumersThatCanHaveMileageObj;
        }

        //Populates Biller List
        public GetBillers[] getBillersListForDropDownJSON(string token)
        {
            string billersString = dg.getBillersListForDropDownJSON(token);
            GetBillers[] billersObj = js.Deserialize<GetBillers[]>(billersString);
            return billersObj;
        }

        //Gets data and populates the list on case notes page
        public CaseNotesFilteredSearch[] caseNotesFilteredSearchJSON(string token, string billerId, string consumerId, string serviceStartDate, string serviceEndDate,
            string dateEnteredStart, string dateEnteredEnd, string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string corrected, string billed,
            string attachments, string overlaps, string noteText, string applicationName)
        {
            string filteredString = cnfw.caseNotesFilterBuilder(token, billerId, consumerId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd,
                billingCode, reviewStatus, location, service, need, contact, confidential, corrected, billed, attachments, noteText, applicationName);
            //string filteredString = dg.caseNotesFilteredSearchJSON(token, billerId, consumerId, serviceStartDate, serviceEndDate, dateEnteredStart, dateEnteredEnd,
            //    billingCode, reviewStatus, location, service, need, contact, confidential, billed, attachments, noteText);
            js.MaxJsonLength = Int32.MaxValue;
            CaseNotesFilteredSearch[] filteredObj = js.Deserialize<CaseNotesFilteredSearch[]>(filteredString);
            if (overlaps == "Y")
            {
                List<string> overlappingIds = new List<string>();
                foreach (CaseNotesFilteredSearch caseNote in filteredObj)
                {
                    string overlapidst = dg.caseNoteOverlapCheck(token, caseNote.consumerid, caseNote.starttime, caseNote.endtime, caseNote.servicedate, caseNote.casemanagerid, caseNote.casenoteid, caseNote.groupnoteid);
                    if (overlapidst != "[]")
                    {
                        OverLapId[] idobj = js.Deserialize<OverLapId[]>(overlapidst);
                        overlappingIds.Add(idobj[0].caseNoteId.ToString());
                        overlappingIds.Add(caseNote.casenoteid.ToString());
                    }
                }
                if (filteredObj.Length > 0)
                {
                    filteredObj[0].overlaps = overlappingIds;
                }

            }
            //CaseNotesFilteredSearch[] filteredObj = JsonConvert.DeserializeObject<CaseNotesFilteredSearch[]>(filteredString);
            return filteredObj;
        }

        public ConsumerSpecificVendors[] getConsumerSpecificVendorsJSON(string token, string consumerId, string serviceDate)
        {
            string vendorsString = dg.getConsumerSpecificVendorsJSON(token, consumerId, serviceDate);
            ConsumerSpecificVendors[] vendorsObj = js.Deserialize<ConsumerSpecificVendors[]>(vendorsString);
            return vendorsObj;
        }

        public CaseNoteEdit[] getCaseNoteEditJSON(string token, string noteId)
        {
            string caseNoteString = dg.getCaseNoteEditJSON(token, noteId);
            CaseNoteEdit[] caseNoteObj = js.Deserialize<CaseNoteEdit[]>(caseNoteString);
            return caseNoteObj;
        }

        public ReviewRequiredData[] getReviewRequiredForCaseManager(string token, string caseManagerId)
        {
            string reviewRequiredString = dg.getReviewRequiredForCaseManager(token, caseManagerId);
            ReviewRequiredData[] reviewRequiredObj = js.Deserialize<ReviewRequiredData[]>(reviewRequiredString);
            return reviewRequiredObj;
        }

        public ServiceLocationData[] getServiceLocationsForCaseNoteDropDown(string token, string serviceDate, string consumerId)
        {
            string serviceLocationString = dg.getServiceLocationsForCaseNoteDropDown(token, serviceDate, consumerId);
            ServiceLocationData[] serviceLocationObj = js.Deserialize<ServiceLocationData[]>(serviceLocationString);
            return serviceLocationObj;
        }

        public CustomPhrases[] getCustomPhrases(string token, string showAll)
        {
            string customPhrasesString = dg.getCustomPhrases(token, showAll);
            CustomPhrases[] customPhrasesObj = js.Deserialize<CustomPhrases[]>(customPhrasesString);
            return customPhrasesObj;
        }

        public AttachmentList[] getCaseNoteAttachmentsList(string token, string caseNoteId)
        {
            string attachmentsString = dg.getCaseNoteAttachmentsList(token, caseNoteId);
            AttachmentList[] attachmentsObj = js.Deserialize<AttachmentList[]>(attachmentsString);
            return attachmentsObj;
        }

        public ConsumersForFilter[] getConsumersForCNFilter(string token, string caseLoadOnly)
        {
            string consumersString = dg.getConsumersForCNFilter(token, caseLoadOnly);
            ConsumersForFilter[] consumersObj = js.Deserialize<ConsumersForFilter[]>(consumersString);
            return consumersObj;
        }

        public FilterDropdownValues[] getCNPopulateFilterDropdowns(string token, string serviceCodeId)
        {
            string dropdownString = dg.getCNPopulateFilterDropdowns(token, serviceCodeId);
            FilterDropdownValues[] dropdownObj = js.Deserialize<FilterDropdownValues[]>(dropdownString);
            return dropdownObj;
        }

        public class FilterDropdownValues
        {
            public string note_code { get; set; }
            public string caption { get; set; }
            public string dropdown { get; set; }
        }

        public class ConsumersForFilter
        {
            public string id { get; set; }
            public string FN { get; set; }
            public string LN { get; set; }
        }

        public class AttachmentList
        {
            public string attachmentId { get; set; }
            public string description { get; set; }
        }

        public class CustomPhrases
        {
            public string phrase_id { get; set; }
            public string phrase { get; set; }
            public string phrase_shortcut { get; set; }
        }

        public class ServiceLocationData
        {
            public string caption { get; set; }
            public string code { get; set; }
            public string def { get; set; }
        }

        public class ReviewRequiredData
        {
            public string reviewrequired { get; set; }
            public string serviceid { get; set; }
            public string servicecode { get; set; }
        }

        public class ConsumersThatCanHaveMileage
        {
            public string consumerid { get; set; }
        }

        public class OverLapId
        {
            public string caseNoteId { get; set; }
        }


        public class GetBillers
        {
            public string billerId { get; set; }
            public string billerName { get; set; }
        }

        public class CaseNotesFilteredSearch
        {
            public string casenoteid { get; set; }
            public string servicedate { get; set; }
            public string starttime { get; set; }
            public string endtime { get; set; }
            public string casemanagerid { get; set; }
            public string originalupdate { get; set; }
            public string mostrecentupdate { get; set; }
            public string groupnoteid { get; set; }
            public string lastupdatedby { get; set; }
            public string firstname { get; set; }
            public string lastname { get; set; }
            public string consumerid { get; set; }
            public string confidential { get; set; }
            public string numberInGroup { get; set; }
            public string enteredby { get; set; }
            public string isSSANote { get; set; }
            public string attachcount { get; set; }

            public List<string> overlaps { get; set; }
        }

        public class ConsumerSpecificVendors
        {
            public string vendorId { get; set; }
            public string vendorName { get; set; }
        }
        public class CaseNoteEdit
        {
            public string noteid { get; set; }
            public string starttime { get; set; }
            public string endtime { get; set; }
            public string locationcode { get; set; }
            public string servicecode { get; set; }
            public string serviceneedcode { get; set; }
            public string contactcode { get; set; }
            public string casenote { get; set; }
            public string confidential { get; set; }
            public string userid { get; set; }
            public string consumerid { get; set; }
            public string vendorid { get; set; }
            public string mainbillingorservicecodeid { get; set; }
            public string servicedate { get; set; }
            public string lastupdate { get; set; }
            public string originalupdate { get; set; }
            public string servicelocationid { get; set; }
            public string reviewrequired { get; set; }
            public string groupid { get; set; }
            public string credit { get; set; }
            public string originaluserid { get; set; }
            public string batched { get; set; }

            public string originaluserfullname { get; set; }
            public string casemanagerid { get; set; }
            public string totalmiles { get; set; }
            public string traveltime { get; set; }
            public string totaldoctime { get; set; }
            public string casemanagername { get; set; }
            public string consumername { get; set; }
            public string contactname { get; set; }
            public string needname { get; set; }
            public string servicename { get; set; }
            public string serviceincludeinfundinglimit { get; set; }
            public string locationname { get; set; }
            public string servicelocationname { get; set; }
            public string vendorname { get; set; }
            public string mainbillingorservicecodename { get; set; }
            public string servicerequired { get; set; }
            public string locationrequired { get; set; }
            public string needrequired { get; set; }
            public string contactrequired { get; set; }
            public string reviewresults { get; set; }
            public string rejectionreason { get; set; }
            public string traveltimerequired { get; set; }
            public string doctimerequired { get; set; }
            public string mileagerequired { get; set; }
            public string corrected { get; set; }

        }



    }
}