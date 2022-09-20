using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanOutcomes
{
    public class PlanOutcomesDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string insertPlanOutcomeProgressSummary(string token, long planId, string progressSummary)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(progressSummary) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId.ToString());
            list.Add(progressSummary);
            string text = "CALL DBA.ANYW_ISP_InsertPlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_InsertPlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_InsertPlanOutcomeProgressSummary";
            }
        }

        public string updatePlanOutcomeProgressSummary(string token, long progressSummaryId, string progressSummary)
        {
            if (tokenValidator(token) == false) return null;
            if (stringInjectionValidator(progressSummary) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(progressSummaryId.ToString());
            list.Add(progressSummary);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_UpdatePlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_UpdatePlanOutcomeProgressSummary";
            }
        }
                
        public string deletePlanOutcomeProgressSummary(string token, long progressSummaryId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(progressSummaryId.ToString());
            string text = "CALL DBA.ANYW_ISP_DeletePlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_DeletePlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_DeletePlanOutcomeProgressSummary";
            }
        }

        public string deletePlanOutcomeExperienceResponsibility(string token, long responsibilityId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(responsibilityId.ToString());
            string text = "CALL DBA.ANYW_ISP_DeletePlanOutcomeExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_DeletePlanOutcomeExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_DeletePlanOutcomeExperienceResponsibility";
            }
        }

        public string getPlanOutcomeProgressSummary(string token, string planId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificOutcomes ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_GetPlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1PODG", ex.Message + "ANYW_ISP_GetPlanOutcomeProgressSummary(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APODG: error ANYW_ISP_GetPlanOutcomeProgressSummary";
            }
        }

        public string insertPlanOutcomesOutcome(string token, string assessmentId, string outcome, string details, string history, string sectionId, string outcomeOrder, string summaryOfProgress, int status, string carryOverReason)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            list.Add(outcome);
            list.Add(details);
            list.Add(history);
            list.Add(sectionId);
            list.Add(outcomeOrder);
            list.Add(summaryOfProgress);
            list.Add(status.ToString());
            list.Add(carryOverReason);
            string text = "CALL DBA.ANYW_ISP_InsertPlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_InsertPlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_InsertPlanOutcomesOutcome";
            }
        }

        public string insertPlanOutcomesExperience(string outcomeId, string howHappened, string whatHappened, string experienceOrder)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            List<string> list = new List<string>();
            list.Add(outcomeId);
            list.Add(howHappened);
            list.Add(whatHappened);
            list.Add(experienceOrder);
            string text = "CALL DBA.ANYW_ISP_InsertPlanOutcomesExperience(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_InsertPlanOutcomesExperience(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_InsertPlanOutcomesExperience";
            }
        }

        public string insertPlanOutcomesReview(long outcomeId, string whatWillHappen, string whenToCheckIn, string whoReview, string reviewOrder, string contactId)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            List<string> list = new List<string>();
            list.Add(outcomeId.ToString());
            list.Add(whatWillHappen);
            list.Add(whenToCheckIn);
            list.Add(whoReview);
            list.Add(reviewOrder);
            list.Add(contactId.ToString());
            string text = "CALL DBA.ANYW_ISP_InsertPlanOutcomesReview(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_InsertPlanOutcomesReview(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_InsertPlanOutcomesReview";
            }
        }

        public string updatePlanOutcomesOutcome(string token, string assessmentId, string outcomeId, string outcome, string details, string history, string sectionId, string summaryOfProgress, int status, string carryOverReason)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            list.Add(outcomeId);
            list.Add(outcome);
            list.Add(details);
            list.Add(history);
            list.Add(sectionId);
            list.Add(summaryOfProgress);
            list.Add(status.ToString());
            list.Add(carryOverReason);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4PODG", ex.Message + "ANYW_ISP_UpdatePlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4APODG: error ANYW_ISP_UpdatePlanOutcomesOutcome";
            }
        }

        public string updatePlanOutcomesExperience(string outcomeId, string experienceId, string howHappened, string whatHappened)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            List<string> list = new List<string>();
            list.Add(outcomeId);
            list.Add(experienceId);
            list.Add(howHappened);
            list.Add(whatHappened);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanOutcomesExperience(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdatePlanOutcomesExperience(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdatePlanOutcomesExperience";
            }
        }

        public string insertPlanOutcomeExperienceResponsibility(string experienceId, long responsibleContact, long responsibleProvider, string whenHowOftenValue, long whenHowOftenFrequency, string whenHowOftenText)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            List<string> list = new List<string>();
            list.Add(experienceId);
            
            list.Add(responsibleContact.ToString());
            list.Add(responsibleProvider.ToString());
            list.Add(whenHowOftenValue);
            list.Add(whenHowOftenFrequency.ToString());
            list.Add(whenHowOftenText);
            string text = "CALL DBA.ANYW_ISP_InsertPlanOutcomeExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_InsertPlanOutcomeExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_InsertPlanOutcomeExperienceResponsibility";
            }
        }

        public string updatePlanOutcomeExperienceResponsibility(long responsibilityId, long responsibleContact, long responsibleProvider, string whenHowOftenValue, long whenHowOftenFrequency, string whenHowOftenText)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            List<string> list = new List<string>();
            list.Add(responsibilityId.ToString());
            list.Add(responsibleContact.ToString());
            list.Add(responsibleProvider.ToString());
            list.Add(whenHowOftenValue);
            list.Add(whenHowOftenFrequency.ToString());
            list.Add(whenHowOftenText);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanOutcomeExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdatePlanOutcomeExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdatePlanOutcomeExperienceResponsibility";
            }
        }

        public string getPlanExperienceResponsibility(string experienceId)
        {
            logger.debug("getPlanExperienceResponsibility ");
            List<string> list = new List<string>();
            list.Add(experienceId);
            string text = "CALL DBA.ANYW_ISP_GetPlanExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1PODG", ex.Message + "ANYW_ISP_GetPlanExperienceResponsibility(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APODG: error ANYW_ISP_GetPlanExperienceResponsibility";
            }
        }

        public string updatePlanOutcomesReview(long outcomeId, string reviewId, string whatWillHappen, string whenToCheckIn, string whoReview, long contactId)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            List<string> list = new List<string>();
            list.Add(outcomeId.ToString());
            list.Add(reviewId);
            list.Add(whatWillHappen);
            list.Add(whenToCheckIn);
            list.Add(whoReview);
            list.Add(contactId.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdatePlanOutcomesReview(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdatePlanOutcomesReview(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdatePlanOutcomesReview";
            }
        }

        public string updatePlanOutcomesExperienceOrder(string token, long outcomeId, long experienceId, int newPos, int oldPos)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(outcomeId.ToString());
            list.Add(experienceId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateOutcomesExperienceOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdateOutcomesExperienceOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdateOutcomesExperienceOrder";
            }
        }

        public string updatePlanOutcomesReviewOrder(string token, long outcomeId, long reviewId, int newPos, int oldPos)
        {

            logger.debug("insertPlanOutcomesExperiences ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(outcomeId.ToString());
            list.Add(reviewId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateOutcomesReviewOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdateOutcomesReviewOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdateOutcomesReviewOrder";
            }
        }

        

        public string getPlanOutcomes(string token, string assessmentId, int targetAssessmentVersionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificOutcomes ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            list.Add(targetAssessmentVersionId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetPlanOutcomes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1PODG", ex.Message + "ANYW_ISP_GetPlanOutcomes(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1APODG: error ANYW_ISP_GetPlanOutcomes";
            }
        }

        public string getPlanExperiences(string token, string assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificOutcomes ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetPlanExperiences(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2PODG", ex.Message + "ANYW_ISP_GetPlanExperiences(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2APODG: error ANYW_ISP_GetPlanExperiences";
            }
        }

        public string getPlanReviews(string token, string assessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPlanSpecificReviews ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId);
            string text = "CALL DBA.ANYW_ISP_GetPlanReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3PODG", ex.Message + "ANYW_ISP_GetPlanReviews(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3APODG: error ANYW_ISP_GetPlanReviews";
            }
        }

        public string deletePlanOutcomeWithPlan(string planId)
        {

            logger.debug("deletePlanOutcome ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanOutcomeWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6.1PODG", ex.Message + "ANYW_ISP_DeletePlanOutcomeWithPlan(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6.1APODG: error ANYW_ISP_DeletePlanOutcomeWithPlan";
            }
        }

        public string deletePlanApplicables(string planId)
        {

            logger.debug("deletePlanOutcome ");
            List<string> list = new List<string>();
            list.Add(planId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanApplicables(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6.1PODG", ex.Message + "ANYW_ISP_DeletePlanApplicables(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6.1APODG: error ANYW_ISP_DeletePlanApplicables";
            }
        }

        public string deletePlanOutcome(string token, string outcomeId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePlanOutcome ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(outcomeId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("6PODG", ex.Message + "ANYW_ISP_DeletePlanOutcomesOutcome(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "6APODG: error ANYW_ISP_DeletePlanOutcomesOutcome";
            }
        }

        public string deletePlanOutcomeExperience(string token, string outcomeId, string experienceId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePlanOutcome ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(outcomeId);
            list.Add(experienceId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanOutcomesOutcomeExperience(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("7PODG", ex.Message + "ANYW_ISP_DeletePlanOutcomesOutcomeExperience(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "7APODG: error ANYW_ISP_DeletePlanOutcomesOutcomeExperience";
            }
        }

        public string deletePlanOutcomeReview(string token, string outcomeId, string reviewId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePlanOutcome ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(outcomeId);
            list.Add(reviewId);
            string text = "CALL DBA.ANYW_ISP_DeletePlanOutcomesOutcomeReview(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("8PODG", ex.Message + "ANYW_ISP_DeletePlanOutcomesOutcomeReview(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "8APODG: error ANYW_ISP_DeletePlanOutcomesOutcomeReview";
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

        public bool stringInjectionValidator(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            if (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(deleteFrom))
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

        public System.IO.MemoryStream executeSQLReturnMemoryStream(string storedProdCall)
        {
            logger.debug("Attachment start");
            MemoryStream memorystream = new MemoryStream();
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.Text;
                cmd.Connection = conn;

                conn.Open();
                logger.debug("Attachment connection open");
                var result = cmd.ExecuteReader();
                logger.debug("Attachment ExecuteReader done; entering result");
                if (result != null)
                {
                    logger.debug("Attachment result not null");
                    result.Read();
                    logger.debug("Attachment result.read done");
                    byte[] fileData = (byte[])result[0];
                    logger.debug("Attachment byte array made");
                    memorystream.Write(fileData, 0, fileData.Length);
                    logger.debug("Attachment data sent to memorystream");
                }

            }
            catch (Exception ex)
            {
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
            logger.debug("Attachment done");
            return memorystream;
        }
    }
}