using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Anywhere.service.Data
{
    public static class StreamExtensions
    {
        public static byte[] ToByteArray(this System.IO.Stream stream)
        {
            stream.Position = 0;
            byte[] buffer = new byte[stream.Length];
            for (int totalBytesCopied = 0; totalBytesCopied < stream.Length;)
                totalBytesCopied += stream.Read(buffer, totalBytesCopied, Convert.ToInt32(stream.Length) - totalBytesCopied);
            return buffer;
        }
    }
}