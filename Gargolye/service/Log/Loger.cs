using Anywhere.Data;
using Anywhere.service.Com;
using System;
using System.Configuration;
using System.Web;

namespace Anywhere.Log
{
    public class Loger
    {
        private static readonly log4net.ILog logger = log4net.LogManager.GetLogger(typeof(Loger));
        private string location = ConfigurationManager.AppSettings["location"].ToString();
        AnyErr ar = new AnyErr();

        public void trace(string errNum, string message)
        {
            trace(errNum, message, "");
        }

        public void trace(string errNum, string message, string token)
        {
            logger.Debug("<font color='#008000'>" + message + "</font>");

            String user = "Unknown User";
            if (token.Length > 2)
            {
                user = getUserFromDB(token);
            }

            DateTime now = DateTime.Now;
            ar.ErrReciever(now.ToString("yyyy-MM-dd HH:mm:ss"), location, "DataGetter", errNum, HttpUtility.HtmlEncode(message), "TRACE");
        }


        public void debug(string message)
        {
            logger.Debug("<font color='#008000'>" + message + "</font>");
        }


        public void warn(string errNum, string message)
        {
            logger.Warn("<font color='#c0c000'>" + message + "</font>");

            DateTime now = DateTime.Now;
            ar.ErrReciever(now.ToString("yyyy-MM-dd HH:mm:ss"), location, "DataGetter", errNum, HttpUtility.HtmlEncode(message), "WARN");
        }


        public void error(string errNum, string message)
        {
            error(errNum, message, "");
        }

        public void error(string errNum, string message, string token)
        {
            logger.Error("<font color='#800000'>" + message + "</font>");

            String user = "Unknown User";
            if (token.Length > 2)
            {
                user = getUserFromDB(token);
            }

            DateTime now = DateTime.Now;
            ar.ErrReciever(now.ToString("yyyy-MM-dd HH:mm:ss"), location, user, errNum, HttpUtility.HtmlEncode(formartMessage(message)), "ERROR");
        }

        public void fatal(string errNum, string message, string token)
        {
            logger.Fatal("<font color='#800000'>" + message + "</font>");

            String user = "Unknown User";
            if (token.Length > 2)
            {
                user = getUserFromDB(token);
            }

            DateTime now = DateTime.Now;
            ar.ErrReciever(now.ToString("yyyy-MM-dd HH:mm:ss"), location, user, errNum, HttpUtility.HtmlEncode(formartMessage(message)), "FATAL");

        }

        public string formartMessage(string message)
        {
            //message = message.Replace(" ", "");
            message = message.Replace("'", "");
            String temp = HttpUtility.HtmlEncode(message);

            return message;
        }

        public string getUserFromDB(string token)
        {
            DataGetter dg = new DataGetter();
            string ret = dg.getUserByToken(token);


            string name = ret.Substring(ret.IndexOf("<userId>") + 8);
            name = name.Substring(0, name.IndexOf("</userId>"));

            return name;
        }
    }
}