using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using System.Web.Script.Serialization;
using System.ServiceModel.Web;
using System.IO;
using Anywhere.Data;
using static Anywhere.service.Data.OODWorker;
using OneSpanSign.Sdk;
using static System.Windows.Forms.AxHost;
using System.Reflection.Emit;
using pdftron.PDF;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.SimpleMar.SignInUser;
using System.Security.Principal;

namespace Anywhere.service.Data.ConsumerFinances
{
    public class ConsumerFinancesWorker
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        Anywhere.service.Data.ConsumerFinances.ConsumerFinancesDataGetter Odg = new Anywhere.service.Data.ConsumerFinances.ConsumerFinancesDataGetter();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        DataGetter dg = new DataGetter();

        public class ConsumerFinancesEntry
        {
            [DataMember(Order = 0)]
            public string ID { get; set; }
            [DataMember(Order = 1)]
            public string activityDate { get; set; }
            [DataMember(Order = 2)]
            public string account { get; set; }
            [DataMember(Order = 3)]
            public string payee { get; set; }
            [DataMember(Order = 4)]
            public string category { get; set; }
            [DataMember(Order = 5)]
            public string amount { get; set; }
            [DataMember(Order = 6)]
            public string checkno { get; set; }
            [DataMember(Order = 7)]
            public string balance { get; set; }
            [DataMember(Order = 8)]
            public string enteredby { get; set; }
            [DataMember(Order = 9)]
            public string AttachmentsID { get; set; }
            [DataMember(Order = 10)]
            public string subCategory { get; set; }
            [DataMember(Order = 11)]
            public string accountType { get; set; }
            [DataMember(Order = 12)]
            public string description { get; set; }
            [DataMember(Order = 13)]
            public string receipt { get; set; }
            [DataMember(Order = 14)]
            public string accountID { get; set; }

        }

        [DataContract]
        public class ActiveAccount
        {
            [DataMember(Order = 0)]
            public string accountId { get; set; }
            [DataMember(Order = 1)]
            public string accountName { get; set; }

        }

        [DataContract]
        public class Payees
        {
            [DataMember(Order = 0)]
            public string CategoryID { get; set; }
            [DataMember(Order = 1)]
            public string Description { get; set; }

        }

        [DataContract]
        public class Category
        {
            [DataMember(Order = 0)]
            public string CategoryID { get; set; }
            [DataMember(Order = 1)]
            public string CategoryDescription { get; set; }

        }

        [DataContract]
        public class SubCategory
        {
            [DataMember(Order = 0)]
            public string CategoryID { get; set; }
            [DataMember(Order = 1)]
            public string SubCategoryDescription { get; set; }

        }

        [DataContract]
        public class ActivePayee
        {
            [DataMember(Order = 0)]
            public string RegionID { get; set; }
            [DataMember(Order = 1)]
            public string Description { get; set; }
            [DataMember(Order = 2)]
            public string address1 { get; set; }
            [DataMember(Order = 3)]
            public string address2 { get; set; }
            [DataMember(Order = 4)]
            public string city { get; set; }
            [DataMember(Order = 5)]
            public string state { get; set; }
            [DataMember(Order = 6)]
            public string zipcode { get; set; }
        }

        [DataContract]
        public class AccountRegister
        {
            [DataMember(Order = 0)]
            public string registerId { get; set; }

        }

        public class CFAttachmentsList
        {
            [DataMember(Order = 0)]
            public int attachmentID { get; set; } 
            [DataMember(Order = 1)]
            public string description { get; set; }

        }


        public ConsumerFinancesEntry[] getAccountTransectionEntries(string token, string consumerIds, string activityStartDate, string activityEndDate, string accountName, string payee, string category, string minamount, string maxamount, string checkNo, string balance, string enteredBy)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    ConsumerFinancesEntry[] entries = js.Deserialize<ConsumerFinancesEntry[]>(Odg.getAccountTransectionEntries(token, consumerIds, activityStartDate, activityEndDate, accountName, payee, category, minamount, maxamount, checkNo, balance, enteredBy, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public ActiveAccount[] getActiveAccount(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveAccount[] accounts = js.Deserialize<ActiveAccount[]>(Odg.getActiveAccount(transaction));
                    return accounts;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Payees[] getPayees(string token, string UserId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Payees[] payees = js.Deserialize<Payees[]>(Odg.getPayees(transaction, UserId));
                    return payees;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Category[] getCatogories(string token, string categoryID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Category[] category = js.Deserialize<Category[]>(Odg.getCatogories(transaction, categoryID));
                    return category;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public SubCategory[] getSubCatogories(string token, string categoryID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    SubCategory[] subCategory = js.Deserialize<SubCategory[]>(Odg.getSubCatogories(transaction, categoryID));
                    return subCategory;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActivePayee insertPayee(string token, string payeeName, string address1, string address2, string city, string state, string zipcode, string userId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (payeeName == null) throw new Exception("employerName is required");
                    if (address1 == null) throw new Exception("address1 is required");
                    if (city == null) throw new Exception("city is required");
                    if (state == null) throw new Exception("state is required");
                    if (zipcode == null) throw new Exception("zipcode is required");
                    if (userId == null) throw new Exception("userId is required");

                    // insert document
                    String RegionID = Odg.insertPayee(payeeName, address1, address2, city, state, zipcode, userId, transaction);

                    ActivePayee payee = new ActivePayee();
                    payee.RegionID = RegionID;

                    return payee;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string addCFAttachment(string token, string attachmentType, string attachment)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    AccountRegister acountRegister = new AccountRegister();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (attachmentType == null) throw new Exception("attachmentType is required");
                    if (attachment == null) throw new Exception("attachment is required");

                    String attachmentId = "0";
                    if (attachmentType != null && attachment != null)
                    {
                        attachmentId = wfdg.insertAttachment(attachmentType, attachment, transaction);
                    }
                    return attachmentId;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }


        public AccountRegister insertAccount(string token, string date, string amount, string amountType, string account, string payee, string category, string subCategory, string checkNo, string description, string[] attachment, string receipt, string userId, string eventType, string regId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    AccountRegister acountRegister = new AccountRegister();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (date == null) throw new Exception("date is required");
                    if (amount == null) throw new Exception("amount is required");
                    if (payee == null) throw new Exception("payee is required");
                    if (category == null) throw new Exception("category is required");
                    if (userId == null) throw new Exception("userId is required");


                    String RegisterID;

                    if (eventType == "UPDATE")
                    {
                        RegisterID = Odg.updateAccount(token, date, amount, amountType, account, payee, category, subCategory, checkNo, description, receipt, userId, transaction, regId);
                    }
                    else
                    {
                        RegisterID = Odg.insertAccount(token, date, amount, amountType, account, payee, category, subCategory, checkNo, description, receipt, userId, transaction);
                    }

                    foreach (string AttachId in attachment)
                    {
                        Odg.insertAccountRegisterAttachments(token, RegisterID, AttachId, description, userId, transaction);
                    }

                    acountRegister.registerId = RegisterID;
                    return acountRegister;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ConsumerFinancesEntry[] getAccountEntriesById(string token, string registerId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    ConsumerFinancesEntry[] accountEntries = js.Deserialize<ConsumerFinancesEntry[]>(Odg.getAccountEntriesById(token, registerId, transaction));

                    return accountEntries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string deleteConsumerFinanceAccount(string token, string registerId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    return Odg.deleteConsumerFinanceAccount(token, registerId, transaction);

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public CFAttachmentsList[] getCFAttachmentsList(string token, string regId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    CFAttachmentsList[] attachmentsObj = js.Deserialize<CFAttachmentsList[]>(Odg.getCFAttachmentsList(token, regId, transaction));

                    return attachmentsObj;

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