using Anywhere.service.Data.eSignature_OneSpan;
using Anywhere.service.Data.PlanInformedConsent;
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
                string packageName = "this is a test";
                string documentName = "This is a  test";
                string filePath = "this is a test";

                long assessmentId = long.Parse(assessmentID);
                string input = osdg.OneSpanGetSignatures(token, assessmentId);

                List<Dictionary<string, string>> result = JsonConvert.DeserializeObject<List<Dictionary<string, string>>>(input);

                string[] emails = { "erick.bey@primarysolutions.net", "erickbey10@gmail.com", "erickbey10@yahoo.com" };

                //List<string> emails = new List<string>();
                List<string> namesList = new List<string>();
                List<string> memberTypesList = new List<string>();
                List<string> signatureIdsList = new List<string>();

                foreach (var item in result)
                {
                    //emails.Add(item["email"]);
                    namesList.Add(item["name"]);
                    memberTypesList.Add(item["teamMember"]);
                    signatureIdsList.Add(item["signatureId"]);
                }

                string[] names = namesList.ToArray();
                string[] memberTypes = memberTypesList.ToArray();
                string[] signatureIds = signatureIdsList.ToArray();
                //TODO: Find out how to not send a last name
                string lastName = "N/A";

                PackageBuilder superPackage = PackageBuilder.NewPackageNamed(packageName);
                packageName = "Testing Package";

                int i = 0;
                foreach (string email in emails)
                {
                    // TODO: add if statement to exclude 'no signature required' sig type
                    string fullName = names[i];
                    var name = fullName.Split(' ');
                    if (name.Length > 1)
                    {
                        lastName = name[1];
                    }

                    Signer signer = SignerBuilder.NewSignerWithEmail(email)
                            .WithFirstName(name[0])
                            .WithLastName(lastName)
                            .WithCustomId(signatureIds[i])
                            .Build();
                    superPackage.WithSigner(signer);

                    i++;
                }

                return createDocument(documentName, filePath, emails, names, memberTypes, superPackage, ms);
            }
        }

        public Field createRadioButton(string answerType, string groupName, string idName, int i, string anchorText, int occurence)
        {
            int xOffset = 717;
            int yOffset = 3;

            if (answerType == "N")
            {
                xOffset = 804;
            }
            else if (answerType == "N/A")
            {
                xOffset = 913;
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

        public string createDocument(string documentName, string filePath, string[] emails, string[] names, string[] memberTypes, PackageBuilder package, MemoryStream ms)
        {
            FileStream fs = File.OpenRead(@"C:\Windows\Temp\OneSpanDemo.pdf");

            DocumentBuilder document = DocumentBuilder.NewDocumentNamed("Franklin County One Span Demo")
                                .FromStream(ms, DocumentType.PDF)
                                .EnableExtraction();

            int occurence = 0;
            int i = 0;
            foreach (string email in emails)
            {
                string anchor = names[i] + " Signature";
                string dateAnchor = names[i] + " Date";
               
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

                if (memberTypes[i] == "Guardian" || memberTypes[i] == "Person Supported" || memberTypes[i] == "Parent/Guardian")
                {
                    Signature sig1 = SignatureBuilder.SignatureFor(email)
                                        .WithName(email)
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
                                                                    .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(dateAnchor)
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
                    Signature sig1 = SignatureBuilder.SignatureFor(email)
                                        .WithName(email)
                                           .WithPositionAnchor(TextAnchorBuilder.NewTextAnchor(anchor)
                                                                    .AtPosition(TextAnchorPosition.TOPLEFT)
                                                                    .WithSize(150, 40)
                                                                    .WithOffset(1, 8)
                                                                    .WithCharacter(0)
                                                                    .WithOccurrence(0))
                                                                    .WithField(FieldBuilder.SignatureDate()
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

            return sendToOneSpan(package, document);
        }

        public string sendToOneSpan(PackageBuilder package, DocumentBuilder document)
        {
            package.WithDocument(document);
            DocumentPackage pack = package.Build();
            PackageId packageId = ossClient.CreatePackage(pack);
            ossClient.SendPackage(packageId);
            string newPackageId = packageId.Id;

            // osdg.OneSpanInsertPackageId(string token, long planId, string newPackageId, string signedStatus);

            return "success";
        }

        public string oneSpanGetSignedDocuments(string token, string packageId, string[] signatureIds)
        {
            PlanInformedConsentDataGetter picdg = new PlanInformedConsentDataGetter();
            PackageId currentPackageId = new PackageId(packageId);
            DocumentPackage sentPackage = ossClient.GetPackage(currentPackageId);
            DocumentPackageStatus packageStatus = sentPackage.Status;

            // Signing Status Output Options: "Draft", "In Progress", "Completeted", "Opted Out", "Declined", "Expired", "Archived"
            // Changing the second parameter to a signerId from the document will retreive the signing status for that particular signer
            SigningStatus signingStatus = ossClient.GetSigningStatus(currentPackageId, null, null);

            if (signingStatus.ToString().Equals("COMPLETE"))
            {
                byte[] zipContent = ossClient.DownloadZippedDocuments(currentPackageId);
                File.WriteAllBytes(@"C:\Users\erick.bey\Downloads"
                                    + "/package-documents.zip", zipContent);

                byte[] evidenceContent = ossClient.DownloadEvidenceSummary(currentPackageId);
                File.WriteAllBytes(@"C:\Users\erick.bey\Downloads"
                                    + "/evidence-summary.pdf", evidenceContent);


                
                List<FieldSummary> fieldSummaries = ossClient.FieldSummaryService.GetFieldSummary(new PackageId(packageId));

                var fieldIds = new List<string> { "csChangeMind", "csChangeMindSSAPeopleId", "csContact", "csContactProviderVendorId", "csContactInput", "csRightsReviewed", "csAgreeToPlan", "csFCOPExplained", "csDueProcess", "csResidentialOptions", "csSupportsHealthNeeds", "csTechnology" };

                foreach (string sigId in signatureIds)
                {
                    string signerId = sigId;
                    var filteredFieldSummaries = fieldSummaries.Where(f => f.SignerId == signerId);

                    Dictionary<string, string> fieldDictionary = new Dictionary<string, string>();
                    fieldDictionary.Add("signatureId", sigId);

                    foreach (var fieldSummary in filteredFieldSummaries)
                    {
                        
                        string fieldId = Regex.Replace(fieldSummary.FieldId, "-.*", "");
                        if (fieldIds.Contains(fieldId))
                        {
                            fieldDictionary.Add(fieldId, fieldSummary.FieldName);
                        }
                    }

                    foreach (var fieldId in fieldIds)
                    {
                        if (!fieldDictionary.ContainsKey(fieldId))
                        {
                            fieldDictionary.Add(fieldId, "");
                        }
                    }
                    osdg.updateOneSpanPlanConsentStatements(
                        token,
                        fieldDictionary["signatureId"],
                        fieldDictionary["csChangeMind"],
                        fieldDictionary["csContact"],
                        fieldDictionary["csContactInput"],
                        fieldDictionary["csRightsReviewed"],
                        fieldDictionary["csAgreeToPlan"],
                        fieldDictionary["csFCOPExplained"],
                        fieldDictionary["csDueProcess"],
                        fieldDictionary["csResidentialOptions"],
                        fieldDictionary["csSupportsHealthNeeds"],
                        fieldDictionary["csTechnology"]
                    );
                }
            }
            else
            {
                return "Documents have not been signed";
            }
            // If we are successful there might be a function to reload the values in the checkboxes on the front end
            return "Successfully downloaded the signed documents";
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
