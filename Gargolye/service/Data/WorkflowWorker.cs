using iTextSharp.text;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereAttachmentWorker;
using static Anywhere.service.Data.PlanSignature.PlanSignatureWorker;
using static Anywhere.service.Data.WorkflowWorker;

namespace Anywhere.service.Data
{
    public class WorkflowWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        WorkflowDataGetter wfdg = new WorkflowDataGetter();
        PlanDataGetter pdg = new PlanDataGetter();

        #region WORKFLOW TEMPLATE DATA OBJECTS
        public class PeopleRelationship
        {
            public string isA { get; set; }
            public string hasA { get; set; }
            public string relationshipTypeId { get; set; }
            public string relationshipType { get; set; }
            public string peopleId { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string startDate { get; set; }
            public string endDate { get; set; }
        }
        public class WorkflowProcess
        {
            public string processId { get; set; }
            public string moduleName { get; set; }
            public string description { get; set; }
        }
        public class WorkflowTemplate
        {
            public string templateId { get; set; }
            public string processId { get; set; }
            public string name { get; set; }
            public string active { get; set; }
            public string description { get; set; }
            public string autoCreate { get; set; }
        }
        public class WorkflowTemplateGroup
        {
            public string groupId { get; set; }
            public string templateId { get; set; }
            public string groupOrder { get; set; }
            public string groupName { get; set; }
        }
        [DataContract]
        public class WorkflowTemplateStatus
        {
            [DataMember(Order = 0)]
            public string statusId { get; set; }
            [DataMember(Order = 1)]
            public string templateId { get; set; }
            [DataMember(Order = 2)]
            public string statusOrder { get; set; }
            [DataMember(Order = 3)]
            public string description { get; set; }
        }
        public class WorkflowTemplateStep
        {
            public string stepId { get; set; }
            public string groupId { get; set; }
            public string stepOrder { get; set; }
            public string description { get; set; }
            public string responsiblePartyType { get; set; }
            public string responsiblePartyRelationshipTypeId { get; set; }
            public string responsiblePartyId { get; set; }
            public string isChecklist { get; set; }
            public string allowStepEdit { get; set; }
            public string powerBIReporting { get; set; }
        }
        public class WorkflowTemplateStepEvent
        {
            public string stepEventId { get; set; }
            public string stepId { get; set; }
            public string eventId { get; set; }
            public string eventParameters { get; set; }
            public string eventDescription { get; set; }
        }
        public class WorkflowTemplateStepEventAction
        {
            public string stepEventActionId { get; set; }
            public string stepEventId { get; set; }
            public string actionId { get; set; }
            public string actionParameter { get; set; }
            public string actionDescription { get; set; }
        }
        public class WorkflowTemplateStepDocument
        {
            public string stepDocumentId { get; set; }
            public string stepId { get; set; }
            public string docOrder { get; set; }
            public string description { get; set; }
            public string attachmentId { get; set; }
            public string attachmentType { get; set; }
            public string wfName { get; set; }
            public string workflowId { get; set; }
            public string WFTemplateId { get; set; }

        }

        public class ActionInfo
        {
            public string WF_ID { get; set; }
            public string Current_Status_ID { get; set; }
            public string WF_Group_ID { get; set; }
            public string WF_Action_ID { get; set; }
            public string WF_Action_Parameters { get; set; }
            public string WF_Event_ID { get; set; }
            public string WF_Event_Parameters { get; set; }
            public string WF_Step_ID { get; set; }
            public string Step_Order { get; set; }
            public string WF_Step_Event_ID { get; set; }


        }

        public class PlanInfo
        {
            public string consumerPlanId { get; set; }
            public string planType { get; set; }
            public string revisionNumber { get; set; }
            public string planYearStart { get; set; }
            public string planYearEnd { get; set; }
            public string effectiveStart { get; set; }
            public string effectiveEnd { get; set; }
            public string planStatus { get; set; }
            public string IndivNameLastFirst { get; set; }
            public string IndivNameFirstMLast { get; set; }
            public string IndivNameFirstL { get; set; }
            public string IndivNameFLast5 { get; set; }
            public string ResidentNumber { get; set; }
            public string serviceProviders { get; set; }
            public string CaseManagerNameLastFirst { get; set; }
            public string CaseManagerNameFirstLast { get; set; }
            public string Sender { get; set; }

        }

        public class StepInfo
        {
            public string DueDate { get; set; }
            public string DoneDate { get; set; }
            public string StartDate { get; set; }
            public string ResponsibleFirstLast { get; set; }
            public string TemplateName { get; set; }
            public string GroupName { get; set; }
            public string StepName { get; set; }

        }

        public class RosterInfo
        {
            public string IndivNameLastFirst { get; set; }
            public string IndivNameFirstMLast { get; set; }
            public string IndivNameFirstL { get; set; }
            public string IndivNameFLast5 { get; set; }
            public string ResidentNumber { get; set; }
            public string serviceProviders { get; set; }
            public string CaseManagerNameLastFirst { get; set; }
            public string CaseManagerNameFirstLast { get; set; }
            public string Sender { get; set; }

        }

        public class wfEmailInfo
        {
            public string To_Option { get; set; }
            public string To_Addresses { get; set; }
            public string CC_Option { get; set; }
            public string CC_Addresses { get; set; }
            public string BCC_Option { get; set; }
            public string BCC_Addresses { get; set; }
            public string From_Option { get; set; }
            public string From_Address { get; set; }
            public string Subject { get; set; }
            public string Body { get; set; }
        }

        #endregion

        #region WORKFLOW TEMPLATE METHODS
        public WorkflowProcess[] getWorkflowProcesses(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    WorkflowProcess[] processes = js.Deserialize<WorkflowProcess[]>(wfdg.getWorkflowProcesses(transaction));
                    return processes;
                }
                catch (Exception ex)
                {
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public WorkflowTemplate[] getWorkflowTemplates(string token, string processId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string workflowTemplatesString = wfdg.getWorkflowTemplates(processId, transaction);
                    WorkflowTemplate[] workflowTemplatesObj = js.Deserialize<WorkflowTemplate[]>(workflowTemplatesString);
                    return workflowTemplatesObj;
                }
                catch (Exception ex)
                {
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public WorkflowTemplateStatus[] getWorkflowTemplateStatuses(string token, string templateId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string workflowTemplateStatusesString = wfdg.getWorkflowTemplateStatuses(templateId, transaction);
                    WorkflowTemplateStatus[] workflowTemplateStatusesObj = js.Deserialize<WorkflowTemplateStatus[]>(workflowTemplateStatusesString);
                    return workflowTemplateStatusesObj;
                }
                catch (Exception ex)
                {
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        #endregion

        #region WORKFLOW DATA OBJECTS  
        [DataContract]
        public class OrderObject
        {
            [DataMember(Order = 0)]
            public string id { get; set; }
            [DataMember(Order = 1)]
            public string order { get; set; }
        }
        [DataContract]
        public class PeopleName
        {
            [DataMember(Order = 0)]
            public string peopleId { get; set; }
            [DataMember(Order = 1)]
            public string lastName { get; set; }
            [DataMember(Order = 2)]
            public string firstName { get; set; }
            [DataMember(Order = 3)]
            public string middleName { get; set; }
        }

        [DataContract]
        public class ResponsiblePartyRelationship
        {
            [DataMember(Order = 0)]
            public string responsiblePartyType { get; set; }
            [DataMember(Order = 1)]
            public string description { get; set; }
            [DataMember(Order = 2)]
            public string responsiblePartyId { get; set; }

        }

        [DataContract]
        public class ResponsibleParty
        {
            [DataMember(Order = 0)]
            public string ID { get; set; }

        }

        [DataContract]
        public class Workflow
        {
            [DataMember(Order = 0)]
            public string workflowId { get; set; }
            [DataMember(Order = 1)]
            public string processId { get; set; }
            [DataMember(Order = 2)]
            public string processName { get; set; }
            [DataMember(Order = 2)]
            public string name { get; set; }
            [DataMember(Order = 3)]
            public string referenceId { get; set; }
            [DataMember(Order = 4)]
            public string description { get; set; }
            [DataMember(Order = 5)]
            public string currentStatusId { get; set; }
            [DataMember(Order = 6)]
            public WorkflowStatus[] statuses { get; set; }
            [DataMember(Order = 7)]
            public WorkflowGroup[] groups { get; set; }
            [DataMember(Order = 8)]
            public string addedToPlan { get; set; }

        }
        [DataContract]
        public class WorkflowStatus
        {
            [DataMember(Order = 0)]
            public string statusId { get; set; }
            [DataMember(Order = 1)]
            public string workflowId { get; set; }
            [DataMember(Order = 2)]
            public string statusOrder { get; set; }
            [DataMember(Order = 3)]
            public string description { get; set; }
        }
        [DataContract]
        public class WorkflowGroup
        {
            [DataMember(Order = 0)]
            public string groupId { get; set; }
            [DataMember(Order = 1)]
            public string workflowId { get; set; }
            [DataMember(Order = 2)]
            public string groupOrder { get; set; }
            [DataMember(Order = 3)]
            public string groupName { get; set; }
            [DataMember(Order = 4)]
            public WorkflowStep[] steps { get; set; }
        }
        [DataContract]
        public class WorkflowStep
        {
            [DataMember(Order = 0)]
            public string stepId { get; set; }
            [DataMember(Order = 1)]
            public string groupId { get; set; }
            [DataMember(Order = 2)]
            public string stepOrder { get; set; }
            [DataMember(Order = 3)]
            public string description { get; set; }
            [DataMember(Order = 4)]
            public string responsiblePartyId { get; set; }
            [DataMember(Order = 5)]
            public string isChecklist { get; set; }
            [DataMember(Order = 6)]
            public string dueDate { get; set; }
            [DataMember(Order = 7)]
            public string startDate { get; set; }
            [DataMember(Order = 8)]
            public string doneDate { get; set; }
            [DataMember(Order = 9)]
            public string comments { get; set; }
            [DataMember(Order = 10)]
            public string isApplicable { get; set; }
            [DataMember(Order = 11)]
            public WorkflowStepDocument[] documents { get; set; }
            [DataMember(Order = 12)]
            public WorkflowStepEvent[] events { get; set; }
            [DataMember(Order = 13)]
            public string responsiblePartytype { get; set; }
            [DataMember(Order = 14)]
            public string allowStepEdit { get; set; }
            [DataMember(Order = 15)]
            public string powerBIReporting { get; set; }
        }

        [DataContract]
        public class WorkflowEditedStep
        {
            [DataMember(Order = 0)]
            public WorkflowEditedStepStatus stepDoneDate { get; set; }

            [DataMember(Order = 1)]
            public WorkflowEditedStepStatus stepDueDate { get; set; }

            [DataMember(Order = 2)]
            public WorkflowEditedStepStatus stepResponsiblePartyId { get; set; }

            [DataMember(Order = 3)]
            public WorkflowEditedStepStatus stepStartDate { get; set; }

            [DataMember(Order = 4)]
            public WorkflowEditedStepStatus workflowStatus { get; set; }
        }

        public class WFSDInfo
        {
            public string documentId { get; set; }
            public string attachmentId { get; set; }
        }

        public class WorkflowEditedStepStatus
        {
            public string isChanged { get; set; }

            public string original { get; set; }

            public string modified { get; set; }

            public string eventId { get; set; }

            public string eventType { get; set; }

            public string eventTypeId { get; set; }
            public string stepId { get; set; }
        }

        public class ActionStatus
        {
            public string WF_Status_Id { get; set; }
        }


        [DataContract]
        public class WorkflowStepDocument
        {
            [DataMember(Order = 0)]
            public string documentId { get; set; }
            [DataMember(Order = 1)]
            public string stepId { get; set; }
            [DataMember(Order = 2)]
            public string docOrder { get; set; }
            [DataMember(Order = 3)]
            public string description { get; set; }
            [DataMember(Order = 4)]
            public string attachmentId { get; set; }
            [DataMember(Order = 5)]
            public string documentEdited { get; set; }
            [DataMember(Order = 6)]
            public string attachmentType { get; set; }
        }
        [DataContract]
        public class DocumentAttachment
        {
            [DataMember(Order = 0)]
            public string documentId { get; set; }
            [DataMember(Order = 1)]
            public string attachmentId { get; set; }
            public string attachmentType { get; set; }

        }
        [DataContract]
        public class WorkflowStepEvent
        {
            [DataMember(Order = 0)]
            public string stepEventId { get; set; }
            [DataMember(Order = 1)]
            public string stepId { get; set; }
            [DataMember(Order = 2)]
            public string eventId { get; set; }
            [DataMember(Order = 3)]
            public WorkflowEventAction[] actions { get; set; }
        }
        [DataContract]
        public class WorkflowEventAction
        {
            [DataMember(Order = 0)]
            public string eventActionId { get; set; }
            [DataMember(Order = 1)]
            public string stepEventId { get; set; }
            [DataMember(Order = 2)]
            public string actionId { get; set; }
        }

        [DataContract]
        public class ResponsiblePartyClassification
        {
            [DataMember(Order = 0)]
            public string typeID { get; set; }
            [DataMember(Order = 1)]
            public string description { get; set; }

        }
        #endregion

        #region WORKFLOW METHODS
        public string deleteWorkflowStep(string token, string stepId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (stepId == null) throw new Exception("stepId is required");

                    // insert group steps
                    String rowsDeleted = wfdg.deleteWorkflowStep(stepId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public string deleteWorkflowStepDocument(string token, string documentId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (documentId == null) throw new Exception("documentId is required");

                    // insert group steps
                    String rowsDeleted = wfdg.deleteWorkflowStepDocument(documentId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string deleteWorkflow(string token, string workflowId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (workflowId == null) throw new Exception("workflowId is required");

                    // insert group steps
                    String rowsDeleted = wfdg.deleteWorkflow(workflowId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public PeopleName[] getPeopleNames(string token, string peopleId, string TypeId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    PeopleName[] people = js.Deserialize<PeopleName[]>(wfdg.getPeopleNames(peopleId, TypeId, transaction));
                    return people;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ResponsiblePartyRelationship[] getWFResponsibleParties(string token, string workflowId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ResponsiblePartyRelationship[] relationships = js.Deserialize<ResponsiblePartyRelationship[]>(wfdg.getWFResponsibleParties(token, workflowId));
                    return relationships;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Workflow[] getWFwithMissingResponsibleParties(string token, string workflowIds)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    // if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Workflow[] workflows = js.Deserialize<Workflow[]>(wfdg.getWFwithMissingResponsibleParties(token, workflowIds, transaction));
                    return workflows;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public WorkflowStep[] getResponsiblePartyIdforThisEditStep(string token, string stepId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    // if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    WorkflowStep[] steps = js.Deserialize<WorkflowStep[]>(wfdg.getResponsiblePartyIDforThisEditStep(stepId, transaction));
                    return steps;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ResponsiblePartyClassification[] getResponsiblePartyClassification(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    ResponsiblePartyClassification[] steps = js.Deserialize<ResponsiblePartyClassification[]>(wfdg.getResponsiblePartyClassification(token, transaction));
                    return steps;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Workflow[] getWorkflows(string token, string processId, string referenceId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (processId == null) throw new Exception("processId is a required parameter");
                    if (referenceId == null) throw new Exception("referenceId is a required parameter");

                    Workflow[] workflows = js.Deserialize<Workflow[]>(wfdg.getWorkflows(processId, referenceId, transaction));

                    foreach (Workflow w in workflows)
                    {

                        w.statuses = js.Deserialize<WorkflowStatus[]>(wfdg.getWorkflowStatuses(w.workflowId, transaction));
                        w.groups = js.Deserialize<WorkflowGroup[]>(wfdg.getWorkflowGroups(w.workflowId, transaction));

                        WorkflowStep[] steps = js.Deserialize<WorkflowStep[]>(wfdg.getWorkflowSteps(w.workflowId, transaction));
                        WorkflowStepDocument[] docs = js.Deserialize<WorkflowStepDocument[]>(wfdg.getWorkflowDocumentDescriptions(w.workflowId, transaction));
                        WorkflowStepEvent[] events = js.Deserialize<WorkflowStepEvent[]>(wfdg.getWorkflowDocumentDescriptions(w.workflowId, transaction));
                        WorkflowEventAction[] actions = js.Deserialize<WorkflowEventAction[]>(wfdg.getWorkflowDocumentDescriptions(w.workflowId, transaction));

                        foreach (WorkflowGroup g in w.groups)
                        {
                            g.steps = Array.FindAll(steps, s => s.groupId == g.groupId);

                            foreach (WorkflowStep s in g.steps)
                            {
                                s.documents = Array.FindAll(docs, d => d.stepId == s.stepId);
                                s.events = Array.FindAll(events, e => e.stepId == s.stepId);

                                foreach (WorkflowStepEvent e in s.events)
                                {
                                    e.actions = Array.FindAll(actions, a => a.stepEventId == e.stepEventId);
                                }
                            }
                        }
                    }

                    return workflows;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public string insertAutomatedWorkflows(string token, string processId, string peopleId, string referenceId, string priorConsumerPlanId)
        {

            try
            {

                List<WorkflowTemplate> automatedTemplates;
                List<string> workflowIds = new List<string>();

                using (DistributedTransaction transaction_templates = new DistributedTransaction(DbHelper.ConnectionString))
                {

                    if (!wfdg.validateToken(token, transaction_templates)) throw new Exception("invalid session token");

                    if (processId == null) throw new Exception("processId is required");

                    List<WorkflowTemplate> templates = js.Deserialize<List<WorkflowTemplate>>(wfdg.getWorkflowTemplates(processId, transaction_templates));
                    if (templates == null) throw new Exception("a problem occured while trying to retrieve the workflow templates");

                    automatedTemplates = templates.FindAll(t => t.autoCreate.Equals("True"));
                    transaction_templates.Commit();

                }

                foreach (WorkflowTemplate template in automatedTemplates)
                {
                    using (DistributedTransaction transaction_insertWF = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        string workflowId = "";
                        try
                        {
                            workflowId = insertWorkflowFromTemplate(token, template.templateId, peopleId, referenceId, "True", "", priorConsumerPlanId, transaction_insertWF);
                            //string workflowId = insertWorkflowFromTemplate(token, template.templateId, peopleId, referenceId, "True", transaction_insertWF);

                            workflowIds.Add(workflowId);
                        }
                        catch (Exception ex)
                        {
                            transaction_insertWF.Rollback();
                            throw new Exception("A problem occured while inserting the " + template.name + " automated workflow template: " + ex.Message);
                        }
                    }
                }

                // return list of inserted WorkflowIds
                return string.Join(",", workflowIds.ToArray());
            }
            catch (Exception ex)
            {

                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }


        }

        public string isWorkflowAutoCreated(string token, string workflowName)
        {
            try
            {
                if (workflowName == null) throw new Exception("workflowName is required");

                String isAutoCreated = wfdg.isWorkflowAutoCreated(workflowName);

                return isAutoCreated;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }

        }

        public string insertWorkflow(string token, string templateId, string peopleId, string referenceId, string wantedFormAttachmentIds)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    return insertWorkflowFromTemplate(token, templateId, peopleId, referenceId, "True", "", "", transaction);
                    // return insertWorkflowFromTemplate(token, templateId, peopleId, referenceId, "True", transaction);

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public string insertWorkflowStep(string token, WorkflowStep step)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (step == null) throw new Exception("step object is required");
                    if (step.groupId == null) throw new Exception("groupId is required");
                    if (step.stepOrder == null) throw new Exception("stepOrder is required");
                    if (step.description == null) throw new Exception("description is required");
                    //if(step.allowStepEdit == null)
                    //{
                    //    step.allowStepEdit.Equals("True");
                    //}


                    string isChecklist = step.isChecklist == null ? "False" : (step.isChecklist == "1" || step.isChecklist.Equals("True", StringComparison.InvariantCultureIgnoreCase)) ? "True" : "False";
                    string isApplicable = "True";
                    string powerBIReporting = "N";

                    // insert group step
                    String stepId = wfdg.insertWorkflowStep(step.groupId, step.stepOrder, step.description, step.responsiblePartyId, step.responsiblePartytype, isChecklist, step.dueDate, step.startDate, step.doneDate, step.comments, isApplicable, "True", powerBIReporting, transaction);

                    return stepId;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public DocumentAttachment insertWorkflowStepDocument(string token, string stepId, string docOrder, string description, string attachmentType, string attachment, string documentEdited)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (stepId == null) throw new Exception("stepId is required");
                    if (description == null) throw new Exception("description is required");
                    if (attachmentType == null) throw new Exception("attachmentType is required");
                    if (attachment == null) throw new Exception("attachment is required");

                    string comments = null;

                    // insert attachment binary data
                    //String attachmentId = wfdg.insertAttachment(attachmentType, attachment, transaction);

                    // insert document
                    string wfsdString = wfdg.insertWorkflowStepDocument(stepId, docOrder, description, "", attachmentType, attachment, comments, documentEdited, transaction);

                    WFSDInfo[] wfsdbj = js.Deserialize<WFSDInfo[]>(wfsdString);
                    String attachmentId = wfsdbj[0].attachmentId;
                    String documentId = wfsdbj[0].documentId;
                    DocumentAttachment documentAttachment = new DocumentAttachment();
                    documentAttachment.documentId = documentId;
                    documentAttachment.attachmentId = attachmentId;

                    return documentAttachment;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public DocumentAttachment updateWorkflowStepDocument(string token, string docId, string attachmentType, string attachment, string documentEdited)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (docId == null) throw new Exception("documentId is required");
                    if (attachmentType == null) throw new Exception("attachmentType is required");
                    if (attachment == null) throw new Exception("attachment is required");

                    string comments = null;

                    // insert attachment binary data
                    //String attachmentId = wfdg.insertAttachment(attachmentType, attachment, transaction);

                    // insert document
                    string wfsdString= wfdg.updateWorkflowStepDocument(docId, "", attachmentType, attachment, documentEdited, transaction);
                    WFSDInfo[] wfsdbj = js.Deserialize<WFSDInfo[]>(wfsdString);
                    String attachmentId = wfsdbj[0].attachmentId;
                    String documentId = wfsdbj[0].documentId;
                    DocumentAttachment documentAttachment = new DocumentAttachment();
                    documentAttachment.documentId = documentId;
                    documentAttachment.attachmentId = attachmentId;

                    return documentAttachment;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        

        //insertWorkflowStepDocument
        public string setWorkflowStatus(string token, string workflowId, string statusId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (workflowId == null) throw new Exception("workflowId is required");
                    if (statusId == null) throw new Exception("statusId is required");

                    string rowsUpdated = wfdg.setWorkflowStatus(workflowId, statusId, transaction);

                    return rowsUpdated;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public string setWorkflowStepDocumentOrder(string token, OrderObject[] objectOrderArray)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (objectOrderArray == null) throw new Exception("objectOrderArray is required");

                    for (int i = 0; i < objectOrderArray.Length; i++)
                    {
                        if (objectOrderArray[i].id == null) throw new Exception("id cannot be null at index " + i.ToString());
                        if (objectOrderArray[i].order == null) throw new Exception("order cannot be null at index " + i.ToString());
                        string rowsUpdated = wfdg.setWorkflowStepDocumentOrder(objectOrderArray[i].id, objectOrderArray[i].order, transaction);
                        if (rowsUpdated != "1") throw new Exception("workflow step document failed to update order");
                    }

                    return objectOrderArray.Length.ToString();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public string setWorkflowStepOrder(string token, OrderObject[] objectOrderArray)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (objectOrderArray == null) throw new Exception("objectOrderArray is required");

                    for (int i = 0; i < objectOrderArray.Length; i++)
                    {
                        if (objectOrderArray[i].id == null) throw new Exception("id cannot be null at index " + i.ToString());
                        if (objectOrderArray[i].order == null) throw new Exception("order cannot be null at index " + i.ToString());
                        string rowsUpdated = wfdg.setWorkflowStepOrder(objectOrderArray[i].id, objectOrderArray[i].order, transaction);
                        if (rowsUpdated != "1") throw new Exception("workflow step failed to update order");
                    }

                    return objectOrderArray.Length.ToString();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        public string setWorkflowStepDoneDate(string token, string stepId, string doneDate)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string rowsUpdated = wfdg.setWorkflowStepDoneDate(stepId, doneDate, transaction);

                    return rowsUpdated;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string setWorkflowStepDueDate(string token, string stepId, string dueDate)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string rowsUpdated = wfdg.setWorkflowStepDueDate(stepId, dueDate, transaction);

                    return rowsUpdated;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string updateWorkflowStep(string token, WorkflowStep step)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (step == null) throw new Exception("step is required");

                    if (step.stepId == null) throw new Exception("stepId is required");
                    if (step.groupId == null) throw new Exception("groupId is required");
                    if (step.stepOrder == null) throw new Exception("stepOrder is required");

                    string isChecklist = step.isChecklist == null ? "False" : (step.isChecklist == "1" || step.isChecklist.Equals("True", StringComparison.InvariantCultureIgnoreCase)) ? "True" : "False";
                    string isApplicable = step.isApplicable == null ? "False" : (step.isApplicable == "1" || step.isApplicable.Equals("True", StringComparison.InvariantCultureIgnoreCase)) ? "True" : "False";

                    string rowsUpdated = wfdg.updateWorkflowStep(step.stepId, step.groupId, step.stepOrder, step.description, step.responsiblePartyId, isChecklist, step.dueDate, step.startDate, step.doneDate, step.comments, isApplicable, transaction);

                    return rowsUpdated;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string updateRelationshipResponsiblePartyID(string token, string peopleId, string WFID, string responsiblePartyType)
        {

            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");


                    string rowsUpdated = wfdg.updateRelationshipResponsiblePartyID(peopleId, WFID, responsiblePartyType, transaction);

                    string stepsUpdated = wfdg.updateStepResponsiblePartyID(WFID, responsiblePartyType, transaction);

                    return rowsUpdated;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string processWorkflowStepEvent(string token, WorkflowEditedStepStatus thisEvent)
        {
            string eventAutomatedAction = "";
            string returnActionJSONtoUI = "";

            using (DistributedTransaction transaction2 = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    // if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (thisEvent == null) throw new Exception("Event is required");

                    // get all Actions associated with this event
                    eventAutomatedAction = wfdg.processWorkflowStepEvent(thisEvent.eventId, thisEvent.eventType, thisEvent.eventTypeId, thisEvent.stepId, transaction2);
                    js.MaxJsonLength = Int32.MaxValue;
                    List<ActionInfo> theseActions = js.Deserialize<List<ActionInfo>>(eventAutomatedAction);



                    if (thisEvent.eventType == "step" || thisEvent.eventType == "plan")
                    {
                        List<string> listActions = new List<string>();
                        // For the current Step Event - process one event/action pairing at a time
                        foreach (ActionInfo thiswfAction in theseActions)
                        {
                            List<ActionInfo> stepActions = new List<ActionInfo>();
                            List<ActionInfo> wfActiontoProcess = new List<ActionInfo>();
                            wfActiontoProcess.Add(thiswfAction);
                            // For the current Step Event - if Action = 2 (email), replace placeholders in Action_Paramters
                            // For any other Step Action, this simply returns the passed in Action
                            stepActions = getStepUpdateActions(wfActiontoProcess, token);

                            // For the current Step Event - execute one event/action pairing 
                            string thisActionJSON = processWorkflowAction(token, thisEvent, stepActions, transaction2);
                            listActions.Add(thisActionJSON);
                        }
                        // return a list of executed Actions w/ the data
                        returnActionJSONtoUI = Newtonsoft.Json.JsonConvert.SerializeObject(listActions);
                    }
                    else if (thisEvent.eventType == "workflow")
                    {
                        // could have multiple theseActions for this one WorkFlow event -- example Actions: change Due date, start date, 
                        List<ActionInfo> wfActions = new List<ActionInfo>();
                        wfActions = getWorkFlowStatusUpdateActions(theseActions, token);
                        List<string> listActionDates = new List<string>();

                        foreach (ActionInfo thiswfAction in wfActions)
                        {
                            // for workflow events -- could be mulitple events and multiple actions for an event; 
                            // process one event/one action at a time 
                            List<ActionInfo> wfActionstoProcess = new List<ActionInfo>();
                            wfActionstoProcess.Add(thiswfAction);
                            // For the current Workflow Event - execute one event/action pairing 
                            string thisActionDateJSON = processWorkflowAction(token, thisEvent, wfActionstoProcess, transaction2);
                            listActionDates.Add(thisActionDateJSON);

                        }
                        // return a list of executed Actions w/ the data
                        returnActionJSONtoUI = Newtonsoft.Json.JsonConvert.SerializeObject(listActionDates);
                    }

                    return returnActionJSONtoUI;
                }


                catch (Exception ex)
                {
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        private List<ActionInfo> getStepUpdateActions(List<ActionInfo> theseActions, string token)
        {
            List<ActionInfo> wfActions = new List<ActionInfo>();
            List<ActionInfo> wfActionsSorted = new List<ActionInfo>();

            try
            {
                foreach (ActionInfo thisAction in theseActions)
                {
                    if (thisAction.WF_Action_ID == "2")
                    {
                        // wfActions.Clear();
                        string emailActionParameterwithValues = processEmailActionParameter(thisAction, token);

                        // update action_parameter with the modified string (ie, placeholders replaced with values)
                        thisAction.WF_Action_Parameters = emailActionParameterwithValues;
                        wfActions.Add(thisAction);
                    }
                    else // no proessing required, return original passed in list of Actions
                    {
                        wfActions = theseActions;
                    }
                }

                // order the WfActions list in thisAction.Step_Order
                wfActionsSorted = wfActions.OrderBy(o => o.WF_Group_ID).ThenBy(o => o.Step_Order).ToList();

                return wfActionsSorted;
            }
            catch (Exception ex)
            {
                throw new Exception("A problem getting workflow actions: " + ex.Message);
            }
        }


        private List<ActionInfo> getWorkFlowStatusUpdateActions(List<ActionInfo> theseActions, string token)
        {
            List<ActionInfo> wfActions = new List<ActionInfo>();
            List<ActionInfo> wfActionsSorted = new List<ActionInfo>();

            try
            {
                foreach (ActionInfo thisAction in theseActions)
                {
                    if (thisAction.WF_Event_ID == "12") // Event = workflow status is updated 
                    {

                        //check the WF_Event_Parameters -- Statuses=S|Workflow Status=97
                        string[] WFEventParameters = thisAction.WF_Event_Parameters.Split('|');
                        Dictionary<string, string> dict = new Dictionary<string, string>();

                        foreach (string param in WFEventParameters)
                        {
                            if (!string.IsNullOrEmpty(param))
                            {
                                string[] WFP = param.Split('=');
                                dict.Add(WFP[0], WFP[1]);
                            }
                        }


                        if (dict.Count == 0 || dict["Statuses"] == "A")
                        {
                            if (thisAction.WF_Action_ID == "2") thisAction.WF_Action_Parameters = processEmailActionParameter(thisAction, token);

                            wfActions.Add(thisAction);
                        }
                        else if (dict["Statuses"] == "S")
                        {
                            // need to look at thisAction.Current_Status_ID to see if there is a match
                            if (dict["Workflow Status"] == thisAction.Current_Status_ID)
                            {
                                if (thisAction.WF_Action_ID == "2") thisAction.WF_Action_Parameters = processEmailActionParameter(thisAction, token);

                                wfActions.Add(thisAction);
                            }
                        }
                    }
                }

                // order the WfActions list in thisAction.Step_Order
                wfActionsSorted = wfActions.OrderBy(o => o.WF_Group_ID).ThenBy(o => o.Step_Order).ToList();

                return wfActionsSorted;
            }
            catch (Exception ex)
            {
                throw new Exception("A problem getting workflow actions: " + ex.Message);
            }
        }

        private string processEmailActionParameter(ActionInfo thisAction, string token)
        {
            string emailActionParameterwithValues = "";

            try
            {
                System.Text.RegularExpressions.Regex regex = new System.Text.RegularExpressions.Regex(@"\[[^\[\]]+\]");

                List<string> ActionParameterPlaceHolders = new List<string>();
                // get all Placeholders in current Action_Parameters
                foreach (System.Text.RegularExpressions.Match match in regex.Matches(thisAction.WF_Action_Parameters))
                {
                    ActionParameterPlaceHolders.Add(match.Value);
                }
                // dictionary of placeholders (key) and their retrieved values (value)
                Dictionary<string, string> dictPlaceHolderValues = new Dictionary<string, string>();
                dictPlaceHolderValues = getActionParameterValues(ActionParameterPlaceHolders, thisAction, token);
                // replace placeholders with their corresponding values
                var ActionParametersSB = new System.Text.StringBuilder(thisAction.WF_Action_Parameters);
                foreach (var kvp in dictPlaceHolderValues)
                    ActionParametersSB.Replace(kvp.Key, kvp.Value);
                // update action_parameter with the modified string (ie, placeholders replaced with values)
                emailActionParameterwithValues = ActionParametersSB.ToString().Replace("\x0d\x0a", "<br>");
            }
            catch (Exception ex)
            {
                throw new Exception("A problem getting values for Email ActionParameter: " + ex.Message);
            }

            return emailActionParameterwithValues;
        }


        private Dictionary<string, string> getActionParameterValues(List<string> actionParameterPlaceHolders, ActionInfo thisAction, string token)
        {

            string PlanData = "";
            string StepData = "";
            string RosterData = "";
            Dictionary<string, string> dictPlaceHolderValues = new Dictionary<string, string>();

            try
            {
                // getting data for the current step and plan
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    PlanData = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);
                    StepData = wfdg.getWorkFlowStepInfo(thisAction.WF_Step_ID, transaction);
                    RosterData = wfdg.getWorkflowDataForRoster(thisAction.WF_ID, transaction, token);
                }

                PlanInfo[] thesePlans = js.Deserialize<PlanInfo[]>(PlanData);
                StepInfo[] theseSteps = js.Deserialize<StepInfo[]>(StepData);
                RosterInfo[] theseRosters = js.Deserialize<RosterInfo[]>(RosterData);


                // create dictionary (for this Action) of all placeholders (key) and their retrieved values (value)
                foreach (string param in actionParameterPlaceHolders)
                {
                    Boolean parameterFound = false;

                    foreach (PlanInfo thisplan in thesePlans)
                    {
                        Dictionary<string, string> dictPlaceHolderValuesforPlan = new Dictionary<string, string>();
                        dictPlaceHolderValuesforPlan = getPlaceHolderValueforPlan(thisplan, param);
                        if (dictPlaceHolderValuesforPlan.Count > 0)
                        {
                            foreach (var paramvalue in dictPlaceHolderValuesforPlan)
                            {
                                if (!dictPlaceHolderValues.ContainsKey(paramvalue.Key))
                                {
                                    dictPlaceHolderValues.Add(paramvalue.Key, paramvalue.Value);
                                }
                                parameterFound = true;
                            }
                        }
                    }

                    foreach (StepInfo thisStep in theseSteps)
                    {
                        if (!parameterFound)
                        {
                            Dictionary<string, string> dictPlaceHolderValuesforStep = new Dictionary<string, string>();
                            dictPlaceHolderValuesforStep = getPlaceHolderValueforStep(thisStep, param);
                            if (dictPlaceHolderValuesforStep.Count > 0)
                            {
                                foreach (var paramvalue in dictPlaceHolderValuesforStep)
                                {
                                    if (!dictPlaceHolderValues.ContainsKey(paramvalue.Key))
                                    {
                                        dictPlaceHolderValues.Add(paramvalue.Key, paramvalue.Value);
                                    }
                                    parameterFound = true;
                                }
                            }
                        }
                    }

                    foreach (RosterInfo thisRoster in theseRosters)
                    {
                        Dictionary<string, string> dictPlaceHolderValuesforPlan = new Dictionary<string, string>();
                        dictPlaceHolderValuesforPlan = getPlaceHolderValueforRoster(thisRoster, param);
                        if (dictPlaceHolderValuesforPlan.Count > 0)
                        {
                            foreach (var paramvalue in dictPlaceHolderValuesforPlan)
                            {
                                if (!dictPlaceHolderValues.ContainsKey(paramvalue.Key))
                                {
                                    dictPlaceHolderValues.Add(paramvalue.Key, paramvalue.Value);
                                }
                                parameterFound = true;
                            }
                        }
                    }

                    if (!parameterFound)
                    {
                        dictPlaceHolderValues[param] = String.Empty;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }

            return dictPlaceHolderValues;
        }

        private Dictionary<string, string> getPlaceHolderValueforStep(StepInfo thisStep, string param)
        {
            Dictionary<string, string> dictPlaceHolderValuesforStep = new Dictionary<string, string>();

            switch (param)
            {

                case "[Due Date]":
                    if (thisStep.DueDate != "")
                    {
                        dictPlaceHolderValuesforStep.Add(param, DateTime.Parse(thisStep.DueDate).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        dictPlaceHolderValuesforStep.Add(param, thisStep.DueDate);
                    }
                    break;
                case "[Done Date]":
                    if (thisStep.DoneDate != "")
                    {
                        dictPlaceHolderValuesforStep.Add(param, DateTime.Parse(thisStep.DoneDate).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        dictPlaceHolderValuesforStep.Add(param, thisStep.DoneDate);
                    }
                    break;
                case "[Start Date]":
                    if (thisStep.StartDate != "")
                    {
                        dictPlaceHolderValuesforStep.Add(param, DateTime.Parse(thisStep.StartDate).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        dictPlaceHolderValuesforStep.Add(param, thisStep.StartDate);
                    }
                    break;
                case "[Responsible (First Last)]":
                    dictPlaceHolderValuesforStep.Add(param, thisStep.ResponsibleFirstLast);
                    break;
                case "[Template Name]":
                    dictPlaceHolderValuesforStep.Add(param, thisStep.TemplateName);
                    break;
                case "[Group Name]":
                    dictPlaceHolderValuesforStep.Add(param, thisStep.GroupName);
                    break;
                case "[Step Name]":
                    dictPlaceHolderValuesforStep.Add(param, thisStep.StepName);
                    break;

            }

            return dictPlaceHolderValuesforStep;
        }


        private Dictionary<string, string> getPlaceHolderValueforPlan(PlanInfo thisPlan, string param)
        {
            Dictionary<string, string> dictPlaceHolderValuesforPlan = new Dictionary<string, string>();

            switch (param)
            {
                case "[Plan Type]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.planType);
                    break;
                case "[Revision Number]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.revisionNumber);
                    break;
                case "[Plan Year Start]":
                    if (thisPlan.planYearStart != "")
                    {
                        dictPlaceHolderValuesforPlan.Add(param, DateTime.Parse(thisPlan.planYearStart).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        dictPlaceHolderValuesforPlan.Add(param, thisPlan.planYearStart);
                    }

                    break;
                case "[Plan Year End]":
                    if (thisPlan.planYearEnd != "")
                    {
                        dictPlaceHolderValuesforPlan.Add(param, DateTime.Parse(thisPlan.planYearEnd).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        dictPlaceHolderValuesforPlan.Add(param, thisPlan.planYearEnd);
                    }
                    break;
                case "[Plan Effective Start]":
                    if (thisPlan.effectiveStart != "")
                    {
                        dictPlaceHolderValuesforPlan.Add(param, DateTime.Parse(thisPlan.effectiveStart).ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        dictPlaceHolderValuesforPlan.Add(param, thisPlan.effectiveStart);
                    }
                    break;
                case "[Indiv. Name(Last, First)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.IndivNameLastFirst);
                    break;
                case "[Indiv. Name(First M Last)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.IndivNameFirstMLast);
                    break;
                case "[Indiv. Name(First L)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.IndivNameFirstL);
                    break;
                case "[Indiv. Name(F Last5)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.IndivNameFLast5);
                    break;
                case "[Indiv. Resident Number]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.ResidentNumber);
                    break;
                case "[Service Providers]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.serviceProviders);
                    break;
                case "[Case Manager(Last First)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.CaseManagerNameLastFirst);
                    break;
                case "[Case Manager(First Last)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.CaseManagerNameFirstLast);
                    break;
                case "[Sender]":
                    dictPlaceHolderValuesforPlan.Add(param, thisPlan.Sender);
                    break;
            }
            return dictPlaceHolderValuesforPlan;
        }

        private Dictionary<string, string> getPlaceHolderValueforRoster(RosterInfo thisRoster, string param)
        {
            Dictionary<string, string> dictPlaceHolderValuesforPlan = new Dictionary<string, string>();

            switch (param)
            {
                case "[Indiv. Name(Last, First)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.IndivNameLastFirst);
                    break;
                case "[Indiv. Name(First M Last)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.IndivNameFirstMLast);
                    break;
                case "[Indiv. Name(First L)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.IndivNameFirstL);
                    break;
                case "[Indiv. Name(F Last5)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.IndivNameFLast5);
                    break;
                case "[Indiv. Resident Number]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.ResidentNumber);
                    break;
                case "[Service Providers]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.serviceProviders);
                    break;
                case "[Case Manager(Last First)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.CaseManagerNameLastFirst);
                    break;
                case "[Case Manager(First Last)]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.CaseManagerNameFirstLast);
                    break;
                case "[Sender]":
                    dictPlaceHolderValuesforPlan.Add(param, thisRoster.Sender);
                    break;
            }
            return dictPlaceHolderValuesforPlan;
        }

        public string processWorkflowAction(string token, WorkflowEditedStepStatus thisEvent, List<ActionInfo> theseActions, DistributedTransaction transaction)
        {
            // For no actions, Actions = "[]" -- which is length = 2
            if (theseActions.Count == 0) return "No actions to process.";

            string returnActionJSON = "";

            try
            {
                // process actions associated with the event
                foreach (ActionInfo thisAction in theseActions)
                {
                    if (!string.IsNullOrEmpty(thisAction.WF_Action_ID) && thisAction.WF_Action_ID.All(char.IsDigit))
                    {
                        switch (int.Parse(thisAction.WF_Action_ID))
                        {
                            case 1:
                                // 'set workflow status' using WF_Action_Parameters (eg, Workflow Status=5189)
                                string[] wfStatusParameter = new string[] { };
                                if (!string.IsNullOrEmpty(thisAction.WF_Action_Parameters))
                                {
                                    wfStatusParameter = thisAction.WF_Action_Parameters.Split('=');
                                }

                                if (wfStatusParameter.Length > 1)
                                {
                                    string returnStatusInfo = wfdg.setWorkflowStatus(thisAction.WF_ID, wfStatusParameter[1], transaction);
                                    var returnStatus = new { ActionId = thisAction.WF_Action_ID, wfStatusId = wfStatusParameter[1], workflowId = thisAction.WF_ID };
                                    returnActionJSON = Newtonsoft.Json.JsonConvert.SerializeObject(returnStatus);
                                }
                                break;
                            case 2:
                                // 'send email or text'  

                                wfEmailInfo thisEmail = getEmailParameters(thisAction.WF_Action_Parameters);

                                string notificationSentStatus = wfdg.sendNotification(thisEvent.eventType, thisAction.WF_ID, thisAction.WF_Step_ID, thisEmail.To_Option, thisEmail.To_Addresses, thisEmail.CC_Option, thisEmail.CC_Addresses, thisEmail.BCC_Option, thisEmail.BCC_Addresses, thisEmail.From_Option, thisEmail.From_Address, thisEmail.Subject, thisEmail.Body, transaction);
                                returnActionJSON = notificationSentStatus;
                                // return "Notification sent.";
                                break;
                            case 3:
                                // 'set plan status'
                                string[] planStatusParameter3 = new string[] { };
                                if (!string.IsNullOrEmpty(thisAction.WF_Action_Parameters))
                                {
                                    planStatusParameter3 = thisAction.WF_Action_Parameters.Split('=');
                                }

                                string returnPlan3 = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);

                                PlanInfo[] thesePlans3 = js.Deserialize<PlanInfo[]>(returnPlan3);

                                if (planStatusParameter3.Length > 1)
                                {
                                    foreach (PlanInfo thisPlan in thesePlans3)
                                    {
                                        int returnPlanStatus = pdg.updateConsumerPlanSetStatus(thisPlan.consumerPlanId, planStatusParameter3[1], transaction);
                                    }
                                }

                                break;
                            case 4:
                                // 'set plan status'
                                string[] planStatusParameter = new string[] { };
                                if (!string.IsNullOrEmpty(thisAction.WF_Action_Parameters))
                                {
                                    planStatusParameter = thisAction.WF_Action_Parameters.Split('=');
                                }

                                string returnPlan = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);

                                PlanInfo[] thesePlans = js.Deserialize<PlanInfo[]>(returnPlan);

                                if (planStatusParameter.Length > 1)
                                {
                                    foreach (PlanInfo thisPlan in thesePlans)
                                    {
                                        int returnPlanStatus = pdg.updateConsumerPlanSetStatus(thisPlan.consumerPlanId, planStatusParameter[1], transaction);
                                    }
                                }

                                break;
                            case 5:
                                // 'set step due date'
                                Dictionary<string, string> DueDateActionParameters = new Dictionary<string, string>();
                                DueDateActionParameters = getDateActionParameters(thisAction);
                                string dueDate = getStepSetDate(DueDateActionParameters, thisAction, thisEvent);
                                //using (DistributedTransaction localtransaction = new DistributedTransaction(DbHelper.ConnectionString))
                                // {
                                string duedateSetStatus = wfdg.setWorkflowStepDueDate(thisAction.WF_Step_ID, dueDate, transaction);
                                var returnDueDate = new { ActionId = thisAction.WF_Action_ID, StepId = thisAction.WF_Step_ID, ActionDate = dueDate };

                                returnActionJSON = Newtonsoft.Json.JsonConvert.SerializeObject(returnDueDate);
                                // }


                                break;
                            case 6:
                                // 'set step start date'
                                Dictionary<string, string> StartDateActionParameters = new Dictionary<string, string>();
                                StartDateActionParameters = getDateActionParameters(thisAction);
                                string startDate = getStepSetDate(StartDateActionParameters, thisAction, thisEvent);
                                // using (DistributedTransaction localtransaction = new DistributedTransaction(DbHelper.ConnectionString))
                                //{
                                string startdateSetStatus = wfdg.setWorkflowStepStartDate(thisAction.WF_Step_ID, startDate, transaction);
                                var returnStartDate = new { ActionId = thisAction.WF_Action_ID, StepId = thisAction.WF_Step_ID, ActionDate = startDate };
                                returnActionJSON = Newtonsoft.Json.JsonConvert.SerializeObject(returnStartDate);
                                // }

                                break;
                            case 7:
                                // 'set next steps start date'
                                string nextStepStartDateSetStatus = "";
                                string setStartDateNextStepId = wfdg.getNextWorkflowStepId(thisAction.WF_Step_ID, transaction);
                                if (setStartDateNextStepId == null)
                                {
                                    break;
                                }
                                if (thisEvent.modified == null)
                                {
                                    nextStepStartDateSetStatus = wfdg.setWorkflowStepStartDate(setStartDateNextStepId, null, transaction);
                                    break;
                                }
                                string nextStepStartDate = "";
                                Dictionary<string, string> nextStepStartDateActionParameters = new Dictionary<string, string>();
                                nextStepStartDateActionParameters = getDateActionParameters(thisAction);
                                double startDateChangeAmount = double.Parse(nextStepStartDateActionParameters["Days"]);
                                DateTime thisStartDate = DateTime.ParseExact(thisEvent.modified, "M/d/yyyy", CultureInfo.InvariantCulture);
                                DateTime newStartDate = thisStartDate.AddDays(startDateChangeAmount);
                                nextStepStartDate = newStartDate.ToString("M/d/yy");
                                nextStepStartDateSetStatus = wfdg.setWorkflowStepStartDate(setStartDateNextStepId, nextStepStartDate, transaction);

                                WorkflowEditedStepStatus nextStepStart = new WorkflowEditedStepStatus();
                                nextStepStart.isChanged = null;
                                nextStepStart.original = null;
                                nextStepStart.modified = nextStepStartDate;
                                nextStepStart.eventId = "4";
                                nextStepStart.eventType = "step";
                                nextStepStart.eventTypeId = setStartDateNextStepId;
                                nextStepStart.stepId = null;
                                processWorkflowStepEvent(token, nextStepStart);

                                break;
                            case 8:
                                // 'set next steps due date'
                                string nextStepDueDateSetStatus = "";
                                string setDueDateNextStepId = wfdg.getNextWorkflowStepId(thisAction.WF_Step_ID, transaction);
                                if (setDueDateNextStepId == null)
                                {
                                    break;
                                }
                                if (thisEvent.modified == null)
                                {
                                    nextStepDueDateSetStatus = wfdg.setWorkflowStepDueDate(setDueDateNextStepId, null, transaction);
                                    break;
                                }
                                string nextStepDueDate = "";
                                Dictionary<string, string> nextStepDueDateActionParameters = new Dictionary<string, string>();
                                nextStepDueDateActionParameters = getDateActionParameters(thisAction);
                                double dueDateChangeAmount = double.Parse(nextStepDueDateActionParameters["Days"]);
                                DateTime thisDueDate = DateTime.ParseExact(thisEvent.modified, "M/d/yyyy", CultureInfo.InvariantCulture);
                                DateTime newDueDate = thisDueDate.AddDays(dueDateChangeAmount);
                                nextStepDueDate = newDueDate.ToString("M/d/yy");
                                nextStepDueDateSetStatus = wfdg.setWorkflowStepDueDate(setDueDateNextStepId, nextStepDueDate, transaction);

                                WorkflowEditedStepStatus nextStepDue = new WorkflowEditedStepStatus();
                                nextStepDue.isChanged = null;
                                nextStepDue.original = null;
                                nextStepDue.modified = nextStepDueDate;
                                nextStepDue.eventId = "4";
                                nextStepDue.eventType = "step";
                                nextStepDue.eventTypeId = setDueDateNextStepId;
                                nextStepDue.stepId = null;
                                processWorkflowStepEvent(token, nextStepDue);

                                break;
                        }
                    }

                }

                return returnActionJSON;

            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }

        }

        private wfEmailInfo getEmailParameters(string WF_Action_Parameters)
        {

            wfEmailInfo thisEmailInfo = new wfEmailInfo();

            if (WF_Action_Parameters.Contains("|"))
            {
                string[] WFActionParameters = WF_Action_Parameters.Split('|');
                // WF_Action_Parameters :  To Options, To Addresses, CC Options, ... Subject, Body
                Dictionary<string, string> dictActionParams = new Dictionary<string, string>();
                // WF_Action_ID, **WF_Action_Parameters**, WF_Event_ID, WF_Event_Parameters, WF_Step_ID, Step_Order, WF_Step_Event_ID
                Dictionary<string, string> dictActionInfo = new Dictionary<string, string>();
                string lastValue = string.Empty;
                string lastKey = string.Empty;

                foreach (string param in WFActionParameters)
                {
                    if (!string.IsNullOrEmpty(param))
                    {
                        // if param does not include "=" , then append this param to the last value 
                        if (param.Contains("="))
                        {
                            string[] WFP = param.Split('=');
                            dictActionParams.Add(WFP[0].Replace(" ", "_"), WFP[1]);
                            lastKey = WFP[0].Replace(" ", "_");
                            lastValue = WFP[1];
                        }
                        else
                        {
                            dictActionParams[lastKey] = lastValue + "|" + param;
                        }
                    }
                }

                var serializer = new JavaScriptSerializer();
                thisEmailInfo = serializer.Deserialize<wfEmailInfo>(serializer.Serialize(dictActionParams));
            }

            return thisEmailInfo;

        }

        private string getStepSetDate(Dictionary<string, string> dateActionParameters, ActionInfo thisAction, WorkflowEditedStepStatus thisEvent)
        {
            string stepSetDate = "";
            string strdateActionParameters = "";

            if (dateActionParameters.Count != 0)
            {
                strdateActionParameters = (dateActionParameters["Date"]).ToUpper();
            }


            try
            {
                switch (strdateActionParameters)
                {
                    case "PLAN YEAR START":

                        DateTime PlanYearStart = getPlanYearStart(thisAction);

                        if (dateActionParameters["BeforeAfter"] == "after")
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanYearStart.AddDays(dayParam).ToString("yyyy-MM-dd");
                        }
                        else
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanYearStart.AddDays(-dayParam).ToString("yyyy-MM-dd");
                        }

                        break;

                    case "PLAN YEAR END":

                        DateTime PlanYearEnd = getPlanYearEnd(thisAction);

                        if (dateActionParameters["BeforeAfter"] == "after")
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanYearEnd.AddDays(dayParam).ToString("yyyy-MM-dd");
                        }
                        else
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanYearEnd.AddDays(-dayParam).ToString("yyyy-MM-dd");
                        }

                        break;

                    case "PLAN EFFECTIVE START":

                        DateTime PlanEffectiveStart = getEffectiveYearStart(thisAction);

                        if (dateActionParameters["BeforeAfter"] == "after")
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanEffectiveStart.AddDays(dayParam).ToString("yyyy-MM-dd");
                        }
                        else
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanEffectiveStart.AddDays(-dayParam).ToString("yyyy-MM-dd");
                        }

                        break;

                    case "PLAN EFFECTIVE END":

                        DateTime PlanEffectiveEnd = getEffectiveYearEnd(thisAction);

                        if (dateActionParameters["BeforeAfter"] == "after")
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanEffectiveEnd.AddDays(dayParam).ToString("yyyy-MM-dd");
                        }
                        else
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = PlanEffectiveEnd.AddDays(-dayParam).ToString("yyyy-MM-dd");
                        }

                        break;

                    case "DATE OF THE EVENT":

                        if (dateActionParameters["BeforeAfter"] == "after")
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = DateTime.Now.AddDays(dayParam).ToString("yyyy-MM-dd");
                        }
                        else
                        {
                            double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                            stepSetDate = DateTime.Now.AddDays(-dayParam).ToString("yyyy-MM-dd");
                        }

                        break;

                    case "STEP START DATE":
                    case "STEP DUE DATE":
                        {
                            DateTime modifiedStepDate = DateTime.Parse(thisEvent.modified);

                            if (dateActionParameters["BeforeAfter"] == "after")
                            {
                                double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                                stepSetDate = modifiedStepDate.AddDays(dayParam).ToString("yyyy-MM-dd");
                            }
                            else
                            {
                                double dayParam = Convert.ToDouble(dateActionParameters["Days"]);
                                stepSetDate = modifiedStepDate.AddDays(-dayParam).ToString("yyyy-MM-dd");
                            }

                        }
                        break;
                }


                return stepSetDate;

            }
            catch (Exception ex)
            {
                throw new Exception("A problem getting step set date: " + ex.Message);
            }

        }

        private DateTime getPlanYearStart(ActionInfo thisAction)
        {
            string PlanData = "";

            try
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    PlanData = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);
                }

                Plan.AnywherePlanWorker.ConsumerPlans[] thesePlans = js.Deserialize<Plan.AnywherePlanWorker.ConsumerPlans[]>(PlanData);

                string strPlanYearStart = "";

                foreach (Plan.AnywherePlanWorker.ConsumerPlans thisplan in thesePlans)
                {
                    strPlanYearStart = thisplan.planYearStart;
                }

                DateTime PlanYearStart = DateTime.Parse(strPlanYearStart);

                return PlanYearStart;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }
        }

        private DateTime getPlanYearEnd(ActionInfo thisAction)
        {
            string PlanData = "";

            try
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    PlanData = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);
                }

                Plan.AnywherePlanWorker.ConsumerPlans[] thesePlans = js.Deserialize<Plan.AnywherePlanWorker.ConsumerPlans[]>(PlanData);

                string strPlanYearEnd = "";

                foreach (Plan.AnywherePlanWorker.ConsumerPlans thisplan in thesePlans)
                {
                    strPlanYearEnd = thisplan.planYearEnd;
                }

                DateTime PlanYearEnd = DateTime.Parse(strPlanYearEnd);

                return PlanYearEnd;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }
        }

        private DateTime getEffectiveYearStart(ActionInfo thisAction)
        {
            string PlanData = "";

            try
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    PlanData = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);
                }

                Plan.AnywherePlanWorker.ConsumerPlans[] thesePlans = js.Deserialize<Plan.AnywherePlanWorker.ConsumerPlans[]>(PlanData);

                string strEffectiveYearStart = "";

                foreach (Plan.AnywherePlanWorker.ConsumerPlans thisplan in thesePlans)
                {
                    strEffectiveYearStart = thisplan.effectiveStart;
                }

                DateTime EffectiveYearStart = DateTime.Parse(strEffectiveYearStart);

                return EffectiveYearStart;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }
        }

        private DateTime getEffectiveYearEnd(ActionInfo thisAction)
        {
            string PlanData = "";

            try
            {
                using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    PlanData = wfdg.getPlanfromWorkFlowId(thisAction.WF_ID, transaction);
                }

                Plan.AnywherePlanWorker.ConsumerPlans[] thesePlans = js.Deserialize<Plan.AnywherePlanWorker.ConsumerPlans[]>(PlanData);

                string strEffectiveYearEnd = "";

                foreach (Plan.AnywherePlanWorker.ConsumerPlans thisplan in thesePlans)
                {
                    strEffectiveYearEnd = thisplan.effectiveEnd;
                }

                DateTime EffectiveYearEnd = DateTime.Parse(strEffectiveYearEnd);

                return EffectiveYearEnd;
            }
            catch (Exception ex)
            {
                throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
            }
        }


        private Dictionary<string, string> getDateActionParameters(ActionInfo thisAction)
        {
            try
            {
                string[] WFActionParameters = thisAction.WF_Action_Parameters.Split('|');
                Dictionary<string, string> dict = new Dictionary<string, string>();

                foreach (string param in WFActionParameters)
                {
                    if (!string.IsNullOrEmpty(param))
                    {
                        string[] WFP = param.Split('=');
                        dict.Add(WFP[0], WFP[1]);
                    }
                }

                return dict;
            }
            catch (Exception ex)
            {
                throw new Exception("A problem getting Date Action Parameters: " + ex.Message);
            }
        }


        public string preInsertWorkflowFromTemplate(string token, string templateId, string peopleId, string referenceId, string wantedFormAttachmentIds, string priorReferenceId)
        //public string preInsertWorkflowFromTemplate(string token, string templateId, string peopleId, string referenceId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    return insertWorkflowFromTemplate(token, templateId, peopleId, referenceId, "False", wantedFormAttachmentIds, priorReferenceId, transaction);
                    //return insertWorkflowFromTemplate(token, templateId, peopleId, referenceId, "False", transaction);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        #endregion

        #region WORKFLOW HELPER METHODS
        string getRelatedPerson(string peopleId, string relationshipTypeId, List<PeopleRelationship> relationships)
        {
            if (relationships == null) return null;
            PeopleRelationship relatedPerson = relationships.FirstOrDefault(p => p.relationshipTypeId == relationshipTypeId); // sorted by type and start date
            return relatedPerson != null ? relatedPerson.peopleId : null;
        }



        string insertWorkflowFromTemplate(string token, string templateId, string peopleId, string referenceId, string carryStepEdit, string wantedFormAttachmentIds, string priorConsumerPlanId, DistributedTransaction transaction_insertWFDetails)
        // string insertWorkflowFromTemplate(string token, string templateId, string peopleId, string referenceId, string carryStepEdit, DistributedTransaction transaction_insertWFDetails)
        {

            try
            {
                String workflowId;
                WorkflowTemplate template;

                using (DistributedTransaction transaction_insertWF = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    template = js.Deserialize<List<WorkflowTemplate>>(wfdg.getWorkflowTemplate(templateId, transaction_insertWF)).FirstOrDefault();
                    if (template == null) throw new Exception("a problem occured while trying to retrieve the workflow template");

                    workflowId = wfdg.insertWorkflow(template.processId, template.name, referenceId, template.description, null, transaction_insertWF);

                    if (workflowId == null) throw new Exception("unable to insert workflow");
                    transaction_insertWF.Commit();
                    transaction_insertWF.Dispose();
                }


                // ===Populate Responsible Party Relationship Table from template
                using (DistributedTransaction transaction_responseRelations = new DistributedTransaction(DbHelper.ConnectionString))
                {
                    string insertResult = wfdg.insertWFResponsiblePartyRelationships(templateId, workflowId, transaction_responseRelations);
                    transaction_responseRelations.Commit();
                    transaction_responseRelations.Dispose();
                }

                ResponsiblePartyRelationship[] responsiblerelationships = js.Deserialize<ResponsiblePartyRelationship[]>(wfdg.getWFResponsibleParties(token, workflowId));

                foreach (ResponsiblePartyRelationship rpr in responsiblerelationships)
                {
                    using (DistributedTransaction transaction_updatePartyIds = new DistributedTransaction(DbHelper.ConnectionString))
                    {
                        try
                        {
                            string updateResult = wfdg.updateWFResponsiblePartyIDs(peopleId, workflowId, rpr.responsiblePartyType, transaction_updatePartyIds);
                            transaction_updatePartyIds.Commit();
                            transaction_updatePartyIds.Dispose();

                        }
                        catch (Exception ex)
                        {
                            throw ex;
                        }

                    }

                }

                // === Populate inserted Responsible Party Relationships with Responsible Party Ids
                //if (insertResult != null) {
                //    string updateResult = wfdg.updateWFResponsiblePartyIDs(peopleId, workflowId, transaction);
                //}

                List<dynamic> lstEvents = new List<dynamic>();

                // Fetch all the workflow template data
                List<WorkflowTemplateStatus> statuses = js.Deserialize<List<WorkflowTemplateStatus>>(wfdg.getWorkflowTemplateStatuses(templateId, transaction_insertWFDetails));
                List<WorkflowTemplateGroup> groups = js.Deserialize<List<WorkflowTemplateGroup>>(wfdg.getWorkflowTemplateGroups(templateId, transaction_insertWFDetails));
                List<WorkflowTemplateStep> steps = js.Deserialize<List<WorkflowTemplateStep>>(wfdg.getWorkflowTemplateSteps(null, transaction_insertWFDetails));
                List<WorkflowTemplateStepEvent> events = js.Deserialize<List<WorkflowTemplateStepEvent>>(wfdg.getWorkflowTemplateStepEvents(null, transaction_insertWFDetails));
                List<WorkflowTemplateStepEventAction> actions = js.Deserialize<List<WorkflowTemplateStepEventAction>>(wfdg.getWorkflowTemplateStepEventActions(null, transaction_insertWFDetails));
                // -- Get PreviousPlan StepId 
                List<WorkflowTemplateStepDocument> selecteddocuments = new List<WorkflowTemplateStepDocument>();

                if (!string.IsNullOrEmpty(wantedFormAttachmentIds)) {
                    string[] attachmentIds = wantedFormAttachmentIds.Split(',');
                    foreach (string attachmentID in attachmentIds)
                    {
                        String previousPlanStepId = wfdg.getWorkflowStepIdfromPreviousPlan(priorConsumerPlanId, attachmentID);
                        WorkflowTemplateStepDocument[] selecteddocument = js.Deserialize<WorkflowTemplateStepDocument[]>(wfdg.getWorkflowStepDocuments(previousPlanStepId, attachmentID, priorConsumerPlanId, transaction_insertWFDetails));
                        selecteddocuments.Add(selecteddocument[0]);
                    }

                }
                

                List<WorkflowTemplateStepDocument> documents = js.Deserialize<List<WorkflowTemplateStepDocument>>(wfdg.getWorkflowTemplateStepDocuments(null, transaction_insertWFDetails));
                // Get relationships data used for getting responsible party relationships
                List<PeopleRelationship> relationships = js.Deserialize<List<PeopleRelationship>>(wfdg.getPeopleRelationships(peopleId, transaction_insertWFDetails));

                bool firstStatus = true;
                string statusToPass = "";
                foreach (WorkflowTemplateStatus s in statuses.FindAll(p => p.templateId == template.templateId))
                {
                    // insert statuses
                    String statusId = wfdg.insertWorkflowStatus(workflowId, s.statusOrder, s.description, transaction_insertWFDetails);
                    if (firstStatus)
                    {
                        // Set the current workflow status to the first status 
                        statusToPass = statusId;
                        wfdg.setWorkflowStatus(workflowId, statusId, transaction_insertWFDetails);
                        firstStatus = false;
                    }
                }

                foreach (WorkflowTemplateGroup g in groups.FindAll(p => p.templateId == template.templateId))
                {
                    // insert workflow groups
                    String groupId = wfdg.insertWorkflowGroup(workflowId, g.groupOrder, g.groupName, transaction_insertWFDetails);

                    foreach (WorkflowTemplateStep s in steps.FindAll(p => p.groupId == g.groupId))
                    {
                        //  string responsiblePartyId = s.responsiblePartyType == "I" ? s.responsiblePartyId : getRelatedPerson(peopleId, s.responsiblePartyRelationshipTypeId, relationships);

                        string responsiblePartyId = string.Empty;

                        switch (s.responsiblePartyType)
                        {
                            case "I":
                                responsiblePartyId = s.responsiblePartyId;
                                break;
                            case "R":
                                responsiblePartyId = getRelatedPerson(peopleId, s.responsiblePartyRelationshipTypeId, relationships);
                                break;
                            case "0":
                            case "1":
                            case "2":
                            case "3":
                            case "4":
                            case "5":
                            case "6":
                            case "7":
                            case "8":
                            case "9":
                                // === get Responsible Party Id from the Responsible Party Relationship Table for this step
                                string jsonresponsiblePartyId = wfdg.getResponsiblePartyIDforThisStep(s.responsiblePartyType, workflowId, transaction_insertWFDetails);
                                ResponsibleParty[] responsibleParty = js.Deserialize<ResponsibleParty[]>(jsonresponsiblePartyId);
                                responsiblePartyId = responsibleParty[0].ID;
                                break;
                        }

                        // insert group steps
                        String stepId = wfdg.insertWorkflowStep(groupId, s.stepOrder, s.description, responsiblePartyId, s.responsiblePartyType, s.isChecklist, null, null, null, null, "True", s.allowStepEdit, s.powerBIReporting, transaction_insertWFDetails);

                        foreach (WorkflowTemplateStepEvent e in events.FindAll(p => p.stepId == s.stepId))
                        {
                            // insert step events
                            //MAT - TODO - take status from above and tweak the status number at the end of event parameters
                            if ((e.eventParameters.IndexOf("Status=") != -1) && (e.eventId == "12"))
                            {
                                string oldStatusId = e.eventParameters.Substring(e.eventParameters.LastIndexOf("=") + 1);
                                string statusForEventId = wfdg.getWorkflowStatusForAction(workflowId, oldStatusId, transaction_insertWFDetails);
                                ActionStatus[] statusForEventIdObj = js.Deserialize<ActionStatus[]>(statusForEventId);
                                e.eventParameters = e.eventParameters.Substring(0, e.eventParameters.LastIndexOf("Status=") + 7);
                                e.eventParameters = e.eventParameters + statusForEventIdObj[0].WF_Status_Id.ToString();
                            }

                            String stepEventId = wfdg.insertWorkflowStepEvent(stepId, e.eventId, e.eventParameters, e.eventDescription, transaction_insertWFDetails);

                            foreach (WorkflowTemplateStepEventAction a in actions.FindAll(p => p.stepEventId == e.stepEventId))
                            {
                                // insert event actions
                                //MAT - TODO - take status from above and tweak the status number at the end of action parameter
                                if ((a.actionParameter.IndexOf("Status=") != -1) && (a.actionId == "1"))
                                {
                                    string oldStatusId = a.actionParameter.Substring(a.actionParameter.LastIndexOf("=") + 1);
                                    string statusForActionId = wfdg.getWorkflowStatusForAction(workflowId, oldStatusId, transaction_insertWFDetails);
                                    ActionStatus[] statusForActionIdObj = js.Deserialize<ActionStatus[]>(statusForActionId);
                                    //var test = statusForActionIdObj[0].WF_Status_Id.ToString();
                                    a.actionParameter = a.actionParameter.Substring(0, a.actionParameter.LastIndexOf("Status=") + 7);
                                    a.actionParameter = a.actionParameter + statusForActionIdObj[0].WF_Status_Id.ToString();
                                }

                                String stepEventActionId = wfdg.insertWorkflowStepEventAction(stepEventId, a.actionId, a.actionParameter, a.actionDescription, transaction_insertWFDetails);

                                lstEvents.Add(new { stepId = stepId, eventId = e.eventId });
                            }
                        }

                        foreach (WorkflowTemplateStepDocument d in documents.FindAll(p => p.stepId == s.stepId))
                        {
                            // insert template step documents
                            // what if a selected doc is one of the template docs (edited) -- you don't want both versions just the edited version
                            bool isSelected = selecteddocuments.Any(sel => sel.description == d.description);
                            if (!isSelected)
                            {                                
                                String documentId = wfdg.insertWorkflowStepDocument(stepId, d.docOrder, d.description, d.attachmentId,  d.attachmentType, null, null, "0", transaction_insertWFDetails);
                            }
                        }

                        foreach (WorkflowTemplateStepDocument d in selecteddocuments.FindAll(p => p.stepId == s.stepId))
                        {                            
                            // insert selected step documents
                            String documentId = wfdg.insertWorkflowStepDocument(stepId, d.docOrder, d.description, d.attachmentId, d.attachmentType, null, null, "0", transaction_insertWFDetails);

                        }

                    }
                }
                //MAT Commented out below because the transaction was failing due to being Commited here
                transaction_insertWFDetails.Commit();
                // transaction.Dispose();
                //  var test = 1;


                // process Events
                var distinctEvents = lstEvents.GroupBy(x => new { x.stepId, x.eventId }).Select(y => y.First()).ToList();

                foreach (var itemEvent in distinctEvents)
                {
                    if (itemEvent.eventId == "29" || itemEvent.eventId == "30")
                    {
                        WorkflowEditedStepStatus thisEvent = new WorkflowEditedStepStatus();

                        thisEvent.eventId = itemEvent.eventId;
                        thisEvent.eventType = "plan";
                        thisEvent.eventTypeId = referenceId; //Plan ID
                        thisEvent.stepId = itemEvent.stepId;
                        string processingCompleted = processWorkflowStepEvent(token, thisEvent);
                    }

                    else if (itemEvent.eventId == "1")
                    {

                        WorkflowEditedStepStatus thisEvent = new WorkflowEditedStepStatus();

                        thisEvent.eventId = itemEvent.eventId;
                        thisEvent.eventType = "step";
                        thisEvent.eventTypeId = itemEvent.stepId;
                        string processingCompleted = processWorkflowStepEvent(token, thisEvent);
                    }
                }
                //transaction.Commit();
                return workflowId;

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }



        public ManualWorkflowList[] getManualWorkflowList(string token, string processId, string referenceId, string notPlan)
        {
            string wfList = wfdg.getManualWorkflowList(token, processId, referenceId, notPlan);
            ManualWorkflowList[] wfListObj = js.Deserialize<ManualWorkflowList[]>(wfList);
            return wfListObj;
        }

        public WorkflowTemplateStepDocument[] getWorkFlowFormsfromPreviousPlan(string token, string selectedWFTemplateIds, string previousPlanId)
        {
            string wfFormList = wfdg.getWorkFlowFormsfromPreviousPlan(token, selectedWFTemplateIds, previousPlanId);
            WorkflowTemplateStepDocument[] wfFormListObj = js.Deserialize<WorkflowTemplateStepDocument[]>(wfFormList);
            return wfFormListObj;
        }

        public class ManualWorkflowList
        {
            public string workflowTemplateId { get; set; }
            public string workflowProcessId { get; set; }
            public string templateName { get; set; }
            public string description { get; set; }
        }
        #endregion

        #region WORKFLOW DASHBOARD WIDGETS

        [DataContract]
        public class PlanWorkflowWidgetData
        {
            [DataMember(Order = 0)]
            public string planId { get; set; }
            [DataMember(Order = 1)]
            public string consumerId { get; set; }
            [DataMember(Order = 2)]
            public string consumerFirstName { get; set; }
            [DataMember(Order = 3)]
            public string consumerLastName { get; set; }
            [DataMember(Order = 4)]
            public string consumerMiddleName { get; set; }
            [DataMember(Order = 5)]
            public string planType { get; set; }
            [DataMember(Order = 6)]
            public string planYearStart { get; set; }
            [DataMember(Order = 7)]
            public string planYearEnd { get; set; }
            [DataMember(Order = 8)]
            public string planEffectiveStart { get; set; }
            [DataMember(Order = 9)]
            public string planEffectiveEnd { get; set; }
            [DataMember(Order = 10)]
            public string planActive { get; set; }
            [DataMember(Order = 11)]
            public string planRevisionNumber { get; set; }
            [DataMember(Order = 12)]
            public string planStatus { get; set; }
            [DataMember(Order = 13)]
            public string workflowStepId { get; set; }
            [DataMember(Order = 14)]
            public string workflowStepDescription { get; set; }
            [DataMember(Order = 15)]
            public string workflowStepDueDate { get; set; }
            [DataMember(Order = 16)]
            public string responsiblePartyId { get; set; }
        }

        public PlanWorkflowWidgetData[] getPlanWorkflowWidgetData(string token, string responsiblePartyId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    PlanWorkflowWidgetData[] planWidgetData = Array.FindAll(
                        js.Deserialize<PlanWorkflowWidgetData[]>(
                            wfdg.getDashboardPlanWorkflowWidget(responsiblePartyId, transaction)
                        ),
                        d => d.planActive == "True");

                    return planWidgetData;

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