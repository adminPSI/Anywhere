using Anywhere.Log;
using OneSpanSign.Sdk;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using System.ServiceModel.Web;
using static Anywhere.service.Data.Employment.EmploymentWorker;
using static Anywhere.service.Data.AnywhereWorker;
using System.Management.Automation.Language;

namespace Anywhere.service.Data.Employment
{
    public class EmploymentDataGetter
    {
        private static Loger logger = new Loger();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();


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

        public string getEmployeeInfoByID(string token, string positionId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getEmployeeInfoByID");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionId", DbType.String, positionId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getEmployeeInfoByID(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getEmployeeInfoByID(" + positionId + ")");
                throw ex;
            }
        }

        public string insertEmploymentPath(string token, string employmentPath, string newStartDate, string newEndDate, string currentEndDate, string peopleID, string userID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertEmploymentPath");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[6];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employmentPath", DbType.String, employmentPath);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@newStartDate", DbType.String, newStartDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@newEndDate", DbType.String, newEndDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@currentEndDate", DbType.String, currentEndDate);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@peopleID", DbType.Double, peopleID);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userID", DbType.String, userID);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertEmploymentPath(?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertEmploymentPath(" + employmentPath + "," + newStartDate + "," + newEndDate + ")");
                throw ex;
            }

        }

        public string insertEmploymentInfo(string token, string startDatePosition, string endDatePosition, string position, string jobStanding, string employer, string transportation, string typeOfWork, string selfEmployed, string name, string phone, string email, string peopleID, string userID, string PositionId, DistributedTransaction transaction)
        {
            try
            {                
                logger.debug("ANYW_insertUpdateEmploymentInfo");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[14];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDatePosition", DbType.String, startDatePosition);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endDatePosition", DbType.String, endDatePosition);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@position", DbType.String, position);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@jobStanding", DbType.String, jobStanding);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employer", DbType.String, employer);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@transportation", DbType.String, transportation);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@typeOfWork", DbType.String, typeOfWork);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@selfEmployed", DbType.String, selfEmployed);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@name", DbType.String, name);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@phone", DbType.String, phone);
                args[10] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@email", DbType.String, email);
                args[11] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@peopleID", DbType.Double, peopleID);
                args[12] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userID", DbType.String, userID);
                args[13] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PositionId", DbType.String, PositionId);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertUpdateEmploymentInfo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertUpdateEmploymentInfo(" + startDatePosition + "," + position + "," + jobStanding + "," + employer + ")");
                throw ex;
            }
        }


        public string getWagesEntries(string token, string positionID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWagesEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionID", DbType.String, positionID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getWagesEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getWagesEntries(" + positionID + ")");
                throw ex;
            }
        }

        public string getJobStandingsDropDown(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getJobStandingsDropDown");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getJobStandingsDropDown", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getJobStandingsDropDown()");
                throw ex;
            }
        }

        public string getEmployerDropDown(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getEmployerDropDown");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getEmployerDropDown", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getEmployerDropDown()");
                throw ex;
            }
        }

        public string getPositionDropDown(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getPositionDropDown");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getPositionDropDown", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getPositionDropDown()");
                throw ex;
            }
        }

        public string getTransportationDropDown(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getTransportationDropDown");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getTransportationDropDown", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getTransportationDropDown()");
                throw ex;
            }
        }

        public string getTypeOfWorkDropDown(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getTypeOfWorkDropDown");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getTypeOfWorkDropDown", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getTypeOfWorkDropDown()");
                throw ex;
            }
        }

        public string insertWorkSchedule(string token, string dayOfWeek, string startTime, string endTime, string PositionId, string WorkScheduleID, string userID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertUpdateWorkSchedule");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[6];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@dayOfWeek", DbType.Double, dayOfWeek);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startTime", DbType.String, startTime);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endTime", DbType.String, endTime);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PositionId", DbType.Double, PositionId);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WorkScheduleID", DbType.Double, WorkScheduleID);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userID", DbType.String, userID);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertUpdateWorkSchedule(?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertUpdateWorkSchedule(" + dayOfWeek + "," + startTime + "," + endTime + ")");
                throw ex;
            }

        }

        public string getPositionTaskEntries(string token, string positionID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getPositionTaskEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionID", DbType.String, positionID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getPositionTaskEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getPositionTaskEntries(" + positionID + ")");
                throw ex;
            }
        }

        public string getInitialPerformanceDropdown(DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getInitialPerformanceDropdown");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getInitialPerformanceDropdown", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getInitialPerformanceDropdown()");
                throw ex;
            }
        }

        public string insertPositionTask(string token, string task, string description, string startDate, string endDate, string initialPerformance, string initialPerformanceNotes, string employeeStandard, string PositionId, string jobTaskID, string userID, DistributedTransaction transaction)
        {
            try
            {
                if (endDate == "")
                {
                    endDate = null;
                }
                logger.debug("insertUpdatePositionTask");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[10];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@task", DbType.String, task);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@description", DbType.String, description);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDate", DbType.String, startDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endDate", DbType.String, endDate);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@initialPerformance", DbType.String, initialPerformance);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@initialPerformanceNotes", DbType.String, initialPerformanceNotes);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employeeStandard", DbType.String, employeeStandard);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PositionId", DbType.String, PositionId);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@jobTaskID", DbType.String, jobTaskID);
                args[9] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userID", DbType.String, userID);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertUpdatePositionTask(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertUpdatePositionTask(" + task + "," + description + "," + startDate + ")");
                throw ex;
            }
        }

        public string getWorkScheduleEntries(string token, string positionID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWorkScheduleEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionID", DbType.String, positionID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getWorkScheduleEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getWorkScheduleEntries(" + positionID + ")");
                throw ex;
            }
        }

        public string isNewPositionEnable(string token, string consumerIds, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("isNewPositionEnable");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_isNewPositionEnable(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_isNewPositionEnable(" + consumerIds + ")");
                throw ex;
            }
        }

        public string getEmployeementPath(string token, string consumersId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("ANYW_getEmployeementPath");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumersId", DbType.String, consumersId);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getEmployeementPath(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getEmployeementPath(" + consumersId + ")");
                throw ex;
            }
        }

        public string saveCheckboxWages(string token, string chkboxName, string IsChacked, string PositionId, string textboxValue, string userID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("saveCheckboxWages");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[5];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@chkboxName", DbType.String, chkboxName);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@IsChacked", DbType.String, IsChacked);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PositionId", DbType.Double, PositionId);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@textboxValue", DbType.String, textboxValue);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userID", DbType.String, userID);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_saveCheckboxWages(?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_saveCheckboxWages(" + chkboxName + "," + PositionId + "," + userID + ")");
                throw ex;
            }

        }

        public string getWagesCheckboxEntries(string token, string positionID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getWagesCheckboxEntries");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionID", DbType.String, positionID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getWagesCheckboxEntries(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getWagesCheckboxEntries(" + positionID + ")");
                throw ex;
            }
        }

        public string insertWages(string token, string hoursWeek, string hoursWages, string startDate, string endDate, string PositionId, string wagesID, string userID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertWages");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[7];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hoursWeek", DbType.Double, hoursWeek);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hoursWages", DbType.Double, hoursWages);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDate", DbType.String, startDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endDate", DbType.String, endDate);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PositionId", DbType.Double, PositionId);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@wagesID", DbType.Double, wagesID);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userID", DbType.String, userID);
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_insertUpdateWages(?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_insertUpdateWages(" + hoursWeek + "," + startDate + "," + endDate + ")");
                throw ex;
            }

        }

        public string getLastTaskNumber(string token, string positionID, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getLastTaskNumber");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@positionID", DbType.String, positionID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_getLastTaskNumber(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_getLastTaskNumber(" + positionID + ")");
                throw ex;
            }
        }

        public string deleteWagesBenefits(string token, string wagesID, DistributedTransaction transaction)
        {           
            try
            {
                if (tokenValidator(token) == false) return null;
                logger.debug("deleteWagesBenefits");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@wagesID", DbType.String, wagesID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_deleteWagesBenefits(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_deleteWagesBenefits(" + wagesID + ")");
                throw ex;
            }

        }

        public string deleteWorkSchedule(string token, string WorkScheduleID, DistributedTransaction transaction)
        {
            try
            {
                if (tokenValidator(token) == false) return null;
                logger.debug("deleteWorkSchedule");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@WorkScheduleID", DbType.String, WorkScheduleID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_deleteWorkSchedule(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_deleteWorkSchedule(" + WorkScheduleID + ")");
                throw ex;
            }
        }

        public string deletePostionTask(string token, string jobTaskID,string PositionID, DistributedTransaction transaction)
        {
            try
            {
                if (tokenValidator(token) == false) return null;
                logger.debug("deletePostionTask");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@jobTaskID", DbType.String, jobTaskID);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@PositionID", DbType.String, PositionID);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_deletePostionTask(?,?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_deletePostionTask(" + jobTaskID + ")");
                throw ex;
            }
        }

        public string updatePositionTaskNumber(string token, string jobTaskID,int taskNumberToBeUpdated, DistributedTransaction transaction)
        {
            try
            {
                if (tokenValidator(token) == false) return null;
                logger.debug("updatePositionTaskNumber");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@jobTaskID", DbType.String, jobTaskID);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@taskNumber", DbType.String, taskNumberToBeUpdated);

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_updatePositionTaskNumber(?,?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_updatePositionTaskNumber(" + jobTaskID + "," + taskNumberToBeUpdated + ")");
                throw ex;
            }

        }

    }
}