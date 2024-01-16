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

        public void insertUpdateWaitingListValue(int id, string propertyName, string value, char insertOrDelete)
        {
            string tableName = "";
            string columnName = "";
            switch (propertyName)
            {
                //case "wlInfoId":

                //    // Handle wlInfoId
                //    break;
                case "personCompleting":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "assessor";
                    dg.insertUpdateWaitingListValue(id,tableName,columnName,value,insertOrDelete);
                    //return "success";
                    // Handle personCompleting
                    break;
                case "personCompletingTitle":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "assessor_title";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle personCompletingTitle
                    break;
                case "currentLivingArrangement":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "living_arrangement";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle currentLivingArrangement
                    break;
                case "areasPersonNeedsHelp":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "areas_needed_help";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle areasPersonNeedsHelp
                    break;
                case "participants":
                    // Handle participants
                    //return "";
                    break;
                case "otherThanMentalHealth":
                    tableName = "WLA_Conditions";
                    columnName = "Is_Other_Than_Mental_Health";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle otherThanMentalHealth
                    break;
                case "before22":
                    tableName = "WLA_Conditions";
                    columnName = "is_it_before_22";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle before22
                    break;
                case "isConditionIndefinite":
                    tableName = "WLA_Conditions";
                    columnName = "is_condition_indefinite";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isConditionIndefinite
                    break;
                case "isCountyBoardFunding":
                    tableName = "WLA_Active_Services";
                    columnName = "is_county_board_funding";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isCountyBoardFunding
                    break;
                case "isOhioEarlyInterventionService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_Ohio_early_intervention_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isOhioEarlyInterventionService
                    break;
                case "isBCMHService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_BCMH_Service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isBCMHService
                    break;
                case "isFCFCService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_FCFC_Service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isFCFCService
                    break;
                case "isODEService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_ODE_Service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isODEService
                    break;
                case "isOODService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_OOD_Service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isOODService
                    break;
                case "isChildrenServices":
                    tableName = "WLA_Active_Services";
                    columnName = "is_children_services";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isChildrenServices
                    break;
                case "isMedicaidStatePlanService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_medicaid_state_plan_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isMedicaidStatePlanService
                    break;
                case "isOhioHomeCareWaiverservice":
                    tableName = "WLA_Active_Services";
                    columnName = "is_Ohio_home_care_waiver_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isOhioHomeCareWaiverservice
                    break;
                case "isPassportWaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_passport_waiver_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isPassportWaiverService
                    break;
                case "isAssistedLivingWaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_assisted_living_waiver_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isAssistedLivingWaiverService
                    break;
                case "isMYCarewaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_mycare_waiver_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isMYCarewaiverService
                    break;
                case "isMedicaidStatePlanHomeHealthAideservice":
                    tableName = "WLA_Active_Services";
                    columnName = "is_medicaid_state_plan_home_health_aide_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isMedicaidStatePlanHomeHealthAideservice
                    break;
                case "isMedicaidStatePlanHomeHealthNursingService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_medicaid_state_plan_home_health_nursing_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isMedicaidStatePlanHomeHealthNursingService
                    break;
                case "isOtherService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_other_service";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isOtherService
                    break;
                case "otherDescription":
                    tableName = "WLA_Active_Services";
                    columnName = "other_description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle otherDescription
                    break;
                //case "circumstanceId":
                //    // Handle circumstanceId
                //    break;
                case "isPrimaryCaregiverUnavailable":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "is_primary_caregiver_unavailable";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isPrimaryCaregiverUnavailable
                    break;
                case "unavailableDocumentation":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "unavailable_documentation";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle unavailableDocumentation
                    break;
                case "additionalCommentsForUnavailable":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "additional_comments_for_unavailable";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle additionalCommentsForUnavailable
                    break;
                case "isActionRequiredIn30Days":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "is_action_required_in_30_days";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isActionRequiredIn30Days
                    break;
                case "isIndividualSkillsDeclined":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "is_individual_skills_declined";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle isIndividualSkillsDeclined
                    break;
                case "declinedSkillsDocumentation":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "declined_skills_documentation";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle declinedSkillsDocumentation
                    break;
                case "declinedSkillsDescription":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "declined_skills_description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle declinedSkillsDescription
                    break;
                case "actionRequiredDescription":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "action_required_description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle actionRequiredDescription
                    break;
                case "needsIsActionRequiredRequiredIn30Days":
                    tableName = "WLA_Needs";
                    columnName = "is_action_required_in_30_days";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle needsIsActionRequiredRequiredIn30Days
                    break;
                case "needsIsContinuousSupportRequired":
                    tableName = "WLA_Needs";
                    columnName = "is_continuous_support_required";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle needsIsContinuousSupportRequired
                    break;
                case "medicalNeedsIsLifeThreatening":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_life_threatening";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsLifeThreatening
                    break;
                case "medicalNeedsIsFrequentEmergencyVisit":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_frequent_emergency_visit";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsFrequentEmergencyVisit
                    break;
                case "medicalNeedsIsOngoingMedicalCare":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_ongoing_medical_care";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsOngoingMedicalCare
                    break;
                case "medicalNeedsIsSpecializedCareGiveNeeded":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_specialized_care_give_needed";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsSpecializedCareGiveNeeded
                    break;
                case "medicalNeedsIsOther":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_other";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsOther
                    break;
                case "medicalNeedsIsNone":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_none";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsNone
                    break;
                case "medicalNeedsDescription":
                    tableName = "WLA_Medical_Needs";
                    columnName = "description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle medicalNeedsIsNone
                    break;
                case "physicalNeedsIsPhysicalCareNeeded":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_physical_care_needed";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle physicalNeedsIsPhysicalCareNeeded
                    break;
                case "physicalNeedsIsPersonalCareNeeded":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_personal_care_needed";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle physicalNeedsIsPersonalCareNeeded
                    break;
                case "physicalNeedsIsRiskDuringPhysicalCare":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_risk_during_physical_care";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle physicalNeedsIsRiskDuringPhysicalCare
                    break;
                case "physicalNeedsIsOther":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_other";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle physicalNeedsIsOther
                    break;
                case "physicalNeedsIsNone":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_none";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle physicalNeedsIsNone
                    break;
                case "physicalNeedsDescription":
                    tableName = "WLA_Physical_Needs";
                    columnName = "description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle physicalNeedsIsNone
                    break;
                case "risksIsRiskToSelf":
                    tableName = "WLA_Risks";
                    columnName = "is_risk_to_self";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsRiskToSelf
                    break;
                case "risksIsPhysicalAggression":
                    tableName = "WLA_Risks";
                    columnName = "is_physical_aggression";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsPhysicalAggression
                    break;
                case "risksIsSelfInjury":
                    tableName = "WLA_Risks";
                    columnName = "is_self_injury";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsSelfInjury
                    break;
                case "risksIsFireSetting":
                    tableName = "WLA_Risks";
                    columnName = "is_fire_setting";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsFireSetting
                    break;
                case "risksIsElopement":
                    tableName = "WLA_Risks";
                    columnName = "is_elopement";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsElopement
                    break;
                case "risksIsSexualOffending":
                    tableName = "WLA_Risks";
                    columnName = "is_sexual_offending";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsSexualOffending
                    break;
                case "risksIsOther":
                    tableName = "WLA_Risks";
                    columnName = "is_other";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsOther
                    break;
                case "risksIsNone":
                    tableName = "WLA_Risks";
                    columnName = "is_none";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksIsNone
                    break;
                case "risksFrequencyDescription":
                    tableName = "WLA_Risks";
                    columnName = "Frequency_Description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksFrequencyDescription
                    break;
                case "risksHasPoliceReport":
                    tableName = "WLA_Risks";
                    columnName = "has_police_report";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksHasPoliceReport
                    break;
                case "risksHasIncidentReport":
                    tableName = "WLA_Risks";
                    columnName = "has_incident_report";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksHasIncidentReport
                    break;
                case "risksHasBehaviorTracking":
                    tableName = "WLA_Risks";
                    columnName = "has_behavior_tracking";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksHasBehaviorTracking
                    break;
                case "risksHasPsychologicalAssessment":
                    tableName = "WLA_Risks";
                    columnName = "has_psychological_assessment";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksHasPsychologicalAssessment
                    break;
                case "risksHasOtherDocument":
                    tableName = "WLA_Risks";
                    columnName = "has_other_document";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksHasOtherDocument
                    break;
                case "risksOtherDocumentDescription":
                    tableName = "WLA_Risks";
                    columnName = "other_document_description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksOtherDocumentDescription
                    break;
                case "risksHasNoDocument":
                    tableName = "WLA_Risks";
                    columnName = "has_no_document";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle risksHasNoDocument
                    break;
                case "rMIsSupportNeeded":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_support_needed";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsSupportNeeded
                    break;
                case "rMIsCountyBoardInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_county_board_investigation";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsCountyBoardInvestigation
                    break;
                case "rMIsLawEnforcementInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_law_enforcement_investigation";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsLawEnforcementInvestigation
                    break;
                case "rMIsAdultProtectiveServiceInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_adult_protective_service_investigation";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsAdultProtectiveServiceInvestigation
                    break;
                case "rMIsOtherInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_other_investigation";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsOtherInvestigation
                    break;
                case "rMIsNone":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_none";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsNone
                    break;
                case "rMdescription":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMdescription
                    break;
                case "rMIsActionRequiredIn3oDays":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_action_required_in_30_days";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rMIsActionRequiredIn3oDays
                    break;
                case "icfDetermination":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "determination";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle icfDetermination
                    break;
                case "icfIsICFResident":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "is_icf_resident";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle icfIsICFResident
                    break;
                case "icfIsNoticeIssued":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "is_notice_issued";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle icfIsNoticeIssued
                    break;
                case "icfIsActionRequiredIn30Days":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "is_action_required_in_30_days";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle icfIsActionRequiredIn30Days
                    break;
                case "intSupDetermination":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "determination";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle intSupDetermination
                    break;
                case "intSupIsSupportNeededIn12Months":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "is_support_needed_in_12_months";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle intSupIsSupportNeededIn12Months
                    break;
                case "intSupIsStayingLivingArrangement":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "is_staying_living_arrangement";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle intSupIsStayingLivingArrangement
                    break;
                case "intSupIsActionRequiredIn30Days":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "is_action_required_in_30_days";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle intSupIsActionRequiredIn30Days
                    break;
                case "cpaDetermination":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "determination";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle cpaDetermination
                    break;
                case "cpaIsReleasedNext12Months":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "is_released_next_12_months";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle cpaIsReleasedNext12Months
                    break;
                case "cpaAnticipateDate":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "anticipate_release_date";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle cpaAnticipateDate
                    break;
                case "cpaHasUnaddressableNeeds":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "has_unaddressable_needs";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle cpaHadUnaddressableNeeds
                    break;
                case "rwfWaiverFundingRequired":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "waiver_funding_required";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rwfWaiverFundingRequired
                    break;
                case "rwfNeedsMoreFrequency":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "needs_more_frequency";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rwfNeedsMoreFrequency
                    break;
                case "rwfNeedsServiceNotMetIDEA":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "needs_services_not_met_idea";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rwfNeedsServiceNotMetIDEA
                    break;
                case "rwfNeedsServicesNotMetOOD":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "needs_services_not_met_ood";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle rwfNeedsServicesNotMetOOD
                    break;
                case "dischargeDetermination":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "determination";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle dischargeDetermination
                    break;
                case "dischargeIsICFResident":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "is_icf_resident";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle dischargeIsICFResident
                    break;
                case "dischargeIsInterestedInMoving":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "is_interested_in_moving";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle dischargeIsInterestedInMoving
                    break;
                case "dischargeHasDischargePlan":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "has_discharge_plan";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    break;
                case "immNeedsRequired":
                    tableName = "WLA_Immediate_Needs";
                    columnName = "required";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle immNeedsRequired
                    break;
                case "immNeedsDescription":
                    tableName = "WLA_Immediate_Needs";
                    columnName = "description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle immNeedsDescription
                    break;
                case "waivEnrollWaiverEnrollmentIsRequired":
                    tableName = "WLA_Waiver_Enrollments";
                    columnName = "waiver_enrollment_is_required";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle waivEnrollWaiverEnrollmentIsRequired
                    break;
                case "waivEnrollWaiverEnrollmentDescription":
                    tableName = "WLA_Waiver_Enrollments";
                    columnName = "waiver_enrollment_description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle waivEnrollWaiverEnrollmentDescription
                    break;
                case "unmetNeedsHas":
                    tableName = "WLA_Unmet_Needs";
                    columnName = "has_unmet_needs";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle immNeedsDescription
                    break;
                case "unmetNeedsSupports":
                    tableName = "WLA_Unmet_Needs";
                    columnName = "has_any_unmet_supports";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle waivEnrollWaiverEnrollmentIsRequired
                    break;
                case "unmetNeedsDescription":
                    tableName = "WLA_Unmet_Needs";
                    columnName = "description";
                    dg.insertUpdateWaitingListValue(id, tableName, columnName, value, insertOrDelete);
                    //return "success";
                    // Handle waivEnrollWaiverEnrollmentDescription
                    break;
                default:
                    throw new ArgumentException("Invalid property name", nameof(propertyName));
                    //return "Error inserting record";
            }
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
            public string medicalNeedsDescription { get; set; }
            public string physicalNeedsIsPhysicalCareNeeded { get; set; }
            public string physicalNeedsIsPersonalCareNeeded { get; set; }
            public string physicalNeedsIsRiskDuringPhysicalCare { get; set; }
            public string physicalNeedsIsOther { get; set; }
            public string physicalNeedsIsNone { get; set; }
            public string physicalNeedsDescription { get; set; }
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
            public string cpaHasUnaddressableNeeds { get; set; }
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
            public string unmetNeedsHas { get; set; }
            public string unmetNeedsSupports { get; set; }
            public string unmetNeedsDescription { get; set; }
        }
    }
}