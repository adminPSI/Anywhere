using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.VisualBasic;
using System.Collections;
using System.Data;
using System.Diagnostics;
using System.Text;
using Anywhere.Log;

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