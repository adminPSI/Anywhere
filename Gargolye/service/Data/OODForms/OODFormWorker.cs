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
using System.Globalization;
using System.Web;
using static Anywhere.service.Data.OODWorker;
using static Anywhere.service.Data.ReportBuilder.ReportBuilderWorker;
using System.Web.UI.WebControls;
using OneSpanSign.Sdk;
using System.Runtime.InteropServices.ComTypes;
using static log4net.Appender.RollingFileAppender;
using System.Windows.Forms;
using System.Management.Automation;
using static Anywhere.service.Data.FormWorker;
using static Anywhere.service.Data.PlanOutcomes.PlanOutcomesWorker;
using System.Security.Cryptography;

namespace OODForms
{
    class OODFormWorker
    {
        private StringBuilder sb = new StringBuilder();

        public string generateForm3(string token, string referenceNumber, long VendorID, string consumerIdString, String startDate, String endDate, string userId, string loggedInUserPersonId)
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
                //string crname = "Tier1andJDPlan_Form6.pdf";
                string crname = "IntakeAcknowledgment_Form 3.pdf";
                // IntakeAcknowledgment_Form 3
                string reportpath = string.Format(path, crname);
                string personCompletingReport = string.Empty;

                PDFDoc form3Template = new PDFDoc(reportpath);

                // Gather Data for the Person Completing the Report


                //string loggedInUserPersonId = oodfdg.getPersonCompletingReportName(token);
                //personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                //string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;

                DataTable dt;
                DataRow row;
                
                string ProviderName = "";
                string ConsumerName = "";

                if (referenceNumber != "" && referenceNumber != null && referenceNumber != "%25")
                {
                    referenceNumber = referenceNumber.Replace("+", " ");
                    dt = oodfdg.OODDevelopment(referenceNumber).Tables[0];

                    if (dt.Rows.Count > 0)
                    {
                        row = dt.Rows[0];

                        ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());
                        ConsumerName = string.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());
                    }

                } else
                {

                    dt = oodfdg.OODForm3ConsumerandVendor(consumerIdString).Tables[0];

                    if (dt.Rows.Count > 0)
                    {
                        row = dt.Rows[0];

                        ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());
                        ConsumerName = string.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());
                    } 
                   
                    referenceNumber = "";
                }

                //string Staff = string.Empty;
                //string StaffWithInitals = string.Empty;
                //string OODStaff = string.Empty;
                //string MiddleName = string.Empty;

                //DataSet ds = oodfdg.OODForm8GetDirectStaff(referenceNumber, startDate, endDate);

                //if (ds.Tables.Count > 0)
                //{
                //    DataTable dt2 = ds.Tables[0];
                //    foreach (DataRow row2 in dt2.Rows)
                //    {
                //        if (row2["First_Name"].ToString().Trim().Length > 0 && row2["Last_Name"].ToString().Trim().Length > 0)
                //        {
                //            Staff = String.Format("{0} {1} ", row2["First_Name"], row2["Last_Name"]);
                //            MiddleName = row2["Middle_Name"].ToString();
                //            OODStaff += String.Format("{0}, ", Staff.Trim());
                //        }

                //        if (Staff.ToString().Trim().Length > 0)
                //        {
                //            StaffWithInitals += String.Format("{0}{1}, ", Staff, row2["Initials"].ToString());
                //        }
                //    }
                //}

                string VRCounselor = "";

                if (referenceNumber != "" && referenceNumber != null && referenceNumber != "%25")
                {
                    DataSet dsVR = oodfdg.OODForm6GetVRCounselor(referenceNumber, consumerIdString, startDate, endDate);
                    // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                    if (dsVR.Tables.Count > 0 && dsVR.Tables[0].Rows.Count > 0)
                    {
                        if (!string.IsNullOrEmpty(dsVR.Tables[0].Rows[0]["VR_CounselorContractor"].ToString()))
                        {
                            VRCounselor = dsVR.Tables[0].Rows[0]["VR_CounselorContractor"].ToString();
                        }
                        else
                        {
                            VRCounselor = "";
                        }
                    }

                }
                   

                //string IPEGoal = "";
                //DataSet dsIPE = oodfdg.OODForm6GetIPEGoal(referenceNumber, consumerIdString, startDate, endDate);
                //// List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                //if (dsIPE.Tables.Count > 0 && dsIPE.Tables[0].Rows.Count > 0)
                //{
                //    if (!string.IsNullOrEmpty(dsIPE.Tables[0].Rows[0]["IPEGoal"].ToString()))
                //    {
                //        IPEGoal = dsIPE.Tables[0].Rows[0]["IPEGoal"].ToString();
                //    }
                //    else
                //    {
                //        IPEGoal = "";
                //    }
                //}

                //string service = "";
                //DataSet dsService = oodfdg.OODForm6GetService(referenceNumber, consumerIdString, startDate, endDate);
                //// List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                //if (dsService.Tables.Count > 0 && dsService.Tables[0].Rows.Count > 0)
                //{
                //    if (!string.IsNullOrEmpty(dsService.Tables[0].Rows[0]["service"].ToString()))
                //    {
                //        service = dsService.Tables[0].Rows[0]["service"].ToString();
                //    }
                //    else
                //    {
                //        service = "PBJD Tier I";
                //    }
                //}

                //string bilingual = "";  // SAMLevel
                //string SAMLevel = "";  // bilingualSupplement
                //DataSet dsSAMandBilingual = oodfdg.OODForm6GetSAMandBilingual(referenceNumber, consumerIdString, startDate, endDate, userId);

                //if (dsSAMandBilingual.Tables.Count > 0 && dsSAMandBilingual.Tables[0].Rows.Count > 0)
                //{
                //    if (!string.IsNullOrEmpty(dsSAMandBilingual.Tables[0].Rows[0]["SAMLevel"].ToString()))
                //    {
                //        SAMLevel = dsSAMandBilingual.Tables[0].Rows[0]["SAMLevel"].ToString();
                //    }
                //    else
                //    {
                //        SAMLevel = "";
                //    }
                //}

                DataSet ds3 = new DataSet();
                //string personCompletingReport;

                if (!string.IsNullOrEmpty(loggedInUserPersonId))
                {

                    // long lng_loggedInUserPersonId = long.Parse(loggedInUserPersonId);
                    ds3 = oodfdg.getPersonCompletingReport(token, loggedInUserPersonId);
                }



                if (ds3.Tables.Count > 0 && ds3.Tables[0].Rows.Count > 0)
                {
                    personCompletingReport = String.Format("{0} {1} ", ds3.Tables[0].Rows[0]["First_Name"], ds3.Tables[0].Rows[0]["Last_Name"]);
                }



                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");
                string invoiceDate = currentDate.ToString("MM/dd/yyyy");
                DateTime startdate = DateTime.ParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                string strStartDate = startdate.ToString("MM/dd/yyyy");
                DateTime enddate = DateTime.ParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                string strEndDate = enddate.ToString("MM/dd/yyyy");

                    var fieldData = new List<(string fieldName, string value)>
                {
                    ("ProviderName", ProviderName),
                    ("IndividualName", ConsumerName),
                    // ("IPE_Goal", IPEGoal),         // em_employee_general.ipe for given individual
                   // ("StaffNames", VRCounselor), //06/14/2024 -- StaffWithInitals replaced by "" for this release (2024.2)
                    ("PersonCompletingReport", personCompletingReport),
                    ("OODRepresentative", VRCounselor), // persons.first_name & persons.last_name of person_id on consumer_services_master table for selected service

                    ("AuthorizationNumber", referenceNumber),
                    ("ProviderInvoiceNumber", invoiceNumber),
                    //("Service", service),      // Select Service = services.procedure_code for selected service (match on emp_ood.reference_number and consumer_services_master.service_id)
                    ("InvoiceDate", invoiceDate),
                    ("ServiceStartDate", strStartDate),
                    ("ServiceEndDate", strEndDate),
                    ("InvoiceTotal", ""),
                    ("ETATotal", ""),
                    ("BilingualRate", ""),
                }; 

                // Iterate through the field data and set values
                foreach (var (fieldName, value) in fieldData)
                {
                    Field field = form3Template.GetField(fieldName);
                    field.SetValue(value);

                    // resets a value on the pdf so all fields show (otherwise the fields may not show correctly on finished pdf)
                    field.RefreshAppearance();
                }

                // Iterate through the table data and set values for each row
                //foreach (var (fieldName, value) in tableData)
                //{
                //    Field field = form6Template.GetField(fieldName);
                //    field.SetValue(value);
                //    field.RefreshAppearance();
                //}



                List<string> fieldNames = new List<string>();
                List<string> test = new List<string>();
                FieldIterator itr;

                for (itr = form3Template.GetFieldIterator(); itr.HasNext(); itr.Next())
                {
                    Field field = itr.Current();
                    string fieldName = field.GetName();
                    fieldNames.Add(fieldName);

                    string testing = field.GetType().ToString();
                    test.Add(testing);
                }

                MemoryStream pdfStream = new MemoryStream();
                form3Template.Save(pdfStream, SDFDoc.SaveOptions.e_linearized);

                Attachment attachment = new Attachment
                {
                    filename = "Form3",
                    data = pdfStream
                };

                DisplayAttachmentPDF(attachment);

                return "Success";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string generateForm4(string token, string AuthorizationNumber, string peopleIDString, string StartDate, string EndDate, string serviceCode, string userID)
        {
            try
            {

            
                OODFormDataGetter obj = new OODFormDataGetter();

                string SSinfo = obj.getSpreadsheetNameAndKey(token);
                SSInfo[] SSInfoObj = JsonConvert.DeserializeObject<SSInfo[]>(SSinfo);
                string registrationName = SSInfoObj[0].registrationName;
                string registrationKey = SSInfoObj[0].registrationKey;

                string crpath = obj.getFormTemplatePath(token);
                PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
                string path = pathdatalist[0].path;
                string templateFileName = "Form4MonthlyJobAndSiteDevelopment.xlsx";
                string ReportPath = string.Format(path, templateFileName);

                long PeopleID = long.Parse(peopleIDString);

                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");

                // Gather Data for the Person Completing the Report
                string personCompletingReportData = obj.getPersonCompletingReportName(token);
                personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;

            Spreadsheet SS = new Spreadsheet();
            SS.RegistrationName = registrationName;
            SS.RegistrationKey = registrationKey;

            SS.LoadFromFile(ReportPath);

            Bytescout.Spreadsheet.Worksheet WS = SS.Worksheet(0);

            DataTable dt;
            DataRow row;

            dt = obj.OODDevelopment(AuthorizationNumber).Tables[0];
            row = dt.Rows[0];

            StartDate = DateTime.Parse(StartDate).ToString("yyyy-MM-dd");
            EndDate = DateTime.Parse(EndDate).ToString("yyyy-MM-dd");

            string ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());

            WS.Cell("k1").Value = ProviderName;

            WS.Cell("k2").Value = string.Format("{0}", AuthorizationNumber);

            WS.Cell("k3").Value = invoiceNumber.ToString();

            string ConsumerName = String.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());
            WS.Cell("k4").Value = ConsumerName;

            string servicename = string.Format("{0}", row["servicename"].ToString().Trim());
            WS.Cell("a12").Value = servicename;

            DataSet ds = obj.EmpGoal(AuthorizationNumber, StartDate, EndDate);

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                string employeeGoal = ds.Tables[0].Rows[0]["em_review_goal"].ToString();
                string individualsInputOnSearch = ds.Tables[0].Rows[0]["IndividualsInputOnSearch"].ToString();

                string potentialIssues = ds.Tables[0].Rows[0]["PotentialIssues"].ToString();

                //WS.Cell("K19").Value = employeeGoal;
                WS.Cell("K20").Value = employeeGoal;


               // WS.Cell("K73").Value = individualsInputOnSearch;
               WS.Cell("K74").Value = individualsInputOnSearch;

               // WS.Cell("K74").Value = potentialIssues;
                WS.Cell("K75").Value = potentialIssues;
            }
            else
            {
                WS.Cell("K20").Value = string.Empty;
                WS.Cell("K74").Value = string.Empty;
                WS.Cell("K75").Value = string.Empty;
            }

            string OODStaff = string.Empty;
            string MiddleName = string.Empty;
            ds = obj.OODStaff(AuthorizationNumber, serviceCode, StartDate, EndDate, userID);
            List<string> personInitialsList = new List<string>();

            if (ds.Tables.Count > 0)
            {
                DataTable dt2 = ds.Tables[0];
                foreach (DataRow row2 in dt2.Rows)
                {
                    string lastName = row2["Last_Name"] as string;
                    string middleName = row2["Middle_Name"] as string;
                    string firstName = row2["First_Name"] as string;

                    char? lastInitial = null;
                    char? middleInitial = null;
                    char? firstInitial = null;

                    if (!string.IsNullOrEmpty(lastName)) lastInitial = lastName[0];
                    if (!string.IsNullOrEmpty(middleName)) middleInitial = middleName[0];
                    if (!string.IsNullOrEmpty(firstName)) firstInitial = firstName[0];

                    string personInitials = $"{firstName}{MiddleName}{lastName} {firstInitial}{middleInitial}{lastInitial}";

                    personInitialsList.Add(personInitials);
                }

                // Combine all the initials into one string separated by commas
                string uniqueInitialsString = string.Join(", ", personInitialsList);

                WS.Cell("k5").Value = uniqueInitialsString;
            }

            WS.Cell("k6").Value = personCompletingReport;

            DataSet dsOODStaff = obj.Counslor(AuthorizationNumber, serviceCode, StartDate, EndDate);
            if (dsOODStaff.Tables.Count > 0)
            {
                DataTable dtOODStaff = dsOODStaff.Tables[0];
                foreach (DataRow rowOODStaff in dtOODStaff.Rows)
                {
                    if (rowOODStaff["First_Name"].ToString().Trim().Length > 0 && rowOODStaff["Last_Name"].ToString().Trim().Length > 0)
                    {
                        OODStaff = String.Format("{0} {1}, ", rowOODStaff["First_Name"], rowOODStaff["Last_Name"]);
                    }
                }
            }

                if (OODStaff.Length > 0)
                {
                    WS.Cell("k7").Value = OODStaff.ToString().Trim().Substring(0, OODStaff.Length - 2);
                }
                else
                {
                    WS.Cell("k7").Value = String.Empty;
                }


              //  WS.Cell("k7").Value = OODStaff;

            WS.Cell("k8").Value = DateTime.Now.ToString("MM/dd/yy");

            WS.Cell("k11").Value = "Final";

            int cpt = row["CPT_Code"].ToString().ToUpper().Trim().LastIndexOf(":") + 2;
            string Code = row["ServiceDescription"].ToString().ToUpper().Trim().Substring(0, cpt);

            if ((row["ServiceDescription"].ToString().ToUpper().Trim().Substring(0, 2)) == "OP")
            {
                if (row["ServiceDescription"].ToString().ToUpper().Trim().Contains("MR"))

                {
                    WS.Cell("a12").Value = "Monthly Job Development Report (No Bill)";
                }

            }

            WS.Cell("j18").Value = "No";

                WS.Cell("k9").Value = DateTime.Parse(StartDate).ToString("MM/dd/yy");
                WS.Cell("k10").Value = DateTime.Parse(EndDate).ToString("MM/dd/yy");

                ds = obj.OODDevelopment2(AuthorizationNumber, StartDate, EndDate, serviceCode, userID);
            if (ds.Tables.Count > 0)
            {
                dt = ds.Tables[0];
                foreach (DataRow row2 in dt.Rows)
                {
                    // long i = dt.Rows.IndexOf(row2) + 21;
                    long i = dt.Rows.IndexOf(row2) + 22;


                    DateTime parsedStartTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["StartTime"]));

                    string formattedStartTime = parsedStartTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);

                    DateTime parsedEndTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["EndTime"]));

                    string formattedEndTime = parsedEndTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);

                    TimeSpan timeDifference = parsedEndTime - parsedStartTime;
                    double minutesDifference = timeDifference.TotalMinutes;

                    int units = (int)Math.Ceiling(minutesDifference / 6);

                    if (parsedEndTime < parsedStartTime)
                    {
                        units = -units;
                    }

                    string formattedUnits = units.ToString();

                    WS.Cell(String.Format("a{0}", i)).ValueAsDateTime = Convert.ToDateTime(row2["serviceDate"]);

                   // WS.Cell(String.Format("b{0}", i)).ValueAsDateTime = DateTime.Parse(String.Format("{0} {1}", DateTime.Now.ToString("yyyy-MM-dd"), row2["StartTime"]));

                   // WS.Cell(String.Format("c{0}", i)).ValueAsDateTime = DateTime.Parse(String.Format("{0} {1}", DateTime.Now.ToString("yyyy-MM-dd"), row2["EndTime"]));

                    WS.Cell(String.Format("b{0}", i)).Value = formattedStartTime;
                    WS.Cell(String.Format("c{0}", i)).Value = formattedEndTime;

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

                    string LOC = String.Format("{0}, {1}, {2}", row2["Location"].ToString().Trim(), row2["LocationAddress"].ToString().Trim(), row2["LocationCity"].ToString().Trim());
                    WS.Cell(String.Format("k{0}", i)).Value = LOC;

                    WS.Cell(String.Format("l{0}", i)).Value = row2["Narrative"].ToString().Trim();

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
                    WS.Cell(String.Format("k{0}", i)).AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                }

                WS.Cell("a20").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                WS.Cell("a74").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                WS.Cell("a75").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
            }

            WS.Calculate();

            MemoryStream ms = new MemoryStream();
            SS.SaveToStreamXLSX(ms);
            ms.Position = 0;

            Attachment attachment = new Attachment
            {
                filename = "Form4.xlsx",
                data = ms
            };

            DisplayAttachment(attachment);

            return "Success";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string generateForm5(string token, string referenceNumber, long VendorID, string consumerIdString, String startDate, String endDate, string userId, string loggedInUserPersonId)
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
                string crname = "JobSearchAssistanceParts2&3.pdf";
                string reportpath = string.Format(path, crname);
                string personCompletingReport = string.Empty;

                PDFDoc form6Template = new PDFDoc(reportpath);

                // Gather Data for the Person Completing the Report


                //string loggedInUserPersonId = oodfdg.getPersonCompletingReportName(token);
                //personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                //string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;

                DataTable dt;
                DataRow row;

                referenceNumber = referenceNumber.Replace("+", " ");
                dt = oodfdg.OODDevelopment(referenceNumber).Tables[0];
                row = dt.Rows[0];

                string ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());
                string ConsumerName = string.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());

                string Staff = string.Empty;
                string StaffWithInitals = string.Empty;
                string OODStaff = string.Empty;
                string MiddleName = string.Empty;

                DataSet ds = oodfdg.OODForm8GetDirectStaff(referenceNumber, startDate, endDate);

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

                        if (Staff.ToString().Trim().Length > 0)
                        {
                            StaffWithInitals += String.Format("{0}{1}, ", Staff, row2["Initials"].ToString());
                        }
                    }
                }

                string VRCounselor = "";
                DataSet dsVR = oodfdg.OODForm6GetVRCounselor(referenceNumber, consumerIdString, startDate, endDate);
                // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                if (dsVR.Tables.Count > 0 && dsVR.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsVR.Tables[0].Rows[0]["VR_CounselorContractor"].ToString()))
                    {
                        VRCounselor = dsVR.Tables[0].Rows[0]["VR_CounselorContractor"].ToString();
                    }
                    else
                    {
                        VRCounselor = "";
                    }
                }

                string IPEGoal = "";
                DataSet dsIPE = oodfdg.OODForm6GetIPEGoal(referenceNumber, consumerIdString, startDate, endDate);
                // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                if (dsIPE.Tables.Count > 0 && dsIPE.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsIPE.Tables[0].Rows[0]["IPEGoal"].ToString()))
                    {
                        IPEGoal = dsIPE.Tables[0].Rows[0]["IPEGoal"].ToString();
                    }
                    else
                    {
                        IPEGoal = "";
                    }
                }

                string service = "";
                DataSet dsService = oodfdg.OODForm6GetService(referenceNumber, consumerIdString, startDate, endDate);
                // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                if (dsService.Tables.Count > 0 && dsService.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsService.Tables[0].Rows[0]["service"].ToString()))
                    {
                        service = dsService.Tables[0].Rows[0]["service"].ToString();
                    }
                    else
                    {
                        service = "PBJD Tier I";
                    }
                }

                string bilingual = "";  // SAMLevel
                string SAMLevel = "";  // bilingualSupplement
                DataSet dsSAMandBilingual = oodfdg.OODForm6GetSAMandBilingual(referenceNumber, consumerIdString, startDate, endDate, userId);

                if (dsSAMandBilingual.Tables.Count > 0 && dsSAMandBilingual.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsSAMandBilingual.Tables[0].Rows[0]["SAMLevel"].ToString()))
                    {
                        SAMLevel = dsSAMandBilingual.Tables[0].Rows[0]["SAMLevel"].ToString();
                    }
                    else
                    {
                        SAMLevel = "";
                    }
                }

                DataSet ds3 = new DataSet();
                //string personCompletingReport;

                if (!string.IsNullOrEmpty(loggedInUserPersonId))
                {

                    // long lng_loggedInUserPersonId = long.Parse(loggedInUserPersonId);
                    ds3 = oodfdg.getPersonCompletingReport(token, loggedInUserPersonId);
                }



                if (ds3.Tables.Count > 0 && ds3.Tables[0].Rows.Count > 0)
                {
                    personCompletingReport = String.Format("{0} {1} ", ds3.Tables[0].Rows[0]["First_Name"], ds3.Tables[0].Rows[0]["Last_Name"]);
                }



                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");
                string invoiceDate = currentDate.ToString("MM/dd/yyyy");
                DateTime startdate = DateTime.ParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                string strStartDate = startdate.ToString("MM/dd/yyyy");
                DateTime enddate = DateTime.ParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                string strEndDate = enddate.ToString("MM/dd/yyyy");

                var fieldData = new List<(string fieldName, string value)>
                {
                    ("Provider Name", ProviderName),
                    ("Individuals Name", ConsumerName),
                    ("IPE_Goal", IPEGoal),         // em_employee_general.ipe for given individual
                    ("Direct Service Staff Nam(s) and Initials", ""), //06/14/2024 -- StaffWithInitals replaced by "" for this release (2024.2)
                    ("Person Completing Report", personCompletingReport),
                    ("VR CounselorCoordinator", VRCounselor), // persons.first_name & persons.last_name of person_id on consumer_services_master table for selected service

                    ("Authorization", referenceNumber),
                    ("Provider_Invoice_Number", invoiceNumber),
                    ("Service", service),      // Select Service = services.procedure_code for selected service (match on emp_ood.reference_number and consumer_services_master.service_id)
                    ("Invoice Date", invoiceDate),
                    ("Service_Start_Date_af_date", strStartDate),
                    ("Service_End_Date_af_date", strEndDate),
                };

                // Iterate through the field data and set values
                foreach (var (fieldName, value) in fieldData)
                {
                    Field field = form6Template.GetField(fieldName);
                    field.SetValue(value);

                    // resets a value on the pdf so all fields show (otherwise the fields may not show correctly on finished pdf)
                    field.RefreshAppearance();
                }

                // Iterate through the table data and set values for each row
                //foreach (var (fieldName, value) in tableData)
                //{
                //    Field field = form6Template.GetField(fieldName);
                //    field.SetValue(value);
                //    field.RefreshAppearance();
                //}



                List<string> fieldNames = new List<string>();
                List<string> test = new List<string>();
                FieldIterator itr;

                for (itr = form6Template.GetFieldIterator(); itr.HasNext(); itr.Next())
                {
                    Field field = itr.Current();
                    string fieldName = field.GetName();
                    fieldNames.Add(fieldName);

                    string testing = field.GetType().ToString();
                    test.Add(testing);
                }

                MemoryStream pdfStream = new MemoryStream();
                form6Template.Save(pdfStream, SDFDoc.SaveOptions.e_linearized);

                Attachment attachment = new Attachment
                {
                    filename = "Form6",
                    data = pdfStream
                };

                DisplayAttachmentPDF(attachment);

                return "Success";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string generateForm6(string token, string referenceNumber, long VendorID, string consumerIdString, String startDate, String endDate, string userId, string loggedInUserPersonId)
        {
           try {
                OODFormDataGetter oodfdg = new OODFormDataGetter();
                string pdfTronKeyResult = oodfdg.getPDFTronKey(token);
                LicenseResponse[] pdfTronKey = JsonConvert.DeserializeObject<LicenseResponse[]>(pdfTronKeyResult);
                pdftron.PDFNet.Initialize(pdfTronKey[0].PDFTronKey);

                string crpath = oodfdg.getFormTemplatePath(token);
                PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
                string path = pathdatalist[0].path;
                string crname = "Tier1andJDPlan_Form6.pdf";
                string reportpath = string.Format(path, crname);
                string personCompletingReport = string.Empty;

                PDFDoc form6Template = new PDFDoc(reportpath);

                // Gather Data for the Person Completing the Report


                //string loggedInUserPersonId = oodfdg.getPersonCompletingReportName(token);
                //personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                //string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;

                DataTable dt;
                DataRow row;

                referenceNumber = referenceNumber.Replace("+", " ");
                dt = oodfdg.OODDevelopment(referenceNumber).Tables[0];
                row = dt.Rows[0];

                string ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());
                string ConsumerName = string.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim());

                string Staff = string.Empty;
                string StaffWithInitals = string.Empty;
                string OODStaff = string.Empty;
                string MiddleName = string.Empty;

                DataSet ds = oodfdg.OODForm8GetDirectStaff(referenceNumber, startDate, endDate);

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

                        if (Staff.ToString().Trim().Length > 0)
                        {
                            StaffWithInitals += String.Format("{0}{1}, ", Staff, row2["Initials"].ToString());
                        }
                    }
                }

                string VRCounselor = "";
                DataSet dsVR = oodfdg.OODForm6GetVRCounselor(referenceNumber, consumerIdString, startDate, endDate);
                // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);
                
                    if (dsVR.Tables.Count > 0 && dsVR.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsVR.Tables[0].Rows[0]["VR_CounselorContractor"].ToString()))
                    {
                        VRCounselor = dsVR.Tables[0].Rows[0]["VR_CounselorContractor"].ToString();
                    }
                    else
                    {
                        VRCounselor = "";
                    }
                }

                string IPEGoal = "";
                DataSet dsIPE = oodfdg.OODForm6GetIPEGoal(referenceNumber, consumerIdString, startDate, endDate);
                // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                if (dsIPE.Tables.Count > 0 && dsIPE.Tables[0].Rows.Count > 0)
                { 
                    if (!string.IsNullOrEmpty(dsIPE.Tables[0].Rows[0]["IPEGoal"].ToString()))        
                    {
                        IPEGoal = dsIPE.Tables[0].Rows[0]["IPEGoal"].ToString();
                    } else
                    {
                        IPEGoal = "";
                    }
                }

                string service = "";
                DataSet dsService = oodfdg.OODForm6GetService(referenceNumber, consumerIdString, startDate, endDate);
                // List<form6Data> form6DataList = JsonConvert.DeserializeObject<List<form6Data>>(returnedData);

                if (dsService.Tables.Count > 0 && dsService.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsService.Tables[0].Rows[0]["service"].ToString()))
                    {
                        service = dsService.Tables[0].Rows[0]["service"].ToString();
                    }
                    else
                    {
                        service = "PBJD Tier I";
                    }
                }

                string bilingual = "";  // SAMLevel
                string SAMLevel = "";  // bilingualSupplement
                DataSet dsSAMandBilingual = oodfdg.OODForm6GetSAMandBilingual(referenceNumber, consumerIdString, startDate, endDate, userId);

                if (dsSAMandBilingual.Tables.Count > 0 && dsSAMandBilingual.Tables[0].Rows.Count > 0)
                {
                    if (!string.IsNullOrEmpty(dsSAMandBilingual.Tables[0].Rows[0]["SAMLevel"].ToString()))
                    {
                        SAMLevel = dsSAMandBilingual.Tables[0].Rows[0]["SAMLevel"].ToString();
                    }
                    else
                    {
                        SAMLevel = "";
                    }
                }

                DataSet ds3 = new DataSet();
                //string personCompletingReport;

                if (!string.IsNullOrEmpty(loggedInUserPersonId))
                {

                    // long lng_loggedInUserPersonId = long.Parse(loggedInUserPersonId);
                    ds3 = oodfdg.getPersonCompletingReport(token, loggedInUserPersonId);
                }



                if (ds3.Tables.Count > 0 && ds3.Tables[0].Rows.Count > 0)
                {
                    personCompletingReport = String.Format("{0} {1} ", ds3.Tables[0].Rows[0]["First_Name"], ds3.Tables[0].Rows[0]["Last_Name"]);
                }



                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");  
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");
                string invoiceDate = currentDate.ToString("MM/dd/yyyy");
                DateTime startdate = DateTime.ParseExact(startDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                string strStartDate = startdate.ToString("MM/dd/yyyy");
                DateTime enddate = DateTime.ParseExact(endDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                string strEndDate = enddate.ToString("MM/dd/yyyy");

                var fieldData = new List<(string fieldName, string value)>
                {
                    ("Provider Name", ProviderName),  
                    ("Individuals Name", ConsumerName),  
                    ("IPE_Goal", IPEGoal),         // em_employee_general.ipe for given individual
                    ("Direct Service Staff Nam(s) and Initials", ""), //06/14/2024 -- StaffWithInitals replaced by "" for this release (2024.2)
                    ("Person Completing Report", personCompletingReport),  
                    ("VR CounselorCoordinator", VRCounselor), // persons.first_name & persons.last_name of person_id on consumer_services_master table for selected service

                    ("Authorization", referenceNumber), 
                    ("Provider_Invoice_Number", invoiceNumber),  
                    ("Service", service),      // Select Service = services.procedure_code for selected service (match on emp_ood.reference_number and consumer_services_master.service_id)
                    ("Invoice Date", invoiceDate),  
                    ("Service_Start_Date_af_date", strStartDate), 
                    ("Service_End_Date_af_date", strEndDate),
                };

                // Iterate through the field data and set values
                foreach (var (fieldName, value) in fieldData)
                {
                    Field field = form6Template.GetField(fieldName);
                    field.SetValue(value);

                    // resets a value on the pdf so all fields show (otherwise the fields may not show correctly on finished pdf)
                    field.RefreshAppearance();
                }

                // Iterate through the table data and set values for each row
                //foreach (var (fieldName, value) in tableData)
                //{
                //    Field field = form6Template.GetField(fieldName);
                //    field.SetValue(value);
                //    field.RefreshAppearance();
                //}



                List<string> fieldNames = new List<string>();
                List<string> test = new List<string>();
                FieldIterator itr;

                for (itr = form6Template.GetFieldIterator(); itr.HasNext(); itr.Next())
                {
                    Field field = itr.Current();
                    string fieldName = field.GetName();
                    fieldNames.Add(fieldName);

                    string testing = field.GetType().ToString();
                    test.Add(testing);
                }

                MemoryStream pdfStream = new MemoryStream();
                form6Template.Save(pdfStream, SDFDoc.SaveOptions.e_linearized);

                Attachment attachment = new Attachment
                {
                    filename = "Form6",
                    data = pdfStream
                };

                DisplayAttachmentPDF(attachment);

                return "Success";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }


        public string generateForm8(string token, string AuthorizationNumber, string peopleIDString, string StartDate, string EndDate, string serviceCode, string userID, string loggedInUserPersonId)
        {
            try
            {
                OODFormDataGetter obj = new OODFormDataGetter();
                Anywhere.Data.DataGetter odg = new Anywhere.Data.DataGetter();


                string SSinfo = obj.getSpreadsheetNameAndKey(token);
                SSInfo[] SSInfoObj = JsonConvert.DeserializeObject<SSInfo[]>(SSinfo);
                string registrationName = SSInfoObj[0].registrationName;
                string registrationKey = SSInfoObj[0].registrationKey;

                string crpath = obj.getFormTemplatePath(token);
                PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
                string path = pathdatalist[0].path;
                string templateFileName = "Form8WorkActivitiesAndAssessment.xlsx";
                string reportPath = string.Format(path, templateFileName);

               // long consumerID = long.Parse(peopleIDString);
                string jsonPeopleID = odg.getConsumerPeopleId(peopleIDString);
                string PeopleID = string.Empty;
                peopleId[] peopleIdObj = JsonConvert.DeserializeObject<peopleId[]>(jsonPeopleID);
                PeopleID = peopleIdObj[0].id;


                //string cleanedString;
                //if (!string.IsNullOrEmpty(jsonPeopleID)) {
                //    cleanedString = jsonPeopleID.Trim('}', '{').Trim('"');
                //    var parts = cleanedString.Split(':');
                //    if (parts.Length > 0) { PeopleID = parts[1].Trim(); }
                //    Regex.Replace(PeopleID, @"[^0-9]", "");
                //}

                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");
                string personCompletingReport = string.Empty;

                // Gather Data for the Person Completing the Report
                DataSet ds3 = new DataSet();
                //string personCompletingReport;

                if (!string.IsNullOrEmpty(loggedInUserPersonId))
                {

                    // long lng_loggedInUserPersonId = long.Parse(loggedInUserPersonId);
                    ds3 = obj.getPersonCompletingReport(token, loggedInUserPersonId);
                }

                if (ds3.Tables.Count > 0 && ds3.Tables[0].Rows.Count > 0)
                {
                    personCompletingReport = String.Format("{0} {1} ", ds3.Tables[0].Rows[0]["First_Name"], ds3.Tables[0].Rows[0]["Last_Name"]);
                }

                // string personCompletingReportData = obj.getPersonCompletingReportName(token);
                // personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                // string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;


                Spreadsheet SS = new Spreadsheet();
                SS.RegistrationName = registrationName;
                SS.RegistrationKey = registrationKey;

                SS.LoadFromFile(reportPath);

                Bytescout.Spreadsheet.Worksheet WS = SS.Worksheet(0);

                DataTable dt;
                DataRow row;

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
                string DirectStaff = string.Empty;
                string StaffWithInitals = string.Empty;
                string OODStaff = string.Empty;
                string MiddleName = string.Empty;
                DataSet ds = obj.OODForm8GetDirectStaff(AuthorizationNumber, StartDate, EndDate);

                WS.Cell("m6").Value = personCompletingReport;

                if (ds.Tables.Count > 0)
                {
                    DataTable dt2 = ds.Tables[0];
                    foreach (DataRow row2 in dt2.Rows)
                    {
                        if (row2["First_Name"].ToString().Trim().Length > 0 && row2["Last_Name"].ToString().Trim().Length > 0)
                        {
                            Staff = String.Format("{0} {1} ", row2["First_Name"], row2["Last_Name"]);
                            MiddleName = row2["Middle_Name"].ToString();
                            DirectStaff += String.Format("{0}, ", Staff.Trim());
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


                DataSet dsOODStaff = obj.Counslor(AuthorizationNumber, serviceCode, StartDate, EndDate);
                if (dsOODStaff.Tables.Count > 0)
                {
                    DataTable dtOODStaff = dsOODStaff.Tables[0];
                    foreach (DataRow rowOODStaff in dtOODStaff.Rows)
                    {
                        if (rowOODStaff["First_Name"].ToString().Trim().Length > 0 && rowOODStaff["Last_Name"].ToString().Trim().Length > 0)
                        {
                            OODStaff = String.Format("{0} {1}, ", rowOODStaff["First_Name"].ToString().Trim(), rowOODStaff["Last_Name"].ToString().Trim());
                        }
                    }

                }

                 
                WS.Cell("m7").Value = OODStaff.TrimEnd(' ', ',');

                WS.Cell("m8").ValueAsDateTime = DateTime.Parse(DateTime.Now.ToString("MM/dd/yyyy"));

                StartDate = DateTime.Parse(StartDate).ToString("yyyy-MM-dd");
                WS.Cell("m9").ValueAsDateTime = DateTime.Parse(StartDate);

                EndDate = DateTime.Parse(EndDate).ToString("yyyy-MM-dd");
                WS.Cell("m10").ValueAsDateTime = DateTime.Parse(EndDate);

                WS.Cell("m11").Value = "Final";

                WS.Cell("l15").Value = "$0.00";

                if (row["ServiceDescription"].ToString().ToUpper().Contains("CBA"))
                {
                    
                   WS.Cell("a12").Value = "Community Work Experience (Assessment)";
                    // WS.Cell("a12").Value = "Service Description 1";
                }
                else if (row["ServiceDescription"].ToString().ToUpper().Contains("JRTNS"))
                {
                    WS.Cell("a12").Value = "Community Work Experience (Internship-Non-School)";
                }
                else if (row["ServiceDescription"].ToString().ToUpper().Contains("JRTSB"))
                {
                    WS.Cell("a12").Value = "Community Work Experience (Internship-School)";
                }
                else if (row["ServiceDescription"].ToString().ToUpper().Contains("OJSUPPT"))
                {
                    WS.Cell("a12").Value = "Job Coaching";
                }
                else if (row["ServiceDescription"].ToString().ToUpper().Contains("WADJ"))
                {
                    WS.Cell("a12").Value = "Community Work Experience (Adjustment)";
                }
                else
                {
                    WS.Cell("a12").Value = "Service Description 1";
                }

                WS.Cell("l18").Value = "No";

                ds = obj.OODForm8BussinessAddress(AuthorizationNumber, StartDate, EndDate);
                if (ds.Tables.Count > 0 )
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        sb.Clear();
                        foreach (DataRow thisrow in ds.Tables[0].Rows)
                        {
                            sb.AppendFormat("{0}, ", thisrow["Name"].ToString().Trim());
                            sb.AppendFormat("{0}, {1}", thisrow["City"].ToString().Trim(), thisrow["State"].ToString().Trim());
                            sb.Append(Environment.NewLine);
                        }
                          //  row = ds.Tables[0].Rows[0];           
                       // WS.Cell("m19").Value = sb.ToString().Trim();
                        WS.Cell("m20").Value = sb.ToString().Trim();
                    }
                }

                string TaskSummary = obj.OODForm8GetJobTasksSummary(AuthorizationNumber, StartDate, EndDate, userID, PeopleID);
                if (TaskSummary.Length > 0) ;
                {
                    TaskSummary = TaskSummary.Trim();
                }

               // WS.Cell("m20").Value = TaskSummary;
                WS.Cell("m21").Value = TaskSummary;

              // WS.Cell("m21").Value = obj.OODForm8GetSupportAndTransistion(AuthorizationNumber, StartDate).ToString().Trim();
                WS.Cell("m22").Value = obj.OODForm8GetSupportAndTransistion(AuthorizationNumber, StartDate).ToString().Trim();

                ds = obj.OODForm8GetNotes(AuthorizationNumber, StartDate, EndDate, userID);

                //Int32 t = 23;
                Int32 t = 24;
                foreach (DataRow row2 in ds.Tables[0].Rows)
                {
                  
                     WS.Cell(String.Format("a{0}", t)).ValueAsDateTime = Convert.ToDateTime(row2["Service_Date"]);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                     WS.Cell(String.Format("a{0}", t)).NumberFormatString = "MM/dd/yy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                    var starttime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["Start_Time"])); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                    var endtime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["End_Time"]));
                    string formattedEndTime = endtime.ToString("hh:mm tt", CultureInfo.InvariantCulture);
                    string formattedStartTime = starttime.ToString("hh:mm tt", CultureInfo.InvariantCulture);
                    WS.Cell(String.Format("b{0}", t)).Value = formattedStartTime;
                    WS.Cell(String.Format("c{0}", t)).Value = formattedEndTime;
                   // WS.Cell(String.Format("b{0}", t)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["Start_Time"])); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                   // WS.Cell(String.Format("c{0}", t)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", row2["End_Time"]));
                    WS.Cell(String.Format("d{0}", t)).Value = "0";
                   // WS.Cell(String.Format("g{0}", t)).Value = row2["SAM"].ToString().Trim(); 
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
                      //  WS.Cell("m75").Value = row["EM_Sum_Ind_Self_Assess"].ToString().Trim();
                       // WS.Cell("m76").Value = row["EM_Sum_Provider_Assess"].ToString().Trim();
                        WS.Cell("m76").Value = row["EM_Sum_Ind_Self_Assess"].ToString().Trim();
                        WS.Cell("m77").Value = row["EM_Sum_Provider_Assess"].ToString().Trim();

                        if (row["VTS_Review"].ToString().ToUpper() == "Y")
                        {
                          //  WS.Cell("m79").Value = "Yes";
                            WS.Cell("m80").Value = "Yes";
                        }
                        else
                        {
                         //  WS.Cell("m79").Value = "No";
                            WS.Cell("m80").Value = "No";
                        }
                    }

                }

               // WS.Cell("a21").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;
                WS.Cell("a22").AlignmentVertical = Bytescout.Spreadsheet.Constants.AlignmentVertical.Top;

                MemoryStream ms = new MemoryStream();
                SS.SaveToStreamXLSX(ms);
                ms.Position = 0;

                Attachment attachment = new Attachment
                {
                    filename = "Form8.xlsx",
                    data = ms
                };

                DisplayAttachment(attachment);

                return "Success";
            }
            catch (Exception ex)
            {
                string message = ex.ToString();
                return message;
            }
        }

        public string generateForm10(string token, string referenceNumber, long VendorID, string consumerIdString, String startDate, String endDate, string userId, string loggedInUserPersonId)
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
                string personCompletingReport = string.Empty;

                // Gather Data for the Person Completing the Report
                DataSet ds3 = new DataSet();

                if (!string.IsNullOrEmpty(loggedInUserPersonId))
                {
                    ds3 = oodfdg.getPersonCompletingReport(token, loggedInUserPersonId);
                }

                if (ds3.Tables.Count > 0 && ds3.Tables[0].Rows.Count > 0)
                {
                    personCompletingReport = String.Format("{0} {1} ", ds3.Tables[0].Rows[0]["First_Name"], ds3.Tables[0].Rows[0]["Last_Name"]);
                }
                //string personCompletingReportData = oodfdg.getPersonCompletingReportName(token, loggedInUserPersonId);
                //personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                //string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;

                // Creates a unique string of numbers for the Invoice # field
                DateTime currentDate = DateTime.Now;
                string currentDateStr = currentDate.ToString("M/d/yy");
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");
                //string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", "");
                string invoiceNumber = DateTime.Now.ToString("MMddyyyyHHmmss");


                long consumerId = long.Parse(consumerIdString);
                //long serviceCodeId = long.Parse(serviceCode);

                // Gathers all the data for the table in the pdf (startTime, endTime, startLocation, endLocation, units, # in vehicle per trip, staff initials)
                string returnedData = oodfdg.getForm10PDFData(token, referenceNumber, startDate, endDate, consumerIdString, userId);
                List<form10Data> form10DataList = JsonConvert.DeserializeObject<List<form10Data>>(returnedData);

                string startDateOnReport = minDate(form10DataList);
                string endDateOnReport = maxDate(form10DataList);

                string authorizationNumber = referenceNumber;
                if (referenceNumber == "%")
                {
                    authorizationNumber = form10DataList[0].authorizationNumber;
                };

                // Takes all the staff Initials from the table and uses unique values to store the direct service staff initials
                string directServiceStaffNames = string.Join(" ", form10DataList.Select(data => data.nameAndInitials).Distinct());

                var fieldData = new List<(string fieldName, string value)>
                {
                    ("Authorization", authorizationNumber),
                    ("Provider_Invoice", invoiceNumber),
                    ("Invoice_Date", currentDateStr),
                    ("Invoice_Status", "Final"),
                    ("Person Completing Report", personCompletingReport),
                    ("Service_Start_Date_af_date", startDateOnReport),
                    ("Service_End_Date_af_date", endDateOnReport),
                    ("Individuals Name", form10DataList[0].individualsName),
                    ("Direct Service Staff Name and Initials", directServiceStaffNames),
                    ("Provider Name", form10DataList[0].vendorName),
                    ("VR CounselorCoordinator", form10DataList[0].VR_CounselorContractor)
                };

                double invoiceTotal = 0;

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
                    DateTime dateTime = DateTime.Parse(form10DataList[i - 1].date);
                    string datePart = dateTime.ToString("M/d/yy");

                    DateTime parsedStartTime = DateTime.ParseExact(form10DataList[i - 1].startTime, "HH:mm:ss", CultureInfo.InvariantCulture);

                    string formattedStartTime = parsedStartTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);

                    DateTime parsedEndTime = DateTime.ParseExact(form10DataList[i - 1].endTime, "HH:mm:ss", CultureInfo.InvariantCulture);

                    string formattedEndTime = parsedEndTime.ToString("hh:mm tt", CultureInfo.InvariantCulture);

                    TimeSpan timeDifference = parsedEndTime - parsedStartTime;
                    double minutesDifference = timeDifference.TotalMinutes;

                    int units = (int)Math.Ceiling(minutesDifference / 6);

                    if (parsedEndTime < parsedStartTime)
                    {
                        units = -units;
                    }

                    double currentRowTotal = (units / Double.Parse(form10DataList[i - 1].vehiclePerTrip)) * 5.6;
                    invoiceTotal = Math.Round((invoiceTotal + currentRowTotal), 2); ;

                    string formattedUnits = units.ToString();

                    var tableData = new List<(string fieldName, string value)>
                    {
                        ("Date3_af_date.0." + (i -1), datePart),
                        ("START_TIMERow" + i, formattedStartTime),
                        ("END_TIMERow" + i, formattedEndTime),
                        ("UNITSRow" + i, formattedUnits),
                        ("People" + i, form10DataList[i-1].vehiclePerTrip),
                        ("START LOCATION STREETCITYRow" + i, form10DataList[i-1].startLocation),
                        ("END LOCATION STREETCITYRow" + i, form10DataList[i-1].endLocation),
                        ("STAFF INITIALSRow" + i, form10DataList[i-1].staffInitials),
                        ("Text4", invoiceTotal.ToString("C2"))
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
                List<string> test = new List<string>();
                FieldIterator itr;

                for (itr = form10Template.GetFieldIterator(); itr.HasNext(); itr.Next())
                {
                    Field field = itr.Current();
                    string fieldName = field.GetName();
                    fieldNames.Add(fieldName);

                    string testing = field.GetType().ToString();
                    test.Add(testing);
                }

                MemoryStream pdfStream = new MemoryStream();
                form10Template.Save(pdfStream, SDFDoc.SaveOptions.e_linearized);

                Attachment attachment = new Attachment
                {
                    filename = "Form10",
                    data = pdfStream
                };

                DisplayAttachmentPDF(attachment);

                return "Success";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public string generateForm16(string token, string AuthorizationNumber, string consumerIDString, string StartDate, string EndDate, string serviceCode, string userID, string loggedInUserPersonId)
        {
            try
            {

                OODFormDataGetter obj = new OODFormDataGetter();

                string SSinfo = obj.getSpreadsheetNameAndKey(token);
                SSInfo[] SSInfoObj = JsonConvert.DeserializeObject<SSInfo[]>(SSinfo);
                string registrationName = SSInfoObj[0].registrationName;
                string registrationKey = SSInfoObj[0].registrationKey;

                string crpath = obj.getFormTemplatePath(token);
                PathItem[] pathdatalist = JsonConvert.DeserializeObject<PathItem[]>(crpath);
                string path = pathdatalist[0].path;
                string templateFileName = "Form16SummerYouthWorkExperience.xlsx";
                string reportPath = string.Format(path, templateFileName);

                long PeopleID = long.Parse(consumerIDString);

                // Fill out TOP Portion of the XLS SPREADSHEET********************************************************************************************************	

                DateTime currentDate = DateTime.Now;
                string invoiceNumberDate = currentDate.ToString("yyy-MM-dd HH:MM:ss");  //********TOP8. Invoice Date = mm/dd/yyyy for today's date
                string invoiceNumber = Regex.Replace(invoiceNumberDate, "[^0-9]", ""); //********TOP3.  Provider Invoice # = mmddyyyyhhmmss where mmddyyyy is the current month

                // Gather Data for the Person Completing the Report
                string personCompletingReportData = obj.getPersonCompletingReportName(token);
                personCompletingReport[] personCompletingReportObj = JsonConvert.DeserializeObject<personCompletingReport[]>(personCompletingReportData);
                string personCompletingReport = personCompletingReportObj[0].First_Name + " " + personCompletingReportObj[0].Last_Name;   //*********TOP6. Name of Person Completing Report

                Spreadsheet SS = new Spreadsheet();
                SS.RegistrationName = registrationName;
                SS.RegistrationKey = registrationKey;

                SS.LoadFromFile(reportPath);

                Bytescout.Spreadsheet.Worksheet WS = SS.Worksheet(0);

                DataTable dt;
                DataRow row;

                AuthorizationNumber = AuthorizationNumber.Replace("+", " ");
                dt = obj.OODDevelopment(AuthorizationNumber).Tables[0];
                row = dt.Rows[0];

                StartDate = DateTime.Parse(StartDate).ToString("yyyy-MM-dd");     //*******TOP9. Service Start Date = min(case_notes.service_date) for the selected consumer and reference number
                EndDate = DateTime.Parse(EndDate).ToString("yyyy-MM-dd");         //*******TOP10. Service End Date = max(case_notes.service_date) for the selected consumer and reference number
                WS.Cell("G9").Value = StartDate.ToString();
                WS.Cell("G10").Value = EndDate.ToString();

                string ProviderName = string.Format("{0}", row["VendorName"].ToString().Trim());  //*****TOP1. Provider Name =vendors.name for the vendor the selected consumer is tied to
                WS.Cell("G1").Value = ProviderName.ToString();

                WS.Cell("G2").Value = AuthorizationNumber.ToString(); //********TOP2.  Authorization # = Reference number selected by user on Anywhere OOD filter

                WS.Cell("G3").Value = invoiceNumber.ToString();

                string ConsumerName = string.Format("{0} {1}", row["ConsumerFirstName"].ToString().Trim(), row["ConsumerLastName"].ToString().Trim()); //*********TOP4. Individual's Name = First and Last name of the selected consumer 
                WS.Cell("G4").Value = ConsumerName;


                // string servicename = string.Format("{0}", row["ServiceName"].ToString().Trim()); //********NOT USED ??
                // WS.Cell("a12").Value = servicename;


                string Staff = string.Empty;
                string StaffWithInitals = string.Empty;
                string OODStaff = string.Empty;
                string MiddleName = string.Empty;
                DataSet ds = obj.OODForm8GetDirectStaff(AuthorizationNumber, StartDate, EndDate);

              

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

                        if (Staff.ToString().Trim().Length > 0)
                        {
                            StaffWithInitals += String.Format("{0} ({1}), ", Staff, row2["Initials"].ToString());
                        }
                    }
                }

                if (StaffWithInitals.Length > 0)
                {
                    WS.Cell("G5").Value = StaffWithInitals.ToString().Trim().Substring(0, StaffWithInitals.Length - 2);
                }
                else
                {
                    WS.Cell("G5").Value = String.Empty;
                }


                DataSet dsOODStaff = obj.OODForm16GetOODStaff(AuthorizationNumber, consumerIDString, StartDate, EndDate);
                if (dsOODStaff.Tables.Count > 0)
                {
                    DataTable dtOODStaff = dsOODStaff.Tables[0];
                    foreach (DataRow rowOODStaff in dtOODStaff.Rows)
                    {
                        if (rowOODStaff["First_Name"].ToString().Trim().Length > 0 && rowOODStaff["Last_Name"].ToString().Trim().Length > 0)
                        {
                            OODStaff = String.Format("{0} {1} ({2}) ", rowOODStaff["First_Name"].ToString().Trim(), rowOODStaff["Last_Name"].ToString().Trim(), rowOODStaff["Initials"].ToString().Trim());
                        }
                    }

                }
                DataSet ds3 = new DataSet();

                if (!string.IsNullOrEmpty(loggedInUserPersonId)) {

                   // long lng_loggedInUserPersonId = long.Parse(loggedInUserPersonId);
                    ds3 = obj.getPersonCompletingReport(token, loggedInUserPersonId);
                }
                


                if (ds3.Tables.Count > 0 && ds3.Tables[0].Rows.Count > 0)
                {
                    WS.Cell("G6").Value = String.Format("{0} {1} ", ds3.Tables[0].Rows[0]["First_Name"], ds3.Tables[0].Rows[0]["Last_Name"]);
                }


                WS.Cell("G7").Value = OODStaff;

                WS.Cell("G8").ValueAsDateTime = DateTime.Parse(DateTime.Now.ToString("MM/dd/yyyy"));

                StartDate = DateTime.Parse(StartDate).ToString("yyyy-MM-dd");
                WS.Cell("G9").ValueAsDateTime = DateTime.Parse(StartDate);

                EndDate = DateTime.Parse(EndDate).ToString("yyyy-MM-dd");
                WS.Cell("G10").ValueAsDateTime = DateTime.Parse(EndDate);

                WS.Cell("G11").Value = "Final";      //**************TOP11. Invoice Status = "Final"


                int cpt = row["CPT_Code"].ToString().ToUpper().Trim().LastIndexOf(":") + 2;
               string code = row["ServiceName"].ToString().ToUpper().Trim();  //***********TOP12.  Service Description 1 
                 WS.Cell("A12").Value = code; // Equation in this cell 

                WS.Cell("F15").Value = "0.00";   //************TOP13.  Vocational Training Stipend Rate = $0.00
               WS.Cell("F16").Value = "No";     //************TOP14.  Bilingual Supplement = No

                // Fill out DETAIL DATA Portion of the XLS SPREADSHEET********************************************************************************************************

                // Start --- FILL IN DAILY ENTRIES
                List<form16Data> firstweekdata = new List<form16Data>();
                List<form16Data> secondweekdata = new List<form16Data>();
                List<form16Data> thirdweekdata = new List<form16Data>();
                List<form16Data> fourthweekdata = new List<form16Data>();
                List<form16Data> fifthweekdata = new List<form16Data>();

                //get the week breakdowns
                DateTime parsedStartDate = DateTime.ParseExact(StartDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                DateTime parsedEndDate = DateTime.ParseExact(EndDate, "yyyy-MM-dd", CultureInfo.InvariantCulture);

                List<WeekRangeDates> weekDates = new List<WeekRangeDates>();

                // Call the GetRange method to get the weekly intervals
                int weekcount = 0;
                foreach (var week in GetRange(parsedStartDate, parsedEndDate))
                {
                    // Console.WriteLine($"Start: {week.Start.ToShortDateString()} End: {week.End.ToShortDateString()}");
                    weekcount = weekcount + 1;
                    weekDates.Add(new WeekRangeDates { WeekNumber = weekcount.ToString(), StartDate = week.Start, EndDate = week.End });
                }

                // get data from DB for the weekly entries
                DataSet dstest = obj.OODForm16GetNotes(AuthorizationNumber, StartDate, EndDate, userID);
                
                if (dstest.Tables.Count > 0 && dstest.Tables[0].Rows.Count > 0)
                {
                    // fill in the weekly entries on the EXCEL Spreadsheet
                    foreach (WeekRangeDates week in weekDates)
                    {
                        string strStartDate = week.StartDate.ToString("yyyy-MM-dd");
                        string strEndDate = week.EndDate.ToString("yyyy-MM-dd");

                        foreach (DataRow row2 in dstest.Tables[0].Rows)
                        {

                            DateTime thisServiceDate = Convert.ToDateTime(row2["Service_date"]);

                            if (thisServiceDate != null)
                            {
                                if (thisServiceDate.IsInRange(week.StartDate, week.EndDate)) {

                                    switch (week.WeekNumber)
                                    {
                                       
                                        case ("1"):

                                            firstweekdata.Add(new form16Data
                                            {
                                                BusinessName = dstest.Tables[0].Rows[0]["BusinessName"].ToString(),
                                                Service_date = row2["Service_date"].ToString(),
                                                Start_Time = row2["Start_Time"].ToString(),
                                                End_Time = row2["End_Time"].ToString(),
                                                Initials = row2["Initials"].ToString(),
                                                Interventions = row2["Interventions"].ToString()
                                            });
                                        break;
                                        case ("2"):
                                            secondweekdata.Add(new form16Data
                                            {
                                                BusinessName = dstest.Tables[0].Rows[0]["BusinessName"].ToString(),
                                                Service_date = row2["Service_date"].ToString(),
                                                Start_Time = row2["Start_Time"].ToString(),
                                                End_Time = row2["End_Time"].ToString(),
                                                Initials = row2["Initials"].ToString(),
                                                Interventions = row2["Interventions"].ToString()
                                            });
                                            break;
                                        case ("3"):
                                            thirdweekdata.Add(new form16Data
                                            {
                                                BusinessName = dstest.Tables[0].Rows[0]["BusinessName"].ToString(),
                                                Service_date = row2["Service_date"].ToString(),
                                                Start_Time = row2["Start_Time"].ToString(),
                                                End_Time = row2["End_Time"].ToString(),
                                                Initials = row2["Initials"].ToString(),
                                                Interventions = row2["Interventions"].ToString()
                                            });

                                            break;
                                        case ("4"):
                                            fourthweekdata.Add(new form16Data
                                            {
                                                BusinessName = dstest.Tables[0].Rows[0]["BusinessName"].ToString(),
                                                Service_date = row2["Service_date"].ToString(),
                                                Start_Time = row2["Start_Time"].ToString(),
                                                End_Time = row2["End_Time"].ToString(),
                                                Initials = row2["Initials"].ToString(),
                                                Interventions = row2["Interventions"].ToString()
                                            });

                                            break;
                                        case ("5"):
                                            fifthweekdata.Add(new form16Data
                                            {
                                                BusinessName = dstest.Tables[0].Rows[0]["BusinessName"].ToString(),
                                                Service_date = row2["Service_date"].ToString(),
                                                Start_Time = row2["Start_Time"].ToString(),
                                                End_Time = row2["End_Time"].ToString(),
                                                Initials = row2["Initials"].ToString(),
                                                Interventions = row2["Interventions"].ToString()
                                            });

                                            break;
                                        case ("6"):
                                            
                                        break;
                                        default:
                                            break;
                                  }
                                }
                            }
                        }
                    }
                }

                if (firstweekdata.Count > 0)
                {
                    Int32 firstCell;

                    firstCell = 25;
                    WS.Cell("G19").Value = firstweekdata[0].BusinessName;

                    foreach (form16Data item in firstweekdata)
                    {
                        WS.Cell(String.Format("a{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(item.Service_date);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                        WS.Cell(String.Format("a{0}", firstCell)).NumberFormatString = "MM/dd/yyy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                        WS.Cell(String.Format("b{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.Start_Time)); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                        WS.Cell(String.Format("c{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.End_Time));
                        WS.Cell(String.Format("d{0}", firstCell)).Value = "0";
                        WS.Cell(String.Format("f{0}", firstCell)).Value = item.Initials.ToString().Trim();
                        WS.Cell(String.Format("g{0}", firstCell)).Value = item.Interventions.ToString().Trim();
                        WS.Cell(String.Format("n{0}", firstCell)).FontColor = System.Drawing.Color.Black;
                        firstCell += 1;
                    }
                }

                if (secondweekdata.Count > 0)
                {
                    Int32 firstCell;

                    firstCell = 38;
                    WS.Cell("G32").Value = secondweekdata[0].BusinessName;

                    foreach (form16Data item in secondweekdata)
                    {
                        WS.Cell(String.Format("a{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(item.Service_date);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                        WS.Cell(String.Format("a{0}", firstCell)).NumberFormatString = "MM/dd/yyy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                        WS.Cell(String.Format("b{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.Start_Time)); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                        WS.Cell(String.Format("c{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.End_Time));
                        WS.Cell(String.Format("d{0}", firstCell)).Value = "0";
                        WS.Cell(String.Format("f{0}", firstCell)).Value = item.Initials.ToString().Trim();
                        WS.Cell(String.Format("g{0}", firstCell)).Value = item.Interventions.ToString().Trim();
                        WS.Cell(String.Format("n{0}", firstCell)).FontColor = System.Drawing.Color.Black;
                        firstCell += 1;
                    }
                }

                if (thirdweekdata.Count > 0)
                {
                    Int32 firstCell;

                    firstCell = 51;
                    WS.Cell("G45").Value = thirdweekdata[0].BusinessName;

                    foreach (form16Data item in thirdweekdata)
                    {
                               WS.Cell(String.Format("a{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(item.Service_date);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                               WS.Cell(String.Format("a{0}", firstCell)).NumberFormatString = "MM/dd/yyy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                               WS.Cell(String.Format("b{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.Start_Time)); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                               WS.Cell(String.Format("c{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.End_Time));
                               WS.Cell(String.Format("d{0}", firstCell)).Value = "0";
                               WS.Cell(String.Format("f{0}", firstCell)).Value = item.Initials.ToString().Trim();
                               WS.Cell(String.Format("g{0}", firstCell)).Value = item.Interventions.ToString().Trim();
                              WS.Cell(String.Format("n{0}", firstCell)).FontColor = System.Drawing.Color.Black;
                                firstCell += 1;
                    }
                }

                if (fourthweekdata.Count > 0)
                {
                    Int32 firstCell;

                    firstCell = 64;
                    WS.Cell("G58").Value = fourthweekdata[0].BusinessName;

                    foreach (form16Data item in fourthweekdata)
                    {
                        WS.Cell(String.Format("a{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(item.Service_date);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                        WS.Cell(String.Format("a{0}", firstCell)).NumberFormatString = "MM/dd/yyy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                        WS.Cell(String.Format("b{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.Start_Time)); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                        WS.Cell(String.Format("c{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.End_Time));
                        WS.Cell(String.Format("d{0}", firstCell)).Value = "0";
                        WS.Cell(String.Format("f{0}", firstCell)).Value = item.Initials.ToString().Trim();
                        WS.Cell(String.Format("g{0}", firstCell)).Value = item.Interventions.ToString().Trim();
                        WS.Cell(String.Format("n{0}", firstCell)).FontColor = System.Drawing.Color.Black;
                        firstCell += 1;
                    }
                }

                if (fifthweekdata.Count > 0)
                {
                    Int32 firstCell;

                    firstCell = 77;
                    WS.Cell("G71").Value = fifthweekdata[0].BusinessName;

                    foreach (form16Data item in fifthweekdata)
                    {
                        WS.Cell(String.Format("a{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(item.Service_date);// Convert.ToDateTime(Convert.ToDateTime(row2["Service_date"]).ToString("MM/dd/yyyy")); //.ToString("MM/dd/yyyy"); //DateTime.ParseExact((DateTime)row2["Service_date"],"MM/dd/yyyy",CultureInfo.InvariantCulture); 
                        WS.Cell(String.Format("a{0}", firstCell)).NumberFormatString = "MM/dd/yyy"; //  Bytescout.Spreadsheet.ExtendedFormat.;
                        WS.Cell(String.Format("b{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.Start_Time)); //  Convert.ToDateTime(Convert.ToDateTime(row2["Start_Time"]).ToString("h:mm tt")); // CDate(String.Format("{0} {1}", "12/31/1899", row("Start_Time"))).ToString("MM/dd/yyyy h:mm:00 tt")
                        WS.Cell(String.Format("c{0}", firstCell)).ValueAsDateTime = Convert.ToDateTime(string.Format("12/31/1899 {0}", item.End_Time));
                        WS.Cell(String.Format("d{0}", firstCell)).Value = "0";
                        WS.Cell(String.Format("f{0}", firstCell)).Value = item.Initials.ToString().Trim();
                        WS.Cell(String.Format("g{0}", firstCell)).Value = item.Interventions.ToString().Trim();
                        WS.Cell(String.Format("n{0}", firstCell)).FontColor = System.Drawing.Color.Black;
                        firstCell += 1;
                    }
                }
                // END --- FILL IN DAILY ENTRIES

                // Start --- FILL IN Scheduled Work Times 

                DataSet dsScheduleWorkTimes = obj.OODForm16GetScheduledWorkTimes(AuthorizationNumber, StartDate, EndDate, userID);

                if (dsScheduleWorkTimes.Tables.Count > 0 && dsScheduleWorkTimes.Tables[0].Rows.Count > 0)
                {
                    // fill in the weekly entries on the EXCEL Spreadsheet
                    foreach (WeekRangeDates week in weekDates)
                    {
                        string strStartDate = week.StartDate.ToString("yyyy-MM-dd");
                        string strEndDate = week.EndDate.ToString("yyyy-MM-dd");

                        //construct another list
                        List<form16ScheduledWorkTimes> scheduledTimes = new List<form16ScheduledWorkTimes>();
                        List<form16ScheduledWorkTimes> finalScheduledTimes = new List<form16ScheduledWorkTimes>();

                        foreach (DataRow row2 in dsScheduleWorkTimes.Tables[0].Rows)
                        {
                            //string scheduledWorkTime;
                            DateTime thisStartTime = DateTime.ParseExact(row2["start_time"].ToString(), "HH:mm:ss", CultureInfo.InvariantCulture);
                            DateTime thisEndTime = DateTime.ParseExact(row2["end_time"].ToString(), "HH:mm:ss", CultureInfo.InvariantCulture);

                            string thisStartTimeAMPM = thisStartTime.ToString("hh\\:mm");
                            string thisEndTimeAMPM =  thisEndTime.ToString("hh\\:mm");

                            string scheduledWorkTime = thisStartTimeAMPM + " - " + thisEndTimeAMPM + "\r\n";
                            string scheduledWorkTimeServiceDate = row2["Service_Date"].ToString();
                            scheduledTimes.Add(new form16ScheduledWorkTimes {Service_Date = scheduledWorkTimeServiceDate, Time_Range = scheduledWorkTime });
                        }

                        //for (var i = 0; i <= scheduledTimes.Count-1; i++)
                        //{
                        //    if (i == scheduledTimes.Count - 1)
                        //    {
                        //        finalScheduledTimes.Add(new form16ScheduledWorkTimes { Service_Date = scheduledTimes[i].Service_Date, Time_Range = scheduledTimes[i].Time_Range });
                        //        break;
                        //    }
                        //    if (scheduledTimes[i].Service_Date == scheduledTimes[i + 1].Service_Date)
                        //    {
                        //        finalScheduledTimes.Add(new form16ScheduledWorkTimes { Service_Date = scheduledTimes[i].Service_Date, Time_Range = scheduledTimes[i].Time_Range + scheduledTimes[i+1].Time_Range });
                        //    } else
                        //    {
                        //        if (!finalScheduledTimes.Exists(ts => ts.Service_Date == scheduledTimes[i].Service_Date))
                        //        {
                        //            finalScheduledTimes.Add(new form16ScheduledWorkTimes { Service_Date = scheduledTimes[i].Service_Date, Time_Range = scheduledTimes[i].Time_Range });
                        //        }   
                        //    }

                        //}

                        //List<string> Week1Ranges = new List<string>();
                        //List<string> Week2Ranges = new List<string>();
                        //List<string> Week3Ranges = new List<string>();
                        //List<string> Week4Ranges = new List<string>();
                        //List<string> Week5Ranges = new List<string>();

                        string Week1Ranges = " ";
                        string Week2Ranges = " ";
                        string Week3Ranges = " ";
                        string Week4Ranges = " ";
                        string Week5Ranges = " ";


                        foreach (form16ScheduledWorkTimes thisthing in scheduledTimes)
                        {
                            
                            DateTime thisServiceDate = Convert.ToDateTime(thisthing.Service_Date);

                            if (thisServiceDate != null)
                            {
                                if (thisServiceDate.IsInRange(week.StartDate, week.EndDate))
                                {
                                    switch (week.WeekNumber)
                                    {

                                        case ("1"):

                                            // WS.Cell("B20").Value = WS.Cell("B20").Value + thisthing.Time_Range;
                                            Week1Ranges = Week1Ranges.AddIfNotPresent(thisthing.Time_Range);
                                            //Week1Ranges.Add(thisthing.Time_Range);
                                            WS.Cell("B20").Value = "";
                                            WS.Cell("B20").Value = Week1Ranges;
                                            break;
                                        case ("2"):

                                            // WS.Cell("B33").Value = WS.Cell("B33").Value + thisthing.Time_Range;
                                            Week2Ranges = Week2Ranges.AddIfNotPresent(thisthing.Time_Range);
                                            //Week2Ranges.Add(thisthing.Time_Range);
                                            WS.Cell("B33").Value = "";
                                            WS.Cell("B33").Value = Week2Ranges;

                                            break;
                                        case ("3"):
                                            //  WS.Cell("B46").Value = WS.Cell("B46").Value + thisthing.Time_Range;
                                            Week3Ranges = Week3Ranges.AddIfNotPresent(thisthing.Time_Range);
                                            //Week3Ranges.Add(thisthing.Time_Range);
                                            WS.Cell("B46").Value = "";
                                            WS.Cell("B46").Value = Week3Ranges;
                                            break;
                                        case ("4"):
                                            // WS.Cell("B59").Value = WS.Cell("B59").Value + thisthing.Time_Range;
                                            Week4Ranges = Week4Ranges.AddIfNotPresent(thisthing.Time_Range);
                                           // Week4Ranges.Add(thisthing.Time_Range);
                                            WS.Cell("B59").Value = "";
                                            WS.Cell("B59").Value = Week4Ranges;
                                            break;
                                        case ("5"):
                                            //WS.Cell("B72").Value = WS.Cell("B72").Value + thisthing.Time_Range;
                                             Week5Ranges = Week5Ranges.AddIfNotPresent(thisthing.Time_Range);
                                            //Week5Ranges.Add(thisthing.Time_Range);
                                            WS.Cell("B72").Value = "";
                                            WS.Cell("B72").Value = Week5Ranges;

                                            break;
                                        case ("6"):

                                            break;
                                        default:
                                            break;
                                    }
                                }
                            }
                        }
                    }
                }
                // END --- FILL IN Scheduled Work Times 


                // Start--- FILL IN Group Numbers 

                foreach (WeekRangeDates week in weekDates)
                {
                    string strStartDate = week.StartDate.ToString("yyyy-MM-dd");
                    string strEndDate = week.EndDate.ToString("yyyy-MM-dd");
              
                    DataSet dsGroupNumber = obj.OODForm16GetGroupNumber(AuthorizationNumber, strStartDate, strEndDate);

                    if (dsGroupNumber.Tables.Count > 0 && dsGroupNumber.Tables[0].Rows.Count > 0)
                    {
                       
                        foreach (DataRow row3 in dsGroupNumber.Tables[0].Rows)
                        {
                            string thisgroupNumber = "";
                            if (row3["ratio_consumers"] is null || row3["ratio_consumers"].ToString() == "")
                            {
                                thisgroupNumber = "";
                            } else
                            {
                                thisgroupNumber = row3["ratio_consumers"].ToString();
                            }

                            switch (week.WeekNumber)
                            {
                                
                                case ("1"):
                                    WS.Cell("E20").Value = thisgroupNumber;
                                    break;
                                case ("2"):
                                    WS.Cell("E33").Value = thisgroupNumber;

                                    break;
                                case ("3"):
                                    WS.Cell("E46").Value = thisgroupNumber;

                                    break;
                                case ("4"):
                                    WS.Cell("E59").Value = thisgroupNumber;

                                    break;
                                case ("5"):
                                    WS.Cell("E72").Value = thisgroupNumber;

                                    break;
                                case ("6"):

                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    else
                    {
                        WS.Cell("E20").Value = "";
                    }
                }

                // Calculate 

                // END--- FILL IN Group Numbers 


                // Start--- FILL IN Service Hours Offered 

                foreach (WeekRangeDates week in weekDates)
                {
                    string strStartDate = week.StartDate.ToString("yyyy-MM-dd");
                    string strEndDate = week.EndDate.ToString("yyyy-MM-dd");

                    DataSet dsTotalHoursSum = obj.OODForm16ServiceHoursOffered(AuthorizationNumber, strStartDate, strEndDate);

                    if (dsTotalHoursSum.Tables.Count > 0 && dsTotalHoursSum.Tables[0].Rows.Count > 0)
                    {

                        foreach (DataRow row3 in dsTotalHoursSum.Tables[0].Rows)
                        {
                            string TotalHoursSum = "";
                            if (row3["TotalHoursSum"] is null || row3["TotalHoursSum"].ToString() == "")
                            {
                                TotalHoursSum = "";
                            }
                            else
                            {
                                TotalHoursSum = row3["TotalHoursSum"].ToString();
                            }

                            switch (week.WeekNumber)
                            {

                                case ("1"):
                                    WS.Cell("B21").Value = TotalHoursSum;
                                    break;
                                case ("2"):
                                    WS.Cell("B34").Value = TotalHoursSum;

                                    break;
                                case ("3"):
                                    WS.Cell("B47").Value = TotalHoursSum;

                                    break;
                                case ("4"):
                                    WS.Cell("B60").Value = TotalHoursSum;

                                    break;
                                case ("5"):
                                    WS.Cell("B73").Value = TotalHoursSum;

                                    break;
                                case ("6"):

                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                    else
                    {
                       // WS.Cell("E20").Value = "";
                    }
                }
                // END--- FILL IN Service Hours Offered

                // Fill out Bottom Summary Portion of the XLS SPREADSHEET********************************************************************************************************	

                ds = obj.OODForm8BackgroundChecks(AuthorizationNumber, EndDate);
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        row = ds.Tables[0].Rows[0];
                        WS.Cell("G85").Value = row["EM_Sum_Ind_Self_Assess"].ToString().Trim();        //*****************BOTTOM1.  Individual's Self-Assessment 
                        WS.Cell("G86").Value = row["EM_Sum_Provider_Assess"].ToString().Trim();		   //****************BOTTOM2.  Provider's Summary & Recommendations =

                        if (row["VTS_Review"].ToString().ToUpper() == "Y")
                        {
                            WS.Cell("G89").Value = "Yes";						//*************BOTTOM3.  Provider's Summary and Recommendations
                        }
                        else
                        {
                            WS.Cell("G89").Value = "No";						//*************BOTTOM3.  
                        }
                    }
                }

                // Have you reviewed the Vocational Training Stipend(VTS) with the individual?
                // WS.Cell("G89").Value = "Yes";

                // Create Attachment from  the XLS SPREADSHEET********************************************************************************************************	

                MemoryStream ms = new MemoryStream();
                SS.SaveToStreamXLSX(ms);
                ms.Position = 0;

                Attachment attachment = new Attachment
                {
                    filename = "Form16.xlsx",
                    data = ms
                };

                DisplayAttachment(attachment);

                return "Success";
            }
            catch (Exception ex)
            {
                string message = ex.ToString();
                return message;
            }
        }

        // BEGIN -- Form 16 -- Dealing with a passed in month date range , however the Form 16 Excel breaks down the data by the week 
        
        public static IEnumerable<Range> GetRange(DateTime start, DateTime end)
        {
            DateTime currentStart = start;
            DateTime currentEnd = start;
            do
            {
                if (currentEnd.DayOfWeek == DayOfWeek.Saturday)
                {
                    yield return new Range(currentStart, currentEnd);
                    currentStart = currentEnd.AddDays(1);
                }
                currentEnd = currentEnd.AddDays(1);
            } while (currentEnd <= end);

            if (currentStart <= end)
            {
                yield return new Range(currentStart, end);
            }
        }

        public struct Range
        {
            public DateTime Start { get; private set; }
            public DateTime End { get; private set; }

            public Range(DateTime start, DateTime end)
            {
                Start = start;
                End = end;
            }
        }

        public class WeekRangeDates
        {
            public string WeekNumber { get; set; }
            public DateTime StartDate { get; set; }
            public DateTime EndDate { get; set; }

        }

       

        // END -- Form 16 -- Dealing with a passed in month date range , however the Form 16 Excel breaks down the data by the week 

        public string minDate(List<form10Data> dataList)
        {
            if (dataList.Count == 0)
            {
                // Handle the case where the list is empty
                throw new InvalidOperationException("The list is empty.");
            }

            DateTime minDate = DateTime.Parse(dataList[0].date);

            foreach (var item in dataList)
            {
                DateTime currentDate = DateTime.Parse(item.date);
                if (currentDate < minDate)
                {
                    minDate = currentDate;
                }
            }

            // Format the minDate as "m/d/yy" and return it as a string
            return minDate.ToString("M/d/yy");
        }

        public string maxDate(List<form10Data> dataList)
        {
            if (dataList.Count == 0)
            {
                // Handle the case where the list is empty
                throw new InvalidOperationException("The list is empty.");
            }

            DateTime maxDate = DateTime.Parse(dataList[0].date);

            foreach (var item in dataList)
            {
                DateTime currentDate = DateTime.Parse(item.date);
                if (currentDate > maxDate)
                {
                    maxDate = currentDate;
                }
            }

            // Format the minDate as "m/d/yy" and return it as a string
            return maxDate.ToString("M/d/yy");
        }

        public void DisplayAttachment(Attachment attachment)
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
                }
            }
            catch (Exception ex)
            {
                response.Write("Error: " + ex.InnerException.ToString());
            }
            finally
            {
                // Dispose the MemoryStream
                attachment.data.Dispose();
            }
        }

        public void DisplayAttachmentPDF(Attachment attachment)
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
                    response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ".pdf" + ";");
                    response.ContentType = "application/pdf";
                    //response.AddHeader("Transfer-Encoding", "identity");
                    response.BinaryWrite(bytes);
                }
            }
            catch (Exception ex)
            {
                response.Write("Error: " + ex.InnerException.ToString());
            }
            finally
            {
                //logger2.debug("Done?");
            }
        }
    }

    public class form6Data
    {
        public string providerName { get; set; }
        public string individualsName { get; set; }
        public string IPEGoal { get; set; }
        public string nameAndInitials { get; set; }
        public string personCompletingReport { get; set; }
        public string VR_CounselorContractor { get; set; }
        public string authorizationNumber { get; set; }
        public string providerInvoiceNumber { get; set; }
        public string service { get; set; }
        public string bilingual{ get; set; }
        public string SAMLevel{ get; set; }
        public string invoiceDate { get; set; }
        public string serviceStartDate { get; set; }
        public string serviceEndDate { get; set; }
        

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
        public string nameAndInitials { get; set; }
        public string individualsName { get; set; }
        public string authorizationNumber { get; set; }
        public string vendorName { get; set; }
        public string VR_CounselorContractor { get; set; }
    }

    public class form16Data
    {
        public string BusinessName { get; set; }
        public string Service_date { get; set; }
        public string Start_Time { get; set; }
        public string End_Time { get; set; }
        public string Initials { get; set; }
        public string Interventions { get; set; }
        public string ScheduledWorkTimes { get; set; }

    }

    public class form16ScheduledWorkTimes
    {
        public string Service_Date { get; set; }
        public string Start_Time { get; set; }
        public string End_Time { get; set; }
        public string Time_Range { get; set; }

    }


    public class personCompletingReport
    {
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
    }

    public class peopleId
    {
        public string id { get; set; }

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

    public static class DateTimeExtensions
    {
        public static bool IsInRange(this DateTime dateToCheck, DateTime startDate, DateTime endDate)
        {
            return dateToCheck >= startDate && dateToCheck <= endDate;
        }
    }

    public static class StringExtensions
    {
        public static string AddIfNotPresent(this string existingString, string newString)
        {
            // Check if both strings are not null or empty
            if (!string.IsNullOrEmpty(existingString) && !string.IsNullOrEmpty(newString))
            {
                // Check if the new string is not already present (case-insensitive)
                //if (!existingString.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries)
                  //  .Select(s => s.ToLower())
                   // .Contains(newString.ToLower()))
                if (!existingString.Contains(newString))
                {
                    // If not present, concatenate the new string
                    return existingString + "" + newString;
                }
            }

            // Return the original string if nothing changed
            return existingString;
        }
    }
}
