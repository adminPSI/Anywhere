using Anywhere.Data;
using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.DocumentConversion
{
    public class AllAttachmentsDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        DataGetter dg = new DataGetter();

        public string getPlanAttachmentsWithOrdering(string assessmentId)
        {
            List<string> list = new List<string>();
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetPlanAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647", ex.Message + "ANYW_ISP_GetPlanAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647: error ANYW_ISP_GetPlanAttachmentsWithOrdering";
            }
        }

        public string getWorkFlowAttachmentswithOrdering(string assessmentId)
        {
            List<string> list = new List<string>();
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetWorkFlowAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("647", ex.Message + "ANYW_ISP_GetWorkFlowAttachmentsWithOrdering(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "647: error ANYW_ISP_GetWorkFlowAttachmentsWithOrdering";
            }
        }

        public bool ValidateToken(string token)
        {
            return dg.validateToken(token);
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
                    js.MaxJsonLength = Int32.MaxValue;
                    arr.Add(js.Serialize(holder));
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