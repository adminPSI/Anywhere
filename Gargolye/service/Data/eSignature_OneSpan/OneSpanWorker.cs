using Anywhere.service.Data.eSignature_OneSpan;
using OneSpanSign.Sdk;
using OneSpanSign.Sdk.Builder;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.eSignature___OneSpan
{
    public class OneSpanWorker
    {
        private static String apiUrl = "https://sandbox.esignlive.com/api";
        // USE https://apps.e-signlive.com/api FOR PRODUCTION
        private static String apiKey = "MEhOb1ptNkhXd1FaOnhqSTdUYXZlaFowSQ==";
        //OssClient ossClient = new OssClient(apiKey, apiUrl);
        OneSpanDataGetter osdg = new OneSpanDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        

        public string oneSpanBuildSigners(string packageName, string documentName, string filePath, string[] emails, string[] names, MemoryStream ms)
        {
            //Will need to pass the assessmentId so that the names and emails can be queried from the database
            //if (tokenValidator(token) == false) return null;
            //if (!osdg.validateToken(token))
            //{
            //    return null;
            //}
            //else
            //{
            //    osdg.getNamesForSignatures(assessmentId);
            //}
            //Good code below
            PackageBuilder superPackage = PackageBuilder.NewPackageNamed(packageName);
            packageName = "Franklin County One Span Demo";

            int i = 0;
            foreach (string email in emails)
            {
                string fullName = names[i];
                var name = fullName.Split(' ');
                Signer signer = SignerBuilder.NewSignerWithEmail(email)
                        .WithFirstName(name[0])
                        .WithLastName(name[1])
                        .Build();
                superPackage.WithSigner(signer);
                i++;
            }

            return createDocument(documentName, filePath, emails, names, superPackage, ms);
        }

        public string createDocument(string documentName, string filePath, string[] emails, string[] names, PackageBuilder package, MemoryStream ms)
        {
            FileStream fs = File.OpenRead(@"C:\Users\mike.taft\OneSpanDemo.pdf");
            //FileStream fs = File.OpenRead(filePath);

            DocumentBuilder document = DocumentBuilder.NewDocumentNamed("Franklin County One Span Demo")
                                .FromStream(fs, DocumentType.PDF)
                                .EnableExtraction();
            //int offSet = 50;
            //int dateOffSet = 35;
            int i = 0;
            foreach (string email in emails)
            {
                string anchor = names[i] + " Signature";
                string dateAnchor = names[i] + " Date";
                Signature sig1 = SignatureBuilder.SignatureFor(email)
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
                //offSet = offSet + 50;
                //dateOffSet = dateOffSet + 50;
                i++;
            }

            return sendToOneSpan(package, document);
        }

        public string sendToOneSpan(PackageBuilder package, DocumentBuilder document)
        {
            package.WithDocument(document);
            DocumentPackage pack = package.Build();
            //PackageId packageId = ossClient.CreatePackage(pack);
            //ossClient.SendPackage(packageId);

            return "success";
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
