using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.VisualBasic;
using System.Collections;
using System.Data;
using System.Diagnostics;
using System.IO;
using iAnywhere.Data.SQLAnywhere;
using System.Configuration;
using Anywhere.Log;
using System.Data.Odbc;

namespace Anywhere.service.Data
{
    public class Sybase
    {
        private static Loger logger = new Loger();
        private string gSAConnString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        //public void AddNewRecord(string QueryString, string newEntry)
        //{
        //    using (SAConnection connection = new SAConnection(gSAConnString))
        //    {
        //        using (SACommand SqlCommand = new SACommand(QueryString, connection))
        //        {
        //            SqlCommand.CommandTimeout = 0;
        //            connection.Open();
        //            SqlCommand.ExecuteReader();
        //        }
        //    }
        //}

        //public long AddNewRecord(string QueryString, string ParmName = "", byte[] ByteArray = null, string MyText = "")
        //{
        //    long functionReturnValue = 0;
        //    try
        //    {
        //        using (SAConnection connection = new SAConnection(gSAConnString))
        //        {
        //            QueryString += ";SELECT @@identity;";
        //            //This gets the new ID number

        //            SACommand SqlCommand = new SACommand(QueryString, connection);
        //            SqlCommand.CommandTimeout = 0;

        //            if (ByteArray != null)
        //                SqlCommand.Parameters.AddWithValue(ParmName, ByteArray);
        //            if (MyText != string.Empty)
        //                SqlCommand.Parameters.AddWithValue(ParmName, MyText);

        //            connection.Open();

        //            SADataReader DR = SqlCommand.ExecuteReader;
        //            DR.Read();
        //            functionReturnValue = Convert.ToInt64(DR.GetValue(0));
        //            DR.Close();

        //            if (SqlCommand.Connection.State == ConnectionState.Open)
        //                SqlCommand.Connection.Close();
        //            if (connection.State == ConnectionState.Open)
        //                connection.Close();

        //            return functionReturnValue;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        if (gTest == true)
        //        {
        //            Interaction.MsgBox(ex.Message);
        //        }
        //        return -999;
        //    }
        //    return functionReturnValue;

        //}

        //public bool ColumnExists(string ConnString, string TableName, string ColumnName)
        //{
        //    return false;
        //}

        //public long DeleteRecord(string QueryString)
        //{

        //    try
        //    {
        //        using (SAConnection connection = new SAConnection(gSAConnString))
        //        {
        //            using (SACommand SqlCommand = new SACommand(QueryString, connection))
        //            {
        //                SqlCommand.CommandTimeout = 0;
        //                connection.Open();
        //                return SqlCommand.ExecuteNonQuery();
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        if (gTest == true)
        //        {
        //            Interaction.MsgBox(ex.Message);
        //        }
        //    }
        //}

        //public DataSet ExcelData(string ConnString, string DataSource, string SelectData)
        //{
        //    string ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + DataSource + ";" + "Extended Properties=\"Excel 8.0;HDR=No;IMEX=1;\"";

        //    using (OleDb.OleDbConnection ExcelConn = new OleDb.OleDbConnection(ConnectionString))
        //    {
        //        ExcelConn.Open();

        //        OleDb.OleDbDataAdapter DA = new OleDb.OleDbDataAdapter(SelectData, ExcelConn);
        //        DataSet DS = new DataSet();
        //        DA.Fill(DS, "Temp");

        //        return DS;
        //    }
        //}

        //public DataSet FormulaQuery(string queryString)
        //{
        //    // Primaraly used for update Querys

        //    using (SAConnection connection = new SAConnection(gSAConnString))
        //    {
        //        using (SACommand SqlCommand = new SACommand(queryString, connection))
        //        {
        //            SqlCommand.CommandTimeout = 0;

        //            DataSet DS = new DataSet();
        //            SADataAdapter DA = new SADataAdapter(SqlCommand);
        //            DA.Fill(DS);
        //            return DS;
        //        }
        //    }
        //}

        //public DataSet GetXMLData(string ConnString, string DataSource, string SelectData)
        //{
        //    DataSet functionReturnValue = default(DataSet);
        //    functionReturnValue = null;
        //    DataSet ds = new DataSet();
        //    ds.ReadXml("C:\\m&a\\Counties\\BillingConnection\\Gatekeeper Case Notes.xml");
        //    return ds;
        //    return functionReturnValue;
        //}

        //public decimal QueryScalarDec(string QueryString)
        //{
        //    decimal functionReturnValue = default(decimal);
        //    // Returns the first column of the first row in the results set (Used for Single value returns or counts)
        //    using (SAConnection connection = new SAConnection(gSAConnString))
        //    {
        //        functionReturnValue = 0;
        //        using (SACommand SqlCommand = new SACommand(QueryString, connection))
        //        {
        //            SqlCommand.CommandTimeout = 0;
        //            connection.Open();
        //            if ((!object.ReferenceEquals(SqlCommand.ExecuteScalar, System.DBNull.Value)))
        //                functionReturnValue = Convert.ToDecimal(SqlCommand.ExecuteScalar);
        //            return functionReturnValue;
        //        }
        //    }
        //    return functionReturnValue;
        //}

        //public long QueryScalarLong(string QueryString)
        //{
        //    long functionReturnValue = 0;
        //    // Returns the first column of the first row in the results set (Used for Single value returns or counts)
        //    using (SAConnection connection = new SAConnection(gSAConnString))
        //    {
        //        functionReturnValue = 0;
        //        using (SACommand SqlCommand = new SACommand(QueryString, connection))
        //        {
        //            SqlCommand.CommandTimeout = 0;
        //            connection.Open();
        //            if ((!object.ReferenceEquals(SqlCommand.ExecuteScalar, System.DBNull.Value)))
        //                functionReturnValue = Convert.ToInt64(SqlCommand.ExecuteScalar);
        //            return functionReturnValue;
        //        }
        //    }
        //    return functionReturnValue;
        //}

        public decimal QueryScalarDecimal(string QueryString)
        {
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)
            using (SAConnection connection = new SAConnection(gSAConnString))
            {
                if (gSAConnString.ToUpper().IndexOf("UID") == -1)
                {
                    gSAConnString = gSAConnString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                try
                {
                    using (SACommand sqlCommand = new SACommand(QueryString, connection))
                    {
                        sqlCommand.CommandTimeout = 0;
                        connection.Open();

                        object val = sqlCommand.ExecuteScalarAsync();
                        if (Information.IsDBNull(val) | (val == null))
                            val = 0;
                        return (decimal)val;
                    }
                }
                catch (Exception ex)
                {
                }
                return 0;
            }
        }

        public decimal QueryScalar(string QueryString)
        {
            decimal SAQueryScalarRet = 0.0m;
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)
            using (SAConnection connection = new SAConnection(gSAConnString))
            {
                if (gSAConnString.ToUpper().IndexOf("UID") == -1)
                {
                    gSAConnString = gSAConnString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                try
                {
                    using (SACommand sqlCommand = new SACommand(QueryString, connection))
                    {
                        sqlCommand.CommandTimeout = 0;
                        connection.Open();

                        if (!object.ReferenceEquals(sqlCommand.ExecuteScalar(), DBNull.Value))
                            SAQueryScalarRet = (decimal)(int)sqlCommand.ExecuteScalar();
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
        }


    


    //public decimal SAQueryScalar(string QueryString)
    //{
    //    // Returns the first column of the first row in the results set (Used for Single value returns or counts)

    //    SAQueryScalar = 0.0;

    //    try
    //    {
    //        using (SAConnection connection = new SAConnection(gSAConnString))
    //        {
    //            SAQueryScalar = 0;

    //            SACommand SqlCommand = new SACommand(QueryString, connection);
    //            SqlCommand.CommandTimeout = 0;

    //            connection.Open();
    //            if (!SqlCommand.ExecuteScalarAsync() == System.DBNull.Value)
    //            {
    //                SAQueryScalar = SqlCommand.ExecuteScalarAsync();
    //            }

    //            if (connection.State == ConnectionState.Open)
    //                connection.Close();

    //            return SAQueryScalar;
    //        }
    //    }
    //    catch (Exception ex)
    //    {
    //    }
    //    return SAQueryScalar;
    //}

    //public void SaveRecordDS(string queryString, DataSet DS)
    //{
    //    using (SAConnection connection = new SAConnection(gSAConnString))
    //    {
    //        using (SACommand SqlCommand = new SACommand(queryString, connection))
    //        {
    //            SqlCommand.CommandTimeout = 0;
    //            using (SADataAdapter DA = new SADataAdapter(SqlCommand))
    //            {
    //                DA.Update(DS);
    //            }
    //        }
    //    }
    //}

    public DataSet SelectRowsDS(string queryString)
        {
            DataSet DS = new DataSet();
            if (gSAConnString.ToUpper().IndexOf("UID") == -1)
            {
                gSAConnString = gSAConnString + "UID=anywhereuser;PWD=anywhere4u;";
            }

            using (SAConnection connection = new SAConnection(gSAConnString))
            {
                logger.debug(gSAConnString);
                using (SACommand SqlCommand = new SACommand(queryString, connection))
                {
                    SqlCommand.CommandTimeout = 0;

                    try
                    {
                        SADataAdapter DA = new SADataAdapter(SqlCommand);
                        DA.Fill(DS);
                        try{
                            DS.Tables[0].PrimaryKey = new DataColumn[] { DS.Tables[0].Columns[0] };
                        }
                        catch (Exception ex)
                        {
                        }
                        if (connection.State == ConnectionState.Open)
                            connection.Close();
                    }
                    catch (Exception ex)
                    {
                    }
                    return DS;
                }
            }
        }

        public DataSet SelectRowsDS(string queryString, bool NoPrimaryKey)
        {
            if (gSAConnString.ToUpper().IndexOf("UID") == -1)
            {
                gSAConnString = gSAConnString + "UID=anywhereuser;PWD=anywhere4u;";
            }
            using (SAConnection connection = new SAConnection(gSAConnString))
            {
                using (SACommand SqlCommand = new SACommand(queryString, connection))
                {
                    SqlCommand.CommandTimeout = 0;

                    DataSet DS = new DataSet();
                    SADataAdapter DA = new SADataAdapter(SqlCommand);
                    DA.Fill(DS);
                    return DS;
                }
            }
        }

        public DataSet SelectRowsDS(string queryString, string strTableName)
        {
            if (gSAConnString.ToUpper().IndexOf("UID") == -1)
            {
                gSAConnString = gSAConnString + "UID=anywhereuser;PWD=anywhere4u;";
            }
            using (SAConnection connection = new SAConnection(gSAConnString))
            {
                using (SACommand SqlCommand = new SACommand(queryString, connection))
                {
                    SqlCommand.CommandTimeout = 0;

                    DataSet DS = new DataSet();
                    SADataAdapter DA = new SADataAdapter(SqlCommand);

                    DA.Fill(DS, strTableName);
                    DS.Tables[0].PrimaryKey = new DataColumn[] { DS.Tables[0].Columns[0] };
                    return DS;
                }
            }
        }

        //public string StreamDataRead(string DataString)
        //{
        //    System.IO.StreamReader sr = new System.IO.StreamReader(DataString);
        //    return sr.ReadToEnd;
        //}

        public long UpdateRecord(string QueryString)
        {
            long functionReturnValue = 0;
            if (gSAConnString.ToUpper().IndexOf("UID") == -1)
                {
                    gSAConnString = gSAConnString + "UID=anywhereuser;PWD=anywhere4u;";
                }
            try
            {
                functionReturnValue = 0;
                using (OdbcConnection connection = new OdbcConnection(gSAConnString))
                {
                    using (OdbcCommand odbcCommand = new OdbcCommand(QueryString, connection))
                    {
                        odbcCommand.CommandTimeout = 0;
                        connection.Open();
                        functionReturnValue = odbcCommand.ExecuteNonQuery();
                        return functionReturnValue;
                    }
                }
            }
            catch (Exception ex)
            {
                //throw new System.Exception(ex.Message.ToString + Constants.vbCrLf + ex.Source + ex.StackTrace);
                return -999;
            }
            return functionReturnValue;
        }

        //public string WriteDataStream(string FileName)
        //{
        //    try
        //    {
        //        string s = string.Empty;
        //        s = IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory(), "Temp", System.IO.Path.GetRandomFileName());
        //        if (!IO.Directory.Exists(IO.Path.GetDirectoryName(s)))
        //            IO.Directory.CreateDirectory(IO.Path.GetDirectoryName(s));

        //        using (TextWriter writer = new StreamWriter(s))
        //        {
        //            writer.Close();
        //        }

        //        FileInfo fi = new FileInfo(s);
        //        s = System.IO.File.ReadAllText(fi.FullName);

        //        fi.Delete();
        //        return s;
        //    }
        //    catch (Exception ex)
        //    {
        //        return string.Empty;
        //    }
        //}

    }
}