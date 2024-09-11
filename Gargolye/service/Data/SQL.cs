using Anywhere.Log;
using System.Data;
using System.Text;

namespace Anywhere.service.Data
{
    public class SQL
    {
        private static Loger logger = new Loger();
        StringBuilder sb = new StringBuilder();
        Data.Sybase di = new Data.Sybase();
        public DataSet TimeDetail(string UserName, string StartDate, string EndDate)
        {

            sb.Clear();
            sb.Append("select s.date_of_service as dateofservice, s.anywhere_status as submitted, l.description as location, ");
            sb.Append("w.work_code + ' - '+ w.description as workcode, ");
            sb.Append("s.start_time as starttime, s.end_time as endtime, s.check_hours as hours, ");
            sb.Append("s.number_consumers_present as consumers, s.transportation_units as miles ");
            sb.Append("FROM dba.aa_single_entry as s ");
            sb.Append("left outer join dba.locations as l on l.Location_ID = s.Location_ID ");
            sb.Append("left outer join dba.work_codes as w on w.Work_Code_ID = s.Work_Code_ID ");
            sb.AppendFormat("where s.user_id = '{0}' ", UserName);
            sb.AppendFormat("and s.date_of_service between '{0}' and '{1}'", StartDate, EndDate);
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
            sb.Append("se.transportation_units AS miles ");
            sb.Append("FROM dba.aa_single_entry AS se ");
            sb.Append("LEFT OUTER JOIN persons AS p ON se.person_id = p.person_id ");
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
            sb.Append("ORDER BY se.date_of_service DESC, start_time ASC;");

            return di.SelectRowsDS(sb.ToString());
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

    }
}