using System;
using System.IO;
using System.Text;
using System.Net;
using System.Xml;
using System.Web.Script.Serialization;
using System.Web.Configuration;
using System.Text.RegularExpressions;
namespace Anywhere.Data
{
    public class IntelliviewDataGetter
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        DataGetter dg = new DataGetter();
        string refidIdentifier = WebConfigurationManager.AppSettings["intellivueRefidIdentifier"];
        string url = "";
        private readonly static string reservedCharacters = "!*'();:@&=+$,/?%#[]";

        public string getApplicationListHostedWithUser(string token, string userId)
        {
            if (tokenValidator(token) == false) return null;
            string domain = dg.getIntellivueDomain(token);//"ButlerCBDD";// 
            url = dg.getIntellivueAppIdURL(token);//"https://intellicloud1.intellinetics.com/HSS1/intellivuewebapi/icmcoreservice.asmx/";
            WebRequest request = WebRequest.Create(url + "ListApplicationsHostedWithUser");
            request.Method = "POST";
            string postData = "hostDomain=" + domain + "&userName=" + userId;
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
            return responseFromServer;
        }

        public string getIntellivueViewURL(string token, string consumerId, string userId, string appName, string applicationName)
        {
            if (tokenValidator(token) == false) return null;
            string domain = dg.getIntellivueDomain(token);
            string consumerNumber = dg.getConsumerNumberForIntellivue(token, consumerId);
            if (applicationName == "Advisor")
            {
                consumerNumber = "CONSUMER_NO=" + consumerNumber;
            }
            else
            {
                consumerNumber = "LOCAL_ID=" + consumerNumber;
            }
            return intellivueLogInUser(token, userId, appName, consumerNumber, domain);
        }

        public string getIntellivueAppId(string token, string consumerId, string userId, string applicationName)
        {
            if (tokenValidator(token) == false) return null;
            if (applicationName == "Advisor")
            {
                string domain = dg.getIntellivueDomain(token);
                string consumerNumber = dg.getConsumerNumberForIntellivue(token, consumerId);
                url = dg.getIntellivueAppIdURL(token);
                WebRequest request = WebRequest.Create(url + "ListApplicationsHostedWithUser");
                request.Method = "POST";
                string postData = "hostDomain=" + domain + "&userName=" + userId;
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
                string[] words = responseFromServer.Split(' ');
                var index = Array.FindIndex(words, row => row.Contains(refidIdentifier));
                string test = words[index - 1];
                string appId = Regex.Match(test, @"\d+").Value;
                consumerNumber = "CONSUMER_NO=" + consumerNumber;
                return intellivueLogInUser(token, userId, appId, consumerNumber, domain);
            }
            else
            {
                string domain = dg.getIntellivueDomain(token);
                string consumerNumber = dg.getConsumerNumberForIntellivue(token, consumerId);
                url = dg.getIntellivueAppIdURL(token);
                WebRequest request = WebRequest.Create(url + "ListApplicationsHostedWithUser");
                request.Method = "POST";
                string postData = "hostDomain=" + domain + "&userName=" + userId;
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
                string[] words = responseFromServer.Split(' ');
                var index = Array.FindIndex(words, row => row.Contains(refidIdentifier));
                string test = words[index - 1];
                string appId = Regex.Match(test, @"\d+").Value;
                consumerNumber = "LOCAL_ID=" + consumerNumber;
                return intellivueLogInUser(token, userId, appId, consumerNumber, domain);
            }
        }

        public string intellivueLogInUser(string token, string userId, string appId, string consumerNumber, string domain)//loginUser
        {
            if (tokenValidator(token) == false) return null;
            string password = "";
            int start, end, space;
            password = dg.getIntellivueCredentials(token);
            password = PasswordEncode(password);
            url = dg.getIntellivueURL(token);
            XmlDocument document = new XmlDocument();
            WebRequest request = WebRequest.Create(url + "GetViewUrl");
            request.Method = "POST";
            string postData = "domain=" + domain + "&userName=" + userId + "&passWord=" + password + "&appId=" + appId + "&query=" + consumerNumber;
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            try
            {
                WebResponse response = request.GetResponse();
                Console.WriteLine(((HttpWebResponse)response).StatusDescription);
                dataStream = response.GetResponseStream();
                StreamReader reader = new StreamReader(dataStream);
                string responseFromServer = reader.ReadToEnd();
                start = responseFromServer.IndexOf("<Url>", 0);
                start = start + 5;
                end = responseFromServer.IndexOf("</Url>", 0);
                space = end - start;
                string URL = responseFromServer.Substring(start, space);
                return URL;
            }
            catch (Exception e)
            {
                return intellivueLogInUserWithCertficates(token, userId, appId, consumerNumber, domain);
            }
        }
        public string intellivueLogInUserWithCertficates(string token, string userId, string appId, string consumerNumber, string domain)//loginUser
        {
            if (tokenValidator(token) == false) return null;
            string password = "";
            int start, end, space;
            password = dg.getIntellivueCredentials(token);
            password = PasswordEncode(password);
            url = dg.getIntellivueURL(token);
            XmlDocument document = new XmlDocument();
            WebRequest request = WebRequest.Create(url + "GetViewUrl");
            request.Method = "POST";
            string postData = "domain=" + domain + "&userName=" + userId + "&passWord=" + password + "&appId=" + appId + "&query=" + consumerNumber + "&subfolderName=" + "Certificates";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            request.ContentType = "application/x-www-form-urlencoded";
            request.ContentLength = byteArray.Length;
            Stream dataStream = request.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();
            WebResponse response = request.GetResponse();
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            dataStream = response.GetResponseStream();
            StreamReader reader = new StreamReader(dataStream);
            string responseFromServer = reader.ReadToEnd();
            start = responseFromServer.IndexOf("<Url>", 0);
            start = start + 5;
            end = responseFromServer.IndexOf("</Url>", 0);
            space = end - start;
            string URL = responseFromServer.Substring(start, space);
            return URL;
        }

        public bool tokenValidator(string token)
        {
            if (token.Contains(" "))
            {
                return false;
            }
            else
            {
                return true;
            }
        }
        public static string PasswordEncode(string password)
        {
            if (String.IsNullOrEmpty(password))
                return String.Empty;
            var sb = new StringBuilder();
            foreach (char @char in password)
            {
                if (reservedCharacters.IndexOf(@char) == -1)
                    sb.Append(@char);
                else
                    sb.AppendFormat("%{0:X2}", (int)@char);
            }
            return sb.ToString();
        }
        public class GetViewUrlResult
        {
            public int ServiceError { get; set; }
            public string Url { get; set; }
        }
        public class ListApplicationsResult
        {
            public string Applications { get; set; }
        }
    }
}