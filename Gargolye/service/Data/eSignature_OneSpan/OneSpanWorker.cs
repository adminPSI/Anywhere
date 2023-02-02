using Anywhere.service.Data.eSignature_OneSpan;
using Anywhere.service.Data.PlanInformedConsent;
using CrystalDecisions.CrystalReports.ViewerObjectModel;
using iTextSharp.text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using OneSpanSign.Sdk;
using OneSpanSign.Sdk.Builder;
using OneSpanSign.Sdk.Services;
using Org.BouncyCastle.Cms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.IO.Packaging;
using System.Linq;
using System.Management.Automation.Language;
using System.Net.NetworkInformation;
using System.Reflection;
using System.Security.Cryptography.X509Certificates;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Script.Serialization;
using System.Web.UI.MobileControls;
using System.Web.UI.MobileControls.Adapters;
using System.Windows.Forms;


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
                string input = osdg.OneSpanGetSignatures(token, assessmentId);

                List<Dictionary<string, string>> result = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(input);

                string[] emails = { "erick.bey@primarysolutions.net", "erickbey10@gmail.com", "erickbey10@yahoo.com" };

                //List<string> emails = new List<string>();
                List<string> namesList = new List<string>();
                List<string> memberTypesList = new List<string>();
                List<string> signatureIdsList = new List<string>();
                List<string> signatureTypeList = new List<string>();

                foreach (var item in result)
                {
                    //emails.Add(item["email"]);
                    namesList.Add(item["name"]);
                    memberTypesList.Add(item["teamMember"]);
                    signatureIdsList.Add(item["signatureId"]);
                    signatureTypeList.Add(item["signatureType"]);
                }

                string[] names = namesList.ToArray();
                string[] memberTypes = memberTypesList.ToArray();
                string[] signatureIds = signatureIdsList.ToArray();
                string[] signatureTypes = signatureTypeList.ToArray();

                //TODO: Change these values to whatever Josh specifies
                string lastName = "N/A";
                string packageName = "this is a test";
                string documentName = "This is a  test";
                PackageBuilder superPackage = PackageBuilder.NewPackageNamed(packageName);
                packageName = "Testing Package";

                int i = 0;
                List<Signer> allSigners = new List<Signer>();
                foreach (string email in emails)
                {
                    // Does not create a signer if the user has "No Signature Required
                    if (signatureTypes[i] != "1")
                    {
                        i++;
                        continue;
                    }
                    string fullName = names[i];
                    var name = fullName.Trim().Split(' ');
                    if (name.Length > 1)
                    {
                        lastName = name[1];
                    }

                    Signer signer = SignerBuilder.NewSignerWithEmail(email)
                        .WithFirstName(name[0])
                        .WithLastName(lastName)
                        .WithCustomId(signatureIds[i])
                        .WithTitle(memberTypes[i])
                        .Build();
                    superPackage.WithSigner(signer);

                    allSigners.Add(signer);

                    i++;
                    lastName = "N/A";
                }

                return createDocument(token, assessmentID, allSigners, documentName, names, signatureTypes, superPackage, ms);
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

        public string createDocument(string token, string assessmentID, List<Signer> allSigners, string documentName, string[] names, string[]signatureTypes, PackageBuilder package, MemoryStream ms)
        {
            DocumentBuilder document = DocumentBuilder.NewDocumentNamed("Franklin County One Span Demo")
                                .FromStream(ms, DocumentType.PDF)
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
                // Skips creating the signatures if "No Signature Required" has been selected
                if (signatureTypes[i] != "1")
                {
                    i++;
                    continue;
                }
                string anchor = names[i] + " Signature";
                string dateAnchor = names[i] + " Date";

                if ( signer.Title == "Guardian" || signer.Title == "Person Supported" || signer.Title == "Parent/Guardian")
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

                                        .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                    .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                    .WithSize(150, 40)
                                                                    .WithOffset(1, 8)
                                                                    .WithCharacter(0)
                                                                    .WithOccurrence(0))
                                                                    .WithField(FieldBuilder.SignatureDate()
                                                                    .WithId("Date_Signed-" + i)
                                                                    .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                                            .AtPosition(TextAnchorPosition.BOTTOMLEFT)
                                                                                            .WithSize(75, 40)
                                                                                            .WithCharacter(4)
                                                                                            .WithOffset(-10, -7)
                                                                                            .WithOccurrence(0)))
                                            .Build();
                    occurence += 1;

                    document.WithSignature(sig1);
                }
                else
                {
                    Signature sig1 = SignatureBuilder.SignatureFor(signer.Email)
                                        .WithName(signer.Email)
                                           .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                    .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                    .WithSize(150, 40)
                                                                    .WithOffset(1, 8)
                                                                    .WithCharacter(0)
                                                                    .WithOccurrence(0))
                                                                    .WithField(FieldBuilder.SignatureDate()
                                                                    .WithId("Date_Signed-" + i)
                                                                    .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(dateAnchor)
                                                                                            .AtPosition(TextAnchorPosition.BOTTOMLEFT)
                                                                                            .WithSize(75, 40)
                                                                                            .WithCharacter(4)
                                                                                            .WithOffset(-10, -7)
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
                //TODO: Maybe save the completed PDF to the Plan_PDF column of ANYW_ISP_Consumer_Plans
                //TODO: update the db to show completed status
                byte[] zipContent = ossClient.DownloadZippedDocuments(currentPackageId);
                File.WriteAllBytes(@"C:\Users\erick.bey\Downloads"
                                    + "/package-documents.zip", zipContent);

                byte[] evidenceContent = ossClient.DownloadEvidenceSummary(currentPackageId);
                File.WriteAllBytes(@"C:\Users\erick.bey\Downloads"
                                    + "/evidence-summary.pdf", evidenceContent);

                updateTeamMemberTable = true;
            }

            // Code below sets the values from the documents radio buttons and assigns them to fieldIds using the fieldName as the value. This is all grouped by each signers signatureID so we can send each signers values to be updated in the DB
            List<FieldSummary> fieldSummaries = ossClient.FieldSummaryService.GetFieldSummary(new PackageId(packageId));

            var fieldIds = new List<string> { "csChangeMind", "csChangeMindSSAPeopleId", "csContact", "csContactProviderVendorId", "csContactInput", "csRightsReviewed", "csAgreeToPlan", "csFCOPExplained", "csDueProcess", "csResidentialOptions", "csSupportsHealthNeeds", "csTechnology" };

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
                        // Removes the "-" cahracter and the following characters from the fieldId
                        string fieldId = Regex.Replace(fieldSummary.FieldId, "-.*", "");
                        if (fieldIds.Contains(fieldId))
                        {
                            fieldDictionary.Add(fieldId, fieldSummary.FieldName);
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
                        fieldDictionary["csTechnology"]
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
