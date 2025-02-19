using Anywhere.Data;
using Anywhere.Log;
using CrystalDecisions.CrystalReports.Engine;
using Microsoft.VisualBasic.ApplicationServices;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using static Anywhere.service.Data.ESign.ESignWorker;


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
            //ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat); //Removed on 10/18/2023
            var ios = cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat); //Added on 10/18/2023
            ios.CopyTo(ms);
            cr.Close();
            cr.Dispose();
            ios.Dispose();
            return ms;

        }

        public MemoryStream createRegReportSupervisor(string token, string userId, string supervisorId, string startDate, string endDate, string locationId, string personId, string status, string workCodeId)
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

            crName = "SingleEntrySupervisor.rpt";
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
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                string result = obj.timeDetailSupervisor(supervisorId, startDate, endDate, locationId, personId, status, workCodeId, transaction);
                List<SupervisorTimeDetail> supervisorTimeDetails = JsonConvert.DeserializeObject<List<SupervisorTimeDetail>>(result);
                if (supervisorTimeDetails.Count > 0)
                {
                    // Set the data source if data exists
                    cr.SetDataSource(supervisorTimeDetails);
                }
                else
                {
                    // Handle empty data (you can set an empty list or take other actions)
                    DataSet ds = new DataSet();

                    // Create a DataTable
                    DataTable dt1 = new DataTable("SETimeDetail");

                    // Add columns to the DataTable based on your SQL structure
                    dt1.Columns.Add("dateofservice", typeof(string));
                    dt1.Columns.Add("employee", typeof(string));
                    dt1.Columns.Add("submitted", typeof(string));
                    dt1.Columns.Add("location", typeof(string));
                    dt1.Columns.Add("workcode", typeof(string));
                    dt1.Columns.Add("starttime", typeof(string));
                    dt1.Columns.Add("endtime", typeof(string));
                    dt1.Columns.Add("hours", typeof(decimal));
                    dt1.Columns.Add("consumers", typeof(int));
                    dt1.Columns.Add("miles", typeof(decimal));

                    // Add the DataTable to the DataSet
                    ds.Tables.Add(dt1);
                    cr.SetDataSource(ds);
                }
            }
            //DataSet ds = obj.TimeDetailSupervisor(supervisorId, startDate, endDate, locationId, personId, status, workCodeId);

            // cr.SetDataSource(super);
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
            //ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat); //Removed on 10/18/2023
            var ios = cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat); //Added on 10/18/2023
            ios.CopyTo(ms);
            cr.Close();
            cr.Dispose();
            ios.Dispose();
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
            //ms = (System.IO.MemoryStream)cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat); //Removed on 10/18/2023
            var ios = cr.ExportToStream(CrystalDecisions.Shared.ExportFormatType.PortableDocFormat); //Added on 10/18/2023
            ios.CopyTo(ms);
            cr.Close();
            cr.Dispose();
            ios.Dispose();
            return ms;

        }

        private List<SupervisorTimeDetail> ParseToSupervisorTimeDetailList(DataTable table)
        {
            var details = new List<SupervisorTimeDetail>();

            foreach (DataRow row in table.Rows)
            {
                var detail = new SupervisorTimeDetail
                {
                    DateOfServiceRaw = row.Field<DateTime>("dateofserviceraw"),
                    Submitted = row.Field<string>("submitted"),
                    Location = row.Field<string>("location"),
                    WorkCode = row.Field<string>("workcode"),
                    StartTime = row.Field<string>("starttime"),
                    EndTime = row.Field<string>("endtime"),
                    Hours = row.Field<int>("hours"),
                    Consumers = row.Field<int>("consumers"),
                    Miles = row.Field<decimal>("miles")
                };
                details.Add(detail);
            }

            return details;
        }

        public class SupervisorTimeDetail
        {
            public DateTime DateOfServiceRaw { get; set; } // Bind to JSON directly
            public string DateOfService => DateOfServiceRaw.ToString("MM/dd/yyyy"); // Format the date as desired
            public string Submitted { get; set; }
            public string Location { get; set; }
            public string WorkCode { get; set; }
            public string StartTime { get; set; }
            public string EndTime { get; set; }
            public decimal Hours { get; set; }
            public int Consumers { get; set; }
            public decimal Miles { get; set; }
            public string Employee { get; set; }
        }
    }
}