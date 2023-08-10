using Anywhere.service.Data.eSignature_OneSpan;
using Newtonsoft.Json;
using OneSpanSign.Sdk;
using OneSpanSign.Sdk.Builder;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Drawing;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;
using System.Web.UI.MobileControls.Adapters;
using static Anywhere.service.Data.eSignature___OneSpan.OneSpanWorker;
using System;
using System.Drawing;
using System.Drawing.Imaging;
using Org.BouncyCastle.Cms;
using System.Net;

namespace Anywhere.service.Data.eSignature___OneSpan
{
    public class OneSpanWorker
    {
        private static String apiUrl = "https://sandbox.esignlive.com/api";
        private static String apiUrlToken = "https://sandbox.esignlive.com/apitoken/clientApp/accessToken";
        //private static String apiUrl = "https://sandbox.esignlive.com/apitoken/clientApp/accessToken";
        // USE https://apps.e-signlive.com/api FOR PRODUCTION
        private static String apiKey = "MEhOb1ptNkhXd1FaOnhqSTdUYXZlaFowSQ==";
        private static string tokenOS = "";
        OssClient ossClient = new OssClient(apiKey, apiUrl);
        OneSpanDataGetter osdg = new OneSpanDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public void generateToken()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls11 | SecurityProtocolType.Tls12 | SecurityProtocolType.Ssl3;

            var httpWebRequest = (HttpWebRequest)WebRequest.Create(apiUrlToken);
            httpWebRequest.ContentType = "application/json";
            httpWebRequest.Method = "POST";
            using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
            {

                string json = new JavaScriptSerializer().Serialize(new
                {
                    clientId = "1850dcdebdd0a5a712d58cf1a12",
                    secret = "68796472616f4c5a350113d22f22e4c5e9bca733483456acd0a7513ef0862e8077d6370e49",
                    type = "OWNER"
                });

                streamWriter.Write(json);
            }

            var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
            using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
            {
                var result = streamReader.ReadToEnd();
                var tokenResult = JsonConvert.DeserializeObject<TokenResponse>(result);
                tokenOS = tokenResult.accessToken;
            }
            //return tokenOS;
        }

        public class TokenResponse
        {
            public string accessToken { get; set; }
        }

        public string oneSpanBuildSigners(string token, string assessmentID, MemoryStream ms)
        //public string oneSpanBuildSigners(string token)
        {
            generateToken();
            OssClient ossClient = new OssClient(tokenOS, apiUrl);
            //string applicationVersion = ossClient.SystemService.GetApplicationVersion();
            if (tokenValidator(token) == false) return null;
            if (!osdg.validateToken(token))
            {
                return null;
            }
            else
            {
                long assessmentId = long.Parse(assessmentID);
                // Gathers all the signatures for the plan
                string input = osdg.OneSpanGetSignatures(token, assessmentId);

                List<Dictionary<string, string>> result = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(input);

                // Create a list for each category for signers
                List<string> emailsList = new List<string>();
                List<string> namesList = new List<string>();
                List<string> memberTypesList = new List<string>();
                List<string> signatureIdsList = new List<string>();
                List<string> signatureTypeList = new List<string>();
                List<string> dateSignedList = new List<string>();

                // Seperates the signers info into lists
                foreach (var item in result)
                {
                    emailsList.Add(item["email"]);
                    namesList.Add(item["name"]);
                    memberTypesList.Add(item["teamMember"]);
                    signatureIdsList.Add(item["signatureId"]);
                    signatureTypeList.Add(item["signatureType"]);
                    dateSignedList.Add(item["dateSigned"]);
                }

                // Gets the senders info
                string senderInfo = osdg.getSenderInfo(token);
                OneSpanSender[] senderInfoObj = JsonConvert.DeserializeObject<OneSpanSender[]>(senderInfo);

                // Sets the senders info
                string senderFirstName = senderInfoObj[0].FirstName;
                string senderLastName = senderInfoObj[0].LastName;
                SenderInfoBuilder sender = SenderInfoBuilder
                    .NewSenderInfo(senderInfoObj[0].Email)
                    .WithName(senderFirstName, senderLastName);

                // Sets default last name value if one is not provided
                string lastName = "(No Last Name Provided)";
                string packageName = "Plan Report";

                PackageBuilder superPackage = PackageBuilder.NewPackageNamed(packageName).WithSenderInfo(sender);

                int i = 0;
                List<OneSpanSigner> allOneSpanSigners = new List<OneSpanSigner>();

                // Loop over every email to create a signer object and add to the list of signers
                foreach (string sigId in signatureIdsList)
                {
                    string fullName = namesList[i];
                    string[] splitName = fullName.Trim().Split(' ');

                    if (splitName.Length > 1)
                    {
                        lastName = string.Join(" ", splitName, 1, splitName.Length - 1);
                    }

                    OneSpanSigner oneSpanSigner = new OneSpanSigner()
                    {
                        Email = emailsList[i],
                        FirstName = splitName[0],
                        LastName = lastName,
                        SignatureId = sigId,
                        MemberType = memberTypesList[i],
                        DateSigned = dateSignedList[i],
                        SignatureType = signatureTypeList[i]
                    };

                    allOneSpanSigners.Add(oneSpanSigner);

                    i++;
                    lastName = "(No Last Name Provided)";
                }

                //return "";
                return createDocument(token, assessmentID, allOneSpanSigners, namesList, superPackage, ms, ossClient);
            }
        }

        public Field createRadioButton(string answerType, string groupName, string idName, int i, string anchorText, int occurence)
        {
            // The i parameter allows fieldIds to have the same names to be grabbed later on when checking for values
            // The occurence parameter moves the radio button field to the next set of radio buttons within the generated document
            int xOffset = 717;
            int yOffset = 3;

            if (answerType == "N")
            {
                xOffset = 805;
            }
            else if (answerType == "NA")
            {
                xOffset = 911;
            }

            Field oneSpanRadioButton = FieldBuilder.RadioButton(groupName)
                .WithId(idName + i)
                .WithName(answerType)
                .WithSize(16, 16)
                .WithValidation(FieldValidatorBuilder.Basic().Required())
                .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchorText)
                                                                        .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                        .WithSize(15, 15)
                                                                        .WithCharacter(0)
                                                                        .WithOffset(xOffset, yOffset)
                                                                        .WithOccurrence(occurence))
                .Build();

            return oneSpanRadioButton;
        }

        public Field createTextAreaField(string idName, int i, string anchorText, string teamMemberType)
        {
            int textAreaXOffset = 175;
            int textAreaWidth = 360;
            int textAreaHeight = 40;

            // Change size and xOffset for "How To Address" grid box
            if (idName == "dissentHowToAddress-")
            {
                textAreaXOffset = 537;
                textAreaWidth = 225;
            }

            // If the team member type is Parent, Day Provider, or Other, make the text area height smaller
            if (teamMemberType == "Parent" || teamMemberType == "Day Provider" || teamMemberType == "Other")
            {
                textAreaHeight = 20;
            }
            else if (teamMemberType == "Home Provider Vendor")
            {
                textAreaHeight = 60;
            }

            // Set character limit
            FieldValidator characterLimit = FieldValidatorBuilder.Basic()
                .MaxLength(2500)
                .Build();

            Field textAreaInput = FieldBuilder.TextArea()
                .WithId(idName + i)
                .WithFontSize(10)
                .WithValidation(characterLimit)
                .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchorText)
                                                                        .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                        .WithSize(textAreaWidth, textAreaHeight)
                                                                        .WithCharacter(0)
                                                                        .WithOccurrence(1)
                                                                        .WithOffset(textAreaXOffset, 0))
            .Build();
            return textAreaInput;
        }

        public string createDocument(string token, string assessmentID, List<OneSpanSigner> allSigners, List<string> names, PackageBuilder package, MemoryStream ms, OssClient ossClient)
        {
            DocumentBuilder document = DocumentBuilder.NewDocumentNamed("Plan Report")
                                .FromStream(ms, DocumentType.PDF)
                                .WithId("Plan_Report")
                                .EnableExtraction();

            // array of names used in FieldId and DB
            string[] groupNames = {
                    "csChangeMind",
                    "csContact",
                    "csSupportsHealthNeeds",
                    "csRightsReviewed",
                    "csAgreeToPlan",
                    "csTechnology",
                    "csFCOPExplained",
                    "csDueProcess",
                    "csResidentialOptions"
                };

            // array of unique text for anchoring radio buttons
            string[] descriptionAnchor = {
                    "I understand that I can change my mind at any time",
                    "I understand I can contact someone at",
                    "I agree this plan contains supports to meet my health and welfare needs ",
                    "Individual rights have been reviewed with me",
                    "I understand the purpose, benefits, and potential risks. I agree and consent to this entire plan",
                    "Technology solutions have been explored by my team and me",
                    "Free Choice Of Provider has been explained to me",
                    "I have been given my due process rights",
                    "I have been given information on residential options"
                };

            int occurence = 0;
            int i = 0;
            foreach (OneSpanSigner oneSpanSigner in allSigners)
            {
                // If not a digital signer type or if signer has already signed, skip to next signer
                if (oneSpanSigner.SignatureType != "1" || oneSpanSigner.DateSigned != "")
                {
                    occurence++;
                    i++;
                    continue;
                }
                string anchor = names[i] + " /";
                string dateAnchor = names[i] + " Date";

                Signer signer = SignerBuilder.NewSignerWithEmail(oneSpanSigner.Email)
                        .WithFirstName(oneSpanSigner.FirstName)
                        .WithLastName(oneSpanSigner.LastName)
                        .WithCustomId(oneSpanSigner.SignatureId)
                        .WithTitle(oneSpanSigner.MemberType)
                        .Build();
                package.WithSigner(signer);

                // If the team member type is "Guardian", "Person Supported", or "Parent/Guardian", create radio button fields
                if (oneSpanSigner.MemberType == "Guardian" || oneSpanSigner.MemberType == "Person Supported" || oneSpanSigner.MemberType == "Parent/Guardian")
                {
                    Signature sig1 = SignatureBuilder.SignatureFor(signer.Email)
                                        .WithName(signer.Email)

                                        // Create radio field section
                                        .WithField(createRadioButton("Y", groupNames[0], "csChangeMind-yes", i, descriptionAnchor[0], occurence))
                                        .WithField(createRadioButton("N", groupNames[0], "csChangeMind-no", i, descriptionAnchor[0], occurence))

                                        .WithField(createRadioButton("Y", groupNames[1], "csContact-yes", i, descriptionAnchor[1], occurence))
                                        .WithField(createRadioButton("N", groupNames[1], "csContact-no", i, descriptionAnchor[1], occurence))

                                        .WithField(createRadioButton("Y", groupNames[2], "csSupportsHealthNeeds-Yes", i, descriptionAnchor[2], occurence))
                                        .WithField(createRadioButton("N", groupNames[2], "csSupportsHealthNeeds-No", i, descriptionAnchor[2], occurence))

                                        .WithField(createRadioButton("Y", groupNames[3], "csRightsReviewed-Yes", i, descriptionAnchor[3], occurence))
                                        .WithField(createRadioButton("N", groupNames[3], "csRightsReviewed-No", i, descriptionAnchor[3], occurence))

                                        .WithField(createRadioButton("Y", groupNames[4], "csAgreeToPlan-Yes", i, descriptionAnchor[4], occurence))
                                        .WithField(createRadioButton("N", groupNames[4], "csAgreeToPlan-No", i, descriptionAnchor[4], occurence))

                                        .WithField(createRadioButton("Y", groupNames[5], "csTechnology-Yes", i, descriptionAnchor[5], occurence))
                                        .WithField(createRadioButton("N", groupNames[5], "csTechnology-No", i, descriptionAnchor[5], occurence))
                                        //.WithField(createRadioButton("NA", groupNames[5], "csTechnology-NA", i, descriptionAnchor[5], occurence))

                                        .WithField(createRadioButton("Y", groupNames[6], "csFCOPExplained-Yes", i, descriptionAnchor[6], occurence))
                                        .WithField(createRadioButton("N", groupNames[6], "csFCOPExplained-No", i, descriptionAnchor[6], occurence))
                                        .WithField(createRadioButton("NA", groupNames[6], "csFCOPExplained-NA", i, descriptionAnchor[6], occurence))

                                        .WithField(createRadioButton("Y", groupNames[7], "csDueProcess-Yes", i, descriptionAnchor[7], occurence))
                                        .WithField(createRadioButton("N", groupNames[7], "csDueProcess-No", i, descriptionAnchor[7], occurence))
                                        .WithField(createRadioButton("NA", groupNames[7], "csDueProcess-NA", i, descriptionAnchor[7], occurence))

                                        .WithField(createRadioButton("Y", groupNames[8], "csResidentialOptions-Yes", i, descriptionAnchor[8], occurence))
                                        .WithField(createRadioButton("N", groupNames[8], "csResidentialOptions-No", i, descriptionAnchor[8], occurence))
                                        .WithField(createRadioButton("NA", groupNames[8], "csResidentialOptions-NA", i, descriptionAnchor[8], occurence))

                                        // Creates dissenting opinion text area fields
                                        .WithField(createTextAreaField("dissentAreaDisagree-", i, anchor, signer.Title))
                                        .WithField(createTextAreaField("dissentHowToAddress-", i, anchor, signer.Title))

                                        // Creates signature and date signature fields
                                        .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                    .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                    .WithSize(150, 40)
                                                                    .WithOffset(450, 8)
                                                                    .WithCharacter(0)
                                                                    .WithOccurrence(0))
                                                                    .WithField(FieldBuilder.SignatureDate()
                                                                    .WithId("Date_Signed-" + i)
                                                                    .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                                            .AtPosition(TextAnchorPosition.BOTTOMLEFT)
                                                                                            .WithSize(75, 40)
                                                                                            .WithCharacter(4)
                                                                                            .WithOffset(725, 8)
                                                                                            .WithOccurrence(0)))
                                            .Build();
                    occurence += 1;

                    document.WithSignature(sig1);
                }
                else
                {
                    Signature sig1 = SignatureBuilder.SignatureFor(signer.Email)
                                        .WithName(signer.Email)

                                           // Creates dissenting opinion text area fields
                                           .WithField(createTextAreaField("dissentAreaDisagree-", i, anchor, signer.Title))
                                           .WithField(createTextAreaField("dissentHowToAddress-", i, anchor, signer.Title))

                                           // Creates signature and date signature fields
                                           .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                    .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                    .WithSize(150, 40)
                                                                    .WithOffset(450, 8)
                                                                    .WithCharacter(0)
                                                                    .WithOccurrence(0))
                                                                    .WithField(FieldBuilder.SignatureDate()
                                                                    .WithId("Date_Signed-" + i)
                                                                    .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                                            .AtPosition(TextAnchorPosition.BOTTOMLEFT)
                                                                                            .WithSize(75, 40)
                                                                                            .WithCharacter(4)
                                                                                            .WithOffset(725, 0)
                                                                                            .WithOccurrence(0)))
                                            .Build();
                    document.WithSignature(sig1);
                }

                i++;
            }

            return sendToOneSpan(token, assessmentID, package, document, ossClient);
        }

        public string sendToOneSpan(string token, string assessmentID, PackageBuilder package, DocumentBuilder document, OssClient ossClient)
        {
            package.WithDocument(document);
            DocumentPackage pack = package.Build();
            PackageId packageId = ossClient.CreatePackage(pack);
            ossClient.SendPackage(packageId);
            string newPackageId = packageId.Id;
            string signedStatus = "IN PROGRESS";

            osdg.OneSpanInsertPackageId(token, assessmentID, newPackageId, signedStatus);

            return "success";
        }

        public DocumentStatus[] oneSpanCheckDocumentStatus(string token, string assessmentId)
        {
            string documentStatusString = osdg.OneSpanCheckDocumentStatus(token, assessmentId);
            DocumentStatus[] documentStatus = js.Deserialize<DocumentStatus[]>(documentStatusString);

            return documentStatus;
        }

        public class DocumentStatus
        {
            public string packageId { get; set; }
            public string signedStatus { get; set; }
        }

        public byte[] createImage(string date, string name)
        {
            string firstName = "E-SIGNED by " + name; 
            string lastName = "on " + date + " GMT";
            int width = 1400;
            int height = 400;
            using (Bitmap image = new Bitmap(width, height))
            {
                using (Graphics g = Graphics.FromImage(image))
                {
                    g.Clear(Color.White);

                    Font font = new Font("Arial", 40, FontStyle.Regular);
                    Brush brush = Brushes.Black;

                    int xFirstName = (width - (int)g.MeasureString(firstName, font).Width) / 2;
                    int xLastName = (width - (int)g.MeasureString(lastName, font).Width) / 2;
                    //int xDate = (width - (int)g.MeasureString(date, font).Width) / 2;
                    int y = (height - (int)g.MeasureString(firstName, font).Height * 3) / 2;

                    g.DrawString(firstName, font, brush, new PointF(xFirstName, y));
                    g.DrawString(lastName, font, brush, new PointF(xLastName, y + font.Height));
                    //g.DrawString(date, font, brush, new PointF(xDate, y + font.Height * 2));
                }

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    image.Save(memoryStream, ImageFormat.Png);
                    return memoryStream.ToArray();
                }
            }
        }

        public string oneSpanGetSignedDocuments(string token, string packageId, string assessmentID)
        {
            long assessmentId = long.Parse(assessmentID);
            string input = osdg.OneSpanGetSignatures(token, assessmentId);
            bool updateTeamMemberTable = false;
            string signatureImageString = "";

            List<Dictionary<string, string>> result = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(input);
            List<string> signatureIds = new List<string>();
            List<string> datesSigned = new List<string>();
            List<string> signatureTypes = new List<string>();
            List<string> names = new List<string>();

            foreach (var item in result)
            {
                signatureIds.Add(item["signatureId"]);
                datesSigned.Add(item["dateSigned"]);
                signatureTypes.Add(item["signatureType"]);
                names.Add(item["name"]);
            }

            PackageId currentPackageId = new PackageId(packageId);
            DocumentPackage sentPackage = ossClient.GetPackage(currentPackageId);
            DocumentPackageStatus packageStatus = sentPackage.Status;

            // Sets the values from the documents radio buttons and assigns them to fieldIds using the fieldName as the value. This is all grouped by each signers signatureID so we can send each signers values to be updated in the DB
            List<FieldSummary> fieldSummaries = ossClient.FieldSummaryService.GetFieldSummary(new PackageId(packageId));

            var fieldIds = new List<string> {"csChangeMind", "csChangeMindSSAPeopleId", "csContact", "csContactProviderVendorId", "csContactInput", "csRightsReviewed", "csAgreeToPlan", "csFCOPExplained", "csDueProcess", "csResidentialOptions", "csSupportsHealthNeeds", "csTechnology", "dissentAreaDisagree", "dissentHowToAddress" };

            int i = 0;
            foreach (string sigId in signatureIds)
            {
                // If not a digital signer type or if signer has already signed, skip to next signer
                if (signatureTypes[i] != "1")
                {
                    i++;
                    continue;
                }

                SigningStatus individualSigningStatus = SigningStatus.SIGNING_PENDING;

                try
                {
                    individualSigningStatus = ossClient.GetSigningStatus(currentPackageId, sigId, null);
                } catch
                {
                    // Do nothing and continue with the rest of the function
                }

                // Checks if signer already has a completed signature in the DB, then checks if the signer has completed the one span signature
                if (datesSigned[i] == "" && (individualSigningStatus.ToString().Equals("SIGNING_COMPLETE") || individualSigningStatus.ToString().Equals("COMPLETE")))
                {
                    string signerId = sigId;
                    var filteredFieldSummaries = fieldSummaries.Where(f => f.SignerId == signerId);

                    Dictionary<string, string> fieldDictionary = new Dictionary<string, string>();
                    fieldDictionary.Add("signatureId", sigId);

                    foreach (var fieldSummary in filteredFieldSummaries)
                    {
                        // Removes the "-" character and the following characters from the fieldId
                        string fieldId = Regex.Replace(fieldSummary.FieldId, "-.*", "");
                        if (fieldIds.Contains(fieldId))
                        {
                            if (fieldId == "dissentAreaDisagree" || fieldId == "dissentHowToAddress")
                            {
                                fieldDictionary.Add(fieldId, fieldSummary.FieldValue);
                            }
                            else
                            {
                                fieldDictionary.Add(fieldId, fieldSummary.FieldName);
                            }

                        }

                        if (fieldId == "Date_Signed")
                        {
                            string dateString = fieldSummary.FieldValue;
                            DateTime dateTime = DateTime.ParseExact(dateString, "yyyy-MM-ddTHH:mm:ssZ", CultureInfo.InvariantCulture);
                            string date_signed = dateTime.ToString("yyyy-MM-dd");

                            // sets the format of time needed for signature image
                            string dateSignedImage = dateTime.ToString("yyyy-MM-dd HH:mm:ss");
                            fieldDictionary.Add(fieldId, date_signed);

                            byte[] signatureImage = createImage(dateSignedImage, names[i]);
                            signatureImageString = Convert.ToBase64String(signatureImage);
                        }
                    }

                    // Sets fields that are not present to empty strings which will be set to null when updating the db (important for signers that have no radio buttons)
                    foreach (var fieldId in fieldIds)
                    {
                        if (!fieldDictionary.ContainsKey(fieldId))
                        {
                            fieldDictionary.Add(fieldId, "");
                        }
                    }
                    osdg.UpdateOneSpanPlanConsentStatements(
                        token,
                        fieldDictionary["signatureId"],
                        fieldDictionary["Date_Signed"],
                        fieldDictionary["csChangeMind"],
                        fieldDictionary["csContact"],
                        fieldDictionary["csRightsReviewed"],
                        fieldDictionary["csAgreeToPlan"],
                        fieldDictionary["csFCOPExplained"],
                        fieldDictionary["csDueProcess"],
                        fieldDictionary["csResidentialOptions"],
                        fieldDictionary["csSupportsHealthNeeds"],
                        fieldDictionary["csTechnology"],
                        fieldDictionary["dissentAreaDisagree"],
                        fieldDictionary["dissentHowToAddress"],
                        signatureImageString
                    );
                    i++;
                    updateTeamMemberTable = true;
                }
                else
                {
                    i++;
                    continue;
                }
            }
            if (updateTeamMemberTable == true)
            {
                return "true";
            }
            else
            {
                return "false";
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

    public class OneSpanSigner
        {
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
            public string DateSigned { get; set; }
            public string MemberType { get; set; }
            public string SignatureId { get; set; }
            public string SignatureType { get; set; }
        }
        public class OneSpanSender
        {
            public string FirstName { get; set;}
            public string LastName { get; set;}
            public string Email { get; set;}
        }
    }
}
