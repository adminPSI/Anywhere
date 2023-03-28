using System;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanIntroduction
{
    public class PlanIntroductionWorker
    {
        PlanIntroductionDataGetter pdg = new PlanIntroductionDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();


        //public string insertPlanOutcome(string token, string assessmentId, string outcome, string details, string history, string sectionId, string outcomeOrder, string summaryOfProgress, int status, string carryOverReason)
        //{
        //    string outcomeId = "";
        //    outcomeId = pdg.insertPlanOutcomesOutcome(token, assessmentId, outcome, details, history, sectionId, outcomeOrder, summaryOfProgress, status, carryOverReason);
        //    OutcomeId[] outcomeIdObj = js.Deserialize<OutcomeId[]>(outcomeId);

        //    return outcomeIdObj[0].outcomeId.ToString();
        //}



        public string updatePlanIntroduction(string token, string planId, string consumerId, string likeAdmire, string thingsImportantTo, string thingsImportantFor, string howToSupport, int usePlanImage, string consumerImage)
        {

            pdg.updatePlanIntroduction(token, planId, consumerId, likeAdmire, thingsImportantTo, thingsImportantFor, howToSupport, usePlanImage, consumerImage);
            //Insert Experience
            var i = 0;

            return "Sucess";
        }

        public PlanIntroduction getPlanIntroduction(string token, string planId, string consumerId)
        {
            //get introduction
            string planIntroductionString = pdg.getPlanIntroduction(token, planId, consumerId);
            js.MaxJsonLength = Int32.MaxValue;
            PlanIntroduction[] planIntroductionObj = js.Deserialize<PlanIntroduction[]>(planIntroductionString);

            return planIntroductionObj[0];
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

        public class PlanIntroduction
        {
            public string planId { get; set; }
            public string consumerId { get; set; }
            public string usePlanImage { get; set; }
            public string consumerImage { get; set; }
            public string likeAdmire { get; set; }
            public string thingsImportantTo { get; set; }
            public string thingsImportantFor { get; set; }
            public string howToSupport { get; set; }

        }


        public void carryOverPlanIntroduction(string consumerPlanId, string priorConsumerPlanId, string token)
        {
            string planIntroductionString = pdg.getPlanIntroduction(token, priorConsumerPlanId, "0");
            js.MaxJsonLength = Int32.MaxValue;
            PlanIntroduction[] planIntroductionObj = js.Deserialize<PlanIntroduction[]>(planIntroductionString);
            for (int i = 0; i < planIntroductionObj.Length; i++)
            {
                if (planIntroductionObj[i].consumerImage != null)
                {
                    updatePlanIntroduction(token, consumerPlanId, "0", planIntroductionObj[i].likeAdmire, planIntroductionObj[i].thingsImportantTo, planIntroductionObj[i].thingsImportantFor, planIntroductionObj[i].howToSupport, int.Parse(planIntroductionObj[i].usePlanImage), planIntroductionObj[i].consumerImage);

                }
            }
        }

    }
}