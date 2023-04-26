using Anywhere.Data;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.SimpleMar
{
    public class SignInUser
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        DataGetter dg = new DataGetter();
        static HttpClient client = new HttpClient();
        Task<string> Gtoken = null;
        string url = "";
        string urlLogin = "";

        public string createSimpleMarLoginURL(string anywhereToken)
        {
            string userId = getUserId(anywhereToken);
            string password = getCred(userId);
            string userName = getUserName(anywhereToken);
            url = dg.getEmarURL(anywhereToken);
            urlLogin = url.Replace("api", "");
            //WebRequest request = WebRequest.Create("https://stagingapi.simplemar.com/" + "token");
            //WebRequest request = WebRequest.Create("https://loginapi.simplemar.com/" + "token");
            WebRequest request = WebRequest.Create(url + "token");
            request.Method = "POST";
            //string postData = "UserName=psi.api@test.com&Password=Psi@Facility1&grant_type=password";
            string postData = "UserName=" + userName + "&Password=" + password + "&grant_type=password";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            WebResponse response = request.GetResponse();
            dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            return formatToken(responseFromServer);
        }

        public string getUserId(string token)
        {
            string userIdString = dg.getUserByTokenJSON(token);
            UserId[] userIdObj = js.Deserialize<UserId[]>(userIdString);
            return userIdObj[0].userId.ToString();
        }

        public string getUserName(string token)
        {
            string emailString = dg.getEmailFromTokenJSON(token);
            Email[] emailObj = js.Deserialize<Email[]>(emailString);
            return emailObj[0].email.ToString();
        }

        public string getCred(string userId)
        {
            string passwordString = dg.getUserCredJSON(userId);
            Cred[] credObj = js.Deserialize<Cred[]>(passwordString);
            return credObj[0].password.ToString();
        }

        public string getEmarURL(string token)
        {
            string urlString = dg.getEmarURL(token);
            emarURL[] urlObj = js.Deserialize<emarURL[]>(urlString);
            return urlObj[0].url.ToString();
        }

        public string formatToken(string token)
        {
            int start, end, space;

            start = token.IndexOf("access_token", 0);
            start = start + 15;
            end = token.IndexOf("token_type", 0);
            space = end - start - 3;
            var testc = token.Substring(start, space);
            //return "https://staging.simplemar.com/login.aspx?token="+token.Substring(start, space);
            var urlWithToken = urlLogin + "login.aspx?token=" + token.Substring(start, space);
            //return "https://login.simplemar.com/Login.aspx?token=" + testc;// token.Substring(start, space);
            return urlWithToken;
        }

        public class UserId
        {
            public string userId { get; set; }
        }

        public class Email
        {
            public string email { get; set; }
        }

        public class emarURL
        {
            public string url { get; set; }
        }

        public class Cred
        {
            public string password { get; set; }
        }
    }
}