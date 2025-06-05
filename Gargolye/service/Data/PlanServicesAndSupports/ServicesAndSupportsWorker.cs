using Anywhere.service.Data.PlanOutcomes;
using System;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;

namespace Anywhere.service.Data.PlanServicesAndSupports
{
    public class ServicesAndSupportsWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        ServicesAndSupportsDataGetter dg = new ServicesAndSupportsDataGetter();
        PlanOutcomesDataGetter podg = new PlanOutcomesDataGetter();
        PlanOutcomesDataGetter pdg = new PlanOutcomesDataGetter();
        public ServicesAndSupports getServicesAndSupports(string token, long anywAssessmentId, int consumerId)
        {
            //Paid Support
            string paidSupportString = dg.getPaidSupports(token, anywAssessmentId, 0);
            PaidSupports[] paidSupportObj = js.Deserialize<PaidSupports[]>(paidSupportString);
            //Support Modfications
            string supportModString = dg.getSSModifications(token, anywAssessmentId);
            SupportModifications[] supportModObj = js.Deserialize<SupportModifications[]>(supportModString);
            //Additional Supports
            string additionalSupportString = dg.getAdditionalSupports(token, anywAssessmentId, 0);
            AdditionalSupports[] additionalSupportObj = js.Deserialize<AdditionalSupports[]>(additionalSupportString);
            //Professional Referrals
            string proRefString = dg.getProfessionalReferral(token, anywAssessmentId, 0);
            ProfessionalReferrals[] proRefObj = js.Deserialize<ProfessionalReferrals[]>(proRefString);
            //communications Options
            string communicationOptionsString = dg.getCommunicationOptions(token);
            CommunicationsOptions[] communicationOptionsObj = js.Deserialize<CommunicationsOptions[]>(communicationOptionsString);
            //Employment Options
            string employmentOptionsString = dg.getEmploymentOptions(token);
            EmploymentOptions[] employmentOptionsObj = js.Deserialize<EmploymentOptions[]>(employmentOptionsString);
            //Levels Of Supervision
            string levelsOfSuervisionString = dg.getLevelsOfSupervision(token);
            LevelsOfSupervision[] levelsOfSupervisionObj = js.Deserialize<LevelsOfSupervision[]>(levelsOfSuervisionString);
            //Experience Relationships
            string relationshipString = dg.getExperienceRelationships(consumerId);
            ConsumerRelationships[] relationshipObj = js.Deserialize<ConsumerRelationships[]>(relationshipString);
            //Working/Not Working
            string workingNotWorking = dg.getWorkingNotWorkingAnswers(token, anywAssessmentId);
            WorkingNotWorking[] workingNotWorkingObj = js.Deserialize<WorkingNotWorking[]>(workingNotWorking);
            //Sections Applicable
            string sectionsApplicable = dg.getSectionsApplicable(token, anywAssessmentId);
            SectionsApplicable[] sectionsAPplicalbeObj = js.Deserialize<SectionsApplicable[]>(sectionsApplicable);
            //Total Outcomes
            string assessmentOutcomes = dg.getAssessmentOutcomes(token, anywAssessmentId, 0);
            AssessmentOutcomes[] assessmentOutcomesObj = js.Deserialize<AssessmentOutcomes[]>(assessmentOutcomes);
            //Get Monitoring Continuing Review Process
            string monitoringContinuousReviewProcess = pdg.getMonitoringContinuousReviewProcess(anywAssessmentId.ToString());
            MonitoringContinuousReviewProcess[] monitoringContinuousReviewProcessObj = js.Deserialize<MonitoringContinuousReviewProcess[]>(monitoringContinuousReviewProcess);


            ServicesAndSupports totalServicesAndSupports = new ServicesAndSupports();
            totalServicesAndSupports.paidSupport = paidSupportObj;
            totalServicesAndSupports.supportModification = supportModObj;
            totalServicesAndSupports.additionalSupport = additionalSupportObj;
            totalServicesAndSupports.professionalReferral = proRefObj;
            totalServicesAndSupports.communicationsOptions = communicationOptionsObj;
            totalServicesAndSupports.employmentOptions = employmentOptionsObj;
            totalServicesAndSupports.levelsOfsupervision = levelsOfSupervisionObj;
            totalServicesAndSupports.experienceRelationships = relationshipObj;
            totalServicesAndSupports.workingNotWorking = workingNotWorkingObj;
            totalServicesAndSupports.sectionsApplicable = sectionsAPplicalbeObj;
            totalServicesAndSupports.assessmentOutcomes = assessmentOutcomesObj;
            totalServicesAndSupports.monitoringContinuousReviewProcess = monitoringContinuousReviewProcessObj;

            return totalServicesAndSupports;
        }

        public string deleteProfessionalReferral(string token, long professionalReferralId)
        {
            return dg.deleteProfessionalReferral(token, professionalReferralId);
        }

        public string getProfessionalReferral(string token, long professionalReferralId, int targetAssessmentVersionId)
        {
            return dg.getProfessionalReferral(token, professionalReferralId, 0);
        }

        public string updateProfessionalReferral(string token, long professionalReferralId, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral)
        {
            return dg.updateProfessionalReferral(token, professionalReferralId, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral);
        }

        public string insertProfessionalReferral(string token, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral, int rowOrder)
        {
            return dg.insertProfessionalReferral(token, anywAssessmentId, assessmentAreaId, newOrExisting, whoSupports, reasonForReferral, rowOrder);
        }

        public string deleteAdditionalSupports(string token, long additionalSupportsId)
        {
            return dg.deleteAdditionalSupports(token, additionalSupportsId);
        }

        public string updateAdditionalSupports(string token, long additionalSupportsId, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText)
        {
            return dg.updateAdditionalSupports(token, additionalSupportsId, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText);
        }

        public string insertAdditionalSupports(string token, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText, int rowOrder)
        {
            return dg.insertAdditionalSupports(token, anywAssessmentId, assessmentAreaId, whoSupports, whatSupportLooksLike, howOftenValue, howOftenFrequency, howOftenText, rowOrder);
        }

        public string deleteSSModifications(string token, long modificationsId)
        {
            return dg.deleteSSModifications(token, modificationsId);
        }

        public string updateSSModifications(string token, long modificationsId, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            return dg.updateSSModifications(token, modificationsId, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string insertSSModifications(string token, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            return dg.insertSSModifications(token, anywAssessmentId, medicalRate, behaviorRate, icfRate, complexRate, developmentalRate, childIntensiveRate);
        }

        public string deletePaidSupports(string token, long paidSupportsId)
        {
            return dg.deletePaidSupports(token, paidSupportsId);
        }

        public string updateMultiPaidSupports(string token, string paidSupportsId, string providerId, string beginDate, string endDate)
        {
            return dg.updateMultiPaidSupports(token, paidSupportsId, providerId, beginDate, endDate);
        }
        public string updatePaidSupports(string token, long paidSupportsId, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, string serviceNameOther)
        {
            return dg.updatePaidSupports(token, paidSupportsId, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, serviceNameOther);
        }

        public string insertPaidSupports(string token, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, int rowOrder, string serviceNameOther)
        {
            return dg.insertPaidSupports(token, anywAssessmentId, providerId, assessmentAreaId, serviceNameId, scopeOfService, howOftenValue, howOftenFrequency, howOftenText, beginDate, endDate, fundingSource, fundingSourceText, rowOrder, serviceNameOther);
        }

        public string updatePaidSupportsRowOrder(string token, long assessmentId, long supportId, int newPos, int oldPos)
        {
            return dg.updatePaidSupportsRowOrder(token, assessmentId, supportId, newPos, oldPos);
        }

        public string updateModificationRowOrder(string token, long assessmentId, long modificationId, int newPos, int oldPos)
        {
            return dg.updateModificationRowOrder(token, assessmentId, modificationId, newPos, oldPos);
        }

        public string updateServiceReferralRowOrder(string token, long assessmentId, long referralId, int newPos, int oldPos)
        {
            return dg.updateServiceReferralRowOrder(token, assessmentId, referralId, newPos, oldPos);
        }

        public string updateAdditionalSupportsRowOrder(string token, long assessmentId, long addSupportId, int newPos, int oldPos)
        {
            return dg.updateAdditionalSupportsRowOrder(token, assessmentId, addSupportId, newPos, oldPos);
        }

        public void carryOverServicesToNewPlan(string consumerPlanId, string priorConsumerPlanId, string effectiveStart, string effectiveend, string targetAssessmentVersionId, string token, string revision)
        {
            long priorPlanId = long.Parse(priorConsumerPlanId);
            long newPlanId = long.Parse(consumerPlanId);
            string beginDate = "";
            string endDateT = "";
            string endDate = "";
            int result = 1;

            //Monitoring Review Process
            string reviewProcessString = podg.getMonitoringContinuousReviewProcess(priorPlanId.ToString());
            MonitoringReviewProcess[] reviewProcessObj = js.Deserialize<MonitoringReviewProcess[]>(reviewProcessString);
            string success = podg.updateMonitoringContinuousReviewProcess(newPlanId.ToString(), reviewProcessObj[0].monitoringContinuousReviewProcess);
            //Paid supports
            string paidSupportString = dg.getPaidSupports(token, priorPlanId, int.Parse(targetAssessmentVersionId));
            PaidSupports[] paidSupportObj = js.Deserialize<PaidSupports[]>(paidSupportString);
            string previousPlanEndString = dg.getPreviousPlanEnd(priorConsumerPlanId, token);
            PreviousPlanEnd[] previousEnd = js.Deserialize<PreviousPlanEnd[]>(previousPlanEndString);
            for (int i = 0; i < paidSupportObj.Length; i++)
            {
                if (revision == "false")
                {
                    //var bd = DateTime.Parse(paidSupportObj[i].beginDate);
                    var bd = DateTime.Parse(effectiveStart);
                    beginDate = bd.ToString("yyyy-MM-dd");
                    var ed = DateTime.Parse(effectiveend);
                    endDate = ed.ToString("yyyy-MM-dd");
                    var edT = DateTime.Parse(paidSupportObj[i].endDate);
                    endDateT = edT.ToString("yyyy-MM-dd");
                    DateTime previousEndDate = DateTime.Parse(previousEnd[0].endDate);
                    DateTime endTestDate = DateTime.Parse(endDateT);
                    //result = DateTime.Compare(endTestDate, previousEndDate);
                }
                else
                {
                    var bd = DateTime.Parse(paidSupportObj[i].beginDate);
                    beginDate = bd.ToString("yyyy-MM-dd");
                    var ed = DateTime.Parse(paidSupportObj[i].endDate);
                    endDate = ed.ToString("yyyy-MM-dd");
                    //beginDate = paidSupportObj[i].beginDate;
                    //endDate = paidSupportObj[i].endDate;
                    var edT = DateTime.Parse(endDate);
                    endDateT = edT.ToString("yyyy-MM-dd");
                    DateTime previousEndDate = DateTime.Parse(previousEnd[0].endDate);
                    DateTime endTestDate = DateTime.Parse(endDateT);
                    //result = DateTime.Compare(endTestDate, previousEndDate);
                }
                if (result < 0)
                {
                    //do nothing
                }
                else
                {
                    dg.insertPaidSupports(token, newPlanId, paidSupportObj[i].providerId, int.Parse(paidSupportObj[i].assessmentAreaId), int.Parse(paidSupportObj[i].serviceNameId), removeUnsavableNoteText(paidSupportObj[i].scopeOfservice), removeUnsavableNoteText(paidSupportObj[i].howOftenValue), int.Parse(paidSupportObj[i].howOftenFrequency), removeUnsavableNoteText(paidSupportObj[i].howOftenText), beginDate, endDate, int.Parse(paidSupportObj[i].fundingSource), removeUnsavableNoteText(paidSupportObj[i].fundingSourceText), int.Parse(paidSupportObj[i].rowOrder), removeUnsavableNoteText(paidSupportObj[i].serviceNameOther));
                }
            }
            //Support Modfications
            string supportModString = dg.getSSModifications(token, priorPlanId);
            SupportModifications[] supportModObj = js.Deserialize<SupportModifications[]>(supportModString);
            for (int i = 0; i < supportModObj.Length; i++)
            {
                dg.insertSSModifications(token, newPlanId, char.Parse(supportModObj[i].medicalRate), char.Parse(supportModObj[i].behaviorRate), char.Parse(supportModObj[i].icfRate), char.Parse(supportModObj[i].complexRate), char.Parse(supportModObj[i].developmentalRate), char.Parse(supportModObj[i].childIntensiveRate));
            }
            //Additional Supports
            string additionalSupportString = dg.getAdditionalSupports(token, priorPlanId, int.Parse(targetAssessmentVersionId));
            AdditionalSupports[] additionalSupportObj = js.Deserialize<AdditionalSupports[]>(additionalSupportString);
            for (int i = 0; i < additionalSupportObj.Length; i++)
            {
                dg.insertAdditionalSupports(token, newPlanId, int.Parse(additionalSupportObj[i].assessmentAreaId), removeUnsavableNoteText(additionalSupportObj[i].whoSupports), removeUnsavableNoteText(additionalSupportObj[i].whatSupportsLookLike), removeUnsavableNoteText(additionalSupportObj[i].howOftenValue), int.Parse(additionalSupportObj[i].howOftenFrequency), removeUnsavableNoteText(additionalSupportObj[i].howOftenText), int.Parse(additionalSupportObj[i].rowOrder));
            }
            //Professional Referrals
            string proRefString = dg.getProfessionalReferral(token, priorPlanId, int.Parse(targetAssessmentVersionId));
            ProfessionalReferrals[] proRefObj = js.Deserialize<ProfessionalReferrals[]>(proRefString);
            for (int i = 0; i < proRefObj.Length; i++)
            {
                dg.insertProfessionalReferral(token, newPlanId, int.Parse(proRefObj[i].assessmentAreaId), char.Parse(proRefObj[i].newOrExisting), removeUnsavableNoteText(proRefObj[i].whoSupports), removeUnsavableNoteText(proRefObj[i].reasonForReferral), int.Parse(proRefObj[i].rowOrder));
            }
        }

        public string removeUnsavableNoteText(string note)
        {
            if (note == "" || note is null)
            {
                return note;
            }
            //if (note.Contains("'"))
            //{
            //    note = note.Replace("'", "''");
            //}
            if (note.Contains("\\"))
            {
                note = note.Replace("\\", "");
            }
            //if (note.Contains("\""))
            //{
            //    note = note.Replace("\"", "\"");
            //}
            return note;
        }

        public class ServicesAndSupports
        {
            public PaidSupports[] paidSupport { get; set; }
            public SupportModifications[] supportModification { get; set; }

            public AdditionalSupports[] additionalSupport { get; set; }
            public ProfessionalReferrals[] professionalReferral { get; set; }
            public CommunicationsOptions[] communicationsOptions { get; set; }
            public EmploymentOptions[] employmentOptions { get; set; }
            public LevelsOfSupervision[] levelsOfsupervision { get; set; }
            public ConsumerRelationships[] experienceRelationships { get; set; }
            public WorkingNotWorking[] workingNotWorking { get; set; }
            public SectionsApplicable[] sectionsApplicable { get; set; }
            public AssessmentOutcomes[] assessmentOutcomes { get; set; }
            public MonitoringContinuousReviewProcess[] monitoringContinuousReviewProcess { get; set; }
        }

        public class MonitoringContinuousReviewProcess
        {
            public string monitoringContinuousReviewProcess { get; set; }
        }

        public class CommunicationsOptions
        {
            public string communicationsId { get; set; }
            public string communicationType { get; set; }
        }

        public class MonitoringReviewProcess
        {
            public string monitoringContinuousReviewProcess { get; set; }
        }

        public class EmploymentOptions
        {
            public string employmentId { get; set; }
            public string employmentOption { get; set; }
        }

        public class PreviousPlanEnd
        {
            public string endDate { get; set; }
        }

        public class LevelsOfSupervision
        {
            public string supervisionId { get; set; }
            public string supervisionLabel { get; set; }
            public string supervisiondescription { get; set; }
        }

        public class PaidSupports
        {
            public string paidSupportsId { get; set; }
            public string anywAssessmentId { get; set; }
            public string providerId { get; set; }
            public string assessmentAreaId { get; set; }
            public string serviceNameId { get; set; }
            public string scopeOfservice { get; set; }
            public string howOftenValue { get; set; }
            public string howOftenFrequency { get; set; }
            public string howOftenText { get; set; }
            public string beginDate { get; set; }
            public string endDate { get; set; }
            public string fundingSource { get; set; }
            public string fundingSourceText { get; set; }
            public string rowOrder { get; set; }
            public string serviceNameOther { get; set; }

        }

        public class SupportModifications
        {
            public string modificationsId { get; set; }
            public string anywAssessmentId { get; set; }
            public string medicalRate { get; set; }
            public string behaviorRate { get; set; }
            public string icfRate { get; set; }
            public string complexRate { get; set; }
            public string developmentalRate { get; set; }
            public string childIntensiveRate { get; set; }
        }

        public class AdditionalSupports
        {
            public string additionalSupportsId { get; set; }
            public string anywAssessmentId { get; set; }
            public string assessmentAreaId { get; set; }
            public string whoSupports { get; set; }
            public string whatSupportsLookLike { get; set; }
            public string howOftenValue { get; set; }
            public string howOftenFrequency { get; set; }
            public string howOftenText { get; set; }
            public string rowOrder { get; set; }
        }

        public class ProfessionalReferrals
        {
            public string professionalReferralId { get; set; }
            public string anywAssessmentId { get; set; }
            public string assessmentAreaId { get; set; }
            public string newOrExisting { get; set; }
            public string whoSupports { get; set; }
            public string reasonForReferral { get; set; }
            public string rowOrder { get; set; }
        }

        public class ConsumerRelationships
        {
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string middleName { get; set; }
            public string ID { get; set; }
            public string relationship { get; set; }

        }
        public class SectionsApplicable
        {
            public string sectionId { get; set; }
            public string applicable { get; set; }
        }
        public class WorkingNotWorking
        {
            public string questionNumber { get; set; }
            public string answer { get; set; }
            public string answerid { get; set; }
            public string answerRow { get; set; }
        }
        public class AssessmentOutcomes
        {
            public string ispconsumerId { get; set; }
            public string anywAssessmentId { get; set; }
            public string assessmentAreaId { get; set; }
        }
    }
}