using Anywhere.Data;
using iTextSharp.text.pdf;
using pdftron.Filters;
using pdftron.PDF;
using pdftron.SDF;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Management.Automation.Language;
using System.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.DocumentConversion.DisplayPlanReportAndAttachments;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using static PSIOISP.Deserialize;
using Anywhere.Data;
using iTextSharp.text;

namespace Anywhere.service.Data.DocumentConversion
{
    public class FinalizationButtonWorker
    {
        PlanReport planRep = new PlanReport();
        DataGetter dg = new DataGetter();
        AllAttachmentsDataGetter aadg = new AllAttachmentsDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        GetReportsStreams grs = new GetReportsStreams();
        PDFGenerator.Data obj = new PDFGenerator.Data();
        AnywhereAssessmentWorker aaw = new AnywhereAssessmentWorker();
        AssessmentDataGetter adg = new AssessmentDataGetter();
        DisplayPlanReportAndAttachments dpaa = new DisplayPlanReportAndAttachments();

        public string[] finalizationActions(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include, string planId, string consumerId)
        {
            string[] actions = new string[3];
            //Send to DODD
            string[] sendToDODD = dpaa.sendSelectedAttachmentsToDODD(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, planId, consumerId);
            //get the report in bytes
            byte[] report = createReportArray(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include);
            //Send to ONET
            string sendONET = sendToONET(token, report, assessmentID);
            //Send Email
            //string sendEmailResult = 
            return actions;
        }

        public ReportSectionOrder[] getReportSectionOrder()
        {
            string reportOrderString = "";
            reportOrderString = aadg.getReportSectionOrder();
            ReportSectionOrder[] reportOrderObj = js.Deserialize<ReportSectionOrder[]>(reportOrderString);

            return reportOrderObj;
        }

        public byte[] createReportArray(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            bool isTokenValid = aadg.ValidateToken(token);
            if (toONET == false)
            {
                pdftron.PDFNet.Initialize("Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::W+:AMS(20240512):89A5A05D0437C60A0320B13AC992737860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7");
                PDFDoc new_doc;
            }


            if (isTokenValid)//
            {
                Attachment attachment = new Attachment();
                List<byte[]> allAttachments = new List<byte[]>();
                List<byte[]> wfAttRep = new List<byte[]>();
                List<byte[]> sigAttRep = new List<byte[]>();
                List<byte[]> planAttRep = new List<byte[]>();
                //List<byte[]> planReportSections = new List<byte[]>();
                ReportSectionOrder[] order = getReportSectionOrder();
                MemoryStream assessment = new MemoryStream();
                MemoryStream intro = new MemoryStream();
                MemoryStream plan = new MemoryStream();

                if (false == signatureOnly)
                {
                    foreach (ReportSectionOrder ord in order)
                    {
                        if (ord.setting_value == "1")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                assessment = grs.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                intro = grs.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                            }
                        }
                        if (ord.setting_value == "2")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                assessment = grs.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);

                            }
                            if (ord.setting_key == "All About Me")
                            {
                                intro = grs.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                            }
                        }
                        if (ord.setting_value == "3")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                assessment = grs.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);

                            }
                            if (ord.setting_key == "All About Me")
                            {
                                intro = grs.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                            }
                        }
                        if (ord.setting_value == "4")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                assessment = grs.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);

                            }
                            if (ord.setting_key == "All About Me")
                            {
                                intro = grs.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                            }
                        }
                        if (ord.setting_value == "5")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                assessment = grs.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);

                            }
                            if (ord.setting_key == "All About Me")
                            {
                                intro = grs.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                            }
                        }
                        if (ord.setting_value == "6")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                assessment = grs.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);

                            }
                            if (ord.setting_key == "All About Me")
                            {
                                intro = grs.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                            }
                        }

                    }
                }
                if (signatureOnly == true)
                {
                    plan = grs.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
                }

                byte[] introReport = new byte[intro.Length];
                byte[] assessmentReport = new byte[intro.Length];

                if (signatureOnly == false)
                {
                    introReport = StreamExtensions.ToByteArray(intro);
                    intro.Close();
                    intro.Flush();
                    intro.Dispose();
                    assessmentReport = StreamExtensions.ToByteArray(assessment);
                    assessment.Close();
                    intro.Flush();
                    assessment.Dispose();

                }
                else
                {
                    intro.Close();
                    intro.Flush();
                    intro.Dispose();
                    assessment.Close();
                    intro.Flush();
                    assessment.Dispose();

                }

                byte[] planReport = StreamExtensions.ToByteArray(plan);
                plan.Close();
                intro.Flush();
                plan.Dispose();

                if (false == signatureOnly)
                {

                    if (wfAttachmentIds.Length > 0 && !wfAttachmentIds[0].Equals(""))
                    {
                        wfAttRep = wfAttReport(wfAttachmentIds);
                    }
                    if (sigAttachmentIds.Length > 0 && !sigAttachmentIds[0].Equals(""))
                    {
                        sigAttRep = sigAttReport(sigAttachmentIds);
                    }
                    if (planAttachmentIds.Length != 0 && !planAttachmentIds[0].Equals(""))
                    {
                        planAttRep = planAttReport(planAttachmentIds);
                    }
                }


                if (false == signatureOnly)
                {
                    foreach (ReportSectionOrder ord in order)
                    {
                        if (ord.setting_value == "1")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                allAttachments.Add(assessmentReport);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                allAttachments.Add(introReport);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                allAttachments.Add(planReport);
                            }
                            if (ord.setting_key == "Assessment Attachments")
                            {
                                if (planAttRep.Count != 0)
                                {
                                    foreach (byte[] att in planAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }

                            }
                            if (ord.setting_key == "Signature Attachments")
                            {
                                if (sigAttRep.Count != 0)
                                {
                                    foreach (byte[] att in sigAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                            if (ord.setting_key == "Workflow Attachments")
                            {
                                if (wfAttRep.Count != 0)
                                {
                                    foreach (byte[] att in wfAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                        }
                        if (ord.setting_value == "2")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                allAttachments.Add(assessmentReport);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                allAttachments.Add(introReport);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                allAttachments.Add(planReport);
                            }
                            if (ord.setting_key == "Assessment Attachments")
                            {
                                if (planAttRep.Count != 0)
                                {
                                    foreach (byte[] att in planAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }

                            }
                            if (ord.setting_key == "Signature Attachments")
                            {
                                if (sigAttRep.Count != 0)
                                {
                                    foreach (byte[] att in sigAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                            if (ord.setting_key == "Workflow Attachments")
                            {
                                if (wfAttRep.Count != 0)
                                {
                                    foreach (byte[] att in wfAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                        }
                        if (ord.setting_value == "3")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                allAttachments.Add(assessmentReport);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                allAttachments.Add(introReport);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                allAttachments.Add(planReport);
                            }
                            if (ord.setting_key == "Assessment Attachments")
                            {
                                if (planAttRep.Count != 0)
                                {
                                    foreach (byte[] att in planAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }

                            }
                            if (ord.setting_key == "Signature Attachments")
                            {
                                if (sigAttRep.Count != 0)
                                {
                                    foreach (byte[] att in sigAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                            if (ord.setting_key == "Workflow Attachments")
                            {
                                if (wfAttRep.Count != 0)
                                {
                                    foreach (byte[] att in wfAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                        }
                        if (ord.setting_value == "4")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                allAttachments.Add(assessmentReport);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                allAttachments.Add(introReport);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                allAttachments.Add(planReport);
                            }
                            if (ord.setting_key == "Assessment Attachments")
                            {
                                if (planAttRep.Count != 0)
                                {
                                    foreach (byte[] att in planAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }

                            }
                            if (ord.setting_key == "Signature Attachments")
                            {
                                if (sigAttRep.Count != 0)
                                {
                                    foreach (byte[] att in sigAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                            if (ord.setting_key == "Workflow Attachments")
                            {
                                if (wfAttRep.Count != 0)
                                {
                                    foreach (byte[] att in wfAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                        }
                        if (ord.setting_value == "5")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                allAttachments.Add(assessmentReport);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                allAttachments.Add(introReport);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                allAttachments.Add(planReport);
                            }
                            if (ord.setting_key == "Assessment Attachments")
                            {
                                if (planAttRep.Count != 0)
                                {
                                    foreach (byte[] att in planAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }

                            }
                            if (ord.setting_key == "Signature Attachments")
                            {
                                if (sigAttRep.Count != 0)
                                {
                                    foreach (byte[] att in sigAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                            if (ord.setting_key == "Workflow Attachments")
                            {
                                if (wfAttRep.Count != 0)
                                {
                                    foreach (byte[] att in wfAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                        }
                        if (ord.setting_value == "6")
                        {
                            if (ord.setting_key == "Assessment")
                            {
                                allAttachments.Add(assessmentReport);
                            }
                            if (ord.setting_key == "All About Me")
                            {
                                allAttachments.Add(introReport);
                            }
                            if (ord.setting_key == "Plan")
                            {
                                allAttachments.Add(planReport);
                            }
                            if (ord.setting_key == "Assessment Attachments")
                            {
                                if (planAttRep.Count != 0)
                                {
                                    foreach (byte[] att in planAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }

                            }
                            if (ord.setting_key == "Signature Attachments")
                            {
                                if (sigAttRep.Count != 0)
                                {
                                    foreach (byte[] att in sigAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                            if (ord.setting_key == "Workflow Attachments")
                            {
                                if (wfAttRep.Count != 0)
                                {
                                    foreach (byte[] att in wfAttRep)
                                    {
                                        allAttachments.Add(att);
                                    }
                                }
                            }
                        }
                    }
                }
                if (signatureOnly == true)
                {
                    allAttachments.Add(planReport);
                }


                byte[] finalMergedArray = concatAndAddContent(allAttachments);
                //if (toONET == true)
                //{
                //    string finalMergedArrayString = System.Convert.ToBase64String(finalMergedArray);
                //    aaw.insertPlanReportToBeTranferredToONET(token, finalMergedArrayString, long.Parse(assessmentID));
                //    //return "Plan successfully sent to OhioDD.net";
                //}
                //response.Clear();
                //response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ";");
                //response.ContentType = "application/pdf";
                //response.BinaryWrite(finalMergedArray);
                return finalMergedArray;
            }
            return null;
        }

        public string sendToONET(string token, byte[] finalMergedArray, string assessmentID)
        {
            string finalMergedArrayString = System.Convert.ToBase64String(finalMergedArray);
            return aaw.insertPlanReportToBeTranferredToONET(token, finalMergedArrayString, long.Parse(assessmentID));
        }

        public List<byte[]> wfAttReport(string[] wfAttachmentIds)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            Attachment attachment = new Attachment();
            List<byte[]> allAttachments = new List<byte[]>();
            byte[] new_byte_output = null;
            foreach (string attachId in wfAttachmentIds)
            {
                using (PDFDoc doc = new PDFDoc())
                {
                    PDFViewCtrl view = new PDFViewCtrl();
                    attachment = viewWFAttachment("", attachId, "");


                    if (attachment.filename.ToUpper().Contains("PDF"))
                    {

                        new_byte_output = StreamExtensions.ToByteArray(attachment.data);

                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;
                    }
                    else if (attachment.filename.ToUpper().Contains("DOCX") || attachment.filename.ToUpper().Contains("XLS") || attachment.filename.ToUpper().Contains("XLSX") || attachment.filename.ToUpper().Contains("DOC"))
                    {
                        if (attachment.filename.ToUpper().Contains("XLSX"))
                        {
                            attachment.filename = attachment.filename.Replace("xlsx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("DOCX"))
                        {
                            attachment.filename = attachment.filename.Replace("docx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("XLS"))
                        {
                            attachment.filename = attachment.filename.Replace("xls", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("DOC"))
                        {
                            attachment.filename = attachment.filename.Replace("doc", "pdf");
                        }

                        byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);//displayAttachment(attachment);
                        var filter = new MemoryFilter(nAttachment.Length, true);
                        var filterWriter = new FilterWriter(filter);
                        filterWriter.WriteBuffer(nAttachment);
                        filterWriter.Flush();
                        pdftron.PDF.Convert.OfficeToPDF(doc, filter, null);
                        //filterWriter.Flush();

                        string pdfversion = doc.GetSDFDoc().GetHeader();
                        new_byte_output = doc.Save(SDFDoc.SaveOptions.e_linearized);

                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;

                    }
                    else
                    {
                        string imageExt = "pdf";
                        //byte[] nAttachment = displayAttachment(attachment.data); // for demo purpose read from disk
                        byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);
                        int index = attachment.filename.LastIndexOf(".");
                        if (index >= 0)
                            attachment.filename = attachment.filename.Substring(0, index + 1);
                        ;
                        attachment.filename = attachment.filename + imageExt;
                        using (pdftron.Filters.MemoryFilter memoryFilter = new pdftron.Filters.MemoryFilter((int)nAttachment.Length, false)) // false = sink
                        {
                            pdftron.Filters.FilterWriter writer = new pdftron.Filters.FilterWriter(memoryFilter); // helper filter to allow us to write to buffer
                            writer.WriteBuffer(nAttachment);
                            writer.Flush();
                            memoryFilter.SetAsInputFilter(); // switch from sink to source

                            using (PDFDoc newDoc = new PDFDoc())
                            {
                                var filter = new MemoryFilter(nAttachment.Length, true);
                                var filterWriter = new FilterWriter(filter);
                                filterWriter.WriteBuffer(nAttachment);
                                filterWriter.Flush();
                                var options = new ConversionOptions();
                                //options.
                                pdftron.PDF.DocumentConversion documentConversion = pdftron.PDF.Convert.StreamingPDFConversion(newDoc, filter, null);
                                documentConversion.Convert();


                                byte[] pdfData = newDoc.Save(SDFDoc.SaveOptions.e_linearized);

                                allAttachments.Add(pdfData);
                                new_byte_output = null;

                            }
                        }
                    }

                }

            }
            return allAttachments;

        }

        public List<byte[]> sigAttReport(string[] wfAttachmentIds)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            Attachment attachment = new Attachment();
            List<byte[]> allAttachments = new List<byte[]>();
            byte[] new_byte_output = null;
            foreach (string attachId in wfAttachmentIds)
            {
                using (PDFDoc doc = new PDFDoc())
                {
                    PDFViewCtrl view = new PDFViewCtrl();
                    attachment = getPlanAttachment(attachId, "");


                    if (attachment.filename.ToUpper().Contains("PDF"))
                    {

                        new_byte_output = StreamExtensions.ToByteArray(attachment.data);

                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;
                    }
                    else if (attachment.filename.ToUpper().Contains("DOCX") || attachment.filename.ToUpper().Contains("XLS") || attachment.filename.ToUpper().Contains("XLSX") || attachment.filename.ToUpper().Contains("DOC"))
                    {
                        if (attachment.filename.ToUpper().Contains("XLSX"))
                        {
                            attachment.filename = attachment.filename.Replace("xlsx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("DOCX"))
                        {
                            attachment.filename = attachment.filename.Replace("docx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("XLS"))
                        {
                            attachment.filename = attachment.filename.Replace("xls", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("DOC"))
                        {
                            attachment.filename = attachment.filename.Replace("doc", "pdf");
                        }

                        byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);//displayAttachment(attachment);
                        var filter = new MemoryFilter(nAttachment.Length, true);
                        var filterWriter = new FilterWriter(filter);
                        filterWriter.WriteBuffer(nAttachment);
                        filterWriter.Flush();
                        pdftron.PDF.Convert.OfficeToPDF(doc, filter, null);
                        //filterWriter.Flush();

                        string pdfversion = doc.GetSDFDoc().GetHeader();
                        new_byte_output = doc.Save(SDFDoc.SaveOptions.e_linearized);

                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;

                    }
                    else
                    {
                        string imageExt = "pdf";
                        //byte[] nAttachment = displayAttachment(attachment.data); // for demo purpose read from disk
                        byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);
                        int index = attachment.filename.LastIndexOf(".");
                        if (index >= 0)
                            attachment.filename = attachment.filename.Substring(0, index + 1);
                        ;
                        attachment.filename = attachment.filename + imageExt;
                        using (pdftron.Filters.MemoryFilter memoryFilter = new pdftron.Filters.MemoryFilter((int)nAttachment.Length, false)) // false = sink
                        {
                            pdftron.Filters.FilterWriter writer = new pdftron.Filters.FilterWriter(memoryFilter); // helper filter to allow us to write to buffer
                            writer.WriteBuffer(nAttachment);
                            writer.Flush();
                            memoryFilter.SetAsInputFilter(); // switch from sink to source

                            using (PDFDoc newDoc = new PDFDoc())
                            {
                                var filter = new MemoryFilter(nAttachment.Length, true);
                                var filterWriter = new FilterWriter(filter);
                                filterWriter.WriteBuffer(nAttachment);
                                filterWriter.Flush();
                                var options = new ConversionOptions();
                                //options.
                                pdftron.PDF.DocumentConversion documentConversion = pdftron.PDF.Convert.StreamingPDFConversion(newDoc, filter, null);
                                documentConversion.Convert();


                                byte[] pdfData = newDoc.Save(SDFDoc.SaveOptions.e_linearized);

                                allAttachments.Add(pdfData);
                                new_byte_output = null;

                            }
                        }
                    }

                }

            }
            return allAttachments;

        }

        public List<byte[]> planAttReport(string[] planAttachmentIds)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            Attachment attachment = new Attachment();
            List<byte[]> allAttachments = new List<byte[]>();
            byte[] new_byte_output = null;
            foreach (string attachId in planAttachmentIds)
            {
                using (PDFDoc doc = new PDFDoc())
                {
                    PDFViewCtrl view = new PDFViewCtrl();
                    attachment = getPlanAttachment(attachId, "");


                    if (attachment.filename.ToUpper().Contains("PDF"))
                    {

                        new_byte_output = StreamExtensions.ToByteArray(attachment.data);

                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;
                    }      
                    else
                    {
                        string imageExt = "pdf";
                        //byte[] nAttachment = displayAttachment(attachment.data); // for demo purpose read from disk
                        byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);
                        int index = attachment.filename.LastIndexOf(".");
                        if (index >= 0)
                            attachment.filename = attachment.filename.Substring(0, index + 1);
                        ;
                        attachment.filename = attachment.filename + imageExt;
                        using (pdftron.Filters.MemoryFilter memoryFilter = new pdftron.Filters.MemoryFilter((int)nAttachment.Length, false)) // false = sink
                        {
                            pdftron.Filters.FilterWriter writer = new pdftron.Filters.FilterWriter(memoryFilter); // helper filter to allow us to write to buffer
                            writer.WriteBuffer(nAttachment);
                            writer.Flush();
                            memoryFilter.SetAsInputFilter(); // switch from sink to source

                            using (PDFDoc newDoc = new PDFDoc())
                            {
                                var filter = new MemoryFilter(nAttachment.Length, true);
                                var filterWriter = new FilterWriter(filter);
                                filterWriter.WriteBuffer(nAttachment);
                                filterWriter.Flush();
                                //var options = new ConversionOptions();
                                //OfficeToPDFOptions options = new OfficeToPDFOptions();
                                //var test = options.GetSmartSubstitutionPluginPath();
                                //options.SetSmartSubstitutionPluginPath(test);

                                pdftron.PDF.DocumentConversion documentConversion = pdftron.PDF.Convert.StreamingPDFConversion(newDoc, filter, null);
                                documentConversion.Convert();


                                byte[] pdfData = newDoc.Save(SDFDoc.SaveOptions.e_linearized);

                                allAttachments.Add(pdfData);
                                new_byte_output = null;
                            }
                        }
                    }

                }

            }
            return allAttachments;

        }

        public static byte[] concatAndAddContent(List<byte[]> pdfByteContent)
        {

            using (var ms = new MemoryStream())
            {
                using (var doc = new Document())
                {
                    using (var copy = new PdfCopy(doc, ms))
                    {
                        doc.Open();

                        //Loop through each byte array
                        foreach (var p in pdfByteContent)
                        {

                            //Create a PdfReader bound to that byte array
                            using (var reader = new PdfReader(p))
                            {
                                PdfReader.unethicalreading = true;
                                //Add the entire document instead of page-by-page
                                copy.AddDocument(reader);
                            }
                        }

                        doc.Close();
                    }
                }

                //Return just before disposing
                return ms.ToArray();
            }
        }

        
        public Attachment getPlanAttachment(string attachmentId, string section)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            char value = '-';
            bool guid = attachmentId.Contains(value);
            if (guid)
            {
                return viewWFAttachment("", attachmentId, section);
            }
            else
            {
                try
                {
                    attachment.filename = aadg.getPlanAttachmentFileName(attachmentId, section);
                    attachment.data = aadg.GetAttachmentData(attachmentId);//reused
                }
                catch (Exception ex)
                {

                }
                // return displayAttachment(attachment);
            }

            return attachment;
        }

        public Attachment viewWFAttachment(String token, String attachmentId, string section)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            bool isTokenValid = true;//anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    attachment.filename = dg.GetWFAttachmentFileName(attachmentId);
                    attachment.data = dg.GetWfAttachmentData(attachmentId);//reused
                }
                catch (Exception ex)
                {

                }
            }
            //logger.debug("Made it this far in attachment");
            return attachment;
            //displayAttachment(attachment);
        }

        public byte[] displayAttachment(Attachment attachment)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            try
            {
                response.Clear();
                if (attachment.filename == "")
                {
                    response.StatusCode = 404;
                    response.Status = "404 Not Found";
                }
                else
                {
                    byte[] bytes = StreamExtensions.ToByteArray(attachment.data);
                    response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ";");
                    response.ContentType = "application/octet-stream";
                    response.AddHeader("Transfer-Encoding", "identity");
                    response.BinaryWrite(bytes);
                    return bytes;
                }
                return null;
            }
            catch (Exception ex)
            {
                response.Write("Error: " + ex.InnerException.ToString());
                return null;
            }
            finally
            {
                //logger2.debug("Done?");
            }
        }
    }
}