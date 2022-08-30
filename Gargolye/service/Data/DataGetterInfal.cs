using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.VisualBasic;
using System.Data.OleDb;
using System.Collections;
using System.Data;
using System.Diagnostics;
using iAnywhere.Data.SQLAnywhere;
using System.Data.SqlClient;
using System.Security.Cryptography;
using System.IO;

namespace Anywhere.service.Data
{
    public class DataGetterInfal
    {

        public DataSet SelectRowsDS(string ConnString, string queryString, string strTableName)
        {

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand SqlCommand = new SqlCommand(queryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    DataSet DS = new DataSet();
                    SqlDataAdapter DA = new SqlDataAdapter(SqlCommand);

                    DA.Fill(DS, strTableName);
                    DS.Tables[0].PrimaryKey = new DataColumn[] { DS.Tables[0].Columns[0] };
                    

                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    return DS;
                    //Test   
                }
            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("SelectRowDS{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, queryString));
                return null;
            }
        }
        public DataSet SelectRowsDS(string ConnString, string queryString)
        {


            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand SqlCommand = new SqlCommand(queryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    DataSet DS = new DataSet();
                    SqlDataAdapter DA = new SqlDataAdapter(SqlCommand);
                    DA.Fill(DS);

                    try
                    {
                        DS.Tables[0].PrimaryKey = new DataColumn[] { DS.Tables[0].Columns[0] };

                    }
                    catch (Exception ex)
                    {
                    }
                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    return DS;

                }

            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("SelectRowDS{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, queryString));
                return null;
            }

        }
        public DataSet SelectRowsDS(string ConnString, string queryString, bool NoPrimaryKey)
        {

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand SqlCommand = new SqlCommand(queryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    DataSet DS = new DataSet();
                    SqlDataAdapter DA = new SqlDataAdapter(SqlCommand);
                    DA.Fill(DS);

                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    return DS;
                }
            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("SelectRowDS{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, queryString));
                return null;
            }


        }
        public DataSet FormulaQuery(string ConnString, string queryString)
        {
            // Primaraly used for update Querys

            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                SqlCommand SqlCommand = new SqlCommand(queryString, connection);
                SqlCommand.CommandTimeout = 0;

                DataSet DS = new DataSet();
                SqlDataAdapter DA = new SqlDataAdapter(SqlCommand);
                DA.Fill(DS);

                if (SqlCommand.Connection.State == ConnectionState.Open)
                    SqlCommand.Connection.Close();
                if (connection.State == ConnectionState.Open)
                    connection.Close();
                return DS;
            }

        }

        public void SaveRecordDS(string ConnString, string queryString, DataSet DS)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand SqlCommand = new SqlCommand(queryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    SqlDataAdapter DA = new SqlDataAdapter(SqlCommand);
                    DA.Update(DS);

                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                }
            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("SaveRecordDS{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, queryString));
            }

        }
        public string AddNewRecord(string ConnString, string QueryString)
        {
            //long functionReturnValue = 0;
            string functionReturnValue = "";

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    QueryString += " SELECT SCOPE_IDENTITY() AS [SCOPE_IDENTITY]";
                    //This gets the new ID number

                    SqlCommand SqlCommand = new SqlCommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();

                    SqlDataReader DR = SqlCommand.ExecuteReader();

                    DR.Read();//MAT below
                    //functionReturnValue = DR.GetValue(0).ToString();
                    functionReturnValue = DR.GetValue(0).ToString();
                    
                    DR.Close();

                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                    return functionReturnValue;
                }

            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("AddNewRecord{0}{0}{1}{0}{0}{2}", Constants.vbCrLf, ex.Message, QueryString));
            }
            return functionReturnValue;

        }
        public long SAAddNewRecord(string ConnString, string QueryString)
        {
            long functionReturnValue = 0;

            try
            {

                using (SAConnection connection = new SAConnection(ConnString))
                {

                    QueryString += ";SELECT @@identity;";
                    //This gets the new ID number

                    SACommand SASqlCommand = new SACommand(QueryString, connection);
                    SASqlCommand.CommandTimeout = 0;

                    connection.Open();

                    SADataReader DR = SASqlCommand.ExecuteReader();

                    DR.Read();//MAT below. Added cast to long
                    functionReturnValue = (long)DR.GetValue(0);
                    DR.Close();

                    if (SASqlCommand.Connection.State == ConnectionState.Open)
                        SASqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                    return functionReturnValue;
                }
            }
            catch (Exception ex)
            {
                //MsgBox(ex.Message)
            }
            return functionReturnValue;

        }

        public void AddNewRecord(string ConnString, string QueryString, string newEntry)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {

                    SqlCommand SqlCommand = new SqlCommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();

                    SqlDataReader DR = SqlCommand.ExecuteReader();

                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                }
            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("AddNewRecord{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, QueryString));

            }
        }
        public long UpdateRecord(string ConnString, string QueryString)
        {
            long functionReturnValue = 0;


            try
            {
                functionReturnValue = 0;

                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand SqlCommand = new SqlCommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();

                    functionReturnValue = SqlCommand.ExecuteNonQuery();

                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                    return functionReturnValue;
                }

            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("UpdateRecord{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, QueryString));

            }
            return functionReturnValue;

        }
        public long DeleteRecord(string ConnString, string QueryString)
        {
            long functionReturnValue = 0;
            using (SqlConnection connection = new SqlConnection(ConnString))
            {
                SqlCommand SqlCommand = new SqlCommand(QueryString, connection);
                SqlCommand.CommandTimeout = 0;

                connection.Open();

                functionReturnValue = SqlCommand.ExecuteNonQuery();

                if (SqlCommand.Connection.State == ConnectionState.Open)
                    SqlCommand.Connection.Close();
                if (connection.State == ConnectionState.Open)
                    connection.Close();

                return functionReturnValue;
            }
            return functionReturnValue;
        }
        public decimal QueryScalar(string ConnString, string QueryString)
        {
            decimal functionReturnValue = default(decimal);
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)
            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {

                    functionReturnValue = 0;

                    SqlCommand SqlCommand = new SqlCommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();
                    if ((!object.ReferenceEquals(SqlCommand.ExecuteScalar(), System.DBNull.Value)))
                        //functionReturnValue = SqlCommand.ExecuteScalar();
                        //MAT
                        functionReturnValue = Convert.ToDecimal(SqlCommand.ExecuteScalar());

                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                    return functionReturnValue;
                }

            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("QueryScaler{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, QueryString));
            }
            return functionReturnValue;

        }
        public string QueryScalarString(string ConnString, string QueryString)
        {
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)

            try
            {
                using (SqlConnection connection = new SqlConnection(ConnString))
                {
                    SqlCommand SqlCommand = new SqlCommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();
                    // If Not SqlCommand.ExecuteScalar Is System.DBNull.Value Or SqlCommand.ExecuteScalar = Nothing Then QueryScalarString = SqlCommand.ExecuteScalar

                    object val = SqlCommand.ExecuteScalar();
                    if (Information.IsDBNull(val) | (val == null))
                    {
                        val = "";
                    }

                    if (connection.State == ConnectionState.Open)
                        connection.Close();
                    //MAT below. Cast long to string
                    return (string)val;
                }

            }
            catch (Exception ex)
            {
                Interaction.MsgBox(string.Format("QueryScaler{0}{0}(1){0}{0}{2}", Constants.vbCrLf, ex.Message, QueryString));
                //MAT. Added below so that all paths return a value
                return "Exception caught";
            }

        }
        public bool ColumnExists(string ConnString, string TableName, string ColumnName)
        {
            return false;

        }
        public DataSet ExcelData(string ConnString, string DataSource, string SelectData)
        {

            string ConnectionString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + DataSource + ";" + "Extended Properties=\"Excel 8.0;HDR=No;IMEX=1;\"";

            using (System.Data.OleDb.OleDbConnection ExcelConn = new System.Data.OleDb.OleDbConnection(ConnectionString))
            {
                ExcelConn.Open();

                System.Data.OleDb.OleDbDataAdapter DA = new System.Data.OleDb.OleDbDataAdapter(SelectData, ExcelConn);
                DataSet DS = new DataSet();
                DA.Fill(DS, "Temp");

                return DS;
            }

        }
        public DataSet GetXMLData(string ConnString, string DataSource, string SelectData)
        {
            DataSet functionReturnValue = default(DataSet);

            functionReturnValue = null;
            DataSet ds = new DataSet();
            // Load DataSet (with schema)
            //        ds.ReadXmlSchema("\Program Files\FeedbackAnyplace\feedback.xsd")
            ds.ReadXml("C:\\m&a\\Counties\\BillingConnection\\Gatekeeper Case Notes.xml");
            return ds;
            return functionReturnValue;

        }
        public long SADeleteRecord(string ConnString, string QueryString)
        {
            long functionReturnValue = 0;
            using (SAConnection connection = new SAConnection(ConnString))
            {
                SACommand SqlCommand = new SACommand(QueryString, connection);
                SqlCommand.CommandTimeout = 0;

                connection.Open();

                functionReturnValue = SqlCommand.ExecuteNonQuery();

                if (SqlCommand.Connection.State == ConnectionState.Open)
                    SqlCommand.Connection.Close();
                if (connection.State == ConnectionState.Open)
                    connection.Close();

                return functionReturnValue;
            }
            return functionReturnValue;
        }
        public decimal SAQueryScalar(string ConnString, string QueryString)
        {
            decimal functionReturnValue = default(decimal);
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)

            try
            {
                using (SAConnection connection = new SAConnection(ConnString))
                {

                    functionReturnValue = 0;

                    SACommand SqlCommand = new SACommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();
                    if ((!object.ReferenceEquals(SqlCommand.ExecuteScalar(), System.DBNull.Value)))
                        //functionReturnValue = SqlCommand.ExecuteScalar;
                        //MAT
                        functionReturnValue = Convert.ToDecimal(SqlCommand.ExecuteScalar());                     

                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                    return functionReturnValue;
                }
            }
            catch (Exception ex)
            {
                Interaction.MsgBox(ex.ToString());
            }
            return functionReturnValue;

        }
        public DataSet SASelectRowsDS(string ConnString, string queryString)
        {

            using (SAConnection connection = new SAConnection(ConnString))
            {
                SACommand SqlCommand = new SACommand(queryString, connection);
                SqlCommand.CommandTimeout = 0;

                DataSet DS = new DataSet();
                SADataAdapter DA = new SADataAdapter(SqlCommand);

                try
                {
                    DA.Fill(DS);
                    DS.Tables[0].PrimaryKey = new DataColumn[] { DS.Tables[0].Columns[0] };

                }
                catch (Exception ex)
                {
                }
                if (SqlCommand.Connection.State == ConnectionState.Open)
                    SqlCommand.Connection.Close();
                if (connection.State == ConnectionState.Open)
                    connection.Close();
                return DS;

            }
        }
        public string SAQueryScalarString(string ConnString, string QueryString)
        {
            string functionReturnValue = null;
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)
            using (SAConnection connection = new SAConnection(ConnString))
            {
                SACommand SqlCommand = new SACommand(QueryString, connection);
                SqlCommand.CommandTimeout = 0;

                functionReturnValue = "";

                connection.Open();
                if ((!object.ReferenceEquals(SqlCommand.ExecuteScalar(), System.DBNull.Value)))
                    //functionReturnValue = SqlCommand.ExecuteScalar;
                    //MAT
                    functionReturnValue = Convert.ToString(SqlCommand.ExecuteScalar());
                if (functionReturnValue == null)
                    functionReturnValue = "";

                if (connection.State == ConnectionState.Open)
                    connection.Close();

                return functionReturnValue;
            }
            return functionReturnValue;
        }
        public long SAUpdateRecord(string ConnString, string QueryString)
        {
            long functionReturnValue = 0;


            try
            {
                functionReturnValue = 0;

                using (SAConnection connection = new SAConnection(ConnString))
                {
                    SACommand SqlCommand = new SACommand(QueryString, connection);
                    SqlCommand.CommandTimeout = 0;

                    connection.Open();

                    functionReturnValue = SqlCommand.ExecuteNonQuery();

                    if (SqlCommand.Connection.State == ConnectionState.Open)
                        SqlCommand.Connection.Close();
                    if (connection.State == ConnectionState.Open)
                        connection.Close();

                    return functionReturnValue;
                }

            }
            catch (Exception ex)
            {
                Interaction.MsgBox(ex.Message.ToString() + Constants.vbCrLf + ex.Source + ex.StackTrace);

            }
            return functionReturnValue;

        }
        public string TestSAConnection(string ConnString)
        {
            string functionReturnValue = null;
            // Returns the first column of the first row in the results set (Used for Single value returns or counts)
            functionReturnValue = "";

            using (SAConnection connection = new SAConnection())
            {

                connection.ConnectionString = ConnString;
                connection.Open();
                if (connection.State == ConnectionState.Open)
                    connection.Close();

                //Dim SqlCommand As New SACommand()
                //SqlCommand.CommandTimeout = 0

                //SAQueryScalarString = ""

                //connection.Open()
                //If Not SqlCommand.ExecuteScalar Is System.DBNull.Value Then SAQueryScalarString = SqlCommand.ExecuteScalar



                //Return SAQueryScalarString()
            }
            return functionReturnValue;
        }

        //protected override void Finalize()
        //{
        //    //MAT. Commented out because it is called automatically
        //    //base.Finalize();
        //}

        private object SAQueryScalar()
        {
            throw new NotImplementedException();
        }

        //Added for web app

        private string mencryptionKey = "OpenThePodBayDoorsHal2001";
        public string Encrypt(string clearText)
        {
            byte[] clearBytes = System.Text.Encoding.Unicode.GetBytes(clearText);
            string EncryptedText = clearText;

            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(mencryptionKey, new byte[] {
			0x49,
			0x76,
			0x61,
			0x6e,
			0x20,
			0x4d,
			0x65,
			0x64,
			0x76,
			0x65,
			0x64,
			0x65,
			0x76
		});
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(clearBytes, 0, clearBytes.Length);
                        cs.Close();
                    }
                    EncryptedText = Convert.ToBase64String(ms.ToArray());
                }
            }

            return EncryptedText;

        }
        public string Decrypt(string cipherText)
        {
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new Rfc2898DeriveBytes(mencryptionKey, new byte[] {
			0x49,
			0x76,
			0x61,
			0x6e,
			0x20,
			0x4d,
			0x65,
			0x64,
			0x76,
			0x65,
			0x64,
			0x65,
			0x76
		});
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                    {
                        cs.Write(cipherBytes, 0, cipherBytes.Length);
                        cs.Close();
                    }
                    cipherText = System.Text.Encoding.Unicode.GetString(ms.ToArray());
                }
            }

            return cipherText;
        }

        //=======================================================
        //Service provided by Telerik (www.telerik.com)
        //Conversion powered by NRefactory.
        //Twitter: @telerik
        //Facebook: facebook.com/telerik
        //=======================================================

    }
}