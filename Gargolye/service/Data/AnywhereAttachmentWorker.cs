using Anywhere.Data;
using Anywhere.Log;
using Anywhere.service.Data.DocumentConversion;
using System;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class AnywhereAttachmentWorker
    {
        private static Loger logger = new Loger();
        DataGetter dg = new DataGetter();
        JavaScriptSerializer js = new JavaScriptSerializer();
        AnywhereWorker anywhereWorker = new AnywhereWorker();
        AllAttachmentsDataGetter aadg = new AllAttachmentsDataGetter();
        public Attachments[] GetAllAttachments(String token, String consumerId)
        {
            string attachmentsString = dg.GetAllAttachments(token, consumerId);
            Attachments[] attachments = js.Deserialize<Attachments[]>(attachmentsString);
            return attachments;
        }

        //public Attachment getIndividualAttachment(String token, String attachmentId)
        public void getAttachment(String token, String attachmentId, String filename)
        {
            Attachment attachment = new Attachment();
            attachment.filename = filename;
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    // use the filename parameter if it exists, otherwise create one from a guid 
                    attachment.filename = (filename == null || (filename.Trim()) == "") ? Guid.NewGuid().ToString() : attachment.filename + "." + dg.GetAttachmentExtension(attachmentId);
                    attachment.data = dg.GetAttachmentData(attachmentId);//reused
                }
                catch (Exception ex)
                {

                }
            }
            //logger.debug("Made it this far in attachment");
            // return attachment;
            displayAttachment(attachment);
        }

        //public Attachment getIndividualAttachment(String token, String attachmentId)
        public void getIndividualAttachment(String token, String attachmentId)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    attachment.filename = dg.GetAttachmentFileName(attachmentId);
                    attachment.data = dg.GetAttachmentData(attachmentId);//reused
                }
                catch (Exception ex)
                {

                }
            }
            //logger.debug("Made it this far in attachment");
            // return attachment;
            displayAttachment(attachment);
        }

        public void viewCaseNoteAttachment(string token, string attachmentId)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    attachment.filename = dg.getCNAttachmentFileName(attachmentId);
                    attachment.data = dg.GetAttachmentData(attachmentId);//reused
                }
                catch (Exception ex)
                {

                }
            }
            displayAttachment(attachment);
        }

        public void viewPlanAttachment(string token, string attachmentId, string section)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                char value = '-';
                bool guid = attachmentId.Contains(value);
                if (guid)
                {
                    viewWFAttachment(token, attachmentId, section);
                }
                else
                {
                    try
                    {
                        attachment.filename = aadg.getPlanAttachmentFileName(attachmentId, section);
                        attachment.data = aadg.GetAttachmentData(attachmentId);//reused
                    }
                    catch (Exception ex)
                    {

                    }
                }

            }
            displayAttachment(attachment);
        }

        public void viewWFAttachment(string token, string attachmentId, string section)
        {
            Attachment attachment = new Attachment();
            attachment.filename = "";
            attachment.data = null;
            bool isTokenValid = anywhereWorker.ValidateToken(token);
            if (isTokenValid)
            {
                try
                {
                    attachment.filename = dg.GetWFAttachmentFileName(attachmentId);
                    attachment.data = dg.GetWfAttachmentData(attachmentId);//reused
                }
                catch (Exception ex)
                {

                }
            }
            displayAttachment(attachment);
        }

        public void displayAttachment(Attachment attachment)
        {
            var current = System.Web.HttpContext.Current;
            var response = current.Response;
            response.Buffer = true;
            try
            {
                response.Clear();
                if (attachment.filename == "")
                {
                    response.StatusCode = 404;
                    response.Status = "404 Not Found";
                }
                else
                {
                    byte[] bytes = StreamExtensions.ToByteArray(attachment.data);
                    response.AddHeader("content-disposition", "attachment;filename=" + attachment.filename + ";");
                    response.ContentType = "application/octet-stream";
                    response.AddHeader("Transfer-Encoding", "identity");
                    response.BinaryWrite(bytes);
                }
            }
            catch (Exception ex)
            {
                response.Write("Error: " + ex.InnerException.ToString());
            }
            finally
            {
                //logger2.debug("Done?");
            }
        }

        public class Attachments
        {
            public string filename { get; set; }
            public string attachmentid { get; set; }
        }

        public class Attachment
        {
            public string filename { get; set; }
            public MemoryStream data { get; set; }
        }
    }
}