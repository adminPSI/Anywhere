using Anywhere.Data;
using iTextSharp.text;
using iTextSharp.text.pdf;
using pdftron.Filters;
using pdftron.PDF;
using pdftron.SDF;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.DocumentConversion
{
    public class DisplayPlanReportAndAttachments
    {
        //PDFNet.Initialize("Gatekeeper/Anywhere, Advisor/Anywhere::W:AMS(20230512):4E77CBD11FD71AD02373727860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7");
        //pdftron.PDFNet.Initialize("Marshall Information Services, LLC (primarysolutions.net):OEM:Gatekeeper/Anywhere, Advisor/Anywhere::W:AMS(20230512):4E77CBD11FD71AD02373727860613FAD9766CD3BD5343BC2C76C38C054C2BEF5C7");

        PlanReport planRep = new PlanReport();
        DataGetter dg = new DataGetter();
        AllAttachmentsDataGetter aadg = new AllAttachmentsDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        GetReportsStreams grs = new GetReportsStreams();
        PDFGenerator.Data obj = new PDFGenerator.Data();
        AnywhereAssessmentWorker aaw = new AnywhereAssessmentWorker();
        AssessmentDataGetter adg = new AssessmentDataGetter();

        //  PDFDoc doc = new PDFDoc();

        public PlanAndWorkflowAttachments[] getPlanAndWorkFlowAttachments(string token, string assessmentId)
        {
            bool isTokenValid = aadg.ValidateToken(token);
            if (isTokenValid)
            {

                List<byte[]> allAttachments = new List<byte[]>();

                string planAttachments = aadg.getPlanAttachmentsWithOrdering(assessmentId);
                js.MaxJsonLength = Int32.MaxValue;
                PlanAttachments[] planAttachmentsObj = js.Deserialize<PlanAttachments[]>(planAttachments);

                string workflowAttachments = aadg.getWorkFlowAttachmentswithOrdering(assessmentId);
                js.MaxJsonLength = Int32.MaxValue;
                WorkFlowAttachments[] workflowAttachmentsObj = js.Deserialize<WorkFlowAttachments[]>(workflowAttachments);

                int wfL = workflowAttachmentsObj.Length;
                int planL = planAttachmentsObj.Length;
                int total = wfL + planL;
                string pAWAttach = aadg.getPlanAndWorkFlowAttachments(assessmentId);
                PlanAndWorkflowAttachments[] pAWAttachObj = js.Deserialize<PlanAndWorkflowAttachments[]>(pAWAttach);
                int i = 0;
                foreach (WorkFlowAttachments wfa in workflowAttachmentsObj)
                {
                    pAWAttachObj[i].attachmentId = wfa.attachmentId;
                    pAWAttachObj[i].description = wfa.description;
                    pAWAttachObj[i].attachmentType = wfa.attachmentType;
                    pAWAttachObj[i].sectionOrGroup = wfa.sectionOrGroup;
                    pAWAttachObj[i].orderOrStep = wfa.orderOrStep;
                    pAWAttachObj[i].whereFrom = wfa.whereFrom;
                    pAWAttachObj[i].sigAttachmentId = wfa.sigAttachmentId;
                    //    pAWAttachObj[i].workflowstepdocId = wfa.workflowstepdocId;
                    i++;
                }
                foreach (PlanAttachments wfa in planAttachmentsObj)
                {
                    pAWAttachObj[i].attachmentId = wfa.attachmentId;
                    pAWAttachObj[i].description = wfa.description;
                    pAWAttachObj[i].attachmentType = wfa.attachmentType;
                    pAWAttachObj[i].sectionOrGroup = wfa.sectionOrGroup;
                    pAWAttachObj[i].orderOrStep = wfa.orderOrStep;
                    pAWAttachObj[i].whereFrom = wfa.whereFrom;
                    pAWAttachObj[i].sigAttachmentId = wfa.sigAttachmentId;
                    //    pAWAttachObj[i].workflowstepdocId = wfa.workflowstepdocId;
                    i++;
                }
                //string pAWAttach = aadg.getPlanAndWorkFlowAttachments(assessmentId);
                //PlanAndWorkflowAttachments[] pAWAttachObj = js.Deserialize<PlanAndWorkflowAttachments[]>(pAWAttach);
                return pAWAttachObj;
            }
            else
            {
                return null;
            }
        }
        public string[] sendSelectedAttachmentsToDODD(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string planId, string consumerId)
        {
            string[] sendtoDODDResult = { };

            try
            {
                var psiOispDT = new PSIOISP.ISPDTData();
                WorkflowDataGetter wfdg = new WorkflowDataGetter();
                PlanDataGetter pdg = new PlanDataGetter();
                string sendPlanResult;
                bool planUploadSuccess = true;
                bool attachmentUploadSuccess = true;
                //string noAttachmentsMessage = string.Empty;

                long lngPlanId = long.Parse(planId);
                long lngConsumerId = long.Parse(consumerId);

                sendtoDODDResult = psiOispDT.UploadISP(lngConsumerId, lngPlanId);
            
                if (sendtoDODDResult[0] != "ISP Successfully Uploaded.")
                {
                    sendtoDODDResult[0] = "Error uploading ISP. Error details: <br><br> " + sendtoDODDResult[0];

                    return sendtoDODDResult;
                }
                if(wfAttachmentIds != null)
                {
                    if (wfAttachmentIds.Length > 0 && !wfAttachmentIds[0].Equals(""))
                    {
                        long wfAttachId;
                        //Repeatedly call this function to send attachments to DODD
                        foreach (string wfAttachmentId in wfAttachmentIds)
                        {
                            //Type cast wfAttachmentId from string to long
                            wfAttachId = long.Parse(wfAttachmentId);

                            // success -- Successful
                            string strsendtoDODDResult = psiOispDT.Attachment(wfAttachId, true);
                            if (strsendtoDODDResult == "Error" || strsendtoDODDResult == "")
                            {
                                sendtoDODDResult[0] = "Error uploading Workflow Attachment. Please try again.";

                                return sendtoDODDResult;
                            }

                        }
                    }
                }
                
                if(sigAttachmentIds != null)
                {
                    if (sigAttachmentIds.Length > 0 && !sigAttachmentIds[0].Equals(""))
                    {
                        long sigAttachId;
                        //Repeatedly call this function to send attachments to DODD
                        foreach (string sigAttachmentId in sigAttachmentIds)
                        {
                            //Type cast sigAttachmentId from string to long
                            sigAttachId = long.Parse(sigAttachmentId);

                            string strsendtoDODDResult = psiOispDT.Attachment(sigAttachId, false);
                            strsendtoDODDResult = psiOispDT.Attachment(sigAttachId, false);
                            if (strsendtoDODDResult == "Error" || strsendtoDODDResult == "")
                            {

                                sendtoDODDResult[0] = "Error uploading Signature Attachment. Please try again.";

                                return sendtoDODDResult;

                            //    return "Error uploading Signature Attachment. Please try again.";
                            }

                        }
                    }
                }
                
                if(planAttachmentIds != null)
                {
                    if (planAttachmentIds.Length != 0 && !planAttachmentIds[0].Equals(""))
                    {
                        long planAttachId;
                        //Repeatedly call this function to send attachments to DODD
                        foreach (string planAttachmentId in planAttachmentIds)
                        {
                            //Type cast planAttachmentId from string to long
                            planAttachId = long.Parse(planAttachmentId);

                            string strsendtoDODDResult = psiOispDT.Attachment(planAttachId, false);
                            
                            if (strsendtoDODDResult == "Error" || strsendtoDODDResult == "")
                            {
                                sendtoDODDResult[0] = "Error uploading Plan Attachment. Please try again.";

                                return sendtoDODDResult;

                                // return "Error uploading Plan Attachment. Please try again.";
                            }

                        }
                    }
                }
                
            }
            catch (Exception ex)
            {
                sendtoDODDResult[0] = "There was failure in the send process. Please contact your administrator." + ex.ToString();

                return sendtoDODDResult;

                //return "There was failure in the send process. Please contact your administrator." + ex.ToString();
            }

            if (wfAttachmentIds.Length == 0 && sigAttachmentIds.Length == 0 && planAttachmentIds.Length == 0)
            {
                aadg.setUploadUserId(token, planId);

                sendtoDODDResult[0] = "Successfully sent Plan to DODD.";

                return sendtoDODDResult;

                //return "Successfully sent Plan to DODD.";
            }
            else
            {
                aadg.setUploadUserId(token, planId);

                sendtoDODDResult[0] = "Successfully sent Plan and selected Attachments to DODD.";

                return sendtoDODDResult;

              //  return "Successfully sent Plan and selected Attachments to DODD.";
            }

            // }

        }

        public void addSelectedAttachmentsToReport(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            bool isTokenValid = aadg.ValidateToken(token);
            if (toONET == false) {
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

                if (false == signatureOnly) { 
                                
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
                if(toONET == true)
                {
                    string finalMergedArrayString = System.Convert.ToBase64String(finalMergedArray);
                    aaw.insertPlanReportToBeTranferredToONET(token, finalMergedArrayString, long.Parse(assessmentID));
                    //return "Plan successfully sent to OhioDD.net";
                }
                response.Clear();
                response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ";");
                response.ContentType = "application/pdf";
                response.BinaryWrite(finalMergedArray);
                //return "success";
            }
            //return "failed";
        }

        public string addSelectedAttachmentsToReportTwo(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include)
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
                if (toONET == true)
                {
                    string finalMergedArrayString = System.Convert.ToBase64String(finalMergedArray);
                    aaw.insertPlanReportToBeTranferredToONET(token, finalMergedArrayString, long.Parse(assessmentID));
                    return "Plan successfully sent to OhioDD.net";
                }
                
            }
            return "failed";
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
                    //else if (attachment.filename.ToUpper().Contains("DOCX") || attachment.filename.ToUpper().Contains("XLS") || attachment.filename.ToUpper().Contains("XLSX") || attachment.filename.ToUpper().Contains("DOC"))
                    //{
                    //    if (attachment.filename.ToUpper().Contains("XLSX"))
                    //    {
                    //        attachment.filename = attachment.filename.Replace("xlsx", "pdf");
                    //    }
                    //    if (attachment.filename.ToUpper().Contains("DOCX"))
                    //    {
                    //        attachment.filename = attachment.filename.Replace("docx", "pdf");
                    //    }
                    //    if (attachment.filename.ToUpper().Contains("XLS"))
                    //    {
                    //        attachment.filename = attachment.filename.Replace("xls", "pdf");
                    //    }
                    //    if (attachment.filename.ToUpper().Contains("DOC"))
                    //    {
                    //        attachment.filename = attachment.filename.Replace("doc", "pdf");
                    //    }
                    //    OfficeToPDFOptions options = new OfficeToPDFOptions();
                    //    options.GetSmartSubstitutionPluginPath();
                    //    byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);//displayAttachment(attachment);
                    //    var filter = new MemoryFilter(nAttachment.Length, true);
                    //    var filterWriter = new FilterWriter(filter);
                    //    filterWriter.WriteBuffer(nAttachment);
                    //    filterWriter.Flush();
                    //    pdftron.PDF.Convert.OfficeToPDF(doc, filter, null);
                    //    //filterWriter.Flush();

                    //    string pdfversion = doc.GetSDFDoc().GetHeader();
                    //    new_byte_output = doc.Save(SDFDoc.SaveOptions.e_linearized);

                    //    allAttachments.Add(new_byte_output);
                    //    new_byte_output = null;

                    //}
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

        //public SentToONETDate[] getSentToONETDate(string token, string assesmentId)
        //{
        //    string sentDate = adg.getSentToONETDate(token, assesmentId);
        //    SentToONETDate[] sentDateObj = js.Deserialize<SentToONETDate[]>(sentDate);

        //    return sentDateObj;
        //}

        public ReportSectionOrder[] getReportSectionOrder()
        {
            string reportOrderString = "";
            reportOrderString = aadg.getReportSectionOrder();
            ReportSectionOrder[] reportOrderObj = js.Deserialize<ReportSectionOrder[]>(reportOrderString);

            return reportOrderObj;
        }

        public MemoryStream generateReportForOneSpan(string token, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include)
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

            if (isTokenValid)
            {
                Attachment attachment = new Attachment();
                List<byte[]> allAttachments = new List<byte[]>();
                ReportSectionOrder[] order = getReportSectionOrder();
                MemoryStream assessment = new MemoryStream();
                MemoryStream intro = new MemoryStream();
                MemoryStream plan = new MemoryStream();

                if (false == signatureOnly)
                {
                    foreach (ReportSectionOrder ord in order)
                    {
                        if (ord.setting_value == "1" || ord.setting_value == "2" || ord.setting_value == "3" || ord.setting_value == "4" || ord.setting_value == "5" || ord.setting_value == "6")
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
                    // ... (existing logic for creating wfAttRep, sigAttRep, and planAttRep removed for simplicity)
                }

                if (false == signatureOnly)
                {
                    foreach (ReportSectionOrder ord in order)
                    {
                        if (ord.setting_value == "1" || ord.setting_value == "2" || ord.setting_value == "3" || ord.setting_value == "4" || ord.setting_value == "5" || ord.setting_value == "6")
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
                            // ... (existing logic for adding attachments to allAttachments removed for simplicity)
                        }
                    }
                }
                if (signatureOnly == true)
                {
                    allAttachments.Add(planReport);
                }

                byte[] finalMergedArray = concatAndAddContent(allAttachments);
                if (toONET == true)
                {
                    string finalMergedArrayString = System.Convert.ToBase64String(finalMergedArray);
                    aaw.insertPlanReportToBeTranferredToONET(token, finalMergedArrayString, long.Parse(assessmentID));
                    // return "Plan successfully sent to OhioDD.net";
                }

                // Instead of writing to the response, we'll create a MemoryStream and return it.
                MemoryStream memoryStream = new MemoryStream(finalMergedArray);
                return memoryStream;
            }
             return null;
        }


        public class SentToONETDate
        {
            public string sentDate { get; set; }
        }

        public class ReportSectionOrder
        {
            public string setting_key { get; set; }
            public string setting_value { get; set; }
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
            public string sigAttachmentId { get; set; }
            public string workflowstepdocId { get; set; }

        }

        public class PlanAttachments
        {
            public string attachmentId { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
            public string sectionOrGroup { get; set; }
            public string orderOrStep { get; set; }
            public string whereFrom { get; set; }
            public string sigAttachmentId { get; set; }
            public string workflowstepdocId { get; set; }
        }

        public class WorkFlowAttachments
        {
            public string attachmentId { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
            public string sectionOrGroup { get; set; }
            public string orderOrStep { get; set; }
            public string whereFrom { get; set; }
            public string sigAttachmentId { get; set; }
            public string workflowstepdocId { get; set; }
        }

        public class POrWFAttachment
        {
            public MemoryStream attachment { get; set; }
            public string description { get; set; }
            public string attachmentType { get; set; }
        }

        public class DODDResult
        {
            public string message { get; set; }
        }

        //public class POrWFAttachment
        //{
        //    public MemoryStream attachment { get; set; }
        //    public string description { get; set; }
        //    public string attachmentType { get; set; }
        //}

    }
}