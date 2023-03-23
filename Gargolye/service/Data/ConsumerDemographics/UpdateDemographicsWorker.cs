using System.Text;

namespace Anywhere.service.Data.ConsumerDemographics
{
    public class UpdateDemographicsWorker
    {
        Sybase di = new Data.Sybase();
        public string updateDemographicsRecord(string consumerId, string field, string newValue, string applicationName)
        {
            string query = "";
            StringBuilder sb = new StringBuilder();
            sb.Clear();
            if (field.Equals("addressOne"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set resident_address = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set address1 = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("addressTwo"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set resident_address_2 = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set address2 = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("city"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set resident_city = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set city = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("state"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set resident_state = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set state = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("zip"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set resident_zip = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set zipcode = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("primaryPhone"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set primary_phone = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set phone = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("secondaryPhone"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set secondary_phone = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set phone_2 = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("cellPhone"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set Cellular = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.people set Cellular = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("email"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set e_mail = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set email_address = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("dateOfBirth"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.people set date_of_birth = {0} where people.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set date_of_birth = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("medicaidNumber"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.consumer_info set Medicaid_Number = {0} where consumer_info.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set medicaid_number = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("medicareNumber"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.consumer_info set Medicare_Number = {0} where consumer_info.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set Medicare_Number = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }
            if (field.Equals("residentNumber"))
            {
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    sb.AppendFormat("update dba.consumer_info set Resident_Number = {0} where consumer_info.id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
                else
                {
                    sb.AppendFormat("update dba.consumers set resident_Number = {0} where consumers.consumer_id = {1}; commit; ", "'" + newValue + "'", consumerId);
                }
            }

            long ret = di.UpdateRecord(sb.ToString());
            if (ret.ToString() == "-999")
            {
                return "fail";
            }
            else
            {
                return "success";
            }

        }
    }
}