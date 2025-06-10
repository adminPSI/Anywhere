using Anywhere.service.Data.PlanOutcomes;
using Anywhere.service.Data.PlanServicesAndSupports;
using System;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;
using static Anywhere.service.Data.PlanServicesAndSupports.ServicesAndSupportsWorker;

namespace Anywhere.service.Data.PlanValidation
{
    public class PlanValidationWorker
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        PlanValidationDataGetter pvdg = new PlanValidationDataGetter();
        ServicesAndSupportsDataGetter dg = new ServicesAndSupportsDataGetter();
        PlanOutcomesDataGetter pdg = new PlanOutcomesDataGetter();

        public class ContactValidationData
        {
            public string bestWayToConnect { get; set; }
            public string importantPeopleType { get; set; }
            public string importantPeopleTypeOther { get; set; }
            public string importantPlacesType { get; set; }
            public string importantPlacesTypeOther { get; set; }
            public string moreDetail { get; set; }
        }

        public ContactValidationData[] getContactValidationData(string token, string planId)
        {
            try
            {
                string result = pvdg.getContactValidationData(token, planId);
                ContactValidationData[] contactValidationObj = js.Deserialize<ContactValidationData[]>(result);
                return contactValidationObj;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public class SummaryRiskValidation
        {
            public int QuestionId { get; set; }
            public string QuestionText { get; set; }
            public int QuestionSetId { get; set; }
            public string Answer { get; set; }
            public int SectionId { get; set; }
        }

        public SummaryRiskValidation[] getSummaryRiskValidationData(string token, string planId)
        {
            try
            {
                string result = pvdg.getSummaryRiskValidationData(token, planId);
                SummaryRiskValidation[] contactValidationObj = js.Deserialize<SummaryRiskValidation[]>(result);
                return contactValidationObj;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public ServicesAndSupports getAssessmentValidationData(string token, string oldPlanId)
        {
            long planId = long.Parse(oldPlanId);
            //Paid Support
            string paidSupportString = dg.getPaidSupports(token, planId, 0);
            PaidSupports[] paidSupportObj = js.Deserialize<PaidSupports[]>(paidSupportString);
            //Additional Supports
            string additionalSupportString = dg.getAdditionalSupports(token, planId, 0);
            AdditionalSupports[] additionalSupportObj = js.Deserialize<AdditionalSupports[]>(additionalSupportString);
            //Professional Referrals
            string proRefString = dg.getProfessionalReferral(token, planId, 0);
            ProfessionalReferrals[] proRefObj = js.Deserialize<ProfessionalReferrals[]>(proRefString);
            //Working/Not Working
            string workingNotWorking = dg.getWorkingNotWorkingAnswers(token, planId);
            WorkingNotWorking[] workingNotWorkingObj = js.Deserialize<WorkingNotWorking[]>(workingNotWorking);
            //Sections Applicable
            string sectionsApplicable = dg.getSectionsApplicable(token, planId);
            SectionsApplicable[] sectionsAPplicalbeObj = js.Deserialize<SectionsApplicable[]>(sectionsApplicable);
            //Total Outcomes
            string assessmentOutcomes = dg.getAssessmentOutcomes(token, planId, 0);
            AssessmentOutcomes[] assessmentOutcomesObj = js.Deserialize<AssessmentOutcomes[]>(assessmentOutcomes);


            ServicesAndSupports totalServicesAndSupports = new ServicesAndSupports();
            totalServicesAndSupports.paidSupport = paidSupportObj;
            totalServicesAndSupports.additionalSupport = additionalSupportObj;
            totalServicesAndSupports.professionalReferral = proRefObj;
            totalServicesAndSupports.workingNotWorking = workingNotWorkingObj;
            totalServicesAndSupports.sectionsApplicable = sectionsAPplicalbeObj;
            totalServicesAndSupports.assessmentOutcomes = assessmentOutcomesObj;

            return totalServicesAndSupports;
        }

        public PlanTotalOutcome getISPValidationData(string token, string assessmentId)
        {
            //get outcome
            string planOutcomesString = pvdg.getPlanOutcomes(token, assessmentId);
            PlanOutcomes[] planOutcomesObj = js.Deserialize<PlanOutcomes[]>(planOutcomesString);
            //get experiences
            string planOutcomesExperiencesString = pvdg.getPlanExperiences(token, assessmentId);
            PlanOutcomesExperiences[] planOutcomesExperiencesObj = js.Deserialize<PlanOutcomesExperiences[]>(planOutcomesExperiencesString);
            //get experience responsibilities for each experience      
            for (int j = 0; j < planOutcomesExperiencesObj.Length; j++)
            {
                string experienceResponsibilityString = pdg.getPlanExperienceResponsibility(planOutcomesExperiencesObj[j].experienceId);
                PlanOutcomeExperienceResponsibilities[] experienceResponsibilityObj = js.Deserialize<PlanOutcomeExperienceResponsibilities[]>(experienceResponsibilityString);
                planOutcomesExperiencesObj[j].planExperienceResponsibilities = experienceResponsibilityObj;
            }
            //get review
            string planOutcomesReviewString = pvdg.getPlanReviews(token, assessmentId);
            PlanOutcomesReviews[] planOutcomesReviewObj = js.Deserialize<PlanOutcomesReviews[]>(planOutcomesReviewString);
            //get progress summary
            string planOutcomesProgressSummaryString = pdg.getPlanOutcomeProgressSummary(token, assessmentId);
            PlanPorgressSummary[] planOutcomesProgressSummaryObj = js.Deserialize<PlanPorgressSummary[]>(planOutcomesProgressSummaryString);

            //Paid Support
            long anywAssessmentId;
            anywAssessmentId = long.Parse(assessmentId);
            ServicesAndSupportsDataGetter dataGetter = new ServicesAndSupportsDataGetter();
            string paidSupportString = pvdg.getPaidSupports(token, anywAssessmentId, 0);
            PaidSupports[] paidSupportObj = js.Deserialize<PaidSupports[]>(paidSupportString);

            PlanTotalOutcome totalOutcome = new PlanTotalOutcome();
            totalOutcome.planOutcome = planOutcomesObj;
            totalOutcome.planOutcomeExperiences = planOutcomesExperiencesObj;
            totalOutcome.planReviews = planOutcomesReviewObj;
            totalOutcome.planProgressSummary = planOutcomesProgressSummaryObj;
            totalOutcome.paidSupports = paidSupportObj;

            return totalOutcome;
        }


        public class ServicesAndSupports
        {
            public PaidSupports[] paidSupport { get; set; }
            public AdditionalSupports[] additionalSupport { get; set; }
            public ProfessionalReferrals[] professionalReferral { get; set; }
            public WorkingNotWorking[] workingNotWorking { get; set; }
            public SectionsApplicable[] sectionsApplicable { get; set; }
            public AssessmentOutcomes[] assessmentOutcomes { get; set; }
        }

        public class PaidSupports
        {
            public string paidSupportsId { get; set; }
            public string anywAssessmentId { get; set; }
            public string providerId { get; set; }
            public string assessmentAreaId { get; set; }
            public string beginDate { get; set; }
            public string endDate { get; set; }

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

        public class PlanOutcomes
        {
            public string outcomeId { get; set; }
            public string details { get; set; }
            public string outcome { get; set; }
            public string history { get; set; }
            public string sectionId { get; set; }
            public string outcomeOrder { get; set; }
            public string summaryOfProgress { get; set; }
            public string status { get; set; }
            public string carryOverReason { get; set; }
        }

        public class PlanTotalOutcome
        {
            public PlanOutcomes[] planOutcome { get; set; }
            public PlanOutcomesExperiences[] planOutcomeExperiences { get; set; }
            public PlanOutcomesReviews[] planReviews { get; set; }
            public PlanPorgressSummary[] planProgressSummary { get; set; }
            public PaidSupports[] paidSupports { get; set; }
        }

    }
}