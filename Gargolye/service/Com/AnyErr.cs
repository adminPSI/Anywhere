using System;
using System.Configuration;
using System.IO;
using System.Net;
using System.Text;

namespace Anywhere.service.Com
{
    public class AnyErr
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(AnyErr));

        private string connectString = ConfigurationManager.AppSettings["AnyErr"].ToString();

        public string ErrReciever(string timestamp, string location, string user, string errnum, string errmsg, string severity)
        {
            return ErrSender("t=" + timestamp + "&l=" + location + "&u=" + user + "&en=" + errnum + "&em=" + errmsg + "&s=" + severity);
        }


        public string ErrSender(string message)
        {
            try
            {
                WebRequest req = WebRequest.Create(connectString);
                string postData = message;

                byte[] send = Encoding.Default.GetBytes(postData);
                req.Method = "POST";
                req.ContentType = "application/x-www-form-urlencoded";
                req.ContentLength = send.Length;

                Stream sout = req.GetRequestStream();
                sout.Write(send, 0, send.Length);
                sout.Flush();
                sout.Close();

                WebResponse res = req.GetResponse();
                StreamReader sr = new StreamReader(res.GetResponseStream());
                string returnvalue = sr.ReadToEnd();
            }
            catch (Exception ex)
            {
                logger.Error(ex.StackTrace);
            }

            return "complete";
        }
    }
}