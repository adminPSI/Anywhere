using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web.Script.Serialization;


namespace Anywhere.service.Data.ESign
{
	public class ESignDataGetter
	{
		private static Loger logger = new Loger();
		private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
		WorkflowDataGetter wfdg = new WorkflowDataGetter();

		public string saveESignReportData(
			string token,
			string assessmentId,
			string versionId,
			string planAttachmentIds,
			string wfAttachmentIds,
			string sigAttachmentIds,
			string include,
			string peopleId,
			string vendorId,
			DistributedTransaction transaction)
		{
			if (tokenValidator(token) == false) return null;
			logger.debug("saveESignReportData");

			var parameters = new Dictionary<string, string>
			{
				{ "@token", token },
                { "@peopleId", peopleId },
				{ "vendorId", vendorId },
                { "@assessmentId", assessmentId },
				{ "@versionId", versionId },
				{ "@planAttachmentIds", planAttachmentIds },
				{ "@wfAttachmentIds", wfAttachmentIds },
				{ "@sigAttachmentIds", sigAttachmentIds },
				{ "@include", include },
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_saveESignReportData", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_saveESignReportData");
				return "501-cov: error ANYW_ESignatures_saveESignReportData";
			}
		}


		public string sendESignaturesRequestEmail(
			 string token,
			 string peopleId,
			 string planId,
			 string signatureId,
			 string vendorId,
			 string webpageURL,
			 string reportDataID,
			 DistributedTransaction transaction)
		{
			if (tokenValidator(token) == false) return null;
			logger.debug("sendESignaturesRequestEmail");

			var parameters = new Dictionary<string, string>
			{
				{ "@token", token },
				{ "@peopleId", peopleId },
				{ "@planId", planId },
				{ "@signatureId", signatureId },
				{ "@vendorId", vendorId },
				{ "@webpageURL", webpageURL },
				{ "@reportDataID", reportDataID },
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_sendESignaturesRequestEmail", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_sendESignaturesRequestEmail");
				return "501-cov: error ANYW_ESignatures_sendESignaturesRequestEmail";
			}
		}


		public string generateAuthenticationCode(string tempUserId, string latitude, string longitude, DistributedTransaction transaction)
		{
			logger.debug("generateAuthenticationCode");

			var parameters = new Dictionary<string, string>
			{
				{ "@tempUserId", tempUserId },
				{ "@latitude", latitude },
				{ "@longitude", longitude }
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_GenerateAuthenticationCode", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_GenerateAuthenticationCode");
				return "501-cov: error ANYW_ESignatures_GenerateAuthenticationCode";
			}
		}


		public string getSignerLoginMessageData(string tempUserId, DistributedTransaction transaction)
		{
			logger.debug("getSignerLoginMessageData");

			var parameters = new Dictionary<string, string>
			{
				{ "@tempUserId", tempUserId }
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_GetSignerLoginMessageData", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_GetSignerLoginMessageData");
				return "501-cov: error ANYW_ESignatures_GetSignerLoginMessageData";
			}
		}


		public string getReportParameters(string tempUserId, DistributedTransaction transaction)
		{
			logger.debug("getReportParameters");

			var parameters = new Dictionary<string, string>
			{
				{ "@tempUserId", tempUserId }
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_GetReportParameters", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_GetReportParameters");
				return "501-cov: error ANYW_ESignatures_GetReportParameters";
			}
		}


		public string verifyESignLogin(string tempUserId, string hashedPassword, DistributedTransaction transaction)
		{
			var parameters = new Dictionary<string, string>
			{
				{ "@tempUserId", tempUserId },
				{ "@hashedPassword", hashedPassword }
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_VerifyESignLogin", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("verifyESignLogin", ex.Message + " DBA.ANYW_ESignatures_VerifyESignLogin()");
				return "500: Internal Server Error";
			}
		}

        public string updateESignFormValues(
           string peopleId,
           string planId,
           string csChangeMind,
           string csChangeMindSSAPeopleId,
           string csContact,
           string csContactProviderVendorId,
           string csContactInput,
           string csRightsReviewed,
           string csAgreeToPlan,
           string csFCOPExplained,
           string csDueProcess,
           string csResidentialOptions,
           string csSupportsHealthNeeds,
           string csTechnology,
           string dissentAreaDisagree,
           string dissentHowToAddress,
           string dateSigned,
           string signatureImage,
		   //string userIPAddress,
           DistributedTransaction transaction)
        {
            logger.debug("updateESignFormValues");

            var parameters = new Dictionary<string, string>
            {
                { "@peopleId", peopleId },
                { "@planId", planId },
                { "@csChangeMind", csChangeMind },
                { "@csChangeMindSSAPeopleId", csChangeMindSSAPeopleId },
                { "@csContact", csContact },
                { "@csContactProviderVendorId", csContactProviderVendorId },
                { "@csContactInput", csContactInput },
                { "@csRightsReviewed", csRightsReviewed },
                { "@csAgreeToPlan", csAgreeToPlan },
                { "@csFCOPExplained", csFCOPExplained },
                { "@csDueProcess", csDueProcess },
                { "@csResidentialOptions", csResidentialOptions },
                { "@csSupportsHealthNeeds", csSupportsHealthNeeds },
                { "@csTechnology", csTechnology },
                { "@dissentAreaDisagree", dissentAreaDisagree },
                { "@dissentHowToAddress", dissentHowToAddress },
                { "@dateSIgned", dateSigned },
                { "@signatureImage", signatureImage },
				//{ "@userIPAddress", userIPAddress },
            };

            try
            {
                return CallStoredProcedure("DBA.ANYW_ESignatures_UpdateESignFormValues", parameters, transaction);
            }
            catch (Exception ex)
            {
                logger.error("501-cov", ex.Message + " ANYW_ESignatures_UpdateESignFormValues");
                return "501-cov: error ANYW_ESignatures_UpdateESignFormValues";
            }
        }


		public string sendSignedConfirmationEmail(string planId, string peopleId, DistributedTransaction transaction)
		{
			logger.debug("sendSignedConfirmationEmail");

			var parameters = new Dictionary<string, string>
			{
				{ "@planId", planId },
				{ "@peopleId", peopleId }
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_sendSignedConfirmationEmail", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_sendSignedConfirmationEmail");
				return "501-cov: error ANYW_ESignatures_sendSignedConfirmationEmail";
			}
		}


		public string getESignerData(string tempUserId, DistributedTransaction transaction)
		{
			logger.debug("getESignerData");

			var parameters = new Dictionary<string, string>
			{
				{ "@tempUserId", tempUserId }
			};

			try
			{
				return CallStoredProcedure("DBA.ANYW_ESignatures_GetESignerData", parameters, transaction);
			}
			catch (Exception ex)
			{
				logger.error("501-cov", ex.Message + " ANYW_ESignatures_GetESignerData");
				return "501-cov: error ANYW_ESignatures_GetESignerData";
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