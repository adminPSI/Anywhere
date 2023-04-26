using Microsoft.VisualBasic;
using System;
using System.Data;
using System.IO;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace Anywhere.service.Data
{
    public class DataXferFunctions
    {
        private StringBuilder sb = new StringBuilder();

        static System.Timers.Timer withEventsField_MyTimer = new System.Timers.Timer();//MAT. Changed from private to static
        private static System.Timers.Timer MyTimer
        {
            get { return withEventsField_MyTimer; }
            set
            {
                if (withEventsField_MyTimer != null)
                {
                    withEventsField_MyTimer.Elapsed -= TimerEventProcessor;
                }
                withEventsField_MyTimer = value;
                if (withEventsField_MyTimer != null)
                {
                    withEventsField_MyTimer.Elapsed += TimerEventProcessor;
                }
            }
        }
        private static bool EndTimer = false;
        private static long TimerCount = 0;
        public long RetryCount = 0;
        public string ConvertDSToXML(DataSet ds)
        {

            try
            {
                System.IO.MemoryStream ms = new System.IO.MemoryStream();//MAT Added system in front of IO
                ds.WriteXml(ms, XmlWriteMode.WriteSchema);
                ms.Position = 0;

                StreamReader sr = new StreamReader(ms);
                return sr.ReadToEnd();

            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }
        public string getURL()
        {
            return "www.google.com";
        }
        public string StreamDataRead(string DataString)
        {

            System.IO.StreamReader sr = new System.IO.StreamReader(DataString);
            return sr.ReadToEnd();

        }
        public byte[] StringToByteArray(string myString)
        {

            MemoryStream ms = new MemoryStream();
            using (StreamWriter sw = new StreamWriter(ms))
            {
                sw.Write(myString);
                sw.Flush();
                return ms.ToArray();
            }

        }
        public string ByteArrayToString(byte[] ba)
        {

            MemoryStream ms = new MemoryStream(ba);
            ms.Position = 0;

            using (StreamReader sr = new StreamReader(ms))
            {
                return sr.ReadToEnd();
            }


        }
        public string JsonFormatString(string Key, string MyString)
        {


            return string.Format("{1}{0}{3}{0}:{0}{4}{0}{2}", Strings.Chr(34), Strings.Chr(123), Strings.Chr(125), Key, MyString);

        }
        public string ReadResponseStream(Stream WebResponse)
        {
            string functionReturnValue = null;

            using (WebResponse)
            {
                StreamReader objReader = new StreamReader(WebResponse);
                functionReturnValue = objReader.ReadToEnd();
                WebResponse.Close();

                return functionReturnValue;
            }
            return functionReturnValue;
        }
        public string WebRequestGetPostData(string RemoteURL)
        {


            WebRequest WRequest = WebRequest.Create(RemoteURL);

            Stream dataStream = WRequest.GetResponse().GetResponseStream();
            return ReadResponseStream(dataStream);

        }
        public WebResponse WebRequestPostString(string PostData, string RemoteURL, string Key = "Value")
        {
            //MAT. Changed the ToBinaryArray
            dynamic byteArray = Encoding.ASCII.GetBytes(PostData);
            //dynamic byteArray = PostData.ToBinaryArray;

            if (Key != "Value")
            {
                RemoteURL = string.Format("{0}/{1}", RemoteURL, Key);
            }

            WebRequest WRequest = WebRequest.Create(RemoteURL);

            WRequest.Method = "POST";
            WRequest.ContentType = "application/json";
            WRequest.ContentLength = byteArray.Length;

            GenerateToken(WRequest);

            Stream dataStream = WRequest.GetRequestStream();
            dataStream.Write(byteArray, 0, byteArray.Length);
            dataStream.Close();

            return WRequest.GetResponse();


        }
        public string WriteDataStream(string FileName)
        {
            string functionReturnValue = null;

            try
            {
                functionReturnValue = string.Empty;


                string s = string.Empty;
                s = System.IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "Temp", System.IO.Path.GetRandomFileName());//MAT removed () after BaseDirectory
                if (!System.IO.Directory.Exists(System.IO.Path.GetDirectoryName(s)))
                    System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(s));

                //Dim ser As XmlSerializer = New Serializer(GetType(DataSet))

                using (TextWriter writer = new StreamWriter(s))
                {
                    writer.Close();
                }

                FileInfo fi = new FileInfo(s);
                s = System.IO.File.ReadAllText(fi.FullName);

                fi.Delete();
                return s;
            }
            catch (Exception ex)
            {
                return string.Empty;
            }
            return functionReturnValue;


        }
        public string GetWebresonsePostData(WebResponse Response)
        {
            StreamReader readStream = new StreamReader(Response.GetResponseStream(), Encoding.UTF8);
            return readStream.ReadToEnd();
        }
        public string GetWebresonseStatusCode(WebResponse Response)
        {

            HttpWebResponse httpResponse = (HttpWebResponse)Response;
            return httpResponse.StatusCode.ToString();

            //Return Response.GetResponse

        }
        public WebResponse WebRequestGetIndex(string URL, Int32 Index)
        {

            StringBuilder sb = new StringBuilder();
            sb.Clear();
            sb.AppendFormat("{0}/{1}", URL, Index);

            WebRequest WRequest = WebRequest.Create(sb.ToString());
            WRequest.Method = "GET";

            GenerateToken(WRequest);

            return WRequest.GetResponse();

        }
        public WebResponse WebRequestGetString(string URL, string Var1)
        {

            StringBuilder sb = new StringBuilder();
            sb.Clear();
            sb.AppendFormat("{0}/{1}", URL, VerifyURLParameters(Var1));

            WebRequest WRequest = WebRequest.Create(sb.ToString());
            WRequest.Timeout = 60000;
            WRequest.Method = "GET";

            GenerateToken(WRequest);

            return WRequest.GetResponse();

            //For Each h As HttpResponseHeader In WebRequestGetString.Headers
            //    Console.WriteLine(ControlChars.Cr + "The HttpHeaders are " + ControlChars.Cr + "{0}", h.ToString)
            //Next



        }
        public DataSet ConvertHTMLToDS(string HTML)
        {
            DataSet functionReturnValue = default(DataSet);

            string fName = System.IO.Path.GetRandomFileName();
            File.WriteAllText(fName, HTML);

            functionReturnValue = new DataSet();
            functionReturnValue.ReadXml(fName, XmlReadMode.Auto);
            File.Delete(fName);
            return functionReturnValue;

        }

        public string ZipFile(string Path)
        {

            System.IO.FileInfo ifile = new System.IO.FileInfo(Path);
            string s = System.IO.Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "Temp", System.IO.Path.GetRandomFileName());//MAT removed () after BaseDirectory. Added system
            if (ifile.Exists == false)
            {
                Interaction.MsgBox("No File");
            }

            using (FileStream origFS = File.Open(ifile.FullName, FileMode.Open))
            {
                using (FileStream cFS = File.Create(s))
                {
                    using (System.IO.Compression.GZipStream compStream = new System.IO.Compression.GZipStream(cFS, System.IO.Compression.CompressionMode.Compress, true))//MAT. Added System.IO
                    {
                        origFS.CopyTo(compStream);
                        compStream.Close();
                    }
                }
            }
            return s;

        }

        public string GenerateAccessCode()
        {
            int code = 0;
            string value = string.Empty;

            AesManaged aesManaged = new AesManaged
            {
                KeySize = 256,
                BlockSize = 128,
                Mode = CipherMode.CBC
            };
            // Load the certificate into an X509Certificate object.
            X509Certificate2 cert = new X509Certificate2(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PSISign.pfx"), "P@ssw0rd");
            RSACryptoServiceProvider rsaPrivateKey = (RSACryptoServiceProvider)cert.PrivateKey;
            RSAPKCS1KeyExchangeFormatter keyFormatter = new RSAPKCS1KeyExchangeFormatter(rsaPrivateKey);
            byte[] keyEncrypted = keyFormatter.CreateKeyExchange(aesManaged.Key, aesManaged.GetType());

            return BitConverter.ToString(keyEncrypted).Replace("-", "");
            //System.Text.Encoding.UTF8.GetString(ApplicationAssembly.GetName.GetPublicKey)
        }

        public void GenerateToken(WebRequest Webservice)
        {
            //Dim Token As String = Encrypt(Today.CodeOfTheDay.ToString)
            //Webservice.Headers.Add("Authorization", Token)
        }
        public string VerifyURLParameters(string Parameters)
        {
            string functionReturnValue = null;

            functionReturnValue = Parameters;
            functionReturnValue = Parameters.Replace("%", "%25");
            functionReturnValue = functionReturnValue.Replace(" ", "%20");
            functionReturnValue = functionReturnValue.Replace("!", "%21");
            functionReturnValue = functionReturnValue.Replace("\"", "%22");
            functionReturnValue = functionReturnValue.Replace("#", "%23");
            functionReturnValue = functionReturnValue.Replace("$", "%24");
            functionReturnValue = functionReturnValue.Replace("&", "%26");
            functionReturnValue = functionReturnValue.Replace("'", "%27");
            functionReturnValue = functionReturnValue.Replace("(", "%28");
            functionReturnValue = functionReturnValue.Replace(")", "%29");
            functionReturnValue = functionReturnValue.Replace("*", "%2A");
            functionReturnValue = functionReturnValue.Replace("+", "%2B");
            functionReturnValue = functionReturnValue.Replace(",", "%2C");
            functionReturnValue = functionReturnValue.Replace("-", "%2D");
            functionReturnValue = functionReturnValue.Replace(".", "%2E");
            //VerifyURLParameters = VerifyURLParameters.Replace("/", "%2F")
            functionReturnValue = functionReturnValue.Replace("|", "%7C");

            return functionReturnValue;
            return functionReturnValue;
        }
        public long ResponseWait(long NumberOfMintues)
        {

            TimerCount = 0;
            MyTimer.Interval = 1000 * 60;
            MyTimer.Enabled = true;
            MyTimer.Start();

            MyTimer.Elapsed += TimerEventProcessor;

            while (!(TimerCount == NumberOfMintues))
            {
            }
            RetryCount += 1;
            return RetryCount;

        }

        private static void TimerEventProcessor(System.Object myOject, System.EventArgs myEventArgs)
        {
            TimerCount = 1;

        }
    }
}