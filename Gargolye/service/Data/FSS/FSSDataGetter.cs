using Anywhere.Log;
using OneSpanSign.Sdk;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using System.ServiceModel.Web;
using static Anywhere.service.Data.FSS.FSSWorker;
using static Anywhere.service.Data.AnywhereWorker;
using System.Management.Automation.Language;
using System.Configuration;
using System.Data.Odbc;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereWorkshopWorkerTwo;

namespace Anywhere.service.Data.FSS
{
    public class FSSDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();


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

        public string getActiveInactiveFamilylist(string token, string isInactiveUser)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getActiveInactiveFamilylist" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_FSS_getActiveInactiveFamilylist( '" + isInactiveUser + "');");

            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_FSS_getActiveInactiveFamilylist( '" + isInactiveUser + "')");
                return "561: Error getting getActiveInactive Family list";
            }

        }

        public string getFamilyInfoByID(string token, string familyID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getFamilyInfoByID" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_FSS_getFamilyInfoByID( '" + familyID + "');");

            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_FSS_getFamilyInfoByID( '" + familyID + "')");
                return "561: Error getting FamilyInfoByID";
            }

        }

        public string updateFamilyInfo(string token, string familyName, string address1, string address2, string city, string state, string zip, string primaryPhone, string secondaryPhone, string email, string notes, string active, string userId, string familyID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateFamilyInfo");
            List<string> list = new List<string>();
            list.Add(familyID);
            list.Add(familyName);
            list.Add(address1);
            list.Add(address2);
            list.Add(city);
            list.Add(state);
            list.Add(zip);
            list.Add(primaryPhone);
            list.Add(secondaryPhone);
            list.Add(email);
            list.Add(notes);
            list.Add(active);
            list.Add(userId);


            string text = "CALL DBA.ANYW_FSS_updateFamilyInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("677", ex.Message + "ANYW_FSS_updateFamilyInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "677: error ANYW_FSS_updateFamilyInfo";
            }
        }

        public string getFamilyMembers(string token, string familyID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getFamilyMembers" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_FSS_getFamilyMembers( '" + familyID + "');");

            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_FSS_getFamilyMembers( '" + familyID + "')");
                return "561: Error getting FamilyMembers";
            }

        }

        public string getMembers(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMembers" + token);
            try
            {
                return executeDataBaseCallJSON("CALL DBA.ANYW_FSS_getMembers();");

            }
            catch (Exception ex)
            {
                logger.error("561", ex.Message + " ANYW_FSS_getMembers( '" + token + "')");
                return "561: Error getting getMembers";
            }

        }

        public string insertMemberInfo(string token, string memberId, string familyID, string active, string userId, string newMemberId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertMemberInfo");
            List<string> list = new List<string>();
            list.Add(familyID);
            list.Add(memberId);
            list.Add(active);
            list.Add(userId);
            list.Add(newMemberId);

            string text = "CALL DBA.ANYW_FSS_insertMemberInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("677", ex.Message + "ANYW_FSS_insertMemberInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "677: error ANYW_FSS_insertMemberInfo";
            }
        }

        public string deleteMemberInfo(string token, string memberId, string familyID)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteMemberInfo");
            List<string> list = new List<string>();
            list.Add(familyID);
            list.Add(memberId);

            string text = "CALL DBA.ANYW_FSS_deleteMemberInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("677", ex.Message + "ANYW_FSS_deleteMemberInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "677: error ANYW_FSS_deleteMemberInfo";
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



    }
}