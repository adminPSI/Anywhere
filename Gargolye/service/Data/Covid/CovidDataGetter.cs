using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.Covid
{
    public class CovidDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string insertUpdateCovidAssessment(string token, string assesmentDate, string assessmentTime, string cough, string diarrhea,
           string fever, string locationId, string malaise, string nasalCong, string nausea,string tasteAndSmell, string notes, string peopleId, string settingType, string shortnessBreath, string soreThroat, string assessmentId, string isConsumer)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDefaultAnywhereSettingsJSON " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assesmentDate);
            list.Add(assessmentTime);
            list.Add(cough);
            list.Add(diarrhea);
            list.Add(fever);
            list.Add(locationId);
            list.Add(malaise);
            list.Add(nasalCong);
            list.Add(nausea);
            list.Add(tasteAndSmell);
            list.Add(notes);
            list.Add(peopleId);
            list.Add(settingType);
            list.Add(shortnessBreath);
            list.Add(soreThroat);
            list.Add(assessmentId);
            list.Add(isConsumer);
            string text = "CALL DBA.ANYW_Covid_InsertUpdateIndividualsInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("500-cov", ex.Message + "ANYW_Covid_InsertIndividualsInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "500-cov: error ANYW_Covid_InsertIndividualsInfo";
            }
        }

        public string getIndividualsCovidDetails(string token, string peopleId, string assessmentDate, string isConsumer)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDefaultAnywhereSettingsJSON " + token);
            List<string> list = new List<string>();
            list.Add(peopleId);
            list.Add(assessmentDate);
            list.Add(isConsumer);
            string text = "CALL DBA.ANYW_Covid_GetIndividualsInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501-cov", ex.Message + "ANYW_Covid_GetIndividualsInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501-cov: error ANYW_Covid_GetIndividualsInfo";
            }
        }

        public string deleteCovidAssessment(string token, string assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDefaultAnywhereSettingsJSON " + token);
            List<string> list = new List<string>();
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_Covid_DeleteAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("502-cov", ex.Message + "ANYW_Covid_DeleteAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "502-cov: error ANYW_Covid_DeleteAssessment";
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

        public System.IO.MemoryStream executeSQLReturnMemoryStream(string storedProdCall)
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
            logger.debug("Attachment done");
            return memorystream;
        }
    }
}