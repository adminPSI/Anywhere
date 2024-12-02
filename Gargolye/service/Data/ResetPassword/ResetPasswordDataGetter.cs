using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.ResetPassword
{
    public class ResetPasswordDataGetter
    {
        private static Loger logger = new Loger();
        //private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(DataGetter));
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();



        public string getActiveInactiveUserDateJSON(string token, string isInactiveUser)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(isInactiveUser) == false) return null;
            logger.debug("getActiveInactiveUserDateJSON" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_GetInactiveUsers( '" + isInactiveUser + "');");

            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_GetInactiveUsers( '" + isInactiveUser + "')");
                return "561: Error getting single entry by id";
            }

        }

        public string updateActiveInactiveUserDateJSON(string token, string isInactiveUser, string userId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateActiveInactiveUserDateJSON Token:" + token + " UserId:" + isInactiveUser + "isInactiveUser:" + isInactiveUser);
            List<string> list = new List<string>();
            list.Add(isInactiveUser);
            list.Add(userId);
            string text = "CALL DBA.ANYW_updateUserStatus(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";

            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_updateUserStatus( '" + isInactiveUser + "')");
                return "561: Error getting single entry by id";
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


        public bool tokenValidator(string token)
        {
            if (token.Contains(" "))
            {
                return false;
            }
            else
            {
                return true;
            }
        }





    }

}