using Anywhere.service.Data.DocumentConversion;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Drawing.Imaging;
using Newtonsoft.Json.Linq;
using System.Web;

namespace Anywhere.service.Data.ESign
{
    public class ESignWorker
    {
        ESignDataGetter esdg = new ESignDataGetter();

        public string saveReportAndSendESignEmail(string token, ESignatureTeamMemberData[] eSignatureTeamMemberData, ESignReportData reportData)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
            {
                foreach (var teamMemberData in eSignatureTeamMemberData)
                {

                        string planAttachmentIds = JoinStringArray(reportData.planAttachmentIds);
                        string wfAttachmentIds = JoinStringArray(reportData.wfAttachmentIds);
                        string sigAttachmentIds = JoinStringArray(reportData.sigAttachmentIds);

                        // Saves relavant report parameters so report can be ran when signer logs in
                        string esigRdId = esdg.saveESignReportData(token, reportData.assessmentID, reportData.versionID, planAttachmentIds, wfAttachmentIds, sigAttachmentIds,
                        reportData.include.ToString(), teamMemberData.peopleId, teamMemberData.vendorId, transaction);

                        var jsonArray = JArray.Parse(esigRdId);
                        string reportDataID = jsonArray[0]["ESig_RD_ID"].ToString();

                        // Sends out the email to the signer with a link for them to log in with
                        esdg.sendESignaturesRequestEmail(token, teamMemberData.peopleId, teamMemberData.planId, teamMemberData.signatureId, teamMemberData.vendorId, teamMemberData.webpageURL, reportDataID, transaction);
                }

                return "success";
            }
            catch (Exception ex)
            {
                // Log or handle any exceptions
                Console.WriteLine($"Error: {ex.Message}");
                return "false";
            }
        }

        public string generateAuthenticationCode(string tempUserId, string latitude, string longitude)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
            {
                    HttpContext context = HttpContext.Current;
                    string userIPAddress = context.Request.ServerVariables["REMOTE_ADDR"];

                    esdg.generateAuthenticationCode(tempUserId, latitude, longitude, userIPAddress, transaction);
                return "success";
            }
            catch (Exception ex)
            {
                // Log or handle any exceptions
                Console.WriteLine($"Error: {ex.Message}");
                return "false";
            }
        }

        public LoginMessageData getSignerLoginMessageData(string tempUserId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
            {
                string result = esdg.getSignerLoginMessageData(tempUserId, transaction);
                // Deserialize the returned string into a list of LoginMessageData objects
                List<LoginMessageData> loginMessageDataList = JsonConvert.DeserializeObject<List<LoginMessageData>>(result);

                // Access the first item in the list
                LoginMessageData loginMessageData = loginMessageDataList[0];
                return loginMessageData;
            }
            catch (Exception ex)
            {
                // Log or handle any exceptions
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }

        public string openESignturesEditor(string tempUserId)
        {
            System.IO.MemoryStream msdocument = null;
            MemoryStream response = new MemoryStream();
            PDFGenerator.Data obj = new PDFGenerator.Data();

            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
            {
                string result = esdg.getReportParameters(tempUserId, transaction);
                List<ESignReportData> loginMessageDataList = JsonConvert.DeserializeObject<List<ESignReportData>>(result);
                string[] planAttachmentIds = loginMessageDataList[0].planAttachmentIds;
                string[] wfAttachmentIds = loginMessageDataList[0].wfAttachmentIds;
                string[] sigAttachmentIds = loginMessageDataList[0].sigAttachmentIds;

                DisplayPlanReportAndAttachments dpra = new DisplayPlanReportAndAttachments();

               msdocument = dpra.addSelectedAttachmentsToReportThree(loginMessageDataList[0].token, "", loginMessageDataList[0].assessmentID, loginMessageDataList[0].versionID, loginMessageDataList[0].include,
                   loginMessageDataList[0].extraSpace.ToString(), planAttachmentIds, wfAttachmentIds, sigAttachmentIds);

                return Convert.ToBase64String(msdocument.ToArray());

            }
            catch (Exception ex)
            {

            }
            return Convert.ToBase64String(msdocument.ToArray());
        }

        public string verifyESignLogin(string tempUserId, string hashedPassword)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
            {
                string result = esdg.verifyESignLogin(tempUserId, hashedPassword, transaction);
                List<VerificationResult> verificationResults = JsonConvert.DeserializeObject<List<VerificationResult>>(result);
                string resultString = verificationResults[0].verificationResult;

                return resultString;
            }
            catch (Exception ex)
            {
                // Log or handle any exceptions
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }

        public string updateESignFormValues(ESignFormData formData)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
                {
                    string signatureImageString = "";

                    DateTime currentDateTime = DateTime.UtcNow;
                    string dateString = currentDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture);

                    byte[] signatureImage = createImage(dateString, formData.applicationName);
                    signatureImageString = Convert.ToBase64String(signatureImage);

                    // Update the DB with the signature data
                    esdg.updateESignFormValues(formData.peopleId, formData.planId, formData.csChangeMind, formData.csChangeMindSSAPeopleId, formData.csContact, formData.csContactProviderVendorId,
                    formData.csContactInput, formData.csRightsReviewed, formData.csAgreeToPlan, formData.csFCOPExplained, formData.csDueProcess, formData.csResidentialOptions, formData.csSupportsHealthNeeds,
                    formData.csTechnology, formData.dissentAreaDisagree, formData.dissentHowToAddress, dateString, signatureImageString, transaction);

                    // Send confirmation email to the case manager that the plan was signed
                    esdg.sendSignedConfirmationEmail(formData.planId, formData.peopleId, transaction);

                    return "success";
                }
                catch (Exception ex)
                {
                    // Log or handle any exceptions
                    Console.WriteLine($"Error: {ex.Message}");
                    return null;
                }
        }

        public ESignerData getESignerData(string tempUserId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                try
            {
                string result = esdg.getESignerData(tempUserId, transaction);
                List<ESignerData> eSignerData = JsonConvert.DeserializeObject<List<ESignerData>>(result);

                return eSignerData[0];
            }
            catch (Exception ex)
            {
                // Log or handle any exceptions
                Console.WriteLine($"Error: {ex.Message}");
                return null;
            }
        }

        public byte[] createImage(string date, string applicationName)
        {
            string topLine = "Electronically signed via";
            string bottomLine = applicationName + " Anywhere";
            //string bottomLine = "on " + date + " GMT";
            int width = 2000;
            int height = 400;
            using (Bitmap image = new Bitmap(width, height))
            {
                using (Graphics g = Graphics.FromImage(image))
                {
                    g.Clear(Color.White);

                    Font font = new Font("Arial", 85, FontStyle.Regular);
                    Brush brush = Brushes.Black;

                    int xTopLine = (width - (int)g.MeasureString(topLine, font).Width) / 2;
                    int xBottomLine = (width - (int)g.MeasureString(bottomLine, font).Width) / 2;
                    int y = (height - (int)g.MeasureString(topLine, font).Height * 3) / 2;

                    g.DrawString(topLine, font, brush, new PointF(xTopLine, y));
                    g.DrawString(bottomLine, font, brush, new PointF(xBottomLine, y + font.Height));
                }

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    image.Save(memoryStream, ImageFormat.Png);
                    return memoryStream.ToArray();
                }
            }
        }

        public static string JoinStringArray(string[] stringArray)
        {
            if (stringArray == null || stringArray.Length == 0)
            {
                return string.Empty;
            }
            return string.Join("|", stringArray);
        }

        public static string[] SplitString(string joinedString)
        {
            if (string.IsNullOrEmpty(joinedString))
            {
                return new string[0];
            }
            return joinedString.Split('|');
        }

        public class AttachmentIdsConverter : JsonConverter<string[]>
        {
            public override string[] ReadJson(JsonReader reader, Type objectType, string[] existingValue, bool hasExistingValue, JsonSerializer serializer)
            {
                var value = (string)reader.Value;
                return string.IsNullOrEmpty(value) ? new string[0] : value.Split('|');
            }

            public override void WriteJson(JsonWriter writer, string[] value, JsonSerializer serializer)
            {
                var joined = value == null || value.Length == 0 ? string.Empty : string.Join("|", value);
                writer.WriteValue(joined);
            }
        }

        public class ESignReportData
        {
            public string assessmentID { get; set; }
            public string versionID { get; set; }
            public bool extraSpace { get; set; }

            [JsonConverter(typeof(AttachmentIdsConverter))]
            public string[] planAttachmentIds { get; set; }

            [JsonConverter(typeof(AttachmentIdsConverter))] 
            public string[] wfAttachmentIds { get; set; }

            [JsonConverter(typeof(AttachmentIdsConverter))] 
            public string[] sigAttachmentIds { get; set; }

            public bool DODDFlag { get; set; }
            public bool signatureOnly { get; set; }
            public string include { get; set; }
            public bool toDODD { get; set; }
            public string token { get; set; }
        }

        public class ESignatureTeamMemberData
        {
            public string peopleId { get; set; }
            public string planId { get; set; }
            public string signatureId { get; set; }
            public string vendorId { get; set; }
            public string webpageURL { get; set; }
        }

        public class LoginMessageData
        {
            public string maskedFirstName { get; set; }
            public string maskedLastName { get; set; }
            public string tempUserEmail { get; set; }
        }

        public class VerificationResult
        {
            public string verificationResult { get; set; }
        }

        public class ESignFormData
        {
            public string peopleId { get; set; }
            public string planId { get; set; }
            public string csChangeMind { get; set; }
            public string csChangeMindSSAPeopleId { get; set; }
            public string csContact { get; set; }
            public string csContactProviderVendorId {  get; set; }
            public string csContactInput { get; set; }
            public string csRightsReviewed { get; set; }
            public string csAgreeToPlan { get; set; }
            public string csFCOPExplained { get; set; }
            public string csDueProcess { get; set; }
            public string csResidentialOptions {  get; set; }
            public string csSupportsHealthNeeds { get; set; }
            public string csTechnology { get; set; }
            public string dissentAreaDisagree { get; set; }
            public string dissentHowToAddress { get; set; }
            public string applicationName { get; set; }
        }

        public class ESignerData
        {
            public string peopleId { get; set; }
            public string planId { get; set; }
            public string teamMemberType { get; set; }
            public string applicationName { get; set; }
            public string ssaName { get; set; }
            public string ssaPeopleId { get; set; }
            public string vendorName { get; set; }
            public string vendorId { get; set; }
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
        }
}
