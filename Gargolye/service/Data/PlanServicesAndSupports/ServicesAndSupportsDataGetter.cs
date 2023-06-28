using Anywhere.Log;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Odbc;
using System.Linq;
using System.Web.Script.Serialization;

namespace Anywhere.service.Data.PlanServicesAndSupports
{
    public class ServicesAndSupportsDataGetter
    {
        private static Loger logger = new Loger();
        private string connectString = ConfigurationManager.ConnectionStrings["connection"].ToString();

        public string updateProfessionalReferral(string token, long professionalReferralId, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteProfessionalReferral ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(professionalReferralId.ToString());
            list.Add(anywAssessmentId.ToString());
            list.Add(assessmentAreaId.ToString());
            list.Add(newOrExisting.ToString());
            list.Add(whoSupports);
            list.Add(reasonForReferral);
             
            string text = "CALL DBA.ANYW_ISP_UpdateProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1SSDG", ex.Message + "ANYW_ISP_UpdateProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1SSDG: error ANYW_ISP_UpdateProfessionalReferral";
            }
        }

        public string insertProfessionalReferral(string token, long anywAssessmentId, int assessmentAreaId, char newOrExisting, string whoSupports, string reasonForReferral, int rowOrder)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteProfessionalReferral ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(assessmentAreaId.ToString());
            list.Add(newOrExisting.ToString());
            list.Add(whoSupports);
            list.Add(reasonForReferral);
            list.Add(rowOrder.ToString());
            
            string text = "CALL DBA.ANYW_ISP_InsertProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1SSDG", ex.Message + "ANYW_ISP_InsertProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1SSDG: error ANYW_ISP_InsertProfessionalReferral";
            }
        }

        public string getProfessionalReferral(string token, long anywAssessmentId, int targetAssessmentVersionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getProfessionalReferral ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(targetAssessmentVersionId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1SSDG", ex.Message + "ANYW_ISP_GetProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1SSDG: error ANYW_ISP_GetProfessionalReferral";
            }
        }


        public string getPreviousPlanEnd(string anywAssessmentId, string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getPreviousPlanEnd ");
            List<string> list = new List<string>();
            list.Add(anywAssessmentId);
            string text = "CALL DBA.ANYW_ISP_GetPreviousPlanEnd(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1SSDG", ex.Message + "ANYW_ISP_GetPreviousPlanEnd(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1SSDG: error ANYW_ISP_GetPreviousPlanEnd";
            }
        }

        public string deleteProfessionalReferral(string token, long professionalReferralId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteProfessionalReferral ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(professionalReferralId.ToString());
            string text = "CALL DBA.ANYW_ISP_DeleteProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("1SSDG", ex.Message + "ANYW_ISP_DeleteProfessionalReferral(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "1SSDG: error ANYW_ISP_DeleteProfessionalReferral";
            }
        }

        public string updateAdditionalSupports(string token, long additionalSupportsId, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertAdditionalSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(additionalSupportsId.ToString());
            list.Add(anywAssessmentId.ToString());
            list.Add(assessmentAreaId.ToString());
            list.Add(whoSupports);
            list.Add(whatSupportLooksLike);
            list.Add(howOftenValue);
            list.Add(howOftenFrequency.ToString());
            list.Add(howOftenText);
            string text = "CALL DBA.ANYW_ISP_UpdateAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2SSDG", ex.Message + "ANYW_ISP_UpdateAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2SSDG: error ANYW_ISP_UpdateAdditionalSupports";
            }
        }

        public string insertAdditionalSupports(string token, long anywAssessmentId, int assessmentAreaId, string whoSupports, string whatSupportLooksLike, string howOftenValue, int howOftenFrequency, string howOftenText, int rowOrder)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertAdditionalSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(assessmentAreaId.ToString());
            list.Add(whoSupports);
            list.Add(whatSupportLooksLike);
            list.Add(howOftenValue);
            list.Add(howOftenFrequency.ToString());
            list.Add(howOftenText);
            list.Add(rowOrder.ToString());
            string text = "CALL DBA.ANYW_ISP_InsertAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2SSDG", ex.Message + "ANYW_ISP_InsertAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2SSDG: error ANYW_ISP_InsertAdditionalSupports";
            }
        }

        public string getAdditionalSupports(string token, long anywAssessmentId, int targetAssessmentVersionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAdditionalSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(targetAssessmentVersionId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2SSDG", ex.Message + "ANYW_ISP_GetAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2SSDG: error ANYW_ISP_GetAdditionalSupports";
            }
        }

        public string getPlanTableFields(string token, string consumerPlanId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAdditionalSupports ");
            List<string> list = new List<string>();
            list.Add(consumerPlanId);
            string text = "CALL DBA.ANYW_ISP_GetPlanTableFields(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3SSDG", ex.Message + "ANYW_ISP_GetPlanTableFields(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3SSDG: error ANYW_ISP_GetPlanTableFields";
            }
        }

        public string updatePlanTableFields(string token, string consumerPlanId, string bestWayToConnect, string moreDetail, string pathToEmployment)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getAdditionalSupports ");
            List<string> list = new List<string>();
            list.Add(consumerPlanId);
            list.Add(bestWayToConnect);
            list.Add(moreDetail);
            list.Add(pathToEmployment);
            string text = "CALL DBA.ANYW_ISP_UpdatePlanTableFields(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3SSDG", ex.Message + "ANYW_ISP_UpdatePlanTableFields(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3SSDG: error ANYW_ISP_UpdatePlanTableFields";
            }
        }

        public string deleteAdditionalSupports(string token, long additionalSupportsId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteAdditionalSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(additionalSupportsId.ToString());
            string text = "CALL DBA.ANYW_ISP_DeleteAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2SSDG", ex.Message + "ANYW_ISP_DeleteAdditionalSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2SSDG: error ANYW_ISP_DeleteAdditionalSupports";
            }
        }

        public string updateSSModifications(string token, long modificationsId, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertSSModifications ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(modificationsId.ToString());
            list.Add(anywAssessmentId.ToString());
            list.Add(medicalRate.ToString());
            list.Add(behaviorRate.ToString());
            list.Add(icfRate.ToString());
            list.Add(complexRate.ToString());
            list.Add(developmentalRate.ToString());
            list.Add(childIntensiveRate.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2SSDG", ex.Message + "ANYW_ISP_UpdateSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2SSDG: error ANYW_ISP_UpdateSSModifications";
            }
        }

        public string insertSSModifications(string token, long anywAssessmentId, char medicalRate, char behaviorRate, char icfRate, char complexRate, char developmentalRate, char childIntensiveRate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertSSModifications ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(medicalRate.ToString());
            list.Add(behaviorRate.ToString());
            list.Add(icfRate.ToString());
            list.Add(complexRate.ToString());
            list.Add(developmentalRate.ToString());
            list.Add(childIntensiveRate.ToString());
            string text = "CALL DBA.ANYW_ISP_InsertSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("2SSDG", ex.Message + "ANYW_ISP_InsertSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "2SSDG: error ANYW_ISP_InsertSSModifications";
            }
        }

        public string getSSModifications(string token, long anywAssessmentId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getSSModifications ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3SSDG", ex.Message + "ANYW_ISP_GetSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3SSDG: error ANYW_ISP_GetSSModifications";
            }
        }

        public string deleteSSModifications(string token, long modificationsId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deleteSSModifications ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(modificationsId.ToString());
            string text = "CALL DBA.ANYW_ISP_DeleteSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("3SSDG", ex.Message + "ANYW_ISP_DeleteSSModifications(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "3SSDG: error ANYW_ISP_DeleteSSModifications";
            }
        }

        public string updatePaidSupports(string token, long paidSupportsId, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, string serviceNameOther)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPaidSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(paidSupportsId.ToString());
            list.Add(anywAssessmentId.ToString());
            list.Add(providerId);
            list.Add(assessmentAreaId.ToString());
            list.Add(serviceNameId.ToString());
            list.Add(scopeOfService);
            list.Add(howOftenValue);
            list.Add(howOftenFrequency.ToString());
            list.Add(howOftenText);
            list.Add(beginDate);
            list.Add(endDate);
            list.Add(fundingSource.ToString());
            list.Add(fundingSourceText);
            list.Add(serviceNameOther);
            string text = "CALL DBA.ANYW_ISP_UpdatePaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4SSDG", ex.Message + "ANYW_ISP_UpdatePaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4SSDG: error ANYW_ISP_UpdatePaidSupports";
            }
        }

        public string updateMultiPaidSupports(string token, string paidSupportsId, string providerId, string beginDate, string endDate)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertMultiPaidSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(paidSupportsId.ToString());
            list.Add(providerId);
            list.Add(beginDate);
            list.Add(endDate);
            string text = "CALL DBA.ANYW_ISP_UpdateMultiPaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4SSDG", ex.Message + "ANYW_ISP_UpdateMultiPaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4SSDG: error ANYW_ISP_UpdateMultiPaidSupports";
            }
        }

        public string insertPaidSupports(string token, long anywAssessmentId, string providerId, int assessmentAreaId, int serviceNameId, string scopeOfService, string howOftenValue, int howOftenFrequency, string howOftenText, string beginDate, string endDate, int fundingSource, string fundingSourceText, int rowOrder, string serviceNameOther)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("insertPaidSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(providerId);
            list.Add(assessmentAreaId.ToString());
            list.Add(serviceNameId.ToString());
            list.Add(scopeOfService);
            list.Add(howOftenValue);
            list.Add(howOftenFrequency.ToString());
            list.Add(howOftenText);
            list.Add(beginDate);
            list.Add(endDate);
            list.Add(fundingSource.ToString());
            list.Add(fundingSourceText);
            list.Add(rowOrder.ToString());
            list.Add(serviceNameOther);
            string text = "CALL DBA.ANYW_ISP_InsertPaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", removeUnsavableNoteText(x))).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4SSDG", ex.Message + "ANYW_ISP_InsertPaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4SSDG: error ANYW_ISP_InsertPaidSupports";
            }
        }

        public string getPaidSupports(string token, long anywAssessmentId, int targetAssessmentVersionId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePaidSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(anywAssessmentId.ToString());
            list.Add(targetAssessmentVersionId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetPaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4SSDG", ex.Message + "ANYW_ISP_GetPaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4SSDG: error ANYW_ISP_GetPaidSupports";
            }
        }

        public string deletePaidSupports(string token, long paidSupportsId)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("deletePaidSupports ");
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(paidSupportsId.ToString());
            string text = "CALL DBA.ANYW_ISP_DeletePaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4SSDG", ex.Message + "ANYW_ISP_DeletePaidSupports(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4SSDG: error ANYW_ISP_DeletePaidSupports";
            }
        }

        public string getCommunicationOptions(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetCommunicationOptions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("11ADG", ex.Message + "ANYW_ISP_GetCommunicationOptions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "11ADG: error ANYW_ISP_GetCommunicationOptions";
            }
        }

        public string getEmploymentOptions(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetEmploymentOptions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("11ADG", ex.Message + "ANYW_ISP_GetEmploymentOptions(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "11ADG: error ANYW_ISP_GetEmploymentOptions";
            }
        }

        public string getLevelsOfSupervision(string token)
        {
            if (tokenValidator(token) == false) return null;
            logger.debug("getServiceTypes ");
            List<string> list = new List<string>();
            list.Add(token);
            string text = "CALL DBA.ANYW_ISP_GetLevelsOfSupervision(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("11ADG", ex.Message + "ANYW_ISP_GetLevelsOfSupervision(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "11ADG: error ANYW_ISP_GetLevelsOfSupervision";
            }
        }

        public string updatePaidSupportsRowOrder(string token, long assessmentId, long supportId, int newPos, int oldPos)
        {

            logger.debug("updatePaidSupportsRowOrder ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            list.Add(supportId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdatePaidSupportRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdatePaidSupportRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdatePaidSupportRowOrder";
            }
        }

        public string updateModificationRowOrder(string token, long assessmentId, long modificationId, int newPos, int oldPos)
        {

            logger.debug("updateModificationRowOrder ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            list.Add(modificationId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateModificationRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdateModificationRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdateModificationRowOrder";
            }
        }

        public string updateServiceReferralRowOrder(string token, long assessmentId, long referralId, int newPos, int oldPos)
        {

            logger.debug("updateServiceReferralRowOrder ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            list.Add(referralId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateServicesReferralRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdateServicesReferralRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdateServicesReferralRowOrder";
            }
        }

        public string updateAdditionalSupportsRowOrder(string token, long assessmentId, long addSupportId, int newPos, int oldPos)
        {

            logger.debug("updateAdditionalSupportsRowOrder ");
            if (tokenValidator(token) == false) return null;
            List<string> list = new List<string>();
            list.Add(token);
            list.Add(assessmentId.ToString());
            list.Add(addSupportId.ToString());
            list.Add(newPos.ToString());
            list.Add(oldPos.ToString());
            string text = "CALL DBA.ANYW_ISP_UpdateAdditionalSupportsRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("5PODG", ex.Message + "ANYW_ISP_UpdateAdditionalSupportsRowOrder(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "5APODG: error ANYW_ISP_UpdateAdditionalSupportsRowOrder";
            }
        }

        public string getExperienceRelationships(int consumerId)
        {
            logger.debug("deletePaidSupports ");
            List<string> list = new List<string>();
            list.Add(consumerId.ToString());
            string text = "CALL DBA.ANYW_ISP_GetRelationshipsForExperiences(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")";
            try
            {
                return executeDataBaseCallJSON(text);
            }
            catch (Exception ex)
            {
                logger.error("4SSDG", ex.Message + "ANYW_ISP_GetRelationshipsForExperiences(" + string.Join(",", list.Select(x => string.Format("'{0}'", x)).ToList()) + ")");
                return "4SSDG: error ANYW_ISP_GetRelationshipsForExperiences";
            }
        }
        public string removeUnsavableNoteText(string note)
        {
            if (note == "" || note is null)
            {
                return note;
            }
            if (note.Contains("'"))
            {
                note = note.Replace("'", "''");
            }
            if (note.Contains("\\"))
            {
                note = note.Replace("\\", "");
            }
            //if (note.Contains("\""))
            //{
            //    note = note.Replace("\"", "\"");
            //}
            return note;
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

        public bool stringInjectionValidator(string uncheckedString)
        {
            string waitFor = "WAITFOR DELAY";
            string dropTable = "DROP TABLE";
            string deleteFrom = "DELETE FROM";
            if (uncheckedString.ToUpper().Contains(waitFor) || uncheckedString.ToUpper().Contains(dropTable) || uncheckedString.ToUpper().Contains(deleteFrom))
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
    }
}