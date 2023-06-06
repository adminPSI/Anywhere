using Anywhere.Log;
using OneSpanSign.Sdk;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Anywhere.service.Data.Employment
{
    public class EmploymentDataGetter
    {
        private static Loger logger = new Loger();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

        public string getEmploymentEntries(string token, string consumerIds, string employer, string position, string positionStartDate, string positionEndDate, string jobStanding, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getEmploymentEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[6];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employer", DbType.String, employer);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@position", DbType.String, position);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionStartDate", DbType.String, positionStartDate);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionEndDate", DbType.String, positionEndDate);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@jobStanding", DbType.String, jobStanding);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getEmploymentEntries(?, ?, ?, ?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getEmploymentEntries(" + consumerIds + ")");
                throw ex;
            }
        }

        public string getEmployers(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getEmployers");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getEmployers", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getEmployers()");
                throw ex;
            }
        }

        public string getPositions(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getPositions");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getPositions", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getPositions()");
                throw ex;
            }
        }

        public string getJobStandings(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getJobStandings");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getJobStandings", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getJobStandings()");
                throw ex;
            }
        }


    }
}