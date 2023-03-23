using Anywhere.service.Data.eSignature_OneSpan;
using Newtonsoft.Json;
using OneSpanSign.Sdk;
using OneSpanSign.Sdk.Builder;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web.Script.Serialization;


namespace Anywhere.service.Data.eSignature___OneSpan
{
    public class OneSpanWorker
    {
        private static String apiUrl = "https://sandbox.esignlive.com/api";
        // USE https://apps.e-signlive.com/api FOR PRODUCTION
        private static String apiKey = "MEhOb1ptNkhXd1FaOnhqSTdUYXZlaFowSQ==";
        OssClient ossClient = new OssClient(apiKey, apiUrl);
        OneSpanDataGetter osdg = new OneSpanDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();


        public string oneSpanBuildSigners(string token, string assessmentID, MemoryStream ms)
        {
            string applicationVersion = ossClient.SystemService.GetApplicationVersion();
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

                string[] emails = { "erickbey1@outlook.com", "erickbey10@gmail.com", "erickbey10@yahoo.com" };

                List<string> emailsList = new List<string>();
                List<string> namesList = new List<string>();
                List<string> memberTypesList = new List<string>();
                List<string> signatureIdsList = new List<string>();
                List<string> signatureTypeList = new List<string>();

                // Seperates the signers info into lists
                foreach (var item in result)
                {
                    emailsList.Add(item["email"]);
                    namesList.Add(item["name"]);
                    memberTypesList.Add(item["teamMember"]);
                    signatureIdsList.Add(item["signatureId"]);
                    signatureTypeList.Add(item["signatureType"]);
                }

                // Converts the lists into arrays
                string[] names = namesList.ToArray();
                string[] memberTypes = memberTypesList.ToArray();
                string[] signatureIds = signatureIdsList.ToArray();
                string[] signatureTypes = signatureTypeList.ToArray();

                // Sets the senders info
                string firstNameTest = "Your County Board";
                string lastNameTest = "of DD";
                SenderInfoBuilder sender = SenderInfoBuilder
                    .NewSenderInfo("mike.taft@primarysolutions.net")
                    .WithName(firstNameTest, lastNameTest);

                // Sets default last name value if one is not provided
                string lastName = "(No Last Name Provided)";
                string packageName = "Plan Report";
                PackageBuilder superPackage = PackageBuilder.NewPackageNamed(packageName).WithSenderInfo(sender);

                int i = 0;
                List<Signer> allSigners = new List<Signer>();
                // TODO: change emails to emailList when pushing to unit
                foreach (string email in emails)
                {
                    if (signatureTypes[i] != "1")
                    {
                        i++;
                        continue;
                    }
                    string fullName = names[i];
                    string[] splitName = fullName.Trim().Split(' ');

                    if (splitName.Length > 1)
                    {
                        lastName = string.Join(" ", splitName, 1, splitName.Length - 1);
                    }

                    Signer signer = SignerBuilder.NewSignerWithEmail(email)
                        .WithFirstName(splitName[0])
                        .WithLastName(lastName)
                        .WithCustomId(signatureIds[i])
                        .WithTitle(memberTypes[i])
                        .Build();
                    superPackage.WithSigner(signer);

                    allSigners.Add(signer);

                    i++;
                    lastName = "(No Last Name Provided)";
                }

                return createDocument(token, assessmentID, allSigners, names, signatureTypes, superPackage, ms);
            }
        }

        public Field createRadioButton(string answerType, string groupName, string idName, int i, string anchorText, int occurence)
        {
            // The i parameter allows fieldIds to have the same names to be grabbed later on when checking for values
            // The occurence parameter moves the radio button field to the next iteration of questions within the generated document
            int xOffset = 717;
            int yOffset = 3;

            if (answerType == "N")
            {
                xOffset = 805;
            }
            else if (answerType == "N/A")
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

        public Field createTextAreaField(string idName, int i, string anchorText)
        {
            FieldValidator characterLimit = FieldValidatorBuilder.Basic()
                .MaxLength(2500)
                .Build();

            Field textAreaInput = FieldBuilder.TextArea()
                .WithId(idName + i)
                .WithFontSize(12)
                .WithValidation(characterLimit)
                .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchorText)
                                                                        .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                        .WithSize(50, 50)
                                                                        .WithCharacter(0)
                                                                        .WithOffset(0, 50))
                .Build();

            return textAreaInput;
        }

        public string createDocument(string token, string assessmentID, List<Signer> allSigners, string[] names, string[] signatureTypes, PackageBuilder package, MemoryStream ms)
        {
            DocumentBuilder document = DocumentBuilder.NewDocumentNamed("Plan Report")
                                .FromStream(ms, DocumentType.PDF)
                                .WithId("Plan_Report")
                                .EnableExtraction();

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
            foreach (Signer signer in allSigners)
            {
                if (signatureTypes[i] != "1")
                {
                    i++;
                    continue;
                }
                string anchor = names[i] + " /";
                string dateAnchor = names[i] + " Date";

                if (signer.Title == "Guardian" || signer.Title == "Person Supported" || signer.Title == "Parent/Guardian")
                {
                    Signature sig1 = SignatureBuilder.SignatureFor(signer.Email)
                                        .WithName(signer.Email)
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
                                        .WithField(createRadioButton("N/A", groupNames[5], "csTechnology", i, descriptionAnchor[5], occurence))

                                        .WithField(createRadioButton("Y", groupNames[6], "csFCOPExplained-Yes", i, descriptionAnchor[6], occurence))
                                        .WithField(createRadioButton("N", groupNames[6], "csFCOPExplained-No", i, descriptionAnchor[6], occurence))
                                        .WithField(createRadioButton("N/A", groupNames[6], "csFCOPExplained", i, descriptionAnchor[6], occurence))

                                        .WithField(createRadioButton("Y", groupNames[7], "csDueProcess-Yes", i, descriptionAnchor[7], occurence))
                                        .WithField(createRadioButton("N", groupNames[7], "csDueProcess-No", i, descriptionAnchor[7], occurence))
                                        .WithField(createRadioButton("N/A", groupNames[7], "csDueProcess", i, descriptionAnchor[7], occurence))

                                        .WithField(createRadioButton("Y", groupNames[8], "csResidentialOptions-Yes", i, descriptionAnchor[8], occurence))
                                        .WithField(createRadioButton("N", groupNames[8], "csResidentialOptions-No", i, descriptionAnchor[8], occurence))
                                        .WithField(createRadioButton("N/A", groupNames[8], "csResidentialOptions", i, descriptionAnchor[8], occurence))

                                        //TODO: ADD IN THE TEXTAREA FIELDS
                                        .WithField(createTextAreaField("dissentAreaDisagree-", i, "Areas team members disagree"))
                                        .WithField(createTextAreaField("dissentHowToAddress-", i, "How to address"))

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
                    occurence += 1;

                    document.WithSignature(sig1);
                }
                else
                {
                    Signature sig1 = SignatureBuilder.SignatureFor(signer.Email)
                                        .WithName(signer.Email)
                                           //TODO: ADD IN THE TEXTAREA FIELDS
                                           .WithField(createTextAreaField("dissentAreaDisagree-", i, "Areas team members disagree"))
                                           .WithField(createTextAreaField("dissentHowToAddress-", i, "How to address"))

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

            return sendToOneSpan(token, assessmentID, package, document);
        }

        public string sendToOneSpan(string token, string assessmentID, PackageBuilder package, DocumentBuilder document)
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

        public string oneSpanGetSignedDocuments(string token, string packageId, string assessmentID)
        {
            long assessmentId = long.Parse(assessmentID);
            string input = osdg.OneSpanGetSignatures(token, assessmentId);
            bool updateTeamMemberTable = false;

            List<Dictionary<string, string>> result = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(input);
            List<string> signatureIds = new List<string>();
            List<string> datesSigned = new List<string>();

            foreach (var item in result)
            {
                signatureIds.Add(item["signatureId"]);
                datesSigned.Add(item["dateSigned"]);
            }

            PackageId currentPackageId = new PackageId(packageId);
            DocumentPackage sentPackage = ossClient.GetPackage(currentPackageId);
            DocumentPackageStatus packageStatus = sentPackage.Status;

            SigningStatus signingStatus = ossClient.GetSigningStatus(currentPackageId, null, null);

            if (signingStatus.ToString().Equals("COMPLETE"))
            {
                string signedStatus = signingStatus.ToString();

                updateTeamMemberTable = true;
                osdg.OneSpanUpdateDocumentSignedStatus(token, assessmentID, signedStatus);
            }

            // Code below sets the values from the documents radio buttons and assigns them to fieldIds using the fieldName as the value. This is all grouped by each signers signatureID so we can send each signers values to be updated in the DB
            List<FieldSummary> fieldSummaries = ossClient.FieldSummaryService.GetFieldSummary(new PackageId(packageId));

            var fieldIds = new List<string> { "csChangeMind", "csChangeMindSSAPeopleId", "csContact", "csContactProviderVendorId", "csContactInput", "csRightsReviewed", "csAgreeToPlan", "csFCOPExplained", "csDueProcess", "csResidentialOptions", "csSupportsHealthNeeds", "csTechnology", "dissentAreaDisagree", "dissentHowToAddress" };

            int i = 0;
            foreach (string sigId in signatureIds)
            {
                SigningStatus individualSigningStatus = ossClient.GetSigningStatus(currentPackageId, sigId, null);

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
                            fieldDictionary.Add(fieldId, date_signed);
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
                    // TODO: add in the textarea field values
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
                        fieldDictionary["dissentHowToAddress"]
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
    }
}
