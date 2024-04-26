using Anywhere.Data;
using Anywhere.Log;
using CrystalDecisions.Shared;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Data;
using System.Text;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereAbsentWorker;
using static Anywhere.service.Data.Authorization.AuthorizationWorker;
using static System.Windows.Forms.VisualStyles.VisualStyleElement.Window;

namespace Anywhere.service.Data
{
    public class OutcomesWorker
    {
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        private static Loger logger = new Loger();
        private string gSAConnString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        StringBuilder sb = new StringBuilder();
        Sybase di = new Data.Sybase();

        public GoalSpecificLocationInfo[] getGoalSpecificLocationInfoJSON(string token, string activityId)
        {
            string specificLocationString = dg.getGoalSpecificLocationInfoJSON(token, activityId);
            GoalSpecificLocationInfo[] specificLocationObj = js.Deserialize<GoalSpecificLocationInfo[]>(specificLocationString);
            return specificLocationObj;
        }

        public UserIdsWithGoals[] getUserIdsWithGoalsJSON(string token)
        {
            string userIdsWithGoalsString = dg.getUserIdsWithGoalsJSON(token);
            UserIdsWithGoals[] userIdsWithGoalsObj = js.Deserialize<UserIdsWithGoals[]>(userIdsWithGoalsString);
            return userIdsWithGoalsObj;
        }

        public UserIdsWithGoalsByDate[] getUserIdsWithGoalsByDateJSON(string token, string goalsCheckDate)
        {
            string userIdsWithGoalsByDateString = dg.getUserIdsWithGoalsByDateJSON(token, goalsCheckDate);
            UserIdsWithGoalsByDate[] userIdsWithGoalsByDateObj = js.Deserialize<UserIdsWithGoalsByDate[]>(userIdsWithGoalsByDateString);
            return userIdsWithGoalsByDateObj;
        }

        public DaysBackForEditingGoals[] getDaysBackForEditingGoalsJSON(string token, string consumerId)
        {
            string daysBackFOrEditingGoalsString = dg.getDaysBackForEditingGoalsJSON(token, consumerId);
            DaysBackForEditingGoals[] daysBackForEditingGoalsObj = js.Deserialize<DaysBackForEditingGoals[]>(daysBackFOrEditingGoalsString);
            return daysBackForEditingGoalsObj;
        }

        public RemainingDailyGoals[] getRemainingDailyGoalsJSON(string token, string checkDate)
        {
            string remainingDailyGoalsString = dg.getRemainingDailyGoalsJSON(token, checkDate);
            RemainingDailyGoals[] remainingDailyGoalsObj = js.Deserialize<RemainingDailyGoals[]>(remainingDailyGoalsString);
            return remainingDailyGoalsObj;
        }

        public CommunityIntegrationLevel[] getGoalsCommunityIntegrationLevelJSON(string token)
        {
            string communityIntegrationLevelString = dg.getGoalsCommunityIntegrationLevelJSON(token);
            CommunityIntegrationLevel[] communityIntegrationLevelObj = js.Deserialize<CommunityIntegrationLevel[]>(communityIntegrationLevelString);
            return communityIntegrationLevelObj;
        }

        public CIRequired[] getGoalsCommunityIntegrationRequiredJSON(string token)
        {
            string cIRequiredString = dg.getGoalsCommunityIntegrationLevelJSON(token);
            CIRequired[] cIRequiredObj = js.Deserialize<CIRequired[]>(cIRequiredString);
            return cIRequiredObj;
        }

        public GoalIDByPermission[] getViewableGoalIdsByPermissionJSON(string token)
        {
            string goalIDByPermissionString = dg.getViewableGoalIdsByPermissionJSON(token);
            GoalIDByPermission[] goalIDByPermissionObj = js.Deserialize<GoalIDByPermission[]>(goalIDByPermissionString);
            return goalIDByPermissionObj;
        }

        public OutcomeTypeForFilter[] getOutcomeTypeForFilterJSON(string token, string selectedDate, string consumerId)
        {
            string outcomeTypeString = dg.getOutcomeTypeForFilterJSON(token, selectedDate, consumerId);
            OutcomeTypeForFilter[] outcomeTypeObj = js.Deserialize<OutcomeTypeForFilter[]>(outcomeTypeString);
            return outcomeTypeObj;
        }
        //New
        public ConsumerGoalsData[] getGoalsByDateNew(string consumerId, string goalDate)
        {
            string consumerGoalsDataString = dg.getGoalsByDateNew(consumerId, goalDate);
            ConsumerGoalsData[] consumerGoalsDataObj = js.Deserialize<ConsumerGoalsData[]>(consumerGoalsDataString);
            return consumerGoalsDataObj;
        }
        public SuccessSymbolLookup[] getSuccessSymbolLookup(string token)
        {
            string successSymbolString = dg.getSuccessSymbolLookup(token);
            SuccessSymbolLookup[] successSymbolObj = js.Deserialize<SuccessSymbolLookup[]>(successSymbolString);
            return successSymbolObj;
        }
        public class SuccessSymbolLookup
        {
            public string objectiveId { get; set; }
            public string objSymbol { get; set; }
        }
        //New
        public class ConsumerGoalsData
        {
            public string goal_id { get; set; }
            public string Goal_Statement { get; set; }
            public string Goal_Type_ID { get; set; }
            public string goal_type_description { get; set; }
            public string Location_ID { get; set; }
            public string Objective_id { get; set; }
            public string Objective_Statement { get; set; }
            public string Objective_Method { get; set; }
            public string Objective_Recurrance { get; set; }
            public string Success_Determination { get; set; }
            public string Frequency_Modifier { get; set; }
            public string Frequency_Occurance { get; set; }
            public string objLocationId { get; set; }
            //public string Show_Community_Integration { get; set; }
            //public string Show_Prompts { get; set; }
            //public string Show_Attempts { get; set; }
            //public string Show_Time { get; set; }
            public string nullHourDaySuccesses { get; set; }
            public string weekSuccesses { get; set; }
            public string monthSuccesses { get; set; }
            public string yearSuccesses { get; set; }
            public string lastUpdatedBy { get; set; }
        }

        //New
        public ObjectiveActivityData[] getObjectiveActivity(string objectiveActivityId)
        {
            string objectiveActivityString = dg.getObjectiveActivity(objectiveActivityId);
            ObjectiveActivityData[] objectiveActivityObj = js.Deserialize<ObjectiveActivityData[]>(objectiveActivityString);
            return objectiveActivityObj;
        }
        //New
        public class ObjectiveActivityData
        {
            public string Objective_Activity_ID { get; set; }
            public string Objective_ID { get; set; }
            public string Objective_Success { get; set; }
            public string Objective_Activity_Note { get; set; }
            public string Prompt_Type { get; set; }
            public string Prompt_Number { get; set; }
            public string Location_ID { get; set; }
            public string Locations_Secondary_ID { get; set; }
            public string Objective_Date { get; set; }
            public string submitted_by_user_id { get; set; }
            public string start_time { get; set; }
            public string end_time { get; set; }
            public string community_integration_level { get; set; }
            public string Absent_Record_ID { get; set; }
            public string objective_success_description { get; set; }
            public string Last_Update { get; set; }
            public string show_time { get; set; }
            public string Show_Community_Integration { get; set; }
        }

        //New
        public PrimaryAndSecondaryLocationData[] getOutcomesPrimaryAndSecondaryLocations(string consumerId, string goalDate)
        {
            string primarySecondaryLocString = dg.getOutcomesPrimaryAndSecondaryLocations(consumerId, goalDate);
            PrimaryAndSecondaryLocationData[] primarySecondaryLocObj = js.Deserialize<PrimaryAndSecondaryLocationData[]>(primarySecondaryLocString);
            return primarySecondaryLocObj;
        }
        //New
        public class PrimaryAndSecondaryLocationData
        {
            public string Location_ID { get; set; }
            public string description { get; set; }
            public string type { get; set; }
            public string primaryLocId { get; set; }
        }

        //New
        public PromptsData[] getOutcomesPrompts()
        {
            string promptsString = dg.getOutcomesPrompts();
            PromptsData[] promptsObj = js.Deserialize<PromptsData[]>(promptsString);
            return promptsObj;
        }
        //New
        public class PromptsData
        {
            public string Code { get; set; }
            public string Caption { get; set; }
        }

        //New
        public SuccessTypeData[] getOutcomesSuccessTypes(string goalTypeId)
        {
            string successTypesString = dg.getOutcomesSuccessTypes(goalTypeId);
            SuccessTypeData[] successTypesObj = js.Deserialize<SuccessTypeData[]>(successTypesString);
            return successTypesObj;
        }
        //New
        public class SuccessTypeData
        {
            public string Show_Community_Integration { get; set; }
            public string Show_Prompts { get; set; }
            public string Show_Attempts { get; set; }
            public string Show_Time { get; set; }
            public string Objective_Success { get; set; }
            public string Objective_Success_Description { get; set; }
            public string Notes_Required { get; set; }
            public string Prompt_Required { get; set; }
            public string Attempts_Required { get; set; }
            public string Community_Integration_Required { get; set; }
            public string Times_Required { get; set; }
        }

        public class GoalSpecificLocationInfo
        {
            public string Location_ID { get; set; }
            public string location_code { get; set; }
            public string Locations_Secondary_ID { get; set; }
            public string secondary_location { get; set; }
        }

        public class UserIdsWithGoals
        {
            public string ID { get; set; }
        }

        public class UserIdsWithGoalsByDate
        {
            public string id { get; set; }
        }

        public class DaysBackForEditingGoals
        {
            public string setting_value { get; set; }
            public string outcomes_use_consumer_location { get; set; }
            public string consumer_location { get; set; }
        }

        public class RemainingDailyGoals
        {
            public string ID { get; set; }
        }

        public class CommunityIntegrationLevel
        {
            public string captionname { get; set; }
            public string code { get; set; }
        }

        public class CIRequired
        {
            public string Setting_Value { get; set; }
        }

        public class GoalIDByPermission
        {
            public string ID { get; set; }
        }
        public class OutcomeTypeForFilter
        {
            public string goal_type_description { get; set; }
            public string Goal_Type_ID { get; set; }
        }

        public class PDParentOutcome
        {
            public string outcomeType { get; set; }
            public string outcomeStatement { get; set; }
            public string effectiveDateStart { get; set; }
            public string effectiveDateEnd { get; set; }
            public string goal_id { get; set; }
            public string location { get; set; }

        }

        public class PDChildOutcome
        {
            public string objective_Id { get; set; }
            public string goal_id { get; set; }
            public string frequency { get; set; }
            public string itemnum { get; set; }
            public string serviceType { get; set; }
            public string serviceStatement { get; set; }
            public string serviceStartDate { get; set; }
            public string serviceEndDate { get; set; }
            public string objective_type { get; set; }
            public string objective_method { get; set; }
            public string success_determination { get; set; }
            public string frequency_modifier { get; set; }
            public string frequency_occurance { get; set; }
            public string frequency_peroid { get; set; }
            public string location { get; set; }
            public string duration { get; set; }
        }

        public class OutComePageData
        {
            public PDParentOutcome[] pageDataParent { get; set; }
            public PDChildOutcome[] pageDataChild { get; set; }
        }

        public class OutcomeService
        {
            public string goal_serviceStatement { get; set; }
            public string goal_id { get; set; }
        }

        public class ServiceFrequencyType
        {
            public string serviceFrequencyType_id { get; set; }
            public string serviceFrequencyType_name { get; set; }
        }

        public class LocationType
        {
            public string locationDescription { get; set; }
            public string locationID { get; set; }
        }

        public OutcomesWorker.OutComePageData getOutcomeServicsPageData(string outcomeType, string effectiveDateStart, string effectiveDateEnd, string token, string selectedConsumerId, string appName)
        {
            OutComePageData pageData = new OutComePageData();
            js.MaxJsonLength = Int32.MaxValue;
            string parentString = getOutcomeServicsPageDataParent(outcomeType, effectiveDateStart, effectiveDateEnd, token, selectedConsumerId);
            PDParentOutcome[] parentObj = js.Deserialize<PDParentOutcome[]>(parentString);

            string childString = getOutcomeServicsPageDataChildren(outcomeType, effectiveDateStart, effectiveDateEnd, token, selectedConsumerId, appName);
            PDChildOutcome[] childObj = js.Deserialize<PDChildOutcome[]>(childString);

            pageData.pageDataParent = parentObj;
            pageData.pageDataChild = childObj;
            return pageData;
        }

        //Parent
        public string getOutcomeServicsPageDataParent(string outcomeType, string effectiveDateStart, string effectiveDateEnd, string token, string selectedConsumerId)
        {
            try
            {
                string jsonResult = "";
                sb.Clear();

                sb.Append("select Goal_ID as goal_id , gt.Goal_Type_Description as outcomeType, gs.Goal_Statement as outcomeStatement , gs.Start_Date as effectiveDateStart, gs.End_Date as effectiveDateEnd ");
                sb.Append("from dba.goals gs ");
                sb.Append("left outer join dba.Goal_Types gt on gs.Goal_Type_ID = gt.Goal_Type_ID ");
                sb.AppendFormat("where(gs.Start_Date <= '{0}' or gs.Start_Date is null ) ", effectiveDateEnd);
                sb.AppendFormat("AND (gs.End_Date >= '{0}' or gs.End_Date is null) ", effectiveDateEnd);
                sb.AppendFormat("AND (gt.Goal_Type_Description like '{0}') ", outcomeType);
                sb.AppendFormat("AND (gs.ID = {0}) ", selectedConsumerId);
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
        public string getOutcomeServicsPageDataChildren(string outcomeType, string effectiveDateStart, string effectiveDateEnd, string token, string selectedConsumerId, string appName)
        {
            try
            {
                string jsonResult = "";
                sb.Clear();
                sb.Append(" select ROW_NUMBER() OVER(ORDER BY obj.Objective_id) AS itemnum, obj.Objective_ID as objective_Id, obj.goal_id as goal_id , ");
                sb.Append(" case When (obj.Objective_recurrance Is null or obj.Objective_recurrance = '') and (obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0) and (ctf.Caption Is null or ctf.Caption ='')  then '' ");
                sb.Append(" when obj.Objective_recurrance Is null then cast(ctf.Caption as varchar(30))+' ' + cast(obj.Frequency_Occurance as varchar(30)) + case when obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0 then '' else 'x ' end ");
                sb.Append(" when obj.Objective_recurrance = 'M' then cast(ctf.Caption as varchar(30))+' ' + cast(obj.Frequency_Occurance as varchar(30)) + case when obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0 then '' else 'x ' end + 'per month' ");
                sb.Append(" when obj.Objective_recurrance = 'D' then cast(ctf.Caption as varchar(30))+' ' + cast(obj.Frequency_Occurance as varchar(30)) + case when obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0 then '' else 'x ' end + 'per day' ");
                sb.Append(" when obj.Objective_recurrance = 'W' then cast(ctf.Caption as varchar(30))+' ' + cast(obj.Frequency_Occurance as varchar(30)) + case when obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0 then '' else 'x ' end + 'per week' ");
                sb.Append(" when obj.Objective_recurrance = 'H' then cast(ctf.Caption as varchar(30))+' ' + cast(obj.Frequency_Occurance as varchar(30)) + case when obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0 then '' else 'x ' end + 'per hour' ");
                sb.Append(" when obj.Objective_recurrance = 'Y' then cast(ctf.Caption as varchar(30))+' ' + cast(obj.Frequency_Occurance as varchar(30)) + case when obj.Frequency_Occurance Is null or obj.Frequency_Occurance = '' or obj.Frequency_Occurance = 0 then '' else 'x ' end + 'per year' end as frequency, ");
                if (appName == "Gatekeeper")
                    sb.Append(" ct.Caption as serviceType, obj.Objective_Statement as serviceStatement, obj.objective_start as serviceStartDate, obj.objective_end as serviceEndDate ");
                else
                    sb.Append(" ct.Caption as serviceType, obj.Objective_Statement as serviceStatement, obj.Start_Date as serviceStartDate, obj.End_Date as serviceEndDate ");
                sb.Append(" from dba.Objectives obj ");
                sb.Append(" left outer join dba.Code_Table ct on obj.Objective_Type = ct.Code and ct.Field_ID = 'Objective_Type' and ct.Table_ID = 'Objectives' ");
                sb.Append(" left outer join dba.Code_Table ctf on obj.Frequency_Modifier = ctf.Code and ctf.Field_ID = 'Frequency_Modifier' and ctf.Table_ID = 'Objectives' ");

                DataTable dt = di.SelectRowsDS(sb.ToString()).Tables[0];
                jsonResult = DataTableToJSONWithJSONNet(dt);

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

        public OutcomeTypeForFilter[] getOutcomeTypeDropDown(string token)
        {
            string outcomeTypeString = dg.getOutcomeTypeDropDown(token);
            OutcomeTypeForFilter[] outcomeTypeObj = js.Deserialize<OutcomeTypeForFilter[]>(outcomeTypeString);
            return outcomeTypeObj;
        }

        public OutcomesWorker.LocationType[] getLocationDropDown(string token)
        {
            string locationTypeString = dg.getLocationDropDown(token);
            LocationType[] locationTypeObj = js.Deserialize<LocationType[]>(locationTypeString);
            return locationTypeObj;
        }

        public OutcomesWorker.PDParentOutcome[] getGoalEntriesById(string token, string goalId)
        {
            string goalString = dg.getGoalEntriesById(token, goalId);
            PDParentOutcome[] goalObj = js.Deserialize<PDParentOutcome[]>(goalString);
            return goalObj;
        }

        public OutcomesWorker.PDChildOutcome[] getObjectiveEntriesById(string token, string objectiveId)
        {
            string objectiveString = dg.getObjectiveEntriesById(token, objectiveId);
            PDChildOutcome[] objectiveObj = js.Deserialize<PDChildOutcome[]>(objectiveString);
            return objectiveObj;
        }

        public OutcomeService[] getOutcomeServiceDropDown(string token)
        {
            string outcomeTypeString = dg.getOutcomeServiceDropDown(token);
            OutcomeService[] outcomeTypeObj = js.Deserialize<OutcomeService[]>(outcomeTypeString);
            return outcomeTypeObj;
        }

        public ServiceFrequencyType[] getServiceFrequencyTypeDropDown(string token, string type)
        {
            string serviceFrequencyTypeString = dg.getServiceFrequencyTypeDropDown(token, type);
            ServiceFrequencyType[] serviceFrequencyTypeObj = js.Deserialize<ServiceFrequencyType[]>(serviceFrequencyTypeString);
            return serviceFrequencyTypeObj;
        }

        public OutcomesWorker.PDParentOutcome[] insertOutcomeInfo(string token, string startDate, string endDate, string outcomeType, string outcomeStatement, string userID, string goalId, string consumerId, string location)
        {
            string insertOutcomeString = dg.insertOutcomeInfo(token, startDate, endDate, outcomeType, outcomeStatement, userID, goalId, consumerId, location);
            OutcomesWorker.PDParentOutcome[] insertOutcomeObj = js.Deserialize<OutcomesWorker.PDParentOutcome[]>(insertOutcomeString);
            return insertOutcomeObj;
        }

        public OutcomesWorker.PDChildOutcome[] insertOutcomeServiceInfo(string token, string startDate, string endDate, string outcomeType, string servicesStatement, string ServiceType, string method, string success, string frequencyModifier, string frequency, string frequencyPeriod, string userID, string objectiveId, string consumerId, string location, string duration)
        {
            string insertOutcomeServiceString = dg.insertOutcomeServiceInfo(token, startDate, endDate, outcomeType, servicesStatement, ServiceType, method, success, frequencyModifier, frequency, frequencyPeriod, userID, objectiveId, consumerId, location, duration);
            OutcomesWorker.PDChildOutcome[] insertOutcomeServiceObj = js.Deserialize<OutcomesWorker.PDChildOutcome[]>(insertOutcomeServiceString);
            return insertOutcomeServiceObj;
        }

    }
}