using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.DocumentConversion.DisplayPlanReportAndAttachments;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using static PSIOISP.Deserialize;

namespace Anywhere.service.Data.DocumentConversion
{
    public class DisplayPlanReportAndAttachments
    {
        PlanReport planRep = new PlanReport();
        AllAttachmentsDataGetter aadg = new AllAttachmentsDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer(); 

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

        public void getSelectedAttachmentsForReport(string token, string[] attachmentIds)
        {

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
            ms.Close();
            ms.Dispose();
            byte[] planReport = StreamExtensions.ToByteArray(ms);
            return planReport;
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

    }
}