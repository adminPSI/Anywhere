using Anywhere.Data;
using Anywhere.Log;
using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class PlanReport
    {
        private static Loger logger = new Loger();
        DataGetter dg = new DataGetter();
        AssessmentReportSQL ars = new AssessmentReportSQL();
        JavaScriptSerializer js = new JavaScriptSerializer();
        List<byte[]> allAttachments = new List<byte[]>();
        private int TotalPage = 0;

        /*temporary*/
        public static void WriteExceptionDetails(Exception exception, System.Text.StringBuilder builderToFill, int level)
        {
            var indent = new string(' ', level);

            if (level > 0)
            {
                builderToFill.AppendLine(indent + "=== INNER EXCEPTION ===");
            }

            Action<string> append = (prop) =>
            {
                var propInfo = exception.GetType().GetProperty(prop);
                var val = propInfo.GetValue(exception);

                if (val != null)
                {
                    builderToFill.AppendFormat("{0}{1}: {2}{3}", indent, prop, val.ToString(), Environment.NewLine);
                }
            };

            append("Message");
            append("HResult");
            append("HelpLink");
            append("Source");
            append("StackTrace");
            append("TargetSite");

            foreach (System.Collections.DictionaryEntry de in exception.Data)
            {
                builderToFill.AppendFormat("{0} {1} = {2}{3}", indent, de.Key, de.Value, Environment.NewLine);
            }

            if (exception.InnerException != null)
            {
                WriteExceptionDetails(exception.InnerException, builderToFill, ++level);
            }
        }

        public MemoryStream createOISPIntro(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            bool Advisor = false;
            string applicationName = dg.GetApplicationName(token);
            ApplicationName[] appName = js.Deserialize<ApplicationName[]>(applicationName);
            if (appName[0].setting.ToUpper() == "ADVISOR")
            {
                Advisor = true;
            }
            ReportDocument cr = new ReportDocument();
            bool eS = false;
            long ID = long.Parse(assessmentID);
            if (extraSpace.ToLower() == "false")
            {//change to boolean TODO
                extraSpace = "'false'";
                eS = false;
            }
            else
            {
                extraSpace = "'true'";
                eS = true;
            }
            Boolean ISP = true;
            string crName = string.Empty;
            string crPath = string.Empty;
            string crFinal = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getAssessmentReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));
            crName = "OISPIntro.rpt";

            try
            {
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                var builder = new System.Text.StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger.debug(builder.ToString());
            }

            //crName = @"C:\Work\AssesmentReports\OISPIntro.rpt";
            //cr.Load(crName);
            var crViewer = new CrystalDecisions.Windows.Forms.CrystalReportViewer();
            DataTable dt = ars.AssesmentHeader(ID).Tables[0];
            cr.DataDefinition.FormulaFields["PlanStatus"].Text = string.Format("'{0}'", dt.Rows[0]["plan_status"].ToString());
            cr.OpenSubreport("Header").SetDataSource(dt);
            cr.OpenSubreport("ISPIntroduction").SetDataSource(ars.ISPIntroduction(ID));

            cr.DataDefinition.FormulaFields["PageNumberStart"].Text = TotalPage.ToString();

            crViewer.ReportSource = cr;
            crViewer.ShowLastPage();
            TotalPage += crViewer.GetCurrentPageNumber();
            crViewer.Dispose();


            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);

            cr.Close();
            cr.Dispose();
            return ms;
            //byte[] msa = StreamExtensions.ToByteArray(ms);
            //return msa;
            //allAttachments.Add(msa);
            //MemoryStream ms2 = createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp);
            //byte[] msa2 = StreamExtensions.ToByteArray(ms2);
            //allAttachments.Add(msa2);
            //MemoryStream ms3 = createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp);
            //createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp);
            //byte[] msa3 = StreamExtensions.ToByteArray(ms3);
            //allAttachments.Add(msa3);
            //return allAttachments;
        }

        public MemoryStream createOISPAssessment(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            bool Advisor = false;
            string applicationName = dg.GetApplicationName(token);
            ApplicationName[] appName = js.Deserialize<ApplicationName[]>(applicationName);
            if (appName[0].setting.ToUpper() == "ADVISOR")
            {
                Advisor = true;
            }
            ReportDocument cr = new ReportDocument();
            bool eS = false;
            long ID = long.Parse(assessmentID);
            if (extraSpace.ToLower() == "false")
            {//change to boolean TODO
                extraSpace = "'false'";
                eS = false;
            }
            else
            {
                extraSpace = "'true'";
                eS = true;
            }
            Boolean ISP = true;
            string crName = string.Empty;
            string crPath = string.Empty;
            string crFinal = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getAssessmentReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));
            crName = "OISPAssesment.rpt";

            try
            {
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                var builder = new System.Text.StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger.debug(builder.ToString());
            }

            //crName = @"C:\Work\AssesmentReports\OISPAssesment.rpt";
            //cr.Load(crName);
            var crViewer = new CrystalDecisions.Windows.Forms.CrystalReportViewer();
            cr.SetDataSource(ars.AssesmentAnswers(long.Parse(assessmentID), Advisor));

            DataTable dt = ars.AssesmentHeader(long.Parse(assessmentID)).Tables[0];
            cr.OpenSubreport("Header").SetDataSource(dt);
            cr.DataDefinition.FormulaFields["PlanStatus"].Text = string.Format("'{0}'", dt.Rows[0]["plan_status"].ToString());
            cr.DataDefinition.FormulaFields["ExpandedAnswers"].Text = eS.ToString(); // Option for expanded text for editing
            cr.DataDefinition.FormulaFields["PageNumberStart"].Text = TotalPage.ToString();
            crViewer.ReportSource = cr;
            crViewer.ShowLastPage();
            TotalPage += crViewer.GetCurrentPageNumber();
            crViewer.Dispose();

            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);

            cr.Close();
            cr.Dispose();

            return ms;
            //byte[] msa2 = StreamExtensions.ToByteArray(ms);
            //return msa2;
        }

        public MemoryStream createOISPlan(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp, bool oneSpan, bool signatureOnly, string include )
        {
            bool Advisor = false;
            string applicationName = dg.GetApplicationName(token);
            ApplicationName[] appName = js.Deserialize<ApplicationName[]>(applicationName);
            if (appName[0].setting.ToUpper() == "ADVISOR")
            {
                Advisor = true;
            }
            ReportDocument cr = new ReportDocument();
            bool eS = false;
            long ID = long.Parse(assessmentID);
            if (extraSpace.ToLower() == "false")
            {//change to boolean TODO
                extraSpace = "'false'";
                eS = false;
            }
            else
            {
                extraSpace = "'true'";
                eS = true;
            }
            Boolean ISP = true;
            string crName = string.Empty;
            string crPath = string.Empty;
            string crFinal = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getAssessmentReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));
            crName = "OISPPlan.rpt";

            try
            {
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                var builder = new System.Text.StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger.debug(builder.ToString());
            }

            var crViewer = new CrystalDecisions.Windows.Forms.CrystalReportViewer();
            //crName = @"C:\Work\AssesmentReports\OISPPlan.rpt";
            //cr.Load(crName);
            cr.SetDataSource(ars.AssesmentAnswers(ID, Advisor));

            DataTable dt = ars.AssesmentHeader(ID).Tables[0];
            cr.OpenSubreport("Header").SetDataSource(dt);
            cr.DataDefinition.FormulaFields["PlanStatus"].Text = string.Format("'{0}'", dt.Rows[0]["plan_status"].ToString());
            cr.DataDefinition.FormulaFields["PageNumberStart"].Text = TotalPage.ToString();
            cr.DataDefinition.FormulaFields["SignatureOnly"].Text = signatureOnly.ToString();

            //cr.DataDefinition.FormulaFields["ExpandedAnswers"].Text = false.ToString(); // Option for expanded text for editing
            if (include == "Y")
            {
                cr.OpenSubreport("AssesmentSummary").SetDataSource(ars.ISPSummary(long.Parse(assessmentID), false, "SUMMARY", Advisor));
                cr.OpenSubreport("Skills").SetDataSource(ars.ISPSummary(long.Parse(assessmentID), false, "SKILLS", Advisor));
            }
           // cr.OpenSubreport("AssesmentSummary").SetDataSource(ars.ISPSummary(long.Parse(assessmentID), false, "SUMMARY", Advisor));
            //    cr.OpenSubreport("Skills").SetDataSource(ars.ISPSummary(long.Parse(assessmentID), false, "SKILLS", Advisor));
            cr.OpenSubreport("Supervision").SetDataSource(ars.ISPSummary(long.Parse(assessmentID), false, "SUPERVISION", Advisor));
            cr.OpenSubreport("Outcomes").SetDataSource(ars.ISPOutcomes(long.Parse(assessmentID), Advisor));
            cr.OpenSubreport("Services").SetDataSource(ars.ISPServices(long.Parse(assessmentID), Advisor));
            cr.OpenSubreport("ISPModifiers").SetDataSource(ars.ISPModifiers(long.Parse(assessmentID)));
            cr.OpenSubreport("AdditionalSupports").SetDataSource(ars.ISPAdditionalSupports(long.Parse(assessmentID)));
            cr.OpenSubreport("Referrals").SetDataSource(ars.ISPReferrals(long.Parse(assessmentID)));
            cr.OpenSubreport("TeamMembers").SetDataSource(ars.ISPTeamMembers(long.Parse(assessmentID), Advisor));
            cr.OpenSubreport("TeamMembers2").SetDataSource(ars.ISPTeamMembers2(long.Parse(assessmentID), Advisor));
            cr.OpenSubreport("Signatures").SetDataSource(ars.ISPSignatures(long.Parse(assessmentID)));
            cr.OpenSubreport("Dissenting").SetDataSource(ars.Dissenting(long.Parse(assessmentID), oneSpan));
            cr.OpenSubreport("ContactInfo").SetDataSource(ars.ISPContacts(long.Parse(assessmentID), Advisor));
            // cr.OpenSubreport("ImportantPeople").SetDataSource(ars.ISPImportantPeople(long.Parse(assessmentID)));

            if (include == "Y")
            {
                cr.OpenSubreport("ImportantPeople").SetDataSource(ars.ISPImportantPeople(long.Parse(assessmentID)));
            }

            cr.OpenSubreport("Clubs").SetDataSource(ars.ISPClubs(long.Parse(assessmentID)));
            cr.OpenSubreport("Places").SetDataSource(ars.ISPPlaces(long.Parse(assessmentID)));

            crViewer.ReportSource = cr;
            crViewer.ShowLastPage();
            TotalPage += crViewer.GetCurrentPageNumber();
            crViewer.Dispose();

            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);

            cr.Close();
            cr.Dispose();

            return ms;

            //byte[] msa3 = StreamExtensions.ToByteArray(ms);
            //return msa3;
        }

        //public MemoryStream createAssessmentReport(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        //{
        //    createOISPIntro
        //    createOISPAssessment
        //}

        public MemoryStream createAssessmentReport(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            bool Advisor = false;
            string applicationName = dg.GetApplicationName(token);
            ApplicationName[] appName = js.Deserialize<ApplicationName[]>(applicationName);
            if (appName[0].setting.ToUpper() == "ADVISOR")
            {
                Advisor = true;
            }
            ReportDocument cr = new ReportDocument();
            bool eS = false;
            long ID = long.Parse(assessmentID);
            if (extraSpace.ToLower() == "false")
            {//change to boolean TODO
                extraSpace = "'false'";
                eS = false;
            }
            else
            {
                extraSpace = "'true'";
                eS = true;
            }
            Boolean ISP = true;
            string crName = string.Empty;
            string crPath = string.Empty;
            string crFinal = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getAssessmentReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));
            crName = "AssesmentVersion1.rpt";

            try
            {
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                var builder = new System.Text.StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger.debug(builder.ToString());
            }
            cr.SetDataSource(ars.AssesmentAnswers(long.Parse(assessmentID), true));
            DataTable dt = ars.AssesmentHeader(long.Parse(assessmentID)).Tables[0];
            cr.DataDefinition.FormulaFields["PlanStatus"].Text = String.Format("'{0}'", dt.Rows[0]["plan_status"]);
            cr.DataDefinition.FormulaFields["PageNumberStart"].Text = TotalPage.ToString();
            cr.DataDefinition.FormulaFields["ExpandedAnswers"].Text = eS.ToString();
            cr.OpenSubreport("Header").SetDataSource(dt);
            cr.DataDefinition.FormulaFields["ISP"].Text = ISP.ToString();
            //new code here
            if ((true == true))
            {
                cr.OpenSubreport("AssesmentSummary").SetDataSource(ars.ISPSummary(ID, false, "SUMMARY", Advisor));
                cr.OpenSubreport("Skills").SetDataSource(ars.ISPSummary(ID, false, "SKILLS", Advisor));
                cr.OpenSubreport("Supervision").SetDataSource(ars.ISPSummary(ID, false, "SUPERVISION", Advisor));
                cr.OpenSubreport("Outcomes").SetDataSource(ars.ISPOutcomes(ID, Advisor));
                cr.OpenSubreport("Services").SetDataSource(ars.ISPServices(ID, Advisor));
                cr.OpenSubreport("ISPModifiers").SetDataSource(ars.ISPModifiers(ID));
                cr.OpenSubreport("AdditionalSupports").SetDataSource(ars.ISPAdditionalSupports(ID));
                cr.OpenSubreport("Referrals").SetDataSource(ars.ISPReferrals(ID));
                cr.OpenSubreport("TeamMembers").SetDataSource(ars.ISPTeamMembers(ID, Advisor));
                cr.OpenSubreport("TeamMembers2").SetDataSource(ars.ISPTeamMembers2(ID, Advisor));
                cr.OpenSubreport("Signatures").SetDataSource(ars.ISPSignatures(ID));
                cr.OpenSubreport("Dissenting").SetDataSource(ars.ISPSignatures(ID));
                cr.OpenSubreport("ContactInfo").SetDataSource(ars.ISPContacts(ID, Advisor));
                cr.OpenSubreport("ImportantPeople").SetDataSource(ars.ISPImportantPeople(ID));
                cr.OpenSubreport("Clubs").SetDataSource(ars.ISPClubs(ID));
                cr.OpenSubreport("Places").SetDataSource(ars.ISPPlaces(ID));
                cr.OpenSubreport("ISPIntroduction").SetDataSource(ars.ISPIntroduction(ID));
            }


            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            cr.Close();
            cr.Dispose();
            return ms;

        }

        public MemoryStream createAssessmentReportForMerge(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {
            bool Advisor = false;
            string applicationName = dg.GetApplicationName(token);
            ApplicationName[] appName = js.Deserialize<ApplicationName[]>(applicationName);
            if (appName[0].setting.ToUpper() == "ADVISOR")
            {
                Advisor = true;
            }
            ReportDocument cr = new ReportDocument();
            bool eS = false;
            long ID = long.Parse(assessmentID);
            if (extraSpace.ToLower() == "false")
            {//change to boolean TODO
                extraSpace = "'false'";
                eS = false;
            }
            else
            {
                extraSpace = "'true'";
                eS = true;
            }
            Boolean ISP = true;
            string crName = string.Empty;
            string crPath = string.Empty;
            string crFinal = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getAssessmentReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));
            crName = "AssesmentVersion1.rpt";

            try
            {
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                var builder = new System.Text.StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger.debug(builder.ToString());
            }
            cr.SetDataSource(ars.AssesmentAnswers(long.Parse(assessmentID), true));
            DataTable dt = ars.AssesmentHeader(long.Parse(assessmentID)).Tables[0];
            cr.DataDefinition.FormulaFields["PlanStatus"].Text = String.Format("'{0}'", dt.Rows[0]["plan_status"]);
            cr.DataDefinition.FormulaFields["ExpandedAnswers"].Text = eS.ToString();
            cr.OpenSubreport("Header").SetDataSource(dt);
            cr.DataDefinition.FormulaFields["ISP"].Text = ISP.ToString();
            //new code here
            if ((true == true))
            {
                cr.OpenSubreport("AssesmentSummary").SetDataSource(ars.ISPSummary(ID, false, "SUMMARY", Advisor));
                cr.OpenSubreport("Skills").SetDataSource(ars.ISPSummary(ID, false, "SKILLS", Advisor));
                cr.OpenSubreport("Supervision").SetDataSource(ars.ISPSummary(ID, false, "SUPERVISION", Advisor));
                cr.OpenSubreport("Outcomes").SetDataSource(ars.ISPOutcomes(ID, Advisor));
                cr.OpenSubreport("Services").SetDataSource(ars.ISPServices(ID, Advisor));
                cr.OpenSubreport("ISPModifiers").SetDataSource(ars.ISPModifiers(ID));
                cr.OpenSubreport("AdditionalSupports").SetDataSource(ars.ISPAdditionalSupports(ID));
                cr.OpenSubreport("Referrals").SetDataSource(ars.ISPReferrals(ID));
                cr.OpenSubreport("TeamMembers").SetDataSource(ars.ISPTeamMembers(ID, Advisor));
                cr.OpenSubreport("TeamMembers2").SetDataSource(ars.ISPTeamMembers2(ID, Advisor));
                cr.OpenSubreport("Signatures").SetDataSource(ars.ISPSignatures(ID));
                cr.OpenSubreport("Dissenting").SetDataSource(ars.ISPSignatures(ID));
                cr.OpenSubreport("ContactInfo").SetDataSource(ars.ISPContacts(ID, Advisor));
                cr.OpenSubreport("ImportantPeople").SetDataSource(ars.ISPImportantPeople(ID));
                cr.OpenSubreport("Clubs").SetDataSource(ars.ISPClubs(ID));
                cr.OpenSubreport("Places").SetDataSource(ars.ISPPlaces(ID));
                cr.OpenSubreport("ISPIntroduction").SetDataSource(ars.ISPIntroduction(ID));
            }

            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            //cr.Close();
            //cr.Dispose();
            return ms;

        }
        public class ApplicationName
        {
            public string setting { get; set; }
        }
    }
}