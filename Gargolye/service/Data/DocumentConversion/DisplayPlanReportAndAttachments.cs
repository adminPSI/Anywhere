using Anywhere.Data;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Text;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.DocumentConversion.DisplayPlanReportAndAttachments;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using static PSIOISP.Deserialize;
using System.Web.Services.Description;
using pdftron.PDF;
using pdftron.Filters;
using pdftron.SDF;
using pdftron.FDF;
using System.Collections;
using iTextSharp.text.pdf;
using iTextSharp.text;

namespace Anywhere.service.Data.DocumentConversion
{
    public class DisplayPlanReportAndAttachments
    {
        PlanReport planRep = new PlanReport();
        DataGetter dg = new DataGetter();
        AllAttachmentsDataGetter aadg = new AllAttachmentsDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        PDFGenerator.Data obj = new PDFGenerator.Data();
        PDFDoc doc = new PDFDoc();

        public PlanAndWorkflowAttachments[] getPlanAndWorkFlowAttachments(string token, string assessmentId)
        {
            bool isTokenValid = aadg.ValidateToken(token);
            if (isTokenValid)
            {
                string pAWAttach = aadg.getPlanAndWorkFlowAttachments(assessmentId);
                PlanAndWorkflowAttachments[] pAWAttachObj = js.Deserialize<PlanAndWorkflowAttachments[]>(pAWAttach);
                return pAWAttachObj;
            }
            else
            {
                return null;
            }
        }

        public void addSelectedAttachmentsToReport(string token, string[] attachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            bool isTokenValid = aadg.ValidateToken(token);
            PDFDoc new_doc;
            if (isTokenValid)
            {
                Attachment attachment = new Attachment();
                List<byte[]> allAttachments = new List<byte[]>();
                byte[] new_byte_output = null; 
                byte[] planReport = getISPReportStream(token, userId, assessmentID, versionID, extraSpace, isp);
                allAttachments.Add(planReport);
                foreach (string attachId in attachmentIds)
                {                    
                    PDFViewCtrl view = new PDFViewCtrl();
                    attachment = getPlanAttachment(attachId, "");
                    
                    
                    if (attachment.filename.ToUpper().Contains("PDF")){
                        
                        new_byte_output = StreamExtensions.ToByteArray(attachment.data);
                        
                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;
                    }
                    else if(attachment.filename.ToUpper().Contains("DOCX") || attachment.filename.ToUpper().Contains("XLS") || attachment.filename.ToUpper().Contains("XLSX"))
                    {
                        if (attachment.filename.ToUpper().Contains("XLS"))
                        {
                            attachment.filename = attachment.filename.Replace("xlsx", "pdf");
                        }
                        if(attachment.filename.ToUpper().Contains("DOCX"))
                        {
                            attachment.filename = attachment.filename.Replace("docx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains("XLS"))
                        {
                            attachment.filename = attachment.filename.Replace("xls", "pdf");
                        }
                        byte[] nAttachment = displayAttachment(attachment);
                        var filter = new MemoryFilter(nAttachment.Length, true);
                        var filterWriter = new FilterWriter(filter);
                        filterWriter.WriteBuffer(nAttachment);
                        filterWriter.Flush();
                        pdftron.PDF.Convert.OfficeToPDF(doc, filter, null);
                        
                        new_byte_output = doc.Save(SDFDoc.SaveOptions.e_linearized);                        
                        
                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;
                    }
                    else
                    {
                        attachment.filename = attachment.filename.Replace("xlsx", "pdf");
                        byte[] nAttachment = displayAttachment(attachment);
                        var filter = new MemoryFilter(nAttachment.Length, true);
                        var filterWriter = new FilterWriter(filter);
                        filterWriter.WriteBuffer(nAttachment);
                        filterWriter.Flush();
                        pdftron.PDF.Convert.OfficeToPDF(doc, filter, null);
                        
                        new_byte_output = doc.Save(SDFDoc.SaveOptions.e_linearized);
                        
                        allAttachments.Add(new_byte_output);
                        new_byte_output = null;
                    }
                    
                }

                byte[] finalMergedArray = concatAndAddContent(allAttachments);
                response.Clear();
                response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ";");
                response.ContentType = "application/pdf";                
                response.BinaryWrite(finalMergedArray);

            }

        }

        public static byte[] concatAndAddContent(List<byte[]> pdfByteContent)
        {

            using (var ms = new MemoryStream())
            {
                using (var doc = new Document())
                {
                    using (var copy = new PdfSmartCopy(doc, ms))
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

        //static void SimpleConvert(String input_filename, String output_filename)
        //{
        //    // Start with a PDFDoc (the conversion destination)
        //    using (PDFDoc pdfdoc = new PDFDoc())
        //    {
        //        // Loading bytes of the file into an in-memory array
        //        byte[] byte_array = System.IO.File.ReadAllBytes(input_path + input_filename);

        //        // instantiate filter with byte array
        //        var filter = new MemoryFilter(byte_array.Length, true);
        //        var filterWriter = new FilterWriter(filter);
        //        filterWriter.WriteBuffer(byte_array);
        //        filterWriter.Flush();

        //        // perform the conversion with no optional parameters
        //        pdftron.PDF.Convert.OfficeToPDF(pdfdoc, filter, null);

        //        // save the result into an in-memory byte array
        //        byte[] new_byte_output = pdfdoc.Save(SDFDoc.SaveOptions.e_linearized);
        //        File.WriteAllBytes(output_path + output_filename, new_byte_output);

        //        // And we're done!
        //        Console.WriteLine("Saved" + output_filename);
        //    }
        //}

        public Attachment getPlanAttachment(string attachmentId, string section)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            
            try
            {
                attachment.filename = aadg.getPlanAttachmentFileName(attachmentId, section);
                attachment.data = aadg.GetAttachmentData(attachmentId);//reused
            }
            catch (Exception ex)
            {

            }
            // return displayAttachment(attachment);
            return attachment;
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

        public void viewISPReportAndAttachments(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            bool isTokenValid = aadg.ValidateToken(token);
            if (isTokenValid)
            {
                List<byte[]> allAttachments = new List<byte[]>();
                byte[] planReport = getISPReportStream(token, userId, assessmentID, versionID, extraSpace, isp);
                allAttachments.Add(planReport);
                string planAttachments = aadg.getPlanAttachmentsWithOrdering(assessmentID);
                js.MaxJsonLength = Int32.MaxValue;
                PlanAttachments[] planAttachmentsObj = js.Deserialize<PlanAttachments[]>(planAttachments);
                foreach(PlanAttachments planAttach in planAttachmentsObj)
                {
                    if (planAttach.attachmentType.ToString().ToUpper() == "PDF")
                    {
                        byte[] planAttachment = StreamExtensions.ToByteArray(planAttach.attachment);
                        allAttachments.Add(planAttachment);
                    }
                    else {
                        //Nothing yet
                    }
                }
                string workflowAttachments = aadg.getWorkFlowAttachmentswithOrdering(assessmentID);
                js.MaxJsonLength = Int32.MaxValue;
                WorkFlowAttachments[] workflowAttachmentsObj = js.Deserialize<WorkFlowAttachments[]>(planAttachments);
                foreach(WorkFlowAttachments wfAttach in workflowAttachmentsObj)
                {
                    if(wfAttach.attachmentType.ToString().ToUpper() == "PDF")
                    {
                        byte[] wfAttachment = StreamExtensions.ToByteArray(wfAttach.attachment);
                        allAttachments.Add(wfAttachment);
                    }
                }
            }

        }

        public byte[] getISPReportStream(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            MemoryStream ms = null;
            ms = planRep.createAssessmentReport(token, userId, assessmentID, versionID, extraSpace, isp);
            //ms.Flush();
            byte[] planReport = StreamExtensions.ToByteArray(ms);
            ms.Close();
            ms.Dispose();
            
            return planReport;
        }

        public class Attachment
        {
            public string filename { get; set; }
            public MemoryStream data { get; set; }
        }

        public class PlanAndWorkflowAttachments
        {
            public string attachmentId { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
            public string sectionOrGroup { get; set; }
            public string orderOrStep { get; set; }
            public string whereFrom { get; set; }

        }

        public class PlanAttachments
        {
            public MemoryStream attachment { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
        }

        public class WorkFlowAttachments
        {
            public MemoryStream attachment { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
        }

        public class POrWFAttachment
        {
            public MemoryStream attachment { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
        }

    }
}