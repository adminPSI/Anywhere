using System.Collections.Generic;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.Transportation
{
    public class TransportationWorker
    {
        JavaScriptSerializer js = new JavaScriptSerializer();
        TransportationDataGetter tdg = new TransportationDataGetter();

        public InsertTripCompleted[] insertTripCompleted(string token, string tripName, string driverId, string otherRider, string dateOfService, string billingType, string vehicleInformationId, string locationId)
        {
            string tripString = tdg.insertTripCompleted(token, tripName, driverId, otherRider, dateOfService, billingType, vehicleInformationId, locationId);
            InsertTripCompleted[] tripObj = js.Deserialize<InsertTripCompleted[]>(tripString);
            return tripObj;
        }

        public class InsertTripCompleted
        {
            public string tripCompletedId { get; set; }
        }

        public string insertVehicleInformation(string token)
        {
            return tdg.insertVehicleInformation(token);
        }

        public string updateVehicleInformation(string token)
        {
            return tdg.updateVehicleInformation(token);
        }

        public VehicleInformation[] getVehicleInformation(string token, string informationId)
        {
            string informationString = tdg.getVehicleInformation(token, informationId);
            VehicleInformation[] informationObj = js.Deserialize<VehicleInformation[]>(informationString);
            return informationObj;
        }

        public class VehicleInformation
        {
            public string informationId { get; set; }
        }

        public VehicleDropdown[] getVehicleDropdown(string token)
        {
            string informationString = tdg.getVehicleDropdown(token);
            VehicleDropdown[] informationObj = js.Deserialize<VehicleDropdown[]>(informationString);
            return informationObj;
        }

        public class VehicleDropdown
        {
            public string vehicleInformationId { get; set; }
            public string vehicleNumber { get; set; }
            public string vehicleDescription { get; set; }
            public string Active { get; set; }
        }

        public string deleteVehicleInspection(string token, string vehicleInspectionId)
        {
            return tdg.deleteVehicleInspection(token, vehicleInspectionId);
        }

        public InsertVehicleInspection[] insertVehicleInspection(string token, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes)
        {
            string inspectionString = tdg.insertVehicleInspection(token, vehicleInformationId, tripCompletedId, inspectionDate, inspectionTime, notes);
            InsertVehicleInspection[] inspectionObj = js.Deserialize<InsertVehicleInspection[]>(inspectionString);
            return inspectionObj;
        }
        public class InsertVehicleInspection
        {
            public string vehicleInspectionId { get; set; }
        }

        public List<string> insertVehicleInspectionDetails(string token, string vehicleInspectionId, string inspectionCatString, string inspectionStatusString)
        {
            List<string> inspectionDetails = new List<string>();
            string[] inspectionCat = inspectionCatString.Split('|');
            string[] inspectionStatus = inspectionStatusString.Split('|');
            int i = 0;
            foreach (string category in inspectionCat)
            {
                tdg.insertVehicleInspectionDetails(token, vehicleInspectionId, category, inspectionStatus[i]);
                i++;
            }
            return inspectionDetails;
        }

        public List<string> massUpdateDriverVehicle(string token, string method, string routeIdString, string updateVal)
        {
            List<string> massRouteUpdate = new List<string>();
            string[] routes = routeIdString.Split('|');
            int i = 0;
            foreach (string route in routes)
            {
                tdg.massUpdateDriverVehicle(token, method, route, updateVal);
                i++;
            }
            return massRouteUpdate;
        }

        public string updateVehicleInspection(string token, string vehicleInspectionId, string vehicleInformationId, string tripCompletedId, string inspectionDate, string inspectionTime, string notes)
        {
            return tdg.updateVehicleInspection(token, vehicleInspectionId, vehicleInformationId, tripCompletedId, inspectionDate, inspectionTime, notes);
        }

        public VehicleInspectionCategories[] getInspectionCategories(string token)
        {
            string inspectionString = tdg.getInspectionCategories(token);
            VehicleInspectionCategories[] inspectionObj = js.Deserialize<VehicleInspectionCategories[]>(inspectionString);
            return inspectionObj;
        }

        public class VehicleInspectionCategories
        {
            public string categoryID { get; set; }
            public string description { get; set; }
            public string allowNA { get; set; }
        }

        public VehicleInspection[] getVehicleInspectionDetails(string token, string vehicleInspectionId)
        {
            string inspectionString = tdg.getVehicleInspectionDetails(token, vehicleInspectionId);
            VehicleInspection[] inspectionObj = js.Deserialize<VehicleInspection[]>(inspectionString);
            return inspectionObj;
        }

        public class VehicleInspection
        {
            public string inspectionCategory { get; set; }
            public string categoryStatus { get; set; }
        }

        public CompletedVehicleInspections[] getCompletedInspections(string token, string fromDate, string toDate, string vehicleInfoId, string userId)
        {
            string inspectionString = tdg.getCompletedInspections(token, fromDate, toDate, vehicleInfoId, userId);
            CompletedVehicleInspections[] inspectionObj = js.Deserialize<CompletedVehicleInspections[]>(inspectionString);
            return inspectionObj;
        }

        public class CompletedVehicleInspections
        {
            public string inspectionDate { get; set; }
            public string inspectionTime { get; set; }
            public string enteredById { get; set; }
            public string routeName { get; set; }
            public string inspectionId { get; set; }
            public string vehicleNumber { get; set; }
            public string vehicleId { get; set; }
            public string routeId { get; set; }
            public string note { get; set; }
        }
        public Trips[] getTrips(string token, string serviceDateStart, string serviceDateStop, string personId, string locationId, string vehicleId)
        {
            string tripsString = tdg.getTrips(token, serviceDateStart, serviceDateStop, personId, locationId, vehicleId);
            Trips[] tripsObj = js.Deserialize<Trips[]>(tripsString);
            return tripsObj;
        }

        public class Trips
        {
            public string tripsCompletedId { get; set; }
            public string tripName { get; set; }
            public string tripId { get; set; }
            public string vehicleInfoId { get; set; }
            public string odoStart { get; set; }
            public string odoStop { get; set; }
            public string startTime { get; set; }
            public string endTime { get; set; }
            public string consumerNoStatus { get; set; }
            public string locationName { get; set; }
            public string locationId { get; set; }
            public string dateOfService { get; set; }
            public string driverId { get; set; }
            public string tripInspection { get; set; }
            public string tripInspectionEnteredBy { get; set; }
            public string inspectionTime { get; set; }
            public string inspectionNote { get; set; }
            public string tripType { get; set; }
            public string batchNumber { get; set; }
            public string totalConsumersOnRecord { get; set; }
            public string integratedEmployment { get; set; }
        }

        public TripConsumers[] getTripConsumers(string token, string tripsCompletedId)
        {
            string tripsString = tdg.getTripConsumers(token, tripsCompletedId);
            TripConsumers[] tripsObj = js.Deserialize<TripConsumers[]>(tripsString);
            return tripsObj;
        }

        public class TripConsumers
        {
            public string alternateAddress { get; set; }
            public string consumerId { get; set; }
            public string notes { get; set; }
            public string pickupOrder { get; set; }
            public string riderStatus { get; set; }
            public string scheduledTime { get; set; }
            public string totalTravelTime { get; set; }
            public string completedDetailId { get; set; }
            public string completedId { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
            public string middleI { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
            public string directions { get; set; }
            public string specialInstructions { get; set; }
            public string defaultDirections { get; set; }
            public string defaultSpecialInstructions { get; set; }
        }

        public AlternateAddresses[] getAlternateAddresses(string token, string consumerId)
        {
            string addressString = tdg.getAlternateAddresses(token, consumerId);
            AlternateAddresses[] addressObj = js.Deserialize<AlternateAddresses[]>(addressString);
            return addressObj;
        }

        public class AlternateAddresses
        {
            public string consumerId { get; set; }
            public string locationId { get; set; }
            public string code { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
            public string directions { get; set; }
            public string specialInstructions { get; set; }
        }


        public TripInformation[] getTripInformation(string token, string tripsCompletedId)
        {
            string tripsString = tdg.getTripInformation(token, tripsCompletedId);
            TripInformation[] tripsObj = js.Deserialize<TripInformation[]>(tripsString);
            return tripsObj;
        }

        public class TripInformation
        {
            public string billingType { get; set; }
            public string otherRider { get; set; }
            public string startTime { get; set; }
            public string endTime { get; set; }
            public string odometerStart { get; set; }
            public string odometerStop { get; set; }
            public string vehicleInformationId { get; set; }
            public string driverId { get; set; }
            public string locationId { get; set; }
            public string batchId { get; set; }
            public string integratedEmployment { get; set; }

        }

        public Drivers[] getDrivers(string token)
        {
            string driversString = tdg.getDrivers(token);
            Drivers[] driversObj = js.Deserialize<Drivers[]>(driversString);
            return driversObj;
        }

        public class Drivers
        {
            public string Last_Name { get; set; }
            public string First_Name { get; set; }
            public string Person_ID { get; set; }
            public string catEndDate { get; set; }
            public string catStartDate { get; set; }
            public string termDate { get; set; }
        }

        public ConsumerDetail[] getConsumerDetails(string token, string consumerId)
        {
            string consumerString = tdg.getConsumerDetails(token, consumerId);
            ConsumerDetail[] consumerObj = js.Deserialize<ConsumerDetail[]>(consumerString);
            return consumerObj;
        }

        public class ConsumerDetail
        {
            public string lastName { get; set; }
            public string firstName { get; set; }
            public string middleI { get; set; }
            public string address1 { get; set; }
            public string address2 { get; set; }
            public string city { get; set; }
            public string state { get; set; }
            public string zip { get; set; }
        }

        public string updateTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime, string integratedEmployment)
        {
            return tdg.updateTripDetails(token, tripsCompletedId, odometerStart, odometerStop, startTime, endTime, integratedEmployment);
        }


        public string updateManageTripDetails(string token, string tripsCompletedId, string odometerStart, string odometerStop, string startTime, string endTime, string driverId, string otherRiderId, string vehicleId, string locationId, string billingType, string tripName, string integratedEmployment)
        {
            return tdg.updateManageTripDetails(token, tripsCompletedId, odometerStart, odometerStop, startTime, endTime, driverId, otherRiderId, vehicleId, locationId, billingType, tripName, integratedEmployment);
        }

        public string insertUpdateTripConsumers(string token, string tripDetailId, string tripsCompletedId, string consumerId, string alternateAddress, string scheduledTime,
            string totalTravelTime, string riderStatus, string specialInstructions, string directions, string pickupOrder, string notes)
        {
            return tdg.insertUpdateTripConsumers(token, tripDetailId, tripsCompletedId, consumerId, alternateAddress, scheduledTime, totalTravelTime, riderStatus, specialInstructions, directions, pickupOrder, notes);
        }

        public string deleteConsumerFromTrip(string tripsCompletedId, string consumerId)
        {
            return tdg.deleteConsumerFromTrip(tripsCompletedId, consumerId);
        }

        public string deleteTrip(string token, string tripsCompletedId)
        {
            return tdg.deleteTrip(token, tripsCompletedId);
        }

    }
}