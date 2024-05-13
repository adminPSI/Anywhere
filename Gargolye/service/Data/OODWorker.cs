using Anywhere.Data;
using System;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data
{
    public class OODWorker
    {
        private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        Anywhere.service.Data.OODDataGetter Odg = new Anywhere.service.Data.OODDataGetter();
        Anywhere.service.Data.WorkflowDataGetter wfdg = new Anywhere.service.Data.WorkflowDataGetter();
        DataGetter dg = new DataGetter();

        public class OODEntry
        {
            [DataMember(Order = 0)]
            public string ID { get; set; }
            [DataMember(Order = 1)]
            public string consumerId { get; set; }
            [DataMember(Order = 2)]
            public string serviceDate { get; set; }
            [DataMember(Order = 3)]
            public string consumerName { get; set; }
            [DataMember(Order = 4)]
            public string serviceCode { get; set; }
            [DataMember(Order = 5)]
            public string referenceNumber { get; set; }
            [DataMember(Order = 6)]
            public string userUpdated { get; set; }
            [DataMember(Order = 7)]
            public string employerName { get; set; }
            [DataMember(Order = 8)]
            public string serviceType { get; set; }
            [DataMember(Order = 9)]
            public string formNumber { get; set; }

        }

        [DataContract]
        public class ActiveEmployer
        {
            [DataMember(Order = 0)]
            public string employerId { get; set; }
            [DataMember(Order = 1)]
            public string employerName { get; set; }
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
            [DataMember(Order = 7)]
            public string isEmployerIdReferenced { get; set; }

        }

        [DataContract]
        public class ActiveEmployee
        {
            [DataMember(Order = 0)]
            public string userId { get; set; }
            [DataMember(Order = 1)]
            public string userName { get; set; }

        }


        [DataContract]
        public class ServiceCode
        {
            [DataMember(Order = 0)]
            public string serviceId { get; set; }
            [DataMember(Order = 1)]
            public string serviceName { get; set; }
            [DataMember(Order = 2)]
            public string serviceCode { get; set; }
            [DataMember(Order = 3)]
            public string referenceNumber { get; set; }
            [DataMember(Order = 4)]
            public string serviceType { get; set; }
            [DataMember(Order = 5)]
            public string formNumber { get; set; }
        }

        [DataContract]
        public class ReferenceNumber
        {
            [DataMember(Order = 0)]
            public string referenceNumber { get; set; }

        }

        [DataContract]
        public class ContactType
        {
            [DataMember(Order = 0)]
            public string contactCode { get; set; }
            [DataMember(Order = 1)]
            public string contactCaption { get; set; }

        }

        [DataContract]
        public class Outcome
        {
            [DataMember(Order = 0)]
            public string outcomeCode { get; set; }
            [DataMember(Order = 1)]
            public string outcomeCaption { get; set; }

        }

        [DataContract]
        public class OODDDLItem
        {
            [DataMember(Order = 0)]
            public string code { get; set; }
            [DataMember(Order = 1)]
            public string caption { get; set; }

        }

        [DataContract]
        public class Form4MonthlyPlacementEditData
        {
            [DataMember(Order = 0)]
            public string consumerId { get; set; }
            [DataMember(Order = 1)]
            public string caseNoteId { get; set; }
            [DataMember(Order = 2)]
            public string serviceDate { get; set; }
            [DataMember(Order = 3)]
            public string startTime { get; set; }
            [DataMember(Order = 4)]
            public string endTime { get; set; }
            [DataMember(Order = 5)]
            public string SAMLevel { get; set; }
            [DataMember(Order = 6)]
            public string employer { get; set; }
            [DataMember(Order = 7)]
            public string contactType { get; set; }
            [DataMember(Order = 8)]
            public string jobSeekerPresent { get; set; }
            [DataMember(Order = 9)]
            public string outcome { get; set; }
            [DataMember(Order = 10)]
            public string TSCNotified { get; set; }
            [DataMember(Order = 11)]
            public string bilingualSupplement { get; set; }
            [DataMember(Order = 12)]
            public string notes { get; set; }
            [DataMember(Order = 13)]
            public string application { get; set; }
            [DataMember(Order = 14)]
            public string interview { get; set; }

        }


        [DataContract]
        public class Form4MonthlySummary
        {
            [DataMember(Order = 0)]
            public string consumerId { get; set; }
            [DataMember(Order = 1)]
            public string emReviewId { get; set; }
            [DataMember(Order = 2)]
            public string emReviewDate { get; set; }
            [DataMember(Order = 3)]
            public string emReferenceNumber { get; set; }
            [DataMember(Order = 4)]
            public string emNextScheduledReview { get; set; }
            [DataMember(Order = 5)]
            public string emEmploymentGoal { get; set; }
            [DataMember(Order = 6)]
            public string emReferralQuestions { get; set; }
            [DataMember(Order = 7)]
            public string emIndivInputonSearch { get; set; }
            [DataMember(Order = 8)]
            public string emPotentialIssueswithProgress { get; set; }
            [DataMember(Order = 9)]
            public string emPlanGoalsNextMonth { get; set; }
            [DataMember(Order = 10)]
            public string emNumberofConsumerContacts { get; set; }
            [DataMember(Order = 11)]
            public string emNumberEmployerContactsbyConsumer { get; set; }
            [DataMember(Order = 12)]
            public string emNumberEmployerContactsbyStaff { get; set; }
            [DataMember(Order = 13)]
            public string emNumberMonthsJobDevelopment { get; set; }
            [DataMember(Order = 14)]
            public string userId { get; set; }
            [DataMember(Order = 15)]
            public string serviceId { get; set; }
        }

        [DataContract]
        public class Form8CommunityBasedAssessment
        {
            [DataMember(Order = 0)]
            public string consumerId { get; set; }
            [DataMember(Order = 1)]
            public string caseNoteId { get; set; }
            [DataMember(Order = 2)]
            public string serviceDate { get; set; }
            [DataMember(Order = 3)]
            public string startTime { get; set; }
            [DataMember(Order = 4)]
            public string endTime { get; set; }
            [DataMember(Order = 5)]
            public string SAMLevel { get; set; }
            [DataMember(Order = 6)]
            public string contactMethod { get; set; }
            [DataMember(Order = 7)]
            public string behavioralIndicators { get; set; }
            [DataMember(Order = 8)]
            public string jobTaskQualityIndicators { get; set; }
            [DataMember(Order = 9)]
            public string jobTaskQuantityIndicators { get; set; }
            [DataMember(Order = 10)]
            public string narrative { get; set; }
            [DataMember(Order = 11)]
            public string interventions { get; set; }
            [DataMember(Order = 12)]
            public string position { get; set; }
            [DataMember(Order = 13)]
            public string serviceName { get; set; }
        }


        [DataContract]
        public class Form8MonthlySummary
        {
            [DataMember(Order = 0)]
            public string consumerId { get; set; }
            [DataMember(Order = 1)]
            public string emReviewId { get; set; }
            [DataMember(Order = 2)]
            public string emReviewDate { get; set; }
            [DataMember(Order = 3)]
            public string emReferenceNumber { get; set; }
            [DataMember(Order = 4)]
            public string emNextScheduledReview { get; set; }

            [DataMember(Order = 5)]
            public string emSummaryIndivSelfAssessment { get; set; }
            [DataMember(Order = 6)]
            public string emSummaryIndivEmployerAssessment { get; set; }
            [DataMember(Order = 7)]
            public string emSummaryIndivProviderAssessment { get; set; }

            [DataMember(Order = 8)]
            public string emSupportandTransition { get; set; }

            [DataMember(Order = 9)]
            public string emReviewVTS { get; set; }


        }


        [DataContract]
        public class Form10TransportationData
        {
            [DataMember(Order = 0)]
            public string consumerId { get; set; }
            [DataMember(Order = 1)]
            public string OODTransportationId { get; set; }
            [DataMember(Order = 2)]
            public string serviceDate { get; set; }
            [DataMember(Order = 3)]
            public string startTime { get; set; }
            [DataMember(Order = 4)]
            public string endTime { get; set; }
            [DataMember(Order = 5)]
            public string contactType { get; set; }
            [DataMember(Order = 6)]
            public string startLocation { get; set; }
            [DataMember(Order = 7)]
            public string endLocation { get; set; }
            [DataMember(Order = 8)]
            public string numberInVehicle { get; set; }
            [DataMember(Order = 9)]
            public string userId { get; set; }
            [DataMember(Order = 10)]
            public string serviceId { get; set; }
        }

        [DataContract]
        public class Form16SummerYouthWorkExperience
        {
            [DataMember(Order = 0)]
            public string consumerId { get; set; }
            [DataMember(Order = 1)]
            public string caseNoteId { get; set; }
            [DataMember(Order = 2)]
            public string serviceDate { get; set; }
            [DataMember(Order = 3)]
            public string startTime { get; set; }
            [DataMember(Order = 4)]
            public string endTime { get; set; }
            [DataMember(Order = 5)]
            public string interventions { get; set; }
            [DataMember(Order = 6)]
            public string position { get; set; }
            [DataMember(Order = 7)]
            public string serviceName { get; set; }
        }


        public OODEntry[] getOODEntries(string token, string consumerIds, string serviceStartDate, string serviceEndDate, string userId, string serviceCode, string referenceNumber)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    OODEntry[] entries = js.Deserialize<OODEntry[]>(Odg.getOODEntries(consumerIds, serviceStartDate, serviceEndDate, userId, serviceCode, referenceNumber, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public ActiveEmployee[] getActiveEmployees(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveEmployee[] employees = js.Deserialize<ActiveEmployee[]>(Odg.getActiveEmployees(transaction));
                    return employees;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveEmployer[] getConsumerEmployers(string consumerId, string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveEmployer[] employers = js.Deserialize<ActiveEmployer[]>(Odg.getConsumerEmployers(consumerId, transaction));
                    return employers;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveEmployer[] getActiveEmployers(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ActiveEmployer[] employers = js.Deserialize<ActiveEmployer[]>(Odg.getActiveEmployers(transaction));
                    return employers;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public string deleteEmployer(string token, string employerId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (employerId == null) throw new Exception("employerId is required");

                    // insert group steps
                    String rowsDeleted = Odg.deleteEmployer(employerId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveEmployer insertEmployer(string token, string employerName, string address1, string address2, string city, string state, string zipcode, string userId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (employerName == null) throw new Exception("employerName is required");
                    if (address1 == null) throw new Exception("address1 is required");
                    if (address2 == null) throw new Exception("address2 is required");
                    if (city == null) throw new Exception("city is required");
                    if (state == null) throw new Exception("state is required");
                    if (zipcode == null) throw new Exception("zipcode is required");
                    if (userId == null) throw new Exception("userId is required");

                    // insert document
                    String employerId = Odg.insertEmployer(employerName, address1, address2, city, state, zipcode, userId, transaction);

                    ActiveEmployer employer = new ActiveEmployer();
                    employer.employerId = employerId;

                    return employer;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveEmployer UpdateEmployer(string token, string employerId, string employerName, string address1, string address2, string city, string state, string zipcode, string userId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (employerId == null) throw new Exception("employerId is required");
                    if (employerName == null) throw new Exception("employerName is required");
                    if (address1 == null) throw new Exception("address1 is required");
                    if (address2 == null) throw new Exception("address2 is required");
                    if (city == null) throw new Exception("city is required");
                    if (state == null) throw new Exception("state is required");
                    if (zipcode == null) throw new Exception("zipcode is required");
                    if (userId == null) throw new Exception("userId is required");

                    string comments = null;

                    // update document
                    String employer_Id = Odg.UpdateEmployer(token, employerId, employerName, address1, address2, city, state, zipcode, userId, transaction);

                    ActiveEmployer employer = new ActiveEmployer();
                    employer.employerId = employer_Id;

                    return employer;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ActiveEmployer[] getEmployerJSON(string token, string employerId)
        {
            string employerString = Odg.getEmployerJSON(token, employerId);
            ActiveEmployer[] employerObj = js.Deserialize<ActiveEmployer[]>(employerString);
            return employerObj;
        }

        public ServiceCode[] getActiveServiceCodes(string token, string serviceCodeType)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ServiceCode[] services = js.Deserialize<ServiceCode[]>(Odg.getActiveServiceCodes(transaction, serviceCodeType));
                    return services;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ReferenceNumber[] getConsumerReferenceNumbers(string token, string consumerIds, string startDate, string endDate, string formNumber)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ReferenceNumber[] referenceNumbers = js.Deserialize<ReferenceNumber[]>(Odg.getConsumerReferenceNumbers(consumerIds, startDate, endDate, formNumber, transaction));
                    return referenceNumbers;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public ServiceCode[] getConsumerServiceCodes(string consumerId, string serviceDate, string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ServiceCode[] services = js.Deserialize<ServiceCode[]>(Odg.getConsumerServiceCodes(consumerId, serviceDate, transaction));
                    return services;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }
        // Form 4 Monthly Placement
        public ContactType[] getContactTypes(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    ContactType[] contactTypes = js.Deserialize<ContactType[]>(Odg.getContactTypes(transaction));
                    return contactTypes;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        // Form 4 Monthly Placement
        public Outcome[] getOutcomes(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Outcome[] outcomes = js.Deserialize<Outcome[]>(Odg.getOutcomes(transaction));
                    return outcomes;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        //  Form 8 Community Based Assessment Form -- Contact Methods data for DDL
        public OODDDLItem[] getContactMethods(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    OODDDLItem[] contactMethods = js.Deserialize<OODDDLItem[]>(Odg.getContactMethods(transaction));
                    return contactMethods;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        //  Form 8 Community Based Assessment Form -- Indicators data for DDLs
        public OODDDLItem[] getIndicators(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    OODDDLItem[] indicators = js.Deserialize<OODDDLItem[]>(Odg.getIndicators(transaction));
                    return indicators;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        //  Form 8 Community Based Assessment Form -- Positions data for DDLs
        public OODDDLItem[] getOODPositions(string consumerId, string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    OODDDLItem[] positions = js.Deserialize<OODDDLItem[]>(Odg.getOODPositions(consumerId, transaction));
                    return positions;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        // Form 4 Monthly Placement
        public Form4MonthlyPlacementEditData[] getForm4MonthlyPlacementEditDataJSON(string token, string caseNoteId)
        {
            string editDataString = Odg.getForm4MonthlyPlacementEditDataJSON(token, caseNoteId);
            Form4MonthlyPlacementEditData[] editDataObj = js.Deserialize<Form4MonthlyPlacementEditData[]>(editDataString);
            return editDataObj;
        }

        public string deleteOODFormEntry(string token, string caseNoteId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (caseNoteId == null) throw new Exception("formId is required");

                    // insert group steps
                    String rowsDeleted = Odg.deleteOODFormEntry(caseNoteId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        // Form 4 Monthly Summary
        public Form4MonthlySummary[] getForm4MonthlySummaryJSON(string token, string emReviewId)
        {
            string editDataString = Odg.getForm4MonthlySummaryJSON(token, emReviewId);
            Form4MonthlySummary[] editDataObj = js.Deserialize<Form4MonthlySummary[]>(editDataString);
            return editDataObj;
        }

        public string deleteFormMonthlySummary(string token, string emReviewId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    if (emReviewId == null) throw new Exception("reviewId is required");

                    // insert group steps
                    String rowsDeleted = Odg.deleteFormMonthlySummary(emReviewId, transaction);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        // Form 8 Community Based Assessment
        public Form8CommunityBasedAssessment[] getForm8CommunityBasedAssessment(string token, string caseNoteId)
        {
            string editDataString = Odg.getForm8CommunityBasedAssessment(token, caseNoteId);
            Form8CommunityBasedAssessment[] editDataObj = js.Deserialize<Form8CommunityBasedAssessment[]>(editDataString);
            return editDataObj;
        }



        // Form 8 Monthly Summary
        public Form8MonthlySummary[] getForm8MonthlySummary(string token, string emReviewId)
        {
            string editDataString = Odg.getForm8MonthlySummary(token, emReviewId);
            Form8MonthlySummary[] editDataObj = js.Deserialize<Form8MonthlySummary[]>(editDataString);
            return editDataObj;
        }

        // Form 10 Transportation
        public Form10TransportationData[] getForm10TransportationData(string token, string OODTransportationId)
        {
            string editDataString = Odg.getForm10TransportationData(token, OODTransportationId);
            Form10TransportationData[] editDataObj = js.Deserialize<Form10TransportationData[]>(editDataString);
            return editDataObj;
        }

        public string deleteOODForm10TransportationEntry(string token, string OODTransportationId)
        {
                 try
                {
                    if (OODTransportationId == null) throw new Exception("formId is required");
                    String rowsDeleted = Odg.deleteOODForm10TransportationEntry(OODTransportationId);

                    return rowsDeleted;
                }
                catch (Exception ex)
                {
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            
        }

        // Form Form16SummerYouthWorkExperience
        public Form16SummerYouthWorkExperience[] getForm16SummerYouthWorkExperience(string token, string caseNoteId)
        {
            string editDataString = Odg.getForm16SummerYouthWorkExperience(token, caseNoteId);
            Form16SummerYouthWorkExperience[] editDataObj = js.Deserialize<Form16SummerYouthWorkExperience[]>(editDataString);
            return editDataObj;
        }


    }
}