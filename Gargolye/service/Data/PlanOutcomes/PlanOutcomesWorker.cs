using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanOutcomes
{
    public class PlanOutcomesWorker
    {
        PlanOutcomesDataGetter pdg = new PlanOutcomesDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();

        public string insertPlanOutcomeProgressSummary(string token, long planId, string progressSummary)
        {
            string progressSummaryId = "";
            progressSummaryId = pdg.insertPlanOutcomeProgressSummary(token, planId, progressSummary);
            OutcomeId[] outcomeIdObj = js.Deserialize<OutcomeId[]>(progressSummaryId);
            
            return progressSummaryId;
        }

        public string updatePlanOutcomeProgressSummary(string token, long progressSummaryId, string progressSummary)
        {            
            pdg.updatePlanOutcomeProgressSummary(token, progressSummaryId, progressSummary);

            return "";
        }

        public string deletePlanOutcomeProgressSummary(string token, long progressSummaryId)
        {
            pdg.deletePlanOutcomeProgressSummary(token, progressSummaryId);

            return "";
        }

        public string deletePlanOutcomeExperienceResponsibility(string token, long responsibilityId)
        {
            pdg.deletePlanOutcomeExperienceResponsibility(token, responsibilityId);

            return "";
        }

        public string insertPlanOutcome(string token, string assessmentId, string outcome, string details, string history, string sectionId, string outcomeOrder, string summaryOfProgress, int status, string carryOverReason)
        {
            string outcomeId = "";
            outcomeId = pdg.insertPlanOutcomesOutcome(token, assessmentId, outcome, details, history, sectionId, outcomeOrder, summaryOfProgress, status, carryOverReason);
            OutcomeId[] outcomeIdObj = js.Deserialize<OutcomeId[]>(outcomeId);
            
            return outcomeIdObj[0].outcomeId.ToString();
        }

        public class OutcomeId
        {
            public string outcomeId { get; set; }
        }

        public class ProgressSummaryId
        {
            public string progressSummaryId { get; set; }
        }

        public class ExperienceId
        {
            public string experienceId { get; set; }
        }

        public class ReviewId
        {
            public string reviewId { get; set; }
        }

        public class ExperienceIdsAndResponsibilityIds
        {
            public string experienceId { get; set; }
            // public ResponsibilityIds[] responsibleId { get; set; }
            public List<string> respIds = new List<string>();
        }

        public class ResponsibilityIds
        {
            public string responsibilityId { get; set; }
        }

        public class ResponsibilityId
        {
            public string responsibilityId { get; set; }
        }


        public string insertPlanOutcomesExperience(string outcomeId, string[] howHappened, string[] whatHappened, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText, string[] experienceOrder)
        {
            var i = 0;
            var j = 0;
            string experienceId = "";
            string responsibileId = "";
            //ExperienceIdsAndResponsibilityIds allIds = new ExperienceIdsAndResponsibilityIds();
            //int length = whenHowOftenValue.Length;
            //ResponsibilityIds[] responsibilityIds = new ResponsibilityIds[length];
            experienceId = pdg.insertPlanOutcomesExperience(outcomeId, howHappened[i], whatHappened[i], experienceOrder[i]);
            ExperienceId[] experienceIdObj = js.Deserialize<ExperienceId[]>(experienceId);
            //foreach(string whenHowOftenVal in whenHowOftenValue)
            //{
            //    responsibileId = pdg.insertPlanOutcomeExperienceResponsibility(experienceIdObj[0].experienceId.ToString(), responsibleContact[j], responsibleProvider[j], whenHowOftenVal, whenHowOftenFrequency[j], whenHowOftenText[j]);
            //    ResponsibilityId[] responsibilityId = js.Deserialize<ResponsibilityId[]>(responsibileId);
            //    allIds.respIds.Add(responsibilityId[0].responsibilityId.ToString());
            //    //responsibilityIds[j].Equals(responsibilityId[0].responsibilityId.ToString());
            //    j++;
            //}

            //allIds.experienceId = experienceIdObj[0].experienceId.ToString();
            //allIds.responsibleId = responsibilityIds;
            return experienceIdObj[0].experienceId.ToString(); 
            //return allIds;
        }

        public List<string> insertPlanOutcomeExperienceResponsibility(string experienceId, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText)
        {
            var j = 0;
            List<string> resposibilityIds = new List<string>();
            foreach (string whenHowOftenVal in whenHowOftenValue)
            {
                string responsibileId = pdg.insertPlanOutcomeExperienceResponsibility(experienceId, responsibleContact[j], responsibleProvider[j], whenHowOftenVal, whenHowOftenFrequency[j], whenHowOftenText[j]);
                ResponsibilityId[] responsibilityId = js.Deserialize<ResponsibilityId[]>(responsibileId);
                resposibilityIds.Add(responsibilityId[0].responsibilityId.ToString());
                j++;
            }

            return resposibilityIds;
        }

        public string updatePlanOutcomeExperienceResponsibility(long[] responsibilityIds, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText)
        {
            var j = 0;
            foreach (long responsibilityId in responsibilityIds)
            {
                pdg.updatePlanOutcomeExperienceResponsibility(responsibilityId, responsibleContact[j], responsibleProvider[j], whenHowOftenValue[j], whenHowOftenFrequency[j], whenHowOftenText[j]);
                j++;
            }

            return "success";
        }

        public string insertPlanOutcomesReview(long outcomeId, string[] whatWillHappen, string[] whenToCheckIn, string[] whoReview, string[] reviewOrder, long[] contactId)
        {
            var j = 0;
            string reviewId = "";
            
            reviewId = pdg.insertPlanOutcomesReview(outcomeId, whatWillHappen[j], whenToCheckIn[j], whoReview[j], reviewOrder[j], contactId[j].ToString());
            ReviewId[] reviewIdObj = js.Deserialize<ReviewId[]>(reviewId);
           
            return reviewIdObj[0].reviewId.ToString();
        }

        public string updatePlanOutcome(string token, string assessmentId, string outcomeId, string outcome, string details, string history, string sectionId, string summaryOfProgress, int status, string carryOverReason)
        {
            
            pdg.updatePlanOutcomesOutcome(token, assessmentId, outcomeId, outcome, details, history, sectionId, summaryOfProgress, status, carryOverReason);
            //Insert Experience
            var i = 0;
            
            return "Sucess";
        }

        public string updatePlanOutcomesExperience(string outcomeId, string[] experienceIds, string[] howHappened, string[] whatHappened, long[] responsibilityIds, int[] responsibleContact, int[] responsibleProvider, string[] whenHowOftenValue, int[] whenHowOftenFrequency, string[] whenHowOftenText)
        {
            var i = 0;
            var j = 0;
            
            pdg.updatePlanOutcomesExperience(outcomeId, experienceIds[i], howHappened[i], whatHappened[i]);
            if(responsibilityIds!= null)
            {
                foreach (long responsibilityId in responsibilityIds)
                {
                    pdg.updatePlanOutcomeExperienceResponsibility(responsibilityId, responsibleContact[j], responsibleProvider[j], whenHowOftenValue[j], whenHowOftenFrequency[j], whenHowOftenText[j]);
                    j++;
                }
            }
            

            return "Sucess";
        }

        public string updatePlanOutcomesReview(long outcomeId, string[] reviewIds, string[] whatWillHappen, string[] whenToCheckIn, string[] whoReview, long[] contactId)
        {
            var j = 0;
            
            pdg.updatePlanOutcomesReview(outcomeId, reviewIds[j], whatWillHappen[j], whenToCheckIn[j], whoReview[j], contactId[j]);
              
            return "Sucess";
        }

        public string updatePlanOutcomesExperienceOrder(string token, long outcomeId, long experienceId, int newPos, int oldPos)
        {
            pdg.updatePlanOutcomesExperienceOrder(token, outcomeId, experienceId, newPos, oldPos);
            
            return "Sucess";
        }

        public string updatePlanOutcomesReviewOrder(string token, long outcomeId, long reviewId, int newPos, int oldPos)
        {
            pdg.updatePlanOutcomesReviewOrder(token, outcomeId, reviewId, newPos, oldPos);

            return "Sucess";
        }

        public string deletePlanOutcome(string token, string outcomeId)
        {
            return pdg.deletePlanOutcome(token, outcomeId);
        }

        public string deletePlanOutcomeExperience(string token, string outcomeId, string experienceId)
        {
            return pdg.deletePlanOutcomeExperience(token, outcomeId, experienceId);
        }

        public string deletePlanOutcomeReview(string token, string outcomeId, string reviewId)
        {
            return pdg.deletePlanOutcomeReview(token, outcomeId, reviewId);
        }

        public PlanTotalOutcome getPlanSpecificOutcomes(string token, string assessmentId, int targetAssessmentVersionId)
        {
            //get outcome
            string planOutcomesString = pdg.getPlanOutcomes(token, assessmentId, targetAssessmentVersionId);
            PlanOutcomes[] planOutcomesObj = js.Deserialize<PlanOutcomes[]>(planOutcomesString);
            //get experiences
            string planOutcomesExperiencesString = pdg.getPlanExperiences(token, assessmentId);
            PlanOutcomesExperiences[] planOutcomesExperiencesObj = js.Deserialize<PlanOutcomesExperiences[]>(planOutcomesExperiencesString);
            //get experience responsibilities for each experience      
            for (int j = 0; j < planOutcomesExperiencesObj.Length; j++)
            {
                string experienceResponsibilityString = pdg.getPlanExperienceResponsibility(planOutcomesExperiencesObj[j].experienceId);
                PlanOutcomeExperienceResponsibilities[] experienceResponsibilityObj = js.Deserialize<PlanOutcomeExperienceResponsibilities[]>(experienceResponsibilityString);
                planOutcomesExperiencesObj[j].planExperienceResponsibilities = experienceResponsibilityObj;
            }            
            //get review
            string planOutcomesReviewString = pdg.getPlanReviews(token, assessmentId);
            PlanOutcomesReviews[] planOutcomesReviewObj = js.Deserialize<PlanOutcomesReviews[]>(planOutcomesReviewString);
            //get progress summary
            string planOutcomesProgressSummaryString = pdg.getPlanOutcomeProgressSummary(token, assessmentId);
            PlanPorgressSummary[] planOutcomesProgressSummaryObj = js.Deserialize<PlanPorgressSummary[]>(planOutcomesProgressSummaryString);

            PlanTotalOutcome totalOutcome = new PlanTotalOutcome();
            totalOutcome.planOutcome = planOutcomesObj;
            totalOutcome.planOutcomeExperiences = planOutcomesExperiencesObj;
            totalOutcome.planReviews = planOutcomesReviewObj;
            totalOutcome.planProgressSummary = planOutcomesProgressSummaryObj;

            return totalOutcome;
        }

        public void carryOverOutcomesToNewPlan(string consumerPlanId, string priorConsumerPlanId, string targetAssessmentVersionId, string token)
        {
            string progressSummaryId = "";
            string outcomeId = "";
            int outcomeStatus = 0;
            PlanTotalOutcome outcomes = getPlanSpecificOutcomes("token", priorConsumerPlanId, int.Parse(targetAssessmentVersionId));
            for(int i = 0; i < outcomes.planOutcome.Length; i++)
            {
                if(outcomes.planOutcome[i].status == 1.ToString())
                {
                    //do nothing, it is completed
                }
                else
                {
                    if (outcomes.planOutcome[i].status == "")
                    {
                        outcomeStatus = 3;
                    }
                    else
                    {
                        outcomeStatus = int.Parse(outcomes.planOutcome[i].status);
                    }
                    outcomeId = pdg.insertPlanOutcomesOutcome("token", consumerPlanId, outcomes.planOutcome[i].outcome, outcomes.planOutcome[i].details, outcomes.planOutcome[i].history, outcomes.planOutcome[i].sectionId, outcomes.planOutcome[i].outcomeOrder, outcomes.planOutcome[i].summaryOfProgress, outcomeStatus, outcomes.planOutcome[i].carryOverReason);
                    OutcomeId[] outcomeIdObj = js.Deserialize<OutcomeId[]>(outcomeId);
                    for (int j = 0; j < outcomes.planOutcomeExperiences.Length; j++)
                    {
                        string experienceId = "";
                        long respContact = 0;
                        long respProvider = 0;
                        long whenFreq = 0;
                        if (outcomes.planOutcomeExperiences[j].outcomeId == outcomes.planOutcome[i].outcomeId)
                        {
                            experienceId = pdg.insertPlanOutcomesExperience(outcomeIdObj[0].outcomeId, outcomes.planOutcomeExperiences[j].howHappened, outcomes.planOutcomeExperiences[j].whatHappened, outcomes.planOutcomeExperiences[j].experienceOrder);
                        }
                        ExperienceId[] experienceIdObj = js.Deserialize<ExperienceId[]>(experienceId);
                        if (experienceIdObj != null)
                        {
                            if (outcomes.planOutcomeExperiences[j].planExperienceResponsibilities.Length > 0)
                            {
                                for (int k = 0; k < outcomes.planOutcomeExperiences[j].planExperienceResponsibilities.Length; k++)
                                {
                                    if (outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].responsibleContact != null && outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].responsibleContact != "")
                                    {
                                        respContact = long.Parse(outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].responsibleContact);
                                    }
                                    else
                                    {
                                        respContact = 0;
                                    }
                                    if (outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].responsibleProvider != null && outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].responsibleProvider != "")
                                    {
                                        respProvider = long.Parse(outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].responsibleProvider);
                                    }
                                    else
                                    {
                                        respProvider = 0;
                                    }
                                    if (outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].whenFrequency != null && outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].whenFrequency != "")
                                    {
                                        whenFreq = long.Parse(outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].whenFrequency);
                                    }
                                    else
                                    {
                                        whenFreq = 0;
                                    }

                                    pdg.insertPlanOutcomeExperienceResponsibility(experienceIdObj[0].experienceId.ToString(), respContact, respProvider,
                                                                                  outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].whenValue, whenFreq,
                                                                                  outcomes.planOutcomeExperiences[j].planExperienceResponsibilities[k].whenOther);
                                }
                            }
                        }

                    }
                    for (int k = 0; k < outcomes.planReviews.Length; k++)
                    {
                        if (outcomes.planReviews[k].outcomeId == outcomes.planOutcome[i].outcomeId)
                        {
                            pdg.insertPlanOutcomesReview(long.Parse(outcomeIdObj[0].outcomeId), outcomes.planReviews[k].whatWillHappen, outcomes.planReviews[k].whenToCheckIn, outcomes.planReviews[k].who, outcomes.planReviews[k].reviewOrder, outcomes.planReviews[k].contactId);
                        }
                    }
                }
                                
            }
            if (outcomes.planProgressSummary.Length > 0)
            {
                progressSummaryId = pdg.insertPlanOutcomeProgressSummary(token, long.Parse(consumerPlanId), outcomes.planProgressSummary[0].progressSummary);
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

        public class PlanTotalOutcome
        {            
            public PlanOutcomes[] planOutcome { get; set; }
            public PlanOutcomesExperiences[] planOutcomeExperiences { get; set; }
            public PlanOutcomesReviews[] planReviews { get; set; }
            public PlanPorgressSummary[] planProgressSummary { get; set; }
        }

        public class PlanPorgressSummary
        {
            public string planId { get; set; }
            public string progressSummaryId { get; set; }
            public string progressSummary { get; set; }
        }


        public class PlanOutcomes
        {
            public string outcomeId { get; set; }
            public string details { get; set; }
            public string outcome { get; set; }
            public string history { get; set; }
            public string sectionId { get; set; }
            public string outcomeOrder { get; set; }
            public string summaryOfProgress { get; set; }
            public string status { get; set; }
            public string carryOverReason { get; set; }
        }

        public class PlanOutcomesExperiences
        {
            public string outcomeId { get; set; }
            public string experienceId { get; set; }
            public string howHappened { get; set; }
            public string whatHappened { get; set; }
            public string experienceOrder { get; set; }
            public PlanOutcomeExperienceResponsibilities[] planExperienceResponsibilities { get; set; }
        }

        public class PlanOutcomeExperienceResponsibilities
        {
            public string responsibilityId { get; set; }
            public string responsibleContact { get; set; }
            public string responsibleProvider { get; set; }
            public string whenFrequency { get; set; }
            public string whenOther { get; set; }
            public string whenValue { get; set; }
        }

        public class PlanOutcomesReviews
        {
            public string outcomeId {get; set;}
            public string outcomeReviewId { get; set; }
            public string whatWillHappen { get; set; }
            public string whenToCheckIn { get; set; }
            public string who { get; set; }
            public string whoResponsible { get; set; }
            public string contactId { get; set; }
            public string reviewOrder { get; set; }
        }

    }
}