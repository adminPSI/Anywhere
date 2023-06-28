using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanSignature
{
    public class PlanSignatureDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getSignatures(string token, long assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("GetSignatures ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetSignatures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APSDG", ex.Message + "ANYW_ISP_GetSignatures(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APSDG: error ANYW_ISP_GetSignatures";
            }
        }

        public string getTeamMemberBySalesForceId(string salesForceId)
        {

            List<string> list = new List<string>();
            list.Add(salesForceId);
            string text = "CALL DBA.ANYW_ISP_GetTeamMemberBySalesForceId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1APSDG", ex.Message + "ANYW_ISP_GetTeamMemberBySalesForceId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APSDG: error ANYW_ISP_GetTeamMemberBySalesForceId";
            }
        }


        public string insertPlanTeamMember(string token, string assessmentId, string teamMember, string name, string lastName, string participated, string signature, string contactId, string planYearStart, string planYearEnd, string dissentAreaDisagree, string dissentHowToAddress,
               string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess,
               string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology, string buildingNumber, string dateOfBirth, string peopleId, string useExisting, string relationshipImport, string salesForceId, string signatureType, string vendorId, string relationship)
        {
            if (tokenValidator(token) == false) return null;
            //if (stringInjectionValidator(relationship) == false) return null;
            logger.debug("getPlanTeamMember ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            list.Add(teamMember);
            list.Add(name);
            list.Add(lastName);
            list.Add(participated);
            list.Add(signature);
            list.Add(contactId);
            list.Add(dissentAreaDisagree);
            list.Add(dissentHowToAddress);
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
            list.Add(buildingNumber);
            list.Add(dateOfBirth);
            list.Add(peopleId);
            list.Add(useExisting);
            list.Add(relationshipImport);
            list.Add(salesForceId);
            list.Add(signatureType);
            list.Add(relationship);
            string text = "CALL DBA.ANYW_ISP_InsertTeamMember(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2APSDG", ex.Message + "ANYW_ISP_InsertTeamMember(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APSDG: error ANYW_ISP_InsertTeamMember";
            }
        }

        public string insertVendor(string token, string assessmentId, string teamMember, string name, string lastName, string participated, string signature, string contactId, string planYearStart, string planYearEnd, string dissentAreaDisagree, string dissentHowToAddress,
               string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess,
               string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology, string buildingNumber, string dateOfBirth, string peopleId, string useExisting, string relationshipImport, string salesForceId, string signatureType, string vendorId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertVendor ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            list.Add(teamMember);
            list.Add(name);
            list.Add(lastName);
            list.Add(participated);
            list.Add(signature);
            list.Add(contactId);
            list.Add(dissentAreaDisagree);
            list.Add(dissentHowToAddress);
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
            list.Add(buildingNumber);
            list.Add(dateOfBirth);
            list.Add(relationshipImport);
            list.Add(peopleId);
            list.Add(signatureType);
            list.Add(vendorId);
            string text = "CALL DBA.ANYW_ISP_InsertVendor(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2APSDG", ex.Message + "ANYW_ISP_InsertVendor(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APSDG: error ANYW_ISP_InsertVendor";
            }
        }
        //UPDATE
        public string updateTeamMember(string token, string signatureId, string teamMember, string name, string lastName, string participated, string dissentAreaDisagree, string dissentHowToAddress, string signature, string contactId, string buildingNumber, string dateOfBirth, string salesForceId, string signatureType, string dateSigned, string vendorId, string clear)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateTeamMember ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(signatureId);
            list.Add(teamMember);
            list.Add(name);
            list.Add(lastName);
            list.Add(participated);
            list.Add(dissentAreaDisagree);
            list.Add(dissentHowToAddress);
            list.Add(signature);
            list.Add(contactId);
            list.Add(buildingNumber);
            list.Add(dateOfBirth);
            list.Add(salesForceId);
            list.Add(signatureType);
            list.Add(dateSigned);
            list.Add(clear);
            string text = "CALL DBA.ANYW_ISP_UpdateTeamMember(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_UpdateTeamMember(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_UpdateTeamMember";
            }
        }

        public string updateVendor(string token, string signatureId, string teamMember, string name, string lastName, string participated, string dissentAreaDisagree, string dissentHowToAddress, string signature, string contactId, string buildingNumber, string dateOfBirth, string salesForceId, string signatureType, string dateSigned, string vendorId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateVendor ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(signatureId);
            list.Add(teamMember);
            list.Add(name);
            list.Add(lastName);
            list.Add(participated);
            list.Add(dissentAreaDisagree);
            list.Add(dissentHowToAddress);
            list.Add(signature);
            list.Add(contactId);
            list.Add(buildingNumber);
            list.Add(dateOfBirth);
            list.Add(signatureType);
            list.Add(dateSigned);
            string text = "CALL DBA.ANYW_ISP_UpdateVendor(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_UpdateVendor(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_UpdateVendor";
            }
        }

        //public string checkPeopleExist(string name, string lastName, string buildingNumber, string dateOfBirth)
        //{
        //    logger.debug("checkPeopleExist ");
        //    List<string> list = new List<string>();
        //    list.Add(name.ToString());
        //    list.Add(lastName.ToString());
        //    list.Add(buildingNumber.ToString());
        //    list.Add(dateOfBirth.ToString());
        //    string text = "CALL DBA.ANYW_ISP_CheckTeamMemberExists(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
        //    try
        //    {
        //        return executeDataBaseCallJSON(text);
        //    }
        //    catch (Exception ex)
        //    {
        //        logger.error("3APSDG", ex.Message + "ANYW_ISP_CheckTeamMemberExists(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
        //        return "3APSDG: error ANYW_ISP_CheckTeamMemberExists";
        //    }
        //}

        public string checkPeopleExist(string name, string lastName)
        {
            logger.debug("checkPeopleExist ");
            List<string> list = new List<string>();
            list.Add(name.ToString());
            list.Add(lastName.ToString());
            string text = "CALL DBA.ANYW_ISP_CheckTeamMemberExists(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_CheckTeamMemberExists(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_CheckTeamMemberExists";
            }
        }

        public string createRelationship(string token, string planYearStart, string planYearEnd, string consumerId, string peopleId, string salesForceId)
        {
            logger.debug("checkPeopleExist ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planYearStart);
            list.Add(planYearEnd);
            list.Add(consumerId);
            list.Add(peopleId);
            list.Add(salesForceId);
            string text = "CALL DBA.ANYW_ISP_CreateRelationship(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_CreateRelationship(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_CreateRelationship";
            }
        }

        public string newPersonToPeopleTable(string token, string name, string lastName, string buildingNumber, string dateOfBirth, string consumerId)
        {
            logger.debug("checkPeopleExist ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(name.ToString());
            list.Add(lastName.ToString());
            list.Add(buildingNumber.ToString());
            list.Add(dateOfBirth.ToString());
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_ISP_TeamMemberInsertNoSalesForceId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_TeamMemberInsertNoSalesForceId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_TeamMemberInsertNoSalesForceId";
            }
        }

        public string insertPeopleAndSalesforceId(string name, string lastName, string buildingNumber, string dateOfBirth, string peopleId, string salesForceId)
        {
            logger.debug("updateSignatureOrder ");
            List<string> list = new List<string>();
            list.Add(name.ToString());
            list.Add(lastName.ToString());
            list.Add(buildingNumber.ToString());
            list.Add(dateOfBirth.ToString());
            list.Add(peopleId.ToString());
            list.Add(salesForceId.ToString());
            string text = "CALL DBA.ANYW_ISP_CheckAndInsertPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_CheckAndInsertPeople(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_CheckAndInsertPeople";
            }
        }

        public string updatePlanSignatureOrder(long assessmentId, long signatureId, int newPos)
        {
            logger.debug("updateSignatureOrder ");
            List<string> list = new List<string>();
            list.Add(assessmentId.ToString());
            list.Add(signatureId.ToString());
            list.Add(newPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateSignatureOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_UpdateTeamMember(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_UpdateTeamMember";
            }
        }

        public string setSalesForceIdForTeamMemberUpdate(string peopleId, string salesForceId)
        {
            logger.debug("updateSignatureOrder ");
            List<string> list = new List<string>();
            list.Add(peopleId);
            list.Add(salesForceId);
            string text = "CALL DBA.ANYW_ISP_SetSalesForceIdForTeamMemberUpdate(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_SetSalesForceIdForTeamMemberUpdate(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_SetSalesForceIdForTeamMemberUpdate";
            }
        }

        public string validateConsumerForSalesForceId(string peopleId)
        {
            logger.debug("updateSignatureOrder ");
            List<string> list = new List<string>();
            list.Add(peopleId);
            string text = "CALL DBA.ANYW_ISP_ValidateConsumerForSalesForceId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3APSDG", ex.Message + "ANYW_ISP_ValidateConsumerForSalesForceId(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APSDG: error ANYW_ISP_ValidateConsumerForSalesForceId";
            }
        }

        //DELETES
        public string deletePlanSignatureWithPlan(string planId)
        {

            logger.debug("deletePlanSignatureWithPlan ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanSignaturesWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5.1PSDG", ex.Message + "ANYW_ISP_DeletePlanSignaturesWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6.1APSDG: error ANYW_ISP_DeletePlanSignaturesWithPlan";
            }
        }

        public string deletePlanSignature(string token, string signatureId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePlanSignature ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(signatureId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanSignature(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PSDG", ex.Message + "ANYW_ISP_DeletePlanSignature(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6APSDG: error ANYW_ISP_DeletePlanSignature";
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