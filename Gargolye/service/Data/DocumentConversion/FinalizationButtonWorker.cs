﻿using Anywhere.Data;
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
using static Anywhere.service.Data.AnywhereWorker;
using System.Net.Mail;
using Attachment = Anywhere.service.Data.DocumentConversion.DisplayPlanReportAndAttachments.Attachment;
using iTextSharp.text.pdf.qrcode;
using static Anywhere.service.Data.AnywhereAttachmentWorker;
using System.Text;
using System.Collections;


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

        public Emails[] getDefaultEmailsForFinalization(string token)
        {
            string emails = aadg.getDefaultEmailsForFinalization(token);
            Emails[] emailsObj = js.Deserialize<Emails[]>(emails);
            return emailsObj;
        }

        public class Emails
        {
            public string setting_value { get; set; }
        }

        public class ActionResults
        {
            public string[] actions { get; set; }
            public byte[] report { get; set; }
        }

        public class ReportTitle
        {
            public string reportTitle { get; set; }
        }

        public string getReportTitle(string assessmentID)
        {           
            string rtString = adg.getReportTitle(assessmentID);
            ReportTitle[] rtObj = js.Deserialize<ReportTitle[]>(rtString);

            return rtObj[0].reportTitle.ToString();
        }
        public ActionResults finalizationActions(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include, string peopleId, string[] emailAddresses, string[] checkBoxes, string[] wfAttachmentStepIds)
        {
            //selectAllCheck: true,
            //sendToDODDCheck: true,
            //sendToOhioNetCheck: true,
            //downloadReportCheck: true,
            //emailReportCheck: true,
            bool isTokenValid = aadg.ValidateToken(token);
            if (isTokenValid)
            {
                //ActionResults[] ar = new ActionResults[1];
                string[] sendToDODD = new string[5];
                string[] sendToDODDCombined = new string[1];
                string valueForDODD = "";
                string sendONET = "";
                string sendEmailResult = "";
                bool doddFailed = false;
                bool doddChecked = false;
                bool onetChecked = false;
                bool emailChecked = false;
                bool reportChecked = false;
                bool downloadReportCheck = false;
                int count = 0;

                string reportTitle = getReportTitle(assessmentID);
                if(checkBoxes.Length == 1 && checkBoxes[0] == "selectAllCheck")
                {
                    count = 4;
                }
                else
                {
                    count = checkBoxes.Length;
                }
                string[] actions = new string[4];
                byte[] report = null;
                bool reportCreated = false;
                int i = 0;
                foreach(string item in checkBoxes)
                {
                    if(item == "sendToDODDCheck" || item == "selectAllCheck")
                    {
                        //Send to DODD
                        sendToDODD = dpaa.sendSelectedAttachmentsToDODD(token, planAttachmentIds, wfAttachmentStepIds, sigAttachmentIds, assessmentID, peopleId);
                        foreach(string item2 in sendToDODD)
                        {
                            valueForDODD = valueForDODD  + item2 + "||";
                        }
                        if (sendToDODD[0].Contains("Error") || sendToDODD[0].Contains("Failure") || sendToDODD[0].Contains("Exception"))
                        {
                            actions[i] = "DODD " + valueForDODD;//"DODD Failed";
                            doddFailed = true;
                        }
                        else
                        {
                            actions[i] = "DODD Success";
                        }
                        
                        i++;
                    }
                    else
                    {

                        if (!doddChecked && !checkBoxes.Contains("sendToDODDCheck") && !checkBoxes.Contains("selectAllCheck"))
                        {
                            doddChecked = true;
                            actions[i] = "DODD Failed";
                            i++;
                        }

                    }
                    if ((item == "sendToOhioNetCheck" || item == "selectAllCheck") && doddFailed == false)
                    {
                        //Send to ONET
                        if(reportCreated == false)
                        {
                            report = createReportArray(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include, reportTitle);
                            reportCreated = true;
                        }
                        
                        sendONET = sendToONET(token, report, assessmentID);
                        actions[i] = "ONET " + sendONET;
                        i++;
                    }
                    else
                    {
                        
                        if (!onetChecked && !checkBoxes.Contains("sendToOhioNetCheck") && !checkBoxes.Contains("selectAllCheck"))
                        {
                            onetChecked = true;
                            actions[i] = "ONET Failed";
                            i++;
                        }else if (doddFailed && !onetChecked)
                        {
                            onetChecked = true;
                            actions[i] = "ONET Failed";
                            i++;
                        }
                        
                    }
                    if ((item == "emailReportCheck" || item == "selectAllCheck") && doddFailed == false)
                    {
                        if (reportCreated == false)
                        {
                            report = createReportArray(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include, reportTitle);
                            reportCreated= true;
                        }
                        //Send Email
                        //string binary = "";
                        //string s = System.Text.Encoding.UTF8.GetString(report, 0, report.Length);
                        //int len = s.Length;

                        //for (int j = 0; j < len; j++)
                        //{
                        //    binary += (char)s[j];
                        //}
                        
                        string abString = System.Convert.ToBase64String(report);//System.Convert.ToBase64String(Encoding.ASCII.GetBytes(binary));



                        foreach (string emailAddress in emailAddresses)
                        {
                            sendEmailResult = aadg.SendReportViaEmail(emailAddress, abString, reportTitle);
                        }
                        if(sendEmailResult == "Success")
                        {
                            actions[i] = "EMAIL " + sendEmailResult;
                        }
                        else
                        {
                            actions[i] = "EMAIL Failed";
                        }
                        
                        i++;
                    }
                    else
                    {
                        if (!emailChecked && !checkBoxes.Contains("emailReportCheck") && !checkBoxes.Contains("selectAllCheck"))
                        {
                            emailChecked = true;
                            actions[i] = "EMAIL Failed";
                            i++;
                        }else if (doddFailed && !emailChecked)
                        {
                            emailChecked = true;
                            actions[i] = "EMAIL Failed";
                            i++;
                        }
                        
                    }
                    if ((item == "downloadReportCheck" || item == "selectAllCheck") && doddFailed == false)
                    {
                        if (reportCreated == false)
                        {
                            report = createReportArray(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include, reportTitle);
                            reportCreated = true;
                        }
                        //ar[0].report.Equals(report); //= report;
                        if(report.Length > 250)
                        {
                            downloadReportCheck = true;
                            actions[i] = "REPORT Success";
                        }
                        else
                        {
                            actions[i] = "REPORT Failed";
                        }
                        
                        i++;

                        //Display Plan Report
                        //displayPlanReport(report);
                    }
                    else
                    {
                        if (!reportChecked && !checkBoxes.Contains("downloadReportCheck") && !checkBoxes.Contains("selectAllCheck"))
                        {
                            reportChecked = true;
                            actions[i] = "REPORT Failed";
                            //report = null;
                            i++;
                        }
                        else if (doddFailed && !reportChecked)
                        {
                            reportChecked = true;
                            actions[i] = "REPORT Failed";
                            i++;
                        }
                        
                    }
                }
                //Send to DODD
                //string[] sendToDODD = dpaa.sendSelectedAttachmentsToDODD(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, assessmentID, peopleId);
                //get the report in bytes
                //byte[] report = createReportArray(token, planAttachmentIds, wfAttachmentIds, sigAttachmentIds, userId, assessmentID, versionID, extraSpace, toONET, isp, oneSpan, signatureOnly, include);
                //Send to ONET
                //string sendONET = sendToONET(token, report, assessmentID);
                //Send Email
                //foreach(string emailAddress in emailAddresses)
                //{
                //    string sendEmailResult = aadg.SendReportViaEmail(emailAddress, report.ToString());
                //}

                //Display Plan Report
                //displayPlanReport(report);
                //ar[0].actions.Equals(actions);
                if(report != null && downloadReportCheck)
                {
                    MemoryStream reportStream = new MemoryStream(report);
                }

                //reportStream.Write(report, 0, report.Length);
                //reportStream.Close();
                if (!downloadReportCheck)
                {
                    report = null;
                }
                ActionResults ar = new ActionResults
                {
                    actions = actions,
                    report = report
                };
                return ar;
            }
            
            return null;
        }

        public void displayPlanReport(byte[] report)
        {
            Attachment attachment = new Attachment();
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            response.Clear();
            response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ";");
            response.ContentType = "application/pdf";
            response.BinaryWrite(report);
        }

        public ReportSectionOrder[] getReportSectionOrder()
        {
            string reportOrderString = "";
            reportOrderString = aadg.getReportSectionOrder();
            ReportSectionOrder[] reportOrderObj = js.Deserialize<ReportSectionOrder[]>(reportOrderString);

            return reportOrderObj;
        }

        public byte[] createReportArray(string token, string[] planAttachmentIds, string[] wfAttachmentIds, string[] sigAttachmentIds, string userId, string assessmentID, string versionID, string extraSpace, bool toONET, bool isp, bool oneSpan, bool signatureOnly, string include, string reportTitle)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            bool isTokenValid = true;// aadg.ValidateToken(token);
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


                byte[] finalMergedArray = concatAndAddContent(allAttachments, reportTitle);
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

        public string sendToONET(string token, byte[] report, string assessmentID)
        {
            string finalMergedArrayString = System.Convert.ToBase64String(report);
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
                    else if (attachment.filename.ToUpper().Contains(".DOCX") || attachment.filename.ToUpper().Contains(".XLS") || attachment.filename.ToUpper().Contains(".XLSX") || attachment.filename.ToUpper().Contains(".DOC"))
                    {
                        if (attachment.filename.ToUpper().Contains(".XLSX"))
                        {
                            attachment.filename = attachment.filename.Replace("xlsx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains(".DOCX"))
                        {
                            attachment.filename = attachment.filename.Replace("docx", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains(".XLS"))
                        {
                            attachment.filename = attachment.filename.Replace("xls", "pdf");
                        }
                        if (attachment.filename.ToUpper().Contains(".DOC"))
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

        public static byte[] concatAndAddContent(List<byte[]> pdfByteContent, string reportTitle)
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
                        doc.AddTitle(reportTitle);
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