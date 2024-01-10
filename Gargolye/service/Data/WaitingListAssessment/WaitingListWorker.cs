using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;

namespace Anywhere.service.Data.WaitingListAssessment
{
    public class WaitingListWorker
    {
        WaitingListDataGetter dg = new WaitingListDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public LandingPageInfo[] getLandingPageForConsumer(string token, double consumerId)
        {
            string landingPageInfo = "";
            landingPageInfo = dg.getLandingPageForConsumer(token, consumerId);
            LandingPageInfo[] landingPageObj = js.Deserialize<LandingPageInfo[]>(landingPageInfo);

            return landingPageObj;
        }

        public WaitingList[] getWaitingListAssessment(int waitingListAssessmentId)
        {
            string assessmentString = "";
            assessmentString = dg.getWaitingListAssessment(waitingListAssessmentId);
            WaitingList[] waitingLists = js.Deserialize<WaitingList[]>(assessmentString);

            return waitingLists;
        }

        public class LandingPageInfo
        {
            public string wlInfoId { get; set; }
            public string interviewDate { get; set; }
            public string conclusionResult { get; set; }
            public string conclusionDate { get; set; }
            public string sentToDODD { get; set; }
        }


        public class WaitingList
        {
            public string wlInfoId { get; set; }
            public string personCompleting { get; set; }
            public string personCompletingTitle { get; set; }
            public string currentLivingArrangement { get; set; }
            public string areasPersonNeedsHelp { get; set; }

            public string participants { get; set; }
            public string otherThanMentalHealth { get; set; }
            public string before22 { get; set; }
            public string isConditionIndefinite { get; set; }
            public string isCountyBoardFunding { get; set; }

            public string isOhioEarlyInterventionService { get; set; }
            public string isBCMHService { get; set; }
            public string isFCFCService { get; set; }
            public string isODEService { get; set; }
            public string isOODService { get; set; }

            public string isChildrenServices { get; set; }
            public string isMedicaidStatePlanService { get; set; }
            public string isOhioHomeCareWaiverservice { get; set; }
            public string isPassportWaiverService { get; set; }
            public string isAssistedLivingWaiverService { get; set; }

            public string isMYCarewaiverService { get; set; }
            public string isMedicaidStatePlanHomeHealthAideservice { get; set; }
            public string isMedicaidStatePlanHomeHealthNursingService { get; set; }
            public string isOtherService { get; set; }
            public string otherDescription { get; set; }

            public string circumstanceId { get; set; }
            public string isPrimaryCaregiverUnavailable { get; set; }
            public string unavailableDocumentation { get; set; }
            public string additionalCommentsForUnavailable { get; set; }
            public string isActionRequiredIn30Days { get; set; }

            public string isIndividualSkillsDeclined { get; set; }
            public string declinedSkillsDocumentation { get; set; }
            public string declinedSkillsDescription { get; set; }
            public string actionRequiredDescription { get; set; }
            public string needsIsActionRequiredRequiredIn30Days { get; set; }

            public string needsIsContinuousSupportRequired { get; set; }
            public string medicalNeedsIsLifeThreatening { get; set; }
            public string medicalNeedsIsFrequentEmergencyVisit { get; set; }
            public string medicalNeedsIsOngoingMedicalCare { get; set; }
            public string medicalNeedsIsSpecializedCareGiveNeeded { get; set; }

            public string medicalNeedsIsOther { get; set; }
            public string medicalNeedsIsNone { get; set; }
            public string physicalNeedsIsPhysicalCareNeeded { get; set; }
            public string physicalNeedsIsPersonalCareNeeded { get; set; }
            public string physicalNeedsIsRiskDuringPhysicalCare { get; set; }

            public string physicalNeedsIsOther { get; set; }
            public string physicalNeedsIsNone { get; set; }
            public string risksIsRiskToSelf { get; set; }
            public string risksIsPhysicalAggression { get; set; }
            public string risksIsSelfInjury { get; set; }

            public string risksIsFireSetting { get; set; }
            public string risksIsElopement { get; set; }
            public string risksIsSexualOffending { get; set; }
            public string risksIsOther { get; set; }
            public string risksIsNone { get; set; }

            public string risksFrequencyDescription { get; set; }
            public string risksHasPoliceReport { get; set; }
            public string risksHasIncidentReport { get; set; }
            public string risksHasBehaviorTracking { get; set; }
            public string risksHasPsychologicalAssessment { get; set; }

            public string risksHasOtherDocument { get; set; }
            public string risksOtherDocumentDescription { get; set; }
            public string risksHasNoDocument { get; set; }
            public string rMIsSupportNeeded { get; set; }
            public string rMIsCountyBoardInvestigation { get; set; }

            public string rMIsLawEnforcementInvestigation { get; set; }
            public string rMIsAdultProtectiveServiceInvestigation { get; set; }
            public string rMIsOtherInvestigation { get; set; }
            public string rMIsNone { get; set; }
            public string rMdescription { get; set; }

            public string rMIsActionRequiredIn3oDays { get; set; }
            public string icfDetermination { get; set; }
            public string icfIsICFResident { get; set; }
            public string icfIsNoticeIssued { get; set; }
            public string icfIsActionRequiredIn30Days { get; set; }

            public string intSupDetermination { get; set; }
            public string intSupIsSupportNeededIn12Months { get; set; }
            public string intSupIsStayingLivingArrangement { get; set; }
            public string intSupIsActionRequiredIn30Days { get; set; }
            public string cpaDetermination { get; set; }

            public string cpaIsReleasedNext12Months { get; set; }
            public string cpaAnticipateDate { get; set; }
            public string cpaHadUnaddressableNeeds { get; set; }
            public string rwfWaiverFundingRequired { get; set; }
            public string rwfNeedsMoreFrequency { get; set; }

            public string rwfNeedsServiceNotMetIDEA { get; set; }
            public string rwfNeedsServicesNotMetOOD { get; set; }
            public string dischargeDetermination { get; set; }
            public string dischargeIsICFResident { get; set; }
            public string dischargeIsInterestedInMoving { get; set; }

            public string dischargeHasDischargePlan { get; set; }
            public string immNeedsRequired { get; set; }
            public string immNeedsDescription { get; set; }
            public string waivEnrollWaiverEnrollmentIsRequired { get; set; }
            public string waivEnrollWaiverEnrollmentDescription { get; set; }
        }
    }
}