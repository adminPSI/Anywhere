using Anywhere.Data;
using Anywhere.Log;
using CrystalDecisions.CrystalReports.Engine;
using System;
using System.Data;
using System.IO;


namespace Anywhere.service.Data
{
    public class SingleEntryReport
    {
        private static Loger logger = new Loger();
        DataGetter dg = new DataGetter();
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

        public MemoryStream createRegReport(string token, string userId, string startDate, string endDate)
        {
            ReportDocument cr = new ReportDocument();

            string crName = string.Empty;
            string crPath = string.Empty;
            string crFinal = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getSingleEntryReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));

            crName = "SingleEntry.rpt";
            //string test = string.Format(crPath, crName);
            try
            {
                //cr.Load(string.Format(@"\\solo\wwwroot\testAdvAnywhere\webroot\reportfiles\{0} ", crName));
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                var builder = new System.Text.StringBuilder();
                WriteExceptionDetails(ex, builder, 0);
                logger.debug(builder.ToString());
            }

            cr.SetDataSource(obj.TimeDetail(userId, startDate, endDate));
            string Region = string.Empty;
            string Name = string.Empty;
            DataTable dt = obj.TimeHeader(userId).Tables[0];
            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];
                Region = Convert.ToString(row["Description"]);
                Name = Convert.ToString(row["Name"]);
            }

            cr.DataDefinition.FormulaFields["Region"].Text = string.Format("'{0}'", Region);
            cr.DataDefinition.FormulaFields["Name"].Text = string.Format("'{0}'", Name);
            cr.DataDefinition.FormulaFields["StartDate"].Text = string.Format("'{0}'", Convert.ToDateTime(startDate).ToString("MM/dd/yyyy"));
            cr.DataDefinition.FormulaFields["EndDate"].Text = string.Format("'{0}'", Convert.ToDateTime(endDate).ToString("MM/dd/yyyy"));
            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            cr.Close();
            cr.Dispose();
            return ms;

        }

        public MemoryStream createOverLapReport(string token, string userId, string startDate, string endDate)//loginUser
        {

            ReportDocument cr = new ReportDocument();
            string crName = string.Empty;
            string crPath = string.Empty;
            SQL obj = new SQL();
            crPath = dg.getSingleEntryReportPath(token);
            var startPath = crPath.IndexOf("<path>");
            var endPath = crPath.IndexOf("</path>");
            crPath = crPath.Substring(startPath + 6, endPath - (startPath + 6));

            crName = "SEOverLap.rpt";
            try
            {
                //cr.Load(string.Format(@"\\solo\wwwroot\testAdvAnywhere\webroot\reportfiles\{0} ", crName));
                cr.Load(string.Format(crPath, crName));
            }
            catch (Exception ex)
            {
                logger.error(ex.Message + ex.InnerException.ToString(), "error");
            }
            cr.SetDataSource(obj.TimeOverlap(userId, startDate, endDate));

            string Region = string.Empty;
            string Name = string.Empty;
            DataTable dt = obj.TimeHeader(userId).Tables[0];
            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];
                Region = Convert.ToString(row["Description"]);
                Name = Convert.ToString(row["Name"]);
            }

            cr.DataDefinition.FormulaFields["Region"].Text = string.Format("'{0}'", Region);
            cr.DataDefinition.FormulaFields["Name"].Text = string.Format("'{0}'", Name);
            cr.DataDefinition.FormulaFields["StartDate"].Text = string.Format("'{0}'", Convert.ToDateTime(startDate).ToString("MM/dd/yyyy"));
            cr.DataDefinition.FormulaFields["EndDate"].Text = string.Format("'{0}'", Convert.ToDateTime(endDate).ToString("MM/dd/yyyy"));

            MemoryStream ms = new MemoryStream();
            ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat);
            cr.Close();
            cr.Dispose();

            return ms;

        }

    }
}