using Anywhere.Data;
using Bytescout.PDF;
using OneSpanSign.Sdk;
using pdftron.PDF;
using System;
using System.Diagnostics;
using System.Runtime.InteropServices.ComTypes;
using System.Runtime.Serialization;
using System.ServiceModel.Web;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereWorker;
using static Anywhere.service.Data.ConsumerFinances.ConsumerFinancesWorker;
using static Anywhere.service.Data.Employment.EmploymentWorker;
using static Anywhere.service.Data.OODWorker;
using static Anywhere.service.Data.SimpleMar.SignInUser;

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

            [DataMember(Order = 6)]
            public string PeopleName { get; set; }



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

            [DataMember(Order = 12)]
            public string peopleId { get; set; }
            [DataMember(Order = 13)]
            public string positionID { get; set; }

            [DataMember(Order = 14)]
            public string existingEndDate { get; set; }
            [DataMember(Order = 15)]
            public string existingStartDate { get; set; }
            [DataMember(Order = 16)]
            public string existingPathID { get; set; }           
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
            [DataMember(Order = 1)]
            public string positionName { get; set; }

        }

        [DataContract]
        public class JobStanding
        {
            [DataMember(Order = 0)]
            public string jobStandingId { get; set; }
            [DataMember(Order = 1)]
            public string jobStandingName { get; set; }

        }

        [DataContract]
        public class Transportation
        {
            [DataMember(Order = 0)]
            public string transportationId { get; set; }
            [DataMember(Order = 1)]
            public string transportationName { get; set; }

        }

        [DataContract]
        public class TypeOfWork
        {
            [DataMember(Order = 0)]
            public string typeOfWorkId { get; set; }
            [DataMember(Order = 1)]
            public string typeOfWorkName { get; set; }

        }

        [DataContract]
        public class WagesEntries
        {
            [DataMember(Order = 0)]
            public string hoursPerWeek { get; set; }
            [DataMember(Order = 1)]
            public string wagesPerHour { get; set; }
            [DataMember(Order = 2)]
            public string startDate { get; set; }
            [DataMember(Order = 3)]
            public string endDate { get; set; }
            [DataMember(Order = 4)]
            public string positionId { get; set; }
            [DataMember(Order = 5)]
            public string wagesId { get; set; }

        }

        [DataContract]
        public class WagesCheckboxEntries
        {
            [DataMember(Order = 0)]
            public string vacationSick { get; set; }
            [DataMember(Order = 1)]
            public string medical { get; set; }
            [DataMember(Order = 2)]
            public string retirement { get; set; }
            [DataMember(Order = 3)]
            public string empDiscount { get; set; }
            [DataMember(Order = 4)]
            public string other { get; set; }
            [DataMember(Order = 5)]
            public string otherText { get; set; }

        }

        [DataContract]
        public class EmploymentPath
        {
            [DataMember(Order = 0)]
            public string pathId { get; set; }
        }

        [DataContract]
        public class PositionTaskEntries
        {
            [DataMember(Order = 0)]
            public string task { get; set; }
            [DataMember(Order = 1)]
            public string description { get; set; }
            [DataMember(Order = 2)]
            public string startDate { get; set; }
            [DataMember(Order = 3)]
            public string endDate { get; set; }
            [DataMember(Order = 4)]
            public string initialPerformance { get; set; }
            [DataMember(Order = 5)]
            public string initialPerformanceNotes { get; set; }
            [DataMember(Order = 6)]
            public string employeeStandard { get; set; }
            [DataMember(Order = 7)]
            public string jobTaskId { get; set; }
            [DataMember(Order = 8)]
            public int lastTaskNumber { get; set; }
            [DataMember(Order = 9)]
            public string initialPerformanceID { get; set; }
            [DataMember(Order = 10)]
            public int taskNumberToBeDeleted { get; set; }
        }


        [DataContract]
        public class InitialPerformance
        {
            [DataMember(Order = 0)]
            public string initialPerformanceId { get; set; }
            [DataMember(Order = 1)]
            public string initialPerformanceName { get; set; }
        }

        [DataContract]
        public class WorkScheduleEntries
        {
            [DataMember(Order = 0)]
            public string dayOfWeek { get; set; }
            [DataMember(Order = 1)]
            public string startTime { get; set; }
            [DataMember(Order = 2)]
            public string endTime { get; set; }
            [DataMember(Order = 3)]
            public string positionId { get; set; }
            [DataMember(Order = 4)]
            public string WorkScheduleId { get; set; }
        }

        [DataContract]
        public class EmploymentValidate
        {
            [DataMember(Order = 0)]
            public string IsEmployeeEnable { get; set; }

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

        public EmploymentPath insertEmploymentPath(string token, string employmentPath, string newStartDate, string newEndDate, string currentEndDate, string peopleID, string userID, string existingPathID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    String PathID;
                    EmploymentPath employeePath = new EmploymentPath();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string endDate;
                    if (newEndDate == "")
                        endDate = null;
                    else
                        endDate = newEndDate;
                    PathID = Odg.insertEmploymentPath(token, employmentPath, newStartDate, endDate, currentEndDate, peopleID, userID, transaction, existingPathID);

                    employeePath.pathId = PathID;
                    return employeePath;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public EmploymentEntriesByID insertEmploymentInfo(string token, string startDatePosition, string endDatePosition, string position, string jobStanding, string employer, string transportation, string typeOfWork, string selfEmployed, string name, string phone, string email, string peopleID, string userID, string PositionId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    String positionId;
                    EmploymentEntriesByID employeeInfo = new EmploymentEntriesByID();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string endDate;
                    string positionID;
                    if (endDatePosition == "")
                        endDate = null;
                    else
                        endDate = endDatePosition;
                    if (PositionId == null)
                        positionID = "0";
                    else
                        positionID = PositionId;

                    positionId = Odg.insertEmploymentInfo(token, startDatePosition, endDate, position, jobStanding, employer, transportation, typeOfWork, selfEmployed, name, phone, email, peopleID, userID, positionID, transaction);

                    employeeInfo.positionID = positionId;
                    return employeeInfo;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }


        public WagesEntries[] getWagesEntries(string token, string positionID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    WagesEntries[] entries = js.Deserialize<WagesEntries[]>(Odg.getWagesEntries(token, positionID, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public JobStanding[] getJobStandingsDropDown(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    JobStanding[] getJobs = js.Deserialize<JobStanding[]>(Odg.getJobStandingsDropDown(transaction));
                    return getJobs;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Employer[] getEmployerDropDown(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Employer[] getEmployer = js.Deserialize<Employer[]>(Odg.getEmployerDropDown(transaction));
                    return getEmployer;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Position[] getPositionDropDown(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Position[] getPosition = js.Deserialize<Position[]>(Odg.getPositionDropDown(transaction));
                    return getPosition;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public Transportation[] getTransportationDropDown(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    Transportation[] getTrans = js.Deserialize<Transportation[]>(Odg.getTransportationDropDown(transaction));
                    return getTrans;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public TypeOfWork[] getTypeOfWorkDropDown(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    TypeOfWork[] getTypeofWork = js.Deserialize<TypeOfWork[]>(Odg.getTypeOfWorkDropDown(transaction));
                    return getTypeofWork;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public WagesEntries insertWages(string token, string hoursWeek, string hoursWages, string startDate, string endDate, string PositionId, string wagesID, string userID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    String WagesID;
                    WagesEntries addUpdateWages = new WagesEntries();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    string dateEnd;
                    string positionID;
                    if (endDate == "")
                        dateEnd = null;
                    else
                        dateEnd = endDate;

                    WagesID = Odg.insertWages(token, hoursWeek, hoursWages, startDate, dateEnd, PositionId, wagesID, userID, transaction);

                    addUpdateWages.wagesId = WagesID;
                    return addUpdateWages;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public PositionTaskEntries[] getPositionTaskEntries(string token, string positionID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    PositionTaskEntries[] entries = js.Deserialize<PositionTaskEntries[]>(Odg.getPositionTaskEntries(token, positionID, transaction));
                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public InitialPerformance[] getInitialPerformanceDropdown(string token)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    js.MaxJsonLength = Int32.MaxValue;
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");
                    InitialPerformance[] getperformance = js.Deserialize<InitialPerformance[]>(Odg.getInitialPerformanceDropdown(transaction));
                    return getperformance;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public PositionTaskEntries insertPositionTask(string token, string task, string description, string startDate, string endDate, string initialPerformance, string initialPerformanceNotes, string employeeStandard, string PositionId, string jobTaskID, string userID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    String JobTaskID;
                    PositionTaskEntries addUpdatePositionTask = new PositionTaskEntries();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    JobTaskID = Odg.insertPositionTask(token, task, description, startDate, endDate, initialPerformance, initialPerformanceNotes, employeeStandard, PositionId, jobTaskID, userID, transaction);

                    addUpdatePositionTask.jobTaskId = JobTaskID;
                    return addUpdatePositionTask;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public WorkScheduleEntries[] getWorkScheduleEntries(string token, string positionID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    WorkScheduleEntries[] entries = js.Deserialize<WorkScheduleEntries[]>(Odg.getWorkScheduleEntries(token, positionID, transaction));
                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public EmploymentValidate[] isNewPositionEnable(string token, string consumerIds)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    // isEnable = Odg.isNewPositionEnable(token, consumerIds, transaction);
                    EmploymentValidate[] validateEmployee = js.Deserialize<EmploymentValidate[]>(Odg.isNewPositionEnable(token, consumerIds, transaction));
                    return validateEmployee;


                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public EmploymentEntriesByID[] getEmployeementPath(string token, string consumersId)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    EmploymentEntriesByID[] employeepath = js.Deserialize<EmploymentEntriesByID[]>(Odg.getEmployeementPath(token, consumersId, transaction));

                    return employeepath;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public WagesEntries saveCheckboxWages(string token, string chkboxName, string IsChacked, string PositionId, string textboxValue, string userID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    String WagesID;
                    WagesEntries addUpdateWages = new WagesEntries();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    WagesID = Odg.saveCheckboxWages(token, chkboxName, IsChacked, PositionId, textboxValue, userID, transaction);

                    addUpdateWages.wagesId = WagesID;
                    return addUpdateWages;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public WagesCheckboxEntries[] getWagesCheckboxEntries(string token, string positionID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    WagesCheckboxEntries[] entries = js.Deserialize<WagesCheckboxEntries[]>(Odg.getWagesCheckboxEntries(token, positionID, transaction));

                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public WorkScheduleEntries insertWorkSchedule(string token, string dayOfWeek, string startTime, string endTime, string PositionId, string WorkScheduleID, string userID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    String WorkScheduleId;
                    WorkScheduleEntries addUpdateWorkSchedule = new WorkScheduleEntries();
                    if (!wfdg.validateToken(token, transaction)) throw new Exception("invalid session token");

                    WorkScheduleId = Odg.insertWorkSchedule(token, dayOfWeek, startTime, endTime, PositionId, WorkScheduleID, userID, transaction);

                    addUpdateWorkSchedule.WorkScheduleId = WorkScheduleId;
                    return addUpdateWorkSchedule;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }
        }

        public PositionTaskEntries[] getLastTaskNumber(string token, string positionID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    PositionTaskEntries[] entries = js.Deserialize<PositionTaskEntries[]>(Odg.getLastTaskNumber(token, positionID, transaction));
                    return entries;

                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw new WebFaultException<string>(ex.Message, System.Net.HttpStatusCode.BadRequest);
                }
            }

        }

        public string deleteWagesBenefits(string token, string wagesID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {

                try
                {
                    Odg.deleteWagesBenefits(token, wagesID, transaction);
                    return "sucess";
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return "failed";
                }
            }
        }

        public string deleteWorkSchedule(string token, string WorkScheduleID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {
                try
                {
                    Odg.deleteWorkSchedule(token, WorkScheduleID, transaction);
                    return "sucess";
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return "failed";
                }
            }
        }

        public string deletePostionTask(string token, string jobTaskID, string PositionID)
        {
            using (DistributedTransaction transaction = new DistributedTransaction(DbHelper.ConnectionString))
            {

                try
                {
                    PositionTaskEntries[] updateEntriesList = js.Deserialize<PositionTaskEntries[]>(Odg.deletePostionTask(token, jobTaskID, PositionID, transaction));
                    int taskNumberToBeUpdated = updateEntriesList[0].taskNumberToBeDeleted;

                    foreach (PositionTaskEntries updateTaskNumber in updateEntriesList)
                    {
                        Odg.updatePositionTaskNumber(token, updateTaskNumber.jobTaskId, taskNumberToBeUpdated, transaction);
                        taskNumberToBeUpdated++;
                    }
                    return "sucess";
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    return "failed";
                }
            }
        }


    }
}