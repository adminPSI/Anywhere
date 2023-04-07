using System;
using System.Runtime.Serialization;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class AnywhereAssessmentWorker
    {
        AssessmentDataGetter adg = new AssessmentDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

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
            public string answerId { get; set; }
            public string answerRow { get; set; }
            public string answerText { get; set; }
        }

        public class ConsumerPlans
        {
            public string consumerPlanId { get; set; }
            public string planType { get; set; }
            public string planYearStart { get; set; }
            public string planYearEnd { get; set; }
            public string effectiveStart { get; set; }
            public string effectiveEnd { get; set; }
            public string createdOn { get; set; }//
            public string reviewDate { get; set; }//
            public string active { get; set; }
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

        public class ConsumerPlan
        {
            public string consumerPlanId { get; set; }
            public string cQFullName { get; set; }
        }

        [DataContract]
        public class Answer
        {
            [DataMember]
            public string answerId { get; set; }

            [DataMember]
            public string answerRow { get; set; }

            [DataMember]
            public string answerText { get; set; }
        }

        public string updateAssessmentAnswers(string token, Answer[] answers)
        {

            string result = adg.validateToken(token);

            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    foreach (Answer answer in answers)
                    {
                        // update the answer
                        adg.updateAssessmentAnswer(answer.answerId, answer.answerText, transaction);
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            return "success";
        }

        public ConsumerPlans[] getConsumerPlans(string token, string consumerId)
        {
            string assessmentString = adg.getConsumerPlans(token, consumerId);
            ConsumerPlans[] assessmentsObj = js.Deserialize<ConsumerPlans[]>(assessmentString);
            return assessmentsObj;
        }

        public ConsumerAssessment[] getConsumerAssessment(string token, string consumerPlanId)
        {
            string assessmentString = adg.getConsumerAssessment(token, "NO", consumerPlanId);
            ConsumerAssessment[] assessmentObj = js.Deserialize<ConsumerAssessment[]>(assessmentString);
            return assessmentObj;
        }

        public string switchPlanType(string token, string consumerPlanId, string planType)
        {
            string resultString = adg.switchPlanType(token, consumerPlanId, planType);
            return resultString;
        }

        public string insertConsumerPlan(string token, string consumerId, string assessmentVersionId, string planType, string planYearStart, string planYearEnd, string effectiveStart, string effectiveEnd, string active, string reviewDate)
        {
            // insert the assessment
            string assessmentIdObj = adg.insertConsumerPlan(token, consumerId, planType, planYearStart, planYearEnd, effectiveStart, effectiveEnd, active, reviewDate);

            ConsumerPlan[] plan = js.Deserialize<ConsumerPlan[]>(assessmentIdObj);

            QuestionSet[] questionSets = js.Deserialize<QuestionSet[]>(adg.getQuestionSets(assessmentVersionId));

            foreach (QuestionSet qset in questionSets)
            {
                Int32 answerRows = Int32.Parse(qset.questionSetAnswerRowcount);
                Question[] questions = js.Deserialize<Question[]>(adg.getQuestions(qset.questionSetId));

                // for each row, insert each question in the question set
                for (int i = 1; i <= answerRows; i++)
                {
                    foreach (Question question in questions)
                    {
                        // parse default answers into an array of default answers based on the '~~' delimeter
                        string[] separatingStrings = { "~~" };
                        string[] defaultAnswers = question.questionDefaultAnswer.Split(separatingStrings, System.StringSplitOptions.RemoveEmptyEntries);
                        // if a default answer exists, use it, otherwise set answer to null
                        string answer = i <= defaultAnswers.Length ? (defaultAnswers[i - 1] == "==TODAY") ? DateTime.Now.ToString("yyyy-MM-dd") : defaultAnswers[i - 1] : null;
                        // insert answer record
                        adg.insertConsumerAssessmentAnswer(plan[0].consumerPlanId, question.questionId, i.ToString(), answer);
                    }
                }
            }

            return assessmentIdObj;
        }

        public string insertPlanReportToBeTranferredToONET(string token, string report, long planId)
        {
            // insert the annaul consumer plan and assessment
            adg.insertPlanReportToBeTranferredToONET(token, report, planId);
            return "Success";
        }

        public string transferPlanReportToONET(string token, long planId)
        {
            // insert the annaul consumer plan and assessment
            return adg.transferPlanReportToONET(token, planId);
        }

        public ServiceAndsSupportData getServiceAndSupportsData(string token, string effectiveStartDate, string effectiveEndDate, long consumerId, string areInSalesForce, string planId)
        {
            planId = planId.TrimEnd(',');
            //get assessment areas
            string assessmentAreas = adg.getAssessmentAreas(token);
            AssessmentAreas[] assessmentAreasObj = js.Deserialize<AssessmentAreas[]>(assessmentAreas);
            //get vendors
            string vendorString = adg.getServiceVendors(token);
            ServiceVendors[] vendorObj = js.Deserialize<ServiceVendors[]>(vendorString);
            //get service types -----
            string serviceTypeString = adg.getServiceTypes(token);
            ServiceTypesOther[] serviceTypeObj = js.Deserialize<ServiceTypesOther[]>(serviceTypeString);
            //get funding source
            //string fundingString = adg.getFundingSource(token);
            //FundingSource[] fundingObj = js.Deserialize<FundingSource[]>(fundingString);
            // get relationships for dropdowns and in contact information section
            string relationshipString = adg.getConsumerRelationships(token, consumerId, effectiveStartDate, effectiveEndDate, areInSalesForce, planId);
            ConsumerRelationships[] relationshipObj = js.Deserialize<ConsumerRelationships[]>(relationshipString);
            ServiceAndsSupportData sASData = new ServiceAndsSupportData();
            sASData.assessmentAreas = assessmentAreasObj;
            sASData.serviceVendors = vendorObj;
            sASData.serviceTypesOther = serviceTypeObj;
            //sASData.fundingSource = fundingObj;
            sASData.relationships = relationshipObj;
            return sASData;
        }

        public ServiceVendors[] getPaidSupportsVendors(string fundingSourceName, string serviceName, string areInSalesForce)
        {
            string vendorString = adg.getPaidSupportsVendors(fundingSourceName, serviceName, areInSalesForce);
            ServiceVendors[] vendorObj = js.Deserialize<ServiceVendors[]>(vendorString);

            return vendorObj;
        }

        public ActiveVendors[] getAllActiveVendors(string token)
        {
            string vendorString = adg.getAllActiveVendors(token);
            ActiveVendors[] vendorObj = js.Deserialize<ActiveVendors[]>(vendorString);

            return vendorObj;
        }

        public class ServiceAndsSupportData
        {
            public AssessmentAreas[] assessmentAreas { get; set; }
            public ServiceVendors[] serviceVendors { get; set; }
            public ServiceTypesOther[] serviceTypesOther { get; set; }
            public FundingSource[] fundingSource { get; set; }
            public ConsumerRelationships[] relationships { get; set; }
        }

        public class AssessmentAreas
        {
            public string assessmentAreaId { get; set; }
            public string assessmentArea { get; set; }
        }

        public class ServiceVendors
        {
            public string vendorId { get; set; }
            public string vendorName { get; set; }
        }

        public class ActiveVendors
        {
            public string vendorId { get; set; }
            public string vendorName { get; set; }
            public string vendorAddress { get; set; }
        }

        public class ServiceTypesOther
        {
            public string serviceId { get; set; }
            public string serviceTypeDescription { get; set; }
        }

        public class FundingSource
        {
            public string fundingSourceId { get; set; }
            public string fundingSourceDescription { get; set; }
        }

        public class ConsumerRelationships
        {
            public string peopleId { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string middleName { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
            public string email { get; set; }
            public string phone { get; set; }
            public string salesForceId { get; set; }
            public string relationship { get; set; }
            public string contactId { get; set; }
            public string buildingNumber { get; set; }
            public string dateOfBirth { get; set; }
            public string signatureId { get; set; }
            public string teamMember { get; set; }
        }
    }
}