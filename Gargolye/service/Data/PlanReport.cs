using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;
using Anywhere.Data;
using Anywhere.Log;
using CrystalDecisions.CrystalReports.Engine;
using static Anywhere.service.Data.AnywhereWorker;

namespace Anywhere.service.Data
{
    public class PlanReport
    {
        private static Loger logger = new Loger();
        DataGetter dg = new DataGetter();
        AssessmentReportSQL ars = new AssessmentReportSQL();
        JavaScriptSerializer js = new JavaScriptSerializer();
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

        public MemoryStream createAssessmentReport(string token,string  userId, string assessmentID, string versionID, string extraSpace, bool isp )
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
            if(extraSpace.ToLower() == "false"){//change to boolean TODO
                extraSpace = "'false'";
                eS = false;
            }else{
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