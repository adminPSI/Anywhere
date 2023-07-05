using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.IO;
using System.Linq;
using System.Web.Script.Serialization;
namespace Anywhere.service.Data.Transportation
{
    public class TransportationDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string getTrips(string token, string serviceDateStart, string serviceDateStop, string personId, string locationId, string vehicleId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getMyRoutes " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(serviceDateStart);
            list.Add(serviceDateStop);
            list.Add(personId);
            list.Add(locationId);
            list.Add(vehicleId);
            string text = "CALL DBA.ANYW_Transportation_getTrips(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("500-trans", ex.Message + "ANYW_Transportation_getTrips(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "500-trans: error ANYW_Transportation_getTrips";
            }
        }
        public string getTripConsumers(string token, string tripsCompletedId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getTripConsumers " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripsCompletedId);
            string text = "CALL DBA.ANYW_Transportation_getTripConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("509-trans", ex.Message + "ANYW_Transportation_GetTripConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "509-trans: error ANYW_Transportation_getTripConsumers";
            }
        }
        public string getTripInformation(string token, string tripsCompletedId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getTripInformation " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripsCompletedId);
            string text = "CALL DBA.ANYW_Transportation_GetTripInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("509-trans", ex.Message + "ANYW_Transportation_getTripInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "509-trans: error ANYW_Transportation_getTripInformation";
            }
        }

        public string getDrivers(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDrivers " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Transportation_GetDrivers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("510-trans", ex.Message + "ANYW_Transportation_GetDrivers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "510-trans: error ANYW_Transportation_GetDrivers";
            }
        }

        public string getConsumerDetails(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getConsumerDetails " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Transportation_GetConsumerDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("511-trans", ex.Message + "ANYW_Transportation_GetConsumerDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "511-trans: error ANYW_Transportation_GetConsumerDetails";
            }
        }

        public string updateTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateTripDetails " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripsCompletedId);
            list.Add(odometerStart);
            list.Add(odometerStop);
            list.Add(startTime);
            list.Add(endTime);
            string text = "CALL DBA.ANYW_Transportation_UpdateTripDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("511-trans", ex.Message + "ANYW_Transportation_UpdateTripDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "511-trans: error ANYW_Transportation_UpdateTripDetails";
            }
        }

        public string updateManageTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime, string driverId, string otherRiderId, string vehicleId, string locationId, string billingType)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateManageTripDetails " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripsCompletedId);
            list.Add(odometerStart);
            list.Add(odometerStop);
            list.Add(startTime);
            list.Add(endTime);
            list.Add(driverId);
            list.Add(otherRiderId);
            list.Add(vehicleId);
            list.Add(locationId);
            list.Add(billingType);
            string text = "CALL DBA.ANYW_Transportation_UpdateManageTripDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("511-trans", ex.Message + "ANYW_Transportation_UpdateManageTripDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "511-trans: error ANYW_Transportation_UpdateManageTripDetails";
            }
        }

        public string insertUpdateTripConsumers(string token, string tripDetailId, string tripsCompletedId, string consumerId, string alternateAddress, string scheduledTime,
            string totalTravelTime, string riderStatus, string specialInstructions, string directions, string pickupOrder, string notes)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertUpdateTripConsumers " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripDetailId);
            list.Add(tripsCompletedId);
            list.Add(consumerId);
            list.Add(alternateAddress);
            list.Add(scheduledTime);
            list.Add(totalTravelTime);
            list.Add(riderStatus);
            list.Add(specialInstructions);
            list.Add(directions);
            list.Add(pickupOrder);
            list.Add(notes);
            string text = "CALL DBA.ANYW_Transportation_insertUpdateTripConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("511-trans", ex.Message + "ANYW_Transportation_insertUpdateTripConsumers(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "511-trans: error ANYW_Transportation_insertUpdateTripConsumers";
            }
        }

        public string getVehicleInformation(string token, string informationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getVehicleInformation " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(informationId);
            string text = "CALL DBA.ANYW_Transportation_GetVehicleInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("501-trans", ex.Message + "ANYW_Transportation_GetVehicleInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "501-trans: error ANYW_Transportation_GetVehicleInformation";
            }
        }

        public string insertVehicleInformation(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getDefaultAnywhereSettingsJSON " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Transportation_InsertVehicleInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("502-trans", ex.Message + "ANYW_Transportation_InsertVehicleInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "502-trans: error ANYW_Transportation_InsertVehicleInformation";
            }
        }

        public string updateVehicleInformation(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateVehicleInformation " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Transportation_UpdateVehicleInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("503-trans", ex.Message + "ANYW_Transportation_UpdateVehicleInformation(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "503-trans: error ANYW_Transportation_UpdateVehicleInformation";
            }
        }

        public string deleteVehicleInspection(string token, string vehicleInspectionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteVehicleInformation " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(vehicleInspectionId);
            string text = "CALL DBA.ANYW_Transportation_DeleteVehicleInspection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("504-trans", ex.Message + "ANYW_Transportation_DeleteVehicleInspection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "504-trans: error ANYW_Transportation_DeleteVehicleInspection";
            }
        }

        public string deleteTrip(string token, string tripsCompletedId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteVehicleInformation " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripsCompletedId);
            string text = "CALL DBA.ANYW_Transportation_DeleteTrip(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("505-trans", ex.Message + "ANYW_Transportation_DeleteTrip(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "504-trans: error ANYW_Transportation_DeleteTrip";
            }
        }

        public string getInspectionCategories(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getInspectionCategories " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Transportation_GetInspectionCategories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("513-trans", ex.Message + "ANYW_Transportation_GetInspectionCategories(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "513-trans: error ANYW_Transportation_GetInspectionCategories";
            }
        }

        public string getVehicleInspectionDetails(string token, string vehicleInspectionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getVehicleInspectionDetails " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(vehicleInspectionId);
            string text = "CALL DBA.ANYW_Transportation_GetVehicleInspectionDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("505-trans", ex.Message + "ANYW_Transportation_GetVehicleInspectionDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "505-trans: error ANYW_Transportation_GetVehicleInspectionDetails";
            }
        }

        public string insertVehicleInspectionDetails(string token, string vehicleInspectionId, string category, string inspectionStatus)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertVehicleInspectionDetails " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(vehicleInspectionId);
            list.Add(category);
            list.Add(inspectionStatus);
            string text = "CALL DBA.ANYW_Transportation_InsertUpdateVehicleInspectionDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("516-trans", ex.Message + "ANYW_Transportation_InsertUpdateVehicleInspectionDetails(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "516-trans: error ANYW_Transportation_InsertUpdateVehicleInspectionDetails";
            }
        }

        public string massUpdateDriverVehicle(string token, string method, string route, string updateVal)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("massUpdateDriverVehicle " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(method);
            list.Add(route);
            list.Add(updateVal);
            string text = "CALL DBA.ANYW_Transportation_massUpdateDriverVehicle(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("516-trans", ex.Message + "ANYW_Transportation_massUpdateDriverVehicle(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "516-trans: error ANYW_Transportation_massUpdateDriverVehicle";
            }
        }

        public string getVehicleDropdown(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getVehicleDropdown " + token);
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_Transportation_GetVehiclesDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("515-trans", ex.Message + "ANYW_Transportation_GetVehiclesDropdown(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "515-trans: error ANYW_Transportation_GetVehiclesDropdown";
            }
        }

        public string getCompletedInspections(string token, string fromDate, string toDate, string vehicleInfoId, string userId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getCompletedInspections " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(fromDate);
            list.Add(toDate);
            list.Add(vehicleInfoId);
            list.Add(userId);
            string text = "CALL DBA.ANYW_Transportation_GetCompletedInspections(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("514-trans", ex.Message + "ANYW_Transportation_GetCompletedInspections(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "514-trans: error ANYW_Transportation_GetCompletedInspections";
            }
        }

        public string insertVehicleInspection(string token, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertVehicleInspection " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(vehicleInformationId);
            list.Add(tripCompletedId);
            list.Add(inspectionDate);
            list.Add(inspectionTime);
            list.Add(notes);
            string text = "CALL DBA.ANYW_Transportation_InsertVehicleInspection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("506-trans", ex.Message + "ANYW_Transportation_InsertVehicleInspection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "506-trans: error ANYW_Transportation_InsertVehicleInspection";
            }
        }

        public string updateVehicleInspection(string token, string vehicleInspectionId, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("updateVehicleInspection " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(vehicleInspectionId);
            list.Add(vehicleInformationId);
            list.Add(tripCompletedId);
            list.Add(inspectionDate);
            list.Add(inspectionTime);
            list.Add(notes);
            string text = "CALL DBA.ANYW_Transportation_UpdateVehicleInspection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("507-trans", ex.Message + "ANYW_Transportation_UpdateVehicleInspection(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "507-trans: error ANYW_Transportation_UpdateVehicleInspection";
            }
        }

        public string getAlternateAddresses(string token, string consumerId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertTripCompleted " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Transportation_GetAlternateAddresses(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("508-trans", ex.Message + "ANYW_Transportation_GetAlternateAddresses(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "508-trans: error ANYW_Transportation_GetAlternateAddresses";
            }
        }

        public string insertTripCompleted(string token, string tripName, string driverId, string otherRider, string dateOfService, string billingType, string vehicleInformationId, string locationId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertTripCompleted " + token);
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(tripName);
            list.Add(driverId);
            list.Add(otherRider);
            list.Add(dateOfService);
            list.Add(billingType);
            list.Add(vehicleInformationId);
            list.Add(locationId);
            string text = "CALL DBA.ANYW_Transportation_InsertTripCompleted(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("508-trans", ex.Message + "ANYW_Transportation_InsertTripCompleted(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "508-trans: error ANYW_Transportation_InsertTripCompleted";
            }
        }

        public string deleteConsumerFromTrip(string tripsCompletedId, string consumerId)
        {
            logger.debug("deleteConsumerFromTrip " + tripsCompletedId);
            List<string> list = new List<string>();
            list.Add(tripsCompletedId);
            list.Add(consumerId);
            string text = "CALL DBA.ANYW_Transportation_DeleteConsumerFromTrip(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("517-trans", ex.Message + "ANYW_Transportation_DeleteConsumerFromTrip(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "517-trans: error ANYW_Transportation_DeleteConsumerFromTrip";
            }
        }

        public bool tokenValidator(string token)
        {
            if (token.Contains(" "))
            {
                return false;
            }
            else
            {
                return true;
            }
        }

        public string executeDataBaseCallJSON(string storedProdCall)
        {
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;
            string result = "[";

            List<string> arr = new List<string>();

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = conn;

                conn.Open();
                rdr = cmd.ExecuteReader();

                // iterate through results
                while (rdr.Read())
                {
                    Dictionary<string, string> holder = new Dictionary<string, string>();
                    for (int ordinal = 0; ordinal < rdr.FieldCount; ordinal++)
                    {

                        var val = rdr.GetValue(ordinal);
                        string str = val.ToString();
                        holder[rdr.GetName(ordinal)] = str;
                    }
                    arr.Add((new JavaScriptSerializer()).Serialize(holder));
                }

            }
            catch (Exception ex)
            {
                //change now, calling method must catch this error, it helps make better logging 
                //more of a pain debugging
                throw ex;
            }

            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }

            return result + String.Join(",", arr) + "]";
        }

        public System.IO.MemoryStream executeSQLReturnMemoryStream(string storedProdCall)
        {
            logger.debug("Attachment start");
            MemoryStream memorystream = new MemoryStream();
            OdbcConnection conn = null;
            OdbcCommand cmd;
            OdbcDataReader rdr = null;

            try
            {
                if (connectString.ToUpper().IndexOf("UID") == -1)
                {
                    connectString = connectString + "UID=anywhereuser;PWD=anywhere4u;";
                }
                conn = new OdbcConnection(connectString);

                cmd = new OdbcCommand(storedProdCall);
                cmd.CommandType = CommandType.Text;
                cmd.Connection = conn;

                conn.Open();
                logger.debug("Attachment connection open");
                var result = cmd.ExecuteReader();
                logger.debug("Attachment ExecuteReader done; entering result");
                if (result != null)
                {
                    logger.debug("Attachment result not null");
                    result.Read();
                    logger.debug("Attachment result.read done");
                    byte[] fileData = (byte[])result[0];
                    logger.debug("Attachment byte array made");
                    memorystream.Write(fileData, 0, fileData.Length);
                    logger.debug("Attachment data sent to memorystream");
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                if (conn != null)
                {
                    conn.Close();
                    conn.Dispose();
                }
                if (rdr != null)
                {
                    rdr.Close();
                    rdr.Dispose();
                }
            }
            logger.debug("Attachment done");
            return memorystream;
        }
    }
}