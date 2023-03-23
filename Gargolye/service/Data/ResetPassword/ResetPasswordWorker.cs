using System.Web.Script.Serialization;

namespace Anywhere.service.Data.ResetPassword
{
    public class ResetPasswordWorker
    {
        ResetPasswordDataGetter rpdg = new ResetPasswordDataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();


        public ActiveInactiveUser[] getActiveInactiveUserDateJSON(string token, string isActive)
        {
            string seByDateString = rpdg.getActiveInactiveUserDateJSON(token, isActive);
            ActiveInactiveUser[] seByDateObj = js.Deserialize<ActiveInactiveUser[]>(seByDateString);
            return seByDateObj;
        }

        public string updateActiveInactiveUserDateJSON(string token, string isActive, string userId)
        {
            string seByDateString = rpdg.updateActiveInactiveUserDateJSON(token, isActive, userId);
            string seByDateObj = "";
            return seByDateObj;
        }

        public class ActiveInactiveUser
        {
            public string User_ID { get; set; }
            public string Last_Name { get; set; }
            public string First_Name { get; set; }
            public string Active { get; set; }
        }

    }

}


