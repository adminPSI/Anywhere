using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Data;

namespace Anywhere.service.Data
{
    public class InfalWorker
    {
        //Bobafet\sarlacc
        //New Timeclock Object Creation
        DataXferFunctions dxf = new DataXferFunctions();
        DataGetterInfal data = new DataGetterInfal();
        SQLBuilder sqlBuild = new SQLBuilder();
        Common common = new Common();        

        private string ConnString = System.Configuration.ConfigurationManager.ConnectionStrings["infalconnection"].ToString();
        System.Web.Script.Serialization.JavaScriptSerializer serializer = new System.Web.Script.Serialization.JavaScriptSerializer();

        public string ValidateLogin(string id)
        {
            if (ConnString == "")
            {
                return serializer.Serialize("No Connection");
            }
            DataSet ds = new DataSet();
            string loginResultString = "";
            string jobsQueryString = "";
            //string newPass = data.Encrypt(pass);
            //string loginQuery = "SELECT EmployeeID FROM [Integrated Information] WHERE (LoginID = '" + id + "') AND (Password = '" + newPass + "')";
            string loginQuery = "SELECT EmployeeID FROM [Integrated Information] WHERE (LoginID = '" + id + "') AND Inactive = 0";
            long loginResultInteger = (long)data.QueryScalar(ConnString, loginQuery);
            loginResultString = "<results><result><id>" + loginResultInteger.ToString() + "</id></result></results>";
            return loginResultString;
        }

        public string getInfalUserName(string empId)
        {
            DataSet ds = new DataSet();
            string userNameResultString = "";
            string legalNameQuery = "SELECT LegalName FROM [Integrated Information] WHERE (EmployeeID = '" + empId + "')";
            string legalName = data.QueryScalarString(ConnString, legalNameQuery);
            userNameResultString = "<results><result><name> " + legalName + "</name></result></results>";
            return userNameResultString;
        }        

        //New
        public string InfalGetClockInsAndOuts(string id)
        {
            //New between
            double num;
            //get empid from userid
            id = ConvertToEmpId(id);
            
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> myRow;

            DataSet ds = new DataSet();
            long longId = Int64.Parse(id);
            string clockInsAndOutsQueryString = sqlBuild.GetInfalClockInsAndOuts(longId);
            ds = data.SelectRowsDS(ConnString, clockInsAndOutsQueryString);
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                foreach (DataRow row in dt.Rows)
                {
                    myRow = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        myRow.Add(col.ColumnName, row[col]);
                    }
                    rows.Add(myRow);
                }
            }
            return serializer.Serialize(rows);
        }

        //New
        public string InfalGetJobs(string id)
        {
            if (ConnString == "")
            {
                return serializer.Serialize("No Connection");
            }
            //New between
            double num;
            //get empid from userid
            id = ConvertToEmpId(id);
            List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
            Dictionary<string, object> myRow;
            DataSet ds = new DataSet();
            //Had to convert id to long to be passed
            long longId = Int64.Parse(id);        
            //returns query string to be passed to database
            string jobsQueryString = sqlBuild.AssignParameterGetJobs(longId);
            //save result to dataset
            ds = data.SelectRowsDS(ConnString, jobsQueryString);
            //check if dataset has data
            if (ds.Tables[0].Rows.Count > 0)
            {
                DataTable dt = ds.Tables[0];
                Int32 i = 0;
                foreach (DataRow row in dt.Rows)
                {
                    i += 1;
                    myRow = new Dictionary<string, object>();
                    foreach (DataColumn col in dt.Columns)
                    {
                        myRow.Add(col.ColumnName, row[col]);
                    }
                    rows.Add(myRow);
                }
            }
            return serializer.Serialize(rows);
        }

        public string InfalClockIn(string empIdString, string jobIdString, string latInString, string longInString, string inDate, string StartTime, string StartAMPM)
        {
            //New between
            double num;
            //get empid from userid
            empIdString = ConvertToEmpId(empIdString);
            bool AddLunch = false;
	        string WorkDay = inDate;
	        string WorkDate = inDate;
	        Int32 WhoId = Int32.Parse(empIdString);
	        Int32 EmpId = Int32.Parse(empIdString);
	        Int32 JobId = Int32.Parse(jobIdString);
	        decimal LatIn = Decimal.Parse(latInString);
	        decimal LongIn = Decimal.Parse(longInString);
	        string EndTime = "";
	        string EndAMPM = "";
            if (StartTime == "12:00" && StartAMPM == "AM")
            {
                StartTime = "11:59";
                StartAMPM = "PM";
            }
            long TCHeader = sqlBuild.GetEmpTimeCardHeaderIDByDate(ConnString, EmpId, WorkDay);                           //Added cast to int
	        string result = sqlBuild.AddNewTimeCard(ConnString, EmpId, WorkDate, StartTime, StartAMPM, EndTime, EndAMPM, (int)TCHeader, JobId, AddLunch,
	            WhoId, LatIn, LongIn);
	        return result.ToString();
        }

        public string InfalClockOut(string empIdString, string jobIdString, string recIdString, string latOutString, string longOutString, string outDate, string EndTime, string EndTimeAMPM, string Memo)
        {
            //New between
            double num;
            //get empid from userid
            empIdString = ConvertToEmpId(empIdString);
            long result = 0;
	        decimal LatOut = Decimal.Parse(latOutString);
	        decimal LongOut = Decimal.Parse(longOutString);
	        long EmpId = Int64.Parse(empIdString);
	        long RecID = Int64.Parse(recIdString);
            if (EndTime == "12:00" && EndTimeAMPM == "AM")
            {
                EndTime = "11:59";
                EndTimeAMPM = "PM";
            }
	       return "<results><result>" + sqlBuild.UpdateTimeCard(ConnString, RecID, EndTime, EndTimeAMPM, LatOut, LongOut, Memo, EmpId).ToString() + "</result></results>";
        }

        public string ConvertToEmpId(string idString)
        {
            if (ConnString == "")
            {
                return serializer.Serialize("No Connection");
            }
            string loginQuery = "SELECT EmployeeID FROM [Integrated Information] WHERE (EmployeeID = '" + idString + "') AND Inactive = 0";
            long loginResultInteger = (long)data.QueryScalar(ConnString, loginQuery);
            idString = loginResultInteger.ToString();

            return idString;
        }

        public string CheckInfalConnection()
        {
            if (ConnString == "")
            {
                return serializer.Serialize("No Connection");
            }
            else
            {
                return "Connection";
            }
        }
    }
}