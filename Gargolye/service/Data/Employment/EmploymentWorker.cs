using Anywhere.Data;
using System;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.Employment.EmploymentWorker;
using static Anywhere.service.Data.OODWorker;

namespace Anywhere.service.Data.Employment
{
    public class EmploymentWorker
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        Anywhere.service.Data.Employment.EmploymentDataGetter Odg = new Anywhere.service.Data.Employment.EmploymentDataGetter();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        DataGetter dg = new DataGetter();


        [DataContract]
        public class EmploymentEntries
        {
            [DataMember(Order = 0)]
            public string employer { get; set; }
            [DataMember(Order = 1)]
            public string position { get; set; }
            [DataMember(Order = 2)]
            public string positionStartDate { get; set; }
            [DataMember(Order = 3)]
            public string positionEndDate { get; set; }
            [DataMember(Order = 4)]
            public string jobStanding { get; set; }

            [DataMember(Order = 5)]
            public string positionId { get; set; }

        }

        [DataContract]
        public class EmploymentEntriesByID
        {
            [DataMember(Order = 0)]
            public string employer { get; set; }
            [DataMember(Order = 1)]
            public string position { get; set; }
            [DataMember(Order = 2)]
            public string positionStartDate { get; set; }
            [DataMember(Order = 3)]
            public string positionEndDate { get; set; }
            [DataMember(Order = 4)]
            public string jobStanding { get; set; }

            [DataMember(Order = 5)]
            public string transportation { get; set; }

            [DataMember(Order = 6)]
            public string typeOfWork { get; set; }

            [DataMember(Order = 7)]
            public string employmentPath { get; set; }

            [DataMember(Order = 8)]
            public string selfEmployed { get; set; }

            [DataMember(Order = 9)]
            public string name { get; set; }

            [DataMember(Order = 10)]
            public string phone { get; set; }

            [DataMember(Order = 11)]
            public string email { get; set; }


        }


        [DataContract]
        public class Employer
        {
            [DataMember(Order = 0)]
            public string employerId { get; set; }
            [DataMember(Order = 0)]
            public string employerName { get; set; }

        }

        [DataContract]
        public class Position
        {
            [DataMember(Order = 0)]
            public string positionId { get; set; }
            [DataMember(Order = 0)]
            public string positionName { get; set; }

        }

        [DataContract]
        public class JobStanding
        {
            [DataMember(Order = 0)]
            public string jobStandingId { get; set; }
            [DataMember(Order = 0)]
            public string jobStandingName { get; set; }

        }


        public EmploymentEntries[] getEmploymentEntries(string token, string consumerIds, string employer, string position, string positionStartDate, string positionEndDate, string jobStanding)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    EmploymentEntries[] entries = js.Deserialize<EmploymentEntries[]>(Odg.getEmploymentEntries(token, consumerIds, employer, position, positionStartDate, positionEndDate, jobStanding, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public Employer[] getEmployers(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Employer[] employers = js.Deserialize<Employer[]>(Odg.getEmployers(transaction));
                    return employers;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Position[] getPositions(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Position[] positions = js.Deserialize<Position[]>(Odg.getPositions(transaction));
                    return positions;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public JobStanding[] getJobStandings(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    JobStanding[] getJobs = js.Deserialize<JobStanding[]>(Odg.getJobStandings(transaction));
                    return getJobs;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public EmploymentEntriesByID[] getEmployeeInfoByID(string token, string positionId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    EmploymentEntriesByID[] employeeInfo = js.Deserialize<EmploymentEntriesByID[]>(Odg.getEmployeeInfoByID(token, positionId, transaction));

                    return employeeInfo;

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