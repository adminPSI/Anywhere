using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Runtime.InteropServices.ComTypes;
using System.Runtime.Remoting.Metadata.W3cXsd2001;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereWorkshopWorkerTwo;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using static Anywhere.service.Data.SingleEntryWorker;

namespace Anywhere.Data
{
    public class DataGetter
    {
        private static Loger logger = new Loger();
        //private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DataGetter));
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public bool validateToken(string token)
        {
            if (tokenValidator(token) == false) return false;
            logger.debug("validateToken " + token);
            try
            {
                int tokenCheck;
                string result = executeDataBaseCallRaw("SELECT DBA.ANYW_ValidateToken('" + token + "', '1');");
                tokenCheck = Int32.Parse(result);
                if (tokenCheck > 0) return false;
                else return true;
            }
            catch (Exception ex)
            {
                logger.error("500", ex.Message + ex.InnerException.ToString() + " validateToken('" + token + "')", token);
                return false;
            }

        }

        /// <summary>
        /// get a list of locations
        /// </summary>
        public string getLocations(string token)//MAT need to see if I can remove
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocations");
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_getLocations('" + token + "');", "locations", "location");
            }
            catch (Exception ex)
            {
                logger.error("501", ex.Message + ex.InnerException.ToString() + " ANYW_getLocations('" + token + "')", token);
                return "501: Error getting Locations";
            }
        }

        //JSON version of above
        //Scheduling
        public string getLocationsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocationsJSON ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.DBA.ANYW_getLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501", ex.Message + "DBA.ANYW_getLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501: error DBA.ANYW_getLocations";
            }
        }

        /// <summary>
        /// get a list of day service locations
        /// </summary>
        /// <returns></returns>
        public string getDayServiceLocationsJSON(string token, string serviceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getWorkshopJobCode " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(serviceDate);
            string text = "CALL DBA.ANYW_getDayServiceLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("502", ex.Message + "ANYW_getDayServiceLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "502: error ANYW_getDayServiceLocations";
            }
        }

        public string getDayServiceClockedInConsumers(string token, string consumerIdString, string serviceDate, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDayServiceClockedInConsumers " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerIdString);
            list.Add(serviceDate);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_DayService_GetDayServiceClockedInConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("502", ex.Message + "getDayServiceClockedInConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "502: error getDayServiceClockedInConsumers";
            }
        }

        /// <summary>
        ///  Get a list of people
        /// </summary>
        /// <returns></returns>
        public string getConsumerGroups(string locationId, string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetCustomGroups");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Roster_GetConsumerGroups(" + locationId + ",'" + token + "');", "groups", "group");

            }
            catch (Exception ex)
            {
                logger.error("503", ex.Message + " DBA.ANYW_Roster_GetConsumerGroups(" + locationId + ",'" + token + "')", token);
                return "503: Error getting Custom Groups";
            }
        }
        //New version of above MAT
        public string getConsumerGroupsJSON(string locationId, string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerGroupsJSON" + token);
            List<string> list = new List<string>();
            list.Add(locationId);
            list.Add(token);
            string text = "CALL DBA.ANYW_Roster_GetConsumerGroups(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("503", ex.Message + "DBA.ANYW_Roster_GetConsumerGroups(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "503: error DBA.ANYW_Roster_GetConsumerGroups";
            }
        }

        /// <summary>
        /// Get a list of individuals based on a code and retrieval ID
        /// </summary>
        /// <param name="ListCode"></param>
        /// <param name="retrieveId"></param>
        /// <returns></returns> 
        public string getConsumersByGroup(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate, string isActive)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumersByGroup");

            try
            {

                return executeDataBaseCall("CALL DBA.ANYW_Roster_GetConsumersByGroup('" + groupCode + "'," + retrieveId + ",'" + token + "','" + serviceDate + "','" + daysBackDate + "','" + isActive + "');", "c", "c");
            }
            catch (Exception ex)
            {
                logger.error("504", ex.Message + " ANYW_Roster_GetConsumersByGroup('" + groupCode + "'," + retrieveId + ",'" + token + "','" + serviceDate + "','" + daysBackDate + "','" + isActive + "')", token);
                return "504: Error getting Custom Groups";
            }
        }

        /// <summary>
        /// Get a list of individuals based on a code and retrieval ID
        /// </summary>
        /// <param name="ListCode"></param>
        /// <param name="retrieveId"></param>
        /// <returns></returns> 
        public string getConsumersByGroupJSON(string groupCode, string retrieveId, string token, string serviceDate, string daysBackDate, string isActive)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumersByGroup");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Roster_GetConsumersByGroup('" + groupCode + "'," + retrieveId + ",'" + token + "','" + serviceDate + "','" + daysBackDate + "','" + isActive + "');");
            }
            catch (Exception ex)
            {
                logger.error("504", ex.Message + " ANYW_Roster_GetConsumersByGroup('" + groupCode + "'," + retrieveId + ",'" + token + "','" + serviceDate + "','" + daysBackDate + "','" + isActive + "')", token);
                return "504: Error getting Custom Groups";
            }
        }

        /// <summary>
        /// add a consumer to a group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="consumerId"></param>
        /// <returns></returns>
        public string addConsumerToGroup(string groupId, string consumerId)
        {
            logger.debug("AddConsumerToGroup");
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Roster_AddConsumerToGroup(" + groupId + "," + consumerId + ");", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("505", ex.Message + " ANYW_Roster_AddConsumerToGroup(" + groupId + "," + consumerId + ")");
                return "505: Error Adding Consumer to Group";
            }
        }
        // public string addConsumerToGroupJSON(string groupId, string consumerId)
        // {
        //     logger.debug("AddConsumerToGroup");
        //     try{
        //         return executeDataBaseCallJSON("CALL DBA.ANYW_Roster_AddConsumerToGroup(" + groupId + "," + consumerId + ");");
        //     } catch (Exception ex){
        //         logger.error("505", ex.Message + " ANYW_Roster_AddConsumerToGroup(" + groupId + "," + consumerId + ")");
        //         return "505: Error Adding Consumer to Group";
        //     }
        // }

        /// <summary>
        /// remove consumer from a group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="consumerId"></param>
        /// <returns></returns>
        public string removeConsumerFromGroup(string groupId, string consumerId)
        {
            logger.debug("RemoveConsumerFromGroup");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Roster_RemoveConsumerFromGroup(" + groupId + "," + consumerId + ");", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("506", ex.Message + " ANYW_Roster_RemoveConsumerFromGroup(" + groupId + "," + consumerId + ")");
                return "506: Error Removing Consumer to Group";
            }

        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public string addCustomGroupJSON(string groupName, string locationId, string token, string ispubliclyAvailableChecked)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("AddCustomGroup");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Roster_AddCustomGroup('" + groupName + "','" + locationId + "','" + token + "','" + ispubliclyAvailableChecked + "');");
            }
            catch (Exception ex)
            {
                logger.error("507", ex.Message + " ANYW_Roster_AddCustomGroup('" + groupName + "','" + locationId + "','" + token + "','" + ispubliclyAvailableChecked + "')", token);
                return "507: Error Adding Custom to Group";
            }
        }

        public string removeCustomGroup(string groupId)
        {
            logger.debug("RemoveCustomGroup");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Roster_RemoveCustomGroup('" + groupId + "');", "results", "groupId");
            }
            catch (Exception ex)
            {
                logger.error("508", ex.Message + " ANYW_Roster_RemoveCustomGroup('" + groupId + "')");
                return "508: Error Removing Custom to Group";
            }
        }

        public string updatePublicAvailable(string groupId, string isPublicAvailable)
        {
            logger.debug("updatePublicAvailable");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Roster_updatePublicAvailable('" + groupId + "','" + isPublicAvailable + "');");
            }
            catch (Exception ex)
            {
                logger.error("506", ex.Message + " ANYW_Roster_updatePublicAvailable(" + groupId + "," + isPublicAvailable + ")");
                return "506: Error update Public Available to Group";
            }

        }

        public string addDayServiceActivityMassClockInConsumer(string token, string consumerIds, string serviceDate, string locationId, string startTime)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIds) == false) return null;
            logger.debug("addDayServiceActivityMassClockInConsumer");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_MassClockInConsumer('" + token + "','" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + startTime + "');", "results", "dayrow");
            }
            catch (Exception ex)
            {
                logger.error("509", ex.Message + " ANYW_DayService_MassClockInConsumer('" + token + "','" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + startTime + "')", token);
                return "509: Error with Mass Clock in";
            }
        }

        public string getConsumerDayServiceActivityJSON(string token, string peopleList, string serviceDate, string locationId, string groupCode, string retrieveId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerDayServiceActivity");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_DayService_GetConsumerActivity('" + token + "','" + peopleList + "','" + serviceDate + "','" + locationId + "','" + groupCode + "','" + retrieveId + "' );");
            }
            catch (Exception ex)
            {
                logger.error("510", ex.Message + " ANYW_DayService_GetConsumerActivity('" + token + "','" + peopleList + "','" + serviceDate + "','" + locationId + "','" + groupCode + "')", token);
                return "510: Error Getting Consumer Day Service Activity";
            }
        }

        public string massUserCheckByDate(string consumerIds, string serviceDate, string locationId)
        {
            logger.debug("massUserCheckByDate");
            if (consumerIdStringValidator(consumerIds) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_MassUserCheckByDate('" + consumerIds + "','" + serviceDate + "','" + locationId + "');", "results", "check");
            }
            catch (Exception ex)
            {
                logger.error("511", ex.Message + " ANYW_DayService_MassUserCheckByDate('" + consumerIds + "','" + serviceDate + "','" + locationId + "')");
                return "511: Error Mass User Check by Date";
            }
        }

        public string addDayServiceActivityMassClockOutConsumer(string token, string consumerIds, string serviceDate, string locationId, string stopTime)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIds) == false) return null;
            logger.debug("addDayServiceActivityMassClockOutConsumer");

            try
            {
                return executeDataBaseCall("CALL DBA.DBA.ANYW_DayService_MassClockOutConsumer('" + token + "','" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + stopTime + "');", "results", "dayrow");
            }
            catch (Exception ex)
            {
                logger.error("512", ex.Message + " ANYW_DayService_MassClockOutConsumer('" + token + "','" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + stopTime + "')", token);
                return "512: Error Adding Day Service Mass Clock Out";
            }
        }

        public string updateDayServiceActivity(string token, string consumerIds, string serviceDate, string locationId, string inputType, string inputTime, string dayServiceType, string selectedGroupId)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIds) == false) return null;
            logger.debug("updateDayServiceActivity");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_MassUpdateConsumerActivity('" + token + "','" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + inputType + "','" + inputTime + "','" + dayServiceType + "','" + selectedGroupId + "');", "results", "dayrow");
            }
            catch (Exception ex)
            {
                logger.error("513", ex.Message + " ANYW_DayService_MassUpdateConsumerActivity('" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + inputType + "','" + inputTime + "','" + dayServiceType + "','" + selectedGroupId + "')");
                return "513: Error update Day Service Activity";
            }
        }

        public string deleteDayServiceMassDeleteConsumerActivity(string consumerIds, string serviceDate, string locationID)
        {
            logger.debug("deleteDayServiceMassDeleteConsumerActivity");
            if (consumerIdStringValidator(consumerIds) == false) return null;

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_MassDeleteConsumerActivity('" + consumerIds + "','" + serviceDate + "','" + locationID + "');", "results", "dayrow");
            }
            catch (Exception ex)
            {
                logger.error("514", ex.Message + " ANYW_DayService_MassDeleteConsumerActivity('" + consumerIds + "','" + serviceDate + "','" + locationID + "')");
                return "514: Error deleteDayServiceMassDeleteConsumerActivity";
            }
        }

        public string getLogIn(string userId, string hash)
        {
            logger.trace("100", "getLogIn:" + userId);
            if (stringInjectionValidatorLogin(hash) == false) return null;
            if (stringInjectionValidatorLogin(userId) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_getLogIn('" + userId + "','" + hash + "');", "results", "permissions");
            }
            catch (Exception ex)
            {
                logger.error("514", ex.Message + " ANYW_getLogIn('" + userId + "','" + hash + "')");
                return "514: " + ex.Message;
            }
        }

        public string changeLogIn(string userId, string hash, string newPassword, string changingToHashPassword)
        {
            logger.trace("101", "changeLogIn:" + userId);
            if (stringInjectionValidatorLogin(hash) == false) return null;
            if (stringInjectionValidatorLogin(userId) == false) return null;
            if (stringInjectionValidatorLogin(newPassword) == false) return null;
            if (stringInjectionValidatorLogin(changingToHashPassword) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_ChangePassword('" + userId + "','" + hash + "','" + newPassword + "','" + changingToHashPassword + "');", "results", "permissions");
            }
            catch (Exception ex)
            {
                logger.error("515", ex.Message + " ANYW_ChangePassword('" + userId + "','" + hash + "')");
                return "515: " + ex.Message;
            }
        }

        public string getUserByToken(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserByToken");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_GetUserNameFromToken('" + token + "');", "results", "user");
            }
            catch (Exception ex)
            {
                //logger.error("515", ex.Message, token); //this could make a forever loop. 
                return "515: Error with Get User";
            }
        }

        public string tokenCheck(string token)
        {
            if (tokenValidator(token) == false) return null;
            //logger.debug("tokenCheck");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_TokenCheck('" + token + "');", "results", "user");
            }
            catch (Exception ex)
            {
                logger.error("516", ex.Message + " ANYW_TokenCheck('" + token + "');", token);
                return "516: Error with Data Base";
            }
        }

        public string clockInStaff(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ClockInStaff");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Home_ClockInStaff('" + token + "', '" + locationId + "');");
            }
            catch (Exception ex)
            {
                logger.error("517", ex.Message + " ANYW_Home_ClockInStaff('" + token + "', '" + locationId + "')", token);
                return "517: Error Clock in Staff";
            }
        }

        public string clockOutStaff(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("clockOutStaff");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Home_ClockOutStaff('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("518", ex.Message + " ANYW_Home_ClockOutStaff('" + token + "')", token);
                return "518: Error Clock Out Staff";
            }
        }

        public string getStaffActivityJSON(string token, string serviceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getStaffActivity");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Home_GetStaffActivity('" + token + "','" + serviceDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("518", ex.Message + " ANYW_Home_GetStaffActivity('" + token + "','" + serviceDate + "')", token);
                return "518: Error Get Staff Activity";
            }
        }


        public string setDefaultSettings(string token, string settingKey, string settingValue)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("setDefaultSettings");
            if (settingKey == null)
            {
                return "521: setting key is null";
            }

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Home_SetDefault_Settings('" + token + "','" + settingKey + "','" + settingValue + "');", "defaultsettings", "defaultsetting");
            }
            catch (Exception ex)
            {
                logger.error("519", ex.Message + " ANYW_Home_GetStaffLocations('" + token + "')", token);
                return "519: Error Get Staff Locations";
            }
        }

        //@token varchar(100),@serviceDate date,@orgTime time,@newTime time,@isClockin bit
        public string updateStaffClockTime(string token, string serviceDate, string orginalTime, string newTime, string isClockIn, string checkedAgainstTime, string location)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateStaffClockTime");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Home_EditClockTime('" + token + "','" + serviceDate + "','" + orginalTime + "','" + newTime + "','" + isClockIn + "','" + checkedAgainstTime + "','" + location + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("520", ex.Message + " ANYW_Home_EditClockTime('" + token + "','" + serviceDate + "','" + orginalTime + "','" + newTime + "','" + isClockIn + "','" + checkedAgainstTime + "','" + location + "')", token);
                return "520: Error Update Staff Clock";
            }
        }

        public string saveGoal(string token, string objectiveId, string activityId, string date, string success, string goalnote, string promptType, string promptNumber, string locationId, string locationSecondaryId, string goalStartTime, string goalEndTime, string goalCILevel)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveGoal " + activityId);

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_GoalsAndServices_SaveGoal('" + token + "','" + objectiveId + "','" + activityId + "','" + date + "','" + success + "','" + goalnote + "','" + promptType + "','" + promptNumber + "','" + locationId + "','" + locationSecondaryId + "','" + goalStartTime + "','" + goalEndTime + "','" + goalCILevel + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("522", ex.Message + " ANYW_GoalsAndServices_SaveGoal('" + token + "','" + objectiveId + "','" + activityId + "','" + date + "','" + success + "','" + goalnote + "','" + promptType + "','" + promptNumber + "','" + locationId + "','" + locationSecondaryId + "','" + goalStartTime + "','" + goalEndTime + "','" + goalCILevel + "')", token);
                return "522: Error saving goal";
            }
        }

        public string deleteGoal(string token, string activityId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteGoal " + activityId);

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_GoalsAndServices_DeleteGoal('" + token + "','" + activityId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("523", ex.Message + " ANYW_GoalsAndServices_DeleteGoal('" + token + "','" + activityId + "')", token);
                return "523: Error deleting goal";
            }
        }

        public string getAllGoalTypes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAllGoalTypes " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetAllGoalTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("646", ex.Message + "ANYW_GoalsAndServices_GetAllGoalTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "646: error ANYW_GoalsAndServices_GetAllGoalTypes";
            }
        }

        public string getSingleEntry(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntry");

            try
            {
                return executeDataBaseCall("CALL DBA.getSingleEntry('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("522", ex.Message + "CALL DBA.getSingleEntry('" + token + "');", token);
                return "522: Error getSingleEntry";
            }
        }

        //For strong password check
        public string getStrongPassword()
        {
            logger.debug("RemoveCustomGroup");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_GetStrongPassword();", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("524", ex.Message + " ANYW_GetStrongPassword()");
                return "524: Error Getting Strong Password Requirements";
            }

        }

        public string getCustomTextAndAnywhereVersion()
        {
            logger.debug("CustomTextAndVersion");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_GetCustomTextAndAnywhereVersion();", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("525", ex.Message + " ANYW_GetCustomTextAndAnywhereVersion()");
                return "525: Error Getting Custom Text And Version";
            }
        }

        public string getUserIdsWithGoalsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("UserIdsWithGoals");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_GetUserIdsWithGoals('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("526", ex.Message + " ANYW_GoalsAndServices_GetUserIdsWithGoals('" + token + "')");
                return "526: Error getting ids related to goals";
            }
        }

        public string getGoalSpecificLocationInfoJSON(string token, string activityId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getGoalSpecificLocationInfo " + activityId);

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_GetGoalSpecificLocationInfo('" + token + "', '" + activityId + "');");
            }
            catch (Exception ex)
            {
                logger.error("527", ex.Message + " ANYW_GoalsAndServices_GetGoalSpecificLocationInfo('" + token + "', '" + activityId + "')");
                return "527: Error getting locations";
            }
        }

        public string getUserIdsWithGoalsByDateJSON(string token, string goalsCheckDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserIdsWithGoalsByDate " + goalsCheckDate);

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_GetUserIdsWithGoalsByDate('" + token + "', '" + goalsCheckDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("528", ex.Message + " ANYW_GoalsAndServices_GetUserIdsWithGoalsByDate('" + token + "', '" + goalsCheckDate + "')");
                return "528: Error getting user ids by date";
            }
        }

        //New
        public string getGoalsByDateNew(string consumerId, string goalDate)
        {
            List<string> list = new List<string>();
            list.Add(consumerId);
            list.Add(goalDate);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetGoalsByDateNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("529.5", ex.Message + "ANYW_GoalsAndServices_GetGoalsByDateNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "529.5: error ANYW_GoalsAndServices_GetGoalsByDateNew";
            }
        }

        //New
        public string getObjectiveActivity(string objectiveActivityId)
        {
            List<string> list = new List<string>();
            list.Add(objectiveActivityId);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetObjectiveActivityNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("531.5", ex.Message + "ANYW_GoalsAndServices_GetObjectiveActivityNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "531.5: error ANYW_GoalsAndServices_GetObjectiveActivityNew";
            }
        }

        //New
        public string getOutcomesPrimaryAndSecondaryLocations(string consumerId, string goalDate)
        {
            List<string> list = new List<string>();
            list.Add(consumerId);
            list.Add(goalDate);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetPrimaryAndSecondaryLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("532.5", ex.Message + "ANYW_GoalsAndServices_GetPrimaryAndSecondaryLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "532.5: error ANYW_GoalsAndServices_GetPrimaryAndSecondaryLocations";
            }
        }

        //New
        public string getOutcomesPrompts()
        {
            List<string> list = new List<string>();
            string text = "CALL DBA.ANYW_GoalsAndServices_GetPromptsN(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("533.5", ex.Message + "ANYW_GoalsAndServices_GetPromptsN(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "533.5: error ANYW_GoalsAndServices_GetPromptsN";
            }
        }

        //New
        public string getOutcomesSuccessTypes(string goalTypeId)
        {
            List<string> list = new List<string>();
            list.Add(goalTypeId);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetSuccessTypeNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("534.5", ex.Message + "ANYW_GoalsAndServices_GetSuccessTypeNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "534.5: error ANYW_GoalsAndServices_GetSuccessTypeNew";
            }
        }

        public string getDaysBackForEditingGoalsJSON(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDaysBackForEditingGoals" + token);

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_GetDaysBackForEditingGoals('" + token + "', '" + consumerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("530", ex.Message + " ANYW_GoalsAndServices_GetDaysBackForEditingGoals('" + token + "')");
                return "530: Error getting days back for goal edit";
            }
        }

        public string caseNotesFilteredSearchJSON(string token, string billerId, string consumerId, string serviceStartDate, string serviceEndDate,
            string dateEnteredStart, string dateEnteredEnd, string billingCode, string reviewStatus, string location, string service, string need, string contact, string confidential, string corrected, string billed,
            string attachments, string noteText)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(noteText) == false) return null;
            logger.debug("getDefaultAnywhereSettingsJSON " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(billerId);
            list.Add(consumerId);
            list.Add(serviceStartDate);
            list.Add(serviceEndDate);
            list.Add(dateEnteredStart);
            list.Add(dateEnteredEnd);
            list.Add(billingCode);
            list.Add(reviewStatus);
            list.Add(location);
            list.Add(service);
            list.Add(need);
            list.Add(contact);
            list.Add(confidential);
            list.Add(corrected);
            list.Add(billed);
            list.Add(attachments);
            list.Add(noteText);
            string text = "CALL DBA.ANYW_CaseNotes_CaseNotesFilteredSearch(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("632", ex.Message + "ANYW_CaseNotes_CaseNotesFilteredSearch(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "632: error ANYW_CaseNotes_CaseNotesFilteredSearch";
            }
        }

        public string getDefaultAnywhereSettingsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDefaultAnywhereSettingsJSON " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GetDefaultAnywhereSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("632", ex.Message + "ANYW_GetDefaultAnywhereSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "632: error ANYW_GetDefaultAnywhereSettings";
            }
        }

        public string getConsumerPeopleId(string consumerId)
        {
            List<string> list = new List<string>();
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_GetConsumerPeopleId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("632", ex.Message + "ANYW_GetPeopleId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "632: error ANYW_GetPeopleId";
            }
        }

        public string getConsumerOrganizationId(string peopleId)
        {
            List<string> list = new List<string>();
            list.Add(peopleId);
            string text = "CALL DBA.ANYW_GetConsumerOrganizationId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("632", ex.Message + "ANYW_GetConsumerOrganizationId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "632: error ANYW_GetConsumerOrganizationId";
            }
        }

        public string getCaseManagersfromOptionsTable(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetCaseManagersfromOptionsTable");
            string text = "CALL DBA.ANYW_ISP_GetCaseManagersfromOptionsTable()";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5APICDG", ex.Message + "ANYW_ISP_GetCaseManagersfromOptionsTable()");
                return "5APICDG: error ANYW_ISP_GetCaseManagersfromOptionsTable()";
            }
        }

        public string getConsumerswithSaleforceIds(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerswithSaleforceIds");
            string text = "CALL DBA.ANYW_ISP_GetConsumerswithSaleforceIds()";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5APICDG", ex.Message + "ANYW_ISP_GetConsumerswithSaleforceIds()");
                return "5APICDG: error ANYW_ISP_GetConsumerswithSaleforceIds";
            }
        }


        public string updateCaseNotesReviewDays(string token, string updatedReviewDays)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateCaseNotesReviewDays" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_UpdateCaseNotesReviewDays('" + token + "', '" + updatedReviewDays + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("533", ex.Message + " ANYW_CaseNotes_UpdateCaseNotesReviewDays('" + token + "', '" + updatedReviewDays + "')");
                return "533: Error updating case notes review days";
            }
        }

        public string getBillersListForDropDownJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getBillersListForDropDown" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetBillersListForDropDown('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("534", ex.Message + " ANYW_CaseNotes_GetBillersListForDropDown('" + token + "')");
                return "534: Error getting billers list";
            }
        }

        public string populateDropdownData(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("populateDropdownData" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_PopulateDropdownData('" + token + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("535", ex.Message + " ANYW_CaseNotes_PopulateDropdownData('" + token + "')");
                return "535: Error getting billers list";
            }
        }

        public string saveCaseNote(string token, string noteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string caseNote, string reviewRequired, string confidential, string corrected, string casenotemileage, string casenotetraveltime, string documentationTime, string outcomeServiceMonitoring)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("saveCaseNote" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_SaveCaseNote('" + token + "', '" + noteId + "', '" + caseManagerId + "', '" + consumerId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + vendorId + "', '" + contactCode + "', '" + serviceLocationCode + "', '" + caseNote + "', '" + reviewRequired + "', '" + confidential + "', '" + corrected + "', '" + casenotemileage + "', '" + casenotetraveltime + "', '" + documentationTime + "', '" + outcomeServiceMonitoring + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_CaseNotes_SaveCaseNote('" + token + "', '" + noteId + "', '" + caseManagerId + "', '" + consumerId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + vendorId + "', '" + contactCode + "', '" + serviceLocationCode + "', '" + caseNote + "', '" + reviewRequired + "', '" + confidential + "', '" + casenotemileage + "', '" + casenotetraveltime + "', '" + documentationTime + "', '" + outcomeServiceMonitoring + "')");
                return "536: Error saving case note";
            }
        }

        public string getCaseNoteEditJSON(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCaseNoteEdit" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetCaseNoteEdit('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("537", ex.Message + " ANYW_CaseNotes_GetCaseNoteEdit('" + token + "', '" + noteId + "')");
                return "537: Error getting case note to edit";
            }
        }

        public string getViewableGoalIdsByPermissionJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getViewableGoalIdsByPermission" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_GetViewableGoalIdsByPermission('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("538", ex.Message + " ANYW_GoalsAndServices_GetViewableGoalIdsByPermission('" + token + "')");
                return "538: Error getting goal permissions";
            }
        }

        public string addCaseNoteAttachment(string token, string caseNoteId, string description, string attachmentType, string attachment)
        {
            if (tokenValidator(token) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_AddCaseNoteAttachment('" + token + "', '" + caseNoteId + "', '" + description + "', '" + attachmentType + "', '" + attachment + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("539.1", ex.Message + " ANYW_CaseNotes_AddCaseNoteAttachment('" + token + "', '" + caseNoteId + "', '" + description + "', '" + attachmentType + "', '" + attachment + "')");
                return "539.1: Error updating portrait";
            }
        }

        public string deleteCaseNoteAttachment(string token, string caseNoteId, string attachmentId)
        {
            if (tokenValidator(token) == false) return null;
            if (tokenValidator(attachmentId) == false) return null;//ensuring attachmentId has no spaces so it can't be bad sql
            logger.debug("deleteCaseNoteAttachment");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(caseNoteId);
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_CaseNotes_DeleteAttachment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.2", ex.Message + "ANYW_CaseNotes_DeleteAttachment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.2: error ANYW_CaseNotes_DeleteAttachment";
            }
        }

        public string getCaseNoteAttachmentsList(string token, string caseNoteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteCaseNoteAttachment");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(caseNoteId);
            string text = "CALL DBA.ANYW_CaseNotes_GetNoteAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.3", ex.Message + "ANYW_CaseNotes_GetNoteAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.3: error ANYW_CaseNotes_GetNoteAttachments";
            }
        }

        public string getCaseNoteAttachmentsListForGroupNote(string caseNoteId)
        {
            logger.debug("deleteCaseNoteAttachment");
            List<string> list = new List<string>();
            list.Add(caseNoteId);
            string text = "CALL DBA.ANYW_CaseNotes_GetNoteAttachmentsForGroupNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("539.3", ex.Message + "ANYW_CaseNotes_GetNoteAttachmentsForGroupNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "539.3: error ANYW_CaseNotes_GetNoteAttachmentsForGroupNote";
            }
        }

        public string updatePortrait(string token, string employeeUserName, string imageFile, string id, string portraitPath)
        {
            if (tokenValidator(token) == false) return null;
            try
            {
                if (imageFile == "")
                {
                    File.Delete(@portraitPath + id + ".png");
                }
                else
                {
                    //File.WriteAllBytes(@"\\solo\wwwroot\testGkAnywhere\webroot\Images\portraits\" + id + ".png", Convert.FromBase64String(imageFile));
                    // File.WriteAllBytes(@"C:\\Projects\\anywhere-4\\Gargolye\\webroot\\Images\\portraits\\" + id + ".png", Convert.FromBase64String(imageFile));
                    File.WriteAllBytes(@portraitPath + id + ".png", Convert.FromBase64String(imageFile));
                }


                return executeDataBaseCall("CALL DBA.ANYW_Roster_UpdatePortrait('" + token + "', '" + employeeUserName + "', '" + imageFile + "', '" + id + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("539", ex.Message + " ANYW_Roster_UpdatePortrait('" + token + "', '" + employeeUserName + "', '" + imageFile + "', '" + id + "')");
                return "539: Error updating portrait";
            }
        }

        //public string getUserPermissions(string token)
        //{
        //    if (tokenValidator(token) == false) return null;
        //    logger.debug("getUserPermissions" + token);
        //    try
        //    {
        //        return executeDataBaseCall("CALL DBA.ANYW_User_Permissions('" + token + "');", "results", "result");
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("540", ex.Message + " ANYW_User_Permissions('" + token + "')");
        //        return "540: Error getting user permissions";
        //    }
        //}
        public string getUserPermissions(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserPermissions " + token);

            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_User_Permissions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {

                logger.error("653", ex.Message + "ANYW_User_Permissions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "653: error ANYW_User_Permissions";

            }
        }


        public string featureLogging(string token, string featureDescription)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(featureDescription) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_FeatureLogging('" + token + "', '" + featureDescription + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("541", ex.Message + " ANYW_FeatureLogging('" + token + "', '" + featureDescription + "')");
                return "541: Error getting Logging Feature";
            }
        }

        public string getConsumerSpecificVendorsJSON(string token, string consumerId, string serviceDate)
        {
            if (tokenValidator(token) == false) return null;
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetConsumerSpecificVendors('" + token + "', '" + consumerId + "', '" + serviceDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("542", ex.Message + " ANYW_CaseNotes_GetConsumerSpecificVendors('" + token + "', '" + consumerId + "', '" + serviceDate + "')");
                return "542: Error getting Vendor Info";
            }
        }

        public string getServiceLocationsForCaseNoteDropDown(string token, string serviceDate, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetServiceLocationsForCaseNoteDropDown('" + token + "', '" + serviceDate + "', '" + consumerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("543", ex.Message + " ANYW_CaseNotes_GetServiceLocationsForCaseNoteDropDown('" + token + "', '" + serviceDate + "', '" + consumerId + "')");
                return "543: Error getting Service Locations";
            }
        }

        public string saveGroupCaseNote(string token, string noteId, string groupNoteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string caseNote, string reviewRequired, string confidential, string consumerGroupCount, string casenotemileage, string casenotetraveltime, string documentationTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveGroupCaseNote" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_SaveGroupCaseNote('" + token + "', '" + noteId + "', '" + groupNoteId + "', '" + caseManagerId + "', '" + consumerId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + vendorId + "', '" + contactCode + "', '" + serviceLocationCode + "', '" + caseNote + "', '" + reviewRequired + "', '" + confidential + "', '" + consumerGroupCount + "', '" + casenotemileage + "', '" + casenotetraveltime + "', '" + documentationTime + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("544", ex.Message + " ANYW_CaseNotes_SaveGroupCaseNote('" + token + "', '" + noteId + "', '" + groupNoteId + "', '" + caseManagerId + "', '" + consumerId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + vendorId + "', '" + contactCode + "', '" + serviceLocationCode + "', '" + caseNote + "', '" + reviewRequired + "', '" + confidential + "', '" + consumerGroupCount + "', '" + casenotemileage + "', '" + casenotetraveltime + "', '" + documentationTime + "')");
                return "544: Error saving case note";
            }
        }

        public string deleteExistingCaseNote(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteExistingCaseNote" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_DeleteExistingCaseNote('" + token + "', '" + noteId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("545", ex.Message + " ANYW_CaseNotes_DeleteExistingCaseNote('" + token + "', '" + noteId + "')");
                return "545: Error deleting case note";
            }
        }

        public string getReviewRequiredForCaseManager(string token, string caseManagerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getReviewRequiredForCaseManager" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetReviewRequiredForCaseManager('" + token + "', '" + caseManagerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("546", ex.Message + " ANYW_CaseNotes_GetReviewRequiredForCaseManager('" + token + "', '" + caseManagerId + "')");
                return "546: Error Getting Review Required";
            }
        }

        public string GetDemographicInformation(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDemographicsInformation" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetDemographicInformation('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_GetDemographicInformation('" + token + "')");
                return "547: Error Getting Consumer Demographics";
            }
        }

        public string GetValidateEmailInformation(string token, string email)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(email) == false) return null;
            logger.debug("getDemographicsInformation" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetValidateEmailInformation('" + token + "' , '" + email + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_GetValidateEmailInformation('" + token + "', '" + email + "')");
                return "547: Error Getting Consumer Demographics";
            }
        }

        public string updateDemographicInformation(string token, string addressOne, string addressTwo, string city, string state, string zipCode, string mobilePhone, string email, string carrier)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateDemographicInformation");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Demographics_UpdateDemographicInformation('" + token + "', '" + addressOne + "', '" + addressTwo + "', '" + city + "', '" + state + "', '" + zipCode + "', '" + mobilePhone + "', '" + email + "', '" + carrier + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("584", ex.Message + " ANYW_Demographics_UpdateDemographicInformation('" + token + "', '" + addressOne + "', '" + addressTwo + "', '" + city + "', '" + state + "', '" + zipCode + "', '" + mobilePhone + "', '" + email + "', '" + carrier + "')", token);
                return "584: Error updating demographics information";
            }
        }
        public string getMobileCarrierDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMobileCarrierDropdown" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GetMobileCarriers('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("719", ex.Message + " ANYW_GetMobileCarriers('" + token + "')");
                return "719: getMobileCarrierDropdown";
            }
        }
        public string getConsumerDemographicsJSON(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerDemographics" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetConsumerDemographics('" + token + "', '" + consumerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_GetConsumerDemographics('" + token + "', '" + consumerId + "')");
                return "547: Error Getting Consumer Demographics";
            }
        }
        public string getConsumerRelationshipsJSON(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerRelationshipsJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetConsumerRelationships('" + token + "', '" + consumerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_GetConsumerRelationships('" + token + "', '" + consumerId + "')");
                return "547: Error Getting Consumer Demographics";
            }
        }

        public string getEditConsumerRelationshipsJSON(string token, string consumerId, string isActive)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetEditConsumerRelationshipsJson" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetEditConsumerRelationships('" + token + "', '" + consumerId + "', '" + isActive + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_GetEditConsumerRelationships('" + token + "', '" + consumerId + "', '" + isActive + "')");
                return "547: Error Getting Consumer Demographics";
            }
        }

        public string getRelationshipsTypeJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRelationshipsTypeJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetRelationshipsType('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_GetRelationshipsType('" + token + "')");
                return "547: Error Getting Consumer Demographics";
            }
        }
        public string getEmployeeDropdown(string token, string locationId, string region, int maxWeeklyHours, string shiftStartTime, string shiftEndTime, int minTimeBetweenShifts, int includeTrainedOnly)
        {
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(region);
            list.Add(maxWeeklyHours.ToString());
            list.Add(shiftStartTime);
            list.Add(shiftEndTime);
            list.Add(minTimeBetweenShifts.ToString());
            list.Add(includeTrainedOnly.ToString());
            string text = "CALL DBA.ANYW_Scheduling_GetEmployeeDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4WL", ex.Message + "ANYW_WaitingList_GetSupportingDocumentList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4WL: error ANYW_WaitingList_GetSupportingDocumentList";
        }
        }

        public string getRelationshipsNameJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRelationshipsNameJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_getRelationshipsName('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_getRelationshipsName('" + token + "')");
                return "547: Error Getting person list Demographics";
            }
        }

        public string getRelationshipsNameByIDJSON(string token, string relationType)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRelationshipsNameByIDJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_getRelationshipsNameByID('" + token + "','" + relationType + "');");
            }
            catch (Exception ex)
            {
                logger.error("547", ex.Message + " ANYW_Demographics_getRelationshipsNameByID('" + token + "','" + relationType + "')");
                return "547: Error Getting person list byId Demographics";
            }
        }

        public string insertEditRelationship(string token, string userId, string consumerId, string startDate, string endDate, string personID, string typeID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertEditRelationship");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Demographics_insertEditRelationship('" + token + "', '" + userId + "', '" + consumerId + "', '" + startDate + "', '" + endDate + "', '" + personID + "', '" + typeID + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("584", ex.Message + " ANYW_Demographics_insertEditRelationship('" + token + "', '" + userId + "', '" + consumerId + "', '" + startDate + "', '" + endDate + "', '" + personID + "', '" + typeID + "')", token);
                return "584: Error insert Edit Relationship";
            }
        }

        public string insertArchiveRelationship(string token, string userId, string consumerId, string startDate, string endDate, string personID, string typeID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertArchiveRelationship");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Demographics_insertArchiveRelationship('" + token + "', '" + userId + "', '" + consumerId + "', '" + startDate + "', '" + endDate + "', '" + personID + "', '" + typeID + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("584", ex.Message + " ANYW_Demographics_insertArchiveRelationship('" + token + "', '" + userId + "', '" + consumerId + "', '" + startDate + "', '" + endDate + "', '" + personID + "', '" + typeID + "')", token);
                return "584: Error insert Archive Relationship";
            }
        }

        public string deleteRelationship(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteRelationship");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Demographics_deleteRelationship('" + token + "', '" + consumerId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("584", ex.Message + " ANYW_Demographics_deleteRelationship('" + token + "', '" + consumerId + "')", token);
                return "584: Error delete Relationship";
            }
        }

        public string getDemographicsNotesJSON(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDemographicsNotes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Demographics_GetNotes('" + token + "', '" + consumerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("553", ex.Message + " ANYW_Demographics_GetNotes('" + token + "', '" + consumerId + "')");
                return "553: Error Getting Consumer Demographics Notes";
            }
        }

        public string setupPasswordResetEmail(string userName)
        {
            logger.debug("setupPasswordResetEmail" + userName);
            if (stringInjectionValidatorLogin(userName) == false) return null;
            if (stringInjectionValidator(userName) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Login_SetupPasswordResetEmail('" + userName + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("548", ex.Message + " ANYW_Login_SetupPasswordResetEmail('" + userName + "')");
                return "548: Error With Password Reset Email Setup";
            }
        }

        public string getSystemMessagesAndCustomLinksJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSystemMessagesAndCustomLinks" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_GetSystemMessagesAndCustomLinks('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("549", ex.Message + " ANYW_Dashboard_GetSystemMessagesAndCustomLinks('" + token + "')");
                return "549: Error getting messages and link";
            }
        }

        public string getRemainingDailyGoalsJSON(string token, string checkDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRemainingDailyGoals " + token + ", " + checkDate);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_RemainingDailyGoals('" + token + "', '" + checkDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("550", ex.Message + " ANYW_GoalsAndServices_RemainingDailyGoals('" + token + "', '" + checkDate + "')");
                return "550: Error getting remaining daily goals";
            }
        }

        public string getCNPopulateFilterDropdowns(string token, string serviceCodeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryCountInfo");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(serviceCodeId);
            string text = "CALL DBA.ANYW_CaseNotes_PopulateFilterDropdowns(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("500.1", ex.Message + "ANYW_CaseNotes_PopulateFilterDropdowns(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "500.1: error ANYW_CaseNotes_PopulateFilterDropdowns";
            }
        }
        public string getRejectionReasonDropdownData(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryCountInfo");

            string text = "CALL DBA.ANYW_CaseNotes_RejectReasonDropdowns('" + token + "')";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("500.1", ex.Message + "ANYW_CaseNotes_RejectReasonDropdowns('" + token + "')");
                return "500.1: error ANYW_CaseNotes_RejectReasonDropdowns";
            }
        }

        public string updateNoteReviewResult(string token, string userId, string reviewResult, string noteId, string rejectReason)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(rejectReason) == false) return null;
            logger.debug("updateNoteReviewResult");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(userId);
            list.Add(reviewResult);
            list.Add(rejectReason);
            list.Add(noteId);

            string text = "CALL DBA.ANYW_CaseNotes_UpdateNoteReviewResult(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";

            try
            {
                return executeDataBaseCall(text);
            }
            catch (Exception ex)
            {
                logger.error("584", ex.Message + text);
                return "584: Error updating note review results";
            }
        }

        public string getCaseLoadRestriction(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCaseLoadRestriction" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetCaseLoadRestriction('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("551", ex.Message + " ANYW_CaseNotes_GetCaseLoadRestriction('" + token + "')");
                return "551: Error getting case load restriction";
            }
        }

        public string getGroupNoteId(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getGroupNoteId" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetGroupNoteID('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("552", ex.Message + " ANYW_CaseNotes_GetGroupNoteID('" + token + "')");
                return "552: Error getting group note id";
            }
        }

        public string caseNoteOverlapCheck(string token, string consumerId, string startTime, string endTime, string serviceDate, string caseManagerId, string noteId, string groupNoteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("caseNoteOverlapCheck" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GroupNoteOverlapCheck('" + token + "', '" + consumerId + "', '" + startTime + "', '" + endTime + "', '" + serviceDate + "', '" + caseManagerId + "', '" + noteId + "', '" + groupNoteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("553", ex.Message + " ANYW_CaseNotes_GroupNoteOverlapCheck('" + token + "', '" + consumerId + "', '" + startTime + "', '" + endTime + "', '" + serviceDate + "', '" + caseManagerId + "', '" + noteId + "', '" + groupNoteId + "')");
                return "553: Error checking time overlap";
            }
        }

        public string getGroupNoteNames(string token, string groupNoteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("caseNoteGetGroupNames" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_GetGroupNoteConsumerNames('" + token + "', '" + groupNoteId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("554", ex.Message + " ANYW_CaseNotes_GetGroupNoteConsumerNames('" + token + "', '" + groupNoteId + "')");
                return "554: Error gettign group notes names";
            }
        }

        public string updateGroupNoteValues(string token, string groupNoteId, string noteId, string serviceOrBillingCodeId, string serviceDate, string startTime, string endTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("caseNoteUpdateGroupNote" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_UpdateGroupNoteValues('" + token + "', '" + groupNoteId + "', '" + noteId + "', '" + serviceOrBillingCodeId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("555", ex.Message + " ANYW_CaseNotes_UpdateGroupNoteValues('" + token + "', '" + groupNoteId + "', '" + noteId + "', '" + serviceOrBillingCodeId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "')");
                return "555: Error updating group note";
            }
        }

        public string updateGroupNoteValuesAndDropdowns(string token, string groupNoteId, string noteId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string contactCode, string serviceDate, string startTime, string endTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateGroupNoteValuesAndDropdowns" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_UpdateGroupNoteValuesAndDropdowns('" + token + "', '" + groupNoteId + "', '" + noteId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + contactCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("556", ex.Message + " ANYW_CaseNotes_UpdateGroupNoteValuesAndDropdowns('" + token + "', '" + groupNoteId + "', '" + noteId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + contactCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "')");
                return "556: Error updating group note with dropdowns";
            }
        }

        public string saveAdditionalGroupCaseNote(string token, string noteId, string groupNoteId, string caseManagerId, string consumerId, string serviceOrBillingCodeId, string locationCode, string serviceCode, string needCode, string serviceDate, string startTime, string endTime, string vendorId, string contactCode, string serviceLocationCode, string reviewRequired, string confidential, string caseNote, string casenotemileage, string casenotetraveltime, string documentationTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveAdditionalGroupCaseNote" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_SaveAdditionalGroupCaseNote('" + token + "', '" + noteId + "', '" + groupNoteId + "', '" + caseManagerId + "', '" + consumerId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + vendorId + "', '" + contactCode + "', '" + serviceLocationCode + "', '" + reviewRequired + "', '" + confidential + "', '" + caseNote + "', '" + casenotemileage + "', '" + casenotetraveltime + "', '" + documentationTime + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("557", ex.Message + " ANYW_CaseNotes_SaveAdditionalGroupCaseNote('" + token + "', '" + noteId + "', '" + groupNoteId + "', '" + caseManagerId + "', '" + consumerId + "', '" + serviceOrBillingCodeId + "', '" + locationCode + "', '" + serviceCode + "', '" + needCode + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + vendorId + "', '" + contactCode + "', '" + serviceLocationCode + "', '" + reviewRequired + "', '" + confidential + "', '" + caseNote + "', '" + casenotemileage + "', '" + casenotetraveltime + "', '" + documentationTime + "')");
                return "557: Error saving case note";
            }

        }

        //Single Entry
        public string insertSingleEntry(string token, string userId, string updaterId, string personId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string latitude, string longitude, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community, string evvLocationType, string transportationStartTime, string transportationEndTime, string origination)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertSingleEntry" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_InsertSingleEntry('" + token + "', '" + userId + "', '" + updaterId + "', '" + personId + "', '" + dateOfService + "', '" + locationId + "', '" + workCodeID + "', '" + startTime + "', '" + endTime + "', '" + checkHours + "', '" + consumerId + "', '" + transportationUnits + "', '" + transportationReimbursable + "', '" + numberOfConsumersPresent + "', '" + inComments + "', '" + odometerStart + "', '" + odometerEnd + "', '" + destination + "', '" + reason + "', '" + latitude + "', '" + longitude + "', '" + endLatitude + "', '" + endLongitude + "', '" + deviceType + "', '" + evvReason + "', '" + attest + "', '" + licensePlateNumber + "', '" + community + "', '" + evvLocationType + "', '" + transportationStartTime + "', '" + transportationEndTime + "', '" + origination + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("558", ex.Message + " ANYW_SingleEntry_InsertSingleEntry('" + token + "', '" + userId + "', '" + updaterId + "', '" + personId + "', '" + dateOfService + "', '" + locationId + "', '" + workCodeID + "', '" + startTime + "', '" + endTime + "', '" + checkHours + "', '" + consumerId + "', '" + transportationUnits + "', '" + transportationReimbursable + "', '" + numberOfConsumersPresent + "', '" + inComments + "', '" + odometerStart + "', '" + odometerEnd + "', '" + destination + "', '" + reason + "', '" + latitude + "', '" + longitude + "', '" + endLatitude + "', '" + endLongitude + "', '" + deviceType + "', '" + evvReason + "', '" + attest + "', '" + licensePlateNumber + "', '" + community + "', '" + evvLocationType + "', '" + transportationStartTime + "', '" + transportationEndTime + "', '" + origination + "')");
                return "558: Error inserting single entry";
            }

        }

        public string updateSingleEntry(string token, string userId, string dateOfService, string locationId, string workCodeID, string startTime, string endTime, string checkHours, string consumerId, string transportationUnits, string transportationReimbursable, string numberOfConsumersPresent, string singleEntryId, string inComments, string odometerStart, string odometerEnd, string destination, string reason, string endLatitude, string endLongitude, string deviceType, string evvReason, string attest, string licensePlateNumber, string community, string updateEVVReason, string evvLocationType, string transportationStartTime, string transportationEndTime, string origination)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateSingleEntry" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_UpdateSingleEntry('" + token + "', '" + userId + "', '" + dateOfService + "', '" + locationId + "', '" + workCodeID + "', '" + startTime + "', '" + endTime + "', '" + checkHours + "', '" + consumerId + "', '" + transportationUnits + "', '" + transportationReimbursable + "', '" + numberOfConsumersPresent + "', '" + singleEntryId + "', '" + inComments + "', '" + odometerStart + "', '" + odometerEnd + "', '" + destination + "', '" + reason + "', '" + endLatitude + "', '" + endLongitude + "', '" + deviceType + "', '" + evvReason + "' , '" + attest + "', '" + licensePlateNumber + "', '" + community + "', '" + updateEVVReason + "', '" + evvLocationType + "', '" + transportationStartTime + "', '" + transportationEndTime + "', '" + origination + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("559", ex.Message + " ANYW_SingleEntry_UpdateSingleEntry('" + token + "', '" + userId + "', '" + dateOfService + "', '" + locationId + "', '" + workCodeID + "', '" + startTime + "', '" + endTime + "', '" + checkHours + "', '" + consumerId + "', '" + transportationUnits + "', '" + transportationReimbursable + "', '" + numberOfConsumersPresent + "', '" + singleEntryId + "','" + inComments + "', '" + odometerStart + "', '" + odometerEnd + "', '" + destination + "', '" + reason + "', '" + endLatitude + "', '" + endLongitude + "', '" + deviceType + "', '" + evvReason + "', '" + attest + "', '" + licensePlateNumber + "', '" + community + "', '" + updateEVVReason + "', '" + evvLocationType + "', '" + transportationStartTime + "', '" + transportationEndTime + "', '" + origination + "')");
                return "559: Error updating single entry";
            }

        }

        public string getSingleEntryByIdJSON(string token, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryByIdJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetById('" + token + "', '" + singleEntryId + "');");
            }
            catch (Exception ex)
            {
                logger.error("559", ex.Message + " ANYW_SingleEntry_GetById('" + token + "', '" + singleEntryId + "')");
                return "559: Error getting single entry by id";
            }

        }

        public string getSingleEntryByDateJSON(string token, string userId, string startDate, string endDate, string locationId, string statusIn)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryByDateJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetByDate('" + token + "', '" + userId + "', '" + startDate + "', '" + endDate + "', '" + locationId + "','" + statusIn + "');");
            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_SingleEntry_GetByDate('" + token + "', '" + userId + "', '" + startDate + "', '" + endDate + "', '" + locationId + "','" + statusIn + "')");
                return "561: Error getting single entry by id";
            }

        }

        public string deleteSingleEntryRecord(string token, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteSingleEntryRecord" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_DeleteSingleEntryRecord('" + token + "', '" + singleEntryId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("562", ex.Message + " ANYW_SingleEntry_DeleteSingleEntryRecord('" + token + "', '" + singleEntryId + "')");
                return "562: Error deleting single entry record";
            }

        }

        public string getSingleEntryRequiredFields(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryRequiredFields" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_GetRequiredFields('" + token + "');", "results", "requiredfield");
            }
            catch (Exception ex)
            {
                logger.error("563", ex.Message + " ANYW_SingleEntry_GetRequiredFields('" + token + "')");
                return "563: Error getting single entry required fields";
            }

        }

        public string getWorkCodesJSON(string token, string getAllWorkCodes)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getWorkCodes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetWorkCodes('" + token + "','" + getAllWorkCodes + "');");
            }
            catch (Exception ex)
            {
                logger.error("564", ex.Message + " ANYW_SingleEntry_GetWorkCodes('" + token + "')");
                return "564: Error getting work codes";
            }

        }

        public string getSingleEntryPayPeriodsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryPayPeriods" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetPayPeriods('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("565", ex.Message + " ANYW_SingleEntry_GetPayPeriods('" + token + "')");
                return "565: Error getting single entry pay periods";
            }

        }

        public string approveSingleEntryRecord(string token, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("approveSingleEntryRecord" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_ApproveSingleEntryRecord('" + token + "', '" + singleEntryId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("566", ex.Message + " ANYW_SingleEntry_ApproveSingleEntryRecord('" + token + "', '" + singleEntryId + "')");
                return "566: Error approving single entry record";
            }

        }

        public string getSingleEntryLocationsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocations");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetLocations('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("567", ex.Message + ex.InnerException.ToString() + " ANYW_SingleEntry_GetLocations('" + token + "')", token);
                return "567: Error getting single entry Locations";
            }
        }

        public string getSubEmployeeListAndCountInfoJSON(string token, string supervisorId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSubEmployeeListAndCountInfoJSON");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetSubEmployeeList('" + token + "','" + supervisorId + "');");
            }
            catch (Exception ex)
            {
                logger.error("568-SUB", ex.Message + ex.InnerException.ToString() + " ANYW_SingleEntry_GetSubEmployeeList('" + token + "','" + supervisorId + "')", token);
                return "568-SUB: Error getting single entry SUB employee list and count info";
            }
        }

        public string getEmployeeListAndCountInfoJSON(string token, string supervisorId)//
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getEmployeeListAndCountInfoJSON");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetEmployeeList('" + token + "','" + supervisorId + "');");
            }
            catch (Exception ex)
            {
                logger.error("568", ex.Message + ex.InnerException.ToString() + " ANYW_SingleEntry_GetEmployeeList('" + token + "','" + supervisorId + "')", token);
                return "568: Error getting single entry employee list and count info";
            }
        }

        public string getMissingPlanSignatures(string token, string isCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMissingPlanSignatures");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(isCaseLoad);
            string text = "CALL DBA.ANYW_Dashboard_GetPlansNeedingSignatures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("569", ex.Message + "ANYW_Dashboard_GetPlansNeedingSignatures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "569: error ANYW_Dashboard_GetPlansNeedingSignatures";
            }
        }

        public string getSingleEntryCountInfoJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryCountInfo");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_GetSingleEntryCountInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("569", ex.Message + "ANYW_Dashboard_GetSingleEntryCountInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "569: error ANYW_Dashboard_GetSingleEntryCountInfo";
            }
        }

        public string getSingleEntryConsumersPresentJSON(string token, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryCountInfo");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(singleEntryId);
            string text = "CALL DBA.ANYW_SingleEntry_GetConsumersPresentNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("569-cp", ex.Message + "ANYW_SingleEntry_GetConsumersPresentNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "569-cp: error ANYW_SingleEntry_GetConsumersPresentNew";
            }
        }

        public string updateSingleEntryStatus(string token, string singleEntryIdString, string newStatus)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateSingleEntryStatus" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_UpdateSingleEntryStatus('" + token + "', '" + singleEntryIdString + "', '" + newStatus + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("570", ex.Message + " ANYW_SingleEntry_UpdateSingleEntryStatus('" + token + "', '" + singleEntryIdString + "', '" + newStatus + "')");
                return "570: Error updating single entry status";
            }

        }

        public string getSingleEntryEVVReasonCodeJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryEVVReasonCode" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetEvvReasonCode('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("570", ex.Message + " ANYW_SingleEntry_GetEvvReasonCode('" + token + "', '");
                return "570: Error getting single entry reason codes";
            }

        }

        public string getSingleEntryEvvEligibilityJSON(string token, string consumerId, string entryDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryEvvEligibility" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetConsumerEvvEligibility('" + token + "', '" + consumerId + "', '" + entryDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("570", ex.Message + " ANYW_SingleEntry_GetConsumerEvvEligibility('" + token + "', '" + consumerId + "', '" + entryDate + "')");
                return "570: Error getting single entry reason codes";
            }

        }
        public string getUndocumentedServicesForWarning(string entryDate, string consumerId, string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUndocumentedServicesForWarning" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetUndocumentedServicesForWarning('" + entryDate + "','" + consumerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("570", ex.Message + " ANYW_SingleEntry_GetUndocumentedServicesForWarning('" + entryDate + "','" + consumerId + "')");
                return "570: Error getting getUndocumentedServicesForWarning";
            }
        }

        public string getRemainingGoalsCountForDashboard(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRemainingGoalsCountForDashboard");
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Dashboard_GetRemainingGoalsCount('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("569", ex.Message + ex.InnerException.ToString() + " ANYW_Dashboard_GetRemainingGoalsCount('" + token + "')", token);
                return "569: Error getting goal count for dashboard";
            }
        }

        public string getSingleEntryAdminApprovalNumbersJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryAdminApprovalNumbers");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_GetSingleEntryAdminApprovalNumbers('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("570", ex.Message + ex.InnerException.ToString() + " ANYW_Dashboard_GetSingleEntryAdminApprovalNumbers('" + token + "')", token);
                return "570: Error getting goal count for dashboard";
            }
        }

        public string getSingleEntryAdminLocations(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryAdminLocations");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_GetSingleEntryAdminLocations('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("570", ex.Message + ex.InnerException.ToString() + " ANYW_Dashboard_GetSingleEntryAdminLocations('" + token + "')", token);
                return "570: Error getting goal count for dashboard";
            }
        }

        public string getUserSingleEntryLocationsForPayPeriod(string token, string userId, string startDate, string endDate, string locationID, string status)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserSingleEntryLocationsForPayPeriod" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_GetUserSingleEntryLocationsForPayPeriod('" + token + "', '" + userId + "', '" + startDate + "', '" + endDate + "', '" + locationID + "', '" + status + "');", "results", "locations");
            }
            catch (Exception ex)
            {
                logger.error("571", ex.Message + " ANYW_SingleEntry_GetUserSingleEntryLocationsForPayPeriod('" + token + "', '" + userId + "', '" + startDate + "', '" + endDate + "', '" + locationID + "', '" + status + "')");
                return "571: Error getting single entry location by pay period";
            }

        }

        public string getRequiredSingleEntryFields(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRequiredSingleEntryFields");
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_GetRequiredFields('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("572", ex.Message + ex.InnerException.ToString() + " ANYW_SingleEntry_GetRequiredFields('" + token + "')", token);
                return "572: Error getting required single entry fields";
            }
        }

        public string getRequiredSingleEntryFieldsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRequiredSingleEntryFields");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetRequiredFields('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("572", ex.Message + ex.InnerException.ToString() + " ANYW_SingleEntry_GetRequiredFields('" + token + "')", token);
                return "572: Error getting required single entry fields";
            }
        }

        public string timeEntryRejectionNotification(string token, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("timeEntryRejectionNotification ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(singleEntryId);
            string text = "CALL DBA.ANYW_TimeEntryRejectionNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("701", ex.Message + "ANYW_TimeEntryRejectionNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "701: Error logger.error(\"701\", ex.Message + \"ANYW_TimeEntryRejectionNotification(\" + string.Join(\",\", list.Select(x => string.Format(\"'{0}'\", x)).ToList()) + \")\");\r\n";
            }
        }

        public string getClockedInDayServicesAtLocationCounts(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getClockedInDayServicesAtLocationCounts");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Dashboard_GetClockedInDayServicesAtLocationCounts('" + token + "', '" + locationId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("573", ex.Message + " ANYW_Dashboard_GetClockedInDayServicesAtLocationCounts('" + token + "', '" + locationId + "')", token);
                return "573: Error getting Clocked In Day Services At Location Counts";
            }
        }

        public string saveDefaultLocationValue(string token, string switchCase, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(locationId) == false) return null;
            logger.debug("saveDefaultLocationValue");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Settings_SaveDefaultLocationValue('" + token + "', '" + switchCase + "', '" + locationId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("574", ex.Message + " ANYW_Settings_SaveDefaultLocationValue('" + token + "', '" + switchCase + "', '" + locationId + "')", token);
                return "574: Error saving default location value";
            }
        }

        public string saveDefaultLocationName(string token, string switchCase, string locationName)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(locationName) == false) return null;
            logger.debug("saveDefaultLocationName");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Settings_SaveDefaultLocationName('" + token + "', '" + switchCase + "', '" + locationName + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("574", ex.Message + " ANYW_Settings_SaveDefaultLocationName('" + token + "', '" + switchCase + "', '" + locationName + "')", token);
                return "574: Error saving default location name";
            }
        }

        //Intellivue call to get login credentials
        public string getIntellivueCredentials(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveDefaultLocationName");
            logger.debug("getIntellivueURL");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Intellivue_GetCredentials(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
                //return "1234";
            }
            catch (Exception ex)
            {
                logger.error("575", ex.Message + " ANYW_Intellivue_GetCredentials('" + token + "')", token);
                return "575: Error getting intellivue credentials";
            }
        }

        public string getIntellivueURL(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIntellivueURL");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Intellivue_GetURL(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
                //return "http://intellicloud22.intellinetics.com/intellicloudvue/IntegrationService.asmx/";
            }
            catch (Exception ex)
            {
                logger.error("576", ex.Message + " ANYW_Intellivue_GetURL('" + token + "')", token);
                return "576: Error getting intellivue url";
            }
        }

        public string getClockedInConsumerNamesDayServicesJSON(string token, string locationId, string isCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getClockedInConsumerNamesDayServices");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_GetClockedInDayServicesConsumerNames('" + token + "', '" + locationId + "', '" + isCaseLoad + "');");
            }
            catch (Exception ex)
            {
                logger.error("577", ex.Message + " ANYW_Dashboard_GetClockedInDayServicesConsumerNames('" + token + "', '" + locationId + "', '" + isCaseLoad + "')", token);
                return "577: Error getting Clocked In Consumer Names At Day Services";
            }
        }

        public string getClockedInStaffNamesDayServicesJSON(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getClockedInStaffNamesDayServices");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_GetClockedInDayServicesStaffNames('" + token + "', '" + locationId + "');");
            }
            catch (Exception ex)
            {
                logger.error("578", ex.Message + " ANYW_Dashboard_GetClockedInDayServicesStaffNames('" + token + "', '" + locationId + "')", token);
                return "578: Error getting Clocked In Staff Names At Day Services";
            }
        }

        public string getSingleEntryUsersByLocationJSON(string token, string locationId, string seDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryUsersByLocation");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetUsersForLocation('" + token + "', '" + locationId + "', '" + seDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("579", ex.Message + " ANYW_SingleEntry_GetUsersForLocation('" + token + "', '" + locationId + "', '" + seDate + "')", token);
                return "579: Error getting single entry consumer names for single entry";
            }
        }

        public string singleEntryOverlapCheckJSON(string token, string dateOfService, string startTime, string endTime, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryUsersByLocationJSON");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_OverlapCheck('" + token + "', '" + dateOfService + "', '" + startTime + "', '" + endTime + "', '" + singleEntryId + "');");
            }
            catch (Exception ex)
            {
                logger.error("580", ex.Message + " ANYW_SingleEntry_OverlapCheck('" + token + "', '" + dateOfService + "', '" + startTime + "', '" + endTime + "', '" + singleEntryId + "')", token);
                return "580: Error checking single entry overlap";
            }
        }

        //New for above
        public string getDashboardDayServicesLocationsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryUsersWC" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_DayServiceGetLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("581", ex.Message + "ANYW_Dashboard_DayServiceGetLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "581: error ANYW_Dashboard_DayServiceGetLocations";
            }
        }

        public string getSingleEntryReportPath(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryReportPath");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_SingleEntry_GetReportPath('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("581", ex.Message + " ANYW_SingleEntry_GetReportPath('" + token + "')", token);
                return "581: Error getting report path";
            }
        }

        public string getReportPath(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryReportPath");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Settings_GetReportPath('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("581.5", ex.Message + " ANYW_Settings_GetReportPath('" + token + "')", token);
                return "581.5: Error getting report path";
            }
        }

        public string getCIStaffDropdownJSON(string token, string serviceDate, string locationID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCIStaffDropdown");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_DayService_GetCIDropdownStaff('" + token + "', '" + serviceDate + "', '" + locationID + "');");
            }
            catch (Exception ex)
            {
                logger.error("582", ex.Message + " ANYW_DayService_GetCIDropdownStaff('" + token + "', '" + serviceDate + "', '" + locationID + "')", token);
                return "582: Error getting CI staff drop down";
            }
        }

        public string getExistingCIStaffId(string token, string serviceDate, string locationID, string consumerId, string startTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCIStaff");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_GetExistingCIStaff('" + token + "', '" + serviceDate + "', '" + locationID + "', '" + consumerId + "', '" + startTime + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("583", ex.Message + " ANYW_DayService_GetExistingCIStaff('" + token + "', '" + serviceDate + "', '" + locationID + "', '" + consumerId + "', '" + startTime + "')", token);
                return "583: Error getting existing CI staff";
            }
        }

        public string updateCIStaff(string token, string serviceDate, string locationID, string consumerId, string startTime, string staffId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateCIStaff");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_UpdateCIStaff('" + token + "', '" + serviceDate + "', '" + locationID + "', '" + consumerId + "', '" + startTime + "', '" + staffId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("584", ex.Message + " ANYW_DayService_UpdateCIStaff('" + token + "', '" + serviceDate + "', '" + locationID + "', '" + consumerId + "', '" + startTime + "', '" + staffId + "')", token);
                return "584: Error updating existing CI staff";
            }
        }

        public string deleteCIStaffId(string token, string serviceDate, string locationID, string consumerId, string startTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteCIStaff");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_DayService_DeleteExistingCIStaff('" + token + "', '" + serviceDate + "', '" + locationID + "', '" + consumerId + "', '" + startTime + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("585", ex.Message + " ANYW_DayService_DeleteExistingCIStaff('" + token + "', '" + serviceDate + "', '" + locationID + "', '" + consumerId + "', '" + startTime + "')", token);
                return "585: Error deleteing CI staff";
            }
        }

        public string getConsumersThatCanHaveMileageJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumersThatCanHaveMileage");

            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_CaseNotes_GetConsumersThatCanHaveMileage('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("586", ex.Message + " ANYW_CaseNotes_GetConsumersThatCanHaveMileage('" + token + "')", token);
                return "586: Error getting consuemrs that can have mileage";
            }
        }

        public string updateVersion(string token, string version)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(version) == false) return null;
            logger.debug("updateVersion");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_UpdateVersion('" + token + "', '" + version + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("587", ex.Message + " ANYW_UpdateVersion('" + token + "', '" + version + "')", token);
                return "587: Error updating version";
            }
        }

        public string getGroupNoteMaxMileage(string token, string groupNoteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getGroupNoteMaxMileage" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_GetGroupNoteMaxMileage('" + token + "', '" + groupNoteId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("588", ex.Message + " ANYW_CaseNotes_GetGroupNoteMaxMileage('" + token + "', '" + groupNoteId + "')");
                return "588: Error getting max mileage";
            }

        }

        public string getDocTimeEditPermission(string token, string peopleId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDocTimeEditPermission" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_GetDocTimeEditPermission('" + token + "', '" + peopleId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("589", ex.Message + " ANYW_CaseNotes_GetDocTimeEditPermission('" + token + "', '" + peopleId + "')");
                return "589: Error getting doc time permission";
            }

        }

        public string clearTravelTimeOnChange(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("clearTravelTimeOnChange" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_ClearTravelTime('" + token + "', '" + noteId + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("590", ex.Message + " ANYW_CaseNotes_ClearTravelTime('" + token + "', '" + noteId + "')");
                return "590: Error clearing travel time";
            }

        }

        //public string getSingleEntryPayPeriodsAdmin(string token)
        //{
        //    logger.debug("getSingleEntryPayPeriodsAdmin" + token);
        //    try
        //    {
        //        return executeDataBaseCall("CALL DBA.ANYW_AdminSingleEntry_GetPayPeriods('" + token + "');", "results", "adminpayperiod");
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("591", ex.Message + " ANYW_AdminSingleEntry_GetPayPeriods('" + token + "')");
        //        return "591: Error getting admin single entry pay periods";
        //    }

        //}

        public string singleEntryFilterAdminListJSON(string token, string startDate, string endDate, string supervisorId, string locationId, string employeeId, string status, string workCodeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectNotesByConsumerAndLocation" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(supervisorId);
            list.Add(locationId);
            list.Add(employeeId);
            list.Add(status);
            list.Add(workCodeId);

            string text = "CALL DBA.ANYW_AdminSingleEntry_FilterList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("592", ex.Message + "ANYW_AdminSingleEntry_FilterList('" + token + "')");
                return "592: error SelectNotesByConsumerAndLocation";
            }
        }

        public string getSingleEntrySupervisorsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntrySupervisors" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_AdminSingleEntry_GetSupervisors('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("593", ex.Message + " ANYW_AdminSingleEntry_GetSupervisors('" + token + "')");
                return "593: Error getting supervisors for admin ";
            }

        }

        public string getGoalsCommunityIntegrationLevelJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getGoalsCommunityIntegrationLevel");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_GetCommunityIntegrationLevel('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("594", ex.Message + ex.InnerException.ToString() + " ANYW_GoalsAndServices_GetCommunityIntegrationLevel('" + token + "')", token);
                return "594: Error getting goals community integration level dropdown";
            }
        }

        public string getAdminSingleEntryLocationsJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAdminSingleEntryLocationsJSON");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_AdminSingleEntry_GetLocations('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("594", ex.Message + ex.InnerException.ToString() + " ANYW_AdminSingleEntry_GetLocations('" + token + "')", token);
                return "594: Error getting admin locations";
            }
        }

        public string adminUpdateSingleEntryStatus(string token, string singleEntryIdString, string newStatus, string userID, string rejectionReason)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(singleEntryIdString) == false) return null;//will validate and id string if comma or pipe delimited
            if (stringInjectionValidator(rejectionReason) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(singleEntryIdString);
            list.Add(newStatus);
            list.Add(userID);
            list.Add(rejectionReason);
            logger.debug("adminUpdateSingleEntryStatus" + token);

            string text = "CALL DBA.ANYW_AdminSingleEntry_AdminUpdateSingleEntryStatus(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PSDG", ex.Message + "ANYW_ISP_DeletePlanSignature(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6APSDG: error ANYW_ISP_DeletePlanSignature";
            }

        }

        public string getInfalLoginCredentials(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getInfalLoginCredentials" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Infal_GetLoginCredentials('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("596", ex.Message + " ANYW_Infal_GetLoginCredentials('" + token + "')");
                return "596: error getting infal login";
            }
        }

        public string getDateToCheckShowCI(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDateToCheckShowCI" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_DayService_GetCIDate('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("597", ex.Message + " ANYW_DayService_GetCIDate('" + token + "')");
                return "597: error getting CI date";
            }
        }

        public string getGoalsCommunityIntegrationRequiredJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getGoalsCommunityIntegrationRequired" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GoalsAndServices_CIRequiredCheck('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("598", ex.Message + "ANYW_GoalsAndServices_CIRequiredCheck('" + token + "')");
                return "598: error getting CI date";
            }
        }

        public string deleteConsumerNote(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("DeleteConsumerNote" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_DeleteConsumerNote('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("599", ex.Message + "ANYW_ConsumerNotes_DeleteConsumerNote('" + token + "', '" + noteId + "')");
                return "599: error deleting consumer note";
            }
        }

        public string insertConsumerNote(string token, string consumerId, string noteTitle, string note, string locationId, string hideNote)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertConsumerNote" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_InsertConsumerNote('" + token + "', '" + consumerId + "','" + noteTitle + "', '" + note + "', '" + locationId + "', '" + hideNote + "');");
            }
            catch (Exception ex)
            {
                logger.error("601", ex.Message + "ANYW_ConsumerNotes_InsertConsumerNote('" + token + "', '" + consumerId + "','" + noteTitle + "', '" + note + "', '" + locationId + "', '" + hideNote + "')");
                return "601: error inserting consumer note";
            }
        }

        public string updateConsumerNoteDateRead(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateConsumerNoteDateRead" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_UpdateDateRead('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("602", ex.Message + "ANYW_ConsumerNotes_UpdateDateRead('" + token + "', '" + noteId + "')");
                return "602: error updating consumer note";
            }
        }

        public string selectConsumerNote(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectConsumerNote" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_SelectConsumerNote('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("603", ex.Message + "ANYW_ConsumerNotes_SelectConsumerNote('" + token + "', '" + noteId + "')");
                return "603: error selecting consumer note";
            }
        }

        public string updateConsumerNotesDaysBack(string token, string updatedReviewDays)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateConsumerNotesDaysBack" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_UpdateConsumerNotesDaysBack('" + token + "', '" + updatedReviewDays + "');");
            }
            catch (Exception ex)
            {
                logger.error("604", ex.Message + "ANYW_ConsumerNotes_UpdateConsumerNotesDaysBack('" + token + "', '" + updatedReviewDays + "')");
                return "604: error updateConsumerNotesDaysBack";
            }
        }

        public string updateConnectWithPerson(string token, string connectType)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateConnectWithPerson" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Settings_updateConnectWithPerson('" + token + "', '" + connectType + "');");
            }
            catch (Exception ex)
            {
                logger.error("604", ex.Message + "ANYW_Settings_updateConnectWithPerson('" + token + "', '" + connectType + "')");
                return "604: error updateConnectWithPerson";
        }
        }

        public string updateConsumerNotesChecklistDaysBack(string token, string updatedChecklistDays)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateConsumerNotesChecklistDaysBack" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_UpdateConsumerNotesChecklistDaysBack('" + token + "', '" + updatedChecklistDays + "');");
            }
            catch (Exception ex)
            {
                logger.error("605", ex.Message + "ANYW_ConsumerNotes_UpdateConsumerNotesChecklistDaysBack('" + token + "', '" + updatedChecklistDays + "')");
                return "605: error updateConsumerNotesChecklistDaysBack";
            }
        }

        public string updateLocationNoteDateRead(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateLocationNoteDateRead" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_UpdateDateRead('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("606", ex.Message + "ANYW_LocationNotes_UpdateDateRead('" + token + "', '" + noteId + "')");
                return "606: error updating location note";
            }
        }

        public string insertLocationNote(string token, string noteTitle, string note, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertLocationNote" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_InsertLocationNote('" + token + "', '" + noteTitle + "', '" + note + "', '" + locationId + "');");
            }
            catch (Exception ex)
            {
                logger.error("607", ex.Message + "ANYW_LocationNotes_InsertLocationNote('" + token + "', '" + noteTitle + "', '" + note + "', '" + locationId + "')");
                return "607: error inserting location note";
            }
        }

        public string deleteLocationNote(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteLocationNote" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_DeleteLocationNote('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("608", ex.Message + "ANYW_LocationNotes_DeleteLocationNote('" + token + "', '" + noteId + "')");
                return "608: error deleting location note";
            }
        }

        public string selectAllUsersConsumersNotes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectAllUsersConsumersNotes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_SelectAllUsersConsumerNotes('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("609", ex.Message + "ANYW_ConsumerNotes_SelectAllUsersConsumerNotes('" + token + "')");
                return "609: error selectAllUsersConsumersNotes";
            }
        }

        public string selectAllUsersLocationNotes(string token, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectAllUsersConsumersNotes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_SelectAllUsersLocationNotes('" + token + "', '" + daysBackDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("610", ex.Message + "ANYW_LocationNotes_SelectAllUsersLocationNotes('" + token + "', '" + daysBackDate + "')");
                return "610: error selectAllUsersConsumersNotes";
            }
        }

        public string selectNotesByConsumerAndLocation(string token, string consumerId, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectNotesByConsumerAndLocation" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(locationId);

            string text = "CALL DBA.ANYW_ConsumerNotes_SelectNotesByConsumerAndLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("611", ex.Message + "ANYW_ConsumerNotes_SelectNotesByConsumerAndLocation('" + token + "')");
                return "611: error SelectNotesByConsumerAndLocation";
            }
        }

        public string selectNotesByLocation(string token, string locationId, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(daysBackDate) == false) return null;
            logger.debug("selectNotesByLocation" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(daysBackDate);

            string text = "CALL DBA.ANYW_LocationNotes_SelectNotesByLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("612", ex.Message + "ANYW_LocationNotes_SelectNotesByLocation('" + token + "', '" + locationId + "')");
                return "612: error SelectNotesByLocation";
            }
        }

        public string selectLocationNote(string token, string noteId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectLocationNote" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_SelectLocationNote('" + token + "', '" + noteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("612", ex.Message + "ANYW_LocationNotes_SelectLocationNote('" + token + "', '" + noteId + "')");
                return "612: error selectLocationNote";
            }
        }

        public string updateConsumerNote(string token, string noteId, string consumerId, string note)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateConsumersNote" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(noteId);
            list.Add(consumerId);
            list.Add(note);

            string text = "CALL DBA.ANYW_ConsumerNotes_UpdateConsumerNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("613", ex.Message + "ANYW_ConsumerNotes_UpdateConsumerNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "613: error ANYW_ConsumerNotes_UpdateConsumerNote";
            }
        }

        public string updateHideNote(string token, string noteId, string consumerId, string hideNote)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateHideNote" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(noteId);
            list.Add(consumerId);
            list.Add(hideNote);

            string text = "CALL DBA.ANYW_ConsumerNotes_UpdateHideNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("613", ex.Message + "ANYW_ConsumerNotes_UpdateHideNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "613: error ANYW_ConsumerNotes_UpdateHideNote";
            }
        }

        public string updateLocationNote(string token, string noteId, string locationId, string note)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateLocationNote" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(noteId);
            list.Add(locationId);
            list.Add(note);

            string text = "CALL DBA.ANYW_LocationNotes_UpdateLocationNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("614", ex.Message + "ANYW_LocationNotes_UpdateLocationNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "614: error ANYW_LocationNotes_UpdateLocationNote";
            }
        }

        public string getLocationsWithUnreadNotes(string token, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(daysBackDate) == false) return null;
            logger.debug("LocationsWithUnreadNotes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_LocationsWithUnreadNotes('" + token + "', '" + daysBackDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("615", ex.Message + "ANYW_ConsumerNotes_LocationsWithUnreadNotes('" + token + "', " + daysBackDate + ")");
                return "615: error getting locations with unread notes";
            }
        }

        public string getConsumersWithUnreadNotesByEmployeeAndLocation(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumersWithUnreadNotesByEmployeeAndLocation " + token + " " + locationId);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_SelectConsumersWithUnreadNotesByEmployeeAndLocation('" + token + "', '" + locationId + "');");
            }
            catch (Exception ex)
            {
                logger.error("616", ex.Message + " ANYW_ConsumerNotes_SelectConsumersWithUnreadNotesByEmployeeAndLocation('" + token + "', '" + locationId + "')");
                return "616: error getting locations with unread notes";
            }
        }

        public string getConsumersWithUnreadNotesByEmployeeAndLocationPermission(string token, string locationId, string daysBackDate, string isCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(daysBackDate) == false) return null;
            logger.debug("getConsumersWithUnreadNotesByEmployeeAndLocationPermission" + token + " " + locationId);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_SelectConsumersWithUnreadNotesByEmployeeAndLocationPermission('" + token + "', '" + locationId + "', '" + daysBackDate + "', '" + isCaseLoad + "');");
            }
            catch (Exception ex)
            {
                logger.error("616.5", ex.Message + " ANYW_ConsumerNotes_SelectConsumersWithUnreadNotesByEmployeeAndLocationPermission('" + token + "', '" + locationId + "', " + daysBackDate + ", '" + isCaseLoad + "')");
                return "616.5: error getting locations with unread notes";
            }
        }

        public string checkIfLocationHasUnreadNotes(string token, string locationId, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("checkIfLocationHasUnreadNotes " + token + " " + locationId);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_CheckIfUnreadNotes('" + token + "', " + locationId + ", '" + daysBackDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("617", ex.Message + " ANYW_LocationNotes_CheckIfUnreadNotes('" + token + "', '" + locationId + "', " + daysBackDate + ")");
                return "617: error getting locations with unread notes";
            }
        }

        public string deleteAbsent(string token, string absentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteAbsent" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Absent_Delete('" + token + "', '" + absentId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("618", ex.Message + " ANYW_Absent_Delete('" + token + "', '" + absentId + "')");
                return "618: Error deleting absent";
            }
        }

        public string selectAbsent(string token, string consumerId, string locationId, string statusDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectAbsent" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(locationId);
            list.Add(statusDate);

            string text = "CALL DBA.ANYW_Absent_Select(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("619", ex.Message + "ANYW_Absent_Select(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "619: error ANYW_LocationNotes_UpdateLocationNote";
            }
        }

        public string selectAbsentNotificationTypes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("selectAbsentNotificationTypes" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Absent_SelectAbsentNotificationTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("620", ex.Message + "ANYW_Absent_SelectAbsentNotificationTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "620: error ANYW_Absent_SelectAbsentNotificationTypes";
            }
        }

        public string selectAbsentReasons(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("seletAbsentReasons" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Absent_SelectAbsentReasons(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("621", ex.Message + "ANYW_Absent_SelectAbsentReasons(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "621: error ANYW_Absent_SelectAbsentReasons";
            }
        }

        public string oneLocationAbsentTableSave(string token, string absentReasonId, string absentNotificationId, string consumerId, string absenceDate, string locationId, string reportedBy, string timeReported, string dateReported)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("oneLocationAbsentTableSave" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(absentReasonId);
            list.Add(absentNotificationId);
            list.Add(consumerId);
            list.Add(absenceDate);
            list.Add(locationId);
            list.Add(reportedBy);
            list.Add(timeReported);
            list.Add(dateReported);
            string text = "CALL DBA.ANYW_Absent_OneLocationAbsentTableSave(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("622", ex.Message + "ANYW_Absent_OneLocationAbsentTableSave(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "622: error ANYW_Absent_OneLocationAbsentTableSave";
            }
        }

        public string absentPreSaveCheck(string token, string consumerId, string absentDate, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("absentPreSaveCheck" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(absentDate);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Absent_PreSaveCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("623", ex.Message + "ANYW_Absent_PreSaveCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "623: error ANYW_Absent_PreSaveCheck";
            }
        }

        public string getObjectiveIdsForAbsentSave(string token, string consumerId, string absenceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("absentPreSaveCheck" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(absenceDate);
            string text = "CALL DBA.ANYW_Absent_GetObjectiveIdsForAbsentSave(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("624", ex.Message + "ANYW_Absent_GetObjectiveIdsForAbsentSave(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "624: error ANYW_Absent_GetObjectiveIdsForAbsentSave";
            }
        }

        public string absentGetAllConsumerLocations(string token, string consumerId, string absentDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("absentGetAllConsumerLocations" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(absentDate);
            string text = "CALL DBA.ANYW_Absent_GetAllConsumerLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("625", ex.Message + "ANYW_Absent_GetAllConsumerLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "625: error ANYW_Absent_GetAllConsumerLocations";
            }
        }

        public string saveAbsentObjctiveActivities(string token, string absentId, string objId, string absenceDate, string absentReasonId, string locationId, string dateReported, string reportedBy)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveAbsentObjctiveActivities" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(absentId);
            list.Add(objId);
            list.Add(absenceDate);
            list.Add(absentReasonId);
            list.Add(locationId);
            list.Add(dateReported);
            list.Add(reportedBy);
            string text = "CALL DBA.ANYW_Absent_SaveAbsentObjctiveActivities(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("626", ex.Message + "ANYW_Absent_SaveAbsentObjctiveActivities(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "626: error ANYW_Absent_SaveAbsentObjctiveActivities";
            }
        }

        public string getCounsumerLocationsForAbsentSave(string token, string consumerId, string absenceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCounsumerLocationsForAbsentSave" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(absenceDate);
            string text = "CALL DBA.ANYW_Absent_GetCounsumerLocationsForAbsentSave(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("627", ex.Message + "ANYW_Absent_GetCounsumerLocationsForAbsentSave(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "627: error ANYW_Absent_CounsumerLocationsForAbsentSave";
            }
        }

        public string getConsumersByLocationAbsent(string token, string absenceDate, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(locationId) == false) return null;
            if (IsDateValidFormat(absenceDate) == false) return null;
            logger.debug("getCounsumerLocationsForAbsentSave" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(absenceDate);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Absent_GetConsumersWithAbsentByLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("628", ex.Message + "ANYW_Absent_GetConsumersWithAbsentByLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "628: error ANYW_Absent_GetConsumersWithAbsentByLocation";
            }
        }

        public string getCompanyWorkWeekStartFromDB(string token, char weekTwo)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCompanyWorkWeekStartFromDB" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(weekTwo.ToString());
            string text = "CALL DBA.ANYW_Dashboard_GetCompanyWorkWeekStartFromDB(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("629", ex.Message + "ANYW_Dashboard_GetCompanyWorkWeekStartFromDB(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "629: error ANYW_Dashboard_GetCompanyWorkWeekStartFromDB";
            }
        }

        public string getCompanyWorkWeekStartFromDBSch(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCompanyWorkWeekStartFromDB" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_GetCompanyWorkWeekStartFromDBSch(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("629.5", ex.Message + "ANYW_Dashboard_GetCompanyWorkWeekStartFromDBSch(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "629.5: error ANYW_Dashboard_GetCompanyWorkWeekStartFromDBSch";
            }
        }

        public string getCompanyWorkWeekEndFromDB(string token, char weekTwo)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCompanyWorkWeekStartFromDB" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(weekTwo.ToString());
            string text = "CALL DBA.ANYW_Dashboard_GetCompanyWorkWeekEndFromDB(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("629", ex.Message + "ANYW_Dashboard_GetCompanyWorkWeekEndFromDB(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "629: error ANYW_Dashboard_GetCompanyWorkWeekEndFromDB";
            }
        }

        public string getWeekHoursWorked(string token, string startDate, string endDate, string prevWeekStart, string prevWeekEnd)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCurrentWeekHoursWorked" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(prevWeekStart);
            list.Add(prevWeekEnd);
            string text = "CALL DBA.ANYW_Dashboard_GetWeekHoursWorked(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("630", ex.Message + "ANYW_Dashboard_GetWeekHoursWorked(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "630: error ANYW_Dashboard_GetWeekHoursWorked";
            }
        }

        public string getSchedulingPeriods(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSchedulingPeriods" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_GetSchedulingPeriods(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("631", ex.Message + "ANYW_Dashboard_GetSchedulingPeriods(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "631: error ANYW_Dashboard_GetSchedulingPeriods";
            }
        }

        public string getSchedulingRegions(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSchedulingPeriods" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Scheduling_GetRegions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("631", ex.Message + "ANYW_Scheduling_GetRegions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "631: error ANYW_Scheduling_GetRegions";
        }
        }

        public string getSchedulingPeriodsDetails(string token, string startDate, string endDate)//Needs procedures in db still
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSchedulingPeriodsDetails" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(startDate);
            list.Add(endDate);
            string text = "CALL DBA.ANYW_Dashboard_GetSchedulingPeriodsDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("632", ex.Message + "ANYW_Dashboard_GetSchedulingPeriodsDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "632: error ANYW_Dashboard_GetSchedulingPeriodsDetails";
            }
        }

        public string getSingleEntryUsersWCJSON(string token, string seDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSingleEntryUsersWCJSON");
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetUsersForWorkCode('" + token + "', '" + seDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("633", ex.Message + "ANYW_SingleEntry_GetUsersForWorkCode('" + token + "', '" + seDate + "');");
                return "633: error ANYW_SingleEntry_GetUsersForWorkCode";
            }
        }

        public string getConsumerLocationForSingleEntry(string token, string dateOfService, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerLocationForSingleEntry" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(dateOfService);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_SingleEntry_GetConsumerLocationForSingleEntry(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("634", ex.Message + "ANYW_SingleEntry_GetConsumerLocationForSingleEntry(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "634: error ANYW_SingleEntry_GetConsumerLocationForSingleEntry";
            }
        }

        public string checkForIndividualAbsentJSON(string token, string locationId, string consumerId, string checkDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("checkForIndividualAbsent" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(consumerId);
            list.Add(checkDate);
            string text = "CALL DBA.ANYW_Absent_CheckForIndividualAbsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("635", ex.Message + "ANYW_Absent_CheckForIndividualAbsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "635: error ANYW_Absent_CheckForIndividualAbsent";
            }
        }

        public string getOutcomeTypeForFilterJSON(string token, string selectedDate, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getOutcomeTypeForFilter" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedDate);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetOutcomeTypeForFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_GetOutcomeTypeForFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_GetOutcomeTypeForFilter";
            }
        }


        public string getPSIUserOptionListJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPSIUserOptionListJSON" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Admin_GetPSIUserOptionList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("637", ex.Message + "DBA.ANYW_Admin_GetPSIUserOptionList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "637: error DBA.ANYW_Admin_GetPSIUserOptionList";
            }
        }


        public string GetAllAttachments(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetAllAttachments " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Roster_GetListOfAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("638", ex.Message + "ANYW_Roster_GetListOfAttachments(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "638: error ANYW_Roster_GetListOfAttachments";
            }
        }

        public string GetApplicationName(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetAllAttachments " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GetApplicationName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6381", ex.Message + "ANYW_GetApplicationName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6381: error ANYW_GetApplicationName";
            }
        }

        public string GetAttachmentFileName(string attachmentId)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_Roster_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("639", ex.Message + "ANYW_Roster_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "639: error ANYW_Roster_GetAttachmentFileName";
            }
        }

        public string GetWFAttachmentFileName(string attachmentId)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_WF_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("6349", ex.Message + "ANYW_Roster_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6394: error ANYW_Roster_GetAttachmentFileName";
            }
        }

        public MemoryStream GetAttachmentData(string attachmentId)
        {
            logger.debug("GetAttachmentData " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_Roster_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_Roster_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public MemoryStream GetWfAttachmentData(string attachmentId)
        {
            logger.debug("GetAttachmentData " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_WF_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("6404", ex.Message + "ANYW_WF_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public string getCNAttachmentFileName(string attachmentId)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_CaseNotes_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("640.1", ex.Message + "ANYW_CaseNotes_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "640.1: error ANYW_CaseNotes_GetAttachmentFileName";
            }
        }

        public string getWaitingListAttachmentFileName(string attachmentId)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_WaitingList_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("640.1", ex.Message + "ANYW_WaitingList_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "640.1: error ANYW_WaitingList_GetAttachmentFileName";
            }
        }

        public string getPlanAttachmentFileName(string attachmentId, string section)
        {
            logger.debug("GetIndividualAttachment " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            list.Add(section);
            string text = "CALL DBA.ANYW_ISP_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("640.1", ex.Message + "ANYW_ISP_GetAttachmentFileName(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "640.1: error ANYW_ISP_GetAttachmentFileName";
            }
        }

        public string getAbsentWidgetFilterData(string token, string absentDate, string absentLocationId, string absentGroupCode, string custGroupId)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(absentDate) == false) return null;
            if (IsDateValidFormat(absentDate) == false) return null;
            logger.debug("getAbsentWidgetFilterData " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(absentDate);
            list.Add(absentLocationId);
            list.Add(absentGroupCode);
            list.Add(custGroupId);
            string text = "CALL DBA.ANYW_Dashboard_GetAbsentWidgetFilterData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("641", ex.Message + "ANYW_Dashboard_GetAbsentWidgetFilterData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "641: error ANYW_Dashboard_GetAbsentWidgetFilterData";
            }
        }

        public string getUserInfo(string token, string userID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserInfo " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(userID);
            string text = "CALL DBA.ANYW_Admin_GetUserInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("642", ex.Message + "ANYW_Admin_GetUserInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "642: error ANYW_Admin_GetUserInfo";
            }
        }

        public string WorkshopPreBatchLoad(string token, string absenceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("WorkshopPreBatchLoad " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(absenceDate);
            string text = "CALL DBA.ANYW_Workshop_PreBatchLoad(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("643", ex.Message + "ANYW_Workshop_PreBatchLoad(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "643: error ANYW_Workshop_PreBatchLoad";
            }
        }

        public string WorkshopGetLocations(string token, string serviceDate)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(serviceDate) == false) return null;
            logger.debug("WorkshopGetLocations " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(serviceDate);
            string text = "CALL DBA.ANYW_Workshop_GetLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("644", ex.Message + "ANYW_Workshop_GetLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "644: error ANYW_Workshop_GetLocations";
            }
        }

        public string getEnabledConsumersForWorkshop(string token, string selectedDate, string selectedLocation)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getEnabledConsumersForWorkshop " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedDate);
            list.Add(selectedLocation);
            string text = "CALL DBA.ANYW_Workshop_GetEnabledConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("645", ex.Message + "ANYW_Workshop_GetEnabledConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "645: error getEnabledConsumersForWorkshop";
            }
        }

        public string getWorkshopSupervisors(string token, string selectedDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getWorkshopSupervisors " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedDate);
            string text = "CALL DBA.ANYW_Workshop_GetWorkshopSupervisors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("646", ex.Message + "ANYW_Workshop_GetWorkshopSupervisors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "646: error ANYW_Workshop_GetWorkshopSupervisors";
            }
        }

        public string getWorkshopJobCode(string token, string selectedDate, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getWorkshopJobCode " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedDate);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Workshop_GetWorkshopJobCode(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647", ex.Message + "ANYW_Workshop_GetWorkshopJobCode(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647: error ANYW_Workshop_GetWorkshopJobCode";
            }
        }

        public string getWorkshopFilterListData(string token, string selectedDate, string consumerIds, string locationId, string jobStepId, string batchId)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIds) == false) return null;
            logger.debug("getWorkshopFilterListData " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedDate);
            list.Add(consumerIds);
            list.Add(locationId);
            list.Add(jobStepId);
            list.Add(batchId);
            string text = "CALL DBA.ANYW_Workshop_GetWorkshopFilterListData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("648", ex.Message + "ANYW_Workshop_GetWorkshopFilterListData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "648: error ANYW_Workshop_GetWorkshopFilterListData";
            }
        }

        public string workshopPreClockIn(string token, string selectedDate, string locationId, string supervisorId, string startTime, string consumerIds, string jobStepId, string jobActType, string batchId)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIds) == false) return null;
            logger.debug("workshopPreSaveCall " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(selectedDate);
            list.Add(locationId);
            list.Add(supervisorId);
            list.Add(startTime);
            list.Add(consumerIds);
            list.Add(jobStepId);
            list.Add(jobActType);
            list.Add(batchId);
            string text = "CALL DBA.ANYW_Workshop_PreClockIn(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //return executeDataBaseCallJSON(text);
                return executeDataBaseCall(text);
            }
            catch (Exception ex)
            {
                logger.error("649", ex.Message + "ANYW_Workshop_PreClockIn(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "649: error ANYW_Workshop_PreClockIn";
            }
        }

        public string workshopPreClockOut(string token, string consumerIds, string endTime, string supervisorId, string selectedDate, string jobStepId)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIds) == false) return null;
            logger.debug("workshopPreSaveCall " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerIds);
            list.Add(endTime);
            list.Add(supervisorId);
            list.Add(selectedDate);
            list.Add(jobStepId);
            string text = "CALL DBA.ANYW_Workshop_PreClockOut(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("650", ex.Message + "ANYW_Workshop_PreClockOut(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "650: error ANYW_Workshop_PreClockOut";
            }
        }

        public string getEmployeeIdForAdvisor(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Workshop_GetEmployeeIdForAdvisor('" + token + "', '" + consumerId + "');", "", "");
            }
            catch (Exception ex)
            {
                logger.error("559", ex.Message + " ANYW_Workshop_GetEmployeeIdForAdvisor('" + token + "', '" + consumerId + "')");
                return "559: Error getting single entry by id";
            }
        }

        public string deleteWorkshopEntry(string token, string jobActivityId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteWorkshopEntry " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(jobActivityId);
            string text = "CALL DBA.ANYW_Workshop_DeleteWorkshopEntry(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("652", ex.Message + "ANYW_Workshop_DeleteWorkshopEntry(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "652: error ANYW_Workshop_DeleteWorkshopEntry";
            }
        }

        public string UpdateWorkshopClockIn(string token, string jobActivityId, string timeEntered)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateWorkshopClockIn " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(jobActivityId);
            list.Add(timeEntered);
            string text = "CALL DBA.ANYW_Workshop_UpdateClockIn(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("653", ex.Message + "ANYW_Workshop_UpdateClockIn(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "653: error ANYW_Workshop_UpdateClockIn";
            }
        }

        public string ClockoutWorkshopSingle(string token, string jobActivityId, string timeEntered)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ClockoutWorkshopSingle " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(jobActivityId);
            list.Add(timeEntered);
            string text = "CALL DBA.ANYW_Workshop_ClockoutWorkshopSingle(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("654", ex.Message + "ANYW_Workshop_ClockoutWorkshopSingle(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "654: error ANYW_Workshop_UpdateClockIn";
            }
        }

        public string getWorkshopOverlapCheck(string token, string consumerId, string locationId, string selectedDate, string startTime, string startOrEnd, string supervisorId, string jobStepId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ClockoutWorkshopSingle " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(locationId);
            list.Add(selectedDate);
            list.Add(startTime);
            list.Add(startOrEnd);
            list.Add(supervisorId);
            list.Add(jobStepId);
            string text = "CALL DBA.ANYW_Workshop_OverlapCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("655", ex.Message + "ANYW_Workshop_OverlapCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "655: error ANYW_Workshop_OverlapCheck";
            }
        }

        public string getIntellivueAppIdURL(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIntellivueAppIdURL");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Intellivue_GetAppIdURL(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //return executeDataBaseCall("CALL DBA.ANYW_Intellivue_GetURL('" + token + "');", "results", "result");
                return executeDataBaseCallRaw(text);
                //return "https://securehost8.intellinetics.com/test/intellivuewebapi/icmcoreservice.asmx/";
            }
            catch (Exception ex)
            {
                logger.error("656", ex.Message + " ANYW_Intellivue_GetAppIdURL('" + token + "')", token);
                return "656: Error getting intellivue url";
            }
        }


        public string GetAttachmentExtension(string attachmentId)
        {
            logger.debug("GetAttachmentExtension " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_Roster_GetAttachmentExtension(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("657", ex.Message + "GetAttachmentExtension(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "657: error GetAttachmentExtension";
            }
        }

        public MemoryStream GetAttachmentDataWF(string attachmentId)
        {
            logger.debug("GetAttachmentData " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_WF_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                //MemoryStream temp = new MemoryStream();
                //temp = executeSQLReturnMemoryStream("SELECT Attachment from Attachments where Attachment_ID = " + attachmentId);
                //temp = executeSQLReturnMemoryStream(text);
                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_Roster_GetAttachmentData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
            }
        }

        public string GetAttachmentExtensionWF(string attachmentId)
        {
            logger.debug("GetAttachmentExtension " + attachmentId);
            List<string> list = new List<string>();
            list.Add(attachmentId);
            string text = "CALL DBA.ANYW_WF_GetAttachmentExtension(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("657", ex.Message + "GetAttachmentExtension(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "657: error GetAttachmentExtension";
            }
        }

        public string UpdateWorkshopQuantity(string token, string quantity, string jobActivityId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("UpdateWorkshopQuantity " + jobActivityId);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(quantity);
            list.Add(jobActivityId);
            string text = "CALL DBA.ANYW_Workshop_UpdateWorkshopQuantity(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("658", ex.Message + "ANYW_Workshop_UpdateWorkshopQuantity(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "658: error UpdateWorkshopQuantity";
            }
        }

        public string getIntellivueDomain(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIntellivueGetDomain");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Intellivue_GetDomain(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
                //return "https://securehost8.intellinetics.com/test/intellivuewebapi/icmcoreservice.asmx/";
            }
            catch (Exception ex)
            {
                logger.error("659", ex.Message + " ANYW_Intellivue_GetDomain('" + token + "')", token);
                return "659: Error getting intellivue url";
            }
        }

        public string getConsumerNumberForIntellivue(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIntellivueGetDomain");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Intellivue_GetConsumerNumberForIntellivue(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
                //return "https://securehost8.intellinetics.com/test/intellivuewebapi/icmcoreservice.asmx/";
            }
            catch (Exception ex)
            {
                logger.error("659", ex.Message + " ANYW_Intellivue_GetDomain('" + token + "')", token);
                return "659: Error getting intellivue url";
            }
        }

        public string GetCaraSolvaSecret()
        {
            string text = "CALL DBA.ANYW_CaraSolva_GetSharedSecret()";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("660", ex.Message + "ANYW_CaraSolva_GetSharedSecret()");
                return "660: error ANYW_CaraSolva_GetSharedSecret";
            }
        }

        public string GetCaraSolvaUserName(string anywhereToken)
        {
            if (tokenValidator(anywhereToken) == false) return null;
            string userName = "";
            string text = "CALL DBA.ANYW_GetUserNameFromToken('" + anywhereToken + "')";
            try
            {
                userName = executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("661", ex.Message + "ANYW_GetUserNameFromToken('" + anywhereToken + "')");
            }

            return userName;

        }

        public string GetCaraSolvaCompanyName()
        {
            string text = "CALL DBA.ANYW_CaraSolva_GetCompanyName()";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("662", ex.Message + "ANYW_CaraSolva_GetCompanyName()");
                return "662: error ANYW_CaraSolva_GetCompanyName";
            }
        }

        public string checkSingleClockOutOverlapWorkshop(string token, string jobActivityId, string timeEntered)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("checkSingleClockOutOverlapWorkshop " + jobActivityId);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(jobActivityId);
            list.Add(timeEntered);
            string text = "CALL DBA.ANYW_Workshop_CheckSingleClockOutOverlapWorkshop(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("663", ex.Message + "ANYW_Workshop_CheckSingleClockOutOverlapWorkshop(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "663: error UpdateWorkshopQuantity";
            }
        }

        public string checkSingleClockInOverlapWorkshop(string token, string jobActivityId, string timeEntered)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("checkSingleClockInOverlapWorkshop " + jobActivityId);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(jobActivityId);
            list.Add(timeEntered);
            string text = "CALL DBA.ANYW_Workshop_CheckSingleClockInOverlapWorkshop(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                logger.error("664", ex.Message + "ANYW_Workshop_CheckSingleClockInOverlapWorkshop(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "664: error UpdateWorkshopQuantity";
            }
        }

        public string getConsumerScheduleLocation(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerScheduleLocation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Dashboard_GetConsumerScheduleLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("665", ex.Message + "ANYW_Dashboard_GetConsumerScheduleLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "665: error getConsumerScheduleLocation";
            }
        }

        public string getUserByTokenJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserByTokenJSON");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GetUserNameFromToken(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                //logger.error("515", ex.Message, token); //this could make a forever loop. 
                return "515: Error with Get User";
            }
        }

        public string getEmailFromTokenJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ANYW_GetEmailFromToken");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GetEmailFromToken(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                //logger.error("515", ex.Message, token); //this could make a forever loop. 
                return "515: Error with Get User";
            }
        }

        public string getUserCredJSON(string userId)
        {
            logger.debug("getUserByTokenJSON");
            List<string> list = new List<string>();
            list.Add(userId);
            string text = "CALL DBA.ANYW_GetUserCred(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                //logger.error("515", ex.Message, token); //this could make a forever loop. 
                return "515: Error with Get User";
            }
        }

        public string getEmarURL(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserByTokenJSON");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_EMAR_GetEmarURL(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallRaw(text);
            }
            catch (Exception ex)
            {
                //logger.error("515", ex.Message, token); //this could make a forever loop. 
                return "515: Error with Get User";
            }
        }

        public string populateConsumerSchedule(string token, string locationId, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerScheduleLocation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Dashboard_PopulateConsumerSchedule(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("666", ex.Message + "ANYW_Dashboard_PopulateConsumerSchedule(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "666: error ANYW_Dashboard_PopulateConsumerSchedule";
            }
        }

        public string remainingServicesWidgetFilter(string token, string outcomeType, string locationId, string group, string checkDate, string isCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerScheduleLocation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(outcomeType);
            list.Add(locationId);
            list.Add(group);
            list.Add(checkDate);
            list.Add(isCaseLoad);
            string text = "CALL DBA.ANYW_Dashboard_RemainingServicesWidgetFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("667", ex.Message + "ANYW_Dashboard_RemainingServicesWidgetFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "667: error ANYW_Dashboard_RemainingServicesWidgetFilter";
            }
        }

        public string populateOutcomeTypesRemainingServicesWidgetFilter(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("populateOutTypesRemainingServicesWidgetFilter ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_GetOutcomeTypesForFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("668", ex.Message + "ANYW_Dashboard_GetOutcomeTypesForFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "668: error ANYW_Dashboard_GetOutcomeTypesForFilter";
            }
        }

        public string populateLocationsRemainingServicesWidgetFilter(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("populateLocationsRemainingServicesWidgetFilter ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_GetOutcomeFilterLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("669", ex.Message + "ANYW_Dashboard_GetOutcomeFilterLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "669: error ANYW_Dashboard_GetOutcomeFilterLocations";
            }
        }

        public string populateGroupsRemainingServicesWidgetFilter(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("populateLocationsRemainingServicesWidgetFilter ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Dashboard_GetOutcomeFilterGroups(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("669", ex.Message + "ANYW_Dashboard_GetOutcomeFilterGroups(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "669: error ANYW_Dashboard_GetOutcomeFilterGroups";
            }
        }
        //Start of incident tracking
        public string getITInvolvementTypeData(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getInvolvementTypeData ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_IncidentTracking_GetInvolvementTypeData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("670", ex.Message + "ANYW_IncidentTracking_GetInvolvementTypeData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "670: error ANYW_IncidentTracking_GetInvolvementTypeData";
            }
        }

        public string getITIncidentCategories(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getITIncidentCategories ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_IncidentTracking_GetIncidentCategories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("671", ex.Message + "ANYW_IncidentTracking_GetIncidentCategories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "671: error ANYW_IncidentTracking_GetIncidentCategories";
            }
        }

        public string getITIncidentLocationDetail(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getITIncidentLocationDetail ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_IncidentTracking_GetIncidentLocationDetail(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("672", ex.Message + "ANYW_IncidentTracking_GetIncidentLocationDetail(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "672: error ANYW_IncidentTracking_GetIncidentLocationDetail";
            }
        }

        public string sendITNotification(string token, string notificationType, string employeeId, string incidentTypeDesc, string incidentDate, string incidentTime, string subcategoryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("sendITNotification ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(notificationType);
            list.Add(employeeId);
            list.Add(incidentTypeDesc);
            list.Add(incidentDate);
            list.Add(incidentTime);
            list.Add(subcategoryId);
            string text = "CALL DBA.ANYW_IncidentTracking_SendITNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("673", ex.Message + "ANYW_IncidentTracking_SendITNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "673: error ANYW_IncidentTracking_SendITNotification";
            }
        }

        public string getITConsumerServiceLocations(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getITConsumerServiceLocations ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerServiceLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("674", ex.Message + "ANYW_IncidentTracking_GetConsumerServiceLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "674: error ANYW_IncidentTracking_GetConsumerServiceLocations";
            }
        }

        public string getITDashboardWidgetData(string token, string viewCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getITDashboardWidgetData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(viewCaseLoad);

            string text = "CALL DBA.ANYW_Dashboard_GetITDashboardWidgetData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("675", ex.Message + "ANYW_Dashboard_GetITDashboardWidgetData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "675: error ANYW_Dashboard_GetITDashboardWidgetData";
            }
        }

        public string updateIncidentTrackingDaysBack(string token, string updatedReviewDays)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateIncidentTrackingDaysBack" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_UpdateIncidentTrackingDaysBack('" + token + "', '" + updatedReviewDays + "');");
            }
            catch (Exception ex)
            {
                logger.error("676", ex.Message + "ANYW_IncidentTracking_UpdateIncidentTrackingDaysBack('" + token + "', '" + updatedReviewDays + "')");
                return "676: error updateIncidentTrackingDaysBack";
            }
        }

        public string getITReviewTableData(string token, string locationId, string groupId, string consumerId, string employeeId, string supervisorId, string subcategoryId, string fromDate, string toDate, string viewCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getITReviewTableData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(groupId);
            list.Add(consumerId);
            list.Add(employeeId);
            list.Add(supervisorId);
            list.Add(subcategoryId);
            list.Add(fromDate);
            list.Add(toDate);
            list.Add(viewCaseLoad);

            string text = "CALL DBA.ANYW_IncidentTracking_GetITReviewTableData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("677", ex.Message + "ANYW_IncidentTracking_GetITReviewTableData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "677: error ANYW_IncidentTracking_GetITReviewTableData";
            }
        }

        public string getLocationsIncidentTrackingReviewPage(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocationsIncidentTrackingReviewPage ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_GetLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("678", ex.Message + "ANYW_GetLocations(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "678: error ANYW_GetLocations";
            }
        }

        public string getEmployeesInvolvedEmployeeDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getEmployeesInvolvedEmployeeDropdown ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_IncidentTracking_EIEmployeeDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("679", ex.Message + "ANYW_IncidentTracking_EIEmployeeDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "679: error ANYW_IncidentTracking_EIEmployeeDropdown";
            }
        }

        public string checkITAutoNotifySupervisor(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getEmployeesInvolvedEmployeeDropdown ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_IncidentTracking_CheckAutoNotifySupervisor(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("679.5", ex.Message + "ANYW_IncidentTracking_CheckAutoNotifySupervisor(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "679.5: error ANYW_IncidentTracking_CheckAutoNotifySupervisor";
            }
        }

        public string getSupervisorIdsToNotify(string token, string incidentDate, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSupervisorIdsToNotify ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentDate);
            list.Add(locationId);

            string text = "CALL DBA.ANYW_IncidentTracking_GetSuprvisorIdsToNotify(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("679.5", ex.Message + "ANYW_IncidentTracking_GetSuprvisorIdsToNotify(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "679.5: error ANYW_IncidentTracking_GetSuprvisorIdsToNotify";
            }
        }

        public string getITReviewPageEmployeeListAndSubList(string token, string supervisorId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getITReviewPageEmployeeListAndSubList ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(supervisorId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetReviewPageEmployeeList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCall(text);
            }
            catch (Exception ex)
            {
                logger.error("680", ex.Message + "ANYW_IncidentTracking_GetReviewPageEmployeeList(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "680: error ANYW_IncidentTracking_GetReviewPageEmployeeList";
            }
        }

        //public string getConsumerTableConsumerLocation(string token, string consumerId)
        //{
        //    logger.debug("getEmployeesInvolvedEmployeeDropdown ");
        //    List<string> list = new List<string>();
        //    list.Add(token);
        //    list.Add(consumerId);
        //    string text = "CALL DBA.ANYW_GoalsAndServices_GetConsumerTableConsumerLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
        //    try
        //    {
        //        return executeDataBaseCallJSON(text);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("680", ex.Message + "ANYW_GoalsAndServices_GetConsumerTableConsumerLocation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
        //        return "680: error ANYW_GoalsAndServices_GetConsumerTableConsumerLocation";
        //    }
        //}

        public string getIncidentEditReviewData(string token, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentEditReviewData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);

            string text = "CALL DBA.ANYW_IncidentTracking_GetReviewEditDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("681", ex.Message + "ANYW_IncidentTracking_GetReviewEditDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "681: error ANYW_IncidentTracking_GetReviewEditDetails";
            }
        }

        public string getIncidentTrackingEditReviewConsumersInvolved(string token, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentTrackingEditReviewConsumersInvolved ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);

            string text = "CALL DBA.ANYW_IncidentTracking_GetReviewEditConsumersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("682", ex.Message + "ANYW_IncidentTracking_GetReviewEditConsumersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "682: error ANYW_IncidentTracking_GetReviewEditConsumersInvolved";
            }
        }

        public string getIncidentTrackingEditReviewEmployeesInvolved(string token, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentTrackingEditReviewEmployeesInvolved ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);

            string text = "CALL DBA.ANYW_IncidentTracking_GetReviewEditEmployeesInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("682", ex.Message + "ANYW_IncidentTracking_GetReviewEditEmployeesInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "682: error ANYW_IncidentTracking_GetReviewEditEmployeesInvolved";
            }
        }

        public string getIncidentTrackingEditReviewOthersInvolved(string token, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentTrackingEditReviewOthersInvolved ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);

            string text = "CALL DBA.ANYW_IncidentTracking_GetReviewEditOthersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("683", ex.Message + "ANYW_IncidentTracking_GetReviewEditOthersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "683: error ANYW_IncidentTracking_GetReviewEditOthersInvolved";
            }
        }

        public string getInjuryRiskDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentTrackingEditReviewOthersInvolved ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_IncidentTracking_GetInjuryRiskDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("683", ex.Message + "ANYW_IncidentTracking_GetInjuryRiskDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "683: error ANYW_IncidentTracking_GetInjuryRiskDropdown";
            }
        }

        public string getInjuryCauseDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentTrackingEditReviewOthersInvolved ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_IncidentTracking_GetInjuryCauseDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("683", ex.Message + "ANYW_IncidentTracking_GetInjuryCauseDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "683: error ANYW_IncidentTracking_GetInjuryCauseDropdown";
            }
        }

        public string saveUpdateIncidentTrackingITDetails(string token, string incidentTypeId, string incidentDate, string incidentTime, string reportedDate,
                                                string reportedTime, string subcategoryId, string locationDetailId, string summary, string note, string prevention, string contributingFactor, string updateIncidentId, string saveUpdate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveIncidentTrackingITDetails ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentTypeId);
            list.Add(incidentDate);
            list.Add(incidentTime);
            list.Add(reportedDate);
            list.Add(reportedTime);
            list.Add(subcategoryId);
            list.Add(locationDetailId);
            list.Add(summary);
            list.Add(note);
            list.Add(prevention);
            list.Add(contributingFactor);
            list.Add(updateIncidentId);
            list.Add(saveUpdate);

            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateIncidentTrackingITDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("684", ex.Message + "ANYW_IncidentTracking_SaveUpdateIncidentTrackingITDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "684: error ANYW_IncidentTracking_SaveUpdateIncidentTrackingITDetails";
            }
        }

        public string saveUpdateITConsumersInvolved(string token, string consumerId, string incidentId, string includeInCount, string involvementId, string consumerIncidentLocationId, string run, string consumerInvolvedIdEdit, string saveOrUpdate, string consumerIdString)
        {
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(consumerIdString) == false) return null;
            logger.debug("saveUpdateITConsumersInvolved ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(incidentId);
            list.Add(includeInCount);
            list.Add(involvementId);
            list.Add(consumerIncidentLocationId);
            list.Add(run);
            list.Add(consumerInvolvedIdEdit);
            list.Add(saveOrUpdate);
            list.Add(consumerIdString);

            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("685", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "685: error ANYW_IncidentTracking_SaveUpdateITConsumersInvolved";
            }
        }

        public string saveUpdateITEmployeesInvolved(string token, string incidentId, string employeeId, string notifyEmployeeChar, string employeeInvolvementTypeId, string run)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITEmployeesInvolved ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);
            list.Add(employeeId);
            list.Add(notifyEmployeeChar);
            list.Add(employeeInvolvementTypeId);
            list.Add(run);

            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITEmployeesInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("686", ex.Message + "ANYW_IncidentTracking_SaveUpdateITEmployeesInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "686: error ANYW_IncidentTracking_SaveUpdateITEmployeesInvolved";
            }
        }

        public string saveUpdateITOthersInvolved(string token, string incidentId, string othersName, string othersCompany, string otherAddress1, string otherAddress2, string othersCity,
                                                                              string othersState, string othersZip, string othersPhone, string othersInvolvementTyId, string run)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITEmployeesInvolved ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);
            list.Add(othersName);
            list.Add(othersCompany);
            list.Add(otherAddress1);
            list.Add(otherAddress2);
            list.Add(othersCity);//
            list.Add(othersState);
            list.Add(othersZip);
            list.Add(othersPhone);
            list.Add(othersInvolvementTyId);
            list.Add(run);

            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITOthersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("687", ex.Message + "ANYW_IncidentTracking_SaveUpdateITOthersInvolved(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "687: error ANYW_IncidentTracking_SaveUpdateITOthersInvolved";
            }
        }

        public string deleteAnywhereITIncident(string token, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteITIncident " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteITIncident(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("688", ex.Message + "ANYW_IncidentTracking_DeleteITIncident(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "688: error ANYW_IncidentTracking_DeleteITIncident";
            }
        }

        public string getIncidentITTypes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getIncidentITTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_IncidentTracking_GetIncidentITTypes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("689", ex.Message + "ANYW_IncidentTracking_GetIncidentITTypess(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "689: error ANYW_IncidentTracking_GetIncidentITTypes";
            }
        }

        public string generateIncidentTrackingReport(string token, string category, string title, string reportServerList, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("generateIncidentTrackingReport ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(category);
            list.Add(title);
            list.Add(reportServerList);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GenerateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_IncidentTracking_GenerateReport(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_IncidentTracking_GenerateReport";
            }
        }

        public string sendIncidentTrackingReport(string token, string reportScheduleId, string toAddresses, string ccAddresses, string bccAddresses, string emailSubject, string emailBody)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ANYW_SendIncidentTrackingReport  ");
            List<string> list = new List<string>();
            list.Add(reportScheduleId);
            list.Add(toAddresses);
            list.Add(ccAddresses);
            list.Add(bccAddresses);
            list.Add(emailSubject);
            list.Add(emailBody);
            string text = "CALL DBA.ANYW_SendIncidentTrackingReport (" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1ITR", ex.Message + "ANYW_SendIncidentTrackingReport (" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1ITR: error ANYW_SendIncidentTrackingReport ";
            }
        }

        public string checkIfITReportExists(string token, string reportScheduleId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ANYW_CheckIfReportExists  ");
            List<string> list = new List<string>();
            list.Add(reportScheduleId);
            string text = "CALL DBA.ANYW_CheckIfReportExists (" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1CNR", ex.Message + "ANYW_CheckIfReportExists (" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1CNR: error ANYW_CheckIfReportExists ";
            }
        }

        //Scheduling
        public string getSchedulesForSchedulingModule(string token, string locationId, string personId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSchedulesForSchedulingModule ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(personId);
            string text = "CALL DBA.ANYW_Scheduling_GetSchedulesForSchedulingModule(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("690", ex.Message + "ANYW_Scheduling_GetSchedulesForSchedulingModule(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "690: error ANYW_Scheduling_GetAllSchedulesForLocation";
            }
        }

        public string getSchedulesForSchedulingModuleNew(string token, string locationId, string personId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSchedulesForSchedulingModule ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(personId);
            string text = "CALL DBA.ANYW_Scheduling_GetSchedulesForSchedulingModuleNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("690", ex.Message + "ANYW_Scheduling_GetSchedulesForSchedulingModuleNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "690: error ANYW_Scheduling_GetAllSchedulesForLocationNew";
            }
        }

        public string getLocationDropdownForScheduling(string token, char showOpenShifts)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMainLocationDropdownForScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add("N");
            string text = "CALL DBA.ANYW_Scheduling_GetLocationDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("691", ex.Message + "ANYW_Scheduling_GetLocationDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "691: error ANYW_Scheduling_GetMainLocationDropdown";
            }
        }

        public string getLocationDropdownForSchedulingNew(string token, char showOpenShifts)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMainLocationDropdownForScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(showOpenShifts.ToString());
            string text = "CALL DBA.ANYW_Scheduling_GetLocationDropdownNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("691", ex.Message + "ANYW_Scheduling_GetLocationDropdownNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "691: error ANYW_Scheduling_GetMainLocationDropdownNew";
            }
        }

        public string publishShift(string token, string locationId, string employeeId, string fromDate, string toDate, string notifyEmployee, string publish)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMainLocationDropdownForScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(employeeId);
            list.Add(fromDate);
            list.Add(toDate);
            list.Add(notifyEmployee);
            list.Add(publish);
            string text = "CALL DBA.ANYW_Scheduling_PublishShift(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("691", ex.Message + "ANYW_Scheduling_PublishShift(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "691: error ANYW_Scheduling_PublishShift";
            }
        }

        public string saveOrUpdateShift(string token, string dateString, string locationId, string personId, string startTime, string endTime, string color, string notifyEmployee, string consumerIdString, string saveUpdateFlag)
        {
            //if (tokenValidator(token) == false) return null;
            logger.debug("saveOrUpdateShift ");

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(dateString);
            list.Add(locationId);
            list.Add(personId);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(color);
            list.Add(notifyEmployee);
            list.Add(consumerIdString);
            list.Add(saveUpdateFlag);

            string text = "CALL DBA.ANYW_Scheduling_InsertOrUpdateShift(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";

            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("692", ex.Message + "ANYW_Scheduling_InsertOrUpdateShift(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "692: error ANYW_Scheduling_InsertOrUpdateShift";
            }
        }


        public string saveSchedulingCallOffRequest(string token, string shiftId, string personId, string reasonId, string note, string status, string notifiedEmployeeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveSchedulingCallOffRequest ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(shiftId);
            list.Add(personId);
            list.Add(reasonId);
            list.Add(note);
            list.Add(status);
            list.Add(notifiedEmployeeId);
            string text = "CALL DBA.ANYW_Scheduling_SaveSchedulingCallOffRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("692", ex.Message + "ANYW_Scheduling_SaveSchedulingCallOffRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "692: error ANYW_Scheduling_SaveSchedulingCallOffRequest";
            }
        }

        public string getCallOffDropdownReasons(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCallOffDropdownReasons ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Scheduling_GetCallOffDropdownReasons(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("693", ex.Message + "ANYW_Scheduling_GetCallOffDropdownReasons(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "693: error ANYW_Scheduling_GetCallOffDropdownReasons";
            }
        }

        public string getCallOffDropdownEmployees(string token, string shiftDate, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCallOffDropdownEmployees ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(shiftDate);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Scheduling_GetCallOffDropdownEmployees(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("694", ex.Message + "ANYW_Scheduling_GetCallOffDropdownEmployees(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "694: error ANYW_Scheduling_GetCallOffDropdownEmployees";
            }
        }

        public string getRequestTimeOffDropdownEmployees(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCallOffDropdownEmployees ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Scheduling_GetRequestTimeOffDropdownEmployees(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("694.5", ex.Message + "ANYW_Scheduling_GetRequestTimeOffDropdownEmployees(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "694.5: error ANYW_Scheduling_GetRequestTimeOffDropdownEmployees";
            }
        }

        public string getScheduleApptInformation(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getScheduleApptInformation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Scheduling_GetAppointmentInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("695", ex.Message + "ANYW_Scheduling_GetAppointmentInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "695: error ANYW_Scheduling_GetAppointmentInformation";
            }
        }

        public string saveOrUpdateAppointment(string token, string medTrackingId, string consumerName, string typeDescription, string dateScheduled, string timeScheduled, string provider, string reason, string notes, string takenToApptBy, string publishDate, string locationId, string locationName, string personId, string color)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveOrUpdateAppointment ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(medTrackingId);
            list.Add(consumerName);
            list.Add(typeDescription);
            list.Add(dateScheduled);
            list.Add(timeScheduled);
            list.Add(provider);
            list.Add(reason);
            list.Add(notes);
            list.Add(takenToApptBy);
            list.Add(publishDate);
            list.Add(locationId);
            list.Add(locationName);
            list.Add(personId);
            list.Add(color);
            string text = "CALL DBA.ANYW_Scheduling_SaveOrUpdateAppointment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("695", ex.Message + "ANYW_Scheduling_SaveOrUpdateAppointment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "695: error ANYW_Scheduling_SaveOrUpdateAppointment";
            }
        }

        public string getScheduleApptInformationNew(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getScheduleApptInformation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Scheduling_GetAppointmentInformationNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("695", ex.Message + "ANYW_Scheduling_GetAppointmentInformationNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "695: error ANYW_Scheduling_GetAppointmentInformation";
            }
        }

        public string requestDaysOffScheduling(string token, string personId, string requestedDate, string fromTime, string toTime, string reasonId, string employeeNotifiedId, string status)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getScheduleApptInformation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(personId);
            list.Add(requestedDate);
            list.Add(fromTime);
            list.Add(toTime);
            list.Add(reasonId);
            list.Add(employeeNotifiedId);
            list.Add(status);
            string text = "CALL DBA.ANYW_Scheduling_RequestDaysOffScheduling(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("696", ex.Message + "ANYW_Scheduling_RequestDaysOffScheduling(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "696: error ANYW_Scheduling_RequestDaysOffScheduling";
            }
        }

        public string requestDaysOffSchedulingNotification(string token, string personId, string employeeNotifiedId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("requestDaysOffSchedulingNotification");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(personId); ;
            list.Add(employeeNotifiedId);
            string text = "CALL DBA.ANYW_Scheduling_RequestDaysOffSchedulingNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("696", ex.Message + "ANYW_Scheduling_RequestDaysOffSchedulingNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "696: error ANYW_Scheduling_RequestDaysOffSchedulingNotification";
            }
        }

        public string cancelRequestOpenShiftScheduling(string token, string requestShiftId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getScheduleApptInformation ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(requestShiftId);
            string text = "CALL DBA.ANYW_Scheduling_CancelRequestOpenShift(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("697", ex.Message + "ANYW_Scheduling_CancelRequestOpenShift(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "697: error ANYW_Scheduling_CancelRequestOpenShift";
            }
        }

        public string saveOpenShiftRequestScheduling(string token, string shiftId, string personId, string status, string notifiedEmployeeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveOpenShiftRequestScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(shiftId);
            list.Add(personId);
            list.Add(status);
            list.Add(notifiedEmployeeId);
            string text = "CALL DBA.ANYW_Scheduling_SaveOpenShiftRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("698", ex.Message + "ANYW_Scheduling_SaveOpenShiftRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "698: error ANYW_Scheduling_SaveOpenShiftRequest";
            }
        }

        public string getSelectedShiftData(string token, string shiftId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSelectedShiftData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(shiftId);
            string text = "CALL DBA.ANYW_Scheduling_getSelectedShiftData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("698", ex.Message + "ANYW_Scheduling_getSelectedShiftData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "698: error ANYW_Scheduling_getSelectedShiftData";
            }
        }

        public string getCurrentUserApprovedShifts(string token, string personId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCurrentUserApprovedShifts ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(personId);
            string text = "CALL DBA.ANYW_Scheduling_getCurrentUserApprovedShifts(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("698", ex.Message + "ANYW_Scheduling_getCurrentUserApprovedShifts(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "698: error ANYW_Scheduling_getCurrentUserApprovedShifts";
            }
        }

        //Single Entry Note And Signature
        public string singleEntrySaveSignatureAndNote(string token, string singleEntryId, string consumerId, string note, string signatureImage)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("singleEntrySaveSignatureAndNote ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(singleEntryId);
            list.Add(consumerId);
            list.Add(note);
            list.Add(signatureImage);
            string text = "CALL DBA.ANYW_SingleEntry_SaveSignatureAndNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("699", ex.Message + "ANYW_SingleEntry_SaveSignatureAndNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "699: error ANYW_SingleEntry_SaveSignatureAndNote";
            }
        }

        public string insertConsumerforSavedSingleEntry(string token, string singleEntryId, string consumerId, string deviceType, string evvReason)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertConsumerforSavedSingleEntry ");
            List<string> list = new List<string>();
            // list.Add(token);
            list.Add(singleEntryId);
            list.Add(consumerId);
            list.Add(deviceType);
            list.Add(evvReason);
            string text = "CALL DBA.ANYW_SingleEntry_SetConsumersPresent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("699", ex.Message + "ANYW_SingleEntry_SetConsumersPresent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "699: error ANYW_SingleEntry_SaveSignatureAndNote";
            }
        }


        public string getSpecificConsumerSignatureAndNote(string token, string singleEntryId, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMainLocationDropdownForScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(singleEntryId);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_SingleEntry_GetSpecificConsumerSignatureAndNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("700", ex.Message + "ANYW_SingleEntry_GetSpecificConsumerSignatureAndNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "700: error ANYW_SingleEntry_SaveSignatureAndNote";
            }
        }

        public string approveDenyOpenShiftRequestScheduling(string token, string requestedShiftId, string decision)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("approveDenyOpenShiftRequestScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(requestedShiftId);
            list.Add(decision);
            string text = "CALL DBA.ANYW_Scheduling_ApproveDenyOpenShiftRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("701", ex.Message + "ANYW_Scheduling_ApproveDenyOpenShiftRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "701: error ANYW_Scheduling_ApproveDenyOpenShiftRequest";
            }
        }

        public string approveDenyCallOffRequestScheduling(string token, string callOffShiftId, string decision)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("approveDenyOpenShiftRequestScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(callOffShiftId);
            list.Add(decision);
            string text = "CALL DBA.ANYW_Scheduling_ApproveDenyCallOffRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("702", ex.Message + "ANYW_Scheduling_ApproveDenyCallOffRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "702: error ANYW_Scheduling_ApproveDenyCallOffRequest";
            }
        }

        public string approveDenyDaysOffRequestScheduling(string token, string dayOffId, string decision)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("approveDenyOpenShiftRequestScheduling ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(dayOffId);
            list.Add(decision);
            string text = "CALL DBA.ANYW_Scheduling_ApproveDenyDaysOffRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("703", ex.Message + "ANYW_Scheduling_ApproveDenyDaysOffRequest(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return ex.Message;
            }
        }

        public string RequestDaysOffOverlapCheck(string token, string personId, string date, string startTime, string endTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ApproveDenyDaysOffOverlapCheck ");
            List<string> list = new List<string>();
            list.Add(personId);
            list.Add(date);
            list.Add(startTime);
            list.Add(endTime);
            string text = "CALL DBA.ANYW_Scheduling_RequestDaysOffOverlapCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("703", ex.Message + "ANYW_Scheduling_RequestDaysOffRequestOverlapCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return ex.Message;
            }
        }

        public string approveDenyDaysOffOverlapCheck(string token, string daysOffId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("ApproveDenyDaysOffOverlapCheck ");
            List<string> list = new List<string>();
            list.Add(daysOffId);
            string text = "CALL DBA.ANYW_Scheduling_ApproveDenyDaysOffOverlapCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("703", ex.Message + "ANYW_Scheduling_RequestDaysOffRequestOverlapCheck(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return ex.Message;
            }
        }

        public string approveDenyDaysOffRequestSchedulingNotification(string token, string dayOffId, string decision, string dateTimes)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("approveDenyDaysOffRequestSchedulingNotification ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(dayOffId);
            list.Add(decision);
            list.Add(dateTimes);
            string text = "CALL DBA.ANYW_Scheduling_ApproveDenyDaysOffRequestNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("703", ex.Message + "ANYW_Scheduling_ApproveDenyDaysOffRequestNotification(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "703: error ANYW_Scheduling_ApproveDenyDaysOffRequestNotification";
            }
        }

        public string getScheduleMyApprovalData(string token, string personId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getScheduleMyApprovalData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(personId);
            string text = "CALL DBA.ANYW_Scheduling_GetMyApprovals(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("704", ex.Message + "ANYW_Scheduling_GetMyApprovals(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "704: error ANYW_Scheduling_GetMyApprovals";
            }
        }

        public string getAllEmployees(string userid)
        {
            logger.debug("getScheduleMyApprovalData ");
            List<string> list = new List<string>();
            list.Add(userid);
            string text = "CALL DBA.ANYW_Scheduling_AllEmployeesByVendor(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("704", ex.Message + "ANYW_Scheduling_AllEmployeesByVendor(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "704: error ANYW_Scheduling_AllEmployeesByVendor";
            }
        }

        public string getConsumersSignaturesAndNotes(string token, string singleEntryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumersSignaturesAndNotes ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(singleEntryId);
            string text = "CALL DBA.ANYW_SingleEntry_GetConsumersSignaturesAndNotes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("705", ex.Message + "ANYW_SingleEntry_GetConsumersSignaturesAndNotes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "705: error ANYW_SingleEntry_GetConsumersSignaturesAndNotes";
            }
        }

        public string getObjectivesNew(string goalId, string goalDate)
        {
            logger.debug("getObjectivesNew ");
            List<string> list = new List<string>();
            list.Add(goalId);
            list.Add(goalDate);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetObjectivesNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("707", ex.Message + "ANYW_GoalsAndServices_GetObjectivesNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "707: error ANYW_GoalsAndServices_GetObjectivesNew";
            }
        }

        public string addReviewNote(string token, string objectiveActivityId, string consumerId, string employeeId, string objectiveActivityDate, string note, string result, string notifyEmployee)
        {
            logger.debug("getObjectivesNew ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(objectiveActivityId);
            list.Add(consumerId);
            list.Add(employeeId);
            list.Add(objectiveActivityDate);
            list.Add(note);
            list.Add(result);
            list.Add(notifyEmployee);
            string text = "CALL DBA.ANYW_GoalsAndServices_AddReviewNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("707", ex.Message + "ANYW_GoalsAndServices_AddReviewNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "707: error ANYW_GoalsAndServices_AddReviewNote";
            }
        }

        public string getObjectiveActivitiesNew(string ObjectiveId, string ObjectiveDate, string Objective_Recurrance)
        {
            logger.debug("getObjectivesNew ");
            List<string> list = new List<string>();
            list.Add(ObjectiveId);
            list.Add(ObjectiveDate);
            list.Add(Objective_Recurrance);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetObjectiveActivityNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("708", ex.Message + "ANYW_GoalsAndServices_GetObjectiveActivityNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "708: error ANYW_GoalsAndServices_GetObjectiveActivityNew";
            }
        }
        public string getObjectiveLastActivityData(string ObjectiveId)
        {
            logger.debug("getObjectivesNew ");
            List<string> list = new List<string>();
            list.Add(ObjectiveId);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetLastActivityDataNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("709", ex.Message + "ANYW_GoalsAndServices_GetLastActivityDataNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "709: error ANYW_GoalsAndServices_GetLastActivityDataNew";
            }
        }
        public string getSuccessTypeNew(string ObjectiveId)
        {
            logger.debug("getObjectivesNew ");
            List<string> list = new List<string>();
            list.Add(ObjectiveId);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetSuccessTypeNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("710", ex.Message + "ANYW_GoalsAndServices_GetSuccessTypeNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "710: error ANYW_GoalsAndServices_GetSuccessTypeNew";
            }
        }

        public string getDayServiceGetEnabledConsumers(string serviceDate, string locationId)
        {
            logger.debug("getDayServiceGetEnabledConsumers ");
            List<string> list = new List<string>();
            list.Add(serviceDate);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_DayService_GetEnabledConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("711", ex.Message + "ANYW_DayService_GetEnabledConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "711: error ANYW_DayService_GetEnabledConsumers";
            }
        }

        public string getDayServiceGroups(string token, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDayServiceGroups ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_DayService_GetGroup(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("711-2", ex.Message + "ANYW_DayService_GetGroup(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "711-2: error ANYW_DayService_GetGroup";
            }
        }

        public string getDSIsLocationBatched(string token, string locationId, string serviceDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getScheduleMyApprovalData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(serviceDate);
            string text = "CALL DBA.ANYW_DayService_IsLocationBatchedNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("712", ex.Message + "ANYW_DayService_IsLocationBatchedNew(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "712: error ANYW_DayService_IsLocationBatchedNew";
            }
        }

        public string getLocationsAndResidencesJSON(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocationsAndResidencesJSON ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_SingleEntry_GetLocationsAndResidences(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("713", ex.Message + "ANYW_SingleEntry_GetLocationsAndResidences(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "713: error ANYW_SingleEntry_GetLocationsAndResidences";
            }
        }

        public string getSuccessSymbolLookup(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocations");
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Outcomes_SuccessSymbolLookup('" + token + "');", "locations", "location");
            }
            catch (Exception ex)
            {
                logger.error("714", ex.Message + ex.InnerException.ToString() + " ANYW_Outcomes_SuccessSymbolLookup('" + token + "')", token);
                return "714: Error getting Locations";
            }
        }

        public string getCustomPhrases(string token, string showAll)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(showAll) == false) return null;
            logger.debug("getCustomPhrases ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(showAll);
            string text = "CALL DBA.ANYW_CaseNotes_GetCustomPhrases(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("715", ex.Message + "ANYW_CaseNotes_GetCustomPhrases(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "715: error ANYW_CaseNotes_InsertCustomPhrases";
            }
        }

        public string insertCustomPhrase(string token, string shortcut, string phrase, string makePublic, string phraseId)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(shortcut) == false) return null;
            if (stringInjectionValidator(phrase) == false) return null;
            logger.debug("insertCustomPhrase" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_InsertCustomPhrases('" + token + "', '" + shortcut + "', '" + phrase + "', '" + makePublic + "', '" + phraseId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("716", ex.Message + " ANYW_CaseNotes_InsertCustomPhrases('" + token + "', '" + shortcut + "', '" + phrase + "', '" + makePublic + "', '" + phraseId + "')");
                return "716: Error insertCustomPhrase";
            }
        }

        public string deleteCustomPhrase(string token, string phraseId)
        {
            if (tokenValidator(token) == false) return null;
           
            logger.debug("deleteCustomPhrase" + token);
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_CaseNotes_DeleteCustomPhrase('" + token + "', '" + phraseId + "');", "results", "results");
            }
            catch (Exception ex)
            {
                logger.error("716", ex.Message + " ANYW_CaseNotes_DeleteCustomPhrase('" + token + "', '" + phraseId + "')");
                return "716: Error deleteCustomPhrase";
            }
        }


        //Case note filter 
        public string getConsumersForCNFilter(string token, string caseLoadOnly)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerInterventions ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(caseLoadOnly);
            string text = "CALL DBA.ANYW_CaseNotes_GetConsumersForFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("716.1", ex.Message + "ANYW_CaseNotes_GetConsumersForFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "716.1: error ANYW_CaseNotes_GetConsumersForFilter";
            }
        }

        public string getlocationsWithConsumersWithUnreadNotes(string token, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(daysBackDate) == false) return null;
            logger.debug("getCustomPhrases" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_ConsumerNotes_LocationsWithConsumersWithUnreadNotes('" + token + "', '" + daysBackDate + "')");
            }
            catch (Exception ex)
            {
                logger.error("717", ex.Message + " ANYW_ConsumerNotes_LocationsWithConsumersWithUnreadNotes('" + token + "', '" + daysBackDate + "')");
                return "717: Error insertCustomPhrase";
            }
        }

        public string getInterventionTypesDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCustomPhrases" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetInterventionTypesDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("718", ex.Message + " ANYW_IncidentTracking_GetInterventionTypesDropdown('" + token + "')");
                return "718: Error insertCustomPhrase";
            }
        }

        public string getReviewedByDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getReviewedByDropdown" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetReviewedByDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("719", ex.Message + " ANYW_IncidentTracking_GetReviewedByDropdown('" + token + "')");
                return "719: getReviewedByDropdown";
            }
        }

        public string getInjuryLocationsDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getInjuryLocationsDropdown" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetInjuryLocationsDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("720", ex.Message + " ANYW_IncidentTracking_GetInjuryLocationsDropdown('" + token + "')");
                return "720: getReviewedByDropdown";
            }
        }

        public string getInjuryTypesDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getInjuryTypesDropdown" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetInjuryTypesDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("721", ex.Message + " ANYW_IncidentTracking_GetInjuryTypesDropdown('" + token + "')");
                return "721: getInjuryTypesDropdown";
            }
        }

        public string selectNotesByLocationAndPermission(string token, string locationId, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(daysBackDate) == false) return null;
            logger.debug("selectNotesByLocationAndPermission" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(locationId);
            list.Add(daysBackDate);

            string text = "CALL DBA.ANYW_LocationNotes_SelectNotesByLocationAndPermission(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("722", ex.Message + "ANYW_LocationNotes_SelectNotesByLocationAndPermission('" + token + "', '" + locationId + "')");
                return "722: error selectNotesByLocationAndPermission";
            }
        }

        public string getLocationsWithUnreadNotesAndPermission(string token, string daysBackDate)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(daysBackDate) == false) return null;
            logger.debug("getLocationsWithUnreadNotesAndPermission" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_LocationNotes_LocationsWithUnreadNotesAndPermission('" + token + "', '" + daysBackDate + "');");
            }
            catch (Exception ex)
            {
                logger.error("723", ex.Message + "ANYW_LocationNotes_LocationsWithUnreadNotesAndPermission('" + token + "', " + daysBackDate + ")");
                return "723: error getting locations with unread notes";
            }
        }

        public string getitConsumerInterventions(string token, string consumerID, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerInterventions ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerID);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerInterventions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("724", ex.Message + "ANYW_IncidentTracking_GetConsumerInterventions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "724: error ANYW_IncidentTracking_GetConsumerInterventions";
            }
        }

        public string getitConsumerInjuries(string token, string consumerID, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerInjuries ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerID);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerInjuries(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("725", ex.Message + "ANYW_IncidentTracking_GetConsumerInjuries(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "725: error ANYW_IncidentTracking_GetConsumerInjuries";
            }
        }

        public string getitConsumerReviews(string token, string consumerID, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerID);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("726", ex.Message + "ANYW_IncidentTracking_GetConsumerReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "726: error ANYW_IncidentTracking_GetConsumerReviews";
            }
        }

        public string getitConsumerFollowUps(string token, string consumerID, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerFollowUps ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerID);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerFollowUps(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("727", ex.Message + "ANYW_IncidentTracking_GetConsumerFollowUps(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "727: error ANYW_IncidentTracking_GetConsumerFollowUps";
            }
        }

        public string getitConsumerBehaviors(string token, string consumerID, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerBehaviors ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerID);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerBehaviors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("727", ex.Message + "ANYW_IncidentTracking_GetConsumerBehaviors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "727: error ANYW_IncidentTracking_GetConsumerBehaviors";
            }
        }

        public string getitConsumerReporting(string token, string consumerID, string incidentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerReporting ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerID);
            list.Add(incidentId);
            string text = "CALL DBA.ANYW_IncidentTracking_GetConsumerReporting(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("728", ex.Message + "ANYW_IncidentTracking_GetConsumerReporting(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "728: error ANYW_IncidentTracking_GetConsumerReporting";
            }
        }

        public string getitConsumerFollowUpTypes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerFollowUpTypes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetFollowUpTypesDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("729", ex.Message + " ANYW_IncidentTracking_GetFollowUpTypesDropdown('" + token + "')");
                return "729: getitConsumerFollowUpTypes";
            }
        }

        public string getitConsumerBehaviorTypes(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitConsumerBehaviorTypes" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetBehaviorTypesDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("729", ex.Message + " ANYW_IncidentTracking_GetBehaviorTypesDropdown('" + token + "')");
                return "729: getitConsumerBehaviorTypes";
            }
        }

        public string getitReportingCategories(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getitReportingCategories" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_IncidentTracking_GetReportingCategoriesDropdown('" + token + "')");
            }
            catch (Exception ex)
            {
                logger.error("730", ex.Message + "ANYW_IncidentTracking_GetReportingCategoriesDropdown('" + token + "')");
                return "730: getitReportingCategories";
            }
        }

        //Incident Tracking Consumer Follow Up Alter Specific Calls
        public string itDeleteConsumerFollowUp(string token, string itConsumerFollowUpId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerFollowUp ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerFollowUpId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteConsumerFollowUp(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("729", ex.Message + "ANYW_IncidentTracking_DeleteConsumerFollowUp(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "729: error ANYW_IncidentTracking_DeleteConsumerFollowUp";
            }
        }

        public string saveUpdateITConsumerFollowUp(string token, string consumerFollowUpId, string consumerInvolvedId, string followUpTypeId, string personResponsible,
                                                     string dueDate, string completedDate, string notes)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITConsumerFollowUp ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerFollowUpId);
            list.Add(consumerInvolvedId);
            list.Add(followUpTypeId);
            list.Add(personResponsible);
            list.Add(dueDate);
            list.Add(completedDate);
            list.Add(notes);
            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumerFollowUp(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("730", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumerFollowUp(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "730: error ANYW_IncidentTracking_SaveUpdateITConsumerFollowUp";
            }
        }

        //Incident Tracking Consumer Behavior Alter Specific Calls
        public string itDeleteConsumerBehavior(string token, string itConsumerBehaviorId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerBehavior ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerBehaviorId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteConsumerBehavior(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("729", ex.Message + "ANYW_IncidentTracking_DeleteConsumerBehavior(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "729: error ANYW_IncidentTracking_DeleteConsumerBehavior";
            }
        }

        public string saveUpdateITConsumerBehavior(string token, string consumerBehaviorId, string consumerInvolvedId, string behaviorTypeId, string startTime,
                                                     string endTime, string occurrences)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITConsumerBehavior");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerBehaviorId);
            list.Add(consumerInvolvedId);
            list.Add(behaviorTypeId);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(occurrences);
            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumerBehavior(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("730", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumerBehavior(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "730: error ANYW_IncidentTracking_SaveUpdateITConsumerBehavior";
            }
        }

        //Incident Tracking Consumer Reporting Alter Specific Calls
        public string itDeleteConsumerReporting(string token, string itConsumerReportingId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerFollowUp ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerReportingId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteConsumerReporting(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("731", ex.Message + "ANYW_IncidentTracking_DeleteConsumerReporting(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "731: error ANYW_IncidentTracking_DeleteConsumerReporting";
            }
        }

        public string saveUpdateITConsumerReporting(string token, string consumerReportId, string consumerInvolvedId, string reportDate, string reportTime,
                                                            string reportingCategoryId, string reportTo, string reportBy,
                                                            string reportMethod, string note)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITConsumerReporting ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerReportId);
            list.Add(consumerInvolvedId);
            list.Add(reportDate);
            list.Add(reportTime);
            list.Add(reportingCategoryId);
            list.Add(reportTo);
            list.Add(reportBy);
            list.Add(reportMethod);
            list.Add(note);
            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumerReporting(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("732", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumerReporting(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "732: error ANYW_IncidentTracking_SaveUpdateITConsumerReporting";
            }
        }

        //Incident Tracking Consumer Reviews Alter Specific Calls
        public string itDeleteConsumerReviews(string token, string itConsumerReviewId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerReviewId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteConsumerReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("733", ex.Message + "ANYW_IncidentTracking_DeleteConsumerReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "733: error ANYW_IncidentTracking_DeleteConsumerReviews";
            }
        }

        public string saveUpdateITConsumerReviews(string token, string itConsumerReviewId, string consumerInvolvedId, string reviewedBy, string reviewedDate, string note)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITConsumerReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerReviewId);
            list.Add(consumerInvolvedId);
            list.Add(reviewedBy);
            list.Add(reviewedDate);
            list.Add(note);
            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumerReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumerReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "734: error ANYW_IncidentTracking_SaveUpdateITConsumerReviews";
            }
        }

        //Incident Tracking Consumer Injuries Alter Specific Calls
        public string itDeleteConsumerInjuries(string token, string itConsumerInjuryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerInjuries ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerInjuryId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteConsumerInjuries(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("735", ex.Message + "ANYW_IncidentTracking_DeleteConsumerInjuries(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "735: error ANYW_IncidentTracking_DeleteConsumerInjuries";
            }
        }

        //Incident Tracking Consumer Interventions Alter Specific Calls
        public string itDeleteConsumerInterventions(string token, string itConsumerInterventionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("itDeleteConsumerInterventions ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(itConsumerInterventionId);
            string text = "CALL DBA.ANYW_IncidentTracking_DeleteConsumerInterventions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("736", ex.Message + "ANYW_IncidentTracking_DeleteConsumerInterventions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "736: error ANYW_IncidentTracking_DeleteConsumerInterventions";
            }
        }

        public string saveUpdateITConsumerInterventions(string token, string aversive, string itConsumerInterventionId, string consumerInvolvedId, string itConsumerInterventionTypeId,
                                                        string notes, string startTime, string stopTime, string timeLength)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITConsumerInterventions ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(aversive);
            list.Add(itConsumerInterventionId);
            list.Add(consumerInvolvedId);
            list.Add(itConsumerInterventionTypeId);
            list.Add(notes);
            list.Add(startTime);
            list.Add(stopTime);
            list.Add(timeLength);
            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumerInterventions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("737", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumerInterventions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "737: error ANYW_IncidentTracking_SaveUpdateITConsumerInterventions";
            }
        }

        public string saveUpdateITConsumerInjuries(string token, string checkedByNurse, string checkedDate, string details, string itConsumerInjuryId,
                                                            string consumerInvolvedId, string itInjuryLocationId, string itInjuryTypeId, string treatment,
                                                            string causeOfInjuryId, string riskOfInjuryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("saveUpdateITConsumerInterventions ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(checkedByNurse);
            list.Add(checkedDate);
            list.Add(details);
            list.Add(itConsumerInjuryId);
            list.Add(consumerInvolvedId);
            list.Add(itInjuryLocationId);
            list.Add(itInjuryTypeId);
            list.Add(treatment);
            list.Add(causeOfInjuryId);
            list.Add(riskOfInjuryId);
            string text = "CALL DBA.ANYW_IncidentTracking_SaveUpdateITConsumerInjuries(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("738", ex.Message + "ANYW_IncidentTracking_SaveUpdateITConsumerInjuries(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "738: error ANYW_IncidentTracking_SaveUpdateITConsumerInjuries";
            }
        }

        // NEW - Incident Tracking Update Incident View By User
        public string updateIncidentViewByUser(string token, string incidentId, string userId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateIncidentViewByUser ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(incidentId);
            list.Add(userId);
            string text = "CALL DBA.ANYW_IncidentTracking_UpdateIncidentViewByUser(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_IncidentTracking_UpdateIncidentViewByUser");
                return "734: error ANYW_IncidentTracking_UpdateIncidentViewByUser";
            }
        }

        public string getConsumerPlanYearInfo(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerPlanYearInfo ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_ISP_GetConsumerPlanYearInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("739", ex.Message + "ANYW_ISP_GetConsumerPlanYearInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "739: error ANYW_ISP_GetConsumerPlanYearInfo";
            }
        }

        public string getDashboardCaseNoteProductivity(string token, string daysBack)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDashboardCaseNoteProductivity ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(daysBack);
            string text = "CALL DBA.ANYW_Dashboard_CaseNoteProductivityWidget(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("740", ex.Message + "ANYW_Dashboard_CaseNoteProductivityWidget(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "740: error ANYW_Dashboard_CaseNoteProductivityWidget";
            }
        }

        public string getDashboardCaseNotesRejected(string token, string daysBack, string isCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDashboardCaseNotesRejected ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(daysBack);
            list.Add(isCaseLoad);
            string text = "CALL DBA.ANYW_Dashboard_GetRejectedCaseNotes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("740", ex.Message + "ANYW_Dashboard_GetRejectedCaseNotes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "740: error ANYW_Dashboard_GetRejectedCaseNotes";
            }
        }

        public string getDashboardGroupCaseNoteConsumerNames(string token, string groupNoteIds)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDashboardGroupCaseNoteConsumerNames ");
            List<string> list = new List<string>();
            list.Add(token);

            list.Add(groupNoteIds);
            string text = "CALL DBA.ANYW_Dashboard_GetGroupCaseNoteConsumerNames(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("740", ex.Message + "ANYW_Dashboard_GetGroupCaseNoteConsumerNames(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "740: error ANYW_Dashboard_GetGroupCaseNoteConsumerNames";
            }
        }
        public string getUserWidgetSettings(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getUserWidgetSettings ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Dashboard_GetUserWidgetSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("741", ex.Message + "ANYW_Dashboard_GetUserWidgetSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "741: error ANYW_Dashboard_GetUserWidgetSettings";
            }
        }

        public string updateUserWidgetSettings(string token, string widgetId, string showHide, string widgetConfig)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(widgetConfig) == false) return null;
            logger.debug("updateUserWidgetShowHide ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(widgetId);
            list.Add(showHide);
            list.Add(widgetConfig);
            string text = "CALL DBA.ANYW_Dashboard_UpdateUserWidgetSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("742", ex.Message + "ANYW_Dashboard_UpdateUserWidgetSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "742: error ANYW_Dashboard_UpdateUserWidgetSettings";
            }
        }

        public string getAssessmentReportPath(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAssessmentReportPath");

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_ISP_GetAssessmentReportPath('" + token + "');", "results", "result");
            }
            catch (Exception ex)
            {
                logger.error("743", ex.Message + " ANYW_ISP_GetAssessmentReportPath('" + token + "')", token);
                return "743: Error getting report path";
            }
        }

        public string checkLoginType()
        {
            logger.debug("checkLoginType ");
            List<string> list = new List<string>();
            string text = "CALL DBA.ANYW_Login_CheckLoginType(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("000", ex.Message + "ANYW_Login_CheckLoginType(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "000: error ANYW_Login_CheckLoginType";
            }
        }

        public MemoryStream GetTestData(string token)
        {
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Test_GetPDF(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {

                return executeSQLReturnMemoryStream(text);
            }
            catch (Exception ex)
            {
                logger.error("640", ex.Message + "ANYW_Test_GetPDF(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return null;
                //return "640: error ANYW_Roster_GetAttachmentData";
            }
        }

        public string updateUserWidgetOrderSettings(string token, string listName, string orderCount)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateUserWidgetShowHide ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(listName);
            list.Add(orderCount);
            string text = "CALL DBA.ANYW_Dashboard_updateUserWidgetOrderSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("742", ex.Message + "ANYW_Dashboard_updateUserWidgetOrderSettings(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "742: error ANYW_Dashboard_updateUserWidgetOrderSettings";
            }
        }


        public static bool IsDateValidFormat(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return false;
            }

            // Define a regex pattern that allows only numbers, slashes, and dashes
            string pattern = @"^[0-9/-]+$";

            // Create a Regex object with the pattern
            Regex regex = new Regex(pattern);

            // Check if the input matches the regex pattern
            return regex.IsMatch(input);
        }


        public string removeUnsavableNoteText(string note)
        {
            if (note == "" || note is null)
            {
                return note;
            }
            if (note.Contains("'"))
            {
                note = note.Replace("'", "''");
            }
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

        public bool tokenValidator(string token)
        {
            if (token.Contains(" ") || token.Contains("|") || token.Contains("'") || token.Contains("*"))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public bool consumerIdStringValidator(string consumerIdString)
        {
            var regex = new Regex(@"^[0 - 9,| ] *$");
            //var regex = @"^[0 - 9, ] *$";
            //RegexStringValidator regexStringValidator = new RegexStringValidator(regex);
            try
            {
                // regexStringValidator.Validate(consumerIdString);
                regex.Matches(consumerIdString);
                return true;
            }
            catch
            {
                return false;
            }
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

        public bool stringInjectionValidatorLogin(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            string singleQuote = "'";
            if (!string.IsNullOrWhiteSpace(uncheckedString) && (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(singleQuote) || uncheckedString.ToUpper().Contains(deleteFrom)))
            {
                return false;
            }
            else
            {
                return true;
            }

        }
        /// <summary>
        /// Overload executeDataBaseCall to in case default tage names are acceptable
        /// </summary>
        /// <param name="storedProdCall"></param>
        /// <returns></returns>

        private string executeDataBaseCall(string storedProdCall)
        {
            return executeDataBaseCall(storedProdCall, "results", "result");
        }

        /// <summary>
        /// Calls the Database to get Data. It takes a collection tag and a data row Tag
        /// Out put will be formatted like:
        /// <collectionTag>
        ///     <dataRowTag>
        ///         <columnName>Data</columnName> <- rows from the dataBase
        ///     </dataRowTag>
        /// </collectionTag>
        /// 
        /// This allow not addional serialization to take place when sending data back the GUI. 
        /// </summary>
        /// <param name="storedProdCall"></param>
        /// <param name="collectionTag"></param>
        /// <param name="dataRowTag"></param>
        /// <returns></returns>
        public string executeDataBaseCall(string storedProdCall, string collectionTag, string dataRowTag)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "<" + collectionTag + ">";

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    result = result + "<" + dataRowTag + ">";

                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {
                        result = result + "<" + rdr.GetName(ordinal) + ">" + rdr.GetValue(ordinal) + "</" + rdr.GetName(ordinal) + ">";
                    }
                    result = result + "</" + dataRowTag + ">";
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

            return result + "</" + collectionTag + ">";

        }

        public string executeDataBaseCallJSON(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "[";

            List<string> arr = new List<string>();

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }

                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    Dictionary<string, string> holder = new Dictionary<string, string>();
                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {

                        var val = rdr.GetValue(ordinal);
                        string str = val.ToString();
                        holder[rdr.GetName(ordinal)] = str;
                    }
                    arr.Add((new JavaScriptSerializer()).Serialize(holder));
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

            return result + String.Join(",", arr) + "]";
        }

        private string executeDataBaseCallRaw(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            List<string> arr = new List<string>();

            try
            {
                if (connectString.IndexOf("UID=") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    Dictionary<string, string> holder = new Dictionary<string, string>();
                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {
                        var val = rdr.GetValue(ordinal);
                        var fake = val.GetType();
                        string str = val.ToString();
                        if (fake.IsArray)
                        {
                            byte[] temp = (byte[])rdr.GetValue(ordinal);
                            str = System.Text.Encoding.UTF32.GetString(temp);
                        }
                        arr.Add(str);
                    }
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

            return String.Join(",", arr);
        }

        private byte[] executeDataBaseCallByteArray(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            byte[] results = null;

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    Dictionary<string, string> holder = new Dictionary<string, string>();
                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {
                        results = (byte[])rdr.GetValue(ordinal);
                    }
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }
            return results;
            //return result + String.Join(",", arr) + "]";
            //return String.Join(",", arr);
        }


        public void executeSQLFromScript(string script)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(script);
                cmd.CommandType = CommandType.Text;
                cmd.Connection = conn;

                conn.Open();
                cmd.ExecuteNonQuery();

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

        }

        public MemoryStream executeSQLReturnMemoryStream(string storedProdCall)
        {
            logger.debug("Attachment start");
            MemoryStream memorystream = new MemoryStream();
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.Text;
                cmd.Connection = conn;

                conn.Open();
                logger.debug("Attachment connection open");
                var result = cmd.ExecuteReader();
                logger.debug("Attachment ExecuteReader done; entering result");
                if (result != null)
                {
                    logger.debug("Attachment result not null");
                    result.Read();
                    logger.debug("Attachment result.read done");
                    byte[] fileData = (byte[])result[0];
                    logger.debug("Attachment byte array made");
                    memorystream.Write(fileData, 0, fileData.Length);
                    logger.debug("Attachment data sent to memorystream");
                    //int bufferSize = 1000;
                    //byte[] outByte = new Byte[bufferSize];
                    //long retval;
                    //long startIndex = 0;

                    //// Reset the starting byte for the new BLOB.  
                    //startIndex = 0;

                    //// Read bytes into outByte[] and retain the number of bytes returned.  
                    //retval = result.GetBytes(1, startIndex, outByte, 0, bufferSize);
                    //while (retval == bufferSize)
                    //{
                    //    memorystream.Write(outByte);

                    //}

                    /*
                    logger.debug("Attachment result.Read done");
                    var fileLength = result.GetBytes(0, 0, null, 0, int.MaxValue);
                    logger.debug("Attachment quick test");
                    var blob = new Byte[fileLength];
                    logger.debug("Attachment new Blob");
                    result.GetBytes(0, 0, blob, 0, blob.Length);
                    logger.debug("Attachment get Bytes");
                    memorystream.Write(blob, 0, blob.Length);
                    logger.debug("Attachment memory stream write");
                    */
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }
            logger.debug("Attachment done");
            return memorystream;
        }

        public string resetPassword(string userId, string hash, string newPassword, string changingToHashPassword)
        {
            logger.trace("101", "resetPassword:" + userId);

            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_ResetPassword('" + userId + "','" + hash + "','" + newPassword + "','" + changingToHashPassword + "');", "results", "permissions");
            }
            catch (Exception ex)
            {
                logger.error("515", ex.Message + " ANYW_ResetPassword('" + userId + "','" + hash + "')");
                return "515: " + ex.Message;
            }
        }

        public string updateReviewNote(string token, string objectiveActivityId, string reviewNote, string notifyEmployee, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getOutcomeTypeDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(objectiveActivityId);
            list.Add(reviewNote);
            list.Add(notifyEmployee);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_GoalsAndServices_UpdateReviewNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_UpdateReviewNote(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_UpdateReviewNote";
            }
        }

        public string getOutcomesReviewGrid(string token, string consumerId, string objectiveDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getOutcomeTypeDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(objectiveDate);
            string text = "CALL DBA.ANYW_GoalsAndServices__GetReviewPageGrid(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices__GetReviewPageGrid(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices__GetReviewPageGrid";
            }
        }

        public string getOutcomesReviewGridSecondary(string token, string consumerId, string startDate, string endDate, string objectiveIdList, string frequency)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getOutcomeTypeDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(objectiveIdList);
            list.Add(frequency);
            string text = "CALL DBA.ANYW_GoalsAndServices__GetReviewPageGridSecondary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices__GetReviewPageGridSecondary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices__GetReviewPageGridSecondary";
            }
        }
        
        public string getExclclamationIds( string startDate, string endDate,string frequency)
        {
            
            List<string> list = new List<string>();
            list.Add(startDate);
            list.Add(endDate);
            list.Add(frequency);
            string text = "CALL DBA.ANYW_GoalsAndServices_GetReviewPageRedExclamationIds(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_GetReviewPageRedExclamationIds(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_GetReviewPageRedExclamationIds";
            }
        }
        public string getOutcomeTypeDropDown(string token, string consumerId, string effectiveDateStart)
        {
            if (tokenValidator(token) == false) return null;
            //if (IsDateValidFormat(effectiveDateStart) == false) return null;
            logger.debug("getOutcomeTypeDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            //list.Add(effectiveDateStart);
            string text = "CALL DBA.ANYW_GoalsAndServices_getOutcomeTypeDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_getOutcomeTypeDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_getOutcomeTypeDropDown";
            }
        }

        public string getLocationDropDown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getLocationDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GoalsAndServices_getLocationDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_getLocationDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_getLocationDropDown";
            }
        }

        public string getGoalEntriesById(string token, string goalId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getGoalEntriesById");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(goalId);
            string text = "CALL DBA.ANYW_GoalsAndServices_getGoalEntriesById(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_GoalsAndServices_getGoalEntriesById");
                return "734: error ANYW_GoalsAndServices_getGoalEntriesById";
            }
        }

        public string getObjectiveEntriesById(string token, string objectiveId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getObjectiveEntriesById");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(objectiveId);
            string text = "CALL DBA.ANYW_GoalsAndServices_getObjectiveEntriesById(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_GoalsAndServices_getObjectiveEntriesById");
                return "734: error ANYW_GoalsAndServices_getObjectiveEntriesById";
            }
        }

        public string getOutcomeServiceDropDown(string token, string consumerId, string effectiveDateStart)
        {
            if (tokenValidator(token) == false) return null;
            if (IsDateValidFormat(effectiveDateStart) == false) return null;
            logger.debug("getOutcomeServiceDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(effectiveDateStart);
            string text = "CALL DBA.ANYW_GoalsAndServices_getOutcomeServiceDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_getOutcomeServiceDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_getOutcomeServiceDropDown";
            }
        }

        public string getServiceFrequencyTypeDropDown(string token, string type)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceFrequencyTypeDropDown" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(type);
            string text = "CALL DBA.ANYW_GoalsAndServices_getServiceFrequencyTypeDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_getServiceFrequencyTypeDropDown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_getServiceFrequencyTypeDropDown";
            }
        }

        public string insertOutcomeInfo(string token, string startDate, string endDate, string outcomeType, string outcomeStatement, string userID, string goalId, string consumerId, string location)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertOutcomeInfo" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(outcomeType);
            list.Add(outcomeStatement);
            list.Add(userID);
            list.Add(goalId);
            list.Add(consumerId);
            list.Add(location);
            string text = "CALL DBA.ANYW_GoalsAndServices_insertOutcomeInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_insertOutcomeInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_insertOutcomeInfo";
            }
        }

        public string insertOutcomeServiceInfo(string token, string startDate, string endDate, string outcomeType, string servicesStatement, string ServiceType, string method, string success, string frequencyModifier, string frequency, string frequencyPeriod, string userID, string objectiveId, string consumerId, string location, string duration)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertOutcomeServiceInfo" + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(outcomeType);
            list.Add(servicesStatement);
            list.Add(ServiceType);
            list.Add(method);
            list.Add(success);
            list.Add(frequencyModifier);
            list.Add(frequency);
            list.Add(frequencyPeriod);
            list.Add(userID);
            list.Add(objectiveId);
            list.Add(consumerId);
            list.Add(location);
            list.Add(duration);
            string text = "CALL DBA.ANYW_GoalsAndServices_insertOutcomeServiceInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("636", ex.Message + "ANYW_GoalsAndServices_insertOutcomeServiceInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "636: error ANYW_GoalsAndServices_insertOutcomeServiceInfo";
            }
        }

        public string getExistingTimeEntry(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getExistingTimeEntry" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_SingleEntry_GetExistingTimeEntry('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("559", ex.Message + " ANYW_SingleEntry_GetExistingTimeEntry('" + token + "')");
                return "559: Error getting existing time entry";
            }

        }

        public string getRosterToDoListWidgetData(string responsiblePartyId, string token, string isCaseLoad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRosterToDoListWidgetData");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(responsiblePartyId);
            list.Add(isCaseLoad);
            string text = "CALL DBA.ANYW_Dashboard_RosterToDoListWidget(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("739", ex.Message + "ANYW_Dashboard_RosterToDoListWidget(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "739: error ANYW_Dashboard_RosterToDoListWidget";
            }
        }


        public string getEmployeeList(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getEmployeeList" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_getEmployeeList('" + token + "');");
            }
            catch (Exception ex)
            {
                logger.error("559", ex.Message + " ANYW_Dashboard_getEmployeeList('" + token + "')");
                return "559: Error getting existing time entry";
            }

        }

        public string insertSystemNotes(string token, string textMessage, string expiration)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertSystemNotes");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(textMessage);
            list.Add(expiration);
            string text = "CALL DBA.ANYW_Dashboard_insertSystemNotes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("742", ex.Message + "ANYW_Dashboard_insertSystemNotes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "742: error ANYW_Dashboard_insertSystemNotes";
            }
        }

        public string insertSystemNoteSharing(string token, string noteId, string employeeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertSystemNoteSharing" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_Dashboard_insertSystemNoteSharing('" + token + "', '" + noteId + "', '" + employeeId + "');");
            }
            catch (Exception ex)
            {
                logger.error("607", ex.Message + "ANYW_Dashboard_insertSystemNoteSharing('" + token + "', '" + noteId + "', '" + employeeId + "')");
                return "607: error inserting System Note Sharing";
            }
        }

        public string addOutcomePlan(string token, string userId, string consumerId, string attachmentType, string attachment, string startDate, string endDate)
        {
            logger.debug("AddOutcomePlan");
            List<string> list = new List<string>();

            string cleanAttachmentType = Regex.Replace(attachmentType, "[@,\\';\\\\]", "");

            list.Add(token);
            list.Add(userId);
            list.Add(consumerId);
            list.Add(attachment);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(cleanAttachmentType);

            string text = "CALL DBA.ANYW_GoalsAndServices_AddOutcomePlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("707", ex.Message + "ANYW_GoalsAndServices_AddOutcomePlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "707: error ANYW_GoalsAndServices_AddOutcomePlan";
            }
        }

        public string getPlanHistorybyConsumer(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanHistorybyConsumer");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_GoalsAndServices_getPlanHistorybyConsumer(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_GoalsAndServices_getPlanHistorybyConsumer");
                return "734: error ANYW_GoalsAndServices_getPlanHistorybyConsumer";
            }
        }

        public string getPlanbyConsumerHistory(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanbyConsumerHistory");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_GoalsAndServices_getPlanbyConsumerHistory(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_GoalsAndServices_getPlanbyConsumerHistory");
                return "734: error ANYW_GoalsAndServices_getPlanbyConsumerHistory";
            }
        }

        public string addOutcomePlanLater(string token, string consumerId)
        {
            logger.debug("AddOutcomePlanLater");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);

            string text = "CALL DBA.ANYW_GoalsAndServices_AddOutcomePlanLater(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("707", ex.Message + "ANYW_GoalsAndServices_AddOutcomePlanLater(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "707: error ANYW_GoalsAndServices_AddOutcomePlanLater";
            }
        }

        public string addOutcomePlanNow(string token, string consumerId)
        {
            logger.debug("AddOutcomePlanNow");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);

            string text = "CALL DBA.ANYW_GoalsAndServices_AddOutcomePlanNow(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("707", ex.Message + "ANYW_GoalsAndServices_AddOutcomePlanNow(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "707: error ANYW_GoalsAndServices_AddOutcomePlanNow";
            }
        }

        public string isNewBtnDisabledByPlanHistory(string token, string consumerId, string goalTypeID, string ObjectiveID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("isNewBtnDisabledByPlanHistory");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(goalTypeID);
            list.Add(ObjectiveID);
            string text = "CALL DBA.ANYW_GoalsAndServices_isNewBtnDisabledByPlanHistory(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_GoalsAndServices_isNewBtnDisabledByPlanHistory");
                return "734: error ANYW_GoalsAndServices_isNewBtnDisabledByPlanHistory";
            }
        }

        public string isViewPlabBtnDisabled(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("IsViewPlabBtnDisabled");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_GoalsAndServices_IsViewPlabBtnDisabled(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("734", ex.Message + "ANYW_GoalsAndServices_IsViewPlabBtnDisabled");
                return "734: error ANYW_GoalsAndServices_IsViewPlabBtnDisabled";
            }
        }

        public string getRelationshipData(string token, string supervisorId, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getRelationshipData ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(supervisorId);


            string text = "CALL DBA.ANYW_IncidentTracking_getRelationshipData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("677", ex.Message + "ANYW_IncidentTracking_getRelationshipData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "677: error ANYW_IncidentTracking_getRelationshipData";
            }
        }

        public void setWidgetFilter(string token, string widgetId, string filterKey, string filterValue)
        {
            logger.debug("setWidgetFilter");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(widgetId);
            list.Add(filterKey);
            list.Add(filterValue);
            string text = "CALL DBA.ANYW_Dashboard_setWidgetFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("742", ex.Message + "ANYW_Dashboard_setWidgetFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
            }
        }

        public string getWidgetFilter(string token, string widgetId, string filterKey)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getWidgetFilter");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(widgetId);
            list.Add(filterKey);

            string text = "CALL DBA.ANYW_Dashboard_getWidgetFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("742", ex.Message + "ANYW_Dashboard_getWidgetFilter(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "742: error ANYW_Dashboard_getWidgetFilter";
            }
        }
    }
}