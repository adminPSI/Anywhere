using Anywhere.service.Data.PlanContactInformation;
using Anywhere.service.Data.PlanInformedConsent;
using Anywhere.service.Data.PlanIntroduction;
using Anywhere.service.Data.PlanOutcomes;
using Anywhere.service.Data.PlanServicesAndSupports;
using Anywhere.service.Data.PlanSignature;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.Plan.AnywherePlanWorker;


namespace Anywhere.service.Data
{
    namespace Plan
    {
        public class AnywherePlanWorker
        {
            PlanDataGetter adg = new PlanDataGetter();
            WorkflowDataGetter wdg = new WorkflowDataGetter();
            JavaScriptSerializer js = new JavaScriptSerializer();
            Assessment.AssessmentWorker aW = new Assessment.AssessmentWorker();
            PlanOutcomesWorker pow = new PlanOutcomesWorker();
            PlanOutcomesDataGetter podg = new PlanOutcomesDataGetter();
            PlanInformedConsentDataGetter picdg = new PlanInformedConsentDataGetter();
            PlanSignatureDataGetter psdg = new PlanSignatureDataGetter();
            PlanContactInformationDataGetter pcidg = new PlanContactInformationDataGetter();
            PlanContactInformationWorker pciw = new PlanContactInformationWorker();

            #region CONSUMER PLAN DATA OBJECTS

            static class PlanType
            {
                public const string Annual = "A";
                public const string Revision = "R";
            }

            static class PlanStatus
            {
                public const string Draft = "D";
                public const string Complete = "C";
                public static bool isValidStatus(string status)
                {
                    var values = typeof(PlanStatus).GetFields(System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public)
                                         .Where(x => x.IsLiteral && !x.IsInitOnly)
                                         .Select(x => x.GetValue(null)).Cast<string>();
                    return (values.Contains(status));
                }
            }

            public class AttachmentList
            {
                public string planAttachmentId { get; set; }
                public string attachmentId { get; set; }
                public string questionId { get; set; }
                public string description { get; set; }
            }

            public class AddAttachment
            {
                public string planAttachmentId { get; set; }
                public string attachmentId { get; set; }
                public string questionId { get; set; }
                public string description { get; set; }
            }

            public class ConsumerPlans
            {
                public string consumerPlanId { get; set; }
                public string planYearStart { get; set; }
                public string planYearEnd { get; set; }
                public string effectiveStart { get; set; }
                public string effectiveEnd { get; set; }
                public string planType { get; set; }
                public string revisionNumber { get; set; }
                public string planStatus { get; set; }
                public string createdOn { get; set; }
                public string reviewDate { get; set; }
                public string active { get; set; }//
                public string sentToDODD { get; set; }
                public string userSentDODD { get; set; }
                public string dateSentDODD { get; set; }
                public string downloadDate { get; set; }
                public string versionNumber { get; set; }

            }

            public class ConsumerPlan
            {
                public string consumerPlanId { get; set; }
                public string cQFullName { get; set; }
                public string consumerId { get; set; }
                public string planYearStart { get; set; }
                public string planYearEnd { get; set; }
                public string effectiveStart { get; set; }
                public string effectiveEnd { get; set; }
                public string planType { get; set; }
                public string revisionNumber { get; set; }
                public string planStatus { get; set; }
                public string active { get; set; }
                public string reviewDate { get; set; }
                public string existingAssesmentVersionId { get; set; }
                public string latestAssessmentVersionId { get; set; }
                public string versionNumber { get; set; }
            }

            #endregion

            #region HELPER METHODS
            public static class ConsumerPlanValidator
            {
                public static void validateAnnualPlanYearStartDate(string planYearStart, ConsumerPlan[] existingPlans)
                {
                    if (String.IsNullOrEmpty(planYearStart)) throw new Exception("planYearStart is required");

                    // Convert to dates
                    DateTime pyStart = Convert.ToDateTime(planYearStart);

                    if (Array.Exists(existingPlans, plan => Convert.ToDateTime(plan.planYearStart) == pyStart && plan.planType == PlanType.Annual)) throw new Exception("Another plan has been found with the start date " + pyStart.ToString("MM/dd/yyyy") + ". Please change the plan year start date");

                }
                public static void validateNoRevisions(ConsumerPlan plan, ConsumerPlan[] existingPlans)
                {
                    // validate plan has no revisions
                    if (Array.Exists(existingPlans, p => p.planType == PlanType.Revision && Convert.ToDateTime(p.planYearStart) == Convert.ToDateTime(plan.planYearStart)))
                    {
                        throw new Exception("Invalid operation: Plan has been revised");
                    }
                }
                public static void validateRevisionEffectiveDates(string planYearStart, string planYearEnd, string effectiveStart, string effectiveEnd, string revisionNumber, ConsumerPlan[] existingPlans)
                {
                    if (String.IsNullOrEmpty(planYearStart)) throw new Exception("planYearStart is required");
                    if (String.IsNullOrEmpty(planYearEnd)) throw new Exception("planYearEnd is required");
                    if (String.IsNullOrEmpty(effectiveStart)) throw new Exception("effectiveStart is required");
                    if (String.IsNullOrEmpty(effectiveEnd)) throw new Exception("effectiveEnd is required");
                    if (String.IsNullOrEmpty(revisionNumber)) throw new Exception("revisionNumber is required");

                    // Convert to dates
                    DateTime pyStart = Convert.ToDateTime(planYearStart);
                    DateTime pyEnd = Convert.ToDateTime(planYearEnd);
                    DateTime effStart = Convert.ToDateTime(effectiveStart);
                    DateTime effEnd = Convert.ToDateTime(effectiveEnd);

                    if (effStart > effEnd) throw new Exception("effectiveStart cannot be greater than effectiveEnd");
                    if ((effStart < pyStart) || (effStart > pyEnd)) throw new Exception("effectiveStart must fall between planYearStart and planYearEnd");
                    if ((effEnd < pyStart) || (effEnd > pyEnd)) throw new Exception("effectiveEnd must fall between planYearStart and planYearEnd");

                    ConsumerPlan priorRevision = existingPlans.FirstOrDefault(plan => Convert.ToDateTime(plan.planYearStart) == pyStart && Int32.Parse(plan.revisionNumber) == (Int32.Parse(revisionNumber) - 1));

                    if (priorRevision != null)
                    {
                        if (effStart <= Convert.ToDateTime(priorRevision.effectiveStart)) throw new Exception("effectiveStart must be greater than the effectiveStart of the prior revision");
                    }

                    ConsumerPlan successiveRevision = existingPlans.FirstOrDefault(plan => Convert.ToDateTime(plan.planYearStart) == pyStart && Int32.Parse(plan.revisionNumber) == (Int32.Parse(revisionNumber) + 1));

                    if (successiveRevision != null)
                    {
                        if (effStart >= Convert.ToDateTime(successiveRevision.effectiveStart)) throw new Exception("effectiveStart must be less than the effectiveStart of the successive revision");
                    }
                }
            }
            #endregion

            #region CREATE METHODS
            public string insertConsumerPlanAnnual(string token, string consumerId, string planYearStart, string reviewDate, string salesForceCaseManagerId)
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        // validate session token
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        // validate input
                        if (String.IsNullOrEmpty(consumerId)) throw new Exception("consumerId is required");
                        if (String.IsNullOrEmpty(planYearStart)) throw new Exception("planYearStart is required");

                        DateTime annualPlanYearStart = Convert.ToDateTime(planYearStart);

                        // get the userId
                        String userId = adg.getSessionUserId(token, transaction);
                        if (userId == null || userId == "") throw new Exception("failed to retrieve session userId");

                        // hardcode "1" since we only have 1 type assessment in the database currently
                        String assessmentId = "1";
                        String priorPlanIdForApplicable = "0";
                        ConsumerPlan[] existingPlans = js.Deserialize<ConsumerPlan[]>(adg.getConsumerPlans(consumerId, transaction));

                        ConsumerPlanValidator.validateAnnualPlanYearStartDate(planYearStart, existingPlans);

                        // look for most recent plan with this assessment for this consumer
                        String priorConsumerPlanId = adg.getMostRecentConsumerPlanId(consumerId, assessmentId, transaction);

                        // automatically set the planYearEnd and effectiveStart and effectiveEnd dates based on the planYearStart date
                        String planYearEnd = annualPlanYearStart.AddYears(1).AddDays(-1).ToString("yyyy-MM-dd");
                        String effectiveStart = planYearStart;
                        String effectiveEnd = planYearEnd;

                        // insert the consumer plan
                        String active = "1";
                        String planType = PlanType.Annual;
                        String revisionNumber = "0";
                        String inputString = adg.insertConsumerPlan(consumerId, planYearStart, planYearEnd, effectiveStart, effectiveEnd, planType, revisionNumber, active, userId, reviewDate, priorPlanIdForApplicable, priorConsumerPlanId, salesForceCaseManagerId, transaction);
                        String[] splitString = inputString.Split(',');
                        String consumerPlanId = splitString[0];
                        // always use the latest assessment version
                        String targetAssessmentVersionId = adg.getCurrentAssessmentVersionId(assessmentId, effectiveStart, transaction);
                        if (targetAssessmentVersionId == null) throw new Exception("Unable to find latest assessment");

                        // insert assessment answers and copy data from previous assessment
                        aW.insertAssessmentAnswers(consumerPlanId.TrimEnd(','), priorConsumerPlanId, targetAssessmentVersionId, userId, effectiveStart, effectiveEnd, "false", transaction, token);

                        //   execute any Actions associated with 'Plan Inserted' event -- EventId = 29 (Annual)
                        // string eventId = "29";
                        // executeWorkflowActions(token, eventId, consumerPlanId);

                        return inputString;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }
            }

            private void executeWorkflowActions(string token, string eventId, string consumerPlanId)
            {
                WorkflowWorker.WorkflowEditedStepStatus thisEvent = new WorkflowWorker.WorkflowEditedStepStatus();
                WorkflowWorker wfWorker = new WorkflowWorker();

                //let cache = { eventTypeId : planId, eventType: "plan", eventId: 29};
                // TO DO -- THE STEPS HAVE NOT BEEN CREATED YET !!
                thisEvent.eventId = eventId;
                thisEvent.eventType = "plan";
                thisEvent.eventTypeId = consumerPlanId;
                string processingCompleted = wfWorker.processWorkflowStepEvent(token, thisEvent);
            }

            public string insertConsumerPlanRevision(string token, string priorConsumerPlanId, string newEffectiveStart, string newEffectiveEnd, string reviewDate, Boolean useLatestAssessmentVersion, string salesForceCaseManagerId)
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        // validate session token
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        // validate input
                        if (String.IsNullOrEmpty(priorConsumerPlanId)) throw new Exception("priorConsumerPlanId is required");
                        if (String.IsNullOrEmpty(newEffectiveStart)) throw new Exception("effectiveStart is required");
                        if (String.IsNullOrEmpty(newEffectiveEnd)) throw new Exception("effectiveEnd is required");

                        // get the userId
                        String userId = adg.getSessionUserId(token, transaction);
                        if (userId == null || userId == "") throw new Exception("failed to retrieve session userId");

                        ConsumerPlan existingPlan = js.Deserialize<List<ConsumerPlan>>(adg.getConsumerPlan(priorConsumerPlanId, transaction)).FirstOrDefault();

                        if (existingPlan == null) throw new Exception("a problem occured while trying to retrieve the prior consumer plan");

                        // Get next revision number
                        String revisionNumber = adg.getNextRevisionNumber(priorConsumerPlanId, transaction);

                        ConsumerPlan[] existingPlans = new ConsumerPlan[1];
                        existingPlans[0] = existingPlan;

                        ConsumerPlanValidator.validateRevisionEffectiveDates(existingPlan.planYearStart, existingPlan.planYearEnd, newEffectiveStart, newEffectiveEnd, revisionNumber, existingPlans);

                        // insert the consumer plan
                        String active = "1";
                        String planType = PlanType.Revision;
                        //DateTime revDate = Convert.ToDateTime(existingPlan.reviewDate);
                        //var revDate = DateTime.Parse(existingPlan.reviewDate);
                        //var reviewDate = revDate.ToString("yyyy-MM-dd");
                        String inputString = adg.insertConsumerPlan(existingPlan.consumerId, existingPlan.planYearStart, existingPlan.planYearEnd, newEffectiveStart, newEffectiveEnd, planType, revisionNumber, active, userId, reviewDate, priorConsumerPlanId, priorConsumerPlanId, salesForceCaseManagerId, transaction);
                        String[] splitString = inputString.Split(',');
                        String consumerPlanId = splitString[0];
                        // determine whether to use the existing assessment version or the lastest assessment version
                        String assessmentId = "1";
                        String targetAssessmentVersionId = adg.getCurrentAssessmentVersionId(assessmentId, newEffectiveStart, transaction);
                        //String targetAssessmentVersionId = useLatestAssessmentVersion ? existingPlan.latestAssessmentVersionId : existingPlan.existingAssesmentVersionId;
                        if (targetAssessmentVersionId == null) throw new Exception("Unable to find latest assessment");

                        // insert assessment answers and copy data from previous assessment
                        aW.insertAssessmentAnswers(consumerPlanId.TrimEnd(','), priorConsumerPlanId, targetAssessmentVersionId, userId, newEffectiveStart, newEffectiveEnd, "true", transaction, token);

                        // deactivate old plan
                        adg.updateConsumerPlanSetInactive(priorConsumerPlanId, transaction);

                        //   execute any Actions associated with 'Plan Inserted' event -- EventId = 30 (Revision)
                        // string eventId = "30";
                        // executeWorkflowActions(token, eventId, consumerPlanId);

                        //inputString = consumerPlanId.TrimEnd(',');
                        return inputString;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }
            }

            public AddAttachment[] addPlanAttachment(string token, long assessmentId, string description, string attachmentType, string attachment, string section, long questionId)
            {
                string attachmentsString = adg.addPlanAttachment(token, assessmentId, description, attachmentType, attachment, section, questionId, "");
                AddAttachment[] attachmentsObj = js.Deserialize<AddAttachment[]>(attachmentsString);
                return attachmentsObj;
            }


            public AttachmentList[] getPlanAttachmentsList(string token, long planId, string section)
            {
                string attachmentsString = adg.getPlanAttachmentsList(token, planId, section);
                AttachmentList[] attachmentsObj = js.Deserialize<AttachmentList[]>(attachmentsString);
                return attachmentsObj;
            }

            #endregion

            #region READ METHODS
            public ConsumerPlans[] getConsumerPlans(string token, string consumerId)
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        string assessmentString = adg.getConsumerPlans(consumerId, transaction);
                        ConsumerPlans[] assessmentsObj = js.Deserialize<ConsumerPlans[]>(assessmentString);
                        return assessmentsObj;
                    }
                    catch (Exception ex)
                    {
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }
            }
            #endregion

            #region UPDATE METHODS
            public int updateConsumerPlanReactivate(string token, string consumerPlanId)
            {

                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        if (String.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");

                        int rowsUpdated = 0;

                        rowsUpdated = adg.updateConsumerPlanReactivate(consumerPlanId, transaction);

                        return rowsUpdated;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }

            }
            public int updateConsumerPlanSetAnnualDates(string token, string consumerPlanId, string newPlanYearStart)
            {

                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        if (String.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");
                        if (String.IsNullOrEmpty(newPlanYearStart)) throw new Exception("planYearStart is required");

                        // Retrieve the current consumer plan to make sure it exists and it's active
                        ConsumerPlan plan = js.Deserialize<List<ConsumerPlan>>(adg.getConsumerPlan(consumerPlanId, transaction)).FirstOrDefault();

                        if (plan == null) throw new Exception("planId not found");

                        if (plan.active == "0") throw new Exception("plan must be active to perform this operation");
                        if (plan.planType != PlanType.Annual) throw new Exception("invalid operation: can only change plan year dates on an annual plan");

                        // retrieve consumer plans to validate against                  
                        ConsumerPlan[] existingPlans = js.Deserialize<ConsumerPlan[]>(adg.getConsumerPlans(plan.consumerId, transaction));

                        ConsumerPlanValidator.validateNoRevisions(plan, existingPlans);
                        ConsumerPlanValidator.validateAnnualPlanYearStartDate(newPlanYearStart, existingPlans);

                        DateTime dtPlanYearStart = Convert.ToDateTime(newPlanYearStart);

                        String planYearStart = dtPlanYearStart.ToString("yyyy-MM-dd");
                        String planYearEnd = dtPlanYearStart.AddYears(1).AddDays(-1).ToString("yyyy-MM-dd");
                        String effectiveStart = planYearStart;
                        String effectiveEnd = planYearEnd;

                        int rowsUpdated = 0;

                        rowsUpdated = adg.updateConsumerPlanSetDates(consumerPlanId, planYearStart, planYearEnd, effectiveStart, effectiveEnd, transaction);


                        //   execute any Actions associated with 'Plan Year Start Updated' event -- EventId = 13 (Annual) 
                        //   execute any Actions associated with 'Plan Year End Updated' event -- EventId = 17 (Annual)
                        //   execute any Actions associated with 'Plan Effective Start Updated' event -- EventId = 20 (Annual)
                        string eventId = "13";
                        executeWorkflowActions(token, eventId, consumerPlanId);
                        eventId = "17";
                        executeWorkflowActions(token, eventId, consumerPlanId);
                        eventId = "20";
                        executeWorkflowActions(token, eventId, consumerPlanId);

                        return rowsUpdated;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }

            }

            public string updateConsumerPlanReviewDate(string token, string reviewDate, long planId)
            {
                return adg.updateConsumerPlanReviewDate(token, reviewDate, planId);
            }

            public int updateConsumerPlanSetRevisionEffectiveDates(string token, string consumerPlanId, string newEffectiveStart, string newEffectiveEnd)
            {

                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        if (string.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");
                        if (string.IsNullOrEmpty(newEffectiveStart)) throw new Exception("newEffectiveStart is required");
                        if (string.IsNullOrEmpty(newEffectiveEnd)) throw new Exception("newEffectiveEnd is required");

                        // Retrieve the current consumer plan to make sure it exists and it's active
                        ConsumerPlan plan = js.Deserialize<List<ConsumerPlan>>(adg.getConsumerPlan(consumerPlanId, transaction)).FirstOrDefault();

                        if (plan == null) throw new Exception("planId not found");

                        if (plan.active == "0") throw new Exception("plan must be active to perform this operation");
                        if (plan.planType != PlanType.Revision) throw new Exception("invalid operation: can only change effecive dates on a revised plan");

                        // retrieve consumer plans to validate against                  
                        ConsumerPlan[] existingPlans = js.Deserialize<ConsumerPlan[]>(adg.getConsumerPlans(plan.consumerId, transaction));

                        ConsumerPlanValidator.validateRevisionEffectiveDates(plan.planYearStart, plan.planYearEnd, newEffectiveStart, newEffectiveEnd, plan.revisionNumber, existingPlans);

                        DateTime dtEffectiveStart = Convert.ToDateTime(newEffectiveStart);
                        DateTime dtEffectiveEnd = Convert.ToDateTime(newEffectiveEnd);
                        DateTime dtplanYearStart = Convert.ToDateTime(plan.planYearStart);
                        DateTime dtplanYearEnd = Convert.ToDateTime(plan.planYearEnd);

                        String planYearStart = dtplanYearStart.ToString("yyyy-MM-dd");
                        String planYearEnd = dtplanYearEnd.ToString("yyyy-MM-dd");
                        String effectiveStart = dtEffectiveStart.ToString("yyyy-MM-dd");
                        String effectiveEnd = dtEffectiveEnd.ToString("yyyy-MM-dd");

                        int rowsUpdated = 0;

                        rowsUpdated = adg.updateConsumerPlanSetDates(consumerPlanId, planYearStart, planYearEnd, effectiveStart, effectiveEnd, transaction);

                        //   execute any Actions associated with 'Plan Year Start Updated' event -- EventId = 14 (Revision) 
                        //   execute any Actions associated with 'Plan Year End Updated' event -- EventId = 18 (Revision)
                        //   execute any Actions associated with 'Plan Effective Start Updated' event -- EventId = 19 (Revision)
                        string eventId = "14";
                        executeWorkflowActions(token, eventId, consumerPlanId);
                        eventId = "18";
                        executeWorkflowActions(token, eventId, consumerPlanId);
                        eventId = "19";
                        executeWorkflowActions(token, eventId, consumerPlanId);

                        return rowsUpdated;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }

            }
            public int updateConsumerPlanSetStatus(string token, string consumerPlanId, string status)
            {

                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        if (String.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");
                        if (String.IsNullOrEmpty(status)) throw new Exception("status is required");

                        if (!PlanStatus.isValidStatus(status)) throw new Exception("invalid status");

                        int rowsUpdated = 0;

                        rowsUpdated = adg.updateConsumerPlanSetStatus(consumerPlanId, status, transaction);

                        return rowsUpdated;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }

            }

            public string updatePlanSectionApplicable(string token, long planId, long sectionId, string applicable)
            {
                return adg.updatePlanSectionApplicable(token, planId, sectionId, applicable);
            }
            #endregion

            #region DELETE METHODS 
            public string deleteConsumerPlan(string token, string consumerPlanId)
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    try
                    {
                        // validate session token
                        if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                        // validate input
                        if (String.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");

                        // get the existing plan so we can validate it exists.
                        ConsumerPlan existingPlan = js.Deserialize<List<ConsumerPlan>>(adg.getConsumerPlan(consumerPlanId, transaction)).FirstOrDefault();

                        if (existingPlan == null) throw new Exception("invalid ConsumerPlanId");

                        if (existingPlan.planStatus != PlanStatus.Draft) throw new Exception("the plan must have a status of 'draft' in order to delete");

                        int deletedPlans = adg.deleteConsumerPlan(consumerPlanId, transaction);

                        int workflowProcessId = -1;

                        switch (existingPlan.planType)
                        {
                            case "A":
                                workflowProcessId = 2;
                                break;
                            case "R":
                                workflowProcessId = 3;
                                break;
                        }

                        if (workflowProcessId > 0)
                        {
                            //   execute any Actions associated with 'Plan Deleted' event -- EventId = 27 (Annual), EventId = 28 (Revision)
                            string eventId = "27";
                            executeWorkflowActions(token, eventId, consumerPlanId);
                            eventId = "28";
                            executeWorkflowActions(token, eventId, consumerPlanId);

                            // delete any workflows attached to this consumerPlanId
                            string deletedWorkflows = wdg.deleteWorkflows(workflowProcessId, consumerPlanId, transaction);
                        }

                        podg.deletePlanOutcomeWithPlan(consumerPlanId);
                        podg.deletePlanApplicables(consumerPlanId);
                        psdg.deletePlanSignatureWithPlan(consumerPlanId);
                        picdg.deletePlanInformedConsentWithPlan(consumerPlanId);
                        pcidg.deletePlanContactInformationWithPlan(consumerPlanId);
                        adg.deleteAttachmentsWithPlan(consumerPlanId);


                        if (deletedPlans == 0) throw new Exception("plan was not deleted");



                        // all rows were deleted
                        return "success";

                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                    }
                }

            }
            #endregion
        }

        namespace Assessment
        {
            public class AssessmentWorker
            {
                PlanDataGetter adg = new PlanDataGetter();
                JavaScriptSerializer js = new JavaScriptSerializer();
                PlanOutcomesWorker pow = new PlanOutcomesWorker();
                ServicesAndSupportsWorker ssW = new ServicesAndSupportsWorker();
                PlanContactInformationWorker pciw = new PlanContactInformationWorker();
                PlanSignatureWorker psw = new PlanSignatureWorker();
                PlanInformedConsentWorker picw = new PlanInformedConsentWorker();
                PlanIntroductionWorker piw = new PlanIntroductionWorker();

                #region ASSESSMENT DATA OBJECTS
                static class QuestionSetType
                {
                    public const string Grid = "GRID";
                    public const string List = "LIST";
                    public const string Checkboxes = "CHECKBOXES";
                }

                [DataContract]
                public class AssessmentAnswer
                {
                    [DataMember(Order = 0)]
                    public string answerId { get; set; }

                    [DataMember(Order = 1)]
                    public string answerRow { get; set; }

                    [DataMember(Order = 2)]
                    public string answerText { get; set; }
                    [DataMember(Order = 3)]
                    public string answerStyle { get; set; }
                    [DataMember(Order = 4)]
                    public string skipped { get; set; }
                    [DataMember(Order = 5)]
                    public string hideOnAssessment { get; set; }
                    [DataMember(Order = 6)]
                    public string questionId { get; set; }

                }
                public class Question
                {
                    public string questionId { get; set; }
                    public string questionTag { get; set; }
                    public string questionText { get; set; }
                    public string questionPrompt { get; set; }
                    public string questionOrder { get; set; }
                    public string questionAnswerStyle { get; set; }
                    public string questionDefaultAnswer { get; set; }
                    public string questionRequiresAnswer { get; set; }
                    public string hideOnAssessment { get; set; }
                }

                public class QuestionSet
                {
                    public string questionSetId { get; set; }
                    public string questionSetTitle { get; set; }
                    public string questionSetType { get; set; }
                    public string questionSetAnswerRowcount { get; set; }
                    public string questionSetAllowAdditionalRows { get; set; }
                }

                public class ConsumerAssessment
                {
                    public string sectionId { get; set; }
                    public string sectionName { get; set; }
                    public string sectionOrder { get; set; }
                    public string applicable { get; set; }
                    public string assessment { get; set; }
                    public string subsectionId { get; set; }
                    public string subsectionName { get; set; }
                    public string subsectionOrder { get; set; }
                    public string questionSetId { get; set; }
                    public string questionSetTitle { get; set; }
                    public string questionSetOrder { get; set; }
                    public string questionSetType { get; set; }
                    public string questionSetAllowMultirowInserts { get; set; }
                    public string questionId { get; set; }
                    public string questionTag { get; set; }
                    public string questionText { get; set; }
                    public string questionPrompt { get; set; }
                    public string questionOrder { get; set; }
                    public string hideOnAssessment { get; set; }
                    public string questionAnswerStyle { get; set; }
                    public string questionAnswerOptions { get; set; }
                    public string questionDefaultAnswer { get; set; }
                    public string questionRequiresAnswer { get; set; }
                    public string questionConditionalQuestionId { get; set; }
                    public string questionConditionalAnswerText { get; set; }
                    public string answerId { get; set; }
                    public string answerRow { get; set; }
                    public string answerText { get; set; }
                    public string skipped { get; set; }
                }

                public class ConsumerRelationships
                {
                    public string firstName { get; set; }
                    public string lastName { get; set; }
                    public string middleName { get; set; }
                }

                public class ConsumerNameInfo
                {
                    public string firstName { get; set; }
                    public string lastName { get; set; }
                    public string middleName { get; set; }
                    public string nickName { get; set; }
                }
                public class AttachmentList
                {
                    public string planAttachmentId { get; set; }
                    public string attachmentId { get; set; }
                    public string questionId { get; set; }
                    public string description { get; set; }
                }
                #endregion

                #region HELPER METHODS
                private string getDefaultAnswer(string defaultAnswerString, string existingAnswer, int answerRow)
                {

                    // parse default answers into an array of default answers based on the '~~' delimeter
                    string[] separatingStrings = { "~~" };
                    string[] defaultAnswers = defaultAnswerString.Split(separatingStrings, System.StringSplitOptions.RemoveEmptyEntries);

                    // if question contains a list of default answers, get the one that matches the current answer row or return null of none
                    string defaultAnswer = answerRow <= defaultAnswers.Length ? defaultAnswers[answerRow - 1] : null;

                    switch (defaultAnswer)
                    {
                        // for special cases, override existing answer
                        case "==TODAY":
                            defaultAnswer = DateTime.Now.ToString("yyyy-MM-dd");
                            break;
                        default:
                            // if existing answer has a value, override the default answer
                            defaultAnswer = String.IsNullOrEmpty(existingAnswer) ? defaultAnswer : existingAnswer;
                            break;
                    }

                    return defaultAnswer;
                }
                #endregion

                #region CREATE METHODS
                public void insertAssessmentAnswers(string consumerPlanId, string priorConsumerPlanId, string targetAssessmentVersionId, string userId, string effectiveStart, string effectiveEnd, string revision, DistributedTransaction dbTransaction, string token)
                {
                    List<ConsumerAssessment> priorAssessmentQuestionsAndAnswers = js.Deserialize<List<ConsumerAssessment>>(adg.getConsumerAssessment(priorConsumerPlanId, "YES", dbTransaction));
                    if (priorConsumerPlanId != null)
                    {
                        pow.carryOverOutcomesToNewPlan(consumerPlanId, priorConsumerPlanId, targetAssessmentVersionId, token);
                        ssW.carryOverServicesToNewPlan(consumerPlanId, priorConsumerPlanId, effectiveStart, effectiveEnd, targetAssessmentVersionId, token, revision);
                        pciw.carryOverContactToNewPlan(consumerPlanId, priorConsumerPlanId, token);
                        psw.carryOverTeamMembersToNewPlan(consumerPlanId, priorConsumerPlanId, token);
                        picw.carryOverInformedConsentToNewPlan(consumerPlanId, priorConsumerPlanId, token, revision);
                        adg.carryOverApplicable(consumerPlanId, priorConsumerPlanId, effectiveStart);
                        // piw.carryOverPlanIntroduction(consumerPlanId, priorConsumerPlanId, token);
                        carryOverPlanAttachments(token, long.Parse(consumerPlanId), long.Parse(priorConsumerPlanId));
                    }


                    if (priorConsumerPlanId == null)
                    // if (true == true)
                    {
                        QuestionSet[] questionSets = js.Deserialize<QuestionSet[]>(adg.getQuestionSets(targetAssessmentVersionId, dbTransaction));
                        foreach (QuestionSet qset in questionSets)
                        {
                            Int32 answerRows = Int32.Parse(qset.questionSetAnswerRowcount);

                            Question[] questions = js.Deserialize<Question[]>(adg.getQuestions(qset.questionSetId, dbTransaction));

                            // for each row, insert each question in the question set
                            for (int i = 1; i <= answerRows; i++)
                            {
                                foreach (Question question in questions)
                                {
                                    string existingAnswer = null;

                                    // look for answer in prior plan and set it to that
                                    existingAnswer = priorAssessmentQuestionsAndAnswers.FirstOrDefault(q => q.questionTag.Equals(question.questionTag) && q.answerRow.Equals(i.ToString()))?.answerText;
                                    //existingAnswer = priorAssessmentQuestionsAndAnswers.FirstOrDefault(q => q.questionTag.Equals(question.questionTag) && q.answerRow.Equals(i.ToString()) && q.questionId.Equals(question.questionId.ToString()))?.answerText;

                                    // get the default or existing answer
                                    string answer = getDefaultAnswer(question.questionDefaultAnswer, existingAnswer, i);

                                    if (question.questionTag == "servicesSupports_paidSupports" && question.questionText == "Begin Date" && revision == "false")
                                    {
                                        answer = effectiveStart;
                                    }
                                    if (question.questionTag == "servicesSupports_paidSupports" && question.questionText == "End Date" && revision == "false")
                                    {
                                        answer = effectiveEnd;
                                    }

                                    // insert answer record
                                    adg.insertConsumerAssessmentAnswer(consumerPlanId, question.questionId, i.ToString(), answer, userId, "N", dbTransaction);
                                }
                            }
                        }
                    }
                    else
                    {
                        QuestionSet[] questionSets = js.Deserialize<QuestionSet[]>(adg.getQuestionSetsTwo(priorConsumerPlanId, targetAssessmentVersionId));
                        //QuestionSet[] questionSets = js.Deserialize<QuestionSet[]>(adg.getQuestionSets(targetAssessmentVersionId, dbTransaction));
                        foreach (QuestionSet qset in questionSets)
                        {
                            Int32 answerRows = Int32.Parse(qset.questionSetAnswerRowcount);

                            Question[] questions = js.Deserialize<Question[]>(adg.getQuestions(qset.questionSetId, dbTransaction));

                            // for each row, insert each question in the question set
                            for (int i = 1; i <= answerRows; i++)
                            {
                                foreach (Question question in questions)//
                                {
                                    string existingAnswer = null;

                                    // look for answer in prior plan and set it to that
                                    existingAnswer = priorAssessmentQuestionsAndAnswers.FirstOrDefault(q => q.questionTag.Equals(question.questionTag) && q.answerRow.Equals(i.ToString()))?.answerText;
                                    //existingAnswer = priorAssessmentQuestionsAndAnswers.FirstOrDefault(q => q.questionTag.Equals(question.questionTag) && q.answerRow.Equals(i.ToString()) && q.questionId.Equals(question.questionId.ToString()))?.answerText;

                                    // get the default or existing answer
                                    string answer = getDefaultAnswer(question.questionDefaultAnswer, existingAnswer, i);

                                    if (question.questionTag == "servicesSupports_paidSupports" && question.questionText == "Begin Date" && revision == "false")
                                    {
                                        answer = effectiveStart;
                                    }
                                    if (question.questionTag == "servicesSupports_paidSupports" && question.questionText == "End Date" && revision == "false")
                                    {
                                        answer = effectiveEnd;
                                    }

                                    // insert answer record
                                    adg.insertConsumerAssessmentAnswer(consumerPlanId, question.questionId, i.ToString(), answer, userId, "N", dbTransaction);
                                }
                            }
                        }
                    }



                    //QuestionSet[] questionSets = js.Deserialize<QuestionSet[]>(adg.getQuestionSets(targetAssessmentVersionId, dbTransaction));

                    //pow.carryOverOutcomesToNewPlan(consumerPlanId, priorConsumerPlanId);
                }
                public AssessmentAnswer[] insertAssessmentGridRowAnswers(string token, string consumerPlanId, string assessmentQuestionSetId)
                {
                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            List<AssessmentAnswer> gridRowAnswers = new List<AssessmentAnswer>();
                            string answerStyle = "";
                            // validate session token
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            // validate input
                            if (String.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");
                            if (String.IsNullOrEmpty(assessmentQuestionSetId)) throw new Exception("assessmentQuestionSetId is required");

                            // get the userId
                            String userId = adg.getSessionUserId(token, transaction);
                            if (userId == null || userId == "") throw new Exception("failed to retrieve session userId");

                            // get the existing plan so we can validate it exists.
                            ConsumerPlan existingPlan = js.Deserialize<List<ConsumerPlan>>(adg.getConsumerPlan(consumerPlanId, transaction)).FirstOrDefault();

                            if (existingPlan == null) throw new Exception("a problem occured while trying to retrieve the consumer plan");

                            QuestionSet questionSet = js.Deserialize<List<QuestionSet>>(adg.getQuestionSet(assessmentQuestionSetId, transaction)).FirstOrDefault();

                            if (questionSet == null) throw new Exception("a problem occured while trying to retrieve the question set");

                            // validate that the question set is a GRID that allows additional rows
                            if (questionSet.questionSetAllowAdditionalRows != "True" || questionSet.questionSetType != QuestionSetType.Grid) throw new Exception("this question set does not allow additional rows to be added");

                            // get all the questions (Columns) that are a part of this question set (GRID)
                            Question[] questions = js.Deserialize<Question[]>(adg.getQuestions(questionSet.questionSetId, transaction));

                            //new attempt
                            //Question[] questions = js.Deserialize<Question[]>(adg.getQuestionsWithoutHidden(questionSet.questionSetId, transaction));

                            // get the next available row number to insert into the grid
                            // [note] the row number may not coincide with the number of rows in the question set since deletes can create gaps
                            int rowNumber = Int32.Parse(adg.getNextAssessmentAnswerRowNumber(consumerPlanId, questionSet.questionSetId, transaction));

                            // loop through each question (column) in the question set (grid)
                            foreach (Question question in questions)
                            {
                                // get the default answer if one is defined
                                string answerText = getDefaultAnswer(question.questionDefaultAnswer, null, rowNumber);

                                // insert answer row
                                string answerId = adg.insertConsumerAssessmentAnswer(consumerPlanId, question.questionId, rowNumber.ToString(), answerText, userId, "N", transaction);

                                if (answerId == null) throw new Exception("A problem occured while trying to insert an answer row");

                                AssessmentAnswer answer = new AssessmentAnswer
                                {
                                    answerId = answerId,
                                    answerRow = rowNumber.ToString(),
                                    answerText = answerText,
                                    answerStyle = question.questionAnswerStyle,
                                    hideOnAssessment = question.hideOnAssessment,
                                    questionId = question.questionId
                                };

                                gridRowAnswers.Add(answer);
                            }

                            return gridRowAnswers.ToArray();

                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }

                }
                #endregion

                #region READ METHODS          
                public ConsumerAssessment[] getConsumerAssessment(string token, string consumerPlanId)
                {
                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            string assessmentString = adg.getConsumerAssessment(consumerPlanId, "NO", transaction);
                            js.MaxJsonLength = Int32.MaxValue;
                            ConsumerAssessment[] assessmentObj = js.Deserialize<ConsumerAssessment[]>(assessmentString);
                            return assessmentObj;
                        }
                        catch (Exception ex)
                        {
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }
                }

                public ConsumerRelationships[] getConsumerRelationships(string token, string consumerId, string effectiveStartDate, string effectiveEndDate, string areInSalesForce, string planId)
                {
                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            string relationshipString = adg.getConsumerRelationships(consumerId, effectiveStartDate, effectiveEndDate, areInSalesForce, planId, transaction);
                            ConsumerRelationships[] relationshipObj = js.Deserialize<ConsumerRelationships[]>(relationshipString);
                            return relationshipObj;
                        }
                        catch (Exception ex)
                        {
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }
                }

                public ConsumerNameInfo[] getConsumerNameInfo(string token, string consumerId)
                {
                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            string nameInfoString = adg.getConsumerNameInfo(consumerId, transaction);
                            ConsumerNameInfo[] nameInfoObj = js.Deserialize<ConsumerNameInfo[]>(nameInfoString);
                            return nameInfoObj;
                        }
                        catch (Exception ex)
                        {
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }
                }
                #endregion

                #region UPDATE METHODS
                public int updateAssessmentAnswers(string token, AssessmentAnswer[] answers)
                {

                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            String userId = adg.getSessionUserId(token, transaction);
                            if (userId == null || userId == "") throw new Exception("failed to retrieve session userId");

                            int rowsUpdated = 0;

                            foreach (AssessmentAnswer answer in answers)
                            {
                                if (answer.answerId == null) throw new Exception("answerId is required for update");
                                // update the answer
                                rowsUpdated += adg.updateAssessmentAnswer(answer.answerId, answer.answerText, answer.skipped, userId, transaction);
                            }

                            return rowsUpdated;
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }

                }

                public int updateConsumerNameInfo(string token, string consumerId, string firstName, string lastName, string middleName, string nickName)
                {
                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            int rowsUpdated = 0;

                            rowsUpdated += adg.updateConsumerNameInfo(consumerId, firstName, lastName, middleName, nickName, transaction);
                            return rowsUpdated;
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }
                }

                public void carryOverPlanAttachments(string token, long consumerPlanId, long priorConsumerPlanId)
                {
                    string attachmentsString = adg.getPlanAttachmentsList(token, priorConsumerPlanId, "");
                    AttachmentList[] attachmentsObj = js.Deserialize<AttachmentList[]>(attachmentsString);
                    for (int i = 0; i < attachmentsObj.Length; i++)
                    {
                        adg.carryoverPlanAttachment(token, consumerPlanId, priorConsumerPlanId, attachmentsObj[i].attachmentId, long.Parse(attachmentsObj[i].questionId), long.Parse(attachmentsObj[i].planAttachmentId));
                    }
                }
                #endregion

                #region DELETE METHODS 
                public string deleteAssessmentGridRowAnswers(string token, string consumerPlanId, string assessmentQuestionSetId, string[] rowsToDelete)
                {
                    using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            // validate session token
                            if (!adg.validateToken(token, transaction)) throw new Exception("invalid session token");

                            // validate input
                            if (String.IsNullOrEmpty(consumerPlanId)) throw new Exception("consumerPlanId is required");
                            if (String.IsNullOrEmpty(assessmentQuestionSetId)) throw new Exception("assessmentQuestionSetId is required");

                            // throw error if rows to delete are not specified
                            if (rowsToDelete == null || rowsToDelete.Length == 0) throw new Exception("please specify which rows to delete");

                            // get the existing plan so we can validate it exists.
                            ConsumerPlan existingPlan = js.Deserialize<List<ConsumerPlan>>(adg.getConsumerPlan(consumerPlanId, transaction)).FirstOrDefault();

                            if (existingPlan == null) throw new Exception("a problem occured while trying to retrieve the consumer plan");

                            // get the question set so we can validate it exists.
                            QuestionSet questionSet = js.Deserialize<List<QuestionSet>>(adg.getQuestionSet(assessmentQuestionSetId, transaction)).FirstOrDefault();

                            if (questionSet == null) throw new Exception("a problem occured while trying to retrieve the question set");

                            // validate that the question set is a GRID that allows additional rows to be added or removed
                            if (questionSet.questionSetAllowAdditionalRows != "True" || questionSet.questionSetType != QuestionSetType.Grid) throw new Exception("this question set does not allow rows to be removed");

                            for (int i = 0; i < rowsToDelete.Length; i++)
                            {
                                // deletes any question answers for the specified consumer plan, question set, and row
                                int deletedAnswers = adg.deleteConsumerAssessmentAnswerRow(consumerPlanId, assessmentQuestionSetId, rowsToDelete[i], transaction);
                                if (deletedAnswers == 0) throw new Exception("row was not deleted");
                            }

                            // all rows were deleted
                            return "success";

                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                        }
                    }

                }
                #endregion  
            }
        }
    }
}