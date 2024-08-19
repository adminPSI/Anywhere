using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web.Script.Serialization;


namespace Anywhere.service.Data.ImportOutcomesAndServices
{
    public class ImportOutcomesAndServicesDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        WorkflowDataGetter wfdg = new WorkflowDataGetter();

        
        public string getExistingOutomes(string token, string selectedConsumerId, string startDate, string endDate, DistributedTransaction transaction)
        {
            logger.debug("getExistingOutcomes");

            var parameters = new Dictionary<string, string>
            {
                { "@token", token },
                { "@selectedConsumerId", selectedConsumerId },
                { "@startDate", startDate },
                { "@endDate", endDate }
            };

            try
            {
                return CallStoredProcedure("DBA.ANYW_ImportOutcomesAndServices_GetExistingOutcomes", parameters, transaction);
            }
            catch (Exception ex)
            {
                logger.error("501-IOAS", ex.Message + " ANYW_ImportOutcomesAndServices_GetExistingOutcomes");
                return "501-IOAS: error ANYW_ImportOutcomesAndServices_GetExistingOutcomes";
            }
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

        public string CallStoredProcedure(
            string procedureName,
            Dictionary<string, string> parameters,
            DistributedTransaction transaction)
        {
            try
            {
                logger.debug("CallStoredProcedure");
                int paramCount = parameters.Count;
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[paramCount];

                int index = 0;
                foreach (var param in parameters)
                {
                    args[index] = (System.Data.Common.DbParameter)DbHelper.CreateParameter(param.Key, DbType.String, param.Value);
                    index++;
                }

                string commandText = $"CALL {procedureName}({string.Join(",", new string[paramCount].Select((s, i) => "?"))})";
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, commandText, args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("CallStoredProcedure", ex.Message + $" {procedureName}()");
                throw ex;
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

        public Boolean validateToken(string token)
        {
            try
            {
                logger.debug("validateToken ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                object obj = DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_TokenCheck(?)", args);
                return (obj == null) ? true : false;
            }
            catch (Exception ex)
            {
                logger.error("ADG", ex.Message + "ANYW_TokenCheck(" + token + ")");
                throw ex;
            }
        }
    }
}