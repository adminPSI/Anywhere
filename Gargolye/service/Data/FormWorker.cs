using System;
using System.IO;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class FormWorker
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        Anywhere.service.Data.FormDataGetter fdg = new Anywhere.service.Data.FormDataGetter();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();

        [DataContract]
        public class FormTemplate
        {
            [DataMember(Order = 0)]
            public string formTemplateId { get; set; }
            [DataMember(Order = 1)]
            public string formDescription { get; set; }
            [DataMember(Order = 2)]
            public string formType { get; set; }


        }

        [DataContract]
        public class FormType
        {
            [DataMember(Order = 0)]
            public string formTypeId { get; set; }
            [DataMember(Order = 1)]
            public string formTypeDescription { get; set; }
        }
        // used to retrieve form templates for the Workflow Step Documents/Forms
        public FormTemplate[] getFormTemplates(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    FormTemplate[] templates = js.Deserialize<FormTemplate[]>(fdg.getFormTemplates(transaction));
                    return templates;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        // used to retrieve form templates for the Forms Module
        public FormTemplate[] getUserFormTemplates(string token, string userId, string hasAssignedFormTypes, string typeId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    FormTemplate[] templates = js.Deserialize<FormTemplate[]>(fdg.getUserFormTemplates(userId, hasAssignedFormTypes, typeId, transaction));
                    return templates;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public FormType[] getFormType(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    FormType[] formType = js.Deserialize<FormType[]>(fdg.getFormType(transaction));
                    return formType;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }


        public string OpenEditor(string templateId, long consumerId)
        {
            System.IO.MemoryStream mstemplate = null;
            MemoryStream response = new MemoryStream();
            PDFGenerator.Data obj = new PDFGenerator.Data();

            try
            {
                mstemplate = fdg.getFormTemplate(templateId);

                connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";

                response = obj.GKGetData(mstemplate, consumerId, connectionString);
                return Convert.ToBase64String(response.ToArray());

            }
            catch (Exception ex)
            {

            }

            return Convert.ToBase64String(mstemplate.ToArray());

        }

        public string OpenPDFEditor(string documentId, string documentEdited, long consumerId, bool isRefresh)
        {
            System.IO.MemoryStream msdocument = null;
            MemoryStream response = new MemoryStream();
            PDFGenerator.Data obj = new PDFGenerator.Data();

            try
            {
                // loading a form for the first time, then preload data
                if (documentEdited == "0")
                {

                    connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";

                    msdocument = fdg.getPDFDocument(documentId);
                    response = obj.GKGetData(msdocument, consumerId, connectionString);

                    return Convert.ToBase64String(response.ToArray());

                }
                else  // loading a form that has been edited previously, then don't preload data, unless user requests a Refresh
                {
                    if (isRefresh)
                    {

                        connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";

                        msdocument = fdg.getPDFDocument(documentId);
                        response = obj.GKGetData(msdocument, consumerId, connectionString);

                        return Convert.ToBase64String(response.ToArray());

                    }
                    else
                    {
                        msdocument = fdg.getPDFDocument(documentId);
                        return Convert.ToBase64String(msdocument.ToArray());
                    }

                }

            }
            catch (Exception ex)
            {

            }

            return Convert.ToBase64String(msdocument.ToArray());

        }

        public string openFormEditor(string formId, string documentEdited, long consumerId, bool isRefresh, string isTemplate, string applicationName)

        {
            System.IO.MemoryStream msdocument = null;
            MemoryStream response = new MemoryStream();
            PDFGenerator.Data obj = new PDFGenerator.Data();

            try
            {
                // loading a form for the first time, then preload data
                if (documentEdited == "0")
                {

                    connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";

                    msdocument = fdg.getConsumerFormData(formId, isTemplate);

                    if (applicationName.Equals("Advisor"))
                    {
                        response = obj.AdvisorGetData(msdocument, consumerId, connectionString);
                    }
                    else
                    {
                        response = obj.GKGetData(msdocument, consumerId, connectionString);
                    }


                    return Convert.ToBase64String(response.ToArray());

                }
                else  // loading a form that has been edited previously, then don't preload data, unless user requests a Refresh
                {
                    if (isRefresh)
                    {

                        connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";

                        msdocument = fdg.getConsumerFormData(formId, isTemplate);

                        if (applicationName.Equals("Advisor"))
                        {
                            response = obj.AdvisorGetData(msdocument, consumerId, connectionString);
                        }
                        else
                        {
                            response = obj.GKGetData(msdocument, consumerId, connectionString);
                        }

                        return Convert.ToBase64String(response.ToArray());

                    }
                    else
                    {
                        msdocument = fdg.getConsumerFormData(formId, isTemplate);
                        return Convert.ToBase64String(msdocument.ToArray());
                    }

                }

            }
            catch (Exception ex)
            {

            }

            return Convert.ToBase64String(msdocument.ToArray());

        }

        public string checkFormsLock(string formId, string userId)
        {
            PDFGenerator.Data obj = new PDFGenerator.Data();
            connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";
            long formIdLong = long.Parse(formId);

            string formsLockReturn = obj.FormsLockCount(connectionString, formIdLong);

            if (formsLockReturn == "")
            {
                obj.FormsLockAdd(connectionString, formIdLong, userId);
            }

            return formsLockReturn;
        }

        public void removeFormsLock(string formId, string userId)
        {
            PDFGenerator.Data obj = new PDFGenerator.Data();
            connectionString = connectionString + "UID=anywhereuser;PWD=anywhere4u;";
            long formIdLong = long.Parse(formId);

            obj.FormsLockRemove(connectionString, formIdLong, userId);
        }



        public class consumerForm
        {
            [DataMember(Order = 0)]
            public string formId { get; set; }
            [DataMember(Order = 1)]
            public string formType { get; set; }
            [DataMember(Order = 2)]
            public string formDescription { get; set; }
            [DataMember(Order = 3)]
            public string formCompleteDate { get; set; }
            [DataMember(Order = 4)]
            public string formLastUpdated { get; set; }
            [DataMember(Order = 5)]
            public string formUserUpdated { get; set; }


        }

        public consumerForm insertConsumerForm(string token, string userId, string consumerId, string formtemplateid, string formdata, string formCompleteDate)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (userId == null) throw new Exception("userId is required");
                    if (consumerId == null) throw new Exception("consumerId is required");
                    if (formtemplateid == null) throw new Exception("formtemplateid is required");
                    if (formdata == null) throw new Exception("formdata is required");
                    if (formCompleteDate == null) throw new Exception("formCompleteDate is required");

                    // insert document
                    String formId = fdg.insertConsumerForm(userId, consumerId, formtemplateid, formdata, formCompleteDate, transaction);

                    consumerForm consumerForm = new consumerForm();
                    consumerForm.formId = formId;

                    return consumerForm;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public consumerForm UpdateConsumerForm(string token, string formId, string formdata, string documentEdited)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (formId == null) throw new Exception("formId is required");
                    if (formdata == null) throw new Exception("formdata is required");

                    string comments = null;

                    // update document
                    String form_ID = fdg.UpdateConsumerForm(token, formId, formdata, transaction);

                    consumerForm consumerForm = new consumerForm();
                    consumerForm.formId = formId;

                    return consumerForm;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public consumerForm UpdateConsumerFormCompletionDate(string token, string formId, string formCompletionDate)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (formId == null) throw new Exception("formId is required");
                    if (formCompletionDate == null) throw new Exception("formCompletionDate is required");

                    string comments = null;

                    // update document
                    String form_ID = fdg.UpdateConsumerFormCompletionDate(token, formId, formCompletionDate, transaction);

                    consumerForm consumerForm = new consumerForm();
                    consumerForm.formId = formId;

                    return consumerForm;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string deleteConsumerForm(string token, string formId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (formId == null) throw new Exception("formId is required");

                    // insert group steps
                    String rowsDeleted = fdg.deleteConsumerForm(formId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }


        public consumerForm[] getConsumerForms(string token, string userId, string consumerId, string hasAssignedFormTypes)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    consumerForm[] forms = js.Deserialize<consumerForm[]>(fdg.getConsumerForms(userId, consumerId, hasAssignedFormTypes, transaction));

                    return forms;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }



    }
}