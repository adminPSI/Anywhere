using System.IO;

namespace Anywhere.service.Data.DocumentConversion
{
    public class GetReportsStreams
    {
        PlanReport planRep = new PlanReport();

        public MemoryStream createOISPAssessment(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp, string include)
        {

            MemoryStream ms = null;
            ms = planRep.createOISPAssessment(token, userId, assessmentID, versionID, extraSpace, isp, include);
            //ms.Flush();
            //ms.Close();
            //ms.Dispose();
            return ms;
        }

        public MemoryStream createOISPIntro(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp)
        {

            MemoryStream ms = null;
            ms = planRep.createOISPIntro(token, userId, assessmentID, versionID, extraSpace, isp);
            //ms.Flush();
            //ms.Close();
            //ms.Dispose();
            return ms;
        }

        public MemoryStream createOISPlan(string token, string userId, string assessmentID, string versionID, string extraSpace, bool isp, bool oneSpan, bool signatureOnly)
        {

            MemoryStream ms = null;
            ms = planRep.createOISPlan(token, userId, assessmentID, versionID, extraSpace, isp, oneSpan, signatureOnly);
            //ms.Flush();
            //ms.Close();
            //ms.Dispose();
            return ms;
        }
    }
}