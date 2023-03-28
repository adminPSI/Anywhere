using Anywhere.Data;
using Anywhere.Log;
using ICSharpCode.SharpZipLib.Core;
using ICSharpCode.SharpZipLib.Zip;
using System;
using System.Configuration;
using System.Globalization;
using System.IO;
using System.Net;
using System.Web.Configuration;


namespace Anywhere.anypatch
{
    public class AnyTime
    {
        private static Loger logger = new Loger();
        private string webversion = "";
        private string currentVersion = "";
        private string shortCurrentVersion = "";
        private string shortVersionFromweb = "";

        private string versionFileUrl = ConfigurationManager.AppSettings["versionfileurl"].ToString(); //"http://anyerr.primarysolutions.net/patch/version.txt";
        private string downloadDir = ConfigurationManager.AppSettings["downloaddir"].ToString(); //"C:\\anypatch\\";
        private string outFolder = ConfigurationManager.AppSettings["outfolder"].ToString(); //"C:\\inetpub\\wwwroot";
        private string databaseFolder = ConfigurationManager.AppSettings["databasefolder"].ToString(); // "\\database";
        private string productCode = ConfigurationManager.AppSettings["productcode"].ToString();
        private string pathToSession = ConfigurationManager.AppSettings["pathtosession"].ToString();
        private string password = "";

        public AnyTime()
        {

        }

        public void patchIt()
        {
            try
            {
                //if (timeToCheckForPatch())
                //{
                //    downloadNewVersion();
                //    checkForNewDownload();
                //    applyPatchIfNeeded();
                //    applyDataScript();
                //    logger.trace("ANYTIME","AnyTime Complete!");
                //}
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME1", "Exiting AnyTime due to:" + ex.StackTrace);
            }
        }

        public bool timeToCheckForPatch()
        {

            try
            {
                Configuration config = WebConfigurationManager.OpenWebConfiguration("/");
                string oldValue = config.AppSettings.Settings["lastcheck"].Value;

                CultureInfo cultureInfo = new CultureInfo("en-US");
                DateTime dt = DateTime.ParseExact(oldValue, "M/d/yyyy HH:mm", cultureInfo);

                dt = dt.AddHours(12);

                if (DateTime.Now > dt)
                {
                    config.AppSettings.Settings["lastcheck"].Value = DateTime.Now.ToString("MM/dd/yyyy HH:mm");
                    config.Save(ConfigurationSaveMode.Modified);

                    return true;
                }

            }
            catch (Exception ex)
            {
                logger.error("ANYTIME6", ex.Message);
                throw ex;
            }

            return false;
        }


        public void resolveRemoteAddress()
        {
            try
            {
                string RemoteDomain = "http://anyerr.primarysolutions.net";
                IPHostEntry inetServer = Dns.GetHostEntry(RemoteDomain.Replace("http://", String.Empty));
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME2", ex.Message);
            }

        }

        public void downloadNewVersion()
        {
            try
            {
                System.Net.WebClient client = new System.Net.WebClient();
                //client.DownloadFile(versionFileUrl, fileref + filename);
                webversion = client.DownloadString(versionFileUrl);
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME3", ex.Message);
            }

        }

        public void checkForNewDownload()
        {
            try
            {
                string path = Directory.GetCurrentDirectory();
                if (File.Exists(pathToSession))
                {
                    TextReader tr = new StreamReader(pathToSession);
                    string tempStr = tr.ReadToEnd();

                    tempStr = tempStr.Substring(tempStr.IndexOf("$.session.ver"));
                    tempStr = tempStr.Substring(tempStr.IndexOf("=") + 1);
                    tempStr = tempStr.Substring(0, tempStr.IndexOf(";"));
                    tempStr = tempStr.Replace("\"", String.Empty);
                    currentVersion = tempStr.Replace(" ", String.Empty);
                    shortCurrentVersion = tempStr.Replace(".", String.Empty);
                    tr.Close();

                    shortVersionFromweb = webversion.Replace(".", String.Empty);

                }
                else
                {
                    throw new System.InvalidCastException("Version file not found or not accessible.\nPlease check that you have permission to read the " + pathToSession + " folder");
                }
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME7", "path:" + pathToSession + " " + ex.Message);
                throw ex;
            }
        }

        public void applyPatchIfNeeded()
        {
            try
            {
                if (Convert.ToInt32(shortCurrentVersion) < Convert.ToInt32(shortVersionFromweb))
                {
                    //Console.Out.WriteLine("Countdown upgrade from version {0} to {1} is now available!  Upgrade now?");
                    logger.trace("ANYTIME", "Upgrading site from: " + currentVersion + " to " + webversion + ".");

                    string versionFileUrl = "http://anyerr.primarysolutions.net/patch/" + productCode + "-" + webversion + ".zip";
                    System.Net.WebClient client = new System.Net.WebClient();
                    client.DownloadFile(versionFileUrl, downloadDir + "AA-" + webversion + ".zip");
                    logger.trace("ANYTIME", "Patch: " + productCode + "-" + webversion + ".zip downloaded.");
                    unZipPatch(downloadDir, productCode + "-" + webversion + ".zip");
                    logger.trace("ANYTIME", "files applied to: " + downloadDir + ".");
                }
                else
                {
                    //Console.Out.WriteLine("There are no upgrades currently available.  You have the latest version of Countdown.");
                    logger.trace("ANYTIME", "No upgrade, on version: " + currentVersion + " website version: " + webversion);
                }
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME8", "CurrVer=" + shortCurrentVersion + " webVer=" + shortVersionFromweb + " |" + ex.Message);
                throw ex;
            }
        }

        public void applyDataScript()
        {
            try
            {
                if (Convert.ToInt32(shortCurrentVersion) < Convert.ToInt32(shortVersionFromweb))
                {
                    if (File.Exists(outFolder + databaseFolder + "\\" + webversion + ".sql"))
                    {
                        try
                        {
                            logger.trace("ANYWHERE", "Appling DB patch.");
                            FileInfo file = new FileInfo(outFolder + databaseFolder + "\\" + webversion + ".sql");
                            string script = file.OpenText().ReadToEnd();

                            DataGetter dg = new DataGetter();
                            //IntelliviewDataGetter idg = new IntelliviewDataGetter();
                            dg.executeSQLFromScript(script);
                            logger.trace("ANYWHERE", "DB patch COMPLETE!.");
                        }
                        catch (Exception ex)
                        {
                            logger.error("ANYTIME4", ex.Message);
                        }

                    }
                    else
                    {
                        logger.trace("ANYTIME", "No DB patch file found.");
                    }

                } //end ver compare
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME9", ex.Message);
                throw ex;
            }
        }


        public void unZipPatch(string path, string fileName)
        {
            ZipFile zf = null;

            try
            {
                FileStream fs = File.OpenRead(path + "\\" + fileName);
                zf = new ZipFile(fs);
                if (!String.IsNullOrEmpty(password))
                {
                    zf.Password = password;     // AES encrypted entries are handled automatically
                }
                foreach (ZipEntry zipEntry in zf)
                {
                    if (!zipEntry.IsFile)
                    {
                        continue;           // Ignore directories
                    }
                    String entryFileName = zipEntry.Name;
                    // to remove the folder from the entry:- entryFileName = Path.GetFileName(entryFileName);
                    // Optionally match entrynames against a selection list here to skip as desired.
                    // The unpacked length is available in the zipEntry.Size property.

                    byte[] buffer = new byte[4096];     // 4K is optimum
                    Stream zipStream = zf.GetInputStream(zipEntry);

                    // Manipulate the output filename here as desired.
                    String fullZipToPath = Path.Combine(outFolder, entryFileName);
                    string directoryName = Path.GetDirectoryName(fullZipToPath);
                    if (directoryName.Length > 0)
                        Directory.CreateDirectory(directoryName);

                    // Unzip file in buffered chunks. This is just as fast as unpacking to a buffer the full size
                    // of the file, but does not waste memory.
                    // The "using" will close the stream even if an exception occurs.
                    using (FileStream streamWriter = File.Create(fullZipToPath))
                    {
                        StreamUtils.Copy(zipStream, streamWriter, buffer);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.error("ANYTIME5", ex.Message);
                throw ex;
            }
            finally
            {
                if (zf != null)
                {
                    zf.IsStreamOwner = true; // Makes close also shut the underlying stream
                    zf.Close(); // Ensure we release resources
                }
            }

        }




    }
}