using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class TimeClocktoTimeEntryWorker
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public void dataSetUp(string repsonse, string type, string locationId)
        {
            UserWidgetSettings[] timeObj = js.Deserialize<UserWidgetSettings[]>(repsonse);
            string setTime = timeObj[0].dbTime.ToString();
            setTime = setTime.Substring(setTime.Length - 3);
            updateTimeEntryMatchTimeClock(setTime, type, locationId);
        }
        public class UserWidgetSettings
        {
            public string dbTime { get; set; }
        }

        public string updateTimeEntryMatchTimeClock(string setTime, string actionType, string locationId)
        {
            logger.debug("updateTimeEntryMatchTimeClock");
            List<string> list = new List<string>();
            list.Add(setTime);
            list.Add(actionType);   
            list.Add(locationId);           
            string text = "CALL DBA.ANYW_Dashboard_UpdateTimeEntryMatchTimeClock(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("500-TCW", ex.Message + "ANYW_DashBoard_UpdateTimeEntryMatchTimeClock(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "500-TCW: error ANYW_DashBoard_UpdateTimeEntryMatchTimeClock";
            }
        }

        public string updateTimeClockMatchTimeEntry(string setTime, string actionType, string locationId)
        {
            logger.debug("updateTimeEntryMatchTimeClock");
            List<string> list = new List<string>();
            list.Add(setTime);
            list.Add(actionType);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Dashboard_UpdateTimeClockMatchTimeEntry(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501-TCW", ex.Message + "ANYW_Dashboard_UpdateTimeClockMatchTimeEntry(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501-TCW: error ANYW_Dashboard_UpdateTimeClockMatchTimeEntry";
            }
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
    }
}