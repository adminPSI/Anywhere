using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.eSignature_OneSpan
{
    public class OneSpanDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string OneSpanGetSignatures(string token, long assessmentId)
        {

            logger.debug("OneSpanGetSignatures ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());

            string text = "CALL DBA.ANYW_ISP_OneSpan_GetSignatures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501-cov", ex.Message + "ANYW_ISP_OneSpan_GetSignatures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501-cov: error ANYW_ISP_OneSpan_GetSignatures";
            }
        }

        public string UpdateOneSpanPlanConsentStatements(string token, string signatureId, string dateSigned, string csChangeMind, string csContact, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess, string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology, string dissentAreaDisagree, string dissentHowToAdress)
        {
            if (validateToken(token) == false) return null;
            logger.debug("UpdateConsentStatements ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(signatureId);
            list.Add(dateSigned);
            list.Add(csChangeMind);
            list.Add(csContact);
            list.Add(csRightsReviewed);
            list.Add(csAgreeToPlan);
            list.Add(csFCOPExplained);
            list.Add(csDueProcess);
            list.Add(csResidentialOptions);
            list.Add(csSupportsHealthNeeds);
            list.Add(csTechnology);
            list.Add(dissentAreaDisagree);
            list.Add(dissentHowToAdress);

            string text = "CALL DBA.ANYW_ISP_UpdateOneSpanPlanConsentStatements(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_UpdateOneSpanPlanConsentStatements(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_UpdateOneSpanPlanConsentStatements";
            }
        }

        public string OneSpanInsertPackageId(string token, string assessmentId, string packageId, string signedStatus)
        {
            if (validateToken(token) == false) return null;
            List<string> list = new List<string>();

            list.Add(token);
            list.Add(assessmentId);
            list.Add(packageId);
            list.Add(signedStatus);

            string text = "CALL DBA.ANYW_ISP_OneSpan_InsertPackageId(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_OneSpan_InsertPackageId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_OneSpan_InsertPackageId";
            }
        }

        public string OneSpanCheckDocumentStatus(string token, string assessmentId)
        {
            if (validateToken(token) == false) return null;
            List<string> list = new List<string>();

            list.Add(token);
            list.Add(assessmentId);

            string text = "CALL DBA.ANYW_ISP_OneSpan_CheckDocumentStatus(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_ISP_OneSpan_CheckDocumentStatus(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_ISP_OneSpan_CheckDocumentStatus";
            }
        }

        public string OneSpanUpdateDocumentSignedStatus(string token, string assessmentId, string signedStatus)
        {
            if (validateToken(token) == false) return null;
            List<string> list = new List<string>();

            list.Add(token);
            list.Add(assessmentId);
            list.Add(signedStatus);

            string text = "CALL DBA.ANYW_OneSpan_UpdateDocumentSignedStatus(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APICDG", ex.Message + "ANYW_OneSpan_UpdateDocumentSignedStatus(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APICDG: error ANYW_OneSpan_UpdateDocumentSignedStatus";
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