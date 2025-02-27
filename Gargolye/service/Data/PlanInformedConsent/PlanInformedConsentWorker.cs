using Org.BouncyCastle.Utilities.IO;
using System;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanInformedConsent
{
    public class PlanInformedConsentWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        PlanInformedConsentDataGetter picdg = new PlanInformedConsentDataGetter();

        public InformedConsent[] getPlanRestrictiveMeasures(string token, string assessmentId)
        {
            string icString = picdg.getPlanRestrictiveMeasures(token, assessmentId);
            InformedConsent[] icObj = js.Deserialize<InformedConsent[]>(icString);
            return icObj;
        }

        public class InformedConsent
        {
            public string planId { get; set; }
            public string informedConsentId { get; set; }
            public string rmIdentified { get; set; }
            public string rmHRCDate { get; set; }
            public string rmKeepSelfSafe { get; set; }
            public string rmFadeRestriction { get; set; }
            public string rmOtherWayHelpGood { get; set; }
            public string rmOtherWayHelpBad { get; set; }
            public string rmWhatCouldHappenGood { get; set; }
            public string rmWhatCouldHappenBad { get; set; }
        }

        public InformedConsentSSAs[] getPlanInformedConsentSSAs(string token)
        {
            string icString = picdg.getPlanInformedConsentSSAs(token);
            InformedConsentSSAs[] icObj = js.Deserialize<InformedConsentSSAs[]>(icString);
            return icObj;
        }

        public class InformedConsentSSAs
        {
            public string id { get; set; }
            public string name { get; set; }
        }

        public InformedConsentVendors[] getPlanInformedConsentVendors(string token, string peopleid)
        {
            string icString = picdg.getPlanInformedConsentVendors(token, peopleid);
            InformedConsentVendors[] icObj = js.Deserialize<InformedConsentVendors[]>(icString);
            return icObj;
        }

        public class InformedConsentVendors
        {
            public string vendorId { get; set; }
            public string vendorName { get; set; }
            public string locationId { get; set; }
        }

        public InsertInformedConsent[] insertPlanRestrictiveMeasures(string token, string assessmentId)
        {
            string icString = picdg.insertPlanRestrictiveMeasures(token, assessmentId);
            InsertInformedConsent[] icObj = js.Deserialize<InsertInformedConsent[]>(icString);
            return icObj;
        }
        public class InsertInformedConsent
        {
            public string informedConsentId { get; set; }
            public string planCreationId { get; set; }
        }

        public string updatePlanRestrictiveMeasures(string token, string informedConsentId, string rmIdentified, string rmHRCDate, string rmKeepSelfSafe, string rmFadeRestriction, string rmOtherWayHelpGood, string rmOtherWayHelpBad, string rmWhatCouldHappenGood, string rmWhatCouldHappenBad)
        {
            string hcrDate = "";
            if (rmHRCDate != "")
            {
                var date = DateTime.Parse(rmHRCDate);
                hcrDate = date.ToString("yyyy-MM-dd");
            }
            return picdg.updatePlanRestrictiveMeasures(token, informedConsentId, rmIdentified, hcrDate, rmKeepSelfSafe, rmFadeRestriction, rmOtherWayHelpGood, rmOtherWayHelpBad, rmWhatCouldHappenGood, rmWhatCouldHappenBad);
        }

        public string deletePlanRestrictiveMeasures(string token, string informedConsentId)
        {
            return picdg.deletePlanRestrictiveMeasures(token, informedConsentId);

        }

        public string updatePlanConsentStatements(string token, string signatureId, string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess, string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology)
        {
            return picdg.updatePlanConsentStatements(token, signatureId, csChangeMind, csChangeMindSSAPeopleId, csContact, csContactProviderVendorId, csContactInput, csRightsReviewed, csAgreeToPlan, csFCOPExplained, csDueProcess, csResidentialOptions, csSupportsHealthNeeds, csTechnology);
        }

        public string updateConsentSummaryofChanges(string planID, string summaryofChangesText)
        {
            return picdg.updateConsentSummaryofChanges(planID, summaryofChangesText);
        }

        public class ConsentSummaryofChanges
        {
            public string summaryofChanges { get; set; }

        }

        public ConsentSummaryofChanges[] getPlanConsentSummaryofChanges(string planId)
        {
            string cscString = picdg.getPlanConsentSummaryofChanges(planId);
            ConsentSummaryofChanges[] cscObj = js.Deserialize<ConsentSummaryofChanges[]>(cscString);
            //string test = ConsentSummaryofChanges[0].summaryofChanges;
            return cscObj;
        }

        public void carryOverInformedConsentToNewPlan(string consumerPlanId, string priorConsumerPlanId, string token, string revision)
        {
            long priorPlanId = long.Parse(priorConsumerPlanId);
            long newPlanId = long.Parse(consumerPlanId);
            string icString = picdg.getPlanRestrictiveMeasures(token, priorPlanId.ToString());
            InformedConsent[] icObj = js.Deserialize<InformedConsent[]>(icString);
            string hcrDate = "";
            int i = icObj.Length;

            for (int j = 0; j < i; j++)
            {
                if (icObj[j].rmHRCDate != "")
                {
                    var date = DateTime.Parse(icObj[j].rmHRCDate);
                    hcrDate = date.ToString("yyyy-MM-dd");
                }

                picdg.insertForCarryOverInformedConsent(token, newPlanId, icObj[j].rmIdentified, hcrDate, icObj[j].rmKeepSelfSafe, icObj[j].rmFadeRestriction, icObj[j].rmOtherWayHelpGood,
                    icObj[j].rmOtherWayHelpBad, icObj[j].rmWhatCouldHappenGood, icObj[j].rmWhatCouldHappenBad, revision);
            }
        }

    }
}