using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web.Security;

namespace Anywhere.service.Data
{
    public class OODDataGetter
    {
        private static Loger logger = new Loger();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        Anywhere.Data.DataGetter dg = new Anywhere.Data.DataGetter();

        //data for OOD Entries Listing on OOD Module Landing Page
        public string getOODEntries(string consumerIds, string serviceStartDate, string serviceEndDate, string userId, string serviceCode, string referenceNumber, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("getOODEntries ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[6];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceStartDate", DbType.String, serviceStartDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceEndDate", DbType.String, serviceEndDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceCode", DbType.String, serviceCode);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@referenceNumber", DbType.String, referenceNumber);

                // returns the workflow document descriptions for the given workflowId
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getOODEntries(?, ?, ?, ?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_WF_getOODEntries(" + consumerIds + ")");
                throw ex;
            }
        }
        // Active Employee data for OOD Entries Listing Filter
        public string getActiveEmployees(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getOODActiveEmployees ");
                //System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                //args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                //args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getActiveEmployees()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_OOD_getOODActiveEmployees()");
                throw ex;
            }
        }
        //  Form 4 Monthly Placement -- get selected consumer's Employers
        public string getConsumerEmployers(string consumerId, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getConsumerEmployers ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                //args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getConsumerEmployers(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ODG", ex.Message + "ANYW_OOD_getConsumerEmployers()");
                throw ex;
            }
        }

        // Active Employer data for OOD Employers Listing
        public string getActiveEmployers(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getOODActiveEmployers ");
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getActiveEmployers()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_OOD_getOODActiveEmployers()");
                throw ex;
            }
        }

        public string deleteEmployer(string employerId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("employerId ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employerId", DbType.String, employerId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_deleteEmployer(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("FDG", ex.Message + "ANYW_OOD_deleteEmployer(" + employerId + ")");
                throw ex;
            }
        }

        public string insertEmployer(string employerName, string address1, string address2, string city, string state, string zipcode, string userId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("insertEmployer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[7];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employerName", DbType.String, employerName);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@address1", DbType.String, address1);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@address2", DbType.String, address2);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@city", DbType.String, city);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@state", DbType.String, state);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@zipcode", DbType.String, zipcode);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);

                // returns the employerId  that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_insertEmployer(?, ?, ?, ?, ?, ?, ?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_OOD_insertEmployer(" + employerName + "," + address1 + "," + city + ")");
                throw ex;
            }
        }

        public string UpdateEmployer(string token, string employerId, string employerName, string address1, string address2, string city, string state, string zipcode, string userId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("UpdateEmployer ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[9];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employerId", DbType.String, employerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@employerName", DbType.String, employerName);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@address1", DbType.String, address1);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@address2", DbType.String, address2);
                args[4] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@city", DbType.String, city);
                args[5] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@state", DbType.String, state);
                args[6] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@zipcode", DbType.String, zipcode);
                args[7] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@userId", DbType.String, userId);
                args[8] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                // returns the documentId of the document that was just inserted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_UpdateEmployer(?,?,?,?,?,?,?,?,?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_Forms_UpdateEmployer(" + employerId + ")");
                throw ex;
            }
        }

        public string getEmployerJSON(string token, string employerId)
        {
            if (tokenValidator(token) == false) return null;

            logger.debug("getEmployer" + token);
            try
            {
                return dg.executeDataBaseCallJSON("CALL DBA.ANYW_OOD_getEmployer('" + token + "', '" + employerId + "');");
            }
            catch (Exception ex)
            {
                logger.error("538", ex.Message + " ANYW_OOD_getEmployer('" + token + "', '" + employerId + "')");
                return "538: Error getting employer to edit";
            }
        }

        // Active Service Codes data for OOD Entries Listing Filter
        public string getActiveServiceCodes(DistributedTransaction transaction, string serviceCodeType)
        {

            try
            {
                logger.debug("getActiveServiceCodes ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceCodeType", DbType.String, serviceCodeType);
                //args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getActiveServiceCodes(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_OOD_getActiveServiceCodes()");
                throw ex;
            }
        }

        // Reference Numbers for the selected Consumers data for OOD Entries Listing Filter
        public string getConsumerReferenceNumbers(string consumerIds, string startDate, string endDate, string serviceType, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getConsumerReferenceNumbers ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[4];
                //args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@token", DbType.String, token);
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerIds", DbType.String, consumerIds);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@startDate", DbType.String, startDate);
                args[2] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@endDate", DbType.String, endDate);
                args[3] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceType", DbType.String, serviceType);
                //args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getConsumerReferenceNumbers(?, ?, ?, ?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("WFDG", ex.Message + "ANYW_OOD_getConsumerReferenceNumbers()");
                throw ex;
            }
        }


        // Consumer Service Codes data for OOD Services Popup
        public string getConsumerServiceCodes(string consumerId, string serviceDate, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getConsumerServiceCodes ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[2];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@serviceDate", DbType.String, serviceDate);
                //args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getConsumerServiceCodes(?,?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("ODG", ex.Message + "ANYW_OOD_getConsumerServiceCodes()");
                throw ex;
            }
        }

        //  Form 4 Monthly Placement -- Contact Types data for OOD 
        public string getContactTypes(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getContactTypes ");

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getContactTypes()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("OODDG", ex.Message + "ANYW_OOD_getContactTypes");
                throw ex;
            }
        }

        //  Form 4 Monthly Placement -- Outcomess data for OOD 
        public string getOutcomes(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getOutcomes ");

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getOutcomes()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("OODDG", ex.Message + "ANYW_OOD_getOutcomes");
                throw ex;
            }
        }
        //  Form 8 Community Based Assessment Form -- Contact Methods data for DDL
        public string getContactMethods(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getContactMethods ");

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getContactMethods()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("OODDG", ex.Message + "ANYW_OOD_getContactMethods");
                throw ex;
            }
        }

        //  Form 8 Community Based Assessment Form -- Indicatorss data for DDLs
        public string getIndicators(DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getIndicators ");

                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getIndicators()", ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("OODDG", ex.Message + "ANYW_OOD_getIndicators");
                throw ex;
            }
        }

        //  Form 8 Community Based Assessment Form -- Positions data for DDL
        public string getOODPositions(string consumerId, DistributedTransaction transaction)
        {

            try
            {
                logger.debug("getOODPositions ");
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@consumerId", DbType.String, consumerId);
                //args[1] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@hasAssignedFormTypes", DbType.String, hasAssignedFormTypes);
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_getPositions(?)", args, ref transaction);
                return wfdg.convertToJSON(returnMsg);

            }
            catch (Exception ex)
            {
                logger.error("OODDG", ex.Message + "ANYW_OOD_getPositions");
                throw ex;
            }
        }
        // Form 4 Monthly Placement -- edit data
        public string getForm4MonthlyPlacementEditDataJSON(string token, string caseNoteId)
        {
            if (tokenValidator(token) == false) return null;

            logger.debug("getForm4MonthlyPlacementEditData" + token);
            try
            {
                return dg.executeDataBaseCallJSON("CALL DBA.ANYW_OOD_getForm4MonthlyPlacementEditData('" + token + "', '" + caseNoteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("537", ex.Message + " ANYW_OOD_getForm4MonthlyPlacementEditData('" + token + "', '" + caseNoteId + "')");
                return "537: Error getting case note to edit";
            }
        }

        public string updateForm4MonthlyPlacementEditData(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string employer, string contactType, string jobSeekerPresent, string outcome, string TSCNotified, string bilingualSupplement, string notes, string userId, string application, string interview)
        {
            if (tokenValidator(token) == false) return null;
            //if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("updateForm4MonthlyPlacementEditData" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(caseNoteId);
            list.Add(serviceDate);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(SAMLevel);
            list.Add(employer);
            list.Add(contactType);
            list.Add(jobSeekerPresent);
            list.Add(outcome);
            list.Add(TSCNotified);
            list.Add(bilingualSupplement);
            list.Add(notes);
            list.Add(userId);
            list.Add(application);
            list.Add(interview);
            string text = "CALL DBA.ANYW_OOD_updateForm4MonthlyPlacementEditData(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";

            try
            {
                //return dg.executeDataBaseCall("CALL DBA.ANYW_OOD_updateForm4MonthlyPlacementEditData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + userId +  "');", "results", "results");
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_OOD_updateForm4MonthlyPlacementEditData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + userId + "')");
                return "536: Error saving case note";
            }
        }

        public string insertForm4MonthlyPlacementEditData(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string employer, string contactType, string jobSeekerPresent, string outcome, string TSCNotified, string bilingualSupplement, string notes, string caseManagerId, string userId, string serviceId, string referenceNumber, string application, string interview)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("insertForm4MonthlyPlacementEditData" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(caseNoteId);
            list.Add(serviceDate);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(SAMLevel);
            list.Add(employer);
            list.Add(contactType);
            list.Add(jobSeekerPresent);
            list.Add(outcome);
            list.Add(TSCNotified);
            list.Add(bilingualSupplement);
            list.Add(notes);
            list.Add(caseManagerId);
            list.Add(userId);
            list.Add(serviceId);
            list.Add(referenceNumber);
            list.Add(application);
            list.Add(interview);

            string text = "CALL DBA.ANYW_OOD_insertForm4MonthlyPlacementEditData(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";

            try
            {
                // return dg.executeDataBaseCall("CALL DBA.ANYW_OOD_insertForm4MonthlyPlacementEditData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + caseManagerId + "', '" + userId + "', '" + serviceId + "');", "results", "results");
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_OOD_insertForm4MonthlyPlacementEditData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + caseManagerId + "', '" + userId + "', '" + serviceId + "')");
                return "536: Error saving case note";
            }
        }

        public string deleteOODFormEntry(string caseNoteId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteOODFormEntry ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@caseNoteId", DbType.String, caseNoteId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_deleteForm4MonthlyPlacementEditData(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("ODG", ex.Message + "deleteForm4MonthlyPlacementEditData(" + caseNoteId + ")");
                throw ex;
            }
        }

        // Form 4 Monthly Summary -- edit data
        public string getForm4MonthlySummaryJSON(string token, string emReviewId)
        {
            if (tokenValidator(token) == false) return null;

            logger.debug("getForm4MonthlySummary" + token);
            try
            {
                return dg.executeDataBaseCallJSON("CALL DBA.ANYW_OOD_getForm4MonthlySummary('" + token + "', '" + emReviewId + "');");
            }
            catch (Exception ex)
            {
                logger.error("537", ex.Message + " ANYW_OOD_getForm4MonthlySummary('" + token + "', '" + emReviewId + "')");
                return "537: Error getting emREview to edit";
            }
        }

        public string updateForm4MonthlySummary(string token, string consumerId, string emReviewId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emEmploymentGoal, string emReferralQuestions, string emIndivInputonSearch, string emPotentialIssueswithProgress, string emPlanGoalsNextMonth, string emNumberofConsumerContacts, string emNumberEmployerContactsbyConsumer, string emNumberEmployerContactsbyStaff, string emNumberMonthsJobDevelopment, string userId)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("updateForm4MonthlySummary" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(emReviewId);
            list.Add(emReviewDate);
            list.Add(emReferenceNumber);
            list.Add(emNextScheduledReview);
            list.Add(emEmploymentGoal);
            list.Add(emReferralQuestions);
            list.Add(emIndivInputonSearch);
            list.Add(emPotentialIssueswithProgress);
            list.Add(emPlanGoalsNextMonth);
            list.Add(emNumberofConsumerContacts);
            list.Add(emNumberEmployerContactsbyConsumer);
            list.Add(emNumberEmployerContactsbyStaff);
            list.Add(emNumberMonthsJobDevelopment);
            list.Add(userId);
            string text = "CALL DBA.ANYW_OOD_updateForm4MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_OOD_updateForm4MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_OOD_updateForm4MonthlySummary";
            }

        }

        public string insertForm4MonthlySummary(string token, string consumerId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emEmploymentGoal, string emReferralQuestions, string emIndivInputonSearch, string emPotentialIssueswithProgress, string emPlanGoalsNextMonth, string emNumberofConsumerContacts, string emNumberEmployerContactsbyConsumer, string emNumberEmployerContactsbyStaff, string emNumberMonthsJobDevelopment, string userId, string serviceId)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("insertForm4MonthlySummary" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(emReviewDate);
            list.Add(emReferenceNumber);
            list.Add(emNextScheduledReview);
            list.Add(emEmploymentGoal);
            list.Add(emReferralQuestions);
            list.Add(emIndivInputonSearch);
            list.Add(emPotentialIssueswithProgress);
            list.Add(emPlanGoalsNextMonth);
            list.Add(emNumberofConsumerContacts);
            list.Add(emNumberEmployerContactsbyConsumer);
            list.Add(emNumberEmployerContactsbyStaff);
            list.Add(emNumberMonthsJobDevelopment);
            list.Add(userId);
            list.Add(serviceId);

            string text = "CALL DBA.ANYW_OOD_insertForm4MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_OOD_insertForm4MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_OOD_insertForm4MonthlySummary";
            }

        }

        public string deleteFormMonthlySummary(string emReviewId, DistributedTransaction transaction)
        {
            try
            {
                logger.debug("deleteFormMonthlySummary ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@emReviewId", DbType.String, emReviewId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_deleteForm4MonthlySummary(?)", args, ref transaction).ToString();
            }
            catch (Exception ex)
            {
                logger.error("ODG", ex.Message + "deleteFormMonthlySummary(" + emReviewId + ")");
                throw ex;
            }
        }

        // Form 8 Community Based Assessment
        public string getForm8CommunityBasedAssessment(string token, string caseNoteId)
        {
            if (tokenValidator(token) == false) return null;

            logger.debug("getForm8CommunityBasedAssessment" + token);
            try
            {
                return dg.executeDataBaseCallJSON("CALL DBA.ANYW_OOD_getForm8CommunityBasedAssessment('" + token + "', '" + caseNoteId + "');");
            }
            catch (Exception ex)
            {
                logger.error("537", ex.Message + " ANYW_OOD_getForm8CommunityBasedAssessment('" + token + "', '" + caseNoteId + "')");
                return "537: Error getting Form8CommunityBasedAssessment";
            }
        }

        public string updateForm8CommunityBasedAssessment(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string position, string contactMethod, string behavioralIndicators, string jobTaskQualityIndicators, string jobTaskQuantityIndicators, string narrative, string interventions, string userId)
        {
            if (tokenValidator(token) == false) return null;
            //if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("updateForm8CommunityBasedAssessment" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(caseNoteId);
            list.Add(serviceDate);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(SAMLevel);
            list.Add(position);
            list.Add(contactMethod);
            list.Add(behavioralIndicators);
            list.Add(jobTaskQualityIndicators);
            list.Add(jobTaskQuantityIndicators);
            list.Add(narrative);
            list.Add(interventions);
            list.Add(userId);

            string text = "CALL DBA.ANYW_OOD_updateForm8CommunityBasedAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";

            try
            {
                //return dg.executeDataBaseCall("CALL DBA.ANYW_OOD_updateForm4MonthlyPlacementEditData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + userId +  "');", "results", "results");
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_OOD_updateForm8CommunityBasedAssessment('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + contactMethod + "', '" + behavioralIndicators + "', '" + jobTaskQualityIndicators + "', '" + jobTaskQuantityIndicators + "', '" + narrative + "', '" + interventions + "')");
                return "536: Error saving Form8CommunityBasedAssessment";
            }
        }

        public string insertForm8CommunityBasedAssessment(string token, string consumerId, string caseNoteId, string serviceDate, string startTime, string endTime, string SAMLevel, string position, string contactMethod, string behavioralIndicators, string jobTaskQualityIndicators, string jobTaskQuantityIndicators, string narrative, string interventions, string userId, string serviceId, string referenceNumber, string caseManagerId)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("insertForm8CommunityBasedAssessment" + token);

            List<string> list = new List<string>();

            list.Add(token);
            list.Add(consumerId);
            list.Add(caseNoteId);
            list.Add(serviceDate);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(SAMLevel);
            list.Add(position);
            list.Add(contactMethod);
            list.Add(behavioralIndicators);
            list.Add(jobTaskQualityIndicators);
            list.Add(jobTaskQuantityIndicators);
            list.Add(narrative);
            list.Add(interventions);
            list.Add(userId);
            list.Add(serviceId);
            list.Add(referenceNumber);
            list.Add(caseManagerId);

            string text = "CALL DBA.ANYW_OOD_insertForm8CommunityBasedAssessment(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";

            try
            {
                // return dg.executeDataBaseCall("CALL DBA.ANYW_OOD_insertForm4MonthlyPlacementEditData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + caseManagerId + "', '" + userId + "', '" + serviceId + "');", "results", "results");
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_OOD_updateForm8CommunityBasedAssessment('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + contactMethod + "', '" + behavioralIndicators + "', '" + jobTaskQualityIndicators + "', '" + jobTaskQuantityIndicators + "', '" + narrative + "', '" + interventions + "')");
                return "536: Error saving case note";
            }
        }

        // Form 8 Monthly Summary -- edit data
        public string getForm8MonthlySummary(string token, string emReviewId)
        {
            if (tokenValidator(token) == false) return null;

            logger.debug("getForm8MonthlySummary" + token);
            try
            {
                return dg.executeDataBaseCallJSON("CALL DBA.ANYW_OOD_getForm8MonthlySummary('" + token + "', '" + emReviewId + "');");
            }
            catch (Exception ex)
            {
                logger.error("537", ex.Message + " ANYW_OOD_getForm8MonthlySummary('" + token + "', '" + emReviewId + "')");
                return "537: Error getting emREview to edit";
            }
        }

        public string updateForm8MonthlySummary(string token, string consumerId, string emReviewId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emSummaryIndivSelfAssessment, string emSummaryIndivEmployerAssessment, string emSummaryIndivProviderAssessment, string emSupportandTransition, string emReviewVTS, string userId)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("updateForm8MonthlySummary" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(emReviewId);
            list.Add(emReviewDate);
            list.Add(emReferenceNumber);
            list.Add(emNextScheduledReview);
            list.Add(emSummaryIndivSelfAssessment);
            list.Add(emSummaryIndivEmployerAssessment);
            list.Add(emSummaryIndivProviderAssessment);
            list.Add(emSupportandTransition);
            list.Add(emReviewVTS);
            list.Add(userId);

            string text = "CALL DBA.ANYW_OOD_updateForm8MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_OOD_updateForm8MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_OOD_updateForm8MonthlySummary";
            }

        }

        public string insertForm8MonthlySummary(string token, string consumerId, string emReviewDate, string emReferenceNumber, string emNextScheduledReview, string emSummaryIndivSelfAssessment, string emSummaryIndivEmployerAssessment, string emSummaryIndivProviderAssessment, string emSupportandTransition, string emReviewVTS, string userId, string serviceId)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("insertForm8MonthlySummary" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(emReviewDate);
            list.Add(emReferenceNumber);
            list.Add(emNextScheduledReview);
            list.Add(emSummaryIndivSelfAssessment);
            list.Add(emSummaryIndivEmployerAssessment);
            list.Add(emSummaryIndivProviderAssessment);
            list.Add(emSupportandTransition);
            list.Add(emReviewVTS);
            list.Add(userId);
            list.Add(serviceId);

            string text = "CALL DBA.ANYW_OOD_insertForm8MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_OOD_insertForm8MonthlySummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_OOD_insertForm8MonthlySummary";
            }

        }

        // Form 10 Transportation
        public string getForm10TransportationData(string token, string OODTransportationId)
        {
            if (tokenValidator(token) == false) return null;

            logger.debug("getForm10TransportationData" + token);
            try
            {
                return dg.executeDataBaseCallJSON("CALL DBA.ANYW_OOD_getForm10TransportationData('" + token + "', '" + OODTransportationId + "');");
            }
            catch (Exception ex)
            {
                logger.error("537", ex.Message + " ANYW_OOD_getForm10TransportationData('" + token + "', '" + OODTransportationId + "')");
                return "537: Error getting case note to edit";
            }
        }

        public string updateForm10TransportationData(string token, string consumerId, string OODTransportationId, string serviceDate, string startTime, string endTime, string numberInVehicle, string startLocation, string endLocation,  string userId)
        {
            if (tokenValidator(token) == false) return null;
            //if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("updateForm10TransportationData" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(OODTransportationId);
            list.Add(serviceDate);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(numberInVehicle);
            list.Add(startLocation);
            list.Add(endLocation);   
            list.Add(userId);

            string text = "CALL DBA.ANYW_OOD_updateForm10TransportationData(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";

            try
            {
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_OOD_updateForm10TransportationData('" + token + "', '" + consumerId + "', '" + OODTransportationId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + startLocation + "', '" + endLocation + "', '" + numberInVehicle+ "', '" + userId + "')");
                return "536: Error saving case note";
            }
        }

        public string insertForm10TransportationData(string token, string consumerId, string serviceDate, string startTime, string endTime, string numberInVehicle, string startLocation, string endLocation,  string userId, string referenceNumber)
        {
            if (tokenValidator(token) == false) return null;
            //  if (stringInjectionValidator(caseNote) == false) return null;
            logger.debug("insertForm10TransportationData" + token);

            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            list.Add(serviceDate);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(numberInVehicle);
            list.Add(startLocation);
            list.Add(endLocation);
            list.Add(userId);
            list.Add(referenceNumber);
            //list.Add("1234");

            string text = "CALL DBA.ANYW_OOD_insertForm10TransportationData(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";

            try
            {
                // return dg.executeDataBaseCall("CALL DBA.ANYW_OOD_insertForm10TransportationData('" + token + "', '" + consumerId + "', '" + caseNoteId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + SAMLevel + "', '" + employer + "', '" + contactType + "', '" + jobSeekerPresent + "', '" + outcome + "', '" + TSCNotified + "', '" + bilingualSupplement + "', '" + notes + "', '" + caseManagerId + "', '" + userId + "', '" + serviceId + "');", "results", "results");
                return dg.executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("536", ex.Message + " ANYW_OOD_insertForm10TransportationData('" + token + "', '" + consumerId + "', '" + serviceDate + "', '" + startTime + "', '" + endTime + "', '" + startLocation + "', '" + endLocation + "', '" + numberInVehicle + "', '" + userId + "', '" + referenceNumber + "')");
                return "536: Error saving case note";
            }
        }

        public string deleteOODForm10TransportationEntry(string OODTransportationId)
        {
            try
            {
                logger.debug("deleteOODForm10TransportationEntry ");

                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[1];
                args[0] = (System.Data.Common.DbParameter)DbHelper.CreateParameter("@OODTransportationId", DbType.String, OODTransportationId);
                // returns the number of rows deleted
                return DbHelper.ExecuteScalar(System.Data.CommandType.StoredProcedure, "CALL DBA.ANYW_OOD_deleteForm10TransportationData(?)", args).ToString();
            }
            catch (Exception ex)
            {
                logger.error("ODG", ex.Message + "deleteOODForm10TransportationEntry(" + OODTransportationId + ")");
                throw ex;
            }
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

        public string removeUnsavableNoteText(string note)
        {
            if (note == "" || note is null)
            {
                return note;
            }
            if (note.Contains("'"))
            {
                note = note.Replace("'", "''");
            }
            if (note.Contains("\\"))
            {
                note = note.Replace("\\", "");
            }
            //if (note.Contains("\""))
            //{
            //    note = note.Replace("\"", "\"");
            //}
            return note;
        }

    }
}