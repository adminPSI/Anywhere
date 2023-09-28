using Anywhere.Log;
using iTextSharp.text.pdf;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class AuthenticationDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        //public string generateAuthentication(string userId, string WebPassword)
        //{
        //    logger.debug("generateAunthenication ");
        //    List<string> list = new List<string>();
        //    list.Add(userId);
        //    list.Add(WebPassword);
        //    string text = "CALL DBA.ANYW_Login_GenerateAuthentication(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
        //    try
        //    {
        //        return executeDataBaseCallJSON(text);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("900", ex.Message + "ANYW_Login_GenerateAuthentication(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
        //        return "900: error ANYW_Login_GenerateAuthentication";
        //    }
        //}

        public string generateAuthentication(string userId, string WebPassword)
        {
            logger.trace("100", "getLogIn:" + userId);
            if (stringInjectionValidator(WebPassword) == false) return null;
            try
            {
                return executeDataBaseCall("CALL DBA.ANYW_Login_GenerateAuthentication('" + userId + "','" + WebPassword + "');", "results", "permissions");
            }
            catch (Exception ex)
            {
                logger.error("514", ex.Message + " ANYW_Login_GenerateAuthentication('" + userId + "','" + WebPassword + "')");
                return "514: " + ex.Message;
            }
        }

        public string getHashfromKey(string userId, string genKey)
        {
            logger.debug("generateAunthenication ");
            if (stringInjectionValidator(genKey) == false) return null;
            List<string> list = new List<string>();
            list.Add(userId);
            list.Add(genKey);
            string text = "CALL DBA.ANYW_Login_HashFromKey(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("901", ex.Message + "ANYW_Login_HashFromKey(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "901: error ANYW_Login_HashFromKey";
            }
        }

        public string checkDeviceAuthentication(string userId, string deviceId)
        {
            logger.debug("generateAunthenication ");
            if (stringInjectionValidator(deviceId) == false) return null;
            List<string> list = new List<string>();
            list.Add(userId);
            list.Add(deviceId);
            string text = "CALL DBA.ANYW_Authentication_CheckDeviceAuthentication(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("902", ex.Message + "ANYW_Authentication_CheckDeviceAuthentication(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "902: error ANYW_Authentication_CheckDeviceAuthentication";
            }
        }

        private string executeDataBaseCall(string storedProdCall)
        {
            return executeDataBaseCall(storedProdCall, "results", "result");
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
    }
}