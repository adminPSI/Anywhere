using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.WaitingListAssessment
{
    public class WaitingListWorker
    {
        WaitingListDataGetter dg = new WaitingListDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
    }
}