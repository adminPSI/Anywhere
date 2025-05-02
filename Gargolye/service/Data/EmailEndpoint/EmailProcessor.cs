using System;
using System.IO;
using System.IO.Compression;
using System.Security.Cryptography;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using iAnywhere.Data.SQLAnywhere;
using System.Net;
using Anywhere.Log;
using System.Configuration;
using DocumentFormat.OpenXml.Wordprocessing;

namespace Anywhere
{
    public static class EmailProcessor
    {
        private static Loger logger = new Loger();
        private static string connectionString = ConfigurationManager.ConnectionStrings["connection"].ToString();
        public static async Task ProcessEmailAsync(int messageId, string apiKey)
        {
            if (connectionString.ToUpper().IndexOf("UID") == -1)
            {
                connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";
            }
            // 1) Prepare temp folder & filenames
            string tempFolder = @"C:\Temp";
            Directory.CreateDirectory(tempFolder);
            string emailXmlFile = Path.Combine(tempFolder, "email.xml");
            string emailgzipStreamFile = Path.Combine(tempFolder, "email.xml.gz");
            string ivBinFile = Path.Combine(tempFolder, "iv.bin");
            string cipherBinFile = Path.Combine(tempFolder, "cipher.bin");
            string emailFinalFile = Path.Combine(tempFolder, "email_final.bin");

            // 2) Fetch raw XML from SQL Anywhere
            string xmlContent = GetEmailXml(messageId, connectionString);
            File.WriteAllText(emailXmlFile, xmlContent);

            // 3) gzipStream-compress it
            using (var inFs = new FileStream(emailXmlFile, FileMode.Open, FileAccess.Read))
            using (var compressedStream = new FileStream(emailgzipStreamFile, FileMode.Create, FileAccess.Write))
            using (var gzipStream = new GZipStream(compressedStream, CompressionMode.Compress))
            {
                inFs.CopyTo(gzipStream);
            }

            // 4) Generate and save a 16-byte IV
            var iv = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
                rng.GetBytes(iv);
            File.WriteAllBytes(ivBinFile, iv);

            // Step 4: Define the encryption key (64-character hex string) and convert it to bytes.
            string keyHex = "46374A344B38503953364D324433433141354C304E3752384232513445315A39";
            byte[] key = HexStringToByteArray(keyHex);

            // Step 5: Encrypt the compressed file with AES-256-CBC.
            EncryptFileAes(emailgzipStreamFile, cipherBinFile, key, iv);

            // 5) Encrypt the gzipStream payload with AES-CBC
            //using (var aes = Aes.Create())
            //{
            //    aes.Key = Convert.FromBase64String(apiKey);
            //    aes.IV = iv;
            //    aes.Mode = CipherMode.CBC;
            //    aes.Padding = PaddingMode.PKCS7;

            //    using (var encryptor = aes.CreateEncryptor())
            //    using (var inFs2 = new FileStream(emailgzipStreamFile, FileMode.Open, FileAccess.Read))
            //    using (var compressedStream2 = new FileStream(cipherBinFile, FileMode.Create, FileAccess.Write))
            //    using (var cs = new CryptoStream(compressedStream2, encryptor, CryptoStreamMode.Write))
            //    {
            //        inFs2.CopyTo(cs);
            //    }
            //}

            //// 6) Prepend IV + write final blob
            //using (var outF = new FileStream(emailFinalFile, FileMode.Create, FileAccess.Write))
            //{
            //    outF.Write(iv, 0, iv.Length);
            //    outF.Write(File.ReadAllBytes(cipherBinFile), 0, (int)new FileInfo(cipherBinFile).Length);
            //}

            //// 7) POST to downstream endpoint
            //using (var client = new HttpClient())
            //using (var content = new MultipartFormDataContent())
            //{
            //    content.Add(new ByteArrayContent(File.ReadAllBytes(emailFinalFile)), "file", "email_final.bin");
            //    client.DefaultRequestHeaders.Authorization =
            //      new AuthenticationHeaderValue("Bearer", apiKey);

            //    var resp = await client.PostAsync(
            //      "https://post2email.psianywhere.com/api/email/ingest",
            //      content
            //    );
            //    resp.EnsureSuccessStatusCode();
            //}

            // Step 6: Prepend the IV to the encrypted file to create the final file.
            using (FileStream finalStream = new FileStream(emailFinalFile, FileMode.Create, FileAccess.Write))
            {
                finalStream.Write(iv, 0, iv.Length);
                byte[] cipherBytes = File.ReadAllBytes(cipherBinFile);
                finalStream.Write(cipherBytes, 0, cipherBytes.Length);
            }

            // Step 7: Post the final file to the API.
            await PostFileToApiAsync(emailFinalFile, apiKey, messageId, connectionString);
        }

        private static async Task PostFileToApiAsync(string filePath, string apiKey, int messageId, string connectionString)
        {
            // 1) Force TLS 1.2
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            using (var client = new HttpClient())
            using (var form = new MultipartFormDataContent())
            {
                // 2) Add API key field
                form.Add(new StringContent(apiKey), "apiKey");

                // 3) Add the file bytes
                byte[] fileBytes = File.ReadAllBytes(filePath);
                var fileContent = new ByteArrayContent(fileBytes);
                fileContent.Headers.ContentType =
                    new MediaTypeHeaderValue("application/octet-stream");
                form.Add(fileContent, "zipBytes", Path.GetFileName(filePath));

                // 4) Target URL
                string url = "https://insights-new.ohiodd.net/PostEmails.asmx/PostEmailsXml";

                // 5) Log and send
                //logger.debug($"POST → {url}");
                HttpResponseMessage response;
                string responseText;

                try
                {
                    response = await client.PostAsync(url, form);
                    responseText = await response.Content.ReadAsStringAsync();

                    logger.debug($"Status: {(int)response.StatusCode} {response.ReasonPhrase}");
                    logger.debug($"Body: {responseText}");

                    // throws on 4xx/5xx
                    response.EnsureSuccessStatusCode();
                }
                catch (HttpRequestException ex)
                {
                    logger.error("error", ex.Message);
                    throw;
                }
                catch (Exception ex)
                {
                    logger.error("error", ex.Message);
                    throw;
                }

                // 6) If still not success, record and abort
                if (!response.IsSuccessStatusCode)
                {
                    File.WriteAllText(
                        @"C:\Temp\post_error_response.txt",
                        $"Code: {(int)response.StatusCode}\n{responseText}\nMsgID={messageId}"
                    );
                    throw new Exception($"Remote API failed: {response.StatusCode}");
                }
                else
                {
                    try
                    {
                        using (var conn = new SAConnection(connectionString))
                        {
                            conn.Open();

                            // Update the When_Sent timestamp and commit in one go
                            const string sql =
                              "UPDATE dba.IN_Messages " +
                              "SET When_Sent = NOW() " +
                              "WHERE Message_Id = ?; " +
                              "COMMIT;";

                            using (var cmd = new SACommand(sql, conn))
                            {
                                // We only set Value — the first (and only) parameter maps to the first `?`
                                cmd.Parameters.Add(new SAParameter { Value = messageId });
                                int rows = cmd.ExecuteNonQuery();
                            }

                        }
                    }
                    catch (iAnywhere.Data.SQLAnywhere.SAException saEx)
                    {
                        // Log the failure, but swallow it so your service keeps running
                        logger.error(
                          $"Failed to update When_Sent for Message_Id={messageId}: {saEx.Message}", saEx.ToString());
                    }

                }

            }
        }


        private static string GetEmailXml(int messageId, string connectionString)
        {
            string xmlResult = string.Empty;

            using (SAConnection conn = new SAConnection(connectionString))
            {
                conn.Open();

                // First, query only the raw Msg_Body
                string rawSql = "SELECT Msg_Body FROM dba.IN_Messages WHERE Message_ID = ?";
                string rawMsgBody = "";

                using (SACommand rawCmd = new SACommand(rawSql, conn))
                {
                    rawCmd.Parameters.Add(new SAParameter { Value = messageId });
                    using (SADataReader reader = rawCmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            rawMsgBody = reader.GetString(0);
                        }
                    }
                }

                // Clean the Msg_Body before putting it into CDATA
                string cleanedBody = RemoveInvalidXmlChars(rawMsgBody);
                string safeCdata = "<![CDATA[" + cleanedBody.Replace("]]>", "]]]]><![CDATA[>") + "]]>";

                // Now use the cleaned CDATA in your XML query
                string sql = @"
            SELECT 
                XMLELEMENT(
                    NAME In_Messages, 
                    XMLATTRIBUTES(
                        Message_ID,
                        Msg_From,
                        Msg_To,
                        Msg_CC,
                        Msg_BCC,
                        Msg_Subject,
                        When_Recieved,
                        Attatchment,
                        Extension_Type,
                        File_Length,
                        File_Name,
                        Report_Server,
                        (select setting from sysoptions where ""option"" = 'Application_Customer') as customer
                    ),
                    XMLELEMENT(
                        NAME Msg_Body,
                        CAST(? AS XML)
                    )
                )
            FROM dba.IN_Messages
            WHERE Message_ID = ?
            UNION
            SELECT 
                XMLELEMENT(
                    NAME IN_Attachment, 
                    XMLATTRIBUTES(
                        ID,
                        Message_ID,
                        Attachment,
                        Extension_Type,
                        File_Length,
                        File_Name
                    )
                )
            FROM dba.IN_Attachment
            WHERE Message_ID = ?";

                using (SACommand cmd = new SACommand(sql, conn))
                {
                    cmd.Parameters.Add(new SAParameter { Value = safeCdata });     // CDATA input
                    cmd.Parameters.Add(new SAParameter { Value = messageId });     // For first SELECT
                    cmd.Parameters.Add(new SAParameter { Value = messageId });     // For UNION

                    using (SADataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            xmlResult += reader.GetString(0);
                        }
                    }
                }
            }

            return xmlResult;
        }

        private static string RemoveInvalidXmlChars(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            var sb = new System.Text.StringBuilder(input.Length);

            foreach (char c in input)
            {
                if (
                    c == 0x9 || c == 0xA || c == 0xD || // allowed control chars
                    (c >= 0x20 && c <= 0xD7FF) ||
                    (c >= 0xE000 && c <= 0xFFFD)
                )
                {
                    sb.Append(c);
                }
                // else skip invalid char
            }

            return sb.ToString();
        }

        private static void EncryptFileAes(string inputFile, string outputFile, byte[] key, byte[] iv)
        {
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.KeySize = 256;
                aesAlg.BlockSize = 128;
                aesAlg.Mode = System.Security.Cryptography.CipherMode.CBC;
                aesAlg.Padding = PaddingMode.PKCS7;
                aesAlg.Key = key;
                aesAlg.IV = iv;
                using (FileStream fsInput = new FileStream(inputFile, FileMode.Open, FileAccess.Read))
                using (FileStream fsOutput = new FileStream(outputFile, FileMode.Create, FileAccess.Write))
                using (CryptoStream cryptoStream = new CryptoStream(fsOutput, aesAlg.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    fsInput.CopyTo(cryptoStream);
                }
            }
        }

        private static byte[] HexStringToByteArray(string hex)
        {
            int length = hex.Length;
            byte[] bytes = new byte[length / 2];
            for (int i = 0; i < length; i += 2)
            {
                bytes[i / 2] = Convert.ToByte(hex.Substring(i, 2), 16);
            }
            return bytes;
        }
    }
}
