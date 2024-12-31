using Anywhere.Log;
using System.Collections.Generic;
using System;
using System.Data;
using System.Text;
using System.Linq;

namespace Anywhere.service.Data
{
    public class SQL
    {
        private static Loger logger = new Loger();
        StringBuilder sb = new StringBuilder();
        Data.Sybase di = new Data.Sybase();
        WorkflowDataGetter wfdg = new WorkflowDataGetter();
        public DataSet TimeDetail(string UserName, string StartDate, string EndDate)
        {

            sb.Clear();
            sb.Append("SELECT s.date_of_service AS dateofservice, ");
            sb.Append("s.anywhere_status AS submitted, ");
            sb.Append("l.description AS location, ");
            sb.Append("w.work_code + ' - ' + w.description AS workcode, ");
            sb.Append("s.start_time AS starttime, ");
            sb.Append("s.end_time AS endtime, ");
            sb.Append("s.check_hours AS hours, ");
            sb.Append("s.number_consumers_present AS consumers, ");
            sb.Append("s.transportation_units AS miles, ");
            sb.Append("pe.Last_Name + ', ' + pe.First_Name + ");
            sb.Append("CASE ");
            sb.Append("WHEN pe.Middle_Name IS NOT NULL AND pe.Middle_Name != '' THEN ' ' + UPPER(LEFT(pe.Middle_Name, 1)) + '.' ");
            sb.Append("ELSE '' ");
            sb.Append("END AS employee ");
            sb.Append("FROM dba.aa_single_entry AS s ");
            sb.Append("LEFT OUTER JOIN dba.locations AS l ON l.Location_ID = s.Location_ID ");
            sb.Append("LEFT OUTER JOIN dba.work_codes AS w ON w.Work_Code_ID = s.Work_Code_ID ");
            sb.Append("LEFT OUTER JOIN dba.Users_Groups AS ug ON ug.User_ID = s.user_id ");
            sb.Append("LEFT OUTER JOIN dba.People AS pe ON pe.Person_ID = ug.People_ID ");
            sb.AppendFormat("WHERE s.user_id = '{0}' ", UserName);
            sb.AppendFormat("AND s.date_of_service BETWEEN '{0}' AND '{1}'", StartDate, EndDate);

            return di.SelectRowsDS(sb.ToString());

        }

        public DataSet TimeDetailSupervisor(string supervisorId, string startDate, string endDate, string locationId, string personId, string status, string workCodeId)
        {
            sb.Clear();
            sb.Append("SELECT ");
            sb.Append("se.date_of_service AS dateofservice, ");
            sb.Append("se.anywhere_status AS submitted, ");
            sb.Append("loc.description AS location, ");
            sb.Append("wc.work_code + ' - ' + wc.description AS workcode, ");
            sb.Append("se.start_time AS starttime, ");
            sb.Append("se.end_time AS endtime, ");
            sb.Append("se.check_hours AS hours, ");
            sb.Append("(SELECT COUNT(*) FROM AA_Consumers_Present WHERE AA_Single_entry_ID = se.Single_entry_ID) AS consumers, ");
            sb.Append("COALESCE(se.transportation_units, 0) AS miles "); // Use COALESCE for miles
            sb.Append("FROM dba.aa_single_entry AS se ");
            sb.Append("LEFT OUTER JOIN Persons AS p ON se.person_id = p.person_id ");
            sb.Append("LEFT OUTER JOIN Locations AS loc ON loc.location_id = se.location_id ");
            sb.Append("LEFT OUTER JOIN work_codes AS wc ON wc.work_code_id = se.work_code_id ");
            sb.Append("LEFT OUTER JOIN AA_Single_Entry_Transportation AS trans ON se.Single_Entry_ID = trans.Single_Entry_ID ");
            sb.Append("LEFT OUTER JOIN People AS peo ON peo.Person_ID = p.Person_ID ");
            sb.Append("WHERE se.person_ID = ANY( ");
            sb.Append("    SELECT DISTINCT p.Person_ID ");
            sb.Append("    FROM persons AS p ");
            sb.Append("    JOIN AA_Single_Entry AS a ON a.Person_ID = p.Person_ID ");
            sb.AppendFormat("    WHERE (Supervisor_ID LIKE '{0}' ", supervisorId);
            sb.Append("    OR se.Location_ID = ANY( ");
            sb.Append("        SELECT Location_id ");
            sb.Append("        FROM location_supervisors AS ls ");
            sb.AppendFormat("        WHERE person_id LIKE '{0}' ", supervisorId);
            sb.Append("        AND ls.start_date <= NOW() ");
            sb.Append("        AND (ls.end_date >= NOW() OR ls.end_date IS NULL)) ");
            sb.Append("    AND se.Location_ID = ANY( ");
            sb.Append("        SELECT Location_id ");
            sb.Append("        FROM location_supervisors AS ls ");
            sb.Append("        WHERE person_id = ANY( ");
            sb.Append("            SELECT person_id ");
            sb.Append("            FROM persons ");
            sb.AppendFormat("            WHERE supervisor_id LIKE '{0}') ", supervisorId);
            sb.Append("        AND ls.start_date <= NOW() ");
            sb.Append("        AND (ls.end_date >= NOW() OR ls.end_date IS NULL)) ");
            sb.Append("    OR se.Location_ID = ANY( ");
            sb.Append("        SELECT location_supervisors.location_id ");
            sb.Append("        FROM location_supervisors ");
            sb.AppendFormat("        WHERE location_supervisors.person_id LIKE '{0}' ", supervisorId);
            sb.Append("        AND (location_supervisors.start_date <= se.Date_of_Service ");
            sb.Append("        AND (location_supervisors.end_date >= se.Date_of_Service ");
            sb.Append("        OR location_supervisors.end_date IS NULL)))) ");
            sb.Append("    AND (p.term_date >= NOW() OR p.term_date IS NULL)) ");
            sb.AppendFormat("AND se.date_of_service BETWEEN '{0}' AND '{1}' ", startDate, endDate);
            sb.AppendFormat("AND se.Location_ID LIKE '{0}' ", locationId);
            sb.AppendFormat("AND se.Person_ID LIKE '{0}' ", personId);
            sb.Append("AND se.person_ID <> 0 ");
            sb.AppendFormat("AND se.Anywhere_Status LIKE '{0}' ", status);
            sb.AppendFormat("AND se.Work_Code_ID LIKE '{0}' ", workCodeId);
            sb.Append("ORDER BY se.date_of_service DESC, se.start_time ASC;");


            return di.SelectRowsDS(sb.ToString());
        }

        public string timeDetailSupervisor(
            string supervisorId, string startDate, string endDate, string locationId, string personId, string status, string workCodeId, DistributedTransaction transaction)
        {
            logger.debug("TimeDetailSupervisor");

            //existingOutcomeGoalId = null;

            var parameters = new Dictionary<string, string>
            {
                { "@supervisorId", supervisorId },
                { "@startDate", startDate },
                { "@endDate", endDate },
                { "@locationId", locationId },
                { "@personId", personId },
                { "@status", status },
                { "@workCodeId", workCodeId }
            };

            try
            {
                return CallStoredProcedure("DBA.ANYW_SingleEntry_TimeDetailSupervisor", parameters, transaction);
            }
            catch (Exception ex)
            {
                logger.error("501-IOAS", ex.Message + " ANYW_SingleEntry_TimeDetailSupervisor");
                return "501-IOAS: error ANYW_SingleEntry_TimeDetailSupervisor";
            }
        }


        public DataSet TimeHeader(string UserName)
        {

            sb.Clear();
            sb.Append("select r.description, v.name ");
            sb.Append("from dba.regions as r ");
            sb.Append("LEFT OUTER JOIN dba.persons as p on p.region_id = r.region_id ");
            sb.Append("LEFT OUTER JOIN dba.users_groups as u on u.people_id = p.person_id ");
            sb.Append("LEFT OUTER JOIN dba.vendors as v on v.vendor_id = r.vendor_id ");
            sb.AppendFormat("WHERE u.user_id = '{0}' ", UserName);
            logger.debug(sb.ToString());
            return di.SelectRowsDS(sb.ToString());

        }

        public DataSet TimeOverlap(string UserID, string StartDate, string EndDate)
        {

            sb.Clear();
            sb.Append("select distinct s.single_entry_id, s.date_of_service,  s.start_time, s.end_time, l.description as location, ");
            sb.Append("w.work_code + ' - '+ w.description as workcode ");
            sb.Append("from  dba.aa_single_entry as s ");
            sb.Append("join  dba.aa_single_entry as s2 on ((s2.start_time > s.start_time and s2.start_time < s.end_time) AND  (s2.date_of_service = s.date_of_service)) ");
            sb.Append("LEFT OUTER JOIN dba.locations as l on l.Location_ID = s.Location_ID ");
            sb.Append("LEFT OUTER JOIN dba.work_codes as w on w.Work_Code_ID = s.Work_Code_ID ");
            sb.AppendFormat("WHERE s.date_of_service BETWEEN '{0}' AND '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND s.user_ID = '{0}' ", UserID);
            sb.AppendFormat("AND s2.user_ID = '{0}' ", UserID);//just added to keep from getting other times
            sb.Append("UNION ");
            sb.Append("select distinct s2.single_entry_id, s2.date_of_service,  s2.start_time, s2.end_time, l.description as location, ");
            sb.Append("w.work_code + ' - '+ w.description as workcode ");
            sb.Append("from  dba.aa_single_entry as s ");
            sb.Append("join  dba.aa_single_entry as s2 on ((s2.start_time > s.start_time and s2.start_time < s.end_time) AND  (s.date_of_service = s2.date_of_service)) ");
            sb.Append("LEFT OUTER JOIN dba.locations as l on l.Location_ID = s2.Location_ID ");
            sb.Append("LEFT OUTER JOIN dba.work_codes as w on w.Work_Code_ID = s2.Work_Code_ID ");
            sb.AppendFormat("WHERE s2.date_of_service BETWEEN '{0}' AND '{1}' ", StartDate, EndDate);
            sb.AppendFormat("AND s2.user_ID = '{0}' ", UserID);
            sb.AppendFormat("AND s.user_ID = '{0}' ", UserID);//just added to keep from getting other times
            return di.SelectRowsDS(sb.ToString());

        }

        public string CallStoredProcedure(
            string procedureName,
            Dictionary<string, string> parameters,
            DistributedTransaction transaction)
        {
            try
            {
                logger.debug("CallStoredProcedure");
                int paramCount = parameters.Count;
                System.Data.Common.DbParameter[] args = new System.Data.Common.DbParameter[paramCount];

                int index = 0;
                foreach (var param in parameters)
                {
                    args[index] = (System.Data.Common.DbParameter)DbHelper.CreateParameter(param.Key, DbType.String, param.Value);
                    index++;
                }

                string commandText = $"CALL {procedureName}({string.Join(",", new string[paramCount].Select((s, i) => "?"))})";
                System.Data.Common.DbDataReader returnMsg = DbHelper.ExecuteReader(System.Data.CommandType.StoredProcedure, commandText, args, ref transaction);
                return wfdg.convertToJSON(returnMsg);
            }
            catch (Exception ex)
            {
                logger.error("CallStoredProcedure", ex.Message + $" {procedureName}()");
                throw ex;
            }
        }

    }
}