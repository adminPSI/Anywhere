using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;
using System.Data.Common;
using System.Data.Odbc;
using log4net;
using log4net.Config;
using System.Configuration;

namespace Gargolye.Data
{
    public class DataGetter
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DataGetter));
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        /// <summary>
        /// get a list of locations
        /// </summary>
        /// <returns></returns>
        public string getLocations(string token)
        {
            logger.Debug("getLocations");
            return executeDataBaseCall("CALL DBA.ANYW_getLocations('" + token + "');", "locations", "location");
        }

        /// <summary>
        /// get a list of day service locations
        /// </summary>
        /// <returns></returns>
        public string getDayServiceLocations(string token, string serviceDate)
        {
            logger.Debug("getDayServiceLocations");
            return executeDataBaseCall("CALL DBA.ANYW_getDayServiceLocations('" + token + "','" + serviceDate + "');", "locations", "location");        
        }

        /// <summary>
        ///  Get a list of people
        /// </summary>
        /// <returns></returns>
        public string getConsumerGroups(string locationId, string token)
        {
            logger.Debug("GetCustomGroups");
            return executeDataBaseCall("CALL DBA.ANYW_Roster_GetConsumerGroups(" + locationId + ",'" + token + "');", "groups", "group");
        }

        /// <summary>
        /// Get a list of individuals based on a code and retrieval ID
        /// </summary>
        /// <param name="ListCode"></param>
        /// <param name="retrieveId"></param>
        /// <returns></returns> 
        public string getConsumersByGroup(string groupCode, string retrieveId, string token, string serviceDate)
        {
            logger.Debug("getConsumersByGroup");
            return executeDataBaseCall("CALL DBA.ANYW_Roster_GetConsumersByGroup('" + groupCode + "'," + retrieveId + ",'" + token + "','" + serviceDate + "');", "consumers", "consumer");
        }

        /// <summary>
        /// add a consumer to a group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="consumerId"></param>
        /// <returns></returns>
        public string addConsumerToGroup(string groupId, string consumerId)
        {
            logger.Debug("AddConsumerToGroup");
            return executeDataBaseCall("CALL DBA.ANYW_Roster_AddConsumerToGroup(" + groupId + "," + consumerId + ");", "results", "result");
        }

        /// <summary>
        /// remove consumer from a group
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="consumerId"></param>
        /// <returns></returns>
        public string removeConsumerFromGroup(string groupId, string consumerId)
        {
            logger.Debug("RemoveConsumerFromGroup");
            return executeDataBaseCall("CALL DBA.ANYW_Roster_RemoveConsumerFromGroup(" + groupId + "," + consumerId + ");", "results", "result");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="groupName"></param>
        /// <returns></returns>
        public string addCustomGroup(string groupName, string locationId, string token)
        {
            logger.Debug("AddCustomGroup");
            return executeDataBaseCall("CALL DBA.ANYW_Roster_AddCustomGroup('" + groupName + "','" + locationId + "','" + token + "');", "results", "groupId");
        }

        public string removeCustomGroup(string groupId)
        {
            logger.Debug("RemoveCustomGroup");
            return executeDataBaseCall("CALL DBA.ANYW_Roster_RemoveCustomGroup('" + groupId + "');", "results", "groupId");
        }

        public string getConsumerDayServiceActivity(string token, string peopleList, string serviceDate, string locationId)
        {
            logger.Debug("getConsumerDayServiceActivity");
            return executeDataBaseCall("CALL DBA.ANYW_DayService_GetConsumerActivity('" + token + "','" + peopleList + "','" + serviceDate + "','" + locationId + "');", "results", "dayrow");
        }

        public string addDayServiceActivityMassClockInConsumer(string consumerIds, string serviceDate, string locationId, string startTime)
        {
            logger.Debug("addDayServiceActivityMassClockInConsumer");
            return executeDataBaseCall("CALL DBA.ANYW_DayService_MassClockInConsumer('" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + startTime + "');", "results", "dayrow");
        }

        public string addDayServiceActivityMassClockOutConsumer(string consumerIds, string serviceDate, string locationId, string stopTime)
        {
            logger.Debug("addDayServiceActivityMassClockOutConsumer");
            return executeDataBaseCall("CALL DBA.DBA.ANYW_DayService_MassClockOutConsumer('" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + stopTime + "');", "results", "dayrow");
        }

        public string updateDayServiceActivity(string consumerIds, string serviceDate, string locationId, string inputType, string inputTime, string dayServiceType)
        {
            logger.Debug("updateDayServiceActivity");
            return executeDataBaseCall("CALL DBA.ANYW_DayService_MassUpdateConsumerActivity('" + consumerIds + "','" + serviceDate + "','" + locationId + "','" + inputType + "','" + inputTime + "','" + dayServiceType + "');", "results", "dayrow");
        }

        public string deleteDayServiceMassDeleteConsumerActivity(string consumerIds, string serviceDate, string locationID)
        {
            logger.Debug("deleteDayServiceMassDeleteConsumerActivity");
            return executeDataBaseCall("CALL DBA.ANYW_DayService_MassDeleteConsumerActivity('" + consumerIds + "','" + serviceDate + "','" + locationID + "');", "results", "dayrow");
        }

        public string getLogIn(string userId, string hash)
        {
            logger.Debug("getLogIn");
            return executeDataBaseCall("CALL DBA.ANYW_getLogIn('" + userId + "','" + hash + "');", "results", "permissions");
        }


        public string tokenCheck(string token)
        {
            logger.Debug("tokenCheck");
            return executeDataBaseCall("CALL DBA.ANYW_TokenCheck('" + token + "');", "results", "permissions");
        }

        public string clockInStaff(string token)
        {
            logger.Debug("ClockInStaff");
            return executeDataBaseCall("CALL DBA.ANYW_Home_ClockInStaff('" + token + "');", "results", "result");
        }

        public string clockOutStaff(string token)
        {
            logger.Debug("tokenCheck");
            return executeDataBaseCall("CALL DBA.ANYW_Home_ClockOutStaff('" + token + "');", "results", "result");
        }

        public string getStaffActivity(string token, string serviceDate)
        {
            logger.Debug("tokenCheck");
            return executeDataBaseCall("CALL DBA.ANYW_Home_GetStaffActivity('" + token + "','" + serviceDate + "');", "results", "result");
        }

        //@token varchar(100),@serviceDate date,@orgTime time,@newTime time,@isClockin bit
        public string updateStaffClockTime(string token, string serviceDate, string orginalTime, string newTime, string isClockIn)
        {
            logger.Debug("updateStaffClockTime");
            return executeDataBaseCall("CALL DBA.ANYW_Home_EditClockTime('" + token + "','" + serviceDate + "','" + orginalTime + "','" + newTime + "','" + isClockIn + "');", "results", "result");
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
        private string executeDataBaseCall(string storedProdCall, string collectionTag, string dataRowTag)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "<" + collectionTag + ">";

            try
            {
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
                logger.Error(ex);
                result = "Error: 501";
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

    }
}