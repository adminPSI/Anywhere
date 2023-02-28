using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Runtime.Serialization;
using System.Web.Script.Serialization;
using System.ServiceModel.Web;
using System.IO;
using Anywhere.Data;

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


        }     

        [DataContract]
        public class ActiveAccount
        {
            [DataMember(Order = 0)]
            public string accountId { get; set; }
            [DataMember(Order = 1)]
            public string accountName { get; set; }

        }
      
        public ConsumerFinancesEntry[] getAccountTransectionEntries(string token, string consumerIds, string activityStartDate, string activityEndDate, string accountName, string payee, string category, string amount, string checkNo, string balance, string enteredBy)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    ConsumerFinancesEntry[] entries = js.Deserialize<ConsumerFinancesEntry[]>(Odg.getAccountTransectionEntries(token, consumerIds, activityStartDate , activityEndDate, accountName, payee, category, amount, checkNo, balance, enteredBy, transaction));

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
     
    }
}