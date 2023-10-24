using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using Anywhere.service.Data;
using Bytescout.Spreadsheet;
using Newtonsoft.Json;
using pdftron.PDF;
using pdftron.SDF;
using Convert = System.Convert;
using Font = System.Drawing.Font;
using Field = pdftron.PDF.Field;
using pdftron.Filters;


namespace OODForms
{
    class OODFormWorker
    {
        private StringBuilder sb = new StringBuilder();

        public void ConvertXLStoPDF(string token, Attachment attachment)
        {
            OODFormDataGetter oodfdg = new OODFormDataGetter();
            string pdfTronKeyResult = oodfdg.getPDFTronKey(token);
            LicenseResponse[] pdfTronKey = JsonConvert.DeserializeObject<LicenseResponse[]>(pdfTronKeyResult);
            pdftron.PDFNet.Initialize(pdfTronKey[0].PDFTronKey);
            Attachment pdfAttachment = new Attachment();

            using (MemoryStream ms = new MemoryStream())
            {
                using (PDFDoc doc = new PDFDoc())
                {
                    attachment.filename = attachment.filename.Replace("xls", "pdf");
                    byte[] nAttachment = StreamExtensions.ToByteArray(attachment.data);
                    var filter = new MemoryFilter(nAttachment.Length, true);
                    var filterWriter = new FilterWriter(filter);
                    filterWriter.WriteBuffer(nAttachment);
                    filterWriter.Flush();
                    pdftron.PDF.Convert.OfficeToPDF(doc, filter, null);
                    // filterWriter.Flush(); // No need for this line.

                    string pdfversion = doc.GetSDFDoc().GetHeader();
                    doc.Save(ms, SDFDoc.SaveOptions.e_linearized);

                    pdfAttachment.filename = attachment.filename;
                    pdfAttachment.data = ms;
                }

                DisplayAttachment(pdfAttachment, ".pdf", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            }
        }

        public void Form8(string token, string AuthorizationNumber, string invoiceNumber, long PeopleID, string StartDate, string EndDate, string ServiceCodeID, string ReportPath, string registrationName, string registrationKey)
        {

            Spreadsheet SS = new Spreadsheet();
            SS.RegistrationName = registrationName;
            SS.RegistrationKey = registrationKey;

            SS.LoadFromFile(ReportPath);

            Bytescout.Spreadsheet.Worksheet WS = SS.Worksheet(0);

            DataTable dt;
            DataRow row;
            OODFormDataGetter obj = new OODFormDataGetter();

            //dt = obj.OODVendor(VendorID).Tables[0];
            //row = dt.Rows[0];

            dt = obj.OODDevelopment(AuthorizationNumber).Tables[0];
            row = dt.Rows[0];

            string ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());
            WS.Cell("m1").Value = ProviderName.ToString();

            WS.Cell("m2").Value = AuthorizationNumber.ToString();

            WS.Cell("m3").Value = invoiceNumber.ToString();

            

            string ConsumerName = string.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());
            WS.Cell("m4").Value = ConsumerName;
            WS.Cell("m4").Font = new Font(WS.Cell("m4").Font.Name, WS.Cell("m4").Font.Size, FontStyle.Bold);

            string Staff = string.Empty;
            string StaffWithInitals = string.Empty;
            string OODStaff = string.Empty;
            string MiddleName = string.Empty;
            DataSet ds = obj.OODForm8GetDirectStaff72022(AuthorizationNumber, StartDate, EndDate);

            if (ds.Tables.Count > 0)
            {
                DataTable dt2 = ds.Tables[0];
                foreach (DataRow row2 in dt2.Rows)
                {
                    if (row2["First_Name"].ToString().Trim().Length > 0 && row2["Last_Name"].ToString().Trim().Length > 0)
                    {
                        Staff = String.Format("{0} {1} ", row2["First_Name"], row2["Last_Name"]);
                        MiddleName = row2["Middle_Name"].ToString();
                        OODStaff += String.Format("{0}, ", Staff.Trim());
                    }

                    if ((WS.Cell("m6").Value) != null && Staff.ToString().Trim().Length > 0)
                    {
                        WS.Cell("m6").Value = Staff.ToString().Trim();
                    }

                    if (Staff.ToString().Trim().Length > 0)
                    {
                        StaffWithInitals += String.Format("{0}{1}, ", Staff, row2["Initials"].ToString());
                    }
                }
            }

            if (StaffWithInitals.Length > 0)
            {
                WS.Cell("m5").Value = StaffWithInitals.ToString().Trim().Substring(0, StaffWithInitals.Length - 2);
            }
            else
            {
                WS.Cell("m5").Value = String.Empty;
            }


            DataSet dsOODStaff = obj.Counslor(AuthorizationNumber, ServiceCodeID, Convert.ToInt64(row["Consumer_ID"]));
            if (dsOODStaff.Tables.Count > 0)
            {
                DataTable dtOODStaff = dsOODStaff.Tables[0];
                foreach (DataRow rowOODStaff in dtOODStaff.Rows)
                {
                    if (rowOODStaff["FirstName"].ToString().Trim().Length > 0 && rowOODStaff["LastName"].ToString().Trim().Length > 0)
                    {
                        OODStaff = String.Format("{0} {1}, ", rowOODStaff["FirstName"].ToString().Trim(), rowOODStaff["LastName"].ToString().Trim());
                    }
                }

            }

            //OODStaff = OODStaff.Remove(OODStaff.LastIndexOf(","), 1);
            WS.Cell("m7").Value = OODStaff;

            WS.Cell("m8").ValueAsDateTime = DateTime.Parse(DateTime.Now.ToString("MM/dd/yyyy"));

            StartDate = DateTime.Parse(StartDate).ToString("yyyy-MM-dd");
            WS.Cell("m9").ValueAsDateTime = DateTime.Parse(StartDate);

            EndDate = DateTime.Parse(EndDate).ToString("yyyy-MM-dd");
            WS.Cell("m10").ValueAsDateTime = DateTime.Parse(EndDate);

            WS.Cell("m11").Value = "Final";

            WS.Cell("l15").Value = "$0.00";

            if (row["ServiceDescription"].ToString().ToUpper().Contains("CBA"))
            {
                WS.Cell("a12").Value = "Community Based Assessment";
            }
            else if (row["ServiceDescription"].ToString().ToUpper().Contains("JRTNS"))
            {
                WS.Cell("a12").Value = "Job Readiness (Non-School)";
            }
            else if (row["ServiceDescription"].ToString().ToUpper().Contains("JRTSB"))
            {
                WS.Cell("a12").Value = "Job Readiness (School)";
            }
            else if (row["ServiceDescription"].ToString().ToUpper().Contains("OJSUPPT"))
            {
                WS.Cell("a12").Value = "On-The-Job Supports";
            }
            else if (row["ServiceDescription"].ToString().ToUpper().Contains("WADJ"))
            {
                WS.Cell("a12").Value = "Work Adjustment";
            }
            else
            {
                WS.Cell("a12").Value = "Service Description 1";
            }

            ds = obj.OODForm8BussinessAddress(PeopleID);
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    row = ds.Tables[0].Rows[0];
                    sb.Clear();
                    sb.AppendFormat("{0}, ", row["Name"].ToString().Trim());
                    sb.AppendFormat("{0}, {1}", row["City"].ToString().Trim(), row["State"].ToString().Trim());
                    WS.Cell("m19").Value = sb.ToString().Trim();
                }
            }

            string TaskSummary = obj.OODForm8GetJobTasksSummary72022(AuthorizationNumber);
            if (TaskSummary.Length > 0) ;
            {
                TaskSummary = TaskSummary.Trim();
            }

            WS.Cell("m20").Value = TaskSummary;

            WS.Cell("m21").Value = obj.OODForm8GetSupportAndTransistion72022(AuthorizationNumber, StartDate).ToString().Trim();

            ds = obj.OODForm8GetNotes72022(AuthorizationNumber, StartDate, EndDate);

            Int32 t = 23;
            foreach (DataRow row2 in ds.Tables[0].Rows)
            {
                WS.Cell(String.Format("a{0}", t)).ValueAsDateTime = Convert.ToDateTime(row2["Service_date"]);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                WS.Cell(String.Format("a{0}", t)).NumberFormatString = "MM/dd/yyy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                WS.Cell(String.Format("b{0}", t)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["Start_Time"])); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                WS.Cell(String.Format("c{0}", t)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["End_Time"]));
                WS.Cell(String.Format("d{0}", t)).Value = "0";
                WS.Cell(String.Format("h{0}", t)).Value = row2["Initials"].ToString().Trim();
                WS.Cell(String.Format("i{0}", t)).Value = row2["Contact_Method"].ToString().Trim();
                WS.Cell(String.Format("j{0}", t)).Value = row2["Behavioral_Indicators"].ToString().Trim();
                WS.Cell(String.Format("k{0}", t)).Value = row2["Quality_Indicators"].ToString().Trim();
                WS.Cell(String.Format("l{0}", t)).Value = row2["Quantity_Indicators"].ToString().Trim();
                WS.Cell(String.Format("m{0}", t)).Value = row2["Narrative"].ToString().Trim();
                WS.Cell(String.Format("n{0}", t)).Value = row2["Interventions"].ToString().Trim();
                WS.Cell(String.Format("n{0}", t)).FontColor = System.Drawing.Color.Black;
                t += 1;
            }


            ds = obj.OODForm8BackgroundChecks(AuthorizationNumber, StartDate);
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    row = ds.Tables[0].Rows[0];
                    WS.Cell("m75").Value = row["EM_Sum_Ind_Self_Assess"].ToString().Trim();
                    WS.Cell("m76").Value = row["EM_Sum_Provider_Assess"].ToString().Trim();

                    if (row["VTS_Review"].ToString().ToUpper() == "Y")
                    {
                        WS.Cell("m79").Value = "Yes";
                    }
                    else
                    {
                        WS.Cell("m79").Value = "No";
                    }
                }

            }

            WS.Cell("a21").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;

            MemoryStream ms = new MemoryStream();
            SS.SaveToStreamXLSX(ms);

            Attachment attachment = new Attachment
            {
                filename = "Form8",
                data = ms
            };

            ConvertXLStoPDF(token, attachment);
        }

        public void Form4(string token, string AuthorizationNumber, string invoiceNumber, long PeopleID, string StartDate, string EndDate, string ServiceCodeID, string ReportPath, string registrationName, string registrationKey)
        {
            Spreadsheet SS = new Spreadsheet();
            SS.RegistrationName = registrationName;
            SS.RegistrationKey = registrationKey;

            SS.LoadFromFile(ReportPath);

            Bytescout.Spreadsheet.Worksheet WS = SS.Worksheet(0);

            DataTable dt;
            DataRow row;
            OODFormDataGetter obj = new OODFormDataGetter();

            //dt = obj.OODVendor(VendorID).Tables[0];
            //row = dt.Rows[0];

            dt = obj.OODDevelopment(AuthorizationNumber).Tables[0];
            row = dt.Rows[0];

            StartDate = DateTime.Parse(StartDate).ToString("yyyy-MM-dd");
            EndDate = DateTime.Parse(EndDate).ToString("yyyy-MM-dd");

            string ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());

            WS.Cell("k1").Value = ProviderName;            

            WS.Cell("k2").Value = string.Format("{0}", AuthorizationNumber);

            WS.Cell("k3").Value = invoiceNumber.ToString();

            //WS.Cell("k3").Value = DateTime.Now.ToString("yyyy-MM-dd");

            string ConsumerName = String.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());
            WS.Cell("k4").Value = ConsumerName;

            string Staff = string.Empty;
            string StaffWithInitals = string.Empty;
            string OODStaff = string.Empty;
            string MiddleName = string.Empty;
            DataSet ds = obj.OODStaff(AuthorizationNumber, ServiceCodeID);
            if (ds.Tables.Count > 0)
            {
                DataTable dt2 = ds.Tables[0];
                foreach (DataRow row2 in dt2.Rows)
                {
                    if (row2["StaffFirstName"].ToString().Trim().Length > 0 && row["StaffLastName"].ToString().Trim().Length > 0)
                    {
                        Staff = String.Format("{0} {1} ", row2["StaffFirstName"], row2["StaffLastName"]); //This needs middle name and initials
                        MiddleName = row2["StaffMiddleName"].ToString();
                        OODStaff += String.Format("{0}, ", Staff.Trim());
                    }

                    string Initials = string.Empty;

                    switch (MiddleName.ToString().Length)
                    {
                        case 0:
                            if (row2["StaffFirstName"].ToString().Trim().Length > 0 && row2["StaffLastName"].ToString().Trim().Length > 0)
                            {
                                Initials = String.Format("({0}{1}", row2["StaffFirstName"].ToString().Substring(0, 1), row2["StaffLastName"].ToString().Substring(0, 1));
                            }
                            break;

                        default:
                            if (row2["StaffFirstName"].ToString().Trim().Length > 0 && row2["StaffLastName"].ToString().Trim().Length > 0)
                            {
                                Initials = String.Format("({0}{1}{2}", row2["StaffFirstName"].ToString().Substring(0, 1), row2["StaffMiddleName"].ToString().Substring(0, 1), row2["StaffLastName"].ToString().Substring(0, 1));
                            }
                            break;
                    }

                    if ((WS.Cell("k6").Value == null) && Staff.ToString().Trim().Length > 0)
                    {
                        WS.Cell("k6").Value = Staff.ToString().Trim();
                    }

                    if (Staff.Trim().Length > 0)
                    {
                        StaffWithInitals += String.Format("{0}{1}", Staff, Initials);
                    }
                }

                if (StaffWithInitals.Length > 2)
                {
                    WS.Cell("k5").Value = StaffWithInitals.ToString().Trim().Substring(0, StaffWithInitals.Length - 2);
                }

            }

            DataSet dsOODStaff = obj.Counslor(AuthorizationNumber, ServiceCodeID, PeopleID);
            if (dsOODStaff.Tables.Count > 0)
            {
                DataTable dtOODStaff = dsOODStaff.Tables[0];
                foreach (DataRow rowOODStaff in dtOODStaff.Rows)
                {
                    if (rowOODStaff["FirstName"].ToString().Trim().Length > 0 && rowOODStaff["LastName"].ToString().Trim().Length > 0)
                    {
                        OODStaff = String.Format("{0} {1}, ", rowOODStaff["FirstName"], rowOODStaff["LastName"]);
                    }
                }
            }

            //WS.Cell("k7").Value = OODStaff.ToString().Trim().Substring(0, OODStaff.Length - 2);
            WS.Cell("k7").Value = OODStaff;


            WS.Cell("k8").Value = DateTime.Now.ToString("MM/dd/yy");

            //string f9 = Convert.ToDateTime(string.Format("{0}", obj.OODMinDate(AuthorizationNumber, StartDate, EndDate, ServiceCodeID).Tables[0].Rows[0][0],"MM/dd/yyyy"));
            WS.Cell("k9").ValueAsDateTime = Convert.ToDateTime(string.Format("{0}", obj.OODMinDate(AuthorizationNumber, StartDate, EndDate, ServiceCodeID).Tables[0].Rows[0][0]));

            WS.Cell("k10").ValueAsDateTime = Convert.ToDateTime(string.Format("{0}", obj.OODMinDate(AuthorizationNumber, StartDate, EndDate, ServiceCodeID).Tables[0].Rows[0][0]));

            WS.Cell("k11").Value = "Final";

            int cpt = row["CPT_Code"].ToString().ToUpper().Trim().LastIndexOf(":") + 2;
            string Code = row["ServiceDescription"].ToString().ToUpper().Trim().Substring(0, cpt);

            switch (row["ServiceDescription"].ToString().ToUpper().Trim())
            {
                case "OJDUOS":
                    WS.Cell("a12").Value = "JD_UOS";
                    break;
                case "OSCOORD":
                    WS.Cell("a12").Value = "Site Coordination";
                    break;
                case "OSDEVLP":
                    WS.Cell("a12").Value = "Site Development";
                    break;
                default:
                    WS.Cell("a12").Value = "Service Description 1";
                    break;
            }

            if ((row["ServiceDescription"].ToString().ToUpper().Trim().Substring(0, 2)) == "OP")
            {
                if (row["ServiceDescription"].ToString().ToUpper().Trim().Contains("MR"))

                {
                    WS.Cell("a12").Value = "Monthly Job Development Report (No Bill)";
                }

            }

            WS.Cell("k19").Value = row["EmpGoal"].ToString().Trim();

            WS.Cell("k73").Value = row["IndividualsInputOnSearch"].ToString().Trim();

            WS.Cell("k74").Value = row["PotentialIssues"].ToString().Trim();

            ds = obj.OODDevelopment2(AuthorizationNumber, StartDate, EndDate, ServiceCodeID);
            if (ds.Tables.Count > 0)
            {
                dt = ds.Tables[0];
                foreach (DataRow row2 in dt.Rows)
                {
                    long i = dt.Rows.IndexOf(row2) + 21;

                    WS.Cell(String.Format("a{0}", i)).ValueAsDateTime = Convert.ToDateTime(Convert.ToDateTime(row2["Contact_Date"]).ToString("MM/dd/yyyy"));

                    WS.Cell(String.Format("b{0}", i)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["StartTime"])); // DateTime.Parse(String.Format("{0} {1}", DateTime.Now.ToString("yyyy-MM-dd"),row2["StartTime"]));

                    WS.Cell(String.Format("c{0}", i)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["EndTime"])); //DateTime.Parse(String.Format("{0} {1}", DateTime.Now.ToString("yyyy-MM-dd"), row2["EndTime"]));

                    switch (row2["SAMLevel"].ToString())
                    {
                        case "1":
                        case "2":
                        case "3":
                            WS.Cell(String.Format("f{0}", i)).Value = row2["SAMLevel"].ToString().Trim();
                            break;

                        default:
                            WS.Cell(String.Format("f{0}", i)).Value = "NA";
                            break;
                    }
                    
                    string MN = string.Empty;
                    if (row2["Middle_Name"].ToString().Length > 0)
                    {
                        MN = row2["Middle_Name"].ToString().Substring(0, 1).ToUpper();
                    }

                    string Initials = String.Format("{0}{1}{2}", row2["First_Name"].ToString().Substring(0, 1).ToUpper(), MN, row2["Last_Name"].ToString().Substring(0, 1).ToUpper());
                    //string Initals = String.Format("{0}{1}{2}", row2["First_Name"].ToString().Trim().Substring(0, 1), row2["Middle_Name"].ToString().Trim().Substring(0, 1), row2["Last_Name"].ToString().Trim().Substring(0, 1));
                    WS.Cell(String.Format("g{0}", i)).Value = Initials.ToString().Trim(); //Staff initial

                    string Service = string.Empty;
                    switch (row2["ContactType"].ToString().ToUpper())
                    {
                        case "EML":
                        case "EM":
                            Service = "Email";
                            break;

                        case "FFC":
                        case "FF":
                            Service = "In Person";
                            break;

                        case "LTR":
                        case "LE":
                            Service = "Letter";
                            break;

                        case "RE":
                            Service = "Remote";
                            break;

                        case "S":
                            Service = "Service";
                            break;

                        case "TEL":
                        case "TC":
                            Service = "Telephone";
                            break;

                        case "TXT":
                        case "TEX":
                            Service = "Text";
                            break;

                        default:
                            Service = "Other";
                            break;
                    }
                    WS.Cell(String.Format("h{0}", i)).Value = Service; //Contact Method

                    switch (row2["Application"].ToString().ToUpper())
                    {
                        case "Y":
                            WS.Cell(String.Format("i{0}", i)).Value = "Yes";
                            break;

                        case "N":
                            WS.Cell(String.Format("i{0}", i)).Value = "No";
                            break;
                    }

                    switch (row2["Interview"].ToString().ToUpper())
                    {
                        case "Y":
                            WS.Cell(String.Format("j{0}", i)).Value = "Yes";
                            break;

                        case "N":
                            WS.Cell(String.Format("j{0}", i)).Value = "No";
                            break;
                    }

                    string LOC = String.Format("{0} {1} {2}", row2["Location"].ToString().Trim(), row2["LocationAddress"].ToString().Trim(), row2["LocationCity"].ToString().Trim());

                    WS.Cell(String.Format("a{0}", i)).AlignmentHorizontal = Bytescout.Spreadsheet.Constants.AlignmentHorizontal.Centered;
                    WS.Cell(String.Format("b{0}", i)).AlignmentHorizontal = Bytescout.Spreadsheet.Constants.AlignmentHorizontal.Centered;
                    WS.Cell(String.Format("c{0}", i)).AlignmentHorizontal = Bytescout.Spreadsheet.Constants.AlignmentHorizontal.Centered;
                    WS.Cell(String.Format("d{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                    WS.Cell(String.Format("e{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                    WS.Cell(String.Format("f{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                    WS.Cell(String.Format("g{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                    WS.Cell(String.Format("h{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                    WS.Cell(String.Format("i{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                    WS.Cell(String.Format("j{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                }

                WS.Cell("a19").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                WS.Cell("a73").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                WS.Cell("a74").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;

            }

            MemoryStream ms = new MemoryStream();
            SS.SaveToStreamXLSX(ms);

            Attachment attachment = new Attachment
            {
                filename = "Form4",
                data = ms
            };

            ConvertXLStoPDF(token, attachment);
        }

        public string generateForm4(string token, string AuthorizationNumber, string peopleIDString, string StartDate, string EndDate, string serviceCode)
        {
            try
            {
                OODFormWorker obj = new OODFormWorker();
                OODFormDataGetter oodfdg = new OODFormDataGetter();

                string SSinfo = oodfdg.getSpreadsheetNameAndKey(token);
                SSInfo[] SSInfoObj = JsonConvert.DeserializeObject<SSInfo[]>(SSinfo);
                string registrationName = SSInfoObj[0].registrationName;
                string registrationKey = SSInfoObj[0].registrationKey;

                string crpath = oodfdg.getFormTemplatePath(token);
                PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
                string path = pathdatalist[0].path;
                string templateFileName = "Form4MonthlyJobAndSiteDevelopment.xlsx";
                string reportPath = string.Format(path, templateFileName);

                long PeopleID = long.Parse(peopleIDString);

                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");

                obj.Form4(token, AuthorizationNumber, invoiceNumber, PeopleID, StartDate, EndDate, serviceCode, reportPath, registrationName, registrationKey);

                return "Success";
            }
            catch (Exception ex)
            {
                return "Failed";
            }
        }

        public string generateForm8(string token, string AuthorizationNumber, string peopleIDString, string StartDate, string EndDate, string serviceCode)
        {
            try
            {
                OODFormWorker obj = new OODFormWorker();
                OODFormDataGetter oodfdg = new OODFormDataGetter();

                string SSinfo = oodfdg.getSpreadsheetNameAndKey(token);
                SSInfo[] SSInfoObj = JsonConvert.DeserializeObject<SSInfo[]>(SSinfo);
                string registrationName = SSInfoObj[0].registrationName;
                string registrationKey = SSInfoObj[0].registrationKey;

                string crpath = oodfdg.getFormTemplatePath(token);
                PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
                string path = pathdatalist[0].path;
                string templateFileName = "Form8WorkActivitiesAndAssessment.xlsx";
                string reportPath = string.Format(path, templateFileName);
                //string reportPath = @"C:\Users\erick.bey\Desktop\Anywhere\Gargolye\webroot\reportfiles\Form8WorkActivitiesAndAssessmentBinary.xlsx";

                long PeopleID = long.Parse(peopleIDString);
                
                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");

                obj.Form8(token, AuthorizationNumber, invoiceNumber, PeopleID, StartDate, EndDate, serviceCode, reportPath, registrationName, registrationKey);

                return "Success";
            }
            catch (Exception ex)
            {
                string message = ex.ToString();
                return message;
            }
        }

        public string generateForm10(string token, string referenceNumber, long VendorID, string consumerIdString, String startDate, String endDate, string userId)
        {
            try
            {
            OODFormDataGetter oodfdg = new OODFormDataGetter();
            string pdfTronKeyResult = oodfdg.getPDFTronKey(token);
            LicenseResponse[] pdfTronKey = JsonConvert.DeserializeObject<LicenseResponse[]>(pdfTronKeyResult);
            pdftron.PDFNet.Initialize(pdfTronKey[0].PDFTronKey);

            string crpath = oodfdg.getFormTemplatePath(token);
            PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
            string path = pathdatalist[0].path;
            string crname = "OOD_transportation_10.pdf";
            string reportpath = string.Format(path, crname);

            PDFDoc form10Template = new PDFDoc(reportpath);

            // Gather Data for the Person Completing the Report
            string personCompletingReportData = oodfdg.getPersonCompletingReportName(token);
            personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
            string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;

            // Creates a unique string of numbers for the Invoice # field
            DateTime currentDate = DateTime.Now;
            string currentDateStr = currentDate.ToString("yyyy-MM-dd");
            string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
            string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");

            long consumerId = long.Parse(consumerIdString);
            //long serviceCodeId = long.Parse(serviceCode);

            // Gathers all the data for the table in the pdf (startTime, endTime, startLocation, endLocation, units, # in vehicle per trip, staff initials)
            string returnedData = oodfdg.getForm10PDFData(token, referenceNumber, startDate, endDate, consumerIdString, userId);
            List<form10Data> form10DataList = JsonConvert.DeserializeObject<List<form10Data>>(returnedData);

            string authorizationNumber = referenceNumber;
            if (referenceNumber == "%")
            {
                authorizationNumber = form10DataList[0].authorizationNumber;
            };

            // Takes all the staff Initials from the table and uses unique values to store the direct service staff initials
            string directServiceStaffNames = string.Join(" ", form10DataList.Select(data => data.staffInitials).Distinct());

            var fieldData = new List<(string fieldName, string value)>
                {
                    ("Authorization", authorizationNumber),
                    ("Provider_Invoice", invoiceNumber),
                    ("Invoice_Date", currentDateStr),
                    ("Invoice_Status", "Final"),
                    ("Person Completing Report", personCompletingReport),
                    ("Service_Start_Date_af_date", startDate),
                    ("Service_End_Date_af_date", endDate),
                    ("Individuals Name", form10DataList[0].individualsName),
                    ("Direct Service Staff Name and Initials", directServiceStaffNames),
                    ("Provider Name", form10DataList[0].vendorName),
                    ("VR CounselorCoordinator", form10DataList[0].VR_CounselorContractor)
                };

            // Iterate through the field data and set values
            foreach (var (fieldName, value) in fieldData)
            {
                Field field = form10Template.GetField(fieldName);
                field.SetValue(value);

                // resets a value on the pdf so all fields show (otherwise the fields may not show correctly on finished pdf)
                field.RefreshAppearance();
            }

            for (int i = 1; i <= form10DataList.Count; i++)
            {
                // gets correct format for date
                DateTime dateTime = DateTime.Parse(form10DataList[i - 1].date);
                string datePart = dateTime.ToString("yyyy-MM-dd");

                var tableData = new List<(string fieldName, string value)>
                    {
                        ("Date3_af_date.0." + (i -1), datePart),
                        ("START_TIMERow" + i, form10DataList[i-1].startTime),
                        ("END_TIMERow" + i, form10DataList[i-1].endTime),
                        ("UNITSRow" + i, form10DataList[i-1].units),
                        ("People" + i, form10DataList[i-1].vehiclePerTrip),
                        ("START LOCATION STREETCITYRow" + i, form10DataList[i-1].startLocation),
                        ("END LOCATION STREETCITYRow" + i, form10DataList[i-1].endLocation),
                        ("STAFF INITIALSRow" + i, form10DataList[i-1].staffInitials),
                    };

                // Iterate through the table data and set values for each row
                foreach (var (fieldName, value) in tableData)
                {
                    Field field = form10Template.GetField(fieldName);
                    field.SetValue(value);
                    field.RefreshAppearance();
                }
            }


            List<string> fieldNames = new List<string>();
            FieldIterator itr;

            for (itr = form10Template.GetFieldIterator(); itr.HasNext(); itr.Next())
            {
                Field field = itr.Current();
                string fieldName = field.GetName();
                fieldNames.Add(fieldName);
                Console.WriteLine("Field name: {0}", fieldName);
            }

            MemoryStream pdfStream = new MemoryStream();
            form10Template.Save(pdfStream, SDFDoc.SaveOptions.e_linearized);

            Attachment attachment = new Attachment
            {
                filename = "Form10",
                data = pdfStream
            };

            DisplayAttachment(attachment, ".pdf", "application/pdf");

            return "Success";
            }
            catch (Exception ex)
            {
                return "Failed";
            }
        }

        public void DisplayAttachment(Attachment attachment, string fileExtension, string contentType)
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
                    response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + fileExtension + ";");
                    response.ContentType = contentType;
                    response.AddHeader("Transfer-Encoding", "identity");
                    response.BinaryWrite(bytes);
                }
            }
            catch (Exception ex)
            {
                response.Write("Error: " + ex.InnerException.ToString());
            }
            finally
            {
                // logger2.debug("Done?");
            }
        }
    }

    public class form10Data
    {
        public string date { get; set; }
        public string startTime { get; set; }
        public string endTime { get; set; }
        public string units { get; set; }
        public string vehiclePerTrip { get; set; }
        public string startLocation { get; set; }
        public string endLocation { get; set; }
        public string staffInitials { get; set; }
        public string individualsName { get; set; }
        public string authorizationNumber { get; set; }
        public string vendorName { get; set; }
        public string VR_CounselorContractor { get; set; }
    }

    public class personCompletingReport
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
    }

    public class Attachment
    {
        public string filename { get; set; }
        public MemoryStream data { get; set; }
    }

    public class LicenseResponse
    {
        public string PDFTronKey { get; set; }
    }

    public class SSInfo
    {
        public string registrationName { get; set; }
        public string registrationKey { get; set; }
    }

    public class PathItem
    {
        public string path { get; set; }
    }

    public static class Common
    {
        public static string gConnString;
    }
}
