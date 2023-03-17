using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Anywhere.service.Data.ConsumerDemographics
{
    public class UpdateDemographicsWorker
    {
        Sybase di = new Data.Sybase();
        public string updateDemographicsRecord(string consumerId, string field, string newValue, string applicationName)
        {
            string query = "";
            if (field.Equals("address1")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set resident_address = " + newValue + " where id = " + consumerId; 
                }
                else {
                    query = "update consumers set address1 = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("address2")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set resident_address_2 = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set address2 = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("city")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set resident_city = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set city = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("state")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set resident_state = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set state = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("zip")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set resident_zip = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set zipcode = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("primaryPhone")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set primary_phone = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set phone = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("secondaryPhone")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set secondary_phone = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set phone_2 = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("cellPhone")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set cellular = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    //query = "update consumers set address1 = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("email")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set e_mail = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set email_address = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("dob")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update people set date_of_birth = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set date_of_birth = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("medicaidNumber")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update consumer_info set Medicaid_Number = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set medicaid_number = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("medicareNumber")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update consumer_info set Medicare_Number = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set Medicare_Number = " + newValue + " where id = " + consumerId;
                }
            }
            if (field.Equals("residentNumber")){
                if (applicationName.ToUpper() == "GATEKEEPER")
                {
                    query = "update consumer_info set Resident_Number = " + newValue + " where id = " + consumerId;
                }
                else
                {
                    query = "update consumers set resident_Number = " + newValue + " where id = " + consumerId;
                }
            }

            long ret = di.UpdateRecord(query);
            if(ret.ToString() == "-999")
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