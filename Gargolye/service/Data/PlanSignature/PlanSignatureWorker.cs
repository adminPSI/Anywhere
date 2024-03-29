using PSIOISP;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Web.Script.Serialization;
using static Anywhere.service.Data.AnywhereWorker;

namespace Anywhere.service.Data.PlanSignature
{
    public class PlanSignatureWorker
    {
        //private string connectionString = System.Configuration.ConfigurationManager.ConnectionStrings["connection"].ToString();
        JavaScriptSerializer js = new JavaScriptSerializer();
        PlanSignatureDataGetter psdg = new PlanSignatureDataGetter();
        OISPWorker oispW = new OISPWorker();
        PlanDataGetter pdg = new PlanDataGetter();
        static HttpClient client = new HttpClient();

        public PlanSignatures[] getSignatures(string token, long assessmentId)
        {
            string signatureString = psdg.getSignatures(token, assessmentId);
            PlanSignatures[] signatureObj = js.Deserialize<PlanSignatures[]>(signatureString);
            int count = 0;
            for (int i = 0; i < signatureObj.Length; i++)
            {
                if (signatureObj[i].signature != "")
                {
                    signatureObj[i].signature = "data:image/png;base64," + signatureObj[i].signature;
                }
                count++;
            }
            return signatureObj;
        }

        public PlanSignatures[] getTeamMemberBySalesForceId(string salesForceId)
        {
            string teamMemberString = psdg.getTeamMemberBySalesForceId(salesForceId);
            PlanSignatures[] teamMemberObj = js.Deserialize<PlanSignatures[]>(teamMemberString);

            return teamMemberObj;
        }

        public class PlanSignatures
        {
            public string planId { get; set; }
            public string signatureId { get; set; }
            public string teamMember { get; set; }
            public string name { get; set; }
            public string lastName { get; set; }
            public string middleName { get; set; }
            public string generation { get; set; }
            public string relationship { get; set; }
            public string participated { get; set; }
            public string signature { get; set; }
            public string dateSigned { get; set; }
            public string dissentAreaDisagree { get; set; }
            public string dissentHowToAddress { get; set; }
            public string dissentDate { get; set; }
            public string signatureOrder { get; set; }
            public string contactId { get; set; }
            public string planYearStart { get; set; }
            public string planYearEnd { get; set; }

            public string salesForceId { get; set; }
            public string buildingNumber { get; set; }
            public string dateOfBirth { get; set; }
            public string peopleId { get; set; }
            public string useExisting { get; set; }
            public string relationshipImport { get; set; }
            public string csChangeMind { get; set; }
            public string csChangeMindSSAPeopleId { get; set; }
            public string csContact { get; set; }
            public string csContactProviderVendorId { get; set; }
            public string csContactInput { get; set; }
            public string csRightsReviewed { get; set; }
            public string csAgreeToPlan { get; set; }
            public string csFCOPExplained { get; set; }
            public string csDueProcess { get; set; }
            public string csResidentialOptions { get; set; }
            public string csSupportsHealthNeeds { get; set; }
            public string csTechnology { get; set; }
            public string signatureType { get; set; }
            public string attachmentId { get; set; }
            public string description { get; set; }
            public string packageId { get; set; }
            public string signedStatus { get; set; }
            public string vendorId { get; set; }
            public string email { get; set; }
            public string parentOfMinor { get; set; }
            public string locationId { get; set; }
        }

        public class SigId
        {
            public string signatureId { get; set; }
            public string planCreationId { get; set; }
            public string existingPeopleId { get; set; }
        }

        public class AddTeamMember
        {
            public string message { get; set; }
            public string id { get; set; }
        }

        public string GetSalesForceId(long consumerId, long peopleId)
        {
            //client.BaseAddress

            try
            {
                if (consumerId != peopleId)
                {
                    ISPDTData isp = new ISPDTData();
                    string sFS = isp.AddFamilyMemberToIndividal(consumerId, peopleId);
                    //long sFId = oispW.AddFamilyMemberToIndividal(consumerId, peopleId);
                    //AddTeamMember[] sfObj = js.Deserialize<AddTeamMember[]>(sFS);
                    //return sfObj[0].id;
                    return sFS;
                }
                else
                {
                    return "";
                }


            }
            catch (Exception ex)
            {

            }

            return "";
        }

        public string GetConsumersSalesForceId(string peopleId)
        {

            try
            {
                long peopId = long.Parse(peopleId);
                ISPDTData ispDT = new ISPDTData();
                string sFId = ispDT.IndividualByOhioDDID(peopId);
                //No sales force id found or id. Auto updates table
                //Last = OISP - Bartee   111
                return sFId;
            }
            catch (Exception ex)
            {

            }

            return "";
        }


        public Locations[] getLocationswithSalesforceId(string token)
        {
            string locations = psdg.getLocationswithSalesforceId(token);
            Locations[] locationsData = js.Deserialize<Locations[]>(locations);
            return locationsData;//test
        }

        public class Locations
        {
            public string ID { get; set; }
            public string Name { get; set; }
        }

        public SigId[] insertPlanTeamMember(string token, string assessmentId, string teamMember, string name, string lastName, string participated, string signature, string contactId, string planYearStart, string planYearEnd, string dissentAreaDisagree, string dissentHowToAddress,
               string csChangeMind, string csChangeMindSSAPeopleId, string csContact, string csContactProviderVendorId, string csContactInput, string csRightsReviewed, string csAgreeToPlan, string csFCOPExplained, string csDueProcess,
               string csResidentialOptions, string csSupportsHealthNeeds, string csTechnology, string buildingNumber, string dateOfBirth, string peopleId, string useExisting, string relationshipImport, string consumerId, string createRelationship, string salesforceId,
               bool hasWetSignature, string description, string attachmentType, string attachment, string section, string questionId, string signatureType, string vendorId, string relationship, string email, string parentOfMinor)
        {
            string signatureIdString = "";
            string signatureId = "";
            string checkExistReturn = "";
            string peopleIdReturn = "";
            string peopId = "";
            string newSalesForceId = "";

            if (vendorId != null)
            {
                signatureIdString = psdg.insertVendor(token, assessmentId, teamMember, name, lastName, participated, signature, contactId, planYearStart, planYearEnd, dissentAreaDisagree, dissentHowToAddress, csChangeMind, csChangeMindSSAPeopleId, csContact,
                                        csContactProviderVendorId, csContactInput, csRightsReviewed, csAgreeToPlan, csFCOPExplained, csDueProcess,
                                    csResidentialOptions, csSupportsHealthNeeds, csTechnology, buildingNumber, dateOfBirth, peopleId, useExisting, relationshipImport, salesforceId, signatureType, vendorId);
                SigId[] sigObj = js.Deserialize<SigId[]>(signatureIdString);
                if (hasWetSignature)
                {
                    pdg.addPlanAttachment(token, long.Parse(assessmentId), description, attachmentType, attachment, section, long.Parse(questionId), sigObj[0].signatureId);
                }
                return sigObj;
            }
            else
            {
                //if(peopleId != "" && createRelationship == "F")
                //{
                //    newSalesForceId = GetSalesForceId(long.Parse(consumerId), long.Parse(peopleId));
                //}

                if (peopleId == "")
                {
                    //MAT readd below two when buildingNumber and DOB are required again
                    //string checkNumber = buildingNumber.Split(' ').First();
                    //checkExistReturn = psdg.checkPeopleExist(name, lastName, checkNumber, dateOfBirth);
                    checkExistReturn = psdg.checkPeopleExist(name, lastName);
                }
                if (checkExistReturn.IndexOf("Does not exist") != -1 && checkExistReturn != "")
                {
                    if (buildingNumber == null) buildingNumber = "";
                    if (dateOfBirth == null) dateOfBirth = "";
                    peopleIdReturn = psdg.newPersonToPeopleTable(token, name, lastName, buildingNumber, dateOfBirth, consumerId);
                    NewPeopleId[] peoObj = js.Deserialize<NewPeopleId[]>(peopleIdReturn);
                    peopleId = peoObj[0].newPeopleId;
                    //newSalesForceId = GetSalesForceId(long.Parse(consumerId), long.Parse(peopId));
                }
                if (checkExistReturn.IndexOf("Does not exist") == -1 && checkExistReturn != "")
                {
                    SigId[] sigObjPeop = new SigId[1];
                    ExistingMember[] existingMemObj = js.Deserialize<ExistingMember[]>(checkExistReturn);
                    sigObjPeop[0] = new SigId();
                    sigObjPeop[0].existingPeopleId = existingMemObj[0].id.ToString();

                    return sigObjPeop;
                }
                if (salesforceId == "")
                {
                //if (teamMember == "Guardian" || teamMember == "Parent/Guardian" || teamMember == "Case Manager")
                //{
                //    // don't make call to Salesforce
                //} else
                //{
                    newSalesForceId = GetSalesForceId(long.Parse(consumerId), long.Parse(peopleId));

                    if (newSalesForceId != null)
                    {
                        salesforceId = newSalesForceId.ToString();
                    }
                    if (salesforceId == "0" || salesforceId == null)
                    {
                        salesforceId = "";
                    }
                //}                
                }
                if (createRelationship == "T")
                {

                    psdg.createRelationship(token, planYearStart, planYearEnd, consumerId, peopleId, newSalesForceId);
                }

                if (buildingNumber == null) buildingNumber = "";
                if (dateOfBirth == null) dateOfBirth = "";
                signatureIdString = psdg.insertPlanTeamMember(token, assessmentId, teamMember, name, lastName, participated, signature, contactId, planYearStart, planYearEnd, dissentAreaDisagree, dissentHowToAddress, csChangeMind, csChangeMindSSAPeopleId, csContact,
                                        csContactProviderVendorId, csContactInput, csRightsReviewed, csAgreeToPlan, csFCOPExplained, csDueProcess,
                                    csResidentialOptions, csSupportsHealthNeeds, csTechnology, buildingNumber, dateOfBirth, peopleId, useExisting, relationshipImport, salesforceId, signatureType, vendorId, relationship, email, parentOfMinor);
                SigId[] sigObj = js.Deserialize<SigId[]>(signatureIdString);
                if (hasWetSignature)
                {
                    pdg.addPlanAttachment(token, long.Parse(assessmentId), description, attachmentType, attachment, section, long.Parse(questionId), sigObj[0].signatureId);
                }
                return sigObj;
            }
        }

        public class NewPeopleId
        {
            public string newPeopleId { get; set; }
        }

        public TeamMemberFromState[] getTeamMemberListFromState(long peopleId)
        {
            try
            {
                ISPDTData ispDT = new ISPDTData();
                string teamMembers = ispDT.IndividualContactsJSON(peopleId);
                //string teamMembers = oispW.GetIndividualContactsJSON(peopleId.ToString());
                TeamMemberFromState[] stateTeamMemberObject = js.Deserialize<TeamMemberFromState[]>(teamMembers);

                return stateTeamMemberObject;
            }
            catch
            {

            }
            return null;
        }

        public TeamMemberFromState[] getStateGuardiansforConsumer(long peopleId)
        {
            try
            {
                ISPDTData ispDT = new ISPDTData();

                string theGuardians = ispDT.IndividualGuardians(peopleId);

                TeamMemberFromState[] stateGuardianObject = js.Deserialize<TeamMemberFromState[]>(theGuardians);

                return stateGuardianObject;
            }
            catch
            {
                
            }
            return null;
        }

        public string getStateCaseManagerforConsumer(long peopleId)
        {
            try
            {
                ISPDTData ispDT = new ISPDTData();

                long caseManagerId = ispDT.GetIndividualCaseManager(peopleId);

                return caseManagerId.ToString();
            }
            catch
            {

            }
            return "";
        }


        public class AssignStateConsumer
        {
            public string id { get; set; }
            public string name { get; set; }
            public string assignresult { get; set; }
        }

        public string assignStateCaseManagertoConsumers(string caseManagerId, PlanSignatureWorker.AssignStateConsumer[] consumers)
        {

            ISPDTData ispDT = new ISPDTData();
            var processedConsumers = new List<PlanSignatureWorker.AssignStateConsumer>();

            foreach (PlanSignatureWorker.AssignStateConsumer consumer in consumers)
            {
                string assignresult = "";
                long lngcaseManagerId = long.Parse(caseManagerId);
                long lngConsumerId = long.Parse(consumer.id);

                assignresult = ispDT.AddCaseMangerToIndividal(lngConsumerId, lngcaseManagerId, "Assigned");

                var processedConsumerobj = new PlanSignatureWorker.AssignStateConsumer();
                processedConsumerobj.name = consumer.name;
                processedConsumerobj.assignresult = assignresult;
                processedConsumers.Add(processedConsumerobj);

            }

            var assignConsumersResult = js.Serialize(processedConsumers);

            // TeamMemberFromState[] stateGuardianObject = js.Deserialize<TeamMemberFromState[]>(theGuardians);

            return assignConsumersResult;

        }

        public void setVendorSalesForceId()
        {
            ISPDTData iSPDT = new ISPDTData();
            string response = iSPDT.PostAllLocalProviders();
        }

        public string setSalesForceIdForTeamMemberUpdate(string peopleId, string salesForceId)
        {
            return psdg.setSalesForceIdForTeamMemberUpdate(peopleId, salesForceId);
        }

        public bool validateConsumerForSalesForceId(string consumerId)
        {
            bool valid = false;
            string validateString = psdg.validateConsumerForSalesForceId(consumerId);
            ValidateReturnObject[] validateObj = js.Deserialize<ValidateReturnObject[]>(validateString);
            if (validateObj[0].salesForceId != "" && validateObj[0].residentNumber != "")
            {
                valid = true;
            }
            else if (validateObj[0].salesForceId == "" && validateObj[0].residentNumber != "")
            {
                //do work to get salesforceid and update record then return true
                string cSFID = GetConsumersSalesForceId(consumerId);
                if (cSFID == "" || cSFID == null)
                {
                    valid = false;
                }
                else if (cSFID.ToUpper().IndexOf("NO SALES") != -1)
                {
                    valid = false;
                }
                else
                {
                    valid = true;
                }

            }
            else
            {
                valid = false;
            }

            return valid;
        }

        public class ConsumerSalesforceId
        {
            public string individualSalesForceId;
        }

        public class ValidateReturnObject
        {
            public string salesForceId { get; set; }
            public string residentNumber { get; set; }
        }

        public class ExistingMember
        {
            public string First_Name { get; set; }
            public string Last_Name { get; set; }
            public string date_Of_Birth { get; set; }
            public string Resident_Address { get; set; }
            public string id { get; set; }
        }


        public class TeamMemberFromState
        {
            public string Id { get; set; }
            public string Role { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string Email { get; set; }
        }

        public string updateTeamMember(string token, string signatureId, string teamMember, string name, string lastName, string participated, string dissentAreaDisagree, string dissentHowToAddress, string signature, string contactId, string peopleId, string buildingNumber, string dateOfBirth, string salesForceId, string consumerId,
                                        bool hasWetSignature, string description, string attachmentType, string attachment, string section, string questionId, string assessmentId, string signatureType, string dateSigned, string vendorId, string clear, string email)
        {
            //Runs this section if we are updating the vendors or facilities -- and not a team member
            if ((vendorId != null && vendorId != "") || (contactId == null || contactId == ""))
            {
                if (buildingNumber == null) buildingNumber = "";
                if (dateOfBirth == null || dateOfBirth == "") dateOfBirth = "";
                if (hasWetSignature)

                {
                    pdg.addPlanAttachment(token, long.Parse(assessmentId), description, attachmentType, attachment, section, long.Parse(questionId), signatureId);
                }
                //if (signature != "")
                //{
                //    dateSigned = DateTime.Now.ToString("yyyy-MM-dd");
                //}

                return psdg.updateVendor(token, signatureId, teamMember, name, lastName, participated, dissentAreaDisagree, dissentHowToAddress, signature, contactId, buildingNumber, dateOfBirth, salesForceId, signatureType, dateSigned, vendorId);
            }
            else
            {
                string newSalesForceId = "";
                if (salesForceId == "" || salesForceId == null)
                {
                    newSalesForceId = GetSalesForceId(long.Parse(consumerId), long.Parse(contactId));
                    if (newSalesForceId != null)
                    {
                        salesForceId = newSalesForceId.ToString();
                    }
                }
                if (buildingNumber == null) buildingNumber = "";
                if (dateOfBirth == null || dateOfBirth == "") dateOfBirth = "";
                if (hasWetSignature)

                {
                    pdg.addPlanAttachment(token, long.Parse(assessmentId), description, attachmentType, attachment, section, long.Parse(questionId), signatureId);
                }
                //if (signature != "")
                //{
                //    dateSigned = DateTime.Now.ToString("yyyy-MM-dd");
                //}

                return psdg.updateTeamMember(token, signatureId, teamMember, name, lastName, participated, dissentAreaDisagree, dissentHowToAddress, signature, contactId, peopleId, buildingNumber, dateOfBirth, salesForceId, signatureType, dateSigned, vendorId, clear, email);
            }


        }
        public string deletePlanSignature(string token, string signatureId)
        {
            return psdg.deletePlanSignature(token, signatureId);
        }
        public string updatePlanSignatureOrder(long assessmentId, long signatureId, int newPos)
        {
            return psdg.updatePlanSignatureOrder(assessmentId, signatureId, newPos);
        }

        public string[] uploadPlanToDODD(string consumerId, string planId)
        {
            string[] UploadFail = { "Upload Failed" };
            try
            {
                ISPDTData ispDT = new ISPDTData();
                string[] result = ispDT.UploadISP(long.Parse(consumerId), long.Parse(planId));
                //No sales force id found or id. Auto updates table
                //Last = OISP - Bartee   111
                return result;
            }
            catch (Exception ex)
            {

            }

            return UploadFail;
        }

        public void carryOverTeamMembersToNewPlan(string consumerPlanId, string priorConsumerPlanId, string token)
        {
            long priorPlanId = long.Parse(priorConsumerPlanId);
            long newPlanId = long.Parse(consumerPlanId);
            // MAIN CONTACT INFORMATION
            string signatureString = psdg.getSignatures(token, priorPlanId);
            PlanSignatures[] signatureObj = js.Deserialize<PlanSignatures[]>(signatureString);

            for (int i = 0; i < signatureObj.Length; i++)
            {
                var idTest = signatureObj[i].peopleId;
                if (idTest != null && idTest != "")
                {
                    psdg.insertPlanTeamMember(token, newPlanId.ToString(), signatureObj[i].teamMember, signatureObj[i].name, signatureObj[i].lastName, "", "", signatureObj[i].contactId, signatureObj[i].planYearStart, signatureObj[i].planYearEnd, "", "", "", signatureObj[i].csChangeMindSSAPeopleId,
                                            "", signatureObj[i].csContactProviderVendorId, signatureObj[i].csContactInput, "", "", "",
                                            "", "", "", "", signatureObj[i].buildingNumber,
                                            signatureObj[i].dateOfBirth, signatureObj[i].peopleId, signatureObj[i].useExisting, signatureObj[i].relationshipImport, signatureObj[i].salesForceId, signatureObj[i].signatureType, signatureObj[i].vendorId, signatureObj[i].relationship, signatureObj[i].email, signatureObj[i].parentOfMinor);
                    //psdg.insertPlanTeamMember(token, newPlanId.ToString(), signatureObj[i].teamMember, signatureObj[i].name, signatureObj[i].lastName, "", "", signatureObj[i].contactId, signatureObj[i].planYearStart, signatureObj[i].planYearEnd, "", "", signatureObj[i].csChangeMind, signatureObj[i].csChangeMindSSAPeopleId,
                    //                        signatureObj[i].csContact, signatureObj[i].csContactProviderVendorId, signatureObj[i].csContactInput, signatureObj[i].csRightsReviewed, signatureObj[i].csAgreeToPlan, signatureObj[i].csFCOPExplained,
                    //                        signatureObj[i].csDueProcess, signatureObj[i].csResidentialOptions, signatureObj[i].csSupportsHealthNeeds, signatureObj[i].csTechnology, signatureObj[i].buildingNumber,
                    //                        signatureObj[i].dateOfBirth, signatureObj[i].peopleId, signatureObj[i].useExisting, signatureObj[i].relationshipImport, signatureObj[i].salesForceId, signatureObj[i].signatureType, signatureObj[i].vendorId, signatureObj[i].relationship);
                }

            }

        }

    }
}