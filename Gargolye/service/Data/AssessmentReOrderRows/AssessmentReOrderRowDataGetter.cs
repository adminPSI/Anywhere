using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.AssessmentReOrderRows
{
    public class AssessmentReOrderRowDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string updateAssessmentAnswerRowOrder(string token, string answerIds, long assessmentId, long questionSetId, int newPos, int oldPos)
        {

            logger.debug("updateAssessmentAnswerRowOrder ");
            if (tokenValidator(token) == false) return null;
            if (consumerIdStringValidator(answerIds) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(answerIds);
            list.Add(assessmentId.ToString());
            list.Add(questionSetId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateAssessmentAnswerRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdateAssessmentAnswerRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdateAssessmentAnswerRowOrder";
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
            if (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(deleteFrom))
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