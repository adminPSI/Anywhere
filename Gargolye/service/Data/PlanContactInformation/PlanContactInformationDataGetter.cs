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

namespace Anywhere.service.Data.PlanContactInformation
{
    public class PlanContactInformationDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string importExistingContactInfo(string token, string peopleId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("importExistingContactInfo ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(peopleId);
            string text = "CALL DBA.ANYW_ISP_GetContactInfoFromTables(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("0APCIDG", ex.Message + "ANYW_ISP_GetContactInfoFromTables(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "0APCIDG: error ANYW_ISP_GetContactInfoFromTables";
            }
        }

        public string getPlanContact(string token, long assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanContact ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetPlanContact(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APCIDG", ex.Message + "ANYW_ISP_GetPlanContact(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APCIDG: error ANYW_ISP_GetPlanContact";
            }
        }
        // Consumer Relationships mving to shared planData.js (AssessmentWorker, AssessmentDataGetter)
        public string getConsumerRelationships(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerRelationships ");
            List<string> list = new List<string>();
            //list.Add(token);
            list.Add(consumerId);
            list.Add(effectiveStartDate);
            list.Add(effectiveEndDate);
            list.Add(areInSalesForce);
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_GetConsumerRelationships(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APCIDG", ex.Message + "ANYW_ISP_GetConsumerRelationships(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APCIDG: error ANYW_ISP_GetConsumerRelationships";
            }
        }


        public string getPlanContactImportantPeople(string token, string contactId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanContactImportantPeople ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            string text = "CALL DBA.ANYW_ISP_GetPlanContactImportantPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2APCIDG", ex.Message + "ANYW_ISP_GetPlanContactImportantPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APCIDG: error ANYW_ISP_GetPlanContactImportantPeople";
            }
        }

        public string getPlanContactImportantPlaces(string token, string contactId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanContactImportantPlaces ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            string text = "CALL DBA.ANYW_ISP_GetPlanContactImportantPlaces(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APCIDG", ex.Message + "ANYW_ISP_GetPlanContactImportantPlaces(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APCIDG: error ANYW_ISP_GetPlanContactImportantPlaces";
            }
        }

        public string getPlanContactImportantGroups(string token, string contactId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanContactImportantGroups ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            string text = "CALL DBA.ANYW_ISP_GetPlanContactImportantGroups(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4APCIDG", ex.Message + "ANYW_ISP_GetPlanContactImportantGroups(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APCIDG: error ANYW_ISP_GetPlanContactImportantGroups";
            }
        }

        public string getPlanContactFundingSources(long assessmentId)
        {
            logger.debug("getPlanContactFundingSources ");
            List<string> list = new List<string>();
            list.Add(assessmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetContactInfoFundingSource(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2APCIDG", ex.Message + "ANYW_ISP_GetContactInfoFundingSource(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APCIDG: error ANYW_ISP_GetContactInfoFundingSource";
            }
        }

        public string insertPlanContactImportantGroup(string token, string contactId, string status, string name, string address, string phone, string meetingInfo, string whoHelps)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPlanContactImportantGroup ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            list.Add(status);
            list.Add(name);
            list.Add(address);
            list.Add(phone);
            list.Add(meetingInfo);
            list.Add(whoHelps);
            string text = "CALL DBA.ANYW_ISP_InsertContactImportantGroup(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5APCIDG", ex.Message + "ANYW_ISP_InsertContactImportantGroup(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APCIDG: error ANYW_ISP_InsertContactImportantGroup";
            }
        }

        public string insertPlanContactImportantPlaces(string token, string contactId, string type, string name, string address, string phone, string schedule, string acuity)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPlanContactImportantPlaces ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            list.Add(type);
            list.Add(name);
            list.Add(address);
            list.Add(phone);
            list.Add(schedule);
            list.Add(acuity);
            string text = "CALL DBA.ANYW_ISP_InsertContactImportantPlace(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6APCIDG", ex.Message + "ANYW_ISP_InsertContactImportantPlace(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6APCIDG: error ANYW_ISP_InsertContactImportantPlace";
            }
        }

        public string insertPlanContactImportantPeople(string token, string contactId, string type, string name, string relationship, string address, string phone, string email)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPlanContactImportantPeople ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            list.Add(type);
            list.Add(name);
            list.Add(relationship);
            list.Add(address);
            list.Add(phone);
            list.Add(email);
            string text = "CALL DBA.ANYW_ISP_InsertContactImportantPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("7APCIDG", ex.Message + "ANYW_ISP_InsertContactImportantPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "7APCIDG: error ANYW_ISP_InsertContactImportantPeople";
            }
        }
        public string updatePlanContactImportantPeople(string token, string importantPersonId, string type, string name, string relationship, string address, string phone, string email)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updatePlanContactImportantPeople ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(importantPersonId);
            list.Add(type);
            list.Add(name);
            list.Add(relationship);
            list.Add(address);
            list.Add(phone);
            list.Add(email);
            string text = "CALL DBA.ANYW_ISP_UpdateContactImportantPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("7APCIDG", ex.Message + "ANYW_ISP_UpdateContactImportantPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "7APCIDG: error ANYW_ISP_UpdateContactImportantPeople";
            }
        }
        public string updatePlanContactImportantGroup(string token, string importantGroupId, string status, string name, string address, string phone, string meetingInfo, string whoHelps)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updatePlanContactImportantGroup ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(importantGroupId);
            list.Add(status);
            list.Add(name);
            list.Add(address);
            list.Add(phone);
            list.Add(meetingInfo);
            list.Add(whoHelps);
            string text = "CALL DBA.ANYW_ISP_UpdateContactImportantGroup(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            list.Add(phone);
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8APCIDG", ex.Message + "ANYW_ISP_UpdateContactImportantGroup(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8APCIDG: error ANYW_ISP_UpdateContactImportantGroup";
            }
        }
        public string updatePlanContactImportantPlaces(string token, string importantPlacesId, string type, string name, string address, string phone, string schedule, string acuity)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updatePlanContactImportantPlaces ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(importantPlacesId);
            list.Add(type);
            list.Add(name);
            list.Add(address);
            list.Add(phone);
            list.Add(schedule);
            list.Add(acuity);
            string text = "CALL DBA.ANYW_ISP_UpdateContactImportantPlace(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("9APCIDG", ex.Message + "ANYW_ISP_UpdateContactImportantPlace(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "9APCIDG: error ANYW_ISP_UpdateContactImportantPlace";
            }
        }

        public string updatePlanContact(string token, string contactId, string ohiInfo, string ohiPhone, string ohiPolicy)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updatePlanContact ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(contactId);
            list.Add(ohiInfo);
            list.Add(ohiPhone);
            list.Add(ohiPolicy);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanContact(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("12APCIDG", ex.Message + "ANYW_ISP_UpdatePlanContact(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "12APCIDG: error ANYW_ISP_UpdatePlanContact";
            }
        }

        public string updatePlanContactImportantOrder(long contactId, long importantId, int newPos, int oldPos, int type)
        {
            logger.debug("updatePlanContactImportantOrder ");
            List<string> list = new List<string>();
            list.Add(contactId.ToString());
            list.Add(importantId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            list.Add(type.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdatePlanContactImportantOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("12APCIDG", ex.Message + "ANYW_ISP_UpdatePlanContactImportantOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "12APCIDG: error ANYW_ISP_UpdatePlanContactImportantOrder";
            }
        }

        public string insertPlanContact(string token, long planId, string ohiInfo, string ohiPhone, string ohiPolicy)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPlanContact ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            list.Add(ohiInfo);
            list.Add(ohiPhone);
            list.Add(ohiPolicy);
            string text = "CALL DBA.ANYW_ISP_InsertPlanContact(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("14APCIDG", ex.Message + "ANYW_ISP_InsertPlanContact(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "14APCIDG: error ANYW_ISP_InsertPlanContact";
            }
        }

        public string deletePlanContactImportant(string token, string importantId, string type)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePlanContactImportant ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(importantId);
            list.Add(type);
            string text = "CALL DBA.ANYW_ISP_DeletePlanContactImportant(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("10APCIDG", ex.Message + "ANYW_ISP_DeletePlanContactImportant(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "10APCIDG: error ANYW_ISP_DeletePlanContactImportant";
            }
        }

        public string deletePlanContactInformationWithPlan(string planId)
        {

            logger.debug("deletePlanContactInformationWithPlan ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanContactInformationWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PSDG", ex.Message + "ANYW_ISP_DeletePlanContactInformationWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APSDG: error ANYW_ISP_DeletePlanContactInformationWithPlan";
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