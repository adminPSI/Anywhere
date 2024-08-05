using Anywhere.Data;
using System;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereWorker;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.OODWorker;

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

            [DataMember(Order = 15)]
            public string reconciled { get; set; }
            [DataMember(Order = 16)]
            public string lastUpdateBy { get; set; }
            [DataMember(Order = 17)]
            public string deposit { get; set; }
            [DataMember(Order = 18)]
            public string expance { get; set; }
            [DataMember(Order = 19)]
            public string isExpance { get; set; }

        }

        [DataContract]
        public class ActiveAccount
        {
            [DataMember(Order = 0)]
            public string accountId { get; set; }
            [DataMember(Order = 1)]
            public string accountName { get; set; }
            [DataMember(Order = 2)]
            public string totalBalance { get; set; }
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
        public class CategorySubCategory
        {
            [DataMember(Order = 0)]
            public string CategoryDescription { get; set; }
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

        [DataContract]
        public class SplitAmountData
        {
            [DataMember(Order = 0)]
            public string itemNumber { get; set; }
            [DataMember(Order = 1)]
            public string category { get; set; }
            [DataMember(Order = 2)]
            public string description { get; set; }
            [DataMember(Order = 3)]
            public string amount { get; set; }
            [DataMember(Order = 4)]
            public string categoryId { get; set; }
        }

        public class CFAttachmentsList
        {
            [DataMember(Order = 0)]
            public string attachmentID { get; set; }
            [DataMember(Order = 1)]
            public string description { get; set; }
            [DataMember(Order = 2)]
            public string registerID { get; set; }

        }

        public class ConsumerName
        {
            [DataMember(Order = 0)]
            public string FullName { get; set; }
            [DataMember(Order = 1)]
            public string ID { get; set; }

        }
        public class EditAccountInfo
        {
            public string Id { get; set; }
            public string name { get; set; }
            public string number { get; set; }
            public string type { get; set; }
            public string status { get; set; }
            public string classofAccount { get; set; }
            public string dateOpened { get; set; }
            public string dateClosed { get; set; }
            public string lastReconciled { get; set; }
            public string openingBalance { get; set; }
            public string balance { get; set; }
            public string description { get; set; }
            public string accountId { get; set; }
        }

        public class AccountClass
        {
            public string accountClass { get; set; }
            public string SystemClass { get; set; }

        }

        [DataContract]
        public class ConsumerFinanceEntriesWidget
        {
            [DataMember(Order = 0)]
            public string name { get; set; }
            [DataMember(Order = 1)]
            public string lastTransaction { get; set; }
            [DataMember(Order = 2)]
            public string balance { get; set; }
            [DataMember(Order = 3)]
            public string account { get; set; }
            [DataMember(Order = 4)]
            public string Id { get; set; }
            [DataMember(Order = 5)]
            public string registerId { get; set; }
        }

        public ConsumerFinancesEntry[] getAccountTransectionEntries(string token, string consumerIds, string activityStartDate, string activityEndDate, string accountName, string payee, string category, string minamount, string maxamount, string checkNo, string balance, string enteredBy, string isattachment, string transectionType, string accountPermission)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    ConsumerFinancesEntry[] entries = js.Deserialize<ConsumerFinancesEntry[]>(Odg.getAccountTransectionEntries(token, consumerIds, activityStartDate, activityEndDate, accountName, payee, category, minamount, maxamount, checkNo, balance, enteredBy, isattachment, transaction, transectionType, accountPermission));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public ActiveAccount[] getActiveAccount(string token, string consumerId, string accountPermission)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveAccount[] accounts = js.Deserialize<ActiveAccount[]>(Odg.getActiveAccount(transaction, consumerId, accountPermission));
                    return accounts;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Payees[] getPayees(string token, string consumerId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Payees[] payees = js.Deserialize<Payees[]>(Odg.getPayees(transaction, consumerId));
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

        public Category[] getSplitCategoriesSubCategories(string token, string categoryID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Category[] category = js.Deserialize<Category[]>(Odg.getSplitCategoriesSubCategories(transaction, categoryID));
                    return category;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public SubCategory[] getSubCatogories(string token, string category)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    SubCategory[] subCategory = js.Deserialize<SubCategory[]>(Odg.getSubCatogories(transaction, category));
                    return subCategory;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Category[] getCategoriesSubCategories(string token, string categoryID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Category[] category = js.Deserialize<Category[]>(Odg.getCategoriesSubCategories(transaction, categoryID));
                    return category;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public CategorySubCategory[] getCategoriesSubCategoriesByPayee(string token, string categoryID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    CategorySubCategory[] categorySubCategory = js.Deserialize<CategorySubCategory[]>(Odg.getCategoriesSubCategoriesByPayee(transaction, categoryID));
                    return categorySubCategory;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActivePayee insertPayee(string token, string payeeName, string address1, string address2, string city, string state, string zipcode, string userId, string consumerId)
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
                    if (consumerId == null) throw new Exception("consumerId is required");
                    if (userId == null) throw new Exception("userId is required");

                    // insert document
                    String RegionID = Odg.insertPayee(payeeName, address1, address2, city, state, zipcode, userId, consumerId, transaction);

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


        public AccountRegister insertAccount(string token, string date, string amount, string amountType, string account, string payee, string category, string subCategory, string checkNo, string description, string[] attachmentId, string[] attachmentDesc, string receipt, string userId, string eventType, string regId, SplitAmountData[] splitAmount, string categoryID)
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

                    string runningBalance = amount;


                    String RegisterID;

                    if (eventType == "UPDATE")
                    {
                        RegisterID = Odg.updateAccount(token, date, amount, amountType, account, payee, category, subCategory, checkNo, description, receipt, userId, transaction, regId, runningBalance);
                    }
                    else
                    {
                        RegisterID = Odg.insertAccount(token, date, amount, amountType, account, payee, category, subCategory, checkNo, description, receipt, userId, transaction, runningBalance);
                    }

                    runningBalance = updateAccountBalance(date, account, transaction, runningBalance);

                    if (attachmentId != null)
                    {
                        int counter = 0;
                        foreach (string AttachId in attachmentId)
                        {
                            Odg.insertAccountRegisterAttachments(token, RegisterID, AttachId, attachmentDesc[counter], userId, transaction);
                            counter++;
                        }
                    }

                    if (splitAmount.Length > 0)
                    {
                        Odg.deleteSplitRegisterData(token, RegisterID, transaction);
                        foreach (SplitAmountData objSplitData in splitAmount)
                        {
                            Odg.insertSplitRegisterAccount(token, RegisterID, objSplitData.itemNumber, objSplitData.category, objSplitData.description, objSplitData.amount, objSplitData.categoryId, userId, transaction);
                        }
                    }
                    else
                    {
                        Odg.deleteSplitRegisterData(token, RegisterID, transaction);
                        Odg.insertSplitRegisterAccount(token, RegisterID, "1", category, description, amount, categoryID, userId, transaction);
                        Odg.updateSplitRegisterCategoryData(token, RegisterID, category, subCategory, transaction);
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

        private string updateAccountBalance(string date, string account, DistributedTransaction transaction, string runningBalance)
        {
            ConsumerFinancesEntry[] nextRunningBal = js.Deserialize<ConsumerFinancesEntry[]>(Odg.getNextAccountRunningBalance(date, account, transaction));
            int counterbal = 0;
            foreach (ConsumerFinancesEntry updateAmount in nextRunningBal)
            {
                string balance;

                if (updateAmount.deposit == "0" || updateAmount.deposit == "0.00")
                {
                    if (counterbal == 0)
                        balance = (Convert.ToDecimal("0") - Convert.ToDecimal(updateAmount.expance)).ToString();
                    else
                        balance = (Convert.ToDecimal(runningBalance) - Convert.ToDecimal(updateAmount.expance)).ToString();
                }
                else
                {
                    if (counterbal == 0)
                        balance = (Convert.ToDecimal("0") + Convert.ToDecimal(updateAmount.deposit)).ToString();
                    else
                        balance = (Convert.ToDecimal(runningBalance) + Convert.ToDecimal(updateAmount.deposit)).ToString();
                }
                runningBalance = balance;
                Odg.updateRunningBalance(balance, transaction, updateAmount.ID);
                counterbal++;
            }

            return runningBalance;
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

        public EditAccountInfo[] getEditAccountInfoById(string token, string accountId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    EditAccountInfo[] accountInfo = js.Deserialize<EditAccountInfo[]>(Odg.getEditAccountInfoById(token, accountId, transaction));
                    return accountInfo;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ConsumerFinancesWorker.AccountClass[] getAccountClass(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    AccountClass[] accountClass = js.Deserialize<AccountClass[]>(Odg.getAccountClass(token, transaction));
                    return accountClass;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ConsumerFinancesWorker.EditAccountInfo insertEditRegisterAccount(string token, string selectedConsumersId, string accountId, string name, string number, string type, string status, string classofAccount, string dateOpened, string dateClosed, string openingBalance, string description, string userId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    EditAccountInfo acountRegister = new EditAccountInfo();

                    String AccountID;

                    AccountID = Odg.insertEditRegisterAccount(token, selectedConsumersId, accountId, name, number, type, status, classofAccount, dateOpened, dateClosed, openingBalance, description, userId, transaction);
                    if (accountId != "0")
                    {
                        ConsumerFinancesEntry[] updateRunningBal = js.Deserialize<ConsumerFinancesEntry[]>(Odg.getEditAccountRunningBalance(openingBalance, accountId, transaction));
                        if (updateRunningBal.Length > 0) 
                            updateAccountBalance(updateRunningBal[0].activityDate, accountId, transaction, updateRunningBal[0].balance);
                        AccountID = accountId; 
                    }

                    acountRegister.accountId = AccountID;
                    return acountRegister;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveAccount[] getEditAccount(string token, string consumerId, string accountPermission)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveAccount[] accounts = js.Deserialize<ActiveAccount[]>(Odg.getEditAccount(transaction, consumerId, accountPermission));
                    return accounts;
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
                    ConsumerFinancesEntry[] categorySubCategory = js.Deserialize<ConsumerFinancesEntry[]>(Odg.deleteConsumerFinanceAccount(token, registerId, transaction));
                    Odg.deleteSplitRegisterData(token, registerId, transaction);
                    updateAccountBalance(categorySubCategory[0].activityDate, categorySubCategory[0].accountID, transaction, categorySubCategory[0].balance);
                    return categorySubCategory[0].accountID;
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
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    CFAttachmentsList[] attachmentsList = js.Deserialize<CFAttachmentsList[]>(Odg.getCFAttachmentsList(transaction, regId));
                    return attachmentsList;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ConsumerName[] getConsumerNameByID(string token, string consumersId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    ConsumerName[] consumerName = js.Deserialize<ConsumerName[]>(Odg.getConsumerNameByID(token, consumersId, transaction));

                    return consumerName;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string deleteCFAttachment(string token, string attachmentId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    return Odg.deleteCFAttachment(token, attachmentId, transaction);

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveEmployee[] getActiveUsedBy(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveEmployee[] usedby = js.Deserialize<ActiveEmployee[]>(Odg.getActiveUsedBy(transaction));
                    return usedby;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ConsumerFinanceEntriesWidget[] getConsumerFinanceWidgetEntriesData(string token, string consumerName, string locationName, string sortOrderName)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    ConsumerFinanceEntriesWidget[] entries = js.Deserialize<ConsumerFinanceEntriesWidget[]>(Odg.getConsumerFinanceWidgetEntriesData(token, consumerName, locationName, sortOrderName, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public ConsumerName[] getCFWidgetConsumers(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    string consumerString = Odg.getCFWidgetConsumers(token, transaction);
                    ConsumerName[] consumerObj = js.Deserialize<ConsumerName[]>(consumerString);
                    return consumerObj;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public SplitAmountData[] getSplitRegisterAccountEntriesByID(string token, string registerId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    SplitAmountData[] accountSplitEntries = js.Deserialize<SplitAmountData[]>(Odg.getSplitRegisterAccountEntriesByID(token, registerId, transaction));

                    return accountSplitEntries;

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