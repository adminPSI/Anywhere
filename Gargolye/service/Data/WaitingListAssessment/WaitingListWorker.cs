// using DocumentFormat.OpenXml.Wordprocessing;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.Plan.AnywherePlanWorker;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;
using static Anywhere.service.Data.SimpleMar.SignInUser;

namespace Anywhere.service.Data.WaitingListAssessment
{
    public class WaitingListWorker
    {
        WaitingListDataGetter dg = new WaitingListDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public string deleteSupportingDocument(string token, string attachmentId)
        {
            return dg.deleteSupportingDocument(token, attachmentId);
        }
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

        public FundingSources[] getWaitingListFundingSources()
        {
            string fundSourceString = "";
            fundSourceString = dg.getWaitingListFundingSources();
            FundingSources[] fundSourceObj = js.Deserialize<FundingSources[]>(fundSourceString);

            return fundSourceObj;
        }

        public string deleteFromWaitingList(string[] properties)
        {
            var i = 0;
            string columnForId = "";

            foreach (string property in properties)
            {
                string[] parts = property.Split('|');
                switch (parts[1].ToString())
                {
                    case "WLA_Waiting_List_Information":
                        columnForId = "WLA_Waiting_List_Information_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Conditions":
                        columnForId = "WLA_Condition_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Active_Services":
                        columnForId = "WLA_Active_Service_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Primary_Caregivers":
                        columnForId = "WLA_Primary_Caregiver_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Needs":
                        columnForId = "WLA_Needs_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Medical_Needs":
                        columnForId = "WLA_Medical_Need_ID"; 
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId); 
                        break;
                    case "WLA_Physical_Needs":
                        columnForId = "WLA_Physical_Need_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Risks":
                        columnForId = "WLA_Risk_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Risk_Mitigations":
                        columnForId = "WLA_Risk_Mitigation_ID"; 
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_ICF_Discharges":                        
                        columnForId = "WLA_ICF_Discharge_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Intermitent_Supports":
                        columnForId = "WLA_Intermitent_Support_ID"; 
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Child_Protection_Agencies":
                        columnForId = "WLA_Child_Protection_Agency_ID"; 
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Require_Waiver_Fundings":
                        columnForId = "WLA_Require_Waiver_Funding_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Discharge_Plans":
                        columnForId = "WLA_Discharge_Plan_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Immediate_Needs":
                        columnForId = "WLA_Immediate_Need_ID";
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Waiver_Enrollments":
                        columnForId = "WLA_Waiver_Enrollment_ID"; 
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                    case "WLA_Unmet_Needs":
                        columnForId = "WLA_Unmet_Need_ID"; 
                        dg.deleteFromWaitingList(parts[0], parts[1], columnForId);
                        break;
                }
            }
            

            return "success";
        }

        public string insertUpdateWaitingListValue(int id, int linkId, string propertyName, string value, string valueTwo, char insertOrUpdate)
        {
            string tableName = "";
            string columnName = "";
            string linkColumnName = "";
            string idNameForWhere = "";
            if (stringInjectionValidator(value) == false) return null;
            switch (propertyName)
            {
                case "getCircumstanceId":
                    tableName = "WLA_Circumstances";
                    columnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    break;
                case "consumerId":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "id";
                    idNameForWhere = "WLA_Waiting_List_Information_ID"; 
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);                    
                    // Handle personCompleting
                    break;
                case "personCompleting":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "assessor";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle personCompleting
                    break;
                case "personCompletingTitle":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "assessor_title";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle personCompletingTitle
                    break;
                case "currentLivingArrangement":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "living_arrangement";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle currentLivingArrangement
                    break; 
                case "livingArrangementOther":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "living_arrangement_other";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);

                case "fundingSourceId":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "funding_source_id";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);

                    // Handle currentLivingArrangement
                    break;
                case "areasPersonNeedsHelp":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "areas_needed_help";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                case "conclussionDeterminedBy":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "conclusion_determined_by";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                case "conclusionDeterminedByTitle":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "Conclusion_Determined_By_Title";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                case "conclusionDeterminedOn":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "conclusion_determined_on";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                case "conclusionResult":
                    tableName = "WLA_Waiting_List_Information";
                    columnName = "conclusion_result";
                    idNameForWhere = "WLA_Waiting_List_Information_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    // Handle areasPersonNeedsHelp
                    break;
                case "participants":
                    tableName = "WLA_Participants";
                    columnName = "participants";
                    idNameForWhere = "WLA_Participant_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    // Handle participants
                    return  "";
                    break;
                case "otherThanMentalHealth":
                    tableName = "WLA_Conditions";
                    columnName = "Is_Other_Than_Mental_Health";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Condition_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle otherThanMentalHealth
                    break;
                case "before22":
                    tableName = "WLA_Conditions";
                    columnName = "is_it_before_22";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Condition_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle before22
                    break;
                case "isConditionIndefinite":
                    tableName = "WLA_Conditions";
                    columnName = "is_condition_indefinite";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Condition_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isConditionIndefinite
                    break;
                case "isCountyBoardFunding":
                    tableName = "WLA_Active_Services";
                    columnName = "is_county_board_funding";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isCountyBoardFunding
                    break;
                case "isOhioEarlyInterventionService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_Ohio_early_intervention_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isOhioEarlyInterventionService
                    break;
                case "isBCMHService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_BCMH_Service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isBCMHService
                    break;
                case "isFCFCService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_FCFC_Service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isFCFCService
                    break;
                case "isODEService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_ODE_Service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isODEService
                    break;
                case "isOODService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_OOD_Service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isOODService
                    break;
                case "isChildrenServices":
                    tableName = "WLA_Active_Services";
                    columnName = "is_children_services";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isChildrenServices
                    break;
                case "isMedicaidStatePlanService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_medicaid_state_plan_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isMedicaidStatePlanService
                    break;
                case "isOhioHomeCareWaiverservice":
                    tableName = "WLA_Active_Services";
                    columnName = "is_Ohio_home_care_waiver_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isOhioHomeCareWaiverservice
                    break;
                case "isPassportWaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_passport_waiver_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isPassportWaiverService
                    break;
                case "isAssistedLivingWaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_assisted_living_waiver_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isAssistedLivingWaiverService
                    break;
                case "isMYCarewaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_mycare_waiver_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isMYCarewaiverService
                    break;
                case "isSelfWaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_self_waiver_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);

                    // Handle isMYCarewaiverService
                    break;
                case "isLevelOneWaiverService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_level_one_waiver_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);

                    // Handle isMYCarewaiverService
                    break;
                case "isMedicaidStatePlanHomeHealthAideservice":
                    tableName = "WLA_Active_Services";
                    columnName = "is_medicaid_state_plan_home_health_aide_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isMedicaidStatePlanHomeHealthAideservice
                    break;
                case "isMedicaidStatePlanHomeHealthNursingService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_medicaid_state_plan_home_health_nursing_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isMedicaidStatePlanHomeHealthNursingService
                    break;
                case "isOtherService":
                    tableName = "WLA_Active_Services";
                    columnName = "is_other_service";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isOtherService
                    break;
                case "otherDescription":
                    tableName = "WLA_Active_Services";
                    columnName = "other_description";
                    linkColumnName = "WLA_Waiting_List_Information_ID";
                    idNameForWhere = "WLA_Active_Service_Id";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle otherDescription
                    break;
                //case "circumstanceId":
                //    // Handle circumstanceId
                //    break;
                case "isPrimaryCaregiverUnavailable":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "is_primary_caregiver_unavailable";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isPrimaryCaregiverUnavailable
                    break;
                case "unavailableDocumentation":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "unavailable_documentation";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle unavailableDocumentation
                    break;
                case "additionalCommentsForUnavailable":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "additional_comments_for_unavailable";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle additionalCommentsForUnavailable
                    break;
                case "isActionRequiredIn30Days":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "is_action_required_in_30_days";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isActionRequiredIn30Days
                    break;
                case "isIndividualSkillsDeclined":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "is_individual_skills_declined";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle isIndividualSkillsDeclined
                    break;
                case "declinedSkillsDocumentation":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "declined_skills_documentation";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle declinedSkillsDocumentation
                    break;
                case "declinedSkillsDescription":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "declined_skills_description";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle declinedSkillsDescription
                    break;
                case "actionRequiredDescription":
                    tableName = "WLA_Primary_Caregivers";
                    columnName = "action_required_description";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_primary_caregiver_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle actionRequiredDescription
                    break;
                case "needsIsActionRequiredRequiredIn30Days":
                    tableName = "WLA_Needs";
                    columnName = "is_action_required_in_30_days";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle needsIsActionRequiredRequiredIn30Days
                    break;
                case "needsIsContinuousSupportRequired":
                    tableName = "WLA_Needs";
                    columnName = "is_continuous_support_required";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle needsIsContinuousSupportRequired
                    break;
                case "medicalNeedsIsLifeThreatening":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_life_threatening";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsLifeThreatening
                    break;
                case "medicalNeedsIsFrequentEmergencyVisit":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_frequent_emergency_visit";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsFrequentEmergencyVisit
                    break;
                case "medicalNeedsIsOngoingMedicalCare":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_ongoing_medical_care";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsOngoingMedicalCare
                    break;
                case "medicalNeedsIsSpecializedCareGiveNeeded":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_specialized_care_give_needed";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsSpecializedCareGiveNeeded
                    break;
                case "medicalNeedsIsOther":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_other";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsOther
                    break;
                case "medicalNeedsIsNone":
                    tableName = "WLA_Medical_Needs";
                    columnName = "is_none";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsNone
                    break;
                case "medicalNeedsDescription":
                    tableName = "WLA_Medical_Needs";
                    columnName = "description";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Medical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle medicalNeedsIsNone
                    break;
                case "physicalNeedsIsPhysicalCareNeeded":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_physical_care_needed";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Physical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle physicalNeedsIsPhysicalCareNeeded
                    break;
                case "physicalNeedsIsPersonalCareNeeded":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_personal_care_needed";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Physical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle physicalNeedsIsPersonalCareNeeded
                    break;
                case "physicalNeedsIsRiskDuringPhysicalCare":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_risk_during_physical_care";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Physical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle physicalNeedsIsRiskDuringPhysicalCare
                    break;
                case "physicalNeedsIsOther":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_other";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Physical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle physicalNeedsIsOther
                    break;
                case "physicalNeedsIsNone":
                    tableName = "WLA_Physical_Needs";
                    columnName = "is_none";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Physical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle physicalNeedsIsNone
                    break;
                case "physicalNeedsDescription":
                    tableName = "WLA_Physical_Needs";
                    columnName = "description";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Physical_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle physicalNeedsIsNone
                    break;
                case "risksIsRiskToSelf":
                    tableName = "WLA_Risks";
                    columnName = "is_risk_to_self";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsRiskToSelf
                    break;
                case "risksIsPhysicalAggression":
                    tableName = "WLA_Risks";
                    columnName = "is_physical_aggression";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsPhysicalAggression
                    break;
                case "risksIsSelfInjury":
                    tableName = "WLA_Risks";
                    columnName = "is_self_injury";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsSelfInjury
                    break;
                case "risksIsFireSetting":
                    tableName = "WLA_Risks";
                    columnName = "is_fire_setting";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsFireSetting
                    break;
                case "risksIsElopement":
                    tableName = "WLA_Risks";
                    columnName = "is_elopement";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsElopement
                    break;
                case "risksIsSexualOffending":
                    tableName = "WLA_Risks";
                    columnName = "is_sexual_offending";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsSexualOffending
                    break;
                case "risksIsOther":
                    tableName = "WLA_Risks";
                    columnName = "is_other";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsOther
                    break;
                case "risksIsNone":
                    tableName = "WLA_Risks";
                    columnName = "is_none";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksIsNone
                    break;
                case "risksFrequencyDescription":
                    tableName = "WLA_Risks";
                    columnName = "Frequency_Description";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksFrequencyDescription
                    break;
                case "risksHasPoliceReport":
                    tableName = "WLA_Risks";
                    columnName = "has_police_report";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksHasPoliceReport
                    break;
                case "risksHasIncidentReport":
                    tableName = "WLA_Risks";
                    columnName = "has_incident_report";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksHasIncidentReport
                    break;
                case "risksHasBehaviorTracking":
                    tableName = "WLA_Risks";
                    columnName = "has_behavior_tracking";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksHasBehaviorTracking
                    break;
                case "risksHasPsychologicalAssessment":
                    tableName = "WLA_Risks";
                    columnName = "has_psychological_assessment";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksHasPsychologicalAssessment
                    break;
                case "risksHasOtherDocument":
                    tableName = "WLA_Risks";
                    columnName = "has_other_document";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksHasOtherDocument
                    break;
                case "risksOtherDocumentDescription":
                    tableName = "WLA_Risks";
                    columnName = "other_document_description";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksOtherDocumentDescription
                    break;
                case "risksHasNoDocument":
                    tableName = "WLA_Risks";
                    columnName = "has_no_document";
                    linkColumnName = "WLA_Need_Id";
                    idNameForWhere = "WLA_Risk_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle risksHasNoDocument
                    break;
                case "rMIsSupportNeeded":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_support_needed";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsSupportNeeded
                    break;
                case "rMIsCountyBoardInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_county_board_investigation";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsCountyBoardInvestigation
                    break;
                case "rMIsLawEnforcementInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_law_enforcement_investigation";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsLawEnforcementInvestigation
                    break;
                case "rMIsAdultProtectiveServiceInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_adult_protective_service_investigation";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsAdultProtectiveServiceInvestigation
                    break;
                case "rMIsOtherInvestigation":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_other_investigation";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsOtherInvestigation
                    break;
                case "rMIsNone":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_none";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsNone
                    break;
                case "rMdescription":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "description";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMdescription
                    break;
                case "rMIsActionRequiredIn3oDays":
                    tableName = "WLA_Risk_Mitigations";
                    columnName = "is_action_required_in_30_days";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Risk_Mitigation_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rMIsActionRequiredIn3oDays
                    break;
                case "icfDetermination":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "determination";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_ICF_Discharge_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle icfDetermination
                    break;
                case "icfIsICFResident":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "is_icf_resident";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_ICF_Discharge_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle icfIsICFResident
                    break;
                case "icfIsNoticeIssued":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "is_notice_issued";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_ICF_Discharge_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle icfIsNoticeIssued
                    break;
                case "icfIsActionRequiredIn30Days":
                    tableName = "WLA_ICF_Discharges";
                    columnName = "is_action_required_in_30_days";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_ICF_Discharge_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle icfIsActionRequiredIn30Days
                    break;
                case "intSupDetermination":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "determination";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Intermitent_Support_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle intSupDetermination
                    break;
                case "intSupIsSupportNeededIn12Months":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "is_support_needed_in_12_months";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Intermitent_Support_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle intSupIsSupportNeededIn12Months
                    break;
                case "intSupIsStayingLivingArrangement":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "is_staying_living_arrangement";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Intermitent_Support_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle intSupIsStayingLivingArrangement
                    break;
                case "intSupIsActionRequiredIn30Days":
                    tableName = "WLA_Intermitent_Supports";
                    columnName = "is_action_required_in_30_days";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Intermitent_Support_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle intSupIsActionRequiredIn30Days
                    break;
                case "cpaDetermination":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "determination";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Child_Protection_Agency_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle cpaDetermination
                    break;
                case "cpaIsReleasedNext12Months":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "is_released_next_12_months";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Child_Protection_Agency_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle cpaIsReleasedNext12Months
                    break;
                case "cpaAnticipateDate":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "anticipate_release_date";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Child_Protection_Agency_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle cpaAnticipateDate
                    break;
                case "cpaHasUnaddressableNeeds":
                    tableName = "WLA_Child_Protection_Agencies";
                    columnName = "has_unaddressable_needs";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Child_Protection_Agency_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle cpaHadUnaddressableNeeds
                    break;
                case "rwfWaiverFundingRequired":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "waiver_funding_required";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Require_Waiver_funding_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rwfWaiverFundingRequired
                    break;
                case "rwfNeedsMoreFrequency":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "needs_more_frequency";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Require_Waiver_funding_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rwfNeedsMoreFrequency
                    break;
                case "rwfNeedsServiceNotMetIDEA":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "needs_services_not_met_idea";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Require_Waiver_funding_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rwfNeedsServiceNotMetIDEA
                    break;
                case "rwfNeedsServicesNotMetOOD":
                    tableName = "WLA_Require_Waiver_Fundings";
                    columnName = "needs_services_not_met_ood";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Require_Waiver_funding_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle rwfNeedsServicesNotMetOOD
                    break;
                case "dischargeDetermination":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "determination";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Discharge_Plan_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle dischargeDetermination
                    break;
                case "dischargeIsICFResident":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "is_icf_resident";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Discharge_Plan_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle dischargeIsICFResident
                    break;
                case "dischargeIsInterestedInMoving":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "is_interested_in_moving";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Discharge_Plan_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle dischargeIsInterestedInMoving
                    break;
                case "dischargeHasDischargePlan":
                    tableName = "WLA_Discharge_Plans";
                    columnName = "has_discharge_plan";
                    linkColumnName = "WLA_Circumstance_Id";
                    idNameForWhere = "WLA_Discharge_Plan_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    break;
                case "immNeedsRequired":
                    tableName = "WLA_Immediate_Needs";
                    columnName = "required";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Immediate_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle immNeedsRequired
                    break;
                case "immNeedsDescription":
                    tableName = "WLA_Immediate_Needs";
                    columnName = "description";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Immediate_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle immNeedsDescription
                    break;
                case "waivEnrollWaiverEnrollmentIsRequired":
                    tableName = "WLA_Waiver_Enrollments";
                    columnName = "waiver_enrollment_is_required";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Waiver_Enrollment_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle waivEnrollWaiverEnrollmentIsRequired
                    break;
                case "waivEnrollWaiverEnrollmentDescription":
                    tableName = "WLA_Waiver_Enrollments";
                    columnName = "waiver_enrollment_description";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Waiver_Enrollment_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle waivEnrollWaiverEnrollmentDescription
                    break;
                case "unmetNeedsHas":
                    tableName = "WLA_Unmet_Needs";
                    columnName = "has_unmet_needs";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Unmet_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle immNeedsDescription
                    break;
                case "unmetNeedsSupports":
                    tableName = "WLA_Unmet_Needs";
                    columnName = "has_any_unmet_supports";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Unmet_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle waivEnrollWaiverEnrollmentIsRequired
                    break;
                case "unmetNeedsDescription":
                    tableName = "WLA_Unmet_Needs";
                    columnName = "description";
                    linkColumnName = "WLA_Waiting_List_Information_Id";
                    idNameForWhere = "WLA_Unmet_Need_ID";
                    return dg.insertUpdateWaitingListValue(id, linkId, tableName, columnName, linkColumnName, idNameForWhere, value, valueTwo, insertOrUpdate);
                    
                    // Handle waivEnrollWaiverEnrollmentDescription
                    break;
                default:
                    throw new ArgumentException("Invalid property name", nameof(propertyName));
                    return  "Error inserting record";
            }
        }

        public SupportingDocument[] addWLSupportingDocument(string token, long waitingListInformationId, string description, char includeOnEmail, string attachmentType, string attachment)
        {
            string attachmentsString = dg.addWLSupportingDocument(token, waitingListInformationId, description, includeOnEmail, attachmentType, attachment);
            SupportingDocument[] attachmentsObj = js.Deserialize<SupportingDocument[]>(attachmentsString);
            return attachmentsObj;
        }

        public SupportingDocumentList[] getWLSupportingDocumentList(string token, long waitingListInformationId)
        {
            string docList = dg.getWLSupportingDocumentList(token, waitingListInformationId);
            SupportingDocumentList[] docObj = js.Deserialize<SupportingDocumentList[]>(docList);
            return docObj;
        }

        public MemoryStream viewSupportingDocInBrowser(string token, string supportingDocumentId)
        {
            MemoryStream ms = null;
            try
            {
                ms = dg.viewSupportingDocInBrowser(token, supportingDocumentId);
            }
            catch (Exception ex)
            {
                string exception = ex.Message;
            }
            if (ms != null)
            {
                ms.Close();
            }

            return ms;
        }   

        public bool stringInjectionValidator(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            if (!string.IsNullOrWhiteSpace(uncheckedString) && (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(deleteFrom)))
            {
                return false;
            }
            else
            {
                return true;
            }

        }

        public class SupportingDocumentList
        {
            public string supportingDocumentId { get; set; }
            public string description { get; set; }
            public string documentType { get; set; }
            public string includeOnEmail { get; set; }
        }
        public class LandingPageInfo
        {
            public string wlInfoId { get; set; }
            public string interviewDate { get; set; }
            public string conclusionResult { get; set; }
            public string conclusionDate { get; set; }
            public string sentToDODD { get; set; }
        }

        public class SupportingDocument
        {
            public string supportingDocumentId { get; set; }
        }

        public class FundingSources
        {
            public string fundingSourceId { get; set; }
            public string description { get; set; }
        }

        public class WaitingList
        {
            public string wlInfoId { get; set; }
            public string consumerId { get; set; }
            public string personCompleting { get; set; }
            public string personCompletingTitle { get; set; }
            public string interviewDate { get; set; }
            public string fundingSourceId { get; set; }
            public string currentLivingArrangement { get; set; }
            public string livingArrangementOther { get; set; }
            public string areasPersonNeedsHelp { get; set; }
            public string participants { get; set; }
            public string conditionId { get; set; }
            public string otherThanMentalHealth { get; set; }
            public string before22 { get; set; }
            public string activeServiceId { get; set; }
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
            public string primaryCaregiverId { get; set; }
            public string isPrimaryCaregiverUnavailable { get; set; }
            public string unavailableDocumentation { get; set; }
            public string additionalCommentsForUnavailable { get; set; }
            public string isActionRequiredIn30Days { get; set; }
            public string isIndividualSkillsDeclined { get; set; }
            public string declinedSkillsDocumentation { get; set; }
            public string declinedSkillsDescription { get; set; }
            public string actionRequiredDescription { get; set; }
            public string needId { get; set; }
            public string needsIsActionRequiredRequiredIn30Days { get; set; }
            public string needsIsContinuousSupportRequired { get; set; }
            public string medicalNeedId { get; set; }
            public string medicalNeedsIsLifeThreatening { get; set; }
            public string medicalNeedsIsFrequentEmergencyVisit { get; set; }
            public string medicalNeedsIsOngoingMedicalCare { get; set; }
            public string medicalNeedsIsSpecializedCareGiveNeeded { get; set; }
            public string medicalNeedsIsOther { get; set; }
            public string medicalNeedsIsNone { get; set; }
            public string medicalNeedsDescription { get; set; }
            public string physicalNeedId { get; set; }
            public string physicalNeedsIsPhysicalCareNeeded { get; set; }
            public string physicalNeedsIsPersonalCareNeeded { get; set; }
            public string physicalNeedsIsRiskDuringPhysicalCare { get; set; }
            public string physicalNeedsIsOther { get; set; }
            public string physicalNeedsIsNone { get; set; }
            public string physicalNeedsDescription { get; set; }
            public string riskId { get; set; }
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
            public string riskMitigationId { get; set; }
            public string rMIsSupportNeeded { get; set; }
            public string rMIsCountyBoardInvestigation { get; set; }
            public string rMIsLawEnforcementInvestigation { get; set; }
            public string rMIsAdultProtectiveServiceInvestigation { get; set; }
            public string rMIsOtherInvestigation { get; set; }
            public string rMIsNone { get; set; }
            public string rMdescription { get; set; }
            public string rMIsActionRequiredIn3oDays { get; set; }
            public string icfDischargeId { get; set; }
            public string icfDetermination { get; set; }
            public string icfIsICFResident { get; set; }
            public string icfIsNoticeIssued { get; set; }
            public string icfIsActionRequiredIn30Days { get; set; }
            public string intermitentSupportsId { get; set; }
            public string intSupDetermination { get; set; }
            public string intSupIsSupportNeededIn12Months { get; set; }
            public string intSupIsStayingLivingArrangement { get; set; }
            public string intSupIsActionRequiredIn30Days { get; set; }
            public string childProtectionId { get; set; }
            public string cpaDetermination { get; set; }
            public string cpaIsReleasedNext12Months { get; set; }
            public string cpaAnticipateDate { get; set; }
            public string cpaHasUnaddressableNeeds { get; set; }
            public string requireWaiverFundingId { get; set; }
            public string rwfWaiverFundingRequired { get; set; }
            public string rwfNeedsMoreFrequency { get; set; }
            public string rwfNeedsServiceNotMetIDEA { get; set; }
            public string rwfNeedsServicesNotMetOOD { get; set; }
            public string dischargePlanId { get; set; }
            public string dischargeDetermination { get; set; }
            public string dischargeIsICFResident { get; set; }
            public string dischargeIsInterestedInMoving { get; set; }
            public string dischargeHasDischargePlan { get; set; }
            public string immediateNeedId { get; set; }
            public string immNeedsRequired { get; set; }
            public string immNeedsDescription { get; set; }
            public string waiverEnrollmentId { get; set; }
            public string waivEnrollWaiverEnrollmentIsRequired { get; set; }
            public string waivEnrollWaiverEnrollmentDescription { get; set; }
            public string unmetNeedId { get; set; }
            public string unmetNeedsHas { get; set; }
            public string unmetNeedsSupports { get; set; }
            public string unmetNeedsDescription { get; set; }
            public string conclussionDeterminedBy { get; set; }
            public string conclusionDeterminedByTitle { get; set; }
            public string conclusionDeterminedOn { get; set; }
            public string conclusionResult { get; set; }
        }
    }
}