using System;
using System.Configuration;
using System.Data;
using System.Data.Common;

public enum Providers : int
{
    Odbc = 1,
    OleDb = 2,
    SqlClient = 3,
    OracleClient = 4,
    MySql = 5,
    SqlAnywhere = 6
}

public partial class DbHelper
{
    private static Providers _factory = Providers.Odbc;
    private static string _connectionString = ConfigurationManager.ConnectionStrings["connection"].ToString();

    /// <summary>
    /// Get or Sets the Connection String
    /// </summary>
    /// <value></value>
    /// <returns>String</returns>
    /// <remarks></remarks>
    public static Providers Factory
    {
        get
        {
            return _factory;
        }

        set
        {
            _factory = value;
        }
    }

    /// <summary>
    /// Get or Sets the Connection String
    /// </summary>
    /// <value></value>
    /// <returns>String</returns>
    /// <remarks></remarks>
    public static string ConnectionString
    {
        get
        {
            if (_connectionString.ToUpper().IndexOf("UID") == -1)
            {
                _connectionString = _connectionString + "UID=anywhereuser;PWD=anywhere4u;";
            }
            return _connectionString;
        }

        set
        {
            _connectionString = value;
        }
    }

    /// <summary>
    /// Get Factory By Provider
    /// </summary>
    /// <param name="oGetFactory"></param>
    /// <returns></returns>
    /// <remarks></remarks>
    private static string GetFactoryByProvider(Providers oGetFactory)
    {
        var switchExpr = oGetFactory;
        switch (switchExpr)
        {
            case Providers.Odbc:
                {
                    return "System.Data.Odbc";
                }

            case Providers.OleDb:
                {
                    return "System.Data.OleDb";
                }

            case Providers.SqlClient:
                {
                    return "System.Data.SqlClient";
                }

            case Providers.OracleClient:
                {
                    return "System.Data.OracleClient";
                }

            case Providers.MySql:
                {
                    return "CorLab.MySql.MySqlClient";
                }

            case Providers.SqlAnywhere:
                {
                    return "iAnywhere.Data.SQLAnywhere";
                }
        }

        return "";
    }

    /// <summary>
    /// Returns a DbProviderFactory based on the private _factory member
    /// </summary>
    /// <returns>A DbProviderFactory object specific to the data provider specified internally in this class
    /// </returns>
    public static DbProviderFactory GetProviderFactory()
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        return oProviderFactory;
    }

    /// <summary>
    /// Creates a new instance of a System.Data.Commom.dbParameter object.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="type"></param>
    /// <param name="value"></param>
    /// <returns>A System.Data.Commom.dbParameter object</returns>
    /// <remarks></remarks>
    public static IDataParameter CreateParameter(string name, DbType type, object value)
    {
        return DbHelper.CreateParameter(name, type, value, System.Data.ParameterDirection.Input);
    }

    /// <summary>
    /// Creates a new instance of a System.Data.Commom.dbParameter object.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="type"></param>
    /// <param name="value"></param>
    /// <param name="direction"></param>
    /// <returns>A System.Data.Commom.dbParameter object</returns>
    /// <remarks></remarks>
    public static IDataParameter CreateParameter(string name, DbType type, object value, ParameterDirection direction)
    {
        DbParameter param = null;
        var oProviderFactory = GetProviderFactory();
        var Con = oProviderFactory.CreateConnection();
        var cmd = Con.CreateCommand();
        param = cmd.CreateParameter();
        if (!(param == null))
        {
            param.ParameterName = name;
            param.DbType = type;
            param.Direction = direction;
            param.Value = value;
        }

        return param;
    }

    /// <summary>
    /// Creates a new instance of a System.Data.Commom.dbParameter object.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="type"></param>
    /// <param name="value"></param>
    /// <returns>A System.Data.Commom.dbParameter object</returns>
    /// <remarks></remarks>
    public static IDataParameter CreateParameter(string name, DbType type, object value, ref DistributedTransaction transaction)
    {
        return DbHelper.CreateParameter(name, type, value, System.Data.ParameterDirection.Input, ref transaction);
    }

    /// <summary>
    /// Creates a new instance of a System.Data.Commom.dbParameter object.
    /// </summary>
    /// <param name="name"></param>
    /// <param name="type"></param>
    /// <param name="value"></param>
    /// <param name="direction"></param>
    /// <returns>A System.Data.Commom.dbParameter object</returns>
    /// <remarks></remarks>
    public static IDataParameter CreateParameter(string name, DbType type, object value, ParameterDirection direction, ref DistributedTransaction transaction)
    {
        if (transaction == null)
        {
            throw new ArgumentNullException("Transaction cannot be null");
        }

        DbParameter param = null;
        var Con = transaction.ProviderTransaction.Connection;
        var cmd = Con.CreateCommand();
        param = cmd.CreateParameter();
        if (!(param == null))
        {
            param.ParameterName = name;
            param.DbType = type;
            param.Direction = direction;
            param.Value = value;
        }

        return param;
    }

    /// <summary>
    /// Executes a Transact-SQL statement against the connection and returns the number of rows affected.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <returns></returns>
    /// <remarks>The number of rows affected.</remarks>
    public static int ExecuteNonQuery(CommandType cmdType, string cmdText, DistributedTransaction transaction)
    {
        DbParameter[] cmdParms = null;
        return ExecuteNonQuery(cmdType, cmdText, cmdParms);
    }

    /// <summary>
    /// Executes a Transact-SQL statement against the connection and returns the number of rows affected.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="cmdParms">Set Array of Parameter</param>
    /// <returns>The number of rows affected.</returns>
    /// <remarks></remarks>
    public static int ExecuteNonQuery(CommandType cmdType, string cmdText, DbParameter[] cmdParms)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        var Con = oProviderFactory.CreateConnection();
        var cmd = Con.CreateCommand();
        DbTransaction trans = null;
        try
        {
            Con.ConnectionString = ConnectionString;
            cmd.Connection = Con;
            cmd.CommandText = cmdText;
            cmd.Parameters.Clear();
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                foreach (DbParameter param in cmdParms)
                    cmd.Parameters.Add(param);
            }

            Con.Open();
            trans = Con.BeginTransaction();
            cmd.Transaction = trans;
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            trans.Commit();
            return val;
        }
        catch (DbException ex)
        {
            trans.Rollback();
            throw new Exception("DB Exception " + ex.Message);
        }
        catch (Exception exx)
        {
            trans.Rollback();
            throw new Exception("ExecuteNonQuery Function", exx);
        }
        finally
        {
            Con.Close();
            cmd = null;
            cmdParms = null;
        }
    }

    /// <summary>
    /// Executes a Transact-SQL statement against the connection and returns the number of rows affected.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns></returns>
    /// <remarks>The number of rows affected.</remarks>
    public static int ExecuteNonQuery(CommandType cmdType, string cmdText, ref DistributedTransaction transaction)
    {
        return ExecuteNonQuery(cmdType, cmdText, null, ref transaction);
    }

    /// <summary>
    /// Executes a Transact-SQL statement against the connection and returns the number of rows affected.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="cmdParms">Set Array of Parameter</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns>The number of rows affected.</returns>
    /// <remarks></remarks>
    public static int ExecuteNonQuery(CommandType cmdType, string cmdText, DbParameter[] cmdParms, ref DistributedTransaction transaction)
    {
        if (transaction == null)
        {
            throw new ArgumentNullException("Transaction cannot be null");
        }

        var Con = transaction.ProviderTransaction.Connection;
        var cmd = Con.CreateCommand();
        var trans = transaction.ProviderTransaction;
        try
        {
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            cmd.Transaction = trans;
            int val = cmd.ExecuteNonQuery();
            cmd.Parameters.Clear();
            return val;
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("DB Exception " + ex.Message);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("ExecuteNonQuery Function", exx);
        }
        finally
        {
            cmd = null;
            cmdParms = null;
        }
    }

    /// <summary>
    /// Executes the query, and returns the first column of the first row in the result set returned by the query.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <returns></returns>
    /// <remarks>The first column of the first row in the result set, or a null reference if the result set is empty.</remarks>
    public static object ExecuteScalar(CommandType cmdType, string cmdText)
    {
        DbParameter[] cmdParms = null;
        return ExecuteScalar(cmdType, cmdText, cmdParms);
    }

    /// <summary>
    /// Executes the query, and returns the first column of the first row in the result set returned by the query.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="cmdParms">Set Array of Parameter</param>
    /// <returns></returns>
    /// <remarks>The first column of the first row in the result set, or a null reference if the result set is empty.</remarks>
    public static object ExecuteScalar(CommandType cmdType, string cmdText, DbParameter[] cmdParms)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        var Con = oProviderFactory.CreateConnection();
        var cmd = Con.CreateCommand();
        DbTransaction trans = null;
        try
        {
            Con.ConnectionString = ConnectionString;
            cmd.Connection = Con;
            cmd.CommandText = cmdText;
            cmd.Parameters.Clear();
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                foreach (DbParameter param in cmdParms)
                    cmd.Parameters.Add(param);
            }

            Con.Open();
            trans = Con.BeginTransaction();
            cmd.Transaction = trans;
            var val = cmd.ExecuteScalar();
            cmd.Parameters.Clear();
            trans.Commit();
            return val;
        }
        catch (DbException ex)
        {
            trans.Rollback();
            throw new Exception("DB Exception " + ex.Message);
        }
        catch (Exception exx)
        {
            trans.Rollback();
            throw new Exception("ExecuteNonQuery Function", exx);
        }
        finally
        {
            Con.Close();
            cmd = null;
            cmdParms = null;
        }
    }

    /// <summary>
    /// Executes the query, and returns the first column of the first row in the result set returned by the query.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns></returns>
    /// <remarks>The first column of the first row in the result set, or a null reference if the result set is empty.</remarks>
    public static object ExecuteScalar(CommandType cmdType, string cmdText, ref DistributedTransaction transaction)
    {
        if (transaction == null)
        {
            throw new ArgumentNullException("Transaction cannot be null");
        }

        return ExecuteScalar(cmdType, cmdText, null, ref transaction);
    }

    /// <summary>
    /// Executes the query, and returns the first column of the first row in the result set returned by the query.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="cmdParms">Set Array of Parameter</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns></returns>
    /// <remarks>The first column of the first row in the result set, or a null reference if the result set is empty.</remarks>
    public static object ExecuteScalar(CommandType cmdType, string cmdText, DbParameter[] cmdParms, ref DistributedTransaction transaction)
    {
        if (transaction == null)
        {
            throw new ArgumentNullException("Transaction cannot be null");
        }

        var Con = transaction.ProviderTransaction.Connection;
        var cmd = Con.CreateCommand();
        var trans = transaction.ProviderTransaction;
        try
        {
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            cmd.Transaction = trans;
            var val = cmd.ExecuteScalar();
            cmd.Parameters.Clear();
            return val;
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("DB Exception " + ex.Message);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("ExecuteNonQuery Function", exx);
        }
        finally
        {
            cmd = null;
            cmdParms = null;
        }
    }

    /// <summary>
    /// ExecuteTable Return DataTable
    /// </summary>
    /// <param name="cmdType">The command Type</param>
    /// <param name="cmdText">The command text to execute</param>
    /// <returns>DataTable</returns>
    /// <remarks></remarks>
    public static DataTable ExecuteTable(CommandType cmdType, string cmdText)
    {
        DbParameter[] cmdParms = null;
        return ExecuteTable(cmdType, cmdText, cmdParms);
    }

    /// <summary>
    /// ExecuteTable Return DataTable
    /// </summary>
    /// <param name="cmdType">The command Type</param>
    /// <param name="cmdText">The command text to execute</param>
    /// <param name="cmdParms">Array of Parameters</param>
    /// <returns>DataTable</returns>
    /// <remarks></remarks>
    public static DataTable ExecuteTable(CommandType cmdType, string cmdText, DbParameter[] cmdParms)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        DbDataAdapter oDataAdapter;
        var Con = oProviderFactory.CreateConnection();
        DbCommand cmd;
        try
        {
            Con.ConnectionString = ConnectionString;
            cmd = Con.CreateCommand();
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            Con.Open();
            oDataAdapter = oProviderFactory.CreateDataAdapter();
            var oDataTable = new DataTable();
            oDataAdapter.SelectCommand = cmd;
            oDataAdapter.Fill(oDataTable);
            cmd.Parameters.Clear();
            return oDataTable;
        }
        catch (DbException ex)
        {
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            throw new Exception("ExecuteTable Exception :", exx);
        }
        finally
        {
            Con.Close();
            cmd = null;
            oDataAdapter = null;
        }
    }

    /// <summary>
    /// ExecuteTable Return DataTable
    /// </summary>
    /// <param name="cmdType">The command Type</param>
    /// <param name="cmdText">The command text to execute</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns>DataTable</returns>
    /// <remarks></remarks>
    public static DataTable ExecuteTable(CommandType cmdType, string cmdText, ref DistributedTransaction transaction)
    {
        return ExecuteTable(cmdType, cmdText, null, ref transaction);
    }

    /// <summary>
    /// ExecuteTable Return DataTable
    /// </summary>
    /// <param name="cmdType">The command Type</param>
    /// <param name="cmdText">The command text to execute</param>
    /// <param name="cmdParms">Array of Parameters</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns>DataTable</returns>
    /// <remarks></remarks>
    public static DataTable ExecuteTable(CommandType cmdType, string cmdText, DbParameter[] cmdParms, ref DistributedTransaction transaction)
    {
        if (transaction == null)
        {
            throw new ArgumentNullException("Transaction cannot be null");
        }

        var oProviderFactory = GetProviderFactory();
        DbDataAdapter oDataAdapter;
        var Con = transaction.ProviderTransaction.Connection;
        var cmd = Con.CreateCommand();
        try
        {
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            cmd.Transaction = transaction.ProviderTransaction;
            oDataAdapter = oProviderFactory.CreateDataAdapter();
            var oDataTable = new DataTable();
            oDataAdapter.SelectCommand = cmd;
            oDataAdapter.Fill(oDataTable);
            cmd.Parameters.Clear();
            return oDataTable;
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("ExecuteTable Exception :", exx);
        }
        finally
        {
            cmd = null;
            oDataAdapter = null;
        }
    }

    /// <summary>
    /// <para>Executes the <paramref name="commandText"/> as part of the given <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/>.</para>
    /// </summary>
    /// <param name="cmdType"></param>
    /// <param name="cmdText">The command text to execute.</param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static DataSet ExecuteDataSet(CommandType cmdType, string cmdText)
    {
        DbParameter[] cmdParms = null;
        return ExecuteDataSet(cmdType, cmdText, cmdParms);
    }

    /// <summary>
    /// <para>Executes the <paramref name="commandText"/> as part of the given <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/>.</para>
    /// </summary>
    /// <param name="cmdType">One of the <see cref="CommandType"/> values.</param>
    /// <param name="cmdText">The command text to execute.</param>
    /// <param name="cmdParms"></param>
    /// <returns>DataSet</returns>
    /// <remarks></remarks>
    public static DataSet ExecuteDataSet(CommandType cmdType, string cmdText, DbParameter[] cmdParms)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        var con = oProviderFactory.CreateConnection();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        var cmd = con.CreateCommand();
        try
        {
            con.ConnectionString = ConnectionString;
            cmd = con.CreateCommand();
            PrepareCommand(ref cmd, ref con, ref cmdType, ref cmdText, ref cmdParms);
            con.Open();
            oDataAdapter = oProviderFactory.CreateDataAdapter();
            var oDataSet = new DataSet();
            oDataAdapter.SelectCommand = cmd;
            oDataAdapter.Fill(oDataSet);
            cmd.Parameters.Clear();
            return oDataSet;
        }
        catch (DbException ex)
        {
            throw new Exception("SQL Exception ", ex);
        }
        catch (Exception exx)
        {
            throw new Exception("Execute DataSet", exx);
        }
        finally
        {
            con.Close();
            cmd = null;
            oDataAdapter = null;
        }
    }

    /// <summary>
    /// <para>Executes the <paramref name="commandText"/> as part of the given <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/>.</para>
    /// </summary>
    /// <param name="cmdType"></param>
    /// <param name="cmdText">The command text to execute.</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static DataSet ExecuteDataSet(CommandType cmdType, string cmdText, ref DistributedTransaction transaction)
    {
        return ExecuteDataSet(cmdType, cmdText, null, ref transaction);
    }

    /// <summary>
    /// <para>Executes the <paramref name="commandText"/> as part of the given <paramref name="transaction" /> and returns the results in a new <see cref="DataSet"/>.</para>
    /// </summary>
    /// <param name="cmdType">One of the <see cref="CommandType"/> values.</param>
    /// <param name="cmdText">The command text to execute.</param>
    /// <param name="cmdParms"></param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns>DataSet</returns>
    /// <remarks></remarks>
    public static DataSet ExecuteDataSet(CommandType cmdType, string cmdText, DbParameter[] cmdParms, ref DistributedTransaction transaction)
    {
        if (transaction == null)
        {
            throw new ArgumentNullException("Transaction cannot be null");
        }

        var oProviderFactory = GetProviderFactory();
        DbDataAdapter oDataAdapter;
        var Con = transaction.ProviderTransaction.Connection;
        var cmd = Con.CreateCommand();
        try
        {
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            cmd.Transaction = transaction.ProviderTransaction;
            oDataAdapter = oProviderFactory.CreateDataAdapter();
            var oDataSet = new DataSet();
            oDataAdapter.SelectCommand = cmd;
            oDataAdapter.Fill(oDataSet);
            cmd.Parameters.Clear();
            return oDataSet;
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("SQL Exception ", ex);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("Execute DataSet", exx);
        }
        finally
        {
            cmd = null;
            oDataAdapter = null;
        }
    }

    /// <summary>
    /// Sends the System.Data.Common.DbCommand.CommandText to the System.Data.Common.DbCommand.Connection and builds a System.Data.Common.DbDataReader.
    /// </summary>
    /// <param name="conn">A System.Data.Common.DbConnection that represents the connection to an instance of DataSource.</param>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <returns>A System.Data.Common.DbDataReader object.</returns>
    /// <remarks></remarks>
    public static DbDataReader ExecuteReader(ref DbConnection conn, CommandType cmdType, string cmdText)
    {
        DbParameter[] cmdParms = null;
        return ExecuteReader(ref conn, cmdType, cmdText, cmdParms);
    }

    /// <summary>
    /// Sends the System.Data.Common.DbCommand.CommandText to the System.Data.Common.DbCommand.Connection and builds a System.Data.Common.DbDataReader.
    /// </summary>
    /// <param name="conn">A System.Data.Common.DbConnection that represents the connection to an instance of DataSource.</param>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="cmdParms">Set Array of Parameter</param>
    /// <returns>A System.Data.Common.DbDataReader object.</returns>
    /// <remarks></remarks>
    public static DbDataReader ExecuteReader(ref DbConnection conn, CommandType cmdType, string cmdText, DbParameter[] cmdParms)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        conn = oProviderFactory.CreateConnection();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        var cmd = conn.CreateCommand();
        DbDataReader rdr;
        try
        {
            PrepareCommand(ref cmd, ref conn, ref cmdType, ref cmdText, ref cmdParms);
            conn.Open();
            rdr = cmd.ExecuteReader();
            cmd.Parameters.Clear();
            if (cmdParms != null)
            {
                foreach (DbParameter param in cmdParms)
                    cmd.Parameters.Add(param);
            }

            return rdr;
        }
        catch (DbException ex)
        {
            throw new Exception("SQL Exception ", ex);
        }
        catch (Exception exx)
        {
            throw new Exception("ExecuteReader", exx);
        }
        finally
        {
            cmd = null;
        }
    }

    /// <summary>
    /// Sends the System.Data.Common.DbCommand.CommandText to the System.Data.Common.DbCommand.Connection and builds a System.Data.Common.DbDataReader.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns>A System.Data.Common.DbDataReader object.</returns>
    /// <remarks></remarks>
    public static DbDataReader ExecuteReader(CommandType cmdType, string cmdText, ref DistributedTransaction transaction)
    {
        return ExecuteReader(cmdType, cmdText, null, ref transaction);
    }

    /// <summary>
    /// Sends the System.Data.Common.DbCommand.CommandText to the System.Data.Common.DbCommand.Connection and builds a System.Data.Common.DbDataReader.
    /// </summary>
    /// <param name="cmdType">Set the Transact-SQL statement or stored procedure to execute at the data source.</param>
    /// <param name="cmdText">The text of the query.</param>
    /// <param name="cmdParms">Set Array of Parameter</param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns>A System.Data.Common.DbDataReader object.</returns>
    /// <remarks></remarks>
    public static DbDataReader ExecuteReader(CommandType cmdType, string cmdText, DbParameter[] cmdParms, ref DistributedTransaction transaction)
    {
        var oProviderFactory = GetProviderFactory();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        var conn = transaction.ProviderTransaction.Connection;
        var cmd = conn.CreateCommand();
        DbDataReader rdr;
        try
        {
            PrepareCommand(ref cmd, ref conn, ref cmdType, ref cmdText, ref cmdParms);
            cmd.Transaction = transaction.ProviderTransaction;
            rdr = cmd.ExecuteReader();
            cmd.Parameters.Clear();
            if (cmdParms != null)
            {
                foreach (DbParameter param in cmdParms)
                    cmd.Parameters.Add(param);
            }

            return rdr;
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("SQL Exception ", ex);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("ExecuteReader", exx);
        }
        finally
        {
            cmd = null;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="cmdType"></param>
    /// <param name="cmdText"></param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static DataRow ExecuteRow(CommandType cmdType, string cmdText)
    {
        DbParameter[] cmdParms = null;
        return ExecuteRow(cmdType, cmdText, cmdParms);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="cmdType"></param>
    /// <param name="cmdText"></param>
    /// <param name="cmdParms"></param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static DataRow ExecuteRow(CommandType cmdType, string cmdText, DbParameter[] cmdParms)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        var Con = oProviderFactory.CreateConnection();
        Con.ConnectionString = ConnectionString;
        var cmd = Con.CreateCommand();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        DataRow oDataRow = null;
        var oDataTable = new DataTable();
        try
        {
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            Con.Open();
            oDataAdapter.SelectCommand = cmd;
            oDataAdapter.Fill(oDataTable);
            cmd.Parameters.Clear();
            if (oDataTable.Rows.Count == 0)
            {
                return null;
            }
            else
            {
                var oRow = oDataTable.Rows[0];
                return oRow;
            }
        }
        catch (DbException ex)
        {
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            throw new Exception("ExecuteRow", exx);
        }
        finally
        {
            Con.Close();
            oDataTable = null;
            cmd = null;
            oDataAdapter = null;
        }
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="cmdType"></param>
    /// <param name="cmdText"></param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static DataRow ExecuteRow(CommandType cmdType, string cmdText, ref DistributedTransaction transaction)
    {
        return ExecuteRow(cmdType, cmdText, null, ref transaction);
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="cmdType"></param>
    /// <param name="cmdText"></param>
    /// <param name="cmdParms"></param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static DataRow ExecuteRow(CommandType cmdType, string cmdText, DbParameter[] cmdParms, ref DistributedTransaction transaction)
    {
        var oProviderFactory = GetProviderFactory();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        var Con = transaction.ProviderTransaction.Connection;
        var cmd = Con.CreateCommand();
        DataRow oDataRow = null;
        var oDataTable = new DataTable();
        try
        {
            PrepareCommand(ref cmd, ref Con, ref cmdType, ref cmdText, ref cmdParms);
            cmd.Transaction = transaction.ProviderTransaction;
            oDataAdapter.SelectCommand = cmd;
            oDataAdapter.Fill(oDataTable);
            cmd.Parameters.Clear();
            if (oDataTable.Rows.Count == 0)
            {
                return null;
            }
            else
            {
                var oRow = oDataTable.Rows[0];
                return oRow;
            }
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("ExecuteRow", exx);
        }
        finally
        {
            oDataTable = null;
            cmd = null;
            oDataAdapter = null;
        }
    }

    /// <summary>
    /// Excute Adapter
    /// </summary>
    /// <param name="oTable"></param>
    /// <param name="cmdText"></param>
    /// <param name="lngMaxID"></param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static bool ExecuteAdapter(DataTable oTable, string cmdText, ref long lngMaxID)
    {
        var oProviderFactory = DbProviderFactories.GetFactory(GetFactoryByProvider(_factory));
        var conn = oProviderFactory.CreateConnection();
        conn.ConnectionString = ConnectionString;
        var oSqlCmd = conn.CreateCommand();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        var oCmdBuilder = oProviderFactory.CreateCommandBuilder();
        DbTransaction trans = null;
        try
        {
            if (!(conn.State == System.Data.ConnectionState.Open))
            {
                conn.Open();
            }

            trans = conn.BeginTransaction();
            oSqlCmd.Transaction = trans;
            oSqlCmd.Connection = conn;
            oSqlCmd.CommandText = cmdText;
            oSqlCmd.CommandType = System.Data.CommandType.Text;
            oDataAdapter.SelectCommand = oSqlCmd;
            oCmdBuilder.DataAdapter = oDataAdapter;
            oCmdBuilder.GetUpdateCommand();
            oCmdBuilder.GetInsertCommand();
            oCmdBuilder.GetDeleteCommand();
            oDataAdapter.Update(oTable);
            oDataAdapter.SelectCommand.CommandText = "SELECT @@IDENTITY";
            trans.Commit();

            // lngMaxID = CType(oDataAdapter.SelectCommand.ExecuteScalar(), Long)
            return true;
        }
        catch (DbException ex)
        {
            trans.Rollback();
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            trans.Rollback();
            throw new Exception("ExeculateAdapter", exx);
        }
        finally
        {
            if (conn.State == System.Data.ConnectionState.Open)
                conn.Close();
            oSqlCmd = null;
            oDataAdapter = null;
            oCmdBuilder = null;
        }
    }

    /// <summary>
    /// Excute Adapter
    /// </summary>
    /// <param name="oTable"></param>
    /// <param name="cmdText"></param>
    /// <param name="transaction">An instantiated distributed transaction</param>
    /// <remarks></remarks>
    public static bool ExecuteAdapter(DataTable oTable, string cmdText, ref DistributedTransaction transaction)
    {
        var oProviderFactory = GetProviderFactory();
        var oDataAdapter = oProviderFactory.CreateDataAdapter();
        var Con = transaction.ProviderTransaction.Connection;
        var oSqlCmd = Con.CreateCommand();
        var trans = transaction.ProviderTransaction;
        var oCmdBuilder = oProviderFactory.CreateCommandBuilder();
        try
        {
            oSqlCmd.Transaction = trans;
            oSqlCmd.Connection = Con;
            oSqlCmd.CommandText = cmdText;
            oSqlCmd.CommandType = System.Data.CommandType.Text;
            oDataAdapter.SelectCommand = oSqlCmd;
            oCmdBuilder.DataAdapter = oDataAdapter;
            oCmdBuilder.GetUpdateCommand();
            oCmdBuilder.GetInsertCommand();
            oCmdBuilder.GetDeleteCommand();
            oDataAdapter.Update(oTable);
            oDataAdapter.SelectCommand.CommandText = "SELECT @@IDENTITY";
            return true;
        }
        catch (DbException ex)
        {
            transaction.DisableCommit();
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            transaction.DisableCommit();
            throw new Exception("ExeculateAdapter", exx);
        }
        finally
        {
            oSqlCmd = null;
            oDataAdapter = null;
            oCmdBuilder = null;
        }
    }

    /// <summary>
    /// Prepare Command
    /// </summary>
    /// <param name="cmd">Assigns a <paramref name="connection"/> to the <paramref name="command"/> and discovers parameters if needed.</param>
    /// <param name="conn">The connection to assign to the command.</param>
    /// <param name="cmdType">The command that contains the query to prepare.</param>
    /// <param name="cmdText"></param>
    /// <param name="cmdParms"></param>
    /// <returns></returns>
    /// <remarks></remarks>
    public static bool PrepareCommand(ref DbCommand cmd, ref DbConnection conn, ref CommandType cmdType, ref string cmdText, ref DbParameter[] cmdParms)
    {
        try
        {
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            cmd.Parameters.Clear();
            cmd.CommandType = cmdType;
            if (cmdParms != null)
            {
                foreach (DbParameter param in cmdParms)
                    cmd.Parameters.Add(param);
            }

            return true;
        }
        catch (DbException ex)
        {
            throw new Exception("DB Exception ", ex);
        }
        catch (Exception exx)
        {
            throw new Exception("PrepareCommand : ", exx);
        }
    }
}

public partial class DistributedTransaction : IDisposable
{
    private DbTransaction _transaction = null;
    private DbConnection _connection;
    private bool _disposedValue = false;        // To detect redundant calls
    private bool _done = false;
    private bool _enabled = true;

    public DistributedTransaction(string connString)
    {
        try
        {
            DbProviderFactory providerFactory;
            providerFactory = DbHelper.GetProviderFactory();
            _connection = providerFactory.CreateConnection();
            _connection.ConnectionString = connString;

            // Opens the connection
            try
            {
                _connection.Open();
            }
            catch (Exception ex)
            {
                // Throw exception with incorrect connString
                throw new ApplicationException("Unable to open connection." + ex.Message);
            }

            // Starts the transaction
            _transaction = _connection.BeginTransaction();
        }
        catch (Exception ex)
        {

            // Try to close the connection if it is open
            try
            {
                _connection.Close();
            }
            catch (Exception ex2)
            {
            }

            throw;
        }
    }

    public DbTransaction ProviderTransaction
    {
        get
        {
            // Check that the object has not been disposed
            if (_disposedValue)
            {
                throw new ObjectDisposedException("Transaction");
            }

            // If object's lifetime has expired, caller cannot access the transaction
            if (_done)
            {
                throw new InvalidOperationException("Transaction has been closed and can no longer be used");
            }

            // Returns the transaction object internally referenced
            return _transaction;
        }
    }

    public void DisableCommit()
    {
        // Checks that the object has not been disposed
        if (_disposedValue)
        {
            throw new ObjectDisposedException("Transaction");
        }

        _enabled = false;
    }

    public void Commit()
    {


        // Checks that the object has not been disposed
        if (_disposedValue)
        {
            throw new ObjectDisposedException("Transaction");
        }

        // Checks that a commit or rollback has not been executed
        if (_done)
        {
            throw new InvalidOperationException("Transaction has already been commited/rolled back");
        }

        // Checks that we are enabled and therefore can commit the transaction
        if (!_enabled)
        {
            throw new InvalidOperationException("Transaction has commit disabled and cannot be commited.");
        }

        try
        {
            // Commits the transaction
            _transaction.Commit();
        }
        catch (Exception ex)
        {
            throw;
        }
        finally
        {
            // Update status because object's lifetime has expired
            _done = true;

            // Always close underlying database connection 
            if (!(_transaction.Connection == null))
            {
                if (_transaction.Connection.State == System.Data.ConnectionState.Open)
                {
                    _transaction.Connection.Close();
                }

                _transaction.Connection.Dispose();
            }

            // Disposed transaction is no longer useful
            _transaction.Dispose();
        }
    }

    public void Rollback()
    {
        // Checks that the object has not been disposed
        if (_disposedValue)
        {
            throw new ObjectDisposedException("Transaction");
        }

        // Checks that a commit or rollback has not been executed
        if (_done)
        {
            throw new InvalidOperationException("Transaction has already been commited/rolled back");
        }

        try
        {
            // Rolls back the transaction
            _transaction.Rollback();
            // Updates status to disabled
            _enabled = false;
        }
        catch (Exception ex)
        {
            throw;
        }
        finally
        {
            // Update status because object's lifetime has expired
            _done = true;

            // Always close underlying database connection 
            if (!(_transaction.Connection == null))
            {
                if (_transaction.Connection.State == System.Data.ConnectionState.Open)
                {
                    _transaction.Connection.Close();
                }

                _transaction.Connection.Dispose();
            }

            // Disposed transaction is no longer useful
            _transaction.Dispose();
        }
    }

    // IDisposable
    protected virtual void Dispose(bool disposing)
    {
        if (_disposedValue)
            return;
        if (disposing)
        {

            // Avoid runtime error when disposing (connction broken, etc.)
            try
            {
                // If transaction has not been committed or rolled back we need to close it
                if (!_done)
                {
                    // Commits if the object is enabled, otherwise rolls back
                    if (_enabled)
                    {
                        _transaction.Commit();
                    }
                    else
                    {
                        _transaction.Rollback();
                    }
                }
            }
            catch (Exception ex)
            {
            }

            try
            {
                // Important: closes and releases reference to transaction 
                _connection.Close();
                _connection.Dispose();
                _transaction.Dispose();
            }
            catch (Exception ex)
            {
                new Exception("Error closing transaction's resources: " + ex.Message);
            }
        }

        _disposedValue = true;
    }

    public void Dispose()
    {
        // Dispose of unmanaged resources.
        Dispose(true);
        // Suppress finalization.
        GC.SuppressFinalize(this);
    }
}