using Microsoft.VisualBasic;
using Microsoft.VisualBasic.CompilerServices;
using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Text;
using System.Web;

namespace Anywhere.service.Data
{
    public class OISPWorker
    {
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        //private string gISPDTConnstring = "https://mule-worker-dodd-oisp-api-uat2.us-e2.cloudhub.io:8082/api/";
        private string gISPDTConnstring = "https://mule-worker-dodd-oisp-api-trn.us-e2.cloudhub.io:8082/api/";
        StringBuilder sb = new StringBuilder();
        private string dq = "\"";
        public static WebRequestHandler gOISPHandler = new WebRequestHandler();
        public static HttpClient gOISPClient = new HttpClient((HttpMessageHandler)gOISPHandler);

        public long AddFamilyMemberToIndividal(long GKPeopleID, long GKFamilyMemberID)
        {
            long num = 0;
            StringBuilder stringBuilder = new StringBuilder();
            string sfClientId = GetSFClientID(GKPeopleID);
            sb.Clear();
            sb.Append("SELECT Last_Name AS LastName, ");
            sb.Append("First_Name AS FirstName, ");
            sb.Append("Date_of_Birth AS DOB, ");
            sb.Append("ID AS BuildingNo, ");
            sb.Append("Address1 ");
            sb.Append("FROM dba.People ");
            sb.AppendFormat("WHERE ID = {0} ", GKFamilyMemberID);
            DataSet dataSet = SASelectRowsDS(connectString, sb.ToString());
            if (dataSet.Tables.Count > 0)
            {
                DataTable table = dataSet.Tables[0];
                try
                {
                    foreach (DataRow row in table.Rows)
                    {
                        string empty = string.Empty;
                        if (Information.IsDate(RuntimeHelpers.GetObjectValue(row["DOB"])))
                            empty = Conversions.ToDate(row["DOB"]).ToString("yyyy-MM-dd");
                        stringBuilder.Clear();
                        stringBuilder.Append("{");
                        stringBuilder.AppendFormat("{0}FirstName{0}: {0}{1}{0}, ", dq, RuntimeHelpers.GetObjectValue(row["FirstName"]));
                        stringBuilder.AppendFormat("{0}LastName{0}: {0}{1}{0}, ", dq, RuntimeHelpers.GetObjectValue(row["LastName"]));
                        stringBuilder.AppendFormat("{0}DOB{0}: {0}{1}{0}, ", dq, empty);
                        stringBuilder.AppendFormat("{0}BuildingNo{0}: {0}{1}{0} ", dq, RuntimeHelpers.GetObjectValue(row["BuildingNo"]));
                        stringBuilder.Append("}");
                    }
                }
                finally
                {
                    IEnumerator enumerator;
                }
            }
            string str = PostFamilyMember(sfClientId, stringBuilder.ToString(), GKPeopleID);
            return Microsoft.VisualBasic.CompilerServices.Operators.CompareString(str, string.Empty, false) > 0 ? UpdateFamilyMemberSFID(GKFamilyMemberID, str) : num;
        }

        public string GetSFClientID(long GKPeopleID)
        {
            sb.Clear();
            sb.Append("SELECT   Salesforce_ID ");
            sb.Append("FROM dba.People ");
            sb.AppendFormat("WHERE   ID = {0} ", GKPeopleID);
            return SAQueryScalarString(connectString, sb.ToString());
        }

        public string PostFamilyMember(string SFClientID, string JSON, long GKPeopleRecID)
        {
            string empty = string.Empty;
            if (Microsoft.VisualBasic.CompilerServices.Operators.CompareString(JSON, string.Empty, false) != 0)
            {
                HttpResponseMessage Expression = PostHTTPWebEvent(string.Format("{0}{1}/{2}/familymembers", RuntimeHelpers.GetObjectValue(gISPDTConnstring), "individuals", SFClientID), JSON);
                if (!Information.IsNothing(Expression) && (uint)(-(Expression.StatusCode == HttpStatusCode.Created ? 1 : 0) | 200) > 0U)
                {
                    DataTable dataTable = JsonConvert.DeserializeObject<DataTable>(string.Format("[{0}]", Expression.Content.ReadAsStringAsync().Result));
                    Expression.Dispose();
                    return Conversions.ToString(dataTable.Rows[0]["ID"]);
                }
            }
            return empty;
        }

        private long UpdateFamilyMemberSFID(long GKFamilyMemberID, string SFFamilyID)
        {
            sb.Clear();
            sb.Append("UPDATE People ");
            sb.AppendFormat("SET Salesforce_ID = '{0}' ", SFFamilyID);
            sb.AppendFormat("WHERE dba.People.ID = {0} ", GKFamilyMemberID);
            return SAUpdateRecord(connectString, sb.ToString());
        }

        public string GetIndividualContactsJSON(string SFClientID)
        {
            sb.Clear();
            string individualContactsJson = string.Empty;

            HttpResponseMessage httpWebEvent = GetHTTPWebEvent(sb.AppendFormat("https://mule-worker-dodd-oisp-api-trn.us-e2.cloudhub.io:8082/api/individuals/{0}/contacts", SFClientID).ToString());
            //throw new HttpResponseException(httpWebEvent);
            //HttpResponseMessage httpWebEvent = GetHTTPWebEvent(string.Format("{0}{1}/{2}/contacts", RuntimeHelpers.GetObjectValue(gISPDTConnstring), "individuals", SFClientID));
            if (!Information.IsNothing(httpWebEvent))
            {
                individualContactsJson = httpWebEvent.Content.ReadAsStringAsync().Result;
                httpWebEvent.Dispose();
            }
            return individualContactsJson;
        }

        public string GetIndividualOhioDDID(string OhioDDID)
        {
            DataSet dataSet = new DataSet();
            HttpResponseMessage httpWebEvent = GetHTTPWebEvent(string.Format("{0}{1}/{2}", RuntimeHelpers.GetObjectValue(gISPDTConnstring), "individuals", OhioDDID));
            if (Information.IsNothing(httpWebEvent))
            {
                //string individualOhioDdid;
                //return individualOhioDdid;
                return "";
            }
            string result = httpWebEvent.Content.ReadAsStringAsync().Result;
            string empty = string.Empty;
            string individualOhioDdid1 = !result.Contains("ID") ? "No SalesForceID Found" : result.Substring(checked(result.IndexOf(":") + 4), 17);
            httpWebEvent.Dispose();
            UpdateIndividualSFID(OhioDDID, individualOhioDdid1);
            return individualOhioDdid1;
        }

        public long UpdateIndividualSFID(string GKPeopleID, string SFID)
        {
            this.sb.Clear();
            this.sb.Append("UPDATE  dba.People ");
            this.sb.AppendFormat("SET Salesforce_ID = '{0}' ", SFID);
            this.sb.AppendFormat("WHERE  dba.People.ID = {0} ", GKPeopleID);
            return SAUpdateRecord(connectString, sb.ToString());
        }

        public HttpResponseMessage GetHTTPWebEvent(string URL)
        {
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Get, URL);
            HttpResponseMessage result;
            try
            {
                result = gOISPClient.GetAsync(URL).Result;
            }
            catch (Exception ex)
            {
                ProjectData.SetProjectError(ex);
                Exception exception = ex;
                int num = (int)Interaction.MsgBox((object)exception.Message);
                //new ISPDTData().WriteToLog(URL, exception.Message);
                ProjectData.ClearProjectError();
                result = null;
            }
            return result;
        }

        public HttpResponseMessage PostHTTPWebEvent(string URL, string JSON)
        {
            HttpResponseMessage httpResponseMessage = (HttpResponseMessage)null;
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, URL);
            httpRequestMessage.Content = (HttpContent)new StringContent(JSON, Encoding.UTF8, "application/json");
            try
            {
                httpResponseMessage = gOISPClient.PostAsync(URL, httpRequestMessage.Content).Result;
            }
            catch (Exception ex)
            {
                ProjectData.SetProjectError(ex);
                int num = (int)Interaction.MsgBox((object)ex.Message);
                ProjectData.ClearProjectError();
            }
            return httpResponseMessage;
        }

        public HttpResponseMessage PostHTTPWebEvent(string URL)
        {
            HttpRequestMessage httpRequestMessage = new HttpRequestMessage(HttpMethod.Post, URL);
            HttpResponseMessage result;
            try
            {
                result = gOISPClient.PostAsync(URL, httpRequestMessage.Content).Result;
            }
            catch (Exception ex)
            {
                ProjectData.SetProjectError(ex);
                int num = (int)Interaction.MsgBox((object)ex.Message);
                ProjectData.ClearProjectError();
                result = null;
            }
            return result;
        }

        //DB Calls Below
        public DataSet SASelectRowsDS(string ConnString, string queryString)
        {
            using (OdbcConnection connection = new OdbcConnection(ConnString))
            {
                OdbcCommand selectCommand = new OdbcCommand(queryString, connection);
                selectCommand.CommandTimeout = 0;
                DataSet dataSet = new DataSet();
                OdbcDataAdapter odbcDataAdapter = new OdbcDataAdapter(selectCommand);
                try
                {
                    odbcDataAdapter.Fill(dataSet);
                    dataSet.Tables[0].PrimaryKey = new DataColumn[1]
                    {
            dataSet.Tables[0].Columns[0]
                    };
                }
                catch (Exception ex)
                {
                    ProjectData.SetProjectError(ex);
                    ProjectData.ClearProjectError();
                }
                if (selectCommand.Connection.State == ConnectionState.Open)
                    selectCommand.Connection.Close();
                if (connection.State == ConnectionState.Open)
                    connection.Close();
                return dataSet;
            }
        }

        public string SAQueryScalarString(string ConnString, string QueryString)
        {
            using (OdbcConnection connection = new OdbcConnection(ConnString))
            {
                OdbcCommand odbcCommand = new OdbcCommand(QueryString, connection);
                odbcCommand.CommandTimeout = 0;
                string str = "";
                connection.Open();
                if (odbcCommand.ExecuteScalar() != DBNull.Value)
                    str = Conversions.ToString(odbcCommand.ExecuteScalar());
                if (str == null)
                    str = "";
                if (connection.State == ConnectionState.Open)
                    connection.Close();
                return str;
            }
        }

        public long SAUpdateRecord(string ConnString, string QueryString)
        {
            long num1;
            try
            {
                num1 = 0L;
                using (OdbcConnection connection = new OdbcConnection(ConnString))
                {
                    OdbcCommand odbcCommand = new OdbcCommand(QueryString, connection);
                    odbcCommand.CommandTimeout = 0;
                    connection.Open();
                    num1 = (long)odbcCommand.ExecuteNonQuery();
                    if (odbcCommand.Connection.State == ConnectionState.Open)
                        odbcCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    num1 = num1;
                }
            }
            catch (Exception ex)
            {
                ProjectData.SetProjectError(ex);
                Exception exception = ex;
                //if (MySettingsProperty.Settings.Debug)
                //{
                //    int num2 = (int)Interaction.MsgBox((object)(exception.Message.ToString() + "\r\n" + exception.Source + exception.StackTrace));
                //}
                //num1 = -999L;
                //ProjectData.ClearProjectError();
                num1 = -999L;
            }
            return num1;
        }
    }
}