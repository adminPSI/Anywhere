using System;
using System.Windows.Forms;
using Anywhere.service.Data;
//using OODReportsCSharp.Properties;
using PSIOISP;
using System;
using System.Data;
using System.Data.Odbc;
using System.Text;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using Anywhere.Log;
using System.Configuration;
using System.Linq;
//using System.Threading.Tasks;
//using static System.Windows.Forms.VisualStyles.VisualStyleElement.TrackBar;

namespace OODForms
{
    class OODFormDataGetter

    #region "OOD 8"
    {
        private StringBuilder sb = new StringBuilder();
        private PSIData di = new PSIData();
        private static Loger logger = new Loger();
        //private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        OODFormWorker obj = new OODFormWorker();

        public DataSet OODInidivualsName(long VendorID)
        {
            sb.Clear();
            sb.Append("SELECT distinct persons.First_Name, persons.Last_Name");
            sb.Append("FROM DBA.Vendors ");
            sb.AppendFormat("WHERE Vendor_ID = {0} ", VendorID);
            return di.SelectRowsDS(sb.ToString());
        }
        public DataSet OODVendor(long VendorID)
        {
            sb.Clear();
            sb.Append("SELECT Name AS ProviderName, Address1, City, State, Zipcode, Fax, Phone ");
            sb.Append("FROM DBA.Vendors ");
            sb.AppendFormat("WHERE Vendor_ID = {0} ", VendorID);
            return di.SelectRowsDS(sb.ToString());
        }
        public DataSet OODForm8GetDirectStaff72022(string AuthorizationNumber, string StartDate, string EndDate)
        {
            sb.Clear();
            sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("AND dba.EM_Job_Task.Task_Number > 7 ");
            sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
            sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
            long PosNumber = 0;
            DataSet ds = di.SelectRowsDS(sb.ToString());
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    PosNumber = (long)ds.Tables[0].Rows[0]["Position_ID"];

                }
            }

            sb.Clear();
            sb.Append("SELECT   dba.People.Last_Name, dba.People.First_Name, dba.People.Middle_Name, '' AS Initials ");
            sb.Append("FROM dba.EMP_OOD ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.People ON dba.People.Person_ID = dba.Case_Notes.Case_Manager_ID ");
            sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID = {0} ", PosNumber);
            sb.Append("AND Last_Name > '' and First_Name > '' ");
            sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
            ds = di.SelectRowsDS(sb.ToString());

            if (ds.Tables.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                foreach (DataRow row in dt.Rows)
                {
                    string mi = string.Empty;
                    if (row["Middle_Name"].ToString().Length > 0)
                    {
                        mi = row["Middle_Name"].ToString().Substring(0, 1).ToUpper();
                    }

                    row["Initials"] = String.Format("{0}{1}{2}", row["First_Name"].ToString().Substring(0, 1).ToUpper(), mi, row["Last_Name"].ToString().Substring(0, 1).ToUpper());
                }
            }

            return ds;
        }
        public DataSet OODForm8BussinessAddress(long PeopleID)
        {
            sb.Clear();
            sb.Append("SELECT   dba.Employer.Name, dba.Employer.Address1, dba.Employer.City, dba.Employer.State, ");
            sb.Append("dba.Employer.Zip_Code, dba.Employer.Primary_Phone ");
            sb.Append("FROM     dba.EM_Employee_Position ");
            sb.Append("LEFT OUTER JOIN dba.Employer ON dba.EM_Employee_Position.Employer_ID = dba.Employer.Employer_ID ");
            sb.AppendFormat("WHERE dba.EM_Employee_Position.People_ID = {0} ", PeopleID);
            sb.Append("AND dba.EM_Employee_Position.End_Date IS NULL ");
            return di.SelectRowsDS(sb.ToString());
        }
        public string OODForm8GetSupportAndTransistion72022(string AuthorizationNumber, string StartDate)
        {
            string rv = String.Empty;

            sb.Clear();
            sb.Append("SELECT   dba.EM_Review.Supp_Trans_Plan ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.EM_Review ON dba.Consumer_Services_Master.Reference_Number = dba.EM_Review.Reference_Num ");
            sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.AppendFormat("AND DATEFORMAT(EM_Review.EM_Review_Date,'MMYY') = '{0}' ", DateTime.Parse(StartDate).ToString("MMyy"));
            DataSet ds = di.SelectRowsDS(sb.ToString());
            if (ds.Tables.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                if (dt.Rows.Count > 0)
                {
                    rv = dt.Rows[0]["Supp_Trans_Plan"].ToString();
                }
            }
            return rv;

        }
        public string OODForm8GetJobTasksSummary72022(string AuthorizationNumber)
        {
            string Tasks = string.Empty;

            sb.Clear();
            sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("AND dba.EM_Job_Task.Task_Number > 7 ");
            sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
            long PosNumber = 0;

            DataSet ds = di.SelectRowsDS(sb.ToString());
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    PosNumber = (long)ds.Tables[0].Rows[0]["Position_ID"];
                }
            }

            sb.Clear();
            sb.Append("SELECT Task_Notes ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.AppendFormat("WHERE Task_Number > 7 AND Position_ID = {0} ", PosNumber);
            ds = di.SelectRowsDS(sb.ToString());

            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    DataTable dt = ds.Tables[0];
                    foreach (DataRow row in dt.Rows)
                    {
                        Tasks += String.Format("{0} {1}{2}", (char)149, row["Task_Notes"].ToString().Trim(), (char)13);
                    }
                }
            }

            return Tasks;
        }
        public DataSet OODForm8GetNotes72022(string AuthorizationNumber, string StartDate, string EndDate)
        {
            sb.Clear();
            sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("AND dba.EM_Job_Task.Task_Number > 7 ");
            sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
            long PosNumber = 0;
            DataSet ds = di.SelectRowsDS(sb.ToString());
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    PosNumber = (long)ds.Tables[0].Rows[0]["Position_ID"];
                }
            }

            sb.Clear();
            sb.AppendFormat("SELECT   dba.Case_Notes.Service_Date, DATEFORMAT(Cast(dba.Case_Notes.Start_Time AS CHAR), 'hh:mm AA') as Start_Time, DATEFORMAT(CAST(dba.Case_Notes.End_Time AS CHAR), 'hh:mm AA') AS End_Time, ");
            sb.Append("dba.Code_Table.Caption AS Contact_Method, dba.EMP_OOD.Behavioral_Indicators, dba.EMP_OOD.Quality_Indicators, ");
            sb.Append("dba.EMP_OOD.Quantity_Indicators, dba.EMP_OOD.Narrative, dba.EMP_OOD.Interventions, ");
            sb.Append("dba.People.Last_Name, dba.People.First_Name, dba.People.Middle_Name, ");
            sb.Append("'' AS Initials, dba.Case_Notes.Notes, '' AS StartTime, '' AS EndTime  ");
            sb.Append("FROM dba.EMP_OOD ");
            sb.AppendFormat("LEFT OUTER JOIN dba.Code_Table ON dba.EMP_OOD.Contact_Method = dba.Code_Table.Code ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append(" LEFT OUTER JOIN  dba.People ON dba.People.Person_ID = dba.Case_Notes.Case_Manager_ID ");
            sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID = {0} ", PosNumber);
            sb.AppendFormat("AND dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("AND dba.Code_Table.Table_ID = 'Employment_Code' ");
            sb.Append("AND Field_ID = 'ContactMethod' ");
            sb.AppendFormat("AND Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
            sb.Append("AND Last_Name > '' ");
            ds = di.SelectRowsDS(sb.ToString());

            if (ds.Tables.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                foreach (DataRow row in dt.Rows)
                {
                    string MN = string.Empty;

                    if (row["Middle_Name"].ToString().Length > 0)
                    {
                        MN = row["Middle_Name"].ToString().Substring(0, 1).ToUpper();
                    }

                    row["Initials"] = String.Format("{0}{1}{2}", row["First_Name"].ToString().Substring(0, 1).ToUpper(), MN, row["Last_Name"].ToString().Substring(0, 1).ToUpper());

                    row["Behavioral_Indicators"] = WorkDaysPercent((string)row["Behavioral_Indicators"]);
                    row["Quality_Indicators"] = WorkDaysPercent((string)row["Quality_Indicators"]);
                    row["Quantity_Indicators"] = WorkDaysPercent((string)row["Quantity_Indicators"]);
                    row["StartTime"] = WorkDaysPercent((string)row["Quantity_Indicators"]);
                    row["StartTime"] = WorkDaysPercent((string)row["Quantity_Indicators"]);

                }

            }

            return ds;

        }
        public DataSet OODForm8BackgroundChecks(string AuthorizationNumber, string StartDate)
        {
            sb.Clear();
            sb.Append("SELECT   dba.EM_Review.EM_Access_Concerns AS Concerns, dba.EM_Review.EM_Background_Check AS Background, ");
            sb.Append("dba.EM_Review.EM_Work_Exp AS Experience, dba.EM_Review.EM_Min_Train AS MinTrain, EM_Review.VTS_Review, ");
            sb.Append("dba.EM_Review.EM_Sum_Ind_Self_Assess, dba.EM_Review.EM_Sum_Employer_Assess, dba.EM_Review.EM_Sum_Provider_Assess ");
            sb.Append("FROM     dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.EM_Review ON dba.Consumer_Services_Master.Reference_Number = dba.EM_Review.Reference_Num ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.AppendFormat("AND DATEFORMAT(EM_Review.EM_Review_Date,'MMYY') = '{0}' ", DateTime.Parse((string)StartDate).ToString("MMyy"));

            return di.SelectRowsDS(sb.ToString());
        }

        #endregion

        #region "OOD 4"
        public DataSet OODDevelopment(string AuthorizationNumber)
        {
            sb.Clear();
            sb.Append("SELECT DBA.Consumer_Services_Master.Reference_Number AS AuthorizationNum, DBA.Services.Procedure_Code AS ServiceDescription, ");
            sb.Append("DBA.Consumer_Services_Master.Consumer_ID, DBA.Consumer_Services_Master.Rate, DBA.Consumer_Services_Master.Fixed_Rate, ");
            sb.Append("DBA.Consumer_Services_Master.Authorized_Units, DBA.Consumer_Services_Master.Consumer_Services_Master_ID, ");
            sb.Append("DBA.People.Last_Name AS ConsumerLastName, DBA.People.First_Name AS ConsumerFirstName, DBA.Persons.Last_Name AS StaffLastName, ");
            sb.Append("DBA.Persons.First_Name AS StaffFirstName, DBA.EM_Review.EM_Review_Goal AS EmpGoal, DBA.EM_Review.Num_Months_Job_Dev AS NumberOfMonths, ");
            sb.Append("DBA.EM_Review.Num_Contacts_Staff_Emp AS NumberEmployerContacts, DBA.EM_Review.Num_Contacts_Emp_Con AS NumberContactInd, ");
            sb.Append("DBA.EM_Review.EM_Review_Other_Impediments AS PotentialIssues, DBA.EM_Review.EM_Review_Summary_Next AS PlanGoalsNextMonth, ");
            sb.Append("DBA.Consumer_Services_Master.From_Date, DBA.Consumer_Services_Master.To_Date, DBA.EM_Review.EM_Review_Summary AS IndividualsInputOnSearch, ");
            sb.Append("DBA.Services.CPT_Code ");
            sb.Append("FROM   DBA.Consumer_Services_Master LEFT OUTER JOIN ");
            sb.Append("DBA.Persons ON DBA.Consumer_Services_Master.Person_ID = DBA.Persons.Person_ID LEFT OUTER JOIN ");
            sb.Append("DBA.EM_Review ON DBA.Consumer_Services_Master.Reference_Number = DBA.EM_Review.Reference_Num  LEFT OUTER JOIN ");
            sb.Append("DBA.People ON DBA.Consumer_Services_Master.Consumer_ID = DBA.People.Consumer_ID  LEFT OUTER JOIN ");
            sb.Append("DBA.Services ON DBA.Consumer_Services_Master.Service_ID = DBA.Services.Service_ID ");
            sb.AppendFormat("WHERE DBA.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            return di.SelectRowsDS(sb.ToString());


        }

        public DataSet Counslor(string AuthorizationNumber, long ServiceCodeID, long ConsumerID)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT dba.Persons.Last_Name AS LastName, dba.Persons.Middle_Name AS MiddleName, dba.Persons.First_Name AS FirstName ");
            sb.Append("FROM dba.Persons ");
            sb.Append("RIGHT OUTER JOIN dba.Consumer_Services_Master ON dba.Persons.Person_ID = dba.Consumer_Services_Master.Person_ID ");
            sb.Append("LEFT OUTER JOIN dba.Services ON dba.Consumer_Services_Master.Service_ID = dba.Services.Service_ID ");
            sb.AppendFormat("WHERE dba.Services.Service_ID = {0} ", ServiceCodeID);
            sb.AppendFormat("AND dba.Consumer_Services_Master.Consumer_ID = {0} ", ConsumerID);
            sb.AppendFormat("AND dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("GROUP BY dba.Persons.Last_Name, dba.Persons.First_Name, dba.Persons.Middle_Name ");
            return di.SelectRowsDS(sb.ToString());

        }

        private string WorkDaysPercent(string WhatPercent)
        {
            switch (WhatPercent)
            {
                case "0":
                    return "0%";

                case "1":
                    return "10%";

                case "2":
                    return "20%";

                case "3":
                    return "30%";

                case "4":
                    return "40%";

                case "5":
                    return "50%";

                case "6":
                    return "60%";

                case "7":
                    return "70%";

                case "8":
                    return "80%";

                case "9":
                    return "90%";

                case "M":
                    return "Meets - 100%";

                default:
                    return "x";

            }
        }

        public DataSet OODStaff(string AuthorizationNumber, long ServiceCodeID)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT DBA.Persons.Last_Name AS StaffLastName, DBA.Persons.Middle_Name AS StaffMiddleName,  DBA.Persons.First_Name AS StaffFirstName ");
            sb.Append("FROM    DBA.EM_Contacts ");
            sb.Append("LEFT OUTER JOIN DBA.Case_Notes ON DBA.EM_Contacts.Case_Note_ID = DBA.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Consumer_Services_Master ON DBA.Case_Notes.ID = DBA.Consumer_Services_Master.Consumer_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Services ON DBA.Consumer_Services_Master.Service_ID = DBA.Services.Service_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Funding_Sources ON DBA.Services.Funding_Source_ID = DBA.Funding_Sources.Funding_Source_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Persons ON DBA.Case_Notes.Case_Manager_ID = DBA.Persons.Person_ID ");
            sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);
            sb.AppendFormat("WHERE   DBA.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("GROUP BY dba.Persons.Last_Name, dba.Persons.First_Name, Persons.Middle_Name ");

            return di.SelectRowsDS(sb.ToString());

        }

        public DataSet OODMinDate(string AuthorizationNumber, string StartDate, string EndDate, long ServiceCodeID)
        {
            sb.Clear();
            sb.AppendFormat("SELECT DISTINCT MIN(dba.EM_Contacts.Contact_Date) AS MaxDate ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            sb.AppendFormat("AND  dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet OODMaxDate(string AuthorizationNumber, string StartDate, string EndDate, long ServiceCodeID)
        {
            sb.Clear();
            sb.AppendFormat("SELECT DISTINCT MAX(dba.EM_Contacts.Contact_Date) AS MaxDate ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            sb.AppendFormat("AND  dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet OODDevelopment2(string AuthorizationNumber, string StartDate, string EndDate, long ServiceCodeID)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT  DBA.Case_Notes.Case_Note_ID, dba.EM_Contacts.Contact_Date, dba.Case_Notes.Start_Time AS StartTime, ");
            sb.Append("dba.Case_Notes.End_Time AS EndTime, dba.Case_Notes.Service_Area_Modifier AS SAMLevel, dba.Employer.Name AS Location, ");
            sb.Append("dba.Employer.Address1 AS LocationAddress, dba.Employer.City AS LocationCity, dba.EM_Contacts.Notes AS Comments, ");
            sb.Append("dba.EM_Contacts.Contact_Type AS ContactType, dba.Code_Table.Caption AS OutCome, dba.EM_Contacts.EM_Job_Seeker_Present AS JobSeekerPresent, ");
            sb.Append("dba.Consumer_Services_Master.Reference_Number, dba.Code_Table.Table_ID, dba.Case_Notes.Notes AS Note2, ");
            sb.Append("DBA.Persons.Last_Name, DBA.Persons.First_Name, DBA.Persons.Middle_Name, dba.Code_Table.Code, dba.EM_Contacts.Application, dba.EM_Contacts.Interview, dba.EM_Contacts.Bilingual_Supplement ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Case_Notes.Case_Manager_ID = dba.Persons.Person_ID ");
            sb.Append("LEFT OUTER JOIN dba.Employer ON dba.EM_Contacts.Employer_ID = dba.Employer.Employer_ID ");
            sb.Append("LEFT OUTER JOIN dba.Code_Table ON dba.EM_Contacts.Activity_Code = dba.Code_Table.Code ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            //'sb.Append("AND (DBA.Code_Table.Field_ID = 'outcome') ") 'Removed per ticket 84964
            sb.AppendFormat("AND  dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);
            sb.Append("ORDER BY dba.EM_Contacts.Contact_Date ASC, DBA.Case_Notes.Case_Note_ID ASC, DBA.Case_Notes.Case_Note_ID ASC ");

            return di.SelectRowsDS(sb.ToString());
        }
        #endregion

        public string getPersonCompletingReportName(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSenderInfo ");
            List<string> list = new List<string>();
            list.Add(token);

            string text = "CALL DBA.ANYW_ISP_OneSpan_getSenderInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1OSG", ex.Message + "ANYW_ISP_OneSpan_getSenderInfo(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1OSG: error ANYW_ISP_OneSpan_getSenderInfo";
            }
        }

        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getForm10PDFData(string token, string referenceNumber, string startDate, string endDate, string consumerId, string userId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSS ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(referenceNumber);
            list.Add(startDate);
            list.Add(endDate);
            list.Add(consumerId);
            list.Add(userId);
            string text = "CALL DBA.ANYW_OOD_getForm10PDFData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1OSG", ex.Message + "ANYW_OOD_getForm10PDFData(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1OSG: error ANYW_OOD_getForm10PDFData";
            }
        }


        public string executeDataBaseCallJSON(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "[";

            List<string> arr = new List<string>();

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    Dictionary<string, string> holder = new Dictionary<string, string>();
                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {

                        var val = rdr.GetValue(ordinal);
                        string str = val.ToString();
                        holder[rdr.GetName(ordinal)] = str;
                    }
                    arr.Add((new JavaScriptSerializer()).Serialize(holder));
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

            return result + String.Join(",", arr) + "]";
        }

        public bool tokenValidator(string token)
        {
            if (token.Contains(" "))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

    }


    class PSIData
    {
        public DataSet SelectRowsDS(string queryString)
        {
            Common.gConnString = "DSN=ADVUnit;UID=dba;Password=money4u";
            using (var connection = new OdbcConnection(Common.gConnString))
            {
                OdbcCommand cmd = new OdbcCommand(queryString, connection);
                cmd.CommandTimeout = 0;
                var DS = new DataSet();
                var DA = new OdbcDataAdapter(cmd);
                try
                {
                    DA.Fill(DS);
                    DS.Tables[0].PrimaryKey = new DataColumn[] { DS.Tables[0].Columns[0] };
                }
                catch (Exception ex)
                {
                }

                if (cmd.Connection.State == ConnectionState.Open)
                    cmd.Connection.Close();
                if (connection.State == ConnectionState.Open)
                    connection.Close();
                return DS;
            }
        }

        public decimal QueryScalar(string QueryString)
        {
            decimal SAQueryScalarRet = 0.0m;
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)

            try
            {
                using (var connection = new OdbcConnection(Common.gConnString))
                {
                    OdbcCommand cmd = new OdbcCommand(QueryString, connection);
                    cmd.CommandTimeout = 0;
                    connection.Open();
                    if (!object.ReferenceEquals(cmd.ExecuteScalar(), DBNull.Value))
                        SAQueryScalarRet = (decimal)(int)cmd.ExecuteScalar();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    return SAQueryScalarRet;
                }
            }
            catch (Exception ex)
            {
            }

            return SAQueryScalarRet;
        }


        public static class Common
        {
            public static string gConnString;
        }

        internal static class Program
        {
            /// <summary>
            /// The main entry point for the application.
            /// </summary>
            [STAThread]
            static void Main()
            {
                Application.EnableVisualStyles();
                Application.SetCompatibleTextRenderingDefault(false);
                Application.Run(new Form1());
            }
        }
    }
}

