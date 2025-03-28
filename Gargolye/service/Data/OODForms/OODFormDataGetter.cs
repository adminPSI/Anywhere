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
using static Anywhere.service.Data.SimpleMar.SignInUser;
using iTextSharp.text.pdf;
using System.Linq.Expressions;
using Microsoft.Extensions.Primitives;
using static Anywhere.service.Data.AnywhereWorkshopWorkerTwo;
using System.Management.Automation.Language;
using CrystalDecisions.Shared.Json;
using System.Security.Cryptography;
using static log4net.Appender.RollingFileAppender;
using System.Web.UI.MobileControls;
using static Anywhere.service.Data.AnywhereWorker;
using System.Runtime.InteropServices.ComTypes;
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
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
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

        public DataSet getPersonCompletingReport(string token, string loggedInUserPersonId)
        {
            sb.Clear();
            sb.AppendFormat("Select First_Name, Last_Name FROM DBA.Persons where Person_Id = {0}", loggedInUserPersonId);
            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet OODForm8GetDirectStaff(string AuthorizationNumber, string StartDate, string EndDate)
        {
            List<long> positionIds = new List<long>();

            sb.Clear();
            sb.Append("SELECT DISTINCT  dba.EM_Job_Task.Position_ID ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE   dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("AND dba.EM_Job_Task.Task_Number > 7 ");
            sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
            sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
           // long PosNumber = 0;
            DataSet ds = di.SelectRowsDS(sb.ToString());
            if (ds.Tables.Count > 0 )
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        if (row["Position_ID"].ToString() != "0" && row["Position_ID"].ToString() != "" && row["Position_ID"] != null)
                        {
                            long thispositionid = (long)row["Position_ID"];
                            if (thispositionid > 0)
                            {
                                positionIds.Add(thispositionid);
                            }
                        }
                    }
                    
                }
            }
            string posNumbersString = String.Empty;
            sb.Clear();

            if (positionIds.Count > 0 )
            {
                posNumbersString = string.Join(",", positionIds);

                sb.Append("SELECT DISTINCT   dba.Persons.Last_Name, dba.Persons.First_Name, dba.Persons.Middle_Name, '' AS Initials ");
                sb.Append("FROM dba.EMP_OOD ");
                sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
                sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Persons.Person_ID = dba.Case_Notes.Case_Manager_ID ");
                sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID in ({0}) ", posNumbersString);
                sb.Append("AND Last_Name > '' and First_Name > '' ");
                sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
                sb.AppendFormat("AND dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
                sb.Append("UNION ");
                sb.Append("SELECT DISTINCT   dba.Persons.Last_Name, dba.Persons.First_Name, dba.Persons.Middle_Name, '' AS Initials ");
                sb.Append("FROM dba.EMP_OOD ");
                sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
                sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Persons.Person_ID = dba.Case_Notes.Case_Manager_ID ");
                //sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID in ({0}) ", posNumbersString);
                sb.Append("Where Last_Name > '' and First_Name > '' ");
                sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
                sb.AppendFormat("AND dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
            } else
            {
                sb.Append("SELECT DISTINCT   dba.Persons.Last_Name, dba.Persons.First_Name, dba.Persons.Middle_Name, '' AS Initials ");
                sb.Append("FROM dba.EMP_OOD ");
                sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
                sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Persons.Person_ID = dba.Case_Notes.Case_Manager_ID ");
                //sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID in ({0}) ", posNumbersString);
                sb.Append("Where Last_Name > '' and First_Name > '' ");
                sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
                sb.AppendFormat("AND dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
            }

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
        public DataSet OODForm8BussinessAddress(string AuthorizationNumber, string StartDate, string EndDate)
        {
            DataSet dsPositionIds = new DataSet();
            DataSet dsEmployerIds = new DataSet();
            DataSet dsBusinessAddresses = new DataSet();
            List<string> employerIds = new List<string>();
            List<long> positionIds = new List<long>();
            List<string> retrievedemployerIds = new List<string>();

            sb.Clear();

            sb.Append("Select Case_Notes.Case_Note_ID, Emp_OOD.Position_ID, Emp_OOD.Employer_ID FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}' AND dba.EM_Job_Task.Task_Number > 7 ", AuthorizationNumber);
            sb.AppendFormat("AND dba.Case_Notes.Service_Date between '{0}' and '{1}' ", StartDate, EndDate);
            sb.Append("GROUP BY Case_Notes.Case_Note_ID, Emp_OOD.Position_ID, Emp_OOD.Employer_ID ");
            sb.Append("Union ");
            sb.Append("Select Case_Notes.Case_Note_ID, Emp_OOD.Position_ID, Emp_OOD.Employer_ID FROM dba.Employer ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.Employer.Employer_ID = dba.EMP_OOD.Employer_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.AppendFormat("AND dba.Case_Notes.Service_Date between '{0}' and '{1}' ", StartDate, EndDate);
            sb.Append("GROUP BY Case_Notes.Case_Note_ID, Emp_OOD.Position_ID, Emp_OOD.Employer_ID ");
            //  return di.SelectRowsDS(sb.ToString());
            dsPositionIds = di.SelectRowsDS(sb.ToString());
            

            if (dsPositionIds.Tables.Count > 0 && dsPositionIds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in dsPositionIds.Tables[0].Rows)
                {
                    if (row["Position_ID"].ToString() != "0" && row["Position_ID"].ToString() != "" && row["Position_ID"] != null)
                    {
                        long thispositionid = (long)row["Position_ID"];
                        if (thispositionid > 0)
                        {
                            positionIds.Add(thispositionid);
                        }
                    }            
                }

                foreach (DataRow row in dsPositionIds.Tables[0].Rows)
                {
                    string thisemployerId = row["Employer_ID"].ToString();
                    if (thisemployerId != "0" && thisemployerId != "" && thisemployerId != null)
                        employerIds.Add(thisemployerId);
                }
            }
            else
            {
                return dsPositionIds;
            }

            if (positionIds.Count > 0)
            {
          
                    string posNumbersString = string.Join(",", positionIds);

                    sb.Clear();
                    sb.AppendFormat("Select Employer_ID from DBA.Em_employee_Position where Position_ID in ({0}) ", posNumbersString);
                    dsEmployerIds = di.SelectRowsDS(sb.ToString());
                    

                DataTable dt = dsEmployerIds.Tables[0];

                        if (dsEmployerIds.Tables.Count > 0 && dsEmployerIds.Tables[0].Rows.Count > 0)

                        { 
                            foreach (DataRow row in dt.Rows)
                            {
                            string thisemployerId = row["Employer_ID"].ToString();
                                if (thisemployerId != "0" && thisemployerId != "" && thisemployerId != null)
                                {
                                    retrievedemployerIds.Add(row["Employer_ID"].ToString());
                                }
                            
                            }
                        }
                    else
                    {
                        return dsEmployerIds;
                    }

            }

            retrievedemployerIds.AddRange(employerIds);

            string EmployerIdsString = string.Join(",", retrievedemployerIds);

            sb.Clear();
            sb.AppendFormat("Select Name, Address1, City, State from DBA.Employer where Employer_ID in ({0}) ", EmployerIdsString);
            dsBusinessAddresses = di.SelectRowsDS(sb.ToString());
      
            return dsBusinessAddresses;
        }
        public string OODForm8GetSupportAndTransistion(string AuthorizationNumber, string StartDate)
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
        public string OODForm8GetJobTasksSummary(string AuthorizationNumber, string StartDate, string EndDate, string userId, string peopleId)
        {
            string Tasks = string.Empty;
            string posNumbersString = string.Empty;
            string emplyerNumbersString = string.Empty;

            // Step 1 -- Get Position Ids ******************************************
            sb.Clear();
            sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("AND dba.EM_Job_Task.Task_Number > 7 ");
            sb.AppendFormat("AND dba.Case_Notes.Service_Date between '{0}' and '{1}' ", StartDate, EndDate);
            sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
            DataSet dsPos = di.SelectRowsDS(sb.ToString());
            List<long> posNumbers = new List<long>();

            if (dsPos.Tables.Count > 0 && dsPos.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in dsPos.Tables[0].Rows)
                {
                    posNumbers.Add((long)row["Position_ID"]);
                }
            } 

            if (userId == "%25") userId = "%";

            // Step 2 -- Get EmployerIds ******************************************
            sb.Clear();
            sb.Append("SELECT distinct emp_ood.employer_ID FROM dba.EM_Job_Task ");
            sb.Append("left outer join em_employee_position on em_employee_position.position_id = em_job_task.position_id ");
            sb.Append("left outer join emp_ood on emp_ood.employer_id = em_employee_position.employer_id ");
            sb.AppendFormat("WHERE(EM_Job_Task.Start_Date <= '{0}' and(EM_Job_Task.End_Date >= '{1}' or EM_Job_Task.End_Date is NULL)) ",  EndDate, StartDate);
            sb.AppendFormat("and em_employee_position.People_ID = {0} ", peopleId);
            sb.Append("and emp_ood.employer_ID is not null ");
            DataSet dsEmployer = di.SelectRowsDS(sb.ToString());
            List<string> employerNumbers = new List<string>();

            if (dsEmployer.Tables.Count > 0 && dsEmployer.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in dsEmployer.Tables[0].Rows)
                {
                    string thisemployerId = row["employer_ID"].ToString();

                    if (thisemployerId != "0" && thisemployerId != "" && thisemployerId != null)
                    {
                        employerNumbers.Add(thisemployerId); ;
                    }

                }
            }

            DataSet ds = new DataSet();
            posNumbersString = string.Join(",", posNumbers);
            emplyerNumbersString = string.Join(",", employerNumbers);

            // Step 3 -- Get List of Tasks ******************************************
            if (posNumbers.Count > 0 && employerNumbers.Count > 0)
            {

                sb.Clear();
                sb.Append("SELECT Distinct Task_Notes ");
                sb.Append("FROM dba.EM_Job_Task ");
                sb.AppendFormat("WHERE Task_Number > 7 AND Position_ID in ({0}) ", posNumbersString);
                sb.AppendFormat("AND (EM_Job_Task.Start_Date <= '{0}' and (EM_Job_Task.End_Date >= '{1}' or EM_Job_Task.End_Date is NULL)) ", EndDate, StartDate);
                sb.Append("and Task_Notes is not null ");
                // sb.AppendFormat("AND User_ID like '{0}' ", userId);
                sb.Append("Union ");
                sb.Append("SELECT Distinct Task_Notes ");
                sb.Append("FROM dba.EM_Job_Task ");
                sb.Append("Left outer JOIN EM_Employee_Position ON EM_Job_Task.Position_ID = EM_Employee_Position.Position_ID ");
                sb.Append("left outer JOIN emp_ood ON EM_Employee_Position.employer_id = emp_ood.employer_id ");
                sb.Append("WHERE Task_Number > 7 ");
                sb.AppendFormat("and emp_ood.employer_id in ({0}) ", emplyerNumbersString);
                sb.AppendFormat("and People_ID = {0} ", peopleId);
                sb.Append("and Task_Notes is not null ");
                ds = di.SelectRowsDS(sb.ToString());
            }
            else if (posNumbers.Count > 0 && employerNumbers.Count == 0)
            {
                sb.Clear();
                sb.Append("SELECT Distinct Task_Notes ");
                sb.Append("FROM dba.EM_Job_Task ");
                sb.AppendFormat("WHERE Task_Number > 7 AND Position_ID in ({0}) ", posNumbersString);
                sb.AppendFormat("AND (EM_Job_Task.Start_Date <= '{0}' and (EM_Job_Task.End_Date >= '{1}' or EM_Job_Task.End_Date is NULL)) ", EndDate, StartDate);
                sb.Append("and Task_Notes is not null ");
                ds = di.SelectRowsDS(sb.ToString());

            }
            else if (posNumbers.Count == 0 && employerNumbers.Count > 0) 
            { 

                sb.Clear();
                sb.Append("SELECT Distinct Task_Notes ");
                sb.Append("FROM dba.EM_Job_Task ");
                sb.Append("Left outer JOIN EM_Employee_Position ON EM_Job_Task.Position_ID = EM_Employee_Position.Position_ID ");
                sb.Append("left outer JOIN emp_ood ON EM_Employee_Position.employer_id = emp_ood.employer_id ");
                sb.Append("WHERE Task_Number > 7 ");
                sb.AppendFormat("and emp_ood.employer_id in ({0}) ", emplyerNumbersString);
                sb.AppendFormat("and People_ID = {0} ", peopleId);
                sb.Append("and Task_Notes is not null ");
                 ds = di.SelectRowsDS(sb.ToString());

            } 
      
            // ds = di.SelectRowsDS(sb.ToString());

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
        public DataSet OODForm8GetNotes(string AuthorizationNumber, string StartDate, string EndDate, string userId)
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
            DataSet ds = di.SelectRowsDS(sb.ToString());
            List<long> posNumbers = new List<long>();

            if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    posNumbers.Add((long)row["Position_ID"]);
                }
            }

            if (posNumbers.Count > 0)
            {
                if (userId == "%25") userId = "%";

                string posNumbersString = string.Join(",", posNumbers);
                sb.Clear();
                sb.AppendFormat("SELECT   dba.Case_Notes.Service_Date, DATEFORMAT(Cast(dba.Case_Notes.Start_Time AS CHAR), 'hh:mm AA') as Start_Time, DATEFORMAT(CAST(dba.Case_Notes.End_Time AS CHAR), 'hh:mm AA') AS End_Time, ");
                sb.Append("dba.Code_Table.Caption AS Contact_Method, dba.EMP_OOD.Behavioral_Indicators, dba.EMP_OOD.Quality_Indicators, dba.Case_Notes.Service_Area_Modifier as SAM, ");
                sb.Append("dba.EMP_OOD.Quantity_Indicators, dba.EMP_OOD.Narrative, dba.EMP_OOD.Interventions, ");
                sb.Append("dba.People.Last_Name, dba.People.First_Name, dba.People.Middle_Name, ");
                sb.Append("'' AS Initials, dba.Case_Notes.Notes, '' AS StartTime, '' AS EndTime  ");
                sb.Append("FROM dba.EMP_OOD ");
                sb.AppendFormat("LEFT OUTER JOIN dba.Code_Table ON dba.EMP_OOD.Contact_Method = dba.Code_Table.Code ");
                sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
                sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
                sb.Append(" LEFT OUTER JOIN  dba.People ON dba.People.Person_ID = dba.Case_Notes.Case_Manager_ID ");
                // sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID IN ({0}) ", posNumbersString);
                sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
               // sb.AppendFormat("AND dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
                sb.Append("AND dba.Code_Table.Table_ID = 'Employment_Code' ");
                sb.Append("AND Field_ID = 'ContactMethod' ");
                sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
                sb.AppendFormat(" AND dba.Case_Notes.Original_User_ID LIKE '{0}'", userId);
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
        //on the OOD Landing Page 
        public string getEmploymentGoal(string peopleId)
        {
            string rv = "";

            // select service_goals from em_employee_general where People_Id = 4139

            sb.Clear();
            sb.Append("select service_goals from DBA.em_employee_general ");
            sb.AppendFormat("where People_Id = '{0}' ", peopleId);
            DataSet ds = di.SelectRowsDS(sb.ToString());
            if (ds.Tables.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                if (dt.Rows.Count > 0)
                {
                    rv = dt.Rows[0]["service_goals"].ToString();
                }
            }
            return rv;

        }

        #endregion

        public DataSet OODForm16GetNotes(string AuthorizationNumber, string StartDate, string EndDate, string userId)
        {
            sb.Clear();
            sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
            sb.Append("FROM dba.EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.AppendFormat("WHERE   dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
            string listPosNumber = string.Empty;
            DataSet ds = di.SelectRowsDS(sb.ToString());
            string lstPositionstr = string.Empty;
            if (ds.Tables.Count > 0)
            {
                if (ds.Tables[0].Rows.Count > 0)
                {
                    List<string> lstPositions = new List<string>();

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        string Posnumber;
                        Posnumber = row["Position_ID"].ToString();
                        lstPositions.Add(Posnumber);
                    }
                    lstPositionstr = string.Join(",", lstPositions.ToArray());              
                }
            }

            sb.Clear();
            sb.AppendFormat("SELECT   dba.Case_Notes.Service_Date, DATEFORMAT(Cast(dba.Case_Notes.Start_Time AS CHAR), 'hh:mm AA') as Start_Time, DATEFORMAT(CAST(dba.Case_Notes.End_Time AS CHAR), 'hh:mm AA') AS End_Time, ");
            sb.Append("dba.EMP_OOD.Interventions, ");
            sb.Append("dba.People.Last_Name, dba.People.First_Name, dba.People.Middle_Name, ");
            sb.Append("'' AS Initials, dba.Case_Notes.Notes, '' AS StartTime, '' AS EndTime,  ");
            sb.Append("EMP_OOD.Position_ID, ");
            sb.Append("(Select e.Name + ', ' + e.Address1 + ', ' + e.city + ', ' + e.state + ', ' + e.Zip_Code from DBA.EM_Employee_Position as ep  ");
            sb.Append("left outer join DBA.People as p on ep.People_ID = p.ID ");
            sb.Append("left outer join DBA.Employer as e on e.Employer_ID = ep.Employer_ID ");
            sb.Append("where ep.Position_ID = EMP_OOD.Position_ID) as BusinessName ");
            sb.Append("FROM dba.EMP_OOD ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Case_Notes.Case_Note_ID = dba.EMP_OOD.Case_Note_ID ");
            sb.Append(" LEFT OUTER JOIN  dba.People ON dba.People.Person_ID = dba.Case_Notes.Case_Manager_ID ");
            sb.AppendFormat("WHERE dba.EMP_OOD.Position_ID in ({0}) ", lstPositionstr);
            sb.AppendFormat("AND dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.AppendFormat("AND Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
            if (userId != "%25")
            {
                sb.AppendFormat(" AND dba.Case_Notes.Original_User_ID LIKE '{0}'", userId);
            }
            
            sb.Append(" ORDER BY Service_Date ASC");
            //sb.Append("AND Last_Name > '' ");
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
                }
            }

            return ds;
        }

        public DataSet OODForm16GetScheduledWorkTimes(string AuthorizationNumber, string StartDate, string EndDate, string userId)
        {
            try
            {
                sb.Clear();
                sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
                sb.Append("FROM dba.EM_Job_Task ");
                sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
                sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
                sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
                sb.AppendFormat("WHERE   dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
                sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
                string listPosNumber = string.Empty;
                DataSet ds = di.SelectRowsDS(sb.ToString());
                string lstPositionstr = string.Empty;
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        List<string> lstPositions = new List<string>();

                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            string Posnumber;
                            Posnumber = row["Position_ID"].ToString();
                            lstPositions.Add(Posnumber);
                        }
                        lstPositionstr = string.Join(",", lstPositions.ToArray());
                    }
                }


                sb.Clear();
                sb.AppendFormat("SELECT  Distinct Em_work_schedule.start_time, Em_work_schedule.end_time, Service_Date ");
                sb.Append("FROM dba.Em_work_schedule  ");
                sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.Em_work_schedule.Position_ID = dba.EMP_OOD.Position_ID ");
                sb.Append(" LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
                sb.Append(" LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
                sb.AppendFormat("WHERE Em_work_schedule.Position_ID in ({0}) ", lstPositionstr); //lstPositionstr
                sb.AppendFormat("AND dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
                sb.AppendFormat("AND Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));

                if (userId != "%25")
                {
                    sb.AppendFormat(" AND dba.Case_Notes.Original_User_ID LIKE '{0}'", userId);
                }

                ds = di.SelectRowsDS(sb.ToString());

                return ds;

            }
            catch (Exception)
            {

               return null;
            }
          
          
        }

        public DataSet OODForm16GetGroupNumber(string AuthorizationNumber, string StartDate, string EndDate)
        {
            try
            {


                sb.Clear();
                sb.AppendFormat("Select max(Case when DBA.ratio_consumers > 4 then 4 Else DBA.ratio_consumers END) as ratio_consumers from DBA.Case_Notes ");
                sb.AppendFormat("where DBA.reference_Number = '{0}' ", AuthorizationNumber);
                sb.AppendFormat("AND DBA.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
                DataSet ds = di.SelectRowsDS(sb.ToString());
                ds = di.SelectRowsDS(sb.ToString());

                return ds;

            }
            catch (Exception)
            {

                return null;
            }


        }

        public DataSet OODForm16GetOODStaff(string AuthorizationNumber, string strConsumerId, string StartDate, string EndDate)
        {
            try
            {


                sb.Clear();
                sb.Append("Select p.First_Name as First_Name, p.Middle_Name as Middle_Name, p.Last_Name as Last_Name, ");
                sb.Append("(SELECT SUBSTRING(p.First_Name, 1, 1) + CASE WHEN p.Middle_Name IS NOT NULL THEN SUBSTRING(p.Middle_Name, 1, 1) ELSE '' END + SUBSTRING(p.Last_Name, 1, 1)) AS Initials ");
                sb.Append("from DBA.Persons as p ");
               // sb.Append("left outer join people pe on p.Person_ID = pe.Person_ID ");
                sb.Append("left outer join DBA.consumer_services_master as csm on p.Person_ID = csm.Person_ID ");
                sb.AppendFormat("where csm.consumer_id = {0} and Reference_Number = '{1}' ", strConsumerId, AuthorizationNumber);
                DataSet ds = di.SelectRowsDS(sb.ToString());
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
            catch (Exception)
            {

                return null;
            }


        }

        public DataSet OODForm16ServiceHoursOffered(string AuthorizationNumber, string StartDate, string EndDate)
        {
            try
            {
                sb.Clear();
                sb.Append("SELECT   dba.EM_Job_Task.Position_ID ");
                sb.Append("FROM dba.EM_Job_Task ");
                sb.Append("LEFT OUTER JOIN dba.EMP_OOD ON dba.EM_Job_Task.Position_ID = dba.EMP_OOD.Position_ID ");
                sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
                sb.Append("LEFT OUTER JOIN dba.Consumer_Services_Master ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
                //sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
                // sb.Append("AND dba.EM_Job_Task.Task_Number > 7 ");
                sb.AppendFormat("WHERE dba.Case_Notes.Service_Date between '{0}' and '{1}' ", StartDate, EndDate);
                sb.AppendFormat("AND dba.case_notes.reference_number = '{0}' ", AuthorizationNumber);
                sb.Append("GROUP BY dba.EM_Job_Task.Position_ID ");
                string listPosNumber = string.Empty;
                DataSet ds = di.SelectRowsDS(sb.ToString());
                string lstPositionstr = string.Empty;
                if (ds.Tables.Count > 0)
                {
                    if (ds.Tables[0].Rows.Count > 0)
                    {
                        List<string> lstPositions = new List<string>();

                        foreach (DataRow row in ds.Tables[0].Rows)
                        {
                            string Posnumber;
                            Posnumber = row["Position_ID"].ToString();
                            lstPositions.Add(Posnumber);
                        }
                        lstPositionstr = string.Join(",", lstPositions.ToArray());
                    }
                }


                sb.Clear();
                sb.AppendFormat("SELECT SUM(total_time_in_hours +total_time_in_minutes / 60.0) AS TotalHoursSum ");
                sb.Append("FROM ( SELECT Start_Time, End_Time,  ");
                sb.Append("DATEDIFF(hour, CONVERT(datetime, Start_Time, 101), CONVERT(datetime, End_Time, 101)) AS total_time_in_hours, ");
                sb.Append("DATEDIFF(minute, CONVERT(datetime, Start_Time, 101), CONVERT(datetime, End_Time, 101)) % 60 AS total_time_in_minutes ");
                sb.Append(" FROM DBA.Em_Work_Schedule ");
                sb.AppendFormat("WHERE Position_ID in ({0})  ", lstPositionstr); //lstPositionstr
                sb.Append(") AS SubQuery");

                ds = di.SelectRowsDS(sb.ToString());

                return ds;

            }
            catch (Exception)
            {

                return null;
            }


        }


        public DataSet OODForm3ConsumerandVendor(string consumerId)
        {
            sb.Clear();
            sb.Append("SELECT Distinct DBA.People.Last_Name AS ConsumerLastName, DBA.People.First_Name AS ConsumerFirstName, DBA.Vendors.Name AS VendorName ");
            sb.Append("FROM   DBA.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN DBA.Persons ON DBA.Consumer_Services_Master.Person_ID = DBA.Persons.Person_ID ");
            sb.Append("LEFT OUTER JOIN DBA.EM_Review ON DBA.Consumer_Services_Master.Reference_Number = DBA.EM_Review.Reference_Num ");
            sb.Append("LEFT OUTER JOIN DBA.People ON DBA.Consumer_Services_Master.Consumer_ID = DBA.People.Consumer_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Services ON DBA.Consumer_Services_Master.Service_ID = DBA.Services.Service_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Consumers ON Consumer_Services_Master.Consumer_ID = DBA.Consumers.Consumer_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Locations ON DBA.Consumers.Location_ID = DBA.Locations.Location_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Regions ON DBA.Locations.Region_ID = DBA.Regions.Region_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Vendors ON DBA.Regions.Vendor_ID = DBA.Vendors.Vendor_ID ");
            sb.AppendFormat("WHERE DBA.People.Consumer_ID = {0} and DBA.Services.OOD_Form_Number = 3", consumerId);
            return di.SelectRowsDS(sb.ToString());
        }

        #region "OOD 4"
        public DataSet OODDevelopment(string AuthorizationNumber)
        {
            sb.Clear();
            sb.Append("SELECT DBA.Consumer_Services_Master.Reference_Number AS AuthorizationNum, DBA.Services.Procedure_Code AS ServiceDescription, ");
            sb.Append("DBA.Consumer_Services_Master.Consumer_ID, DBA.Consumer_Services_Master.Rate, DBA.Consumer_Services_Master.Fixed_Rate, ");
            sb.Append("DBA.Consumer_Services_Master.Authorized_Units, DBA.Consumer_Services_Master.Consumer_Services_Master_ID, DBA.Consumer_Services_Master.Service_ID AS ServiceId, ");
            sb.Append("DBA.People.Last_Name AS ConsumerLastName, DBA.People.First_Name AS ConsumerFirstName, DBA.Persons.Last_Name AS StaffLastName, ");
            sb.Append("DBA.Persons.First_Name AS StaffFirstName, DBA.EM_Review.EM_Review_Goal AS EmpGoal, DBA.EM_Review.Num_Months_Job_Dev AS NumberOfMonths, ");
            sb.Append("DBA.EM_Review.Num_Contacts_Staff_Emp AS NumberEmployerContacts, DBA.EM_Review.Num_Contacts_Emp_Con AS NumberContactInd, ");
            sb.Append("DBA.EM_Review.EM_Review_Other_Impediments AS PotentialIssues, DBA.EM_Review.EM_Review_Summary_Next AS PlanGoalsNextMonth, DBA.EM_Review.EM_Review_Goal AS ReviewGoal, ");
            sb.Append("DBA.Consumer_Services_Master.From_Date, DBA.Consumer_Services_Master.To_Date, DBA.EM_Review.EM_Review_Summary AS IndividualsInputOnSearch, ");
            sb.Append("DBA.Services.CPT_Code, DBA.Services.Name AS ServiceName, DBA.Vendors.Name AS VendorName ");
            sb.Append("FROM   DBA.Consumer_Services_Master LEFT OUTER JOIN ");
            sb.Append("DBA.Persons ON DBA.Consumer_Services_Master.Person_ID = DBA.Persons.Person_ID LEFT OUTER JOIN ");
            sb.Append("DBA.EM_Review ON DBA.Consumer_Services_Master.Reference_Number = DBA.EM_Review.Reference_Num  LEFT OUTER JOIN ");
            sb.Append("DBA.People ON DBA.Consumer_Services_Master.Consumer_ID = DBA.People.Consumer_ID  LEFT OUTER JOIN ");
            sb.Append("DBA.Services ON DBA.Consumer_Services_Master.Service_ID = DBA.Services.Service_ID  LEFT OUTER JOIN ");
            sb.Append("DBA.Consumers ON Consumer_Services_Master.Consumer_ID = DBA.Consumers.Consumer_ID  LEFT OUTER JOIN ");
            sb.Append("DBA.Locations ON DBA.Consumers.Location_ID = DBA.Locations.Location_ID  LEFT OUTER JOIN ");
            sb.Append("DBA.Regions ON DBA.Locations.Region_ID = DBA.Regions.Region_ID  LEFT OUTER JOIN ");
            sb.Append("DBA.Vendors ON DBA.Regions.Vendor_ID = DBA.Vendors.Vendor_ID ");
            sb.AppendFormat("WHERE DBA.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            return di.SelectRowsDS(sb.ToString());


        }

        public DataSet GetNamesAndGoal(string consumerId)
        {
            sb.Clear();
            sb.Append("SELECT People.First_Name + ' ' + People.Last_Name AS consumerName, ");
            sb.Append("Vendors.Name As providerName, ");
            sb.Append("em_employee_general.service_goals as IPEGoal ");
            sb.Append("FROM people ");
            sb.Append("LEFT OUTER JOIN DBA.EM_Employee_General ON People.ID = EM_Employee_General.People_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Consumers ON People.Consumer_Id = DBA.Consumers.Consumer_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Locations ON DBA.Consumers.Location_ID = DBA.Locations.Location_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Regions ON DBA.Locations.Region_ID = DBA.Regions.Region_ID ");
            sb.Append("LEFT OUTER JOIN DBA.Vendors ON DBA.Regions.Vendor_ID = DBA.Vendors.Vendor_ID ");
            sb.AppendFormat("WHERE people.consumer_id = '{0}' ", consumerId);
            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet EmpGoal(string AuthorizationNumber, string StartDate, string EndDate)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT DBA.Persons.Last_Name, DBA.Persons.Middle_Name, DBA.Persons.First_Name, em_review.em_review_goal, DBA.EM_Review.EM_Review_Summary AS IndividualsInputOnSearch, DBA.EM_Review.EM_Review_Other_Impediments AS PotentialIssues ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Consumer_Services_Master.Person_Id = dba.Persons.Person_ID ");
            sb.Append("LEFT OUTER JOIN dba.em_review ON dba.Consumer_Services_Master.Reference_Number = em_review.Reference_Num ");
            sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            //sb.AppendFormat("AND dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND MONTH(em_review.em_review_date) = MONTH('{0}') AND YEAR(em_review.em_review_date) = YEAR('{0}')", StartDate);


            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet Counslor(string AuthorizationNumber, string ServiceCodeID, string StartDate, string EndDate)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT DBA.Persons.Last_Name, DBA.Persons.Middle_Name, DBA.Persons.First_Name ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            //sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            //sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Consumer_Services_Master.Person_Id = dba.Persons.Person_ID ");
            sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);
            //sb.AppendFormat("AND dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND ((From_Date <= '{1}' and To_Date >= '{0}') or (From_Date <= '{1}' and To_Date is Null))", StartDate, EndDate);

            //if (ServiceCodeID != "%" && ServiceCodeID != "All")
            //{
            //    sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);
            //}

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet GetForm5PositionData(string position, string consumerId, string StartDate, string EndDate)
        {
            sb.Clear();
            sb.Append("SELECT e.name AS employerName, ");
            sb.Append("(COALESCE(e.address1, '') || ' ' || COALESCE(e.address2, '') || ', ' || COALESCE(e.city, '') || ', ' || COALESCE(e.state, '') || ' ' || COALESCE(e.zip_code, '')) AS employerAddress, ");
            sb.Append("e.county AS county, ");
            sb.Append("'(' + SUBSTRING(e.primary_phone, 1, 3) + ') ' + SUBSTRING(e.primary_phone, 4, 3) + '-' + SUBSTRING(e.primary_phone, 7, 4) + ' ' + SUBSTRING(e.primary_phone, 11, 4) AS phoneNumber, ");
            sb.Append("w.wages_per_hour AS wages, ");
            sb.Append("SUM(CAST(DATEDIFF(MINUTE, ws.start_time, ws.end_time) AS FLOAT) / 60.0) AS hoursPerWeek, ");
            sb.Append("ep.start_date AS firstDayOfWork, ");
            sb.Append("ep.date_first_paycheck AS firstPaycheck, ");
            sb.Append("ep.Supervisor_Name AS supervisorName ");
            sb.Append("FROM dba.em_employee_position ep ");
            sb.Append("LEFT OUTER JOIN dba.employer e ON ep.Employer_ID = e.employer_ID ");
            sb.Append("LEFT OUTER JOIN dba.em_wages w ON w.Position_ID = ep.position_ID ");
            sb.AppendFormat("AND w.start_date >= '{0}' ", StartDate);
            sb.AppendFormat("AND (w.end_date <= '{0}' OR w.end_date IS NULL) ", EndDate);
            sb.Append("LEFT OUTER JOIN dba.em_work_schedule ws ON ws.Position_ID = ep.position_ID ");
            sb.Append("LEFT OUTER JOIN dba.people p ON ep.people_id = p.id ");
            sb.Append("LEFT OUTER JOIN dba.Code_Table ct ON ct.code = ep.position_code ");
            sb.Append("AND ct.Table_ID = 'Employment_Info' ");
            sb.Append("AND ct.Field_ID = 'Position' ");
            sb.AppendFormat("WHERE p.consumer_id = {0} ", consumerId);
            sb.AppendFormat("AND ep.start_date <= '{0}' ", StartDate);
            sb.AppendFormat("AND (ep.end_date >= '{0}' OR ep.end_date IS NULL) ", EndDate);
            sb.AppendFormat("AND ct.caption = '{0}' ", position);
            sb.Append("GROUP BY ");
            sb.Append("e.name, e.address1, e.address2, e.city, e.state, e.zip_code, ");
            sb.Append("e.county, e.primary_phone, ");
            sb.Append("w.wages_per_hour, ");
            sb.Append("ep.start_date, ep.date_first_paycheck, ep.supervisor_name;");

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet getJobDutiesData(string position, string consumerId, string startDate, string endDate)
        {
            sb.Clear();
            sb.Append("SELECT LIST(dba.EM_Job_Task.Task_Notes, ', ') AS CombinedTaskNotes ");
            sb.Append("FROM EM_Job_Task ");
            sb.Append("LEFT OUTER JOIN EM_Employee_Position on EM_Employee_Position.position_id = EM_Job_Task.position_id ");
            sb.Append("LEFT OUTER JOIN people on people.id = EM_Employee_Position.people_id ");
            sb.Append("LEFT OUTER JOIN dba.Code_Table ct ON ct.code = EM_Employee_Position.position_code ");
            sb.Append("WHERE Task_Number > 7 ");
            sb.AppendFormat("AND people.Consumer_id = {0} ", consumerId);
            sb.AppendFormat("AND EM_Job_Task.start_date <= '{0}' ", startDate);
            sb.AppendFormat("AND (EM_Job_Task.end_date >= '{0}' OR EM_Job_Task.end_date IS NULL) ", endDate);
            sb.Append("AND ct.Table_ID = 'Employment_Info' ");
            sb.Append("AND ct.Field_ID = 'Position' ");
            sb.AppendFormat("AND ct.caption = '{0}' ", position);

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

        public DataSet OODStaff(string AuthorizationNumber, string ServiceCodeID, string StartDate, string EndDate, string userID)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT DBA.Persons.Last_Name, DBA.Persons.Middle_Name, DBA.Persons.First_Name ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Case_Notes.Case_Manager_ID = dba.Persons.Person_ID ");
            sb.Append("LEFT OUTER JOIN dba.Employer ON dba.EM_Contacts.Employer_ID = dba.Employer.Employer_ID ");
            sb.Append("LEFT OUTER JOIN dba.Code_Table ON dba.EM_Contacts.Activity_Code = dba.Code_Table.Code ");
            sb.AppendFormat("WHERE dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            sb.AppendFormat("AND dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);

            if (userID != "%25")
            {
                sb.AppendFormat("AND dba.Case_Notes.Original_User_ID LIKE '{0}' ", userID);
            }

            // sb.AppendFormat(" AND dba.Case_Notes.Original_User_ID LIKE '{0}'", userID);

            if (ServiceCodeID != "%")
            {
                sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);
            }

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet OODMinDate(string AuthorizationNumber, string StartDate, string EndDate, string ServiceCodeID)
        {
            sb.Clear();
            sb.AppendFormat("SELECT MIN(Contact_Date) AS MaxDate ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            sb.AppendFormat("AND  dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);

            if (ServiceCodeID != "%")
            {
                sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);
            }

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet OODMaxDate(string AuthorizationNumber, string StartDate, string EndDate, string ServiceCodeID)
        {
            sb.Clear();
            sb.AppendFormat("SELECT MAX(Contact_Date) AS MaxDate ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}'", AuthorizationNumber);
            sb.AppendFormat("AND  dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);

            if (ServiceCodeID != "%")
            {
                sb.AppendFormat("AND dba.Case_Notes.Service_ID LIKE {0} ", ServiceCodeID); 
            }

            return di.SelectRowsDS(sb.ToString());
        }

        public DataSet OODDevelopment2(string AuthorizationNumber, string StartDate, string EndDate, string ServiceCodeID, string userID)
        {
            sb.Clear();
            sb.Append("SELECT DISTINCT  DBA.Case_Notes.Case_Note_ID, dba.EM_Contacts.Contact_Date, dba.Case_Notes.Start_Time AS StartTime, ");
            sb.Append("dba.Case_Notes.End_Time AS EndTime, dba.Case_Notes.Service_Area_Modifier AS SAMLevel, dba.Employer.Name AS Location, dba.Case_Notes.Service_Date AS serviceDate, ");
            sb.Append("dba.Employer.Address1 AS LocationAddress, dba.Employer.City AS LocationCity, dba.EM_Contacts.Notes AS Comments, ");
            sb.Append("dba.EM_Contacts.Contact_Type AS ContactType, dba.EM_Contacts.Notes as Narrative, dba.Code_Table.Caption AS OutCome, dba.EM_Contacts.EM_Job_Seeker_Present AS JobSeekerPresent, ");
            sb.Append("dba.Consumer_Services_Master.Reference_Number, dba.Code_Table.Table_ID, dba.Case_Notes.Notes AS Note2, ");
            sb.Append("DBA.Persons.Last_Name, DBA.Persons.First_Name, DBA.Persons.Middle_Name, dba.Code_Table.Code, dba.EM_Contacts.Application, dba.EM_Contacts.Interview, dba.EM_Contacts.Bilingual_Supplement ");
            sb.Append("FROM dba.Consumer_Services_Master ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.Consumer_Services_Master.Consumer_ID = dba.Case_Notes.ID ");
            sb.Append("LEFT OUTER JOIN dba.EM_Contacts ON dba.Case_Notes.Case_Note_ID = dba.EM_Contacts.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN dba.Persons ON dba.Case_Notes.Case_Manager_ID = dba.Persons.Person_ID ");
            sb.Append("LEFT OUTER JOIN dba.Employer ON dba.EM_Contacts.Employer_ID = dba.Employer.Employer_ID ");
            sb.Append("LEFT OUTER JOIN dba.Code_Table ON dba.EM_Contacts.Activity_Code = dba.Code_Table.Code ");
            sb.AppendFormat("WHERE   dba.Consumer_Services_Master.Reference_Number = '{0}' ", AuthorizationNumber);

            if (userID != "%25")
            {
                sb.AppendFormat("AND dba.Case_Notes.Original_User_ID LIKE '{0}' ", userID);
            } 
                

            //'sb.Append("AND (DBA.Code_Table.Field_ID = 'outcome') ") 'Removed per ticket 84964
            sb.AppendFormat("AND  dba.EM_Contacts.Contact_Date BETWEEN '{0}' and '{1}' ", StartDate, EndDate);

            if (ServiceCodeID != "%") 
            {
                sb.AppendFormat("AND dba.Case_Notes.Service_ID = {0} ", ServiceCodeID);
            }

            sb.Append("ORDER BY dba.EM_Contacts.Contact_Date ASC, DBA.Case_Notes.Case_Note_ID ASC, DBA.Case_Notes.Case_Note_ID ASC ");

            return di.SelectRowsDS(sb.ToString());
        }
        #endregion

        #region "OOD Form 6"
        public DataSet OODForm6GetVRCounselor(string AuthorizationNumber, string strConsumerId, string StartDate, string EndDate)
        {
            try
            {
        
        sb.Clear();
                sb.Append("Select p.first_name + ' ' + p.last_name as VR_CounselorContractor from DBA.consumer_services_master cs ");
                sb.Append("left outer join DBA.persons p on cs.Person_ID = p.Person_ID ");
                sb.AppendFormat("where cs.Consumer_ID = {0} and cs.reference_Number = '{1}' ", strConsumerId, AuthorizationNumber);
               
               // DataSet ds = di.SelectRowsDS(sb.ToString());
                return di.SelectRowsDS(sb.ToString());

               // return ds;

            }
            catch (Exception)
            {

                return null;
            }


        }

        public DataSet OODForm6GetIPEGoal(string AuthorizationNumber, string strConsumerId, string StartDate, string EndDate)
        {
            try
            {

                sb.Clear();
                sb.Append("Select eg.service_goals as IPEGoal from DBA.em_employee_general eg ");
                sb.Append("left outer join DBA.people p on p.ID = eg.People_ID ");
                sb.AppendFormat("where p.Consumer_Id = '{0}' ", strConsumerId);

                // DataSet ds = di.SelectRowsDS(sb.ToString());
                return di.SelectRowsDS(sb.ToString());

                // return ds;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public DataSet OODForm6GetService(string AuthorizationNumber, string strConsumerId, string StartDate, string EndDate)
        {
            try
            {

                sb.Clear();
                sb.Append("Select s.name as service from DBA.consumer_services_master cs ");
                sb.Append("left outer join DBA.emp_ood eo on eo.reference_number = cs.service_Id ");
                sb.Append("left outer join DBA.services s on s.Service_ID = cs.service_ID ");
                sb.AppendFormat("where cs.Consumer_ID = {0} and cs.reference_Number = '{1}' ", strConsumerId, AuthorizationNumber);

                // DataSet ds = di.SelectRowsDS(sb.ToString());
                return di.SelectRowsDS(sb.ToString());

                // return ds;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public DataSet OODForm6GetSAMandBilingual(string AuthorizationNumber, string strConsumerId, string StartDate, string EndDate, string userID)
        {
            try
            {

                sb.Clear();
                sb.Append("select cn.Case_note_ID as casenoteId, emp.Position_ID as positionID, cn.Service_Area_Modifier as SAMLevel, em.Bilingual_Supplement as bilingualSupplement from DBA.Case_Notes as cn ");
                sb.Append("left outer join DBA.EM_Contacts as em on cn.case_Note_ID = em.case_Note_ID ");
                sb.Append("left outer join DBA.consumer_services_master as csm on cn.Reference_Number = csm.Reference_Number ");
                sb.Append("LEFT OUTER JOIN dba.EMP_OOD as emp ON cn.Case_Note_ID = emp.Case_Note_ID ");
                sb.AppendFormat("where csm.Consumer_ID = {0} and csm.reference_Number = '{1}' ", strConsumerId, AuthorizationNumber);
                sb.AppendFormat("AND cn.Service_Date BETWEEN '{0}' AND '{1}' and  cn.Original_User_ID LIKE '{2}' ", StartDate, EndDate, userID);

                // DataSet ds = di.SelectRowsDS(sb.ToString());
                return di.SelectRowsDS(sb.ToString());

                // return ds;

            }
            catch (Exception)
            {
                return null;
            }
        }

        public DataSet OODForm6GetNotes(string AuthorizationNumber, string StartDate, string EndDate, string userId)
        {
            
            sb.Clear();
            sb.Append("Select DISTINCT dba.Case_Notes.Case_Note_ID, dba.Case_Notes.Service_Date, emp_ood.service_area_modifier, emp_ood.narrative, code_table.caption from DBA.emp_ood ");
            sb.Append("LEFT OUTER JOIN dba.Case_Notes ON dba.EMP_OOD.Case_Note_ID = dba.Case_Notes.Case_Note_ID ");
            sb.Append("LEFT OUTER JOIN DBA.code_table ON emp_ood.contact_method = code_table.code ");
            sb.AppendFormat("WHERE dba.Case_Notes.Reference_Number = '{0}' ", AuthorizationNumber);
            sb.AppendFormat("AND dba.Case_Notes.Service_Date BETWEEN '{0}' AND '{1}' ", DateTime.Parse(StartDate).ToString("yyyy-MM-dd"), DateTime.Parse(EndDate).ToString("yyyy-MM-dd"));
            sb.Append("AND code_table.field_id = 'ContactMethod' ");
            sb.Append("-- and code_table.Table_ID = 'Employment_Code_OOD_6' ");
           // sb.AppendFormat("AND Case_notes.User_Id = '{0}' ", userId);
            

            if (userId != "%25")
            {
                sb.AppendFormat("AND Case_notes.User_Id = '{0}' ", userId);
            } else
            {
                sb.Append("AND Case_notes.User_Id = '%' ");
            }

            sb.Append(" ORDER BY dba.Case_Notes.Service_Date ASC");
            //sb.Append("AND Last_Name > '' ");
            DataSet ds = di.SelectRowsDS(sb.ToString());

            //if (ds.Tables.Count > 0)
            //{
            //    DataTable dt = ds.Tables[0];
            //    foreach (DataRow row in dt.Rows)
            //    {
            //        string MN = string.Empty;

            //        if (row["Middle_Name"].ToString().Length > 0)
            //        {
            //            MN = row["Middle_Name"].ToString().Substring(0, 1).ToUpper();
            //        }

            //        row["Initials"] = String.Format("{0}{1}{2}", row["First_Name"].ToString().Substring(0, 1).ToUpper(), MN, row["Last_Name"].ToString().Substring(0, 1).ToUpper());
            //    }
            //}

            return ds;
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

        //private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getForm10PDFData(string token, string referenceNumber, string startDate, string endDate, string consumerId, string userId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSS ");
            List<string> list = new List<string>();

            if (userId == "%25")
            {
                userId = "%";
            }

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

        public string getSpreadsheetNameAndKey(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSS ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_OOD_getSpreadsheetNameAndKey(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1OSG", ex.Message + "ANYW_OOD_getSpreadsheetNameAndKey(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1OSG: error ANYW_OOD_getSpreadsheetNameAndKey";
            }
        }

        public string getPDFTronKey(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSS ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_GetPDFTronKey(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1OSG", ex.Message + "ANYW_GetPDFTronKey(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1OSG: error ANYW_GetPDFTronKey";
            }
        }

        public string getFormTemplatePath(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSS ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_OOD_getFormTemplatePath(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1OSG", ex.Message + "ANYW_OOD_getFormTemplatePath(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1OSG: error ANYW_OOD_getFormTemplatePath";
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

        class PSIData
        {
            private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
            public DataSet SelectRowsDS(string queryString)
            {
                //Common.gConnString = "DSN=ADVUnit;UID=dba;Password=money4u";
                using (var connection = new OdbcConnection(connectString))
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
                    using (var connection = new OdbcConnection(connectString))
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

}




