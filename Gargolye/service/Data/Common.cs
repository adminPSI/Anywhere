using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.VisualBasic;
using System.Collections;
using System.Data;
using System.Diagnostics;
using System.Text;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Runtime.InteropServices;

namespace Anywhere.service.Data
{
    public class Common
    {
        //This converts any string to Binary Array
        //[System.Runtime.CompilerServices.Extension()]
        public byte[] ToBinaryArray(string myString)
        {
            MemoryStream ms = new MemoryStream();
            using (StreamWriter sw = new StreamWriter(ms))
            {
                sw.Write(myString);
                sw.Flush();
                return ms.ToArray();
            }
        }

        //This converts any string to a memory stream
        //[System.Runtime.CompilerServices.Extension()]
        public MemoryStream ToMemoryStream(string myString)
        {
            MemoryStream ms = new MemoryStream();
            using (StreamWriter sw = new StreamWriter(ms))
            {
                sw.Write(myString);
                sw.Flush();
                ms.Position = 0;
                return ms;
            }
        }

        //This converts XML String to Dataset Using Memory Stream
        //[System.Runtime.CompilerServices.Extension()]
        public DataSet ToDataset(string XMLString)
        {
            DataSet functionReturnValue = default(DataSet);
            try
            {
                functionReturnValue = new DataSet();
                //MAT
                //using (MemoryStream ms = new MemoryStream(XMLString.ToBinaryArray))
                using (MemoryStream ms = new MemoryStream(Encoding.ASCII.GetBytes(XMLString)))
                {
                    functionReturnValue.ReadXml((ms), XmlReadMode.Auto);
                }
                return functionReturnValue;
            }
            catch (Exception ex)
            {
            }
            return functionReturnValue;
        }

        //This converts Dataset to XML String Using Memory Stream
       // [System.Runtime.CompilerServices.Extension()]
        public string ToXMLString(DataSet DS)
        {

            try
            {
                //MAT add system. before IO
                System.IO.MemoryStream ms = new System.IO.MemoryStream();
                DS.WriteXml(ms, XmlWriteMode.WriteSchema);
                ms.Position = 0;

                StreamReader sr = new StreamReader(ms);
                return sr.ReadToEnd();

            }
            catch (Exception ex)
            {
                return string.Empty;
            }

        }

        //This converts Byte Array to String Using Memory Stream
        //[System.Runtime.CompilerServices.Extension()]
        public string ToStringUsingMS(byte[] ba)
        {

            MemoryStream ms = new MemoryStream(ba);
            ms.Position = 0;

            using (StreamReader sr = new StreamReader(ms))
            {
                return sr.ReadToEnd();
            }

        }

        //Stil may need lines 117 through 168 from InTC


        public string Zip(string text)
        {
            //MAT
            //byte[] buffer = text.ToBinaryArray;
            byte[] buffer = Encoding.ASCII.GetBytes(text);
            MemoryStream ms = new MemoryStream();
            using (System.IO.Compression.GZipStream zipStream = new System.IO.Compression.GZipStream(ms, System.IO.Compression.CompressionMode.Compress, true))
            {
                zipStream.Write(buffer, 0, buffer.Length);
            }

            ms.Position = 0;

            byte[] compressed = new byte[Convert.ToInt32(ms.Length - 1) + 1];
            ms.Read(compressed, 0, compressed.Length);

            byte[] gzBuffer = new byte[compressed.Length + 4];
            System.Buffer.BlockCopy(compressed, 0, gzBuffer, 4, compressed.Length);
            System.Buffer.BlockCopy(BitConverter.GetBytes(buffer.Length), 0, gzBuffer, 0, 4);
            return Convert.ToBase64String(gzBuffer);

        }

        public string UnZip(string compressedText)
        {

            byte[] gzBuffer = Convert.FromBase64String(compressedText);
            int msgLength = 0;
            byte[] buffer = null;

            using (MemoryStream ms = new MemoryStream())
            {
                msgLength = BitConverter.ToInt32(gzBuffer, 0);
                ms.Write(gzBuffer, 4, gzBuffer.Length - 4);
                buffer = new byte[msgLength];
                ms.Position = 0;
                using (System.IO.Compression.GZipStream zipStream = new System.IO.Compression.GZipStream(ms, System.IO.Compression.CompressionMode.Decompress))
                {
                    zipStream.Read(buffer, 0, buffer.Length);
                }
                                                   //MAT
                return ToStringUsingMS(buffer);//buffer.ToStringUsingMS();
            }
        }

        public decimal Round(ref decimal X, byte Factor)
        {
            //return Conversion.Fix(Convert.ToDecimal(Convert.ToString(X) * (Math.Pow(10, Factor))) + 0.5 * System.Math.Sign(X)) / (Math.Pow(10, Factor));
            return ( ((decimal)X * (decimal)(Math.Pow(10, Factor)) + ((decimal)0.5 * System.Math.Sign(X))) / (decimal)(Math.Pow(10, Factor)) );
        }

        public string returnStringCleanUp(string jobsResultString)
        {
            int indexOfTable = 0;
            indexOfTable = Strings.InStr(1, jobsResultString, "<Table>");
            jobsResultString = Strings.Right(jobsResultString, Strings.Len(jobsResultString) - indexOfTable + 1);
            jobsResultString = jobsResultString.Replace(Constants.vbCr, "").Replace(Constants.vbLf, "").Replace(" ", "").Replace("<Table>", "<dt>").Replace("</Table>", "</dt>");
            return jobsResultString;
        }

    }
}