using Anywhere.service.Data.PlanOutcomes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel.Web;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanDiscoveryAssessmentSummary
{
    public class PlanDiscoverySummaryWorker
    {
        PlanDiscoveryAssessmentSummaryDataGetter dg = new PlanDiscoveryAssessmentSummaryDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public AssessmentSummaryQuestions[] getAssessmentSummaryQuestions(string token, long anywAssessmentId)
        {
            string questionString = dg.getAssessmentSummaryQuestions(token, anywAssessmentId);
            js.MaxJsonLength = Int32.MaxValue;
            AssessmentSummaryQuestions[] questionObj = js.Deserialize<AssessmentSummaryQuestions[]>(questionString);
            return questionObj;
        }

        public AdditionalAssessmentSummaryQuestions[] getAdditionalAssessmentSummaryQuestions(long anywAssessmentId)
        {
            string questionString = dg.getAdditionalAssessmentSummaryQuestions(anywAssessmentId);
            AdditionalAssessmentSummaryQuestions[] questionObj = js.Deserialize<AdditionalAssessmentSummaryQuestions[]>(questionString);
            return questionObj;
        }
        //need inserts - may not need inserts, they are created when plan is added
        public SummarySavedAnswerIds insertAssessmentSummaryAnswers(string token, long anywAssessmentId, long[] anywQuestionIds, int[] answerRow, string[] answers, string userId)
        {
            string testc = "";
            SummarySavedAnswerIds savedAnswerObj = new SummarySavedAnswerIds();
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    // validate session token
                    if (!dg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    var i = 0;
                    foreach (long questionId in anywQuestionIds)
                    {
                        testc =  dg.insertAssessmentSummaryAnswer(anywAssessmentId, questionId, answerRow[i], answers[i], userId);
                        SummaryAnswer[] singAnswerObj = js.Deserialize<SummaryAnswer[]>(testc);
                        if(i == 0)
                        {
                            savedAnswerObj.questionIdOne = questionId.ToString();
                            savedAnswerObj.answerIdOne = singAnswerObj[0].consumerAssessmentAnswerId;
                        } else if(i == 1)
                        {
                            savedAnswerObj.questionIdTwo = questionId.ToString();
                            savedAnswerObj.answerIdTwo = singAnswerObj[0].consumerAssessmentAnswerId;
                        }
                        else if (i == 2)
                        {
                            savedAnswerObj.questionIdThree = questionId.ToString();
                            savedAnswerObj.answerIdThree = singAnswerObj[0].consumerAssessmentAnswerId;
                        } else
                        {
                            savedAnswerObj.questionIdFour = questionId.ToString();
                            savedAnswerObj.answerIdFour = singAnswerObj[0].consumerAssessmentAnswerId;
                        }
                        
                        i++;
                    }

                    return savedAnswerObj;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        //need updates

        public string updateAdditionalAssessmentSummaryAnswer(long anywAssessmentId, string aloneTimeAmount, string providerBackUp)
        {
            return dg.updateAdditionalAssessmentSummaryAnswer(anywAssessmentId, aloneTimeAmount, providerBackUp);
        }

        public string updateBestWayToConnect(string token, long anywAssessmentId, int bestWayId)
        {
            return dg.updateBestWayToConnect(token, anywAssessmentId, bestWayId);
        }

        public string updatePlaceOnPath(string token, long anywAssessmentId, int placeId)
        {
            return dg.updatePlaceOnPath(token, anywAssessmentId, placeId);
        }

        public string updateMoreDetail(string token, long anywAssessmentId, string detail)
        {
            return dg.updateMoreDetail(token, anywAssessmentId, detail);
        }

        public string updateAssessmentSummaryAnswers(string token, long anywAssessmentId, long[] anywAnswerIds, string[] answers, string userId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    // validate session token
                    if (!dg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    var i = 0;
                    foreach (long answerId in anywAnswerIds)
                    {
                        dg.updateAssessmentSummaryAnswer(anywAssessmentId, answerId, answers[i], userId);
                        i++;
                    }

                    return "Success";
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public class SummaryAnswer
        {
            public string consumerAssessmentAnswerId { get; set; }
        }

        public class SummarySavedAnswerIds
        {
            public string questionIdOne { get; set; }
            public string answerIdOne { get; set; }
            public string questionIdTwo { get; set; }
            public string answerIdTwo { get; set; }
            public string questionIdThree { get; set; }
            public string answerIdThree { get; set; }
            public string questionIdFour { get; set; }
            public string answerIdFour { get; set; }
        }

        public class AssessmentSummaryQuestions
        {
            public string questionId { get; set; }
            public string questionTag { get; set; }
            public string questionText { get; set; }
            public string questionPrompt { get; set; }
            public string questionOrder { get; set; }
            public string answerStyle { get; set; }
            public string defaultAnswer { get; set; }
            public string requiresAnswer { get; set; }
            public string questionSetId { get; set; }
            public string answerId { get; set; }
            public string planId { get; set; }
            public string answerRow { get; set; }
            public string answer { get; set; }
            public string sectionTitle { get; set; }
            public string sectionOrder { get; set; }
            public string sectionId { get; set; }
            //public string subsectionTitle { get; set; }
        }

        public class AdditionalAssessmentSummaryQuestions
        {
            public string aloneTimeAmount { get; set; }
            public string providerBackUp { get; set; }
            public string bestWayToConnect { get; set; }
            public string moreDetail { get; set; }
            public string placeOnPath { get; set; }
        }
    }
}