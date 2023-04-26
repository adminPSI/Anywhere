using Microsoft.VisualBasic;
using System;

namespace Anywhere.service.Data
{
    public class SQLBuilder
    {

        private System.Text.StringBuilder sb = new System.Text.StringBuilder();

        private DataGetterInfal rsData = new DataGetterInfal();
        public string AssignParameterGetJobs(long EmployeeID)
        {
            sb.Clear();
            sb.Append("SELECT Job_Description_No, Payroll_Job_Description.Emp_Job_Description AS [Job_Description], Payroll_Job_Description.Emp_Job_Description AS [text] ");
            sb.Append("FROM Payroll_Job_Description RIGHT OUTER JOIN ");
            sb.Append("Payroll_Dist LEFT OUTER JOIN ");
            sb.Append("County_Expense_Codes LEFT OUTER JOIN ");
            sb.Append("County_Funds ON County_Expense_Codes.Fund_ID = County_Funds.Fund_ID ON  ");
            sb.Append("Payroll_Dist.CAC = County_Expense_Codes.County_Expense_Code_ID RIGHT OUTER JOIN ");
            sb.Append("Payroll_Employee_Setup ON Payroll_Dist.Employee_No = Payroll_Employee_Setup.Emp_Id ON  ");
            sb.Append("Payroll_Job_Description.Emp_Job_Id = Payroll_Dist.Job_Description_No ");
            sb.Append("WHERE  (Payroll_Dist.EndDate IS NULL) AND (Payroll_Dist.DoNotShowTouchScreenClock = 0) ");
            sb.Append("GROUP BY Payroll_Employee_Setup.Emp_Id, Payroll_Employee_Setup.Emp_Name, ");
            sb.Append("Payroll_Employee_Setup.[Active Employee], Payroll_Dist.Job_Description_No, Payroll_Job_Description.Emp_Job_Description ");
            sb.AppendFormat("Having Payroll_Employee_Setup.Emp_Id = {0} ", EmployeeID);
            sb.Append("ORDER by  Payroll_Job_Description.Emp_Job_Description ");
            return sb.ToString();
        }


        public string AddNewTimeCard(string ConnString, Int32 EmpId, string WorkDate, string StartTime, string StartAMPM, string EndTime, string EndAMPM, Int32 TCHeaderID, Int32 JobID, bool AddLunch,
        Int32 WhoID, decimal LatIn, decimal LongIn, long SupervisorID = 0)
        {

            sb.Clear();
            sb.Append("SELECT ID ");
            sb.Append("FROM [Integrated Information] ");
            sb.AppendFormat("WHERE EmployeeID = {0} ", EmpId);//MAT. casted belwo to int
            WhoID = (int)rsData.QueryScalar(ConnString, sb.ToString());

            sb.Clear();
            sb.Append("SELECT        DefaultStartTime, DefaultEndTime, LocID, BuildingID, Emp_Title_No ");
            sb.Append("FROM Payroll_Employee_Setup ");
            sb.AppendFormat("WHERE Emp_Id = {0} ", EmpId);//MAT changed ( to [ below and added () afetr toString. Also added System.data before DataRow
            System.Data.DataRow row = rsData.SelectRowsDS(ConnString, sb.ToString()).Tables[0].Rows[0];

            if (string.IsNullOrEmpty(StartTime))
            {
            }
            else
            {
                StartTime += " " + StartAMPM;
            }

            if (string.IsNullOrEmpty(EndTime))
            {
            }
            else
            {
                EndTime += " " + EndAMPM;
            }
            //MAT. Added the m suffix
            decimal hours = 0.0m;
            //MAt. Changed > to != to because you cannot compare strings in C# with greater than signs
            if (StartTime != "" & EndTime != "")
            {
                // hours = System.Math.Round(DateDiff(DateInterval.Minute, Convert.ToDateTime(StartTime), Convert.ToDateTime(EndTime)) / 60, 2);//MAT. Added system.math in front of round
            }

            if (StartTime != "")
            {
                StartAMPM = Convert.ToDateTime(StartTime).ToString("tt");
                StartTime = Convert.ToDateTime(StartTime).ToString("h:mm");
            }

            if (EndTime != "")
            {
                EndAMPM = Convert.ToDateTime(EndTime).ToString("tt");
                EndTime = Convert.ToDateTime(EndTime).ToString("h:mm");
            }

            Int32 LeaveTypeID = 0;
            if (AddLunch == true)
                LeaveTypeID = 9;


            // Get Hourly and Salary Rate
            sb.Clear();
            sb.Append("SELECT [Line_Rate], [Percent] ,FlatRateNoHours ");
            sb.Append("From Payroll_Dist ");
            sb.AppendFormat("WHERE Employee_No = {0} AND [Job_Description_No]= {1} AND [Deleted]=0 ", EmpId, JobID);
            sb.AppendFormat("AND '" + DateTime.Now.ToString("MM/dd/yyyy") + "' Between StartDate and EndDate ");//MAT added DateTime
            sb.Append("ORDER BY EndDate Desc ");
            System.Data.DataTable dt = rsData.SelectRowsDS(ConnString, sb.ToString()).Tables[0];

            if (dt.Rows.Count == 0)
            {
                sb.Clear();
                sb.Append("SELECT [Line_Rate], [Percent], FlatRateNoHours ");
                sb.Append("From Payroll_Dist ");
                sb.AppendFormat("WHERE Employee_No = {0} AND [Job_Description_No]= {1} AND [Deleted]=0 ", EmpId, JobID);
                sb.Append("AND  EndDate IS NULL ");
                sb.Append("ORDER BY EndDate Desc ");
                dt = rsData.SelectRowsDS(ConnString, sb.ToString()).Tables[0];
            }

            bool FlatRate = (bool)dt.Rows[0]["FlatRateNoHours"];//MAt. Changed all () to []. Also casted to bool
            if (FlatRate == true)
            {
                StartTime = "";
                StartAMPM = "";
                EndTime = "";
                EndAMPM = "";
            }

            sb.Clear();
            sb.Append("INSERT INTO TimeCards ");
            sb.Append("(EmpID, ");
            sb.Append("[Date], ");
            sb.Append("StartTime, ");
            sb.Append("EndTime, ");
            sb.Append("LeaveTypeID, ");
            sb.Append("SiteID, ");
            sb.Append("AreaID, ");
            sb.Append("TimeCardHeaderID, ");
            sb.Append("JobID, ");
            sb.Append("Hours, ");
            sb.Append("Memo, ");
            sb.Append("Tods, ");
            sb.Append("Tode, ");
            sb.Append("ManualMod, ");
            sb.Append("HourTypeID, ");
            sb.Append("FMLAID, ");
            sb.Append("ModifiedBy, ");
            sb.Append("ModifiedDate, ");
            sb.Append("AddedBy, ");
            sb.Append("AddedWhenDate, ");
            sb.Append("SupervisorID, ");
            sb.Append("SubAssignID, ");
            sb.Append("IHAC, ");
            sb.Append("LatIn, ");
            sb.Append("LongIn, ");
            sb.Append("LatOut, ");
            sb.Append("LongOut) ");
            sb.AppendFormat("VALUES({0}, '{1}', '{2}', '{3}', ", EmpId, WorkDate, StartTime, EndTime);
            sb.AppendFormat("{0}, {1}, {2}, {3}, ", LeaveTypeID, row["BuildingID"], row["LocID"], TCHeaderID);//MAT. Changed the ( ) after row to [ ]
            sb.AppendFormat("{0}, {1}, NULL, '{2}', '{3}', 0, 0, 0, ", JobID, hours, StartAMPM, EndAMPM);
            sb.AppendFormat("0, NULL, {0}, '{1}', {2}, 0, '', ", WhoID, DateTime.Now, SupervisorID);//MAT. Added DateTime
            sb.AppendFormat("{0}, {1}, 0, 0) ", LatIn, LongIn);
            return rsData.AddNewRecord(ConnString, sb.ToString());//MAT casted to int

        }


        public long GetEmpTimeCardHeaderIDByDate(string ConnString, long EmployeeID, string WorkDay)
        {

            sb.Clear();
            sb.Append("SELECT ID ");
            sb.Append("FROM TimeCardHeader ");
            sb.AppendFormat("WHERE '{0}' BETWEEN StartDate AND EndDate AND EmpID = {1}", WorkDay, EmployeeID);
            return (long)rsData.QueryScalar(ConnString, sb.ToString());//MAT casted to long

        }

        //MAT - 2/13/2017 - If unused for more than 20 days. REMOVE
        //public DataSet CheckForNoClockOut(string ConnString, long EmpID)
        //{
        //    sb.Clear();
        //    sb.Append("SELECT TimeCards.ID, Payroll_Job_Description.Emp_Job_Id, Payroll_Job_Description.Emp_Job_Description, TimeCards.StartTime + TimeCards.TodS as InTime, TimeCards.EndTime + TimeCards.TodE as OutTime ");
        //    sb.Append("FROM TimeCards LEFT OUTER JOIN ");
        //    sb.Append("Payroll_Job_Description ON TimeCards.JobID = Payroll_Job_Description.Emp_Job_Id ");
        //    //sb.AppendFormat("WHERE EndTime = '' AND EmpID = {0} AND [Date] = '{1}' ", EmpID, DateTime.Now.ToString("MM/dd/yyyy"));//MAT. Added DateTime
        //    sb.AppendFormat("WHERE EmpID = {0} AND [Date] = '{1}' ", EmpID, DateTime.Now.ToString("MM/dd/yyyy"));//MAT. Added DateTime
        //    return rsData.SelectRowsDS(ConnString, sb.ToString());
        //}

        public String GetInfalClockInsAndOuts(long EmpID)
        {
            sb.Clear();
            sb.Append("SELECT TimeCards.ID, Payroll_Job_Description.Emp_Job_Id, Payroll_Job_Description.Emp_Job_Description, TimeCards.StartTime + TimeCards.TodS as InTime, TimeCards.EndTime + TimeCards.TodE as OutTime, TimeCards.Memo as Memo ");
            sb.Append("FROM TimeCards LEFT OUTER JOIN ");
            sb.Append("Payroll_Job_Description ON TimeCards.JobID = Payroll_Job_Description.Emp_Job_Id ");
            //sb.AppendFormat("WHERE EndTime = '' AND EmpID = {0} AND [Date] = '{1}' ", EmpID, DateTime.Now.ToString("MM/dd/yyyy"));//MAT. Added DateTime
            sb.AppendFormat("WHERE EmpID = {0} AND [Date] = '{1}' ", EmpID, DateTime.Now.ToString("MM/dd/yyyy"));//MAT. Added DateTime
            return sb.ToString();
        }

        public long UpdateTimeCard(string ConnString, long RecID, string EndTime, string EndTimeAMPM, decimal LatOut, decimal LongOut, string Memo, long EmpID)
        {

            sb.Clear();
            sb.Append("SELECT ID ");
            sb.Append("FROM [Integrated Information] ");
            sb.AppendFormat("WHERE EmployeeID = {0} ", EmpID);
            dynamic WhoID = rsData.QueryScalar(ConnString, sb.ToString());

            string tEndTime = string.Empty;


            if (!Information.IsDate(EndTime))
            {
                sb.Clear();
                sb.AppendFormat("SELECT StartTime ");
                sb.AppendFormat("FROM TimeCards ");
                sb.AppendFormat("WHERE ID = {0} ", RecID);//MAT. Added to string to below
                EndTime = (rsData.QueryScalar(ConnString, sb.ToString())).ToString();
            }

            sb.Clear();
            sb.Append("UPDATE TimeCards ");
            sb.AppendFormat("SET EndTime = '{0}', ", Convert.ToDateTime(EndTime).ToString("H:mm"));
            sb.AppendFormat("TodE = '{0}', ", EndTimeAMPM);
            sb.AppendFormat("Memo = '{0}', ", Memo.ToString().Replace("'", "''"));
            sb.AppendFormat("LatOut = {0}, ", LatOut);
            sb.AppendFormat("ModifiedBy = {0}, ", WhoID);
            sb.AppendFormat("ModifiedDate = '{0}', ", DateTime.Now);//MAT. Added DateTime
            sb.AppendFormat("LongOut = {0} ", LongOut);
            sb.AppendFormat("WHERE ID = {0} ", RecID);
            return rsData.UpdateRecord(ConnString, sb.ToString());

        }

    }
}