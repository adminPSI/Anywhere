using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanInformedConsent
{
    public class PlanInformedConsentDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getPlanRestrictiveMeasures(string token, string assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetInformedConsent ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetInformedConsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APICDG", ex.Message + "ANYW_ISP_GetInformedConsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APICDG: error ANYW_ISP_GetInformedConsent";
            }
        }

        public string getPlanInformedConsentSSAs(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetInformedConsentVendors ");
            string text = "CALL DBA.ANYW_ISP_GetInformedConsentSSA()";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5APICDG", ex.Message + "ANYW_ISP_GetInformedConsentSSA()");
                return "5APICDG: error ANYW_ISP_GetInformedConsentSSA";
            }
        }

        public string getPlanInformedConsentVendors(string token, string peopleid)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetInformedConsentVendors ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(peopleid);
            string text = "CALL DBA.ANYW_ISP_GetInformedConsentVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5APICDG", ex.Message + "ANYW_ISP_GetInformedConsentVendors(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APICDG: error ANYW_ISP_GetInformedConsentVendors";
            }
        }

        public string insertPlanRestrictiveMeasures(string token, string assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("InsertInformedConsent ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_InsertInformedConsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2APICDG", ex.Message + "ANYW_ISP_InsertInformedConsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APICDG: error ANYW_ISP_InsertInformedConsent";
            }
        }

        public string updatePlanRestrictiveMeasures(string token, string informedConsentId, string rmIdentified, string rmHRCDate, string rmKeepSelfSafe, string rmFadeRestriction, string rmOtherWayHelpGood, string rmOtherWayHelpBad, string rmWhatCouldHappenGood, string rmWhatCouldHappenBad)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("UpdateRestrictiveMeasures ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(informedConsentId);
            list.Add(rmIdentified);
            list.Add(rmHRCDate);
            list.Add(rmKeepSelfSafe);
            list.Add(rmFadeRestriction);
            list.Add(rmOtherWayHelpGood);
            list.Add(rmOtherWayHelpBad);
            list.Add(rmWhatCouldHappenGood);
            list.Add(rmWhatCouldHappenBad);
            string text = "CALL DBA.ANYW_ISP_UpdateRestrictiveMeasures(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_UpdateRestrictiveMeasures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_UpdateRestrictiveMeasures";
            }
        }

        public string deletePlanRestrictiveMeasures(string token, string informedConsentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("DeleteRestrictiveMeasures ");
            List<string> list = new List<string>();
            list.Add(informedConsentId);
            string text = "CALL DBA.ANYW_ISP_DeleteRestrictiveMeasures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2APICDG", ex.Message + "ANYW_ISP_DeleteRestrictiveMeasures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APICDG: error ANYW_ISP_DeleteRestrictiveMeasures";
            }
        }

        public string updatePlanConsentStatements(string token, string signatureId, string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess, string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("UpdateConsentStatements ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(signatureId);
            list.Add(csChangeMind);
            list.Add(csChangeMindSSAPeopleId);
            list.Add(csContact);
            list.Add(csContactProviderVendorId);
            list.Add(csContactInput);
            list.Add(csRightsReviewed);
            list.Add(csAgreeToPlan);
            list.Add(csFCOPExplained);
            list.Add(csDueProcess);
            list.Add(csResidentialOptions);
            list.Add(csSupportsHealthNeeds);
            list.Add(csTechnology);
            string text = "CALL DBA.ANYW_ISP_UpdateConsentStatements(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_UpdateConsentStatements(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_UpdateConsentStatements";
            }
        }

        public string updateConsentSummaryofChanges(string planID, string summaryofChangesText)
        {
           
            logger.debug("updateConsentSummaryofChanges ");
            List<string> list = new List<string>();
            list.Add(planID);
            list.Add(summaryofChangesText);
            string text = "CALL DBA.ANYW_ISP_UpdateConsentSummaryofChanges(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_UpdateConsentStatements(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_UpdateConsentStatements";
            }
        }

        public string insertForCarryOverInformedConsent(string token, long planId, string rmIdentified, string rmHRCDate, string rmKeepSelfSafe, string rmFadeRestriction, string rmOtherWayHelpGood, string rmOtherWayHelpBad, string rmWhatCouldHappenGood, string rmWhatCouldHappenBad, string revision)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertForCarryOverInformedConsent ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            list.Add(rmIdentified);
            list.Add(rmHRCDate);
            list.Add(rmKeepSelfSafe);
            list.Add(rmFadeRestriction);
            list.Add(rmOtherWayHelpGood);
            list.Add(rmOtherWayHelpBad);
            list.Add(rmWhatCouldHappenGood);
            list.Add(rmWhatCouldHappenBad);
            list.Add(revision);
            string text = "CALL DBA.ANYW_ISP_CarryOverInformedConsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_CarryOverInformedConsent(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_CarryOverInformedConsent";
            }
        }

        //DELETES
        public string deletePlanInformedConsentWithPlan(string planId)
        {

            logger.debug("deletePlanInformedConsentWithPlan ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanInformedConsentWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PSDG", ex.Message + "ANYW_ISP_DeletePlanInformedConsentWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APSDG: error ANYW_ISP_DeletePlanInformedConsentWithPlan";
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