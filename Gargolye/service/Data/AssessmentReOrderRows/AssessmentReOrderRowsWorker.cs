using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.AssessmentReOrderRows
{
    public class AssessmentReOrderRowsWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        AssessmentReOrderRowDataGetter dg = new AssessmentReOrderRowDataGetter();

        public string updateAssessmentAnswerRowOrder(string token, string answerIds, long assessmentId, long questionSetId, int newPos, int oldPos)
        {
            return dg.updateAssessmentAnswerRowOrder(token, answerIds, assessmentId, questionSetId, newPos, oldPos);
        }
    }
}